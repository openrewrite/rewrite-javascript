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

import org.jspecify.annotations.Nullable;
import org.openrewrite.Incubating;
import org.openrewrite.java.JavaTypeMapping;
import org.openrewrite.java.internal.JavaTypeCache;
import org.openrewrite.java.tree.Flag;
import org.openrewrite.java.tree.JavaType;
import org.openrewrite.java.tree.TypeUtils;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCNodeList;
import org.openrewrite.javascript.internal.tsc.TSCSymbol;
import org.openrewrite.javascript.internal.tsc.TSCType;
import org.openrewrite.javascript.internal.tsc.generated.TSCObjectFlag;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;
import org.openrewrite.javascript.internal.tsc.generated.TSCTypeFlag;
import org.openrewrite.javascript.tree.TsType;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.Collections.emptyList;
import static org.openrewrite.java.tree.JavaType.GenericTypeVariable.Variance.*;
import static org.openrewrite.javascript.TypeScriptSignatureBuilder.mapFqn;

@Incubating(since = "0.0")
public class TypeScriptTypeMapping implements JavaTypeMapping<TSCNode> {

    private final TypeScriptSignatureBuilder signatureBuilder;
    private final JavaTypeCache typeCache;

    public TypeScriptTypeMapping(JavaTypeCache typeCache) {
        this.signatureBuilder = new TypeScriptSignatureBuilder();
        this.typeCache = typeCache;
    }

    @Override
    @SuppressWarnings("DataFlowIssue")
    public JavaType type(@Nullable TSCNode node) {
        if (node == null) {
            return null;
        }

        String signature = signatureBuilder.signature(node);
        JavaType existing = typeCache.get(signature);
        if (existing != null) {
            return existing;
        }

        switch (node.syntaxKind()) {
            case SourceFile:
                return mapSourceFileFqn(signature);
            case ClassDeclaration:
            case EnumDeclaration:
            case InterfaceDeclaration:
                return classType(node, signature);
            case ArrayType:
                return array(node, signature);
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
                return generic(node, signature);
            case ExpressionWithTypeArguments:
            case TypeReference:
            case TypeQuery:
                return mapReference(node, signature);
            case UnionType:
                return TsType.Union;
            case PropertyDeclaration:
            case VariableDeclaration:
                return variableType(node, signature);
        }
        TSCType type = node.getTypeChecker().getTypeAtLocation(node);
        return mapType(type);
    }

    private JavaType array(TSCNode node, String signature) {
        JavaType.Array arr = new JavaType.Array(null, null, JavaType.EMPTY_FULLY_QUALIFIED_ARRAY);
        typeCache.put(signature, arr);
        TSCNode elementType = node.getNodeProperty("elementType");
        arr.unsafeSet(type(elementType), null);
        return arr;
    }

    private JavaType.@Nullable FullyQualified classType(@Nullable TSCNode node) {
        return classType(node, signatureBuilder.signature(node));
    }

