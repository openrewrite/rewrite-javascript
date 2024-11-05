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

import lombok.Value;
import org.jspecify.annotations.Nullable;
import org.openrewrite.Checksum;
import org.openrewrite.Cursor;
import org.openrewrite.FileAttributes;
import org.openrewrite.Tree;
import org.openrewrite.marker.Markers;
import org.openrewrite.javascript.JavaScriptVisitor;
import org.openrewrite.javascript.tree.*;
import org.openrewrite.java.*;
import org.openrewrite.java.tree.*;
import org.openrewrite.remote.Receiver;
import org.openrewrite.remote.ReceiverContext;
import org.openrewrite.remote.ReceiverFactory;

import java.nio.charset.Charset;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Value
public class JavaScriptReceiver implements Receiver<JS> {

    @Override
    public JS receive(@Nullable JS before, ReceiverContext ctx) {
        ReceiverContext forked = fork(ctx);
        //noinspection DataFlowIssue
        return (JS) forked.getVisitor().visit(before, forked);
    }

    @Override
    public ReceiverContext fork(ReceiverContext ctx) {
        return ctx.fork(new Visitor(), new Factory());
    }

    private static class Visitor extends JavaScriptVisitor<ReceiverContext> {

        public @Nullable J visit(@Nullable Tree tree, ReceiverContext ctx) {
            //noinspection DataFlowIssue
            Cursor cursor = new Cursor(getCursor(), tree);
            setCursor(cursor);

            tree = ctx.receiveNode((J) tree, ctx::receiveTree);

            setCursor(cursor.getParent());
            return (J) tree;
        }

        @Override
        public JS.CompilationUnit visitCompilationUnit(JS.CompilationUnit compilationUnit, ReceiverContext ctx) {
            compilationUnit = compilationUnit.withId(ctx.receiveNonNullValue(compilationUnit.getId(), UUID.class));
            compilationUnit = compilationUnit.withPrefix(ctx.receiveNonNullNode(compilationUnit.getPrefix(), JavaScriptReceiver::receiveSpace));
            compilationUnit = compilationUnit.withMarkers(ctx.receiveNonNullNode(compilationUnit.getMarkers(), ctx::receiveMarkers));
            compilationUnit = compilationUnit.withSourcePath(ctx.receiveNonNullValue(compilationUnit.getSourcePath(), Path.class));
            compilationUnit = compilationUnit.withFileAttributes(ctx.receiveValue(compilationUnit.getFileAttributes(), FileAttributes.class));
            String charsetName = ctx.receiveValue(compilationUnit.getCharset().name(), String.class);
            if (charsetName != null) {
                compilationUnit = (JS.CompilationUnit) compilationUnit.withCharset(Charset.forName(charsetName));
            }
            compilationUnit = compilationUnit.withCharsetBomMarked(ctx.receiveNonNullValue(compilationUnit.isCharsetBomMarked(), boolean.class));
            compilationUnit = compilationUnit.withChecksum(ctx.receiveValue(compilationUnit.getChecksum(), Checksum.class));
            compilationUnit = compilationUnit.getPadding().withImports(ctx.receiveNonNullNodes(compilationUnit.getPadding().getImports(), JavaScriptReceiver::receiveRightPaddedTree));
            compilationUnit = compilationUnit.getPadding().withStatements(ctx.receiveNonNullNodes(compilationUnit.getPadding().getStatements(), JavaScriptReceiver::receiveRightPaddedTree));
            compilationUnit = compilationUnit.withEof(ctx.receiveNonNullNode(compilationUnit.getEof(), JavaScriptReceiver::receiveSpace));
            return compilationUnit;
        }

        @Override
        public JS.Alias visitAlias(JS.Alias alias, ReceiverContext ctx) {
            alias = alias.withId(ctx.receiveNonNullValue(alias.getId(), UUID.class));
            alias = alias.withPrefix(ctx.receiveNonNullNode(alias.getPrefix(), JavaScriptReceiver::receiveSpace));
            alias = alias.withMarkers(ctx.receiveNonNullNode(alias.getMarkers(), ctx::receiveMarkers));
            alias = alias.getPadding().withPropertyName(ctx.receiveNonNullNode(alias.getPadding().getPropertyName(), JavaScriptReceiver::receiveRightPaddedTree));
            alias = alias.withAlias(ctx.receiveNonNullNode(alias.getAlias(), ctx::receiveTree));
            return alias;
        }

        @Override
        public JS.ArrowFunction visitArrowFunction(JS.ArrowFunction arrowFunction, ReceiverContext ctx) {
            arrowFunction = arrowFunction.withId(ctx.receiveNonNullValue(arrowFunction.getId(), UUID.class));
            arrowFunction = arrowFunction.withPrefix(ctx.receiveNonNullNode(arrowFunction.getPrefix(), JavaScriptReceiver::receiveSpace));
            arrowFunction = arrowFunction.withMarkers(ctx.receiveNonNullNode(arrowFunction.getMarkers(), ctx::receiveMarkers));
            arrowFunction = arrowFunction.withLeadingAnnotations(ctx.receiveNonNullNodes(arrowFunction.getLeadingAnnotations(), ctx::receiveTree));
            arrowFunction = arrowFunction.withModifiers(ctx.receiveNonNullNodes(arrowFunction.getModifiers(), ctx::receiveTree));
            arrowFunction = arrowFunction.withParameters(ctx.receiveNonNullNode(arrowFunction.getParameters(), ctx::receiveTree));
            arrowFunction = arrowFunction.withReturnTypeExpression(ctx.receiveNode(arrowFunction.getReturnTypeExpression(), ctx::receiveTree));
            arrowFunction = arrowFunction.withArrow(ctx.receiveNonNullNode(arrowFunction.getArrow(), JavaScriptReceiver::receiveSpace));
            arrowFunction = arrowFunction.withBody(ctx.receiveNonNullNode(arrowFunction.getBody(), ctx::receiveTree));
            arrowFunction = arrowFunction.withType(ctx.receiveValue(arrowFunction.getType(), JavaType.class));
            return arrowFunction;
        }

        @Override
        public JS.Await visitAwait(JS.Await await, ReceiverContext ctx) {
            await = await.withId(ctx.receiveNonNullValue(await.getId(), UUID.class));
            await = await.withPrefix(ctx.receiveNonNullNode(await.getPrefix(), JavaScriptReceiver::receiveSpace));
            await = await.withMarkers(ctx.receiveNonNullNode(await.getMarkers(), ctx::receiveMarkers));
            await = await.withExpression(ctx.receiveNonNullNode(await.getExpression(), ctx::receiveTree));
            await = await.withType(ctx.receiveValue(await.getType(), JavaType.class));
            return await;
        }

        @Override
        public JS.DefaultType visitDefaultType(JS.DefaultType defaultType, ReceiverContext ctx) {
            defaultType = defaultType.withId(ctx.receiveNonNullValue(defaultType.getId(), UUID.class));
            defaultType = defaultType.withPrefix(ctx.receiveNonNullNode(defaultType.getPrefix(), JavaScriptReceiver::receiveSpace));
            defaultType = defaultType.withMarkers(ctx.receiveNonNullNode(defaultType.getMarkers(), ctx::receiveMarkers));
            defaultType = defaultType.withLeft(ctx.receiveNonNullNode(defaultType.getLeft(), ctx::receiveTree));
            defaultType = defaultType.withBeforeEquals(ctx.receiveNonNullNode(defaultType.getBeforeEquals(), JavaScriptReceiver::receiveSpace));
            defaultType = defaultType.withRight(ctx.receiveNonNullNode(defaultType.getRight(), ctx::receiveTree));
            defaultType = defaultType.withType(ctx.receiveValue(defaultType.getType(), JavaType.class));
            return defaultType;
        }

        @Override
        public JS.Delete visitDelete(JS.Delete delete, ReceiverContext ctx) {
            delete = delete.withId(ctx.receiveNonNullValue(delete.getId(), UUID.class));
            delete = delete.withPrefix(ctx.receiveNonNullNode(delete.getPrefix(), JavaScriptReceiver::receiveSpace));
            delete = delete.withMarkers(ctx.receiveNonNullNode(delete.getMarkers(), ctx::receiveMarkers));
            delete = delete.withExpression(ctx.receiveNonNullNode(delete.getExpression(), ctx::receiveTree));
            delete = delete.withType(ctx.receiveValue(delete.getType(), JavaType.class));
            return delete;
        }

        @Override
        public JS.Export visitExport(JS.Export export, ReceiverContext ctx) {
            export = export.withId(ctx.receiveNonNullValue(export.getId(), UUID.class));
            export = export.withPrefix(ctx.receiveNonNullNode(export.getPrefix(), JavaScriptReceiver::receiveSpace));
            export = export.withMarkers(ctx.receiveNonNullNode(export.getMarkers(), ctx::receiveMarkers));
            export = export.getPadding().withExports(ctx.receiveNode(export.getPadding().getExports(), JavaScriptReceiver::receiveContainer));
            export = export.withFrom(ctx.receiveNode(export.getFrom(), JavaScriptReceiver::receiveSpace));
            export = export.withTarget(ctx.receiveNode(export.getTarget(), ctx::receiveTree));
            export = export.getPadding().withInitializer(ctx.receiveNode(export.getPadding().getInitializer(), JavaScriptReceiver::receiveLeftPaddedTree));
            return export;
        }

        @Override
        public JS.ExpressionStatement visitExpressionStatement(JS.ExpressionStatement expressionStatement, ReceiverContext ctx) {
            expressionStatement = expressionStatement.withId(ctx.receiveNonNullValue(expressionStatement.getId(), UUID.class));
            expressionStatement = expressionStatement.withExpression(ctx.receiveNonNullNode(expressionStatement.getExpression(), ctx::receiveTree));
            return expressionStatement;
        }

        @Override
        public JS.FunctionType visitFunctionType(JS.FunctionType functionType, ReceiverContext ctx) {
            functionType = functionType.withId(ctx.receiveNonNullValue(functionType.getId(), UUID.class));
            functionType = functionType.withPrefix(ctx.receiveNonNullNode(functionType.getPrefix(), JavaScriptReceiver::receiveSpace));
            functionType = functionType.withMarkers(ctx.receiveNonNullNode(functionType.getMarkers(), ctx::receiveMarkers));
            functionType = functionType.getPadding().withParameters(ctx.receiveNonNullNode(functionType.getPadding().getParameters(), JavaScriptReceiver::receiveContainer));
            functionType = functionType.withArrow(ctx.receiveNonNullNode(functionType.getArrow(), JavaScriptReceiver::receiveSpace));
            functionType = functionType.withReturnType(ctx.receiveNonNullNode(functionType.getReturnType(), ctx::receiveTree));
            functionType = functionType.withType(ctx.receiveValue(functionType.getType(), JavaType.class));
            return functionType;
        }

        @Override
        public JS.JsImport visitJsImport(JS.JsImport jsImport, ReceiverContext ctx) {
            jsImport = jsImport.withId(ctx.receiveNonNullValue(jsImport.getId(), UUID.class));
            jsImport = jsImport.withPrefix(ctx.receiveNonNullNode(jsImport.getPrefix(), JavaScriptReceiver::receiveSpace));
            jsImport = jsImport.withMarkers(ctx.receiveNonNullNode(jsImport.getMarkers(), ctx::receiveMarkers));
            jsImport = jsImport.getPadding().withName(ctx.receiveNode(jsImport.getPadding().getName(), JavaScriptReceiver::receiveRightPaddedTree));
            jsImport = jsImport.getPadding().withImports(ctx.receiveNode(jsImport.getPadding().getImports(), JavaScriptReceiver::receiveContainer));
            jsImport = jsImport.withFrom(ctx.receiveNode(jsImport.getFrom(), JavaScriptReceiver::receiveSpace));
            jsImport = jsImport.withTarget(ctx.receiveNode(jsImport.getTarget(), ctx::receiveTree));
            jsImport = jsImport.getPadding().withInitializer(ctx.receiveNode(jsImport.getPadding().getInitializer(), JavaScriptReceiver::receiveLeftPaddedTree));
            return jsImport;
        }

        @Override
        public JS.JsBinary visitJsBinary(JS.JsBinary jsBinary, ReceiverContext ctx) {
            jsBinary = jsBinary.withId(ctx.receiveNonNullValue(jsBinary.getId(), UUID.class));
            jsBinary = jsBinary.withPrefix(ctx.receiveNonNullNode(jsBinary.getPrefix(), JavaScriptReceiver::receiveSpace));
            jsBinary = jsBinary.withMarkers(ctx.receiveNonNullNode(jsBinary.getMarkers(), ctx::receiveMarkers));
            jsBinary = jsBinary.withLeft(ctx.receiveNonNullNode(jsBinary.getLeft(), ctx::receiveTree));
            jsBinary = jsBinary.getPadding().withOperator(ctx.receiveNonNullNode(jsBinary.getPadding().getOperator(), leftPaddedValueReceiver(org.openrewrite.javascript.tree.JS.JsBinary.Type.class)));
            jsBinary = jsBinary.withRight(ctx.receiveNonNullNode(jsBinary.getRight(), ctx::receiveTree));
            jsBinary = jsBinary.withType(ctx.receiveValue(jsBinary.getType(), JavaType.class));
            return jsBinary;
        }

