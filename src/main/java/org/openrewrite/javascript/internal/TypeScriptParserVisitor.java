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
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.marker.Markers;

import java.nio.file.Path;
import java.util.*;
import java.util.function.Function;

import static java.util.Collections.emptyList;
import static org.openrewrite.Tree.randomId;
import static org.openrewrite.java.tree.Space.EMPTY;

public class TypeScriptParserVisitor {

    private final TSC.Node source;
    private final TSC.SourceFileContext cursorContext;
    private final Path sourcePath;
    private final TypeScriptTypeMapping typeMapping;

    @Nullable
    private final Path relativeTo;

    private final String charset;
    private final boolean isCharsetBomMarked;

    public TypeScriptParserVisitor(TSC.Node source, TSC.SourceFileContext sourceContext, Path sourcePath, @Nullable Path relativeTo, JavaTypeCache typeCache, String charset, boolean isCharsetBomMarked) {
        this.source = source;
        this.cursorContext = sourceContext;
        this.sourcePath = sourcePath;
        this.relativeTo = relativeTo;
        this.charset = charset;
        this.isCharsetBomMarked = isCharsetBomMarked;
        this.typeMapping = new TypeScriptTypeMapping(typeCache);
    }

    public JS.CompilationUnit mapSourceFile() {
        Space prefix = whitespace();

        List<JRightPadded<Statement>> statements = source.collectChildNodes("statements",
                child -> {
                    @Nullable J mapped = mapNode(child);
                    if (mapped != null) {
                        return maybeSemicolon((Statement) mapped);
                    } else {
                        return null;
                    }
                }
        );
        return new JS.CompilationUnit(
                randomId(),
                prefix,
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

    private J.Block mapBlock(@Nullable TSC.Node node) {
        if (node == null) {
            // Some bodies can return a null block.
            throw new UnsupportedOperationException("FIXME");
        }

        Space prefix = sourceBefore(TSCSyntaxKind.OpenBraceToken);

        List<TSC.Node> statementNodes = node.getChildNodes("statements");
        List<JRightPadded<Statement>> statements = new ArrayList<>(statementNodes.size());

        for (TSC.Node statementNode : statementNodes) {
            statements.add(mapStatement(statementNode));
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

    private J.ClassDeclaration mapClassDeclaration(TSC.Node node) {
        Space prefix = whitespace();
        Markers markers = Markers.EMPTY;

        List<J.Annotation> leadingAnnotation = emptyList(); // FIXME

        List<J.Modifier> modifiers = emptyList();
        if (node.hasProperty("modifiers")) {
            modifiers = mapModifiers(node.getChildNodes("modifiers"));
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
            name = mapIdentifier(node.getChildNodeRequired("name"));
        } else {
            throw new UnsupportedOperationException("Class has no name ... add support");
        }

        JContainer<J.TypeParameter> typeParams = null;

        J.Block body;
        List<JRightPadded<Statement>> members;
        if (node.hasProperty("members")) {
            Space bodyPrefix = sourceBefore(TSCSyntaxKind.OpenBraceToken);

            TSC.Node membersNode = node.getChildNodeRequired("members");
            List<TSC.Node> nodes = node.getChildNodes("members");
            if (kind.getType() == J.ClassDeclaration.Kind.Type.Enum) {
                Space enumPrefix = whitespace();

                members = new ArrayList<>(1);
                List<JRightPadded<J.EnumValue>> enumValues = new ArrayList<>(nodes.size());
                for (int i = 0; i < nodes.size(); i++) {
                    TSC.Node enumValue = nodes.get(i);
                    J.EnumValue value = (J.EnumValue) mapNode(enumValue);
                    if (value != null) {
                        boolean hasTrailingComma = i == nodes.size() - 1 && membersNode.getBooleanPropertyValue("hasTrailingComma");
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
                for (TSC.Node statement : nodes) {
                    members.add(mapStatement(statement));
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

    private J.EnumValue mapEnumMember(TSC.Node node) {
        Space prefix = whitespace();

        List<J.Annotation> annotations = null; // FIXME
        return new J.EnumValue(
                randomId(),
                prefix,
                Markers.EMPTY,
                annotations == null ? emptyList() : annotations,
                mapIdentifier(node.getChildNodeRequired("name")),
                null);
    }

    // FIXME
    private J.MethodDeclaration mapFunctionDeclaration(TSC.Node node) {
        Space prefix = sourceBefore(TSCSyntaxKind.FunctionKeyword);

        J.Identifier name = mapIdentifier(node.getChildNodeRequired("name"));

        JContainer<Statement> parameters = mapContainer(
                TSCSyntaxKind.OpenParenToken,
                node.getChildNodes("parameters"),
                TSCSyntaxKind.CommaToken,
                TSCSyntaxKind.CloseParenToken,
                this::mapFunctionParameter
        );

        J.Block block = mapBlock(node.getChildNode("body"));

        return new J.MethodDeclaration(
                randomId(),
                prefix,
                Markers.EMPTY,
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

    private Statement mapFunctionParameter(TSC.Node node) {
        Space prefix = whitespace();
        implementMe(node, "modifiers");

        Space variablePrefix = whitespace();
        J.Identifier name = mapIdentifier(node.getChildNodeRequired("name"));

        implementMe(node, "questionToken");

        Space afterName = EMPTY;
        TypeTree typeTree = null;
        if (node.hasProperty("type")) {
            // FIXME: method(x: { suit: string; card: number }[])
            afterName = sourceBefore(TSCSyntaxKind.ColonToken);
            TSC.Node type = node.getChildNode("type");
            assert type != null;
            typeTree = (TypeTree) mapNode(type);
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
                Markers.EMPTY,
                emptyList(), // TODO:
                emptyList(), // TODO:
                typeTree,
                varargs,
                dimensionsBeforeName,
                variables
        );
    }

    private J.Identifier mapIdentifier(TSC.Node node) {
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

    private J.Identifier mapNumberKeyword(TSC.Node node) {
        return mapIdentifier(node);
    }

    private J.Literal mapStringLiteral(TSC.Node node) {
        // singleQuote
        // hasExtendedUnicodeEscape
        return new J.Literal(
                randomId(),
                sourceBefore(TSCSyntaxKind.StringLiteral),
                Markers.EMPTY,
                node.getStringPropertyValue("text"),
                node.getText(),
                null, // TODO
                JavaType.Primitive.String
        );
    }

    private JS.JSVariableDeclaration mapVariableStatement(TSC.Node node) {
        Space prefix = whitespace();

        List<J.Annotation> annotations = emptyList();
        List<J.Modifier> modifiers = emptyList();
        implementMe(node, "modifiers");

        skip("let");
        JS.JSVariableDeclaration.VariableModifier modifier = JS.JSVariableDeclaration.VariableModifier.LET;

        List<JRightPadded<J.VariableDeclarations.NamedVariable>> namedVariables = emptyList();
        if (node.hasProperty("declarationList")) {
            TSC.Node declarationList = node.getChildNode("declarationList");
            assert declarationList != null;

            List<TSC.Node> declarations = declarationList.getChildNodes("declarations");
            namedVariables = new ArrayList<>(declarations.size());
            for (int i = 0; i < declarations.size(); i++) {
                TSC.Node declaration = declarations.get(i);
                // name
                // exclamationToken
                // type
                // initializer
                J.VariableDeclarations.NamedVariable variable = new J.VariableDeclarations.NamedVariable(
                        randomId(),
                        whitespace(),
                        Markers.EMPTY,
                        mapIdentifier(declaration.getChildNodeRequired("name")),
                        emptyList(),
                        declaration.hasProperty("initializer") ?
                                padLeft(sourceBefore(TSCSyntaxKind.EqualsToken),
                                        (Expression) Objects.requireNonNull(mapNode(declaration.getChildNodeRequired("initializer")))) : null,
                        typeMapping.variableType(node)
                );

                Space after = i < declarations.size() - 1 ? sourceBefore(TSCSyntaxKind.CommaToken) : EMPTY;
                namedVariables.add(padRight(variable, after));
            }
        }

        return new JS.JSVariableDeclaration(
                randomId(),
                prefix,
                Markers.EMPTY,
                modifier,
                new J.VariableDeclarations(
                        randomId(),
                        prefix,
                        Markers.EMPTY,
                        annotations,
                        modifiers,
                        null,
                        null,
                        emptyList(),
                        namedVariables
                )
        );
    }

    private JRightPadded<Statement> mapStatement(TSC.Node node) {
        // FIXME
        Statement statement = (Statement) mapNode(node);

        assert statement != null;
        return padRight(statement, EMPTY);
    }

    private List<J.Modifier> mapModifiers(List<TSC.Node> nodes) {
        List<J.Modifier> modifiers = new ArrayList<>(nodes.size());
        for (TSC.Node node : nodes) {
            List<J.Annotation> annotations = emptyList(); // FIXME: maybe add annotations.
            switch (node.syntaxKind()) {
                case AbstractKeyword:
                    Space prefix = whitespace();
                    consumeToken(TSCSyntaxKind.AbstractKeyword);
                    modifiers.add(new J.Modifier(randomId(), prefix, Markers.EMPTY, J.Modifier.Type.Abstract, annotations));
                    break;
                default:
                    implementMe(node);
            }
        }

        return modifiers;
    }

    private void implementMe(TSC.Node node) {
        throw new UnsupportedOperationException(String.format("Implement syntax kind: %s.", node.syntaxKind()));
    }

    private void implementMe(TSC.Node node, String propertyName) {
        if (node.hasProperty(propertyName)) {
            throw new UnsupportedOperationException(String.format("Implement syntax kind: %s property %s", node.syntaxKind(), propertyName));
        }
    }

    @Nullable
    private J mapNode(TSC.Node node) {
        J j;
        switch (node.syntaxKind()) {
            case EnumDeclaration:
            case ClassDeclaration:
            case InterfaceDeclaration:
                j = mapClassDeclaration(node);
                break;
            case EnumMember:
                j = mapEnumMember(node);
                break;
            case FunctionDeclaration:
                j = mapFunctionDeclaration(node);
                break;
            case NumberKeyword:
                j = mapNumberKeyword(node);
                break;
            case StringLiteral:
                j = mapStringLiteral(node);
                break;
            case VariableStatement:
                j = mapVariableStatement(node);
                break;
            default:
                implementMe(node); // TODO: remove ... temp for velocity.
                System.err.println("unsupported syntax kind: " + node.syntaxKindName());
                j = null;
        }
        return j;
    }

    /**
     * Returns the current cursor position in the TSC.Context.
     */
    private Integer getCursorPosition() {
        return this.cursorContext.scannerTokenEnd();
    }

    /**
     * Set the cursor position to the specified index.
     */
    private void cursor(int cursor) {
        System.err.println("[scanner] reset to pos=" + cursor + " (from pos=" + this.getCursorPosition() + ")");
        this.cursorContext.resetScanner(cursor);
    }

    /**
     * Increment the cursor position past the text.
     */
    private void skip(String text) {
        this.cursorContext.resetScanner(getCursorPosition() + text.length());
    }

    private <T> JLeftPadded<T> padLeft(Space left, T tree) {
        return new JLeftPadded<>(left, tree, Markers.EMPTY);
    }

    private <T> JRightPadded<T> padRight(T tree, @Nullable Space right) {
        return new JRightPadded<>(tree, right == null ? EMPTY : right, Markers.EMPTY);
    }

    private <K2 extends J> JRightPadded<K2> maybeSemicolon(K2 k) {
        int saveCursor = getCursorPosition();
        Space beforeSemi = whitespace();
        Semicolon semicolon = null;
        if (getCursorPosition() < source.getText().length() && source.getText().charAt(getCursorPosition()) == ';') {
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
//        System.err.println("[scanner] scanning at pos=" + this.getCursorPosition());
        TSCSyntaxKind kind = this.cursorContext.nextScannerSyntaxType();
//        System.err.println("[scanner]     scan returned kind=" + kind + "; start=" + cursorContext.scannerTokenStart() + "; end=" + cursorContext.scannerTokenEnd() + ");");
        return kind;
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

    private <T> JContainer<T> mapContainer(TSCSyntaxKind open, List<TSC.Node> nodes, @Nullable TSCSyntaxKind delimiter, TSCSyntaxKind close, Function<TSC.Node, T> mapFn) {
        Space containerPrefix = whitespace();
        consumeToken(open);
        List<JRightPadded<T>> rightPaddeds;
        if (nodes.isEmpty()) {
            Space withinContainerSpace = whitespace();
            //noinspection unchecked
            rightPaddeds = Collections.singletonList(
                    JRightPadded.build((T) new J.Empty(UUID.randomUUID(), withinContainerSpace, Markers.EMPTY))
            );
        } else {
            rightPaddeds = new ArrayList<>(nodes.size());
            for (int i = 0; i < nodes.size(); i++) {
                TSC.Node node = nodes.get(i);
                T mapped = mapFn.apply(node);
                Space after = whitespace();
                rightPaddeds.add(JRightPadded.build(mapped).withAfter(after));
                // FIXME: check on trailing commas. Trailing comma property may not be available here. pass in bool val?
                if (i < nodes.size() - 1 && delimiter != null) {
                    consumeToken(delimiter);
                }
            }
        }
        consumeToken(close);
        return JContainer.build(containerPrefix, rightPaddeds, Markers.EMPTY);
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
     */
    private Space whitespace() {
//        System.err.println("[scanner] consuming space, starting at pos=" + getCursorPosition());
        String initialSpace = "";
        List<Comment> comments = Collections.emptyList();
        TSCSyntaxKind kind;
        boolean done = false;
        do {
            kind = scan();
            switch (kind) {
                case WhitespaceTrivia:
                case NewLineTrivia:
//                    System.err.println("[scanner]     appending whitespace");
                    if (comments.isEmpty()) {
                        initialSpace += lastToken();
                    } else {
                        comments = ListUtils.mapLast(
                                comments,
                                comment -> comment.withSuffix(comment.getSuffix() + lastToken())
                        );
                    }
                    break;
                case SingleLineCommentTrivia:
                case MultiLineCommentTrivia:
//                    System.err.println("[scanner]     appending comment");
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
                    // rewind to before this token
//                    System.err.println("[scanner]     resetting to pos=" + cursorContext.scannerTokenStart());
                    cursor(cursorContext.scannerTokenStart());
                    done = true;
                    break;
            }
        } while (!done);
        return Space.build(initialSpace, comments);
    }
}