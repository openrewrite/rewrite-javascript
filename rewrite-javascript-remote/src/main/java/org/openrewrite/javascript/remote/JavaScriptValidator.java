/*
 * Copyright 2024 the original author or authors.
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

/*
 * -------------------THIS FILE IS AUTO GENERATED--------------------------
 * Changes to this file may cause incorrect behavior and will be lost if
 * the code is regenerated.
*/

package org.openrewrite.javascript.remote;

import org.jspecify.annotations.Nullable;
import org.openrewrite.*;
import org.openrewrite.internal.ListUtils;
import org.openrewrite.marker.Markers;
import org.openrewrite.tree.*;
import org.openrewrite.java.JavaVisitor;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.JavaScriptIsoVisitor;
import org.openrewrite.javascript.tree.*;

import java.util.List;

class JavaScriptValidator<P> extends JavaScriptIsoVisitor<P> {

    private <T extends Tree> @Nullable T visitAndValidate(@Nullable T tree, Class<? extends Tree> expected, P p) {
        if (tree != null && !expected.isInstance(tree)) {
            throw new ClassCastException("Type " + tree.getClass() + " is not assignable to " + expected);
        }
        // noinspection unchecked
        return (T) visit(tree, p);
    }

    private <T extends Tree> @Nullable List<T> visitAndValidate(@Nullable List<@Nullable T> list, Class<? extends Tree> expected, P p) {
        return list == null ? null : ListUtils.map(list, e -> visitAndValidate(e, expected, p));
    }

    @Override
    public JS.CompilationUnit visitCompilationUnit(JS.CompilationUnit compilationUnit, P p) {
        ListUtils.map(compilationUnit.getImports(), el -> visitAndValidate(el, J.Import.class, p));
        ListUtils.map(compilationUnit.getStatements(), el -> visitAndValidate(el, Statement.class, p));
        return compilationUnit;
    }

    @Override
    public JS.Alias visitAlias(JS.Alias alias, P p) {
        visitAndValidate(alias.getPropertyName(), J.Identifier.class, p);
        visitAndValidate(alias.getAlias(), Expression.class, p);
        return alias;
    }

