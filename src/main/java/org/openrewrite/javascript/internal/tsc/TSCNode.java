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
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.reference.V8ValueArray;
import com.caoccao.javet.values.reference.V8ValueObject;
import org.openrewrite.DebugOnly;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class TSCNode implements TSCV8Backed {

    static boolean isValidBackingObject(TSCProgramContext programContext, V8ValueObject objectV8) {
        TSCInstanceOfChecks.InterfaceKind interfaceKind = programContext.identifyInterfaceKind(objectV8);
        return interfaceKind == TSCInstanceOfChecks.InterfaceKind.Node;
    }

    static TSCNode wrap(TSCProgramContext programContext, V8ValueObject objectV8) {
        if (!isValidBackingObject(programContext, objectV8)) {
            throw new IllegalArgumentException("object provided is not actually a TSC node");
        }

        TSCSyntaxKind syntaxKind;
        try {
            syntaxKind = TSCSyntaxKind.fromCode(objectV8.getInteger("kind"));
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }

        switch (syntaxKind) {
            case SyntaxList:
                return new TSCSyntaxListNode(programContext, objectV8);
            case SourceFile:
                return new TSCNode.SourceFile(programContext, objectV8);
            default:
                TSCGlobals ts = programContext.getTypeScriptGlobals();
                if (ts.invokeMethodBoolean("isTypeNode", objectV8)) {
                    return new TSCNode.TypeNode(programContext, objectV8);
                }
                return new TSCNode(programContext, objectV8);
        }
    }

    public static class SourceFile extends TSCNode {
        protected SourceFile(TSCProgramContext programContext, V8ValueObject nodeV8) {
            super(programContext, nodeV8);
        }

        public String getFileName() {
            return getStringProperty("fileName");
        }

        public String getPath() {
            return getStringProperty("path");
        }

        public String getResolvedPath() {
            return getStringProperty("resolvedPath");
        }

        public String getOriginalFileName() {
            return getStringProperty("originalFileName");
        }

        public String getModuleName() {
            return getStringProperty("moduleName");
        }

        /** This is *not* a concept in the TS compiler. This is part of the OpenRewrite-to-TSC bridge. */
        public TSCProgramContext.CompilerBridgeSourceInfo getCompilerBridgeSourceInfo() {
            return this.getProgramContext().getBridgeSourceInfo(this);
        }
    }

    public static class TypeNode extends TSCNode {
        protected TypeNode(TSCProgramContext programContext, V8ValueObject nodeV8) {
            super(programContext, nodeV8);
        }

        public TSCType getTypeFromTypeNode() {
            return this.getTypeChecker().getTypeFromTypeNode(this);
        }
    }

    private final TSCProgramContext programContext;
    public final V8ValueObject nodeV8;

    protected TSCNode(TSCProgramContext programContext, V8ValueObject nodeV8) {
        this.programContext = programContext;
        this.nodeV8 = nodeV8;
    }

    @Override
    public TSCProgramContext getProgramContext() {
        return programContext;
    }

    @Override
    public String toString() {
        return String.format(
                "Node(%s@[%d,%d); «%s»)",
                syntaxKind().name(),
                getStart(),
                getEnd(),
                TSCUtils.preview(getText(), 100)
        );
    }

    public int syntaxKindCode() {
        return getIntProperty("kind");
    }

    public TSCSyntaxKind syntaxKind() {
        return TSCSyntaxKind.fromCode(this.syntaxKindCode());
    }

    public @Nullable TSCType getTypeForNode() {
        return this.programContext.getTypeChecker().getTypeAtLocation(this);
    }

    @DebugOnly
    public TSCNode firstNodeContaining(String text) {
        return firstNodeContaining(text, null);
    }

    @DebugOnly
    public TSCNode firstNodeContaining(String text, @Nullable TSCSyntaxKind kind) {
        for (TSCNode child : this.getAllChildNodes()) {
            TSCNode found = child.firstNodeContaining(text, kind);
            if (found != null) {
                return found;
            }
        }
        if (!this.getText().contains(text)) {
            return null;
        }
        if (kind != null && this.syntaxKind() != kind) {
            return null;
        }
        return this;
    }

    @DebugOnly
    public TSCNode firstNodeWithText(String text) {
        return Objects.requireNonNull(firstNodeWithTextOrNull(text));
    }

    @DebugOnly
    public @Nullable TSCNode firstNodeWithTextOrNull(String text) {
        for (TSCNode child : this.getAllChildNodes()) {
            TSCNode found = child.firstNodeWithTextOrNull(text);
            if (found != null) {
                return found;
            }
        }
        if (text.equals(this.getText())) {
            return this;
        }
        return null;
    }

    /**
     * Only intended for debugging and tests.
     */
    public @Nullable TSCNode findNodeAtPosition(int position) {
        if (!containsPosition(position)) {
            throw new IllegalArgumentException(String.format(
                    "Attempt to find node at position %d, but this %s node only covers [%d, %d).",
                    position,
                    this.syntaxKind(),
                    this.getStart(),
                    this.getEnd()
            ));
        }
        if (getStart() == position) {
            return this;
        }
        for (TSCNode child : this.getAllChildNodes()) {
            if (child.containsPosition(position)) {
                return child.findNodeAtPosition(position);
            }
        }
        return null;
    }

    public boolean containsPosition(int position) {
        return position >= this.getStart() && position < this.getEnd();
    }

    public @Nullable TSCSymbol getSymbolForNode() {
        return this.programContext.getTypeChecker().getSymbolAtLocation(this);
    }

    public int getStartWithLeadingSpace() {
        return getIntProperty("pos");
    }

    public int getStart() {
        return getIntProperty("getStart()");
    }

    public int getEnd() {
        return getIntProperty("end");
    }

    public int getChildCount() {
        return getIntProperty("getChildCount");
    }

    public @Nullable TSCNode getParent() {
        return getOptionalNodeProperty("parent");
    }

    @DebugOnly
    public @Nullable TSCNode nearestContainingNamedDeclaration() {
        return Objects.requireNonNull(nearestContainingNamedDeclarationOrNull());
    }

    @DebugOnly
    public @Nullable TSCNode nearestContainingNamedDeclarationOrNull() {
        for (TSCNode node = this.getParent(); node != null; node = node.getParent()) {
            if (node.hasProperty("name")) {
                return node;
            }
        }
        return null;
    }

    @Deprecated
    public @Nullable TSCNode getChildNode(String name) {
        return getOptionalNodeProperty(name);
    }

    @Deprecated
    public TSCNode getChildNodeRequired(String name) {
        return getNodeProperty(name);
    }

    @Deprecated
    public List<TSCNode> getChildNodes(String name) {
        return getNodeListProperty(name);
    }

    public SourceFile getSourceFile() {
        return Objects.requireNonNull(this.getNodeProperty("getSourceFile()").assertSourceFile());
    }

    public TSCNode.SourceFile assertSourceFile() {
        if (this instanceof TSCNode.SourceFile) {
            return (SourceFile) this;
        } else {
            throw new IllegalStateException("not a source file: " + syntaxKind());
        }
    }

    public String getText() {
        return this.getStringProperty("getText()");
    }

    public TypeNode assertTypeNode() {
        if (this instanceof TypeNode) {
            return (TypeNode) this;
        }
        throw new IllegalStateException("expected a TypeNode, but this is an ordinary Node");
    }

    public List<TSCNode> getAllChildNodes() {
        try (V8Value v8Value = this.nodeV8.invoke("getChildren")) {
            if (v8Value.isNullOrUndefined()) {
                return Collections.emptyList();
            }
            V8ValueArray v8Array = (V8ValueArray) v8Value;

            final int count = v8Array.getLength();
            List<TSCNode> result = new ArrayList<>(count);
            for (int i = 0; i < count; i++) {
                try (V8Value child = v8Array.get(i)) {
                    result.add(programContext.tscNode((V8ValueObject) child));
                }
            }
            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    @DebugOnly
    public void printTree(PrintStream ps) {
        printTree(ps, "");
    }

    private void printTree(PrintStream ps, String indent) {
        ps.print(indent);
        ps.print(syntaxKind());
        if (syntaxKind().name().contains("Literal")) {
            ps.print(" (" + this.getText() + ")");
        }
        ps.println();

        String childIndent = indent + "  ";
        for (TSCNode child : getAllChildNodes()) {
            child.printTree(ps, childIndent);
        }
    }

    @Override
    public V8ValueObject getBackingV8Object() {
        return this.nodeV8;
    }
}
