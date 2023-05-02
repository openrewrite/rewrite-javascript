/*
 * Copyright 2023 the original author or authors.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * https://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.openrewrite.javascript.internal;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.interception.logging.JavetStandardConsoleInterceptor;
import com.caoccao.javet.interop.V8Host;
import com.caoccao.javet.interop.V8Runtime;
import com.caoccao.javet.interop.callback.JavetCallbackContext;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.primitive.V8ValueBoolean;
import com.caoccao.javet.values.primitive.V8ValueInteger;
import com.caoccao.javet.values.primitive.V8ValueString;
import com.caoccao.javet.values.primitive.V8ValueUndefined;
import com.caoccao.javet.values.reference.*;
import org.openrewrite.IOUtils;
import org.openrewrite.internal.lang.Nullable;

import java.io.*;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.function.Function;

public interface TSC {

    static String getJSEntryProgramText() {
        try (InputStream is = TSC.class.getClassLoader().getResourceAsStream("index.js")) {
            if (is == null) throw new IllegalStateException("entry JS resource does not exist");
            return IOUtils.readFully(is, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    class Runtime implements Closeable {
        public final V8Runtime v8Runtime;

        @Nullable
        public V8ValueFunction tsParse = null;

        private final JavetStandardConsoleInterceptor javetStandardConsoleInterceptor;

        public static Runtime init() {
            try {
                V8Runtime v8Runtime = V8Host.getV8Instance().createV8Runtime();
                JavetStandardConsoleInterceptor javetStandardConsoleInterceptor = new JavetStandardConsoleInterceptor(v8Runtime);
                javetStandardConsoleInterceptor.register(v8Runtime.getGlobalObject());
                return new Runtime(v8Runtime, javetStandardConsoleInterceptor);
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public Runtime(V8Runtime v8Runtime, JavetStandardConsoleInterceptor javetStandardConsoleInterceptor) {
            this.v8Runtime = v8Runtime;
            this.javetStandardConsoleInterceptor = javetStandardConsoleInterceptor;
        }

        public void importTS() {
            if (tsParse != null) {
                return;
            }
            try {
                v8Runtime.getExecutor("const require = () => undefined;").executeVoid();
                v8Runtime.getExecutor("const module = {exports: {}};").executeVoid();
                v8Runtime.getExecutor(getJSEntryProgramText()).executeVoid();
                this.tsParse = v8Runtime.getExecutor("module.exports.default").execute();
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public void parseSourceTexts(Map<String, String> sourceTexts, BiConsumer<Node, SourceFileContext> callback) {
            importTS();
            assert tsParse != null;
            try (V8ValueMap sourceTextsV8 = v8Runtime.createV8ValueMap()) {
                for (Map.Entry<String, String> entry : sourceTexts.entrySet()) {
                    sourceTextsV8.set(entry.getKey(), entry.getValue());
                }
                try (
                        V8ValueObject parseResultV8 = tsParse.call(null, sourceTextsV8);
                        ProgramContext programContext = ProgramContext.fromJS(parseResultV8);
                        V8ValueArray sourceFilesV8 = parseResultV8.get("sourceFiles")
                ) {
                    sourceFilesV8.forEach((sourceFileV8) -> {
                        String sourceText = ((V8ValueObject) sourceFileV8).invokeString("getText");
                        try (SourceFileContext sourceFileContext = new SourceFileContext(programContext, sourceText)) {
                            TSC.Node node = programContext.tscNode((V8ValueObject) sourceFileV8);
                            callback.accept(node, sourceFileContext);
                        }
                    });
                }
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        @Override
        public void close() {
            try {
                this.tsParse.close();
            } catch (JavetException e) {
            }

            if (!v8Runtime.isClosed()) {
                v8Runtime.await();
                v8Runtime.lowMemoryNotification();

                try {
                    javetStandardConsoleInterceptor.unregister(v8Runtime.getGlobalObject());
                } catch (JavetException ignored) {
                }
                v8Runtime.await();
                v8Runtime.lowMemoryNotification();
            }
            try {
                v8Runtime.close();
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }
    }

    interface ContextCallback {
        V8Value apply(V8Value... args);
    }

    class Meta {
        private final Map<String, Integer> syntaxKindsByName = new HashMap<>();
        private final Map<Integer, String> syntaxKindsByCode = new HashMap<>();

        public static Meta fromJS(V8ValueObject metaV8) throws JavetException {
            try {
                Meta result = new Meta();

                try (V8Value syntaxKinds = metaV8.get("syntaxKinds")) {
                    if (!(syntaxKinds instanceof V8ValueMap)) {
                        throw new IllegalArgumentException("expected syntaxKinds to be a Map");
                    }

                    ((V8ValueMap) syntaxKinds).forEach((V8Value keyV8, V8Value valueV8) -> {
                        if (keyV8 instanceof V8ValueString && valueV8 instanceof V8ValueInteger) {
                            int code = ((V8ValueInteger) valueV8).getValue();
                            String name = ((V8ValueString) keyV8).getValue();
                            result.syntaxKindsByCode.put(code, name);
                            result.syntaxKindsByName.put(name, code);
                        }
                    });
                }

                return result;
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public int syntaxKindCode(String name) {
            return this.syntaxKindsByName.get(name);
        }

        public String syntaxKindName(int code) {
            return this.syntaxKindsByCode.get(code);
        }
    }

    class ProgramContext implements Closeable {
        private static final Method CONTEXT_CALLBACK_APPLY_METHOD;

        static {
            try {
                CONTEXT_CALLBACK_APPLY_METHOD = ContextCallback.class.getDeclaredMethod("apply", V8Value[].class);
            } catch (NoSuchMethodException e) {
                throw new RuntimeException(e);
            }
        }


        private final V8Runtime runtime;
        private final Meta metadata;
        private final V8ValueObject program;
        private final V8ValueObject typeChecker;
        private final V8ValueFunction createScanner;
        private final V8ValueFunction getNodeId;
        private final Map<Long, Node> nodeCache = new HashMap<>();
        private final Map<Long, Type> typeCache = new HashMap<>();

        public ProgramContext(V8Runtime runtime, Meta metadata, V8ValueObject program, V8ValueObject typeChecker, V8ValueFunction createScanner, V8ValueFunction getNodeId) {
            this.runtime = runtime;
            this.metadata = metadata;
            this.program = program;
            this.typeChecker = typeChecker;
            this.createScanner = createScanner;
            this.getNodeId = getNodeId;
        }

        public static ProgramContext fromJS(V8ValueObject contextV8) {
            try (V8ValueObject metaV8Object = contextV8.get("meta")) {
                Meta metadata = Meta.fromJS(metaV8Object);

                V8ValueObject program = contextV8.get("program");
                V8ValueObject typeChecker = contextV8.get("typeChecker");
                V8ValueFunction createScanner = contextV8.get("createScanner");
                V8ValueFunction getNodeId = contextV8.get("getNodeId");

                return new ProgramContext(contextV8.getV8Runtime(), metadata, program, typeChecker, createScanner, getNodeId);
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public Type tscType(V8ValueObject v8Value) {
            final long typeId;
            try {
                Number tmp = v8Value.getPrimitive("id");
                typeId = tmp.longValue();
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }

            Type type = this.typeCache.computeIfAbsent(typeId, (_handle) -> new Type(this, v8Value));
            if (type.typeV8 != v8Value) {
                try {
                    v8Value.setWeak();
                } catch (JavetException e) {
                }
            }

            return type;
        }

        public Node tscNode(V8ValueObject v8Value) {
            final long nodeId;
            try {
                nodeId = this.getNodeId.callLong(null, v8Value);
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }

            Node node = this.nodeCache.computeIfAbsent(nodeId, (_handle) -> new Node(this, v8Value));
            if (node.nodeV8 != v8Value) {
                try {
                    v8Value.setWeak();
                } catch (JavetException e) {
                }
            }
            return node;
        }

        public V8ValueFunction asJSFunction(ContextCallback func) {
            JavetCallbackContext callbackContext = new JavetCallbackContext(func, CONTEXT_CALLBACK_APPLY_METHOD);
            try {
                return this.runtime.createV8ValueFunction(callbackContext);
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public V8ValueFunction asJSFunction(Function<? super V8Value, ? extends V8Value> func) {
            ContextCallback callback = (V8Value[] args) -> func.apply(args[0]);
            return asJSFunction(callback);
        }

        public V8ValueFunction asJSFunction(Consumer<? super V8Value> func) {
            ContextCallback callback = (V8Value[] args) -> {
                func.accept(args[0]);
                return runtime.createV8ValueUndefined();
            };
            return asJSFunction(callback);
        }

        @Override
        public void close() {
            try {
                program.close();
            } catch (JavetException e) {
            }
            try {
                typeChecker.close();
            } catch (JavetException e) {
            }
            try {
                createScanner.close();
            } catch (JavetException e) {
            }
            try {
                getNodeId.close();
            } catch (JavetException e) {
            }

            this.nodeCache.values().forEach(node -> {
                try {
                    node.nodeV8.close();
                } catch (JavetException e) {
                }
            });
            this.typeCache.values().forEach(type -> {
                try {
                    type.typeV8.close();
                } catch (JavetException e) {
                }
            });
        }
    }

    class SourceFileContext implements Closeable {
        private final ProgramContext programContext;
        private final V8ValueObject scanner;

        private SourceFileContext(ProgramContext programContext, String sourceText) {
            this.programContext = programContext;
            try {
                this.scanner = programContext.createScanner.call(null);
                this.scanner.invokeVoid("setText", sourceText);
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
            resetScanner(0);
        }

        public Integer scannerTokenStart() {
            try {
                return this.scanner.invokeInteger("getTokenPos");
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public Integer scannerTokenEnd() {
            try {
                return this.scanner.invokeInteger("getTextPos");
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public String scannerTokenText() {
            try {
                return this.scanner.invokeString("getTokenText");
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public void resetScanner(int offset) {
            try {
                this.scanner.invokeVoid("setTextPos", offset);
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public TSCSyntaxKind nextScannerSyntaxType() {
            try {
                final int code = this.scanner.invokeInteger("scan");
                final String name = programContext.metadata.syntaxKindName(code);
                return TSCSyntaxKind.fromJS(name);
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        @Override
        public void close() {
            try {
                this.scanner.close();
            } catch (JavetException e) {
            }
        }
    }

    class Type {
        private final ProgramContext programContext;
        private final V8ValueObject typeV8;

        public Type(ProgramContext programContext, V8ValueObject typeV8) {
            this.programContext = programContext;
            this.typeV8 = typeV8;
        }

        public Number getTypeId() {
            try {
                return this.typeV8.getPrimitive("id");
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }
    }

    class Node {
        private final ProgramContext programContext;
        private final V8ValueObject nodeV8;

        public Node(ProgramContext programContext, V8ValueObject nodeV8) {
            this.programContext = programContext;
            this.nodeV8 = nodeV8;
        }

        public int syntaxKindCode() {
            try {
                return nodeV8.getInteger("kind");
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public String syntaxKindName() {
            return programContext.metadata.syntaxKindName(this.syntaxKindCode());
        }

        public TSCSyntaxKind syntaxKind() {
            return TSCSyntaxKind.fromJS(syntaxKindName());
        }

        public Type getTypeAtNodeLocation() {
            try {
                V8ValueObject type = this.programContext.typeChecker.invoke("getTypeAtLocation");
                if (type == null) {
                    return null;
                } else {
                    return this.programContext.tscType(type);
                }
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public int getStart() {
            try {
                return this.nodeV8.getPropertyInteger("pos");
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public int getEnd() {
            try {
                return this.nodeV8.getPropertyInteger("end");
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public int getChildCount() {
            try {
                return this.nodeV8.invokeInteger("getChildCount");
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public @Nullable Node getChildNode(String name) {
            try {
                V8ValueObject child = this.nodeV8.getProperty(name);
                if (child == null) {
                    return null;
                }
                return programContext.tscNode(child);
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public Node getChildNodeRequired(String name) {
            Node child = this.getChildNode(name);
            if (child == null) {
                throw new IllegalArgumentException("property " + name + " is not required");
            }
            return child;
        }

        public List<Node> getChildNodes(String name) {
            try (V8ValueArray children = this.nodeV8.getProperty(name)) {
                final int childCount = children.getLength();
                List<Node> result = new ArrayList<>(childCount);
                for (int i = 0; i < childCount; i++) {
                    result.add(programContext.tscNode(children.get(i)));
                }
                return result;
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public boolean getBooleanPropertyValue(String propertyName) {
            V8Value val;
            try {
                val = this.nodeV8.getProperty(propertyName);
            } catch (JavetException ignored) {
                throw new IllegalStateException(String.format("Property <%s> does not exist on syntaxKind %s", propertyName, this.syntaxKind()));
            }

            boolean propertyValue = false;
            if (val instanceof V8ValueBoolean) {
                propertyValue = ((V8ValueBoolean) val).getValue();
            } else {
                throw new IllegalStateException(String.format("Property <%s> is not a boolean type.", propertyName));
            }
            return propertyValue;
        }

        public String getStringPropertyValue(String propertyName) {
            V8Value val;
            try {
                val = this.nodeV8.getProperty(propertyName);
            } catch (JavetException ignored) {
                throw new IllegalStateException(String.format("Property <%s> does not exist on syntaxKind %s", propertyName, this.syntaxKind()));
            }

            String propertyValue = "";
            if (val instanceof V8ValueString) {
                propertyValue = ((V8ValueString) val).getValue();
            } else {
                throw new IllegalStateException(String.format("Property <%s> is not a boolean type.", propertyName));
            }
            return propertyValue;
        }

        public boolean hasProperty(String propertyName) {
            boolean isFound = false;
            try {
                isFound = !(this.nodeV8.getProperty(propertyName) instanceof V8ValueUndefined);
            } catch (JavetException ignored) {
            }
            return isFound;
        }

        public String getText() {
            try {
                return this.nodeV8.invokeString("getText");
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public <T> List<T> collectChildNodes(String name, Function<Node, @Nullable T> fn) {
            List<T> results = new ArrayList<>();
            for (Node child : this.getChildNodes(name)) {
                @Nullable T result = fn.apply(child);
                if (result != null) {
                    results.add(result);
                }
            }
            return results;
        }

        public <T> List<T> mapChildNodes(String name, Function<Node, @Nullable T> fn) {
            List<T> results = new ArrayList<>();
            for (Node child : this.getChildNodes(name)) {
                results.add(fn.apply(child));
            }
            return results;
        }

        public void forEachChild(Consumer<Node> callback) {
            Consumer<V8Value> v8Callback = v8Value -> callback.accept(programContext.tscNode((V8ValueObject) v8Value));
            try (V8Value v8Function = programContext.asJSFunction(v8Callback)) {
                this.nodeV8.invoke("forEachChild", v8Function);
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }

        public void printTree(PrintStream ps) {
            printTree(ps, "");
        }

        // FIXME: Remove. Temporary method to view object
        public V8ValueObject getObject() {
            return nodeV8;
        }


        // FIXME: Remove. Temporary method to view context
        public ProgramContext getContext() {
            return this.programContext;
        }

        public List<String> getOwnPropertyNames() {
            try {
                return this.nodeV8.getOwnPropertyNames().getOwnPropertyNameStrings();
            } catch (JavetException ex) {
                throw new RuntimeException(ex);
            }
        }

        public List<String> getPropertyNames() {
            try {
                return this.nodeV8.getPropertyNames().getOwnPropertyNameStrings();
            } catch (JavetException ex) {
                throw new RuntimeException(ex);
            }
        }

        private void printTree(PrintStream ps, String indent) {
            ps.print(indent);
            ps.print(syntaxKindName());
            if (syntaxKindName().contains("Literal")) {
                ps.print(" (" + this.getText() + ")");
            }
            ps.println();

            String childIndent = indent + "  ";
            forEachChild(child -> {
                child.printTree(ps, childIndent);
            });

        }
    }

}