    private JavaType.@Nullable FullyQualified classType(@Nullable TSCNode node, String signature) {
        if (node == null || node.syntaxKind() != TSCSyntaxKind.SourceFile && node.getTypeForNode() == null) {
            return null;
        }

        String fqn = signatureBuilder.classSignature(node);
        JavaType fq = typeCache.get(fqn);
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

            List<TSCNode> modifiers = node.getOptionalNodeListProperty("modifiers");
            clazz = new JavaType.Class(
                    null,
                    mapModifiers(modifiers),
                    mapFqn(node),
                    kind,
                    null, null, null, null, null, null, null
            );

            typeCache.put(fqn, clazz);

            JavaType.FullyQualified owner = null;
            TSCNode parent = getOwner(node);
            if (parent.syntaxKind() == TSCSyntaxKind.ClassDeclaration) {
                owner = classType(parent);
            }

            JavaType.FullyQualified supertype = null;
            List<JavaType.FullyQualified> interfaces = null;
            List<TSCNode> heritageClauses = node.getOptionalNodeListProperty("heritageClauses");
            if (heritageClauses != null) {
                for (TSCNode heritageClause : heritageClauses) {
                    if (heritageClause.getText().contains("extends")) {
                        List<TSCNode> superTypes = heritageClause.getNodeListProperty("types");
                        if (superTypes.size() > 1) {
                            implementMe(node.syntaxKind());
                        } else {
                            supertype = (JavaType.FullyQualified) type(superTypes.get(0));
                        }
                    } else {
                        implementMe(node.syntaxKind());
                    }
                }
            }

            List<TSCNode> propertyNodes = null;
            List<TSCNode> methodNodes = null;
            List<TSCNode> enumNodes = null;
            TSCNodeList memberNodes = node.getOptionalNodeListProperty("members");
            if (memberNodes != null) {
                for (TSCNode member : memberNodes) {
                    if (member.syntaxKind() == TSCSyntaxKind.CallSignature ||
                            member.syntaxKind() == TSCSyntaxKind.Constructor ||
                            member.syntaxKind() == TSCSyntaxKind.ConstructSignature ||
                            member.syntaxKind() == TSCSyntaxKind.FunctionDeclaration ||
                            member.syntaxKind() == TSCSyntaxKind.MethodDeclaration ||
                            member.syntaxKind() == TSCSyntaxKind.MethodSignature ||
                            // TODO: possibly not the appropriate way to map indexed access
                            member.syntaxKind() == TSCSyntaxKind.IndexSignature) {
                        if (methodNodes == null) {
                            methodNodes = new ArrayList<>(1);
                        }
                        methodNodes.add(member);
                    } else if (member.syntaxKind() == TSCSyntaxKind.PropertyDeclaration ||
                            member.syntaxKind() == TSCSyntaxKind.PropertySignature) {
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

            clazz.unsafeSet(null, supertype, owner, mapAnnotations(modifiers), interfaces, members, methods);
        }

        TSCNodeList typeParamNodes = node.getOptionalNodeListProperty("typeParameters");
        if (typeParamNodes != null) {
            JavaType jt = typeCache.get(signature);
            if (jt == null) {
                JavaType.Parameterized pt = new JavaType.Parameterized(null, null, null);
                typeCache.put(signature, pt);

                List<JavaType> typeParams = new ArrayList<>(typeParamNodes.size());
                for (TSCNode paramNode : typeParamNodes) {
                    typeParams.add(type(paramNode));
                }
                pt.unsafeSet(clazz, typeParams);
                return pt;
            } else if (!(jt instanceof JavaType.Parameterized)) {
                throw new UnsupportedOperationException("this should not have happened.");
            }
        }
        return clazz;
    }

    public JavaType.GenericTypeVariable generic(TSCNode node, String signature) {
        JavaType.GenericTypeVariable gtv = new JavaType.GenericTypeVariable(null, node.getNodeProperty("name").getText(), INVARIANT, null);
        typeCache.put(signature, gtv);

        List<JavaType> bounds = null;
        JavaType.GenericTypeVariable.Variance variance = INVARIANT;

        TSCNode constraint = node.getOptionalNodeProperty("constraint");
        if (constraint != null) {
            if (constraint.syntaxKind() == TSCSyntaxKind.IntersectionType) {
                List<TSCNode> types = constraint.getNodeListProperty("types");
                bounds = new ArrayList<>(types.size());
                for (TSCNode type : types) {
                    bounds.add(type(type));
                }
            } else {
                bounds = new ArrayList<>(1);
                bounds.add(type(constraint));
            }
            if (node.getText().contains("extends")) {
                variance = COVARIANT;
            } else if (node.getText().contains("super")) {
                variance = CONTRAVARIANT;
            }
        }

        gtv.unsafeSet(gtv.getName(), variance, bounds);
        return gtv;
    }

    public JavaType.@Nullable Method methodDeclarationType(TSCNode node) {
        return methodDeclarationType(node, null);
    }

    public JavaType.@Nullable Method methodDeclarationType(TSCNode node, JavaType.@Nullable FullyQualified declaringType) {

        String signature = signatureBuilder.methodSignature(node);
        JavaType.Method existing = typeCache.get(signature);
        if (existing != null) {
            return existing;
        }

        List<String> paramNames = null;
        List<String> defaultValues = null;

        boolean isConstructor = node.syntaxKind() == TSCSyntaxKind.Constructor;
        List<TSCNode> modifiers = node.getOptionalNodeListProperty("modifiers");
        TSCNode nodeName = node.getOptionalNodeProperty("name");
        JavaType.Method method = new JavaType.Method(
                null,
                mapModifiers(modifiers),
                null,
                isConstructor ? "<constructor>" : nodeName != null ? nodeName.getText() : "{anonymous}",
                null,
                paramNames,
                null, null, null,
                defaultValues
        );
        typeCache.put(signature, method);

        List<JavaType.FullyQualified> exceptionTypes = null;

        JavaType.FullyQualified resolvedDeclaringType = declaringType;
        if (declaringType == null) {
            resolvedDeclaringType = TypeUtils.asFullyQualified(type(getOwner(node)));
        }

        if (resolvedDeclaringType == null) {
            return null;
        }

        TSCNode returnTypeNode = node.getOptionalNodeProperty("type");
        JavaType returnType = returnTypeNode == null ? null : type(returnTypeNode);

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
                parameterTypes, exceptionTypes, mapAnnotations(modifiers));
        return method;
    }

    public JavaType.@Nullable Method methodInvocationType(TSCNode node) {
        String signature = signatureBuilder.methodSignature(node);
        JavaType.Method existing = typeCache.get(signature);
        if (existing != null) {
            return existing;
        }

        boolean isConstructor = node.syntaxKind() == TSCSyntaxKind.Constructor ||
                node.syntaxKind() == TSCSyntaxKind.ConstructSignature ||
                node.syntaxKind() == TSCSyntaxKind.NewExpression;

        TSCNode name = node.getOptionalNodeProperty("name");
        List<TSCNode> modifiers = node.getOptionalNodeListProperty("modifiers");
        List<String> paramNames = null;
        JavaType.Method method = new JavaType.Method(
                null,
                mapModifiers(modifiers),
                null,
                isConstructor ? "<constructor>" : name == null ? "{anonymous}" : name.getText(),
                null,
                paramNames,
                null, null, null, null
        );
        typeCache.put(signature, method);

        List<TSCNode> arguments = node.getOptionalNodeListProperty("arguments");
        List<JavaType> parameterTypes = null;
        if (arguments != null) {
            parameterTypes = new ArrayList<>(arguments.size());
            for (TSCNode argument : arguments) {
                parameterTypes.add(type(argument));
            }
        }
        List<JavaType.FullyQualified> exceptionTypes = null;

        JavaType.FullyQualified resolvedDeclaringType = null;
        if (node.syntaxKind() == TSCSyntaxKind.NewExpression) {
            resolvedDeclaringType = (JavaType.FullyQualified) type(node.getNodeProperty("expression"));
        } else {
            TSCSymbol symbol = node.getTypeChecker().getTypeAtLocation(node).getOptionalSymbolProperty("symbol");
            if (symbol != null) {
                JavaType j = type(symbol.getValueDeclaration());
                if (j instanceof JavaType.FullyQualified) {
                    resolvedDeclaringType = (JavaType.FullyQualified) type(symbol.getValueDeclaration());
                } else {
                    implementMe(node.syntaxKind());
                }
            } else {
                resolvedDeclaringType = TsType.MissingSymbol;
            }
        }

        TSCNode returnNode = node.getOptionalNodeProperty("type");
        JavaType returnType = returnNode == null ? null : type(returnNode);
        method.unsafeSet(resolvedDeclaringType,
                isConstructor ? resolvedDeclaringType : returnType,
                parameterTypes, exceptionTypes, mapAnnotations(modifiers));
        return method;
    }

    public JavaType.Primitive primitive(TSCNode node) {
        switch (node.syntaxKind()) {
            case BigIntKeyword:
            case BigIntLiteral:
                implementMe(node.syntaxKind());
            case BooleanKeyword:
            case FalseKeyword:
            case TrueKeyword:
                return JavaType.Primitive.Boolean;
            case StringKeyword:
                return JavaType.Primitive.String;
            case NullKeyword:
                return JavaType.Primitive.Null;
            case NumberKeyword:
            case NumericLiteral:
                // NOTE: number includes doubles and floats ...
                return JavaType.Primitive.Long;
            case UnknownKeyword:
                return JavaType.Primitive.None;
            case VoidKeyword:
                return JavaType.Primitive.Void;
            default:
                implementMe(node.syntaxKind());
        }
        return JavaType.Primitive.None;
    }

    public JavaType.@Nullable Variable variableType(TSCNode node) {
        return variableType(node, null, signatureBuilder.variableSignature(node));
    }

    public JavaType.@Nullable Variable variableType(TSCNode node, String signature) {
        return variableType(node, null, signature);
    }

    public JavaType.@Nullable Variable variableType(TSCNode node, JavaType.@Nullable FullyQualified declaringType) {
        return variableType(node, declaringType, signatureBuilder.variableSignature(node));
    }

    public JavaType.@Nullable Variable variableType(TSCNode node, JavaType.@Nullable FullyQualified declaringType, String signature) {
        JavaType.Variable existing = typeCache.get(signature);
        if (existing != null) {
            return existing;
        }

        List<TSCNode> modifiers = node.getOptionalNodeListProperty("modifiers");
        JavaType.Variable variable = new JavaType.Variable(
                null,
                mapModifiers(modifiers),
                node.getNodeProperty("name").getText(),
                null, null, null);

        typeCache.put(signature, variable);

        List<JavaType.FullyQualified> annotations = emptyList();

        JavaType resolvedOwner = declaringType;
        if (resolvedOwner == null) {
            resolvedOwner = classType(getOwner(node));
        }

        TSCNode typeNode = node.getOptionalNodeProperty("type");
        JavaType type;
        if (typeNode != null) {
            type = type(typeNode);
        } else {
            type = resolveNode(node);
        }

        if (resolvedOwner == null || type instanceof JavaType.Unknown) {
            return null;
        }

        variable.unsafeSet(resolvedOwner, type, annotations);

        return variable;
    }

    private @Nullable List<JavaType.FullyQualified> mapAnnotations(@Nullable List<TSCNode> modifiers) {
        if (modifiers == null || modifiers.isEmpty()) {
            return null;
        }

        List<TSCNode> annotationNodes = modifiers.stream()
                .filter(n -> n.syntaxKind() == TSCSyntaxKind.Decorator)
                .collect(Collectors.toList());

        List<JavaType.FullyQualified> annotations = new ArrayList<>(annotationNodes.size());
        for (TSCNode annotation : annotationNodes) {
            annotations.add((JavaType.FullyQualified) type(annotation));
        }
        return annotations.isEmpty() ? null : annotations;
    }

    private JavaType mapEnumMember(TSCNode node) {
        return type(node.getParent());
    }

    private JavaType mapIdentifier(TSCNode node) {
        TSCSymbol symbol = node.getTypeChecker().getTypeAtLocation(node).getOptionalSymbolProperty("symbol");
        if (symbol != null) {
            List<TSCNode> declarations = symbol.getDeclarations();
            if (declarations != null && !declarations.isEmpty()) {
                if (declarations.size() == 1) {
                    return type(declarations.get(0));
                } else {
                    return TsType.MergedInterface;
                }
            } else {
                implementMe(node.syntaxKind());
            }
        }
        return mapType(node.getTypeChecker().getTypeAtLocation(node));
    }

    private long mapModifiers(@Nullable List<TSCNode> modifiers) {
        if (modifiers == null) {
            return 0;
        }

        Set<Flag> flags = new HashSet<>();
        for (TSCNode modifier : modifiers) {
            switch (modifier.getText()) {
                case "public":
                    flags.add(Flag.Public);
                    break;
                case "private":
                    flags.add(Flag.Private);
                    break;
                case "protected":
                    flags.add(Flag.Protected);
                    break;
                case "static":
                    flags.add(Flag.Static);
                    break;
                case "readonly":
                    flags.add(Flag.Final);
                    break;
                case "abstract":
                    flags.add(Flag.Abstract);
                    break;
                case "default":
                    flags.add(Flag.Default);
                    break;
                case "async":
                case "export":
                    // TODO: get input from Gary ... is there any reason to add export as a modifier to the JavaType?
                    break;
                default:
                    if (modifier.syntaxKind() != TSCSyntaxKind.Decorator) {
                        // Decorators are handled separately to ensure the JavaType for a class is cached before type attributing annotations.
                        implementMe(modifier.syntaxKind());
                    }
            }
        }

        return Flag.flagsToBitMap(flags);
    }

    private JavaType mapParameter(TSCNode node) {
        return resolveNode(node);
    }

    private JavaType mapQualifiedName(TSCNode node) {
        return resolveNode(node);
    }

    private JavaType mapReference(TSCNode node, String signature) {
        JavaType classType = null;
        TSCNode name = node.getOptionalNodeProperty("typeName");
        if (name != null) {
            classType = type(name);
        }

        name = node.getOptionalNodeProperty("exprName");
        if (classType == null && name != null) {
            classType = type(name);
        }

        if (classType == null) {
            classType = type(node.getNodeProperty("expression"));
        }

        if (classType instanceof JavaType.Parameterized) {
            classType = ((JavaType.Parameterized) classType).getType();
        }

        List<TSCNode> typeArguments = node.getOptionalNodeListProperty("typeArguments");
        if (typeArguments == null) {
            typeCache.put(signature, classType);
            return classType;
        } else {
            JavaType fq = TypeUtils.asFullyQualified(classType);
            assert fq != null;

            JavaType.Parameterized pt = new JavaType.Parameterized(null, null, null);
            typeCache.put(signature, pt);
            List<JavaType> params = new ArrayList<>(typeArguments.size());
            for (TSCNode typeArg : typeArguments) {
                params.add(type(typeArg));
            }
            pt.unsafeSet(TypeUtils.asFullyQualified(classType), params);
            return pt;
        }
    }

    private JavaType mapSourceFileFqn(String signature) {
        JavaType sourceClass = JavaType.ShallowClass.build(signature);
        typeCache.put(signature, sourceClass);
        return sourceClass;
    }

    private JavaType mapThis(TSCNode node) {
        return resolveNode(node);
    }

    private JavaType mapTypeOperator(TSCNode node) {
        return type(node.getNodeProperty("type"));
    }

    private JavaType mapType(TSCType type) {
        TSCTypeFlag flag = null;
        try {
            flag = type.getExactTypeFlag();
        } catch (Exception ignored) {
        }

        if (flag != null) {
            switch (flag) {
                case Any:
                    return TsType.Any;
                case Boolean:
                case BooleanLiteral:
                    return JavaType.Primitive.Boolean;
                case Number:
                case NumberLiteral:
                    return TsType.Number;
                case Null:
                    return JavaType.Primitive.Null;
                case Object:
                    return TsType.Anonymous;
                case String:
                case StringLiteral:
                    return JavaType.Primitive.String;
                case Undefined:
                    return TsType.Undefined;
                case Union:
                    return TsType.Union;
                case Unit:
                    return TsType.Unit;
                case Unknown:
                    return TsType.Unknown;
                case Void:
                    return JavaType.Primitive.Void;
                case Enum:
                    return TsType.Enum;
                case EnumLiteral:
                    return TsType.EnumLiteral;
                case BigInt:
                    return TsType.BigInt;
                case BigIntLiteral:
                    return TsType.BigIntLiteral;
                case ESSymbol:
                    return TsType.ESSymbol;
                case UniqueESSymbol:
                    return TsType.UniqueESSymbol;
                case Never:
                    return TsType.Never;
                case TypeParameter:
                    return TsType.TypeParameter;
                case Intersection:
                    return TsType.Intersection;
                case Index:
                    return TsType.Index;
                case IndexedAccess:
                    return TsType.IndexedAccess;
                case Conditional:
                    return TsType.Conditional;
                case Substitution:
                    return TsType.Substitution;
                case NonPrimitive:
                    return TsType.NonPrimitive;
                case TemplateLiteral:
                    return TsType.TemplateLiteral;
                case StringMapping:
                    return TsType.StringMapping;
                case AnyOrUnknown:
                    return TsType.AnyOrUnknown;
                case Nullable:
                    return TsType.Nullable;
                case Literal:
                    return TsType.Literal;
                case Freshable:
                    return TsType.Freshable;
                case StringOrNumberLiteral:
                    return TsType.StringOrNumberLiteral;
                case StringOrNumberLiteralOrUnique:
                    return TsType.StringOrNumberLiteralOrUnique;
                case DefinitelyFalsy:
                    return TsType.DefinitelyFalsy;
                case PossiblyFalsy:
                    return TsType.PossiblyFalsy;
                case Intrinsic:
                    return TsType.Intrinsic;
                case Primitive:
                    return TsType.Primitive;
                case StringLike:
                    return TsType.StringLike;
                case NumberLike:
                    return TsType.NumberLike;
                case BigIntLike:
                    return TsType.BigIntLike;
                case BooleanLike:
                    return TsType.BooleanLike;
                case EnumLike:
                    return TsType.EnumLike;
                case ESSymbolLike:
                    return TsType.ESSymbolLike;
                case VoidLike:
                    return TsType.VoidLike;
                case DefinitelyNonNullable:
                    return TsType.DefinitelyNonNullable;
                case DisjointDomains:
                    return TsType.DisjointDomains;
                case UnionOrIntersection:
                    return TsType.UnionOrIntersection;
                case StructuredType:
                    return TsType.StructuredType;
                case TypeVariable:
                    return TsType.TypeVariable;
                case InstantiableNonPrimitive:
                    return TsType.InstantiableNonPrimitive;
                case InstantiablePrimitive:
                    return TsType.InstantiablePrimitive;
                case Instantiable:
                    return TsType.Instantiable;
                case StructuredOrInstantiable:
                    return TsType.StructuredOrInstantiable;
                case ObjectFlagsType:
                    return TsType.ObjectFlagsType;
                case Simplifiable:
                    return TsType.Simplifiable;
                case Singleton:
                    return TsType.Singleton;
                case Narrowable:
                    return TsType.Narrowable;
                case IncludesMask:
                    return TsType.IncludesMask;
                case NotPrimitiveUnion:
                    return TsType.NotPrimitiveUnion;
                default:
                    implementMe(type);
                    break;
            }
        } else {
            TSCObjectFlag objectFlag = TSCObjectFlag.fromMaskExact(type.getObjectFlags());
            if (objectFlag == TSCObjectFlag.PrimitiveUnion) {
                return TsType.PrimitiveUnion;
            } else {
                implementMe(type);
            }
        }
        return null;
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

    private JavaType resolveNode(TSCNode node) {
        TSCSymbol symbol = node.getTypeChecker().getTypeAtLocation(node).getOptionalSymbolProperty("symbol");
        if (symbol != null) {
            try {
                return type(symbol.getValueDeclaration());
            } catch (Exception ignored) {
            }
        }
        return mapType(node.getTypeChecker().getTypeAtLocation(node));
    }

    private void implementMe(TSCSyntaxKind syntaxKind) {
        throw new UnsupportedOperationException(syntaxKind.name() + " syntaxKind is not supported in TypeMapping.");
    }

    private void implementMe(TSCType type) {
        throw new UnsupportedOperationException(type.typeToString() + " type is not supported in TypeMapping.");
    }
}
