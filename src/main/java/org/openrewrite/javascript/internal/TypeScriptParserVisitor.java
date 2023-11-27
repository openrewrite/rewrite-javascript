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
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.internal.JavaTypeCache;
import org.openrewrite.java.marker.Semicolon;
import org.openrewrite.java.marker.TrailingComma;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.JavaScriptParser;
import org.openrewrite.javascript.TypeScriptTypeMapping;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCNodeList;
import org.openrewrite.javascript.internal.tsc.TSCSourceFileContext;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;
import org.openrewrite.javascript.markers.*;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.javascript.tree.TsType;
import org.openrewrite.marker.Markers;
import org.openrewrite.style.NamedStyles;

import java.nio.file.Path;
import java.util.*;
import java.util.function.Function;

import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static org.openrewrite.Tree.randomId;
import static org.openrewrite.java.tree.Space.EMPTY;

@SuppressWarnings({"DataFlowIssue", "SameParameterValue"})
public class TypeScriptParserVisitor {

    private final TSCNode source;
    private final String sourceText;
    private final TSCSourceFileContext cursorContext;
    private final Path sourcePath;
    private final TypeScriptTypeMapping typeMapping;

    private final String charset;
    private final boolean isCharsetBomMarked;
    private final Collection<NamedStyles> styles;

    public TypeScriptParserVisitor(TSCNode source, TSCSourceFileContext sourceContext, Path sourcePath, JavaTypeCache typeCache, String charset, boolean isCharsetBomMarked, Collection<NamedStyles> styles) {
        this.source = source;
        this.sourceText = source.getOptionalStringProperty("text");
        this.cursorContext = sourceContext;
        this.sourcePath = sourcePath;
        this.charset = charset;
        this.isCharsetBomMarked = isCharsetBomMarked;
        this.styles = styles;
        this.typeMapping = new TypeScriptTypeMapping(typeCache);
    }

