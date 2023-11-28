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

import lombok.AllArgsConstructor;
import lombok.Data;
import org.openrewrite.*;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCSourceFileContext;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.StreamSupport.stream;

@SuppressWarnings({"unused", "DuplicatedCode", "SameParameterValue"})
public class TsTreePrinter {

    private static final String TAB = "    ";
    private static final String ELEMENT_PREFIX = "\\---";
    private static final char BRANCH_CONTINUE_CHAR = '|';
    private static final char BRANCH_END_CHAR = '\\';
    private static final int CONTENT_MAX_LENGTH = 200;

    private static final String CONTINUE_PREFIX = "----";
    private static final String UNVISITED_PREFIX = "#";

    // Set to true to print types and verify, otherwise just verify the parse to print idempotent.
    private final static boolean printTypes = true;

    private final List<StringBuilder> outputLines;

    protected TsTreePrinter() {
        outputLines = new ArrayList<>();
    }

    public static String print(Parser.Input input) {
        return printIndexedSourceCode(input.getSource(new InMemoryExecutionContext()).readFully());
    }

    public static String print(Tree tree) {
        return "------------\nJ Tree\n" + printJTree(tree);
    }

    public static String print(TSCNode node, TSCSourceFileContext context, boolean printSpace) {
        return printTSTree(node, context, printSpace);
    }

    @AllArgsConstructor
    @Data
    public static class TreePrinterContext {
        List<StringBuilder> lines;
        int depth;
    }

    public static String printTSTree(TSCNode node, TSCSourceFileContext context, boolean printSpace) {
        TsTreePrinter treePrinter = new TsTreePrinter();
        StringBuilder sb = new StringBuilder();
        sb.append("------------").append("\n");
        sb.append("TS tree").append("\n");
        if (printSpace) {
            treePrinter.printBeforeFirstNode(node, 0, context);
        }
        treePrinter.printTSCNode(node, 1, context, printSpace);
        sb.append(String.join("\n", treePrinter.outputLines));
        context.resetScanner(0);
        return sb.toString();
    }

    private void printBeforeFirstNode(TSCNode node, int depth, TSCSourceFileContext context) {
        if (node.getStart() == 0) {
            return;
        }

        StringBuilder line = new StringBuilder();
        context.resetScanner(0);
        int stop = node.getStart();
        while (true) {
            TSCSyntaxKind kind = context.nextScannerSyntaxType();
            String text = context.scannerTokenText();
            int start = context.scannerTokenStart();
            int end = context.scannerTokenEnd();
            if (end > stop || kind == TSCSyntaxKind.EndOfFileToken) {
                break;
            }

            StringBuilder subLine = new StringBuilder();
            subLine.append(leftPadding(depth + 1))
                    .append("[")
                    .append(start)
                    .append(",").append(end)
                    .append(")")
                    .append(" | ")
                    .append("* ")
                    .append(kind).append(" | Text : \"")
                    .append(truncate(text).replace("\n", "\\n").replace("\r", "\\r"))
                    .append("\"");
            connectToLatestSibling(depth + 1);
            outputLines.add(subLine);
        }
    }

    private void printTSCNode(TSCNode node, int depth, TSCSourceFileContext context, boolean printSpace) {
        StringBuilder line = new StringBuilder();
        line.append(leftPadding(depth))
                .append(toString(node));
        connectToLatestSibling(depth);
        outputLines.add(line);
        List<TSCNode> tscNodes = node.getAllChildNodes();

        for ( int i = 0; i < tscNodes.size(); i++) {
            TSCNode childNode = tscNodes.get(i);
            TSCNode nextChildNode = i < tscNodes.size() - 1 ? tscNodes.get(i + 1) : null;
            boolean hasGap = nextChildNode != null && nextChildNode.getStart() > childNode.getEnd();
            printTSCNode(childNode, depth + 1, context, printSpace);

            if (printSpace && hasGap) {
                context.resetScanner(childNode.getEnd());
                int stop = nextChildNode.getStart();
                while (true) {
                    TSCSyntaxKind kind = context.nextScannerSyntaxType();
                    String text = context.scannerTokenText();
                    int start = context.scannerTokenStart();
                    int end = context.scannerTokenEnd();
                    if (end > stop || kind == TSCSyntaxKind.EndOfFileToken) {
                        break;
                    }

                    StringBuilder subLine = new StringBuilder();
                    subLine.append(leftPadding(depth + 1))
                            .append("[")
                            .append(start)
                            .append(",").append(end)
                            .append(")")
                            .append(" | ")
                            .append("* ")
                            .append(kind).append(" | Text : \"")
                            .append(truncate(text).replace("\n", "\\n").replace("\r", "\\r"))
                            .append("\"");
                    connectToLatestSibling(depth + 1);
                    outputLines.add(subLine);
                }
            }
        }
    }

    private static String toString(TSCNode node) {
        return "[" + node.getStart() + "," + node.getEnd() + ")"  + " | " + node.syntaxKind().name() + " | Text : \"" +
                truncate(node.getText()).replace("\n", "\\n").replace("\r", "\\r") + "\"";
    }

