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
import java.util.function.Function;

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
            arrowFunction = arrowFunction.withTypeParameters(ctx.receiveNode(arrowFunction.getTypeParameters(), ctx::receiveTree));
            arrowFunction = arrowFunction.withParameters(ctx.receiveNonNullNode(arrowFunction.getParameters(), ctx::receiveTree));
            arrowFunction = arrowFunction.withReturnTypeExpression(ctx.receiveNode(arrowFunction.getReturnTypeExpression(), ctx::receiveTree));
            arrowFunction = arrowFunction.getPadding().withBody(ctx.receiveNonNullNode(arrowFunction.getPadding().getBody(), JavaScriptReceiver::receiveLeftPaddedTree));
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
        public JS.ConditionalType visitConditionalType(JS.ConditionalType conditionalType, ReceiverContext ctx) {
            conditionalType = conditionalType.withId(ctx.receiveNonNullValue(conditionalType.getId(), UUID.class));
            conditionalType = conditionalType.withPrefix(ctx.receiveNonNullNode(conditionalType.getPrefix(), JavaScriptReceiver::receiveSpace));
            conditionalType = conditionalType.withMarkers(ctx.receiveNonNullNode(conditionalType.getMarkers(), ctx::receiveMarkers));
            conditionalType = conditionalType.withCheckType(ctx.receiveNonNullNode(conditionalType.getCheckType(), ctx::receiveTree));
            conditionalType = conditionalType.getPadding().withCondition(ctx.receiveNonNullNode(conditionalType.getPadding().getCondition(), JavaScriptReceiver::receiveContainer));
            conditionalType = conditionalType.withType(ctx.receiveValue(conditionalType.getType(), JavaType.class));
            return conditionalType;
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
        public JS.ExpressionWithTypeArguments visitExpressionWithTypeArguments(JS.ExpressionWithTypeArguments expressionWithTypeArguments, ReceiverContext ctx) {
            expressionWithTypeArguments = expressionWithTypeArguments.withId(ctx.receiveNonNullValue(expressionWithTypeArguments.getId(), UUID.class));
            expressionWithTypeArguments = expressionWithTypeArguments.withPrefix(ctx.receiveNonNullNode(expressionWithTypeArguments.getPrefix(), JavaScriptReceiver::receiveSpace));
            expressionWithTypeArguments = expressionWithTypeArguments.withMarkers(ctx.receiveNonNullNode(expressionWithTypeArguments.getMarkers(), ctx::receiveMarkers));
            expressionWithTypeArguments = expressionWithTypeArguments.withClazz(ctx.receiveNonNullNode(expressionWithTypeArguments.getClazz(), ctx::receiveTree));
            expressionWithTypeArguments = expressionWithTypeArguments.getPadding().withTypeArguments(ctx.receiveNode(expressionWithTypeArguments.getPadding().getTypeArguments(), JavaScriptReceiver::receiveContainer));
            expressionWithTypeArguments = expressionWithTypeArguments.withType(ctx.receiveValue(expressionWithTypeArguments.getType(), JavaType.class));
            return expressionWithTypeArguments;
        }

        @Override
        public JS.FunctionType visitFunctionType(JS.FunctionType functionType, ReceiverContext ctx) {
            functionType = functionType.withId(ctx.receiveNonNullValue(functionType.getId(), UUID.class));
            functionType = functionType.withPrefix(ctx.receiveNonNullNode(functionType.getPrefix(), JavaScriptReceiver::receiveSpace));
            functionType = functionType.withMarkers(ctx.receiveNonNullNode(functionType.getMarkers(), ctx::receiveMarkers));
            functionType = functionType.getPadding().withConstructorType(ctx.receiveNonNullNode(functionType.getPadding().getConstructorType(), rightPaddedValueReceiver(java.lang.Boolean.class)));
            functionType = functionType.withTypeParameters(ctx.receiveNode(functionType.getTypeParameters(), ctx::receiveTree));
            functionType = functionType.getPadding().withParameters(ctx.receiveNonNullNode(functionType.getPadding().getParameters(), JavaScriptReceiver::receiveContainer));
            functionType = functionType.withArrow(ctx.receiveNonNullNode(functionType.getArrow(), JavaScriptReceiver::receiveSpace));
            functionType = functionType.withReturnType(ctx.receiveNonNullNode(functionType.getReturnType(), ctx::receiveTree));
            functionType = functionType.withType(ctx.receiveValue(functionType.getType(), JavaType.class));
            return functionType;
        }

        @Override
        public JS.InferType visitInferType(JS.InferType inferType, ReceiverContext ctx) {
            inferType = inferType.withId(ctx.receiveNonNullValue(inferType.getId(), UUID.class));
            inferType = inferType.withPrefix(ctx.receiveNonNullNode(inferType.getPrefix(), JavaScriptReceiver::receiveSpace));
            inferType = inferType.withMarkers(ctx.receiveNonNullNode(inferType.getMarkers(), ctx::receiveMarkers));
            inferType = inferType.getPadding().withTypeParameter(ctx.receiveNonNullNode(inferType.getPadding().getTypeParameter(), JavaScriptReceiver::receiveLeftPaddedTree));
            inferType = inferType.withType(ctx.receiveValue(inferType.getType(), JavaType.class));
            return inferType;
        }

        @Override
        public JS.ImportType visitImportType(JS.ImportType importType, ReceiverContext ctx) {
            importType = importType.withId(ctx.receiveNonNullValue(importType.getId(), UUID.class));
            importType = importType.withPrefix(ctx.receiveNonNullNode(importType.getPrefix(), JavaScriptReceiver::receiveSpace));
            importType = importType.withMarkers(ctx.receiveNonNullNode(importType.getMarkers(), ctx::receiveMarkers));
            importType = importType.getPadding().withHasTypeof(ctx.receiveNonNullNode(importType.getPadding().getHasTypeof(), rightPaddedValueReceiver(java.lang.Boolean.class)));
            importType = importType.withImportArgument(ctx.receiveNonNullNode(importType.getImportArgument(), ctx::receiveTree));
            importType = importType.getPadding().withQualifier(ctx.receiveNode(importType.getPadding().getQualifier(), JavaScriptReceiver::receiveLeftPaddedTree));
            importType = importType.getPadding().withTypeArguments(ctx.receiveNode(importType.getPadding().getTypeArguments(), JavaScriptReceiver::receiveContainer));
            importType = importType.withType(ctx.receiveValue(importType.getType(), JavaType.class));
            return importType;
        }

        @Override
        public JS.JsImport visitJsImport(JS.JsImport jsImport, ReceiverContext ctx) {
            jsImport = jsImport.withId(ctx.receiveNonNullValue(jsImport.getId(), UUID.class));
            jsImport = jsImport.withPrefix(ctx.receiveNonNullNode(jsImport.getPrefix(), JavaScriptReceiver::receiveSpace));
            jsImport = jsImport.withMarkers(ctx.receiveNonNullNode(jsImport.getMarkers(), ctx::receiveMarkers));
            jsImport = jsImport.getPadding().withName(ctx.receiveNode(jsImport.getPadding().getName(), JavaScriptReceiver::receiveRightPaddedTree));
            jsImport = jsImport.getPadding().withImportType(ctx.receiveNonNullNode(jsImport.getPadding().getImportType(), leftPaddedValueReceiver(java.lang.Boolean.class)));
            jsImport = jsImport.getPadding().withImports(ctx.receiveNode(jsImport.getPadding().getImports(), JavaScriptReceiver::receiveContainer));
            jsImport = jsImport.withFrom(ctx.receiveNode(jsImport.getFrom(), JavaScriptReceiver::receiveSpace));
            jsImport = jsImport.withTarget(ctx.receiveNode(jsImport.getTarget(), ctx::receiveTree));
            jsImport = jsImport.getPadding().withInitializer(ctx.receiveNode(jsImport.getPadding().getInitializer(), JavaScriptReceiver::receiveLeftPaddedTree));
            return jsImport;
        }

        @Override
        public JS.JsImportSpecifier visitJsImportSpecifier(JS.JsImportSpecifier jsImportSpecifier, ReceiverContext ctx) {
            jsImportSpecifier = jsImportSpecifier.withId(ctx.receiveNonNullValue(jsImportSpecifier.getId(), UUID.class));
            jsImportSpecifier = jsImportSpecifier.withPrefix(ctx.receiveNonNullNode(jsImportSpecifier.getPrefix(), JavaScriptReceiver::receiveSpace));
            jsImportSpecifier = jsImportSpecifier.withMarkers(ctx.receiveNonNullNode(jsImportSpecifier.getMarkers(), ctx::receiveMarkers));
            jsImportSpecifier = jsImportSpecifier.getPadding().withImportType(ctx.receiveNonNullNode(jsImportSpecifier.getPadding().getImportType(), leftPaddedValueReceiver(java.lang.Boolean.class)));
            jsImportSpecifier = jsImportSpecifier.withSpecifier(ctx.receiveNonNullNode(jsImportSpecifier.getSpecifier(), ctx::receiveTree));
            jsImportSpecifier = jsImportSpecifier.withType(ctx.receiveValue(jsImportSpecifier.getType(), JavaType.class));
            return jsImportSpecifier;
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
        public JS.LiteralType visitLiteralType(JS.LiteralType literalType, ReceiverContext ctx) {
            literalType = literalType.withId(ctx.receiveNonNullValue(literalType.getId(), UUID.class));
            literalType = literalType.withPrefix(ctx.receiveNonNullNode(literalType.getPrefix(), JavaScriptReceiver::receiveSpace));
            literalType = literalType.withMarkers(ctx.receiveNonNullNode(literalType.getMarkers(), ctx::receiveMarkers));
            literalType = literalType.withLiteral(ctx.receiveNonNullNode(literalType.getLiteral(), ctx::receiveTree));
            literalType = literalType.withType(ctx.receiveValue(literalType.getType(), JavaType.class));
            return literalType;
        }

        @Override
        public JS.MappedType visitMappedType(JS.MappedType mappedType, ReceiverContext ctx) {
            mappedType = mappedType.withId(ctx.receiveNonNullValue(mappedType.getId(), UUID.class));
            mappedType = mappedType.withPrefix(ctx.receiveNonNullNode(mappedType.getPrefix(), JavaScriptReceiver::receiveSpace));
            mappedType = mappedType.withMarkers(ctx.receiveNonNullNode(mappedType.getMarkers(), ctx::receiveMarkers));
            mappedType = mappedType.getPadding().withPrefixToken(ctx.receiveNode(mappedType.getPadding().getPrefixToken(), JavaScriptReceiver::receiveLeftPaddedTree));
            mappedType = mappedType.getPadding().withHasReadonly(ctx.receiveNonNullNode(mappedType.getPadding().getHasReadonly(), leftPaddedValueReceiver(java.lang.Boolean.class)));
            mappedType = mappedType.withKeysRemapping(ctx.receiveNonNullNode(mappedType.getKeysRemapping(), ctx::receiveTree));
            mappedType = mappedType.getPadding().withSuffixToken(ctx.receiveNode(mappedType.getPadding().getSuffixToken(), JavaScriptReceiver::receiveLeftPaddedTree));
            mappedType = mappedType.getPadding().withHasQuestionToken(ctx.receiveNonNullNode(mappedType.getPadding().getHasQuestionToken(), leftPaddedValueReceiver(java.lang.Boolean.class)));
            mappedType = mappedType.getPadding().withValueType(ctx.receiveNonNullNode(mappedType.getPadding().getValueType(), JavaScriptReceiver::receiveContainer));
            mappedType = mappedType.withType(ctx.receiveValue(mappedType.getType(), JavaType.class));
            return mappedType;
        }

        @Override
        public JS.MappedType.KeysRemapping visitMappedTypeKeysRemapping(JS.MappedType.KeysRemapping keysRemapping, ReceiverContext ctx) {
            keysRemapping = keysRemapping.withId(ctx.receiveNonNullValue(keysRemapping.getId(), UUID.class));
            keysRemapping = keysRemapping.withPrefix(ctx.receiveNonNullNode(keysRemapping.getPrefix(), JavaScriptReceiver::receiveSpace));
            keysRemapping = keysRemapping.withMarkers(ctx.receiveNonNullNode(keysRemapping.getMarkers(), ctx::receiveMarkers));
            keysRemapping = keysRemapping.getPadding().withTypeParameter(ctx.receiveNonNullNode(keysRemapping.getPadding().getTypeParameter(), JavaScriptReceiver::receiveRightPaddedTree));
            keysRemapping = keysRemapping.getPadding().withNameType(ctx.receiveNode(keysRemapping.getPadding().getNameType(), JavaScriptReceiver::receiveRightPaddedTree));
            return keysRemapping;
        }

        @Override
        public JS.MappedType.MappedTypeParameter visitMappedTypeMappedTypeParameter(JS.MappedType.MappedTypeParameter mappedTypeParameter, ReceiverContext ctx) {
            mappedTypeParameter = mappedTypeParameter.withId(ctx.receiveNonNullValue(mappedTypeParameter.getId(), UUID.class));
            mappedTypeParameter = mappedTypeParameter.withPrefix(ctx.receiveNonNullNode(mappedTypeParameter.getPrefix(), JavaScriptReceiver::receiveSpace));
            mappedTypeParameter = mappedTypeParameter.withMarkers(ctx.receiveNonNullNode(mappedTypeParameter.getMarkers(), ctx::receiveMarkers));
            mappedTypeParameter = mappedTypeParameter.withName(ctx.receiveNonNullNode(mappedTypeParameter.getName(), ctx::receiveTree));
            mappedTypeParameter = mappedTypeParameter.getPadding().withIterateType(ctx.receiveNonNullNode(mappedTypeParameter.getPadding().getIterateType(), JavaScriptReceiver::receiveLeftPaddedTree));
            return mappedTypeParameter;
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
        public JS.PropertyAssignment visitPropertyAssignment(JS.PropertyAssignment propertyAssignment, ReceiverContext ctx) {
            propertyAssignment = propertyAssignment.withId(ctx.receiveNonNullValue(propertyAssignment.getId(), UUID.class));
            propertyAssignment = propertyAssignment.withPrefix(ctx.receiveNonNullNode(propertyAssignment.getPrefix(), JavaScriptReceiver::receiveSpace));
            propertyAssignment = propertyAssignment.withMarkers(ctx.receiveNonNullNode(propertyAssignment.getMarkers(), ctx::receiveMarkers));
            propertyAssignment = propertyAssignment.getPadding().withName(ctx.receiveNonNullNode(propertyAssignment.getPadding().getName(), JavaScriptReceiver::receiveRightPaddedTree));
            propertyAssignment = propertyAssignment.withInitializer(ctx.receiveNode(propertyAssignment.getInitializer(), ctx::receiveTree));
            return propertyAssignment;
        }

        @Override
        public JS.SatisfiesExpression visitSatisfiesExpression(JS.SatisfiesExpression satisfiesExpression, ReceiverContext ctx) {
            satisfiesExpression = satisfiesExpression.withId(ctx.receiveNonNullValue(satisfiesExpression.getId(), UUID.class));
            satisfiesExpression = satisfiesExpression.withPrefix(ctx.receiveNonNullNode(satisfiesExpression.getPrefix(), JavaScriptReceiver::receiveSpace));
            satisfiesExpression = satisfiesExpression.withMarkers(ctx.receiveNonNullNode(satisfiesExpression.getMarkers(), ctx::receiveMarkers));
            satisfiesExpression = satisfiesExpression.withExpression(ctx.receiveNonNullNode(satisfiesExpression.getExpression(), ctx::receiveTree));
            satisfiesExpression = satisfiesExpression.getPadding().withSatisfiesType(ctx.receiveNonNullNode(satisfiesExpression.getPadding().getSatisfiesType(), JavaScriptReceiver::receiveLeftPaddedTree));
            satisfiesExpression = satisfiesExpression.withType(ctx.receiveValue(satisfiesExpression.getType(), JavaType.class));
            return satisfiesExpression;
        }

        @Override
        public JS.ScopedVariableDeclarations visitScopedVariableDeclarations(JS.ScopedVariableDeclarations scopedVariableDeclarations, ReceiverContext ctx) {
            scopedVariableDeclarations = scopedVariableDeclarations.withId(ctx.receiveNonNullValue(scopedVariableDeclarations.getId(), UUID.class));
            scopedVariableDeclarations = scopedVariableDeclarations.withPrefix(ctx.receiveNonNullNode(scopedVariableDeclarations.getPrefix(), JavaScriptReceiver::receiveSpace));
            scopedVariableDeclarations = scopedVariableDeclarations.withMarkers(ctx.receiveNonNullNode(scopedVariableDeclarations.getMarkers(), ctx::receiveMarkers));
            scopedVariableDeclarations = scopedVariableDeclarations.withModifiers(ctx.receiveNonNullNodes(scopedVariableDeclarations.getModifiers(), ctx::receiveTree));
            scopedVariableDeclarations = scopedVariableDeclarations.getPadding().withScope(ctx.receiveNode(scopedVariableDeclarations.getPadding().getScope(), leftPaddedValueReceiver(org.openrewrite.javascript.tree.JS.ScopedVariableDeclarations.Scope.class)));
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
        public JS.TaggedTemplateExpression visitTaggedTemplateExpression(JS.TaggedTemplateExpression taggedTemplateExpression, ReceiverContext ctx) {
            taggedTemplateExpression = taggedTemplateExpression.withId(ctx.receiveNonNullValue(taggedTemplateExpression.getId(), UUID.class));
            taggedTemplateExpression = taggedTemplateExpression.withPrefix(ctx.receiveNonNullNode(taggedTemplateExpression.getPrefix(), JavaScriptReceiver::receiveSpace));
            taggedTemplateExpression = taggedTemplateExpression.withMarkers(ctx.receiveNonNullNode(taggedTemplateExpression.getMarkers(), ctx::receiveMarkers));
            taggedTemplateExpression = taggedTemplateExpression.getPadding().withTag(ctx.receiveNode(taggedTemplateExpression.getPadding().getTag(), JavaScriptReceiver::receiveRightPaddedTree));
            taggedTemplateExpression = taggedTemplateExpression.getPadding().withTypeArguments(ctx.receiveNode(taggedTemplateExpression.getPadding().getTypeArguments(), JavaScriptReceiver::receiveContainer));
            taggedTemplateExpression = taggedTemplateExpression.withTemplateExpression(ctx.receiveNonNullNode(taggedTemplateExpression.getTemplateExpression(), ctx::receiveTree));
            taggedTemplateExpression = taggedTemplateExpression.withType(ctx.receiveValue(taggedTemplateExpression.getType(), JavaType.class));
            return taggedTemplateExpression;
        }

        @Override
        public JS.TemplateExpression visitTemplateExpression(JS.TemplateExpression templateExpression, ReceiverContext ctx) {
            templateExpression = templateExpression.withId(ctx.receiveNonNullValue(templateExpression.getId(), UUID.class));
            templateExpression = templateExpression.withPrefix(ctx.receiveNonNullNode(templateExpression.getPrefix(), JavaScriptReceiver::receiveSpace));
            templateExpression = templateExpression.withMarkers(ctx.receiveNonNullNode(templateExpression.getMarkers(), ctx::receiveMarkers));
            templateExpression = templateExpression.withHead(ctx.receiveNonNullNode(templateExpression.getHead(), ctx::receiveTree));
            templateExpression = templateExpression.getPadding().withTemplateSpans(ctx.receiveNonNullNodes(templateExpression.getPadding().getTemplateSpans(), JavaScriptReceiver::receiveRightPaddedTree));
            templateExpression = templateExpression.withType(ctx.receiveValue(templateExpression.getType(), JavaType.class));
            return templateExpression;
        }

        @Override
        public JS.TemplateExpression.TemplateSpan visitTemplateExpressionTemplateSpan(JS.TemplateExpression.TemplateSpan templateSpan, ReceiverContext ctx) {
            templateSpan = templateSpan.withId(ctx.receiveNonNullValue(templateSpan.getId(), UUID.class));
            templateSpan = templateSpan.withPrefix(ctx.receiveNonNullNode(templateSpan.getPrefix(), JavaScriptReceiver::receiveSpace));
            templateSpan = templateSpan.withMarkers(ctx.receiveNonNullNode(templateSpan.getMarkers(), ctx::receiveMarkers));
            templateSpan = templateSpan.withExpression(ctx.receiveNonNullNode(templateSpan.getExpression(), ctx::receiveTree));
            templateSpan = templateSpan.withTail(ctx.receiveNonNullNode(templateSpan.getTail(), ctx::receiveTree));
            return templateSpan;
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
            typeDeclaration = typeDeclaration.withModifiers(ctx.receiveNonNullNodes(typeDeclaration.getModifiers(), ctx::receiveTree));
            typeDeclaration = typeDeclaration.getPadding().withName(ctx.receiveNonNullNode(typeDeclaration.getPadding().getName(), JavaScriptReceiver::receiveLeftPaddedTree));
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
        public JS.TypeQuery visitTypeQuery(JS.TypeQuery typeQuery, ReceiverContext ctx) {
            typeQuery = typeQuery.withId(ctx.receiveNonNullValue(typeQuery.getId(), UUID.class));
            typeQuery = typeQuery.withPrefix(ctx.receiveNonNullNode(typeQuery.getPrefix(), JavaScriptReceiver::receiveSpace));
            typeQuery = typeQuery.withMarkers(ctx.receiveNonNullNode(typeQuery.getMarkers(), ctx::receiveMarkers));
            typeQuery = typeQuery.withTypeExpression(ctx.receiveNonNullNode(typeQuery.getTypeExpression(), ctx::receiveTree));
            typeQuery = typeQuery.withType(ctx.receiveValue(typeQuery.getType(), JavaType.class));
            return typeQuery;
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
        public JS.TypePredicate visitTypePredicate(JS.TypePredicate typePredicate, ReceiverContext ctx) {
            typePredicate = typePredicate.withId(ctx.receiveNonNullValue(typePredicate.getId(), UUID.class));
            typePredicate = typePredicate.withPrefix(ctx.receiveNonNullNode(typePredicate.getPrefix(), JavaScriptReceiver::receiveSpace));
            typePredicate = typePredicate.withMarkers(ctx.receiveNonNullNode(typePredicate.getMarkers(), ctx::receiveMarkers));
            typePredicate = typePredicate.getPadding().withAsserts(ctx.receiveNonNullNode(typePredicate.getPadding().getAsserts(), leftPaddedValueReceiver(java.lang.Boolean.class)));
            typePredicate = typePredicate.withParameterName(ctx.receiveNonNullNode(typePredicate.getParameterName(), ctx::receiveTree));
            typePredicate = typePredicate.getPadding().withExpression(ctx.receiveNode(typePredicate.getPadding().getExpression(), JavaScriptReceiver::receiveLeftPaddedTree));
            typePredicate = typePredicate.withType(ctx.receiveValue(typePredicate.getType(), JavaType.class));
            return typePredicate;
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
        public JS.Intersection visitIntersection(JS.Intersection intersection, ReceiverContext ctx) {
            intersection = intersection.withId(ctx.receiveNonNullValue(intersection.getId(), UUID.class));
            intersection = intersection.withPrefix(ctx.receiveNonNullNode(intersection.getPrefix(), JavaScriptReceiver::receiveSpace));
            intersection = intersection.withMarkers(ctx.receiveNonNullNode(intersection.getMarkers(), ctx::receiveMarkers));
            intersection = intersection.getPadding().withTypes(ctx.receiveNonNullNodes(intersection.getPadding().getTypes(), JavaScriptReceiver::receiveRightPaddedTree));
            intersection = intersection.withType(ctx.receiveValue(intersection.getType(), JavaType.class));
            return intersection;
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
            yield = yield.getPadding().withDelegated(ctx.receiveNonNullNode(yield.getPadding().getDelegated(), leftPaddedValueReceiver(java.lang.Boolean.class)));
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
        public JS.JSMethodDeclaration visitJSMethodDeclaration(JS.JSMethodDeclaration jSMethodDeclaration, ReceiverContext ctx) {
            jSMethodDeclaration = jSMethodDeclaration.withId(ctx.receiveNonNullValue(jSMethodDeclaration.getId(), UUID.class));
            jSMethodDeclaration = jSMethodDeclaration.withPrefix(ctx.receiveNonNullNode(jSMethodDeclaration.getPrefix(), JavaScriptReceiver::receiveSpace));
            jSMethodDeclaration = jSMethodDeclaration.withMarkers(ctx.receiveNonNullNode(jSMethodDeclaration.getMarkers(), ctx::receiveMarkers));
            jSMethodDeclaration = jSMethodDeclaration.withLeadingAnnotations(ctx.receiveNonNullNodes(jSMethodDeclaration.getLeadingAnnotations(), ctx::receiveTree));
            jSMethodDeclaration = jSMethodDeclaration.withModifiers(ctx.receiveNonNullNodes(jSMethodDeclaration.getModifiers(), ctx::receiveTree));
            jSMethodDeclaration = jSMethodDeclaration.withTypeParameters(ctx.receiveNode(jSMethodDeclaration.getTypeParameters(), ctx::receiveTree));
            jSMethodDeclaration = jSMethodDeclaration.withReturnTypeExpression(ctx.receiveNode(jSMethodDeclaration.getReturnTypeExpression(), ctx::receiveTree));
            jSMethodDeclaration = jSMethodDeclaration.withName(ctx.receiveNonNullNode(jSMethodDeclaration.getName(), ctx::receiveTree));
            jSMethodDeclaration = jSMethodDeclaration.getPadding().withParameters(ctx.receiveNonNullNode(jSMethodDeclaration.getPadding().getParameters(), JavaScriptReceiver::receiveContainer));
            jSMethodDeclaration = jSMethodDeclaration.getPadding().withThrowz(ctx.receiveNode(jSMethodDeclaration.getPadding().getThrowz(), JavaScriptReceiver::receiveContainer));
            jSMethodDeclaration = jSMethodDeclaration.withBody(ctx.receiveNode(jSMethodDeclaration.getBody(), ctx::receiveTree));
            jSMethodDeclaration = jSMethodDeclaration.getPadding().withDefaultValue(ctx.receiveNode(jSMethodDeclaration.getPadding().getDefaultValue(), JavaScriptReceiver::receiveLeftPaddedTree));
            jSMethodDeclaration = jSMethodDeclaration.withMethodType(ctx.receiveValue(jSMethodDeclaration.getMethodType(), JavaType.Method.class));
            return jSMethodDeclaration;
        }

        @Override
        public JS.JSForOfLoop visitJSForOfLoop(JS.JSForOfLoop jSForOfLoop, ReceiverContext ctx) {
            jSForOfLoop = jSForOfLoop.withId(ctx.receiveNonNullValue(jSForOfLoop.getId(), UUID.class));
            jSForOfLoop = jSForOfLoop.withPrefix(ctx.receiveNonNullNode(jSForOfLoop.getPrefix(), JavaScriptReceiver::receiveSpace));
            jSForOfLoop = jSForOfLoop.withMarkers(ctx.receiveNonNullNode(jSForOfLoop.getMarkers(), ctx::receiveMarkers));
            jSForOfLoop = jSForOfLoop.getPadding().withAwait(ctx.receiveNonNullNode(jSForOfLoop.getPadding().getAwait(), leftPaddedValueReceiver(java.lang.Boolean.class)));
            jSForOfLoop = jSForOfLoop.withControl(ctx.receiveNonNullNode(jSForOfLoop.getControl(), ctx::receiveTree));
            jSForOfLoop = jSForOfLoop.getPadding().withBody(ctx.receiveNonNullNode(jSForOfLoop.getPadding().getBody(), JavaScriptReceiver::receiveRightPaddedTree));
            return jSForOfLoop;
        }

        @Override
        public JS.JSForInLoop visitJSForInLoop(JS.JSForInLoop jSForInLoop, ReceiverContext ctx) {
            jSForInLoop = jSForInLoop.withId(ctx.receiveNonNullValue(jSForInLoop.getId(), UUID.class));
            jSForInLoop = jSForInLoop.withPrefix(ctx.receiveNonNullNode(jSForInLoop.getPrefix(), JavaScriptReceiver::receiveSpace));
            jSForInLoop = jSForInLoop.withMarkers(ctx.receiveNonNullNode(jSForInLoop.getMarkers(), ctx::receiveMarkers));
            jSForInLoop = jSForInLoop.withControl(ctx.receiveNonNullNode(jSForInLoop.getControl(), ctx::receiveTree));
            jSForInLoop = jSForInLoop.getPadding().withBody(ctx.receiveNonNullNode(jSForInLoop.getPadding().getBody(), JavaScriptReceiver::receiveRightPaddedTree));
            return jSForInLoop;
        }

        @Override
        public JS.JSForInOfLoopControl visitJSForInOfLoopControl(JS.JSForInOfLoopControl jSForInOfLoopControl, ReceiverContext ctx) {
            jSForInOfLoopControl = jSForInOfLoopControl.withId(ctx.receiveNonNullValue(jSForInOfLoopControl.getId(), UUID.class));
            jSForInOfLoopControl = jSForInOfLoopControl.withPrefix(ctx.receiveNonNullNode(jSForInOfLoopControl.getPrefix(), JavaScriptReceiver::receiveSpace));
            jSForInOfLoopControl = jSForInOfLoopControl.withMarkers(ctx.receiveNonNullNode(jSForInOfLoopControl.getMarkers(), ctx::receiveMarkers));
            jSForInOfLoopControl = jSForInOfLoopControl.getPadding().withVariable(ctx.receiveNonNullNode(jSForInOfLoopControl.getPadding().getVariable(), JavaScriptReceiver::receiveRightPaddedTree));
            jSForInOfLoopControl = jSForInOfLoopControl.getPadding().withIterable(ctx.receiveNonNullNode(jSForInOfLoopControl.getPadding().getIterable(), JavaScriptReceiver::receiveRightPaddedTree));
            return jSForInOfLoopControl;
        }

        @Override
        public JS.NamespaceDeclaration visitNamespaceDeclaration(JS.NamespaceDeclaration namespaceDeclaration, ReceiverContext ctx) {
            namespaceDeclaration = namespaceDeclaration.withId(ctx.receiveNonNullValue(namespaceDeclaration.getId(), UUID.class));
            namespaceDeclaration = namespaceDeclaration.withPrefix(ctx.receiveNonNullNode(namespaceDeclaration.getPrefix(), JavaScriptReceiver::receiveSpace));
            namespaceDeclaration = namespaceDeclaration.withMarkers(ctx.receiveNonNullNode(namespaceDeclaration.getMarkers(), ctx::receiveMarkers));
            namespaceDeclaration = namespaceDeclaration.withModifiers(ctx.receiveNonNullNodes(namespaceDeclaration.getModifiers(), ctx::receiveTree));
            namespaceDeclaration = namespaceDeclaration.getPadding().withKeywordType(ctx.receiveNonNullNode(namespaceDeclaration.getPadding().getKeywordType(), leftPaddedValueReceiver(org.openrewrite.javascript.tree.JS.NamespaceDeclaration.KeywordType.class)));
            namespaceDeclaration = namespaceDeclaration.getPadding().withName(ctx.receiveNonNullNode(namespaceDeclaration.getPadding().getName(), JavaScriptReceiver::receiveRightPaddedTree));
            namespaceDeclaration = namespaceDeclaration.withBody(ctx.receiveNonNullNode(namespaceDeclaration.getBody(), ctx::receiveTree));
            return namespaceDeclaration;
        }

        @Override
        public JS.FunctionDeclaration visitFunctionDeclaration(JS.FunctionDeclaration functionDeclaration, ReceiverContext ctx) {
            functionDeclaration = functionDeclaration.withId(ctx.receiveNonNullValue(functionDeclaration.getId(), UUID.class));
            functionDeclaration = functionDeclaration.withPrefix(ctx.receiveNonNullNode(functionDeclaration.getPrefix(), JavaScriptReceiver::receiveSpace));
            functionDeclaration = functionDeclaration.withMarkers(ctx.receiveNonNullNode(functionDeclaration.getMarkers(), ctx::receiveMarkers));
            functionDeclaration = functionDeclaration.withModifiers(ctx.receiveNonNullNodes(functionDeclaration.getModifiers(), ctx::receiveTree));
            functionDeclaration = functionDeclaration.getPadding().withAsteriskToken(ctx.receiveNonNullNode(functionDeclaration.getPadding().getAsteriskToken(), leftPaddedValueReceiver(java.lang.Boolean.class)));
            functionDeclaration = functionDeclaration.getPadding().withName(ctx.receiveNonNullNode(functionDeclaration.getPadding().getName(), JavaScriptReceiver::receiveLeftPaddedTree));
            functionDeclaration = functionDeclaration.withTypeParameters(ctx.receiveNode(functionDeclaration.getTypeParameters(), ctx::receiveTree));
            functionDeclaration = functionDeclaration.getPadding().withParameters(ctx.receiveNonNullNode(functionDeclaration.getPadding().getParameters(), JavaScriptReceiver::receiveContainer));
            functionDeclaration = functionDeclaration.withReturnTypeExpression(ctx.receiveNode(functionDeclaration.getReturnTypeExpression(), ctx::receiveTree));
            functionDeclaration = functionDeclaration.withBody(ctx.receiveNode(functionDeclaration.getBody(), ctx::receiveTree));
            functionDeclaration = functionDeclaration.withType(ctx.receiveValue(functionDeclaration.getType(), JavaType.class));
            return functionDeclaration;
        }

        @Override
        public JS.TypeLiteral visitTypeLiteral(JS.TypeLiteral typeLiteral, ReceiverContext ctx) {
            typeLiteral = typeLiteral.withId(ctx.receiveNonNullValue(typeLiteral.getId(), UUID.class));
            typeLiteral = typeLiteral.withPrefix(ctx.receiveNonNullNode(typeLiteral.getPrefix(), JavaScriptReceiver::receiveSpace));
            typeLiteral = typeLiteral.withMarkers(ctx.receiveNonNullNode(typeLiteral.getMarkers(), ctx::receiveMarkers));
            typeLiteral = typeLiteral.withMembers(ctx.receiveNonNullNode(typeLiteral.getMembers(), ctx::receiveTree));
            typeLiteral = typeLiteral.withType(ctx.receiveValue(typeLiteral.getType(), JavaType.class));
            return typeLiteral;
        }

        @Override
        public JS.IndexSignatureDeclaration visitIndexSignatureDeclaration(JS.IndexSignatureDeclaration indexSignatureDeclaration, ReceiverContext ctx) {
            indexSignatureDeclaration = indexSignatureDeclaration.withId(ctx.receiveNonNullValue(indexSignatureDeclaration.getId(), UUID.class));
            indexSignatureDeclaration = indexSignatureDeclaration.withPrefix(ctx.receiveNonNullNode(indexSignatureDeclaration.getPrefix(), JavaScriptReceiver::receiveSpace));
            indexSignatureDeclaration = indexSignatureDeclaration.withMarkers(ctx.receiveNonNullNode(indexSignatureDeclaration.getMarkers(), ctx::receiveMarkers));
            indexSignatureDeclaration = indexSignatureDeclaration.withModifiers(ctx.receiveNonNullNodes(indexSignatureDeclaration.getModifiers(), ctx::receiveTree));
            indexSignatureDeclaration = indexSignatureDeclaration.getPadding().withParameters(ctx.receiveNonNullNode(indexSignatureDeclaration.getPadding().getParameters(), JavaScriptReceiver::receiveContainer));
            indexSignatureDeclaration = indexSignatureDeclaration.getPadding().withTypeExpression(ctx.receiveNonNullNode(indexSignatureDeclaration.getPadding().getTypeExpression(), JavaScriptReceiver::receiveLeftPaddedTree));
            indexSignatureDeclaration = indexSignatureDeclaration.withType(ctx.receiveValue(indexSignatureDeclaration.getType(), JavaType.class));
            return indexSignatureDeclaration;
        }

        @Override
        public JS.ArrayBindingPattern visitArrayBindingPattern(JS.ArrayBindingPattern arrayBindingPattern, ReceiverContext ctx) {
            arrayBindingPattern = arrayBindingPattern.withId(ctx.receiveNonNullValue(arrayBindingPattern.getId(), UUID.class));
            arrayBindingPattern = arrayBindingPattern.withPrefix(ctx.receiveNonNullNode(arrayBindingPattern.getPrefix(), JavaScriptReceiver::receiveSpace));
            arrayBindingPattern = arrayBindingPattern.withMarkers(ctx.receiveNonNullNode(arrayBindingPattern.getMarkers(), ctx::receiveMarkers));
            arrayBindingPattern = arrayBindingPattern.getPadding().withElements(ctx.receiveNonNullNode(arrayBindingPattern.getPadding().getElements(), JavaScriptReceiver::receiveContainer));
            arrayBindingPattern = arrayBindingPattern.withType(ctx.receiveValue(arrayBindingPattern.getType(), JavaType.class));
            return arrayBindingPattern;
        }

        @Override
        public JS.BindingElement visitBindingElement(JS.BindingElement bindingElement, ReceiverContext ctx) {
            bindingElement = bindingElement.withId(ctx.receiveNonNullValue(bindingElement.getId(), UUID.class));
            bindingElement = bindingElement.withPrefix(ctx.receiveNonNullNode(bindingElement.getPrefix(), JavaScriptReceiver::receiveSpace));
            bindingElement = bindingElement.withMarkers(ctx.receiveNonNullNode(bindingElement.getMarkers(), ctx::receiveMarkers));
            bindingElement = bindingElement.getPadding().withPropertyName(ctx.receiveNode(bindingElement.getPadding().getPropertyName(), JavaScriptReceiver::receiveRightPaddedTree));
            bindingElement = bindingElement.withName(ctx.receiveNonNullNode(bindingElement.getName(), ctx::receiveTree));
            bindingElement = bindingElement.getPadding().withInitializer(ctx.receiveNode(bindingElement.getPadding().getInitializer(), JavaScriptReceiver::receiveLeftPaddedTree));
            bindingElement = bindingElement.withVariableType(ctx.receiveValue(bindingElement.getVariableType(), JavaType.Variable.class));
            return bindingElement;
        }

        @Override
        public JS.ExportDeclaration visitExportDeclaration(JS.ExportDeclaration exportDeclaration, ReceiverContext ctx) {
            exportDeclaration = exportDeclaration.withId(ctx.receiveNonNullValue(exportDeclaration.getId(), UUID.class));
            exportDeclaration = exportDeclaration.withPrefix(ctx.receiveNonNullNode(exportDeclaration.getPrefix(), JavaScriptReceiver::receiveSpace));
            exportDeclaration = exportDeclaration.withMarkers(ctx.receiveNonNullNode(exportDeclaration.getMarkers(), ctx::receiveMarkers));
            exportDeclaration = exportDeclaration.withModifiers(ctx.receiveNonNullNodes(exportDeclaration.getModifiers(), ctx::receiveTree));
            exportDeclaration = exportDeclaration.getPadding().withTypeOnly(ctx.receiveNonNullNode(exportDeclaration.getPadding().getTypeOnly(), leftPaddedValueReceiver(java.lang.Boolean.class)));
            exportDeclaration = exportDeclaration.withExportClause(ctx.receiveNode(exportDeclaration.getExportClause(), ctx::receiveTree));
            exportDeclaration = exportDeclaration.getPadding().withModuleSpecifier(ctx.receiveNode(exportDeclaration.getPadding().getModuleSpecifier(), JavaScriptReceiver::receiveLeftPaddedTree));
            return exportDeclaration;
        }

        @Override
        public JS.ExportAssignment visitExportAssignment(JS.ExportAssignment exportAssignment, ReceiverContext ctx) {
            exportAssignment = exportAssignment.withId(ctx.receiveNonNullValue(exportAssignment.getId(), UUID.class));
            exportAssignment = exportAssignment.withPrefix(ctx.receiveNonNullNode(exportAssignment.getPrefix(), JavaScriptReceiver::receiveSpace));
            exportAssignment = exportAssignment.withMarkers(ctx.receiveNonNullNode(exportAssignment.getMarkers(), ctx::receiveMarkers));
            exportAssignment = exportAssignment.withModifiers(ctx.receiveNonNullNodes(exportAssignment.getModifiers(), ctx::receiveTree));
            exportAssignment = exportAssignment.getPadding().withExportEquals(ctx.receiveNonNullNode(exportAssignment.getPadding().getExportEquals(), leftPaddedValueReceiver(java.lang.Boolean.class)));
            exportAssignment = exportAssignment.withExpression(ctx.receiveNode(exportAssignment.getExpression(), ctx::receiveTree));
            return exportAssignment;
        }

        @Override
        public JS.NamedExports visitNamedExports(JS.NamedExports namedExports, ReceiverContext ctx) {
            namedExports = namedExports.withId(ctx.receiveNonNullValue(namedExports.getId(), UUID.class));
            namedExports = namedExports.withPrefix(ctx.receiveNonNullNode(namedExports.getPrefix(), JavaScriptReceiver::receiveSpace));
            namedExports = namedExports.withMarkers(ctx.receiveNonNullNode(namedExports.getMarkers(), ctx::receiveMarkers));
            namedExports = namedExports.getPadding().withElements(ctx.receiveNonNullNode(namedExports.getPadding().getElements(), JavaScriptReceiver::receiveContainer));
            namedExports = namedExports.withType(ctx.receiveValue(namedExports.getType(), JavaType.class));
            return namedExports;
        }

        @Override
        public JS.ExportSpecifier visitExportSpecifier(JS.ExportSpecifier exportSpecifier, ReceiverContext ctx) {
            exportSpecifier = exportSpecifier.withId(ctx.receiveNonNullValue(exportSpecifier.getId(), UUID.class));
            exportSpecifier = exportSpecifier.withPrefix(ctx.receiveNonNullNode(exportSpecifier.getPrefix(), JavaScriptReceiver::receiveSpace));
            exportSpecifier = exportSpecifier.withMarkers(ctx.receiveNonNullNode(exportSpecifier.getMarkers(), ctx::receiveMarkers));
            exportSpecifier = exportSpecifier.getPadding().withTypeOnly(ctx.receiveNonNullNode(exportSpecifier.getPadding().getTypeOnly(), leftPaddedValueReceiver(java.lang.Boolean.class)));
            exportSpecifier = exportSpecifier.withSpecifier(ctx.receiveNonNullNode(exportSpecifier.getSpecifier(), ctx::receiveTree));
            exportSpecifier = exportSpecifier.withType(ctx.receiveValue(exportSpecifier.getType(), JavaType.class));
            return exportSpecifier;
        }

        @Override
        public JS.IndexedAccessType visitIndexedAccessType(JS.IndexedAccessType indexedAccessType, ReceiverContext ctx) {
            indexedAccessType = indexedAccessType.withId(ctx.receiveNonNullValue(indexedAccessType.getId(), UUID.class));
            indexedAccessType = indexedAccessType.withPrefix(ctx.receiveNonNullNode(indexedAccessType.getPrefix(), JavaScriptReceiver::receiveSpace));
            indexedAccessType = indexedAccessType.withMarkers(ctx.receiveNonNullNode(indexedAccessType.getMarkers(), ctx::receiveMarkers));
            indexedAccessType = indexedAccessType.withObjectType(ctx.receiveNonNullNode(indexedAccessType.getObjectType(), ctx::receiveTree));
            indexedAccessType = indexedAccessType.withIndexType(ctx.receiveNonNullNode(indexedAccessType.getIndexType(), ctx::receiveTree));
            indexedAccessType = indexedAccessType.withType(ctx.receiveValue(indexedAccessType.getType(), JavaType.class));
            return indexedAccessType;
        }

        @Override
        public JS.IndexedAccessType.IndexType visitIndexedAccessTypeIndexType(JS.IndexedAccessType.IndexType indexType, ReceiverContext ctx) {
            indexType = indexType.withId(ctx.receiveNonNullValue(indexType.getId(), UUID.class));
            indexType = indexType.withPrefix(ctx.receiveNonNullNode(indexType.getPrefix(), JavaScriptReceiver::receiveSpace));
            indexType = indexType.withMarkers(ctx.receiveNonNullNode(indexType.getMarkers(), ctx::receiveMarkers));
            indexType = indexType.getPadding().withElement(ctx.receiveNonNullNode(indexType.getPadding().getElement(), JavaScriptReceiver::receiveRightPaddedTree));
            indexType = indexType.withType(ctx.receiveValue(indexType.getType(), JavaType.class));
            return indexType;
        }

        @Override
        public JS.JsAssignmentOperation visitJsAssignmentOperation(JS.JsAssignmentOperation jsAssignmentOperation, ReceiverContext ctx) {
            jsAssignmentOperation = jsAssignmentOperation.withId(ctx.receiveNonNullValue(jsAssignmentOperation.getId(), UUID.class));
            jsAssignmentOperation = jsAssignmentOperation.withPrefix(ctx.receiveNonNullNode(jsAssignmentOperation.getPrefix(), JavaScriptReceiver::receiveSpace));
            jsAssignmentOperation = jsAssignmentOperation.withMarkers(ctx.receiveNonNullNode(jsAssignmentOperation.getMarkers(), ctx::receiveMarkers));
            jsAssignmentOperation = jsAssignmentOperation.withVariable(ctx.receiveNonNullNode(jsAssignmentOperation.getVariable(), ctx::receiveTree));
            jsAssignmentOperation = jsAssignmentOperation.getPadding().withOperator(ctx.receiveNonNullNode(jsAssignmentOperation.getPadding().getOperator(), leftPaddedValueReceiver(org.openrewrite.javascript.tree.JS.JsAssignmentOperation.Type.class)));
            jsAssignmentOperation = jsAssignmentOperation.withAssignment(ctx.receiveNonNullNode(jsAssignmentOperation.getAssignment(), ctx::receiveTree));
            jsAssignmentOperation = jsAssignmentOperation.withType(ctx.receiveValue(jsAssignmentOperation.getType(), JavaType.class));
            return jsAssignmentOperation;
        }

        @Override
        public JS.TypeTreeExpression visitTypeTreeExpression(JS.TypeTreeExpression typeTreeExpression, ReceiverContext ctx) {
            typeTreeExpression = typeTreeExpression.withId(ctx.receiveNonNullValue(typeTreeExpression.getId(), UUID.class));
            typeTreeExpression = typeTreeExpression.withPrefix(ctx.receiveNonNullNode(typeTreeExpression.getPrefix(), JavaScriptReceiver::receiveSpace));
            typeTreeExpression = typeTreeExpression.withMarkers(ctx.receiveNonNullNode(typeTreeExpression.getMarkers(), ctx::receiveMarkers));
            typeTreeExpression = typeTreeExpression.withExpression(ctx.receiveNonNullNode(typeTreeExpression.getExpression(), ctx::receiveTree));
            return typeTreeExpression;
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

        private final ClassValue<Function<ReceiverContext, Object>> factories = new ClassValue<Function<ReceiverContext, Object>>() {
            @Override
            protected Function<ReceiverContext, Object> computeValue(Class type) {
                if (type == JS.CompilationUnit.class) return Factory::createJSCompilationUnit;
                if (type == JS.Alias.class) return Factory::createJSAlias;
                if (type == JS.ArrowFunction.class) return Factory::createJSArrowFunction;
                if (type == JS.Await.class) return Factory::createJSAwait;
                if (type == JS.ConditionalType.class) return Factory::createJSConditionalType;
                if (type == JS.DefaultType.class) return Factory::createJSDefaultType;
                if (type == JS.Delete.class) return Factory::createJSDelete;
                if (type == JS.Export.class) return Factory::createJSExport;
                if (type == JS.ExpressionStatement.class) return Factory::createJSExpressionStatement;
                if (type == JS.ExpressionWithTypeArguments.class) return Factory::createJSExpressionWithTypeArguments;
                if (type == JS.FunctionType.class) return Factory::createJSFunctionType;
                if (type == JS.InferType.class) return Factory::createJSInferType;
                if (type == JS.ImportType.class) return Factory::createJSImportType;
                if (type == JS.JsImport.class) return Factory::createJSJsImport;
                if (type == JS.JsImportSpecifier.class) return Factory::createJSJsImportSpecifier;
                if (type == JS.JsBinary.class) return Factory::createJSJsBinary;
                if (type == JS.LiteralType.class) return Factory::createJSLiteralType;
                if (type == JS.MappedType.class) return Factory::createJSMappedType;
                if (type == JS.MappedType.KeysRemapping.class) return Factory::createJSMappedTypeKeysRemapping;
                if (type == JS.MappedType.MappedTypeParameter.class) return Factory::createJSMappedTypeMappedTypeParameter;
                if (type == JS.ObjectBindingDeclarations.class) return Factory::createJSObjectBindingDeclarations;
                if (type == JS.PropertyAssignment.class) return Factory::createJSPropertyAssignment;
                if (type == JS.SatisfiesExpression.class) return Factory::createJSSatisfiesExpression;
                if (type == JS.ScopedVariableDeclarations.class) return Factory::createJSScopedVariableDeclarations;
                if (type == JS.StatementExpression.class) return Factory::createJSStatementExpression;
                if (type == JS.TaggedTemplateExpression.class) return Factory::createJSTaggedTemplateExpression;
                if (type == JS.TemplateExpression.class) return Factory::createJSTemplateExpression;
                if (type == JS.TemplateExpression.TemplateSpan.class) return Factory::createJSTemplateExpressionTemplateSpan;
                if (type == JS.Tuple.class) return Factory::createJSTuple;
                if (type == JS.TypeDeclaration.class) return Factory::createJSTypeDeclaration;
                if (type == JS.TypeOf.class) return Factory::createJSTypeOf;
                if (type == JS.TypeQuery.class) return Factory::createJSTypeQuery;
                if (type == JS.TypeOperator.class) return Factory::createJSTypeOperator;
                if (type == JS.TypePredicate.class) return Factory::createJSTypePredicate;
                if (type == JS.Unary.class) return Factory::createJSUnary;
                if (type == JS.Union.class) return Factory::createJSUnion;
                if (type == JS.Intersection.class) return Factory::createJSIntersection;
                if (type == JS.Void.class) return Factory::createJSVoid;
                if (type == JS.Yield.class) return Factory::createJSYield;
                if (type == JS.TypeInfo.class) return Factory::createJSTypeInfo;
                if (type == JS.JSVariableDeclarations.class) return Factory::createJSJSVariableDeclarations;
                if (type == JS.JSVariableDeclarations.JSNamedVariable.class) return Factory::createJSJSVariableDeclarationsJSNamedVariable;
                if (type == JS.JSMethodDeclaration.class) return Factory::createJSJSMethodDeclaration;
                if (type == JS.JSForOfLoop.class) return Factory::createJSJSForOfLoop;
                if (type == JS.JSForInLoop.class) return Factory::createJSJSForInLoop;
                if (type == JS.JSForInOfLoopControl.class) return Factory::createJSJSForInOfLoopControl;
                if (type == JS.NamespaceDeclaration.class) return Factory::createJSNamespaceDeclaration;
                if (type == JS.FunctionDeclaration.class) return Factory::createJSFunctionDeclaration;
                if (type == JS.TypeLiteral.class) return Factory::createJSTypeLiteral;
                if (type == JS.IndexSignatureDeclaration.class) return Factory::createJSIndexSignatureDeclaration;
                if (type == JS.ArrayBindingPattern.class) return Factory::createJSArrayBindingPattern;
                if (type == JS.BindingElement.class) return Factory::createJSBindingElement;
                if (type == JS.ExportDeclaration.class) return Factory::createJSExportDeclaration;
                if (type == JS.ExportAssignment.class) return Factory::createJSExportAssignment;
                if (type == JS.NamedExports.class) return Factory::createJSNamedExports;
                if (type == JS.ExportSpecifier.class) return Factory::createJSExportSpecifier;
                if (type == JS.IndexedAccessType.class) return Factory::createJSIndexedAccessType;
                if (type == JS.IndexedAccessType.IndexType.class) return Factory::createJSIndexedAccessTypeIndexType;
                if (type == JS.JsAssignmentOperation.class) return Factory::createJSJsAssignmentOperation;
                if (type == JS.TypeTreeExpression.class) return Factory::createJSTypeTreeExpression;
                if (type == J.AnnotatedType.class) return Factory::createJAnnotatedType;
                if (type == J.Annotation.class) return Factory::createJAnnotation;
                if (type == J.ArrayAccess.class) return Factory::createJArrayAccess;
                if (type == J.ArrayType.class) return Factory::createJArrayType;
                if (type == J.Assert.class) return Factory::createJAssert;
                if (type == J.Assignment.class) return Factory::createJAssignment;
                if (type == J.AssignmentOperation.class) return Factory::createJAssignmentOperation;
                if (type == J.Binary.class) return Factory::createJBinary;
                if (type == J.Block.class) return Factory::createJBlock;
                if (type == J.Break.class) return Factory::createJBreak;
                if (type == J.Case.class) return Factory::createJCase;
                if (type == J.ClassDeclaration.class) return Factory::createJClassDeclaration;
                if (type == J.ClassDeclaration.Kind.class) return Factory::createJClassDeclarationKind;
                if (type == J.Continue.class) return Factory::createJContinue;
                if (type == J.DoWhileLoop.class) return Factory::createJDoWhileLoop;
                if (type == J.Empty.class) return Factory::createJEmpty;
                if (type == J.EnumValue.class) return Factory::createJEnumValue;
                if (type == J.EnumValueSet.class) return Factory::createJEnumValueSet;
                if (type == J.FieldAccess.class) return Factory::createJFieldAccess;
                if (type == J.ForEachLoop.class) return Factory::createJForEachLoop;
                if (type == J.ForEachLoop.Control.class) return Factory::createJForEachLoopControl;
                if (type == J.ForLoop.class) return Factory::createJForLoop;
                if (type == J.ForLoop.Control.class) return Factory::createJForLoopControl;
                if (type == J.ParenthesizedTypeTree.class) return Factory::createJParenthesizedTypeTree;
                if (type == J.Identifier.class) return Factory::createJIdentifier;
                if (type == J.If.class) return Factory::createJIf;
                if (type == J.If.Else.class) return Factory::createJIfElse;
                if (type == J.Import.class) return Factory::createJImport;
                if (type == J.InstanceOf.class) return Factory::createJInstanceOf;
                if (type == J.IntersectionType.class) return Factory::createJIntersectionType;
                if (type == J.Label.class) return Factory::createJLabel;
                if (type == J.Lambda.class) return Factory::createJLambda;
                if (type == J.Lambda.Parameters.class) return Factory::createJLambdaParameters;
                if (type == J.Literal.class) return Factory::createJLiteral;
                if (type == J.MemberReference.class) return Factory::createJMemberReference;
                if (type == J.MethodDeclaration.class) return Factory::createJMethodDeclaration;
                if (type == J.MethodInvocation.class) return Factory::createJMethodInvocation;
                if (type == J.Modifier.class) return Factory::createJModifier;
                if (type == J.MultiCatch.class) return Factory::createJMultiCatch;
                if (type == J.NewArray.class) return Factory::createJNewArray;
                if (type == J.ArrayDimension.class) return Factory::createJArrayDimension;
                if (type == J.NewClass.class) return Factory::createJNewClass;
                if (type == J.NullableType.class) return Factory::createJNullableType;
                if (type == J.Package.class) return Factory::createJPackage;
                if (type == J.ParameterizedType.class) return Factory::createJParameterizedType;
                if (type == J.Parentheses.class) return Factory::createJParentheses;
                if (type == J.ControlParentheses.class) return Factory::createJControlParentheses;
                if (type == J.Primitive.class) return Factory::createJPrimitive;
                if (type == J.Return.class) return Factory::createJReturn;
                if (type == J.Switch.class) return Factory::createJSwitch;
                if (type == J.SwitchExpression.class) return Factory::createJSwitchExpression;
                if (type == J.Synchronized.class) return Factory::createJSynchronized;
                if (type == J.Ternary.class) return Factory::createJTernary;
                if (type == J.Throw.class) return Factory::createJThrow;
                if (type == J.Try.class) return Factory::createJTry;
                if (type == J.Try.Resource.class) return Factory::createJTryResource;
                if (type == J.Try.Catch.class) return Factory::createJTryCatch;
                if (type == J.TypeCast.class) return Factory::createJTypeCast;
                if (type == J.TypeParameter.class) return Factory::createJTypeParameter;
                if (type == J.TypeParameters.class) return Factory::createJTypeParameters;
                if (type == J.Unary.class) return Factory::createJUnary;
                if (type == J.VariableDeclarations.class) return Factory::createJVariableDeclarations;
                if (type == J.VariableDeclarations.NamedVariable.class) return Factory::createJVariableDeclarationsNamedVariable;
                if (type == J.WhileLoop.class) return Factory::createJWhileLoop;
                if (type == J.Wildcard.class) return Factory::createJWildcard;
                if (type == J.Yield.class) return Factory::createJYield;
                if (type == J.Unknown.class) return Factory::createJUnknown;
                if (type == J.Unknown.Source.class) return Factory::createJUnknownSource;
                throw new IllegalArgumentException("Unknown type: " + type);
            }
        };

        @Override
        @SuppressWarnings("unchecked")
        public <T> T create(Class<T> type, ReceiverContext ctx) {
            return (T) factories.get(type).apply(ctx);
        }

        private static JS.CompilationUnit createJSCompilationUnit(ReceiverContext ctx) {
            return new JS.CompilationUnit(
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

        private static JS.Alias createJSAlias(ReceiverContext ctx) {
            return new JS.Alias(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static JS.ArrowFunction createJSArrowFunction(ReceiverContext ctx) {
            return new JS.ArrowFunction(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.Await createJSAwait(ReceiverContext ctx) {
            return new JS.Await(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.ConditionalType createJSConditionalType(ReceiverContext ctx) {
            return new JS.ConditionalType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.DefaultType createJSDefaultType(ReceiverContext ctx) {
            return new JS.DefaultType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.Delete createJSDelete(ReceiverContext ctx) {
            return new JS.Delete(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.Export createJSExport(ReceiverContext ctx) {
            return new JS.Export(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
            );
        }

        private static JS.ExpressionStatement createJSExpressionStatement(ReceiverContext ctx) {
            return new JS.ExpressionStatement(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static JS.ExpressionWithTypeArguments createJSExpressionWithTypeArguments(ReceiverContext ctx) {
            return new JS.ExpressionWithTypeArguments(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.FunctionType createJSFunctionType(ReceiverContext ctx) {
            return new JS.FunctionType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, rightPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.InferType createJSInferType(ReceiverContext ctx) {
            return new JS.InferType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.ImportType createJSImportType(ReceiverContext ctx) {
            return new JS.ImportType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, rightPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.JsImport createJSJsImport(ReceiverContext ctx) {
            return new JS.JsImport(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
            );
        }

        private static JS.JsImportSpecifier createJSJsImportSpecifier(ReceiverContext ctx) {
            return new JS.JsImportSpecifier(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.JsBinary createJSJsBinary(ReceiverContext ctx) {
            return new JS.JsBinary(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(org.openrewrite.javascript.tree.JS.JsBinary.Type.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.LiteralType createJSLiteralType(ReceiverContext ctx) {
            return new JS.LiteralType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.MappedType createJSMappedType(ReceiverContext ctx) {
            return new JS.MappedType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.MappedType.KeysRemapping createJSMappedTypeKeysRemapping(ReceiverContext ctx) {
            return new JS.MappedType.KeysRemapping(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static JS.MappedType.MappedTypeParameter createJSMappedTypeMappedTypeParameter(ReceiverContext ctx) {
            return new JS.MappedType.MappedTypeParameter(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
            );
        }

        private static JS.ObjectBindingDeclarations createJSObjectBindingDeclarations(ReceiverContext ctx) {
            return new JS.ObjectBindingDeclarations(
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

        private static JS.PropertyAssignment createJSPropertyAssignment(ReceiverContext ctx) {
            return new JS.PropertyAssignment(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNode(null, ctx::receiveTree)
            );
        }

        private static JS.SatisfiesExpression createJSSatisfiesExpression(ReceiverContext ctx) {
            return new JS.SatisfiesExpression(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.ScopedVariableDeclarations createJSScopedVariableDeclarations(ReceiverContext ctx) {
            return new JS.ScopedVariableDeclarations(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNode(null, leftPaddedValueReceiver(org.openrewrite.javascript.tree.JS.ScopedVariableDeclarations.Scope.class)),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static JS.StatementExpression createJSStatementExpression(ReceiverContext ctx) {
            return new JS.StatementExpression(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static JS.TaggedTemplateExpression createJSTaggedTemplateExpression(ReceiverContext ctx) {
            return new JS.TaggedTemplateExpression(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.TemplateExpression createJSTemplateExpression(ReceiverContext ctx) {
            return new JS.TemplateExpression(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.TemplateExpression.TemplateSpan createJSTemplateExpressionTemplateSpan(ReceiverContext ctx) {
            return new JS.TemplateExpression.TemplateSpan(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static JS.Tuple createJSTuple(ReceiverContext ctx) {
            return new JS.Tuple(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.TypeDeclaration createJSTypeDeclaration(ReceiverContext ctx) {
            return new JS.TypeDeclaration(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.TypeOf createJSTypeOf(ReceiverContext ctx) {
            return new JS.TypeOf(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.TypeQuery createJSTypeQuery(ReceiverContext ctx) {
            return new JS.TypeQuery(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.TypeOperator createJSTypeOperator(ReceiverContext ctx) {
            return new JS.TypeOperator(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, JS.TypeOperator.Type.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
            );
        }

        private static JS.TypePredicate createJSTypePredicate(ReceiverContext ctx) {
            return new JS.TypePredicate(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.Unary createJSUnary(ReceiverContext ctx) {
            return new JS.Unary(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(org.openrewrite.javascript.tree.JS.Unary.Type.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.Union createJSUnion(ReceiverContext ctx) {
            return new JS.Union(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.Intersection createJSIntersection(ReceiverContext ctx) {
            return new JS.Intersection(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.Void createJSVoid(ReceiverContext ctx) {
            return new JS.Void(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static JS.Yield createJSYield(ReceiverContext ctx) {
            return new JS.Yield(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.TypeInfo createJSTypeInfo(ReceiverContext ctx) {
            return new JS.TypeInfo(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static JS.JSVariableDeclarations createJSJSVariableDeclarations(ReceiverContext ctx) {
            return new JS.JSVariableDeclarations(
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

        private static JS.JSVariableDeclarations.JSNamedVariable createJSJSVariableDeclarationsJSNamedVariable(ReceiverContext ctx) {
            return new JS.JSVariableDeclarations.JSNamedVariable(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.Variable.class)
            );
        }

        private static JS.JSMethodDeclaration createJSJSMethodDeclaration(ReceiverContext ctx) {
            return new JS.JSMethodDeclaration(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.Method.class)
            );
        }

        private static JS.JSForOfLoop createJSJSForOfLoop(ReceiverContext ctx) {
            return new JS.JSForOfLoop(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static JS.JSForInLoop createJSJSForInLoop(ReceiverContext ctx) {
            return new JS.JSForInLoop(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static JS.JSForInOfLoopControl createJSJSForInOfLoopControl(ReceiverContext ctx) {
            return new JS.JSForInOfLoopControl(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static JS.NamespaceDeclaration createJSNamespaceDeclaration(ReceiverContext ctx) {
            return new JS.NamespaceDeclaration(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(org.openrewrite.javascript.tree.JS.NamespaceDeclaration.KeywordType.class)),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static JS.FunctionDeclaration createJSFunctionDeclaration(ReceiverContext ctx) {
            return new JS.FunctionDeclaration(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.TypeLiteral createJSTypeLiteral(ReceiverContext ctx) {
            return new JS.TypeLiteral(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.IndexSignatureDeclaration createJSIndexSignatureDeclaration(ReceiverContext ctx) {
            return new JS.IndexSignatureDeclaration(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.ArrayBindingPattern createJSArrayBindingPattern(ReceiverContext ctx) {
            return new JS.ArrayBindingPattern(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.BindingElement createJSBindingElement(ReceiverContext ctx) {
            return new JS.BindingElement(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.Variable.class)
            );
        }

        private static JS.ExportDeclaration createJSExportDeclaration(ReceiverContext ctx) {
            return new JS.ExportDeclaration(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
            );
        }

        private static JS.ExportAssignment createJSExportAssignment(ReceiverContext ctx) {
            return new JS.ExportAssignment(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNode(null, ctx::receiveTree)
            );
        }

        private static JS.NamedExports createJSNamedExports(ReceiverContext ctx) {
            return new JS.NamedExports(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.ExportSpecifier createJSExportSpecifier(ReceiverContext ctx) {
            return new JS.ExportSpecifier(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.IndexedAccessType createJSIndexedAccessType(ReceiverContext ctx) {
            return new JS.IndexedAccessType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.IndexedAccessType.IndexType createJSIndexedAccessTypeIndexType(ReceiverContext ctx) {
            return new JS.IndexedAccessType.IndexType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.JsAssignmentOperation createJSJsAssignmentOperation(ReceiverContext ctx) {
            return new JS.JsAssignmentOperation(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(org.openrewrite.javascript.tree.JS.JsAssignmentOperation.Type.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static JS.TypeTreeExpression createJSTypeTreeExpression(ReceiverContext ctx) {
            return new JS.TypeTreeExpression(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static J.AnnotatedType createJAnnotatedType(ReceiverContext ctx) {
            return new J.AnnotatedType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static J.Annotation createJAnnotation(ReceiverContext ctx) {
            return new J.Annotation(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer)
            );
        }

        private static J.ArrayAccess createJArrayAccess(ReceiverContext ctx) {
            return new J.ArrayAccess(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static J.ArrayType createJArrayType(ReceiverContext ctx) {
            return new J.ArrayType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNodes(null, ctx::receiveTree),
                    ctx.receiveNode(null, leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static J.Assert createJAssert(ReceiverContext ctx) {
            return new J.Assert(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
            );
        }

        private static J.Assignment createJAssignment(ReceiverContext ctx) {
            return new J.Assignment(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static J.AssignmentOperation createJAssignmentOperation(ReceiverContext ctx) {
            return new J.AssignmentOperation(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(org.openrewrite.java.tree.J.AssignmentOperation.Type.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static J.Binary createJBinary(ReceiverContext ctx) {
            return new J.Binary(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(org.openrewrite.java.tree.J.Binary.Type.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static J.Block createJBlock(ReceiverContext ctx) {
            return new J.Block(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, rightPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace)
            );
        }

        private static J.Break createJBreak(ReceiverContext ctx) {
            return new J.Break(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, ctx::receiveTree)
            );
        }

        private static J.Case createJCase(ReceiverContext ctx) {
            return new J.Case(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, J.Case.Type.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.ClassDeclaration createJClassDeclaration(ReceiverContext ctx) {
            return new J.ClassDeclaration(
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

        private static J.ClassDeclaration.Kind createJClassDeclarationKind(ReceiverContext ctx) {
            return new J.ClassDeclaration.Kind(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullValue(null, J.ClassDeclaration.Kind.Type.class)
            );
        }

        private static J.Continue createJContinue(ReceiverContext ctx) {
            return new J.Continue(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, ctx::receiveTree)
            );
        }

        private static J.DoWhileLoop createJDoWhileLoop(ReceiverContext ctx) {
            return new J.DoWhileLoop(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
            );
        }

        private static J.Empty createJEmpty(ReceiverContext ctx) {
            return new J.Empty(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers)
            );
        }

        private static J.EnumValue createJEnumValue(ReceiverContext ctx) {
            return new J.EnumValue(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree)
            );
        }

        private static J.EnumValueSet createJEnumValueSet(ReceiverContext ctx) {
            return new J.EnumValueSet(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullValue(null, boolean.class)
            );
        }

        private static J.FieldAccess createJFieldAccess(ReceiverContext ctx) {
            return new J.FieldAccess(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static J.ForEachLoop createJForEachLoop(ReceiverContext ctx) {
            return new J.ForEachLoop(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.ForEachLoop.Control createJForEachLoopControl(ReceiverContext ctx) {
            return new J.ForEachLoop.Control(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.ForLoop createJForLoop(ReceiverContext ctx) {
            return new J.ForLoop(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.ForLoop.Control createJForLoopControl(ReceiverContext ctx) {
            return new J.ForLoop.Control(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.ParenthesizedTypeTree createJParenthesizedTypeTree(ReceiverContext ctx) {
            return new J.ParenthesizedTypeTree(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static J.Identifier createJIdentifier(ReceiverContext ctx) {
            return new J.Identifier(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullValue(null, String.class),
                    ctx.receiveValue(null, JavaType.class),
                    ctx.receiveValue(null, JavaType.Variable.class)
            );
        }

        private static J.If createJIf(ReceiverContext ctx) {
            return new J.If(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNode(null, ctx::receiveTree)
            );
        }

        private static J.If.Else createJIfElse(ReceiverContext ctx) {
            return new J.If.Else(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.Import createJImport(ReceiverContext ctx) {
            return new J.Import(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(java.lang.Boolean.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
            );
        }

        private static J.InstanceOf createJInstanceOf(ReceiverContext ctx) {
            return new J.InstanceOf(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static J.IntersectionType createJIntersectionType(ReceiverContext ctx) {
            return new J.IntersectionType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveContainer)
            );
        }

        private static J.Label createJLabel(ReceiverContext ctx) {
            return new J.Label(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static J.Lambda createJLambda(ReceiverContext ctx) {
            return new J.Lambda(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLambdaParameters),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static J.Lambda.Parameters createJLambdaParameters(ReceiverContext ctx) {
            return new J.Lambda.Parameters(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, boolean.class),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.Literal createJLiteral(ReceiverContext ctx) {
            return new J.Literal(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveValue(null, Object.class),
                    ctx.receiveValue(null, String.class),
                    ctx.receiveValues(null, J.Literal.UnicodeEscape.class),
                    ctx.receiveValue(null, JavaType.Primitive.class)
            );
        }

        private static J.MemberReference createJMemberReference(ReceiverContext ctx) {
            return new J.MemberReference(
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

        private static J.MethodDeclaration createJMethodDeclaration(ReceiverContext ctx) {
            return new J.MethodDeclaration(
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

        private static J.MethodInvocation createJMethodInvocation(ReceiverContext ctx) {
            return new J.MethodInvocation(
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

        private static J.Modifier createJModifier(ReceiverContext ctx) {
            return new J.Modifier(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveValue(null, String.class),
                    ctx.receiveNonNullValue(null, J.Modifier.Type.class),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree)
            );
        }

        private static J.MultiCatch createJMultiCatch(ReceiverContext ctx) {
            return new J.MultiCatch(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.NewArray createJNewArray(ReceiverContext ctx) {
            return new J.NewArray(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static J.ArrayDimension createJArrayDimension(ReceiverContext ctx) {
            return new J.ArrayDimension(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.NewClass createJNewClass(ReceiverContext ctx) {
            return new J.NewClass(
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

        private static J.NullableType createJNullableType(ReceiverContext ctx) {
            return new J.NullableType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.Package createJPackage(ReceiverContext ctx) {
            return new J.Package(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree)
            );
        }

        private static J.ParameterizedType createJParameterizedType(ReceiverContext ctx) {
            return new J.ParameterizedType(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static J.Parentheses createJParentheses(ReceiverContext ctx) {
            return new J.Parentheses(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.ControlParentheses createJControlParentheses(ReceiverContext ctx) {
            return new J.ControlParentheses(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.Primitive createJPrimitive(ReceiverContext ctx) {
            return new J.Primitive(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveValue(null, JavaType.Primitive.class)
            );
        }

        private static J.Return createJReturn(ReceiverContext ctx) {
            return new J.Return(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, ctx::receiveTree)
            );
        }

        private static J.Switch createJSwitch(ReceiverContext ctx) {
            return new J.Switch(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static J.SwitchExpression createJSwitchExpression(ReceiverContext ctx) {
            return new J.SwitchExpression(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static J.Synchronized createJSynchronized(ReceiverContext ctx) {
            return new J.Synchronized(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static J.Ternary createJTernary(ReceiverContext ctx) {
            return new J.Ternary(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static J.Throw createJThrow(ReceiverContext ctx) {
            return new J.Throw(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static J.Try createJTry(ReceiverContext ctx) {
            return new J.Try(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree)
            );
        }

        private static J.Try.Resource createJTryResource(ReceiverContext ctx) {
            return new J.Try.Resource(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullValue(null, boolean.class)
            );
        }

        private static J.Try.Catch createJTryCatch(ReceiverContext ctx) {
            return new J.Try.Catch(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static J.TypeCast createJTypeCast(ReceiverContext ctx) {
            return new J.TypeCast(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static J.TypeParameter createJTypeParameter(ReceiverContext ctx) {
            return new J.TypeParameter(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveModifier),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveContainer)
            );
        }

        private static J.TypeParameters createJTypeParameters(ReceiverContext ctx) {
            return new J.TypeParameters(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNodes(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.Unary createJUnary(ReceiverContext ctx) {
            return new J.Unary(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, leftPaddedValueReceiver(org.openrewrite.java.tree.J.Unary.Type.class)),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveValue(null, JavaType.class)
            );
        }

        private static J.VariableDeclarations createJVariableDeclarations(ReceiverContext ctx) {
            return new J.VariableDeclarations(
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

        private static J.VariableDeclarations.NamedVariable createJVariableDeclarationsNamedVariable(ReceiverContext ctx) {
            return new J.VariableDeclarations.NamedVariable(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNodes(null, leftPaddedNodeReceiver(org.openrewrite.java.tree.Space.class)),
                    ctx.receiveNode(null, JavaScriptReceiver::receiveLeftPaddedTree),
                    ctx.receiveValue(null, JavaType.Variable.class)
            );
        }

        private static J.WhileLoop createJWhileLoop(ReceiverContext ctx) {
            return new J.WhileLoop(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveRightPaddedTree)
            );
        }

        private static J.Wildcard createJWildcard(ReceiverContext ctx) {
            return new J.Wildcard(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNode(null, leftPaddedValueReceiver(org.openrewrite.java.tree.J.Wildcard.Bound.class)),
                    ctx.receiveNode(null, ctx::receiveTree)
            );
        }

        private static J.Yield createJYield(ReceiverContext ctx) {
            return new J.Yield(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, boolean.class),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static J.Unknown createJUnknown(ReceiverContext ctx) {
            return new J.Unknown(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullNode(null, ctx::receiveTree)
            );
        }

        private static J.Unknown.Source createJUnknownSource(ReceiverContext ctx) {
            return new J.Unknown.Source(
                    ctx.receiveNonNullValue(null, UUID.class),
                    ctx.receiveNonNullNode(null, JavaScriptReceiver::receiveSpace),
                    ctx.receiveNonNullNode(null, ctx::receiveMarkers),
                    ctx.receiveNonNullValue(null, String.class)
            );
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
