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
import org.openrewrite.internal.ListUtils;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.internal.JavaTypeCache;
import org.openrewrite.java.marker.Semicolon;
import org.openrewrite.java.marker.TrailingComma;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.TypeScriptTypeMapping;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCSourceFileContext;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.marker.Markers;
import org.openrewrite.markers.ForLoopType;
import org.openrewrite.markers.FunctionDeclaration;
import org.openrewrite.markers.TypeReferencePrefix;
import org.openrewrite.markers.VariableModifier;

import java.nio.file.Path;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static org.openrewrite.Tree.randomId;
import static org.openrewrite.java.tree.Space.EMPTY;

@SuppressWarnings("DataFlowIssue")
public class TypeScriptParserVisitor {

    private final TSCNode source;
    private final TSCSourceFileContext cursorContext;
    private final Path sourcePath;
    private final TypeScriptTypeMapping typeMapping;

    @Nullable
    private final Path relativeTo;

    private final String charset;
    private final boolean isCharsetBomMarked;

    public TypeScriptParserVisitor(TSCNode source, TSCSourceFileContext sourceContext, Path sourcePath, @Nullable Path relativeTo, JavaTypeCache typeCache, String charset, boolean isCharsetBomMarked) {
        this.source = source;
        this.cursorContext = sourceContext;
        this.sourcePath = sourcePath;
        this.relativeTo = relativeTo;
        this.charset = charset;
        this.isCharsetBomMarked = isCharsetBomMarked;
        this.typeMapping = new TypeScriptTypeMapping(typeCache);
    }

    public JS.CompilationUnit visitSourceFile() {
        List<JRightPadded<Statement>> statements = new ArrayList<>();
        for (TSCNode child : source.getNodeListProperty("statements")) {
            @Nullable J visited;
            try {
                visited = visitNode(child);
            } catch (Exception e) {
                throw new JavaScriptParsingException("Failed to parse statement", e);
            }
            if (visited != null) {
                if (!(visited instanceof Statement) && visited instanceof Expression) {
                    visited = new JS.ExpressionStatement(randomId(), (Expression) visited);
                }
                statements.add(maybeSemicolon((Statement) visited));
            }
        }
        return new JS.CompilationUnit(
                randomId(),
                EMPTY,
                Markers.EMPTY,
                relativeTo == null ? null : relativeTo.relativize(sourcePath),
                FileAttributes.fromPath(sourcePath),
                charset,
                isCharsetBomMarked,
                null,
                // FIXME remove
                source.getText(),
                emptyList(),
                statements,
                EMPTY
        );
    }