    /**
     * print J tree with all types
     */
    @SuppressWarnings("rawtypes")
    static class TreeVisitingPrinter extends TreeVisitor<Tree, ExecutionContext> {
        private List<Object> lastCursorStack;
        private final List<StringBuilder> outputLines;
        private final boolean skipUnvisitedElement;
        private final boolean printContent;

        public TreeVisitingPrinter(boolean skipUnvisitedElement, boolean printContent) {
            lastCursorStack = new ArrayList<>();
            outputLines = new ArrayList<>();
            this.skipUnvisitedElement = skipUnvisitedElement;
            this.printContent = printContent;
        }

        public String print() {
            return String.join("\n", outputLines);
        }

        @Override
        public @Nullable Tree visit(@Nullable Tree tree, ExecutionContext ctx) {
            if (tree == null) {
                return super.visit((Tree) null, ctx);
            }

            Cursor cursor = this.getCursor();
            List<Object> cursorStack =
                    stream(Spliterators.spliteratorUnknownSize(cursor.getPath(), 0), false)
                            .collect(Collectors.toList());
            Collections.reverse(cursorStack);
            int depth = cursorStack.size();

            // Compare lastCursorStack vs cursorStack, find the fork and print the diff
            int diffPos = -1;
            for (int i = 0; i < cursorStack.size(); i++) {
                if (i >= lastCursorStack.size() || cursorStack.get(i) != lastCursorStack.get(i)) {
                    diffPos = i;
                    break;
                }
            }

            StringBuilder line = new StringBuilder();

            // print cursor stack diff
            if (diffPos >= 0) {
                for (int i = diffPos; i < cursorStack.size(); i++) {
                    Object element = cursorStack.get(i);
                    if (skipUnvisitedElement) {
                        // skip unvisited elements, just print indents in the line
                        if (i == diffPos) {
                            line.append(leftPadding(i));
                            connectToLatestSibling(i, outputLines);
                        } else {
                            line.append(CONTINUE_PREFIX);
                        }
                    } else {
                        // print each unvisited element to a line
                        connectToLatestSibling(i, outputLines);
                        StringBuilder newLine = new StringBuilder()
                                .append(leftPadding(i))
                                .append(UNVISITED_PREFIX)
                                .append(element instanceof String ? element : element.getClass().getSimpleName());

                        if (element instanceof JRightPadded) {
                            JRightPadded rp = (JRightPadded) element;
                            newLine.append(" | ");
                            newLine.append(" after = ").append(printSpace(rp.getAfter()));
                        }

                        if (element instanceof JLeftPadded) {
                            JLeftPadded lp = (JLeftPadded) element;
                            newLine.append(" | ");
                            newLine.append(" before = ").append(printSpace(lp.getBefore()));
                        }

                        outputLines.add(newLine);
                    }
                }
            }

            // print current visiting element
            String typeName = tree instanceof J
                    ? tree.getClass().getCanonicalName().substring(tree.getClass().getPackage().getName().length() + 1)
                    : tree.getClass().getCanonicalName();

            if (skipUnvisitedElement) {
                boolean leftPadded = diffPos >= 0;
                if (leftPadded) {
                    line.append(CONTINUE_PREFIX);
                } else {
                    connectToLatestSibling(depth, outputLines);
                    line.append(leftPadding(depth));
                }
                line.append(typeName);
            } else {
                connectToLatestSibling(depth, outputLines);
                line.append(leftPadding(depth)).append(typeName);
            }

            String type = printType(tree);
            if (printTypes && !type.isEmpty()) {
                line.append(" | TYPE = ").append(type);
            }

            if (printContent) {
                String content = truncate(printTreeElement(tree));
                if (!content.isEmpty()) {
                    line.append(" | \"").append(content).append("\"");
                }
            }

            outputLines.add(line);

            cursorStack.add(tree);
            lastCursorStack = cursorStack;
            return super.visit(tree, ctx);
        }
    }

    private static String printType(Tree tree) {
        StringBuilder sb = new StringBuilder();
        if (tree instanceof TypedTree) {
            JavaType type = ((TypedTree) tree).getType();
            if (type != null && !(type instanceof JavaType.Unknown)) {
                sb.append(type);
            }
        }

        if (tree instanceof J.MethodInvocation) {
            J.MethodInvocation m = (J.MethodInvocation) tree;
            if (m.getMethodType() != null) {
                sb.append(" MethodType = ").append(m.getMethodType());
            }
        }

        if (tree instanceof J.MethodDeclaration) {
            J.MethodDeclaration m = (J.MethodDeclaration) tree;
            if (m.getMethodType() != null) {
                sb.append(" MethodType = ").append(m.getMethodType());
            }
        }

        if (tree instanceof J.VariableDeclarations.NamedVariable) {
            J.VariableDeclarations.NamedVariable v = (J.VariableDeclarations.NamedVariable) tree;
            if (v.getVariableType() != null) {
                sb.append(" VariableType = ").append(v.getVariableType());
            }
        }

        if (tree instanceof J.Identifier) {
            J.Identifier id = (J.Identifier) tree;
            if (id.getFieldType() != null) {
                sb.append(" FieldType = ").append(id.getFieldType());
            }
        }

        return sb.toString();
    }

