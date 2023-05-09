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
import org.openrewrite.java.tree.JavaType;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCType;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;

@Incubating(since = "0.0")
public class TypeScriptTypeMapping implements JavaTypeMapping<TSCNode> {

    // FIXME: we need to pass in the owner (source file) if it is not accessible from the Node.

    private final TypeScriptSignatureBuilder signatureBuilder;
    private final IdentityHashMap<TSCType, JavaType> identityCache = new IdentityHashMap<>();
    private final JavaTypeCache typeCache;

    public TypeScriptTypeMapping(JavaTypeCache typeCache) {
        this.signatureBuilder = new TypeScriptSignatureBuilder();
        this.typeCache = typeCache;
    }

    @Override
    public JavaType type(@Nullable TSCNode node) {
        // FIXME: we need to pass in the owner (source file) if it is not accessible from the Node.
        return type(node, node);
    }

    // TODO: change TSCType to TSCType.
    @SuppressWarnings("DataFlowIssue")
    public JavaType type(@Nullable TSCNode node, TSCNode owner) {
        if (node == null) {
            return null;
        }

        TSCType type = node.getTypeForNode();

        // May require identity hashmap.
        String signature = signatureBuilder.signature(type);

        JavaType existing = signature == null ? null : typeCache.get(signature);
//        JavaType existing = typeCache.get(signature);
        if (existing != null) {
            return existing;
        }

        if (node.syntaxKind() == TSCSyntaxKind.ClassDeclaration) {
            return classType(node);
        }

        return null;
    }

    @Nullable
    private JavaType.FullyQualified classType(@Nullable TSCNode node) {
        if (node == null || node.getTypeForNode() == null) {
            return null;
        }

        TSCType type = node.getTypeForNode();
        // FIXME: POC
        JavaType fq = identityCache.get(type);
        JavaType.Class clazz = (JavaType.Class) (fq instanceof JavaType.Parameterized ? ((JavaType.Parameterized) fq).getType() : fq);
        if (clazz == null) {
            clazz = new JavaType.Class(
                    null,
                    mapFlags(), // FIXME
                    "getFQN", // FIXME
                    mapClassKind(), // FIXME
                    null, null, null, null, null, null, null
            );

            identityCache.put(type, clazz);

            JavaType.FullyQualified owner = null;

            JavaType.FullyQualified supertype = null;
            List<JavaType.FullyQualified> interfaces = null;

            List<JavaType.Variable> fields = null;
            List<JavaType.Method> methods = null;

            List<JavaType.FullyQualified> annotations = Collections.emptyList();
            clazz.unsafeSet(null, supertype, owner, annotations, interfaces, fields, methods);
        }

        boolean hasTypeParameters = false; // FIXME replace condition with type parameters check.
        if (hasTypeParameters) {
            // FIXME: POC
            JavaType jt = identityCache.get(type);
            if (jt == null) {
                JavaType.Parameterized pt = new JavaType.Parameterized(null, null, null);
                identityCache.put(type, pt);

                List<JavaType> typeParams = null; // FIXME
                // ADD type params.
                pt.unsafeSet(clazz, typeParams);
            } else if (!(jt instanceof JavaType.Parameterized)) {
                throw new UnsupportedOperationException("this should not have happened.");
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

    private long mapFlags() {
        return 0;
    }

    private JavaType.FullyQualified.Kind mapClassKind() {
        return JavaType.FullyQualified.Kind.Class;
    }
}
