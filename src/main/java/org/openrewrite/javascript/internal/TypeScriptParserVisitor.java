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
package org.openrewrite.javascript.internal;

import org.openrewrite.FileAttributes;
import org.openrewrite.ParseExceptionResult;
import org.openrewrite.internal.ExceptionUtils;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.marker.Semicolon;
import org.openrewrite.java.marker.TrailingComma;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.TypeScriptTypeMapping;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCNodeList;
import org.openrewrite.javascript.internal.tsc.TSCSourceFileContext;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;
import org.openrewrite.javascript.markers.*;
import org.openrewrite.javascript.table.ParseExceptionAnalysis;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.javascript.tree.TsType;
import org.openrewrite.marker.Markers;

import java.nio.file.Path;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static org.openrewrite.Tree.randomId;
import static org.openrewrite.internal.StringUtils.indexOfNextNonWhitespace;
import static org.openrewrite.java.tree.Space.EMPTY;
import static org.openrewrite.java.tree.Space.format;

@SuppressWarnings({"DataFlowIssue", "SameParameterValue"})
public class TypeScriptParserVisitor {

    private final TSCNode sourceNode;
    private final String source;
    private final TSCSourceFileContext cursorContext;
    private final Path sourcePath;
    private final TypeScriptTypeMapping typeMapping;

    private final String charset;
    private final boolean isCharsetBomMarked;

    public TypeScriptParserVisitor(TSCNode sourceNode, String source, TSCSourceFileContext sourceContext, Path sourcePath, JavaScriptTypeCache typeCache, String charset, boolean isCharsetBomMarked) {
        this.sourceNode = sourceNode;
        this.source = source;
        this.cursorContext = sourceContext;
        this.sourcePath = sourcePath;
        this.charset = charset;
        this.isCharsetBomMarked = isCharsetBomMarked;
        this.typeMapping = new TypeScriptTypeMapping(typeCache);
    }

    public JS.CompilationUnit visitSourceFile() {
        List<JRightPadded<Statement>> statements = new ArrayList<>();
        Space prefix = whitespace();
        Markers markers = null;
        for (TSCNode child : sourceNode.getNodeListProperty("statements")) {
            @Nullable J visited;
            int saveCursor = getCursor();
            try {
                visited = visitNode(child);
            } catch (Throwable t) {
                cursor(saveCursor);
                JS.UnknownElement element = unknownElement(child);
                ParseExceptionResult parseExceptionResult = new ParseExceptionResult(
                        UUID.randomUUID(),
                        ExceptionUtils.sanitizeStackTrace(t, TypeScriptParserVisitor.class));
                element = element.withSource(element.getSource().withMarkers(Markers.EMPTY.withMarkers(singletonList(parseExceptionResult))));
                visited = element;
                if (markers == null) {
                    markers = Markers.build(singletonList(parseExceptionResult));
                }
            }

            if (visited != null) {
                if (!(visited instanceof Statement) && visited instanceof Expression) {
                    visited = new JS.ExpressionStatement(randomId(), (Expression) visited);
                }
                statements.add(maybeSemicolon((Statement) visited));
            }
        }

        if (markers == null) {
            for (JRightPadded<Statement> statement : statements) {
                if (statement.getElement() instanceof JS.UnknownElement) {
                    ParseExceptionResult result = ((JS.UnknownElement) statement.getElement()).getSource().getMarkers().findFirst(ParseExceptionResult.class).orElse(null);
                    if (result != null) {
                        markers = Markers.build(singletonList(result));
                        break;
                    }
                }
            }
        }

        Space eof = whitespace();
        eof = eof.withWhitespace(eof.getWhitespace() + (getCursor() < source.length() ? source.substring(getCursor()) : ""));
        return new JS.CompilationUnit(
                randomId(),
                prefix,
                markers == null ? Markers.EMPTY : markers,
                sourcePath,
                FileAttributes.fromPath(sourcePath),
                charset,
                isCharsetBomMarked,
                null,
                emptyList(),
                statements,
                eof
        );
    }

    private J.Assignment visitAssignment(TSCNode node) {
        Space prefix = whitespace();
        Expression left = (Expression) visitNode(node.getNodeProperty("left"));
        Space before = sourceBefore("=");
        Expression right = (Expression) visitNode(node.getNodeProperty("right"));
        return new J.Assignment(
                randomId(),
                prefix,
                Markers.EMPTY,
                left,
                padLeft(before, right),
                typeMapping.type(node)
        );
    }

    private J.AssignmentOperation visitAssignmentOperation(TSCNode node) {
        Space prefix = whitespace();
        Expression left = (Expression) visitNode(node.getNodeProperty("left"));
        JLeftPadded<J.AssignmentOperation.Type> op = null;
        TSCSyntaxKind opKind = node.getNodeProperty("operatorToken").syntaxKind();
        switch (opKind) {
            case AsteriskEqualsToken:
                op = padLeft(sourceBefore("*="), J.AssignmentOperation.Type.Multiplication);
                break;
            case MinusEqualsToken:
                op = padLeft(sourceBefore("-="), J.AssignmentOperation.Type.Subtraction);
                break;
            case PercentEqualsToken:
                op = padLeft(sourceBefore("%="), J.AssignmentOperation.Type.Modulo);
                break;
            case PlusEqualsToken:
                op = padLeft(sourceBefore("+="), J.AssignmentOperation.Type.Addition);
                break;
            case SlashEqualsToken:
                op = padLeft(sourceBefore("/="), J.AssignmentOperation.Type.Division);
                break;
            default:
                implementMe(node);
        }

        Expression right = (Expression) visitNode(node.getNodeProperty("right"));
        return new J.AssignmentOperation(
                randomId(),
                prefix,
                Markers.EMPTY,
                left,
                op,
                right,
                typeMapping.type(node)
        );
    }

    private J visitArrayBindingPattern(TSCNode node) {
        implementMe(node);
        return null;
    }

