package org.openrewrite.javascript.internal;

import org.openrewrite.FileAttributes;
import org.openrewrite.internal.ListUtils;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.marker.Markers;

import java.nio.file.Path;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

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
        this.context.resetScanner(offset);
    }

    private void resetToAfter(TSC.Node node) {
        this.context.resetScanner(node.getEnd());
    }

    private String scan() {
        return this.context.nextScannerSyntaxType();
    }

    private String lastToken() {
        return this.context.scannerTokenText();
    }

    private void expectToken(String kind) {
        String actual = scan();
        if (!kind.equals(actual)) {
            throw new IllegalStateException(String.format("expected kind '%s'; found '%s'", kind, actual));
        }
    }

    private void expect(TSC.Node node) {
        if (this.offset() != node.getEnd()) {
            throw new IllegalStateException(String.format("expected position '%d'; found '%d'", node.getEnd(), this.offset()));
        }
    }

    private Space expectSpace() {
        String initialSpace = "";
        List<Comment> comments = Collections.emptyList();
        String kind;
        boolean done = false;
        do {
            kind = scan();
            System.err.println("***** considering: " + kind + " (" + this.context.scannerTokenStart() + ", " + this.context.scannerTokenEnd() + ")");
            switch (kind) {
                case "WhitespaceTrivia":
                case "NewLineTrivia":
                    if (comments.isEmpty()) {
                        initialSpace += lastToken();
                    } else {
                        comments = ListUtils.mapLast(
                                comments,
                                comment -> comment.withSuffix(comment.getSuffix() + lastToken())
                        );
                    }
                    break;
                case "SingleLineCommentTrivia":
                case "MultiLineCommentTrivia":
                    Comment comment = new TextComment(
                            kind.equals("MultiLineCommentTrivia"),
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
                    System.err.println("**** stopping on: " + kind);
                    // rewind to before this token
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
        switch (node.syntaxKindName()) {
            case "FunctionDeclaration":
                return mapFunctionDeclaration(node);
            default:
//                throw new UnsupportedOperationException("unsupported syntax kind: " + node.syntaxKindName());
                System.err.println("unsupported syntax kind: " + node.syntaxKindName());
                return null;
        }
    }

    private J mapFunctionDeclaration(TSC.Node node) {
        expectToken("FunctionKeyword");

        Space namePrefix = expectSpace();
        TSC.Node nameNode = node.getChildNodeRequired("name");
        expect(nameNode);

        J.Identifier name = new J.Identifier(
                UUID.randomUUID(),
                namePrefix,
                Markers.EMPTY,
                nameNode.getText(),
                null,
                null
        );
        J.Block block = new J.Block(
                UUID.randomUUID(),
                Space.EMPTY,
                Markers.EMPTY,
                JRightPadded.build(false),
                Collections.emptyList(),
                Space.EMPTY
        );
        return new J.MethodDeclaration(
                UUID.randomUUID(),
                Space.EMPTY,
                Markers.EMPTY,
                Collections.emptyList(),
                Collections.emptyList(),
                null,
                null,
                new J.MethodDeclaration.IdentifierWithAnnotations(name, Collections.emptyList()),
                JContainer.empty(),
                null,
                block,
                null,
                null
        );
    }
}
