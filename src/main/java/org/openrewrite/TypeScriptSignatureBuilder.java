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

import static org.openrewrite.javascript.internal.tsc.TSCProgramContext.CompilerBridgeSourceKind.ApplicationCode;

@Incubating(since = "0.0")
public class TypeScriptSignatureBuilder implements JavaTypeSignatureBuilder {

    @Nullable
    Set<String> typeVariableNameStack;

    @Override
    public String signature(@Nullable Object object) {
        if (object == null) {
            return "{undefined}";
        }

        TSCNode node = (TSCNode) object;
        switch (node.syntaxKind()) {
            case SourceFile:
                return mapSourceFileFqn((TSCNode.SourceFile) node);
            case ClassDeclaration:
            case EnumDeclaration:
            case InterfaceDeclaration:
                return node.hasProperty("typeParameters") && !node.getNodeListProperty("typeParameters").isEmpty() ?
                        parameterizedSignature(node) : classSignature(node);
            case ArrayType:
                return arraySignature(node);
            case EnumMember:
                return mapEnumMember(node);
            case Identifier:
                return mapIdentifier(node);
            case Parameter:
                return mapParameter(node);
            case QualifiedName:
                return mapQualifiedName(node);
            case ThisKeyword:
                return mapThis(node);
            case TypeOperator:
                return mapTypeOperator(node);
            case TypeParameter:
                return genericSignature(node);
            case ExpressionWithTypeArguments:
            case TypeReference:
            case TypeQuery:
                return mapTypeReference(node);
            case UnionType:
                return TsType.UNION.getFullyQualifiedName();
            case VariableDeclaration:
                return variableSignature(node);
        }
        TSCType type = node.getTypeChecker().getTypeAtLocation(node);
        return mapType(type);
    }

    @Override
    public String arraySignature(Object object) {
        TSCNode node = (TSCNode) object;
        TSCNode elementType = node.getNodeProperty("elementType");
        return signature(elementType) + trimWhitespace(node.getText().substring(elementType.getText().length()));
    }

    @Override
    public String classSignature(Object object) {
        TSCNode node = (TSCNode) object;
        if (node.syntaxKind() == TSCSyntaxKind.SourceFile) {
            return mapSourceFileFqn((TSCNode.SourceFile) node);
        }

        return mapFqn(node);
    }

    @Override
    public String genericSignature(Object object) {
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
        s.append("}");
        return s.toString();
    }

    public String methodSignature(Object object) {
        TSCNode node = (TSCNode) object;

        String s = classSignature(getOwner(node));
        boolean isConstructor = node.syntaxKind() == TSCSyntaxKind.Constructor ||
                node.syntaxKind() == TSCSyntaxKind.ConstructSignature ||
                node.syntaxKind() == TSCSyntaxKind.NewExpression;

        TSCNode type = node.getOptionalNodeProperty("type");
        String returnType;
        if (type != null) {
            returnType = signature(type);
        } else {
            returnType = "void";
        }

        if (isConstructor) {
            s += "{name=<constructor>,return=" + s;
        } else {
            TSCNode name = node.getOptionalNodeProperty("name");
            s += "{name=" + (name == null ? "" : name.getText()) + ",return=" + returnType;
        }
        return s + ",parameters=" + methodArgumentSignature(node) + "}";
    }

