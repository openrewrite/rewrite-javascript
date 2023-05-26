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
package org.openrewrite.javascript;

import org.openrewrite.SourceFile;
import org.openrewrite.internal.ListUtils;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.JavaVisitor;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.tree.*;

public class JavaScriptVisitor<P> extends JavaVisitor<P> {

    @Override
    public boolean isAcceptable(SourceFile sourceFile, P p) {
        return sourceFile instanceof JS.CompilationUnit;
    }

    @Override
    public String getLanguage() {
        return "javascript";
    }

    @Override
    public J visitJavaSourceFile(JavaSourceFile cu, P p) {
        return cu instanceof JS.CompilationUnit ? visitCompilationUnit((JS.CompilationUnit) cu, p) : cu;
    }

    @Override
    public J visitCompilationUnit(J.CompilationUnit cu, P p) {
        throw new UnsupportedOperationException("JS has a different structure for its compilation unit. See JS.CompilationUnit.");
    }

    public J visitCompilationUnit(JS.CompilationUnit cu, P p) {
        JS.CompilationUnit c = cu;
        c = c.withPrefix(visitSpace(c.getPrefix(), Space.Location.COMPILATION_UNIT_PREFIX, p));
        c = c.withMarkers(visitMarkers(c.getMarkers(), p));
        c = c.getPadding().withImports(ListUtils.map(c.getPadding().getImports(), t -> visitRightPadded(t, JRightPadded.Location.IMPORT, p)));
        c = c.withStatements(ListUtils.map(c.getStatements(), e -> visitAndCast(e, p)));
        c = c.withEof(visitSpace(c.getEof(), Space.Location.COMPILATION_UNIT_EOF, p));
        return c;
    }

    public J visitAlias(JS.Alias alias, P p) {
        JS.Alias a = alias;
        a = a.withPrefix(visitSpace(a.getPrefix(), JsSpace.Location.ALIAS_PREFIX, p));
        a = a.withMarkers(visitMarkers(a.getMarkers(), p));
        a = a.getPadding().withPropertyName(visitRightPadded(a.getPadding().getPropertyName(), JsRightPadded.Location.ALIAS_PROPERTY_NAME, p));
        a = a.withAlias(visitAndCast(a.getAlias(), p));
        a = a.withType(visitType(a.getType(), p));
        return a;
    }

    public J visitDefaultType(JS.DefaultType defaultType, P p) {
        JS.DefaultType d = defaultType;
        d = d.withPrefix(visitSpace(d.getPrefix(), Space.Location.ASSIGNMENT_PREFIX, p));
        d = d.withMarkers(visitMarkers(d.getMarkers(), p));
        d = d.withLeft(visitAndCast(d.getLeft(), p));
        d = d.withBeforeEquals(visitSpace(d.getBeforeEquals(), Space.Location.ASSIGNMENT_OPERATION_PREFIX, p));
        d = d.withRight(visitAndCast(d.getRight(), p));
        d = d.withType(visitType(d.getType(), p));
        return d;
    }

    public J visitExport(JS.Export export, P p) {
        JS.Export e = export;
        e = e.withPrefix(visitSpace(e.getPrefix(), JsSpace.Location.EXPORT_PREFIX, p));
        e = e.withMarkers(visitMarkers(e.getMarkers(), p));
        e = e.getPadding().withExports(visitContainer(e.getPadding().getExports(), JContainer.Location.LANGUAGE_EXTENSION, p));
        if (e.getFrom() != null) {
            e = e.withFrom(visitSpace(e.getFrom(), JsSpace.Location.EXPORT_FROM_PREFIX, p));
        }
        e = e.withTarget(visitAndCast(e.getTarget(), p));
        return e;
    }

    public J visitFunctionType(JS.FunctionType functionType, P p) {
        JS.FunctionType f = functionType;
        f = f.withPrefix(visitSpace(f.getPrefix(), JsSpace.Location.FUNCTION_TYPE_PREFIX, p));
        f = f.withMarkers(visitMarkers(f.getMarkers(), p));
        f = f.getPadding().withParameters(visitContainer(f.getPadding().getParameters(), JContainer.Location.LANGUAGE_EXTENSION, p));
        f = f.withParameters(ListUtils.map(f.getParameters(), e -> visitAndCast(e, p)));
        f = f.withArrow(visitSpace(f.getArrow(), JsSpace.Location.FUNCTION_TYPE_ARROW_PREFIX, p));
        f = f.withReturnType(visitAndCast(f.getReturnType(), p));
        f = f.withType(visitType(f.getType(), p));
        return f;
    }

