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
package org.openrewrite;

import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.JavaTypeSignatureBuilder;
import org.openrewrite.java.tree.JavaType;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCSymbol;
import org.openrewrite.javascript.internal.tsc.TSCType;
import org.openrewrite.javascript.internal.tsc.generated.TSCObjectFlag;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;
import org.openrewrite.javascript.internal.tsc.generated.TSCTypeFlag;
import org.openrewrite.javascript.tree.TsType;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.StringJoiner;

@Incubating(since = "0.0")
public class TypeScriptSignatureBuilder implements JavaTypeSignatureBuilder {

    @Nullable
    Set<String> typeVariableNameStack;

    @Nullable
    @Override
    public String signature(@Nullable Object object) {
        if (object == null) {
            return "{undefined}";
        }

        assert object instanceof TSCNode;
        TSCNode node = (TSCNode) object;
        if (node.syntaxKind() == TSCSyntaxKind.SourceFile) {
            return mapSourceFileFqn(node);
        } else if (node.isClassDeclaration()) {
            return node.hasProperty("typeParameters") && !node.getNodeListProperty("typeParameters").isEmpty() ? parameterizedSignature(node) : classSignature(node);
        } else if (node.isPrimitive()) {
            return primitiveSignature(node);
        } else if (node.isVariable()) {
            return variableSignature(node);
        } else if (node.syntaxKind() == TSCSyntaxKind.ArrayType) {
            return arraySignature(node);
        } else if (node.isMethodDeclaration()) {
            return methodSignature(node);
        } else if (node.syntaxKind() == TSCSyntaxKind.TypeParameter) {
            return genericSignature(node);
        } else {
            TSCType type = node.getTypeChecker().getTypeFromTypeNode(node);
            if (type == null) {
                return "{undefined}";
            }
            // Get the type attribution of identifiers.
            TSCSymbol symbol = type.getOptionalSymbolProperty("symbol");
            if (symbol != null) {
                TSCNode valueDeclaration = symbol.getOptionalNodeProperty("valueDeclaration");
                if (valueDeclaration != null) {
                    if (valueDeclaration.isClassDeclaration()) {
                        return classSignature(valueDeclaration);
                    } else if (valueDeclaration.isMethodDeclaration()) {
                        return methodSignature(valueDeclaration);
                    } else if (valueDeclaration.syntaxKind() == TSCSyntaxKind.EnumMember) {
                        return variableSignature(valueDeclaration);
                    }
                }
            }
            return mapNode(node);
        }
    }

    @Override
    public String arraySignature(Object object) {
        assert object instanceof TSCNode;
        TSCNode node = (TSCNode) object;
        TSCNode elementType = node.getNodeProperty("elementType");
        return signature(elementType) + trimWhitespace(node.getText().substring(elementType.getText().length()));
    }

    @Override
    public String classSignature(Object object) {
        assert object instanceof TSCNode;
        TSCNode node = (TSCNode) object;

        // The node's parent is the SourceFile.
        if (node.syntaxKind() == TSCSyntaxKind.SourceFile) {
            return mapSourceFileFqn(node);
        }

        assert node.isClassDeclaration();

        return mapFqn(node);
    }

    @Override
    public String genericSignature(Object object) {
        assert object instanceof TSCNode;
        TSCNode node = (TSCNode) object;

        if (typeVariableNameStack == null) {
            typeVariableNameStack = new HashSet<>();
        }

        String name = node.getNodeProperty("name").getText();
        if (!typeVariableNameStack.add(name)) {
            return "Generic{" + name + "}";
        }

        StringBuilder s = new StringBuilder("Generic{").append(name);
        StringJoiner boundSigs = new StringJoiner(" & ");

        if (node.hasProperty("constraint")) {
            TSCNode constraint = node.getNodeProperty("constraint");
            if (constraint.syntaxKind() == TSCSyntaxKind.IntersectionType) {
                for (TSCNode type : constraint.getNodeListProperty("types")) {
                    boundSigs.add(signature(type));
                }
            } else {
                boundSigs.add(signature(constraint));
            }
        }

        String boundSigStr = boundSigs.toString();
        if (!boundSigStr.isEmpty()) {
            s.append(" extends ").append(boundSigStr);
        }

        typeVariableNameStack.remove(name);
        return s.append("}").toString();
    }

    public String methodSignature(Object object) {
        assert object instanceof TSCNode;
        TSCNode node = (TSCNode) object;

        StringBuilder signature = new StringBuilder();
        boolean isConstructor = node.syntaxKind() == TSCSyntaxKind.Constructor;

        String parent = classSignature(getOwner(node));
        signature.append(parent);
        String name;
        String returnSignature;
        if (isConstructor) {
            name = "<constructor>";
            returnSignature = parent;
        } else {
            name = node.hasProperty("name") ? node.getNodeProperty("name").getText() : "{anonymous}";
            if (node.hasProperty("type")) {
                returnSignature = signature(node.getNodeProperty("type"));
            } else {
                returnSignature = "void";
            }
        }
        signature.append("{name=")
                .append(name)
                .append(",return=")
                .append(returnSignature);
        return signature.append(",parameters=")
                .append(methodArgumentSignature(node))
                .append("}").toString();
    }

