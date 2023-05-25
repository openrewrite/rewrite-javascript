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
import org.openrewrite.javascript.tree.JsLeftPadded;
import org.openrewrite.javascript.tree.JsRightPadded;
import org.openrewrite.javascript.tree.JsSpace;
import org.openrewrite.marker.Marker;
import org.openrewrite.marker.Markers;
import org.openrewrite.markers.ForLoopType;
import org.openrewrite.markers.FunctionDeclaration;
import org.openrewrite.markers.TypeReferencePrefix;
import org.openrewrite.markers.VariableModifier;

import java.util.List;
import java.util.function.UnaryOperator;

import static org.openrewrite.markers.VariableModifier.Keyword.*;

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
        beforeSyntax(cu, Space.Location.COMPILATION_UNIT_PREFIX, p);

        visitRightPadded(cu.getPadding().getStatements(), JRightPadded.Location.LANGUAGE_EXTENSION, "", p);

        visitSpace(cu.getEof(), Space.Location.COMPILATION_UNIT_EOF, p);
        afterSyntax(cu, p);
        return cu;
    }

    @Override
    public J visitJsBinary(JS.JsBinary binary, PrintOutputCapture<P> p) {
        beforeSyntax(binary, JsSpace.Location.BINARY_PREFIX, p);

        visit(binary.getLeft(), p);
        String keyword = "";
        switch (binary.getOperator()) {
            case IdentityEquals:
                keyword = "===";
                break;
            case IdentityNotEquals:
                keyword = "!==";
                break;
        }

        visitSpace(binary.getPadding().getOperator().getBefore(), JsSpace.Location.BINARY_PREFIX, p);
        p.append(keyword);

        visit(binary.getRight(), p);

        afterSyntax(binary, p);
        return binary;
    }

    @Override
    public J visitJsOperator(JS.JsOperator operator, PrintOutputCapture<P> p) {
        beforeSyntax(operator, JsSpace.Location.BINARY_PREFIX, p);

        visit(operator.getLeft(), p);
        String keyword = "";
        switch (operator.getOperator()) {
            case Delete:
                keyword = "delete";
                break;
            case In:
                keyword = "in";
                break;
            case TypeOf:
                keyword = "typeof";
                break;
        }

        visitSpace(operator.getPadding().getOperator().getBefore(), JsSpace.Location.OPERATOR_PREFIX, p);
        p.append(keyword);

        visit(operator.getRight(), p);

        afterSyntax(operator, p);
        return operator;
    }

    @Override
    public J visitTypeOperator(JS.TypeOperator typeOperator, PrintOutputCapture<P> p) {
        beforeSyntax(typeOperator, JsSpace.Location.BINARY_PREFIX, p);

        String keyword = "";
        if (typeOperator.getOperator() == JS.TypeOperator.Type.ReadOnly) {
            keyword = "readonly";
        }

        p.append(keyword);

        visitLeftPadded(typeOperator.getPadding().getExpression(), JsLeftPadded.Location.TYPE_OPERATOR, p);

        afterSyntax(typeOperator, p);
        return typeOperator;
    }

    @Override
    public J visitUnion(JS.Union union, PrintOutputCapture<P> p) {
        beforeSyntax(union, JsSpace.Location.UNION_PREFIX, p);

        visitRightPadded(union.getPadding().getTypes(), JsRightPadded.Location.UNION_TYPE, "|", p);

        afterSyntax(union, p);
        return union;
    }

    @Override
    public J visitUnknownElement(JS.UnknownElement unknownElement, PrintOutputCapture<P> p) {
        beforeSyntax(unknownElement, JsSpace.Location.UNION_PREFIX, p);
        visit(unknownElement.getSource(), p);
        afterSyntax(unknownElement, p);
        return unknownElement;
    }

    @Override
    public J visitUnknownElementSource(JS.UnknownElement.Source source, PrintOutputCapture<P> p) {
        beforeSyntax(source, JsSpace.Location.UNKNOWN_SOURCE_PREFIX, p);
        p.append(source.getText());
        afterSyntax(source, p);
        return source;
    }

    private class JavaScriptJavaPrinter extends JavaPrinter<P> {

        @Override
        public J visit(@Nullable Tree tree, PrintOutputCapture<P> p) {
            if (tree instanceof JS) {
                // re-route printing back up to javascript
                return JavaScriptPrinter.this.visit(tree, p);
            } else {
                return super.visit(tree, p);
            }
        }

        @Override
        public J visitForEachLoop(J.ForEachLoop forEachLoop, PrintOutputCapture<P> p) {
            beforeSyntax(forEachLoop, Space.Location.FOR_EACH_LOOP_PREFIX, p);
            p.append("for");
            J.ForEachLoop.Control ctrl = forEachLoop.getControl();
            visitSpace(ctrl.getPrefix(), Space.Location.FOR_EACH_CONTROL_PREFIX, p);
            p.append('(');
            ForLoopType forLoopType = forEachLoop.getMarkers().findFirst(ForLoopType.class).orElse(null);
            String suffix = forLoopType == null ? ":" : forLoopType.getKeyword().getWord();
            visitRightPadded(ctrl.getPadding().getVariable(), JRightPadded.Location.FOREACH_VARIABLE, suffix, p);
            visitRightPadded(ctrl.getPadding().getIterable(), JRightPadded.Location.FOREACH_ITERABLE, "", p);
            p.append(')');
            visitStatement(forEachLoop.getPadding().getBody(), JRightPadded.Location.FOR_BODY, p);
            afterSyntax(forEachLoop, p);
            return forEachLoop;
        }

        @Override
        public J visitImport(J.Import import_, PrintOutputCapture<P> p) {
            beforeSyntax(import_, Space.Location.IMPORT_PREFIX, p);
            p.append("import");
            visit(import_.getAlias(), p);
            visitSpace(import_.getQualid().getPrefix(), Space.Location.LANGUAGE_EXTENSION, p);
            p.append("from");
            visitLeftPadded(import_.getQualid().getPadding().getName(), JLeftPadded.Location.LANGUAGE_EXTENSION, p);
            afterSyntax(import_, p);
            return import_;
        }

        @Override
        public J visitMethodDeclaration(J.MethodDeclaration method, PrintOutputCapture<P> p) {
            beforeSyntax(method, Space.Location.METHOD_DECLARATION_PREFIX, p);
            visitSpace(Space.EMPTY, Space.Location.ANNOTATIONS, p);
            visit(method.getLeadingAnnotations(), p);
            if (method.getMarkers().findFirst(FunctionDeclaration.class).isPresent()) {
                p.append("function");
            }

            visit(method.getName(), p);
            visitContainer("(", method.getPadding().getParameters(), JContainer.Location.METHOD_DECLARATION_PARAMETERS, ",", ")", p);
            if (method.getReturnTypeExpression() != null) {
                TypeReferencePrefix typeReferencePrefix = method.getReturnTypeExpression().getMarkers().findFirst(TypeReferencePrefix.class).orElse(null);
                if (typeReferencePrefix != null) {
                    visitSpace(typeReferencePrefix.getPrefix(), Space.Location.LANGUAGE_EXTENSION, p);
                    p.append(":");
                }
                visit(method.getReturnTypeExpression(), p);
            }

            visit(method.getBody(), p);
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
        public J visitTypeCast(J.TypeCast typeCast, PrintOutputCapture<P> p) {
            beforeSyntax(typeCast, Space.Location.TYPE_CAST_PREFIX, p);

            visit(typeCast.getExpression(), p);
            visitSpace(typeCast.getClazz().getPrefix(), Space.Location.LANGUAGE_EXTENSION, p);
            p.append("as");
            visitRightPadded(typeCast.getClazz().getPadding().getTree(), JRightPadded.Location.NAMED_VARIABLE, p);

            afterSyntax(typeCast, p);
            return typeCast;
        }

        @Override
        public J visitVariableDeclarations(J.VariableDeclarations multiVariable, PrintOutputCapture<P> p) {
            beforeSyntax(multiVariable, Space.Location.VARIABLE_DECLARATIONS_PREFIX, p);
            visit(multiVariable.getLeadingAnnotations(), p);
            for (J.Modifier m : multiVariable.getModifiers()) {
                visitModifier(m, p);
            }

            VariableModifier variableModifier = multiVariable.getMarkers().findFirst(VariableModifier.class).orElse(null);
            if (variableModifier != null) {
                switch (variableModifier.getKeyword()) {
                    case CONST:
                        p.append(CONST.getWord());
                        break;
                    case LET:
                        p.append(LET.getWord());
                        break;
                    case VAR:
                        p.append(VAR.getWord());
                        break;
                }
            }

            List<JRightPadded<J.VariableDeclarations.NamedVariable>> variables = multiVariable.getPadding().getVariables();
            for (int i = 0; i < variables.size(); i++) {
                JRightPadded<J.VariableDeclarations.NamedVariable> variable = variables.get(i);
                beforeSyntax(variable.getElement(), Space.Location.VARIABLE_PREFIX, p);
                visit(variable.getElement().getName(), p);
                if (multiVariable.getTypeExpression() != null) {
                    multiVariable.getMarkers().findFirst(TypeReferencePrefix.class).ifPresent(typeReferencePrefix -> visitSpace(typeReferencePrefix.getPrefix(), Space.Location.LANGUAGE_EXTENSION, p));
                    p.append(":");
                    visit(multiVariable.getTypeExpression(), p);
                }

                if (variable.getElement().getInitializer() != null) {
                    JavaScriptPrinter.this.visitLeftPadded("=", variable.getElement().getPadding().getInitializer(), JLeftPadded.Location.VARIABLE_INITIALIZER, p);
                }

                visitSpace(variable.getAfter(), Space.Location.NAMED_VARIABLE_SUFFIX, p);
                afterSyntax(variable.getElement(), p);
                if (i < variables.size() - 1) {
                    p.append(",");
                } else if (variable.getMarkers().findFirst(Semicolon.class).isPresent()) {
                    p.append(";");
                }
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

        protected void visitStatement(@Nullable JRightPadded<Statement> paddedStat, JRightPadded.Location location, PrintOutputCapture<P> p) {
            if (paddedStat != null) {
                visit(paddedStat.getElement(), p);
                visitSpace(paddedStat.getAfter(), location.getAfterLocation(), p);
                visitMarkers(paddedStat.getMarkers(), p);
            }
        }

        @Override
        public <M extends Marker> M visitMarker(Marker marker, PrintOutputCapture<P> p) {
            if (marker instanceof TrailingComma) {
                p.append(",");
                visitSpace(((TrailingComma) marker).getSuffix(), Space.Location.LANGUAGE_EXTENSION, p);
            } else if (marker instanceof Semicolon) {
                p.append(';');
            }
            return super.visitMarker(marker, p);
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

    protected void visitRightPadded(List<? extends JRightPadded<? extends J>> nodes, JsRightPadded.Location location, String suffixBetween, PrintOutputCapture<P> p) {
        for (int i = 0; i < nodes.size(); i++) {
            JRightPadded<? extends J> node = nodes.get(i);
            visit(node.getElement(), p);
            visitSpace(node.getAfter(), location.getAfterLocation(), p);
            if (i < nodes.size() - 1) {
                p.append(suffixBetween);
            }
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
        }
    }

    @Override
    public Space visitSpace(Space space, JsSpace.Location loc, PrintOutputCapture<P> p) {
        return delegate.visitSpace(space, Space.Location.LANGUAGE_EXTENSION, p);
    }

    @Override
    public Space visitSpace(Space space, Space.Location loc, PrintOutputCapture<P> p) {
        return delegate.visitSpace(space, loc, p);
    }

    @Override
    public Markers visitMarkers(Markers markers, PrintOutputCapture<P> pPrintOutputCapture) {
        return delegate.visitMarkers(markers, pPrintOutputCapture);
    }
}
