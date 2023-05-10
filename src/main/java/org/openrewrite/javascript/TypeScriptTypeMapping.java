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
import org.openrewrite.javascript.internal.tsc.TSCSymbol;
import org.openrewrite.javascript.internal.tsc.TSCType;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.openrewrite.TypeScriptSignatureBuilder.mapFqn;
import static org.openrewrite.java.tree.JavaType.GenericTypeVariable.Variance.INVARIANT;

@Incubating(since = "0.0")
public class TypeScriptTypeMapping implements JavaTypeMapping<TSCNode> {

    private final TypeScriptSignatureBuilder signatureBuilder;
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

        String signature = signatureBuilder.signature(node);
        JavaType existing = typeCache.get(signature);
        if (existing != null) {
            return existing;
        }

        switch (node.syntaxKind()) {
            case VoidKeyword:
                return JavaType.Primitive.Void;
            case TrueKeyword:
            case FalseKeyword:
                return JavaType.Primitive.Boolean;
            case ClassDeclaration:
            case EnumDeclaration:
            case InterfaceDeclaration:
                return classType(node);
            case MethodDeclaration:
                return methodDeclarationType(node);
        }

        TSCSymbol symbol = type.getOptionalSymbolProperty("symbol");
        if (symbol != null) {
            TSCNode valueDeclaration = symbol.getOptionalNodeProperty("valueDeclaration");
            if (valueDeclaration != null) {
                if (valueDeclaration.syntaxKind() == TSCSyntaxKind.ClassDeclaration ||
                        valueDeclaration.syntaxKind() == TSCSyntaxKind.EnumDeclaration ||
                        valueDeclaration.syntaxKind() == TSCSyntaxKind.InterfaceDeclaration) {
                    return classType(valueDeclaration);
                } else if (valueDeclaration.syntaxKind() == TSCSyntaxKind.MethodDeclaration) {
                    return methodDeclarationType(valueDeclaration);
                } else {
                    throw new IllegalStateException("Unable to find value declaration for symbol " + symbol);
                }
            }
        }