    private J visitArrowFunction(TSCNode node) {
        implementMe(node, "modifiers");
        implementMe(node, "typeParameters");
        implementMe(node, "typeArguments");

        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> annotations = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), annotations);

        int saveCursor = getCursor();
        Space before = whitespace();
        TSCSyntaxKind next = scan();
        boolean parenthesized = next == TSCSyntaxKind.OpenParenToken;
        if (!parenthesized) {
            before = EMPTY;
            cursor(saveCursor);
        }

        List<TSCNode> paramNodes = node.getNodeListProperty("parameters");
        J.Lambda.Parameters params = new J.Lambda.Parameters(
                randomId(),
                before,
                Markers.EMPTY,
                parenthesized,
                paramNodes.isEmpty() ? singletonList(padRight(new J.Empty(randomId(), EMPTY, Markers.EMPTY), parenthesized ? sourceBefore(")") : EMPTY)) :
                        convertAll(node.getNodeListProperty("parameters"), commaDelim, parenthesized ? t -> sourceBefore(")") : noDelim)
        );

        TSCNode typeNode = node.getOptionalNodeProperty("type");
        TypeTree returnTypeExpression = null;
        if (typeNode != null) {
            Space beforeColon = sourceBefore(":");
            if (beforeColon != EMPTY) {
                markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
            }
            returnTypeExpression = (TypeTree) visitNode(typeNode);
        }

        return new JS.ArrowFunction(
                randomId(),
                prefix,
                markers,
                annotations,
                modifiers,
                params,
                returnTypeExpression,
                sourceBefore("=>"),
                visitNode(node.getOptionalNodeProperty("body")),
                typeMapping.type(node)
        );
    }

    private J.NewArray visitArrayLiteralExpression(TSCNode node) {
        Space prefix = whitespace();

        JContainer<J> jContainer = mapContainer(
                "[",
                node.getNodeListProperty("elements"),
                ",",
                "]",
                this::visitNode
        );
        List<JRightPadded<Expression>> elements = jContainer.getPadding().getElements().stream()
                .map(it -> {
                    Expression exp = (!(it.getElement() instanceof Expression) && it.getElement() instanceof Statement) ?
                            new JS.StatementExpression(randomId(), (Statement) it.getElement()) : (Expression)  it.getElement();
                    return padRight(exp, it.getAfter(), it.getMarkers());
                })
                .collect(Collectors.toList());
        JContainer<Expression> arguments = JContainer.build(jContainer.getBefore(), elements, jContainer.getMarkers());

        return new J.NewArray(
                randomId(),
                prefix,
                Markers.EMPTY,
                null,
                emptyList(),
                arguments,
                typeMapping.type(node)
        );
    }

    private J.TypeCast visitAsExpression(TSCNode node) {
        Space prefix = whitespace();
        Expression nameExpr = (Expression) visitNode(node.getNodeProperty("expression"));
        Space asPrefix = sourceBefore("as");
        TypeTree type = visitIdentifier(node.getNodeProperty("type"));

        J.ControlParentheses<TypeTree> control = new J.ControlParentheses<>(
                randomId(),
                asPrefix,
                Markers.EMPTY,
                padRight(type, whitespace())
        );

        return new J.TypeCast(
                randomId(),
                prefix,
                Markers.EMPTY,
                control,
                nameExpr
        );
    }

    private J.Binary visitBinary(TSCNode node) {
        Space prefix = whitespace();
        Expression left = (Expression) visitNode(node.getNodeProperty("left"));

        Space opPrefix = whitespace();
        JLeftPadded<J.Binary.Type> op = null;
        TSCSyntaxKind opKind = node.getNodeProperty("operatorToken").syntaxKind();
        switch (opKind) {
            // Bitwise ops
            case AmpersandToken:
                skip("&");
                op = padLeft(opPrefix, J.Binary.Type.BitAnd);
                break;
            case BarToken:
                skip("|");
                op = padLeft(opPrefix, J.Binary.Type.BitOr);
                break;
            case CaretToken:
                skip("^");
                op = padLeft(opPrefix, J.Binary.Type.BitXor);
                break;
            case GreaterThanGreaterThanToken:
                skip(">>");
                op = padLeft(opPrefix, J.Binary.Type.RightShift);
                break;
            case LessThanLessThanToken:
                skip("<<");
                op = padLeft(opPrefix, J.Binary.Type.LeftShift);
                break;
            // Logical ops
            case AmpersandAmpersandToken:
                skip("&&");
                op = padLeft(opPrefix, J.Binary.Type.And);
                break;
            case BarBarToken:
                skip("||");
                op = padLeft(opPrefix, J.Binary.Type.Or);
                break;
            case EqualsEqualsToken:
                skip("==");
                op = padLeft(opPrefix, J.Binary.Type.Equal);
                break;
            case ExclamationEqualsToken:
                skip("!=");
                op = padLeft(opPrefix, J.Binary.Type.NotEqual);
                break;
            case GreaterThanToken:
                skip(">");
                op = padLeft(opPrefix, J.Binary.Type.GreaterThan);
                break;
            case GreaterThanEqualsToken:
                skip(">=");
                op = padLeft(opPrefix, J.Binary.Type.GreaterThanOrEqual);
                break;
            case GreaterThanGreaterThanGreaterThanToken:
                skip(">>>");
                op = padLeft(opPrefix, J.Binary.Type.UnsignedRightShift);
                break;
            case LessThanToken:
                skip("<");
                op = padLeft(opPrefix, J.Binary.Type.LessThan);
                break;
            case LessThanEqualsToken:
                skip("<=");
                op = padLeft(opPrefix, J.Binary.Type.LessThanOrEqual);
                break;
            // Arithmetic ops
            case AsteriskToken:
                skip("*");
                op = padLeft(opPrefix, J.Binary.Type.Multiplication);
                break;
            case MinusToken:
                skip("-");
                op = padLeft(opPrefix, J.Binary.Type.Subtraction);
                break;
            case PercentToken:
                skip("%");
                op = padLeft(opPrefix, J.Binary.Type.Modulo);
                break;
            case PlusToken:
                skip("+");
                op = padLeft(opPrefix, J.Binary.Type.Addition);
                break;
            case SlashToken:
                skip("/");
                op = padLeft(opPrefix, J.Binary.Type.Division);
                break;
            default:
                implementMe(node);
        }

        Expression right = (Expression) visitNode(node.getNodeProperty("right"));
        return new J.Binary(
                randomId(),
                prefix,
                Markers.EMPTY,
                left,
                op,
                right,
                typeMapping.type(node)
        );
    }

    private J visitBinaryExpression(TSCNode node) {
        TSCSyntaxKind opKind = node.getNodeProperty("operatorToken").syntaxKind();
        // TS represents J.Assignment, J.AssignmentOperation, and J.Binary as a BinaryExpression.
        switch (opKind) {
            case EqualsToken:
                return visitAssignment(node);
            case AsteriskEqualsToken:
            case MinusEqualsToken:
            case PercentEqualsToken:
            case PlusEqualsToken:
            case SlashEqualsToken:
                return visitAssignmentOperation(node);
            case AmpersandToken:
            case AmpersandAmpersandToken:
            case AsteriskToken:
            case BarToken:
            case BarBarToken:
            case CaretToken:
            case EqualsEqualsToken:
            case ExclamationEqualsToken:
            case GreaterThanToken:
            case GreaterThanEqualsToken:
            case GreaterThanGreaterThanToken:
            case GreaterThanGreaterThanGreaterThanToken:
            case LessThanToken:
            case LessThanEqualsToken:
            case LessThanLessThanToken:
            case MinusToken:
            case PercentToken:
            case PlusToken:
            case SlashToken:
                return visitBinary(node);
            case EqualsEqualsEqualsToken:
            case ExclamationEqualsEqualsToken:
                return visitJsBinary(node);
            case InstanceOfKeyword:
                return visitInstanceOf(node);
            default:
                implementMe(node.getNodeProperty("operatorToken"));
        }

        return null;
    }

    private void visitBinaryUpdateExpression(TSCNode incrementor, List<JRightPadded<Statement>> updates) {
        assert (incrementor.syntaxKind() == TSCSyntaxKind.BinaryExpression);
        TSCNode left = incrementor.getNodeProperty("left");
        if (left.syntaxKind() == TSCSyntaxKind.BinaryExpression) {
            visitBinaryUpdateExpression(left, updates);
        } else {
            updates.add(padRight((Statement) visitNode(left), sourceBefore(",")));
        }
        Statement r = (Statement) visitNode(incrementor.getNodeProperty("right"));
        Space after = whitespace();
        if (source.charAt(getCursor()) == ',') {
            skip(",");
        } else if (source.charAt(getCursor()) == ')') {
            skip(")");
        }
        updates.add(padRight(r, after));
    }

    @Nullable
    private J.Block visitBlock(@Nullable TSCNode node) {
        if (node == null) {
            return null;
        }

        Space prefix = sourceBefore("{");

        List<TSCNode> statementNodes = node.getNodeListProperty("statements");
        List<JRightPadded<Statement>> statements = new ArrayList<>(statementNodes.size());

        for (TSCNode statementNode : statementNodes) {
            statements.add(visitStatement(statementNode));
        }

        Space endOfBlock = sourceBefore("}");
        return new J.Block(
                randomId(),
                prefix,
                Markers.EMPTY,
                JRightPadded.build(false),
                statements,
                endOfBlock
        );
    }

    private J.Break visitBreakStatement(TSCNode node) {
        return new J.Break(
                randomId(),
                sourceBefore("break"),
                Markers.EMPTY,
                node.hasProperty("label") ? (J.Identifier) visitNode(node.getNodeProperty("label")) : null
        );
    }

    private J.MethodInvocation visitCallExpression(TSCNode node) {
        implementMe(node, "questionDotToken");
        implementMe(node, "typeArguments");

        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        JRightPadded<Expression> select = null;
        TSCNode expression = node.getNodeProperty("expression");
        if (expression.hasProperty("expression")) {
            // Adjust padding.
            implementMe(expression, "questionDotToken");

            if (expression.syntaxKind() == TSCSyntaxKind.PropertyAccessExpression) {
                select = padRight((Expression) visitNode(expression.getNodeProperty("expression")), sourceBefore("."));
            } else if (expression.syntaxKind() == TSCSyntaxKind.ParenthesizedExpression) {
                markers = markers.addIfAbsent(new OmitDot(randomId()));
                select = padRight((Expression) visitNode(expression), whitespace());
            } else {
                implementMe(expression);
            }
        }

        JavaType.Method type = typeMapping.methodInvocationType(node);
        J.Identifier name = null;
        if (expression.hasProperty("name")) {
            name = visitIdentifier(expression.getNodeProperty("name"), type);
        } else if (expression.syntaxKind() == TSCSyntaxKind.Identifier) {
            name = visitIdentifier(expression, type);
        } else if (expression.syntaxKind() == TSCSyntaxKind.SuperKeyword) {
            name = convertToIdentifier(sourceBefore("super"), "super");
        } else if (expression.syntaxKind() == TSCSyntaxKind.ParenthesizedExpression) {
            // FIXME. @Gary.
            //  This block of code means the call expression has multiple names via the select expression.
            //  It's probably better to add a new JS LST object to represent this to enable JS recipes to detect and handle this case.
            //  However, there are currently too many unknowns. So, it's added to J via the select `Expression` field.
            //  Due to type-mapping, method matchers will not detect this code, which will prevent invalid changes.
            name = convertToIdentifier(EMPTY, "");
        } else {
            implementMe(expression);
        }

        JContainer<Expression> typeParameters = null;

        List<TSCNode> tpNodes = node.getOptionalNodeListProperty("typeParameters");
        if (tpNodes != null) {
            JContainer<J> jContainer = mapContainer(
                    "<",
                    tpNodes,
                    ",",
                    ">",
                    this::visitNode
            );

            List<JRightPadded<Expression>> typeParams = jContainer.getPadding().getElements().stream()
                    .map(it -> {
                        Expression exp = (!(it.getElement() instanceof Expression) && it.getElement() instanceof Statement) ?
                                new JS.StatementExpression(randomId(), (Statement) it.getElement()) : (Expression)  it.getElement();
                        return padRight(exp, it.getAfter(), it.getMarkers());
                    })
                    .collect(Collectors.toList());
            typeParameters = JContainer.build(jContainer.getBefore(), typeParams, jContainer.getMarkers());
        }

        JContainer<Expression> arguments = null;
        if (node.hasProperty("arguments")) {
            JContainer<J> jContainer = mapContainer(
                    "(",
                    node.getNodeListProperty("arguments"),
                    ",",
                    ")",
                    this::visitNode
            );
            List<JRightPadded<Expression>> elements = jContainer.getPadding().getElements().stream()
                    .map(it -> {
                        Expression exp = (!(it.getElement() instanceof Expression) && it.getElement() instanceof Statement) ?
                            new JS.StatementExpression(randomId(), (Statement) it.getElement()) : (Expression)  it.getElement();
                        return padRight(exp, it.getAfter(), it.getMarkers());
                    })
                    .collect(Collectors.toList());
            arguments = JContainer.build(jContainer.getBefore(), elements, jContainer.getMarkers());
        }

        return new J.MethodInvocation(
                randomId(),
                prefix,
                markers,
                select,
                typeParameters,
                name,
                arguments,
                type
        );
    }

    private J.ClassDeclaration visitClassDeclaration(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> leadingAnnotation = new ArrayList<>();
        List<J.Modifier> modifiers;
        List<TSCNode> modifierNodes = node.getOptionalNodeListProperty("modifiers");
        if (modifierNodes != null) {
            modifiers = mapModifiers(node.getNodeListProperty("modifiers"), leadingAnnotation);
        } else {
            modifiers = emptyList();
        }

        List<J.Annotation> kindAnnotations = emptyList();

        Space kindPrefix;
        TSCSyntaxKind syntaxKind = node.syntaxKind();
        J.ClassDeclaration.Kind.Type type;
        switch (syntaxKind) {
            case EnumDeclaration:
                kindPrefix = sourceBefore("enum");
                type = J.ClassDeclaration.Kind.Type.Enum;
                break;
            case InterfaceDeclaration:
                kindPrefix = sourceBefore("interface");
                type = J.ClassDeclaration.Kind.Type.Interface;
                break;
            default:
                kindPrefix = whitespace();
                skip("class");
                type = J.ClassDeclaration.Kind.Type.Class;
        }

        J.ClassDeclaration.Kind kind = new J.ClassDeclaration.Kind(randomId(), kindPrefix, Markers.EMPTY, kindAnnotations, type);

        J.Identifier name;
        if (node.hasProperty("name")) {
            name = visitIdentifier(node.getNodeProperty("name"));
        } else {
            name = convertToIdentifier(EMPTY, "");
        }

        JContainer<J.TypeParameter> typeParams = !node.hasProperty("typeParameters") ? null : mapContainer(
                "<",
                node.getNodeListProperty("typeParameters"),
                ",",
                ">",
                t -> (J.TypeParameter) visitNode(t)
        );

        JLeftPadded<TypeTree> extendings = null;
        JContainer<TypeTree> implementings = null;
        if (node.hasProperty("heritageClauses")) {
            for (TSCNode tscNode : node.getNodeListProperty("heritageClauses")) {
                if (TSCSyntaxKind.fromCode(tscNode.getIntProperty("token")) == TSCSyntaxKind.ExtendsKeyword) {
                    List<TSCNode> types = tscNode.getNodeListProperty("types");
                    assert types.size() == 1;
                    extendings = padLeft(sourceBefore("extends"), (TypeTree) visitNode(types.get(0)));
                } else {
                    implementMe(tscNode);
                }
            }
        }

        J.Block body;
        List<JRightPadded<Statement>> members;
        if (node.hasProperty("members")) {
            Space bodyPrefix = sourceBefore("{");

            TSCNodeList memberNodes = node.getNodeListProperty("members");
            if (kind.getType() == J.ClassDeclaration.Kind.Type.Enum) {
                Space enumPrefix = whitespace();

                members = new ArrayList<>(1);
                List<JRightPadded<J.EnumValue>> enumValues = new ArrayList<>(memberNodes.size());
                for (int i = 0; i < memberNodes.size(); i++) {
                    TSCNode enumValue = memberNodes.get(i);
                    J.EnumValue value = (J.EnumValue) visitNode(enumValue);
                    if (value != null) {
                        boolean hasTrailingComma = i == memberNodes.size() - 1 && memberNodes.getBooleanProperty("hasTrailingComma");
                        Space after = i < memberNodes.size() - 1 ? sourceBefore(",") :
                                hasTrailingComma ? sourceBefore(",") : EMPTY;
                        JRightPadded<J.EnumValue> ev = padRight(value, after);
                        if (i == memberNodes.size() - 1) {
                            if (hasTrailingComma) {
                                ev = ev.withMarkers(ev.getMarkers().addIfAbsent(new TrailingComma(randomId(), EMPTY)));
                            }
                        }
                        enumValues.add(ev);
                    }
                }

                JRightPadded<Statement> enumSet = maybeSemicolon(
                        new J.EnumValueSet(
                                randomId(),
                                enumPrefix,
                                Markers.EMPTY,
                                enumValues,
                                false
                        )
                );
                members.add(enumSet);
            } else {
                members = new ArrayList<>(memberNodes.size());
                for (TSCNode statement : memberNodes) {
                    members.add(visitStatement(statement));
                }
            }

            body = new J.Block(randomId(), bodyPrefix, Markers.EMPTY, new JRightPadded<>(false, EMPTY, Markers.EMPTY),
                    members, sourceBefore("}"));
        } else {
            // This shouldn't happen.
            throw new UnsupportedOperationException("Add support for empty body");
        }

        JContainer<Statement> primaryConstructor = null;

        return new J.ClassDeclaration(
                randomId(),
                prefix,
                markers,
                leadingAnnotation.isEmpty() ? emptyList() : leadingAnnotation,
                modifiers,
                kind,
                name,
                typeParams,
                primaryConstructor,
                extendings,
                implementings,
                null,
                body,
                (JavaType.FullyQualified) typeMapping.type(node));
    }

    private J.Ternary visitConditionalExpression(TSCNode node) {
        return new J.Ternary(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                (Expression) visitNode(node.getNodeProperty("condition")),
                padLeft(sourceBefore("?"), (Expression) visitNode(node.getNodeProperty("whenTrue"))),
                padLeft(sourceBefore(":"), (Expression) visitNode(node.getNodeProperty("whenFalse"))),
                typeMapping.type(node)
        );
    }

    private J.Continue visitContinueStatement(TSCNode node) {
        return new J.Continue(
                randomId(),
                sourceBefore("continue"),
                Markers.EMPTY,
                node.hasProperty("label") ? (J.Identifier) visitNode(node.getNodeProperty("label")) : null
        );
    }

    private J.MethodDeclaration visitConstructor(TSCNode node) {
        implementMe(node, "type");
        implementMe(node, "typeArguments");

        Space prefix = whitespace();
        List<J.Modifier> modifiers;
        List<J.Annotation> leadingAnnotations = new ArrayList<>();
        if (node.hasProperty("modifiers")) {
            modifiers = mapModifiers(node.getNodeListProperty("modifiers"), leadingAnnotations);
        } else {
            modifiers = emptyList();
        }

        Space before = sourceBefore("constructor");
        J.Identifier name = convertToIdentifier(before, "constructor");
        J.TypeParameters typeParameters = mapTypeParameters(node.getOptionalNodeListProperty("typeParameters"));

        JContainer<Statement> params = mapContainer(
                "(",
                node.getNodeListProperty("parameters"),
                ",",
                ")",
                t -> (Statement) visitNode(t));

        J.Block body = (J.Block) visitNode(node.getNodeProperty("body"));

        return new J.MethodDeclaration(
                randomId(),
                prefix,
                Markers.EMPTY,
                leadingAnnotations.isEmpty() ? emptyList() : leadingAnnotations,
                modifiers,
                typeParameters,
                null,
                new J.MethodDeclaration.IdentifierWithAnnotations(name, Collections.emptyList()),
                params,
                null,
                body,
                null,
                typeMapping.methodDeclarationType(node)
        );
    }

    private J.Annotation visitDecorator(TSCNode node) {
        Space prefix = sourceBefore("@");
        implementMe(node, "questionDotToken");
        implementMe(node, "typeArguments");
        TSCNode callExpression = node.getNodeProperty("expression");
        NameTree name = (NameTree) visitNameExpression(callExpression.getNodeProperty("expression"));
        JContainer<Expression> arguments = null;
        if (callExpression.hasProperty("arguments")) {
            JContainer<J> jContainer = mapContainer(
                    "(",
                    callExpression.getNodeListProperty("arguments"),
                    ",",
                    ")",
                    this::visitNode
            );

            List<JRightPadded<Expression>> elements = jContainer.getPadding().getElements().stream()
                    .map(it -> {
                        Expression exp = (!(it.getElement() instanceof Expression) && it.getElement() instanceof Statement) ?
                                new JS.StatementExpression(randomId(), (Statement) it.getElement()) : (Expression)  it.getElement();
                        return padRight(exp, it.getAfter(), it.getMarkers());
                    })
                    .collect(Collectors.toList());
            arguments = JContainer.build(jContainer.getBefore(), elements, jContainer.getMarkers());
        }
        return new J.Annotation(
                randomId(),
                prefix,
                Markers.EMPTY,
                name,
                arguments
        );
    }

    private J.DoWhileLoop visitDoStatement(TSCNode node) {
        Space prefix = sourceBefore("do");
        JRightPadded<Statement> body = maybeSemicolon((Statement) visitNode(node.getNodeProperty("statement")));

        JLeftPadded<J.ControlParentheses<Expression>> control =
                padLeft(sourceBefore("while"), mapControlParentheses(node.getNodeProperty("expression")));
        return new J.DoWhileLoop(
                randomId(),
                prefix,
                Markers.EMPTY,
                body,
                control
        );
    }

    private J.ArrayAccess visitElementAccessExpression(TSCNode node) {
        implementMe(node, "questionDotToken");
        return new J.ArrayAccess(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                (Expression) visitNode(node.getNodeProperty("expression")),
                new J.ArrayDimension(
                        randomId(),
                        sourceBefore("["),
                        Markers.EMPTY,
                        padRight((Expression) visitNode(node.getNodeProperty("argumentExpression")), sourceBefore("]"))
                ),
                typeMapping.type(node)
        );
    }

    private Statement visitEmptyStatement(TSCNode ignored) {
        return new J.Empty(randomId(), EMPTY, Markers.EMPTY);
    }

    private J.EnumValue visitEnumMember(TSCNode node) {
        return new J.EnumValue(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                emptyList(),
                visitIdentifier(node.getNodeProperty("name")),
                null);
    }

    private JS.Export visitExportAssignment(TSCNode node) {
        Space prefix = sourceBefore("export");
        implementMe(node, "isExportEquals");
        return new JS.Export(
                randomId(),
                prefix,
                Markers.EMPTY,
                null,
                null,
                null,
                padLeft(sourceBefore("default"), (Expression) visitNode(node.getNodeProperty("expression")))
        );
    }

    private JS.Export visitExportDeclaration(TSCNode node) {
        implementMe(node, "assertClause");
        implementMe(node, "modifiers");

        Space prefix = sourceBefore("export");
        boolean isTypeOnly = node.getBooleanProperty("isTypeOnly");
        if (isTypeOnly) {
            implementMe(node);
        }

        TSCNode exportClause = node.getOptionalNodeProperty("exportClause");
        JContainer<Expression> exports;
        if (exportClause != null) {
            if (exportClause.syntaxKind() != TSCSyntaxKind.NamedExports) {
                implementMe(exportClause);
            }

            List<TSCNode> elements = exportClause.getOptionalNodeListProperty("elements");
            if (elements == null) {
                implementMe(exportClause);
            }
            exports = mapContainer(
                    "{",
                    elements,
                    ",",
                    "}",
                    t -> (Expression) visitNode(t)
            ).withMarkers(Markers.build(singletonList(new Braces(randomId()))));
        } else {
            exports = JContainer.build(sourceBefore("*"),
                    singletonList(padRight(convertToIdentifier(EMPTY, "*"), EMPTY)), Markers.EMPTY);
        }

        TSCNode moduleSpecifier = node.getOptionalNodeProperty("moduleSpecifier");
        Space beforeFrom = moduleSpecifier == null ? null : sourceBefore("from");
        J.Literal target = null;
        if (moduleSpecifier != null) {
            Space before = whitespace();
            String nodeText = moduleSpecifier.getText();
            skip(nodeText);
            target = new J.Literal(
                    randomId(),
                    before,
                    Markers.EMPTY,
                    moduleSpecifier.getStringProperty("text"),
                    nodeText,
                    null,
                    JavaType.Primitive.None
            );
        }
        return new JS.Export(
                randomId(),
                prefix,
                Markers.EMPTY,
                exports,
                beforeFrom,
                target,
                null
        );
    }

    private J visitExportSpecifier(TSCNode node) {
        boolean isTypeOnly = node.getBooleanProperty("isTypeOnly");
        if (isTypeOnly) {
            implementMe(node);
        }
        TSCNode propertyName = node.getOptionalNodeProperty("propertyName");
        if (propertyName != null) {
            return new JS.Alias(
                    randomId(),
                    whitespace(),
                    Markers.EMPTY,
                    padRight((J.Identifier) visitNode(propertyName), sourceBefore("as")),
                    (J.Identifier) visitNode(node.getNodeProperty("name"))
            );
        }

        return visitNode(node.getNodeProperty("name"));
    }

    public J visitExpressionStatement(TSCNode node) {
        return visitNode(node.getNodeProperty("expression"));
    }


    private J.ForLoop visitForStatement(TSCNode node) {
        Space prefix = sourceBefore("for");

        Space beforeControl = sourceBefore("(");
        List<JRightPadded<Statement>> initStatements = singletonList(padRight((Statement) visitNode(node.getNodeProperty("initializer")), whitespace()));
        skip(";");

        JRightPadded<Expression> condition = padRight((Expression) visitNode(node.getNodeProperty("condition")), sourceBefore(";"));

        TSCNode incrementor = node.getNodeProperty("incrementor");
        List<JRightPadded<Statement>> update;
        if (incrementor.syntaxKind() == TSCSyntaxKind.BinaryExpression) {
            update = new ArrayList<>(2);
            visitBinaryUpdateExpression(incrementor, update);
        } else {
            update = singletonList(padRight((Statement) visitNode(incrementor), sourceBefore(")")));
        }
        J.ForLoop.Control control = new J.ForLoop.Control(
                randomId(),
                beforeControl,
                Markers.EMPTY,
                initStatements,
                condition,
                update
        );

        return new J.ForLoop(
                randomId(),
                prefix,
                Markers.EMPTY,
                control,
                maybeSemicolon((Statement) visitNode(node.getNodeProperty("statement")))
        );
    }

    private J.ForEachLoop visitForEachStatement(TSCNode node) {
        Space prefix = sourceBefore("for");
        Markers markers = Markers.EMPTY;
        implementMe(node, "awaitModifier");

        Space beforeControl = sourceBefore("(");
        JRightPadded<J.VariableDeclarations> variable = padRight((J.VariableDeclarations) visitNode(node.getNodeProperty("initializer")), whitespace());

        TSCSyntaxKind forEachKind = scan();
        if (forEachKind == TSCSyntaxKind.OfKeyword) {
            markers = markers.addIfAbsent(new ForLoopType(randomId(), ForLoopType.Keyword.OF));
        } else if (forEachKind == TSCSyntaxKind.InKeyword) {
            markers = markers.addIfAbsent(new ForLoopType(randomId(), ForLoopType.Keyword.IN));
        }

        JRightPadded<Expression> iterable = padRight((Expression) visitNode(node.getNodeProperty("expression")), sourceBefore(")"));
        J.ForEachLoop.Control control = new J.ForEachLoop.Control(
                randomId(),
                beforeControl,
                Markers.EMPTY,
                variable,
                iterable
        );

        JRightPadded<Statement> statement = maybeSemicolon((Statement) visitNode(node.getNodeProperty("statement")));
        return new J.ForEachLoop(
                randomId(),
                prefix,
                markers,
                control,
                statement
        );
    }

    private J visitExpressionWithTypeArguments(TSCNode node) {
        Space prefix = whitespace();
        NameTree nameTree = (NameTree) visitNode(node.getNodeProperty("expression"));
        List<TSCNode> typeArguments = node.getOptionalNodeListProperty("typeArguments");
        if (typeArguments != null) {
            return new J.ParameterizedType(
                    randomId(),
                    prefix,
                    Markers.EMPTY,
                    nameTree,
                    mapContainer(
                            "<",
                            typeArguments,
                            ",",
                            ">",
                            t -> (Expression) visitNode(t)
                    ),
                    typeMapping.type(node)
            );
        }

        return nameTree.withPrefix(prefix);
    }

    private J.MethodDeclaration visitFunctionDeclaration(TSCNode node) {
        implementMe(node, "asteriskToken");
        implementMe(node, "typeArguments");

        Space prefix = whitespace();

        List<J.Annotation> annotations = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), annotations);

        Space before = sourceBefore("function");
        Markers markers = Markers.build(singletonList(new FunctionKeyword(randomId(), before)));

        J.Identifier name;
        JavaType.Method method = typeMapping.methodDeclarationType(node);
        if (node.hasProperty("name")) {
            name = visitIdentifier(node.getNodeProperty("name"));
        } else {
            // FIXME: get input, we can add an anonymous name and prevent printing with a marker.
            // Function expressions do not require a name `function (..)`
            name = convertToIdentifier(EMPTY, "");
        }

        name = name.withType(method);

        J.TypeParameters typeParameters = mapTypeParameters(node.getOptionalNodeListProperty("typeParameters"));
        JContainer<Statement> parameters = mapContainer(
                "(",
                node.getNodeListProperty("parameters"),
                ",",
                ")",
                this::visitFunctionParameter
        );

        TSCNode typeNode = node.getOptionalNodeProperty("type");
        TypeTree returnTypeExpression = null;
        if (typeNode != null) {
            Space beforeColon = sourceBefore(":");
            if (beforeColon != EMPTY) {
                markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
            }
            returnTypeExpression = (TypeTree) visitNode(typeNode);
        }

        J.Block block = visitBlock(node.getOptionalNodeProperty("body"));

        return new J.MethodDeclaration(
                randomId(),
                prefix,
                markers,
                annotations,
                modifiers,
                typeParameters,
                returnTypeExpression,
                new J.MethodDeclaration.IdentifierWithAnnotations(name, Collections.emptyList()),
                parameters,
                null,
                block,
                null,
                method
        );
    }

    private Statement visitFunctionParameter(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> leadingAnnotations = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leadingAnnotations);

        Space variablePrefix = whitespace();
        J.Identifier name = visitIdentifier(node.getNodeProperty("name"));

        TypeTree typeTree = null;
        TSCNode type = node.getOptionalNodeProperty("type");
        if (type != null) {
            TSCNode questionToken = node.getOptionalNodeProperty("questionToken");
            if (questionToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore("?"), PostFixOperator.Operator.QuestionMark));
            }
            Space beforeColon = sourceBefore(":");
            if (beforeColon != EMPTY) {
                markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
            }
            typeTree = (TypeTree) visitNode(type);
        }
        List<JRightPadded<J.VariableDeclarations.NamedVariable>> variables = new ArrayList<>(1);
        variables.add(padRight(new J.VariableDeclarations.NamedVariable(
                randomId(),
                variablePrefix,
                Markers.EMPTY,
                name,
                emptyList(),
                null,
                typeMapping.variableType(node)
        ), EMPTY));

        implementMe(node, "initializer");

        Space varargs = null;
        List<JLeftPadded<Space>> dimensionsBeforeName = emptyList();

        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                leadingAnnotations.isEmpty() ? emptyList() : leadingAnnotations,
                modifiers,
                typeTree,
                varargs,
                dimensionsBeforeName,
                variables
        );
    }

    private J visitExternalModuleReference(TSCNode node) {
        Space prefix = whitespace();

        skip("require");
        J.Identifier name = convertToIdentifier(EMPTY, "require");

        return new J.MethodInvocation(
                randomId(),
                prefix,
                Markers.EMPTY,
                null,
                null,
                name,
                mapContainer(
                        "(",
                        singletonList(node.getNodeProperty("expression")),
                        ",",
                        ")",
                        t -> (Expression) visitNode(t)
                ),
                null
        );
    }

    private J.Identifier visitIdentifier(TSCNode node) {
        return visitIdentifier(node, null, null);
    }

    private J.Identifier visitIdentifier(TSCNode node, @Nullable JavaType type) {
        return visitIdentifier(node, type, null);
    }

    private J.Identifier visitIdentifier(TSCNode node, @Nullable JavaType type, @Nullable JavaType.Variable fieldType) {
        Space prefix = whitespace();
        String text = node.getText();
        skip(text);
        // TODO: check on escapedText property.
        return new J.Identifier(
                randomId(),
                prefix,
                Markers.EMPTY,
                text,
                type == null ? typeMapping.type(node) : type,
                fieldType
        );
    }

    private J visitImportDeclaration(TSCNode node) {
        implementMe(node, "assertClause");
        implementMe(node, "modifiers");

        Space prefix = sourceBefore("import");

        TSCNode importClause = node.getOptionalNodeProperty("importClause");
        JRightPadded<J.Identifier> name = null;
        JContainer<Expression> imports = null;
        if (importClause != null) {
            boolean isTypeOnly = importClause.getBooleanProperty("isTypeOnly");
            if (isTypeOnly) {
                implementMe(importClause, "isTypeOnly");
            }

            TSCNode nameNode = importClause.getOptionalNodeProperty("name");
            if (nameNode != null) {
                name = padRight((J.Identifier) visitNode(nameNode), whitespace());
            }

            TSCNode namedBindings = importClause.getOptionalNodeProperty("namedBindings");
            if (namedBindings != null) {
                if (name != null) {
                    skip(",");
                }

                imports = mapContainer(
                        "{",
                        namedBindings.getNodeListProperty("elements"),
                        ",",
                        "}",
                        t -> (Expression) visitNode(t)
                ).withMarkers(Markers.build(singletonList(new Braces(randomId()))));
            }
        }

        TSCNode moduleSpecifier = node.getOptionalNodeProperty("moduleSpecifier");
        Space beforeFrom = moduleSpecifier == null ? null : sourceBefore("from");
        J.Literal target = null;
        if (moduleSpecifier != null) {
            Space before = whitespace();
            String nodeText = moduleSpecifier.getText();
            skip(nodeText);
            target = new J.Literal(
                    randomId(),
                    before,
                    Markers.EMPTY,
                    moduleSpecifier.getStringProperty("text"),
                    nodeText,
                    null,
                    JavaType.Primitive.None
            );
        }

        JLeftPadded<Expression> initializer = null;
        TSCNode moduleReference = node.getOptionalNodeProperty("moduleReference");
        if (moduleReference != null) {
            name = padRight((J.Identifier) visitNode(node.getNodeProperty("name")), whitespace());
            initializer = padLeft(sourceBefore("="), (Expression) visitNode(moduleReference));
        }

        return new JS.JsImport(
                randomId(),
                prefix,
                Markers.EMPTY,
                name,
                imports,
                beforeFrom,
                target,
                initializer
        );
    }

    private J visitIndexedAccessType(TSCNode node) {
        return unknownElement(node);
    }

    private J.If visitIfStatement(TSCNode node) {
        Space prefix = sourceBefore("if");

        J.ControlParentheses<Expression> control = mapControlParentheses(node.getNodeProperty("expression"));
        JRightPadded<Statement> thenPart = visitStatement(node.getNodeProperty("thenStatement"));

        J.If.Else elsePart = null;
        if (node.hasProperty("elseStatement")) {
            Space elsePartPrefix = sourceBefore("else");
            elsePart = new J.If.Else(
                    randomId(),
                    elsePartPrefix,
                    Markers.EMPTY,
                    visitStatement(node.getNodeProperty("elseStatement"))
            );
        }
        return new J.If(
                randomId(),
                prefix,
                Markers.EMPTY,
                control,
                thenPart,
                elsePart
        );
    }

    private J.InstanceOf visitInstanceOf(TSCNode node) {
        return new J.InstanceOf(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                padRight((Expression) visitNode(node.getNodeProperty("left")), sourceBefore("instanceof")),
                visitNode(node.getNodeProperty("right")),
                null,
                typeMapping.type(node)
        );
    }

    private JS.JsBinary visitJsBinary(TSCNode node) {
        Space prefix = whitespace();
        Expression left = (Expression) visitNode(node.getNodeProperty("left"));

        JLeftPadded<JS.JsBinary.Type> op;
        TSCSyntaxKind opKind = node.getNodeProperty("operatorToken").syntaxKind();
        if (opKind == TSCSyntaxKind.EqualsEqualsEqualsToken) {
            op = padLeft(sourceBefore("==="), JS.JsBinary.Type.IdentityEquals);
        } else if (opKind == TSCSyntaxKind.ExclamationEqualsEqualsToken) {
            op = padLeft(sourceBefore("!=="), JS.JsBinary.Type.IdentityNotEquals);
        } else {
            throw new IllegalArgumentException(String.format("Binary operator kind <%s> is not supported.", opKind));
        }

        Expression right = (Expression) visitNode(node.getNodeProperty("right"));
        return new JS.JsBinary(
                randomId(),
                prefix,
                Markers.EMPTY,
                left,
                op,
                right,
                typeMapping.type(node)
        );
    }

    private J.Identifier visitKeyword(TSCNode node) {
        return visitIdentifier(node);
    }

    private J visitFunctionType(TSCNode node) {
//        implementMe(node, "typeParameters");
//        implementMe(node, "modifiers");
//        implementMe(node, "typeArguments");
//        implementMe(node, "asteriskToken");

//        Space prefix = whitespace();
//
//        List<TSCNode> params = node.getOptionalNodeListProperty("parameters");
//        if (params == null) {
//            implementMe(node);
//        }
//        JContainer<Statement> parameters = mapContainer(
//                "(",
//                params,
//                ",",
//                ")",
//                t -> (Statement) visitNode(t)
//        );
//
//        TSCNode type = node.getOptionalNodeProperty("type");
//        if (type == null) {
//            implementMe(node);
//        }

        // FIXME: does not deserialize due to double visit.
//        return new JS.FunctionType(
//                randomId(),
//                prefix,
//                Markers.EMPTY,
//                parameters,
//                sourceBefore(">="),
//                (Expression) visitNode(type),
//                typeMapping.type(node)
//        );
        return unknownElement(node);
    }

    private J.Label visitLabelledStatement(TSCNode node) {
        return new J.Label(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                padRight(visitIdentifier(node.getNodeProperty("label")), sourceBefore(":")),
                (Statement) visitNode(node.getNodeProperty("statement"))
        );
    }

    private J.MethodDeclaration visitMethodDeclaration(TSCNode node) {
        implementMe(node, "questionToken");
        implementMe(node, "exclamationToken");
        implementMe(node, "typeArguments");

        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;
        List<J.Annotation> annotations = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), annotations);

        if (node.hasProperty("asteriskToken")) {
            markers = markers.addIfAbsent(new Asterisk(randomId(), sourceBefore("*")));
        }
        JavaType.Method methodType = typeMapping.methodDeclarationType(node);
        TSCNode nameNode = node.getOptionalNodeProperty("name");
        J.Identifier name;
        if (nameNode == null) {
            name = convertToIdentifier(EMPTY, "");
        } else {
            name = visitIdentifier(nameNode, methodType);
        }

        J.TypeParameters typeParameters = mapTypeParameters(node.getOptionalNodeListProperty("typeParameters"));

        JContainer<Statement> parameters = mapContainer(
                "(",
                node.getNodeListProperty("parameters"),
                ",",
                ")",
                t -> (Statement) visitNode(t)
        );

        JContainer<NameTree> throw_ = null;

        TypeTree returnTypeExpression = null;
        if (node.hasProperty("type")) {
            markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), sourceBefore(":")));
            returnTypeExpression = (TypeTree) visitNode(node.getNodeProperty("type"));
        }

        J.Block body = visitBlock(node.getOptionalNodeProperty("body"));
        JLeftPadded<Expression> defaultValue = null;

        return new J.MethodDeclaration(
                randomId(),
                prefix,
                markers,
                annotations.isEmpty() ? emptyList() : annotations,
                modifiers,
                typeParameters,
                returnTypeExpression,
                new J.MethodDeclaration.IdentifierWithAnnotations(name, emptyList()),
                parameters,
                throw_,
                body,
                defaultValue,
                methodType
        );
    }

    private Expression visitNameExpression(TSCNode expression) {
        if (expression.hasProperty("expression")) {
            Space prefix = whitespace();
            Expression select = visitNameExpression(expression.getNodeProperty("expression"));

            // Adjust left padding from sourceBefore.
            implementMe(expression, "questionDotToken");

            JLeftPadded<J.Identifier> name = padLeft(sourceBefore("."), visitIdentifier(expression.getNodeProperty("name")));

            return new J.FieldAccess(
                    randomId(),
                    prefix,
                    Markers.EMPTY,
                    select,
                    name,
                    typeMapping.type(expression)
            );
        } else {
            Expression identifier = null;
            if (expression.hasProperty("name")) {
                identifier = (Expression) visitNode(expression.getNodeProperty("name"));
            } else if (expression.hasProperty("escapedText") || expression.syntaxKind() == TSCSyntaxKind.ThisKeyword) {
                identifier = (Expression) visitNode(expression);
            } else {
                implementMe(expression);
            }
            return identifier;
        }
    }

    private J.Literal visitLiteralType(TSCNode node) {
        Space prefix = whitespace();

        TSCNode literal = node.getNodeProperty("literal");
        Object value = null;
        if (literal.syntaxKind() != TSCSyntaxKind.NullKeyword) {
            implementMe(literal, "text");
        }
        String text = node.getText();
        skip(text);

        return new J.Literal(
                randomId(),
                prefix,
                Markers.EMPTY,
                value,
                text,
                null,
                typeMapping.primitive(literal)
        );
    }

    private J.NewClass visitNewExpression(TSCNode node) {
        Space prefix = sourceBefore("new");
        TypeTree typeTree = null;
        if (node.hasProperty("expression")) {
            typeTree = (TypeTree) visitNameExpression(node.getNodeProperty("expression"));
        }
        implementMe(node, "typeArguments");
        JContainer<J> jContainer = mapContainer(
                "(",
                node.getNodeListProperty("arguments"),
                ",",
                ")",
                this::visitNode
        );
        List<JRightPadded<Expression>> elements = jContainer.getPadding().getElements().stream()
                .map(it -> {
                    Expression exp = (!(it.getElement() instanceof Expression) && it.getElement() instanceof Statement) ?
                            new JS.StatementExpression(randomId(), (Statement) it.getElement()) : (Expression)  it.getElement();
                    return padRight(exp, it.getAfter(), it.getMarkers());
                })
                .collect(Collectors.toList());
        JContainer<Expression> arguments = JContainer.build(jContainer.getBefore(), elements, jContainer.getMarkers());
        return new J.NewClass(
                randomId(),
                EMPTY,
                Markers.EMPTY,
                null,
                prefix,
                typeTree,
                arguments,
                null,
                typeMapping.methodInvocationType(node)
        );
    }

    private J.Literal visitNumericLiteral(TSCNode node) {
        Space prefix = whitespace();
        String text = node.getText();
        skip(text);
        return new J.Literal(
                randomId(),
                prefix,
                Markers.EMPTY,
                node.getStringProperty("text"),
                node.getText(),
                null, // TODO
                typeMapping.primitive(node)
        );
    }

    private J visitObjectLiteralExpression(TSCNode node) {
        Space prefix = whitespace();

        List<TSCNode> propertyNodes = node.getOptionalNodeListProperty("properties");

        JContainer<J> jContainer = mapContainer(
                "{",
                propertyNodes,
                ",",
                "}",
                this::visitNode
        );

        JContainer<Expression> arguments;
        if (jContainer.getElements().isEmpty()) {
            arguments = JContainer.empty();
        } else {
            List<JRightPadded<Expression>> elements = jContainer.getPadding().getElements().stream()
                    .map(it -> {
                        Expression exp = (!(it.getElement() instanceof Expression) && it.getElement() instanceof Statement) ?
                                new JS.StatementExpression(randomId(), (Statement) it.getElement()) : (Expression)  it.getElement();
                        return padRight(exp, it.getAfter(), it.getMarkers());
                    })
                    .collect(Collectors.toList());
            arguments = JContainer.build(jContainer.getBefore(), elements, jContainer.getMarkers());
        }

        return new J.NewClass(
                randomId(),
                prefix,
                Markers.build(singletonList(new ObjectLiteral(randomId()))),
                null,
                EMPTY,
                null,
                arguments,
                null,
                null // FIXME: @Gary 1. Is an object literal equivalent to a new class? 2. What is the type of an object literal?
        );
    }

    private JS.ObjectBindingDeclarations mapObjectBindingDeclaration(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> annotations = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), annotations);

        Space beforeVariableModifier = whitespace();
        TSCSyntaxKind keyword = scan();
        if (keyword == TSCSyntaxKind.ConstKeyword) {
            annotations.add(new J.Annotation(
                    randomId(),
                    beforeVariableModifier,
                    Markers.build(singletonList(new Keyword(randomId()))),
                    convertToIdentifier(EMPTY, "const"),
                    null)
            );
        } else if (keyword == TSCSyntaxKind.LetKeyword) {
            annotations.add(new J.Annotation(
                    randomId(),
                    beforeVariableModifier,
                    Markers.build(singletonList(new Keyword(randomId()))),
                    convertToIdentifier(EMPTY, "let"),
                    null)
            );
        } else if (keyword == TSCSyntaxKind.VarKeyword) {
            annotations.add(new J.Annotation(
                    randomId(),
                    beforeVariableModifier,
                    Markers.build(singletonList(new Keyword(randomId()))),
                    convertToIdentifier(EMPTY, "var"),
                    null)
            );
        } else {
            // Unclear if the modifier should be `@Nullable` in the `JSVariableDeclaration`.
            implementMe(node);
        }


        TSCNode declarationList = node.getOptionalNodeProperty("declarationList");
        List<TSCNode> declarations = declarationList == null ?
                emptyList() : declarationList.getNodeListProperty("declarations");

        TypeTree typeTree = null;
        TSCNode bindingNode = declarations.get(0);
        TSCNode objectBindingPattern = bindingNode.getNodeProperty("name");
        implementMe(bindingNode, "exclamationToken");
        implementMe(bindingNode, "type");
        List<TSCNode> elements = objectBindingPattern.getNodeListProperty("elements");
        List<JRightPadded<JS.ObjectBindingDeclarations.Binding>> bindings = new ArrayList<>(elements.size());
        Space beforeBraces = sourceBefore("{");
        for (int i = 0; i < elements.size(); i++) {
            TSCNode binding = elements.get(i);
            Space bindingPrefix = whitespace();

            Space varArg = binding.hasProperty("dotDotDotToken") ? sourceBefore("...") : null;

            JRightPadded<J.Identifier> propertyName = null;
            TSCNode propertyNameNode = binding.getOptionalNodeProperty("propertyName");
            if (propertyNameNode != null) {
                J j = visitNode(propertyNameNode);
                J.Identifier name = null;
                if (j instanceof J.Identifier) {
                    name = (J.Identifier) j;
                } else {
                    implementMe(propertyNameNode);
                }
                propertyName = padRight(name, sourceBefore(":"));
            }

            TSCNode nameNode = binding.getNodeProperty("name");
            J j = visitNode(nameNode);
            J.Identifier name = null;
            if (j instanceof J.Identifier) {
                name = (J.Identifier) j;
            } else {
                implementMe(nameNode);
            }

            TSCNode initializer = binding.getOptionalNodeProperty("initializer");
            JLeftPadded<Expression> bindingInitializer = null;
            if (initializer != null) {
                bindingInitializer = padLeft(sourceBefore("="), (Expression) visitNode(initializer));
            }

            Space after = whitespace();
            Markers bindingMarkers = Markers.EMPTY;
            if (i < elements.size() - 1) {
                skip(",");
            } else {
                // check for trailing comma.
                TSCSyntaxKind kind = scan();
                if (kind == TSCSyntaxKind.CommaToken) {
                    bindingMarkers = bindingMarkers.addIfAbsent(new TrailingComma(randomId(), sourceBefore("}")));
                }
            }

            JS.ObjectBindingDeclarations.Binding b = new JS.ObjectBindingDeclarations.Binding(
                    randomId(),
                    bindingPrefix,
                    Markers.EMPTY,
                    propertyName,
                    name,
                    emptyList(),
                    varArg,
                    bindingInitializer,
                    null // FIXME: @Gary What is the type of an object binding declaration?
            );
            bindings.add(padRight(b, after).withMarkers(bindingMarkers));
        }

        return new JS.ObjectBindingDeclarations(
                randomId(),
                prefix,
                markers,
                annotations,
                modifiers,
                typeTree,
                JContainer.build(beforeBraces, bindings, Markers.EMPTY),
                bindingNode.hasProperty("initializer") ? padLeft(sourceBefore("="), (Expression) visitNode(bindingNode.getNodeProperty("initializer"))) : null
        );
    }

    private <J2 extends J> J.Parentheses<J2> visitParenthesizedExpression(TSCNode node) {
        //noinspection unchecked
        return new J.Parentheses<>(
                randomId(),
                sourceBefore("("),
                Markers.EMPTY,
                padRight((J2) visitNode(node.getNodeProperty("expression")), sourceBefore(")"))
        );
    }

    private J.FieldAccess visitPropertyAccessExpression(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        Expression nameExpression = (Expression) visitNode(node.getNodeProperty("expression"));
        TSCNode questionToken = node.getOptionalNodeProperty("questionDotToken");
        if (questionToken != null) {
            markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore("?"), PostFixOperator.Operator.QuestionMark));
        }
        return new J.FieldAccess(
                randomId(),
                prefix,
                markers,
                nameExpression,
                padLeft(sourceBefore("."), visitIdentifier(node.getNodeProperty("name"))),
                typeMapping.type(node)
        );
    }

    private J.VariableDeclarations visitPropertyDeclaration(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> leadingAnnotations = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leadingAnnotations);

        TSCNode varArgNode = node.getOptionalNodeProperty("dotDotDotToken");
        Space varArg = varArgNode != null ? sourceBefore("...") : null;
        J j = visitNode(node.getNodeProperty("name"));
        J.Identifier name = null;
        if (j instanceof J.Identifier) {
            name = (J.Identifier) j;
        } else {
            implementMe(node);
        }

        TypeTree typeTree = null;
        if (node.hasProperty("type")) {
            TSCNode questionToken = node.getOptionalNodeProperty("questionToken");
            TSCNode exclamationToken = node.getOptionalNodeProperty("exclamationToken");
            if (questionToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore("?"), PostFixOperator.Operator.QuestionMark));
            } else if (exclamationToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore("!"), PostFixOperator.Operator.ExclamationMark));
            }

            Space beforeColon = sourceBefore(":");
            if (beforeColon != EMPTY) {
                markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
            }

            TSCNode type = node.getNodeProperty("type");
            typeTree = (TypeTree) visitNode(type);
            name = name.withType(typeMapping.type(type));
        }

        JLeftPadded<Expression> initializer;
        if (node.hasProperty("initializer")) {
            Space beforeEquals = sourceBefore("=");
            J init = visitNode(node.getNodeProperty("initializer"));
            if (init != null && !(init instanceof Expression)) {
                init = new JS.StatementExpression(randomId(), (Statement) init);
            }
            initializer = padLeft(beforeEquals, (Expression) init);
        } else {
            initializer = null;
        }
        List<JRightPadded<J.VariableDeclarations.NamedVariable>> variables = new ArrayList<>(1);
        variables.add(maybeSemicolon(new J.VariableDeclarations.NamedVariable(
                randomId(),
                EMPTY,
                Markers.EMPTY,
                name,
                emptyList(),
                initializer,
                typeMapping.variableType(node)
        )));

        List<JLeftPadded<Space>> dimensions = emptyList();
        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                leadingAnnotations.isEmpty() ? emptyList() : leadingAnnotations,
                modifiers,
                typeTree,
                varArg,
                dimensions,
                variables
        );
    }

    private J visitPropertyAssignment(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> leadingAnnotations = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leadingAnnotations);

        Space variablePrefix = whitespace();
        J j = visitNode(node.getOptionalNodeProperty("name"));
        J.Identifier name = null;
        if (j instanceof J.Identifier) {
            name = (J.Identifier) j;
        } else if (j instanceof J.Literal) {
            // FIXME: covers code like `'Content-Type': undefined`.
            //  The identifier might be `Content-Type` and only use the `'` to enable `-` in the name.
            //  If the identifier is `Content-Type`, then use the value instead of the value source and add a marker to represent the `'`.
            name = convertToIdentifier(j.getPrefix(), ((J.Literal) j).getValueSource());
        } else {
            implementMe(node);
        }

        TypeTree typeTree = null;

        // The initializer on a property declaration is the type reference.
        // { x : 1 }
        JLeftPadded<Expression> initializer;
        if (node.hasProperty("initializer")) {
            TSCNode questionToken = node.getOptionalNodeProperty("questionToken");
            TSCNode exclamationToken = node.getOptionalNodeProperty("exclamationToken");
            if (questionToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore("?"), PostFixOperator.Operator.QuestionMark));
            } else if (exclamationToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore("!"), PostFixOperator.Operator.ExclamationMark));
            }

            Space beforeEquals = sourceBefore(":");
            J init = visitNode(node.getNodeProperty("initializer"));
            if (init != null && !(init instanceof Expression)) {
                init = new JS.StatementExpression(randomId(), (Statement) init);
            }
            initializer = padLeft(beforeEquals, (Expression) init);
        } else {
            initializer = null;
        }

        List<JRightPadded<J.VariableDeclarations.NamedVariable>> variables = new ArrayList<>(1);
        variables.add(maybeSemicolon(new J.VariableDeclarations.NamedVariable(
                randomId(),
                variablePrefix,
                Markers.build(singletonList(new Colon(randomId()))),
                name,
                emptyList(),
                initializer,
                typeMapping.variableType(node)
        )));

        List<JLeftPadded<Space>> dimensions = emptyList();
        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                leadingAnnotations.isEmpty() ? emptyList() : leadingAnnotations,
                modifiers,
                typeTree,
                null,
                dimensions,
                variables
        );
    }

    private J.FieldAccess visitQualifiedName(TSCNode node) {
        return new J.FieldAccess(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                (Expression) visitNode(node.getNodeProperty("left")),
                padLeft(sourceBefore("."), (J.Identifier) visitNode(node.getNodeProperty("right"))),
                typeMapping.type(node)
        );
    }

    private J visitRegularExpressionLiteral(TSCNode node) {
        Space prefix = whitespace();
        String text = node.getText();
        skip(text);
        return new J.Literal(
                randomId(),
                prefix,
                Markers.EMPTY,
                node.getStringProperty("text"),
                node.getText(),
                null,
                JavaType.Primitive.None
        );
    }

    private J.Return visitReturnStatement(TSCNode node) {
        Space prefix = sourceBefore("return");
        Expression expression = null;
        J j = !node.hasProperty("expression") ? null : visitNode(node.getNodeProperty("expression"));
        if (j != null) {
            expression = j instanceof Expression ? (Expression) j : new JS.StatementExpression(
                    randomId(),
                    (Statement) j
            );
        }
        return new J.Return(
                randomId(),
                prefix,
                Markers.EMPTY,
                expression
        );
    }

    private JRightPadded<Statement> visitStatement(TSCNode node) {
        Statement statement = (Statement) visitNode(node);

        assert statement != null;
        return maybeSemicolon(statement);
    }

    private J.Literal visitStringLiteral(TSCNode node) {
        implementMe(node, "singleQuote");
        if (node.getBooleanProperty("hasExtendedUnicodeEscape")) {
            implementMe(node, "hasExtendedUnicodeEscape");
        }

        Space prefix = whitespace();
        String text = node.getText();
        skip(text);
        return new J.Literal(
                randomId(),
                prefix,
                Markers.EMPTY,
                node.getStringProperty("text"),
                text,
                null, // TODO
                JavaType.Primitive.String
        );
    }

    private J visitTemplateExpression(TSCNode node) {
        Space prefix = whitespace();
        TSCNode head = node.getNodeProperty("head");
        String text = head.getStringProperty("text");
        String rawText = head.getStringProperty("rawText");
        String delimiter = String.valueOf(head.getText().charAt(0));
        boolean isEnclosedInBraces = head.getText().endsWith("{");

        skip(delimiter);

        List<TSCNode> spans = node.getNodeListProperty("templateSpans");
        List<J> elements = new ArrayList<>(spans.size() * 2 + 1);
        if (!rawText.isEmpty()) {
            skip(rawText);
            elements.add(new J.Literal(
                    randomId(),
                    EMPTY,
                    Markers.EMPTY,
                    text,
                    rawText,
                    null,
                    JavaType.Primitive.String
            ));
        }

        for (TSCNode span : spans) {
            // Skip past the ${ characters.
            skip(isEnclosedInBraces ? "${" : "$");

            elements.add(new JS.TemplateExpression.Value(
                    randomId(),
                    EMPTY,
                    Markers.EMPTY,
                    visitNode(span.getNodeProperty("expression")),
                    whitespace(),
                    isEnclosedInBraces
            ));

            skip("}");

            TSCNode literal = span.getNodeProperty("literal");
            String snapText = literal.getStringProperty("text");
            String spanRawText = literal.getStringProperty("rawText");
            if (!spanRawText.isEmpty()) {
                skip(spanRawText);
                elements.add(new J.Literal(
                        randomId(),
                        EMPTY,
                        Markers.EMPTY,
                        snapText,
                        spanRawText,
                        null,
                        JavaType.Primitive.String
                ));
            }

            if (literal.syntaxKind() == TSCSyntaxKind.TemplateTail) {
                skip(delimiter);
            } else {
                isEnclosedInBraces = literal.getText().endsWith("{");
            }
        }

        return new JS.TemplateExpression(
                randomId(),
                prefix,
                Markers.EMPTY,
                delimiter,
                elements,
                typeMapping.type(node)
        );
    }

    private J.Throw visitThrowStatement(TSCNode node) {
        return new J.Throw(
                randomId(),
                sourceBefore("throw"),
                Markers.EMPTY,
                (Expression) visitNode(node.getNodeProperty("expression"))
        );
    }

    private J.Try visitTryStatement(TSCNode node) {
        Space prefix = sourceBefore("try");
        J.Block tryBlock = (J.Block) visitNode(node.getNodeProperty("tryBlock"));

        TSCNode catchClause = node.getNodeProperty("catchClause");
        J.Try.Catch aCatch = new J.Try.Catch(
                randomId(),
                sourceBefore("catch"),
                Markers.EMPTY,
                mapControlParentheses(catchClause.getNodeProperty("variableDeclaration")),
                (J.Block) visitNode(catchClause.getNodeProperty("block"))
        );

        JLeftPadded<J.Block> finallyBlock = null;
        if (node.hasProperty("finallyBlock")) {
            finallyBlock = padLeft(sourceBefore("finally"), (J.Block) visitNode(node.getNodeProperty("finallyBlock")));
        }

        return new J.Try(
                randomId(),
                prefix,
                Markers.EMPTY,
                null,
                tryBlock,
                singletonList(aCatch),
                finallyBlock
        );
    }

    private J visitTupleType(TSCNode node) {
        return unknownElement(node);
    }

    private J visitTypeAliasDeclaration(TSCNode node) {
        implementMe(node, "typeParameters");
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> annotations = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), annotations);

        Space before = sourceBefore("type");
        annotations = mapKeywordToAnnotation(before, "type", annotations);

        TypeTree typeTree = null;
        List<JRightPadded<J.VariableDeclarations.NamedVariable>> namedVariables = new ArrayList<>(1);

        TSCNode nameNode = node.getNodeProperty("name");
        J.Identifier name = (J.Identifier) visitNode(nameNode);
        name = name.withType(typeMapping.type(nameNode));

        J.VariableDeclarations.NamedVariable variable = new J.VariableDeclarations.NamedVariable(
                randomId(),
                EMPTY,
                Markers.EMPTY,
                name,
                emptyList(),
                padLeft(sourceBefore("="),
                        (Expression) Objects.requireNonNull(visitNode(node.getNodeProperty("type")))),
                typeMapping.variableType(node)
        );

        namedVariables.add(padRight(variable, EMPTY));

        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                annotations,
                modifiers,
                typeTree,
                null,
                emptyList(),
                namedVariables
        );
    }

    private JS.JsOperator visitTsOperator(TSCNode node) {
        Space prefix = whitespace();
        Expression left = null; // placeholder for 'bar' in foo. Remove left expression if it is unnecessary.
        JLeftPadded<JS.JsOperator.Type> op = null;
        if (node.syntaxKind() == TSCSyntaxKind.AwaitExpression) {
            op = padLeft(sourceBefore("await"), JS.JsOperator.Type.Await);
        } else if (node.syntaxKind() == TSCSyntaxKind.TypeOfExpression) {
            op = padLeft(sourceBefore("typeof"), JS.JsOperator.Type.TypeOf);
        } else {
            implementMe(node);
        }
        Expression right = (Expression) visitNode(node.getNodeProperty("expression"));
        return new JS.JsOperator(
                randomId(),
                prefix,
                Markers.EMPTY,
                left,
                op,
                right,
                typeMapping.type(node)
        );
    }

    private J visitTypeLiteral(TSCNode node) {
        return unknownElement(node);
    }

    private JS.TypeOperator visitTypeOperator(TSCNode node) {
        Space prefix = whitespace();

        TSCSyntaxKind op = node.getSyntaxKindProperty("operator");
        JS.TypeOperator.Type operator = null;
        Space before = EMPTY;
        if (op == TSCSyntaxKind.ReadonlyKeyword) {
            before = sourceBefore("readonly");
            operator = JS.TypeOperator.Type.ReadOnly;
        } else {
            implementMe(node);
        }

        return new JS.TypeOperator(
                randomId(),
                prefix,
                Markers.EMPTY,
                operator,
                padLeft(before, (Expression) visitNode(node.getNodeProperty("type"))),
                null
        );
    }

    private J.TypeParameter visitTypeParameter(TSCNode node) {
        Space prefix = whitespace();
        List<J.Annotation> annotations = new ArrayList<>();
        mapModifiers(node.getOptionalNodeListProperty("modifiers"), annotations);
        implementMe(node, "expression");
        TSCNode defaultType = node.getOptionalNodeProperty("default");
        Expression name = (Expression) visitNode(node.getNodeProperty("name"));

        if (defaultType != null) {
            name = new JS.DefaultType(
                    randomId(),
                    name.getPrefix(),
                    Markers.EMPTY,
                    name.withPrefix(EMPTY),
                    sourceBefore("="),
                    (Expression) visitNode(defaultType),
                    typeMapping.type(defaultType)
            );
        }

        JContainer<TypeTree> bounds = !node.hasProperty("constraint") ? null :
                JContainer.build(
                        sourceBefore("extends"),
                        convertAll(node.getNodeProperty("constraint").syntaxKind() == TSCSyntaxKind.IntersectionType ?
                                node.getNodeProperty("constraint").getNodeListProperty("types") :
                                singletonList(node.getNodeProperty("constraint")), t -> sourceBefore("&"), noDelim),
                        Markers.EMPTY);

        return new J.TypeParameter(
                randomId(),
                prefix,
                Markers.EMPTY,
                annotations.isEmpty() ? emptyList() : annotations,
                name,
                bounds
        );
    }

    private J.ParameterizedType visitTypeQuery(TSCNode node) {
        Space prefix = whitespace();
        Space typeOfPrefix = sourceBefore("typeof");
        Expression name = (Expression) visitNode(node.getNodeProperty("exprName"));

        JS.JsOperator op = new JS.JsOperator(
                randomId(),
                typeOfPrefix,
                Markers.EMPTY,
                null,
                padLeft(EMPTY, JS.JsOperator.Type.TypeOf),
                name,
                typeMapping.type(node)
        );

        return new J.ParameterizedType(
                randomId(),
                prefix,
                Markers.EMPTY,
                op,
                !node.hasProperty("typeArguments") ? null :
                        mapContainer(
                                "<",
                                node.getNodeListProperty("typeArguments"),
                                ",",
                                ">",
                                t -> (Expression) visitNode(t)
                        ),
                typeMapping.type(node)
        );
    }

    private J.ParameterizedType visitTypeReference(TSCNode node) {
        return new J.ParameterizedType(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                (NameTree) visitNode(node.getNodeProperty("typeName")),
                !node.hasProperty("typeArguments") ? null :
                        mapContainer(
                                "<",
                                node.getNodeListProperty("typeArguments"),
                                ",",
                                ">",
                                t -> (Expression) visitNode(t)
                        ),
                typeMapping.type(node)
        );
    }

    private J.Unary visitUnaryExpression(TSCNode node) {
        Space prefix = whitespace();

        JLeftPadded<J.Unary.Type> op = null;
        TSCSyntaxKind opKind = TSCSyntaxKind.fromCode(node.getIntProperty("operator"));
        Expression expression;
        if (node.syntaxKind() == TSCSyntaxKind.PrefixUnaryExpression) {
            if (opKind == TSCSyntaxKind.ExclamationToken) {
                op = padLeft(sourceBefore("!"), J.Unary.Type.Not);
            } else if (opKind == TSCSyntaxKind.MinusMinusToken) {
                op = padLeft(sourceBefore("--"), J.Unary.Type.PreDecrement);
            } else if (opKind == TSCSyntaxKind.PlusPlusToken) {
                op = padLeft(sourceBefore("++"), J.Unary.Type.PreIncrement);
            } else {
                implementMe(node);
            }
            expression = (Expression) visitNode(node.getNodeProperty("operand"));
        } else {
            expression = (Expression) visitNode(node.getNodeProperty("operand"));
            if (opKind == TSCSyntaxKind.MinusMinusToken) {
                op = padLeft(sourceBefore("--"), J.Unary.Type.PostDecrement);
            } else if (opKind == TSCSyntaxKind.PlusPlusToken) {
                op = padLeft(sourceBefore("++"), J.Unary.Type.PostIncrement);
            } else {
                implementMe(node);
            }
        }

        return new J.Unary(
                randomId(),
                prefix,
                Markers.EMPTY,
                op,
                expression,
                typeMapping.type(node)
        );
    }

    private JS.Union visitUnionType(TSCNode node) {
        Space prefix = whitespace();
        return new JS.Union(
                randomId(),
                prefix,
                Markers.EMPTY,
                convertAll(node.getNodeListProperty("types"), t -> sourceBefore("|"), t -> EMPTY),
                TsType.Union
        );
    }

    private J.VariableDeclarations visitVariableDeclaration(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        int saveCursor = getCursor();
        Space beforeVariableModifier = whitespace();
        TSCSyntaxKind keyword = scan();
        List<J.Annotation> annotations = new ArrayList<>();
        if (keyword == TSCSyntaxKind.ConstKeyword) {
            annotations.add(new J.Annotation(
                    randomId(),
                    beforeVariableModifier,
                    Markers.build(singletonList(new Keyword(randomId()))),
                    convertToIdentifier(EMPTY, "const"),
                    null)
            );
        } else if (keyword == TSCSyntaxKind.LetKeyword) {
            annotations.add(new J.Annotation(
                    randomId(),
                    beforeVariableModifier,
                    Markers.build(singletonList(new Keyword(randomId()))),
                    convertToIdentifier(EMPTY, "let"),
                    null)
            );
        } else if (keyword == TSCSyntaxKind.VarKeyword) {
            annotations.add(new J.Annotation(
                    randomId(),
                    beforeVariableModifier,
                    Markers.build(singletonList(new Keyword(randomId()))),
                    convertToIdentifier(EMPTY, "var"),
                    null)
            );
        } else {
            cursor(saveCursor);
        }

        TypeTree typeTree = null;
        List<JRightPadded<J.VariableDeclarations.NamedVariable>> namedVariables = new ArrayList<>(1);
        Space variablePrefix = whitespace();
        J j = visitNode(node.getNodeProperty("name"));
        J.Identifier name = null;
        if (j instanceof J.Identifier) {
            name = (J.Identifier) j;
        } else {
            implementMe(node);
        }

        Markers variableMarker = Markers.EMPTY;
        if (node.hasProperty("type")) {
            TSCNode questionToken = node.getOptionalNodeProperty("questionToken");
            TSCNode exclamationToken = node.getOptionalNodeProperty("exclamationToken");
            if (questionToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore("?"), PostFixOperator.Operator.QuestionMark));
            } else if (exclamationToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore("!"), PostFixOperator.Operator.ExclamationMark));
            }

            Space beforeColon = sourceBefore(":");
            if (beforeColon != EMPTY) {
                markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
            }
            typeTree = (TypeTree) visitNode(node.getNodeProperty("type"));
        }
        J.VariableDeclarations.NamedVariable variable = new J.VariableDeclarations.NamedVariable(
                randomId(),
                variablePrefix,
                variableMarker,
                name,
                emptyList(),
                node.hasProperty("initializer") ?
                        padLeft(sourceBefore("="),
                                (Expression) Objects.requireNonNull(visitNode(node.getNodeProperty("initializer")))) : null,
                typeMapping.variableType(node)
        );

        namedVariables.add(padRight(variable, EMPTY));

        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                annotations,
                emptyList(),
                typeTree,
                null,
                emptyList(),
                namedVariables
        );
    }

    private J.VariableDeclarations visitVariableDeclarationList(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        Space beforeVariableModifier = whitespace();
        TSCSyntaxKind keyword = scan();
        List<J.Annotation> annotations = new ArrayList<>();
        if (keyword == TSCSyntaxKind.ConstKeyword) {
            annotations.add(new J.Annotation(
                    randomId(),
                    beforeVariableModifier,
                    Markers.build(singletonList(new Keyword(randomId()))),
                    convertToIdentifier(EMPTY, "const"),
                    null)
            );
        } else if (keyword == TSCSyntaxKind.LetKeyword) {
            annotations.add(new J.Annotation(
                    randomId(),
                    beforeVariableModifier,
                    Markers.build(singletonList(new Keyword(randomId()))),
                    convertToIdentifier(EMPTY, "let"),
                    null)
            );
        } else if (keyword == TSCSyntaxKind.VarKeyword) {
            annotations.add(new J.Annotation(
                    randomId(),
                    beforeVariableModifier,
                    Markers.build(singletonList(new Keyword(randomId()))),
                    convertToIdentifier(EMPTY, "var"),
                    null)
            );
        } else {
            // Unclear if the modifier should be `@Nullable` in the `JSVariableDeclaration`.
            implementMe(node);
        }

        List<JRightPadded<J.VariableDeclarations.NamedVariable>> namedVariables = emptyList();
        TypeTree typeTree = null;
        if (node.hasProperty("declarations")) {
            List<TSCNode> declarations = node.getNodeListProperty("declarations");
            Set<JavaType> types = new HashSet<>(declarations.size());
            namedVariables = new ArrayList<>(declarations.size());
            for (int i = 0; i < declarations.size(); i++) {
                TSCNode declaration = declarations.get(i);

                Space variablePrefix = whitespace();
                J j = visitNode(declaration.getNodeProperty("name"));
                J.Identifier name = null;
                if (j instanceof J.Identifier) {
                    name = (J.Identifier) j;
                } else {
                    implementMe(declaration);
                }

                if (declaration.hasProperty("type")) {
                    TSCNode questionToken = node.getOptionalNodeProperty("questionToken");
                    TSCNode exclamationToken = node.getOptionalNodeProperty("exclamationToken");
                    if (questionToken != null) {
                        markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore("?"), PostFixOperator.Operator.QuestionMark));
                    } else if (exclamationToken != null) {
                        markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore("!"), PostFixOperator.Operator.ExclamationMark));
                    }

                    Space beforeColon = sourceBefore(":");
                    if (beforeColon != EMPTY) {
                        markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
                    }
                    TSCNode type = declaration.getNodeProperty("type");
                    typeTree = (TypeTree) visitNode(type);
                    if (typeTree.getType() != null) {
                        types.add(typeTree.getType());
                        if (types.size() > 1) {
                            throw new UnsupportedOperationException("Multiple variable types are not supported");
                        }
                    }
                }
                J.VariableDeclarations.NamedVariable variable = new J.VariableDeclarations.NamedVariable(
                        randomId(),
                        variablePrefix,
                        Markers.EMPTY,
                        name,
                        emptyList(),
                        declaration.hasProperty("initializer") ?
                                padLeft(sourceBefore("="),
                                        (Expression) Objects.requireNonNull(visitNode(declaration.getNodeProperty("initializer")))) : null,
                        typeMapping.variableType(declaration)
                );

                Space after = whitespace();
                if (i < declarations.size() - 1) {
                    skip(",");
                }
                namedVariables.add(padRight(variable, after));
            }
        }

        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                annotations,
                emptyList(),
                typeTree,
                null,
                emptyList(),
                namedVariables
        );
    }

    private J.VariableDeclarations visitVariableStatement(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        implementMe(node, "exclamationToken");

        List<J.Annotation> annotations = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), annotations);

        Space beforeVariableModifier = whitespace();
        TSCSyntaxKind keyword = scan();
        if (keyword == TSCSyntaxKind.ConstKeyword) {
            annotations.add(new J.Annotation(
                    randomId(),
                    beforeVariableModifier,
                    Markers.build(singletonList(new Keyword(randomId()))),
                    convertToIdentifier(EMPTY, "const"),
                    null)
            );
        } else if (keyword == TSCSyntaxKind.LetKeyword) {
            annotations.add(new J.Annotation(
                    randomId(),
                    beforeVariableModifier,
                    Markers.build(singletonList(new Keyword(randomId()))),
                    convertToIdentifier(EMPTY, "let"),
                    null)
            );
        } else if (keyword == TSCSyntaxKind.VarKeyword) {
            annotations.add(new J.Annotation(
                    randomId(),
                    beforeVariableModifier,
                    Markers.build(singletonList(new Keyword(randomId()))),
                    convertToIdentifier(EMPTY, "var"),
                    null)
            );
        } else {
            // Unclear if the modifier should be `@Nullable` in the `JSVariableDeclaration`.
            implementMe(node);
        }

        List<JRightPadded<J.VariableDeclarations.NamedVariable>> namedVariables;
        TypeTree typeTree = null;

        TSCNode declarationList = node.getOptionalNodeProperty("declarationList");
        List<TSCNode> declarations = declarationList == null ?
                emptyList() : declarationList.getNodeListProperty("declarations");

        Set<JavaType> types = new HashSet<>(declarations.size());
        namedVariables = new ArrayList<>(declarations.size());

        for (int i = 0; i < declarations.size(); i++) {
            TSCNode declaration = declarations.get(i);

            Space variablePrefix = whitespace();
            J j = visitNode(declaration.getNodeProperty("name"));
            J.Identifier name = null;
            if (j instanceof J.Identifier) {
                name = (J.Identifier) j;
            } else {
                implementMe(declaration);
            }

            if (declaration.hasProperty("type")) {
                Space beforeColon = sourceBefore(":");
                if (beforeColon != EMPTY) {
                    markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
                }
                TSCNode type = declaration.getNodeProperty("type");
                typeTree = (TypeTree) visitNode(type);
                if (typeTree.getType() != null) {
                    types.add(typeTree.getType());
                    // TS allows for multiple variable types to be expressed in a single statement.
                    // The count is used to prevent a malformed LST element until multiple variable types are supported.
                    if (types.size() > 1) {
                        throw new UnsupportedOperationException("Multiple variable types are not supported");
                    }
                }
            }
            J.VariableDeclarations.NamedVariable variable = new J.VariableDeclarations.NamedVariable(
                    randomId(),
                    variablePrefix,
                    Markers.EMPTY,
                    name,
                    emptyList(),
                    declaration.hasProperty("initializer") ?
                            padLeft(sourceBefore("="),
                                    (Expression) Objects.requireNonNull(visitNode(declaration.getNodeProperty("initializer")))) : null,
                    typeMapping.variableType(declaration)
            );

            Space after = whitespace();
            if (i < declarations.size() - 1) {
                skip(",");
            }
            namedVariables.add(padRight(variable, after));
        }

        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                annotations,
                modifiers,
                typeTree,
                null,
                emptyList(),
                namedVariables
        );
    }

    private J.WhileLoop visitWhileStatement(TSCNode node) {
        Space prefix = sourceBefore("while");
        J.ControlParentheses<Expression> control = mapControlParentheses(node.getNodeProperty("expression"));
        return new J.WhileLoop(
                randomId(),
                prefix,
                Markers.EMPTY,
                control,
                maybeSemicolon((Statement) visitNode(node.getNodeProperty("statement")))
        );
    }

    private J visitYieldExpression(TSCNode node) {
        Space prefix = sourceBefore("yield");
        Markers markers = Markers.EMPTY;
        if (node.hasProperty("asteriskToken")) {
            markers = markers.add(new Asterisk(randomId(), sourceBefore("*")));
        }
        J j = visitNode(node.getNodeProperty("expression"));
        Expression expr = (!(j instanceof Expression) && j instanceof Statement) ?
                new JS.StatementExpression(randomId(), (Statement) j) : (Expression) j;
        return new J.Yield(
                randomId(),
                prefix,
                markers,
                false, // FIXME
                expr
        );
    }

    @Nullable
    private J visitNode(@Nullable TSCNode node) {
        if (node == null) {
            return null;
        }

        J j;
        switch (node.syntaxKind()) {
            // Multi-case statements
            case ClassDeclaration:
            case ClassExpression:
            case EnumDeclaration:
            case InterfaceDeclaration:
                j = visitClassDeclaration(node);
                break;
            case AnyKeyword:
            case AsyncKeyword:
            case BooleanKeyword:
            case DeclareKeyword:
            case DefaultKeyword:
            case ExportKeyword:
            case FalseKeyword:
            case NumberKeyword:
            case NullKeyword:
            case StringKeyword:
            case SuperKeyword:
            case ThisKeyword:
            case TrueKeyword:
            case UndefinedKeyword:
            case UnknownKeyword:
            case VoidKeyword:
                j = visitKeyword(node);
                break;
            case ForOfStatement:
            case ForInStatement:
                j = visitForEachStatement(node);
                break;
            case FunctionDeclaration:
            case FunctionExpression:
                j = visitFunctionDeclaration(node);
                break;
            case ExportSpecifier:
            case ImportSpecifier:
                j = visitExportSpecifier(node);
                break;
            case ImportEqualsDeclaration:
            case ImportDeclaration:
                j = visitImportDeclaration(node);
                break;
            case CallSignature:
            case MethodDeclaration:
            case MethodSignature:
                j = visitMethodDeclaration(node);
                break;
            case BindingElement:
            case Parameter:
            case PropertyDeclaration:
                j = visitPropertyDeclaration(node);
                break;
            case AwaitExpression:
            case TypeOfExpression:
                j = visitTsOperator(node);
                break;
            case PostfixUnaryExpression:
            case PrefixUnaryExpression:
                j = visitUnaryExpression(node);
                break;
            case PropertySignature:
            case VariableDeclaration:
                j = visitVariableDeclaration(node);
                break;
            // Single case statements
            case ArrayBindingPattern:
                j = visitArrayBindingPattern(node);
                break;
            case ArrowFunction:
                j = visitArrowFunction(node);
                break;
            case ArrayLiteralExpression:
                j = visitArrayLiteralExpression(node);
                break;
            case ArrayType:
                j = mapArrayType(node);
                break;
            case AsExpression:
                j = visitAsExpression(node);
                break;
            case BinaryExpression:
                j = visitBinaryExpression(node);
                break;
            case Block:
                j = visitBlock(node);
                break;
            case BreakStatement:
                j = visitBreakStatement(node);
                break;
            case CallExpression:
                j = visitCallExpression(node);
                break;
            case ConditionalExpression:
                j = visitConditionalExpression(node);
                break;
            case ContinueStatement:
                j = visitContinueStatement(node);
                break;
            case Constructor:
                j = visitConstructor(node);
                break;
            case Decorator:
                j = visitDecorator(node);
                break;
            case DoStatement:
                j = visitDoStatement(node);
                break;
            case ElementAccessExpression:
                j = visitElementAccessExpression(node);
                break;
            case EmptyStatement:
                j = visitEmptyStatement(node);
                break;
            case EnumMember:
                j = visitEnumMember(node);
                break;
            case ExportAssignment:
                j = visitExportAssignment(node);
                break;
            case ExportDeclaration:
                j = visitExportDeclaration(node);
                break;
            case ExpressionStatement:
                j = visitExpressionStatement(node);
                break;
            case ExpressionWithTypeArguments:
                j = visitExpressionWithTypeArguments(node);
                break;
            case ExternalModuleReference:
                j = visitExternalModuleReference(node);
                break;
            case Identifier:
                j = visitIdentifier(node);
                break;
            case IfStatement:
                j = visitIfStatement(node);
                break;
            case IndexedAccessType:
                j = visitIndexedAccessType(node);
                break;
            case ForStatement:
                j = visitForStatement(node);
                break;
            case FunctionType:
                j = visitFunctionType(node);
                break;
            case LabeledStatement:
                j = visitLabelledStatement(node);
                break;
            case LiteralType:
                j = visitLiteralType(node);
                break;
            case NewExpression:
                j = visitNewExpression(node);
                break;
            case NumericLiteral:
                j = visitNumericLiteral(node);
                break;
            case ObjectLiteralExpression:
                j = visitObjectLiteralExpression(node);
                break;
            case ParenthesizedExpression:
                j = visitParenthesizedExpression(node);
                break;
            case PropertyAccessExpression:
                j = visitPropertyAccessExpression(node);
                break;
            case PropertyAssignment:
                j = visitPropertyAssignment(node);
                break;
            case QualifiedName:
                j = visitQualifiedName(node);
                break;
            case RegularExpressionLiteral:
                j = visitRegularExpressionLiteral(node);
                break;
            case ReturnStatement:
                j = visitReturnStatement(node);
                break;
            case StringLiteral:
                j = visitStringLiteral(node);
                break;
            case TemplateExpression:
                j = visitTemplateExpression(node);
                break;
            case ThrowStatement:
                j = visitThrowStatement(node);
                break;
            case TryStatement:
                j = visitTryStatement(node);
                break;
            case TupleType:
                j = visitTupleType(node);
                break;
            case TypeAliasDeclaration:
                j = visitTypeAliasDeclaration(node);
                break;
            case TypeLiteral:
                j = visitTypeLiteral(node);
                break;
            case TypeOperator:
                j = visitTypeOperator(node);
                break;
            case TypeParameter:
                j = visitTypeParameter(node);
                break;
            case TypeQuery:
                j = visitTypeQuery(node);
                break;
            case TypeReference:
                j = visitTypeReference(node);
                break;
            case UnionType:
                j = visitUnionType(node);
                break;
            case VariableDeclarationList:
                j = visitVariableDeclarationList(node);
                break;
            case VariableStatement:
                j = mapVariableStatement(node);
                break;
            case WhileStatement:
                j = visitWhileStatement(node);
                break;
            case YieldExpression:
                j = visitYieldExpression(node);
                break;
            default:
                implementMe(node); // TODO: remove ... temp for velocity.
                System.err.println("unsupported syntax kind: " + node.syntaxKind());
                j = null;
        }
        return j;
    }

    private final Function<TSCNode, Space> commaDelim = ignored -> sourceBefore(",");
    private final Function<TSCNode, Space> noDelim = ignored -> EMPTY;

    /**
     * Returns the current cursor position in the TSC.Context.
     */
    private Integer getCursor() {
        return this.cursorContext.scannerTokenEnd();
    }

    /**
     * Set the cursor position to the specified index.
     */
    private void cursor(int cursor) {
        this.cursorContext.resetScanner(cursor);
    }

    private <T> JLeftPadded<T> padLeft(Space left, T tree) {
        return new JLeftPadded<>(left, tree, Markers.EMPTY);
    }

    private <T> JRightPadded<T> padRight(T tree, @Nullable Space right) {
        return new JRightPadded<>(tree, right == null ? EMPTY : right, Markers.EMPTY);
    }

    private <T> JRightPadded<T> padRight(T tree, @Nullable Space right, Markers markers) {
        return new JRightPadded<>(tree, right == null ? EMPTY : right, markers);
    }

    private <K2 extends J> JRightPadded<K2> maybeSemicolon(K2 k) {
        int saveCursor = getCursor();
        Space beforeSemi = whitespace();
        Semicolon semicolon = null;
        if (getCursor() < source.length() && source.charAt(getCursor()) == ';') {
            semicolon = new Semicolon(randomId());
            skip(";");
        } else {
            beforeSemi = EMPTY;
            cursor(saveCursor);
        }

        JRightPadded<K2> padded = JRightPadded.build(k).withAfter(beforeSemi);
        if (semicolon != null) {
            padded = padded.withMarkers(padded.getMarkers().add(semicolon));
        }

        return padded;
    }

    private TSCSyntaxKind scan() {
        return this.cursorContext.nextScannerSyntaxType();
    }

    private <J2 extends J> List<JRightPadded<J2>> convertAll(List<TSCNode> elements,
                                                             Function<TSCNode, Space> innerSuffix,
                                                             Function<TSCNode, Space> suffix) {

        if (elements.isEmpty()) {
            return emptyList();
        }

        List<JRightPadded<J2>> converted = new ArrayList<>(elements.size());
        for (int i = 0; i < elements.size(); i++) {
            TSCNode element = elements.get(i);
            //noinspection unchecked
            J2 j = (J2) visitNode(element);
            Space after = i == elements.size() - 1 ? suffix.apply(element) : innerSuffix.apply(element);
            if (j == null && i < elements.size() - 1) {
                continue;
            }
            if (j == null) {
                //noinspection unchecked
                j = (J2) new J.Empty(randomId(), EMPTY, Markers.EMPTY);
            }
            JRightPadded<J2> rightPadded = padRight(j, after);
            converted.add(rightPadded);
        }
        return converted.isEmpty() ? emptyList() : converted;
    }

    /**
     * Converts a String that does not require type attribution to a J.Identifier.
     * Primarily used to convert keywords that do not exist in J to a J.Identifier.
     * <p>
     * Note: the cursor must be incremented before the call.
     * @param simpleName the String to convert.
     * @return a J.Identifier representing the String.
     */
    private J.Identifier convertToIdentifier(Space prefix, String simpleName) {
        return new J.Identifier(randomId(), prefix, Markers.EMPTY, simpleName, null, null);
    }

    private <T extends J> JContainer<T> mapContainer(String open, List<TSCNode> nodes, @Nullable String delimiter, String close, Function<TSCNode, T> visitFn) {
        Space containerPrefix = sourceBefore(open);
        List<JRightPadded<T>> elements;
        if (nodes.isEmpty()) {
            Space withinContainerSpace = whitespace();
            //noinspection unchecked
            elements = Collections.singletonList(
                    JRightPadded.build((T) new J.Empty(randomId(), withinContainerSpace, Markers.EMPTY))
            );
        } else {
            elements = new ArrayList<>(nodes.size());
            for (int i = 0; i < nodes.size(); i++) {
                TSCNode node = nodes.get(i);
                T visited = null;
                try {
                    visited = visitFn.apply(node);
                } catch (Exception e) {
                    implementMe(node);
                }
                Markers markers = Markers.EMPTY;
                Space after = EMPTY;
                if (delimiter != null) {
                    if (i < nodes.size() - 1) {
                        after = sourceBefore(delimiter);
                    } else if (delimiter.equals(",")) {
                        after = whitespace();
                        if (source.charAt(getCursor()) == ',') {
                            skip(delimiter);
                            markers = markers.addIfAbsent(new TrailingComma(randomId(), whitespace()));
                        }
                    } else {
                        after = whitespace();
                    }
                }
                elements.add(JRightPadded.build(visited).withAfter(after).withMarkers(markers));
            }
        }
        skip(close);
        return JContainer.build(containerPrefix, elements, Markers.EMPTY);
    }

    private <J2 extends J> J.ControlParentheses<J2> mapControlParentheses(TSCNode node) {
        //noinspection unchecked
        return new J.ControlParentheses<>(
                randomId(),
                sourceBefore("("),
                Markers.EMPTY,
                padRight((J2) visitNode(node), sourceBefore(")"))
        );
    }

    private J.ArrayType mapArrayType(TSCNode node) {
        Space prefix = whitespace();

        int dimensionsCount = 1;
        TSCNode curElement = node.getNodeProperty("elementType");
        while (curElement.syntaxKind() == TSCSyntaxKind.ArrayType) {
            dimensionsCount++;
            curElement = curElement.getNodeProperty("elementType");
        }

        TypeTree typeTree = (TypeTree) visitNode(curElement);
        List<JRightPadded<Space>> dimensions = new ArrayList<>(dimensionsCount);
        for (int i = 0; i < dimensionsCount; i++) {
            Space before = sourceBefore("[");
            dimensions.add(padRight(before, sourceBefore("]")));
        }

        return new J.ArrayType(
                randomId(),
                prefix,
                Markers.EMPTY,
                typeTree,
                dimensions
        );
    }

    private List<J.Modifier> mapModifiers(@Nullable List<TSCNode> nodes, List<J.Annotation> leadingAnnotations) {
        if (nodes == null) {
            return emptyList();
        }

        List<J.Modifier> modifiers = new ArrayList<>(nodes.size());
        List<J.Annotation> annotations = null;
        for (TSCNode node : nodes) {
            Space prefix = whitespace();
            switch (node.syntaxKind()) {
                // JS/TS equivalent of an annotation.
                case Decorator: {
                    J.Annotation annotation = (J.Annotation) visitNode(node);
                    if (annotations == null) {
                        annotations = new ArrayList<>(1);
                    }
                    annotations.add(annotation);
                    break;
                }
                // JS/TS keywords.
                case DeclareKeyword:
                case DefaultKeyword:
                case ExportKeyword: {
                    annotations = mapKeywordToAnnotation(prefix, node, annotations);
                    break;
                }
                // Keywords that exist in J.
                case AbstractKeyword:
                    skip("abstract");
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, J.Modifier.Type.Abstract, annotations == null ? emptyList() : annotations));
                    annotations = null;
                    break;
                case AsyncKeyword:
                    skip("async");
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, J.Modifier.Type.Async, annotations == null ? emptyList() : annotations));
                    annotations = null;
                    break;
                case PublicKeyword:
                    skip("public");
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, J.Modifier.Type.Public, annotations == null ? emptyList() : annotations));
                    annotations = null;
                    break;
                case PrivateKeyword:
                    skip("private");
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, J.Modifier.Type.Private, annotations == null ? emptyList() : annotations));
                    annotations = null;
                    break;
                case ProtectedKeyword:
                    skip("protected");
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, J.Modifier.Type.Protected, annotations == null ? emptyList() : annotations));
                    annotations = null;
                    break;
                case StaticKeyword:
                    skip("static");
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, J.Modifier.Type.Static, annotations == null ? emptyList() : annotations));
                    annotations = null;
                    break;
                default:
                    implementMe(node);
            }
        }
        if (annotations != null) {
            leadingAnnotations.addAll(annotations);
        }
        return modifiers.isEmpty() ? emptyList() : modifiers;
    }

    private List<J.Annotation> mapKeywordToAnnotation(Space prefix, String keyword, @Nullable List<J.Annotation> annotations) {
        J.Annotation annotation = new J.Annotation(
                randomId(),
                prefix,
                Markers.build(singletonList(new Keyword(randomId()))),
                convertToIdentifier(EMPTY, keyword),
                null
        );
        if (annotations == null) {
            annotations = new ArrayList<>(1);
        }
        annotations.add(annotation);
        return annotations;
    }

    private List<J.Annotation> mapKeywordToAnnotation(Space prefix, TSCNode node, @Nullable List<J.Annotation> annotations) {
        J.Annotation annotation = new J.Annotation(
                randomId(),
                prefix,
                Markers.build(singletonList(new Keyword(randomId()))),
                (NameTree) visitNode(node),
                null
        );
        if (annotations == null) {
            annotations = new ArrayList<>(1);
        }
        annotations.add(annotation);
        return annotations;
    }

    @Nullable
    private J.TypeParameters mapTypeParameters(@Nullable List<TSCNode> typeParameters) {
        return typeParameters == null ? null : new J.TypeParameters(randomId(), sourceBefore("<"), Markers.EMPTY,
                        emptyList(),
                        convertAll(typeParameters, commaDelim, t -> sourceBefore(">")));
    }

    private J mapVariableStatement(TSCNode node) {
        TSCNode declarationList = node.getOptionalNodeProperty("declarationList");
        List<TSCNode> declarations = declarationList == null ?
                emptyList() : declarationList.getNodeListProperty("declarations");
        if (declarationList != null) {
            for (TSCNode declaration : declarations) {
                if (declaration.syntaxKind() == TSCSyntaxKind.VariableDeclaration) {
                    TSCNode name = declaration.getOptionalNodeProperty("name");
                    if (name != null && name.syntaxKind() == TSCSyntaxKind.ObjectBindingPattern) {
                        return mapObjectBindingDeclaration(node);
                    }
                }
            }
        }

        return visitVariableStatement(node);
    }

    private void skip(String word) {
        cursor(getCursor() + word.length());
    }

    private int positionOfNext(String untilDelim) {
        return positionOfNext(untilDelim, null);
    }

    private int positionOfNext(String untilDelim, @Nullable Character stop) {
        boolean inMultiLineComment = false;
        boolean inSingleLineComment = false;

        int delimIndex = getCursor();
        for (; delimIndex < source.length() - untilDelim.length() + 1; delimIndex++) {
            if (inSingleLineComment) {
                if (source.charAt(delimIndex) == '\n') {
                    inSingleLineComment = false;
                }
            } else {
                if (source.length() - untilDelim.length() > delimIndex + 1) {
                    char c1 = source.charAt(delimIndex);
                    char c2 = source.charAt(delimIndex + 1);
                    if (c1 == '/') {
                        if (c2 == '/') {
                            inSingleLineComment = true;
                            delimIndex++;
                        } else if (c2 == '*') {
                            inMultiLineComment = true;
                            delimIndex++;
                        }
                    } else if (c1 == '*') {
                        if (c2 == '/') {
                            inMultiLineComment = false;
                            delimIndex += 2;
                        }
                    }
                }

                if (!inMultiLineComment && !inSingleLineComment) {
                    if (stop != null && source.charAt(delimIndex) == stop) {
                        return -1;
                    } // reached stop word before finding the delimiter

                    if (source.startsWith(untilDelim, delimIndex)) {
                        break; // found it!
                    }
                }
            }
        }

        return delimIndex > source.length() - untilDelim.length() ? -1 : delimIndex;
    }

    private Space sourceBefore(String untilDelim) {
        int delimIndex = positionOfNext(untilDelim);
        if (delimIndex < 0) {
            return EMPTY; // unable to find this delimiter
        }

        String prefix = source.substring(getCursor(), delimIndex);
        skip(prefix);
        skip(untilDelim);
        return Space.format(prefix);
    }

    private Space whitespace() {
        String prefix = source.substring(getCursor(), indexOfNextNonWhitespace(getCursor(), source));
        skip(prefix);
        return format(prefix);
    }

    private JS.UnknownElement unknownElement(TSCNode node) {
        Space prefix = whitespace();
        String text = node.getText();
        skip(text);
        ParseExceptionResult result = new ParseExceptionResult(
                randomId(),
                ParseExceptionAnalysis.getAnalysisMessage(node.syntaxKind().name(),
                        getCursor() + 20 < source.length() ? source.substring(getCursor(), getCursor() + 20) :
                                source.substring(getCursor()))
        );
        return new JS.UnknownElement(
                randomId(),
                prefix,
                Markers.EMPTY,
                new JS.UnknownElement.Source(
                        randomId(),
                        EMPTY,
                        Markers.build(singletonList(result)),
                        text
                )
        );
    }

    private void implementMe(TSCNode node) {
        throw new RuntimeException(
                ParseExceptionAnalysis.getAnalysisMessage(node.syntaxKind().name(),
                        getCursor() + 20 < source.length() ? source.substring(getCursor(), getCursor() + 20) :
                                source.substring(getCursor()))
        );
    }

    private void implementMe(TSCNode node, String propertyName) {
        if (node.hasProperty(propertyName)) {
            throw new RuntimeException(
                    ParseExceptionAnalysis.getAnalysisMessage(node.syntaxKind().name() + "." + propertyName,
                            getCursor() + 20 < source.length() ? source.substring(getCursor(), getCursor() + 20) :
                                    source.substring(getCursor()))
            );
        }
    }
}