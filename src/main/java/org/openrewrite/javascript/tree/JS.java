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
package org.openrewrite.javascript.tree;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.openrewrite.*;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.internal.TypesInUse;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.JavaScriptVisitor;
import org.openrewrite.javascript.internal.JavaScriptPrinter;
import org.openrewrite.marker.Markers;

import java.beans.Transient;
import java.lang.ref.SoftReference;
import java.lang.ref.WeakReference;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@SuppressWarnings("unused")
public interface JS extends J {

    @Override
    default <R extends Tree, P> R accept(TreeVisitor<R, P> v, P p) {
        //noinspection unchecked
        return (R) acceptJavaScript(v.adapt(JavaScriptVisitor.class), p);
    }

    @Override
    default <P> boolean isAcceptable(TreeVisitor<?, P> v, P p) {
        return v.isAdaptableTo(JavaScriptVisitor.class);
    }

    @Nullable
    default <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
        return v.defaultValue(this, p);
    }

    Space getPrefix();

    default List<Comment> getComments() {
        return getPrefix().getComments();
    }

    @ToString
    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @RequiredArgsConstructor
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    final class CompilationUnit implements JS, JavaSourceFile, SourceFile {
        @Nullable
        @NonFinal
        transient SoftReference<TypesInUse> typesInUse;

        @Nullable
        @NonFinal
        transient WeakReference<Padding> padding;

        @EqualsAndHashCode.Include
        @With
        @Getter
        UUID id;

        @With
        @Getter
        Space prefix;

        @With
        @Getter
        Markers markers;

        @With
        @Getter
        Path sourcePath;

        @With
        @Getter
        @Nullable
        FileAttributes fileAttributes;

        @Nullable // for backwards compatibility
        @With(AccessLevel.PRIVATE)
        String charsetName;

        @With
        @Getter
        boolean charsetBomMarked;

        @With
        @Getter
        @Nullable
        Checksum checksum;

        @Override
        public Charset getCharset() {
            return charsetName == null ? StandardCharsets.UTF_8 : Charset.forName(charsetName);
        }

        @SuppressWarnings("unchecked")
        @Override
        public SourceFile withCharset(Charset charset) {
            return withCharsetName(charset.name());
        }

        List<JRightPadded<Import>> imports;

        public List<Import> getImports() {
            return JRightPadded.getElements(imports);
        }

        public JS.CompilationUnit withImports(List<Import> imports) {
            return getPadding().withImports(JRightPadded.withElements(this.imports, imports));
        }

        List<JRightPadded<Statement>> statements;

        public List<Statement> getStatements() {
            return JRightPadded.getElements(statements);
        }

        public JS.CompilationUnit withStatements(List<Statement> statements) {
            return getPadding().withStatements(JRightPadded.withElements(this.statements, statements));
        }

        @With
        @Getter
        Space eof;

        @Transient
        public @NonNull List<ClassDeclaration> getClasses() {
            return statements.stream()
                    .map(JRightPadded::getElement)
                    .filter(J.ClassDeclaration.class::isInstance)
                    .map(J.ClassDeclaration.class::cast)
                    .collect(Collectors.toList());
        }

        @Override
        @NonNull
        public JavaSourceFile withClasses(List<ClassDeclaration> classes) {
            // FIXME unsupported
            return this;
        }

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            return v.visitJavaSourceFile(this, p);
        }

        @Override
        public <P> TreeVisitor<?, PrintOutputCapture<P>> printer(Cursor cursor) {
            return new JavaScriptPrinter<>();
        }

        @Transient
        @NonNull
        public TypesInUse getTypesInUse() {
            TypesInUse cache;
            if (this.typesInUse == null) {
                cache = TypesInUse.build(this);
                this.typesInUse = new SoftReference<>(cache);
            } else {
                cache = this.typesInUse.get();
                if (cache == null || cache.getCu() != this) {
                    cache = TypesInUse.build(this);
                    this.typesInUse = new SoftReference<>(cache);
                }
            }
            return cache;
        }

        @Override
        public @Nullable Package getPackageDeclaration() {
            return null;
        }

        @Override
        public JavaSourceFile withPackageDeclaration(Package pkg) {
            throw new IllegalStateException("JavaScript does not support package declarations");
        }

        public Padding getPadding() {
            Padding p;
            if (this.padding == null) {
                p = new Padding(this);
                this.padding = new WeakReference<>(p);
            } else {
                p = this.padding.get();
                if (p == null || p.t != this) {
                    p = new Padding(this);
                    this.padding = new WeakReference<>(p);
                }
            }
            return p;
        }

        @RequiredArgsConstructor
        public static class Padding implements JavaSourceFile.Padding {
            private final JS.CompilationUnit t;

            @Override
            public List<JRightPadded<Import>> getImports() {
                return t.imports;
            }

            @Override
            public JS.CompilationUnit withImports(List<JRightPadded<Import>> imports) {
                return t.imports == imports ? t : new JS.CompilationUnit(t.id, t.prefix, t.markers, t.sourcePath, t.fileAttributes, t.charsetName, t.charsetBomMarked, null,
                        imports, t.statements, t.eof);
            }

            public List<JRightPadded<Statement>> getStatements() {
                return t.statements;
            }

            public JS.CompilationUnit withStatements(List<JRightPadded<Statement>> statements) {
                return t.statements == statements ? t : new JS.CompilationUnit(t.id, t.prefix, t.markers, t.sourcePath,
                        t.fileAttributes, t.charsetName, t.charsetBomMarked, t.checksum, t.imports, statements, t.eof);
            }
        }
    }

    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @RequiredArgsConstructor
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @Data
    final class Alias implements JS, Expression {

        @Nullable
        @NonFinal
        transient WeakReference<JS.Alias.Padding> padding;

        @With
        @EqualsAndHashCode.Include
        UUID id;

        @With
        Space prefix;

        @With
        Markers markers;

        JRightPadded<J.Identifier> propertyName;

        @With
        J.Identifier alias;

        public J.Identifier getPropertyName() {
            return propertyName.getElement();
        }

        public JS.Alias withPropertyName(J.Identifier propertyName) {
            return getPadding().withPropertyName(this.propertyName.withElement(propertyName));
        }

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            return v.visitAlias(this, p);
        }

        @Override
        public @Nullable JavaType getType() {
            return propertyName.getElement().getType();
        }

        @Override
        public <T extends J> T withType(@Nullable JavaType type) {
            //noinspection unchecked
            return (T) withPropertyName(propertyName.getElement().withType(type));
        }

        @Transient
        @Override
        public CoordinateBuilder.Expression getCoordinates() {
            return new CoordinateBuilder.Expression(this);
        }

        public JS.Alias.Padding getPadding() {
            JS.Alias.Padding p;
            if (this.padding == null) {
                p = new JS.Alias.Padding(this);
                this.padding = new WeakReference<>(p);
            } else {
                p = this.padding.get();
                if (p == null || p.t != this) {
                    p = new JS.Alias.Padding(this);
                    this.padding = new WeakReference<>(p);
                }
            }
            return p;
        }

        @RequiredArgsConstructor
        public static class Padding {
            private final JS.Alias t;

            public JRightPadded<J.Identifier> getPropertyName() {
                return t.propertyName;
            }

            public JS.Alias withPropertyName(JRightPadded<J.Identifier> propertyName) {
                return t.propertyName == propertyName ? t : new JS.Alias(t.id, t.prefix, t.markers, propertyName, t.alias);
            }
        }
    }

    /**
     * A JavaScript `=>` is similar to a Java lambda, but additionally contains annotations, modifiers, type arguments.
     * The ArrowFunction prevents J.Lambda recipes from transforming the LST because an ArrowFunction
     * may not be transformed in the same way as a J.Lambda.
     */
    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @Data
    final class ArrowFunction implements JS, Statement, Expression, TypedTree {

        @With
        @EqualsAndHashCode.Include
        UUID id;

        @With
        Space prefix;

        @With
        Markers markers;

        @With
        List<J.Annotation> leadingAnnotations;

        @With
        List<J.Modifier> modifiers;

        @With
        Lambda.Parameters parameters;

        @With
        Space arrow;

        @With
        J body;

        @With
        @Nullable
        JavaType type;

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            return v.visitArrowFunction(this, p);
        }

        @Override
        @Transient
        public CoordinateBuilder.Statement getCoordinates() {
            return new CoordinateBuilder.Statement(this);
        }
    }

    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @Data
    @With
    final class DefaultType implements JS, Expression, TypedTree, NameTree {

        @EqualsAndHashCode.Include
        UUID id;

        Space prefix;
        Markers markers;
        Expression left;
        Space beforeEquals;
        Expression right;

        @Nullable
        JavaType type;

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            return v.visitDefaultType(this, p);
        }

        @Transient
        @Override
        public CoordinateBuilder.Expression getCoordinates() {
            return new CoordinateBuilder.Expression(this);
        }
    }

    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @RequiredArgsConstructor
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    class Export implements JS, Statement {

        @Nullable
        @NonFinal
        transient WeakReference<Export.Padding> padding;

        @Getter
        @With
        @EqualsAndHashCode.Include
        UUID id;

        @Getter
        @With
        Space prefix;

        @Getter
        @With
        Markers markers;

        JContainer<Expression> exports;

        public List<Expression> getExports() {
            return exports.getElements();
        }

        public Export withExports(List<Expression> exports) {
            return getPadding().withExports(JContainer.withElements(this.exports, exports));
        }

        @Getter
        @With
        @Nullable
        Space from;

        @Getter
        @With
        @Nullable
        J.Literal target;

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            return v.visitExport(this, p);
        }

        @Override
        public CoordinateBuilder.Statement getCoordinates() {
            return new CoordinateBuilder.Statement(this);
        }

        public Export.Padding getPadding() {
            Export.Padding p;
            if (this.padding == null) {
                p = new Export.Padding(this);
                this.padding = new WeakReference<>(p);
            } else {
                p = this.padding.get();
                if (p == null || p.t != this) {
                    p = new Export.Padding(this);
                    this.padding = new WeakReference<>(p);
                }
            }
            return p;
        }

        @RequiredArgsConstructor
        public static class Padding {
            private final Export t;

            public JContainer<Expression> getExports() {
                return t.exports;
            }

            public Export withExports(JContainer<Expression> exports) {
                return t.exports == exports ? t : new Export(t.id, t.prefix, t.markers, exports, t.from, t.target);
            }
        }
    }

    @SuppressWarnings("unchecked")
    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @AllArgsConstructor
    final class ExpressionStatement implements JS, Expression, Statement {

        @With
        @Getter
        UUID id;

        @With
        @Getter
        Expression expression;

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            J j = v.visit(getExpression(), p);
            if (j instanceof ExpressionStatement) {
                return j;
            } else if (j instanceof Expression) {
                return withExpression((Expression) j);
            }
            return j;
        }

        @Override
        public <J2 extends J> J2 withPrefix(Space space) {
            return (J2) withExpression(expression.withPrefix(space));
        }

        @Override
        public Space getPrefix() {
            return expression.getPrefix();
        }

        @Override
        public <J2 extends Tree> J2 withMarkers(Markers markers) {
            return (J2) withExpression(expression.withMarkers(markers));
        }

        @Override
        public Markers getMarkers() {
            return expression.getMarkers();
        }

        @Override
        public @Nullable JavaType getType() {
            return expression.getType();
        }

        @Override
        public <T extends J> T withType(@Nullable JavaType type) {
            return (T) withExpression(expression.withType(type));
        }

        @Transient
        @Override
        public CoordinateBuilder.Statement getCoordinates() {
            return new CoordinateBuilder.Statement(this);
        }
    }

    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @RequiredArgsConstructor
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    class FunctionType implements JS, Expression, TypeTree {

        @Nullable
        @NonFinal
        transient WeakReference<FunctionType.Padding> padding;

        @Getter
        @With
        @EqualsAndHashCode.Include
        UUID id;

        @Getter
        @With
        Space prefix;

        @Getter
        @With
        Markers markers;

        JContainer<Statement> parameters;

        public List<Statement> getParameters() {
            return parameters.getElements();
        }

        public FunctionType withParameters(List<Statement> parameters) {
            return getPadding().withParameters(JContainer.withElements(this.parameters, parameters));
        }

        @Getter
        @With
        Space arrow;

        @Getter
        @With
        Expression returnType;

        @Getter
        @With
        @Nullable
        JavaType type;

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            return v.visitFunctionType(this, p);
        }

        @Override
        public CoordinateBuilder.Expression getCoordinates() {
            return new CoordinateBuilder.Expression(this);
        }

        public FunctionType.Padding getPadding() {
            FunctionType.Padding p;
            if (this.padding == null) {
                p = new FunctionType.Padding(this);
                this.padding = new WeakReference<>(p);
            } else {
                p = this.padding.get();
                if (p == null || p.t != this) {
                    p = new FunctionType.Padding(this);
                    this.padding = new WeakReference<>(p);
                }
            }
            return p;
        }

        @RequiredArgsConstructor
        public static class Padding {
            private final FunctionType t;

            public JContainer<Statement> getParameters() {
                return t.parameters;
            }

            public FunctionType withParameters(JContainer<Statement> parameters) {
                return t.parameters == parameters ? t : new FunctionType(t.id, t.prefix, t.markers, parameters, t.arrow, t.returnType, t.type);
            }
        }
    }

    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @RequiredArgsConstructor
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @Data
    final class JsBinary implements JS, Expression, TypedTree {

        @Nullable
        @NonFinal
        transient WeakReference<JS.JsBinary.Padding> padding;

        @With
        @EqualsAndHashCode.Include
        UUID id;

        @With
        Space prefix;

        @With
        Markers markers;

        @With
        Expression left;

        JLeftPadded<JS.JsBinary.Type> operator;

        public JS.JsBinary.Type getOperator() {
            return operator.getElement();
        }

        public JS.JsBinary withOperator(JS.JsBinary.Type operator) {
            return getPadding().withOperator(this.operator.withElement(operator));
        }

        @With
        Expression right;

        @With
        @Nullable
        JavaType type;

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            return v.visitJsBinary(this, p);
        }

        @Transient
        @Override
        public CoordinateBuilder.Expression getCoordinates() {
            return new CoordinateBuilder.Expression(this);
        }

        public enum Type {
            IdentityEquals,
            IdentityNotEquals
        }

        public JS.JsBinary.Padding getPadding() {
            JS.JsBinary.Padding p;
            if (this.padding == null) {
                p = new JS.JsBinary.Padding(this);
                this.padding = new WeakReference<>(p);
            } else {
                p = this.padding.get();
                if (p == null || p.t != this) {
                    p = new JS.JsBinary.Padding(this);
                    this.padding = new WeakReference<>(p);
                }
            }
            return p;
        }

        @RequiredArgsConstructor
        public static class Padding {
            private final JS.JsBinary t;

            public JLeftPadded<JS.JsBinary.Type> getOperator() {
                return t.operator;
            }

            public JS.JsBinary withOperator(JLeftPadded<JS.JsBinary.Type> operator) {
                return t.operator == operator ? t : new JS.JsBinary(t.id, t.prefix, t.markers, t.left, operator, t.right, t.type);
            }
        }
    }

    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @RequiredArgsConstructor
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @Data
    final class JsOperator implements JS, Expression, TypedTree, NameTree {

        @Nullable
        @NonFinal
        transient WeakReference<JS.JsOperator.Padding> padding;

        @With
        @EqualsAndHashCode.Include
        UUID id;

        @With
        Space prefix;

        @With
        Markers markers;

        @Nullable
        @With
        Expression left;

        JLeftPadded<JS.JsOperator.Type> operator;

        public JS.JsOperator.Type getOperator() {
            return operator.getElement();
        }

        public JS.JsOperator withOperator(JS.JsOperator.Type operator) {
            return getPadding().withOperator(this.operator.withElement(operator));
        }

        @With
        Expression right;

        @With
        @Nullable
        JavaType type;

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            return v.visitJsOperator(this, p);
        }

        @Transient
        @Override
        public CoordinateBuilder.Expression getCoordinates() {
            return new CoordinateBuilder.Expression(this);
        }

        public enum Type {
            Await,
            Delete,
            In,
            TypeOf
        }

        public JS.JsOperator.Padding getPadding() {
            JS.JsOperator.Padding p;
            if (this.padding == null) {
                p = new JS.JsOperator.Padding(this);
                this.padding = new WeakReference<>(p);
            } else {
                p = this.padding.get();
                if (p == null || p.t != this) {
                    p = new JS.JsOperator.Padding(this);
                    this.padding = new WeakReference<>(p);
                }
            }
            return p;
        }

        @RequiredArgsConstructor
        public static class Padding {
            private final JS.JsOperator t;

            public JLeftPadded<JS.JsOperator.Type> getOperator() {
                return t.operator;
            }

            public JS.JsOperator withOperator(JLeftPadded<JS.JsOperator.Type> operator) {
                return t.operator == operator ? t : new JS.JsOperator(t.id, t.prefix, t.markers, t.left, operator, t.right, t.type);
            }
        }
    }

    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @RequiredArgsConstructor
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    final class ObjectBindingDeclarations implements JS, Statement, TypedTree {

        @Nullable
        @NonFinal
        transient WeakReference<ObjectBindingDeclarations.Padding> padding;

        @With
        @EqualsAndHashCode.Include
        @Getter
        UUID id;

        @With
        @Getter
        Space prefix;

        @With
        @Getter
        Markers markers;

        @With
        @Getter
        List<J.Annotation> leadingAnnotations;

        @With
        @Getter
        List<J.Modifier> modifiers;

        @With
        @Nullable
        @Getter
        TypeTree typeExpression;

        JContainer<ObjectBindingDeclarations.Binding> bindings;

        public List<ObjectBindingDeclarations.Binding> getBindings() {
            return bindings.getElements();
        }

        public ObjectBindingDeclarations withBindings(List<ObjectBindingDeclarations.Binding> bindings) {
            return getPadding().withBindings(JContainer.withElements(this.bindings, bindings));
        }

        @Nullable
        JLeftPadded<Expression> initializer;

        @Nullable
        public Expression getInitializer() {
            return initializer == null ? null : initializer.getElement();
        }

        public ObjectBindingDeclarations withInitializer(@Nullable Expression initializer) {
            return getPadding().withInitializer(JLeftPadded.withElement(this.initializer, initializer));
        }

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            return v.visitObjectBindingDeclarations(this, p);
        }

        @Transient
        @Override
        public CoordinateBuilder.Statement getCoordinates() {
            return new CoordinateBuilder.Statement(this);
        }

        // gather annotations from everywhere they may occur
        public List<J.Annotation> getAllAnnotations() {
            List<Annotation> allAnnotations = new ArrayList<>(leadingAnnotations);
            for (J.Modifier modifier : modifiers) {
                allAnnotations.addAll(modifier.getAnnotations());
            }
            if (typeExpression != null && typeExpression instanceof J.AnnotatedType) {
                allAnnotations.addAll(((J.AnnotatedType) typeExpression).getAnnotations());
            }
            return allAnnotations;
        }

        @Nullable
        public JavaType.FullyQualified getTypeAsFullyQualified() {
            return typeExpression == null ? null : TypeUtils.asFullyQualified(typeExpression.getType());
        }

        @Nullable
        @Override
        public JavaType getType() {
            return typeExpression == null ? null : typeExpression.getType();
        }

        @SuppressWarnings("unchecked")
        @Override
        public ObjectBindingDeclarations withType(@Nullable JavaType type) {
            return typeExpression == null ? this :
                    withTypeExpression(typeExpression.withType(type));
        }

        @SuppressWarnings("unchecked")
        @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
        @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
        @AllArgsConstructor
        public static final class Binding implements JS, NameTree {

            @With
            @EqualsAndHashCode.Include
            @Getter
            UUID id;

            @With
            @Getter
            Space prefix;

            @With
            @Getter
            Markers markers;

            @With
            @Getter
            Identifier name;

            @With
            @Getter
            List<JLeftPadded<Space>> dimensionsAfterName;

            @With
            @Nullable
            @Getter
            Space afterVararg;

            @With
            @Nullable
            @Getter
            JavaType.Variable variableType;

            public JavaType getType() {
                return variableType != null ? variableType.getType() : null;
            }

            @SuppressWarnings({"unchecked", "DataFlowIssue"})
            @Override
            public ObjectBindingDeclarations.Binding withType(@Nullable JavaType type) {
                return variableType != null ? withVariableType(variableType.withType(type)) : this;
            }

            public String getSimpleName() {
                return name.getSimpleName();
            }

            @Override
            public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
                return v.visitBinding(this, p);
            }
        }

        public boolean hasModifier(Modifier.Type modifier) {
            return Modifier.hasModifier(getModifiers(), modifier);
        }

        public ObjectBindingDeclarations.Padding getPadding() {
            ObjectBindingDeclarations.Padding p;
            if (this.padding == null) {
                p = new ObjectBindingDeclarations.Padding(this);
                this.padding = new WeakReference<>(p);
            } else {
                p = this.padding.get();
                if (p == null || p.t != this) {
                    p = new ObjectBindingDeclarations.Padding(this);
                    this.padding = new WeakReference<>(p);
                }
            }
            return p;
        }

        @RequiredArgsConstructor
        public static class Padding {
            private final ObjectBindingDeclarations t;

            public JContainer<ObjectBindingDeclarations.Binding> getBindings() {
                return t.bindings;
            }

            public ObjectBindingDeclarations withBindings(JContainer<ObjectBindingDeclarations.Binding> bindings) {
                return t.bindings == bindings ? t : new ObjectBindingDeclarations(t.id, t.prefix, t.markers, t.leadingAnnotations, t.modifiers, t.typeExpression, bindings, t.initializer);
            }

            @Nullable
            public JLeftPadded<Expression> getInitializer() {
                return t.initializer;
            }

            public ObjectBindingDeclarations withInitializer(@Nullable JLeftPadded<Expression> initializer) {
                return t.initializer == initializer ? t : new ObjectBindingDeclarations(t.id, t.prefix, t.markers, t.leadingAnnotations, t.modifiers, t.typeExpression, t.bindings, initializer);
            }
        }
    }

    @SuppressWarnings("unchecked")
    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @AllArgsConstructor
    final class StatementExpression implements JS, Expression, Statement {

        @With
        @Getter
        UUID id;

        @With
        @Getter
        Statement statement;

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            J j = v.visit(getStatement(), p);
            if (j instanceof StatementExpression) {
                return j;
            } else if (j instanceof Statement) {
                return withStatement((Statement) j);
            }
            return j;
        }

        @Override
        public <J2 extends J> J2 withPrefix(Space space) {
            return (J2) withStatement(statement.withPrefix(space));
        }

        @Override
        public Space getPrefix() {
            return statement.getPrefix();
        }

        @Override
        public <J2 extends Tree> J2 withMarkers(Markers markers) {
            return (J2) withStatement(statement.withMarkers(markers));
        }

        @Override
        public Markers getMarkers() {
            return statement.getMarkers();
        }

        @Override
        public @Nullable JavaType getType() {
            return null;
        }

        @Override
        public <T extends J> T withType(@Nullable JavaType type) {
            throw new UnsupportedOperationException("StatementExpression cannot have a type");
        }

        @Transient
        @Override
        public CoordinateBuilder.Statement getCoordinates() {
            return new CoordinateBuilder.Statement(this);
        }
    }

    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @RequiredArgsConstructor
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @Data
    final class TypeOperator implements JS, Expression, TypedTree, NameTree {

        @Nullable
        @NonFinal
        transient WeakReference<JS.TypeOperator.Padding> padding;

        @With
        @EqualsAndHashCode.Include
        UUID id;

        @With
        Space prefix;

        @With
        Markers markers;

        @With
        JS.TypeOperator.Type operator;

        JLeftPadded<Expression> expression;

        @Nullable
        JavaType type;

        public Expression getExpression() {
            return expression.getElement();
        }

        public JS.TypeOperator withExpression(Expression expression) {
            return getPadding().withExpression(this.expression.withElement(expression));
        }

        @Override
        public @Nullable JavaType getType() {
            return expression.getElement().getType();
        }

        @Override
        public <T extends J> T withType(@Nullable JavaType type) {
            //noinspection unchecked
            return (T) getPadding().withExpression(this.expression.withElement(this.expression.getElement().withType(type)));
        }

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            return v.visitTypeOperator(this, p);
        }

        @Transient
        @Override
        public CoordinateBuilder.Expression getCoordinates() {
            return new CoordinateBuilder.Expression(this);
        }

        public enum Type {
            ReadOnly
        }

        public JS.TypeOperator.Padding getPadding() {
            JS.TypeOperator.Padding p;
            if (this.padding == null) {
                p = new JS.TypeOperator.Padding(this);
                this.padding = new WeakReference<>(p);
            } else {
                p = this.padding.get();
                if (p == null || p.t != this) {
                    p = new JS.TypeOperator.Padding(this);
                    this.padding = new WeakReference<>(p);
                }
            }
            return p;
        }

        @RequiredArgsConstructor
        public static class Padding {
            private final JS.TypeOperator t;

            public JLeftPadded<Expression> getExpression() {
                return t.expression;
            }

            public JS.TypeOperator withExpression(JLeftPadded<Expression> expression) {
                return t.expression == expression ? t : new JS.TypeOperator(t.id, t.prefix, t.markers, t.operator, expression, t.type);
            }
        }
    }

    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @RequiredArgsConstructor
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @Data
    final class Union implements JS, Expression, TypeTree {

        @Nullable
        @NonFinal
        transient WeakReference<JS.Union.Padding> padding;

        @With
        @EqualsAndHashCode.Include
        UUID id;

        @With
        Space prefix;

        @With
        Markers markers;

        List<JRightPadded<Expression>> types;

        public List<Expression> getTypes() {
            return JRightPadded.getElements(types);
        }

        public JS.Union withTypes(List<Expression> types) {
            return getPadding().withTypes(JRightPadded.withElements(this.types, types));
        }

        @With
        @Nullable
        JavaType type;

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            return v.visitUnion(this, p);
        }

        @Transient
        @Override
        public CoordinateBuilder.Expression getCoordinates() {
            return new CoordinateBuilder.Expression(this);
        }

        public JS.Union.Padding getPadding() {
            JS.Union.Padding p;
            if (this.padding == null) {
                p = new JS.Union.Padding(this);
                this.padding = new WeakReference<>(p);
            } else {
                p = this.padding.get();
                if (p == null || p.t != this) {
                    p = new JS.Union.Padding(this);
                    this.padding = new WeakReference<>(p);
                }
            }
            return p;
        }

        @RequiredArgsConstructor
        public static class Padding {
            private final JS.Union t;

            public List<JRightPadded<Expression>> getTypes() {
                return t.types;
            }

            public JS.Union withTypes(List<JRightPadded<Expression>> types) {
                return t.types == types ? t : new JS.Union(t.id, t.prefix, t.markers, types, t.type);
            }
        }
    }

    @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
    @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
    @AllArgsConstructor
    @Data
    @With
    final class UnknownElement implements JS, Statement, Expression, TypeTree, TypedTree, NameTree {

        @EqualsAndHashCode.Include
        UUID id;

        Space prefix;
        Markers markers;
        Source source;

        @Override
        public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
            return v.visitUnknownElement(this, p);
        }

        @Override
        public @Nullable JavaType getType() {
            return null;
        }

        @Override
        public <T extends J> T withType(@Nullable JavaType type) {
            //noinspection unchecked
            return (T) this;
        }

        @Override
        public CoordinateBuilder.Statement getCoordinates() {
            return new CoordinateBuilder.Statement(this);
        }

        /**
         * This class only exists to clean up the printed results from `SearchResult` markers.
         * Without the marker the comments will print before the LST prefix.
         */
        @FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
        @EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
        @AllArgsConstructor
        @Data
        @With
        public static class Source implements JS {

            @EqualsAndHashCode.Include
            UUID id;

            Space prefix;
            Markers markers;
            String text;

            @Override
            public <P> J acceptJavaScript(JavaScriptVisitor<P> v, P p) {
                return v.visitUnknownElementSource(this, p);
            }
        }
    }
}