    public J visitJsBinary(JS.JsBinary binary, P p) {
        JS.JsBinary b = binary;
        b = b.withPrefix(visitSpace(b.getPrefix(), JsSpace.Location.BINARY_PREFIX, p));
        b = b.withMarkers(visitMarkers(b.getMarkers(), p));
        Expression temp = (Expression) visitExpression(b, p);
        if (!(temp instanceof JS.JsBinary)) {
            return temp;
        } else {
            b = (JS.JsBinary) temp;
        }
        b = b.withLeft(visitAndCast(b.getLeft(), p));
        b = b.getPadding().withOperator(visitLeftPadded(b.getPadding().getOperator(), JsLeftPadded.Location.BINARY_OPERATOR, p));
        b = b.withRight(visitAndCast(b.getRight(), p));
        b = b.withType(visitType(b.getType(), p));
        return b;
    }

    public J visitJsOperator(JS.JsOperator operator, P p) {
        JS.JsOperator o = operator;
        o = o.withPrefix(visitSpace(o.getPrefix(), JsSpace.Location.OPERATOR_PREFIX, p));
        o = o.withMarkers(visitMarkers(o.getMarkers(), p));
        Expression temp = (Expression) visitExpression(o, p);
        if (!(temp instanceof JS.JsOperator)) {
            return temp;
        } else {
            o = (JS.JsOperator) temp;
        }
        o = o.withLeft(visitAndCast(o.getLeft(), p));
        o = o.getPadding().withOperator(visitLeftPadded(o.getPadding().getOperator(), JsLeftPadded.Location.OPERATOR, p));
        o = o.withRight(visitAndCast(o.getRight(), p));
        o = o.withType(visitType(o.getType(), p));
        return o;
    }

    public J visitTypeOperator(JS.TypeOperator typeOperator, P p) {
        JS.TypeOperator t = typeOperator;
        t = t.withPrefix(visitSpace(t.getPrefix(), JsSpace.Location.TYPE_OPERATOR_PREFIX, p));
        t = t.withMarkers(visitMarkers(t.getMarkers(), p));
        t = t.getPadding().withExpression(visitLeftPadded(t.getPadding().getExpression(), JsLeftPadded.Location.TYPE_OPERATOR, p));
        t = t.withType(visitType(t.getType(), p));
        return t;
    }

    public J visitUnion(JS.Union union, P p) {
        JS.Union u = union;
        u = u.withPrefix(visitSpace(u.getPrefix(), JsSpace.Location.UNION_PREFIX, p));
        u = u.withMarkers(visitMarkers(u.getMarkers(), p));
        u = u.getPadding().withTypes(ListUtils.map(u.getPadding().getTypes(), t -> visitRightPadded(t, JsRightPadded.Location.UNION_TYPE, p)));
        u = u.withType(visitType(u.getType(), p));
        return u;
    }

    public J visitUnknownElement(JS.UnknownElement unknownElement, P p) {
        JS.UnknownElement u = unknownElement;
        u = u.withPrefix(visitSpace(u.getPrefix(), JsSpace.Location.UNKNOWN_PREFIX, p));
        u = u.withMarkers(visitMarkers(u.getMarkers(), p));
        u = u.withSource(visitAndCast(u.getSource(), p));
        u = u.withType(visitType(u.getType(), p));
        return u;
    }

    public J visitUnknownElementSource(JS.UnknownElement.Source source, P p) {
        JS.UnknownElement.Source s = source;
        s = s.withPrefix(visitSpace(s.getPrefix(), JsSpace.Location.UNKNOWN_SOURCE_PREFIX, p));
        s = s.withMarkers(visitMarkers(s.getMarkers(), p));
        return s;
    }

    public Space visitSpace(Space space, JsSpace.Location loc, P p) {
        return visitSpace(space, Space.Location.LANGUAGE_EXTENSION, p);
    }

    public <T> JRightPadded<T> visitRightPadded(@Nullable JRightPadded<T> right, JsRightPadded.Location loc, P p) {
        return super.visitRightPadded(right, JRightPadded.Location.LANGUAGE_EXTENSION, p);
    }

    public <T> JLeftPadded<T> visitLeftPadded(JLeftPadded<T> left, JsLeftPadded.Location loc, P p) {
        return super.visitLeftPadded(left, JLeftPadded.Location.LANGUAGE_EXTENSION, p);
    }

    public <J2 extends J> JContainer<J2> visitContainer(JContainer<J2> container, JsContainer.Location loc, P p) {
        return super.visitContainer(container, JContainer.Location.LANGUAGE_EXTENSION, p);
    }
}
