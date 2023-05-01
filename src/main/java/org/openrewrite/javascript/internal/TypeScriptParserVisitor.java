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
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.marker.Markers;

import java.nio.file.Path;
import java.util.*;
import java.util.function.Function;

import static java.util.Collections.emptyList;
import static org.openrewrite.Tree.randomId;

public class TypeScriptParserVisitor {

    private final TSC.Node source;
    private final TSC.Context cursorContext;
    private final Path sourcePath;

    @Nullable
    private final Path relativeTo;

    private final String charset;
    private final boolean isCharsetBomMarked;

    public TypeScriptParserVisitor(TSC.Node source, TSC.Context sourceContext, Path sourcePath, @Nullable Path relativeTo, String charset, boolean isCharsetBomMarked) {
        this.source = source;
        this.cursorContext = sourceContext;
        this.sourcePath = sourcePath;
        this.relativeTo = relativeTo;
        this.charset = charset;
        this.isCharsetBomMarked = isCharsetBomMarked;
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
     * Increment the cursor position to the end of the node.
     */
    private void skip(TSC.Node node) {
        this.cursorContext.resetScanner(node.getEnd());
    }

    private TSCSyntaxKind scan() {
        System.err.println("[scanner] scanning at pos=" + this.getCursorPosition());
        TSCSyntaxKind kind = this.cursorContext.nextScannerSyntaxType();
        System.err.println("[scanner]     scan returned kind=" + kind + "; start=" + cursorContext.scannerTokenStart() + "; end=" + cursorContext.scannerTokenEnd() + ");");
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

    private TSC.Node expect(TSC.Node node) {
        if (this.getCursorPosition() != node.getEnd()) {
            throw new IllegalStateException(String.format("expected position '%d'; found '%d'", node.getEnd(), this.getCursorPosition()));
        }
        return node;
    }

    private TSC.Node expect(TSCSyntaxKind kind, TSC.Node node) {
        if (node.syntaxKind() != kind) {
            throw new IllegalStateException(String.format("expected kind '%s'; found '%s'", kind, node.syntaxKindName()));
        }
        if (this.getCursorPosition() != node.getStart()) {
            throw new IllegalStateException(
                    String.format(
                            "expected position %d; found %d (node text=`%s`, end=%d)",
                            node.getStart(),
                            this.getCursorPosition(),
                            node.getText().replace("\n", "⏎"),
                            node.getEnd()
                    )
            );
        }
        return node;
    }

    private String tokenStreamDebug() {
        return String.format("[start=%d, end=%d, text=`%s`]", this.cursorContext.scannerTokenStart(), this.cursorContext.scannerTokenEnd(), this.cursorContext.scannerTokenText().replace("\n", "⏎"));
    }

    /**
     * TODO: asses whether it's simpler to iterate through the source text and increment the cursor position.
     * <p>
     * Consume whitespace and leading comments until the current node.
     */
    private Space whitespace() {
        System.err.println("[scanner] consuming space, starting at pos=" + getCursorPosition());
        String initialSpace = "";
        List<Comment> comments = Collections.emptyList();
        TSCSyntaxKind kind;
        boolean done = false;
        do {
            kind = scan();
            switch (kind) {
                case WhitespaceTrivia:
                case NewLineTrivia:
                    System.err.println("[scanner]     appending whitespace");
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
                    System.err.println("[scanner]     appending comment");
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
                    System.err.println("[scanner]     resetting to pos=" + cursorContext.scannerTokenStart());
                    cursor(cursorContext.scannerTokenStart());
                    done = true;
                    break;
            }
        } while (!done);
        return Space.build(initialSpace, comments);
    }

    public JS.CompilationUnit mapSourceFile() {
        List<JRightPadded<Statement>> statements = source.collectChildNodes("statements",
                child -> {
                    @Nullable J mapped = mapNode(child);
                    if (mapped != null) {
                        return new JRightPadded<>((Statement) mapped, Space.EMPTY, Markers.EMPTY);
                    } else {
                        return null;
                    }
                }
        );
        return new JS.CompilationUnit(
                randomId(),
                Space.EMPTY,
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
                Space.EMPTY
        );
    }

    @Nullable
    private J mapNode(TSC.Node node) {
        switch (node.syntaxKind()) {
            case FunctionDeclaration:
                return mapFunctionDeclaration(node);
            default:
//                throw new UnsupportedOperationException("unsupported syntax kind: " + node.syntaxKindName());
                System.err.println("unsupported syntax kind: " + node.syntaxKindName());
                return null;
        }
    }

    private <T> JContainer<T> mapContainer(TSCSyntaxKind open, List<TSC.Node> nodes, @Nullable TSCSyntaxKind delimiter, TSCSyntaxKind close, Function<TSC.Node, T> mapFn) {
        Space containerPrefix = whitespace();
        consumeToken(open);
        List<JRightPadded<T>> rightPaddeds;
        if (nodes.isEmpty()) {
            Space withinContainerSpace = whitespace();
            rightPaddeds = Collections.singletonList(
                    JRightPadded.build((T) new J.Empty(UUID.randomUUID(), withinContainerSpace, Markers.EMPTY))
            );
        } else {
            rightPaddeds = new ArrayList<>(nodes.size());
            for (TSC.Node node : nodes) {
                T mapped = mapFn.apply(node);
                Space after = whitespace();
                rightPaddeds.add(JRightPadded.build(mapped).withAfter(after));
                if (delimiter != null) {
                    consumeToken(delimiter);
                }
            }
        }
        consumeToken(close);
        return JContainer.build(containerPrefix, rightPaddeds, Markers.EMPTY);
    }

    private J.Identifier mapIdentifier(TSC.Node node) {
        expect(TSCSyntaxKind.Identifier, node);

        Space prefix = whitespace();
        skip(node);
        return new J.Identifier(
                randomId(),
                prefix,
                Markers.EMPTY,
                node.getText(),
                null,
                null
        );
    }

    private J.Block mapBlock(@Nullable TSC.Node node) {
        // TODO: handle null TSC.Node.

        expect(TSCSyntaxKind.Block, node);

        Space prefix = whitespace();

        consumeToken(TSCSyntaxKind.OpenBraceToken);

        List<TSC.Node> statementNodes = node.getChildNodes("statements");
        List<JRightPadded<Statement>> statements = new ArrayList<>(statementNodes.size());

        for (TSC.Node statementNode : statementNodes) {
            statements.add(mapStatement(statementNode));
        }

        Space endOfBlock = whitespace();

        consumeToken(TSCSyntaxKind.CloseBraceToken);

        J.Block block = new J.Block(
                randomId(),
                prefix,
                Markers.EMPTY,
                JRightPadded.build(false),
                Collections.emptyList(),
                endOfBlock
        );

        return block;
    }

    private JRightPadded<Statement> mapStatement(TSC.Node node) {
        // FIXME
        Statement statement = (Statement) mapNode(node);
        return JRightPadded.build(statement);
    }

    private J mapFunctionDeclaration(TSC.Node node) {
        consumeToken(TSCSyntaxKind.FunctionKeyword);

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
                Space.EMPTY,
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
                null
        );
    }

    private Statement mapFunctionParameter(TSC.Node node) {
        throw new UnsupportedOperationException();
    }

}