    private static String printTreeElement(Tree tree) {
        // skip some specific types printed in the output to make the output looks clean
        if (tree instanceof J.CompilationUnit ||
                tree instanceof J.ClassDeclaration ||
                tree instanceof J.Block ||
                tree instanceof J.Empty ||
                tree instanceof J.Try ||
                tree instanceof J.Try.Catch ||
                tree instanceof J.ForLoop ||
                tree instanceof J.WhileLoop ||
                tree instanceof J.DoWhileLoop ||
                tree instanceof J.Lambda ||
                tree instanceof J.Lambda.Parameters ||
                tree instanceof J.If ||
                tree instanceof J.If.Else ||
                tree instanceof J.EnumValueSet ||
                tree instanceof J.TypeParameter ||
                tree instanceof J.Package ||
                tree instanceof J.ForEachLoop
        ) {
            return "";
        }

        if (tree instanceof J.Literal) {
            String s = ((J.Literal) tree).getValueSource();
            return s != null ? s : "";
        }

        String[] lines = tree.toString().split("\n");
        StringBuilder output = new StringBuilder();
        for (int i = 0; i < lines.length; i++) {
            output.append(lines[i].trim());
            if (i < lines.length - 1) {
                output.append(" ");
            }
        }
        return output.toString();
    }

    private static String printSpace(Space space) {
        String sb = " whitespace=\"" +
                space.getWhitespace() + "\"" +
                " comments=\"" +
                space.getComments().stream().map(c -> c.printComment(new Cursor(null, "root"))).collect(Collectors.joining(",")) +
                "\"";
        return sb.replace("\n", "\\s\n");
    }

    public static String printJTree(Tree tree) {
        TreeVisitingPrinter visitor = new TreeVisitingPrinter(true, true);
        visitor.visit(tree, new InMemoryExecutionContext());
        return visitor.print();
    }

    public static String printIndexedSourceCode(String sourceCode) {
        int count = 0;
        String[] lines = sourceCode.split("\n");
        StringBuilder sb = new StringBuilder();
        sb.append("------------").append("\n");
        sb.append("Source code with index:").append("\n\n");
        Queue<Integer> digits = new ArrayDeque<>();

        for (String line : lines) {
            StringBuilder spacesSb = new StringBuilder();
            for (int i = 0; i < line.length(); i++) {
                if (count % 10 == 0) {
                    String numStr = Integer.toString(count);
                    for (int j = 0; j < numStr.length(); j++) {
                        char c = numStr.charAt(j);
                        int digit = Character.getNumericValue(c);
                        digits.add(digit);
                    }
                }

                if (!digits.isEmpty()) {
                    spacesSb.append(digits.poll()) ;
                } else {
                    spacesSb.append(" ");
                }

                count++;
            }

            sb.append(line)
                    .append("\n")
                    .append(spacesSb)
                    .append("\n");
            count++;
        }
        return sb.toString();
    }

    /**
     * print left padding for a line
     * @param depth, depth starts from 0 (the root)
     */
    private static String leftPadding(int depth) {
        StringBuilder sb = new StringBuilder();
        int tabCount = depth - 1;
        if (tabCount > 0) {
            sb.append(String.join("", Collections.nCopies(tabCount, TAB)));
        }
        // only root has not prefix
        if (depth > 0) {
            sb.append(ELEMENT_PREFIX);
        }
        return sb.toString();
    }

    /**
     * Print a vertical line that connects the current element to the latest sibling.
     * @param depth current element depth
     */
    private void connectToLatestSibling(int depth) {
        if (depth <= 1) {
            return;
        }

        int pos = (depth - 1) * TAB.length();
        for (int i = outputLines.size() - 1; i > 0; i--) {
            StringBuilder line = outputLines.get(i);
            if (pos >= line.length()) {
                break;
            }

            if (line.charAt(pos) != ' ') {
                if (line.charAt(pos) == BRANCH_END_CHAR) {
                    line.setCharAt(pos, BRANCH_CONTINUE_CHAR);
                }
                break;
            }
            line.setCharAt(pos, BRANCH_CONTINUE_CHAR);
        }
    }

    /**
     * Print a vertical line that connects the current element to the latest sibling.
     * @param depth current element depth
     */
    private static void connectToLatestSibling(int depth, List<StringBuilder> lines) {
        if (depth <= 1) {
            return;
        }

        int pos = (depth - 1) * TAB.length();
        for (int i = lines.size() - 1; i > 0; i--) {
            StringBuilder line = lines.get(i);
            if (pos >= line.length()) {
                break;
            }

            if (line.charAt(pos) != ' ') {
                if (line.charAt(pos) == BRANCH_END_CHAR) {
                    line.setCharAt(pos, BRANCH_CONTINUE_CHAR);
                }
                break;
            }
            line.setCharAt(pos, BRANCH_CONTINUE_CHAR);
        }
    }

    private static String truncate(String content) {
        if (content.length() > CONTENT_MAX_LENGTH) {
            return content.substring(0, CONTENT_MAX_LENGTH - 3) + "...";
        }
        return content;
    }
}
