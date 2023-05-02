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

import org.openrewrite.Cursor;
import org.openrewrite.PrintOutputCapture;
import org.openrewrite.Tree;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.JavaPrinter;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.JavaScriptVisitor;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.marker.Marker;
import org.openrewrite.marker.Markers;

import java.util.List;
import java.util.function.UnaryOperator;

public class JavaScriptPrinter<P> extends JavaScriptVisitor<PrintOutputCapture<P>> {
//    @Override
//    public J visitCompilationUnit(JS.CompilationUnit cu, PrintOutputCapture<P> p) {
//        // FIXME implement
//        p.append(cu.getSourceText());
//        return cu;
//    }

    private final JavaScriptJavaPrinter delegate = new JavaScriptJavaPrinter();

    @Override
    public J visit(@Nullable Tree tree, PrintOutputCapture<P> p) {
        if (!(tree instanceof JS)) {
            // re-route printing to the java printer
            return delegate.visit(tree, p);
        } else {
            return super.visit(tree, p);
        }
    }

    public J visitCompilationUnit(JS.CompilationUnit cu, PrintOutputCapture<P> p) {
        // FIXME Implement
        visit(cu.getStatements(), p);
        return cu;
    }

    // TODO: fix for JS.
    private static final UnaryOperator<String> JAVA_SCRIPT_MARKER_WRAPPER =
            out -> "/*~~" + out + (out.isEmpty() ? "" : "~~") + ">*/";

    private class JavaScriptJavaPrinter extends JavaPrinter<P> {
        @Override
        public J visitBlock(J.Block block, PrintOutputCapture<P> p) {
            beforeSyntax(block, Space.Location.BLOCK_PREFIX, p);

            if (block.isStatic()) {
                p.append("static");
                visitRightPadded(block.getPadding().getStatic(), JRightPadded.Location.STATIC_INIT, p);
            }

            p.append('{');
//        visitStatements(block.getPadding().getStatements(), JRightPadded.Location.BLOCK_STATEMENT, p);
            visitSpace(block.getEnd(), Space.Location.BLOCK_END, p);
            p.append('}');
            afterSyntax(block, p);
            return block;
        }

        @Override
        public J visitMethodDeclaration(J.MethodDeclaration method, PrintOutputCapture<P> p) {
            beforeSyntax(method, Space.Location.METHOD_DECLARATION_PREFIX, p);
            visitSpace(Space.EMPTY, Space.Location.ANNOTATIONS, p);
            visit(method.getLeadingAnnotations(), p);
            // FIXME extra spacing
            p.append("function");
//        for (J.Modifier m : method.getModifiers()) {
//            visitModifier(m, p);
//        }
//        J.TypeParameters typeParameters = method.getAnnotations().getTypeParameters();
//        if (typeParameters != null) {
//            visit(typeParameters.getAnnotations(), p);
//            visitSpace(typeParameters.getPrefix(), Space.Location.TYPE_PARAMETERS, p);
//            visitMarkers(typeParameters.getMarkers(), p);
//            p.append("<");
//            visitRightPadded(typeParameters.getPadding().getTypeParameters(), JRightPadded.Location.TYPE_PARAMETER, ",", p);
//            p.append(">");
//        }
//        visit(method.getReturnTypeExpression(), p);
//        visit(method.getAnnotations().getName().getAnnotations(), p);
            visit(method.getName(), p);
//        if (!method.getMarkers().findFirst(CompactConstructor.class).isPresent()) {
            visitContainer("(", method.getPadding().getParameters(), JContainer.Location.METHOD_DECLARATION_PARAMETERS, ",", ")", p);
//        }
//        visitContainer("throws", method.getPadding().getThrows(), JContainer.Location.THROWS, ",", null, p);
            visit(method.getBody(), p);
//        visitLeftPadded("default", method.getPadding().getDefaultValue(), JLeftPadded.Location.METHOD_DECLARATION_DEFAULT_VALUE, p);
//        afterSyntax(method, p);
            return method;
        }
    }

    protected void beforeSyntax(J j, Space.Location loc, PrintOutputCapture<P> p) {
        beforeSyntax(j.getPrefix(), j.getMarkers(), loc, p);
    }

    protected void beforeSyntax(Space prefix, Markers markers, @Nullable Space.Location loc, PrintOutputCapture<P> p) {
        for (Marker marker : markers.getMarkers()) {
            p.out.append(p.getMarkerPrinter().beforePrefix(marker, new Cursor(getCursor(), marker), JAVA_SCRIPT_MARKER_WRAPPER));
        }
        if (loc != null) {
            visitSpace(prefix, loc, p);
        }
        visitMarkers(markers, p);
        for (Marker marker : markers.getMarkers()) {
            p.out.append(p.getMarkerPrinter().beforeSyntax(marker, new Cursor(getCursor(), marker), JAVA_SCRIPT_MARKER_WRAPPER));
        }
    }

    protected void afterSyntax(J j, PrintOutputCapture<P> p) {
        afterSyntax(j.getMarkers(), p);
    }

    protected void afterSyntax(Markers markers, PrintOutputCapture<P> p) {
        for (Marker marker : markers.getMarkers()) {
            p.out.append(p.getMarkerPrinter().afterSyntax(marker, new Cursor(getCursor(), marker), JAVA_SCRIPT_MARKER_WRAPPER));
        }
    }

    protected void visitRightPadded(List<? extends JRightPadded<? extends J>> nodes, JRightPadded.Location location, String suffixBetween, PrintOutputCapture<P> p) {
        for (int i = 0; i < nodes.size(); i++) {
            JRightPadded<? extends J> node = nodes.get(i);
            visit(node.getElement(), p);
            visitSpace(node.getAfter(), location.getAfterLocation(), p);
            visitMarkers(node.getMarkers(), p);
            if (i < nodes.size() - 1) {
                p.append(suffixBetween);
            }
        }
    }

    protected void visitContainer(String before, @Nullable JContainer<? extends J> container, JContainer.Location location,
                                  String suffixBetween, @Nullable String after, PrintOutputCapture<P> p) {
        if (container == null) {
            return;
        }
        beforeSyntax(container.getBefore(), container.getMarkers(), location.getBeforeLocation(), p);
        p.append(before);
        visitRightPadded(container.getPadding().getElements(), location.getElementLocation(), suffixBetween, p);
        afterSyntax(container.getMarkers(), p);
        p.append(after == null ? "" : after);
    }

    @Override
    public Space visitSpace(Space space, Space.Location loc, PrintOutputCapture<P> p) {
        p.append(space.getWhitespace());

        for (Comment comment : space.getComments()) {
            visitMarkers(comment.getMarkers(), p);
            comment.printComment(getCursor(), p);
            p.append(comment.getSuffix());
        }
        return space;
    }
}
