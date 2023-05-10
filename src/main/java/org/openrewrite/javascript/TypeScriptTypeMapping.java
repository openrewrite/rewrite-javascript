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
package org.openrewrite.javascript;

import org.openrewrite.Incubating;
import org.openrewrite.TypeScriptSignatureBuilder;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.JavaTypeMapping;
import org.openrewrite.java.internal.JavaTypeCache;
import org.openrewrite.java.tree.J;
import org.openrewrite.java.tree.JavaType;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCSymbol;
import org.openrewrite.javascript.internal.tsc.TSCType;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;

@Incubating(since = "0.0")
public class TypeScriptTypeMapping implements JavaTypeMapping<TSCNode> {

    private final TypeScriptSignatureBuilder signatureBuilder;
    private final IdentityHashMap<TSCType, JavaType> identityCache = new IdentityHashMap<>();
    private final JavaTypeCache typeCache;

    public TypeScriptTypeMapping(JavaTypeCache typeCache) {
        this.signatureBuilder = new TypeScriptSignatureBuilder();
        this.typeCache = typeCache;
    }

    // TODO: change TSCType to TSCType.
    @SuppressWarnings("DataFlowIssue")
    public JavaType type(@Nullable TSCNode node) {
        if (node == null) {
            return null;
        }

        TSCType type = node.getTypeForNode();
        if (type == null) {
            return null;
        }

        JavaType existing = identityCache.get(node.getTypeForNode());
        //        JavaType existing = typeCache.get(getTypeSIg ... TODO);
        if (existing != null) {
            return existing;
        }

        TSCSymbol symbol = type.getSymbolProperty("symbol");
        TSCNode valueDeclaration = symbol.getOptionalNodeProperty("valueDeclaration");
        if (valueDeclaration != null) {
            // TODO: complete the declaration kinds.
            if (valueDeclaration.syntaxKind() == TSCSyntaxKind.ClassDeclaration ||
                    valueDeclaration.syntaxKind() == TSCSyntaxKind.EnumDeclaration ||
                    valueDeclaration.syntaxKind() == TSCSyntaxKind.InterfaceDeclaration) {
                return classType(valueDeclaration);
            } else if (valueDeclaration.syntaxKind() == TSCSyntaxKind.MethodDeclaration) {
                return methodDeclarationType(valueDeclaration);
            } else {
                throw new IllegalStateException("Unable to find value declaration for symbol " + symbol);
            }
        } else {
            // use node.syntaxKind()
            return null;
        }
    }

    @Nullable
    private JavaType.FullyQualified classType(@Nullable TSCNode node) {
        if (node == null || node.getTypeForNode() == null) {
            return null;
        }

        TSCType type = node.getTypeForNode();
        // FIXME: POC: Gary will expose the string ID that is unique for the ref.
        // FIXME: The Type identity does now work for parameterized types.
        JavaType fq = identityCache.get(type);
        JavaType.Class clazz = (JavaType.Class) (fq instanceof JavaType.Parameterized ? ((JavaType.Parameterized) fq).getType() : fq);
        if (clazz == null) {
            TSCSyntaxKind syntaxKind = node.syntaxKind();
            JavaType.FullyQualified.Kind kind;
            switch (syntaxKind) {
                case EnumDeclaration:
                    kind = JavaType.FullyQualified.Kind.Enum;
                    break;
                case InterfaceDeclaration:
                    kind = JavaType.FullyQualified.Kind.Interface;
                    break;
                default:
                    kind = JavaType.FullyQualified.Kind.Class;
            }

            clazz = new JavaType.Class(
                    null,
                    mapFlags(), // FIXME
                    mapFqn(node), // FIXME
                    kind,
                    null, null, null, null, null, null, null
            );

            identityCache.put(type, clazz);

            JavaType.FullyQualified owner = null;

            JavaType.FullyQualified supertype = null;
            List<JavaType.FullyQualified> interfaces = null;

            List<JavaType.Variable> fields = null;
            List<JavaType.Method> methods = null;

            // FIXME: detect field or method and add to the appropriate list.
            for (TSCSymbol property : type.getTypeProperties()) {
            }

            List<JavaType.FullyQualified> annotations = Collections.emptyList();
            clazz.unsafeSet(null, supertype, owner, annotations, interfaces, fields, methods);
        }

        if (node.hasProperty("typeParameters")) {
            // FIXME: POC
            JavaType jt = identityCache.get(type);
            if (jt == null) {
                JavaType.Parameterized pt = new JavaType.Parameterized(null, null, null);
                identityCache.put(type, pt);

                List<JavaType> typeParams = null; // FIXME
                // ADD type params.
                pt.unsafeSet(clazz, typeParams);
            } else if (!(jt instanceof JavaType.Parameterized)) {
//                throw new UnsupportedOperationException("this should not have happened.");
            }
        }
        return clazz;
    }

    @Nullable
    public JavaType.Method methodDeclarationType(TSCNode node) {
        return null;
    }

    @Nullable
    public JavaType.Method methodInvocationType(TSCNode node) {
        return null;
    }

    public JavaType.Primitive primitive(TSCNode node) {
        return JavaType.Primitive.None;
    }

    @Nullable
    public JavaType.Variable variableType(TSCNode node) {
        return null;
    }

    // TEMP ...
    private String mapFqn(TSCNode node) {
        String dirty = node.getSourceFile().getPath().replace("/", ".");
        String clean = dirty.startsWith(".") ? dirty.substring(1) : dirty;
        return clean + "." + (node.hasProperty("name") ? node.getNodeProperty("name").getText() : "");
    }

    // FIME: POC -- resolve parents to SF, create cleaned FQN.
    private void mapFqn(TSCNode node, StringBuilder sb) {
        boolean detectParent = false; // stop at sourceFile
        String dirty = node.getSourceFile().getPath().replace("/", ".");
        String clean = dirty.startsWith(".") ? dirty.substring(1) : dirty;
        if (detectParent) {
//            sb.append(mapFqn(obj ...));
        }
    }

    private long mapFlags() {
        return 0;
    }

    private JavaType.FullyQualified.Kind mapClassKind() {
        return JavaType.FullyQualified.Kind.Class;
    }
}
