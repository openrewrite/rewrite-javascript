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

import org.jspecify.annotations.Nullable;
import org.openrewrite.SourceFile;
import org.openrewrite.internal.ListUtils;
import org.openrewrite.java.JavaVisitor;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.tree.*;
import org.openrewrite.marker.Markers;

import java.util.List;
import java.util.Objects;

@SuppressWarnings("unused")
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

        Expression temp = (Expression) visitExpression(a, p);
        if (!(temp instanceof JS.Alias)) {
            return temp;
        } else {
            a = (JS.Alias) temp;
        }

        a = a.getPadding().withPropertyName(visitRightPadded(a.getPadding().getPropertyName(), JsRightPadded.Location.ALIAS_PROPERTY_NAME, p));
        a = a.withAlias(visitAndCast(a.getAlias(), p));
        return a;
    }

    public J visitArrowFunction(JS.ArrowFunction arrowFunction, P p) {
        JS.ArrowFunction a = arrowFunction;
        a = a.withPrefix(visitSpace(a.getPrefix(), JsSpace.Location.ARROW_FUNCTION_PREFIX, p));
        a = a.withMarkers(visitMarkers(a.getMarkers(), p));

        Expression temp = (Expression) visitExpression(a, p);
        if (!(temp instanceof JS.ArrowFunction)) {
            return temp;
        } else {
            a = (JS.ArrowFunction) temp;
        }

        a = a.withLeadingAnnotations(ListUtils.map(a.getLeadingAnnotations(), ann -> visitAndCast(ann, p)));
        a = a.withModifiers(ListUtils.map(a.getModifiers(),
                mod -> mod.withPrefix(visitSpace(mod.getPrefix(), Space.Location.MODIFIER_PREFIX, p))));
        a = a.withModifiers(ListUtils.map(a.getModifiers(), m -> visitAndCast(m, p)));

        a = a.withParameters(
                a.getParameters().withPrefix(
                        visitSpace(a.getParameters().getPrefix(), Space.Location.LAMBDA_PARAMETERS_PREFIX, p)
                )
        );
        a = a.withParameters(
                a.getParameters().getPadding().withParams(
                        ListUtils.map(a.getParameters().getPadding().getParams(),
                                param -> visitRightPadded(param, JRightPadded.Location.LAMBDA_PARAM, p)
                        )
                )
        );
        a = a.withParameters(visitAndCast(a.getParameters(), p));
        a = a.withReturnTypeExpression(visitAndCast(a.getReturnTypeExpression(), p));
        a = a.withArrow(visitSpace(a.getArrow(), Space.Location.LAMBDA_ARROW_PREFIX, p));
        a = a.withBody(visitAndCast(a.getBody(), p));
        a = a.withType(visitType(a.getType(), p));
        return a;
    }

    public J visitBinding(JS.ObjectBindingDeclarations.Binding binding, P p) {
        JS.ObjectBindingDeclarations.Binding b = binding;
        b = b.withPrefix(visitSpace(b.getPrefix(), JsSpace.Location.BINDING_PREFIX, p));
        b = b.withMarkers(visitMarkers(b.getMarkers(), p));
        b = b.withPropertyName(visitAndCast(b.getPropertyName(), p));
        b = b.withName(visitAndCast(b.getName(), p));
        b = b.withDimensionsAfterName(
                ListUtils.map(b.getDimensionsAfterName(),
                        dim -> dim.withBefore(visitSpace(dim.getBefore(), Space.Location.DIMENSION_PREFIX, p))
                                .withElement(visitSpace(dim.getElement(), Space.Location.DIMENSION, p))
                )
        );
        if (b.getPadding().getInitializer() != null) {
            b = b.getPadding().withInitializer(visitLeftPadded(b.getPadding().getInitializer(),
                    JsLeftPadded.Location.BINDING_INITIALIZER, p));
        }
        b = b.withVariableType((JavaType.Variable) visitType(b.getVariableType(), p));
        return b;
    }

    public J visitDefaultType(JS.DefaultType defaultType, P p) {
        JS.DefaultType d = defaultType;
        d = d.withPrefix(visitSpace(d.getPrefix(), Space.Location.ASSIGNMENT_PREFIX, p));
        d = d.withMarkers(visitMarkers(d.getMarkers(), p));
        Expression temp = (Expression) visitExpression(d, p);
        if (!(temp instanceof JS.DefaultType)) {
            return temp;
        } else {
            d = (JS.DefaultType) temp;
        }
        d = d.withLeft(visitAndCast(d.getLeft(), p));
        d = d.withBeforeEquals(visitSpace(d.getBeforeEquals(), Space.Location.ASSIGNMENT_OPERATION_PREFIX, p));
        d = d.withRight(visitAndCast(d.getRight(), p));
        d = d.withType(visitType(d.getType(), p));
        return d;
    }

    public J visitDelete(JS.Delete delete, P p) {
        JS.Delete d = delete;
        d = d.withPrefix(visitSpace(d.getPrefix(), JsSpace.Location.DELETE_PREFIX, p));
        d = d.withMarkers(visitMarkers(d.getMarkers(), p));
        Expression temp = (Expression) visitExpression(d, p);
        if (!(temp instanceof JS.Delete)) {
            return temp;
        } else {
            d = (JS.Delete) temp;
        }
        d = d.withType(visitType(d.getType(), p));
        return d;
    }

    public J visitExport(JS.Export export, P p) {
        JS.Export e = export;
        e = e.withPrefix(visitSpace(e.getPrefix(), JsSpace.Location.EXPORT_PREFIX, p));
        e = e.withMarkers(visitMarkers(e.getMarkers(), p));
        Statement temp = (Statement) visitStatement(e, p);
        if (!(temp instanceof JS.Export)) {
            return temp;
        } else {
            e = (JS.Export) temp;
        }
        if (e.getPadding().getExports() != null) {
            e = e.getPadding().withExports(visitContainer(e.getPadding().getExports(), JsContainer.Location.EXPORT_ELEMENT, p));
        }
        if (e.getFrom() != null) {
            e = e.withFrom(visitSpace(e.getFrom(), JsSpace.Location.EXPORT_FROM_PREFIX, p));
        }
        e = e.withTarget(visitAndCast(e.getTarget(), p));
        if (e.getPadding().getInitializer() != null) {
            e = e.getPadding().withInitializer(visitLeftPadded(e.getPadding().getInitializer(),
                    JsLeftPadded.Location.EXPORT_INITIALIZER, p));
        }
        return e;
    }

    public J visitFunctionType(JS.FunctionType functionType, P p) {
        JS.FunctionType f = functionType;
        f = f.withPrefix(visitSpace(f.getPrefix(), JsSpace.Location.FUNCTION_TYPE_PREFIX, p));
        f = f.withMarkers(visitMarkers(f.getMarkers(), p));
        Expression temp = (Expression) visitExpression(f, p);
        if (!(temp instanceof JS.FunctionType)) {
            return temp;
        } else {
            f = (JS.FunctionType) temp;
        }
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

    public J visitJsImport(JS.JsImport jsImport, P p) {
        JS.JsImport i = jsImport;
        i = i.withPrefix(visitSpace(i.getPrefix(), JsSpace.Location.IMPORT_PREFIX, p));
        i = i.withMarkers(visitMarkers(i.getMarkers(), p));
        Statement temp = (Statement) visitStatement(i, p);
        if (!(temp instanceof JS.JsImport)) {
            return temp;
        } else {
            i = (JS.JsImport) temp;
        }
        visit(i.getName(), p);
        if (i.getPadding().getImports() != null) {
            i = i.getPadding().withImports(visitContainer(i.getPadding().getImports(), JsContainer.Location.IMPORT_ELEMENT, p));
        }
        if (i.getFrom() != null) {
            i = i.withFrom(visitSpace(i.getFrom(), JsSpace.Location.IMPORT_FROM_PREFIX, p));
        }
        i = i.withTarget(visitAndCast(i.getTarget(), p));
        if (i.getPadding().getInitializer() != null) {
            i = i.getPadding().withInitializer(visitLeftPadded(i.getPadding().getInitializer(),
                    JsLeftPadded.Location.IMPORT_INITIALIZER, p));
        }
        return i;
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

    public J visitObjectBindingDeclarations(JS.ObjectBindingDeclarations objectBindingDeclarations, P p) {
        JS.ObjectBindingDeclarations o = objectBindingDeclarations;
        o = o.withPrefix(visitSpace(o.getPrefix(), JsSpace.Location.OBJECT_BINDING_DECLARATIONS_PREFIX, p));
        o = o.withMarkers(visitMarkers(o.getMarkers(), p));
        Statement temp = (Statement) visitStatement(o, p);
        if (!(temp instanceof JS.ObjectBindingDeclarations)) {
            return temp;
        } else {
            o = (JS.ObjectBindingDeclarations) temp;
        }
        o = o.withLeadingAnnotations(ListUtils.map(o.getLeadingAnnotations(), a -> visitAndCast(a, p)));
        o = o.withModifiers(ListUtils.map(o.getModifiers(),
                mod -> mod.withPrefix(visitSpace(mod.getPrefix(), Space.Location.MODIFIER_PREFIX, p))));
        o = o.withModifiers(Objects.requireNonNull(ListUtils.map(o.getModifiers(), e -> visitAndCast(e, p))));
        o = o.withTypeExpression(visitAndCast(o.getTypeExpression(), p));
        o = o.withTypeExpression(o.getTypeExpression() == null ?
                null :
                visitTypeName(o.getTypeExpression(), p));
        o = o.getPadding().withBindings(visitContainer(o.getPadding().getBindings(), JsContainer.Location.BINDING_ELEMENT, p));
        if (o.getPadding().getInitializer() != null) {
            o = o.getPadding().withInitializer(visitLeftPadded(o.getPadding().getInitializer(),
                    JsLeftPadded.Location.BINDING_INITIALIZER, p));
        }
        return o;
    }

    public J visitTemplateExpression(JS.TemplateExpression templateExpression, P p) {
        JS.TemplateExpression s = templateExpression;
        s = s.withPrefix(visitSpace(s.getPrefix(), JsSpace.Location.TEMPLATE_EXPRESSION_PREFIX, p));
        s = s.withMarkers(visitMarkers(s.getMarkers(), p));
        Expression temp = (Expression) visitExpression(s, p);
        if (!(temp instanceof JS.TemplateExpression)) {
            return temp;
        } else {
            s = (JS.TemplateExpression) temp;
        }
        s = s.getPadding().withTag(visitRightPadded(s.getPadding().getTag(), JsRightPadded.Location.ALIAS_PROPERTY_NAME, p));
        s = s.withStrings(ListUtils.map(s.getStrings(), e -> visitAndCast(e, p)));
        s = s.withType(visitType(s.getType(), p));
        return s;
    }

    public J visitTemplateExpressionValue(JS.TemplateExpression.Value value, P p) {
        JS.TemplateExpression.Value s = value;
        s = s.withPrefix(visitSpace(s.getPrefix(), JsSpace.Location.TEMPLATE_EXPRESSION_VALUE_PREFIX, p));
        s = s.withMarkers(visitMarkers(s.getMarkers(), p));
        s = s.withTree(visit(s.getTree(), p));
        s = s.withAfter(visitSpace(s.getAfter(), JsSpace.Location.TEMPLATE_EXPRESSION_VALUE_SUFFIX, p));
        return s;
    }

    public J visitTuple(JS.Tuple tuple, P p) {
        JS.Tuple t = tuple;
        t = t.withPrefix(visitSpace(t.getPrefix(), JsSpace.Location.TUPLE_PREFIX, p));
        t = t.withMarkers(visitMarkers(t.getMarkers(), p));
        Expression temp = (Expression) visitExpression(t, p);
        if (!(temp instanceof JS.Tuple)) {
            return temp;
        } else {
            t = (JS.Tuple) temp;
        }
        t = t.getPadding().withElements(visitContainer(t.getPadding().getElements(), JsContainer.Location.TUPLE_ELEMENT, p));
        t = t.withType(visitType(t.getType(), p));
        return t;
    }

    public J visitTypeDeclaration(JS.TypeDeclaration typeDeclaration, P p) {
        JS.TypeDeclaration t = typeDeclaration;
        t = t.withPrefix(visitSpace(t.getPrefix(), JsSpace.Location.TYPE_DECLARATION_PREFIX, p));
        t = t.withMarkers(visitMarkers(t.getMarkers(), p));
        Statement temp = (Statement) visitStatement(t, p);
        if (!(temp instanceof JS.TypeDeclaration)) {
            return temp;
        } else {
            t = (JS.TypeDeclaration) temp;
        }
        t = t.withLeadingAnnotations(ListUtils.map(t.getLeadingAnnotations(), a -> visitAndCast(a, p)));
        t = t.withModifiers(ListUtils.map(t.getModifiers(),
                mod -> mod.withPrefix(visitSpace(mod.getPrefix(), Space.Location.MODIFIER_PREFIX, p))));
        t = t.withModifiers(Objects.requireNonNull(ListUtils.map(t.getModifiers(), e -> visitAndCast(e, p))));
        t = t.withName(visitAndCast(t.getName(), p));
        t = t.withTypeParameters(visitAndCast(t.getTypeParameters(), p));
        t = t.getPadding().withInitializer(visitLeftPadded(t.getPadding().getInitializer(),
                JsLeftPadded.Location.TYPE_DECLARATION_INITIALIZER, p));
        t = t.withType(visitType(t.getType(), p));
        return t;
    }

    public J visitTypeOperator(JS.TypeOperator typeOperator, P p) {
        JS.TypeOperator t = typeOperator;
        t = t.withPrefix(visitSpace(t.getPrefix(), JsSpace.Location.TYPE_OPERATOR_PREFIX, p));
        t = t.withMarkers(visitMarkers(t.getMarkers(), p));
        Expression temp = (Expression) visitExpression(t, p);
        if (!(temp instanceof JS.TypeOperator)) {
            return temp;
        } else {
            t = (JS.TypeOperator) temp;
        }
        t = t.getPadding().withExpression(visitLeftPadded(t.getPadding().getExpression(), JsLeftPadded.Location.TYPE_OPERATOR, p));
        return t;
    }

    public J visitUnary(JS.Unary unary, P p) {
        JS.Unary u = unary;
        u = u.withPrefix(visitSpace(u.getPrefix(), Space.Location.UNARY_PREFIX, p));
        u = u.withMarkers(visitMarkers(u.getMarkers(), p));
        Statement temp = (Statement) visitStatement(u, p);
        if (!(temp instanceof JS.Unary)) {
            return temp;
        } else {
            u = (JS.Unary) temp;
        }
        Expression temp2 = (Expression) visitExpression(u, p);
        if (!(temp2 instanceof JS.Unary)) {
            return temp2;
        } else {
            u = (JS.Unary) temp2;
        }
        u = u.getPadding().withOperator(visitLeftPadded(u.getPadding().getOperator(), JLeftPadded.Location.UNARY_OPERATOR, p));
        u = u.withExpression(visitAndCast(u.getExpression(), p));
        u = u.withType(visitType(u.getType(), p));
        return u;
    }

    public J visitUnion(JS.Union union, P p) {
        JS.Union u = union;
        u = u.withPrefix(visitSpace(u.getPrefix(), JsSpace.Location.UNION_PREFIX, p));
        u = u.withMarkers(visitMarkers(u.getMarkers(), p));
        Expression temp = (Expression) visitExpression(u, p);
        if (!(temp instanceof JS.Union)) {
            return temp;
        } else {
            u = (JS.Union) temp;
        }
        u = u.getPadding().withTypes(ListUtils.map(u.getPadding().getTypes(), t -> visitRightPadded(t, JsRightPadded.Location.UNION_TYPE, p)));
        u = u.withType(visitType(u.getType(), p));
        return u;
    }

    // TODO: remove me. Requires changes from rewrite-java.
    @Override
    public J visitAnnotatedType(J.AnnotatedType annotatedType, P p) {
        J.AnnotatedType a = annotatedType;
        a = a.withPrefix(visitSpace(a.getPrefix(), Space.Location.ANNOTATED_TYPE_PREFIX, p));
        a = a.withMarkers(visitMarkers(a.getMarkers(), p));
        Expression temp = (Expression) visitExpression(a, p);
        if (!(temp instanceof J.AnnotatedType)) {
            return temp;
        } else {
            a = (J.AnnotatedType) temp;
        }
        a = a.withAnnotations(ListUtils.map(a.getAnnotations(), e -> visitAndCast(e, p)));
        //noinspection DataFlowIssue
        a = a.withTypeExpression(visitAndCast(a.getTypeExpression(), p));
        a = a.withTypeExpression(visitTypeName(a.getTypeExpression(), p));
        return a;
    }

    @Override
    public J visitParameterizedType(J.ParameterizedType type, P p) {
        J.ParameterizedType pt = type;
        pt = pt.withPrefix(visitSpace(pt.getPrefix(), Space.Location.PARAMETERIZED_TYPE_PREFIX, p));
        pt = pt.withMarkers(visitMarkers(pt.getMarkers(), p));
        Expression temp = (Expression) visitExpression(pt, p);
        if (!(temp instanceof J.ParameterizedType)) {
            return temp;
        } else {
            pt = (J.ParameterizedType) temp;
        }
        //noinspection DataFlowIssue
        pt = pt.withClazz(visitAndCast(pt.getClazz(), p));
        if (pt.getPadding().getTypeParameters() != null) {
            pt = pt.getPadding().withTypeParameters(visitContainer(pt.getPadding().getTypeParameters(), JContainer.Location.TYPE_PARAMETERS, p));
        }
        pt = pt.getPadding().withTypeParameters(visitTypeNames(pt.getPadding().getTypeParameters(), p));
        pt = pt.withType(visitType(pt.getType(), p));
        return pt;
    }

    @Override
    public <N extends NameTree> N visitTypeName(N nameTree, P p) {
        return nameTree;
    }

    private <N extends NameTree> @Nullable JLeftPadded<N> visitTypeName(@Nullable JLeftPadded<N> nameTree, P p) {
        return nameTree == null ? null : nameTree.withElement(visitTypeName(nameTree.getElement(), p));
    }

    private <N extends NameTree> @Nullable JRightPadded<N> visitTypeName(@Nullable JRightPadded<N> nameTree, P p) {
        return nameTree == null ? null : nameTree.withElement(visitTypeName(nameTree.getElement(), p));
    }

    private <J2 extends J> @Nullable JContainer<J2> visitTypeNames(@Nullable JContainer<J2> nameTrees, P p) {
        if (nameTrees == null) {
            return null;
        }
        @SuppressWarnings("unchecked") List<JRightPadded<J2>> js = ListUtils.map(nameTrees.getPadding().getElements(),
                t -> t.getElement() instanceof NameTree ? (JRightPadded<J2>) visitTypeName((JRightPadded<NameTree>) t, p) : t);
        return js == nameTrees.getPadding().getElements() ? nameTrees : JContainer.build(nameTrees.getBefore(), js, Markers.EMPTY);
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