        @Override
        public JS.ObjectBindingDeclarations visitObjectBindingDeclarations(JS.ObjectBindingDeclarations objectBindingDeclarations, ReceiverContext ctx) {
            objectBindingDeclarations = objectBindingDeclarations.withId(ctx.receiveNonNullValue(objectBindingDeclarations.getId(), UUID.class));
            objectBindingDeclarations = objectBindingDeclarations.withPrefix(ctx.receiveNonNullNode(objectBindingDeclarations.getPrefix(), JavaScriptReceiver::receiveSpace));
            objectBindingDeclarations = objectBindingDeclarations.withMarkers(ctx.receiveNonNullNode(objectBindingDeclarations.getMarkers(), ctx::receiveMarkers));
            objectBindingDeclarations = objectBindingDeclarations.withLeadingAnnotations(ctx.receiveNonNullNodes(objectBindingDeclarations.getLeadingAnnotations(), ctx::receiveTree));
            objectBindingDeclarations = objectBindingDeclarations.withModifiers(ctx.receiveNonNullNodes(objectBindingDeclarations.getModifiers(), ctx::receiveTree));
            objectBindingDeclarations = objectBindingDeclarations.withTypeExpression(ctx.receiveNode(objectBindingDeclarations.getTypeExpression(), ctx::receiveTree));
            objectBindingDeclarations = objectBindingDeclarations.getPadding().withBindings(ctx.receiveNonNullNode(objectBindingDeclarations.getPadding().getBindings(), JavaScriptReceiver::receiveContainer));
            objectBindingDeclarations = objectBindingDeclarations.getPadding().withInitializer(ctx.receiveNode(objectBindingDeclarations.getPadding().getInitializer(), JavaScriptReceiver::receiveLeftPaddedTree));
            return objectBindingDeclarations;
        }

        @Override
        public JS.ObjectBindingDeclarations.Binding visitBinding(JS.ObjectBindingDeclarations.Binding binding, ReceiverContext ctx) {
            binding = binding.withId(ctx.receiveNonNullValue(binding.getId(), UUID.class));
            binding = binding.withPrefix(ctx.receiveNonNullNode(binding.getPrefix(), JavaScriptReceiver::receiveSpace));
            binding = binding.withMarkers(ctx.receiveNonNullNode(binding.getMarkers(), ctx::receiveMarkers));
            binding = binding.getPadding().withPropertyName(ctx.receiveNode(binding.getPadding().getPropertyName(), JavaScriptReceiver::receiveRightPaddedTree));
            binding = binding.withName(ctx.receiveNonNullNode(binding.getName(), ctx::receiveTree));
            binding = binding.withDimensionsAfterName(ctx.receiveNonNullNodes(binding.getDimensionsAfterName(), leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)));
            binding = binding.withAfterVararg(ctx.receiveNode(binding.getAfterVararg(), JavaScriptReceiver::receiveSpace));
            binding = binding.getPadding().withInitializer(ctx.receiveNode(binding.getPadding().getInitializer(), JavaScriptReceiver::receiveLeftPaddedTree));
            binding = binding.withVariableType(ctx.receiveValue(binding.getVariableType(), JavaType.Variable.class));
            return binding;
        }

        @Override
        public JS.PropertyAssignment visitPropertyAssignment(JS.PropertyAssignment propertyAssignment, ReceiverContext ctx) {
            propertyAssignment = propertyAssignment.withId(ctx.receiveNonNullValue(propertyAssignment.getId(), UUID.class));
            propertyAssignment = propertyAssignment.withPrefix(ctx.receiveNonNullNode(propertyAssignment.getPrefix(), JavaScriptReceiver::receiveSpace));
            propertyAssignment = propertyAssignment.withMarkers(ctx.receiveNonNullNode(propertyAssignment.getMarkers(), ctx::receiveMarkers));
            propertyAssignment = propertyAssignment.getPadding().withName(ctx.receiveNonNullNode(propertyAssignment.getPadding().getName(), JavaScriptReceiver::receiveRightPaddedTree));
            propertyAssignment = propertyAssignment.withInitializer(ctx.receiveNonNullNode(propertyAssignment.getInitializer(), ctx::receiveTree));
            return propertyAssignment;
        }

        @Override
        public JS.ScopedVariableDeclarations visitScopedVariableDeclarations(JS.ScopedVariableDeclarations scopedVariableDeclarations, ReceiverContext ctx) {
            scopedVariableDeclarations = scopedVariableDeclarations.withId(ctx.receiveNonNullValue(scopedVariableDeclarations.getId(), UUID.class));
            scopedVariableDeclarations = scopedVariableDeclarations.withPrefix(ctx.receiveNonNullNode(scopedVariableDeclarations.getPrefix(), JavaScriptReceiver::receiveSpace));
            scopedVariableDeclarations = scopedVariableDeclarations.withMarkers(ctx.receiveNonNullNode(scopedVariableDeclarations.getMarkers(), ctx::receiveMarkers));
            scopedVariableDeclarations = scopedVariableDeclarations.withScope(ctx.receiveValue(scopedVariableDeclarations.getScope(), JS.ScopedVariableDeclarations.Scope.class));
            scopedVariableDeclarations = scopedVariableDeclarations.getPadding().withVariables(ctx.receiveNonNullNodes(scopedVariableDeclarations.getPadding().getVariables(), JavaScriptReceiver::receiveRightPaddedTree));
            return scopedVariableDeclarations;
        }

        @Override
        public JS.StatementExpression visitStatementExpression(JS.StatementExpression statementExpression, ReceiverContext ctx) {
            statementExpression = statementExpression.withId(ctx.receiveNonNullValue(statementExpression.getId(), UUID.class));
            statementExpression = statementExpression.withStatement(ctx.receiveNonNullNode(statementExpression.getStatement(), ctx::receiveTree));
            return statementExpression;
        }

        @Override
        public JS.TemplateExpression visitTemplateExpression(JS.TemplateExpression templateExpression, ReceiverContext ctx) {
            templateExpression = templateExpression.withId(ctx.receiveNonNullValue(templateExpression.getId(), UUID.class));
            templateExpression = templateExpression.withPrefix(ctx.receiveNonNullNode(templateExpression.getPrefix(), JavaScriptReceiver::receiveSpace));
            templateExpression = templateExpression.withMarkers(ctx.receiveNonNullNode(templateExpression.getMarkers(), ctx::receiveMarkers));
            templateExpression = templateExpression.withDelimiter(ctx.receiveNonNullValue(templateExpression.getDelimiter(), String.class));
            templateExpression = templateExpression.getPadding().withTag(ctx.receiveNode(templateExpression.getPadding().getTag(), JavaScriptReceiver::receiveRightPaddedTree));
            templateExpression = templateExpression.withStrings(ctx.receiveNonNullNodes(templateExpression.getStrings(), ctx::receiveTree));
            templateExpression = templateExpression.withType(ctx.receiveValue(templateExpression.getType(), JavaType.class));
            return templateExpression;
        }

        @Override
        public JS.TemplateExpression.Value visitTemplateExpressionValue(JS.TemplateExpression.Value value, ReceiverContext ctx) {
            value = value.withId(ctx.receiveNonNullValue(value.getId(), UUID.class));
            value = value.withPrefix(ctx.receiveNonNullNode(value.getPrefix(), JavaScriptReceiver::receiveSpace));
            value = value.withMarkers(ctx.receiveNonNullNode(value.getMarkers(), ctx::receiveMarkers));
            value = value.withTree(ctx.receiveNonNullNode(value.getTree(), ctx::receiveTree));
            value = value.withAfter(ctx.receiveNonNullNode(value.getAfter(), JavaScriptReceiver::receiveSpace));
            value = value.withEnclosedInBraces(ctx.receiveNonNullValue(value.isEnclosedInBraces(), boolean.class));
            return value;
        }

        @Override
        public JS.Tuple visitTuple(JS.Tuple tuple, ReceiverContext ctx) {
            tuple = tuple.withId(ctx.receiveNonNullValue(tuple.getId(), UUID.class));
            tuple = tuple.withPrefix(ctx.receiveNonNullNode(tuple.getPrefix(), JavaScriptReceiver::receiveSpace));
            tuple = tuple.withMarkers(ctx.receiveNonNullNode(tuple.getMarkers(), ctx::receiveMarkers));
            tuple = tuple.getPadding().withElements(ctx.receiveNonNullNode(tuple.getPadding().getElements(), JavaScriptReceiver::receiveContainer));
            tuple = tuple.withType(ctx.receiveValue(tuple.getType(), JavaType.class));
            return tuple;
        }

        @Override
        public JS.TypeDeclaration visitTypeDeclaration(JS.TypeDeclaration typeDeclaration, ReceiverContext ctx) {
            typeDeclaration = typeDeclaration.withId(ctx.receiveNonNullValue(typeDeclaration.getId(), UUID.class));
            typeDeclaration = typeDeclaration.withPrefix(ctx.receiveNonNullNode(typeDeclaration.getPrefix(), JavaScriptReceiver::receiveSpace));
            typeDeclaration = typeDeclaration.withMarkers(ctx.receiveNonNullNode(typeDeclaration.getMarkers(), ctx::receiveMarkers));
            typeDeclaration = typeDeclaration.withLeadingAnnotations(ctx.receiveNonNullNodes(typeDeclaration.getLeadingAnnotations(), ctx::receiveTree));
            typeDeclaration = typeDeclaration.withModifiers(ctx.receiveNonNullNodes(typeDeclaration.getModifiers(), ctx::receiveTree));
            typeDeclaration = typeDeclaration.withName(ctx.receiveNonNullNode(typeDeclaration.getName(), ctx::receiveTree));
            typeDeclaration = typeDeclaration.withTypeParameters(ctx.receiveNode(typeDeclaration.getTypeParameters(), ctx::receiveTree));
            typeDeclaration = typeDeclaration.getPadding().withInitializer(ctx.receiveNonNullNode(typeDeclaration.getPadding().getInitializer(), JavaScriptReceiver::receiveLeftPaddedTree));
            typeDeclaration = typeDeclaration.withType(ctx.receiveValue(typeDeclaration.getType(), JavaType.class));
            return typeDeclaration;
        }

        @Override
        public JS.TypeOf visitTypeOf(JS.TypeOf typeOf, ReceiverContext ctx) {
            typeOf = typeOf.withId(ctx.receiveNonNullValue(typeOf.getId(), UUID.class));
            typeOf = typeOf.withPrefix(ctx.receiveNonNullNode(typeOf.getPrefix(), JavaScriptReceiver::receiveSpace));
            typeOf = typeOf.withMarkers(ctx.receiveNonNullNode(typeOf.getMarkers(), ctx::receiveMarkers));
            typeOf = typeOf.withExpression(ctx.receiveNonNullNode(typeOf.getExpression(), ctx::receiveTree));
            typeOf = typeOf.withType(ctx.receiveValue(typeOf.getType(), JavaType.class));
            return typeOf;
        }

        @Override
        public JS.TypeOperator visitTypeOperator(JS.TypeOperator typeOperator, ReceiverContext ctx) {
            typeOperator = typeOperator.withId(ctx.receiveNonNullValue(typeOperator.getId(), UUID.class));
            typeOperator = typeOperator.withPrefix(ctx.receiveNonNullNode(typeOperator.getPrefix(), JavaScriptReceiver::receiveSpace));
            typeOperator = typeOperator.withMarkers(ctx.receiveNonNullNode(typeOperator.getMarkers(), ctx::receiveMarkers));
            typeOperator = typeOperator.withOperator(ctx.receiveNonNullValue(typeOperator.getOperator(), JS.TypeOperator.Type.class));
            typeOperator = typeOperator.getPadding().withExpression(ctx.receiveNonNullNode(typeOperator.getPadding().getExpression(), JavaScriptReceiver::receiveLeftPaddedTree));
            return typeOperator;
        }

        @Override
        public JS.Unary visitUnary(JS.Unary unary, ReceiverContext ctx) {
            unary = unary.withId(ctx.receiveNonNullValue(unary.getId(), UUID.class));
            unary = unary.withPrefix(ctx.receiveNonNullNode(unary.getPrefix(), JavaScriptReceiver::receiveSpace));
            unary = unary.withMarkers(ctx.receiveNonNullNode(unary.getMarkers(), ctx::receiveMarkers));
            unary = unary.getPadding().withOperator(ctx.receiveNonNullNode(unary.getPadding().getOperator(), leftPaddedValueReceiver(org.openrewrite.javascript.tree.JS.Unary.Type.class)));
            unary = unary.withExpression(ctx.receiveNonNullNode(unary.getExpression(), ctx::receiveTree));
            unary = unary.withType(ctx.receiveValue(unary.getType(), JavaType.class));
            return unary;
        }

        @Override
        public JS.Union visitUnion(JS.Union union, ReceiverContext ctx) {
            union = union.withId(ctx.receiveNonNullValue(union.getId(), UUID.class));
            union = union.withPrefix(ctx.receiveNonNullNode(union.getPrefix(), JavaScriptReceiver::receiveSpace));
            union = union.withMarkers(ctx.receiveNonNullNode(union.getMarkers(), ctx::receiveMarkers));
            union = union.getPadding().withTypes(ctx.receiveNonNullNodes(union.getPadding().getTypes(), JavaScriptReceiver::receiveRightPaddedTree));
            union = union.withType(ctx.receiveValue(union.getType(), JavaType.class));
            return union;
        }

        @Override
        public JS.Void visitVoid(JS.Void void_, ReceiverContext ctx) {
            void_ = void_.withId(ctx.receiveNonNullValue(void_.getId(), UUID.class));
            void_ = void_.withPrefix(ctx.receiveNonNullNode(void_.getPrefix(), JavaScriptReceiver::receiveSpace));
            void_ = void_.withMarkers(ctx.receiveNonNullNode(void_.getMarkers(), ctx::receiveMarkers));
            void_ = void_.withExpression(ctx.receiveNonNullNode(void_.getExpression(), ctx::receiveTree));
            return void_;
        }

        @Override
        public JS.Yield visitYield(JS.Yield yield, ReceiverContext ctx) {
            yield = yield.withId(ctx.receiveNonNullValue(yield.getId(), UUID.class));
            yield = yield.withPrefix(ctx.receiveNonNullNode(yield.getPrefix(), JavaScriptReceiver::receiveSpace));
            yield = yield.withMarkers(ctx.receiveNonNullNode(yield.getMarkers(), ctx::receiveMarkers));
            yield = yield.withDelegated(ctx.receiveNonNullValue(yield.isDelegated(), boolean.class));
            yield = yield.withExpression(ctx.receiveNode(yield.getExpression(), ctx::receiveTree));
            yield = yield.withType(ctx.receiveValue(yield.getType(), JavaType.class));
            return yield;
        }