    public JS.CompilationUnit visitSourceFile() {
        TSCNodeList statementList = source.getNodeListProperty("statements");
        List<JRightPadded<Statement>> statements = new ArrayList<>(statementList.size());
        Space prefix = whitespace();
        for (TSCNode child : statementList) {
            @Nullable J visited;
            int saveCursor = getCursor();
            try {
                visited = visitNode(child);
            } catch (Throwable t) {
                cursor(saveCursor);
                Space childPrefix = whitespace();
                String text = child.getText();
                skip(text);
                Markers childMarkers = Markers.build(singletonList(ParseExceptionResult.build(JavaScriptParser.builder().build(), t)
                        .withTreeType(child.syntaxKind().name())));
                visited = new J.Unknown(
                        randomId(),
                        childPrefix,
                        Markers.EMPTY,
                        new J.Unknown.Source(
                                randomId(),
                                EMPTY,
                                childMarkers,
                                text));
            }

            if (visited != null) {
                if (!(visited instanceof Statement) && visited instanceof Expression) {
                    visited = new JS.ExpressionStatement(randomId(), (Expression) visited);
                }
                statements.add(maybeSemicolon((Statement) visited));
            }
        }

        Space eof = whitespace();
        String remainingWhitespace = "";
        if (getCursor() < sourceText.length()) {
            remainingWhitespace = sourceText.substring(getCursor());
        }

        eof = eof.withWhitespace(eof.getWhitespace() + remainingWhitespace);
        return new JS.CompilationUnit(
                randomId(),
                prefix,
                Markers.build(styles),
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
        Space before = sourceBefore(TSCSyntaxKind.EqualsToken);
        J j = visitNode(node.getNodeProperty("right"));
        if (!(j instanceof Expression) && j instanceof Statement) {
            j = new JS.StatementExpression(randomId(), (Statement) j);
        }
        return new J.Assignment(
                randomId(),
                prefix,
                Markers.EMPTY,
                left,
                padLeft(before, (Expression) j),
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

    private J visitArrayBindingPattern(TSCNode node) {
        return new JS.ArrayBindingPattern(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                mapContainer(
                        TSCSyntaxKind.OpenBracketToken,
                        node.getNodeListProperty("elements"),
                        TSCSyntaxKind.CommaToken,
                        TSCSyntaxKind.CloseBracketToken,
                        this::visitNode,
                        true
                ),
                typeMapping.type(node)
        );
    }

    private J visitArrowFunction(TSCNode node) {
        implementMe(node, "typeParameters");
        implementMe(node, "typeArguments");

        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leading, trailing);
        if (!trailing.isEmpty()) {
            throw new UnsupportedOperationException("Add support for trailing annotations on: " + node.getText());
        }

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
                paramNodes.isEmpty() ? singletonList(padRight(new J.Empty(randomId(), EMPTY, Markers.EMPTY), parenthesized ? sourceBefore(TSCSyntaxKind.CloseParenToken) : EMPTY)) :
                        convertAll(node.getNodeListProperty("parameters"), commaDelim, parenthesized ? t -> sourceBefore(TSCSyntaxKind.CloseParenToken) : noDelim, true)
        );

        TSCNode typeNode = node.getOptionalNodeProperty("type");
        TypeTree returnTypeExpression = null;
        if (typeNode != null) {
            markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), sourceBefore(TSCSyntaxKind.ColonToken)));
            returnTypeExpression = (TypeTree) visitNode(typeNode);
        }

        return new JS.ArrowFunction(
                randomId(),
                prefix,
                markers,
                leading.isEmpty() ? emptyList() : leading,
                modifiers,
                params,
                returnTypeExpression,
                sourceBefore(TSCSyntaxKind.EqualsGreaterThanToken),
                visitNode(node.getOptionalNodeProperty("body")),
                typeMapping.type(node)
        );
    }

    private J.NewArray visitArrayLiteralExpression(TSCNode node) {
        Space prefix = whitespace();

        JContainer<J> jContainer = mapContainer(
                TSCSyntaxKind.OpenBracketToken,
                node.getNodeListProperty("elements"),
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.CloseBracketToken,
                this::visitNode,
                true
        );
        List<JRightPadded<Expression>> elements = new ArrayList<>(jContainer.getElements().size());
        for (JRightPadded<J> jjRightPadded : jContainer.getPadding().getElements()) {
            Expression exp = (!(jjRightPadded.getElement() instanceof Expression) && jjRightPadded.getElement() instanceof Statement) ?
                    new JS.StatementExpression(randomId(), (Statement) jjRightPadded.getElement()) : (Expression) jjRightPadded.getElement();
            JRightPadded<Expression> apply = padRight(exp, jjRightPadded.getAfter(), jjRightPadded.getMarkers());
            elements.add(apply);
        }
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
        Space asPrefix = sourceBefore(TSCSyntaxKind.AsKeyword);
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

    private J visitBinary(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;
        Expression left = (Expression) visitNode(node.getNodeProperty("left"));

        Space opPrefix = whitespace();
        JLeftPadded<J.Binary.Type> op = null;
        JLeftPadded<JS.JsBinary.Type> jsOp = null;
        TSCSyntaxKind opKind = node.getNodeProperty("operatorToken").syntaxKind();
        switch (opKind) {
            // Bitwise ops
            case AmpersandToken:
                consumeToken(TSCSyntaxKind.AmpersandToken);
                op = padLeft(opPrefix, J.Binary.Type.BitAnd);
                break;
            case BarToken:
                consumeToken(TSCSyntaxKind.BarToken);
                op = padLeft(opPrefix, J.Binary.Type.BitOr);
                break;
            case CaretToken:
                consumeToken(TSCSyntaxKind.CaretToken);
                op = padLeft(opPrefix, J.Binary.Type.BitXor);
                break;
            case GreaterThanGreaterThanToken:
                consumeToken(TSCSyntaxKind.GreaterThanToken);
                consumeToken(TSCSyntaxKind.GreaterThanToken);
                op = padLeft(opPrefix, J.Binary.Type.RightShift);
                break;
            case LessThanLessThanToken:
                consumeToken(TSCSyntaxKind.LessThanLessThanToken);
                op = padLeft(opPrefix, J.Binary.Type.LeftShift);
                break;
            // Logical ops
            case AmpersandAmpersandToken:
                consumeToken(TSCSyntaxKind.AmpersandAmpersandToken);
                op = padLeft(opPrefix, J.Binary.Type.And);
                break;
            case CommaToken:
                markers = markers.addIfAbsent(new Comma(randomId()));
                consumeToken(TSCSyntaxKind.CommaToken);
                op = padLeft(opPrefix, J.Binary.Type.Or);
                break;
            case BarBarToken:
                consumeToken(TSCSyntaxKind.BarBarToken);
                op = padLeft(opPrefix, J.Binary.Type.Or);
                break;
            case EqualsEqualsToken:
                consumeToken(TSCSyntaxKind.EqualsEqualsToken);
                op = padLeft(opPrefix, J.Binary.Type.Equal);
                break;
            case ExclamationEqualsToken:
                consumeToken(TSCSyntaxKind.ExclamationEqualsToken);
                op = padLeft(opPrefix, J.Binary.Type.NotEqual);
                break;
            case GreaterThanToken:
                consumeToken(TSCSyntaxKind.GreaterThanToken);
                op = padLeft(opPrefix, J.Binary.Type.GreaterThan);
                break;
            case GreaterThanEqualsToken:
                consumeToken(TSCSyntaxKind.GreaterThanToken);
                consumeToken(TSCSyntaxKind.EqualsToken);
                op = padLeft(opPrefix, J.Binary.Type.GreaterThanOrEqual);
                break;
            case GreaterThanGreaterThanGreaterThanToken:
                consumeToken(TSCSyntaxKind.GreaterThanToken);
                consumeToken(TSCSyntaxKind.GreaterThanToken);
                consumeToken(TSCSyntaxKind.GreaterThanToken);
                op = padLeft(opPrefix, J.Binary.Type.UnsignedRightShift);
                break;
            case LessThanToken:
                consumeToken(TSCSyntaxKind.LessThanToken);
                op = padLeft(opPrefix, J.Binary.Type.LessThan);
                break;
            case LessThanEqualsToken:
                consumeToken(TSCSyntaxKind.LessThanEqualsToken);
                op = padLeft(opPrefix, J.Binary.Type.LessThanOrEqual);
                break;
            // Arithmetic ops
            case AsteriskToken:
                consumeToken(TSCSyntaxKind.AsteriskToken);
                op = padLeft(opPrefix, J.Binary.Type.Multiplication);
                break;
            case MinusToken:
                consumeToken(TSCSyntaxKind.MinusToken);
                op = padLeft(opPrefix, J.Binary.Type.Subtraction);
                break;
            case PercentToken:
                consumeToken(TSCSyntaxKind.PercentToken);
                op = padLeft(opPrefix, J.Binary.Type.Modulo);
                break;
            case PlusToken:
                consumeToken(TSCSyntaxKind.PlusToken);
                op = padLeft(opPrefix, J.Binary.Type.Addition);
                break;
            case SlashToken:
                consumeToken(TSCSyntaxKind.SlashToken);
                op = padLeft(opPrefix, J.Binary.Type.Division);
                break;
            // TS/JS specific ops
            case InKeyword:
                consumeToken(TSCSyntaxKind.InKeyword);
                jsOp = padLeft(opPrefix, JS.JsBinary.Type.In);
                break;
            default:
                implementMe(node);
        }

        Expression right = (Expression) visitNode(node.getNodeProperty("right"));

        if (jsOp != null) {
            return new JS.JsBinary(
                    randomId(),
                    prefix,
                    markers,
                    left,
                    jsOp,
                    right,
                    typeMapping.type(node)
            );
        } else {
            return new J.Binary(
                    randomId(),
                    prefix,
                    markers,
                    left,
                    op,
                    right,
                    typeMapping.type(node)
            );
        }
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
            case CommaToken:
            case EqualsEqualsToken:
            case ExclamationEqualsToken:
            case GreaterThanToken:
            case GreaterThanEqualsToken:
            case GreaterThanGreaterThanToken:
            case GreaterThanGreaterThanGreaterThanToken:
            case InKeyword:
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
            updates.add(padRight((Statement) visitNode(left), sourceBefore(TSCSyntaxKind.CommaToken)));
        }
        Statement r = (Statement) visitNode(incrementor.getNodeProperty("right"));
        Space after = whitespace();
        if (sourceStartsWithAtCursor(",")) {
            consumeToken(TSCSyntaxKind.CommaToken);
        } else if (sourceStartsWithAtCursor(")")) {
            consumeToken(TSCSyntaxKind.CloseParenToken);
        }
        updates.add(padRight(r, after));
    }

    @Nullable
    private J.Block visitBlock(@Nullable TSCNode node) {
        if (node == null) {
            return null;
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

    private J.Break visitBreakStatement(TSCNode node) {
        TSCNode label = node.getOptionalNodeProperty("label");
        return new J.Break(
                randomId(),
                sourceBefore(TSCSyntaxKind.BreakKeyword),
                Markers.EMPTY,
                label != null ? (J.Identifier) visitNode(label) : null
        );
    }

    private J.MethodInvocation visitCallExpression(TSCNode node) {
        implementMe(node, "questionDotToken");
        List<TSCNode> typeArgs = node.getOptionalNodeListProperty("typeArguments");
        if (typeArgs != null) {
            implementMe(node, "typeArguments");
        }

        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        JRightPadded<Expression> select = null;
        TSCNode expression = node.getNodeProperty("expression");
        TSCNode expr = expression.getOptionalNodeProperty("expression");
        if (expr != null) {
            // Adjust padding.
            implementMe(expression, "questionDotToken");

            if (expression.syntaxKind() == TSCSyntaxKind.PropertyAccessExpression) {
                select = padRight((Expression) visitNode(expr), sourceBefore(TSCSyntaxKind.DotToken));
            } else if (expression.syntaxKind() == TSCSyntaxKind.ParenthesizedExpression) {
                markers = markers.addIfAbsent(new OmitDot(randomId()));
                select = padRight((Expression) visitNode(expression), whitespace());
            } else {
                implementMe(expression);
            }
        }

        JavaType.Method type = typeMapping.methodInvocationType(node);
        J.Identifier name = null;
        TSCNode nameNode = expression.getOptionalNodeProperty("name");
        if (nameNode != null) {
            name = visitIdentifier(nameNode, type);
        } else if (expression.syntaxKind() == TSCSyntaxKind.Identifier) {
            name = visitIdentifier(expression, type);
        } else if (expression.syntaxKind() == TSCSyntaxKind.SuperKeyword) {
            name = convertToIdentifier(sourceBefore(TSCSyntaxKind.SuperKeyword), "super");
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
                    TSCSyntaxKind.LessThanToken,
                    tpNodes,
                    TSCSyntaxKind.CommaToken,
                    TSCSyntaxKind.GreaterThanToken,
                    this::visitNode,
                    true
            );

            List<JRightPadded<Expression>> typeParams = new ArrayList<>(jContainer.getElements().size());
            for (JRightPadded<J> jjRightPadded : jContainer.getPadding().getElements()) {
                Expression exp = (!(jjRightPadded.getElement() instanceof Expression) && jjRightPadded.getElement() instanceof Statement) ?
                        new JS.StatementExpression(randomId(), (Statement) jjRightPadded.getElement()) : (Expression) jjRightPadded.getElement();
                JRightPadded<Expression> apply = padRight(exp, jjRightPadded.getAfter(), jjRightPadded.getMarkers());
                typeParams.add(apply);
            }
            typeParameters = JContainer.build(jContainer.getBefore(), typeParams, jContainer.getMarkers());
        }

        JContainer<Expression> arguments = null;
        TSCNodeList argNodes = node.getOptionalNodeListProperty("arguments");
        if (argNodes != null) {
            JContainer<J> jContainer = mapContainer(
                    TSCSyntaxKind.OpenParenToken,
                    argNodes,
                    TSCSyntaxKind.CommaToken,
                    TSCSyntaxKind.CloseParenToken,
                    this::visitNode,
                    true
            );
            List<JRightPadded<Expression>> elements = new ArrayList<>(jContainer.getElements().size());
            for (JRightPadded<J> jjRightPadded : jContainer.getPadding().getElements()) {
                Expression exp = (!(jjRightPadded.getElement() instanceof Expression) && jjRightPadded.getElement() instanceof Statement) ?
                        new JS.StatementExpression(randomId(), (Statement) jjRightPadded.getElement()) : (Expression) jjRightPadded.getElement();
                JRightPadded<Expression> apply = padRight(exp, jjRightPadded.getAfter(), jjRightPadded.getMarkers());
                elements.add(apply);
            }
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

        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        List<J.Modifier> modifiers;
        List<TSCNode> modifierNodes = node.getOptionalNodeListProperty("modifiers");
        if (modifierNodes != null) {
            modifiers = mapModifiers(node.getNodeListProperty("modifiers"), leading, trailing);
        } else {
            modifiers = emptyList();
        }

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

        J.ClassDeclaration.Kind kind = new J.ClassDeclaration.Kind(randomId(), kindPrefix, Markers.EMPTY, trailing, type);

        J.Identifier name;
        TSCNode nameNode = node.getOptionalNodeProperty("name");
        name = nameNode != null ? visitIdentifier(nameNode) : convertToIdentifier(EMPTY, "");
        TSCNodeList typeParameterNodes = node.getOptionalNodeListProperty("typeParameters");
        JContainer<J.TypeParameter> typeParams = typeParameterNodes == null ? null : mapContainer(
                TSCSyntaxKind.LessThanToken,
                typeParameterNodes,
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.GreaterThanToken,
                t -> (J.TypeParameter) visitNode(t)
        );

        JLeftPadded<TypeTree> extendings = null;
        JContainer<TypeTree> implementings = null;
        TSCNodeList heritageClausesNodes = node.getOptionalNodeListProperty("heritageClauses");
        if (heritageClausesNodes != null) {
            for (TSCNode tscNode : heritageClausesNodes) {
                if (TSCSyntaxKind.fromCode(tscNode.getIntProperty("token")) == TSCSyntaxKind.ExtendsKeyword) {
                    List<TSCNode> types = tscNode.getNodeListProperty("types");
                    assert types.size() == 1;
                    extendings = padLeft(sourceBefore(TSCSyntaxKind.ExtendsKeyword), (TypeTree) visitNode(types.get(0)));
                } else {
                    implementMe(tscNode);
                }
            }
        }

        J.Block body;
        List<JRightPadded<Statement>> members;
        TSCNodeList memberNodes = node.getOptionalNodeListProperty("members");
        if (memberNodes != null) {
            Space bodyPrefix = sourceBefore(TSCSyntaxKind.OpenBraceToken);

            if (kind.getType() == J.ClassDeclaration.Kind.Type.Enum) {
                Space enumPrefix = whitespace();

                members = new ArrayList<>(1);
                List<JRightPadded<J.EnumValue>> enumValues = new ArrayList<>(memberNodes.size());
                for (int i = 0; i < memberNodes.size(); i++) {
                    TSCNode enumValue = memberNodes.get(i);
                    J.EnumValue value = (J.EnumValue) visitNode(enumValue);
                    if (value != null) {
                        boolean hasTrailingComma = i == memberNodes.size() - 1 && memberNodes.getBooleanProperty("hasTrailingComma");
                        Space after = i < memberNodes.size() - 1 ? sourceBefore(TSCSyntaxKind.CommaToken) :
                                hasTrailingComma ? sourceBefore(TSCSyntaxKind.CommaToken) : EMPTY;
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
                    members, sourceBefore(TSCSyntaxKind.CloseBraceToken));
        } else {
            // This shouldn't happen.
            throw new UnsupportedOperationException("Add support for empty body");
        }

        JContainer<Statement> primaryConstructor = null;

        return new J.ClassDeclaration(
                randomId(),
                prefix,
                markers,
                leading.isEmpty() ? emptyList() : leading,
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

    private J visitCaseClause(TSCNode node) {
        TSCNode expression = node.getOptionalNodeProperty("expression");
        List<TSCNode> statements = node.getNodeListProperty("statements");
        Space prefix = whitespace();
        JContainer<Expression> expressions = JContainer.build(
                expression == null ? EMPTY : sourceBefore(TSCSyntaxKind.CaseKeyword),
                singletonList(JRightPadded.build((Expression) visitNode(expression))),
                Markers.EMPTY
        );
        List<JRightPadded<Statement>> list = new ArrayList<>(statements.size());
        Space before = sourceBefore(TSCSyntaxKind.ColonToken);
        for (TSCNode it : statements) {
            JRightPadded<Statement> statementJRightPadded = maybeSemicolon((Statement) visitNode(it));
            list.add(statementJRightPadded);
        }
        return new J.Case(
                randomId(),
                prefix,
                Markers.EMPTY,
                J.Case.Type.Statement,
                null,
                expressions,
                JContainer.build(
                        before,
                        list,
                        Markers.EMPTY
                ),
                null
        );
    }

    private J.Ternary visitConditionalExpression(TSCNode node) {
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
        TSCNode label = node.getOptionalNodeProperty("label");
        return new J.Continue(
                randomId(),
                sourceBefore(TSCSyntaxKind.ContinueKeyword),
                Markers.EMPTY,
                label != null ? (J.Identifier) visitNode(node.getNodeProperty("label")) : null
        );
    }

    private J.MethodDeclaration visitConstructor(TSCNode node) {
        implementMe(node, "type");
        implementMe(node, "typeArguments");

        Space prefix = whitespace();
        List<J.Modifier> modifiers;
        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        TSCNodeList modifierNodes = node.getOptionalNodeListProperty("modifiers");
        if (modifierNodes != null) {
            modifiers = mapModifiers(modifierNodes, leading, trailing);
        } else {
            modifiers = emptyList();
        }

        Space before = sourceBefore(TSCSyntaxKind.ConstructorKeyword);
        J.Identifier name = convertToIdentifier(before, "constructor");
        J.TypeParameters typeParameters = mapTypeParameters(node.getOptionalNodeListProperty("typeParameters"));

        JContainer<Statement> params = mapContainer(
                TSCSyntaxKind.OpenParenToken,
                node.getNodeListProperty("parameters"),
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.CloseParenToken,
                t -> (Statement) visitNode(t),
                true);

        J.Block body = (J.Block) visitNode(node.getNodeProperty("body"));
        return new J.MethodDeclaration(
                randomId(),
                prefix,
                Markers.EMPTY,
                leading.isEmpty() ? emptyList() : leading,
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
        Space prefix = sourceBefore(TSCSyntaxKind.AtToken);
        implementMe(node, "questionDotToken");
        implementMe(node, "typeArguments");
        TSCNode callExpression = node.getNodeProperty("expression");
        NameTree name = (NameTree) visitNameExpression(callExpression.getNodeProperty("expression"));
        JContainer<Expression> arguments = null;
        TSCNodeList args = callExpression.getOptionalNodeListProperty("arguments");
        if (args != null) {
            JContainer<J> jContainer = mapContainer(
                    TSCSyntaxKind.OpenParenToken,
                    args,
                    TSCSyntaxKind.CommaToken,
                    TSCSyntaxKind.CloseParenToken,
                    this::visitNode,
                    true
            );

            List<JRightPadded<Expression>> elements = new ArrayList<>(jContainer.getElements().size());
            for (JRightPadded<J> jjRightPadded : jContainer.getPadding().getElements()) {
                Expression exp = (!(jjRightPadded.getElement() instanceof Expression) && jjRightPadded.getElement() instanceof Statement) ?
                        new JS.StatementExpression(randomId(), (Statement) jjRightPadded.getElement()) : (Expression) jjRightPadded.getElement();
                JRightPadded<Expression> apply = padRight(exp, jjRightPadded.getAfter(), jjRightPadded.getMarkers());
                elements.add(apply);
            }
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

    private J visitDefaultClause(TSCNode node) {
        List<TSCNode> statements = node.getNodeListProperty("statements");
        Space prefix = whitespace();
        JContainer<Expression> expressions = JContainer.build(
                EMPTY,
                singletonList(JRightPadded.build(new J.Identifier(randomId(), sourceBefore(TSCSyntaxKind.DefaultKeyword), Markers.EMPTY, emptyList(), "default", null, null))),
                Markers.EMPTY
        );
        Space before = sourceBefore(TSCSyntaxKind.ColonToken);
        List<JRightPadded<Statement>> list = new ArrayList<>(statements.size());
        for (TSCNode it : statements) {
            JRightPadded<Statement> statementJRightPadded = maybeSemicolon((Statement) visitNode(it));
            list.add(statementJRightPadded);
        }
        return new J.Case(
                randomId(),
                prefix,
                Markers.EMPTY,
                J.Case.Type.Statement,
                null,
                expressions,
                JContainer.build(
                        before,
                        list,
                        Markers.EMPTY
                ),
                null
        );
    }

    private J visitDeleteExpression(TSCNode node) {
        Space prefix = sourceBefore(TSCSyntaxKind.DeleteKeyword);
        return new JS.Delete(
                randomId(),
                prefix,
                Markers.EMPTY,
                (Expression) visitNode(node.getNodeProperty("expression")),
                typeMapping.type(node)
        );
    }

    private J.DoWhileLoop visitDoStatement(TSCNode node) {
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

    private J.ArrayAccess visitElementAccessExpression(TSCNode node) {
        implementMe(node, "questionDotToken");
        return new J.ArrayAccess(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                (Expression) visitNode(node.getNodeProperty("expression")),
                new J.ArrayDimension(
                        randomId(),
                        sourceBefore(TSCSyntaxKind.OpenBracketToken),
                        Markers.EMPTY,
                        padRight((Expression) visitNode(node.getNodeProperty("argumentExpression")), sourceBefore(TSCSyntaxKind.CloseBracketToken))
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
        Space prefix = sourceBefore(TSCSyntaxKind.ExportKeyword);
        implementMe(node, "isExportEquals");
        return new JS.Export(
                randomId(),
                prefix,
                Markers.EMPTY,
                null,
                null,
                null,
                padLeft(sourceBefore(TSCSyntaxKind.DefaultKeyword), (Expression) visitNode(node.getNodeProperty("expression")))
        );
    }

    private JS.Export visitExportDeclaration(TSCNode node) {
        implementMe(node, "assertClause");
        implementMe(node, "modifiers");

        Space prefix = sourceBefore(TSCSyntaxKind.ExportKeyword);
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
                    TSCSyntaxKind.OpenBraceToken,
                    elements,
                    TSCSyntaxKind.CommaToken,
                    TSCSyntaxKind.CloseBraceToken,
                    t -> (Expression) visitNode(t),
                    true
            ).withMarkers(Markers.build(singletonList(new Braces(randomId()))));
        } else {
            exports = JContainer.build(sourceBefore(TSCSyntaxKind.AsteriskToken),
                    singletonList(padRight(convertToIdentifier(EMPTY, "*"), EMPTY)), Markers.EMPTY);
        }

        TSCNode moduleSpecifier = node.getOptionalNodeProperty("moduleSpecifier");
        Space beforeFrom = moduleSpecifier == null ? null : sourceBefore(TSCSyntaxKind.FromKeyword);
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
                    padRight((J.Identifier) visitNode(propertyName), sourceBefore(TSCSyntaxKind.AsKeyword)),
                    (J.Identifier) visitNode(node.getNodeProperty("name"))
            );
        }

        return visitNode(node.getNodeProperty("name"));
    }

    public J visitExpressionStatement(TSCNode node) {
        return visitNode(node.getNodeProperty("expression"));
    }


    private J.ForLoop visitForStatement(TSCNode node) {
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
                            TSCSyntaxKind.LessThanToken,
                            typeArguments,
                            TSCSyntaxKind.CommaToken,
                            TSCSyntaxKind.GreaterThanToken,
                            t -> (Expression) visitNode(t),
                            true
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

        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leading, trailing);

        Space before = sourceBefore(TSCSyntaxKind.FunctionKeyword);
        Markers markers = Markers.build(singletonList(new FunctionKeyword(randomId(), before)));

        J.Identifier name;
        JavaType.Method method = typeMapping.methodDeclarationType(node);
        TSCNode nameNode = node.getOptionalNodeProperty("name");
        if (nameNode != null) {
            name = visitIdentifier(nameNode);
        } else {
            // FIXME: get input, we can add an anonymous name and prevent printing with a marker.
            // Function expressions do not require a name `function (..)`
            name = convertToIdentifier(EMPTY, "");
        }
        if (!trailing.isEmpty()) {
            name = name.withAnnotations(trailing);
        }
        name = name.withType(method);

        J.TypeParameters typeParameters = mapTypeParameters(node.getOptionalNodeListProperty("typeParameters"));
        JContainer<Statement> parameters = mapContainer(
                TSCSyntaxKind.OpenParenToken,
                node.getNodeListProperty("parameters"),
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.CloseParenToken,
                this::visitFunctionParameter,
                true
        );

        TSCNode typeNode = node.getOptionalNodeProperty("type");
        TypeTree returnTypeExpression = null;
        if (typeNode != null) {
            markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), sourceBefore(TSCSyntaxKind.ColonToken)));
            returnTypeExpression = (TypeTree) visitNode(typeNode);
        }

        J.Block block = visitBlock(node.getOptionalNodeProperty("body"));

        return new J.MethodDeclaration(
                randomId(),
                prefix,
                markers,
                leading.isEmpty() ? emptyList() : leading,
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

        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leading, trailing);

        Space variablePrefix = whitespace();
        J.Identifier name = visitIdentifier(node.getNodeProperty("name"));
        if (!trailing.isEmpty()) {
            name = name.withAnnotations(trailing);
        }
        TypeTree typeTree = null;
        TSCNode type = node.getOptionalNodeProperty("type");
        if (type != null) {
            TSCNode questionToken = node.getOptionalNodeProperty("questionToken");
            if (questionToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore(TSCSyntaxKind.QuestionToken), PostFixOperator.Operator.Question));
            }
            Space beforeColon = sourceBefore(TSCSyntaxKind.ColonToken);
            markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
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
                leading.isEmpty() ? emptyList() : leading,
                modifiers.isEmpty() ? emptyList() : modifiers,
                typeTree,
                varargs,
                dimensionsBeforeName,
                variables
        );
    }

    private J visitExternalModuleReference(TSCNode node) {
        Space prefix = whitespace();

        consumeToken(TSCSyntaxKind.RequireKeyword);
        J.Identifier name = convertToIdentifier(EMPTY, "require");

        return new J.MethodInvocation(
                randomId(),
                prefix,
                Markers.EMPTY,
                null,
                null,
                name,
                mapContainer(
                        TSCSyntaxKind.OpenParenToken,
                        singletonList(node.getNodeProperty("expression")),
                        TSCSyntaxKind.CommaToken,
                        TSCSyntaxKind.CloseParenToken,
                        t -> (Expression) visitNode(t),
                        true
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
        skip(node.getText());
        // TODO: check on escapedText property.
        return new J.Identifier(
                randomId(),
                prefix,
                Markers.EMPTY,
                emptyList(),
                node.getText(),
                type == null ? typeMapping.type(node) : type,
                fieldType
        );
    }

    private J visitImportDeclaration(TSCNode node) {
        implementMe(node, "assertClause");
        implementMe(node, "modifiers");

        Space prefix = sourceBefore(TSCSyntaxKind.ImportKeyword);

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
                    consumeToken(TSCSyntaxKind.CommaToken);
                }

                imports = mapContainer(
                        TSCSyntaxKind.OpenBraceToken,
                        namedBindings.getNodeListProperty("elements"),
                        TSCSyntaxKind.CommaToken,
                        TSCSyntaxKind.CloseBraceToken,
                        t -> (Expression) visitNode(t),
                        true
                ).withMarkers(Markers.build(singletonList(new Braces(randomId()))));
            }
        }

        TSCNode moduleSpecifier = node.getOptionalNodeProperty("moduleSpecifier");
        Space beforeFrom = moduleSpecifier == null ? null : sourceBefore(TSCSyntaxKind.FromKeyword);
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
            initializer = padLeft(sourceBefore(TSCSyntaxKind.EqualsToken), (Expression) visitNode(moduleReference));
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
        return unknown(node);
    }

    private J.If visitIfStatement(TSCNode node) {
        Space prefix = sourceBefore(TSCSyntaxKind.IfKeyword);

        J.ControlParentheses<Expression> control = mapControlParentheses(node.getNodeProperty("expression"));
        JRightPadded<Statement> thenPart = visitStatement(node.getNodeProperty("thenStatement"));

        J.If.Else elsePart = null;
        TSCNode elseNode = node.getOptionalNodeProperty("elseStatement");
        if (elseNode != null) {
            Space elsePartPrefix = sourceBefore(TSCSyntaxKind.ElseKeyword);
            elsePart = new J.If.Else(
                    randomId(),
                    elsePartPrefix,
                    Markers.EMPTY,
                    visitStatement(elseNode)
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
                padRight((Expression) visitNode(node.getNodeProperty("left")), sourceBefore(TSCSyntaxKind.InstanceOfKeyword)),
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

    private J visitFunctionType(TSCNode node) {
//        implementMe(node, "typeParameters");
//        implementMe(node, "modifiers");
//        implementMe(node, "typeArguments");
//        implementMe(node, "asteriskToken");
//
//        Space prefix = whitespace();
//
//        List<TSCNode> params = node.getOptionalNodeListProperty("parameters");
//        if (params == null) {
//            implementMe(node);
//        }
//        JContainer<Statement> parameters = mapContainer(
//                TSCSyntaxKind.OpenParenToken,
//                params,
//                TSCSyntaxKind.CommaToken,
//                TSCSyntaxKind.CloseParenToken,
//                t -> (Statement) visitNode(t),
//                true
//        );
//
//        TSCNode type = node.getOptionalNodeProperty("type");
//        if (type == null) {
//            implementMe(node);
//        }
//
//        return new JS.FunctionType(
//                randomId(),
//                prefix,
//                Markers.EMPTY,
//                parameters,
//                sourceBefore(TSCSyntaxKind.EqualsGreaterThanToken),
//                (Expression) visitNode(type),
//                typeMapping.type(node)
//        );
        return unknown(node);
    }

    private J.Label visitLabelledStatement(TSCNode node) {
        return new J.Label(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                padRight(visitIdentifier(node.getNodeProperty("label")), sourceBefore(TSCSyntaxKind.ColonToken)),
                (Statement) visitNode(node.getNodeProperty("statement"))
        );
    }

    private J.MethodDeclaration visitMethodDeclaration(TSCNode node) {
        implementMe(node, "questionToken");
        implementMe(node, "exclamationToken");
        implementMe(node, "typeArguments");

        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;
        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leading, trailing);

        if (node.hasProperty("asteriskToken")) {
            markers = markers.addIfAbsent(new Asterisk(randomId(), sourceBefore(TSCSyntaxKind.AsteriskToken)));
        }
        JavaType.Method methodType = typeMapping.methodDeclarationType(node);
        TSCNode nameNode = node.getOptionalNodeProperty("name");
        J.Identifier name;
        if (nameNode == null) {
            name = convertToIdentifier(EMPTY, "");
        } else {
            name = visitIdentifier(nameNode, methodType);
        }
        if (!trailing.isEmpty()) {
            name = name.withAnnotations(trailing);
        }
        J.TypeParameters typeParameters = mapTypeParameters(node.getOptionalNodeListProperty("typeParameters"));

        JContainer<Statement> parameters = mapContainer(
                TSCSyntaxKind.OpenParenToken,
                node.getNodeListProperty("parameters"),
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.CloseParenToken,
                t -> (Statement) visitNode(t),
                true
        );

        JContainer<NameTree> throw_ = null;

        TypeTree returnTypeExpression = null;
        TSCNode typeNode = node.getOptionalNodeProperty("type");
        if (typeNode != null) {
            markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), sourceBefore(TSCSyntaxKind.ColonToken)));
            returnTypeExpression = (TypeTree) visitNode(typeNode);
        }

        J.Block body = visitBlock(node.getOptionalNodeProperty("body"));
        JLeftPadded<Expression> defaultValue = null;

        return new J.MethodDeclaration(
                randomId(),
                prefix,
                markers,
                leading.isEmpty() ? emptyList() : leading,
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
        TSCNode expr = expression.getOptionalNodeProperty("expression");
        if (expr != null) {
            Space prefix = whitespace();
            Expression select = visitNameExpression(expr);

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
            TSCNode name = expression.getOptionalNodeProperty("name");
            if (name != null) {
                identifier = (Expression) visitNode(name);
            }

            if (identifier == null && expression.hasProperty("escapedText") || expression.syntaxKind() == TSCSyntaxKind.ThisKeyword) {
                identifier = (Expression) visitNode(expression);
            }

            if (identifier == null) {
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

        skip(node.getText());
        return new J.Literal(
                randomId(),
                prefix,
                Markers.EMPTY,
                value,
                node.getText(),
                null,
                typeMapping.primitive(literal)
        );
    }

    private J visitMetaProperty(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        Integer keywordToken = node.getOptionalIntProperty("keywordToken");
        TSCSyntaxKind syntaxKind = TSCSyntaxKind.fromCode(keywordToken);
        Expression nameExpression = null;
        if (syntaxKind == TSCSyntaxKind.ImportKeyword) {
            consumeToken(TSCSyntaxKind.ImportKeyword);
            nameExpression = convertToIdentifier(EMPTY, "import");
        } else {
            implementMe(node);
        }
        return new J.FieldAccess(
                randomId(),
                prefix,
                markers,
                nameExpression,
                padLeft(sourceBefore(TSCSyntaxKind.DotToken), visitIdentifier(node.getNodeProperty("name"))),
                typeMapping.type(node)
        );
    }

    private J.NewClass visitNewExpression(TSCNode node) {
        Space prefix = sourceBefore(TSCSyntaxKind.NewKeyword);
        TypeTree typeTree = null;
        TSCNode expr = node.getOptionalNodeProperty("expression");
        if (expr != null) {
            typeTree = (TypeTree) visitNameExpression(expr);
        }
        implementMe(node, "typeArguments");
        JContainer<J> jContainer = mapContainer(
                TSCSyntaxKind.OpenParenToken,
                node.getNodeListProperty("arguments"),
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.CloseParenToken,
                this::visitNode,
                true
        );
        List<JRightPadded<Expression>> elements = new ArrayList<>(jContainer.getElements().size());
        for (JRightPadded<J> jjRightPadded : jContainer.getPadding().getElements()) {
            Expression exp = (!(jjRightPadded.getElement() instanceof Expression) && jjRightPadded.getElement() instanceof Statement) ?
                    new JS.StatementExpression(randomId(), (Statement) jjRightPadded.getElement()) : (Expression) jjRightPadded.getElement();
            JRightPadded<Expression> apply = padRight(exp, jjRightPadded.getAfter(), jjRightPadded.getMarkers());
            elements.add(apply);
        }
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

    private J visitObjectLiteralExpression(TSCNode node) {
        Space prefix = whitespace();
        return mapPropertyNodesToNewClass( node.getOptionalNodeListProperty("properties"), prefix);
    }

    private JS.ObjectBindingDeclarations mapObjectBindingDeclaration(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leading, trailing);

        Space beforeVariableModifier = whitespace();
        TSCSyntaxKind keyword = scan();
        if (keyword == TSCSyntaxKind.ConstKeyword) {
            modifiers.add(mapModifier(beforeVariableModifier, "const", trailing));
        } else if (keyword == TSCSyntaxKind.LetKeyword) {
            modifiers.add(mapModifier(beforeVariableModifier, "let", trailing));
        } else if (keyword == TSCSyntaxKind.VarKeyword) {
            modifiers.add(mapModifier(beforeVariableModifier, "var", trailing));
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
        Space beforeBraces = sourceBefore(TSCSyntaxKind.OpenBraceToken);
        for (int i = 0; i < elements.size(); i++) {
            TSCNode binding = elements.get(i);
            Space bindingPrefix = whitespace();

            Space varArg = binding.hasProperty("dotDotDotToken") ? sourceBefore(TSCSyntaxKind.DotDotDotToken) : null;

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
                propertyName = padRight(name, sourceBefore(TSCSyntaxKind.ColonToken));
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
                bindingInitializer = padLeft(sourceBefore(TSCSyntaxKind.EqualsToken), (Expression) visitNode(initializer));
            }

            Space after = whitespace();
            Markers bindingMarkers = Markers.EMPTY;
            if (i < elements.size() - 1) {
                consumeToken(TSCSyntaxKind.CommaToken);
            } else {
                // check for trailing comma.
                TSCSyntaxKind kind = scan();
                if (kind == TSCSyntaxKind.CommaToken) {
                    bindingMarkers = bindingMarkers.addIfAbsent(new TrailingComma(randomId(), sourceBefore(TSCSyntaxKind.CloseBraceToken)));
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

        TSCNode init = bindingNode.getOptionalNodeProperty("initializer");
        return new JS.ObjectBindingDeclarations(
                randomId(),
                prefix,
                markers,
                leading.isEmpty() ? emptyList() : leading,
                modifiers,
                typeTree,
                JContainer.build(beforeBraces, bindings, Markers.EMPTY),
                init != null ? padLeft(sourceBefore(TSCSyntaxKind.EqualsToken), (Expression) visitNode(init)) : null
        );
    }

    private <J2 extends J> J.Parentheses<J2> visitParenthesizedExpression(TSCNode node) {
        //noinspection unchecked
        return new J.Parentheses<>(
                randomId(),
                sourceBefore(TSCSyntaxKind.OpenParenToken),
                Markers.EMPTY,
                padRight((J2) visitNode(node.getNodeProperty("expression")), sourceBefore(TSCSyntaxKind.CloseParenToken))
        );
    }

    private J.FieldAccess visitPropertyAccessExpression(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        Expression nameExpression = (Expression) visitNode(node.getNodeProperty("expression"));
        TSCNode questionToken = node.getOptionalNodeProperty("questionDotToken");
        boolean isQuestionDot = false;
        if (questionToken != null) {
            markers = markers.addIfAbsent(new PostFixOperator(randomId(), EMPTY, PostFixOperator.Operator.Question));
            isQuestionDot = true;
        }
        return new J.FieldAccess(
                randomId(),
                prefix,
                markers,
                nameExpression,
                padLeft(sourceBefore(isQuestionDot ? TSCSyntaxKind.QuestionDotToken : TSCSyntaxKind.DotToken), visitIdentifier(node.getNodeProperty("name"))),
                typeMapping.type(node)
        );
    }

    private J.VariableDeclarations visitPropertyDeclaration(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leading, trailing);

        TSCNode varArgNode = node.getOptionalNodeProperty("dotDotDotToken");
        Space varArg = varArgNode != null ? sourceBefore(TSCSyntaxKind.DotDotDotToken) : null;
        J j = visitNode(node.getNodeProperty("name"));
        J.Identifier name = null;
        if (j instanceof J.Identifier) {
            name = (J.Identifier) j;
        } else {
            implementMe(node);
        }
        if (!trailing.isEmpty()) {
            name = name.withAnnotations(trailing);
        }
        TypeTree typeTree = null;
        TSCNode typeNode = node.getOptionalNodeProperty("type");
        if (typeNode != null) {
            TSCNode questionToken = node.getOptionalNodeProperty("questionToken");
            TSCNode exclamationToken = node.getOptionalNodeProperty("exclamationToken");
            if (questionToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore(TSCSyntaxKind.QuestionToken), PostFixOperator.Operator.Question));
            } else if (exclamationToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore(TSCSyntaxKind.ExclamationToken), PostFixOperator.Operator.Exclamation));
            }

            Space beforeColon = sourceBefore(TSCSyntaxKind.ColonToken);
            markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));

            typeTree = (TypeTree) visitNode(typeNode);
            name = name.withType(typeMapping.type(typeNode));
        }

        JLeftPadded<Expression> initializer;
        TSCNode initNode = node.getOptionalNodeProperty("initializer");
        if (initNode != null) {
            Space beforeEquals = sourceBefore(TSCSyntaxKind.EqualsToken);
            J init = visitNode(initNode);
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
                leading.isEmpty() ? emptyList() : leading,
                modifiers.isEmpty() ? emptyList() : modifiers,
                typeTree,
                varArg,
                dimensions,
                variables
        );
    }

    private J visitPropertyAssignment(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leading, trailing);

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
        if (!trailing.isEmpty()) {
            name = name.withAnnotations(trailing);
        }
        TypeTree typeTree = null;

        // The initializer on a property declaration is the type reference.
        // { x : 1 }
        JLeftPadded<Expression> initializer;
        TSCNode initNode = node.getOptionalNodeProperty("initializer");
        if (initNode != null) {
            TSCNode questionToken = node.getOptionalNodeProperty("questionToken");
            TSCNode exclamationToken = node.getOptionalNodeProperty("exclamationToken");
            if (questionToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore(TSCSyntaxKind.QuestionToken), PostFixOperator.Operator.Question));
            } else if (exclamationToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore(TSCSyntaxKind.ExclamationToken), PostFixOperator.Operator.Exclamation));
            }

            Space beforeEquals = sourceBefore(TSCSyntaxKind.ColonToken);
            J init = visitNode(initNode);
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
                leading.isEmpty() ? emptyList() : leading,
                modifiers.isEmpty() ? emptyList() : modifiers,
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
                padLeft(sourceBefore(TSCSyntaxKind.DotToken), (J.Identifier) visitNode(node.getNodeProperty("right"))),
                typeMapping.type(node)
        );
    }

    private J visitRegularExpressionLiteral(TSCNode node) {
        Space prefix = whitespace();
        skip(node.getText());
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
        Space prefix = sourceBefore(TSCSyntaxKind.ReturnKeyword);
        Expression expression = null;
        TSCNode expressionNode = node.getOptionalNodeProperty("expression");
        if (expressionNode != null) {
            J j = visitNode(expressionNode);
            expression = !(j instanceof Expression) && j instanceof Statement ?
                    new JS.StatementExpression(randomId(), (Statement) j) : (Expression) j;
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

    private J visitTemplateExpression(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;
        JRightPadded<Expression> tag = null;
        TSCNode templateExpression;
        if (node.syntaxKind() == TSCSyntaxKind.TaggedTemplateExpression) {
            J j = visitNode(node.getNodeProperty("tag"));
            tag = padRight(!(j instanceof Expression) && j instanceof Statement ?
                    new JS.StatementExpression(randomId(), (Statement) j) : (Expression) j, whitespace());
            if (node.hasProperty("questionDotToken")) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore(TSCSyntaxKind.QuestionDotToken), PostFixOperator.Operator.QuestionDot));
            }
            templateExpression = node.getNodeProperty("template");
        } else {
            templateExpression = node;
        }

        TSCNode head;
        if (templateExpression.syntaxKind() == TSCSyntaxKind.NoSubstitutionTemplateLiteral) {
            head = node;
        } else {
            head = templateExpression.getNodeProperty("head");
        }

        String text = head.getStringProperty("text");
        String rawText = head.getStringProperty("rawText");
        String delimiter = String.valueOf(head.getText().charAt(0));
        boolean isEnclosedInBraces = head.getText().endsWith("{");

        skip(delimiter);
        List<TSCNode> spans = templateExpression.syntaxKind() == TSCSyntaxKind.NoSubstitutionTemplateLiteral ? emptyList() :
                templateExpression.getNodeListProperty("templateSpans");
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
            cursor(getCursor() + (isEnclosedInBraces ? 2 : 1));

            elements.add(new JS.TemplateExpression.Value(
                    randomId(),
                    EMPTY,
                    Markers.EMPTY,
                    visitNode(span.getNodeProperty("expression")),
                    whitespace(),
                    isEnclosedInBraces
            ));
            consumeToken(TSCSyntaxKind.CloseBraceToken);

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

        if (templateExpression.syntaxKind() == TSCSyntaxKind.NoSubstitutionTemplateLiteral) {
            skip(delimiter);
        }
        return new JS.TemplateExpression(
                randomId(),
                prefix,
                markers,
                delimiter,
                tag,
                elements,
                typeMapping.type(node)
        );
    }

    private J visitSwitchStatement(TSCNode node) {
        Space prefix = sourceBefore(TSCSyntaxKind.SwitchKeyword);

        Space before = sourceBefore(TSCSyntaxKind.OpenParenToken);
        J j = visitNode(node.getNodeProperty("expression"));
        J.ControlParentheses<Expression> selector = new J.ControlParentheses<>(
                randomId(),
                before,
                Markers.EMPTY,
                padRight(!(j instanceof Expression) && j instanceof Statement ?
                        new JS.StatementExpression(randomId(), (Statement) j) : (Expression) j, sourceBefore(TSCSyntaxKind.CloseParenToken))
        );
        TSCNode caseBlock = node.getNodeProperty("caseBlock");
        return new J.Switch(
                randomId(),
                prefix,
                Markers.EMPTY,
                selector,
                new J.Block(randomId(), sourceBefore(TSCSyntaxKind.OpenBraceToken), Markers.EMPTY, new JRightPadded<>(false, EMPTY, Markers.EMPTY),
                        convertAll(caseBlock.getNodeListProperty("clauses"), noDelim, noDelim, true), sourceBefore(TSCSyntaxKind.CloseBraceToken))
        );
    }

    private J.Throw visitThrowStatement(TSCNode node) {
        return new J.Throw(
                randomId(),
                sourceBefore(TSCSyntaxKind.ThrowKeyword),
                Markers.EMPTY,
                (Expression) visitNode(node.getNodeProperty("expression"))
        );
    }

    private J.Try visitTryStatement(TSCNode node) {
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
        TSCNode finallyBlockNode = node.getOptionalNodeProperty("finallyBlock");
        if (finallyBlockNode != null) {
            finallyBlock = padLeft(sourceBefore(TSCSyntaxKind.FinallyKeyword), (J.Block) visitNode(finallyBlockNode));
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
        Space prefix = whitespace();
        TSCNodeList nodes = node.getOptionalNodeListProperty("elements");
        JContainer<J> types = mapContainer(
                TSCSyntaxKind.OpenBracketToken,
                nodes == null ? emptyList() : nodes,
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.CloseBracketToken,
                this::visitNode,
                true
        );
        return new JS.Tuple(
                randomId(),
                prefix,
                Markers.EMPTY,
                types,
                typeMapping.type(node)
        );
    }

    private J visitTypeAliasDeclaration(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leading, trailing);

        Space before = whitespace();
        modifiers.add(mapModifier(before, "type", trailing));

        TSCNode nameNode = node.getNodeProperty("name");
        J.Identifier name = (J.Identifier) visitNode(nameNode);
        name = name.withType(typeMapping.type(nameNode));
        J.TypeParameters typeParameters = mapTypeParameters(node.getOptionalNodeListProperty("typeParameters"));

        Space beforeEquals = sourceBefore(TSCSyntaxKind.EqualsToken);
        J j = visitNode(node.getNodeProperty("type"));
        JLeftPadded<Expression> initializer = padLeft(beforeEquals, !(j instanceof Expression) && j instanceof Statement ?
                new JS.StatementExpression(randomId(), (Statement) j) : (Expression) j);

        return new JS.TypeDeclaration(
                randomId(),
                prefix,
                markers,
                leading,
                modifiers,
                name,
                typeParameters,
                initializer,
                typeMapping.type(node)
        );
    }

    private JS.JsOperator visitTsOperator(TSCNode node) {
        Space prefix = whitespace();
        Expression left = null; // placeholder for 'bar' in foo. Remove left expression if it is unnecessary.
        JLeftPadded<JS.JsOperator.Type> op = null;
        if (node.syntaxKind() == TSCSyntaxKind.AwaitExpression) {
            op = padLeft(sourceBefore(TSCSyntaxKind.AwaitKeyword), JS.JsOperator.Type.Await);
        } else if (node.syntaxKind() == TSCSyntaxKind.TypeOfExpression) {
            op = padLeft(sourceBefore(TSCSyntaxKind.TypeOfKeyword), JS.JsOperator.Type.TypeOf);
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
        Space prefix = whitespace();
        return mapPropertyNodesToNewClass( node.getOptionalNodeListProperty("members"), prefix);
    }

    private JS.TypeOperator visitTypeOperator(TSCNode node) {
        Space prefix = whitespace();

        TSCSyntaxKind op = node.getSyntaxKindProperty("operator");
        JS.TypeOperator.Type operator = null;
        Space before = EMPTY;
        if (op == TSCSyntaxKind.ReadonlyKeyword) {
            before = sourceBefore(TSCSyntaxKind.ReadonlyKeyword);
            operator = JS.TypeOperator.Type.ReadOnly;
        } else {
            implementMe(node);
        }

        return new JS.TypeOperator(
                randomId(),
                prefix,
                Markers.EMPTY,
                operator,
                padLeft(before, (Expression) visitNode(node.getNodeProperty("type")))
        );
    }

    private J.TypeParameter visitTypeParameter(TSCNode node) {
        Space prefix = whitespace();
        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leading, trailing);
        if (!trailing.isEmpty()) {
            throw new UnsupportedOperationException("Add support for trailing annotations on: " + node.getText());
        }
        implementMe(node, "expression");
        TSCNode defaultType = node.getOptionalNodeProperty("default");
        Expression name = (Expression) visitNode(node.getNodeProperty("name"));

        if (defaultType != null) {
            name = new JS.DefaultType(
                    randomId(),
                    name.getPrefix(),
                    Markers.EMPTY,
                    name.withPrefix(EMPTY),
                    sourceBefore(TSCSyntaxKind.EqualsToken),
                    (Expression) visitNode(defaultType),
                    typeMapping.type(defaultType)
            );
        }

        TSCNode constraint = node.getOptionalNodeProperty("constraint");
        JContainer<TypeTree> bounds;
        if (constraint == null) {
            bounds = null;
        } else if (constraint.syntaxKind() == TSCSyntaxKind.IntersectionType) {
            bounds = JContainer.build(
                    sourceBefore(TSCSyntaxKind.ExtendsKeyword),
                    convertAll(constraint.getNodeListProperty("types"), t -> sourceBefore(TSCSyntaxKind.AmpersandToken), noDelim, true),
                    Markers.EMPTY);
        } else {
            bounds = JContainer.build(
                    sourceBefore(TSCSyntaxKind.ExtendsKeyword),
                    convertAll(singletonList(constraint), t -> sourceBefore(TSCSyntaxKind.AmpersandToken), noDelim, true),
                    Markers.EMPTY);
        }

        return new J.TypeParameter(
                randomId(),
                prefix,
                Markers.EMPTY,
                leading.isEmpty() ? emptyList() : leading,
                modifiers,
                name,
                bounds
        );
    }

    private J.ParameterizedType visitTypeQuery(TSCNode node) {
        Space prefix = whitespace();
        Space typeOfPrefix = sourceBefore(TSCSyntaxKind.TypeOfKeyword);
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

        TSCNodeList typeArguments = node.getOptionalNodeListProperty("typeArguments");
        return new J.ParameterizedType(
                randomId(),
                prefix,
                Markers.EMPTY,
                op,
                typeArguments == null ? null :
                        mapContainer(
                                TSCSyntaxKind.LessThanToken,
                                typeArguments,
                                TSCSyntaxKind.CommaToken,
                                TSCSyntaxKind.GreaterThanToken,
                                t -> (Expression) visitNode(t),
                                true
                        ),
                typeMapping.type(node)
        );
    }

    private J.ParameterizedType visitTypeReference(TSCNode node) {
        TSCNodeList typeArguments = node.getOptionalNodeListProperty("typeArguments");
        return new J.ParameterizedType(
                randomId(),
                whitespace(),
                Markers.EMPTY,
                (NameTree) visitNode(node.getNodeProperty("typeName")),
                typeArguments == null ? null :
                        mapContainer(
                                TSCSyntaxKind.LessThanToken,
                                typeArguments,
                                TSCSyntaxKind.CommaToken,
                                TSCSyntaxKind.GreaterThanToken,
                                t -> (Expression) visitNode(t),
                                true
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
                op = padLeft(sourceBefore(TSCSyntaxKind.ExclamationToken), J.Unary.Type.Not);
            } else if (opKind == TSCSyntaxKind.MinusMinusToken) {
                op = padLeft(sourceBefore(TSCSyntaxKind.MinusMinusToken), J.Unary.Type.PreDecrement);
            } else if (opKind == TSCSyntaxKind.PlusPlusToken) {
                op = padLeft(sourceBefore(TSCSyntaxKind.PlusPlusToken), J.Unary.Type.PreIncrement);
            } else if (opKind == TSCSyntaxKind.MinusToken) {
                op = padLeft(sourceBefore(TSCSyntaxKind.MinusToken), J.Unary.Type.Negative);
            } else if (opKind == TSCSyntaxKind.PlusToken) {
                op = padLeft(sourceBefore(TSCSyntaxKind.PlusToken), J.Unary.Type.Positive);
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

    private JS.Union visitUnionType(TSCNode node) {
        Space prefix = whitespace();
        return new JS.Union(
                randomId(),
                prefix,
                Markers.EMPTY,
                convertAll(node.getNodeListProperty("types"), t -> sourceBefore(TSCSyntaxKind.BarToken), t -> EMPTY, true),
                TsType.Union
        );
    }

    private J.VariableDeclarations visitVariableDeclaration(TSCNode node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leading, trailing);
        int saveCursor = getCursor();
        Space beforeVariableModifier = whitespace();
        TSCSyntaxKind keyword = scan();
        if (keyword == TSCSyntaxKind.ConstKeyword) {
            modifiers.add(mapModifier(beforeVariableModifier, "const", trailing));
            trailing = null;
        } else if (keyword == TSCSyntaxKind.LetKeyword) {
            modifiers.add(mapModifier(beforeVariableModifier, "let", trailing));
            trailing = null;
        } else if (keyword == TSCSyntaxKind.VarKeyword) {
            modifiers.add(mapModifier(beforeVariableModifier, "var", trailing));
            trailing = null;
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
            if (!trailing.isEmpty()) {
                name = name.withAnnotations(trailing);
            }
        } else {
            implementMe(node);
        }

        Markers variableMarker = Markers.EMPTY;
        TSCNode type = node.getOptionalNodeProperty("type");
        if (type != null) {
            TSCNode questionToken = node.getOptionalNodeProperty("questionToken");
            TSCNode exclamationToken = node.getOptionalNodeProperty("exclamationToken");
            if (questionToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore(TSCSyntaxKind.QuestionToken), PostFixOperator.Operator.Question));
            } else if (exclamationToken != null) {
                markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore(TSCSyntaxKind.ExclamationToken), PostFixOperator.Operator.Exclamation));
            }

            Space beforeColon = sourceBefore(TSCSyntaxKind.ColonToken);
            markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
            typeTree = (TypeTree) visitNode(type);
        }
        TSCNode init = node.getOptionalNodeProperty("initializer");
        J.VariableDeclarations.NamedVariable variable = new J.VariableDeclarations.NamedVariable(
                randomId(),
                variablePrefix,
                variableMarker,
                name,
                emptyList(),
                init != null ?
                        padLeft(sourceBefore(TSCSyntaxKind.EqualsToken),
                                (Expression) Objects.requireNonNull(visitNode(init))) : null,
                typeMapping.variableType(node)
        );

        namedVariables.add(padRight(variable, EMPTY));

        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                leading.isEmpty() ? emptyList() : leading,
                modifiers.isEmpty() ? emptyList() : modifiers,
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
        List<J.Modifier> modifiers = new ArrayList<>();
        if (keyword == TSCSyntaxKind.ConstKeyword) {
            modifiers.add(mapModifier(beforeVariableModifier, "const", null));
        } else if (keyword == TSCSyntaxKind.LetKeyword) {
            modifiers.add(mapModifier(beforeVariableModifier, "let", null));
        } else if (keyword == TSCSyntaxKind.VarKeyword) {
            modifiers.add(mapModifier(beforeVariableModifier, "var", null));
        } else {
            // Unclear if the modifier should be `@Nullable` in the `JSVariableDeclaration`.
            throw new UnsupportedOperationException("Unsupported variable modifier.");
        }

        List<JRightPadded<J.VariableDeclarations.NamedVariable>> namedVariables = emptyList();
        TypeTree typeTree = null;
        TSCNodeList declarations = node.getOptionalNodeListProperty("declarations");
        if (declarations != null) {
            Set<JavaType> types = new HashSet<>(declarations.size());
            namedVariables = new ArrayList<>(declarations.size());
            for (int i = 0; i < declarations.size(); i++) {
                TSCNode declaration = declarations.get(i);

                Space variablePrefix = whitespace();
                J j = visitNode(declaration.getNodeProperty("name"));
                J.Identifier name = null;
                if (j instanceof J.Identifier) {
                    name = (J.Identifier) j;
                } else if (j instanceof TypeTree) {
                    name = convertToIdentifier(EMPTY, "");
                    typeTree = (TypeTree) j;
                } else {
                    implementMe(declaration);
                }

                TSCNode type = declaration.getOptionalNodeProperty("type");
                if (type != null) {
                    TSCNode questionToken = node.getOptionalNodeProperty("questionToken");
                    TSCNode exclamationToken = node.getOptionalNodeProperty("exclamationToken");
                    if (questionToken != null) {
                        markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore(TSCSyntaxKind.QuestionToken), PostFixOperator.Operator.Question));
                    } else if (exclamationToken != null) {
                        markers = markers.addIfAbsent(new PostFixOperator(randomId(), sourceBefore(TSCSyntaxKind.ExclamationToken), PostFixOperator.Operator.Exclamation));
                    }

                    Space beforeColon = sourceBefore(TSCSyntaxKind.ColonToken);
                    markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
                    typeTree = (TypeTree) visitNode(type);
                    if (typeTree.getType() != null) {
                        types.add(typeTree.getType());
                        if (types.size() > 1) {
                            throw new UnsupportedOperationException("Multiple variable types are not supported");
                        }
                    }
                }
                TSCNode init = declaration.getOptionalNodeProperty("initializer");
                J.VariableDeclarations.NamedVariable variable = new J.VariableDeclarations.NamedVariable(
                        randomId(),
                        variablePrefix,
                        Markers.EMPTY,
                        name,
                        emptyList(),
                        init != null ?
                                padLeft(sourceBefore(TSCSyntaxKind.EqualsToken),
                                        (Expression) Objects.requireNonNull(visitNode(init))) : null,
                        typeMapping.variableType(declaration)
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
                modifiers.isEmpty() ? emptyList() : modifiers,
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

        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = new ArrayList<>();
        List<J.Modifier> modifiers = mapModifiers(node.getOptionalNodeListProperty("modifiers"), leading, trailing);

        Space beforeVariableModifier = whitespace();
        TSCSyntaxKind keyword = scan();
        if (keyword == TSCSyntaxKind.ConstKeyword) {
            modifiers.add(mapModifier(beforeVariableModifier, "const", trailing));
        } else if (keyword == TSCSyntaxKind.LetKeyword) {
            modifiers.add(mapModifier(beforeVariableModifier, "let", trailing));
        } else if (keyword == TSCSyntaxKind.VarKeyword) {
            modifiers.add(mapModifier(beforeVariableModifier, "var", trailing));
        } else {
            // Unclear if the modifier should be `@Nullable` in the `JSVariableDeclaration`.
            throw new UnsupportedOperationException("Unsupported variable modifier.");
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
            } else if (j instanceof TypeTree) {
                name = convertToIdentifier(EMPTY, "");
                typeTree = (TypeTree) j;
            } else {
                implementMe(declaration);
            }

            TSCNode type = declaration.getOptionalNodeProperty("type");
            if (type != null) {
                Space beforeColon = sourceBefore(TSCSyntaxKind.ColonToken);
                markers = markers.addIfAbsent(new TypeReferencePrefix(randomId(), beforeColon));
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
            JLeftPadded<Expression> initializer = null;
            TSCNode init = declaration.getOptionalNodeProperty("initializer");
            if (init != null) {
                Space before = sourceBefore(TSCSyntaxKind.EqualsToken);
                J element = visitNode(init);
                if (!(element instanceof Expression) && element instanceof Statement) {
                    initializer = padLeft(before, new JS.StatementExpression(randomId(), (Statement) element));
                } else if (element instanceof Expression) {
                    initializer = padLeft(before, (Expression) element);
                } else {
                    implementMe(init);
                }
            }
            J.VariableDeclarations.NamedVariable variable = new J.VariableDeclarations.NamedVariable(
                    randomId(),
                    variablePrefix,
                    Markers.EMPTY,
                    name,
                    emptyList(),
                    initializer,
                    typeMapping.variableType(declaration)
            );

            Space after = whitespace();
            if (i < declarations.size() - 1) {
                consumeToken(TSCSyntaxKind.CommaToken);
            }
            namedVariables.add(padRight(variable, after));
        }

        return new J.VariableDeclarations(
                randomId(),
                prefix,
                markers,
                leading.isEmpty() ? emptyList() : leading,
                modifiers.isEmpty() ? emptyList() : modifiers,
                typeTree,
                null,
                emptyList(),
                namedVariables
        );
    }

    private J.WhileLoop visitWhileStatement(TSCNode node) {
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

    private J visitYieldExpression(TSCNode node) {
        Space prefix = sourceBefore(TSCSyntaxKind.YieldKeyword);
        Markers markers = Markers.EMPTY;
        if (node.hasProperty("asteriskToken")) {
            markers = markers.add(new Asterisk(randomId(), sourceBefore(TSCSyntaxKind.AsteriskToken)));
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
            case NumberKeyword:
            case NullKeyword:
            case ReadonlyKeyword:
            case StringKeyword:
            case SuperKeyword:
            case ThisKeyword:
            case UndefinedKeyword:
            case UnknownKeyword:
            case VoidKeyword:
                j = visitKeyword(node);
                break;
            case FalseKeyword:
            case TrueKeyword:
                j = mapKeywordToLiteralType(node);
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
            case NoSubstitutionTemplateLiteral:
            case TaggedTemplateExpression:
            case TemplateExpression:
                j = visitTemplateExpression(node);
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
            case CaseClause:
                j = visitCaseClause(node);
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
            case DefaultClause:
                j = visitDefaultClause(node);
                break;
            case DeleteExpression:
                j = visitDeleteExpression(node);
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
            case MetaProperty:
                j = visitMetaProperty(node);
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
            case SwitchStatement:
                j = visitSwitchStatement(node);
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
                implementMe(node);
                j = null;
        }
        return j;
    }

    private final Function<TSCNode, Space> commaDelim = ignored -> sourceBefore(TSCSyntaxKind.CommaToken);
    private final Function<TSCNode, Space> noDelim = ignored -> EMPTY;

    /**
     * Returns the current cursor position in the TSC.Context.
     */
    private Integer getCursor() {
        return this.cursorContext.scannerTokenEnd();
    }


    /**
     * Consume the provided text if it matches the current cursor position.
     */
    private void skip(String text) {
        if (sourceStartsWithAtCursor(text)) {
            cursor(getCursor() + text.length());
        }
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
        if (sourceStartsWithAtCursor(";")) {
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

    private <J2 extends J> List<JRightPadded<J2>> convertAll(List<TSCNode> elements,
                                                             Function<TSCNode, Space> innerSuffix,
                                                             Function<TSCNode, Space> suffix) {
        return convertAll(elements, innerSuffix, suffix, false);
    }

    private <J2 extends J> List<JRightPadded<J2>> convertAll(List<TSCNode> elements,
                                                             Function<TSCNode, Space> innerSuffix,
                                                             Function<TSCNode, Space> suffix,
                                                             boolean enableParseErrorRecovery) {

        if (elements.isEmpty()) {
            return emptyList();
        }

        List<JRightPadded<J2>> converted = new ArrayList<>(elements.size());
        for (int i = 0; i < elements.size(); i++) {
            TSCNode element = elements.get(i);
            int saveCursor = getCursor();
            J2 j;
            try {
                //noinspection unchecked
                j = (J2) visitNode(element);
            } catch (Exception e) {
                if (!enableParseErrorRecovery) {
                    throw new JavaScriptParsingException("Unable to parse JavaScript", e);
                }

                cursor(saveCursor);
                Space prefix = whitespace();
                String text = element.getText();
                skip(text);
                //noinspection unchecked
                j = (J2) new J.Unknown(
                        randomId(),
                        prefix,
                        Markers.EMPTY,
                        new J.Unknown.Source(
                                randomId(),
                                EMPTY,
                                Markers.build(singletonList(ParseExceptionResult.build(JavaScriptParser.builder().build(), e)
                                        .withTreeType(element.syntaxKind().name()))),
                                text));
            }
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
        return new J.Identifier(randomId(), prefix, Markers.EMPTY, emptyList(), simpleName, null, null);
    }

    private J.Literal mapKeywordToLiteralType(TSCNode node) {
        Space prefix = sourceBefore(node.syntaxKind());
        Object value;
        String valueSource;
        JavaType.Primitive primitiveType;
        if (node.syntaxKind() == TSCSyntaxKind.TrueKeyword) {
            value = true;
            valueSource = "true";
            primitiveType = JavaType.Primitive.Boolean;
        } else if (node.syntaxKind() == TSCSyntaxKind.FalseKeyword) {
            value = false;
            valueSource = "false";
            primitiveType = JavaType.Primitive.Boolean;
        } else {
            throw new IllegalArgumentException("Cannot convert node to literal type: " + node.syntaxKind());
        }
        return new J.Literal(randomId(), prefix, Markers.EMPTY, value, valueSource, null, primitiveType);
    }

    private <T extends J> JContainer<T> mapContainer(TSCSyntaxKind open, List<TSCNode> nodes, @Nullable TSCSyntaxKind delimiter, TSCSyntaxKind close, Function<TSCNode, T> visitFn) {
        return mapContainer(open, nodes, delimiter, close, visitFn, false);
    }

    private <T extends J> JContainer<T> mapContainer(TSCSyntaxKind open, List<TSCNode> nodes, @Nullable TSCSyntaxKind delimiter, TSCSyntaxKind close, Function<TSCNode, T> visitFn, boolean withUnknown) {
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
                int saveCursor = getCursor();
                T visited;
                try {
                    if (node.syntaxKind() == TSCSyntaxKind.OmittedExpression) {
                        //noinspection unchecked
                        visited = (T) new J.Empty(randomId(), EMPTY, Markers.EMPTY);
                    } else {
                        visited = visitFn.apply(node);
                    }
                } catch (Exception e) {
                    if (withUnknown) {
                        cursor(saveCursor);
                        Space prefix = whitespace();
                        String text = node.getText();
                        skip(text);
                        //noinspection unchecked
                        visited = (T) new J.Unknown(
                                randomId(),
                                prefix,
                                Markers.EMPTY,
                                new J.Unknown.Source(
                                        randomId(),
                                        EMPTY,
                                        Markers.build(singletonList(ParseExceptionResult.build(JavaScriptParser.builder().build(), e)
                                                .withTreeType(node.syntaxKind().name()))),
                                        text));
                    } else {
                        throw e;
                    }
                }
                Markers markers = Markers.EMPTY;
                Space after = EMPTY;
                if (delimiter != null) {
                    if (i < nodes.size() - 1) {
                        after = sourceBefore(delimiter);
                    } else if (delimiter == TSCSyntaxKind.CommaToken) {
                        after = whitespace();
                        if (sourceStartsWithAtCursor(",")) {
                            consumeToken(delimiter);
                            markers = markers.addIfAbsent(new TrailingComma(randomId(), whitespace()));
                        }
                    } else {
                        after = whitespace();
                    }
                }
                elements.add(JRightPadded.build(visited).withAfter(after).withMarkers(markers));
            }
        }
        consumeToken(close);
        return JContainer.build(containerPrefix, elements, Markers.EMPTY);
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
            Space before = sourceBefore(TSCSyntaxKind.OpenBracketToken);
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

    private List<J.Modifier> mapModifiers(@Nullable List<TSCNode> nodes, List<J.Annotation> leadingAnnotations, List<J.Annotation> trailingAnnotations) {
        if (nodes == null) {
            return new ArrayList<>();
        }

        List<J.Modifier> modifiers = new ArrayList<>(nodes.size());
        List<J.Annotation> leading = new ArrayList<>();
        List<J.Annotation> trailing = null;
        for (TSCNode node : nodes) {
            Space prefix = whitespace();
            switch (node.syntaxKind()) {
                // JS/TS equivalent of an annotation.
                case Decorator: {
                    J.Annotation annotation = (J.Annotation) visitNode(node);
                    if (leading != null) {
                        leading.add(annotation);
                    } else {
                        if (trailing == null) {
                            trailing = new ArrayList<>(1);
                        } else {
                            trailing.add(annotation);
                        }
                    }
                    break;
                }
                // JS/TS keywords.
                case DeclareKeyword:
                case DefaultKeyword:
                case ExportKeyword:
                case ReadonlyKeyword: {
                    if (!leading.isEmpty()) {
                        leadingAnnotations.addAll(leading);
                        leading = null;
                    }
                    modifiers.add(mapModifier(prefix, node.getText(), trailing));
                    trailing = null;
                    break;
                }
                // Keywords that exist in J.
                case AbstractKeyword:
                    if (!leading.isEmpty()) {
                        leadingAnnotations.addAll(leading);
                        leading = null;
                    }
                    consumeToken(TSCSyntaxKind.AbstractKeyword);
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, null, J.Modifier.Type.Abstract, trailing == null ? emptyList() : trailing));
                    trailing = null;
                    break;
                case AsyncKeyword:
                    if (!leading.isEmpty()) {
                        leadingAnnotations.addAll(leading);
                        leading = null;
                    }
                    consumeToken(TSCSyntaxKind.AsyncKeyword);
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, null, J.Modifier.Type.Async, trailing == null ? emptyList() : trailing));
                    trailing = null;
                    break;
                case PublicKeyword:
                    if (!leading.isEmpty()) {
                        leadingAnnotations.addAll(leading);
                        leading = null;
                    }
                    consumeToken(TSCSyntaxKind.PublicKeyword);
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, null, J.Modifier.Type.Public, trailing == null ? emptyList() : trailing));
                    trailing = null;
                    break;
                case PrivateKeyword:
                    if (!leading.isEmpty()) {
                        leadingAnnotations.addAll(leading);
                        leading = null;
                    }
                    consumeToken(TSCSyntaxKind.PrivateKeyword);
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, null, J.Modifier.Type.Private, trailing == null ? emptyList() : trailing));
                    trailing = null;
                    break;
                case ProtectedKeyword:
                    if (!leading.isEmpty()) {
                        leadingAnnotations.addAll(leading);
                        leading = null;
                    }
                    consumeToken(TSCSyntaxKind.ProtectedKeyword);
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, null, J.Modifier.Type.Protected, trailing == null ? emptyList() : trailing));
                    trailing = null;
                    break;
                case StaticKeyword:
                    if (!leading.isEmpty()) {
                        leadingAnnotations.addAll(leading);
                        leading = null;
                    }
                    consumeToken(TSCSyntaxKind.StaticKeyword);
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, null, J.Modifier.Type.Static, trailing == null ? emptyList() : trailing));
                    trailing = null;
                    break;
                default:
                    implementMe(node);
            }
        }
        if (leading != null) {
            leadingAnnotations.addAll(leading);
        }
        if (trailing != null) {
            trailingAnnotations.addAll(trailing);
        }
        return modifiers.isEmpty() ? new ArrayList<>() : modifiers;
    }

    @Nullable
    private J.TypeParameters mapTypeParameters(@Nullable List<TSCNode> typeParameters) {
        return typeParameters == null ? null : new J.TypeParameters(randomId(), sourceBefore(TSCSyntaxKind.LessThanToken), Markers.EMPTY,
                emptyList(),
                convertAll(typeParameters, commaDelim, t -> sourceBefore(TSCSyntaxKind.GreaterThanToken)));
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

    private boolean sourceStartsWithAtCursor(String text) {
        return sourceText.startsWith(text, getCursor());
    }

    private Space sourceBefore(TSCSyntaxKind syntaxKind) {
        Space prefix = whitespace();
        consumeToken(syntaxKind);
        return prefix;
    }

    private J.Modifier mapModifier(Space prefix, String name, @Nullable List<J.Annotation> annotations) {
        skip(name);
        return new J.Modifier(
                randomId(),
                prefix,
                Markers.EMPTY,
                name,
                J.Modifier.Type.LanguageExtension,
                annotations == null ? emptyList() : annotations
        );
    }

    private J.NewClass mapPropertyNodesToNewClass(List<TSCNode> propertyNodes, Space prefix) {
        return new J.NewClass(
                randomId(),
                prefix,
                Markers.build(singletonList(new ObjectLiteral(randomId()))),
                null,
                EMPTY,
                null,
                mapContainer(
                        TSCSyntaxKind.OpenBraceToken,
                        propertyNodes,
                        TSCSyntaxKind.CommaToken,
                        TSCSyntaxKind.CloseBraceToken,
                        x -> convertToExpression(visitNode(x)),
                        true
                ),
                null,
                null
        );
    }

    @SuppressWarnings("unchecked")
    private <J2 extends J> J2 convertToExpression(J j) {
        if (j instanceof Statement && !(j instanceof Expression)) {
            j = new JS.StatementExpression(randomId(), (Statement) j);
        }
        return (J2) j;
    }


    /**
     * Consume whitespace and leading comments until the current node.
     * The type-script spec is not actively maintained, so we need to rely on the parser elements to collect
     * whitespace and comments.
     */
    private Space whitespace() {
        StringBuilder initialSpace = null;
        List<Comment> comments = Collections.emptyList();
        TSCSyntaxKind kind;
        boolean done = false;
        do {
            kind = scan();
            switch (kind) {
                case WhitespaceTrivia:
                case NewLineTrivia: {
                    if (comments.isEmpty()) {
                        if (initialSpace == null) {
                            initialSpace = new StringBuilder();
                        }
                        initialSpace.append(lastToken());
                    } else {
                        Comment lastComment = comments.get(comments.size() - 1);
                        comments.set(comments.size() - 1, lastComment.withSuffix(lastComment.getSuffix() + lastToken()));
                    }
                    break;
                }
                case SingleLineCommentTrivia:
                case MultiLineCommentTrivia: {
                    String commentText = lastToken();
                    commentText = commentText.substring(2, kind == TSCSyntaxKind.SingleLineCommentTrivia ? commentText.length() : commentText.length() - 2);
                    Comment comment = new TextComment(
                            kind == TSCSyntaxKind.MultiLineCommentTrivia,
                            commentText,
                            "",
                            Markers.EMPTY
                    );
                    if (comments.isEmpty()) {
                        comments = new ArrayList<>(1);
                        comments.add(comment);
                    } else {
                        comments.add(comment);
                    }
                    break;
                }
                default:
                    cursor(cursorContext.scannerTokenStart());
                    done = true;
                    break;
            }
        } while (!done);
        return Space.build(initialSpace == null ? null : initialSpace.toString(), comments);
    }

    private J unknown(TSCNode node) {
        Space prefix = whitespace();
        String text = node.getText();
        skip(text);
        return new J.Unknown(
                randomId(),
                prefix,
                Markers.EMPTY,
                new J.Unknown.Source(
                        randomId(),
                        EMPTY,
                        Markers.build(singletonList(ParseExceptionResult.build(JavaScriptParser.builder().build(), new UnsupportedOperationException(node.syntaxKind().name() + " not implemented"))
                                .withTreeType(node.syntaxKind().name()))),
                        text));
    }

    private void implementMe(TSCNode node) {
        throw new UnsupportedOperationException(node.syntaxKind() + " not implemented");
    }

    private void implementMe(TSCNode node, String propertyName) {
        if (node.hasProperty(propertyName)) {
            throw new UnsupportedOperationException(node.syntaxKind() + "#" + propertyName + " not implemented");
        }
    }
}