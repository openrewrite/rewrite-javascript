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

import org.jspecify.annotations.Nullable;
import org.openrewrite.Cursor;
import org.openrewrite.PrintOutputCapture;
import org.openrewrite.Tree;
import org.openrewrite.java.JavaPrinter;
import org.openrewrite.java.marker.OmitParentheses;
import org.openrewrite.java.marker.Semicolon;
import org.openrewrite.java.marker.TrailingComma;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.JavaScriptVisitor;
import org.openrewrite.javascript.markers.*;
import org.openrewrite.javascript.tree.*;
import org.openrewrite.marker.Marker;
import org.openrewrite.marker.Markers;

import java.util.List;
import java.util.function.UnaryOperator;

@SuppressWarnings("SameParameterValue")
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

    @Override
    public J visitCompilationUnit(JS.CompilationUnit cu, PrintOutputCapture<P> p) {
        beforeSyntax(cu, Space.Location.COMPILATION_UNIT_PREFIX, p);

        visitRightPadded(cu.getPadding().getStatements(), JRightPadded.Location.LANGUAGE_EXTENSION, "", p);

        visitSpace(cu.getEof(), Space.Location.COMPILATION_UNIT_EOF, p);
        afterSyntax(cu, p);
        return cu;
    }

    @Override
    public J visitAlias(JS.Alias alias, PrintOutputCapture<P> p) {
        beforeSyntax(alias, JsSpace.Location.ALIAS_PREFIX, p);
        visitRightPadded(alias.getPadding().getPropertyName(), JsRightPadded.Location.ALIAS_PROPERTY_NAME, p);
        p.append("as");
        visit(alias.getAlias(), p);
        afterSyntax(alias, p);
        return alias;
    }

    @Override
    public J visitArrowFunction(JS.ArrowFunction arrowFunction, PrintOutputCapture<P> p) {
        beforeSyntax(arrowFunction, JsSpace.Location.ARROW_FUNCTION_PREFIX, p);
        visit(arrowFunction.getLeadingAnnotations(), p);
        arrowFunction.getModifiers().forEach(m -> delegate.visitModifier(m, p));
        if (arrowFunction.getParameters().isParenthesized()) {
            visitSpace(arrowFunction.getParameters().getPrefix(), Space.Location.LAMBDA_PARAMETERS_PREFIX, p);
            p.append('(');
            visitRightPadded(arrowFunction.getParameters().getPadding().getParams(), JRightPadded.Location.LAMBDA_PARAM, ",", p);
            p.append(')');
        } else {
            visitRightPadded(arrowFunction.getParameters().getPadding().getParams(), JRightPadded.Location.LAMBDA_PARAM, ",", p);
        }

        if (arrowFunction.getReturnTypeExpression() != null) {
            TypeReferencePrefix typeReferencePrefix = arrowFunction.getMarkers().findFirst(TypeReferencePrefix.class).orElse(null);
            if (typeReferencePrefix != null) {
                visitSpace(typeReferencePrefix.getPrefix(), Space.Location.LANGUAGE_EXTENSION, p);
                p.append(":");
            }
            visit(arrowFunction.getReturnTypeExpression(), p);
        }

        visitSpace(arrowFunction.getArrow(), Space.Location.LAMBDA_ARROW_PREFIX, p);
        p.append("=>");
        visit(arrowFunction.getBody(), p);
        afterSyntax(arrowFunction, p);
        return arrowFunction;
    }

    @Override
    public J visitBinding(JS.ObjectBindingDeclarations.Binding binding, PrintOutputCapture<P> p) {
        beforeSyntax(binding, JsSpace.Location.BINDING_PREFIX, p);
        if (binding.getAfterVararg() != null) {
            p.append("...");
            visitSpace(binding.getAfterVararg(), Space.Location.VARARGS, p);
        }
        if (binding.getPropertyName() != null) {
            visitRightPadded(binding.getPadding().getPropertyName(), JsRightPadded.Location.BINDING_PROPERTY_NAME_SUFFIX, p);
            p.append(":");
        }
        visit(binding.getName(), p);
        for (JLeftPadded<Space> dimension : binding.getDimensionsAfterName()) {
            visitSpace(dimension.getBefore(), Space.Location.DIMENSION_PREFIX, p);
            p.append('[');
            visitSpace(dimension.getElement(), Space.Location.DIMENSION, p);
            p.append(']');
        }
        visitLeftPadded("=", binding.getPadding().getInitializer(), JsLeftPadded.Location.BINDING_INITIALIZER, p);
        afterSyntax(binding, p);
        return binding;
    }

    @Override
    public J visitDefaultType(JS.DefaultType defaultType, PrintOutputCapture<P> p) {
        beforeSyntax(defaultType, JsSpace.Location.DEFAULT_TYPE_PREFIX, p);
        visit(defaultType.getLeft(), p);
        visitSpace(defaultType.getBeforeEquals(), Space.Location.ASSIGNMENT_OPERATION_PREFIX, p);
        p.append("=");
        visit(defaultType.getRight(), p);
        afterSyntax(defaultType, p);
        return defaultType;
    }

    @Override
    public J visitDelete(JS.Delete delete, PrintOutputCapture<P> p) {
        beforeSyntax(delete, JsSpace.Location.DELETE_PREFIX, p);
        p.append("delete");
        visit(delete.getExpression(), p);
        afterSyntax(delete, p);
        return delete;
    }

    @Override
    public J visitExport(JS.Export export, PrintOutputCapture<P> p) {
        beforeSyntax(export, JsSpace.Location.EXPORT_PREFIX, p);
        p.append("export");

        boolean printBrackets = export.getPadding().getExports() != null && export.getPadding().getExports().getMarkers().findFirst(Braces.class).isPresent();
        visitContainer(printBrackets ? "{" : "", export.getPadding().getExports(), JsContainer.Location.FUNCTION_TYPE_PARAMETER, ",", printBrackets ? "}" : "", p);

        if (export.getFrom() != null) {
            visitSpace(export.getFrom(), Space.Location.LANGUAGE_EXTENSION, p);
            p.append("from");
        }

        visit(export.getTarget(), p);
        visitLeftPadded("default", export.getPadding().getInitializer(), JsLeftPadded.Location.IMPORT_INITIALIZER, p);
        afterSyntax(export, p);
        return export;
    }

    @Override
    public J visitFunctionType(JS.FunctionType functionType, PrintOutputCapture<P> p) {
        beforeSyntax(functionType, JsSpace.Location.FUNCTION_TYPE_PREFIX, p);
        visitContainer("(", functionType.getPadding().getParameters(), JsContainer.Location.FUNCTION_TYPE_PARAMETER, ",", ")", p);
        visitSpace(functionType.getArrow(), JsSpace.Location.FUNCTION_TYPE_ARROW_PREFIX, p);
        p.append("=>");
        visit(functionType.getReturnType(), p);
        afterSyntax(functionType, p);
        return functionType;
    }

    @Override
    public J visitJsImport(JS.JsImport jsImport, PrintOutputCapture<P> p) {
        beforeSyntax(jsImport, JsSpace.Location.EXPORT_PREFIX, p);
        p.append("import");

        visitRightPadded(jsImport.getPadding().getName(), JsRightPadded.Location.IMPORT_NAME_SUFFIX, p);

        if (jsImport.getName() != null && jsImport.getImports() != null) {
            p.append(",");
        }

        boolean printBrackets = jsImport.getPadding().getImports() != null && jsImport.getPadding().getImports().getMarkers().findFirst(Braces.class).isPresent();
        visitContainer(printBrackets ? "{" : "", jsImport.getPadding().getImports(), JsContainer.Location.FUNCTION_TYPE_PARAMETER, ",", printBrackets ? "}" : "", p);

        if (jsImport.getFrom() != null) {
            visitSpace(jsImport.getFrom(), Space.Location.LANGUAGE_EXTENSION, p);
            p.append("from");
            visit(jsImport.getTarget(), p);
        }

        visitLeftPadded("=", jsImport.getPadding().getInitializer(), JsLeftPadded.Location.IMPORT_INITIALIZER, p);
        afterSyntax(jsImport, p);
        return jsImport;
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
            case In:
                keyword = "in";
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
            case Await:
                keyword = "await";
                break;
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
    public J visitObjectBindingDeclarations(JS.ObjectBindingDeclarations objectBindingDeclarations, PrintOutputCapture<P> p) {
        beforeSyntax(objectBindingDeclarations, Space.Location.VARIABLE_DECLARATIONS_PREFIX, p);
        visit(objectBindingDeclarations.getLeadingAnnotations(), p);
        objectBindingDeclarations.getModifiers().forEach(m -> delegate.visitModifier(m, p));

        visit(objectBindingDeclarations.getTypeExpression(), p);
        visitContainer("{", objectBindingDeclarations.getPadding().getBindings(), JsContainer.Location.BINDING_ELEMENT, ",", "}", p);
        visitLeftPadded("=", objectBindingDeclarations.getPadding().getInitializer(), JsLeftPadded.Location.BINDING_INITIALIZER, p);
        afterSyntax(objectBindingDeclarations, p);
        return objectBindingDeclarations;
    }

    @Override
    public J visitTemplateExpression(JS.TemplateExpression templateExpression, PrintOutputCapture<P> p) {
        beforeSyntax(templateExpression, JsSpace.Location.TEMPLATE_EXPRESSION_PREFIX, p);
        String delimiter = templateExpression.getDelimiter();
        visitRightPadded(templateExpression.getPadding().getTag(), JsRightPadded.Location.TAG, p);
        PostFixOperator postFixOperator = templateExpression.getMarkers().findFirst(PostFixOperator.class).orElse(null);
        if (postFixOperator != null) {
            visitSpace(postFixOperator.getPrefix(), Space.Location.LAMBDA_PARAMETERS_PREFIX, p);
            p.append(postFixOperator.getOperator().getValue());
        }
        p.append(delimiter);
        visit(templateExpression.getStrings(), p);
        p.append(delimiter);
        afterSyntax(templateExpression, p);
        return templateExpression;
    }

    @Override
    public J visitTemplateExpressionValue(JS.TemplateExpression.Value value, PrintOutputCapture<P> p) {
        beforeSyntax(value, JsSpace.Location.TEMPLATE_EXPRESSION_VALUE_PREFIX, p);
        if (value.isEnclosedInBraces()) {
            p.append("${");
        } else {
            p.append("$");
        }
        visit(value.getTree(), p);
        visitSpace(value.getAfter(), JsSpace.Location.TEMPLATE_EXPRESSION_VALUE_SUFFIX, p);
        if (value.isEnclosedInBraces()) {
            p.append('}');
        }
        afterSyntax(value, p);
        return value;
    }

    @Override
    public J visitTuple(JS.Tuple tuple, PrintOutputCapture<P> p) {
        beforeSyntax(tuple, JsSpace.Location.TUPLE_PREFIX, p);
        visitContainer("[", tuple.getPadding().getElements(), JsContainer.Location.TUPLE_ELEMENT, ",", "]", p);
        afterSyntax(tuple, p);
        return tuple;
    }

    @Override
    public J visitTypeDeclaration(JS.TypeDeclaration typeDeclaration, PrintOutputCapture<P> p) {
        beforeSyntax(typeDeclaration, JsSpace.Location.TYPE_DECLARATION_PREFIX, p);
        visit(typeDeclaration.getLeadingAnnotations(), p);
        typeDeclaration.getModifiers().forEach(m -> delegate.visitModifier(m, p));
        visit(typeDeclaration.getName(), p);
        J.TypeParameters typeParameters = typeDeclaration.getTypeParameters();
        if (typeParameters != null) {
            visit(typeParameters.getAnnotations(), p);
            visitSpace(typeParameters.getPrefix(), Space.Location.TYPE_PARAMETERS, p);
            visitMarkers(typeParameters.getMarkers(), p);
            p.append("<");
            visitRightPadded(typeParameters.getPadding().getTypeParameters(), JRightPadded.Location.TYPE_PARAMETER, ",", p);
            p.append(">");
        }
        visitLeftPadded("=", typeDeclaration.getPadding().getInitializer(), JsLeftPadded.Location.TYPE_DECLARATION_INITIALIZER, p);
        afterSyntax(typeDeclaration, p);
        return typeDeclaration;
    }

    @Override
    public J visitTypeOperator(JS.TypeOperator typeOperator, PrintOutputCapture<P> p) {
        beforeSyntax(typeOperator, JsSpace.Location.BINARY_PREFIX, p);

        String keyword = "";
        if (typeOperator.getOperator() == JS.TypeOperator.Type.ReadOnly) {
            keyword = "readonly";
        } else if (typeOperator.getOperator() == JS.TypeOperator.Type.KeyOf) {
            keyword = "keyof";
        }

        p.append(keyword);

        visitLeftPadded(typeOperator.getPadding().getExpression(), JsLeftPadded.Location.TYPE_OPERATOR, p);

        afterSyntax(typeOperator, p);
        return typeOperator;
    }

    @Override
    public J visitUnary(JS.Unary unary, PrintOutputCapture<P> p) {
        beforeSyntax(unary, Space.Location.UNARY_PREFIX, p);
        switch (unary.getOperator()) {
            case Spread:
                visitSpace(unary.getPadding().getOperator().getBefore(), Space.Location.UNARY_OPERATOR, p);
                p.append("...");
                visit(unary.getExpression(), p);
                break;
            default:
                break;
        }
        afterSyntax(unary, p);
        return unary;
    }

    @Override
    public J visitUnion(JS.Union union, PrintOutputCapture<P> p) {
        beforeSyntax(union, JsSpace.Location.UNION_PREFIX, p);

        visitRightPadded(union.getPadding().getTypes(), JsRightPadded.Location.UNION_TYPE, "|", p);

        afterSyntax(union, p);
        return union;
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
        public J visitAnnotation(J.Annotation annotation, PrintOutputCapture<P> p) {
            beforeSyntax(annotation, Space.Location.ANNOTATION_PREFIX, p);
            if (!annotation.getMarkers().findFirst(Keyword.class).isPresent()) {
                p.append("@");
            }
            visit(annotation.getAnnotationType(), p);
            visitContainer("(", annotation.getPadding().getArguments(), JContainer.Location.ANNOTATION_ARGUMENTS, ",", ")", p);
            afterSyntax(annotation, p);
            return annotation;
        }

        @Override
        public J visitBinary(J.Binary binary, PrintOutputCapture<P> p) {
            String keyword = "";
            switch (binary.getOperator()) {
                case Addition:
                    keyword = "+";
                    break;
                case Subtraction:
                    keyword = "-";
                    break;
                case Multiplication:
                    keyword = "*";
                    break;
                case Division:
                    keyword = "/";
                    break;
                case Modulo:
                    keyword = "%";
                    break;
                case LessThan:
                    keyword = "<";
                    break;
                case GreaterThan:
                    keyword = ">";
                    break;
                case LessThanOrEqual:
                    keyword = "<=";
                    break;
                case GreaterThanOrEqual:
                    keyword = ">=";
                    break;
                case Equal:
                    keyword = "==";
                    break;
                case NotEqual:
                    keyword = "!=";
                    break;
                case BitAnd:
                    keyword = "&";
                    break;
                case BitOr:
                    keyword = "|";
                    break;
                case BitXor:
                    keyword = "^";
                    break;
                case LeftShift:
                    keyword = "<<";
                    break;
                case RightShift:
                    keyword = ">>";
                    break;
                case UnsignedRightShift:
                    keyword = ">>>";
                    break;
                case Or:
                    keyword = binary.getMarkers().findFirst(Comma.class).isPresent() ? "," : "||";
                    break;
                case And:
                    keyword = "&&";
                    break;
            }
            beforeSyntax(binary, Space.Location.BINARY_PREFIX, p);
            visit(binary.getLeft(), p);
            visitSpace(binary.getPadding().getOperator().getBefore(), Space.Location.BINARY_OPERATOR, p);
            p.append(keyword);
            visit(binary.getRight(), p);
            afterSyntax(binary, p);
            return binary;
        }

        @Override
        public J visitFieldAccess(J.FieldAccess fieldAccess, PrintOutputCapture<P> p) {
            beforeSyntax(fieldAccess, Space.Location.FIELD_ACCESS_PREFIX, p);
            visit(fieldAccess.getTarget(), p);
            PostFixOperator postFixOperator = fieldAccess.getMarkers().findFirst(PostFixOperator.class).orElse(null);

            visitLeftPadded(postFixOperator != null ? "?." : ".", fieldAccess.getPadding().getName(), JLeftPadded.Location.FIELD_ACCESS_NAME, p);
            afterSyntax(fieldAccess, p);
            return fieldAccess;
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
            method.getModifiers().forEach(it -> visitModifier(it, p));

            FunctionKeyword functionKeyword = method.getMarkers().findFirst(FunctionKeyword.class).orElse(null);
            if (functionKeyword != null) {
                visitSpace(functionKeyword.getPrefix(), Space.Location.LANGUAGE_EXTENSION, p);
                p.append("function");
            }

            Asterisk asterisk = method.getMarkers().findFirst(Asterisk.class).orElse(null);
            if (asterisk != null) {
                visitSpace(asterisk.getPrefix(), Space.Location.LANGUAGE_EXTENSION, p);
                p.append("*");
            }
            visit(method.getName(), p);

            J.TypeParameters typeParameters = method.getAnnotations().getTypeParameters();
            if (typeParameters != null) {
                visit(typeParameters.getAnnotations(), p);
                visitSpace(typeParameters.getPrefix(), Space.Location.TYPE_PARAMETERS, p);
                visitMarkers(typeParameters.getMarkers(), p);
                p.append("<");
                visitRightPadded(typeParameters.getPadding().getTypeParameters(), JRightPadded.Location.TYPE_PARAMETER, ",", p);
                p.append(">");
            }

            visitContainer("(", method.getPadding().getParameters(), JContainer.Location.METHOD_DECLARATION_PARAMETERS, ",", ")", p);
            if (method.getReturnTypeExpression() != null) {
                TypeReferencePrefix typeReferencePrefix = method.getMarkers().findFirst(TypeReferencePrefix.class).orElse(null);
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
        public J visitMethodInvocation(J.MethodInvocation method, PrintOutputCapture<P> p) {
            beforeSyntax(method, Space.Location.METHOD_INVOCATION_PREFIX, p);
            String suffix = method.getMarkers().findFirst(OmitDot.class).isPresent() ? "" : ".";
            visitRightPadded(method.getPadding().getSelect(), JRightPadded.Location.METHOD_SELECT, suffix, p);
            visitContainer("<", method.getPadding().getTypeParameters(), JContainer.Location.TYPE_PARAMETERS, ",", ">", p);
            visit(method.getName(), p);
            visitContainer("(", method.getPadding().getArguments(), JContainer.Location.METHOD_INVOCATION_ARGUMENTS, ",", ")", p);
            afterSyntax(method, p);
            return method;
        }

        @Override
        public void visitModifier(J.Modifier mod, PrintOutputCapture<P> p) {
            visit(mod.getAnnotations(), p);
            String keyword;
            switch (mod.getType()) {
                case Default:
                    keyword = "default";
                    break;
                case Public:
                    keyword = "public";
                    break;
                case Protected:
                    keyword = "protected";
                    break;
                case Private:
                    keyword = "private";
                    break;
                case Abstract:
                    keyword = "abstract";
                    break;
                case Async:
                    keyword = "async";
                    break;
                case Static:
                    keyword = "static";
                    break;
                case Final:
                    keyword = "final";
                    break;
                case Native:
                    keyword = "native";
                    break;
                case NonSealed:
                    keyword = "non-sealed";
                    break;
                case Sealed:
                    keyword = "sealed";
                    break;
                case Strictfp:
                    keyword = "strictfp";
                    break;
                case Synchronized:
                    keyword = "synchronized";
                    break;
                case Transient:
                    keyword = "transient";
                    break;
                case Volatile:
                    keyword = "volatile";
                    break;
                default:
                    keyword = mod.getKeyword();
            }
            beforeSyntax(mod, Space.Location.MODIFIER_PREFIX, p);
            p.append(keyword);
            afterSyntax(mod, p);
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
        public J visitNewClass(J.NewClass newClass, PrintOutputCapture<P> p) {
            beforeSyntax(newClass, Space.Location.NEW_CLASS_PREFIX, p);
            visitRightPadded(newClass.getPadding().getEnclosing(), JRightPadded.Location.NEW_CLASS_ENCLOSING, ".", p);
            visitSpace(newClass.getNew(), Space.Location.NEW_PREFIX, p);
            boolean objectLiteral = newClass.getMarkers().findFirst(ObjectLiteral.class).isPresent();
            if (!objectLiteral) {
                p.append("new");
            }
            visit(newClass.getClazz(), p);
            if (!newClass.getPadding().getArguments().getMarkers().findFirst(OmitParentheses.class).isPresent()) {
                visitContainer(objectLiteral ? "{" : "(", newClass.getPadding().getArguments(), JContainer.Location.NEW_CLASS_ARGUMENTS, ",", objectLiteral ? "}" : ")", p);
            }
            visit(newClass.getBody(), p);
            afterSyntax(newClass, p);
            return newClass;
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
            multiVariable.getModifiers().forEach(it -> visitModifier(it, p));

            List<JRightPadded<J.VariableDeclarations.NamedVariable>> variables = multiVariable.getPadding().getVariables();
            for (int i = 0; i < variables.size(); i++) {
                JRightPadded<J.VariableDeclarations.NamedVariable> variable = variables.get(i);
                beforeSyntax(variable.getElement(), Space.Location.VARIABLE_PREFIX, p);
                if (multiVariable.getVarargs() != null) {
                    p.append("...");
                }
                visit(variable.getElement().getName(), p);
                PostFixOperator postFixOperator = multiVariable.getMarkers().findFirst(PostFixOperator.class).orElse(null);
                if (postFixOperator != null) {
                    visitSpace(postFixOperator.getPrefix(), Space.Location.LANGUAGE_EXTENSION, p);
                    p.append(postFixOperator.getOperator().getValue());
                }

                if (multiVariable.getTypeExpression() != null) {
                    multiVariable.getMarkers().findFirst(TypeReferencePrefix.class).ifPresent(typeReferencePrefix -> visitSpace(typeReferencePrefix.getPrefix(), Space.Location.LANGUAGE_EXTENSION, p));
                    p.append(":");
                    visit(multiVariable.getTypeExpression(), p);
                }

                if (variable.getElement().getInitializer() != null) {
                    JavaScriptPrinter.this.visitLeftPadded(variable.getElement().getMarkers().findFirst(Colon.class).isPresent() ? ":" : "=",
                            variable.getElement().getPadding().getInitializer(), JLeftPadded.Location.VARIABLE_INITIALIZER, p);
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

        @Override
        public J visitYield(J.Yield yield, PrintOutputCapture<P> p) {
            beforeSyntax(yield, Space.Location.YIELD_PREFIX, p);
            p.append("yield");
            Asterisk asterisk = yield.getMarkers().findFirst(Asterisk.class).orElse(null);
            if (asterisk != null) {
                visitSpace(asterisk.getPrefix(), Space.Location.LANGUAGE_EXTENSION, p);
                p.append("*");
            }
            visit(yield.getValue(), p);
            afterSyntax(yield, p);
            return yield;
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

    protected void visitLeftPadded(@Nullable String prefix, @Nullable JLeftPadded<? extends J> leftPadded, JsLeftPadded.Location location, PrintOutputCapture<P> p) {
        if (leftPadded != null) {
            beforeSyntax(leftPadded.getBefore(), leftPadded.getMarkers(), location.getBeforeLocation(), p);
            if (prefix != null) {
                p.append(prefix);
            }
            visit(leftPadded.getElement(), p);
            afterSyntax(leftPadded.getMarkers(), p);
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
            visitMarkers(node.getMarkers(), p);
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
    public Markers visitMarkers(@Nullable Markers markers, PrintOutputCapture<P> pPrintOutputCapture) {
        return delegate.visitMarkers(markers, pPrintOutputCapture);
    }
}
