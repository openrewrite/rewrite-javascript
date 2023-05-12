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
import org.openrewrite.javascript.internal.tsc.generated.TSCObjectFlag;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;
import org.openrewrite.javascript.internal.tsc.generated.TSCTypeFlag;
import org.openrewrite.javascript.tree.TsType;

import java.util.*;

import static org.openrewrite.TypeScriptSignatureBuilder.mapFqn;
import static org.openrewrite.TypeScriptSignatureBuilder.mapSourceFileFqn;
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
        if (signature == null) {
            return null;
        }

        JavaType existing = typeCache.get(signature);
        if (existing != null) {
            return existing;
        }

        if (node.syntaxKind() == TSCSyntaxKind.SourceFile) {
            return JavaType.ShallowClass.build(mapSourceFileFqn(node));
        } else if (node.syntaxKind() == TSCSyntaxKind.UnknownKeyword) {
            return JavaType.ShallowClass.build("unknown");
        } else if (node.syntaxKind() == TSCSyntaxKind.UndefinedKeyword) {
            return JavaType.ShallowClass.build("undefined");
        } else if (node.isClassDeclaration()) {
            return classType(node);
        } else if (node.isPrimitive()) {
            return primitive(node);
        } else if (node.isMethodDeclaration()) {
            return methodDeclarationType(node);
        } else {
            // Get the type attribution of identifiers.
            TSCSymbol symbol = type.getOptionalSymbolProperty("symbol");
            if (symbol != null) {
                TSCNode valueDeclaration = symbol.getOptionalNodeProperty("valueDeclaration");
                if (valueDeclaration != null) {
                    if (valueDeclaration.isClassDeclaration()) {
                        return classType(valueDeclaration);
                    } else if (valueDeclaration.isMethodDeclaration()) {
                        return methodDeclarationType(valueDeclaration);
                    } else if (valueDeclaration.syntaxKind() == TSCSyntaxKind.EnumMember) {
                        return variableType(valueDeclaration);
                    }
                }
            }
            return mapNode(node);
        }
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
                    mapFqn(node),
                    kind,
                    null, null, null, null, null, null, null
            );

            typeCache.put(signature, clazz);

            JavaType.FullyQualified owner = null;

            JavaType.FullyQualified supertype = null;
            List<JavaType.FullyQualified> interfaces = null;

            List<TSCNode> propertyNodes = null;
            List<TSCNode> methodNodes = null;
            List<TSCNode> enumNodes = null;
            if (node.hasProperty("members")) {
                for (TSCNode member : node.getNodeListProperty("members")) {
                    if (member.isMethodDeclaration()) {
                        if (methodNodes == null) {
                            methodNodes = new ArrayList<>(1);
                        }
                        methodNodes.add(member);
                    } else if (member.isVariable()) {
                        if (propertyNodes == null) {
                            propertyNodes = new ArrayList<>(1);
                        }
                        propertyNodes.add(member);
                    } else if (member.syntaxKind() == TSCSyntaxKind.EnumMember) {
                        if (enumNodes == null) {
                            enumNodes = new ArrayList<>(1);
                        }
                        enumNodes.add(member);
                    } else {
                        throw new IllegalStateException("Unable to find value declaration for symbol " + member);
                    }
                }
            }

            List<JavaType.Variable> members = null;
            if (enumNodes != null) {
                members = new ArrayList<>(enumNodes.size() + (propertyNodes == null ? 0 : propertyNodes.size()));
                for (TSCNode enumNode : enumNodes) {
                    members.add(variableType(enumNode, clazz));
                }
            }

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
        TSCNode parent = getOwner(node);

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

        boolean isConstructor = node.syntaxKind() == TSCSyntaxKind.Constructor;
        JavaType.Method method = new JavaType.Method(
                null,
                mapFlags(),// FIXME.
                null,
                isConstructor ? "<constructor>" : node.hasProperty("name") ? node.getNodeProperty("name").getText() : "{anonymous}",
                null,
                paramNames,
                null, null, null,
                defaultValues
        );
        typeCache.put(signature, method);

        List<JavaType.FullyQualified> exceptionTypes = null;

        JavaType.FullyQualified resolvedDeclaringType = declaringType;
        if (declaringType == null) {
            resolvedDeclaringType = (JavaType.FullyQualified) type(getOwner(node));
        }

        JavaType returnType = null; // FIXME.

        List<JavaType> parameterTypes = null;
        List<TSCNode> paramNodes = node.getOptionalNodeListProperty("parameters");
        if (paramNodes != null && !paramNodes.isEmpty()) {
            parameterTypes = new ArrayList<>(paramNodes.size());
            for (TSCNode paramNode : paramNodes) {
                TSCNode typeNode = paramNode.getOptionalNodeProperty("type");
                if (typeNode == null) {
                    parameterTypes.add(type(paramNode));
                } else {
                    parameterTypes.add(type(typeNode));
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
        switch (node.syntaxKind()) {
            case BooleanKeyword:
            case FalseKeyword:
            case TrueKeyword:
                return JavaType.Primitive.Boolean;
            case StringKeyword:
                return JavaType.Primitive.String;
            // FIXME. Revisit with Gary on how to translate number ~= java.
            case NumberKeyword:
            case NumericLiteral:
                return JavaType.Primitive.Long;
            case UnknownKeyword:
                return JavaType.Primitive.None;
            case VoidKeyword:
                return JavaType.Primitive.Void;
            default:
                throw new IllegalStateException("implement me.");
        }
    }

    @Nullable
    public JavaType.Variable variableType(TSCNode node) {
        String signature = signatureBuilder.variableSignature(node);
        JavaType.Variable existing = typeCache.get(signature);
        if (existing != null) {
            return existing;
        }

        JavaType.Variable variable = new JavaType.Variable(
                null,
                mapFlags(), // TODO
                node.getNodeProperty("name").getText(),
                null, null, null);

        typeCache.put(signature, variable);

        List<JavaType.FullyQualified> annotations = Collections.emptyList();

        JavaType resolvedOwner = type(getOwner(node));
        JavaType type = type(node.hasProperty("type") ? node.getNodeProperty("type") : node);
        variable.unsafeSet(resolvedOwner, type, annotations);

        return variable;
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
        if (node.hasProperty("type")) {
            return type((node.getNodeProperty("type")));
        }

        TSCType type = node.getTypeChecker().getTypeFromTypeNode(node);
        TSCSymbol symbol;
        if (type != null) {
            symbol = type.getOptionalSymbolProperty("symbol");
            if (symbol != null) {
                TSCNode declaration = symbol.getValueDeclaration();
                if (declaration != null) {
                    return type(declaration);
                } else {
                    TSCNode tscNode = getDeclaration(symbol.getDeclarations());
                    if (tscNode == null) {
                        return TsType.MERGED_INTERFACE;
                    } else {
                        return type(getDeclaration(symbol.getDeclarations()));
                    }
                }
            } else {
                TSCTypeFlag flag = null;
                try {
                    flag = type.getExactTypeFlag();
                } catch (Exception ignored) {
                }

                if (flag != null) {
                    switch (flag) {
                        case Any:
                            return TsType.ANY;
                        case Boolean:
                            return JavaType.Primitive.Boolean;
                        case Number:
                        case NumberLiteral:
                            return TsType.NUMBER;
                        case Object:
                            // DO NOT CACHE a signature for anonymous/reference objects.
                            return null;
                        case String:
                        case StringLiteral:
                            return JavaType.Primitive.String;
                        case Undefined:
                            return TsType.UNDEFINED;
                        case Union:
                            return TsType.UNION;
                        case Unknown:
                            return TsType.UNKNOWN;
                        case Void:
                            return JavaType.Primitive.Void;
                        default:
                            throw new UnsupportedOperationException("implement me");
                    }
                } else {
                    switch (TSCObjectFlag.fromMaskExact(type.getObjectFlags())) {
                        case PrimitiveUnion:
                            return TsType.PRIMITIVE_UNION;
                        default:
                            throw new UnsupportedOperationException("implement me");
                    }
                }
            }
        } else {
            System.out.println();
        }
        return null;
    }

    // FIXME
    private long mapFlags() {
        return 0;
    }

    // FIXME
    private JavaType.FullyQualified.Kind mapClassKind() {
        return JavaType.FullyQualified.Kind.Class;
    }

    @Nullable
    private TSCNode getDeclaration(@Nullable List<TSCNode> declarations) {
        if (declarations == null || declarations.isEmpty()) {
            return null;
        }

        if (declarations.size() == 1) {
            return declarations.get(0);
        } else {
            return null;
        }
    }

    private TSCNode getOwner(TSCNode node) {
        TSCNode parent = node.getParent();
        if (parent == null) {
            return node;
        } else if (parent.syntaxKind() == TSCSyntaxKind.SourceFile ||
                parent.syntaxKind() == TSCSyntaxKind.ClassDeclaration ||
                parent.syntaxKind() == TSCSyntaxKind.EnumDeclaration ||
                parent.syntaxKind() == TSCSyntaxKind.InterfaceDeclaration ||
                parent.syntaxKind() == TSCSyntaxKind.MethodDeclaration) {
            return parent;
        } else {
            return getOwner(node.getParent());
        }
    }
}
