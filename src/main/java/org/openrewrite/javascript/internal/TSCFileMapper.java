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

public class TSCFileMapper {

    private final TSC.Node sourceFile;
    private final TSC.Context context;
    private final Path inputPath;
    private final Path relativeTo;
    private final String charset;
    private final boolean isCharsetBomMarked;

    public TSCFileMapper(TSC.Node sourceFile, TSC.Context context, Path inputPath, Path relativeTo, String charset, boolean isCharsetBomMarked) {
        this.sourceFile = sourceFile;
        this.context = context;
        this.inputPath = inputPath;
        this.relativeTo = relativeTo;
        this.charset = charset;
        this.isCharsetBomMarked = isCharsetBomMarked;
    }

    private Integer offset() {
        return this.context.scannerTokenEnd();
    }

    private void reset(int offset) {
        System.err.println("[scanner] reset to pos=" + offset + " (from pos=" + this.offset() + ")");
        this.context.resetScanner(offset);
    }

    private void resetToAfter(TSC.Node node) {
        this.context.resetScanner(node.getEnd());
    }

    private TSCSyntaxKind scan() {
        System.err.println("[scanner] scanning at pos=" + this.offset());
        TSCSyntaxKind kind = this.context.nextScannerSyntaxType();
        System.err.println("[scanner]     scan returned kind=" + kind + "; start=" + context.scannerTokenStart() + "; end=" + context.scannerTokenEnd() + ");");
        return kind;
    }

    private String lastToken() {
        return this.context.scannerTokenText();
    }

    private void consumeToken(TSCSyntaxKind kind) {
        TSCSyntaxKind actual = scan();
        if (kind != actual) {
            throw new IllegalStateException(String.format("expected kind '%s'; found '%s' at position %d", kind, actual, context.scannerTokenStart()));
        }
    }

    private TSC.Node expect(TSC.Node node) {
        if (this.offset() != node.getEnd()) {
            throw new IllegalStateException(String.format("expected position '%d'; found '%d'", node.getEnd(), this.offset()));
        }
        return node;
    }

    private TSC.Node expect(TSCSyntaxKind kind, TSC.Node node) {
        if (node.syntaxKind() != kind) {
            throw new IllegalStateException(String.format("expected kind '%s'; found '%s'", kind, node.syntaxKindName()));
        }
        if (this.offset() != node.getStart()) {
            throw new IllegalStateException(
                    String.format(
                            "expected position %d; found %d (node text=`%s`, end=%d)",
                            node.getStart(),
                            this.offset(),
                            node.getText().replace("\n", "⏎"),
                            node.getEnd()
                    )
            );
        }
        return node;
    }

    private String tokenStreamDebug() {
        return String.format("[start=%d, end=%d, text=`%s`]", this.context.scannerTokenStart(), this.context.scannerTokenEnd(), this.context.scannerTokenText().replace("\n", "⏎"));
    }

    private Space consumeSpace() {
        System.err.println("[scanner] consuming space, starting at pos=" + offset());
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
                    System.err.println("[scanner]     resetting to pos=" + context.scannerTokenStart());
                    reset(context.scannerTokenStart());
                    done = true;
                    break;
            }
        } while (!done);
        return Space.build(initialSpace, comments);
    }

    public JS.CompilationUnit mapSourceFile() {
        List<JRightPadded<Statement>> statements = sourceFile.collectChildNodes("statements",
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
                relativeTo == null ? null : relativeTo.relativize(inputPath),
                FileAttributes.fromPath(inputPath),
                charset,
                isCharsetBomMarked,
                null,
                // FIXME remove
                sourceFile.getText(),
                emptyList(),
                statements,
                Space.EMPTY
        );
    }


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
        Space containerPrefix = consumeSpace();
        consumeToken(open);
        List<JRightPadded<T>> rightPaddeds;
        if (nodes.isEmpty()) {
            Space withinContainerSpace = consumeSpace();
            rightPaddeds = Collections.singletonList(
                    JRightPadded.build((T) new J.Empty(UUID.randomUUID(), withinContainerSpace, Markers.EMPTY))
            );
        } else {
            rightPaddeds = new ArrayList<>(nodes.size());
            for (TSC.Node node : nodes) {
                T mapped = mapFn.apply(node);
                Space after = consumeSpace();
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

        Space prefix = consumeSpace();
        resetToAfter(node);
        return new J.Identifier(
                UUID.randomUUID(),
                prefix,
                Markers.EMPTY,
                node.getText(),
                null,
                null
        );
    }

    private J.Block mapBlock(TSC.Node node) {
        expect(TSCSyntaxKind.Block, node);

        Space prefix = consumeSpace();

        consumeToken(TSCSyntaxKind.OpenBraceToken);

        List<TSC.Node> statementNodes = node.getChildNodes("statements");
        List<JRightPadded<Statement>> statements = new ArrayList<>(statementNodes.size());

        for (TSC.Node statementNode : statementNodes) {
            statements.add(mapStatement(statementNode));
        }

        Space endOfBlock = consumeSpace();

        consumeToken(TSCSyntaxKind.CloseBraceToken);

        J.Block block = new J.Block(
                UUID.randomUUID(),
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
                UUID.randomUUID(),
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