        @Override
        public JS.TypeInfo visitTypeInfo(JS.TypeInfo typeInfo, ReceiverContext ctx) {
            typeInfo = typeInfo.withId(ctx.receiveNonNullValue(typeInfo.getId(), UUID.class));
            typeInfo = typeInfo.withPrefix(ctx.receiveNonNullNode(typeInfo.getPrefix(), JavaScriptReceiver::receiveSpace));
            typeInfo = typeInfo.withMarkers(ctx.receiveNonNullNode(typeInfo.getMarkers(), ctx::receiveMarkers));
            typeInfo = typeInfo.withTypeIdentifier(ctx.receiveNonNullNode(typeInfo.getTypeIdentifier(), ctx::receiveTree));
            return typeInfo;
        }

        @Override
        public JS.JSVariableDeclarations visitJSVariableDeclarations(JS.JSVariableDeclarations jSVariableDeclarations, ReceiverContext ctx) {
            jSVariableDeclarations = jSVariableDeclarations.withId(ctx.receiveNonNullValue(jSVariableDeclarations.getId(), UUID.class));
            jSVariableDeclarations = jSVariableDeclarations.withPrefix(ctx.receiveNonNullNode(jSVariableDeclarations.getPrefix(), JavaScriptReceiver::receiveSpace));
            jSVariableDeclarations = jSVariableDeclarations.withMarkers(ctx.receiveNonNullNode(jSVariableDeclarations.getMarkers(), ctx::receiveMarkers));
            jSVariableDeclarations = jSVariableDeclarations.withLeadingAnnotations(ctx.receiveNonNullNodes(jSVariableDeclarations.getLeadingAnnotations(), ctx::receiveTree));
            jSVariableDeclarations = jSVariableDeclarations.withModifiers(ctx.receiveNonNullNodes(jSVariableDeclarations.getModifiers(), ctx::receiveTree));
            jSVariableDeclarations = jSVariableDeclarations.withTypeExpression(ctx.receiveNode(jSVariableDeclarations.getTypeExpression(), ctx::receiveTree));
            jSVariableDeclarations = jSVariableDeclarations.withVarargs(ctx.receiveNode(jSVariableDeclarations.getVarargs(), JavaScriptReceiver::receiveSpace));
            jSVariableDeclarations = jSVariableDeclarations.getPadding().withVariables(ctx.receiveNonNullNodes(jSVariableDeclarations.getPadding().getVariables(), JavaScriptReceiver::receiveRightPaddedTree));
            return jSVariableDeclarations;
        }

