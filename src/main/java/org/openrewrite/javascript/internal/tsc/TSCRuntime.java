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
package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.interception.logging.JavetStandardConsoleInterceptor;
import com.caoccao.javet.interop.JavetBridge;
import com.caoccao.javet.interop.V8Host;
import com.caoccao.javet.interop.V8Runtime;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.primitive.V8ValueString;
import com.caoccao.javet.values.reference.V8ValueFunction;
import com.caoccao.javet.values.reference.V8ValueMap;
import com.caoccao.javet.values.reference.V8ValueObject;
import org.intellij.lang.annotations.Language;
import org.jspecify.annotations.Nullable;
import org.openrewrite.DebugOnly;
import org.openrewrite.javascript.internal.JavetUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Map;
import java.util.function.BiConsumer;

import static org.openrewrite.internal.StringUtils.readFully;

public class TSCRuntime implements AutoCloseable {
    /**
     * Manually enable this when tracking down reference-counting issues.
     * <br/>
     * This causes tests to fail if references are not recycled, and will
     * attribute dangling references to the call site that created them.
     */
    private final static boolean USE_WRAPPED_V8_RUNTIME = false;

    public final V8Runtime v8Runtime;

    @Nullable
    public V8ValueFunction tsParseV8 = null;

    private final V8ValueObject parseOptionsV8;

    private final JavetStandardConsoleInterceptor javetStandardConsoleInterceptor;

    public static TSCRuntime init() {
        return init(false);
    }

    public static TSCRuntime init(boolean forceWrappedV8Runtime) {
        try {
            V8Runtime v8Runtime = (forceWrappedV8Runtime || USE_WRAPPED_V8_RUNTIME)
                    ? JavetBridge.makeWrappedV8Runtime()
                    : V8Host.getV8Instance().createV8Runtime();
            JavetStandardConsoleInterceptor javetStandardConsoleInterceptor = new JavetStandardConsoleInterceptor(v8Runtime);
            javetStandardConsoleInterceptor.register(v8Runtime.getGlobalObject());
            return new TSCRuntime(v8Runtime, javetStandardConsoleInterceptor);
        } catch (
                JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public TSCRuntime setCompilerOptionOverride(String key, Object value) {
        try {
            this.close();
            TSCRuntime runtime = init(false);
            V8Value compilerOptions = runtime.parseOptionsV8.get("compilerOptions");
            if (compilerOptions.isNullOrUndefined()) {
                compilerOptions = runtime.v8Runtime.createV8ValueObject();
                runtime.parseOptionsV8.set("compilerOptions", compilerOptions);
            }
            ((V8ValueObject) compilerOptions).setWeak();
            ((V8ValueObject) compilerOptions).set(key, value);
            return runtime;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public TSCRuntime enableVirtualFileSystemTracing() {
        try {
            this.parseOptionsV8.set("traceVirtualFileSystem", true);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
        return this;
    }

    public TSCRuntime(V8Runtime v8Runtime, JavetStandardConsoleInterceptor javetStandardConsoleInterceptor) {
        this.v8Runtime = v8Runtime;
        this.javetStandardConsoleInterceptor = javetStandardConsoleInterceptor;
        try {
            this.parseOptionsV8 = v8Runtime.createV8ValueObject();
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    private static String getJSEntryProgramText() {
        try (InputStream is = TSCRuntime.class.getResourceAsStream("/tsc/index.js")) {
            if (is == null) {
                throw new IllegalStateException("entry JS resource does not exist");
            }
            return readFully(is, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void importTS() {
        if (tsParseV8 != null) {
            return;
        }
        try {
            v8Runtime.getExecutor("const require = () => undefined;").executeVoid();
            v8Runtime.getExecutor("const module = {exports: {}};").executeVoid();
            v8Runtime.getExecutor(getJSEntryProgramText()).executeVoid();
            this.tsParseV8 = v8Runtime.getExecutor("module.exports.default").execute();
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    @DebugOnly
    public void parseSingleSource(@Language("typescript") String sourceText, BiConsumer<TSCNode, TSCSourceFileContext> callback) {
        parseSingleSource(sourceText, "file.ts", callback);
    }

    public void parseSingleSource(@Language("typescript") String sourceText, String filename, BiConsumer<TSCNode, TSCSourceFileContext> callback) {
        parseSourceTexts(Collections.singletonMap(Paths.get(filename), sourceText), callback);
    }

    public void parseSourceTexts(Map<Path, String> sourceTexts, BiConsumer<TSCNode, TSCSourceFileContext> callback) {
        importTS();
        assert tsParseV8 != null;
        try (V8ValueMap sourceTextsV8 = v8Runtime.createV8ValueMap()) {
            for (Map.Entry<Path, String> entry : sourceTexts.entrySet()) {
                sourceTextsV8.set(entry.getKey().toString(), entry.getValue());
            }
            try (
                    V8ValueObject parseResultV8 = tsParseV8.call(null, sourceTextsV8, this.parseOptionsV8);
                    TSCProgramContext programContext = TSCProgramContext.fromJS(parseResultV8);
                    V8ValueMap sourceFilesByPathV8 = parseResultV8.get("sourceFiles")
            ) {
                sourceFilesByPathV8.forEach((V8ValueString filePathV8, V8Value maybeSourceFileV8) -> {
                    if (maybeSourceFileV8.isNullOrUndefined()) {
                        // TODO figure out how to handle this
                        System.err.println("**** missing source file: " + filePathV8.getValue());
                        return;
                    }

                    V8ValueObject sourceFileV8 = (V8ValueObject) maybeSourceFileV8;
                    String sourceText = sourceFileV8.getPropertyString("text");
                    Path filePath = Paths.get(filePathV8.getValue());
                    try (TSCSourceFileContext sourceFileContext = new TSCSourceFileContext(programContext, sourceText, filePath)) {
                        TSCNode node = programContext.tscNode(sourceFileV8);
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
        JavetUtils.close(this.tsParseV8);
        JavetUtils.close(this.parseOptionsV8);

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