    @Override
    public JS.ArrowFunction visitArrowFunction(JS.ArrowFunction arrowFunction, P p) {
        ListUtils.map(arrowFunction.getLeadingAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        ListUtils.map(arrowFunction.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(arrowFunction.getTypeParameters(), J.TypeParameters.class, p);
        visitAndValidate(arrowFunction.getParameters(), J.Lambda.Parameters.class, p);
        visitAndValidate(arrowFunction.getReturnTypeExpression(), TypeTree.class, p);
        visitAndValidate(arrowFunction.getBody(), J.class, p);
        return arrowFunction;
    }

    @Override
    public JS.Await visitAwait(JS.Await await, P p) {
        visitAndValidate(await.getExpression(), Expression.class, p);
        return await;
    }

    @Override
    public JS.ConditionalType visitConditionalType(JS.ConditionalType conditionalType, P p) {
        visitAndValidate(conditionalType.getCheckType(), Expression.class, p);
        visitAndValidate(conditionalType.getCondition(), TypedTree.class, p);
        return conditionalType;
    }

    @Override
    public JS.DefaultType visitDefaultType(JS.DefaultType defaultType, P p) {
        visitAndValidate(defaultType.getLeft(), Expression.class, p);
        visitAndValidate(defaultType.getRight(), Expression.class, p);
        return defaultType;
    }

    @Override
    public JS.Delete visitDelete(JS.Delete delete, P p) {
        visitAndValidate(delete.getExpression(), Expression.class, p);
        return delete;
    }

    @Override
    public JS.Export visitExport(JS.Export export, P p) {
        visitAndValidate(export.getExports(), Expression.class, p);
        visitAndValidate(export.getTarget(), J.Literal.class, p);
        visitAndValidate(export.getInitializer(), Expression.class, p);
        return export;
    }

    @Override
    public JS.ExpressionStatement visitExpressionStatement(JS.ExpressionStatement expressionStatement, P p) {
        visitAndValidate(expressionStatement.getExpression(), Expression.class, p);
        return expressionStatement;
    }

    @Override
    public JS.ExpressionWithTypeArguments visitExpressionWithTypeArguments(JS.ExpressionWithTypeArguments expressionWithTypeArguments, P p) {
        visitAndValidate(expressionWithTypeArguments.getClazz(), NameTree.class, p);
        visitAndValidate(expressionWithTypeArguments.getTypeArguments(), Expression.class, p);
        return expressionWithTypeArguments;
    }

    @Override
    public JS.FunctionType visitFunctionType(JS.FunctionType functionType, P p) {
        visitAndValidate(functionType.getTypeParameters(), J.TypeParameters.class, p);
        visitAndValidate(functionType.getParameters(), Statement.class, p);
        visitAndValidate(functionType.getReturnType(), Expression.class, p);
        return functionType;
    }

    @Override
    public JS.InferType visitInferType(JS.InferType inferType, P p) {
        visitAndValidate(inferType.getTypeParameter(), J.class, p);
        return inferType;
    }

    @Override
    public JS.ImportType visitImportType(JS.ImportType importType, P p) {
        visitAndValidate(importType.getImportArgument(), J.ParenthesizedTypeTree.class, p);
        visitAndValidate(importType.getQualifier(), Expression.class, p);
        visitAndValidate(importType.getTypeArguments(), Expression.class, p);
        return importType;
    }

    @Override
    public JS.JsImport visitJsImport(JS.JsImport jsImport, P p) {
        visitAndValidate(jsImport.getName(), J.Identifier.class, p);
        visitAndValidate(jsImport.getImports(), Expression.class, p);
        visitAndValidate(jsImport.getTarget(), J.Literal.class, p);
        visitAndValidate(jsImport.getInitializer(), Expression.class, p);
        return jsImport;
    }

    @Override
    public JS.JsImportSpecifier visitJsImportSpecifier(JS.JsImportSpecifier jsImportSpecifier, P p) {
        visitAndValidate(jsImportSpecifier.getSpecifier(), Expression.class, p);
        return jsImportSpecifier;
    }

    @Override
    public JS.JsBinary visitJsBinary(JS.JsBinary jsBinary, P p) {
        visitAndValidate(jsBinary.getLeft(), Expression.class, p);
        visitAndValidate(jsBinary.getRight(), Expression.class, p);
        return jsBinary;
    }

    @Override
    public JS.LiteralType visitLiteralType(JS.LiteralType literalType, P p) {
        visitAndValidate(literalType.getLiteral(), Expression.class, p);
        return literalType;
    }

    @Override
    public JS.ObjectBindingDeclarations visitObjectBindingDeclarations(JS.ObjectBindingDeclarations objectBindingDeclarations, P p) {
        ListUtils.map(objectBindingDeclarations.getLeadingAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        ListUtils.map(objectBindingDeclarations.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(objectBindingDeclarations.getTypeExpression(), TypeTree.class, p);
        visitAndValidate(objectBindingDeclarations.getBindings(), JS.BindingElement.class, p);
        visitAndValidate(objectBindingDeclarations.getInitializer(), Expression.class, p);
        return objectBindingDeclarations;
    }

    @Override
    public JS.PropertyAssignment visitPropertyAssignment(JS.PropertyAssignment propertyAssignment, P p) {
        visitAndValidate(propertyAssignment.getName(), Expression.class, p);
        visitAndValidate(propertyAssignment.getInitializer(), Expression.class, p);
        return propertyAssignment;
    }

    @Override
    public JS.SatisfiesExpression visitSatisfiesExpression(JS.SatisfiesExpression satisfiesExpression, P p) {
        visitAndValidate(satisfiesExpression.getExpression(), J.class, p);
        visitAndValidate(satisfiesExpression.getSatisfiesType(), Expression.class, p);
        return satisfiesExpression;
    }

    @Override
    public JS.ScopedVariableDeclarations visitScopedVariableDeclarations(JS.ScopedVariableDeclarations scopedVariableDeclarations, P p) {
        ListUtils.map(scopedVariableDeclarations.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        ListUtils.map(scopedVariableDeclarations.getVariables(), el -> visitAndValidate(el, J.class, p));
        return scopedVariableDeclarations;
    }

    @Override
    public JS.StatementExpression visitStatementExpression(JS.StatementExpression statementExpression, P p) {
        visitAndValidate(statementExpression.getStatement(), Statement.class, p);
        return statementExpression;
    }

    @Override
    public JS.TaggedTemplateExpression visitTaggedTemplateExpression(JS.TaggedTemplateExpression taggedTemplateExpression, P p) {
        visitAndValidate(taggedTemplateExpression.getTag(), Expression.class, p);
        visitAndValidate(taggedTemplateExpression.getTypeArguments(), Expression.class, p);
        visitAndValidate(taggedTemplateExpression.getTemplateExpression(), JS.TemplateExpression.class, p);
        return taggedTemplateExpression;
    }

    @Override
    public JS.TemplateExpression visitTemplateExpression(JS.TemplateExpression templateExpression, P p) {
        visitAndValidate(templateExpression.getHead(), J.Literal.class, p);
        ListUtils.map(templateExpression.getTemplateSpans(), el -> visitAndValidate(el, JS.TemplateExpression.TemplateSpan.class, p));
        return templateExpression;
    }

    @Override
    public JS.TemplateExpression.TemplateSpan visitTemplateExpressionTemplateSpan(JS.TemplateExpression.TemplateSpan templateSpan, P p) {
        visitAndValidate(templateSpan.getExpression(), J.class, p);
        visitAndValidate(templateSpan.getTail(), J.Literal.class, p);
        return templateSpan;
    }

    @Override
    public JS.Tuple visitTuple(JS.Tuple tuple, P p) {
        visitAndValidate(tuple.getElements(), J.class, p);
        return tuple;
    }

    @Override
    public JS.TypeDeclaration visitTypeDeclaration(JS.TypeDeclaration typeDeclaration, P p) {
        ListUtils.map(typeDeclaration.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(typeDeclaration.getName(), J.Identifier.class, p);
        visitAndValidate(typeDeclaration.getTypeParameters(), J.TypeParameters.class, p);
        visitAndValidate(typeDeclaration.getInitializer(), Expression.class, p);
        return typeDeclaration;
    }

    @Override
    public JS.TypeOf visitTypeOf(JS.TypeOf typeOf, P p) {
        visitAndValidate(typeOf.getExpression(), Expression.class, p);
        return typeOf;
    }

    @Override
    public JS.TypeQuery visitTypeQuery(JS.TypeQuery typeQuery, P p) {
        visitAndValidate(typeQuery.getTypeExpression(), TypeTree.class, p);
        return typeQuery;
    }

    @Override
    public JS.TypeOperator visitTypeOperator(JS.TypeOperator typeOperator, P p) {
        visitAndValidate(typeOperator.getExpression(), Expression.class, p);
        return typeOperator;
    }

    @Override
    public JS.TypePredicate visitTypePredicate(JS.TypePredicate typePredicate, P p) {
        visitAndValidate(typePredicate.getParameterName(), J.Identifier.class, p);
        visitAndValidate(typePredicate.getExpression(), Expression.class, p);
        return typePredicate;
    }

    @Override
    public JS.Unary visitUnary(JS.Unary unary, P p) {
        visitAndValidate(unary.getExpression(), Expression.class, p);
        return unary;
    }

    @Override
    public JS.Union visitUnion(JS.Union union, P p) {
        ListUtils.map(union.getTypes(), el -> visitAndValidate(el, Expression.class, p));
        return union;
    }

    @Override
    public JS.Intersection visitIntersection(JS.Intersection intersection, P p) {
        ListUtils.map(intersection.getTypes(), el -> visitAndValidate(el, Expression.class, p));
        return intersection;
    }

    @Override
    public JS.Void visitVoid(JS.Void void_, P p) {
        visitAndValidate(void_.getExpression(), Expression.class, p);
        return void_;
    }

    @Override
    public JS.Yield visitYield(JS.Yield yield, P p) {
        visitAndValidate(yield.getExpression(), Expression.class, p);
        return yield;
    }

    @Override
    public JS.TypeInfo visitTypeInfo(JS.TypeInfo typeInfo, P p) {
        visitAndValidate(typeInfo.getTypeIdentifier(), TypeTree.class, p);
        return typeInfo;
    }

    @Override
    public JS.JSVariableDeclarations visitJSVariableDeclarations(JS.JSVariableDeclarations jSVariableDeclarations, P p) {
        ListUtils.map(jSVariableDeclarations.getLeadingAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        ListUtils.map(jSVariableDeclarations.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(jSVariableDeclarations.getTypeExpression(), TypeTree.class, p);
        ListUtils.map(jSVariableDeclarations.getVariables(), el -> visitAndValidate(el, JS.JSVariableDeclarations.JSNamedVariable.class, p));
        return jSVariableDeclarations;
    }

    @Override
    public JS.JSVariableDeclarations.JSNamedVariable visitJSVariableDeclarationsJSNamedVariable(JS.JSVariableDeclarations.JSNamedVariable jSNamedVariable, P p) {
        visitAndValidate(jSNamedVariable.getName(), Expression.class, p);
        visitAndValidate(jSNamedVariable.getInitializer(), Expression.class, p);
        return jSNamedVariable;
    }

    @Override
    public JS.JSMethodDeclaration visitJSMethodDeclaration(JS.JSMethodDeclaration jSMethodDeclaration, P p) {
        ListUtils.map(jSMethodDeclaration.getLeadingAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        ListUtils.map(jSMethodDeclaration.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(jSMethodDeclaration.getTypeParameters(), J.TypeParameters.class, p);
        visitAndValidate(jSMethodDeclaration.getReturnTypeExpression(), TypeTree.class, p);
        visitAndValidate(jSMethodDeclaration.getName(), Expression.class, p);
        visitAndValidate(jSMethodDeclaration.getParameters(), Statement.class, p);
        visitAndValidate(jSMethodDeclaration.getThrowz(), NameTree.class, p);
        visitAndValidate(jSMethodDeclaration.getBody(), J.Block.class, p);
        visitAndValidate(jSMethodDeclaration.getDefaultValue(), Expression.class, p);
        return jSMethodDeclaration;
    }

    @Override
    public JS.JSForOfLoop visitJSForOfLoop(JS.JSForOfLoop jSForOfLoop, P p) {
        visitAndValidate(jSForOfLoop.getControl(), JS.JSForInOfLoopControl.class, p);
        visitAndValidate(jSForOfLoop.getBody(), Statement.class, p);
        return jSForOfLoop;
    }

    @Override
    public JS.JSForInLoop visitJSForInLoop(JS.JSForInLoop jSForInLoop, P p) {
        visitAndValidate(jSForInLoop.getControl(), JS.JSForInOfLoopControl.class, p);
        visitAndValidate(jSForInLoop.getBody(), Statement.class, p);
        return jSForInLoop;
    }

    @Override
    public JS.JSForInOfLoopControl visitJSForInOfLoopControl(JS.JSForInOfLoopControl jSForInOfLoopControl, P p) {
        visitAndValidate(jSForInOfLoopControl.getVariable(), J.class, p);
        visitAndValidate(jSForInOfLoopControl.getIterable(), Expression.class, p);
        return jSForInOfLoopControl;
    }

    @Override
    public JS.NamespaceDeclaration visitNamespaceDeclaration(JS.NamespaceDeclaration namespaceDeclaration, P p) {
        ListUtils.map(namespaceDeclaration.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(namespaceDeclaration.getName(), Expression.class, p);
        visitAndValidate(namespaceDeclaration.getBody(), J.Block.class, p);
        return namespaceDeclaration;
    }

    @Override
    public JS.FunctionDeclaration visitFunctionDeclaration(JS.FunctionDeclaration functionDeclaration, P p) {
        ListUtils.map(functionDeclaration.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(functionDeclaration.getName(), J.Identifier.class, p);
        visitAndValidate(functionDeclaration.getTypeParameters(), J.TypeParameters.class, p);
        visitAndValidate(functionDeclaration.getParameters(), Statement.class, p);
        visitAndValidate(functionDeclaration.getReturnTypeExpression(), TypeTree.class, p);
        visitAndValidate(functionDeclaration.getBody(), J.class, p);
        return functionDeclaration;
    }

    @Override
    public JS.TypeLiteral visitTypeLiteral(JS.TypeLiteral typeLiteral, P p) {
        visitAndValidate(typeLiteral.getMembers(), J.Block.class, p);
        return typeLiteral;
    }

    @Override
    public JS.IndexSignatureDeclaration visitIndexSignatureDeclaration(JS.IndexSignatureDeclaration indexSignatureDeclaration, P p) {
        ListUtils.map(indexSignatureDeclaration.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(indexSignatureDeclaration.getParameters(), J.class, p);
        visitAndValidate(indexSignatureDeclaration.getTypeExpression(), Expression.class, p);
        return indexSignatureDeclaration;
    }

    @Override
    public JS.ArrayBindingPattern visitArrayBindingPattern(JS.ArrayBindingPattern arrayBindingPattern, P p) {
        visitAndValidate(arrayBindingPattern.getElements(), Expression.class, p);
        return arrayBindingPattern;
    }

    @Override
    public JS.BindingElement visitBindingElement(JS.BindingElement bindingElement, P p) {
        visitAndValidate(bindingElement.getPropertyName(), Expression.class, p);
        visitAndValidate(bindingElement.getName(), TypedTree.class, p);
        visitAndValidate(bindingElement.getInitializer(), Expression.class, p);
        return bindingElement;
    }

    @Override
    public JS.ExportDeclaration visitExportDeclaration(JS.ExportDeclaration exportDeclaration, P p) {
        ListUtils.map(exportDeclaration.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(exportDeclaration.getExportClause(), Expression.class, p);
        visitAndValidate(exportDeclaration.getModuleSpecifier(), Expression.class, p);
        return exportDeclaration;
    }

    @Override
    public JS.ExportAssignment visitExportAssignment(JS.ExportAssignment exportAssignment, P p) {
        ListUtils.map(exportAssignment.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(exportAssignment.getExpression(), Expression.class, p);
        return exportAssignment;
    }

    @Override
    public JS.NamedExports visitNamedExports(JS.NamedExports namedExports, P p) {
        visitAndValidate(namedExports.getElements(), JS.ExportSpecifier.class, p);
        return namedExports;
    }

    @Override
    public JS.ExportSpecifier visitExportSpecifier(JS.ExportSpecifier exportSpecifier, P p) {
        visitAndValidate(exportSpecifier.getSpecifier(), Expression.class, p);
        return exportSpecifier;
    }

    @Override
    public JS.IndexedAccessType visitIndexedAccessType(JS.IndexedAccessType indexedAccessType, P p) {
        visitAndValidate(indexedAccessType.getObjectType(), TypeTree.class, p);
        visitAndValidate(indexedAccessType.getIndexType(), TypeTree.class, p);
        return indexedAccessType;
    }

    @Override
    public JS.IndexedAccessType.IndexType visitIndexedAccessTypeIndexType(JS.IndexedAccessType.IndexType indexType, P p) {
        visitAndValidate(indexType.getElement(), TypeTree.class, p);
        return indexType;
    }

    @Override
    public J.AnnotatedType visitAnnotatedType(J.AnnotatedType annotatedType, P p) {
        ListUtils.map(annotatedType.getAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        visitAndValidate(annotatedType.getTypeExpression(), TypeTree.class, p);
        return annotatedType;
    }

    @Override
    public J.Annotation visitAnnotation(J.Annotation annotation, P p) {
        visitAndValidate(annotation.getAnnotationType(), NameTree.class, p);
        visitAndValidate(annotation.getArguments(), Expression.class, p);
        return annotation;
    }

    @Override
    public J.ArrayAccess visitArrayAccess(J.ArrayAccess arrayAccess, P p) {
        visitAndValidate(arrayAccess.getIndexed(), Expression.class, p);
        visitAndValidate(arrayAccess.getDimension(), J.ArrayDimension.class, p);
        return arrayAccess;
    }

    @Override
    public J.ArrayType visitArrayType(J.ArrayType arrayType, P p) {
        visitAndValidate(arrayType.getElementType(), TypeTree.class, p);
        ListUtils.map(arrayType.getAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        return arrayType;
    }

    @Override
    public J.Assert visitAssert(J.Assert assert_, P p) {
        visitAndValidate(assert_.getCondition(), Expression.class, p);
        visitAndValidate(assert_.getDetail() != null ? assert_.getDetail().getElement() : null, Expression.class, p);
        return assert_;
    }

    @Override
    public J.Assignment visitAssignment(J.Assignment assignment, P p) {
        visitAndValidate(assignment.getVariable(), Expression.class, p);
        visitAndValidate(assignment.getAssignment(), Expression.class, p);
        return assignment;
    }

    @Override
    public J.AssignmentOperation visitAssignmentOperation(J.AssignmentOperation assignmentOperation, P p) {
        visitAndValidate(assignmentOperation.getVariable(), Expression.class, p);
        visitAndValidate(assignmentOperation.getAssignment(), Expression.class, p);
        return assignmentOperation;
    }

    @Override
    public J.Binary visitBinary(J.Binary binary, P p) {
        visitAndValidate(binary.getLeft(), Expression.class, p);
        visitAndValidate(binary.getRight(), Expression.class, p);
        return binary;
    }

    @Override
    public J.Block visitBlock(J.Block block, P p) {
        ListUtils.map(block.getStatements(), el -> visitAndValidate(el, Statement.class, p));
        return block;
    }

    @Override
    public J.Break visitBreak(J.Break break_, P p) {
        visitAndValidate(break_.getLabel(), J.Identifier.class, p);
        return break_;
    }

    @Override
    public J.Case visitCase(J.Case case_, P p) {
        visitAndValidate(case_.getExpressions(), Expression.class, p);
        visitAndValidate(case_.getStatements(), Statement.class, p);
        visitAndValidate(case_.getBody(), J.class, p);
        return case_;
    }

    @Override
    public J.ClassDeclaration visitClassDeclaration(J.ClassDeclaration classDeclaration, P p) {
        ListUtils.map(classDeclaration.getLeadingAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        ListUtils.map(classDeclaration.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visit(classDeclaration.getPadding().getKind(), p);
        visitAndValidate(classDeclaration.getName(), J.Identifier.class, p);
        visitAndValidate(classDeclaration.getTypeParameters(), J.TypeParameter.class, p);
        visitAndValidate(classDeclaration.getPrimaryConstructor(), Statement.class, p);
        visitAndValidate(classDeclaration.getExtends(), TypeTree.class, p);
        visitAndValidate(classDeclaration.getImplements(), TypeTree.class, p);
        visitAndValidate(classDeclaration.getPermits(), TypeTree.class, p);
        visitAndValidate(classDeclaration.getBody(), J.Block.class, p);
        return classDeclaration;
    }

    @Override
    public J.Continue visitContinue(J.Continue continue_, P p) {
        visitAndValidate(continue_.getLabel(), J.Identifier.class, p);
        return continue_;
    }

    @Override
    public J.DoWhileLoop visitDoWhileLoop(J.DoWhileLoop doWhileLoop, P p) {
        visitAndValidate(doWhileLoop.getBody(), Statement.class, p);
        visitAndValidate(doWhileLoop.getWhileCondition(), Expression.class, p);
        return doWhileLoop;
    }

    @Override
    public J.Empty visitEmpty(J.Empty empty, P p) {
        return empty;
    }

    @Override
    public J.EnumValue visitEnumValue(J.EnumValue enumValue, P p) {
        ListUtils.map(enumValue.getAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        visitAndValidate(enumValue.getName(), J.Identifier.class, p);
        visitAndValidate(enumValue.getInitializer(), J.NewClass.class, p);
        return enumValue;
    }

    @Override
    public J.EnumValueSet visitEnumValueSet(J.EnumValueSet enumValueSet, P p) {
        ListUtils.map(enumValueSet.getEnums(), el -> visitAndValidate(el, J.EnumValue.class, p));
        return enumValueSet;
    }

    @Override
    public J.FieldAccess visitFieldAccess(J.FieldAccess fieldAccess, P p) {
        visitAndValidate(fieldAccess.getTarget(), Expression.class, p);
        visitAndValidate(fieldAccess.getName(), J.Identifier.class, p);
        return fieldAccess;
    }

    @Override
    public J.ForEachLoop visitForEachLoop(J.ForEachLoop forEachLoop, P p) {
        visitAndValidate(forEachLoop.getControl(), J.ForEachLoop.Control.class, p);
        visitAndValidate(forEachLoop.getBody(), Statement.class, p);
        return forEachLoop;
    }

    @Override
    public J.ForEachLoop.Control visitForEachControl(J.ForEachLoop.Control control, P p) {
        visitAndValidate(control.getVariable(), J.VariableDeclarations.class, p);
        visitAndValidate(control.getIterable(), Expression.class, p);
        return control;
    }

    @Override
    public J.ForLoop visitForLoop(J.ForLoop forLoop, P p) {
        visitAndValidate(forLoop.getControl(), J.ForLoop.Control.class, p);
        visitAndValidate(forLoop.getBody(), Statement.class, p);
        return forLoop;
    }

    @Override
    public J.ForLoop.Control visitForControl(J.ForLoop.Control control, P p) {
        ListUtils.map(control.getInit(), el -> visitAndValidate(el, Statement.class, p));
        visitAndValidate(control.getCondition(), Expression.class, p);
        ListUtils.map(control.getUpdate(), el -> visitAndValidate(el, Statement.class, p));
        return control;
    }

    @Override
    public J.ParenthesizedTypeTree visitParenthesizedTypeTree(J.ParenthesizedTypeTree parenthesizedTypeTree, P p) {
        ListUtils.map(parenthesizedTypeTree.getAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        visitAndValidate(parenthesizedTypeTree.getParenthesizedType(), J.Parentheses.class, p);
        return parenthesizedTypeTree;
    }

    @Override
    public J.Identifier visitIdentifier(J.Identifier identifier, P p) {
        ListUtils.map(identifier.getAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        return identifier;
    }

    @Override
    public J.If visitIf(J.If if_, P p) {
        visitAndValidate(if_.getIfCondition(), J.ControlParentheses.class, p);
        visitAndValidate(if_.getThenPart(), Statement.class, p);
        visitAndValidate(if_.getElsePart(), J.If.Else.class, p);
        return if_;
    }

    @Override
    public J.If.Else visitElse(J.If.Else else_, P p) {
        visitAndValidate(else_.getBody(), Statement.class, p);
        return else_;
    }

    @Override
    public J.Import visitImport(J.Import import_, P p) {
        visitAndValidate(import_.getQualid(), J.FieldAccess.class, p);
        visitAndValidate(import_.getAlias(), J.Identifier.class, p);
        return import_;
    }

    @Override
    public J.InstanceOf visitInstanceOf(J.InstanceOf instanceOf, P p) {
        visitAndValidate(instanceOf.getExpression(), Expression.class, p);
        visitAndValidate(instanceOf.getClazz(), J.class, p);
        visitAndValidate(instanceOf.getPattern(), J.class, p);
        return instanceOf;
    }

    @Override
    public J.IntersectionType visitIntersectionType(J.IntersectionType intersectionType, P p) {
        visitAndValidate(intersectionType.getBounds(), TypeTree.class, p);
        return intersectionType;
    }

    @Override
    public J.Label visitLabel(J.Label label, P p) {
        visitAndValidate(label.getLabel(), J.Identifier.class, p);
        visitAndValidate(label.getStatement(), Statement.class, p);
        return label;
    }

    @Override
    public J.Lambda visitLambda(J.Lambda lambda, P p) {
        visitAndValidate(lambda.getParameters().getParameters(), J.class, p);
        visitAndValidate(lambda.getBody(), J.class, p);
        return lambda;
    }

    @Override
    public J.Literal visitLiteral(J.Literal literal, P p) {
        return literal;
    }

    @Override
    public J.MemberReference visitMemberReference(J.MemberReference memberReference, P p) {
        visitAndValidate(memberReference.getContaining(), Expression.class, p);
        visitAndValidate(memberReference.getTypeParameters(), Expression.class, p);
        visitAndValidate(memberReference.getReference(), J.Identifier.class, p);
        return memberReference;
    }

    @Override
    public J.MethodDeclaration visitMethodDeclaration(J.MethodDeclaration methodDeclaration, P p) {
        ListUtils.map(methodDeclaration.getLeadingAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        ListUtils.map(methodDeclaration.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(methodDeclaration.getPadding().getTypeParameters(), J.TypeParameters.class, p);
        visitAndValidate(methodDeclaration.getReturnTypeExpression(), TypeTree.class, p);
        visitAndValidate(methodDeclaration.getParameters(), Statement.class, p);
        visitAndValidate(methodDeclaration.getThrows(), NameTree.class, p);
        visitAndValidate(methodDeclaration.getBody(), J.Block.class, p);
        visitAndValidate(methodDeclaration.getDefaultValue(), Expression.class, p);
        return methodDeclaration;
    }

    @Override
    public J.MethodInvocation visitMethodInvocation(J.MethodInvocation methodInvocation, P p) {
        visitAndValidate(methodInvocation.getSelect(), Expression.class, p);
        visitAndValidate(methodInvocation.getTypeParameters(), Expression.class, p);
        visitAndValidate(methodInvocation.getName(), J.Identifier.class, p);
        visitAndValidate(methodInvocation.getArguments(), Expression.class, p);
        return methodInvocation;
    }

    @Override
    public J.MultiCatch visitMultiCatch(J.MultiCatch multiCatch, P p) {
        ListUtils.map(multiCatch.getAlternatives(), el -> visitAndValidate(el, NameTree.class, p));
        return multiCatch;
    }

    @Override
    public J.NewArray visitNewArray(J.NewArray newArray, P p) {
        visitAndValidate(newArray.getTypeExpression(), TypeTree.class, p);
        ListUtils.map(newArray.getDimensions(), el -> visitAndValidate(el, J.ArrayDimension.class, p));
        visitAndValidate(newArray.getInitializer(), Expression.class, p);
        return newArray;
    }

    @Override
    public J.ArrayDimension visitArrayDimension(J.ArrayDimension arrayDimension, P p) {
        visitAndValidate(arrayDimension.getIndex(), Expression.class, p);
        return arrayDimension;
    }

    @Override
    public J.NewClass visitNewClass(J.NewClass newClass, P p) {
        visitAndValidate(newClass.getEnclosing(), Expression.class, p);
        visitAndValidate(newClass.getClazz(), TypeTree.class, p);
        visitAndValidate(newClass.getArguments(), Expression.class, p);
        visitAndValidate(newClass.getBody(), J.Block.class, p);
        return newClass;
    }

    @Override
    public J.NullableType visitNullableType(J.NullableType nullableType, P p) {
        ListUtils.map(nullableType.getAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        visitAndValidate(nullableType.getTypeTree(), TypeTree.class, p);
        return nullableType;
    }

    @Override
    public J.Package visitPackage(J.Package package_, P p) {
        visitAndValidate(package_.getExpression(), Expression.class, p);
        ListUtils.map(package_.getAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        return package_;
    }

    @Override
    public J.ParameterizedType visitParameterizedType(J.ParameterizedType parameterizedType, P p) {
        visitAndValidate(parameterizedType.getClazz(), NameTree.class, p);
        visitAndValidate(parameterizedType.getTypeParameters(), Expression.class, p);
        return parameterizedType;
    }

    @Override
    public <J2 extends J> J.Parentheses<J2> visitParentheses(J.Parentheses<J2> parentheses, P p) {
        visitAndValidate(parentheses.getTree(), J.class, p);
        return parentheses;
    }

    @Override
    public <J2 extends J> J.ControlParentheses<J2> visitControlParentheses(J.ControlParentheses<J2> controlParentheses, P p) {
        visitAndValidate(controlParentheses.getTree(), J.class, p);
        return controlParentheses;
    }

    @Override
    public J.Primitive visitPrimitive(J.Primitive primitive, P p) {
        return primitive;
    }

    @Override
    public J.Return visitReturn(J.Return return_, P p) {
        visitAndValidate(return_.getExpression(), Expression.class, p);
        return return_;
    }

    @Override
    public J.Switch visitSwitch(J.Switch switch_, P p) {
        visitAndValidate(switch_.getSelector(), J.ControlParentheses.class, p);
        visitAndValidate(switch_.getCases(), J.Block.class, p);
        return switch_;
    }

    @Override
    public J.SwitchExpression visitSwitchExpression(J.SwitchExpression switchExpression, P p) {
        visitAndValidate(switchExpression.getSelector(), J.ControlParentheses.class, p);
        visitAndValidate(switchExpression.getCases(), J.Block.class, p);
        return switchExpression;
    }

    @Override
    public J.Synchronized visitSynchronized(J.Synchronized synchronized_, P p) {
        visitAndValidate(synchronized_.getLock(), J.ControlParentheses.class, p);
        visitAndValidate(synchronized_.getBody(), J.Block.class, p);
        return synchronized_;
    }

    @Override
    public J.Ternary visitTernary(J.Ternary ternary, P p) {
        visitAndValidate(ternary.getCondition(), Expression.class, p);
        visitAndValidate(ternary.getTruePart(), Expression.class, p);
        visitAndValidate(ternary.getFalsePart(), Expression.class, p);
        return ternary;
    }

    @Override
    public J.Throw visitThrow(J.Throw throw_, P p) {
        visitAndValidate(throw_.getException(), Expression.class, p);
        return throw_;
    }

    @Override
    public J.Try visitTry(J.Try try_, P p) {
        visitAndValidate(try_.getResources(), J.Try.Resource.class, p);
        visitAndValidate(try_.getBody(), J.Block.class, p);
        ListUtils.map(try_.getCatches(), el -> visitAndValidate(el, J.Try.Catch.class, p));
        visitAndValidate(try_.getFinally(), J.Block.class, p);
        return try_;
    }

    @Override
    public J.Try.Resource visitTryResource(J.Try.Resource resource, P p) {
        visitAndValidate(resource.getVariableDeclarations(), TypedTree.class, p);
        return resource;
    }

    @Override
    public J.Try.Catch visitCatch(J.Try.Catch catch_, P p) {
        visitAndValidate(catch_.getParameter(), J.ControlParentheses.class, p);
        visitAndValidate(catch_.getBody(), J.Block.class, p);
        return catch_;
    }

    @Override
    public J.TypeCast visitTypeCast(J.TypeCast typeCast, P p) {
        visitAndValidate(typeCast.getClazz(), J.ControlParentheses.class, p);
        visitAndValidate(typeCast.getExpression(), Expression.class, p);
        return typeCast;
    }

    @Override
    public J.TypeParameter visitTypeParameter(J.TypeParameter typeParameter, P p) {
        ListUtils.map(typeParameter.getAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        ListUtils.map(typeParameter.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(typeParameter.getName(), Expression.class, p);
        visitAndValidate(typeParameter.getBounds(), TypeTree.class, p);
        return typeParameter;
    }

    @Override
    public J.Unary visitUnary(J.Unary unary, P p) {
        visitAndValidate(unary.getExpression(), Expression.class, p);
        return unary;
    }

    @Override
    public J.VariableDeclarations visitVariableDeclarations(J.VariableDeclarations variableDeclarations, P p) {
        ListUtils.map(variableDeclarations.getLeadingAnnotations(), el -> visitAndValidate(el, J.Annotation.class, p));
        ListUtils.map(variableDeclarations.getModifiers(), el -> visitAndValidate(el, J.Modifier.class, p));
        visitAndValidate(variableDeclarations.getTypeExpression(), TypeTree.class, p);
        ListUtils.map(variableDeclarations.getVariables(), el -> visitAndValidate(el, J.VariableDeclarations.NamedVariable.class, p));
        return variableDeclarations;
    }

    @Override
    public J.VariableDeclarations.NamedVariable visitVariable(J.VariableDeclarations.NamedVariable namedVariable, P p) {
        visitAndValidate(namedVariable.getName(), J.Identifier.class, p);
        visitAndValidate(namedVariable.getInitializer(), Expression.class, p);
        return namedVariable;
    }

    @Override
    public J.WhileLoop visitWhileLoop(J.WhileLoop whileLoop, P p) {
        visitAndValidate(whileLoop.getCondition(), J.ControlParentheses.class, p);
        visitAndValidate(whileLoop.getBody(), Statement.class, p);
        return whileLoop;
    }

    @Override
    public J.Wildcard visitWildcard(J.Wildcard wildcard, P p) {
        visitAndValidate(wildcard.getBoundedType(), NameTree.class, p);
        return wildcard;
    }

    @Override
    public J.Yield visitYield(J.Yield yield, P p) {
        visitAndValidate(yield.getValue(), Expression.class, p);
        return yield;
    }

    @Override
    public J.Unknown visitUnknown(J.Unknown unknown, P p) {
        visitAndValidate(unknown.getSource(), J.Unknown.Source.class, p);
        return unknown;
    }

    @Override
    public J.Unknown.Source visitUnknownSource(J.Unknown.Source source, P p) {
        return source;
    }

}
