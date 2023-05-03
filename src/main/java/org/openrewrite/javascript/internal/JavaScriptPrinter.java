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
import org.openrewrite.java.marker.Semicolon;
import org.openrewrite.java.marker.TrailingComma;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.JavaScriptVisitor;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.javascript.tree.JsContainer;
import org.openrewrite.javascript.tree.JsRightPadded;
import org.openrewrite.javascript.tree.JsSpace;
import org.openrewrite.marker.Marker;
import org.openrewrite.marker.Markers;

import java.util.List;
import java.util.function.UnaryOperator;

public class JavaScriptPrinter<P> extends JavaScriptVisitor<PrintOutputCapture<P>> {

    private static final UnaryOperator<String> JAVA_SCRIPT_MARKER_WRAPPER =
            out -> "/*~~" + out + (out.isEmpty() ? "" : "~~") + ">*/";

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
        visitRightPadded(cu.getPadding().getStatements(), JRightPadded.Location.LANGUAGE_EXTENSION, "", p);
        return cu;
    }

    @Override
    public J visitJSVariableDeclaration(JS.JSVariableDeclaration jsVariableDeclaration, PrintOutputCapture<P> p) {
        beforeSyntax(jsVariableDeclaration, JsSpace.Location.VARIABLE_DECLARATION_PREFIX, p);
        p.append(jsVariableDeclaration.getModifier().getKeyword());
        visit(jsVariableDeclaration.getVariableDeclarations(), p);
        afterSyntax(jsVariableDeclaration, p);
        return jsVariableDeclaration;
    }

    private class JavaScriptJavaPrinter extends JavaPrinter<P> {

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
            afterSyntax(method, p);
            return method;
        }

        @Override
        public J visitNewArray(J.NewArray newArray, PrintOutputCapture<P> p) {
            beforeSyntax(newArray, Space.Location.NEW_ARRAY_PREFIX, p);
            visit(newArray.getTypeExpression(), p);
            visit(newArray.getDimensions(), p);
            visitContainer("[", newArray.getPadding().getInitializer(), JContainer.Location.NEW_ARRAY_INITIALIZER, ",", "]", p);
            afterSyntax(newArray, p);
            return newArray;
        }

        @Override
        public J visitVariableDeclarations(J.VariableDeclarations multiVariable, PrintOutputCapture<P> p) {
            beforeSyntax(multiVariable, Space.Location.VARIABLE_DECLARATIONS_PREFIX, p);
            visit(multiVariable.getLeadingAnnotations(), p);
            for (J.Modifier m : multiVariable.getModifiers()) {
                visitModifier(m, p);
            }

            List<JRightPadded<J.VariableDeclarations.NamedVariable>> variables = multiVariable.getPadding().getVariables();
            for (JRightPadded<J.VariableDeclarations.NamedVariable> variable : variables) {
                visitRightPadded(variable, JRightPadded.Location.NAMED_VARIABLE, p);
                if (multiVariable.getTypeExpression() != null) {
                    p.append(":");
                    visit(multiVariable.getTypeExpression(), p);
                }

                if (variable.getElement().getInitializer() != null) {
                    JavaScriptPrinter.this.visitLeftPadded("=", variable.getElement().getPadding().getInitializer(), JLeftPadded.Location.VARIABLE_INITIALIZER, p);
                }
                afterSyntax(variable.getElement(), p);
            }

            afterSyntax(multiVariable, p);
            return multiVariable;
        }

        @Override
        public J visitVariable(J.VariableDeclarations.NamedVariable variable, PrintOutputCapture<P> p) {
            beforeSyntax(variable, Space.Location.VARIABLE_PREFIX, p);
            visit(variable.getName(), p);
            afterSyntax(variable, p);
            return variable;
        }

        @Override
        protected void visitRightPadded(List<? extends JRightPadded<? extends J>> nodes, JRightPadded.Location location, String suffixBetween, PrintOutputCapture<P> p) {
            for (int i = 0; i < nodes.size(); i++) {
                JRightPadded<? extends J> node = nodes.get(i);
                visit(node.getElement(), p);
                visitSpace(node.getAfter(), location.getAfterLocation(), p);
                visitMarkers(node.getMarkers(), p);
                if (i < nodes.size() - 1) {
                    p.append(suffixBetween);
                }
                for (Marker marker : node.getMarkers().getMarkers()) {
                    if (marker instanceof TrailingComma) {
                        p.append(suffixBetween);
                        visitSpace(((TrailingComma) marker).getSuffix(), Space.Location.LANGUAGE_EXTENSION, p);
                    } else if (marker instanceof Semicolon) {
                        p.append(";");
                    }
                }
            }
        }

        protected void visitStatement(@Nullable JRightPadded<Statement> paddedStat, JRightPadded.Location location, PrintOutputCapture<P> p) {
            if (paddedStat == null) {
                return;
            }

            visit(paddedStat.getElement(), p);
            visitSpace(paddedStat.getAfter(), location.getAfterLocation(), p);

            Statement s = paddedStat.getElement();
            boolean printSemiColon = paddedStat.getMarkers().findFirst(Semicolon.class).isPresent();
            while (true) {
                if (s instanceof J.Assert ||
                        s instanceof J.Assignment ||
                        s instanceof J.AssignmentOperation ||
                        s instanceof J.Break ||
                        s instanceof J.Continue ||
                        s instanceof J.DoWhileLoop ||
                        s instanceof J.Empty ||
                        s instanceof J.MethodInvocation ||
                        s instanceof J.NewClass ||
                        s instanceof J.Return ||
                        s instanceof J.Throw ||
                        s instanceof J.Unary ||
                        s instanceof J.VariableDeclarations ||
                        s instanceof J.Yield) {
                    if (printSemiColon) {
                        p.append(';');
                    }
                    return;
                }

                if (s instanceof J.MethodDeclaration && ((J.MethodDeclaration) s).getBody() == null) {
                    if (printSemiColon) {
                        p.append(';');
                    }
                    return;
                }

                if (s instanceof J.Label) {
                    s = ((J.Label) s).getStatement();
                    continue;
                }

                if (getCursor().getValue() instanceof J.Case) {
                    Object aSwitch =
                            getCursor()
                                    .dropParentUntil(
                                            c -> c instanceof J.Switch ||
                                                    c instanceof J.SwitchExpression ||
                                                    c == Cursor.ROOT_VALUE
                                    )
                                    .getValue();
                    if (aSwitch instanceof J.SwitchExpression) {
                        J.Case aCase = getCursor().getValue();
                        if (!(aCase.getBody() instanceof J.Block)) {
                            if (printSemiColon) {
                                p.append(';');
                            }
                        }
                        return;
                    }
                }

                return;
            }
        }
    }

    protected void beforeSyntax(J j, JsSpace.Location loc, PrintOutputCapture<P> p) {
        beforeSyntax(j.getPrefix(), j.getMarkers(), loc, p);
    }

    private void beforeSyntax(Space prefix, Markers markers, @Nullable JsSpace.Location loc, PrintOutputCapture<P> p) {
        for (Marker marker : markers.getMarkers()) {
            p.append(p.getMarkerPrinter().beforePrefix(marker, new Cursor(getCursor(), marker), JAVA_SCRIPT_MARKER_WRAPPER));
        }
        if (loc != null) {
            visitSpace(prefix, loc, p);
        }
        visitMarkers(markers, p);
        for (Marker marker : markers.getMarkers()) {
            p.append(p.getMarkerPrinter().beforeSyntax(marker, new Cursor(getCursor(), marker), JAVA_SCRIPT_MARKER_WRAPPER));
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

    protected void visitLeftPadded(@Nullable String prefix, @Nullable JLeftPadded<? extends J> leftPadded, JLeftPadded.Location location, PrintOutputCapture<P> p) {
        if (leftPadded != null) {
            beforeSyntax(leftPadded.getBefore(), leftPadded.getMarkers(), location.getBeforeLocation(), p);
            if (prefix != null) {
                p.append(prefix);
            }
            visit(leftPadded.getElement(), p);
            afterSyntax(leftPadded.getMarkers(), p);
        }
    }

    protected void visitRightPadded(List<? extends JRightPadded<? extends J>> nodes, JRightPadded.Location location, String suffixBetween, PrintOutputCapture<P> p) {
        for (int i = 0; i < nodes.size(); i++) {
            JRightPadded<? extends J> node = nodes.get(i);
            JavaScriptPrinter.this.visit(node.getElement(), p);
            visitSpace(node.getAfter(), location.getAfterLocation(), p);
            visitMarkers(node.getMarkers(), p);
            if (i < nodes.size() - 1) {
                p.append(suffixBetween);
            }
            for (Marker marker : node.getMarkers().getMarkers()) {
                if (marker instanceof TrailingComma) {
                    p.append(suffixBetween);
                    visitSpace(((TrailingComma) marker).getSuffix(), Space.Location.LANGUAGE_EXTENSION, p);
                } else if (marker instanceof Semicolon) {
                    p.append(";");
                }
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

    protected void visitContainer(String before, @Nullable JContainer<? extends J> container, JsContainer.Location location,
                                  String suffixBetween, @Nullable String after, PrintOutputCapture<P> p) {
        if (container == null) {
            return;
        }
        visitSpace(container.getBefore(), location.getBeforeLocation(), p);
        p.append(before);
        visitRightPadded(container.getPadding().getElements(), location.getElementLocation(), suffixBetween, p);
        p.append(after == null ? "" : after);
    }

    protected void visitRightPadded(List<? extends JRightPadded<? extends J>> nodes, JsRightPadded.Location location, String suffixBetween, PrintOutputCapture<P> p) {
        for (int i = 0; i < nodes.size(); i++) {
            JRightPadded<? extends J> node = nodes.get(i);
            visit(node.getElement(), p);
            visitSpace(node.getAfter(), location.getAfterLocation(), p);
            if (i < nodes.size() - 1) {
                p.append(suffixBetween);
            }
            for (Marker marker : node.getMarkers().getMarkers()) {
                if (marker instanceof TrailingComma) {
                    p.append(suffixBetween);
                    visitSpace(((TrailingComma) marker).getSuffix(), Space.Location.LANGUAGE_EXTENSION, p);
                } else if (marker instanceof Semicolon) {
                    p.append(";");
                }
            }
        }
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