    @Override
    public String parameterizedSignature(Object object) {
        assert object instanceof TSCNode;
        TSCNode node = (TSCNode) object;
        StringBuilder s = new StringBuilder(classSignature(node));
        StringJoiner joiner = new StringJoiner(", ", "<", ">");
        for (TSCNode param : node.getNodeListProperty("typeParameters")) {
            joiner.add(signature(param));
        }

        s.append(joiner);
        return s.toString();
    }

    @Override
    public String primitiveSignature(Object object) {
        assert object instanceof TSCNode;
        TSCNode node = (TSCNode) object;
        assert node.isPrimitive();
        switch (node.syntaxKind()) {
            case BooleanKeyword:
            case TrueKeyword:
            case FalseKeyword:
                return JavaType.Primitive.Boolean.getKeyword();
            case NumberKeyword:
                return "number";
            case StringKeyword:
                return JavaType.Primitive.String.getKeyword();
            case VoidKeyword:
                return JavaType.Primitive.Void.getKeyword();
            default:
                throw new IllegalArgumentException("Unexpected primitive type " + object);
        }
    }

    private String methodArgumentSignature(TSCNode node) {
        StringJoiner genericArgumentTypes = new StringJoiner(",", "[", "]");
        List<TSCNode> parameters = node.getOptionalNodeListProperty("parameters");
        if (parameters != null && !parameters.isEmpty()) {
            parameters.forEach(p -> genericArgumentTypes.add(signature(p)));
        }
        return genericArgumentTypes.toString();
    }

    public String variableSignature(TSCNode node) {
        String owner = signature(getOwner(node));
        String name = node.getNodeProperty("name").getText();
        String typeSig = "{undefined}";
        if (node.hasProperty("type")) {
            typeSig = signature(node.getNodeProperty("type"));
        } else if (node.hasProperty("initializer")) {
            typeSig = signature(node.getNodeProperty("initializer"));
        } else if (node.syntaxKind() == TSCSyntaxKind.EnumMember) {
            typeSig = owner;
        } else {
            TSCType type = node.getTypeForNode();
            if (type != null) {
                TSCSymbol symbol = type.getOptionalSymbolProperty("symbol");
                if (symbol != null) {
                    typeSig = signature(symbol.getValueDeclaration());
                }
            }
        }
        return owner + "{name=" + name + ",type=" + typeSig + '}';
    }

    public static String mapSourceFileFqn(TSCNode node) {
        String clean = node.getSourceFile().getPath().replace("/", ".");
        return clean.startsWith(".") ? clean.substring(1) : clean;
    }

    // FIME: resolve parents to SF, create cleaned FQN.
    public static String mapFqn(TSCNode node) {
        TSCNode parent = node.getParent();
        if (parent == null) {
            return "";
        }

        String fqn = node.getNodeProperty("name").getText();

        if (parent.syntaxKind() == TSCSyntaxKind.SourceFile) {
            fqn = mapSourceFileFqn(parent) + "." + fqn;
        } else if (parent.isClassDeclaration() && node.isClassDeclaration()) {
            String prefix = mapFqn(parent);
            fqn = prefix + "$" + fqn;
        } else {
            String prefix = mapFqn(parent);
            fqn = prefix + "." + fqn;
        }

        return fqn;
    }

    @Nullable
    public String mapNode(TSCNode node) {
        if (node.hasProperty("type")) {
            return signature((node.getNodeProperty("type")));
        }

        TSCType type = node.getTypeChecker().getTypeFromTypeNode(node);
        TSCSymbol symbol;
        if (type != null) {
            symbol = type.getOptionalSymbolProperty("symbol");
            if (symbol != null) {
                TSCNode declaration = symbol.getValueDeclaration();
                if (declaration != null) {
                    return signature(declaration);
                } else {
                    TSCNode tscNode = getDeclaration(symbol.getDeclarations());
                    if (tscNode == null) {
                        return TsType.MERGED_INTERFACE.getFullyQualifiedName();
                    } else {
                        return signature(getDeclaration(symbol.getDeclarations()));
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
                            return TsType.ANY.getFullyQualifiedName();
                        case Boolean:
                            return JavaType.Primitive.Boolean.getKeyword();
                        case Number:
                        case NumberLiteral:
                            return TsType.NUMBER.getFullyQualifiedName();
                        case Object:
                            // DO NOT CACHE a signature for anonymous/reference objects.
                            return null;
                        case String:
                        case StringLiteral:
                            return JavaType.Primitive.String.getKeyword();
                        case Undefined:
                            return TsType.UNDEFINED.getFullyQualifiedName();
                        case Union:
                            return TsType.UNION.getFullyQualifiedName();
                        case Unknown:
                            return TsType.UNKNOWN.getFullyQualifiedName();
                        case Void:
                            return JavaType.Primitive.Void.getKeyword();
                        default:
                            throw new UnsupportedOperationException("implement me");
                    }
                } else {
                    switch (TSCObjectFlag.fromMaskExact(type.getObjectFlags())) {
                        case PrimitiveUnion:
                            return TsType.PRIMITIVE_UNION.getFullyQualifiedName();
                        default:
                            throw new UnsupportedOperationException("implement me");
                    }
                }
            }
        } else {
            System.out.println();
        }
        return "{undefined}";
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

    private String trimWhitespace(String s) {
        return s.replaceAll("\\s+", "");
    }
}