        return mapNode(node);
    }

    @Nullable
    private JavaType.FullyQualified classType(@Nullable TSCNode node) {
        if (node == null || node.getTypeForNode() == null) {
            return null;
        }

        String signature = signatureBuilder.classSignature(node);
        JavaType fq = typeCache.get(signature);
        JavaType.Class clazz = (JavaType.Class) (fq instanceof JavaType.Parameterized ? ((JavaType.Parameterized) fq).getType() : fq);
        if (clazz == null) {
            /* Note: TS does not have the same concept as packages in java, and classes may be declared as returns in method declarations so FQNs work differently.
             * V1 intentionally sets types that may be ambiguous to null to prevent incorrect results from recipes caused by bad type attribution.
             */
            if (isNotValidClassDeclaration(node)) {
                typeCache.put(signature, null);
                return null;
            }

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
                    mapFqn(node), // FIXME: using `getSourceFile` only works for simple case.
                    kind,
                    null, null, null, null, null, null, null
            );

            typeCache.put(signature, clazz);

            JavaType.FullyQualified owner = null;

            JavaType.FullyQualified supertype = null;
            List<JavaType.FullyQualified> interfaces = null;

            List<TSCNode> propertyNodes = null;
            List<TSCNode> methodNodes = null;
            if (node.hasProperty("members")) {
                for (TSCNode member : node.getNodeListProperty("members")) {
                    if (member.syntaxKind() == TSCSyntaxKind.MethodDeclaration) {
                        if (methodNodes == null) {
                            methodNodes = new ArrayList<>(1);
                        }
                        methodNodes.add(member);
                    } else if (member.syntaxKind() == TSCSyntaxKind.PropertyDeclaration) {
                        if (propertyNodes == null) {
                            propertyNodes = new ArrayList<>(1);
                        }
                        propertyNodes.add(member);
                    } else {
                        throw new IllegalStateException("Unable to find value declaration for symbol " + member);
                    }
                }
            }

            List<JavaType.Variable> members = null;
            if (propertyNodes != null) {
                members = new ArrayList<>(propertyNodes.size());
                for (TSCNode propertyNode : propertyNodes) {
                    members.add(variableType(propertyNode, clazz));
                }
            }

            List<JavaType.Method> methods = null;
            if (methodNodes != null) {
                methods = new ArrayList<>(methodNodes.size());
                for (TSCNode methodNode : methodNodes) {
                    methods.add(methodDeclarationType(methodNode, clazz));
                }
            }

            List<JavaType.FullyQualified> annotations = Collections.emptyList();
            clazz.unsafeSet(null, supertype, owner, annotations, interfaces, members, methods);
        }

        if (node.hasProperty("typeParameters")) {
            String ptSignature = signatureBuilder.parameterizedSignature(node);
            JavaType jt = typeCache.get(ptSignature);
            if (jt == null) {
                JavaType.Parameterized pt = new JavaType.Parameterized(null, null, null);
                typeCache.put(ptSignature, pt);

                List<JavaType> typeParams = null; // FIXME
                // ADD type params.
                pt.unsafeSet(clazz, typeParams);
            } else if (!(jt instanceof JavaType.Parameterized)) {
//                throw new UnsupportedOperationException("this should not have happened.");
            }
        }
        return clazz;
    }

    public JavaType.GenericTypeVariable generic(TSCNode node) {
        String signature = signatureBuilder.genericSignature(node);
        JavaType.GenericTypeVariable existing = typeCache.get(signature);
        if (existing != null) {
            return existing;
        }

        String name = node.getText();
        JavaType.GenericTypeVariable generic = new JavaType.GenericTypeVariable(null, name, INVARIANT, null);
        typeCache.put(signature, generic);
        return generic;

    }

    @Nullable
    public JavaType.Method methodDeclarationType(TSCNode node) {
        TSCNode parent = node.getParent();
        assert parent != null;

        if (!(parent.syntaxKind() == TSCSyntaxKind.ClassDeclaration ||
                parent.syntaxKind() == TSCSyntaxKind.InterfaceDeclaration ||
                parent.syntaxKind() == TSCSyntaxKind.EnumDeclaration)) {
            throw new IllegalStateException("implement me.");
        }

        return methodDeclarationType(node, classType(parent));
    }

    @Nullable
    public JavaType.Method methodDeclarationType(TSCNode node, @Nullable JavaType.FullyQualified declaringType) {

        String signature = signatureBuilder.methodSignature(node);
        JavaType.Method existing = typeCache.get(signature);
        if (existing != null) {
            return existing;
        }

        List<String> paramNames = null;
        List<String> defaultValues = null;

        boolean isConstructor = false; //FIXME: detect constructor.
        JavaType.Method method = new JavaType.Method(
                null,
                mapFlags(),// FIXME.
                null,
                isConstructor ? "<constructor>" : node.getNodeProperty("name").getText(),
                null,
                paramNames,
                null, null, null,
                defaultValues
        );
        typeCache.put(signature, method);

        List<JavaType.FullyQualified> exceptionTypes = null;

        JavaType.FullyQualified resolvedDeclaringType = declaringType;
        if (declaringType == null) {
            throw new IllegalStateException("implement me.");
        }

        if (resolvedDeclaringType == null) {
            return null;
        }

        JavaType returnType = null; // FIXME.

        List<JavaType> parameterTypes = null;
        List<TSCNode> paramNodes = node.getOptionalNodeListProperty("parameters");
        if (paramNodes != null && !paramNodes.isEmpty()) {
            parameterTypes = new ArrayList<>(paramNodes.size());
            for (TSCNode paramNode : paramNodes) {
                TSCNode typeNode = paramNode.getOptionalNodeProperty("type");
                if (typeNode == null) {
                    throw new IllegalStateException("Find the type");
                } else {
                    if (typeNode.syntaxKind() == TSCSyntaxKind.TypeReference) {
                        parameterTypes.add(type(typeNode));
                    } else {
                        throw new IllegalStateException("implement me.");
                    }
                }
            }
        }

        method.unsafeSet(resolvedDeclaringType,
                isConstructor ? resolvedDeclaringType : returnType,
                parameterTypes, exceptionTypes, Collections.emptyList()); // FIXME: add annotations if necessary.
        return method;
    }

    @Nullable
    public JavaType.Method methodInvocationType(TSCNode node) {
        // FIXME
        return new JavaType.Method(
                null,
                mapFlags(),// FIXME.
                null,
                mapNameExpression(node.getNodeProperty("expression")),
                null,
                null,
                null, null, null,
                null
        );
    }

    public JavaType.Primitive primitive(TSCNode node) {
        return JavaType.Primitive.None;
    }

    @Nullable
    public JavaType.Variable variableType(TSCNode node) {
        return null;
    }

    @Nullable
    public JavaType.Variable variableType(TSCNode node, @Nullable JavaType.FullyQualified declaringType) {
        return null;
    }

    // FIXME:  traverse up to SourceFile. Return true if parents are all valid.
    private boolean isNotValidClassDeclaration(TSCNode node) {
        return false;
    }

    private String mapNameExpression(TSCNode node) {
        return "fix me";
    }

    @Nullable
    private JavaType mapNode(TSCNode node) {
        switch (node.syntaxKind()) {
            case Identifier:
            case TypeReference: {
                TSCType type = node.getTypeChecker().getTypeFromTypeNode(node);
                TSCSymbol symbol = type.getTypeChecker().getTypeFromTypeNode(node).getOptionalSymbolProperty("symbol");
                if (symbol == null) {
                    return null;
                }

                if (symbol.getDeclarations() != null && symbol.getDeclarations().size() == 1) {
                    return type(symbol.getDeclarations().get(0));
                } else {
                    return JavaType.ShallowClass.build("analysis.MergedTypesAreNotSupported");
                }
            }
            case TypeParameter:
                return generic(node);
            default:
                throw new IllegalStateException("implement me: " + node.syntaxKind());
        }
    }

    private long mapFlags() {
        return 0;
    }

    private JavaType.FullyQualified.Kind mapClassKind() {
        return JavaType.FullyQualified.Kind.Class;
    }
}