    private J.Assignment visitAssignment(TSCNode node) {
        Space prefix = whitespace();
        Expression left = (Expression) visitNode(node.getNodeProperty("left"));
        Space before = sourceBefore(TSCSyntaxKind.EqualsToken);
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
                op = padLeft(sourceBefore(TSCSyntaxKind.AsteriskEqualsToken), J.AssignmentOperation.Type.Multiplication);
                break;
            case MinusEqualsToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.MinusEqualsToken), J.AssignmentOperation.Type.Subtraction);
                break;
            case PercentEqualsToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.PercentEqualsToken), J.AssignmentOperation.Type.Modulo);
                break;
            case PlusEqualsToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.PlusEqualsToken), J.AssignmentOperation.Type.Addition);
                break;
            case SlashEqualsToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.SlashEqualsToken), J.AssignmentOperation.Type.Division);
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

    private J.NewArray visitArrayLiteralExpression(TSCNode node) {
        Space prefix = whitespace();

        List<TSCNode> elements = node.getNodeListProperty("elements");
        JContainer<Expression> expression = visitContainer(
                TSCSyntaxKind.OpenBracketToken,
                elements,
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.CloseBracketToken,
                t -> (Expression) visitNode(t));

        return new J.NewArray(
                randomId(),
                prefix,
                Markers.EMPTY,
                null,
                emptyList(),
                expression,
                typeMapping.type(node)
        );
    }

    private J visitArrayType(TSCNode node) {
        Space prefix = whitespace();
        TypeTree typeTree = visitIdentifier(node.getNodeProperty("elementType"));

        List<JRightPadded<Space>> dimensions = new ArrayList<>();
        while (true) {
            int saveCursor = getCursor();
            Space before = whitespace();
            if (source.getText().charAt(getCursor()) != '[') {
                cursor(saveCursor);
                break;
            }
            consumeToken(TSCSyntaxKind.OpenBracketToken);
            dimensions.add(padRight(before, sourceBefore(TSCSyntaxKind.CloseBracketToken)));
        }

        return new J.ArrayType(
                randomId(),
                prefix,
                Markers.EMPTY,
                typeTree,
                dimensions
        );
    }


    private J.Binary visitBinary(TSCNode node) {
        Space prefix = whitespace();
        Expression left = (Expression) visitNode(node.getNodeProperty("left"));

        JLeftPadded<J.Binary.Type> op = null;
        TSCSyntaxKind opKind = node.getNodeProperty("operatorToken").syntaxKind();
        switch (opKind) {
            // Bitwise ops
            case AmpersandToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.AmpersandToken), J.Binary.Type.BitAnd);
                break;
            case BarToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.BarToken), J.Binary.Type.BitOr);
                break;
            case CaretToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.CaretToken), J.Binary.Type.BitXor);
                break;
            case GreaterThanGreaterThanToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.GreaterThanGreaterThanToken), J.Binary.Type.RightShift);
                break;
            case LessThanLessThanToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.LessThanLessThanToken), J.Binary.Type.LeftShift);
                break;
            // Logical ops
            case AmpersandAmpersandToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.AmpersandAmpersandToken), J.Binary.Type.And);
                break;
            case BarBarToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.BarBarToken), J.Binary.Type.Or);
                break;
            case EqualsEqualsToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.EqualsEqualsToken), J.Binary.Type.Equal);
                break;
            case ExclamationEqualsToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.ExclamationEqualsToken), J.Binary.Type.NotEqual);
                break;
            case GreaterThanToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.GreaterThanToken), J.Binary.Type.GreaterThan);
                break;
            case GreaterThanEqualsToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.GreaterThanEqualsToken), J.Binary.Type.GreaterThanOrEqual);
                break;
            case GreaterThanGreaterThanGreaterThanToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.GreaterThanGreaterThanGreaterThanToken), J.Binary.Type.UnsignedRightShift);
                break;
            case LessThanToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.LessThanToken), J.Binary.Type.LessThan);
                break;
            case LessThanEqualsToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.LessThanEqualsToken), J.Binary.Type.LessThanOrEqual);
                break;
            // Arithmetic ops
            case AsteriskToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.AsteriskToken), J.Binary.Type.Multiplication);
                break;
            case MinusToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.MinusToken), J.Binary.Type.Subtraction);
                break;
            case PercentToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.PercentToken), J.Binary.Type.Modulo);
                break;
            case PlusToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.PlusToken), J.Binary.Type.Addition);
                break;
            case SlashToken:
                op = padLeft(sourceBefore(TSCSyntaxKind.SlashToken), J.Binary.Type.Division);
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
            updates.add(padRight((Statement) visitNode(left), sourceBefore(TSCSyntaxKind.CommaToken)));
        }
        Statement r = (Statement) visitNode(incrementor.getNodeProperty("right"));
        Space after = whitespace();
        if (source.getText().charAt(getCursor()) == ',') {
            consumeToken(TSCSyntaxKind.CommaToken);
        } else if (source.getText().charAt(getCursor()) == ')') {
            consumeToken(TSCSyntaxKind.CloseParenToken);
        }
        updates.add(padRight(r, after));
    }

    private J.Block visitBlock(@Nullable TSCNode node) {
        if (node == null) {
            // Some bodies can return a null block.
            throw new UnsupportedOperationException("FIXME");
        }

        Space prefix = sourceBefore(TSCSyntaxKind.OpenBraceToken);

        List<TSCNode> statementNodes = node.getNodeListProperty("statements");
        List<JRightPadded<Statement>> statements = new ArrayList<>(statementNodes.size());

        for (TSCNode statementNode : statementNodes) {
            statements.add(visitStatement(statementNode));
        }

        Space endOfBlock = sourceBefore(TSCSyntaxKind.CloseBraceToken);
        return new J.Block(
                randomId(),
                prefix,
                Markers.EMPTY,
                JRightPadded.build(false),
                statements,
                endOfBlock
        );
    }

    private J visitBreakStatement(TSCNode node) {
        return new J.Break(
                randomId(),
                sourceBefore(TSCSyntaxKind.BreakKeyword),
                Markers.EMPTY,
                node.hasProperty("label") ? (J.Identifier) visitNode(node.getNodeProperty("label")) : null
        );
    }

    private J.MethodInvocation visitCallExpression(TSCNode node) {
        Space prefix = whitespace();
        implementMe(node, "questionDotToken");
        implementMe(node, "typeArguments");

        JRightPadded<Expression> select = null;
        JContainer<Expression> typeParameters = null;
        TSCNode expression = node.getNodeProperty("expression");

        if (expression.hasProperty("expression")) {
            // Adjust padding.
            implementMe(expression, "questionDotToken");

            select = padRight(visitNameExpression(expression.getNodeProperty("expression")), sourceBefore(TSCSyntaxKind.DotToken));
        }

        J.Identifier name = visitIdentifier(expression.getNodeProperty("name"));
        JContainer<Expression> arguments = null;
        if (node.hasProperty("arguments")) {
            arguments = visitContainer(
                    TSCSyntaxKind.OpenParenToken,
                    node.getNodeListProperty("arguments"),
                    TSCSyntaxKind.CommaToken,
                    TSCSyntaxKind.CloseParenToken,
                    t -> (Expression) visitNode(t)
            );
        }

        return new J.MethodInvocation(
                randomId(),
                prefix,
                Markers.EMPTY,
                select,
                typeParameters,
                name,
                arguments,
                typeMapping.methodInvocationType(node)
        );
    }


    private J.ClassDeclaration visitClassDeclaration(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> leadingAnnotation = emptyList(); // FIXME

        List<J.Modifier> modifiers = emptyList();
        if (node.hasProperty("modifiers")) {
            modifiers = visitModifiers(node.getNodeListProperty("modifiers"));
        }

        List<J.Annotation> kindAnnotations = emptyList(); // FIXME

        Space kindPrefix;
        TSCSyntaxKind syntaxKind = node.syntaxKind();
        J.ClassDeclaration.Kind.Type type;
        switch (syntaxKind) {
            case EnumDeclaration:
                kindPrefix = sourceBefore(TSCSyntaxKind.EnumKeyword);
                type = J.ClassDeclaration.Kind.Type.Enum;
                break;
            case InterfaceDeclaration:
                kindPrefix = sourceBefore(TSCSyntaxKind.InterfaceKeyword);
                type = J.ClassDeclaration.Kind.Type.Interface;
                break;
            default:
                kindPrefix = sourceBefore(TSCSyntaxKind.ClassKeyword);
                type = J.ClassDeclaration.Kind.Type.Class;
        }

        J.ClassDeclaration.Kind kind = new J.ClassDeclaration.Kind(randomId(), kindPrefix, Markers.EMPTY, kindAnnotations, type);

        J.Identifier name;
        if (node.hasProperty("name")) {
            name = visitIdentifier(node.getNodeProperty("name"));
        } else {
            throw new UnsupportedOperationException("Class has no name ... add support");
        }

        JContainer<J.TypeParameter> typeParams = null;

        J.Block body;
        List<JRightPadded<Statement>> members;
        if (node.hasProperty("members")) {
            Space bodyPrefix = sourceBefore(TSCSyntaxKind.OpenBraceToken);

            TSCNode membersNode = node.getNodeProperty("members");
            List<TSCNode> nodes = node.getNodeListProperty("members");
            if (kind.getType() == J.ClassDeclaration.Kind.Type.Enum) {
                Space enumPrefix = whitespace();

                members = new ArrayList<>(1);
                List<JRightPadded<J.EnumValue>> enumValues = new ArrayList<>(nodes.size());
                for (int i = 0; i < nodes.size(); i++) {
                    TSCNode enumValue = nodes.get(i);
                    J.EnumValue value = (J.EnumValue) visitNode(enumValue);
                    if (value != null) {
                        boolean hasTrailingComma = i == nodes.size() - 1 && membersNode.getBooleanProperty("hasTrailingComma");
                        Space after = i < nodes.size() - 1 ? sourceBefore(TSCSyntaxKind.CommaToken) :
                                hasTrailingComma ? sourceBefore(TSCSyntaxKind.CommaToken) : EMPTY;
                        JRightPadded<J.EnumValue> ev = padRight(value, after);
                        if (i == nodes.size() - 1) {
                            if (hasTrailingComma) {
                                ev = ev.withMarkers(ev.getMarkers().addIfAbsent(new TrailingComma(randomId(), EMPTY)));
                            }
                        }
                        enumValues.add(ev);
                    }
                }

                JRightPadded<Statement> enumSet = padRight(
                        new J.EnumValueSet(
                                randomId(),
                                enumPrefix,
                                Markers.EMPTY,
                                enumValues,
                                false
                        ),
                        EMPTY
                );
                members.add(enumSet);
            } else {
                members = new ArrayList<>(nodes.size());
                for (TSCNode statement : nodes) {
                    members.add(visitStatement(statement));
                }
            }

            body = new J.Block(randomId(), bodyPrefix, Markers.EMPTY, new JRightPadded<>(false, EMPTY, Markers.EMPTY),
                    members, sourceBefore(TSCSyntaxKind.CloseBraceToken));
        } else {
            // This shouldn't happen.
            throw new UnsupportedOperationException("Add support for empty body");
        }

        JContainer<Statement> primaryConstructor = null;

        // // FIXME: extendings and implementings work differently in TS @Gary.
        JLeftPadded<TypeTree> extendings = null;
        JContainer<TypeTree> implementings = null;

        return new J.ClassDeclaration(
                randomId(),
                prefix,
                markers,
                leadingAnnotation,
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

    private J visitConditionalExpression(TSCNode node) {
        return new J.Ternary(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                (Expression) visitNode(node.getNodeProperty("condition")),
                padLeft(sourceBefore(TSCSyntaxKind.QuestionToken), (Expression) visitNode(node.getNodeProperty("whenTrue"))),
                padLeft(sourceBefore(TSCSyntaxKind.ColonToken), (Expression) visitNode(node.getNodeProperty("whenFalse"))),
                typeMapping.type(node)
        );
    }

    private J.Continue visitContinueStatement(TSCNode node) {
        return new J.Continue(
                randomId(),
                sourceBefore(TSCSyntaxKind.ContinueKeyword),
                Markers.EMPTY,
                node.hasProperty("label") ? (J.Identifier) visitNode(node.getNodeProperty("label")) : null
        );
    }

    private J.MethodDeclaration visitConstructor(TSCNode node) {
        Space prefix = whitespace();
        implementMe(node, "modifiers");
        consumeToken(TSCSyntaxKind.ConstructorKeyword);
        J.Identifier name = new J.Identifier(
                randomId(),
                EMPTY,
                Markers.EMPTY,
                "constructor",
                typeMapping.type(node),
                null
        );

        JContainer<Statement> params = visitContainer(
                TSCSyntaxKind.OpenParenToken,
                node.getNodeListProperty("parameters"),
                null,
                TSCSyntaxKind.CloseParenToken,
                t -> (Statement) visitNode(t));

        J.Block body = (J.Block) visitNode(node.getNodeProperty("body"));
        implementMe(node, "typeParameters");
        implementMe(node, "type");
        implementMe(node, "typeArguments");
        return new J.MethodDeclaration(
                randomId(),
                prefix,
                Markers.EMPTY,
                emptyList(),
                emptyList(),
                null,
                null,
                new J.MethodDeclaration.IdentifierWithAnnotations(name, Collections.emptyList()),
                params,
                null,
                body,
                null,
                typeMapping.methodDeclarationType(node)
        );
    }

    private <J2 extends J> J.ControlParentheses<J2> mapControlParentheses(TSCNode node) {
        //noinspection unchecked
        return new J.ControlParentheses<>(
                randomId(),
                sourceBefore(TSCSyntaxKind.OpenParenToken),
                Markers.EMPTY,
                padRight((J2) visitNode(node), sourceBefore(TSCSyntaxKind.CloseParenToken))
        );
    }

    private J visitDecorator(TSCNode node) {
        Space prefix = sourceBefore(TSCSyntaxKind.AtToken);
        implementMe(node, "questionDotToken");
        implementMe(node, "typeArguments");
        TSCNode callExpression = node.getNodeProperty("expression");
        NameTree name = (NameTree) visitNameExpression(callExpression.getNodeProperty("expression"));
        JContainer<Expression> arguments = callExpression.hasProperty("arguments") ? visitContainer(
                TSCSyntaxKind.OpenParenToken,
                callExpression.getNodeListProperty("arguments"),
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.CloseParenToken,
                t -> (Expression) visitNode(t)
        ) : null;
        return new J.Annotation(
                randomId(),
                prefix,
                Markers.EMPTY,
                name,
                arguments
        );
    }

    private J visitDoStatement(TSCNode node) {
        Space prefix = sourceBefore(TSCSyntaxKind.DoKeyword);
        JRightPadded<Statement> body = maybeSemicolon((Statement) visitNode(node.getNodeProperty("statement")));

        JLeftPadded<J.ControlParentheses<Expression>> control =
                padLeft(sourceBefore(TSCSyntaxKind.WhileKeyword), mapControlParentheses(node.getNodeProperty("expression")));
        return new J.DoWhileLoop(
                randomId(),
                prefix,
                Markers.EMPTY,
                body,
                control
        );
    }

    private Statement visitEmptyStatement(TSCNode ignored) {
        return new J.Empty(randomId(), EMPTY, Markers.EMPTY);
    }

    private J.EnumValue visitEnumMember(TSCNode node) {
        Space prefix = whitespace();

        List<J.Annotation> annotations = null; // FIXME
        return new J.EnumValue(
                randomId(),
                prefix,
                Markers.EMPTY,
                annotations == null ? emptyList() : annotations,
                visitIdentifier(node.getNodeProperty("name")),
                null);
    }

    public Expression visitExpressionStatement(TSCNode node) {
        return (Expression) visitNode(node.getNodeProperty("expression"));
    }


    private J.ForLoop visitForStatement(TSCNode node) {
        System.out.println();
        Space prefix = sourceBefore(TSCSyntaxKind.ForKeyword);

        Space beforeControl = sourceBefore(TSCSyntaxKind.OpenParenToken);
        List<JRightPadded<Statement>> initStatements = singletonList(padRight((Statement) visitNode(node.getNodeProperty("initializer")), whitespace()));
        consumeToken(TSCSyntaxKind.SemicolonToken);

        JRightPadded<Expression> condition = padRight((Expression) visitNode(node.getNodeProperty("condition")), sourceBefore(TSCSyntaxKind.SemicolonToken));

        TSCNode incrementor = node.getNodeProperty("incrementor");
        List<JRightPadded<Statement>> update;
        if (incrementor.syntaxKind() == TSCSyntaxKind.BinaryExpression) {
            update = new ArrayList<>(2);
            visitBinaryUpdateExpression(incrementor, update);
        } else {
            update = singletonList(padRight((Statement) visitNode(incrementor), sourceBefore(TSCSyntaxKind.CloseParenToken)));
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
        Space prefix = sourceBefore(TSCSyntaxKind.ForKeyword);
        Markers markers = Markers.EMPTY;
        implementMe(node, "awaitModifier");

        Space beforeControl = sourceBefore(TSCSyntaxKind.OpenParenToken);
        JRightPadded<J.VariableDeclarations> variable = padRight((J.VariableDeclarations) visitNode(node.getNodeProperty("initializer")), whitespace());

        TSCSyntaxKind forEachKind = scan();
        if (forEachKind == TSCSyntaxKind.OfKeyword) {
            markers = markers.addIfAbsent(new ForLoopType(randomId(), ForLoopType.Keyword.OF));
        } else if (forEachKind == TSCSyntaxKind.InKeyword) {
            markers = markers.addIfAbsent(new ForLoopType(randomId(), ForLoopType.Keyword.IN));
        }

        JRightPadded<Expression> iterable = padRight((Expression) visitNode(node.getNodeProperty("expression")), sourceBefore(TSCSyntaxKind.CloseParenToken));
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

    private J.MethodDeclaration visitFunctionDeclaration(TSCNode node) {
        Space prefix = sourceBefore(TSCSyntaxKind.FunctionKeyword);

        J.Identifier name;
        if (node.hasProperty("name")) {
            name = visitIdentifier(node.getNodeProperty("name"));
        } else {
            // FIXME: get input, we can add an anonymous name and prevent printing with a marker.
            // Function expressions do not require a name `function (..)`
            name = new J.Identifier(randomId(), EMPTY, Markers.EMPTY, "", null, null);
        }

        JContainer<Statement> parameters = visitContainer(
                TSCSyntaxKind.OpenParenToken,
                node.getNodeListProperty("parameters"),
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.CloseParenToken,
                this::visitFunctionParameter
        );

        J.Block block = visitBlock(node.getNodeProperty("body"));

        return new J.MethodDeclaration(
                randomId(),
                prefix,
                Markers.EMPTY.addIfAbsent(new FunctionDeclaration(randomId())),
                Collections.emptyList(),
                Collections.emptyList(),
                null,
                null,
                new J.MethodDeclaration.IdentifierWithAnnotations(name, Collections.emptyList()),
                parameters,
                null,
                block,
                null,
                typeMapping.methodDeclarationType(node)
        );
    }

    private Statement visitFunctionParameter(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;
        implementMe(node, "modifiers");

        Space variablePrefix = whitespace();
        J.Identifier name = visitIdentifier(node.getNodeProperty("name"));

        implementMe(node, "questionToken");

        Space afterName = EMPTY;
        TypeTree typeTree = null;
        if (node.hasProperty("type")) {
            // FIXME: method(x: { suit: string; card: number }[])
            Space beforeColon = sourceBefore(TSCSyntaxKind.ColonToken);
            if (beforeColon != EMPTY) {
                markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
            }
            TSCNode type = node.getNodeProperty("type");
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
        ), afterName));

        implementMe(node, "initializer");

        Space varargs = null;
        List<JLeftPadded<Space>> dimensionsBeforeName = emptyList();

        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                emptyList(), // TODO:
                emptyList(), // TODO:
                typeTree,
                varargs,
                dimensionsBeforeName,
                variables
        );
    }

    private J.Identifier visitIdentifier(TSCNode node) {
        Space prefix = sourceBefore(node.getText());
        // TODO: check on escapedText property.
        return new J.Identifier(
                randomId(),
                prefix,
                Markers.EMPTY,
                node.getText(),
                typeMapping.type(node),
                null // FIXME
        );
    }

    private J visitIfStatement(TSCNode node) {
        Space prefix = whitespace();

        consumeToken(TSCSyntaxKind.IfKeyword);

        J.ControlParentheses<Expression> control = mapControlParentheses(node.getNodeProperty("expression"));
        JRightPadded<Statement> thenPart = visitStatement(node.getNodeProperty("thenStatement"));

        J.If.Else elsePart = null;
        if (node.hasProperty("elseStatement")) {
            Space elsePartPrefix = whitespace();
            consumeToken(TSCSyntaxKind.ElseKeyword);
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

    private J visitJsBinary(TSCNode node) {
        Space prefix = whitespace();
        Expression left = (Expression) visitNode(node.getNodeProperty("left"));

        JLeftPadded<JS.JsBinary.Type> op;
        TSCSyntaxKind opKind = node.getNodeProperty("operatorToken").syntaxKind();
        if (opKind == TSCSyntaxKind.EqualsEqualsEqualsToken) {
            op = padLeft(sourceBefore(TSCSyntaxKind.EqualsEqualsEqualsToken), JS.JsBinary.Type.IdentityEquals);
        } else if (opKind == TSCSyntaxKind.ExclamationEqualsEqualsToken) {
            op = padLeft(sourceBefore(TSCSyntaxKind.ExclamationEqualsEqualsToken), JS.JsBinary.Type.IdentityNotEquals);
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

    private J.MethodDeclaration visitMethodDeclaration(TSCNode node) {
        Space prefix = whitespace();
        List<J.Annotation> annotations = emptyList();
        if (node.hasProperty("modifiers")) {
            annotations = node.getNodeListProperty("modifiers").stream()
                    .map(it -> (J.Annotation) visitNode(it))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }
        List<J.Modifier> modifiers = emptyList();

        implementMe(node, "typeParameters");
        J.TypeParameters typeParameters = null;

        TypeTree returnTypeExpression = null;

        implementMe(node, "asteriskToken");
        implementMe(node, "questionToken");
        implementMe(node, "exclamationToken");
        implementMe(node, "nextContainer");
        implementMe(node, "typeArguments");

        J.Identifier name = visitIdentifier(node.getNodeProperty("name"));

        JContainer<Statement> parameters = visitContainer(
                TSCSyntaxKind.OpenParenToken,
                node.getNodeListProperty("parameters"),
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.CloseParenToken,
                t -> (Statement) visitNode(t)
        );

        JContainer<NameTree> throwz = null;

        J.Block body = visitBlock(node.getNodeProperty("body"));
        JLeftPadded<Expression> defaultValue = null;
        implementMe(node, "type");

        return new J.MethodDeclaration(
                randomId(),
                prefix,
                Markers.EMPTY,
                annotations,
                modifiers,
                typeParameters,
                returnTypeExpression,
                new J.MethodDeclaration.IdentifierWithAnnotations(name, emptyList()),
                parameters,
                throwz,
                body,
                defaultValue,
                typeMapping.methodDeclarationType(node)
        );
    }

    private List<J.Modifier> visitModifiers(List<TSCNode> nodes) {
        List<J.Modifier> modifiers = new ArrayList<>(nodes.size());
        for (TSCNode node : nodes) {
            List<J.Annotation> annotations = emptyList(); // FIXME: maybe add annotations.
            Space prefix = whitespace();
            switch (node.syntaxKind()) {
                case AbstractKeyword:
                    consumeToken(TSCSyntaxKind.AbstractKeyword);
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, J.Modifier.Type.Abstract, annotations));
                    break;
                case PrivateKeyword:
                    consumeToken(TSCSyntaxKind.PrivateKeyword);
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, J.Modifier.Type.Private, annotations));
                    break;
                default:
                    implementMe(node);
            }
        }

        return modifiers;
    }

    private Expression visitNameExpression(TSCNode expression) {
        if (expression.hasProperty("expression")) {
            Space prefix = whitespace();
            Expression select = visitNameExpression(expression.getNodeProperty("expression"));

            // Adjust left padding from sourceBefore.
            implementMe(expression, "questionDotToken");

            JLeftPadded<J.Identifier> name = padLeft(sourceBefore(TSCSyntaxKind.DotToken), visitIdentifier(expression.getNodeProperty("name")));

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

    private J visitNewExpression(TSCNode node) {
        Space prefix = sourceBefore(TSCSyntaxKind.NewKeyword);
        TypeTree typeTree = null;
        if (node.hasProperty("expression")) {
            typeTree = (TypeTree) visitNameExpression(node.getNodeProperty("expression"));
        }
        implementMe(node, "typeArguments");
        JContainer<Expression> arguments = visitContainer(
                TSCSyntaxKind.OpenParenToken,
                node.getNodeListProperty("arguments"),
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.CloseParenToken,
                t -> (Expression) visitNode(t)
        );
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

    private J visitNumericLiteral(TSCNode node) {
        return new J.Literal(
                randomId(),
                sourceBefore(TSCSyntaxKind.NumericLiteral),
                Markers.EMPTY,
                node.getStringProperty("text"),
                node.getText(),
                null, // TODO
                typeMapping.primitive(node)
        );
    }

    private J visitObjectBindingPattern(TSCNode node) {
        implementMe(node);
        return null;
    }

    private J visitObjectLiteralExpression(TSCNode node) {
        implementMe(node);
        return null;
    }

    private J visitParenthesizedExpression(TSCNode node) {
        return new J.Parentheses<>(
                randomId(),
                sourceBefore(TSCSyntaxKind.OpenParenToken),
                Markers.EMPTY,
                padRight(visitNode(node.getNodeProperty("expression")), sourceBefore(TSCSyntaxKind.CloseParenToken))
        );
    }

    private J visitPropertyAccessExpression(TSCNode node) {
        Space prefix = whitespace();
        implementMe(node, "questionDotToken");

        Expression nameExpression = visitNameExpression(node.getNodeProperty("expression"));
        return new J.FieldAccess(
                randomId(),
                prefix,
                Markers.EMPTY,
                nameExpression,
                padLeft(sourceBefore(TSCSyntaxKind.DotToken), visitIdentifier(node.getNodeProperty("name"))),
                typeMapping.type(node)
        );
    }

    private J visitPropertyDeclaration(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        implementMe(node, "questionToken");
        implementMe(node, "exclamationToken");

        List<J.Modifier> modifiers;
        if (node.hasProperty("modifiers")) {
            modifiers = visitModifiers(node.getNodeListProperty("modifiers"));
        } else {
            modifiers = emptyList();
        }

        Space variablePrefix = whitespace();
        J j = visitNode(node.getNodeProperty("name"));
        J.Identifier name = null;
        if (j instanceof J.Identifier) {
            name = (J.Identifier) j;
        } else {
            implementMe(node);
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

        TypeTree typeTree = null;
        if (node.hasProperty("type")) {
            // FIXME: method(x: { suit: string; card: number }[])
            Space beforeColon = sourceBefore(TSCSyntaxKind.ColonToken);
            if (beforeColon != EMPTY) {
                markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
            }
            TSCNode type = node.getNodeProperty("type");
            typeTree = (TypeTree) visitNode(type);
        }

        List<JLeftPadded<Space>> dimensions = emptyList();
        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                emptyList(),
                modifiers,
                typeTree,
                null,
                dimensions,
                variables
        );
    }

    private J.Return visitReturnStatement(TSCNode node) {
        Space prefix = sourceBefore(TSCSyntaxKind.ReturnKeyword);
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
        // FIXME
        Statement statement = (Statement) visitNode(node);

        assert statement != null;
        return maybeSemicolon(statement);
    }

    private J.Literal visitStringLiteral(TSCNode node) {
        // singleQuote
        // hasExtendedUnicodeEscape
        return new J.Literal(
                randomId(),
                sourceBefore(TSCSyntaxKind.StringLiteral),
                Markers.EMPTY,
                node.getStringProperty("text"),
                node.getText(),
                null, // TODO
                JavaType.Primitive.String
        );
    }

    private J visitThrowStatement(TSCNode node) {
        return new J.Throw(
                randomId(),
                sourceBefore(TSCSyntaxKind.ThrowKeyword),
                Markers.EMPTY,
                (Expression) visitNode(node.getNodeProperty("expression"))
        );
    }

    private J visitTryStatement(TSCNode node) {
        Space prefix = sourceBefore(TSCSyntaxKind.TryKeyword);
        J.Block tryBlock = (J.Block) visitNode(node.getNodeProperty("tryBlock"));

        TSCNode catchClause = node.getNodeProperty("catchClause");
        J.Try.Catch aCatch = new J.Try.Catch(
                randomId(),
                sourceBefore(TSCSyntaxKind.CatchKeyword),
                Markers.EMPTY,
                mapControlParentheses(catchClause.getNodeProperty("variableDeclaration")),
                (J.Block) visitNode(catchClause.getNodeProperty("block"))
        );

        JLeftPadded<J.Block> finallyBlock = null;
        if (node.hasProperty("finallyBlock")) {
            finallyBlock = padLeft(sourceBefore(TSCSyntaxKind.FinallyKeyword), (J.Block) visitNode(node.getNodeProperty("finallyBlock")));
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

    private J visitTypeReference(TSCNode node) {
        return new J.ParameterizedType(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                (NameTree) visitNode(node.getNodeProperty("typeName")),
                !node.hasProperty("typeArguments") ? null :
                        visitContainer(
                                TSCSyntaxKind.LessThanToken,
                                node.getNodeListProperty("typeArguments"),
                                TSCSyntaxKind.CommaToken,
                                TSCSyntaxKind.GreaterThanToken,
                                t -> (Expression) visitNode(t)
                        ),
                typeMapping.type(node)
        );
    }

    private J visitUnaryExpression(TSCNode node) {
        Space prefix = whitespace();

        JLeftPadded<J.Unary.Type> op = null;
        TSCSyntaxKind opKind = TSCSyntaxKind.fromCode(node.getIntProperty("operator"));
        Expression expression;
        if (node.syntaxKind() == TSCSyntaxKind.PrefixUnaryExpression) {
            if (opKind == TSCSyntaxKind.ExclamationToken) {
                op = padLeft(sourceBefore(TSCSyntaxKind.ExclamationToken), J.Unary.Type.Not);
            } else if (opKind == TSCSyntaxKind.MinusMinusToken) {
                op = padLeft(sourceBefore(TSCSyntaxKind.MinusMinusToken), J.Unary.Type.PreDecrement);
            } else if (opKind == TSCSyntaxKind.PlusPlusToken) {
                op = padLeft(sourceBefore(TSCSyntaxKind.PlusPlusToken), J.Unary.Type.PreIncrement);
            } else {
                implementMe(node);
            }
            expression = (Expression) visitNode(node.getNodeProperty("operand"));
        } else {
            expression = (Expression) visitNode(node.getNodeProperty("operand"));
            if (opKind == TSCSyntaxKind.MinusMinusToken) {
                op = padLeft(sourceBefore(TSCSyntaxKind.MinusMinusToken), J.Unary.Type.PostDecrement);
            } else if (opKind == TSCSyntaxKind.PlusPlusToken) {
                op = padLeft(sourceBefore(TSCSyntaxKind.PlusPlusToken), J.Unary.Type.PostIncrement);
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

    private J visitWhileStatement(TSCNode node) {
        Space prefix = sourceBefore(TSCSyntaxKind.WhileKeyword);
        J.ControlParentheses<Expression> control = mapControlParentheses(node.getNodeProperty("expression"));
        return new J.WhileLoop(
                randomId(),
                prefix,
                Markers.EMPTY,
                control,
                maybeSemicolon((Statement) visitNode(node.getNodeProperty("statement")))
        );
    }

    private J visitVariableDeclaration(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        implementMe(node, "exclamationToken");
        int saveCursor = getCursor();
        TSCSyntaxKind keyword = scan();
        VariableModifier.Keyword variableModifier = null;
        if (keyword == TSCSyntaxKind.ConstKeyword) {
            variableModifier = VariableModifier.Keyword.CONST;
        } else if (keyword == TSCSyntaxKind.LetKeyword) {
            variableModifier = VariableModifier.Keyword.LET;
        } else if (keyword == TSCSyntaxKind.VarKeyword) {
            variableModifier = VariableModifier.Keyword.VAR;
        } else {
            cursor(saveCursor);
        }

        if (variableModifier != null) {
            markers = markers.addIfAbsent(new VariableModifier(randomId(), variableModifier));
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

        if (node.hasProperty("type")) {
            Space beforeColon = sourceBefore(TSCSyntaxKind.ColonToken);
            if (beforeColon != EMPTY) {
                markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
            }
            typeTree = (TypeTree) visitNode(node.getNodeProperty("type"));
        }
        J.VariableDeclarations.NamedVariable variable = new J.VariableDeclarations.NamedVariable(
                randomId(),
                variablePrefix,
                Markers.EMPTY,
                name,
                emptyList(),
                node.hasProperty("initializer") ?
                        padLeft(sourceBefore(TSCSyntaxKind.EqualsToken),
                                (Expression) Objects.requireNonNull(visitNode(node.getNodeProperty("initializer")))) : null,
                typeMapping.variableType(node)
        );

        namedVariables.add(padRight(variable, EMPTY));

        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                emptyList(),
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

        TSCSyntaxKind keyword = scan();
        VariableModifier.Keyword variableModifier = null;
        if (keyword == TSCSyntaxKind.ConstKeyword) {
            variableModifier = VariableModifier.Keyword.CONST;
        } else if (keyword == TSCSyntaxKind.LetKeyword) {
            variableModifier = VariableModifier.Keyword.LET;
        } else if (keyword == TSCSyntaxKind.VarKeyword) {
            variableModifier = VariableModifier.Keyword.VAR;
        } else {
            // Unclear if the modifier should be `@Nullable` in the `JSVariableDeclaration`.
            implementMe(node);
        }

        markers = markers.addIfAbsent(new VariableModifier(randomId(), variableModifier));

        List<JRightPadded<J.VariableDeclarations.NamedVariable>> namedVariables = emptyList();
        TypeTree typeTree = null;
        if (node.hasProperty("declarations")) {
            List<TSCNode> declarations = node.getNodeListProperty("declarations");
            namedVariables = new ArrayList<>(declarations.size());
            for (int i = 0; i < declarations.size(); i++) {
                TSCNode declaration = declarations.get(i);
                implementMe(declaration, "exclamationToken");

                Space variablePrefix = whitespace();
                J j = visitNode(declaration.getNodeProperty("name"));
                J.Identifier name = null;
                if (j instanceof J.Identifier) {
                    name = (J.Identifier) j;
                } else {
                    implementMe(declaration);
                }

                if (declaration.hasProperty("type")) {
                    // FIXME: method(x: { suit: string; card: number }[])
                    Space beforeColon = sourceBefore(TSCSyntaxKind.ColonToken);
                    if (beforeColon != EMPTY) {
                        markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
                    }
                    TSCNode type = declaration.getNodeProperty("type");
                    typeTree = (TypeTree) visitNode(type);
                }
                J.VariableDeclarations.NamedVariable variable = new J.VariableDeclarations.NamedVariable(
                        randomId(),
                        variablePrefix,
                        Markers.EMPTY,
                        name,
                        emptyList(),
                        declaration.hasProperty("initializer") ?
                                padLeft(sourceBefore(TSCSyntaxKind.EqualsToken),
                                        (Expression) Objects.requireNonNull(visitNode(declaration.getNodeProperty("initializer")))) : null,
                        typeMapping.variableType(node)
                );

                Space after = whitespace();
                if (i < declarations.size() - 1) {
                    consumeToken(TSCSyntaxKind.CommaToken);
                }
                namedVariables.add(padRight(variable, after));
            }
        }

        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                emptyList(),
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

        List<J.Annotation> annotations = emptyList();
        List<J.Modifier> modifiers = emptyList();
        implementMe(node, "modifiers");
        implementMe(node, "exclamationToken");

        TSCSyntaxKind keyword = scan();
        VariableModifier.Keyword variableModifier = null;
        if (keyword == TSCSyntaxKind.ConstKeyword) {
            variableModifier = VariableModifier.Keyword.CONST;
        } else if (keyword == TSCSyntaxKind.LetKeyword) {
            variableModifier = VariableModifier.Keyword.LET;
        } else if (keyword == TSCSyntaxKind.VarKeyword) {
            variableModifier = VariableModifier.Keyword.VAR;
        } else {
            // Unclear if the modifier should be `@Nullable` in the `JSVariableDeclaration`.
            implementMe(node);
        }

        markers = markers.addIfAbsent(new VariableModifier(randomId(), variableModifier));

        List<JRightPadded<J.VariableDeclarations.NamedVariable>> namedVariables = emptyList();
        TypeTree typeTree = null;
        if (node.hasProperty("declarationList")) {
            TSCNode declarationList = node.getNodeProperty("declarationList");

            List<TSCNode> declarations = declarationList.getNodeListProperty("declarations");
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
                    // FIXME: method(x: { suit: string; card: number }[])
                    Space beforeColon = sourceBefore(TSCSyntaxKind.ColonToken);
                    if (beforeColon != EMPTY) {
                        markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
                    }
                    TSCNode type = declaration.getNodeProperty("type");
                    typeTree = (TypeTree) visitNode(type);
                }
                J.VariableDeclarations.NamedVariable variable = new J.VariableDeclarations.NamedVariable(
                        randomId(),
                        variablePrefix,
                        Markers.EMPTY,
                        name,
                        emptyList(),
                        declaration.hasProperty("initializer") ?
                                padLeft(sourceBefore(TSCSyntaxKind.EqualsToken),
                                        (Expression) Objects.requireNonNull(visitNode(declaration.getNodeProperty("initializer")))) : null,
                        typeMapping.variableType(node)
                );

                Space after = whitespace();
                if (i < declarations.size() - 1) {
                    consumeToken(TSCSyntaxKind.CommaToken);
                }
                namedVariables.add(padRight(variable, after));
            }
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

    private void implementMe(TSCNode node) {
        throw new UnsupportedOperationException(String.format("Implement syntax kind: %s.", node.syntaxKind()));
    }

    private void implementMe(TSCNode node, String propertyName) {
        if (node.hasProperty(propertyName)) {
            throw new UnsupportedOperationException(String.format("Implement syntax kind: %s property %s", node.syntaxKind(), propertyName));
        }
    }

    @Nullable
    private J visitNode(TSCNode node) {
        J j;
        switch (node.syntaxKind()) {
            case EnumDeclaration:
            case ClassDeclaration:
            case InterfaceDeclaration:
                j = visitClassDeclaration(node);
                break;
            case AnyKeyword:
            case BooleanKeyword:
            case FalseKeyword:
            case NumberKeyword:
            case StringKeyword:
            case ThisKeyword:
            case TrueKeyword:
                j = visitKeyword(node);
                break;
            case ArrayLiteralExpression:
                j = visitArrayLiteralExpression(node);
                break;
            case ArrayType:
                j = visitArrayType(node);
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
            case EmptyStatement:
                j = visitEmptyStatement(node);
                break;
            case EnumMember:
                j = visitEnumMember(node);
                break;
            case ExpressionStatement:
                j = visitExpressionStatement(node);
                break;
            case FunctionDeclaration:
            case FunctionExpression:
                j = visitFunctionDeclaration(node);
                break;
            case Identifier:
                j = visitIdentifier(node);
                break;
            case IfStatement:
                j = visitIfStatement(node);
                break;
            case ForStatement:
                j = visitForStatement(node);
                break;
            case ForOfStatement:
            case ForInStatement:
                j = visitForEachStatement(node);
                break;
            case MethodDeclaration:
                j = visitMethodDeclaration(node);
                break;
            case NewExpression:
                j = visitNewExpression(node);
                break;
            case NumericLiteral:
                j = visitNumericLiteral(node);
                break;
            case ObjectBindingPattern:
                j = visitObjectBindingPattern(node);
                break;
            case ObjectLiteralExpression:
                j = visitObjectLiteralExpression(node);
                break;
            case ParenthesizedExpression:
                j = visitParenthesizedExpression(node);
                break;
            case PostfixUnaryExpression:
            case PrefixUnaryExpression:
                j = visitUnaryExpression(node);
                break;
            case PropertyAccessExpression:
                j = visitPropertyAccessExpression(node);
                break;
            case Parameter:
            case PropertyDeclaration:
                j = visitPropertyDeclaration(node);
                break;
            case ReturnStatement:
                j = visitReturnStatement(node);
                break;
            case StringLiteral:
                j = visitStringLiteral(node);
                break;
            case ThrowStatement:
                j = visitThrowStatement(node);
                break;
            case TryStatement:
                j = visitTryStatement(node);
                break;
            case TypeReference:
                j = visitTypeReference(node);
                break;
            case WhileStatement:
                j = visitWhileStatement(node);
                break;
            case VariableDeclaration:
                j = visitVariableDeclaration(node);
                break;
            case VariableDeclarationList:
                j = visitVariableDeclarationList(node);
                break;
            case VariableStatement:
                j = visitVariableStatement(node);
                break;
            default:
                implementMe(node); // TODO: remove ... temp for velocity.
                System.err.println("unsupported syntax kind: " + node.syntaxKind());
                j = null;
        }
        return j;
    }

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
        System.err.println("[scanner] reset to pos=" + cursor + " (from pos=" + this.getCursor() + ")");
        this.cursorContext.resetScanner(cursor);
    }

    /**
     * Increment the cursor position past the text.
     */
    private void skip(String text) {
        this.cursorContext.resetScanner(getCursor() + text.length());
    }

    private <T> JLeftPadded<T> padLeft(Space left, T tree) {
        return new JLeftPadded<>(left, tree, Markers.EMPTY);
    }

    private <T> JRightPadded<T> padRight(T tree, @Nullable Space right) {
        return new JRightPadded<>(tree, right == null ? EMPTY : right, Markers.EMPTY);
    }

    private <K2 extends J> JRightPadded<K2> maybeSemicolon(K2 k) {
        int saveCursor = getCursor();
        Space beforeSemi = whitespace();
        Semicolon semicolon = null;
        if (getCursor() < source.getText().length() && source.getText().charAt(getCursor()) == ';') {
            semicolon = new Semicolon(randomId());
            consumeToken(TSCSyntaxKind.SemicolonToken);
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

    private String lastToken() {
        return this.cursorContext.scannerTokenText();
    }

    private void consumeToken(TSCSyntaxKind kind) {
        TSCSyntaxKind actual = scan();
        if (kind != actual) {
            throw new IllegalStateException(String.format("expected kind '%s'; found '%s' at position %d", kind, actual, cursorContext.scannerTokenStart()));
        }
    }

    private String tokenStreamDebug() {
        return String.format("[start=%d, end=%d, text=`%s`]", this.cursorContext.scannerTokenStart(), this.cursorContext.scannerTokenEnd(), this.cursorContext.scannerTokenText().replace("\n", "⏎"));
    }

    private <T extends J> JContainer<T> visitContainer(TSCSyntaxKind open, List<TSCNode> nodes, @Nullable TSCSyntaxKind delimiter, TSCSyntaxKind close, Function<TSCNode, T> visitFn) {
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
                T visitped = visitFn.apply(node);
                Markers markers = Markers.EMPTY;
                Space after;
                if (i < nodes.size() - 1) {
                    after = sourceBefore(delimiter);
                } else if (delimiter == TSCSyntaxKind.CommaToken) {
                    after = whitespace();
                    if (source.getText().charAt(getCursor()) == ',') {
                        consumeToken(delimiter);
                        markers = markers.addIfAbsent(new TrailingComma(randomId(), whitespace()));
                    }
                } else {
                    after = whitespace();
                }
                elements.add(JRightPadded.build(visitped).withAfter(after).withMarkers(markers));
            }
        }
        consumeToken(close);
        return JContainer.build(containerPrefix, elements, Markers.EMPTY);
    }

    private Space sourceBefore(String text) {
        Space prefix = whitespace();
        skip(text);
        return prefix;
    }

    private Space sourceBefore(TSCSyntaxKind syntaxKind) {
        Space prefix = whitespace();
        consumeToken(syntaxKind);
        return prefix;
    }

    /**
     * Consume whitespace and leading comments until the current node.
     * The type-script spec is not actively maintained, so we need to rely on the parser elements to collect
     * whitespace and comments.
     */
    private Space whitespace() {
        String initialSpace = "";
        List<Comment> comments = Collections.emptyList();
        TSCSyntaxKind kind;
        boolean done = false;
        do {
            kind = scan();
            switch (kind) {
                case WhitespaceTrivia:
                case NewLineTrivia:
                    if (comments.isEmpty()) {
                        initialSpace += lastToken();
                    } else {
                        comments = ListUtils.map(
                                comments,
                                comment -> comment.withSuffix(comment.getSuffix() + lastToken())
                        );
                    }
                    break;
                case SingleLineCommentTrivia:
                case MultiLineCommentTrivia:
                    Comment comment = new TextComment(
                            kind == TSCSyntaxKind.MultiLineCommentTrivia,
                            lastToken(),
                            "",
                            Markers.EMPTY
                    );
                    if (comments.isEmpty()) {
                        comments = Collections.singletonList(comment);
                    } else {
                        comments = ListUtils.concat(comments, comment);
                    }
                    break;
                default:
                    cursor(cursorContext.scannerTokenStart());
                    done = true;
                    break;
            }
        } while (!done);
        return Space.build(initialSpace, comments);
    }
}