        @Override
        public JS.JSVariableDeclarations.JSNamedVariable visitJSVariableDeclarationsJSNamedVariable(JS.JSVariableDeclarations.JSNamedVariable jSNamedVariable, ReceiverContext ctx) {
            jSNamedVariable = jSNamedVariable.withId(ctx.receiveNonNullValue(jSNamedVariable.getId(), UUID.class));
            jSNamedVariable = jSNamedVariable.withPrefix(ctx.receiveNonNullNode(jSNamedVariable.getPrefix(), JavaScriptReceiver::receiveSpace));
            jSNamedVariable = jSNamedVariable.withMarkers(ctx.receiveNonNullNode(jSNamedVariable.getMarkers(), ctx::receiveMarkers));
            jSNamedVariable = jSNamedVariable.withName(ctx.receiveNonNullNode(jSNamedVariable.getName(), ctx::receiveTree));
            jSNamedVariable = jSNamedVariable.withDimensionsAfterName(ctx.receiveNonNullNodes(jSNamedVariable.getDimensionsAfterName(), leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)));
            jSNamedVariable = jSNamedVariable.getPadding().withInitializer(ctx.receiveNode(jSNamedVariable.getPadding().getInitializer(), JavaScriptReceiver::receiveLeftPaddedTree));
            jSNamedVariable = jSNamedVariable.withVariableType(ctx.receiveValue(jSNamedVariable.getVariableType(), JavaType.Variable.class));
            return jSNamedVariable;
        }

        @Override
        public JS.NamespaceDeclaration visitNamespaceDeclaration(JS.NamespaceDeclaration namespaceDeclaration, ReceiverContext ctx) {
            namespaceDeclaration = namespaceDeclaration.withId(ctx.receiveNonNullValue(namespaceDeclaration.getId(), UUID.class));
            namespaceDeclaration = namespaceDeclaration.withPrefix(ctx.receiveNonNullNode(namespaceDeclaration.getPrefix(), JavaScriptReceiver::receiveSpace));
            namespaceDeclaration = namespaceDeclaration.withMarkers(ctx.receiveNonNullNode(namespaceDeclaration.getMarkers(), ctx::receiveMarkers));
            namespaceDeclaration = namespaceDeclaration.withModifiers(ctx.receiveNonNullNodes(namespaceDeclaration.getModifiers(), ctx::receiveTree));
            namespaceDeclaration = namespaceDeclaration.withNamespace(ctx.receiveNonNullNode(namespaceDeclaration.getNamespace(), JavaScriptReceiver::receiveSpace));
            namespaceDeclaration = namespaceDeclaration.getPadding().withName(ctx.receiveNonNullNode(namespaceDeclaration.getPadding().getName(), JavaScriptReceiver::receiveRightPaddedTree));
            namespaceDeclaration = namespaceDeclaration.withBody(ctx.receiveNonNullNode(namespaceDeclaration.getBody(), ctx::receiveTree));
            return namespaceDeclaration;
        }

        @Override
        public J.AnnotatedType visitAnnotatedType(J.AnnotatedType annotatedType, ReceiverContext ctx) {
            annotatedType = annotatedType.withId(ctx.receiveNonNullValue(annotatedType.getId(), UUID.class));
            annotatedType = annotatedType.withPrefix(ctx.receiveNonNullNode(annotatedType.getPrefix(), JavaScriptReceiver::receiveSpace));
            annotatedType = annotatedType.withMarkers(ctx.receiveNonNullNode(annotatedType.getMarkers(), ctx::receiveMarkers));
            annotatedType = annotatedType.withAnnotations(ctx.receiveNonNullNodes(annotatedType.getAnnotations(), ctx::receiveTree));
            annotatedType = annotatedType.withTypeExpression(ctx.receiveNonNullNode(annotatedType.getTypeExpression(), ctx::receiveTree));
            return annotatedType;
        }

        @Override
        public J.Annotation visitAnnotation(J.Annotation annotation, ReceiverContext ctx) {
            annotation = annotation.withId(ctx.receiveNonNullValue(annotation.getId(), UUID.class));
            annotation = annotation.withPrefix(ctx.receiveNonNullNode(annotation.getPrefix(), JavaScriptReceiver::receiveSpace));
            annotation = annotation.withMarkers(ctx.receiveNonNullNode(annotation.getMarkers(), ctx::receiveMarkers));
            annotation = annotation.withAnnotationType(ctx.receiveNonNullNode(annotation.getAnnotationType(), ctx::receiveTree));
            annotation = annotation.getPadding().withArguments(ctx.receiveNode(annotation.getPadding().getArguments(), JavaScriptReceiver::receiveContainer));
            return annotation;
        }

        @Override
        public J.ArrayAccess visitArrayAccess(J.ArrayAccess arrayAccess, ReceiverContext ctx) {
            arrayAccess = arrayAccess.withId(ctx.receiveNonNullValue(arrayAccess.getId(), UUID.class));
            arrayAccess = arrayAccess.withPrefix(ctx.receiveNonNullNode(arrayAccess.getPrefix(), JavaScriptReceiver::receiveSpace));
            arrayAccess = arrayAccess.withMarkers(ctx.receiveNonNullNode(arrayAccess.getMarkers(), ctx::receiveMarkers));
            arrayAccess = arrayAccess.withIndexed(ctx.receiveNonNullNode(arrayAccess.getIndexed(), ctx::receiveTree));
            arrayAccess = arrayAccess.withDimension(ctx.receiveNonNullNode(arrayAccess.getDimension(), ctx::receiveTree));
            arrayAccess = arrayAccess.withType(ctx.receiveValue(arrayAccess.getType(), JavaType.class));
            return arrayAccess;
        }

        @Override
        public J.ArrayType visitArrayType(J.ArrayType arrayType, ReceiverContext ctx) {
            arrayType = arrayType.withId(ctx.receiveNonNullValue(arrayType.getId(), UUID.class));
            arrayType = arrayType.withPrefix(ctx.receiveNonNullNode(arrayType.getPrefix(), JavaScriptReceiver::receiveSpace));
            arrayType = arrayType.withMarkers(ctx.receiveNonNullNode(arrayType.getMarkers(), ctx::receiveMarkers));
            arrayType = arrayType.withElementType(ctx.receiveNonNullNode(arrayType.getElementType(), ctx::receiveTree));
            arrayType = arrayType.withAnnotations(ctx.receiveNodes(arrayType.getAnnotations(), ctx::receiveTree));
            arrayType = arrayType.withDimension(ctx.receiveNode(arrayType.getDimension(), leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)));
            arrayType = arrayType.withType(ctx.receiveValue(arrayType.getType(), JavaType.class));
            return arrayType;
        }

        @Override
        public J.Assert visitAssert(J.Assert assert_, ReceiverContext ctx) {
            assert_ = assert_.withId(ctx.receiveNonNullValue(assert_.getId(), UUID.class));
            assert_ = assert_.withPrefix(ctx.receiveNonNullNode(assert_.getPrefix(), JavaScriptReceiver::receiveSpace));
            assert_ = assert_.withMarkers(ctx.receiveNonNullNode(assert_.getMarkers(), ctx::receiveMarkers));
            assert_ = assert_.withCondition(ctx.receiveNonNullNode(assert_.getCondition(), ctx::receiveTree));
            assert_ = assert_.withDetail(ctx.receiveNode(assert_.getDetail(), JavaScriptReceiver::receiveLeftPaddedTree));
            return assert_;
        }

        @Override
        public J.Assignment visitAssignment(J.Assignment assignment, ReceiverContext ctx) {
            assignment = assignment.withId(ctx.receiveNonNullValue(assignment.getId(), UUID.class));
            assignment = assignment.withPrefix(ctx.receiveNonNullNode(assignment.getPrefix(), JavaScriptReceiver::receiveSpace));
            assignment = assignment.withMarkers(ctx.receiveNonNullNode(assignment.getMarkers(), ctx::receiveMarkers));
            assignment = assignment.withVariable(ctx.receiveNonNullNode(assignment.getVariable(), ctx::receiveTree));
            assignment = assignment.getPadding().withAssignment(ctx.receiveNonNullNode(assignment.getPadding().getAssignment(), JavaScriptReceiver::receiveLeftPaddedTree));
            assignment = assignment.withType(ctx.receiveValue(assignment.getType(), JavaType.class));
            return assignment;
        }

        @Override
        public J.AssignmentOperation visitAssignmentOperation(J.AssignmentOperation assignmentOperation, ReceiverContext ctx) {
            assignmentOperation = assignmentOperation.withId(ctx.receiveNonNullValue(assignmentOperation.getId(), UUID.class));
            assignmentOperation = assignmentOperation.withPrefix(ctx.receiveNonNullNode(assignmentOperation.getPrefix(), JavaScriptReceiver::receiveSpace));
            assignmentOperation = assignmentOperation.withMarkers(ctx.receiveNonNullNode(assignmentOperation.getMarkers(), ctx::receiveMarkers));
            assignmentOperation = assignmentOperation.withVariable(ctx.receiveNonNullNode(assignmentOperation.getVariable(), ctx::receiveTree));
            assignmentOperation = assignmentOperation.getPadding().withOperator(ctx.receiveNonNullNode(assignmentOperation.getPadding().getOperator(), leftPaddedValueReceiver(org.openrewrite.java.tree.J.AssignmentOperation.Type.class)));
            assignmentOperation = assignmentOperation.withAssignment(ctx.receiveNonNullNode(assignmentOperation.getAssignment(), ctx::receiveTree));
            assignmentOperation = assignmentOperation.withType(ctx.receiveValue(assignmentOperation.getType(), JavaType.class));
            return assignmentOperation;
        }

        @Override
        public J.Binary visitBinary(J.Binary binary, ReceiverContext ctx) {
            binary = binary.withId(ctx.receiveNonNullValue(binary.getId(), UUID.class));
            binary = binary.withPrefix(ctx.receiveNonNullNode(binary.getPrefix(), JavaScriptReceiver::receiveSpace));
            binary = binary.withMarkers(ctx.receiveNonNullNode(binary.getMarkers(), ctx::receiveMarkers));
            binary = binary.withLeft(ctx.receiveNonNullNode(binary.getLeft(), ctx::receiveTree));
            binary = binary.getPadding().withOperator(ctx.receiveNonNullNode(binary.getPadding().getOperator(), leftPaddedValueReceiver(org.openrewrite.java.tree.J.Binary.Type.class)));
            binary = binary.withRight(ctx.receiveNonNullNode(binary.getRight(), ctx::receiveTree));
            binary = binary.withType(ctx.receiveValue(binary.getType(), JavaType.class));
            return binary;
        }

        @Override
        public J.Block visitBlock(J.Block block, ReceiverContext ctx) {
            block = block.withId(ctx.receiveNonNullValue(block.getId(), UUID.class));
            block = block.withPrefix(ctx.receiveNonNullNode(block.getPrefix(), JavaScriptReceiver::receiveSpace));
            block = block.withMarkers(ctx.receiveNonNullNode(block.getMarkers(), ctx::receiveMarkers));
            block = block.getPadding().withStatic(ctx.receiveNonNullNode(block.getPadding().getStatic(), rightPaddedValueReceiver(java.lang.Boolean.class)));
            block = block.getPadding().withStatements(ctx.receiveNonNullNodes(block.getPadding().getStatements(), JavaScriptReceiver::receiveRightPaddedTree));
            block = block.withEnd(ctx.receiveNonNullNode(block.getEnd(), JavaScriptReceiver::receiveSpace));
            return block;
        }

        @Override
        public J.Break visitBreak(J.Break break_, ReceiverContext ctx) {
            break_ = break_.withId(ctx.receiveNonNullValue(break_.getId(), UUID.class));
            break_ = break_.withPrefix(ctx.receiveNonNullNode(break_.getPrefix(), JavaScriptReceiver::receiveSpace));
            break_ = break_.withMarkers(ctx.receiveNonNullNode(break_.getMarkers(), ctx::receiveMarkers));
            break_ = break_.withLabel(ctx.receiveNode(break_.getLabel(), ctx::receiveTree));
            return break_;
        }

        @Override
        public J.Case visitCase(J.Case case_, ReceiverContext ctx) {
            case_ = case_.withId(ctx.receiveNonNullValue(case_.getId(), UUID.class));
            case_ = case_.withPrefix(ctx.receiveNonNullNode(case_.getPrefix(), JavaScriptReceiver::receiveSpace));
            case_ = case_.withMarkers(ctx.receiveNonNullNode(case_.getMarkers(), ctx::receiveMarkers));
            case_ = case_.withType(ctx.receiveNonNullValue(case_.getType(), J.Case.Type.class));
            case_ = case_.getPadding().withExpressions(ctx.receiveNonNullNode(case_.getPadding().getExpressions(), JavaScriptReceiver::receiveContainer));
            case_ = case_.getPadding().withStatements(ctx.receiveNonNullNode(case_.getPadding().getStatements(), JavaScriptReceiver::receiveContainer));
            case_ = case_.getPadding().withBody(ctx.receiveNode(case_.getPadding().getBody(), JavaScriptReceiver::receiveRightPaddedTree));
            return case_;
        }

        @Override
        public J.ClassDeclaration visitClassDeclaration(J.ClassDeclaration classDeclaration, ReceiverContext ctx) {
            classDeclaration = classDeclaration.withId(ctx.receiveNonNullValue(classDeclaration.getId(), UUID.class));
            classDeclaration = classDeclaration.withPrefix(ctx.receiveNonNullNode(classDeclaration.getPrefix(), JavaScriptReceiver::receiveSpace));
            classDeclaration = classDeclaration.withMarkers(ctx.receiveNonNullNode(classDeclaration.getMarkers(), ctx::receiveMarkers));
            classDeclaration = classDeclaration.withLeadingAnnotations(ctx.receiveNonNullNodes(classDeclaration.getLeadingAnnotations(), ctx::receiveTree));
            classDeclaration = classDeclaration.withModifiers(ctx.receiveNonNullNodes(classDeclaration.getModifiers(), JavaScriptReceiver::receiveModifier));
            classDeclaration = classDeclaration.getPadding().withKind(ctx.receiveNonNullNode(classDeclaration.getPadding().getKind(), JavaScriptReceiver::receiveClassDeclarationKind));
            classDeclaration = classDeclaration.withName(ctx.receiveNonNullNode(classDeclaration.getName(), ctx::receiveTree));
            classDeclaration = classDeclaration.getPadding().withTypeParameters(ctx.receiveNode(classDeclaration.getPadding().getTypeParameters(), JavaScriptReceiver::receiveContainer));
            classDeclaration = classDeclaration.getPadding().withPrimaryConstructor(ctx.receiveNode(classDeclaration.getPadding().getPrimaryConstructor(), JavaScriptReceiver::receiveContainer));
            classDeclaration = classDeclaration.getPadding().withExtends(ctx.receiveNode(classDeclaration.getPadding().getExtends(), JavaScriptReceiver::receiveLeftPaddedTree));
            classDeclaration = classDeclaration.getPadding().withImplements(ctx.receiveNode(classDeclaration.getPadding().getImplements(), JavaScriptReceiver::receiveContainer));
            classDeclaration = classDeclaration.getPadding().withPermits(ctx.receiveNode(classDeclaration.getPadding().getPermits(), JavaScriptReceiver::receiveContainer));
            classDeclaration = classDeclaration.withBody(ctx.receiveNonNullNode(classDeclaration.getBody(), ctx::receiveTree));
            classDeclaration = classDeclaration.withType(ctx.receiveValue(classDeclaration.getType(), JavaType.FullyQualified.class));
            return classDeclaration;
        }

        @Override
        public J.Continue visitContinue(J.Continue continue_, ReceiverContext ctx) {
            continue_ = continue_.withId(ctx.receiveNonNullValue(continue_.getId(), UUID.class));
            continue_ = continue_.withPrefix(ctx.receiveNonNullNode(continue_.getPrefix(), JavaScriptReceiver::receiveSpace));
            continue_ = continue_.withMarkers(ctx.receiveNonNullNode(continue_.getMarkers(), ctx::receiveMarkers));
            continue_ = continue_.withLabel(ctx.receiveNode(continue_.getLabel(), ctx::receiveTree));
            return continue_;
        }

        @Override
        public J.DoWhileLoop visitDoWhileLoop(J.DoWhileLoop doWhileLoop, ReceiverContext ctx) {
            doWhileLoop = doWhileLoop.withId(ctx.receiveNonNullValue(doWhileLoop.getId(), UUID.class));
            doWhileLoop = doWhileLoop.withPrefix(ctx.receiveNonNullNode(doWhileLoop.getPrefix(), JavaScriptReceiver::receiveSpace));
            doWhileLoop = doWhileLoop.withMarkers(ctx.receiveNonNullNode(doWhileLoop.getMarkers(), ctx::receiveMarkers));
            doWhileLoop = doWhileLoop.getPadding().withBody(ctx.receiveNonNullNode(doWhileLoop.getPadding().getBody(), JavaScriptReceiver::receiveRightPaddedTree));
            doWhileLoop = doWhileLoop.getPadding().withWhileCondition(ctx.receiveNonNullNode(doWhileLoop.getPadding().getWhileCondition(), JavaScriptReceiver::receiveLeftPaddedTree));
            return doWhileLoop;
        }

        @Override
        public J.Empty visitEmpty(J.Empty empty, ReceiverContext ctx) {
            empty = empty.withId(ctx.receiveNonNullValue(empty.getId(), UUID.class));
            empty = empty.withPrefix(ctx.receiveNonNullNode(empty.getPrefix(), JavaScriptReceiver::receiveSpace));
            empty = empty.withMarkers(ctx.receiveNonNullNode(empty.getMarkers(), ctx::receiveMarkers));
            return empty;
        }

        @Override
        public J.EnumValue visitEnumValue(J.EnumValue enumValue, ReceiverContext ctx) {
            enumValue = enumValue.withId(ctx.receiveNonNullValue(enumValue.getId(), UUID.class));
            enumValue = enumValue.withPrefix(ctx.receiveNonNullNode(enumValue.getPrefix(), JavaScriptReceiver::receiveSpace));
            enumValue = enumValue.withMarkers(ctx.receiveNonNullNode(enumValue.getMarkers(), ctx::receiveMarkers));
            enumValue = enumValue.withAnnotations(ctx.receiveNonNullNodes(enumValue.getAnnotations(), ctx::receiveTree));
            enumValue = enumValue.withName(ctx.receiveNonNullNode(enumValue.getName(), ctx::receiveTree));
            enumValue = enumValue.withInitializer(ctx.receiveNode(enumValue.getInitializer(), ctx::receiveTree));
            return enumValue;
        }

        @Override
        public J.EnumValueSet visitEnumValueSet(J.EnumValueSet enumValueSet, ReceiverContext ctx) {
            enumValueSet = enumValueSet.withId(ctx.receiveNonNullValue(enumValueSet.getId(), UUID.class));
            enumValueSet = enumValueSet.withPrefix(ctx.receiveNonNullNode(enumValueSet.getPrefix(), JavaScriptReceiver::receiveSpace));
            enumValueSet = enumValueSet.withMarkers(ctx.receiveNonNullNode(enumValueSet.getMarkers(), ctx::receiveMarkers));
            enumValueSet = enumValueSet.getPadding().withEnums(ctx.receiveNonNullNodes(enumValueSet.getPadding().getEnums(), JavaScriptReceiver::receiveRightPaddedTree));
            enumValueSet = enumValueSet.withTerminatedWithSemicolon(ctx.receiveNonNullValue(enumValueSet.isTerminatedWithSemicolon(), boolean.class));
            return enumValueSet;
        }

        @Override
        public J.FieldAccess visitFieldAccess(J.FieldAccess fieldAccess, ReceiverContext ctx) {
            fieldAccess = fieldAccess.withId(ctx.receiveNonNullValue(fieldAccess.getId(), UUID.class));
            fieldAccess = fieldAccess.withPrefix(ctx.receiveNonNullNode(fieldAccess.getPrefix(), JavaScriptReceiver::receiveSpace));
            fieldAccess = fieldAccess.withMarkers(ctx.receiveNonNullNode(fieldAccess.getMarkers(), ctx::receiveMarkers));
            fieldAccess = fieldAccess.withTarget(ctx.receiveNonNullNode(fieldAccess.getTarget(), ctx::receiveTree));
            fieldAccess = fieldAccess.getPadding().withName(ctx.receiveNonNullNode(fieldAccess.getPadding().getName(), JavaScriptReceiver::receiveLeftPaddedTree));
            fieldAccess = fieldAccess.withType(ctx.receiveValue(fieldAccess.getType(), JavaType.class));
            return fieldAccess;
        }

        @Override
        public J.ForEachLoop visitForEachLoop(J.ForEachLoop forEachLoop, ReceiverContext ctx) {
            forEachLoop = forEachLoop.withId(ctx.receiveNonNullValue(forEachLoop.getId(), UUID.class));
            forEachLoop = forEachLoop.withPrefix(ctx.receiveNonNullNode(forEachLoop.getPrefix(), JavaScriptReceiver::receiveSpace));
            forEachLoop = forEachLoop.withMarkers(ctx.receiveNonNullNode(forEachLoop.getMarkers(), ctx::receiveMarkers));
            forEachLoop = forEachLoop.withControl(ctx.receiveNonNullNode(forEachLoop.getControl(), ctx::receiveTree));
            forEachLoop = forEachLoop.getPadding().withBody(ctx.receiveNonNullNode(forEachLoop.getPadding().getBody(), JavaScriptReceiver::receiveRightPaddedTree));
            return forEachLoop;
        }

        @Override
        public J.ForEachLoop.Control visitForEachControl(J.ForEachLoop.Control control, ReceiverContext ctx) {
            control = control.withId(ctx.receiveNonNullValue(control.getId(), UUID.class));
            control = control.withPrefix(ctx.receiveNonNullNode(control.getPrefix(), JavaScriptReceiver::receiveSpace));
            control = control.withMarkers(ctx.receiveNonNullNode(control.getMarkers(), ctx::receiveMarkers));
            control = control.getPadding().withVariable(ctx.receiveNonNullNode(control.getPadding().getVariable(), JavaScriptReceiver::receiveRightPaddedTree));
            control = control.getPadding().withIterable(ctx.receiveNonNullNode(control.getPadding().getIterable(), JavaScriptReceiver::receiveRightPaddedTree));
            return control;
        }

        @Override
        public J.ForLoop visitForLoop(J.ForLoop forLoop, ReceiverContext ctx) {
            forLoop = forLoop.withId(ctx.receiveNonNullValue(forLoop.getId(), UUID.class));
            forLoop = forLoop.withPrefix(ctx.receiveNonNullNode(forLoop.getPrefix(), JavaScriptReceiver::receiveSpace));
            forLoop = forLoop.withMarkers(ctx.receiveNonNullNode(forLoop.getMarkers(), ctx::receiveMarkers));
            forLoop = forLoop.withControl(ctx.receiveNonNullNode(forLoop.getControl(), ctx::receiveTree));
            forLoop = forLoop.getPadding().withBody(ctx.receiveNonNullNode(forLoop.getPadding().getBody(), JavaScriptReceiver::receiveRightPaddedTree));
            return forLoop;
        }

        @Override
        public J.ForLoop.Control visitForControl(J.ForLoop.Control control, ReceiverContext ctx) {
            control = control.withId(ctx.receiveNonNullValue(control.getId(), UUID.class));
            control = control.withPrefix(ctx.receiveNonNullNode(control.getPrefix(), JavaScriptReceiver::receiveSpace));
            control = control.withMarkers(ctx.receiveNonNullNode(control.getMarkers(), ctx::receiveMarkers));
            control = control.getPadding().withInit(ctx.receiveNonNullNodes(control.getPadding().getInit(), JavaScriptReceiver::receiveRightPaddedTree));
            control = control.getPadding().withCondition(ctx.receiveNonNullNode(control.getPadding().getCondition(), JavaScriptReceiver::receiveRightPaddedTree));
            control = control.getPadding().withUpdate(ctx.receiveNonNullNodes(control.getPadding().getUpdate(), JavaScriptReceiver::receiveRightPaddedTree));
            return control;
        }

        @Override
        public J.ParenthesizedTypeTree visitParenthesizedTypeTree(J.ParenthesizedTypeTree parenthesizedTypeTree, ReceiverContext ctx) {
            parenthesizedTypeTree = parenthesizedTypeTree.withId(ctx.receiveNonNullValue(parenthesizedTypeTree.getId(), UUID.class));
            parenthesizedTypeTree = parenthesizedTypeTree.withPrefix(ctx.receiveNonNullNode(parenthesizedTypeTree.getPrefix(), JavaScriptReceiver::receiveSpace));
            parenthesizedTypeTree = parenthesizedTypeTree.withMarkers(ctx.receiveNonNullNode(parenthesizedTypeTree.getMarkers(), ctx::receiveMarkers));
            parenthesizedTypeTree = parenthesizedTypeTree.withAnnotations(ctx.receiveNonNullNodes(parenthesizedTypeTree.getAnnotations(), ctx::receiveTree));
            parenthesizedTypeTree = parenthesizedTypeTree.withParenthesizedType(ctx.receiveNonNullNode(parenthesizedTypeTree.getParenthesizedType(), ctx::receiveTree));
            return parenthesizedTypeTree;
        }

        @Override
        public J.Identifier visitIdentifier(J.Identifier identifier, ReceiverContext ctx) {
            identifier = identifier.withId(ctx.receiveNonNullValue(identifier.getId(), UUID.class));
            identifier = identifier.withPrefix(ctx.receiveNonNullNode(identifier.getPrefix(), JavaScriptReceiver::receiveSpace));
            identifier = identifier.withMarkers(ctx.receiveNonNullNode(identifier.getMarkers(), ctx::receiveMarkers));
            identifier = identifier.withAnnotations(ctx.receiveNonNullNodes(identifier.getAnnotations(), ctx::receiveTree));
            identifier = identifier.withSimpleName(ctx.receiveNonNullValue(identifier.getSimpleName(), String.class));
            identifier = identifier.withType(ctx.receiveValue(identifier.getType(), JavaType.class));
            identifier = identifier.withFieldType(ctx.receiveValue(identifier.getFieldType(), JavaType.Variable.class));
            return identifier;
        }

        @Override
        public J.If visitIf(J.If if_, ReceiverContext ctx) {
            if_ = if_.withId(ctx.receiveNonNullValue(if_.getId(), UUID.class));
            if_ = if_.withPrefix(ctx.receiveNonNullNode(if_.getPrefix(), JavaScriptReceiver::receiveSpace));
            if_ = if_.withMarkers(ctx.receiveNonNullNode(if_.getMarkers(), ctx::receiveMarkers));
            if_ = if_.withIfCondition(ctx.receiveNonNullNode(if_.getIfCondition(), ctx::receiveTree));
            if_ = if_.getPadding().withThenPart(ctx.receiveNonNullNode(if_.getPadding().getThenPart(), JavaScriptReceiver::receiveRightPaddedTree));
            if_ = if_.withElsePart(ctx.receiveNode(if_.getElsePart(), ctx::receiveTree));
            return if_;
        }

        @Override
        public J.If.Else visitElse(J.If.Else else_, ReceiverContext ctx) {
            else_ = else_.withId(ctx.receiveNonNullValue(else_.getId(), UUID.class));
            else_ = else_.withPrefix(ctx.receiveNonNullNode(else_.getPrefix(), JavaScriptReceiver::receiveSpace));
            else_ = else_.withMarkers(ctx.receiveNonNullNode(else_.getMarkers(), ctx::receiveMarkers));
            else_ = else_.getPadding().withBody(ctx.receiveNonNullNode(else_.getPadding().getBody(), JavaScriptReceiver::receiveRightPaddedTree));
            return else_;
        }

        @Override
        public J.Import visitImport(J.Import import_, ReceiverContext ctx) {
            import_ = import_.withId(ctx.receiveNonNullValue(import_.getId(), UUID.class));
            import_ = import_.withPrefix(ctx.receiveNonNullNode(import_.getPrefix(), JavaScriptReceiver::receiveSpace));
            import_ = import_.withMarkers(ctx.receiveNonNullNode(import_.getMarkers(), ctx::receiveMarkers));
            import_ = import_.getPadding().withStatic(ctx.receiveNonNullNode(import_.getPadding().getStatic(), leftPaddedValueReceiver(java.lang.Boolean.class)));
            import_ = import_.withQualid(ctx.receiveNonNullNode(import_.getQualid(), ctx::receiveTree));
            import_ = import_.getPadding().withAlias(ctx.receiveNode(import_.getPadding().getAlias(), JavaScriptReceiver::receiveLeftPaddedTree));
            return import_;
        }

        @Override
        public J.InstanceOf visitInstanceOf(J.InstanceOf instanceOf, ReceiverContext ctx) {
            instanceOf = instanceOf.withId(ctx.receiveNonNullValue(instanceOf.getId(), UUID.class));
            instanceOf = instanceOf.withPrefix(ctx.receiveNonNullNode(instanceOf.getPrefix(), JavaScriptReceiver::receiveSpace));
            instanceOf = instanceOf.withMarkers(ctx.receiveNonNullNode(instanceOf.getMarkers(), ctx::receiveMarkers));
            instanceOf = instanceOf.getPadding().withExpression(ctx.receiveNonNullNode(instanceOf.getPadding().getExpression(), JavaScriptReceiver::receiveRightPaddedTree));
            instanceOf = instanceOf.withClazz(ctx.receiveNonNullNode(instanceOf.getClazz(), ctx::receiveTree));
            instanceOf = instanceOf.withPattern(ctx.receiveNode(instanceOf.getPattern(), ctx::receiveTree));
            instanceOf = instanceOf.withType(ctx.receiveValue(instanceOf.getType(), JavaType.class));
            return instanceOf;
        }

        @Override
        public J.IntersectionType visitIntersectionType(J.IntersectionType intersectionType, ReceiverContext ctx) {
            intersectionType = intersectionType.withId(ctx.receiveNonNullValue(intersectionType.getId(), UUID.class));
            intersectionType = intersectionType.withPrefix(ctx.receiveNonNullNode(intersectionType.getPrefix(), JavaScriptReceiver::receiveSpace));
            intersectionType = intersectionType.withMarkers(ctx.receiveNonNullNode(intersectionType.getMarkers(), ctx::receiveMarkers));
            intersectionType = intersectionType.getPadding().withBounds(ctx.receiveNonNullNode(intersectionType.getPadding().getBounds(), JavaScriptReceiver::receiveContainer));
            return intersectionType;
        }

        @Override
        public J.Label visitLabel(J.Label label, ReceiverContext ctx) {
            label = label.withId(ctx.receiveNonNullValue(label.getId(), UUID.class));
            label = label.withPrefix(ctx.receiveNonNullNode(label.getPrefix(), JavaScriptReceiver::receiveSpace));
            label = label.withMarkers(ctx.receiveNonNullNode(label.getMarkers(), ctx::receiveMarkers));
            label = label.getPadding().withLabel(ctx.receiveNonNullNode(label.getPadding().getLabel(), JavaScriptReceiver::receiveRightPaddedTree));
            label = label.withStatement(ctx.receiveNonNullNode(label.getStatement(), ctx::receiveTree));
            return label;
        }

        @Override
        public J.Lambda visitLambda(J.Lambda lambda, ReceiverContext ctx) {
            lambda = lambda.withId(ctx.receiveNonNullValue(lambda.getId(), UUID.class));
            lambda = lambda.withPrefix(ctx.receiveNonNullNode(lambda.getPrefix(), JavaScriptReceiver::receiveSpace));
            lambda = lambda.withMarkers(ctx.receiveNonNullNode(lambda.getMarkers(), ctx::receiveMarkers));
            lambda = lambda.withParameters(ctx.receiveNonNullNode(lambda.getParameters(), JavaScriptReceiver::receiveLambdaParameters));
            lambda = lambda.withArrow(ctx.receiveNonNullNode(lambda.getArrow(), JavaScriptReceiver::receiveSpace));
            lambda = lambda.withBody(ctx.receiveNonNullNode(lambda.getBody(), ctx::receiveTree));
            lambda = lambda.withType(ctx.receiveValue(lambda.getType(), JavaType.class));
            return lambda;
        }

        @Override
        public J.Literal visitLiteral(J.Literal literal, ReceiverContext ctx) {
            literal = literal.withId(ctx.receiveNonNullValue(literal.getId(), UUID.class));
            literal = literal.withPrefix(ctx.receiveNonNullNode(literal.getPrefix(), JavaScriptReceiver::receiveSpace));
            literal = literal.withMarkers(ctx.receiveNonNullNode(literal.getMarkers(), ctx::receiveMarkers));
            literal = literal.withValue(ctx.receiveValue(literal.getValue(), Object.class));
            literal = literal.withValueSource(ctx.receiveValue(literal.getValueSource(), String.class));
            literal = literal.withUnicodeEscapes(ctx.receiveValues(literal.getUnicodeEscapes(), J.Literal.UnicodeEscape.class));
            literal = literal.withType(ctx.receiveValue(literal.getType(), JavaType.Primitive.class));
            return literal;
        }

        @Override
        public J.MemberReference visitMemberReference(J.MemberReference memberReference, ReceiverContext ctx) {
            memberReference = memberReference.withId(ctx.receiveNonNullValue(memberReference.getId(), UUID.class));
            memberReference = memberReference.withPrefix(ctx.receiveNonNullNode(memberReference.getPrefix(), JavaScriptReceiver::receiveSpace));
            memberReference = memberReference.withMarkers(ctx.receiveNonNullNode(memberReference.getMarkers(), ctx::receiveMarkers));
            memberReference = memberReference.getPadding().withContaining(ctx.receiveNonNullNode(memberReference.getPadding().getContaining(), JavaScriptReceiver::receiveRightPaddedTree));
            memberReference = memberReference.getPadding().withTypeParameters(ctx.receiveNode(memberReference.getPadding().getTypeParameters(), JavaScriptReceiver::receiveContainer));
            memberReference = memberReference.getPadding().withReference(ctx.receiveNonNullNode(memberReference.getPadding().getReference(), JavaScriptReceiver::receiveLeftPaddedTree));
            memberReference = memberReference.withType(ctx.receiveValue(memberReference.getType(), JavaType.class));
            memberReference = memberReference.withMethodType(ctx.receiveValue(memberReference.getMethodType(), JavaType.Method.class));
            memberReference = memberReference.withVariableType(ctx.receiveValue(memberReference.getVariableType(), JavaType.Variable.class));
            return memberReference;
        }

        @Override
        public J.MethodDeclaration visitMethodDeclaration(J.MethodDeclaration methodDeclaration, ReceiverContext ctx) {
            methodDeclaration = methodDeclaration.withId(ctx.receiveNonNullValue(methodDeclaration.getId(), UUID.class));
            methodDeclaration = methodDeclaration.withPrefix(ctx.receiveNonNullNode(methodDeclaration.getPrefix(), JavaScriptReceiver::receiveSpace));
            methodDeclaration = methodDeclaration.withMarkers(ctx.receiveNonNullNode(methodDeclaration.getMarkers(), ctx::receiveMarkers));
            methodDeclaration = methodDeclaration.withLeadingAnnotations(ctx.receiveNonNullNodes(methodDeclaration.getLeadingAnnotations(), ctx::receiveTree));
            methodDeclaration = methodDeclaration.withModifiers(ctx.receiveNonNullNodes(methodDeclaration.getModifiers(), JavaScriptReceiver::receiveModifier));
            methodDeclaration = methodDeclaration.getAnnotations().withTypeParameters(ctx.receiveNode(methodDeclaration.getAnnotations().getTypeParameters(), JavaScriptReceiver::receiveMethodTypeParameters));
            methodDeclaration = methodDeclaration.withReturnTypeExpression(ctx.receiveNode(methodDeclaration.getReturnTypeExpression(), ctx::receiveTree));
            methodDeclaration = methodDeclaration.getAnnotations().withName(ctx.receiveNonNullNode(methodDeclaration.getAnnotations().getName(), JavaScriptReceiver::receiveMethodIdentifierWithAnnotations));
            methodDeclaration = methodDeclaration.getPadding().withParameters(ctx.receiveNonNullNode(methodDeclaration.getPadding().getParameters(), JavaScriptReceiver::receiveContainer));
            methodDeclaration = methodDeclaration.getPadding().withThrows(ctx.receiveNode(methodDeclaration.getPadding().getThrows(), JavaScriptReceiver::receiveContainer));
            methodDeclaration = methodDeclaration.withBody(ctx.receiveNode(methodDeclaration.getBody(), ctx::receiveTree));
            methodDeclaration = methodDeclaration.getPadding().withDefaultValue(ctx.receiveNode(methodDeclaration.getPadding().getDefaultValue(), JavaScriptReceiver::receiveLeftPaddedTree));
            methodDeclaration = methodDeclaration.withMethodType(ctx.receiveValue(methodDeclaration.getMethodType(), JavaType.Method.class));
            return methodDeclaration;
        }

        @Override
        public J.MethodInvocation visitMethodInvocation(J.MethodInvocation methodInvocation, ReceiverContext ctx) {
            methodInvocation = methodInvocation.withId(ctx.receiveNonNullValue(methodInvocation.getId(), UUID.class));
            methodInvocation = methodInvocation.withPrefix(ctx.receiveNonNullNode(methodInvocation.getPrefix(), JavaScriptReceiver::receiveSpace));
            methodInvocation = methodInvocation.withMarkers(ctx.receiveNonNullNode(methodInvocation.getMarkers(), ctx::receiveMarkers));
            methodInvocation = methodInvocation.getPadding().withSelect(ctx.receiveNode(methodInvocation.getPadding().getSelect(), JavaScriptReceiver::receiveRightPaddedTree));
            methodInvocation = methodInvocation.getPadding().withTypeParameters(ctx.receiveNode(methodInvocation.getPadding().getTypeParameters(), JavaScriptReceiver::receiveContainer));
            methodInvocation = methodInvocation.withName(ctx.receiveNonNullNode(methodInvocation.getName(), ctx::receiveTree));
            methodInvocation = methodInvocation.getPadding().withArguments(ctx.receiveNonNullNode(methodInvocation.getPadding().getArguments(), JavaScriptReceiver::receiveContainer));
            methodInvocation = methodInvocation.withMethodType(ctx.receiveValue(methodInvocation.getMethodType(), JavaType.Method.class));
            return methodInvocation;
        }

        @Override
        public J.MultiCatch visitMultiCatch(J.MultiCatch multiCatch, ReceiverContext ctx) {
            multiCatch = multiCatch.withId(ctx.receiveNonNullValue(multiCatch.getId(), UUID.class));
            multiCatch = multiCatch.withPrefix(ctx.receiveNonNullNode(multiCatch.getPrefix(), JavaScriptReceiver::receiveSpace));
            multiCatch = multiCatch.withMarkers(ctx.receiveNonNullNode(multiCatch.getMarkers(), ctx::receiveMarkers));
            multiCatch = multiCatch.getPadding().withAlternatives(ctx.receiveNonNullNodes(multiCatch.getPadding().getAlternatives(), JavaScriptReceiver::receiveRightPaddedTree));
            return multiCatch;
        }

        @Override
        public J.NewArray visitNewArray(J.NewArray newArray, ReceiverContext ctx) {
            newArray = newArray.withId(ctx.receiveNonNullValue(newArray.getId(), UUID.class));
            newArray = newArray.withPrefix(ctx.receiveNonNullNode(newArray.getPrefix(), JavaScriptReceiver::receiveSpace));
            newArray = newArray.withMarkers(ctx.receiveNonNullNode(newArray.getMarkers(), ctx::receiveMarkers));
            newArray = newArray.withTypeExpression(ctx.receiveNode(newArray.getTypeExpression(), ctx::receiveTree));
            newArray = newArray.withDimensions(ctx.receiveNonNullNodes(newArray.getDimensions(), ctx::receiveTree));
            newArray = newArray.getPadding().withInitializer(ctx.receiveNode(newArray.getPadding().getInitializer(), JavaScriptReceiver::receiveContainer));
            newArray = newArray.withType(ctx.receiveValue(newArray.getType(), JavaType.class));
            return newArray;
        }

        @Override
        public J.ArrayDimension visitArrayDimension(J.ArrayDimension arrayDimension, ReceiverContext ctx) {
            arrayDimension = arrayDimension.withId(ctx.receiveNonNullValue(arrayDimension.getId(), UUID.class));
            arrayDimension = arrayDimension.withPrefix(ctx.receiveNonNullNode(arrayDimension.getPrefix(), JavaScriptReceiver::receiveSpace));
            arrayDimension = arrayDimension.withMarkers(ctx.receiveNonNullNode(arrayDimension.getMarkers(), ctx::receiveMarkers));
            arrayDimension = arrayDimension.getPadding().withIndex(ctx.receiveNonNullNode(arrayDimension.getPadding().getIndex(), JavaScriptReceiver::receiveRightPaddedTree));
            return arrayDimension;
        }

        @Override
        public J.NewClass visitNewClass(J.NewClass newClass, ReceiverContext ctx) {
            newClass = newClass.withId(ctx.receiveNonNullValue(newClass.getId(), UUID.class));
            newClass = newClass.withPrefix(ctx.receiveNonNullNode(newClass.getPrefix(), JavaScriptReceiver::receiveSpace));
            newClass = newClass.withMarkers(ctx.receiveNonNullNode(newClass.getMarkers(), ctx::receiveMarkers));
            newClass = newClass.getPadding().withEnclosing(ctx.receiveNode(newClass.getPadding().getEnclosing(), JavaScriptReceiver::receiveRightPaddedTree));
            newClass = newClass.withNew(ctx.receiveNonNullNode(newClass.getNew(), JavaScriptReceiver::receiveSpace));
            newClass = newClass.withClazz(ctx.receiveNode(newClass.getClazz(), ctx::receiveTree));
            newClass = newClass.getPadding().withArguments(ctx.receiveNonNullNode(newClass.getPadding().getArguments(), JavaScriptReceiver::receiveContainer));
            newClass = newClass.withBody(ctx.receiveNode(newClass.getBody(), ctx::receiveTree));
            newClass = newClass.withConstructorType(ctx.receiveValue(newClass.getConstructorType(), JavaType.Method.class));
            return newClass;
        }

        @Override
        public J.NullableType visitNullableType(J.NullableType nullableType, ReceiverContext ctx) {
            nullableType = nullableType.withId(ctx.receiveNonNullValue(nullableType.getId(), UUID.class));
            nullableType = nullableType.withPrefix(ctx.receiveNonNullNode(nullableType.getPrefix(), JavaScriptReceiver::receiveSpace));
            nullableType = nullableType.withMarkers(ctx.receiveNonNullNode(nullableType.getMarkers(), ctx::receiveMarkers));
            nullableType = nullableType.withAnnotations(ctx.receiveNonNullNodes(nullableType.getAnnotations(), ctx::receiveTree));
            nullableType = nullableType.getPadding().withTypeTree(ctx.receiveNonNullNode(nullableType.getPadding().getTypeTree(), JavaScriptReceiver::receiveRightPaddedTree));
            return nullableType;
        }

        @Override
        public J.Package visitPackage(J.Package package_, ReceiverContext ctx) {
            package_ = package_.withId(ctx.receiveNonNullValue(package_.getId(), UUID.class));
            package_ = package_.withPrefix(ctx.receiveNonNullNode(package_.getPrefix(), JavaScriptReceiver::receiveSpace));
            package_ = package_.withMarkers(ctx.receiveNonNullNode(package_.getMarkers(), ctx::receiveMarkers));
            package_ = package_.withExpression(ctx.receiveNonNullNode(package_.getExpression(), ctx::receiveTree));
            package_ = package_.withAnnotations(ctx.receiveNonNullNodes(package_.getAnnotations(), ctx::receiveTree));
            return package_;
        }

        @Override
        public J.ParameterizedType visitParameterizedType(J.ParameterizedType parameterizedType, ReceiverContext ctx) {
            parameterizedType = parameterizedType.withId(ctx.receiveNonNullValue(parameterizedType.getId(), UUID.class));
            parameterizedType = parameterizedType.withPrefix(ctx.receiveNonNullNode(parameterizedType.getPrefix(), JavaScriptReceiver::receiveSpace));
            parameterizedType = parameterizedType.withMarkers(ctx.receiveNonNullNode(parameterizedType.getMarkers(), ctx::receiveMarkers));
            parameterizedType = parameterizedType.withClazz(ctx.receiveNonNullNode(parameterizedType.getClazz(), ctx::receiveTree));
            parameterizedType = parameterizedType.getPadding().withTypeParameters(ctx.receiveNode(parameterizedType.getPadding().getTypeParameters(), JavaScriptReceiver::receiveContainer));
            parameterizedType = parameterizedType.withType(ctx.receiveValue(parameterizedType.getType(), JavaType.class));
            return parameterizedType;
        }

        @Override
        public <J2 extends J> J.Parentheses<J2> visitParentheses(J.Parentheses<J2> parentheses, ReceiverContext ctx) {
            parentheses = parentheses.withId(ctx.receiveNonNullValue(parentheses.getId(), UUID.class));
            parentheses = parentheses.withPrefix(ctx.receiveNonNullNode(parentheses.getPrefix(), JavaScriptReceiver::receiveSpace));
            parentheses = parentheses.withMarkers(ctx.receiveNonNullNode(parentheses.getMarkers(), ctx::receiveMarkers));
            parentheses = parentheses.getPadding().withTree(ctx.receiveNonNullNode(parentheses.getPadding().getTree(), JavaScriptReceiver::receiveRightPaddedTree));
            return parentheses;
        }

        @Override
        public <J2 extends J> J.ControlParentheses<J2> visitControlParentheses(J.ControlParentheses<J2> controlParentheses, ReceiverContext ctx) {
            controlParentheses = controlParentheses.withId(ctx.receiveNonNullValue(controlParentheses.getId(), UUID.class));
            controlParentheses = controlParentheses.withPrefix(ctx.receiveNonNullNode(controlParentheses.getPrefix(), JavaScriptReceiver::receiveSpace));
            controlParentheses = controlParentheses.withMarkers(ctx.receiveNonNullNode(controlParentheses.getMarkers(), ctx::receiveMarkers));
            controlParentheses = controlParentheses.getPadding().withTree(ctx.receiveNonNullNode(controlParentheses.getPadding().getTree(), JavaScriptReceiver::receiveRightPaddedTree));
            return controlParentheses;
        }

        @Override
        public J.Primitive visitPrimitive(J.Primitive primitive, ReceiverContext ctx) {
            primitive = primitive.withId(ctx.receiveNonNullValue(primitive.getId(), UUID.class));
            primitive = primitive.withPrefix(ctx.receiveNonNullNode(primitive.getPrefix(), JavaScriptReceiver::receiveSpace));
            primitive = primitive.withMarkers(ctx.receiveNonNullNode(primitive.getMarkers(), ctx::receiveMarkers));
            primitive = primitive.withType(ctx.receiveValue(primitive.getType(), JavaType.Primitive.class));
            return primitive;
        }

        @Override
        public J.Return visitReturn(J.Return return_, ReceiverContext ctx) {
            return_ = return_.withId(ctx.receiveNonNullValue(return_.getId(), UUID.class));
            return_ = return_.withPrefix(ctx.receiveNonNullNode(return_.getPrefix(), JavaScriptReceiver::receiveSpace));
            return_ = return_.withMarkers(ctx.receiveNonNullNode(return_.getMarkers(), ctx::receiveMarkers));
            return_ = return_.withExpression(ctx.receiveNode(return_.getExpression(), ctx::receiveTree));
            return return_;
        }

        @Override
        public J.Switch visitSwitch(J.Switch switch_, ReceiverContext ctx) {
            switch_ = switch_.withId(ctx.receiveNonNullValue(switch_.getId(), UUID.class));
            switch_ = switch_.withPrefix(ctx.receiveNonNullNode(switch_.getPrefix(), JavaScriptReceiver::receiveSpace));
            switch_ = switch_.withMarkers(ctx.receiveNonNullNode(switch_.getMarkers(), ctx::receiveMarkers));
            switch_ = switch_.withSelector(ctx.receiveNonNullNode(switch_.getSelector(), ctx::receiveTree));
            switch_ = switch_.withCases(ctx.receiveNonNullNode(switch_.getCases(), ctx::receiveTree));
            return switch_;
        }

        @Override
        public J.SwitchExpression visitSwitchExpression(J.SwitchExpression switchExpression, ReceiverContext ctx) {
            switchExpression = switchExpression.withId(ctx.receiveNonNullValue(switchExpression.getId(), UUID.class));
            switchExpression = switchExpression.withPrefix(ctx.receiveNonNullNode(switchExpression.getPrefix(), JavaScriptReceiver::receiveSpace));
            switchExpression = switchExpression.withMarkers(ctx.receiveNonNullNode(switchExpression.getMarkers(), ctx::receiveMarkers));
            switchExpression = switchExpression.withSelector(ctx.receiveNonNullNode(switchExpression.getSelector(), ctx::receiveTree));
            switchExpression = switchExpression.withCases(ctx.receiveNonNullNode(switchExpression.getCases(), ctx::receiveTree));
            return switchExpression;
        }

        @Override
        public J.Synchronized visitSynchronized(J.Synchronized synchronized_, ReceiverContext ctx) {
            synchronized_ = synchronized_.withId(ctx.receiveNonNullValue(synchronized_.getId(), UUID.class));
            synchronized_ = synchronized_.withPrefix(ctx.receiveNonNullNode(synchronized_.getPrefix(), JavaScriptReceiver::receiveSpace));
            synchronized_ = synchronized_.withMarkers(ctx.receiveNonNullNode(synchronized_.getMarkers(), ctx::receiveMarkers));
            synchronized_ = synchronized_.withLock(ctx.receiveNonNullNode(synchronized_.getLock(), ctx::receiveTree));
            synchronized_ = synchronized_.withBody(ctx.receiveNonNullNode(synchronized_.getBody(), ctx::receiveTree));
            return synchronized_;
        }

        @Override
        public J.Ternary visitTernary(J.Ternary ternary, ReceiverContext ctx) {
            ternary = ternary.withId(ctx.receiveNonNullValue(ternary.getId(), UUID.class));
            ternary = ternary.withPrefix(ctx.receiveNonNullNode(ternary.getPrefix(), JavaScriptReceiver::receiveSpace));
            ternary = ternary.withMarkers(ctx.receiveNonNullNode(ternary.getMarkers(), ctx::receiveMarkers));
            ternary = ternary.withCondition(ctx.receiveNonNullNode(ternary.getCondition(), ctx::receiveTree));
            ternary = ternary.getPadding().withTruePart(ctx.receiveNonNullNode(ternary.getPadding().getTruePart(), JavaScriptReceiver::receiveLeftPaddedTree));
            ternary = ternary.getPadding().withFalsePart(ctx.receiveNonNullNode(ternary.getPadding().getFalsePart(), JavaScriptReceiver::receiveLeftPaddedTree));
            ternary = ternary.withType(ctx.receiveValue(ternary.getType(), JavaType.class));
            return ternary;
        }

        @Override
        public J.Throw visitThrow(J.Throw throw_, ReceiverContext ctx) {
            throw_ = throw_.withId(ctx.receiveNonNullValue(throw_.getId(), UUID.class));
            throw_ = throw_.withPrefix(ctx.receiveNonNullNode(throw_.getPrefix(), JavaScriptReceiver::receiveSpace));
            throw_ = throw_.withMarkers(ctx.receiveNonNullNode(throw_.getMarkers(), ctx::receiveMarkers));
            throw_ = throw_.withException(ctx.receiveNonNullNode(throw_.getException(), ctx::receiveTree));
            return throw_;
        }

        @Override
        public J.Try visitTry(J.Try try_, ReceiverContext ctx) {
            try_ = try_.withId(ctx.receiveNonNullValue(try_.getId(), UUID.class));
            try_ = try_.withPrefix(ctx.receiveNonNullNode(try_.getPrefix(), JavaScriptReceiver::receiveSpace));
            try_ = try_.withMarkers(ctx.receiveNonNullNode(try_.getMarkers(), ctx::receiveMarkers));
            try_ = try_.getPadding().withResources(ctx.receiveNode(try_.getPadding().getResources(), JavaScriptReceiver::receiveContainer));
            try_ = try_.withBody(ctx.receiveNonNullNode(try_.getBody(), ctx::receiveTree));
            try_ = try_.withCatches(ctx.receiveNonNullNodes(try_.getCatches(), ctx::receiveTree));
            try_ = try_.getPadding().withFinally(ctx.receiveNode(try_.getPadding().getFinally(), JavaScriptReceiver::receiveLeftPaddedTree));
            return try_;
        }

        @Override
        public J.Try.Resource visitTryResource(J.Try.Resource resource, ReceiverContext ctx) {
            resource = resource.withId(ctx.receiveNonNullValue(resource.getId(), UUID.class));
            resource = resource.withPrefix(ctx.receiveNonNullNode(resource.getPrefix(), JavaScriptReceiver::receiveSpace));
            resource = resource.withMarkers(ctx.receiveNonNullNode(resource.getMarkers(), ctx::receiveMarkers));
            resource = resource.withVariableDeclarations(ctx.receiveNonNullNode(resource.getVariableDeclarations(), ctx::receiveTree));
            resource = resource.withTerminatedWithSemicolon(ctx.receiveNonNullValue(resource.isTerminatedWithSemicolon(), boolean.class));
            return resource;
        }

        @Override
        public J.Try.Catch visitCatch(J.Try.Catch catch_, ReceiverContext ctx) {
            catch_ = catch_.withId(ctx.receiveNonNullValue(catch_.getId(), UUID.class));
            catch_ = catch_.withPrefix(ctx.receiveNonNullNode(catch_.getPrefix(), JavaScriptReceiver::receiveSpace));
            catch_ = catch_.withMarkers(ctx.receiveNonNullNode(catch_.getMarkers(), ctx::receiveMarkers));
            catch_ = catch_.withParameter(ctx.receiveNonNullNode(catch_.getParameter(), ctx::receiveTree));
            catch_ = catch_.withBody(ctx.receiveNonNullNode(catch_.getBody(), ctx::receiveTree));
            return catch_;
        }

        @Override
        public J.TypeCast visitTypeCast(J.TypeCast typeCast, ReceiverContext ctx) {
            typeCast = typeCast.withId(ctx.receiveNonNullValue(typeCast.getId(), UUID.class));
            typeCast = typeCast.withPrefix(ctx.receiveNonNullNode(typeCast.getPrefix(), JavaScriptReceiver::receiveSpace));
            typeCast = typeCast.withMarkers(ctx.receiveNonNullNode(typeCast.getMarkers(), ctx::receiveMarkers));
            typeCast = typeCast.withClazz(ctx.receiveNonNullNode(typeCast.getClazz(), ctx::receiveTree));
            typeCast = typeCast.withExpression(ctx.receiveNonNullNode(typeCast.getExpression(), ctx::receiveTree));
            return typeCast;
        }

        @Override
        public J.TypeParameter visitTypeParameter(J.TypeParameter typeParameter, ReceiverContext ctx) {
            typeParameter = typeParameter.withId(ctx.receiveNonNullValue(typeParameter.getId(), UUID.class));
            typeParameter = typeParameter.withPrefix(ctx.receiveNonNullNode(typeParameter.getPrefix(), JavaScriptReceiver::receiveSpace));
            typeParameter = typeParameter.withMarkers(ctx.receiveNonNullNode(typeParameter.getMarkers(), ctx::receiveMarkers));
            typeParameter = typeParameter.withAnnotations(ctx.receiveNonNullNodes(typeParameter.getAnnotations(), ctx::receiveTree));
            typeParameter = typeParameter.withModifiers(ctx.receiveNonNullNodes(typeParameter.getModifiers(), JavaScriptReceiver::receiveModifier));
            typeParameter = typeParameter.withName(ctx.receiveNonNullNode(typeParameter.getName(), ctx::receiveTree));
            typeParameter = typeParameter.getPadding().withBounds(ctx.receiveNode(typeParameter.getPadding().getBounds(), JavaScriptReceiver::receiveContainer));
            return typeParameter;
        }

        @Override
        public J.Unary visitUnary(J.Unary unary, ReceiverContext ctx) {
            unary = unary.withId(ctx.receiveNonNullValue(unary.getId(), UUID.class));
            unary = unary.withPrefix(ctx.receiveNonNullNode(unary.getPrefix(), JavaScriptReceiver::receiveSpace));
            unary = unary.withMarkers(ctx.receiveNonNullNode(unary.getMarkers(), ctx::receiveMarkers));
            unary = unary.getPadding().withOperator(ctx.receiveNonNullNode(unary.getPadding().getOperator(), leftPaddedValueReceiver(org.openrewrite.java.tree.J.Unary.Type.class)));
            unary = unary.withExpression(ctx.receiveNonNullNode(unary.getExpression(), ctx::receiveTree));
            unary = unary.withType(ctx.receiveValue(unary.getType(), JavaType.class));
            return unary;
        }

        @Override
        public J.VariableDeclarations visitVariableDeclarations(J.VariableDeclarations variableDeclarations, ReceiverContext ctx) {
            variableDeclarations = variableDeclarations.withId(ctx.receiveNonNullValue(variableDeclarations.getId(), UUID.class));
            variableDeclarations = variableDeclarations.withPrefix(ctx.receiveNonNullNode(variableDeclarations.getPrefix(), JavaScriptReceiver::receiveSpace));
            variableDeclarations = variableDeclarations.withMarkers(ctx.receiveNonNullNode(variableDeclarations.getMarkers(), ctx::receiveMarkers));
            variableDeclarations = variableDeclarations.withLeadingAnnotations(ctx.receiveNonNullNodes(variableDeclarations.getLeadingAnnotations(), ctx::receiveTree));
            variableDeclarations = variableDeclarations.withModifiers(ctx.receiveNonNullNodes(variableDeclarations.getModifiers(), JavaScriptReceiver::receiveModifier));
            variableDeclarations = variableDeclarations.withTypeExpression(ctx.receiveNode(variableDeclarations.getTypeExpression(), ctx::receiveTree));
            variableDeclarations = variableDeclarations.withVarargs(ctx.receiveNode(variableDeclarations.getVarargs(), JavaScriptReceiver::receiveSpace));
            variableDeclarations = variableDeclarations.withDimensionsBeforeName(ctx.receiveNonNullNodes(variableDeclarations.getDimensionsBeforeName(), leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)));
            variableDeclarations = variableDeclarations.getPadding().withVariables(ctx.receiveNonNullNodes(variableDeclarations.getPadding().getVariables(), JavaScriptReceiver::receiveRightPaddedTree));
            return variableDeclarations;
        }

        @Override
        public J.VariableDeclarations.NamedVariable visitVariable(J.VariableDeclarations.NamedVariable namedVariable, ReceiverContext ctx) {
            namedVariable = namedVariable.withId(ctx.receiveNonNullValue(namedVariable.getId(), UUID.class));
            namedVariable = namedVariable.withPrefix(ctx.receiveNonNullNode(namedVariable.getPrefix(), JavaScriptReceiver::receiveSpace));
            namedVariable = namedVariable.withMarkers(ctx.receiveNonNullNode(namedVariable.getMarkers(), ctx::receiveMarkers));
            namedVariable = namedVariable.withName(ctx.receiveNonNullNode(namedVariable.getName(), ctx::receiveTree));
            namedVariable = namedVariable.withDimensionsAfterName(ctx.receiveNonNullNodes(namedVariable.getDimensionsAfterName(), leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)));
            namedVariable = namedVariable.getPadding().withInitializer(ctx.receiveNode(namedVariable.getPadding().getInitializer(), JavaScriptReceiver::receiveLeftPaddedTree));
            namedVariable = namedVariable.withVariableType(ctx.receiveValue(namedVariable.getVariableType(), JavaType.Variable.class));
            return namedVariable;
        }

        @Override
        public J.WhileLoop visitWhileLoop(J.WhileLoop whileLoop, ReceiverContext ctx) {
            whileLoop = whileLoop.withId(ctx.receiveNonNullValue(whileLoop.getId(), UUID.class));
            whileLoop = whileLoop.withPrefix(ctx.receiveNonNullNode(whileLoop.getPrefix(), JavaScriptReceiver::receiveSpace));
            whileLoop = whileLoop.withMarkers(ctx.receiveNonNullNode(whileLoop.getMarkers(), ctx::receiveMarkers));
            whileLoop = whileLoop.withCondition(ctx.receiveNonNullNode(whileLoop.getCondition(), ctx::receiveTree));
            whileLoop = whileLoop.getPadding().withBody(ctx.receiveNonNullNode(whileLoop.getPadding().getBody(), JavaScriptReceiver::receiveRightPaddedTree));
            return whileLoop;
        }

        @Override
        public J.Wildcard visitWildcard(J.Wildcard wildcard, ReceiverContext ctx) {
            wildcard = wildcard.withId(ctx.receiveNonNullValue(wildcard.getId(), UUID.class));
            wildcard = wildcard.withPrefix(ctx.receiveNonNullNode(wildcard.getPrefix(), JavaScriptReceiver::receiveSpace));
            wildcard = wildcard.withMarkers(ctx.receiveNonNullNode(wildcard.getMarkers(), ctx::receiveMarkers));
            wildcard = wildcard.getPadding().withBound(ctx.receiveNode(wildcard.getPadding().getBound(), leftPaddedValueReceiver(org.openrewrite.java.tree.J.Wildcard.Bound.class)));
            wildcard = wildcard.withBoundedType(ctx.receiveNode(wildcard.getBoundedType(), ctx::receiveTree));
            return wildcard;
        }

        @Override
        public J.Yield visitYield(J.Yield yield, ReceiverContext ctx) {
            yield = yield.withId(ctx.receiveNonNullValue(yield.getId(), UUID.class));
            yield = yield.withPrefix(ctx.receiveNonNullNode(yield.getPrefix(), JavaScriptReceiver::receiveSpace));
            yield = yield.withMarkers(ctx.receiveNonNullNode(yield.getMarkers(), ctx::receiveMarkers));
            yield = yield.withImplicit(ctx.receiveNonNullValue(yield.isImplicit(), boolean.class));
            yield = yield.withValue(ctx.receiveNonNullNode(yield.getValue(), ctx::receiveTree));
            return yield;
        }

        @Override
        public J.Unknown visitUnknown(J.Unknown unknown, ReceiverContext ctx) {
            unknown = unknown.withId(ctx.receiveNonNullValue(unknown.getId(), UUID.class));
            unknown = unknown.withPrefix(ctx.receiveNonNullNode(unknown.getPrefix(), JavaScriptReceiver::receiveSpace));
            unknown = unknown.withMarkers(ctx.receiveNonNullNode(unknown.getMarkers(), ctx::receiveMarkers));
            unknown = unknown.withSource(ctx.receiveNonNullNode(unknown.getSource(), ctx::receiveTree));
            return unknown;
        }

        @Override
        public J.Unknown.Source visitUnknownSource(J.Unknown.Source source, ReceiverContext ctx) {
            source = source.withId(ctx.receiveNonNullValue(source.getId(), UUID.class));
            source = source.withPrefix(ctx.receiveNonNullNode(source.getPrefix(), JavaScriptReceiver::receiveSpace));
            source = source.withMarkers(ctx.receiveNonNullNode(source.getMarkers(), ctx::receiveMarkers));
            source = source.withText(ctx.receiveNonNullValue(source.getText(), String.class));
            return source;
        }

    }

    private static class Factory implements ReceiverFactory {

        @Override
        @SuppressWarnings("unchecked")
        public <T> T create(Class<T> type, ReceiverContext ctx) {
            if (type == JS.CompilationUnit.class) {
                return (T) new JS.CompilationUnit(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, Path.class),
                    ctx.receiveValue(null, FileAttributes.class),
                    ctx.receiveValue(null, String.class),
                    ctx.receiveNonNullValue(null, boolean.class),
                    ctx.receiveValue(null, Checksum.class),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace)
                );
            }

            if (type == JS.Alias.class) {
                return (T) new JS.Alias(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == JS.ArrowFunction.class) {
                return (T) new JS.ArrowFunction(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.Await.class) {
                return (T) new JS.Await(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.DefaultType.class) {
                return (T) new JS.DefaultType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.Delete.class) {
                return (T) new JS.Delete(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.Export.class) {
                return (T) new JS.Export(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
                );
            }

            if (type == JS.ExpressionStatement.class) {
                return (T) new JS.ExpressionStatement(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == JS.FunctionType.class) {
                return (T) new JS.FunctionType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.JsImport.class) {
                return (T) new JS.JsImport(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
                );
            }

            if (type == JS.JsBinary.class) {
                return (T) new JS.JsBinary(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(org.openrewrite.javascript.tree.JS.JsBinary.Type.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.ObjectBindingDeclarations.class) {
                return (T) new JS.ObjectBindingDeclarations(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
                );
            }

            if (type == JS.ObjectBindingDeclarations.Binding.class) {
                return (T) new JS.ObjectBindingDeclarations.Binding(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.Variable.class)
                );
            }

            if (type == JS.PropertyAssignment.class) {
                return (T) new JS.PropertyAssignment(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == JS.ScopedVariableDeclarations.class) {
                return (T) new JS.ScopedVariableDeclarations(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveValue(null, JS.ScopedVariableDeclarations.Scope.class),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == JS.StatementExpression.class) {
                return (T) new JS.StatementExpression(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == JS.TemplateExpression.class) {
                return (T) new JS.TemplateExpression(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, String.class),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.TemplateExpression.Value.class) {
                return (T) new JS.TemplateExpression.Value(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullValue(null, boolean.class)
                );
            }

            if (type == JS.Tuple.class) {
                return (T) new JS.Tuple(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.TypeDeclaration.class) {
                return (T) new JS.TypeDeclaration(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.TypeOf.class) {
                return (T) new JS.TypeOf(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.TypeOperator.class) {
                return (T) new JS.TypeOperator(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, JS.TypeOperator.Type.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
                );
            }

            if (type == JS.Unary.class) {
                return (T) new JS.Unary(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(org.openrewrite.javascript.tree.JS.Unary.Type.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.Union.class) {
                return (T) new JS.Union(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.Void.class) {
                return (T) new JS.Void(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == JS.Yield.class) {
                return (T) new JS.Yield(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, boolean.class),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == JS.TypeInfo.class) {
                return (T) new JS.TypeInfo(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == JS.JSVariableDeclarations.class) {
                return (T) new JS.JSVariableDeclarations(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == JS.JSVariableDeclarations.JSNamedVariable.class) {
                return (T) new JS.JSVariableDeclarations.JSNamedVariable(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.Variable.class)
                );
            }

            if (type == JS.NamespaceDeclaration.class) {
                return (T) new JS.NamespaceDeclaration(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == J.AnnotatedType.class) {
                return (T) new J.AnnotatedType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == J.Annotation.class) {
                return (T) new J.Annotation(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer)
                );
            }

            if (type == J.ArrayAccess.class) {
                return (T) new J.ArrayAccess(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == J.ArrayType.class) {
                return (T) new J.ArrayType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNodes(null, ctx::receiveTree),
                    ctx.receiveNode(null, leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == J.Assert.class) {
                return (T) new J.Assert(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
                );
            }

            if (type == J.Assignment.class) {
                return (T) new J.Assignment(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == J.AssignmentOperation.class) {
                return (T) new J.AssignmentOperation(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(org.openrewrite.java.tree.J.AssignmentOperation.Type.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == J.Binary.class) {
                return (T) new J.Binary(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(org.openrewrite.java.tree.J.Binary.Type.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == J.Block.class) {
                return (T) new J.Block(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, rightPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace)
                );
            }

            if (type == J.Break.class) {
                return (T) new J.Break(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, ctx::receiveTree)
                );
            }

            if (type == J.Case.class) {
                return (T) new J.Case(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, J.Case.Type.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.ClassDeclaration.class) {
                return (T) new J.ClassDeclaration(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveModifier),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveClassDeclarationKind),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.FullyQualified.class)
                );
            }

            if (type == J.ClassDeclaration.Kind.class) {
                return (T) new J.ClassDeclaration.Kind(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullValue(null, J.ClassDeclaration.Kind.Type.class)
                );
            }

            if (type == J.Continue.class) {
                return (T) new J.Continue(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, ctx::receiveTree)
                );
            }

            if (type == J.DoWhileLoop.class) {
                return (T) new J.DoWhileLoop(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
                );
            }

            if (type == J.Empty.class) {
                return (T) new J.Empty(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers)
                );
            }

            if (type == J.EnumValue.class) {
                return (T) new J.EnumValue(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree)
                );
            }

            if (type == J.EnumValueSet.class) {
                return (T) new J.EnumValueSet(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullValue(null, boolean.class)
                );
            }

            if (type == J.FieldAccess.class) {
                return (T) new J.FieldAccess(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == J.ForEachLoop.class) {
                return (T) new J.ForEachLoop(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.ForEachLoop.Control.class) {
                return (T) new J.ForEachLoop.Control(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.ForLoop.class) {
                return (T) new J.ForLoop(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.ForLoop.Control.class) {
                return (T) new J.ForLoop.Control(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.ParenthesizedTypeTree.class) {
                return (T) new J.ParenthesizedTypeTree(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == J.Identifier.class) {
                return (T) new J.Identifier(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullValue(null, String.class),
                    ctx.receiveValue(null, JavaType.class),
                    ctx.receiveValue(null, JavaType.Variable.class)
                );
            }

            if (type == J.If.class) {
                return (T) new J.If(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNode(null, ctx::receiveTree)
                );
            }

            if (type == J.If.Else.class) {
                return (T) new J.If.Else(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.Import.class) {
                return (T) new J.Import(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
                );
            }

            if (type == J.InstanceOf.class) {
                return (T) new J.InstanceOf(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == J.IntersectionType.class) {
                return (T) new J.IntersectionType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer)
                );
            }

            if (type == J.Label.class) {
                return (T) new J.Label(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == J.Lambda.class) {
                return (T) new J.Lambda(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLambdaParameters),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == J.Lambda.Parameters.class) {
                return (T) new J.Lambda.Parameters(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, boolean.class),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.Literal.class) {
                return (T) new J.Literal(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveValue(null, Object.class),
                    ctx.receiveValue(null, String.class),
                    ctx.receiveValues(null, J.Literal.UnicodeEscape.class),
                    ctx.receiveValue(null, JavaType.Primitive.class)
                );
            }

            if (type == J.MemberReference.class) {
                return (T) new J.MemberReference(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class),
                    ctx.receiveValue(null, JavaType.Method.class),
                    ctx.receiveValue(null, JavaType.Variable.class)
                );
            }

            if (type == J.MethodDeclaration.class) {
                return (T) new J.MethodDeclaration(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveModifier),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveMethodTypeParameters),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveMethodIdentifierWithAnnotations),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.Method.class)
                );
            }

            if (type == J.MethodInvocation.class) {
                return (T) new J.MethodInvocation(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.Method.class)
                );
            }

            if (type == J.Modifier.class) {
                return (T) new J.Modifier(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveValue(null, String.class),
                    ctx.receiveNonNullValue(null, J.Modifier.Type.class),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree)
                );
            }

            if (type == J.MultiCatch.class) {
                return (T) new J.MultiCatch(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.NewArray.class) {
                return (T) new J.NewArray(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == J.ArrayDimension.class) {
                return (T) new J.ArrayDimension(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.NewClass.class) {
                return (T) new J.NewClass(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.Method.class)
                );
            }

            if (type == J.NullableType.class) {
                return (T) new J.NullableType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.Package.class) {
                return (T) new J.Package(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree)
                );
            }

            if (type == J.ParameterizedType.class) {
                return (T) new J.ParameterizedType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == J.Parentheses.class) {
                return (T) new J.Parentheses(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.ControlParentheses.class) {
                return (T) new J.ControlParentheses(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.Primitive.class) {
                return (T) new J.Primitive(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveValue(null, JavaType.Primitive.class)
                );
            }

            if (type == J.Return.class) {
                return (T) new J.Return(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, ctx::receiveTree)
                );
            }

            if (type == J.Switch.class) {
                return (T) new J.Switch(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == J.SwitchExpression.class) {
                return (T) new J.SwitchExpression(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == J.Synchronized.class) {
                return (T) new J.Synchronized(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == J.Ternary.class) {
                return (T) new J.Ternary(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == J.Throw.class) {
                return (T) new J.Throw(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == J.Try.class) {
                return (T) new J.Try(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
                );
            }

            if (type == J.Try.Resource.class) {
                return (T) new J.Try.Resource(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullValue(null, boolean.class)
                );
            }

            if (type == J.Try.Catch.class) {
                return (T) new J.Try.Catch(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == J.TypeCast.class) {
                return (T) new J.TypeCast(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == J.TypeParameter.class) {
                return (T) new J.TypeParameter(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveModifier),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer)
                );
            }

            if (type == J.TypeParameters.class) {
                return (T) new J.TypeParameters(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.Unary.class) {
                return (T) new J.Unary(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(org.openrewrite.java.tree.J.Unary.Type.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
                );
            }

            if (type == J.VariableDeclarations.class) {
                return (T) new J.VariableDeclarations(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveModifier),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNodes(null, leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.VariableDeclarations.NamedVariable.class) {
                return (T) new J.VariableDeclarations.NamedVariable(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.Variable.class)
                );
            }

            if (type == J.WhileLoop.class) {
                return (T) new J.WhileLoop(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
                );
            }

            if (type == J.Wildcard.class) {
                return (T) new J.Wildcard(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, leftPaddedValueReceiver(org.openrewrite.java.tree.J.Wildcard.Bound.class)),
                    ctx.receiveNode(null, ctx::receiveTree)
                );
            }

            if (type == J.Yield.class) {
                return (T) new J.Yield(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, boolean.class),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == J.Unknown.class) {
                return (T) new J.Unknown(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
                );
            }

            if (type == J.Unknown.Source.class) {
                return (T) new J.Unknown.Source(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, String.class)
                );
            }

            throw new IllegalArgumentException("Unknown type: " + type);
        }
    }

    private static J.ClassDeclaration.Kind receiveClassDeclarationKind(J.ClassDeclaration.@Nullable Kind kind, @Nullable Class<?> type, ReceiverContext ctx) {
        if (kind != null) {
            kind = kind.withId(ctx.receiveNonNullValue(kind.getId(), UUID.class));
            kind = kind.withPrefix(ctx.receiveNonNullNode(kind.getPrefix(), JavaScriptReceiver::receiveSpace));
            kind = kind.withMarkers(ctx.receiveNonNullNode(kind.getMarkers(), ctx::receiveMarkers));
            kind = kind.withAnnotations(ctx.receiveNonNullNodes(kind.getAnnotations(), ctx::receiveTree));
            kind = kind.withType(ctx.receiveNonNullValue(kind.getType(), J.ClassDeclaration.Kind.Type.class));
        } else {
            kind = new J.ClassDeclaration.Kind(
                ctx.receiveNonNullValue(null, UUID.class),
                ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                ctx.receiveNonNullNodes(null, ctx::receiveTree),
                ctx.receiveNonNullValue(null, J.ClassDeclaration.Kind.Type.class)
            );
        }
        return kind;
    }

    private static J.Lambda.Parameters receiveLambdaParameters(J.Lambda.@Nullable Parameters parameters, @Nullable Class<?> type, ReceiverContext ctx) {
        if (parameters != null) {
            parameters = parameters.withId(ctx.receiveNonNullValue(parameters.getId(), UUID.class));
            parameters = parameters.withPrefix(ctx.receiveNonNullNode(parameters.getPrefix(), JavaScriptReceiver::receiveSpace));
            parameters = parameters.withMarkers(ctx.receiveNonNullNode(parameters.getMarkers(), ctx::receiveMarkers));
            parameters = parameters.withParenthesized(ctx.receiveNonNullValue(parameters.isParenthesized(), boolean.class));
            parameters = parameters.getPadding().withParameters(ctx.receiveNonNullNodes(parameters.getPadding().getParameters(), JavaScriptReceiver::receiveRightPaddedTree));
        } else {
            parameters = new J.Lambda.Parameters(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, boolean.class),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }
        return parameters;
    }

    private static J.MethodDeclaration.IdentifierWithAnnotations receiveMethodIdentifierWithAnnotations(J.MethodDeclaration.@Nullable IdentifierWithAnnotations identifierWithAnnotations, @Nullable Class<?> identifierWithAnnotationsClass, ReceiverContext ctx) {
        if (identifierWithAnnotations != null) {
            identifierWithAnnotations = identifierWithAnnotations.withIdentifier(ctx.receiveNonNullNode(identifierWithAnnotations.getIdentifier(), ctx::receiveTree));
            identifierWithAnnotations = identifierWithAnnotations.withAnnotations(ctx.receiveNonNullNodes(identifierWithAnnotations.getAnnotations(), ctx::receiveTree));
        } else {
            identifierWithAnnotations = new J.MethodDeclaration.IdentifierWithAnnotations(
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree)
            );
        }
        return identifierWithAnnotations;
    }

    private static J.Modifier receiveModifier(J.@Nullable Modifier modifier, @Nullable Class<?> type, ReceiverContext ctx) {
        if (modifier != null) {
            modifier = modifier.withId(ctx.receiveNonNullValue(modifier.getId(), UUID.class));
            modifier = modifier.withPrefix(ctx.receiveNonNullNode(modifier.getPrefix(), JavaScriptReceiver::receiveSpace));
            modifier = modifier.withMarkers(ctx.receiveNonNullNode(modifier.getMarkers(), ctx::receiveMarkers));
            modifier = modifier.withKeyword(ctx.receiveValue(modifier.getKeyword(), String.class));
            modifier = modifier.withType(ctx.receiveNonNullValue(modifier.getType(), J.Modifier.Type.class));
            modifier = modifier.withAnnotations(ctx.receiveNonNullNodes(modifier.getAnnotations(), ctx::receiveTree));
        } else {
            modifier = new J.Modifier(
                ctx.receiveNonNullValue(null, UUID.class),
                ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                ctx.receiveValue(null, String.class),
                ctx.receiveNonNullValue(null, J.Modifier.Type.class),
                ctx.receiveNonNullNodes(null, ctx::receiveTree)
            );
        }
        return modifier;
    }

    private static J.TypeParameters receiveMethodTypeParameters(J.@Nullable TypeParameters typeParameters, @Nullable Class<?> type, ReceiverContext ctx) {
        if (typeParameters != null) {
            typeParameters = typeParameters.withId(ctx.receiveNonNullValue(typeParameters.getId(), UUID.class));
            typeParameters = typeParameters.withPrefix(ctx.receiveNonNullNode(typeParameters.getPrefix(), JavaScriptReceiver::receiveSpace));
            typeParameters = typeParameters.withMarkers(ctx.receiveNonNullNode(typeParameters.getMarkers(), ctx::receiveMarkers));
            typeParameters = typeParameters.withAnnotations(ctx.receiveNonNullNodes(typeParameters.getAnnotations(), ctx::receiveTree));
            typeParameters = typeParameters.getPadding().withTypeParameters(ctx.receiveNonNullNodes(typeParameters.getPadding().getTypeParameters(), JavaScriptReceiver::receiveRightPaddedTree));
        } else {
            typeParameters = new J.TypeParameters(
                ctx.receiveNonNullValue(null, UUID.class),
                ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                ctx.receiveNonNullNodes(null, ctx::receiveTree),
                ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }
        return typeParameters;
    }

    private static <T extends J> JContainer<T> receiveContainer(@Nullable JContainer<T> container, @Nullable Class<?> type, ReceiverContext ctx) {
        return Extensions.receiveContainer(container, type, ctx);
    }

    private static <T> ReceiverContext.DetailsReceiver<JLeftPadded<T>> leftPaddedValueReceiver(Class<T> valueType) {
        return Extensions.leftPaddedValueReceiver(valueType);
    }

    private static <T> ReceiverContext.DetailsReceiver<JLeftPadded<T>> leftPaddedNodeReceiver(Class<T> nodeType) {
        return Extensions.leftPaddedNodeReceiver(nodeType);
    }

    private static <T extends J> JLeftPadded<T> receiveLeftPaddedTree(@Nullable JLeftPadded<T> leftPadded, @Nullable Class<?> type, ReceiverContext ctx) {
        return Extensions.receiveLeftPaddedTree(leftPadded, type, ctx);
    }

    private static <T> ReceiverContext.DetailsReceiver<JRightPadded<T>> rightPaddedValueReceiver(Class<T> valueType) {
        return Extensions.rightPaddedValueReceiver(valueType);
    }

    private static <T> ReceiverContext.DetailsReceiver<JRightPadded<T>> rightPaddedNodeReceiver(Class<T> nodeType) {
        return Extensions.rightPaddedNodeReceiver(nodeType);
    }

    private static <T extends J> JRightPadded<T> receiveRightPaddedTree(@Nullable JRightPadded<T> rightPadded, @Nullable Class<?> type, ReceiverContext ctx) {
        return Extensions.receiveRightPaddedTree(rightPadded, type, ctx);
    }

    private static Space receiveSpace(@Nullable Space space, @Nullable Class<?> type, ReceiverContext ctx) {
        return Extensions.receiveSpace(space, type, ctx);
    }

    private static Comment receiveComment(@Nullable Comment comment, @Nullable Class<Comment> type, ReceiverContext ctx) {
        return Extensions.receiveComment(comment, type, ctx);
    }

}
