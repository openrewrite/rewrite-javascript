/*
 * Copyright 2024 the original author or authors.
 * <p>
 * Licensed under the Moderne Source Available License (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * https://docs.moderne.io/licensing/moderne-source-available-license
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

import lombok.Value;
import org.jspecify.annotations.Nullable;
import org.openrewrite.Cursor;
import org.openrewrite.Tree;
import org.openrewrite.javascript.JavaScriptVisitor;
import org.openrewrite.javascript.tree.*;
import org.openrewrite.java.*;
import org.openrewrite.java.tree.*;
import org.openrewrite.remote.Sender;
import org.openrewrite.remote.SenderContext;

import java.util.function.Function;

@Value
public class JavaScriptSender implements Sender<JS> {

    @Override
    public void send(JS after, @Nullable JS before, SenderContext ctx) {
        Visitor visitor = new Visitor();
        visitor.visit(after, ctx.fork(visitor, before));
        ctx.flush();
    }

    private static class Visitor extends JavaScriptVisitor<SenderContext> {

        @Override
        public @Nullable J visit(@Nullable Tree tree, SenderContext ctx) {
            setCursor(new Cursor(getCursor(), tree));
            ctx.sendNode(tree, Function.identity(), ctx::sendTree);
            setCursor(getCursor().getParent());

            return (J) tree;
        }

        @Override
        public JS.CompilationUnit visitCompilationUnit(JS.CompilationUnit compilationUnit, SenderContext ctx) {
            ctx.sendValue(compilationUnit, JS.CompilationUnit::getId);
            ctx.sendNode(compilationUnit, JS.CompilationUnit::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(compilationUnit, JS.CompilationUnit::getMarkers, ctx::sendMarkers);
            ctx.sendValue(compilationUnit, JS.CompilationUnit::getSourcePath);
            ctx.sendTypedValue(compilationUnit, JS.CompilationUnit::getFileAttributes);
            ctx.sendValue(compilationUnit, e -> e.getCharset() != null ? e.getCharset().name() : "UTF-8");
            ctx.sendValue(compilationUnit, JS.CompilationUnit::isCharsetBomMarked);
            ctx.sendTypedValue(compilationUnit, JS.CompilationUnit::getChecksum);
            ctx.sendNodes(compilationUnit, e -> e.getPadding().getImports(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            ctx.sendNodes(compilationUnit, e -> e.getPadding().getStatements(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            ctx.sendNode(compilationUnit, JS.CompilationUnit::getEof, JavaScriptSender::sendSpace);
            return compilationUnit;
        }

        @Override
        public JS.Alias visitAlias(JS.Alias alias, SenderContext ctx) {
            ctx.sendValue(alias, JS.Alias::getId);
            ctx.sendNode(alias, JS.Alias::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(alias, JS.Alias::getMarkers, ctx::sendMarkers);
            ctx.sendNode(alias, e -> e.getPadding().getPropertyName(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(alias, JS.Alias::getAlias, ctx::sendTree);
            return alias;
        }

        @Override
        public JS.ArrowFunction visitArrowFunction(JS.ArrowFunction arrowFunction, SenderContext ctx) {
            ctx.sendValue(arrowFunction, JS.ArrowFunction::getId);
            ctx.sendNode(arrowFunction, JS.ArrowFunction::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(arrowFunction, JS.ArrowFunction::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(arrowFunction, JS.ArrowFunction::getLeadingAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNodes(arrowFunction, JS.ArrowFunction::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(arrowFunction, JS.ArrowFunction::getTypeParameters, ctx::sendTree);
            ctx.sendNode(arrowFunction, JS.ArrowFunction::getParameters, ctx::sendTree);
            ctx.sendNode(arrowFunction, JS.ArrowFunction::getReturnTypeExpression, ctx::sendTree);
            ctx.sendNode(arrowFunction, e -> e.getPadding().getBody(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(arrowFunction, JS.ArrowFunction::getType);
            return arrowFunction;
        }

        @Override
        public JS.Await visitAwait(JS.Await await, SenderContext ctx) {
            ctx.sendValue(await, JS.Await::getId);
            ctx.sendNode(await, JS.Await::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(await, JS.Await::getMarkers, ctx::sendMarkers);
            ctx.sendNode(await, JS.Await::getExpression, ctx::sendTree);
            ctx.sendTypedValue(await, JS.Await::getType);
            return await;
        }

        @Override
        public JS.ConditionalType visitConditionalType(JS.ConditionalType conditionalType, SenderContext ctx) {
            ctx.sendValue(conditionalType, JS.ConditionalType::getId);
            ctx.sendNode(conditionalType, JS.ConditionalType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(conditionalType, JS.ConditionalType::getMarkers, ctx::sendMarkers);
            ctx.sendNode(conditionalType, JS.ConditionalType::getCheckType, ctx::sendTree);
            ctx.sendNode(conditionalType, e -> e.getPadding().getCondition(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(conditionalType, JS.ConditionalType::getType);
            return conditionalType;
        }

        @Override
        public JS.DefaultType visitDefaultType(JS.DefaultType defaultType, SenderContext ctx) {
            ctx.sendValue(defaultType, JS.DefaultType::getId);
            ctx.sendNode(defaultType, JS.DefaultType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(defaultType, JS.DefaultType::getMarkers, ctx::sendMarkers);
            ctx.sendNode(defaultType, JS.DefaultType::getLeft, ctx::sendTree);
            ctx.sendNode(defaultType, JS.DefaultType::getBeforeEquals, JavaScriptSender::sendSpace);
            ctx.sendNode(defaultType, JS.DefaultType::getRight, ctx::sendTree);
            ctx.sendTypedValue(defaultType, JS.DefaultType::getType);
            return defaultType;
        }

        @Override
        public JS.Delete visitDelete(JS.Delete delete, SenderContext ctx) {
            ctx.sendValue(delete, JS.Delete::getId);
            ctx.sendNode(delete, JS.Delete::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(delete, JS.Delete::getMarkers, ctx::sendMarkers);
            ctx.sendNode(delete, JS.Delete::getExpression, ctx::sendTree);
            ctx.sendTypedValue(delete, JS.Delete::getType);
            return delete;
        }

        @Override
        public JS.Export visitExport(JS.Export export, SenderContext ctx) {
            ctx.sendValue(export, JS.Export::getId);
            ctx.sendNode(export, JS.Export::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(export, JS.Export::getMarkers, ctx::sendMarkers);
            ctx.sendNode(export, e -> e.getPadding().getExports(), JavaScriptSender::sendContainer);
            ctx.sendNode(export, JS.Export::getFrom, JavaScriptSender::sendSpace);
            ctx.sendNode(export, JS.Export::getTarget, ctx::sendTree);
            ctx.sendNode(export, e -> e.getPadding().getInitializer(), JavaScriptSender::sendLeftPadded);
            return export;
        }

        @Override
        public JS.ExpressionStatement visitExpressionStatement(JS.ExpressionStatement expressionStatement, SenderContext ctx) {
            ctx.sendValue(expressionStatement, JS.ExpressionStatement::getId);
            ctx.sendNode(expressionStatement, JS.ExpressionStatement::getExpression, ctx::sendTree);
            return expressionStatement;
        }

        @Override
        public JS.TrailingTokenStatement visitTrailingTokenStatement(JS.TrailingTokenStatement trailingTokenStatement, SenderContext ctx) {
            ctx.sendValue(trailingTokenStatement, JS.TrailingTokenStatement::getId);
            ctx.sendNode(trailingTokenStatement, JS.TrailingTokenStatement::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(trailingTokenStatement, JS.TrailingTokenStatement::getMarkers, ctx::sendMarkers);
            ctx.sendNode(trailingTokenStatement, e -> e.getPadding().getExpression(), JavaScriptSender::sendRightPadded);
            ctx.sendTypedValue(trailingTokenStatement, JS.TrailingTokenStatement::getType);
            return trailingTokenStatement;
        }

        @Override
        public JS.ExpressionWithTypeArguments visitExpressionWithTypeArguments(JS.ExpressionWithTypeArguments expressionWithTypeArguments, SenderContext ctx) {
            ctx.sendValue(expressionWithTypeArguments, JS.ExpressionWithTypeArguments::getId);
            ctx.sendNode(expressionWithTypeArguments, JS.ExpressionWithTypeArguments::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(expressionWithTypeArguments, JS.ExpressionWithTypeArguments::getMarkers, ctx::sendMarkers);
            ctx.sendNode(expressionWithTypeArguments, JS.ExpressionWithTypeArguments::getClazz, ctx::sendTree);
            ctx.sendNode(expressionWithTypeArguments, e -> e.getPadding().getTypeArguments(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(expressionWithTypeArguments, JS.ExpressionWithTypeArguments::getType);
            return expressionWithTypeArguments;
        }

        @Override
        public JS.FunctionType visitFunctionType(JS.FunctionType functionType, SenderContext ctx) {
            ctx.sendValue(functionType, JS.FunctionType::getId);
            ctx.sendNode(functionType, JS.FunctionType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(functionType, JS.FunctionType::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(functionType, JS.FunctionType::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(functionType, e -> e.getPadding().getConstructorType(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(functionType, JS.FunctionType::getTypeParameters, ctx::sendTree);
            ctx.sendNode(functionType, e -> e.getPadding().getParameters(), JavaScriptSender::sendContainer);
            ctx.sendNode(functionType, e -> e.getPadding().getReturnType(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(functionType, JS.FunctionType::getType);
            return functionType;
        }

        @Override
        public JS.InferType visitInferType(JS.InferType inferType, SenderContext ctx) {
            ctx.sendValue(inferType, JS.InferType::getId);
            ctx.sendNode(inferType, JS.InferType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(inferType, JS.InferType::getMarkers, ctx::sendMarkers);
            ctx.sendNode(inferType, e -> e.getPadding().getTypeParameter(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(inferType, JS.InferType::getType);
            return inferType;
        }

        @Override
        public JS.ImportType visitImportType(JS.ImportType importType, SenderContext ctx) {
            ctx.sendValue(importType, JS.ImportType::getId);
            ctx.sendNode(importType, JS.ImportType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(importType, JS.ImportType::getMarkers, ctx::sendMarkers);
            ctx.sendNode(importType, e -> e.getPadding().getHasTypeof(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(importType, e -> e.getPadding().getArgumentAndAttributes(), JavaScriptSender::sendContainer);
            ctx.sendNode(importType, e -> e.getPadding().getQualifier(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(importType, e -> e.getPadding().getTypeArguments(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(importType, JS.ImportType::getType);
            return importType;
        }

        @Override
        public JS.JsImport visitJsImport(JS.JsImport jsImport, SenderContext ctx) {
            ctx.sendValue(jsImport, JS.JsImport::getId);
            ctx.sendNode(jsImport, JS.JsImport::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jsImport, JS.JsImport::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(jsImport, JS.JsImport::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(jsImport, JS.JsImport::getImportClause, ctx::sendTree);
            ctx.sendNode(jsImport, e -> e.getPadding().getModuleSpecifier(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(jsImport, JS.JsImport::getAttributes, ctx::sendTree);
            return jsImport;
        }

        @Override
        public JS.JsImportClause visitJsImportClause(JS.JsImportClause jsImportClause, SenderContext ctx) {
            ctx.sendValue(jsImportClause, JS.JsImportClause::getId);
            ctx.sendNode(jsImportClause, JS.JsImportClause::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jsImportClause, JS.JsImportClause::getMarkers, ctx::sendMarkers);
            ctx.sendValue(jsImportClause, JS.JsImportClause::isTypeOnly);
            ctx.sendNode(jsImportClause, e -> e.getPadding().getName(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(jsImportClause, JS.JsImportClause::getNamedBindings, ctx::sendTree);
            return jsImportClause;
        }

        @Override
        public JS.NamedImports visitNamedImports(JS.NamedImports namedImports, SenderContext ctx) {
            ctx.sendValue(namedImports, JS.NamedImports::getId);
            ctx.sendNode(namedImports, JS.NamedImports::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(namedImports, JS.NamedImports::getMarkers, ctx::sendMarkers);
            ctx.sendNode(namedImports, e -> e.getPadding().getElements(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(namedImports, JS.NamedImports::getType);
            return namedImports;
        }

        @Override
        public JS.JsImportSpecifier visitJsImportSpecifier(JS.JsImportSpecifier jsImportSpecifier, SenderContext ctx) {
            ctx.sendValue(jsImportSpecifier, JS.JsImportSpecifier::getId);
            ctx.sendNode(jsImportSpecifier, JS.JsImportSpecifier::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jsImportSpecifier, JS.JsImportSpecifier::getMarkers, ctx::sendMarkers);
            ctx.sendNode(jsImportSpecifier, e -> e.getPadding().getImportType(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(jsImportSpecifier, JS.JsImportSpecifier::getSpecifier, ctx::sendTree);
            ctx.sendTypedValue(jsImportSpecifier, JS.JsImportSpecifier::getType);
            return jsImportSpecifier;
        }

        @Override
        public JS.ImportAttributes visitImportAttributes(JS.ImportAttributes importAttributes, SenderContext ctx) {
            ctx.sendValue(importAttributes, JS.ImportAttributes::getId);
            ctx.sendNode(importAttributes, JS.ImportAttributes::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(importAttributes, JS.ImportAttributes::getMarkers, ctx::sendMarkers);
            ctx.sendValue(importAttributes, JS.ImportAttributes::getToken);
            ctx.sendNode(importAttributes, e -> e.getPadding().getElements(), JavaScriptSender::sendContainer);
            return importAttributes;
        }

        @Override
        public JS.ImportTypeAttributes visitImportTypeAttributes(JS.ImportTypeAttributes importTypeAttributes, SenderContext ctx) {
            ctx.sendValue(importTypeAttributes, JS.ImportTypeAttributes::getId);
            ctx.sendNode(importTypeAttributes, JS.ImportTypeAttributes::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(importTypeAttributes, JS.ImportTypeAttributes::getMarkers, ctx::sendMarkers);
            ctx.sendNode(importTypeAttributes, e -> e.getPadding().getToken(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(importTypeAttributes, e -> e.getPadding().getElements(), JavaScriptSender::sendContainer);
            ctx.sendNode(importTypeAttributes, JS.ImportTypeAttributes::getEnd, JavaScriptSender::sendSpace);
            return importTypeAttributes;
        }

        @Override
        public JS.ImportAttribute visitImportAttribute(JS.ImportAttribute importAttribute, SenderContext ctx) {
            ctx.sendValue(importAttribute, JS.ImportAttribute::getId);
            ctx.sendNode(importAttribute, JS.ImportAttribute::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(importAttribute, JS.ImportAttribute::getMarkers, ctx::sendMarkers);
            ctx.sendNode(importAttribute, JS.ImportAttribute::getName, ctx::sendTree);
            ctx.sendNode(importAttribute, e -> e.getPadding().getValue(), JavaScriptSender::sendLeftPadded);
            return importAttribute;
        }

        @Override
        public JS.JsBinary visitJsBinary(JS.JsBinary jsBinary, SenderContext ctx) {
            ctx.sendValue(jsBinary, JS.JsBinary::getId);
            ctx.sendNode(jsBinary, JS.JsBinary::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jsBinary, JS.JsBinary::getMarkers, ctx::sendMarkers);
            ctx.sendNode(jsBinary, JS.JsBinary::getLeft, ctx::sendTree);
            ctx.sendNode(jsBinary, e -> e.getPadding().getOperator(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(jsBinary, JS.JsBinary::getRight, ctx::sendTree);
            ctx.sendTypedValue(jsBinary, JS.JsBinary::getType);
            return jsBinary;
        }

        @Override
        public JS.LiteralType visitLiteralType(JS.LiteralType literalType, SenderContext ctx) {
            ctx.sendValue(literalType, JS.LiteralType::getId);
            ctx.sendNode(literalType, JS.LiteralType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(literalType, JS.LiteralType::getMarkers, ctx::sendMarkers);
            ctx.sendNode(literalType, JS.LiteralType::getLiteral, ctx::sendTree);
            ctx.sendTypedValue(literalType, JS.LiteralType::getType);
            return literalType;
        }

        @Override
        public JS.MappedType visitMappedType(JS.MappedType mappedType, SenderContext ctx) {
            ctx.sendValue(mappedType, JS.MappedType::getId);
            ctx.sendNode(mappedType, JS.MappedType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(mappedType, JS.MappedType::getMarkers, ctx::sendMarkers);
            ctx.sendNode(mappedType, e -> e.getPadding().getPrefixToken(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(mappedType, e -> e.getPadding().getHasReadonly(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(mappedType, JS.MappedType::getKeysRemapping, ctx::sendTree);
            ctx.sendNode(mappedType, e -> e.getPadding().getSuffixToken(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(mappedType, e -> e.getPadding().getHasQuestionToken(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(mappedType, e -> e.getPadding().getValueType(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(mappedType, JS.MappedType::getType);
            return mappedType;
        }

        @Override
        public JS.MappedType.KeysRemapping visitMappedTypeKeysRemapping(JS.MappedType.KeysRemapping keysRemapping, SenderContext ctx) {
            ctx.sendValue(keysRemapping, JS.MappedType.KeysRemapping::getId);
            ctx.sendNode(keysRemapping, JS.MappedType.KeysRemapping::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(keysRemapping, JS.MappedType.KeysRemapping::getMarkers, ctx::sendMarkers);
            ctx.sendNode(keysRemapping, e -> e.getPadding().getTypeParameter(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(keysRemapping, e -> e.getPadding().getNameType(), JavaScriptSender::sendRightPadded);
            return keysRemapping;
        }

        @Override
        public JS.MappedType.MappedTypeParameter visitMappedTypeMappedTypeParameter(JS.MappedType.MappedTypeParameter mappedTypeParameter, SenderContext ctx) {
            ctx.sendValue(mappedTypeParameter, JS.MappedType.MappedTypeParameter::getId);
            ctx.sendNode(mappedTypeParameter, JS.MappedType.MappedTypeParameter::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(mappedTypeParameter, JS.MappedType.MappedTypeParameter::getMarkers, ctx::sendMarkers);
            ctx.sendNode(mappedTypeParameter, JS.MappedType.MappedTypeParameter::getName, ctx::sendTree);
            ctx.sendNode(mappedTypeParameter, e -> e.getPadding().getIterateType(), JavaScriptSender::sendLeftPadded);
            return mappedTypeParameter;
        }

        @Override
        public JS.ObjectBindingDeclarations visitObjectBindingDeclarations(JS.ObjectBindingDeclarations objectBindingDeclarations, SenderContext ctx) {
            ctx.sendValue(objectBindingDeclarations, JS.ObjectBindingDeclarations::getId);
            ctx.sendNode(objectBindingDeclarations, JS.ObjectBindingDeclarations::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(objectBindingDeclarations, JS.ObjectBindingDeclarations::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(objectBindingDeclarations, JS.ObjectBindingDeclarations::getLeadingAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNodes(objectBindingDeclarations, JS.ObjectBindingDeclarations::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(objectBindingDeclarations, JS.ObjectBindingDeclarations::getTypeExpression, ctx::sendTree);
            ctx.sendNode(objectBindingDeclarations, e -> e.getPadding().getBindings(), JavaScriptSender::sendContainer);
            ctx.sendNode(objectBindingDeclarations, e -> e.getPadding().getInitializer(), JavaScriptSender::sendLeftPadded);
            return objectBindingDeclarations;
        }

        @Override
        public JS.PropertyAssignment visitPropertyAssignment(JS.PropertyAssignment propertyAssignment, SenderContext ctx) {
            ctx.sendValue(propertyAssignment, JS.PropertyAssignment::getId);
            ctx.sendNode(propertyAssignment, JS.PropertyAssignment::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(propertyAssignment, JS.PropertyAssignment::getMarkers, ctx::sendMarkers);
            ctx.sendNode(propertyAssignment, e -> e.getPadding().getName(), JavaScriptSender::sendRightPadded);
            ctx.sendValue(propertyAssignment, JS.PropertyAssignment::getAssigmentToken);
            ctx.sendNode(propertyAssignment, JS.PropertyAssignment::getInitializer, ctx::sendTree);
            return propertyAssignment;
        }

        @Override
        public JS.SatisfiesExpression visitSatisfiesExpression(JS.SatisfiesExpression satisfiesExpression, SenderContext ctx) {
            ctx.sendValue(satisfiesExpression, JS.SatisfiesExpression::getId);
            ctx.sendNode(satisfiesExpression, JS.SatisfiesExpression::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(satisfiesExpression, JS.SatisfiesExpression::getMarkers, ctx::sendMarkers);
            ctx.sendNode(satisfiesExpression, JS.SatisfiesExpression::getExpression, ctx::sendTree);
            ctx.sendNode(satisfiesExpression, e -> e.getPadding().getSatisfiesType(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(satisfiesExpression, JS.SatisfiesExpression::getType);
            return satisfiesExpression;
        }

        @Override
        public JS.ScopedVariableDeclarations visitScopedVariableDeclarations(JS.ScopedVariableDeclarations scopedVariableDeclarations, SenderContext ctx) {
            ctx.sendValue(scopedVariableDeclarations, JS.ScopedVariableDeclarations::getId);
            ctx.sendNode(scopedVariableDeclarations, JS.ScopedVariableDeclarations::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(scopedVariableDeclarations, JS.ScopedVariableDeclarations::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(scopedVariableDeclarations, JS.ScopedVariableDeclarations::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(scopedVariableDeclarations, e -> e.getPadding().getScope(), JavaScriptSender::sendLeftPadded);
            ctx.sendNodes(scopedVariableDeclarations, e -> e.getPadding().getVariables(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            return scopedVariableDeclarations;
        }

        @Override
        public JS.StatementExpression visitStatementExpression(JS.StatementExpression statementExpression, SenderContext ctx) {
            ctx.sendValue(statementExpression, JS.StatementExpression::getId);
            ctx.sendNode(statementExpression, JS.StatementExpression::getStatement, ctx::sendTree);
            return statementExpression;
        }

        @Override
        public JS.WithStatement visitWithStatement(JS.WithStatement withStatement, SenderContext ctx) {
            ctx.sendValue(withStatement, JS.WithStatement::getId);
            ctx.sendNode(withStatement, JS.WithStatement::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(withStatement, JS.WithStatement::getMarkers, ctx::sendMarkers);
            ctx.sendNode(withStatement, JS.WithStatement::getExpression, ctx::sendTree);
            ctx.sendNode(withStatement, e -> e.getPadding().getBody(), JavaScriptSender::sendRightPadded);
            return withStatement;
        }

        @Override
        public JS.TaggedTemplateExpression visitTaggedTemplateExpression(JS.TaggedTemplateExpression taggedTemplateExpression, SenderContext ctx) {
            ctx.sendValue(taggedTemplateExpression, JS.TaggedTemplateExpression::getId);
            ctx.sendNode(taggedTemplateExpression, JS.TaggedTemplateExpression::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(taggedTemplateExpression, JS.TaggedTemplateExpression::getMarkers, ctx::sendMarkers);
            ctx.sendNode(taggedTemplateExpression, e -> e.getPadding().getTag(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(taggedTemplateExpression, e -> e.getPadding().getTypeArguments(), JavaScriptSender::sendContainer);
            ctx.sendNode(taggedTemplateExpression, JS.TaggedTemplateExpression::getTemplateExpression, ctx::sendTree);
            ctx.sendTypedValue(taggedTemplateExpression, JS.TaggedTemplateExpression::getType);
            return taggedTemplateExpression;
        }

        @Override
        public JS.TemplateExpression visitTemplateExpression(JS.TemplateExpression templateExpression, SenderContext ctx) {
            ctx.sendValue(templateExpression, JS.TemplateExpression::getId);
            ctx.sendNode(templateExpression, JS.TemplateExpression::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(templateExpression, JS.TemplateExpression::getMarkers, ctx::sendMarkers);
            ctx.sendNode(templateExpression, JS.TemplateExpression::getHead, ctx::sendTree);
            ctx.sendNodes(templateExpression, e -> e.getPadding().getTemplateSpans(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            ctx.sendTypedValue(templateExpression, JS.TemplateExpression::getType);
            return templateExpression;
        }

        @Override
        public JS.TemplateExpression.TemplateSpan visitTemplateExpressionTemplateSpan(JS.TemplateExpression.TemplateSpan templateSpan, SenderContext ctx) {
            ctx.sendValue(templateSpan, JS.TemplateExpression.TemplateSpan::getId);
            ctx.sendNode(templateSpan, JS.TemplateExpression.TemplateSpan::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(templateSpan, JS.TemplateExpression.TemplateSpan::getMarkers, ctx::sendMarkers);
            ctx.sendNode(templateSpan, JS.TemplateExpression.TemplateSpan::getExpression, ctx::sendTree);
            ctx.sendNode(templateSpan, JS.TemplateExpression.TemplateSpan::getTail, ctx::sendTree);
            return templateSpan;
        }

        @Override
        public JS.Tuple visitTuple(JS.Tuple tuple, SenderContext ctx) {
            ctx.sendValue(tuple, JS.Tuple::getId);
            ctx.sendNode(tuple, JS.Tuple::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(tuple, JS.Tuple::getMarkers, ctx::sendMarkers);
            ctx.sendNode(tuple, e -> e.getPadding().getElements(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(tuple, JS.Tuple::getType);
            return tuple;
        }

        @Override
        public JS.TypeDeclaration visitTypeDeclaration(JS.TypeDeclaration typeDeclaration, SenderContext ctx) {
            ctx.sendValue(typeDeclaration, JS.TypeDeclaration::getId);
            ctx.sendNode(typeDeclaration, JS.TypeDeclaration::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(typeDeclaration, JS.TypeDeclaration::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(typeDeclaration, JS.TypeDeclaration::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(typeDeclaration, e -> e.getPadding().getName(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(typeDeclaration, JS.TypeDeclaration::getTypeParameters, ctx::sendTree);
            ctx.sendNode(typeDeclaration, e -> e.getPadding().getInitializer(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(typeDeclaration, JS.TypeDeclaration::getType);
            return typeDeclaration;
        }

        @Override
        public JS.TypeOf visitTypeOf(JS.TypeOf typeOf, SenderContext ctx) {
            ctx.sendValue(typeOf, JS.TypeOf::getId);
            ctx.sendNode(typeOf, JS.TypeOf::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(typeOf, JS.TypeOf::getMarkers, ctx::sendMarkers);
            ctx.sendNode(typeOf, JS.TypeOf::getExpression, ctx::sendTree);
            ctx.sendTypedValue(typeOf, JS.TypeOf::getType);
            return typeOf;
        }

        @Override
        public JS.TypeQuery visitTypeQuery(JS.TypeQuery typeQuery, SenderContext ctx) {
            ctx.sendValue(typeQuery, JS.TypeQuery::getId);
            ctx.sendNode(typeQuery, JS.TypeQuery::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(typeQuery, JS.TypeQuery::getMarkers, ctx::sendMarkers);
            ctx.sendNode(typeQuery, JS.TypeQuery::getTypeExpression, ctx::sendTree);
            ctx.sendNode(typeQuery, e -> e.getPadding().getTypeArguments(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(typeQuery, JS.TypeQuery::getType);
            return typeQuery;
        }

        @Override
        public JS.TypeOperator visitTypeOperator(JS.TypeOperator typeOperator, SenderContext ctx) {
            ctx.sendValue(typeOperator, JS.TypeOperator::getId);
            ctx.sendNode(typeOperator, JS.TypeOperator::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(typeOperator, JS.TypeOperator::getMarkers, ctx::sendMarkers);
            ctx.sendValue(typeOperator, JS.TypeOperator::getOperator);
            ctx.sendNode(typeOperator, e -> e.getPadding().getExpression(), JavaScriptSender::sendLeftPadded);
            return typeOperator;
        }

        @Override
        public JS.TypePredicate visitTypePredicate(JS.TypePredicate typePredicate, SenderContext ctx) {
            ctx.sendValue(typePredicate, JS.TypePredicate::getId);
            ctx.sendNode(typePredicate, JS.TypePredicate::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(typePredicate, JS.TypePredicate::getMarkers, ctx::sendMarkers);
            ctx.sendNode(typePredicate, e -> e.getPadding().getAsserts(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(typePredicate, JS.TypePredicate::getParameterName, ctx::sendTree);
            ctx.sendNode(typePredicate, e -> e.getPadding().getExpression(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(typePredicate, JS.TypePredicate::getType);
            return typePredicate;
        }

        @Override
        public JS.Unary visitUnary(JS.Unary unary, SenderContext ctx) {
            ctx.sendValue(unary, JS.Unary::getId);
            ctx.sendNode(unary, JS.Unary::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(unary, JS.Unary::getMarkers, ctx::sendMarkers);
            ctx.sendNode(unary, e -> e.getPadding().getOperator(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(unary, JS.Unary::getExpression, ctx::sendTree);
            ctx.sendTypedValue(unary, JS.Unary::getType);
            return unary;
        }

        @Override
        public JS.Union visitUnion(JS.Union union, SenderContext ctx) {
            ctx.sendValue(union, JS.Union::getId);
            ctx.sendNode(union, JS.Union::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(union, JS.Union::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(union, e -> e.getPadding().getTypes(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            ctx.sendTypedValue(union, JS.Union::getType);
            return union;
        }

        @Override
        public JS.Intersection visitIntersection(JS.Intersection intersection, SenderContext ctx) {
            ctx.sendValue(intersection, JS.Intersection::getId);
            ctx.sendNode(intersection, JS.Intersection::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(intersection, JS.Intersection::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(intersection, e -> e.getPadding().getTypes(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            ctx.sendTypedValue(intersection, JS.Intersection::getType);
            return intersection;
        }

        @Override
        public JS.Void visitVoid(JS.Void void_, SenderContext ctx) {
            ctx.sendValue(void_, JS.Void::getId);
            ctx.sendNode(void_, JS.Void::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(void_, JS.Void::getMarkers, ctx::sendMarkers);
            ctx.sendNode(void_, JS.Void::getExpression, ctx::sendTree);
            return void_;
        }

        @Override
        public JS.Yield visitYield(JS.Yield yield, SenderContext ctx) {
            ctx.sendValue(yield, JS.Yield::getId);
            ctx.sendNode(yield, JS.Yield::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(yield, JS.Yield::getMarkers, ctx::sendMarkers);
            ctx.sendNode(yield, e -> e.getPadding().getDelegated(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(yield, JS.Yield::getExpression, ctx::sendTree);
            ctx.sendTypedValue(yield, JS.Yield::getType);
            return yield;
        }

        @Override
        public JS.TypeInfo visitTypeInfo(JS.TypeInfo typeInfo, SenderContext ctx) {
            ctx.sendValue(typeInfo, JS.TypeInfo::getId);
            ctx.sendNode(typeInfo, JS.TypeInfo::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(typeInfo, JS.TypeInfo::getMarkers, ctx::sendMarkers);
            ctx.sendNode(typeInfo, JS.TypeInfo::getTypeIdentifier, ctx::sendTree);
            return typeInfo;
        }

        @Override
        public JS.JSVariableDeclarations visitJSVariableDeclarations(JS.JSVariableDeclarations jSVariableDeclarations, SenderContext ctx) {
            ctx.sendValue(jSVariableDeclarations, JS.JSVariableDeclarations::getId);
            ctx.sendNode(jSVariableDeclarations, JS.JSVariableDeclarations::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jSVariableDeclarations, JS.JSVariableDeclarations::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(jSVariableDeclarations, JS.JSVariableDeclarations::getLeadingAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNodes(jSVariableDeclarations, JS.JSVariableDeclarations::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(jSVariableDeclarations, JS.JSVariableDeclarations::getTypeExpression, ctx::sendTree);
            ctx.sendNode(jSVariableDeclarations, JS.JSVariableDeclarations::getVarargs, JavaScriptSender::sendSpace);
            ctx.sendNodes(jSVariableDeclarations, e -> e.getPadding().getVariables(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            return jSVariableDeclarations;
        }

        @Override
        public JS.JSVariableDeclarations.JSNamedVariable visitJSVariableDeclarationsJSNamedVariable(JS.JSVariableDeclarations.JSNamedVariable jSNamedVariable, SenderContext ctx) {
            ctx.sendValue(jSNamedVariable, JS.JSVariableDeclarations.JSNamedVariable::getId);
            ctx.sendNode(jSNamedVariable, JS.JSVariableDeclarations.JSNamedVariable::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jSNamedVariable, JS.JSVariableDeclarations.JSNamedVariable::getMarkers, ctx::sendMarkers);
            ctx.sendNode(jSNamedVariable, JS.JSVariableDeclarations.JSNamedVariable::getName, ctx::sendTree);
            ctx.sendNodes(jSNamedVariable, JS.JSVariableDeclarations.JSNamedVariable::getDimensionsAfterName, JavaScriptSender::sendLeftPadded, Function.identity());
            ctx.sendNode(jSNamedVariable, e -> e.getPadding().getInitializer(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(jSNamedVariable, JS.JSVariableDeclarations.JSNamedVariable::getVariableType);
            return jSNamedVariable;
        }

        @Override
        public JS.JSMethodDeclaration visitJSMethodDeclaration(JS.JSMethodDeclaration jSMethodDeclaration, SenderContext ctx) {
            ctx.sendValue(jSMethodDeclaration, JS.JSMethodDeclaration::getId);
            ctx.sendNode(jSMethodDeclaration, JS.JSMethodDeclaration::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jSMethodDeclaration, JS.JSMethodDeclaration::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(jSMethodDeclaration, JS.JSMethodDeclaration::getLeadingAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNodes(jSMethodDeclaration, JS.JSMethodDeclaration::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(jSMethodDeclaration, JS.JSMethodDeclaration::getTypeParameters, ctx::sendTree);
            ctx.sendNode(jSMethodDeclaration, JS.JSMethodDeclaration::getReturnTypeExpression, ctx::sendTree);
            ctx.sendNode(jSMethodDeclaration, JS.JSMethodDeclaration::getName, ctx::sendTree);
            ctx.sendNode(jSMethodDeclaration, e -> e.getPadding().getParameters(), JavaScriptSender::sendContainer);
            ctx.sendNode(jSMethodDeclaration, e -> e.getPadding().getThrowz(), JavaScriptSender::sendContainer);
            ctx.sendNode(jSMethodDeclaration, JS.JSMethodDeclaration::getBody, ctx::sendTree);
            ctx.sendNode(jSMethodDeclaration, e -> e.getPadding().getDefaultValue(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(jSMethodDeclaration, JS.JSMethodDeclaration::getMethodType);
            return jSMethodDeclaration;
        }

        @Override
        public JS.JSForOfLoop visitJSForOfLoop(JS.JSForOfLoop jSForOfLoop, SenderContext ctx) {
            ctx.sendValue(jSForOfLoop, JS.JSForOfLoop::getId);
            ctx.sendNode(jSForOfLoop, JS.JSForOfLoop::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jSForOfLoop, JS.JSForOfLoop::getMarkers, ctx::sendMarkers);
            ctx.sendNode(jSForOfLoop, e -> e.getPadding().getAwait(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(jSForOfLoop, JS.JSForOfLoop::getControl, ctx::sendTree);
            ctx.sendNode(jSForOfLoop, e -> e.getPadding().getBody(), JavaScriptSender::sendRightPadded);
            return jSForOfLoop;
        }

        @Override
        public JS.JSForInLoop visitJSForInLoop(JS.JSForInLoop jSForInLoop, SenderContext ctx) {
            ctx.sendValue(jSForInLoop, JS.JSForInLoop::getId);
            ctx.sendNode(jSForInLoop, JS.JSForInLoop::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jSForInLoop, JS.JSForInLoop::getMarkers, ctx::sendMarkers);
            ctx.sendNode(jSForInLoop, JS.JSForInLoop::getControl, ctx::sendTree);
            ctx.sendNode(jSForInLoop, e -> e.getPadding().getBody(), JavaScriptSender::sendRightPadded);
            return jSForInLoop;
        }

        @Override
        public JS.JSForInOfLoopControl visitJSForInOfLoopControl(JS.JSForInOfLoopControl jSForInOfLoopControl, SenderContext ctx) {
            ctx.sendValue(jSForInOfLoopControl, JS.JSForInOfLoopControl::getId);
            ctx.sendNode(jSForInOfLoopControl, JS.JSForInOfLoopControl::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jSForInOfLoopControl, JS.JSForInOfLoopControl::getMarkers, ctx::sendMarkers);
            ctx.sendNode(jSForInOfLoopControl, e -> e.getPadding().getVariable(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(jSForInOfLoopControl, e -> e.getPadding().getIterable(), JavaScriptSender::sendRightPadded);
            return jSForInOfLoopControl;
        }

        @Override
        public JS.JSTry visitJSTry(JS.JSTry jSTry, SenderContext ctx) {
            ctx.sendValue(jSTry, JS.JSTry::getId);
            ctx.sendNode(jSTry, JS.JSTry::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jSTry, JS.JSTry::getMarkers, ctx::sendMarkers);
            ctx.sendNode(jSTry, JS.JSTry::getBody, ctx::sendTree);
            ctx.sendNode(jSTry, JS.JSTry::getCatches, ctx::sendTree);
            ctx.sendNode(jSTry, e -> e.getPadding().getFinallie(), JavaScriptSender::sendLeftPadded);
            return jSTry;
        }

        @Override
        public JS.JSTry.JSCatch visitJSTryJSCatch(JS.JSTry.JSCatch jSCatch, SenderContext ctx) {
            ctx.sendValue(jSCatch, JS.JSTry.JSCatch::getId);
            ctx.sendNode(jSCatch, JS.JSTry.JSCatch::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jSCatch, JS.JSTry.JSCatch::getMarkers, ctx::sendMarkers);
            ctx.sendNode(jSCatch, JS.JSTry.JSCatch::getParameter, ctx::sendTree);
            ctx.sendNode(jSCatch, JS.JSTry.JSCatch::getBody, ctx::sendTree);
            return jSCatch;
        }

        @Override
        public JS.NamespaceDeclaration visitNamespaceDeclaration(JS.NamespaceDeclaration namespaceDeclaration, SenderContext ctx) {
            ctx.sendValue(namespaceDeclaration, JS.NamespaceDeclaration::getId);
            ctx.sendNode(namespaceDeclaration, JS.NamespaceDeclaration::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(namespaceDeclaration, JS.NamespaceDeclaration::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(namespaceDeclaration, JS.NamespaceDeclaration::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(namespaceDeclaration, e -> e.getPadding().getKeywordType(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(namespaceDeclaration, e -> e.getPadding().getName(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(namespaceDeclaration, JS.NamespaceDeclaration::getBody, ctx::sendTree);
            return namespaceDeclaration;
        }

        @Override
        public JS.FunctionDeclaration visitFunctionDeclaration(JS.FunctionDeclaration functionDeclaration, SenderContext ctx) {
            ctx.sendValue(functionDeclaration, JS.FunctionDeclaration::getId);
            ctx.sendNode(functionDeclaration, JS.FunctionDeclaration::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(functionDeclaration, JS.FunctionDeclaration::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(functionDeclaration, JS.FunctionDeclaration::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(functionDeclaration, e -> e.getPadding().getAsteriskToken(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(functionDeclaration, e -> e.getPadding().getName(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(functionDeclaration, JS.FunctionDeclaration::getTypeParameters, ctx::sendTree);
            ctx.sendNode(functionDeclaration, e -> e.getPadding().getParameters(), JavaScriptSender::sendContainer);
            ctx.sendNode(functionDeclaration, JS.FunctionDeclaration::getReturnTypeExpression, ctx::sendTree);
            ctx.sendNode(functionDeclaration, JS.FunctionDeclaration::getBody, ctx::sendTree);
            ctx.sendTypedValue(functionDeclaration, JS.FunctionDeclaration::getType);
            return functionDeclaration;
        }

        @Override
        public JS.TypeLiteral visitTypeLiteral(JS.TypeLiteral typeLiteral, SenderContext ctx) {
            ctx.sendValue(typeLiteral, JS.TypeLiteral::getId);
            ctx.sendNode(typeLiteral, JS.TypeLiteral::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(typeLiteral, JS.TypeLiteral::getMarkers, ctx::sendMarkers);
            ctx.sendNode(typeLiteral, JS.TypeLiteral::getMembers, ctx::sendTree);
            ctx.sendTypedValue(typeLiteral, JS.TypeLiteral::getType);
            return typeLiteral;
        }

        @Override
        public JS.IndexSignatureDeclaration visitIndexSignatureDeclaration(JS.IndexSignatureDeclaration indexSignatureDeclaration, SenderContext ctx) {
            ctx.sendValue(indexSignatureDeclaration, JS.IndexSignatureDeclaration::getId);
            ctx.sendNode(indexSignatureDeclaration, JS.IndexSignatureDeclaration::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(indexSignatureDeclaration, JS.IndexSignatureDeclaration::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(indexSignatureDeclaration, JS.IndexSignatureDeclaration::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(indexSignatureDeclaration, e -> e.getPadding().getParameters(), JavaScriptSender::sendContainer);
            ctx.sendNode(indexSignatureDeclaration, e -> e.getPadding().getTypeExpression(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(indexSignatureDeclaration, JS.IndexSignatureDeclaration::getType);
            return indexSignatureDeclaration;
        }

        @Override
        public JS.ArrayBindingPattern visitArrayBindingPattern(JS.ArrayBindingPattern arrayBindingPattern, SenderContext ctx) {
            ctx.sendValue(arrayBindingPattern, JS.ArrayBindingPattern::getId);
            ctx.sendNode(arrayBindingPattern, JS.ArrayBindingPattern::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(arrayBindingPattern, JS.ArrayBindingPattern::getMarkers, ctx::sendMarkers);
            ctx.sendNode(arrayBindingPattern, e -> e.getPadding().getElements(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(arrayBindingPattern, JS.ArrayBindingPattern::getType);
            return arrayBindingPattern;
        }

        @Override
        public JS.BindingElement visitBindingElement(JS.BindingElement bindingElement, SenderContext ctx) {
            ctx.sendValue(bindingElement, JS.BindingElement::getId);
            ctx.sendNode(bindingElement, JS.BindingElement::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(bindingElement, JS.BindingElement::getMarkers, ctx::sendMarkers);
            ctx.sendNode(bindingElement, e -> e.getPadding().getPropertyName(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(bindingElement, JS.BindingElement::getName, ctx::sendTree);
            ctx.sendNode(bindingElement, e -> e.getPadding().getInitializer(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(bindingElement, JS.BindingElement::getVariableType);
            return bindingElement;
        }

        @Override
        public JS.ExportDeclaration visitExportDeclaration(JS.ExportDeclaration exportDeclaration, SenderContext ctx) {
            ctx.sendValue(exportDeclaration, JS.ExportDeclaration::getId);
            ctx.sendNode(exportDeclaration, JS.ExportDeclaration::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(exportDeclaration, JS.ExportDeclaration::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(exportDeclaration, JS.ExportDeclaration::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(exportDeclaration, e -> e.getPadding().getTypeOnly(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(exportDeclaration, JS.ExportDeclaration::getExportClause, ctx::sendTree);
            ctx.sendNode(exportDeclaration, e -> e.getPadding().getModuleSpecifier(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(exportDeclaration, JS.ExportDeclaration::getAttributes, ctx::sendTree);
            return exportDeclaration;
        }

        @Override
        public JS.ExportAssignment visitExportAssignment(JS.ExportAssignment exportAssignment, SenderContext ctx) {
            ctx.sendValue(exportAssignment, JS.ExportAssignment::getId);
            ctx.sendNode(exportAssignment, JS.ExportAssignment::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(exportAssignment, JS.ExportAssignment::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(exportAssignment, JS.ExportAssignment::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(exportAssignment, e -> e.getPadding().getExportEquals(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(exportAssignment, JS.ExportAssignment::getExpression, ctx::sendTree);
            return exportAssignment;
        }

        @Override
        public JS.NamedExports visitNamedExports(JS.NamedExports namedExports, SenderContext ctx) {
            ctx.sendValue(namedExports, JS.NamedExports::getId);
            ctx.sendNode(namedExports, JS.NamedExports::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(namedExports, JS.NamedExports::getMarkers, ctx::sendMarkers);
            ctx.sendNode(namedExports, e -> e.getPadding().getElements(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(namedExports, JS.NamedExports::getType);
            return namedExports;
        }

        @Override
        public JS.ExportSpecifier visitExportSpecifier(JS.ExportSpecifier exportSpecifier, SenderContext ctx) {
            ctx.sendValue(exportSpecifier, JS.ExportSpecifier::getId);
            ctx.sendNode(exportSpecifier, JS.ExportSpecifier::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(exportSpecifier, JS.ExportSpecifier::getMarkers, ctx::sendMarkers);
            ctx.sendNode(exportSpecifier, e -> e.getPadding().getTypeOnly(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(exportSpecifier, JS.ExportSpecifier::getSpecifier, ctx::sendTree);
            ctx.sendTypedValue(exportSpecifier, JS.ExportSpecifier::getType);
            return exportSpecifier;
        }

        @Override
        public JS.IndexedAccessType visitIndexedAccessType(JS.IndexedAccessType indexedAccessType, SenderContext ctx) {
            ctx.sendValue(indexedAccessType, JS.IndexedAccessType::getId);
            ctx.sendNode(indexedAccessType, JS.IndexedAccessType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(indexedAccessType, JS.IndexedAccessType::getMarkers, ctx::sendMarkers);
            ctx.sendNode(indexedAccessType, JS.IndexedAccessType::getObjectType, ctx::sendTree);
            ctx.sendNode(indexedAccessType, JS.IndexedAccessType::getIndexType, ctx::sendTree);
            ctx.sendTypedValue(indexedAccessType, JS.IndexedAccessType::getType);
            return indexedAccessType;
        }

        @Override
        public JS.IndexedAccessType.IndexType visitIndexedAccessTypeIndexType(JS.IndexedAccessType.IndexType indexType, SenderContext ctx) {
            ctx.sendValue(indexType, JS.IndexedAccessType.IndexType::getId);
            ctx.sendNode(indexType, JS.IndexedAccessType.IndexType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(indexType, JS.IndexedAccessType.IndexType::getMarkers, ctx::sendMarkers);
            ctx.sendNode(indexType, e -> e.getPadding().getElement(), JavaScriptSender::sendRightPadded);
            ctx.sendTypedValue(indexType, JS.IndexedAccessType.IndexType::getType);
            return indexType;
        }

        @Override
        public JS.JsAssignmentOperation visitJsAssignmentOperation(JS.JsAssignmentOperation jsAssignmentOperation, SenderContext ctx) {
            ctx.sendValue(jsAssignmentOperation, JS.JsAssignmentOperation::getId);
            ctx.sendNode(jsAssignmentOperation, JS.JsAssignmentOperation::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(jsAssignmentOperation, JS.JsAssignmentOperation::getMarkers, ctx::sendMarkers);
            ctx.sendNode(jsAssignmentOperation, JS.JsAssignmentOperation::getVariable, ctx::sendTree);
            ctx.sendNode(jsAssignmentOperation, e -> e.getPadding().getOperator(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(jsAssignmentOperation, JS.JsAssignmentOperation::getAssignment, ctx::sendTree);
            ctx.sendTypedValue(jsAssignmentOperation, JS.JsAssignmentOperation::getType);
            return jsAssignmentOperation;
        }

        @Override
        public JS.TypeTreeExpression visitTypeTreeExpression(JS.TypeTreeExpression typeTreeExpression, SenderContext ctx) {
            ctx.sendValue(typeTreeExpression, JS.TypeTreeExpression::getId);
            ctx.sendNode(typeTreeExpression, JS.TypeTreeExpression::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(typeTreeExpression, JS.TypeTreeExpression::getMarkers, ctx::sendMarkers);
            ctx.sendNode(typeTreeExpression, JS.TypeTreeExpression::getExpression, ctx::sendTree);
            return typeTreeExpression;
        }

        @Override
        public J.AnnotatedType visitAnnotatedType(J.AnnotatedType annotatedType, SenderContext ctx) {
            ctx.sendValue(annotatedType, J.AnnotatedType::getId);
            ctx.sendNode(annotatedType, J.AnnotatedType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(annotatedType, J.AnnotatedType::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(annotatedType, J.AnnotatedType::getAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNode(annotatedType, J.AnnotatedType::getTypeExpression, ctx::sendTree);
            return annotatedType;
        }

        @Override
        public J.Annotation visitAnnotation(J.Annotation annotation, SenderContext ctx) {
            ctx.sendValue(annotation, J.Annotation::getId);
            ctx.sendNode(annotation, J.Annotation::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(annotation, J.Annotation::getMarkers, ctx::sendMarkers);
            ctx.sendNode(annotation, J.Annotation::getAnnotationType, ctx::sendTree);
            ctx.sendNode(annotation, e -> e.getPadding().getArguments(), JavaScriptSender::sendContainer);
            return annotation;
        }

        @Override
        public J.ArrayAccess visitArrayAccess(J.ArrayAccess arrayAccess, SenderContext ctx) {
            ctx.sendValue(arrayAccess, J.ArrayAccess::getId);
            ctx.sendNode(arrayAccess, J.ArrayAccess::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(arrayAccess, J.ArrayAccess::getMarkers, ctx::sendMarkers);
            ctx.sendNode(arrayAccess, J.ArrayAccess::getIndexed, ctx::sendTree);
            ctx.sendNode(arrayAccess, J.ArrayAccess::getDimension, ctx::sendTree);
            ctx.sendTypedValue(arrayAccess, J.ArrayAccess::getType);
            return arrayAccess;
        }

        @Override
        public J.ArrayType visitArrayType(J.ArrayType arrayType, SenderContext ctx) {
            ctx.sendValue(arrayType, J.ArrayType::getId);
            ctx.sendNode(arrayType, J.ArrayType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(arrayType, J.ArrayType::getMarkers, ctx::sendMarkers);
            ctx.sendNode(arrayType, J.ArrayType::getElementType, ctx::sendTree);
            ctx.sendNodes(arrayType, J.ArrayType::getAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNode(arrayType, J.ArrayType::getDimension, JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(arrayType, J.ArrayType::getType);
            return arrayType;
        }

        @Override
        public J.Assert visitAssert(J.Assert assert_, SenderContext ctx) {
            ctx.sendValue(assert_, J.Assert::getId);
            ctx.sendNode(assert_, J.Assert::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(assert_, J.Assert::getMarkers, ctx::sendMarkers);
            ctx.sendNode(assert_, J.Assert::getCondition, ctx::sendTree);
            ctx.sendNode(assert_, J.Assert::getDetail, JavaScriptSender::sendLeftPadded);
            return assert_;
        }

        @Override
        public J.Assignment visitAssignment(J.Assignment assignment, SenderContext ctx) {
            ctx.sendValue(assignment, J.Assignment::getId);
            ctx.sendNode(assignment, J.Assignment::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(assignment, J.Assignment::getMarkers, ctx::sendMarkers);
            ctx.sendNode(assignment, J.Assignment::getVariable, ctx::sendTree);
            ctx.sendNode(assignment, e -> e.getPadding().getAssignment(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(assignment, J.Assignment::getType);
            return assignment;
        }

        @Override
        public J.AssignmentOperation visitAssignmentOperation(J.AssignmentOperation assignmentOperation, SenderContext ctx) {
            ctx.sendValue(assignmentOperation, J.AssignmentOperation::getId);
            ctx.sendNode(assignmentOperation, J.AssignmentOperation::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(assignmentOperation, J.AssignmentOperation::getMarkers, ctx::sendMarkers);
            ctx.sendNode(assignmentOperation, J.AssignmentOperation::getVariable, ctx::sendTree);
            ctx.sendNode(assignmentOperation, e -> e.getPadding().getOperator(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(assignmentOperation, J.AssignmentOperation::getAssignment, ctx::sendTree);
            ctx.sendTypedValue(assignmentOperation, J.AssignmentOperation::getType);
            return assignmentOperation;
        }

        @Override
        public J.Binary visitBinary(J.Binary binary, SenderContext ctx) {
            ctx.sendValue(binary, J.Binary::getId);
            ctx.sendNode(binary, J.Binary::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(binary, J.Binary::getMarkers, ctx::sendMarkers);
            ctx.sendNode(binary, J.Binary::getLeft, ctx::sendTree);
            ctx.sendNode(binary, e -> e.getPadding().getOperator(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(binary, J.Binary::getRight, ctx::sendTree);
            ctx.sendTypedValue(binary, J.Binary::getType);
            return binary;
        }

        @Override
        public J.Block visitBlock(J.Block block, SenderContext ctx) {
            ctx.sendValue(block, J.Block::getId);
            ctx.sendNode(block, J.Block::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(block, J.Block::getMarkers, ctx::sendMarkers);
            ctx.sendNode(block, e -> e.getPadding().getStatic(), JavaScriptSender::sendRightPadded);
            ctx.sendNodes(block, e -> e.getPadding().getStatements(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            ctx.sendNode(block, J.Block::getEnd, JavaScriptSender::sendSpace);
            return block;
        }

        @Override
        public J.Break visitBreak(J.Break break_, SenderContext ctx) {
            ctx.sendValue(break_, J.Break::getId);
            ctx.sendNode(break_, J.Break::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(break_, J.Break::getMarkers, ctx::sendMarkers);
            ctx.sendNode(break_, J.Break::getLabel, ctx::sendTree);
            return break_;
        }

        @Override
        public J.Case visitCase(J.Case case_, SenderContext ctx) {
            ctx.sendValue(case_, J.Case::getId);
            ctx.sendNode(case_, J.Case::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(case_, J.Case::getMarkers, ctx::sendMarkers);
            ctx.sendValue(case_, J.Case::getType);
            ctx.sendNode(case_, e -> e.getPadding().getCaseLabels(), JavaScriptSender::sendContainer);
            ctx.sendNode(case_, e -> e.getPadding().getStatements(), JavaScriptSender::sendContainer);
            ctx.sendNode(case_, e -> e.getPadding().getBody(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(case_, J.Case::getGuard, ctx::sendTree);
            return case_;
        }

        @Override
        public J.ClassDeclaration visitClassDeclaration(J.ClassDeclaration classDeclaration, SenderContext ctx) {
            ctx.sendValue(classDeclaration, J.ClassDeclaration::getId);
            ctx.sendNode(classDeclaration, J.ClassDeclaration::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(classDeclaration, J.ClassDeclaration::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(classDeclaration, J.ClassDeclaration::getLeadingAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNodes(classDeclaration, J.ClassDeclaration::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(classDeclaration, e -> e.getPadding().getKind(), this::sendClassDeclarationKind);
            ctx.sendNode(classDeclaration, J.ClassDeclaration::getName, ctx::sendTree);
            ctx.sendNode(classDeclaration, e -> e.getPadding().getTypeParameters(), JavaScriptSender::sendContainer);
            ctx.sendNode(classDeclaration, e -> e.getPadding().getPrimaryConstructor(), JavaScriptSender::sendContainer);
            ctx.sendNode(classDeclaration, e -> e.getPadding().getExtends(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(classDeclaration, e -> e.getPadding().getImplements(), JavaScriptSender::sendContainer);
            ctx.sendNode(classDeclaration, e -> e.getPadding().getPermits(), JavaScriptSender::sendContainer);
            ctx.sendNode(classDeclaration, J.ClassDeclaration::getBody, ctx::sendTree);
            ctx.sendTypedValue(classDeclaration, J.ClassDeclaration::getType);
            return classDeclaration;
        }

        private void sendClassDeclarationKind(J.ClassDeclaration.Kind kind, SenderContext ctx) {
            ctx.sendValue(kind, J.ClassDeclaration.Kind::getId);
            ctx.sendNode(kind, J.ClassDeclaration.Kind::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(kind, J.ClassDeclaration.Kind::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(kind, J.ClassDeclaration.Kind::getAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendValue(kind, J.ClassDeclaration.Kind::getType);
        }

        @Override
        public J.Continue visitContinue(J.Continue continue_, SenderContext ctx) {
            ctx.sendValue(continue_, J.Continue::getId);
            ctx.sendNode(continue_, J.Continue::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(continue_, J.Continue::getMarkers, ctx::sendMarkers);
            ctx.sendNode(continue_, J.Continue::getLabel, ctx::sendTree);
            return continue_;
        }

        @Override
        public J.DoWhileLoop visitDoWhileLoop(J.DoWhileLoop doWhileLoop, SenderContext ctx) {
            ctx.sendValue(doWhileLoop, J.DoWhileLoop::getId);
            ctx.sendNode(doWhileLoop, J.DoWhileLoop::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(doWhileLoop, J.DoWhileLoop::getMarkers, ctx::sendMarkers);
            ctx.sendNode(doWhileLoop, e -> e.getPadding().getBody(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(doWhileLoop, e -> e.getPadding().getWhileCondition(), JavaScriptSender::sendLeftPadded);
            return doWhileLoop;
        }

        @Override
        public J.Empty visitEmpty(J.Empty empty, SenderContext ctx) {
            ctx.sendValue(empty, J.Empty::getId);
            ctx.sendNode(empty, J.Empty::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(empty, J.Empty::getMarkers, ctx::sendMarkers);
            return empty;
        }

        @Override
        public J.EnumValue visitEnumValue(J.EnumValue enumValue, SenderContext ctx) {
            ctx.sendValue(enumValue, J.EnumValue::getId);
            ctx.sendNode(enumValue, J.EnumValue::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(enumValue, J.EnumValue::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(enumValue, J.EnumValue::getAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNode(enumValue, J.EnumValue::getName, ctx::sendTree);
            ctx.sendNode(enumValue, J.EnumValue::getInitializer, ctx::sendTree);
            return enumValue;
        }

        @Override
        public J.EnumValueSet visitEnumValueSet(J.EnumValueSet enumValueSet, SenderContext ctx) {
            ctx.sendValue(enumValueSet, J.EnumValueSet::getId);
            ctx.sendNode(enumValueSet, J.EnumValueSet::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(enumValueSet, J.EnumValueSet::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(enumValueSet, e -> e.getPadding().getEnums(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            ctx.sendValue(enumValueSet, J.EnumValueSet::isTerminatedWithSemicolon);
            return enumValueSet;
        }

        @Override
        public J.FieldAccess visitFieldAccess(J.FieldAccess fieldAccess, SenderContext ctx) {
            ctx.sendValue(fieldAccess, J.FieldAccess::getId);
            ctx.sendNode(fieldAccess, J.FieldAccess::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(fieldAccess, J.FieldAccess::getMarkers, ctx::sendMarkers);
            ctx.sendNode(fieldAccess, J.FieldAccess::getTarget, ctx::sendTree);
            ctx.sendNode(fieldAccess, e -> e.getPadding().getName(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(fieldAccess, J.FieldAccess::getType);
            return fieldAccess;
        }

        @Override
        public J.ForEachLoop visitForEachLoop(J.ForEachLoop forEachLoop, SenderContext ctx) {
            ctx.sendValue(forEachLoop, J.ForEachLoop::getId);
            ctx.sendNode(forEachLoop, J.ForEachLoop::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(forEachLoop, J.ForEachLoop::getMarkers, ctx::sendMarkers);
            ctx.sendNode(forEachLoop, J.ForEachLoop::getControl, ctx::sendTree);
            ctx.sendNode(forEachLoop, e -> e.getPadding().getBody(), JavaScriptSender::sendRightPadded);
            return forEachLoop;
        }

        @Override
        public J.ForEachLoop.Control visitForEachControl(J.ForEachLoop.Control control, SenderContext ctx) {
            ctx.sendValue(control, J.ForEachLoop.Control::getId);
            ctx.sendNode(control, J.ForEachLoop.Control::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(control, J.ForEachLoop.Control::getMarkers, ctx::sendMarkers);
            ctx.sendNode(control, e -> e.getPadding().getVariable(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(control, e -> e.getPadding().getIterable(), JavaScriptSender::sendRightPadded);
            return control;
        }

        @Override
        public J.ForLoop visitForLoop(J.ForLoop forLoop, SenderContext ctx) {
            ctx.sendValue(forLoop, J.ForLoop::getId);
            ctx.sendNode(forLoop, J.ForLoop::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(forLoop, J.ForLoop::getMarkers, ctx::sendMarkers);
            ctx.sendNode(forLoop, J.ForLoop::getControl, ctx::sendTree);
            ctx.sendNode(forLoop, e -> e.getPadding().getBody(), JavaScriptSender::sendRightPadded);
            return forLoop;
        }

        @Override
        public J.ForLoop.Control visitForControl(J.ForLoop.Control control, SenderContext ctx) {
            ctx.sendValue(control, J.ForLoop.Control::getId);
            ctx.sendNode(control, J.ForLoop.Control::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(control, J.ForLoop.Control::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(control, e -> e.getPadding().getInit(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            ctx.sendNode(control, e -> e.getPadding().getCondition(), JavaScriptSender::sendRightPadded);
            ctx.sendNodes(control, e -> e.getPadding().getUpdate(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            return control;
        }

        @Override
        public J.ParenthesizedTypeTree visitParenthesizedTypeTree(J.ParenthesizedTypeTree parenthesizedTypeTree, SenderContext ctx) {
            ctx.sendValue(parenthesizedTypeTree, J.ParenthesizedTypeTree::getId);
            ctx.sendNode(parenthesizedTypeTree, J.ParenthesizedTypeTree::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(parenthesizedTypeTree, J.ParenthesizedTypeTree::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(parenthesizedTypeTree, J.ParenthesizedTypeTree::getAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNode(parenthesizedTypeTree, J.ParenthesizedTypeTree::getParenthesizedType, ctx::sendTree);
            return parenthesizedTypeTree;
        }

        @Override
        public J.Identifier visitIdentifier(J.Identifier identifier, SenderContext ctx) {
            ctx.sendValue(identifier, J.Identifier::getId);
            ctx.sendNode(identifier, J.Identifier::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(identifier, J.Identifier::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(identifier, J.Identifier::getAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendValue(identifier, J.Identifier::getSimpleName);
            ctx.sendTypedValue(identifier, J.Identifier::getType);
            ctx.sendTypedValue(identifier, J.Identifier::getFieldType);
            return identifier;
        }

        @Override
        public J.If visitIf(J.If if_, SenderContext ctx) {
            ctx.sendValue(if_, J.If::getId);
            ctx.sendNode(if_, J.If::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(if_, J.If::getMarkers, ctx::sendMarkers);
            ctx.sendNode(if_, J.If::getIfCondition, ctx::sendTree);
            ctx.sendNode(if_, e -> e.getPadding().getThenPart(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(if_, J.If::getElsePart, ctx::sendTree);
            return if_;
        }

        @Override
        public J.If.Else visitElse(J.If.Else else_, SenderContext ctx) {
            ctx.sendValue(else_, J.If.Else::getId);
            ctx.sendNode(else_, J.If.Else::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(else_, J.If.Else::getMarkers, ctx::sendMarkers);
            ctx.sendNode(else_, e -> e.getPadding().getBody(), JavaScriptSender::sendRightPadded);
            return else_;
        }

        @Override
        public J.Import visitImport(J.Import import_, SenderContext ctx) {
            ctx.sendValue(import_, J.Import::getId);
            ctx.sendNode(import_, J.Import::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(import_, J.Import::getMarkers, ctx::sendMarkers);
            ctx.sendNode(import_, e -> e.getPadding().getStatic(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(import_, J.Import::getQualid, ctx::sendTree);
            ctx.sendNode(import_, e -> e.getPadding().getAlias(), JavaScriptSender::sendLeftPadded);
            return import_;
        }

        @Override
        public J.InstanceOf visitInstanceOf(J.InstanceOf instanceOf, SenderContext ctx) {
            ctx.sendValue(instanceOf, J.InstanceOf::getId);
            ctx.sendNode(instanceOf, J.InstanceOf::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(instanceOf, J.InstanceOf::getMarkers, ctx::sendMarkers);
            ctx.sendNode(instanceOf, e -> e.getPadding().getExpression(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(instanceOf, J.InstanceOf::getClazz, ctx::sendTree);
            ctx.sendNode(instanceOf, J.InstanceOf::getPattern, ctx::sendTree);
            ctx.sendTypedValue(instanceOf, J.InstanceOf::getType);
            return instanceOf;
        }

        @Override
        public J.DeconstructionPattern visitDeconstructionPattern(J.DeconstructionPattern deconstructionPattern, SenderContext ctx) {
            ctx.sendValue(deconstructionPattern, J.DeconstructionPattern::getId);
            ctx.sendNode(deconstructionPattern, J.DeconstructionPattern::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(deconstructionPattern, J.DeconstructionPattern::getMarkers, ctx::sendMarkers);
            ctx.sendNode(deconstructionPattern, J.DeconstructionPattern::getDeconstructor, ctx::sendTree);
            ctx.sendNode(deconstructionPattern, e -> e.getPadding().getNested(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(deconstructionPattern, J.DeconstructionPattern::getType);
            return deconstructionPattern;
        }

        @Override
        public J.IntersectionType visitIntersectionType(J.IntersectionType intersectionType, SenderContext ctx) {
            ctx.sendValue(intersectionType, J.IntersectionType::getId);
            ctx.sendNode(intersectionType, J.IntersectionType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(intersectionType, J.IntersectionType::getMarkers, ctx::sendMarkers);
            ctx.sendNode(intersectionType, e -> e.getPadding().getBounds(), JavaScriptSender::sendContainer);
            return intersectionType;
        }

        @Override
        public J.Label visitLabel(J.Label label, SenderContext ctx) {
            ctx.sendValue(label, J.Label::getId);
            ctx.sendNode(label, J.Label::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(label, J.Label::getMarkers, ctx::sendMarkers);
            ctx.sendNode(label, e -> e.getPadding().getLabel(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(label, J.Label::getStatement, ctx::sendTree);
            return label;
        }

        @Override
        public J.Lambda visitLambda(J.Lambda lambda, SenderContext ctx) {
            ctx.sendValue(lambda, J.Lambda::getId);
            ctx.sendNode(lambda, J.Lambda::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(lambda, J.Lambda::getMarkers, ctx::sendMarkers);
            ctx.sendNode(lambda, J.Lambda::getParameters, this::sendLambdaParameters);
            ctx.sendNode(lambda, J.Lambda::getArrow, JavaScriptSender::sendSpace);
            ctx.sendNode(lambda, J.Lambda::getBody, ctx::sendTree);
            ctx.sendTypedValue(lambda, J.Lambda::getType);
            return lambda;
        }

        private void sendLambdaParameters(J.Lambda.Parameters parameters, SenderContext ctx) {
            ctx.sendValue(parameters, J.Lambda.Parameters::getId);
            ctx.sendNode(parameters, J.Lambda.Parameters::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(parameters, J.Lambda.Parameters::getMarkers, ctx::sendMarkers);
            ctx.sendValue(parameters, J.Lambda.Parameters::isParenthesized);
            ctx.sendNodes(parameters, e -> e.getPadding().getParameters(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
        }

        @Override
        public J.Literal visitLiteral(J.Literal literal, SenderContext ctx) {
            ctx.sendValue(literal, J.Literal::getId);
            ctx.sendNode(literal, J.Literal::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(literal, J.Literal::getMarkers, ctx::sendMarkers);
            ctx.sendTypedValue(literal, J.Literal::getValue);
            ctx.sendValue(literal, J.Literal::getValueSource);
            ctx.sendValues(literal, J.Literal::getUnicodeEscapes, Function.identity());
            ctx.sendValue(literal, J.Literal::getType);
            return literal;
        }

        @Override
        public J.MemberReference visitMemberReference(J.MemberReference memberReference, SenderContext ctx) {
            ctx.sendValue(memberReference, J.MemberReference::getId);
            ctx.sendNode(memberReference, J.MemberReference::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(memberReference, J.MemberReference::getMarkers, ctx::sendMarkers);
            ctx.sendNode(memberReference, e -> e.getPadding().getContaining(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(memberReference, e -> e.getPadding().getTypeParameters(), JavaScriptSender::sendContainer);
            ctx.sendNode(memberReference, e -> e.getPadding().getReference(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(memberReference, J.MemberReference::getType);
            ctx.sendTypedValue(memberReference, J.MemberReference::getMethodType);
            ctx.sendTypedValue(memberReference, J.MemberReference::getVariableType);
            return memberReference;
        }

        @Override
        public J.MethodDeclaration visitMethodDeclaration(J.MethodDeclaration methodDeclaration, SenderContext ctx) {
            ctx.sendValue(methodDeclaration, J.MethodDeclaration::getId);
            ctx.sendNode(methodDeclaration, J.MethodDeclaration::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(methodDeclaration, J.MethodDeclaration::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(methodDeclaration, J.MethodDeclaration::getLeadingAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNodes(methodDeclaration, J.MethodDeclaration::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(methodDeclaration, e -> e.getAnnotations().getTypeParameters(), this::sendMethodTypeParameters);
            ctx.sendNode(methodDeclaration, J.MethodDeclaration::getReturnTypeExpression, ctx::sendTree);
            ctx.sendNode(methodDeclaration, e -> e.getAnnotations().getName(), this::sendMethodIdentifierWithAnnotations);
            ctx.sendNode(methodDeclaration, e -> e.getPadding().getParameters(), JavaScriptSender::sendContainer);
            ctx.sendNode(methodDeclaration, e -> e.getPadding().getThrows(), JavaScriptSender::sendContainer);
            ctx.sendNode(methodDeclaration, J.MethodDeclaration::getBody, ctx::sendTree);
            ctx.sendNode(methodDeclaration, e -> e.getPadding().getDefaultValue(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(methodDeclaration, J.MethodDeclaration::getMethodType);
            return methodDeclaration;
        }

        private void sendMethodIdentifierWithAnnotations(J.MethodDeclaration.IdentifierWithAnnotations identifierWithAnnotations, SenderContext ctx) {
            ctx.sendNode(identifierWithAnnotations, J.MethodDeclaration.IdentifierWithAnnotations::getIdentifier, ctx::sendTree);
            ctx.sendNodes(identifierWithAnnotations, J.MethodDeclaration.IdentifierWithAnnotations::getAnnotations, ctx::sendTree, Tree::getId);
        }

        @Override
        public J.MethodInvocation visitMethodInvocation(J.MethodInvocation methodInvocation, SenderContext ctx) {
            ctx.sendValue(methodInvocation, J.MethodInvocation::getId);
            ctx.sendNode(methodInvocation, J.MethodInvocation::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(methodInvocation, J.MethodInvocation::getMarkers, ctx::sendMarkers);
            ctx.sendNode(methodInvocation, e -> e.getPadding().getSelect(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(methodInvocation, e -> e.getPadding().getTypeParameters(), JavaScriptSender::sendContainer);
            ctx.sendNode(methodInvocation, J.MethodInvocation::getName, ctx::sendTree);
            ctx.sendNode(methodInvocation, e -> e.getPadding().getArguments(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(methodInvocation, J.MethodInvocation::getMethodType);
            return methodInvocation;
        }

        @Override
        public J.Modifier visitModifier(J.Modifier modifier, SenderContext ctx) {
            ctx.sendValue(modifier, J.Modifier::getId);
            ctx.sendNode(modifier, J.Modifier::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(modifier, J.Modifier::getMarkers, ctx::sendMarkers);
            ctx.sendValue(modifier, J.Modifier::getKeyword);
            ctx.sendValue(modifier, J.Modifier::getType);
            ctx.sendNodes(modifier, J.Modifier::getAnnotations, ctx::sendTree, Tree::getId);
            return modifier;
        }

        @Override
        public J.MultiCatch visitMultiCatch(J.MultiCatch multiCatch, SenderContext ctx) {
            ctx.sendValue(multiCatch, J.MultiCatch::getId);
            ctx.sendNode(multiCatch, J.MultiCatch::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(multiCatch, J.MultiCatch::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(multiCatch, e -> e.getPadding().getAlternatives(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            return multiCatch;
        }

        @Override
        public J.NewArray visitNewArray(J.NewArray newArray, SenderContext ctx) {
            ctx.sendValue(newArray, J.NewArray::getId);
            ctx.sendNode(newArray, J.NewArray::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(newArray, J.NewArray::getMarkers, ctx::sendMarkers);
            ctx.sendNode(newArray, J.NewArray::getTypeExpression, ctx::sendTree);
            ctx.sendNodes(newArray, J.NewArray::getDimensions, ctx::sendTree, Tree::getId);
            ctx.sendNode(newArray, e -> e.getPadding().getInitializer(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(newArray, J.NewArray::getType);
            return newArray;
        }

        @Override
        public J.ArrayDimension visitArrayDimension(J.ArrayDimension arrayDimension, SenderContext ctx) {
            ctx.sendValue(arrayDimension, J.ArrayDimension::getId);
            ctx.sendNode(arrayDimension, J.ArrayDimension::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(arrayDimension, J.ArrayDimension::getMarkers, ctx::sendMarkers);
            ctx.sendNode(arrayDimension, e -> e.getPadding().getIndex(), JavaScriptSender::sendRightPadded);
            return arrayDimension;
        }

        @Override
        public J.NewClass visitNewClass(J.NewClass newClass, SenderContext ctx) {
            ctx.sendValue(newClass, J.NewClass::getId);
            ctx.sendNode(newClass, J.NewClass::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(newClass, J.NewClass::getMarkers, ctx::sendMarkers);
            ctx.sendNode(newClass, e -> e.getPadding().getEnclosing(), JavaScriptSender::sendRightPadded);
            ctx.sendNode(newClass, J.NewClass::getNew, JavaScriptSender::sendSpace);
            ctx.sendNode(newClass, J.NewClass::getClazz, ctx::sendTree);
            ctx.sendNode(newClass, e -> e.getPadding().getArguments(), JavaScriptSender::sendContainer);
            ctx.sendNode(newClass, J.NewClass::getBody, ctx::sendTree);
            ctx.sendTypedValue(newClass, J.NewClass::getConstructorType);
            return newClass;
        }

        @Override
        public J.NullableType visitNullableType(J.NullableType nullableType, SenderContext ctx) {
            ctx.sendValue(nullableType, J.NullableType::getId);
            ctx.sendNode(nullableType, J.NullableType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(nullableType, J.NullableType::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(nullableType, J.NullableType::getAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNode(nullableType, e -> e.getPadding().getTypeTree(), JavaScriptSender::sendRightPadded);
            return nullableType;
        }

        @Override
        public J.Package visitPackage(J.Package package_, SenderContext ctx) {
            ctx.sendValue(package_, J.Package::getId);
            ctx.sendNode(package_, J.Package::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(package_, J.Package::getMarkers, ctx::sendMarkers);
            ctx.sendNode(package_, J.Package::getExpression, ctx::sendTree);
            ctx.sendNodes(package_, J.Package::getAnnotations, ctx::sendTree, Tree::getId);
            return package_;
        }

        @Override
        public J.ParameterizedType visitParameterizedType(J.ParameterizedType parameterizedType, SenderContext ctx) {
            ctx.sendValue(parameterizedType, J.ParameterizedType::getId);
            ctx.sendNode(parameterizedType, J.ParameterizedType::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(parameterizedType, J.ParameterizedType::getMarkers, ctx::sendMarkers);
            ctx.sendNode(parameterizedType, J.ParameterizedType::getClazz, ctx::sendTree);
            ctx.sendNode(parameterizedType, e -> e.getPadding().getTypeParameters(), JavaScriptSender::sendContainer);
            ctx.sendTypedValue(parameterizedType, J.ParameterizedType::getType);
            return parameterizedType;
        }

        @Override
        public <J2 extends J> J.Parentheses<J2> visitParentheses(J.Parentheses<J2> parentheses, SenderContext ctx) {
            ctx.sendValue(parentheses, J.Parentheses::getId);
            ctx.sendNode(parentheses, J.Parentheses::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(parentheses, J.Parentheses::getMarkers, ctx::sendMarkers);
            ctx.sendNode(parentheses, e -> e.getPadding().getTree(), JavaScriptSender::sendRightPadded);
            return parentheses;
        }

        @Override
        public <J2 extends J> J.ControlParentheses<J2> visitControlParentheses(J.ControlParentheses<J2> controlParentheses, SenderContext ctx) {
            ctx.sendValue(controlParentheses, J.ControlParentheses::getId);
            ctx.sendNode(controlParentheses, J.ControlParentheses::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(controlParentheses, J.ControlParentheses::getMarkers, ctx::sendMarkers);
            ctx.sendNode(controlParentheses, e -> e.getPadding().getTree(), JavaScriptSender::sendRightPadded);
            return controlParentheses;
        }

        @Override
        public J.Primitive visitPrimitive(J.Primitive primitive, SenderContext ctx) {
            ctx.sendValue(primitive, J.Primitive::getId);
            ctx.sendNode(primitive, J.Primitive::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(primitive, J.Primitive::getMarkers, ctx::sendMarkers);
            ctx.sendValue(primitive, J.Primitive::getType);
            return primitive;
        }

        @Override
        public J.Return visitReturn(J.Return return_, SenderContext ctx) {
            ctx.sendValue(return_, J.Return::getId);
            ctx.sendNode(return_, J.Return::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(return_, J.Return::getMarkers, ctx::sendMarkers);
            ctx.sendNode(return_, J.Return::getExpression, ctx::sendTree);
            return return_;
        }

        @Override
        public J.Switch visitSwitch(J.Switch switch_, SenderContext ctx) {
            ctx.sendValue(switch_, J.Switch::getId);
            ctx.sendNode(switch_, J.Switch::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(switch_, J.Switch::getMarkers, ctx::sendMarkers);
            ctx.sendNode(switch_, J.Switch::getSelector, ctx::sendTree);
            ctx.sendNode(switch_, J.Switch::getCases, ctx::sendTree);
            return switch_;
        }

        @Override
        public J.SwitchExpression visitSwitchExpression(J.SwitchExpression switchExpression, SenderContext ctx) {
            ctx.sendValue(switchExpression, J.SwitchExpression::getId);
            ctx.sendNode(switchExpression, J.SwitchExpression::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(switchExpression, J.SwitchExpression::getMarkers, ctx::sendMarkers);
            ctx.sendNode(switchExpression, J.SwitchExpression::getSelector, ctx::sendTree);
            ctx.sendNode(switchExpression, J.SwitchExpression::getCases, ctx::sendTree);
            ctx.sendTypedValue(switchExpression, J.SwitchExpression::getType);
            return switchExpression;
        }

        @Override
        public J.Synchronized visitSynchronized(J.Synchronized synchronized_, SenderContext ctx) {
            ctx.sendValue(synchronized_, J.Synchronized::getId);
            ctx.sendNode(synchronized_, J.Synchronized::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(synchronized_, J.Synchronized::getMarkers, ctx::sendMarkers);
            ctx.sendNode(synchronized_, J.Synchronized::getLock, ctx::sendTree);
            ctx.sendNode(synchronized_, J.Synchronized::getBody, ctx::sendTree);
            return synchronized_;
        }

        @Override
        public J.Ternary visitTernary(J.Ternary ternary, SenderContext ctx) {
            ctx.sendValue(ternary, J.Ternary::getId);
            ctx.sendNode(ternary, J.Ternary::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(ternary, J.Ternary::getMarkers, ctx::sendMarkers);
            ctx.sendNode(ternary, J.Ternary::getCondition, ctx::sendTree);
            ctx.sendNode(ternary, e -> e.getPadding().getTruePart(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(ternary, e -> e.getPadding().getFalsePart(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(ternary, J.Ternary::getType);
            return ternary;
        }

        @Override
        public J.Throw visitThrow(J.Throw throw_, SenderContext ctx) {
            ctx.sendValue(throw_, J.Throw::getId);
            ctx.sendNode(throw_, J.Throw::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(throw_, J.Throw::getMarkers, ctx::sendMarkers);
            ctx.sendNode(throw_, J.Throw::getException, ctx::sendTree);
            return throw_;
        }

        @Override
        public J.Try visitTry(J.Try try_, SenderContext ctx) {
            ctx.sendValue(try_, J.Try::getId);
            ctx.sendNode(try_, J.Try::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(try_, J.Try::getMarkers, ctx::sendMarkers);
            ctx.sendNode(try_, e -> e.getPadding().getResources(), JavaScriptSender::sendContainer);
            ctx.sendNode(try_, J.Try::getBody, ctx::sendTree);
            ctx.sendNodes(try_, J.Try::getCatches, ctx::sendTree, Tree::getId);
            ctx.sendNode(try_, e -> e.getPadding().getFinally(), JavaScriptSender::sendLeftPadded);
            return try_;
        }

        @Override
        public J.Try.Resource visitTryResource(J.Try.Resource resource, SenderContext ctx) {
            ctx.sendValue(resource, J.Try.Resource::getId);
            ctx.sendNode(resource, J.Try.Resource::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(resource, J.Try.Resource::getMarkers, ctx::sendMarkers);
            ctx.sendNode(resource, J.Try.Resource::getVariableDeclarations, ctx::sendTree);
            ctx.sendValue(resource, J.Try.Resource::isTerminatedWithSemicolon);
            return resource;
        }

        @Override
        public J.Try.Catch visitCatch(J.Try.Catch catch_, SenderContext ctx) {
            ctx.sendValue(catch_, J.Try.Catch::getId);
            ctx.sendNode(catch_, J.Try.Catch::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(catch_, J.Try.Catch::getMarkers, ctx::sendMarkers);
            ctx.sendNode(catch_, J.Try.Catch::getParameter, ctx::sendTree);
            ctx.sendNode(catch_, J.Try.Catch::getBody, ctx::sendTree);
            return catch_;
        }

        @Override
        public J.TypeCast visitTypeCast(J.TypeCast typeCast, SenderContext ctx) {
            ctx.sendValue(typeCast, J.TypeCast::getId);
            ctx.sendNode(typeCast, J.TypeCast::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(typeCast, J.TypeCast::getMarkers, ctx::sendMarkers);
            ctx.sendNode(typeCast, J.TypeCast::getClazz, ctx::sendTree);
            ctx.sendNode(typeCast, J.TypeCast::getExpression, ctx::sendTree);
            return typeCast;
        }

        @Override
        public J.TypeParameter visitTypeParameter(J.TypeParameter typeParameter, SenderContext ctx) {
            ctx.sendValue(typeParameter, J.TypeParameter::getId);
            ctx.sendNode(typeParameter, J.TypeParameter::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(typeParameter, J.TypeParameter::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(typeParameter, J.TypeParameter::getAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNodes(typeParameter, J.TypeParameter::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(typeParameter, J.TypeParameter::getName, ctx::sendTree);
            ctx.sendNode(typeParameter, e -> e.getPadding().getBounds(), JavaScriptSender::sendContainer);
            return typeParameter;
        }

        private void sendMethodTypeParameters(J.TypeParameters typeParameters, SenderContext ctx) {
            ctx.sendValue(typeParameters, J.TypeParameters::getId);
            ctx.sendNode(typeParameters, J.TypeParameters::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(typeParameters, J.TypeParameters::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(typeParameters, J.TypeParameters::getAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNodes(typeParameters, e -> e.getPadding().getTypeParameters(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
        }

        @Override
        public J.Unary visitUnary(J.Unary unary, SenderContext ctx) {
            ctx.sendValue(unary, J.Unary::getId);
            ctx.sendNode(unary, J.Unary::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(unary, J.Unary::getMarkers, ctx::sendMarkers);
            ctx.sendNode(unary, e -> e.getPadding().getOperator(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(unary, J.Unary::getExpression, ctx::sendTree);
            ctx.sendTypedValue(unary, J.Unary::getType);
            return unary;
        }

        @Override
        public J.VariableDeclarations visitVariableDeclarations(J.VariableDeclarations variableDeclarations, SenderContext ctx) {
            ctx.sendValue(variableDeclarations, J.VariableDeclarations::getId);
            ctx.sendNode(variableDeclarations, J.VariableDeclarations::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(variableDeclarations, J.VariableDeclarations::getMarkers, ctx::sendMarkers);
            ctx.sendNodes(variableDeclarations, J.VariableDeclarations::getLeadingAnnotations, ctx::sendTree, Tree::getId);
            ctx.sendNodes(variableDeclarations, J.VariableDeclarations::getModifiers, ctx::sendTree, Tree::getId);
            ctx.sendNode(variableDeclarations, J.VariableDeclarations::getTypeExpression, ctx::sendTree);
            ctx.sendNode(variableDeclarations, J.VariableDeclarations::getVarargs, JavaScriptSender::sendSpace);
            ctx.sendNodes(variableDeclarations, J.VariableDeclarations::getDimensionsBeforeName, JavaScriptSender::sendLeftPadded, Function.identity());
            ctx.sendNodes(variableDeclarations, e -> e.getPadding().getVariables(), JavaScriptSender::sendRightPadded, e -> e.getElement().getId());
            return variableDeclarations;
        }

        @Override
        public J.VariableDeclarations.NamedVariable visitVariable(J.VariableDeclarations.NamedVariable namedVariable, SenderContext ctx) {
            ctx.sendValue(namedVariable, J.VariableDeclarations.NamedVariable::getId);
            ctx.sendNode(namedVariable, J.VariableDeclarations.NamedVariable::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(namedVariable, J.VariableDeclarations.NamedVariable::getMarkers, ctx::sendMarkers);
            ctx.sendNode(namedVariable, J.VariableDeclarations.NamedVariable::getName, ctx::sendTree);
            ctx.sendNodes(namedVariable, J.VariableDeclarations.NamedVariable::getDimensionsAfterName, JavaScriptSender::sendLeftPadded, Function.identity());
            ctx.sendNode(namedVariable, e -> e.getPadding().getInitializer(), JavaScriptSender::sendLeftPadded);
            ctx.sendTypedValue(namedVariable, J.VariableDeclarations.NamedVariable::getVariableType);
            return namedVariable;
        }

        @Override
        public J.WhileLoop visitWhileLoop(J.WhileLoop whileLoop, SenderContext ctx) {
            ctx.sendValue(whileLoop, J.WhileLoop::getId);
            ctx.sendNode(whileLoop, J.WhileLoop::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(whileLoop, J.WhileLoop::getMarkers, ctx::sendMarkers);
            ctx.sendNode(whileLoop, J.WhileLoop::getCondition, ctx::sendTree);
            ctx.sendNode(whileLoop, e -> e.getPadding().getBody(), JavaScriptSender::sendRightPadded);
            return whileLoop;
        }

        @Override
        public J.Wildcard visitWildcard(J.Wildcard wildcard, SenderContext ctx) {
            ctx.sendValue(wildcard, J.Wildcard::getId);
            ctx.sendNode(wildcard, J.Wildcard::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(wildcard, J.Wildcard::getMarkers, ctx::sendMarkers);
            ctx.sendNode(wildcard, e -> e.getPadding().getBound(), JavaScriptSender::sendLeftPadded);
            ctx.sendNode(wildcard, J.Wildcard::getBoundedType, ctx::sendTree);
            return wildcard;
        }

        @Override
        public J.Yield visitYield(J.Yield yield, SenderContext ctx) {
            ctx.sendValue(yield, J.Yield::getId);
            ctx.sendNode(yield, J.Yield::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(yield, J.Yield::getMarkers, ctx::sendMarkers);
            ctx.sendValue(yield, J.Yield::isImplicit);
            ctx.sendNode(yield, J.Yield::getValue, ctx::sendTree);
            return yield;
        }

        @Override
        public J.Unknown visitUnknown(J.Unknown unknown, SenderContext ctx) {
            ctx.sendValue(unknown, J.Unknown::getId);
            ctx.sendNode(unknown, J.Unknown::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(unknown, J.Unknown::getMarkers, ctx::sendMarkers);
            ctx.sendNode(unknown, J.Unknown::getSource, ctx::sendTree);
            return unknown;
        }

        @Override
        public J.Unknown.Source visitUnknownSource(J.Unknown.Source source, SenderContext ctx) {
            ctx.sendValue(source, J.Unknown.Source::getId);
            ctx.sendNode(source, J.Unknown.Source::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(source, J.Unknown.Source::getMarkers, ctx::sendMarkers);
            ctx.sendValue(source, J.Unknown.Source::getText);
            return source;
        }

        @Override
        public J.Erroneous visitErroneous(J.Erroneous erroneous, SenderContext ctx) {
            ctx.sendValue(erroneous, J.Erroneous::getId);
            ctx.sendNode(erroneous, J.Erroneous::getPrefix, JavaScriptSender::sendSpace);
            ctx.sendNode(erroneous, J.Erroneous::getMarkers, ctx::sendMarkers);
            ctx.sendValue(erroneous, J.Erroneous::getText);
            return erroneous;
        }

    }

    private static <T extends J> void sendContainer(JContainer<T> container, SenderContext ctx) {
        Extensions.sendContainer(container, ctx);
    }

    private static <T> void sendLeftPadded(JLeftPadded<T> leftPadded, SenderContext ctx) {
        Extensions.sendLeftPadded(leftPadded, ctx);
    }

    private static <T> void sendRightPadded(JRightPadded<T> rightPadded, SenderContext ctx) {
        Extensions.sendRightPadded(rightPadded, ctx);
    }

    private static void sendSpace(Space space, SenderContext ctx) {
        Extensions.sendSpace(space, ctx);
    }

    private static void sendComment(Comment comment, SenderContext ctx) {
        Extensions.sendComment(comment, ctx);
    }

}