    @Override
    public String parameterizedSignature(Object object) {
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
        TSCNode node = (TSCNode) object;
        switch (node.syntaxKind()) {
            case BooleanKeyword:
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
        List<TSCNode> parameters = node.getOptionalNodeListProperty("parameters");
        if (parameters != null) {
            StringJoiner genericArgumentTypes = new StringJoiner(",", "[", "]");
            for (TSCNode parameter : parameters) {
                genericArgumentTypes.add(signature(parameter));
            }
            return genericArgumentTypes.toString();
        }
        return "[]";
    }

    public String variableSignature(TSCNode node) {
        String owner = signature(getOwner(node));
        //noinspection ConstantValue
        if (owner == null) {
            return null;
        }

        if (owner.contains("<")) {
            owner = owner.substring(0, owner.indexOf('<'));
        }

        String name = node.getNodeProperty("name").getText();
        String typeSig;
        if (node.hasProperty("type")) {
            typeSig = signature(node.getNodeProperty("type"));
        } else if (node.syntaxKind() == TSCSyntaxKind.EnumMember) {
            typeSig = owner;
        } else {
            typeSig = resolveNode(node);
        }
        return owner + "{name=" + name + ",type=" + typeSig + '}';
    }

    private String resolveNode(TSCNode node) {
        TSCNode type = node.getOptionalNodeProperty("type");
        if (type != null) {
            return signature(type);
        }

        TSCSymbol symbol = node.getTypeChecker().getTypeAtLocation(node).getOptionalSymbolProperty("symbol");
        if (symbol != null) {
            return signature(symbol.getValueDeclaration());
        }
        return mapType(node.getTypeChecker().getTypeAtLocation(node));
    }

    private static boolean isClassDeclaration(TSCNode node) {
        return node.syntaxKind() == TSCSyntaxKind.ClassDeclaration ||
                node.syntaxKind() == TSCSyntaxKind.InterfaceDeclaration ||
                node.syntaxKind() == TSCSyntaxKind.EnumDeclaration;
    }

    private String mapEnumMember(TSCNode node) {
        return signature(node.getParent());
    }

    public static String mapFqn(TSCNode node) {
        TSCNode parent = node.getParent();
        if (parent == null) {
            return "";
        }

        TSCNode name = node.getOptionalNodeProperty("name");
        String fqn = name == null ? "" : node.getNodeProperty("name").getText();

        if (parent.syntaxKind() == TSCSyntaxKind.SourceFile) {
            fqn = mapSourceFileFqn((TSCNode.SourceFile) parent) + "." + fqn;
        } else if (isClassDeclaration(parent) && isClassDeclaration(node)) {
            String prefix = mapFqn(parent);
            fqn = prefix + "$" + fqn;
        } else {
            String prefix = mapFqn(parent);
            fqn = prefix + "." + fqn;
        }

        return fqn;
    }

    private String mapIdentifier(TSCNode node) {
        TSCSymbol symbol = node.getTypeChecker().getTypeAtLocation(node).getOptionalSymbolProperty("symbol");
        if (symbol != null) {
            List<TSCNode> declarations = symbol.getDeclarations();
            if (declarations != null && !declarations.isEmpty()) {
                if (declarations.size() == 1) {
                    return signature(declarations.get(0));
                } else {
                    return TsType.MERGED_INTERFACE.getFullyQualifiedName();
                }
            } else {
                implementMe(node.syntaxKind());
            }
        }
        return mapType(node.getTypeChecker().getTypeAtLocation(node));
    }

    private String mapParameter(TSCNode node) {
        return resolveNode(node);
    }

    private String mapQualifiedName(TSCNode node) {
        String left = signature(node.getNodeProperty("left"));
        if (left.contains("<")) {
            left = left.substring(0, left.indexOf('<'));
        }
        return left + "$" + node.getNodeProperty("right").getText();
    }

    private static String mapSourceFileFqn(TSCNode.SourceFile node) {
        String path;
        if (node.getCompilerBridgeSourceInfo().getSourceKind() == ApplicationCode) {
            path = node.getSourceFile().getPath().replaceFirst("/app", "");
        } else {
            path = node.getSourceFile().getPath().replaceFirst("/lib", "lib");
        }
        String clean = path.replace("/", ".");
        return clean.startsWith(".") ? clean.substring(1) : clean;
    }

    private String mapThis(TSCNode node) {
        return resolveNode(node);
    }

    private String mapType(TSCType type) {
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
                case BooleanLiteral:
                    return JavaType.Primitive.Boolean.getKeyword();
                case Number:
                case NumberLiteral:
                    return TsType.NUMBER.getFullyQualifiedName();
                case Object:
                    return TsType.ANONYMOUS.getFullyQualifiedName();
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
                    throw new UnsupportedOperationException("implement me: " + flag);
            }
        } else {
            TSCObjectFlag objectFlag = TSCObjectFlag.fromMaskExact(type.getObjectFlags());
            if (objectFlag == TSCObjectFlag.PrimitiveUnion) {
                return TsType.PRIMITIVE_UNION.getFullyQualifiedName();
            } else {
                throw new UnsupportedOperationException("implement me");
            }
        }
    }

    private String mapTypeOperator(TSCNode node) {
        return signature(node.getNodeProperty("type"));
    }

    private String mapTypeReference(TSCNode node) {
        String className = null;
        TSCNode name = node.getOptionalNodeProperty("typeName");
        if (name != null) {
            className = signature(name);
        }

        name = node.getOptionalNodeProperty("exprName");
        if (className == null && name != null) {
            className = signature(name);
        }

        if (className == null) {
            className = signature(node.getNodeProperty("expression"));
        }

        if (className.contains("<") && !className.startsWith("Generic{")) {
            className = className.substring(0, className.indexOf('<'));
        }

        List<TSCNode> typeArguments = node.getOptionalNodeListProperty("typeArguments");
        if (typeArguments != null) {
            StringJoiner typeArgSigs = new StringJoiner(", ", "<", ">");
            for (TSCNode typeArg : typeArguments) {
                typeArgSigs.add(signature(typeArg));
            }
            className = className + typeArgSigs;
        }
        return className;
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

    private String trimWhitespace(String s) {
        return s.replaceAll("\\s+", "");
    }

    private void implementMe(TSCSyntaxKind syntaxKind) {
        throw new RuntimeException("Add support for syntaxKind: " + syntaxKind);
    }
}
