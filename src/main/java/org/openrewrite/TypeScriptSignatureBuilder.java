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

import java.util.*;

import static org.openrewrite.javascript.internal.tsc.TSCProgramContext.CompilerBridgeSourceKind.ApplicationCode;

@Incubating(since = "0.0")
public class TypeScriptSignatureBuilder implements JavaTypeSignatureBuilder {

    @Nullable
    Set<String> typeVariableNameStack;

    Map<TSCNode, String> signatures = new IdentityHashMap<>();

    @Override
    public String signature(@Nullable Object object) {
        if (object == null) {
            return "{undefined}";
        }

        TSCNode node = (TSCNode) object;
        String cached = signatures.get(node);
        if (cached != null) {
            return cached;
        }

        switch (node.syntaxKind()) {
            case SourceFile:
                cached = mapSourceFileFqn((TSCNode.SourceFile) node);
                break;
            case ClassDeclaration:
            case EnumDeclaration:
            case InterfaceDeclaration:
                cached = node.hasProperty("typeParameters") && !node.getNodeListProperty("typeParameters").isEmpty() ?
                        parameterizedSignature(node) : classSignature(node);
                break;
            case ArrayType:
                cached = arraySignature(node);
                break;
            case EnumMember:
                cached = mapEnumMember(node);
                break;
            case Identifier:
                cached = mapIdentifier(node);
                break;
            case Parameter:
                cached = mapParameter(node);
                break;
            case QualifiedName:
                cached = mapQualifiedName(node);
                break;
            case ThisKeyword:
                cached = mapThis(node);
                break;
            case TypeOperator:
                cached = mapTypeOperator(node);
                break;
            case TypeParameter:
                cached = genericSignature(node);
                break;
            case ExpressionWithTypeArguments:
            case TypeReference:
            case TypeQuery:
                cached = mapTypeReference(node);
                break;
            case UnionType:
                cached = TsType.Union.getFullyQualifiedName();
                break;
            case PropertyDeclaration:
            case VariableDeclaration:
                cached = variableSignature(node);
                break;
        }
        if (cached != null) {
            signatures.put(node, cached);
            return cached;
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
            try {
                return signature(symbol.getValueDeclaration());
            } catch (Exception ignored) {
            }
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
                    return TsType.MergedInterface.getFullyQualifiedName();
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
                    return TsType.Any.getFullyQualifiedName();
                case Boolean:
                case BooleanLiteral:
                    return JavaType.Primitive.Boolean.getKeyword();
                case Number:
                case NumberLiteral:
                    return TsType.Number.getFullyQualifiedName();
                case Null:
                    return JavaType.Primitive.Null.getKeyword();
                case Object:
                    return TsType.Anonymous.getFullyQualifiedName();
                case String:
                case StringLiteral:
                    return JavaType.Primitive.String.getKeyword();
                case Undefined:
                    return TsType.Undefined.getFullyQualifiedName();
                case Union:
                    return TsType.Union.getFullyQualifiedName();
                case Unit:
                    return TsType.Unit.getFullyQualifiedName();
                case Unknown:
                    return TsType.Unknown.getFullyQualifiedName();
                case Void:
                    return JavaType.Primitive.Void.getKeyword();
                case Enum:
                    return TsType.Enum.getFullyQualifiedName();
                case EnumLiteral:
                    return TsType.EnumLiteral.getFullyQualifiedName();
                case BigInt:
                    return TsType.BigInt.getFullyQualifiedName();
                case BigIntLiteral:
                    return TsType.BigIntLiteral.getFullyQualifiedName();
                case ESSymbol:
                    return TsType.ESSymbol.getFullyQualifiedName();
                case UniqueESSymbol:
                    return TsType.UniqueESSymbol.getFullyQualifiedName();
                case Never:
                    return TsType.Never.getFullyQualifiedName();
                case TypeParameter:
                    return TsType.TypeParameter.getFullyQualifiedName();
                case Intersection:
                    return TsType.Intersection.getFullyQualifiedName();
                case Index:
                    return TsType.Index.getFullyQualifiedName();
                case IndexedAccess:
                    return TsType.IndexedAccess.getFullyQualifiedName();
                case Conditional:
                    return TsType.Conditional.getFullyQualifiedName();
                case Substitution:
                    return TsType.Substitution.getFullyQualifiedName();
                case NonPrimitive:
                    return TsType.NonPrimitive.getFullyQualifiedName();
                case TemplateLiteral:
                    return TsType.TemplateLiteral.getFullyQualifiedName();
                case StringMapping:
                    return TsType.StringMapping.getFullyQualifiedName();
                case AnyOrUnknown:
                    return TsType.AnyOrUnknown.getFullyQualifiedName();
                case Nullable:
                    return TsType.Nullable.getFullyQualifiedName();
                case Literal:
                    return TsType.Literal.getFullyQualifiedName();
                case Freshable:
                    return TsType.Freshable.getFullyQualifiedName();
                case StringOrNumberLiteral:
                    return TsType.StringOrNumberLiteral.getFullyQualifiedName();
                case StringOrNumberLiteralOrUnique:
                    return TsType.StringOrNumberLiteralOrUnique.getFullyQualifiedName();
                case DefinitelyFalsy:
                    return TsType.DefinitelyFalsy.getFullyQualifiedName();
                case PossiblyFalsy:
                    return TsType.PossiblyFalsy.getFullyQualifiedName();
                case Intrinsic:
                    return TsType.Intrinsic.getFullyQualifiedName();
                case Primitive:
                    return TsType.Primitive.getFullyQualifiedName();
                case StringLike:
                    return TsType.StringLike.getFullyQualifiedName();
                case NumberLike:
                    return TsType.NumberLike.getFullyQualifiedName();
                case BigIntLike:
                    return TsType.BigIntLike.getFullyQualifiedName();
                case BooleanLike:
                    return TsType.BooleanLike.getFullyQualifiedName();
                case EnumLike:
                    return TsType.EnumLike.getFullyQualifiedName();
                case ESSymbolLike:
                    return TsType.ESSymbolLike.getFullyQualifiedName();
                case VoidLike:
                    return TsType.VoidLike.getFullyQualifiedName();
                case DefinitelyNonNullable:
                    return TsType.DefinitelyNonNullable.getFullyQualifiedName();
                case DisjointDomains:
                    return TsType.DisjointDomains.getFullyQualifiedName();
                case UnionOrIntersection:
                    return TsType.UnionOrIntersection.getFullyQualifiedName();
                case StructuredType:
                    return TsType.StructuredType.getFullyQualifiedName();
                case TypeVariable:
                    return TsType.TypeVariable.getFullyQualifiedName();
                case InstantiableNonPrimitive:
                    return TsType.InstantiableNonPrimitive.getFullyQualifiedName();
                case InstantiablePrimitive:
                    return TsType.InstantiablePrimitive.getFullyQualifiedName();
                case Instantiable:
                    return TsType.Instantiable.getFullyQualifiedName();
                case StructuredOrInstantiable:
                    return TsType.StructuredOrInstantiable.getFullyQualifiedName();
                case ObjectFlagsType:
                    return TsType.ObjectFlagsType.getFullyQualifiedName();
                case Simplifiable:
                    return TsType.Simplifiable.getFullyQualifiedName();
                case Singleton:
                    return TsType.Singleton.getFullyQualifiedName();
                case Narrowable:
                    return TsType.Narrowable.getFullyQualifiedName();
                case IncludesMask:
                    return TsType.IncludesMask.getFullyQualifiedName();
                case NotPrimitiveUnion:
                    return TsType.NotPrimitiveUnion.getFullyQualifiedName();
                default:
                    implementMe(type);
                    break;
            }
        } else {
            TSCObjectFlag objectFlag = TSCObjectFlag.fromMaskExact(type.getObjectFlags());
            if (objectFlag == TSCObjectFlag.PrimitiveUnion) {
                return TsType.PrimitiveUnion.getFullyQualifiedName();
            } else {
                implementMe(type);
            }
        }
        // This should never happen. If it does, we need to add support for the type.
        throw new UnsupportedOperationException("Cannot map type " + type);
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
        throw new UnsupportedOperationException(syntaxKind.name() + " syntaxKind is not supported in TypeScriptSignatureBuilder.");
    }

    private void implementMe(TSCType type) {
        throw new UnsupportedOperationException(type.typeToString() + " type is not supported in TypeScriptSignatureBuilder.");
    }
}
