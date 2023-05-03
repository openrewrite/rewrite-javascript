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
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

@Incubating(since = "0.0")
public class TypeScriptTypeMapping implements JavaTypeMapping<TSCNode> {

    // FIXME: we need to pass in the owner (source file) if it is not accessible from the Node.

    private final TypeScriptSignatureBuilder signatureBuilder;
    private final JavaTypeCache typeCache;

    public TypeScriptTypeMapping(JavaTypeCache typeCache) {
        this.signatureBuilder = new TypeScriptSignatureBuilder();
        this.typeCache = typeCache;
    }

    @SuppressWarnings("DataFlowIssue")
    @Override
    public JavaType type(@Nullable TSCNode type) {
        if (type == null) {
            return null;
        }

        String signature = signatureBuilder.signature(type);

        // TODO: remove after type visiting in signature builder is completed.
        // Prevent null signatures from returning types.
        //noinspection ConstantValue
        if (signature != null) {
            JavaType existing = typeCache.get(signature);
            if (existing != null) {
                return existing;
            }

            if (type.syntaxKind() == TSCSyntaxKind.ClassDeclaration) {
                return classType(type);
            }
        }

        return null;
    }

    @Nullable
    private JavaType.FullyQualified classType(TSCNode classType) {
        return null;
    }

    @Nullable
    public JavaType.Method methodDeclarationType(TSCNode type) {
        return null;
    }

    @Nullable
    public JavaType.Method methodInvocationType(TSCNode type) {
        return null;
    }

    public JavaType.Primitive primitive(TSCNode type) {
        return JavaType.Primitive.None;
    }

    @Nullable
    public JavaType.Variable variableType(TSCNode type) {
        return null;
    }
}
