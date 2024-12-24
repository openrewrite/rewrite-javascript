import * as extensions from "./remote_extensions";
import {Checksum, Cursor, FileAttributes, ListUtils, Tree} from '../../core';
import {DetailsReceiver, Receiver, ReceiverContext, ReceiverFactory, ValueType} from '@openrewrite/rewrite-remote';
import {JavaScriptVisitor} from '..';
import {JS, JsLeftPadded, JsRightPadded, JsContainer, JsSpace, CompilationUnit, Alias, ArrowFunction, Await, ConditionalType, DefaultType, Delete, Export, ExpressionStatement, ExpressionWithTypeArguments, FunctionType, InferType, ImportType, JsImport, JsImportSpecifier, JsBinary, LiteralType, MappedType, ObjectBindingDeclarations, PropertyAssignment, SatisfiesExpression, ScopedVariableDeclarations, StatementExpression, TaggedTemplateExpression, TemplateExpression, Tuple, TypeDeclaration, TypeOf, TypeQuery, TypeOperator, TypePredicate, Unary, Union, Intersection, Void, Yield, TypeInfo, JSVariableDeclarations, JSMethodDeclaration, JSForOfLoop, JSForInLoop, JSForInOfLoopControl, NamespaceDeclaration, FunctionDeclaration, TypeLiteral, IndexSignatureDeclaration, ArrayBindingPattern, BindingElement, ExportDeclaration, ExportAssignment, NamedExports, ExportSpecifier, IndexedAccessType, JsAssignmentOperation, TypeTreeExpression} from '../tree';
import {Expression, J, JContainer, JLeftPadded, JRightPadded, NameTree, Space, Statement, TypeTree, TypedTree} from "../../java";
import * as Java from "../../java/tree";

export class JavaScriptReceiver implements Receiver<JS> {
    public fork(ctx: ReceiverContext): ReceiverContext {
        return ctx.fork(new Visitor(), new Factory());
    }

    public receive(before: JS | null, ctx: ReceiverContext): Tree {
        let forked = this.fork(ctx);
        return forked.visitor!.visit(before, forked)!;
    }
}

class Visitor extends JavaScriptVisitor<ReceiverContext> {
    public visit(tree: Tree | null, ctx: ReceiverContext): J | null {
        this.cursor = new Cursor(this.cursor, tree!);

        tree = ctx.receiveNode(tree as (J | null), ctx.receiveTree);

        this.cursor = this.cursor.parent!;
        return tree as (J | null);
    }

    public visitJsCompilationUnit(compilationUnit: CompilationUnit, ctx: ReceiverContext): J {
        compilationUnit = compilationUnit.withId(ctx.receiveValue(compilationUnit.id, ValueType.UUID)!);
        compilationUnit = compilationUnit.withPrefix(ctx.receiveNode(compilationUnit.prefix, receiveSpace)!);
        compilationUnit = compilationUnit.withMarkers(ctx.receiveNode(compilationUnit.markers, ctx.receiveMarkers)!);
        compilationUnit = compilationUnit.withSourcePath(ctx.receiveValue(compilationUnit.sourcePath, ValueType.Primitive)!);
        compilationUnit = compilationUnit.withFileAttributes(ctx.receiveValue(compilationUnit.fileAttributes, ValueType.Object));
        compilationUnit = compilationUnit.withCharsetName(ctx.receiveValue(compilationUnit.charsetName, ValueType.Primitive));
        compilationUnit = compilationUnit.withCharsetBomMarked(ctx.receiveValue(compilationUnit.charsetBomMarked, ValueType.Primitive)!);
        compilationUnit = compilationUnit.withChecksum(ctx.receiveValue(compilationUnit.checksum, ValueType.Object));
        compilationUnit = compilationUnit.padding.withImports(ctx.receiveNodes(compilationUnit.padding.imports, receiveRightPaddedTree)!);
        compilationUnit = compilationUnit.padding.withStatements(ctx.receiveNodes(compilationUnit.padding.statements, receiveRightPaddedTree)!);
        compilationUnit = compilationUnit.withEof(ctx.receiveNode(compilationUnit.eof, receiveSpace)!);
        return compilationUnit;
    }

    public visitAlias(alias: Alias, ctx: ReceiverContext): J {
        alias = alias.withId(ctx.receiveValue(alias.id, ValueType.UUID)!);
        alias = alias.withPrefix(ctx.receiveNode(alias.prefix, receiveSpace)!);
        alias = alias.withMarkers(ctx.receiveNode(alias.markers, ctx.receiveMarkers)!);
        alias = alias.padding.withPropertyName(ctx.receiveNode(alias.padding.propertyName, receiveRightPaddedTree)!);
        alias = alias.withAlias(ctx.receiveNode(alias.alias, ctx.receiveTree)!);
        return alias;
    }

    public visitArrowFunction(arrowFunction: ArrowFunction, ctx: ReceiverContext): J {
        arrowFunction = arrowFunction.withId(ctx.receiveValue(arrowFunction.id, ValueType.UUID)!);
        arrowFunction = arrowFunction.withPrefix(ctx.receiveNode(arrowFunction.prefix, receiveSpace)!);
        arrowFunction = arrowFunction.withMarkers(ctx.receiveNode(arrowFunction.markers, ctx.receiveMarkers)!);
        arrowFunction = arrowFunction.withLeadingAnnotations(ctx.receiveNodes(arrowFunction.leadingAnnotations, ctx.receiveTree)!);
        arrowFunction = arrowFunction.withModifiers(ctx.receiveNodes(arrowFunction.modifiers, ctx.receiveTree)!);
        arrowFunction = arrowFunction.withTypeParameters(ctx.receiveNode(arrowFunction.typeParameters, ctx.receiveTree));
        arrowFunction = arrowFunction.withParameters(ctx.receiveNode(arrowFunction.parameters, ctx.receiveTree)!);
        arrowFunction = arrowFunction.withReturnTypeExpression(ctx.receiveNode(arrowFunction.returnTypeExpression, ctx.receiveTree));
        arrowFunction = arrowFunction.padding.withBody(ctx.receiveNode(arrowFunction.padding.body, receiveLeftPaddedTree)!);
        arrowFunction = arrowFunction.withType(ctx.receiveValue(arrowFunction.type, ValueType.Object));
        return arrowFunction;
    }

    public visitAwait(await: Await, ctx: ReceiverContext): J {
        await = await.withId(ctx.receiveValue(await.id, ValueType.UUID)!);
        await = await.withPrefix(ctx.receiveNode(await.prefix, receiveSpace)!);
        await = await.withMarkers(ctx.receiveNode(await.markers, ctx.receiveMarkers)!);
        await = await.withExpression(ctx.receiveNode(await.expression, ctx.receiveTree)!);
        await = await.withType(ctx.receiveValue(await.type, ValueType.Object));
        return await;
    }

    public visitConditionalType(conditionalType: ConditionalType, ctx: ReceiverContext): J {
        conditionalType = conditionalType.withId(ctx.receiveValue(conditionalType.id, ValueType.UUID)!);
        conditionalType = conditionalType.withPrefix(ctx.receiveNode(conditionalType.prefix, receiveSpace)!);
        conditionalType = conditionalType.withMarkers(ctx.receiveNode(conditionalType.markers, ctx.receiveMarkers)!);
        conditionalType = conditionalType.withCheckType(ctx.receiveNode(conditionalType.checkType, ctx.receiveTree)!);
        conditionalType = conditionalType.padding.withCondition(ctx.receiveNode(conditionalType.padding.condition, receiveContainer)!);
        conditionalType = conditionalType.withType(ctx.receiveValue(conditionalType.type, ValueType.Object));
        return conditionalType;
    }

    public visitDefaultType(defaultType: DefaultType, ctx: ReceiverContext): J {
        defaultType = defaultType.withId(ctx.receiveValue(defaultType.id, ValueType.UUID)!);
        defaultType = defaultType.withPrefix(ctx.receiveNode(defaultType.prefix, receiveSpace)!);
        defaultType = defaultType.withMarkers(ctx.receiveNode(defaultType.markers, ctx.receiveMarkers)!);
        defaultType = defaultType.withLeft(ctx.receiveNode(defaultType.left, ctx.receiveTree)!);
        defaultType = defaultType.withBeforeEquals(ctx.receiveNode(defaultType.beforeEquals, receiveSpace)!);
        defaultType = defaultType.withRight(ctx.receiveNode(defaultType.right, ctx.receiveTree)!);
        defaultType = defaultType.withType(ctx.receiveValue(defaultType.type, ValueType.Object));
        return defaultType;
    }

    public visitDelete(_delete: Delete, ctx: ReceiverContext): J {
        _delete = _delete.withId(ctx.receiveValue(_delete.id, ValueType.UUID)!);
        _delete = _delete.withPrefix(ctx.receiveNode(_delete.prefix, receiveSpace)!);
        _delete = _delete.withMarkers(ctx.receiveNode(_delete.markers, ctx.receiveMarkers)!);
        _delete = _delete.withExpression(ctx.receiveNode(_delete.expression, ctx.receiveTree)!);
        _delete = _delete.withType(ctx.receiveValue(_delete.type, ValueType.Object));
        return _delete;
    }

    public visitExport(_export: Export, ctx: ReceiverContext): J {
        _export = _export.withId(ctx.receiveValue(_export.id, ValueType.UUID)!);
        _export = _export.withPrefix(ctx.receiveNode(_export.prefix, receiveSpace)!);
        _export = _export.withMarkers(ctx.receiveNode(_export.markers, ctx.receiveMarkers)!);
        _export = _export.padding.withExports(ctx.receiveNode(_export.padding.exports, receiveContainer));
        _export = _export.withFrom(ctx.receiveNode(_export.from, receiveSpace));
        _export = _export.withTarget(ctx.receiveNode(_export.target, ctx.receiveTree));
        _export = _export.padding.withInitializer(ctx.receiveNode(_export.padding.initializer, receiveLeftPaddedTree));
        return _export;
    }

    public visitExpressionStatement(expressionStatement: ExpressionStatement, ctx: ReceiverContext): J {
        expressionStatement = expressionStatement.withId(ctx.receiveValue(expressionStatement.id, ValueType.UUID)!);
        expressionStatement = expressionStatement.withExpression(ctx.receiveNode(expressionStatement.expression, ctx.receiveTree)!);
        return expressionStatement;
    }

    public visitExpressionWithTypeArguments(expressionWithTypeArguments: ExpressionWithTypeArguments, ctx: ReceiverContext): J {
        expressionWithTypeArguments = expressionWithTypeArguments.withId(ctx.receiveValue(expressionWithTypeArguments.id, ValueType.UUID)!);
        expressionWithTypeArguments = expressionWithTypeArguments.withPrefix(ctx.receiveNode(expressionWithTypeArguments.prefix, receiveSpace)!);
        expressionWithTypeArguments = expressionWithTypeArguments.withMarkers(ctx.receiveNode(expressionWithTypeArguments.markers, ctx.receiveMarkers)!);
        expressionWithTypeArguments = expressionWithTypeArguments.withClazz(ctx.receiveNode(expressionWithTypeArguments.clazz, ctx.receiveTree)!);
        expressionWithTypeArguments = expressionWithTypeArguments.padding.withTypeArguments(ctx.receiveNode(expressionWithTypeArguments.padding.typeArguments, receiveContainer));
        expressionWithTypeArguments = expressionWithTypeArguments.withType(ctx.receiveValue(expressionWithTypeArguments.type, ValueType.Object));
        return expressionWithTypeArguments;
    }

    public visitFunctionType(functionType: FunctionType, ctx: ReceiverContext): J {
        functionType = functionType.withId(ctx.receiveValue(functionType.id, ValueType.UUID)!);
        functionType = functionType.withPrefix(ctx.receiveNode(functionType.prefix, receiveSpace)!);
        functionType = functionType.withMarkers(ctx.receiveNode(functionType.markers, ctx.receiveMarkers)!);
        functionType = functionType.withModifiers(ctx.receiveNodes(functionType.modifiers, ctx.receiveTree)!);
        functionType = functionType.padding.withConstructorType(ctx.receiveNode(functionType.padding.constructorType, leftPaddedValueReceiver(ValueType.Primitive))!);
        functionType = functionType.withTypeParameters(ctx.receiveNode(functionType.typeParameters, ctx.receiveTree));
        functionType = functionType.padding.withParameters(ctx.receiveNode(functionType.padding.parameters, receiveContainer)!);
        functionType = functionType.withArrow(ctx.receiveNode(functionType.arrow, receiveSpace)!);
        functionType = functionType.withReturnType(ctx.receiveNode(functionType.returnType, ctx.receiveTree)!);
        functionType = functionType.withType(ctx.receiveValue(functionType.type, ValueType.Object));
        return functionType;
    }

    public visitInferType(inferType: InferType, ctx: ReceiverContext): J {
        inferType = inferType.withId(ctx.receiveValue(inferType.id, ValueType.UUID)!);
        inferType = inferType.withPrefix(ctx.receiveNode(inferType.prefix, receiveSpace)!);
        inferType = inferType.withMarkers(ctx.receiveNode(inferType.markers, ctx.receiveMarkers)!);
        inferType = inferType.padding.withTypeParameter(ctx.receiveNode(inferType.padding.typeParameter, receiveLeftPaddedTree)!);
        inferType = inferType.withType(ctx.receiveValue(inferType.type, ValueType.Object));
        return inferType;
    }

    public visitImportType(importType: ImportType, ctx: ReceiverContext): J {
        importType = importType.withId(ctx.receiveValue(importType.id, ValueType.UUID)!);
        importType = importType.withPrefix(ctx.receiveNode(importType.prefix, receiveSpace)!);
        importType = importType.withMarkers(ctx.receiveNode(importType.markers, ctx.receiveMarkers)!);
        importType = importType.padding.withHasTypeof(ctx.receiveNode(importType.padding.hasTypeof, rightPaddedValueReceiver(ValueType.Primitive))!);
        importType = importType.withImportArgument(ctx.receiveNode(importType.importArgument, ctx.receiveTree)!);
        importType = importType.padding.withQualifier(ctx.receiveNode(importType.padding.qualifier, receiveLeftPaddedTree));
        importType = importType.padding.withTypeArguments(ctx.receiveNode(importType.padding.typeArguments, receiveContainer));
        importType = importType.withType(ctx.receiveValue(importType.type, ValueType.Object));
        return importType;
    }

    public visitJsImport(jsImport: JsImport, ctx: ReceiverContext): J {
        jsImport = jsImport.withId(ctx.receiveValue(jsImport.id, ValueType.UUID)!);
        jsImport = jsImport.withPrefix(ctx.receiveNode(jsImport.prefix, receiveSpace)!);
        jsImport = jsImport.withMarkers(ctx.receiveNode(jsImport.markers, ctx.receiveMarkers)!);
        jsImport = jsImport.padding.withName(ctx.receiveNode(jsImport.padding.name, receiveRightPaddedTree));
        jsImport = jsImport.padding.withImportType(ctx.receiveNode(jsImport.padding.importType, leftPaddedValueReceiver(ValueType.Primitive))!);
        jsImport = jsImport.padding.withImports(ctx.receiveNode(jsImport.padding.imports, receiveContainer));
        jsImport = jsImport.withFrom(ctx.receiveNode(jsImport.from, receiveSpace));
        jsImport = jsImport.withTarget(ctx.receiveNode(jsImport.target, ctx.receiveTree));
        jsImport = jsImport.padding.withInitializer(ctx.receiveNode(jsImport.padding.initializer, receiveLeftPaddedTree));
        return jsImport;
    }

    public visitJsImportSpecifier(jsImportSpecifier: JsImportSpecifier, ctx: ReceiverContext): J {
        jsImportSpecifier = jsImportSpecifier.withId(ctx.receiveValue(jsImportSpecifier.id, ValueType.UUID)!);
        jsImportSpecifier = jsImportSpecifier.withPrefix(ctx.receiveNode(jsImportSpecifier.prefix, receiveSpace)!);
        jsImportSpecifier = jsImportSpecifier.withMarkers(ctx.receiveNode(jsImportSpecifier.markers, ctx.receiveMarkers)!);
        jsImportSpecifier = jsImportSpecifier.padding.withImportType(ctx.receiveNode(jsImportSpecifier.padding.importType, leftPaddedValueReceiver(ValueType.Primitive))!);
        jsImportSpecifier = jsImportSpecifier.withSpecifier(ctx.receiveNode(jsImportSpecifier.specifier, ctx.receiveTree)!);
        jsImportSpecifier = jsImportSpecifier.withType(ctx.receiveValue(jsImportSpecifier.type, ValueType.Object));
        return jsImportSpecifier;
    }

    public visitJsBinary(jsBinary: JsBinary, ctx: ReceiverContext): J {
        jsBinary = jsBinary.withId(ctx.receiveValue(jsBinary.id, ValueType.UUID)!);
        jsBinary = jsBinary.withPrefix(ctx.receiveNode(jsBinary.prefix, receiveSpace)!);
        jsBinary = jsBinary.withMarkers(ctx.receiveNode(jsBinary.markers, ctx.receiveMarkers)!);
        jsBinary = jsBinary.withLeft(ctx.receiveNode(jsBinary.left, ctx.receiveTree)!);
        jsBinary = jsBinary.padding.withOperator(ctx.receiveNode(jsBinary.padding.operator, leftPaddedValueReceiver(ValueType.Enum))!);
        jsBinary = jsBinary.withRight(ctx.receiveNode(jsBinary.right, ctx.receiveTree)!);
        jsBinary = jsBinary.withType(ctx.receiveValue(jsBinary.type, ValueType.Object));
        return jsBinary;
    }

    public visitLiteralType(literalType: LiteralType, ctx: ReceiverContext): J {
        literalType = literalType.withId(ctx.receiveValue(literalType.id, ValueType.UUID)!);
        literalType = literalType.withPrefix(ctx.receiveNode(literalType.prefix, receiveSpace)!);
        literalType = literalType.withMarkers(ctx.receiveNode(literalType.markers, ctx.receiveMarkers)!);
        literalType = literalType.withLiteral(ctx.receiveNode(literalType.literal, ctx.receiveTree)!);
        literalType = literalType.withType(ctx.receiveValue(literalType.type, ValueType.Object)!);
        return literalType;
    }

    public visitMappedType(mappedType: MappedType, ctx: ReceiverContext): J {
        mappedType = mappedType.withId(ctx.receiveValue(mappedType.id, ValueType.UUID)!);
        mappedType = mappedType.withPrefix(ctx.receiveNode(mappedType.prefix, receiveSpace)!);
        mappedType = mappedType.withMarkers(ctx.receiveNode(mappedType.markers, ctx.receiveMarkers)!);
        mappedType = mappedType.padding.withPrefixToken(ctx.receiveNode(mappedType.padding.prefixToken, receiveLeftPaddedTree));
        mappedType = mappedType.padding.withHasReadonly(ctx.receiveNode(mappedType.padding.hasReadonly, leftPaddedValueReceiver(ValueType.Primitive))!);
        mappedType = mappedType.withKeysRemapping(ctx.receiveNode(mappedType.keysRemapping, ctx.receiveTree)!);
        mappedType = mappedType.padding.withSuffixToken(ctx.receiveNode(mappedType.padding.suffixToken, receiveLeftPaddedTree));
        mappedType = mappedType.padding.withHasQuestionToken(ctx.receiveNode(mappedType.padding.hasQuestionToken, leftPaddedValueReceiver(ValueType.Primitive))!);
        mappedType = mappedType.padding.withValueType(ctx.receiveNode(mappedType.padding.valueType, receiveContainer)!);
        mappedType = mappedType.withType(ctx.receiveValue(mappedType.type, ValueType.Object));
        return mappedType;
    }

    public visitMappedTypeKeysRemapping(keysRemapping: MappedType.KeysRemapping, ctx: ReceiverContext): J {
        keysRemapping = keysRemapping.withId(ctx.receiveValue(keysRemapping.id, ValueType.UUID)!);
        keysRemapping = keysRemapping.withPrefix(ctx.receiveNode(keysRemapping.prefix, receiveSpace)!);
        keysRemapping = keysRemapping.withMarkers(ctx.receiveNode(keysRemapping.markers, ctx.receiveMarkers)!);
        keysRemapping = keysRemapping.padding.withTypeParameter(ctx.receiveNode(keysRemapping.padding.typeParameter, receiveRightPaddedTree)!);
        keysRemapping = keysRemapping.padding.withNameType(ctx.receiveNode(keysRemapping.padding.nameType, receiveRightPaddedTree));
        return keysRemapping;
    }

    public visitMappedTypeMappedTypeParameter(mappedTypeParameter: MappedType.MappedTypeParameter, ctx: ReceiverContext): J {
        mappedTypeParameter = mappedTypeParameter.withId(ctx.receiveValue(mappedTypeParameter.id, ValueType.UUID)!);
        mappedTypeParameter = mappedTypeParameter.withPrefix(ctx.receiveNode(mappedTypeParameter.prefix, receiveSpace)!);
        mappedTypeParameter = mappedTypeParameter.withMarkers(ctx.receiveNode(mappedTypeParameter.markers, ctx.receiveMarkers)!);
        mappedTypeParameter = mappedTypeParameter.withName(ctx.receiveNode(mappedTypeParameter.name, ctx.receiveTree)!);
        mappedTypeParameter = mappedTypeParameter.padding.withIterateType(ctx.receiveNode(mappedTypeParameter.padding.iterateType, receiveLeftPaddedTree)!);
        return mappedTypeParameter;
    }

    public visitObjectBindingDeclarations(objectBindingDeclarations: ObjectBindingDeclarations, ctx: ReceiverContext): J {
        objectBindingDeclarations = objectBindingDeclarations.withId(ctx.receiveValue(objectBindingDeclarations.id, ValueType.UUID)!);
        objectBindingDeclarations = objectBindingDeclarations.withPrefix(ctx.receiveNode(objectBindingDeclarations.prefix, receiveSpace)!);
        objectBindingDeclarations = objectBindingDeclarations.withMarkers(ctx.receiveNode(objectBindingDeclarations.markers, ctx.receiveMarkers)!);
        objectBindingDeclarations = objectBindingDeclarations.withLeadingAnnotations(ctx.receiveNodes(objectBindingDeclarations.leadingAnnotations, ctx.receiveTree)!);
        objectBindingDeclarations = objectBindingDeclarations.withModifiers(ctx.receiveNodes(objectBindingDeclarations.modifiers, ctx.receiveTree)!);
        objectBindingDeclarations = objectBindingDeclarations.withTypeExpression(ctx.receiveNode(objectBindingDeclarations.typeExpression, ctx.receiveTree));
        objectBindingDeclarations = objectBindingDeclarations.padding.withBindings(ctx.receiveNode(objectBindingDeclarations.padding.bindings, receiveContainer)!);
        objectBindingDeclarations = objectBindingDeclarations.padding.withInitializer(ctx.receiveNode(objectBindingDeclarations.padding.initializer, receiveLeftPaddedTree));
        return objectBindingDeclarations;
    }

    public visitPropertyAssignment(propertyAssignment: PropertyAssignment, ctx: ReceiverContext): J {
        propertyAssignment = propertyAssignment.withId(ctx.receiveValue(propertyAssignment.id, ValueType.UUID)!);
        propertyAssignment = propertyAssignment.withPrefix(ctx.receiveNode(propertyAssignment.prefix, receiveSpace)!);
        propertyAssignment = propertyAssignment.withMarkers(ctx.receiveNode(propertyAssignment.markers, ctx.receiveMarkers)!);
        propertyAssignment = propertyAssignment.padding.withName(ctx.receiveNode(propertyAssignment.padding.name, receiveRightPaddedTree)!);
        propertyAssignment = propertyAssignment.withAssigmentToken(ctx.receiveValue(propertyAssignment.assigmentToken, ValueType.Enum)!);
        propertyAssignment = propertyAssignment.withInitializer(ctx.receiveNode(propertyAssignment.initializer, ctx.receiveTree));
        return propertyAssignment;
    }

    public visitSatisfiesExpression(satisfiesExpression: SatisfiesExpression, ctx: ReceiverContext): J {
        satisfiesExpression = satisfiesExpression.withId(ctx.receiveValue(satisfiesExpression.id, ValueType.UUID)!);
        satisfiesExpression = satisfiesExpression.withPrefix(ctx.receiveNode(satisfiesExpression.prefix, receiveSpace)!);
        satisfiesExpression = satisfiesExpression.withMarkers(ctx.receiveNode(satisfiesExpression.markers, ctx.receiveMarkers)!);
        satisfiesExpression = satisfiesExpression.withExpression(ctx.receiveNode(satisfiesExpression.expression, ctx.receiveTree)!);
        satisfiesExpression = satisfiesExpression.padding.withSatisfiesType(ctx.receiveNode(satisfiesExpression.padding.satisfiesType, receiveLeftPaddedTree)!);
        satisfiesExpression = satisfiesExpression.withType(ctx.receiveValue(satisfiesExpression.type, ValueType.Object));
        return satisfiesExpression;
    }

    public visitScopedVariableDeclarations(scopedVariableDeclarations: ScopedVariableDeclarations, ctx: ReceiverContext): J {
        scopedVariableDeclarations = scopedVariableDeclarations.withId(ctx.receiveValue(scopedVariableDeclarations.id, ValueType.UUID)!);
        scopedVariableDeclarations = scopedVariableDeclarations.withPrefix(ctx.receiveNode(scopedVariableDeclarations.prefix, receiveSpace)!);
        scopedVariableDeclarations = scopedVariableDeclarations.withMarkers(ctx.receiveNode(scopedVariableDeclarations.markers, ctx.receiveMarkers)!);
        scopedVariableDeclarations = scopedVariableDeclarations.withModifiers(ctx.receiveNodes(scopedVariableDeclarations.modifiers, ctx.receiveTree)!);
        scopedVariableDeclarations = scopedVariableDeclarations.padding.withScope(ctx.receiveNode(scopedVariableDeclarations.padding.scope, leftPaddedValueReceiver(ValueType.Enum)));
        scopedVariableDeclarations = scopedVariableDeclarations.padding.withVariables(ctx.receiveNodes(scopedVariableDeclarations.padding.variables, receiveRightPaddedTree)!);
        return scopedVariableDeclarations;
    }

    public visitStatementExpression(statementExpression: StatementExpression, ctx: ReceiverContext): J {
        statementExpression = statementExpression.withId(ctx.receiveValue(statementExpression.id, ValueType.UUID)!);
        statementExpression = statementExpression.withStatement(ctx.receiveNode(statementExpression.statement, ctx.receiveTree)!);
        return statementExpression;
    }

    public visitTaggedTemplateExpression(taggedTemplateExpression: TaggedTemplateExpression, ctx: ReceiverContext): J {
        taggedTemplateExpression = taggedTemplateExpression.withId(ctx.receiveValue(taggedTemplateExpression.id, ValueType.UUID)!);
        taggedTemplateExpression = taggedTemplateExpression.withPrefix(ctx.receiveNode(taggedTemplateExpression.prefix, receiveSpace)!);
        taggedTemplateExpression = taggedTemplateExpression.withMarkers(ctx.receiveNode(taggedTemplateExpression.markers, ctx.receiveMarkers)!);
        taggedTemplateExpression = taggedTemplateExpression.padding.withTag(ctx.receiveNode(taggedTemplateExpression.padding.tag, receiveRightPaddedTree));
        taggedTemplateExpression = taggedTemplateExpression.padding.withTypeArguments(ctx.receiveNode(taggedTemplateExpression.padding.typeArguments, receiveContainer));
        taggedTemplateExpression = taggedTemplateExpression.withTemplateExpression(ctx.receiveNode(taggedTemplateExpression.templateExpression, ctx.receiveTree)!);
        taggedTemplateExpression = taggedTemplateExpression.withType(ctx.receiveValue(taggedTemplateExpression.type, ValueType.Object));
        return taggedTemplateExpression;
    }

    public visitTemplateExpression(templateExpression: TemplateExpression, ctx: ReceiverContext): J {
        templateExpression = templateExpression.withId(ctx.receiveValue(templateExpression.id, ValueType.UUID)!);
        templateExpression = templateExpression.withPrefix(ctx.receiveNode(templateExpression.prefix, receiveSpace)!);
        templateExpression = templateExpression.withMarkers(ctx.receiveNode(templateExpression.markers, ctx.receiveMarkers)!);
        templateExpression = templateExpression.withHead(ctx.receiveNode(templateExpression.head, ctx.receiveTree)!);
        templateExpression = templateExpression.padding.withTemplateSpans(ctx.receiveNodes(templateExpression.padding.templateSpans, receiveRightPaddedTree)!);
        templateExpression = templateExpression.withType(ctx.receiveValue(templateExpression.type, ValueType.Object));
        return templateExpression;
    }

    public visitTemplateExpressionTemplateSpan(templateSpan: TemplateExpression.TemplateSpan, ctx: ReceiverContext): J {
        templateSpan = templateSpan.withId(ctx.receiveValue(templateSpan.id, ValueType.UUID)!);
        templateSpan = templateSpan.withPrefix(ctx.receiveNode(templateSpan.prefix, receiveSpace)!);
        templateSpan = templateSpan.withMarkers(ctx.receiveNode(templateSpan.markers, ctx.receiveMarkers)!);
        templateSpan = templateSpan.withExpression(ctx.receiveNode(templateSpan.expression, ctx.receiveTree)!);
        templateSpan = templateSpan.withTail(ctx.receiveNode(templateSpan.tail, ctx.receiveTree)!);
        return templateSpan;
    }

    public visitTuple(tuple: Tuple, ctx: ReceiverContext): J {
        tuple = tuple.withId(ctx.receiveValue(tuple.id, ValueType.UUID)!);
        tuple = tuple.withPrefix(ctx.receiveNode(tuple.prefix, receiveSpace)!);
        tuple = tuple.withMarkers(ctx.receiveNode(tuple.markers, ctx.receiveMarkers)!);
        tuple = tuple.padding.withElements(ctx.receiveNode(tuple.padding.elements, receiveContainer)!);
        tuple = tuple.withType(ctx.receiveValue(tuple.type, ValueType.Object));
        return tuple;
    }

    public visitTypeDeclaration(typeDeclaration: TypeDeclaration, ctx: ReceiverContext): J {
        typeDeclaration = typeDeclaration.withId(ctx.receiveValue(typeDeclaration.id, ValueType.UUID)!);
        typeDeclaration = typeDeclaration.withPrefix(ctx.receiveNode(typeDeclaration.prefix, receiveSpace)!);
        typeDeclaration = typeDeclaration.withMarkers(ctx.receiveNode(typeDeclaration.markers, ctx.receiveMarkers)!);
        typeDeclaration = typeDeclaration.withModifiers(ctx.receiveNodes(typeDeclaration.modifiers, ctx.receiveTree)!);
        typeDeclaration = typeDeclaration.padding.withName(ctx.receiveNode(typeDeclaration.padding.name, receiveLeftPaddedTree)!);
        typeDeclaration = typeDeclaration.withTypeParameters(ctx.receiveNode(typeDeclaration.typeParameters, ctx.receiveTree));
        typeDeclaration = typeDeclaration.padding.withInitializer(ctx.receiveNode(typeDeclaration.padding.initializer, receiveLeftPaddedTree)!);
        typeDeclaration = typeDeclaration.withType(ctx.receiveValue(typeDeclaration.type, ValueType.Object));
        return typeDeclaration;
    }

    public visitTypeOf(typeOf: TypeOf, ctx: ReceiverContext): J {
        typeOf = typeOf.withId(ctx.receiveValue(typeOf.id, ValueType.UUID)!);
        typeOf = typeOf.withPrefix(ctx.receiveNode(typeOf.prefix, receiveSpace)!);
        typeOf = typeOf.withMarkers(ctx.receiveNode(typeOf.markers, ctx.receiveMarkers)!);
        typeOf = typeOf.withExpression(ctx.receiveNode(typeOf.expression, ctx.receiveTree)!);
        typeOf = typeOf.withType(ctx.receiveValue(typeOf.type, ValueType.Object));
        return typeOf;
    }

    public visitTypeQuery(typeQuery: TypeQuery, ctx: ReceiverContext): J {
        typeQuery = typeQuery.withId(ctx.receiveValue(typeQuery.id, ValueType.UUID)!);
        typeQuery = typeQuery.withPrefix(ctx.receiveNode(typeQuery.prefix, receiveSpace)!);
        typeQuery = typeQuery.withMarkers(ctx.receiveNode(typeQuery.markers, ctx.receiveMarkers)!);
        typeQuery = typeQuery.withTypeExpression(ctx.receiveNode(typeQuery.typeExpression, ctx.receiveTree)!);
        typeQuery = typeQuery.padding.withTypeArguments(ctx.receiveNode(typeQuery.padding.typeArguments, receiveContainer));
        typeQuery = typeQuery.withType(ctx.receiveValue(typeQuery.type, ValueType.Object));
        return typeQuery;
    }

    public visitTypeOperator(typeOperator: TypeOperator, ctx: ReceiverContext): J {
        typeOperator = typeOperator.withId(ctx.receiveValue(typeOperator.id, ValueType.UUID)!);
        typeOperator = typeOperator.withPrefix(ctx.receiveNode(typeOperator.prefix, receiveSpace)!);
        typeOperator = typeOperator.withMarkers(ctx.receiveNode(typeOperator.markers, ctx.receiveMarkers)!);
        typeOperator = typeOperator.withOperator(ctx.receiveValue(typeOperator.operator, ValueType.Enum)!);
        typeOperator = typeOperator.padding.withExpression(ctx.receiveNode(typeOperator.padding.expression, receiveLeftPaddedTree)!);
        return typeOperator;
    }

    public visitTypePredicate(typePredicate: TypePredicate, ctx: ReceiverContext): J {
        typePredicate = typePredicate.withId(ctx.receiveValue(typePredicate.id, ValueType.UUID)!);
        typePredicate = typePredicate.withPrefix(ctx.receiveNode(typePredicate.prefix, receiveSpace)!);
        typePredicate = typePredicate.withMarkers(ctx.receiveNode(typePredicate.markers, ctx.receiveMarkers)!);
        typePredicate = typePredicate.padding.withAsserts(ctx.receiveNode(typePredicate.padding.asserts, leftPaddedValueReceiver(ValueType.Primitive))!);
        typePredicate = typePredicate.withParameterName(ctx.receiveNode(typePredicate.parameterName, ctx.receiveTree)!);
        typePredicate = typePredicate.padding.withExpression(ctx.receiveNode(typePredicate.padding.expression, receiveLeftPaddedTree));
        typePredicate = typePredicate.withType(ctx.receiveValue(typePredicate.type, ValueType.Object));
        return typePredicate;
    }

    public visitJsUnary(unary: Unary, ctx: ReceiverContext): J {
        unary = unary.withId(ctx.receiveValue(unary.id, ValueType.UUID)!);
        unary = unary.withPrefix(ctx.receiveNode(unary.prefix, receiveSpace)!);
        unary = unary.withMarkers(ctx.receiveNode(unary.markers, ctx.receiveMarkers)!);
        unary = unary.padding.withOperator(ctx.receiveNode(unary.padding.operator, leftPaddedValueReceiver(ValueType.Enum))!);
        unary = unary.withExpression(ctx.receiveNode(unary.expression, ctx.receiveTree)!);
        unary = unary.withType(ctx.receiveValue(unary.type, ValueType.Object));
        return unary;
    }

    public visitUnion(union: Union, ctx: ReceiverContext): J {
        union = union.withId(ctx.receiveValue(union.id, ValueType.UUID)!);
        union = union.withPrefix(ctx.receiveNode(union.prefix, receiveSpace)!);
        union = union.withMarkers(ctx.receiveNode(union.markers, ctx.receiveMarkers)!);
        union = union.padding.withTypes(ctx.receiveNodes(union.padding.types, receiveRightPaddedTree)!);
        union = union.withType(ctx.receiveValue(union.type, ValueType.Object));
        return union;
    }

    public visitIntersection(intersection: Intersection, ctx: ReceiverContext): J {
        intersection = intersection.withId(ctx.receiveValue(intersection.id, ValueType.UUID)!);
        intersection = intersection.withPrefix(ctx.receiveNode(intersection.prefix, receiveSpace)!);
        intersection = intersection.withMarkers(ctx.receiveNode(intersection.markers, ctx.receiveMarkers)!);
        intersection = intersection.padding.withTypes(ctx.receiveNodes(intersection.padding.types, receiveRightPaddedTree)!);
        intersection = intersection.withType(ctx.receiveValue(intersection.type, ValueType.Object));
        return intersection;
    }

    public visitVoid(_void: Void, ctx: ReceiverContext): J {
        _void = _void.withId(ctx.receiveValue(_void.id, ValueType.UUID)!);
        _void = _void.withPrefix(ctx.receiveNode(_void.prefix, receiveSpace)!);
        _void = _void.withMarkers(ctx.receiveNode(_void.markers, ctx.receiveMarkers)!);
        _void = _void.withExpression(ctx.receiveNode(_void.expression, ctx.receiveTree)!);
        return _void;
    }

    public visitJsYield(_yield: Yield, ctx: ReceiverContext): J {
        _yield = _yield.withId(ctx.receiveValue(_yield.id, ValueType.UUID)!);
        _yield = _yield.withPrefix(ctx.receiveNode(_yield.prefix, receiveSpace)!);
        _yield = _yield.withMarkers(ctx.receiveNode(_yield.markers, ctx.receiveMarkers)!);
        _yield = _yield.padding.withDelegated(ctx.receiveNode(_yield.padding.delegated, leftPaddedValueReceiver(ValueType.Primitive))!);
        _yield = _yield.withExpression(ctx.receiveNode(_yield.expression, ctx.receiveTree));
        _yield = _yield.withType(ctx.receiveValue(_yield.type, ValueType.Object));
        return _yield;
    }

    public visitTypeInfo(typeInfo: TypeInfo, ctx: ReceiverContext): J {
        typeInfo = typeInfo.withId(ctx.receiveValue(typeInfo.id, ValueType.UUID)!);
        typeInfo = typeInfo.withPrefix(ctx.receiveNode(typeInfo.prefix, receiveSpace)!);
        typeInfo = typeInfo.withMarkers(ctx.receiveNode(typeInfo.markers, ctx.receiveMarkers)!);
        typeInfo = typeInfo.withTypeIdentifier(ctx.receiveNode(typeInfo.typeIdentifier, ctx.receiveTree)!);
        return typeInfo;
    }

    public visitJSVariableDeclarations(jSVariableDeclarations: JSVariableDeclarations, ctx: ReceiverContext): J {
        jSVariableDeclarations = jSVariableDeclarations.withId(ctx.receiveValue(jSVariableDeclarations.id, ValueType.UUID)!);
        jSVariableDeclarations = jSVariableDeclarations.withPrefix(ctx.receiveNode(jSVariableDeclarations.prefix, receiveSpace)!);
        jSVariableDeclarations = jSVariableDeclarations.withMarkers(ctx.receiveNode(jSVariableDeclarations.markers, ctx.receiveMarkers)!);
        jSVariableDeclarations = jSVariableDeclarations.withLeadingAnnotations(ctx.receiveNodes(jSVariableDeclarations.leadingAnnotations, ctx.receiveTree)!);
        jSVariableDeclarations = jSVariableDeclarations.withModifiers(ctx.receiveNodes(jSVariableDeclarations.modifiers, ctx.receiveTree)!);
        jSVariableDeclarations = jSVariableDeclarations.withTypeExpression(ctx.receiveNode(jSVariableDeclarations.typeExpression, ctx.receiveTree));
        jSVariableDeclarations = jSVariableDeclarations.withVarargs(ctx.receiveNode(jSVariableDeclarations.varargs, receiveSpace));
        jSVariableDeclarations = jSVariableDeclarations.padding.withVariables(ctx.receiveNodes(jSVariableDeclarations.padding.variables, receiveRightPaddedTree)!);
        return jSVariableDeclarations;
    }

    public visitJSVariableDeclarationsJSNamedVariable(jSNamedVariable: JSVariableDeclarations.JSNamedVariable, ctx: ReceiverContext): J {
        jSNamedVariable = jSNamedVariable.withId(ctx.receiveValue(jSNamedVariable.id, ValueType.UUID)!);
        jSNamedVariable = jSNamedVariable.withPrefix(ctx.receiveNode(jSNamedVariable.prefix, receiveSpace)!);
        jSNamedVariable = jSNamedVariable.withMarkers(ctx.receiveNode(jSNamedVariable.markers, ctx.receiveMarkers)!);
        jSNamedVariable = jSNamedVariable.withName(ctx.receiveNode(jSNamedVariable.name, ctx.receiveTree)!);
        jSNamedVariable = jSNamedVariable.padding.withDimensionsAfterName(ctx.receiveNodes(jSNamedVariable.padding.dimensionsAfterName, leftPaddedNodeReceiver(Space))!);
        jSNamedVariable = jSNamedVariable.padding.withInitializer(ctx.receiveNode(jSNamedVariable.padding.initializer, receiveLeftPaddedTree));
        jSNamedVariable = jSNamedVariable.withVariableType(ctx.receiveValue(jSNamedVariable.variableType, ValueType.Object));
        return jSNamedVariable;
    }

    public visitJSMethodDeclaration(jSMethodDeclaration: JSMethodDeclaration, ctx: ReceiverContext): J {
        jSMethodDeclaration = jSMethodDeclaration.withId(ctx.receiveValue(jSMethodDeclaration.id, ValueType.UUID)!);
        jSMethodDeclaration = jSMethodDeclaration.withPrefix(ctx.receiveNode(jSMethodDeclaration.prefix, receiveSpace)!);
        jSMethodDeclaration = jSMethodDeclaration.withMarkers(ctx.receiveNode(jSMethodDeclaration.markers, ctx.receiveMarkers)!);
        jSMethodDeclaration = jSMethodDeclaration.withLeadingAnnotations(ctx.receiveNodes(jSMethodDeclaration.leadingAnnotations, ctx.receiveTree)!);
        jSMethodDeclaration = jSMethodDeclaration.withModifiers(ctx.receiveNodes(jSMethodDeclaration.modifiers, ctx.receiveTree)!);
        jSMethodDeclaration = jSMethodDeclaration.withTypeParameters(ctx.receiveNode(jSMethodDeclaration.typeParameters, ctx.receiveTree));
        jSMethodDeclaration = jSMethodDeclaration.withReturnTypeExpression(ctx.receiveNode(jSMethodDeclaration.returnTypeExpression, ctx.receiveTree));
        jSMethodDeclaration = jSMethodDeclaration.withName(ctx.receiveNode(jSMethodDeclaration.name, ctx.receiveTree)!);
        jSMethodDeclaration = jSMethodDeclaration.padding.withParameters(ctx.receiveNode(jSMethodDeclaration.padding.parameters, receiveContainer)!);
        jSMethodDeclaration = jSMethodDeclaration.padding.withThrowz(ctx.receiveNode(jSMethodDeclaration.padding.throwz, receiveContainer));
        jSMethodDeclaration = jSMethodDeclaration.withBody(ctx.receiveNode(jSMethodDeclaration.body, ctx.receiveTree));
        jSMethodDeclaration = jSMethodDeclaration.padding.withDefaultValue(ctx.receiveNode(jSMethodDeclaration.padding.defaultValue, receiveLeftPaddedTree));
        jSMethodDeclaration = jSMethodDeclaration.withMethodType(ctx.receiveValue(jSMethodDeclaration.methodType, ValueType.Object));
        return jSMethodDeclaration;
    }

    public visitJSForOfLoop(jSForOfLoop: JSForOfLoop, ctx: ReceiverContext): J {
        jSForOfLoop = jSForOfLoop.withId(ctx.receiveValue(jSForOfLoop.id, ValueType.UUID)!);
        jSForOfLoop = jSForOfLoop.withPrefix(ctx.receiveNode(jSForOfLoop.prefix, receiveSpace)!);
        jSForOfLoop = jSForOfLoop.withMarkers(ctx.receiveNode(jSForOfLoop.markers, ctx.receiveMarkers)!);
        jSForOfLoop = jSForOfLoop.padding.withAwait(ctx.receiveNode(jSForOfLoop.padding.await, leftPaddedValueReceiver(ValueType.Primitive))!);
        jSForOfLoop = jSForOfLoop.withControl(ctx.receiveNode(jSForOfLoop.control, ctx.receiveTree)!);
        jSForOfLoop = jSForOfLoop.padding.withBody(ctx.receiveNode(jSForOfLoop.padding.body, receiveRightPaddedTree)!);
        return jSForOfLoop;
    }

    public visitJSForInLoop(jSForInLoop: JSForInLoop, ctx: ReceiverContext): J {
        jSForInLoop = jSForInLoop.withId(ctx.receiveValue(jSForInLoop.id, ValueType.UUID)!);
        jSForInLoop = jSForInLoop.withPrefix(ctx.receiveNode(jSForInLoop.prefix, receiveSpace)!);
        jSForInLoop = jSForInLoop.withMarkers(ctx.receiveNode(jSForInLoop.markers, ctx.receiveMarkers)!);
        jSForInLoop = jSForInLoop.withControl(ctx.receiveNode(jSForInLoop.control, ctx.receiveTree)!);
        jSForInLoop = jSForInLoop.padding.withBody(ctx.receiveNode(jSForInLoop.padding.body, receiveRightPaddedTree)!);
        return jSForInLoop;
    }

    public visitJSForInOfLoopControl(jSForInOfLoopControl: JSForInOfLoopControl, ctx: ReceiverContext): J {
        jSForInOfLoopControl = jSForInOfLoopControl.withId(ctx.receiveValue(jSForInOfLoopControl.id, ValueType.UUID)!);
        jSForInOfLoopControl = jSForInOfLoopControl.withPrefix(ctx.receiveNode(jSForInOfLoopControl.prefix, receiveSpace)!);
        jSForInOfLoopControl = jSForInOfLoopControl.withMarkers(ctx.receiveNode(jSForInOfLoopControl.markers, ctx.receiveMarkers)!);
        jSForInOfLoopControl = jSForInOfLoopControl.padding.withVariable(ctx.receiveNode(jSForInOfLoopControl.padding.variable, receiveRightPaddedTree)!);
        jSForInOfLoopControl = jSForInOfLoopControl.padding.withIterable(ctx.receiveNode(jSForInOfLoopControl.padding.iterable, receiveRightPaddedTree)!);
        return jSForInOfLoopControl;
    }

    public visitNamespaceDeclaration(namespaceDeclaration: NamespaceDeclaration, ctx: ReceiverContext): J {
        namespaceDeclaration = namespaceDeclaration.withId(ctx.receiveValue(namespaceDeclaration.id, ValueType.UUID)!);
        namespaceDeclaration = namespaceDeclaration.withPrefix(ctx.receiveNode(namespaceDeclaration.prefix, receiveSpace)!);
        namespaceDeclaration = namespaceDeclaration.withMarkers(ctx.receiveNode(namespaceDeclaration.markers, ctx.receiveMarkers)!);
        namespaceDeclaration = namespaceDeclaration.withModifiers(ctx.receiveNodes(namespaceDeclaration.modifiers, ctx.receiveTree)!);
        namespaceDeclaration = namespaceDeclaration.padding.withKeywordType(ctx.receiveNode(namespaceDeclaration.padding.keywordType, leftPaddedValueReceiver(ValueType.Enum))!);
        namespaceDeclaration = namespaceDeclaration.padding.withName(ctx.receiveNode(namespaceDeclaration.padding.name, receiveRightPaddedTree)!);
        namespaceDeclaration = namespaceDeclaration.withBody(ctx.receiveNode(namespaceDeclaration.body, ctx.receiveTree));
        return namespaceDeclaration;
    }

    public visitFunctionDeclaration(functionDeclaration: FunctionDeclaration, ctx: ReceiverContext): J {
        functionDeclaration = functionDeclaration.withId(ctx.receiveValue(functionDeclaration.id, ValueType.UUID)!);
        functionDeclaration = functionDeclaration.withPrefix(ctx.receiveNode(functionDeclaration.prefix, receiveSpace)!);
        functionDeclaration = functionDeclaration.withMarkers(ctx.receiveNode(functionDeclaration.markers, ctx.receiveMarkers)!);
        functionDeclaration = functionDeclaration.withModifiers(ctx.receiveNodes(functionDeclaration.modifiers, ctx.receiveTree)!);
        functionDeclaration = functionDeclaration.padding.withAsteriskToken(ctx.receiveNode(functionDeclaration.padding.asteriskToken, leftPaddedValueReceiver(ValueType.Primitive))!);
        functionDeclaration = functionDeclaration.padding.withName(ctx.receiveNode(functionDeclaration.padding.name, receiveLeftPaddedTree)!);
        functionDeclaration = functionDeclaration.withTypeParameters(ctx.receiveNode(functionDeclaration.typeParameters, ctx.receiveTree));
        functionDeclaration = functionDeclaration.padding.withParameters(ctx.receiveNode(functionDeclaration.padding.parameters, receiveContainer)!);
        functionDeclaration = functionDeclaration.withReturnTypeExpression(ctx.receiveNode(functionDeclaration.returnTypeExpression, ctx.receiveTree));
        functionDeclaration = functionDeclaration.withBody(ctx.receiveNode(functionDeclaration.body, ctx.receiveTree));
        functionDeclaration = functionDeclaration.withType(ctx.receiveValue(functionDeclaration.type, ValueType.Object));
        return functionDeclaration;
    }

    public visitTypeLiteral(typeLiteral: TypeLiteral, ctx: ReceiverContext): J {
        typeLiteral = typeLiteral.withId(ctx.receiveValue(typeLiteral.id, ValueType.UUID)!);
        typeLiteral = typeLiteral.withPrefix(ctx.receiveNode(typeLiteral.prefix, receiveSpace)!);
        typeLiteral = typeLiteral.withMarkers(ctx.receiveNode(typeLiteral.markers, ctx.receiveMarkers)!);
        typeLiteral = typeLiteral.withMembers(ctx.receiveNode(typeLiteral.members, ctx.receiveTree)!);
        typeLiteral = typeLiteral.withType(ctx.receiveValue(typeLiteral.type, ValueType.Object));
        return typeLiteral;
    }

    public visitIndexSignatureDeclaration(indexSignatureDeclaration: IndexSignatureDeclaration, ctx: ReceiverContext): J {
        indexSignatureDeclaration = indexSignatureDeclaration.withId(ctx.receiveValue(indexSignatureDeclaration.id, ValueType.UUID)!);
        indexSignatureDeclaration = indexSignatureDeclaration.withPrefix(ctx.receiveNode(indexSignatureDeclaration.prefix, receiveSpace)!);
        indexSignatureDeclaration = indexSignatureDeclaration.withMarkers(ctx.receiveNode(indexSignatureDeclaration.markers, ctx.receiveMarkers)!);
        indexSignatureDeclaration = indexSignatureDeclaration.withModifiers(ctx.receiveNodes(indexSignatureDeclaration.modifiers, ctx.receiveTree)!);
        indexSignatureDeclaration = indexSignatureDeclaration.padding.withParameters(ctx.receiveNode(indexSignatureDeclaration.padding.parameters, receiveContainer)!);
        indexSignatureDeclaration = indexSignatureDeclaration.padding.withTypeExpression(ctx.receiveNode(indexSignatureDeclaration.padding.typeExpression, receiveLeftPaddedTree)!);
        indexSignatureDeclaration = indexSignatureDeclaration.withType(ctx.receiveValue(indexSignatureDeclaration.type, ValueType.Object));
        return indexSignatureDeclaration;
    }

    public visitArrayBindingPattern(arrayBindingPattern: ArrayBindingPattern, ctx: ReceiverContext): J {
        arrayBindingPattern = arrayBindingPattern.withId(ctx.receiveValue(arrayBindingPattern.id, ValueType.UUID)!);
        arrayBindingPattern = arrayBindingPattern.withPrefix(ctx.receiveNode(arrayBindingPattern.prefix, receiveSpace)!);
        arrayBindingPattern = arrayBindingPattern.withMarkers(ctx.receiveNode(arrayBindingPattern.markers, ctx.receiveMarkers)!);
        arrayBindingPattern = arrayBindingPattern.padding.withElements(ctx.receiveNode(arrayBindingPattern.padding.elements, receiveContainer)!);
        arrayBindingPattern = arrayBindingPattern.withType(ctx.receiveValue(arrayBindingPattern.type, ValueType.Object));
        return arrayBindingPattern;
    }

    public visitBindingElement(bindingElement: BindingElement, ctx: ReceiverContext): J {
        bindingElement = bindingElement.withId(ctx.receiveValue(bindingElement.id, ValueType.UUID)!);
        bindingElement = bindingElement.withPrefix(ctx.receiveNode(bindingElement.prefix, receiveSpace)!);
        bindingElement = bindingElement.withMarkers(ctx.receiveNode(bindingElement.markers, ctx.receiveMarkers)!);
        bindingElement = bindingElement.padding.withPropertyName(ctx.receiveNode(bindingElement.padding.propertyName, receiveRightPaddedTree));
        bindingElement = bindingElement.withName(ctx.receiveNode(bindingElement.name, ctx.receiveTree)!);
        bindingElement = bindingElement.padding.withInitializer(ctx.receiveNode(bindingElement.padding.initializer, receiveLeftPaddedTree));
        bindingElement = bindingElement.withVariableType(ctx.receiveValue(bindingElement.variableType, ValueType.Object));
        return bindingElement;
    }

    public visitExportDeclaration(exportDeclaration: ExportDeclaration, ctx: ReceiverContext): J {
        exportDeclaration = exportDeclaration.withId(ctx.receiveValue(exportDeclaration.id, ValueType.UUID)!);
        exportDeclaration = exportDeclaration.withPrefix(ctx.receiveNode(exportDeclaration.prefix, receiveSpace)!);
        exportDeclaration = exportDeclaration.withMarkers(ctx.receiveNode(exportDeclaration.markers, ctx.receiveMarkers)!);
        exportDeclaration = exportDeclaration.withModifiers(ctx.receiveNodes(exportDeclaration.modifiers, ctx.receiveTree)!);
        exportDeclaration = exportDeclaration.padding.withTypeOnly(ctx.receiveNode(exportDeclaration.padding.typeOnly, leftPaddedValueReceiver(ValueType.Primitive))!);
        exportDeclaration = exportDeclaration.withExportClause(ctx.receiveNode(exportDeclaration.exportClause, ctx.receiveTree));
        exportDeclaration = exportDeclaration.padding.withModuleSpecifier(ctx.receiveNode(exportDeclaration.padding.moduleSpecifier, receiveLeftPaddedTree));
        return exportDeclaration;
    }

    public visitExportAssignment(exportAssignment: ExportAssignment, ctx: ReceiverContext): J {
        exportAssignment = exportAssignment.withId(ctx.receiveValue(exportAssignment.id, ValueType.UUID)!);
        exportAssignment = exportAssignment.withPrefix(ctx.receiveNode(exportAssignment.prefix, receiveSpace)!);
        exportAssignment = exportAssignment.withMarkers(ctx.receiveNode(exportAssignment.markers, ctx.receiveMarkers)!);
        exportAssignment = exportAssignment.withModifiers(ctx.receiveNodes(exportAssignment.modifiers, ctx.receiveTree)!);
        exportAssignment = exportAssignment.padding.withExportEquals(ctx.receiveNode(exportAssignment.padding.exportEquals, leftPaddedValueReceiver(ValueType.Primitive))!);
        exportAssignment = exportAssignment.withExpression(ctx.receiveNode(exportAssignment.expression, ctx.receiveTree));
        return exportAssignment;
    }

    public visitNamedExports(namedExports: NamedExports, ctx: ReceiverContext): J {
        namedExports = namedExports.withId(ctx.receiveValue(namedExports.id, ValueType.UUID)!);
        namedExports = namedExports.withPrefix(ctx.receiveNode(namedExports.prefix, receiveSpace)!);
        namedExports = namedExports.withMarkers(ctx.receiveNode(namedExports.markers, ctx.receiveMarkers)!);
        namedExports = namedExports.padding.withElements(ctx.receiveNode(namedExports.padding.elements, receiveContainer)!);
        namedExports = namedExports.withType(ctx.receiveValue(namedExports.type, ValueType.Object));
        return namedExports;
    }

    public visitExportSpecifier(exportSpecifier: ExportSpecifier, ctx: ReceiverContext): J {
        exportSpecifier = exportSpecifier.withId(ctx.receiveValue(exportSpecifier.id, ValueType.UUID)!);
        exportSpecifier = exportSpecifier.withPrefix(ctx.receiveNode(exportSpecifier.prefix, receiveSpace)!);
        exportSpecifier = exportSpecifier.withMarkers(ctx.receiveNode(exportSpecifier.markers, ctx.receiveMarkers)!);
        exportSpecifier = exportSpecifier.padding.withTypeOnly(ctx.receiveNode(exportSpecifier.padding.typeOnly, leftPaddedValueReceiver(ValueType.Primitive))!);
        exportSpecifier = exportSpecifier.withSpecifier(ctx.receiveNode(exportSpecifier.specifier, ctx.receiveTree)!);
        exportSpecifier = exportSpecifier.withType(ctx.receiveValue(exportSpecifier.type, ValueType.Object));
        return exportSpecifier;
    }

    public visitIndexedAccessType(indexedAccessType: IndexedAccessType, ctx: ReceiverContext): J {
        indexedAccessType = indexedAccessType.withId(ctx.receiveValue(indexedAccessType.id, ValueType.UUID)!);
        indexedAccessType = indexedAccessType.withPrefix(ctx.receiveNode(indexedAccessType.prefix, receiveSpace)!);
        indexedAccessType = indexedAccessType.withMarkers(ctx.receiveNode(indexedAccessType.markers, ctx.receiveMarkers)!);
        indexedAccessType = indexedAccessType.withObjectType(ctx.receiveNode(indexedAccessType.objectType, ctx.receiveTree)!);
        indexedAccessType = indexedAccessType.withIndexType(ctx.receiveNode(indexedAccessType.indexType, ctx.receiveTree)!);
        indexedAccessType = indexedAccessType.withType(ctx.receiveValue(indexedAccessType.type, ValueType.Object));
        return indexedAccessType;
    }

    public visitIndexedAccessTypeIndexType(indexType: IndexedAccessType.IndexType, ctx: ReceiverContext): J {
        indexType = indexType.withId(ctx.receiveValue(indexType.id, ValueType.UUID)!);
        indexType = indexType.withPrefix(ctx.receiveNode(indexType.prefix, receiveSpace)!);
        indexType = indexType.withMarkers(ctx.receiveNode(indexType.markers, ctx.receiveMarkers)!);
        indexType = indexType.padding.withElement(ctx.receiveNode(indexType.padding.element, receiveRightPaddedTree)!);
        indexType = indexType.withType(ctx.receiveValue(indexType.type, ValueType.Object));
        return indexType;
    }

    public visitJsAssignmentOperation(jsAssignmentOperation: JsAssignmentOperation, ctx: ReceiverContext): J {
        jsAssignmentOperation = jsAssignmentOperation.withId(ctx.receiveValue(jsAssignmentOperation.id, ValueType.UUID)!);
        jsAssignmentOperation = jsAssignmentOperation.withPrefix(ctx.receiveNode(jsAssignmentOperation.prefix, receiveSpace)!);
        jsAssignmentOperation = jsAssignmentOperation.withMarkers(ctx.receiveNode(jsAssignmentOperation.markers, ctx.receiveMarkers)!);
        jsAssignmentOperation = jsAssignmentOperation.withVariable(ctx.receiveNode(jsAssignmentOperation.variable, ctx.receiveTree)!);
        jsAssignmentOperation = jsAssignmentOperation.padding.withOperator(ctx.receiveNode(jsAssignmentOperation.padding.operator, leftPaddedValueReceiver(ValueType.Enum))!);
        jsAssignmentOperation = jsAssignmentOperation.withAssignment(ctx.receiveNode(jsAssignmentOperation.assignment, ctx.receiveTree)!);
        jsAssignmentOperation = jsAssignmentOperation.withType(ctx.receiveValue(jsAssignmentOperation.type, ValueType.Object));
        return jsAssignmentOperation;
    }

    public visitTypeTreeExpression(typeTreeExpression: TypeTreeExpression, ctx: ReceiverContext): J {
        typeTreeExpression = typeTreeExpression.withId(ctx.receiveValue(typeTreeExpression.id, ValueType.UUID)!);
        typeTreeExpression = typeTreeExpression.withPrefix(ctx.receiveNode(typeTreeExpression.prefix, receiveSpace)!);
        typeTreeExpression = typeTreeExpression.withMarkers(ctx.receiveNode(typeTreeExpression.markers, ctx.receiveMarkers)!);
        typeTreeExpression = typeTreeExpression.withExpression(ctx.receiveNode(typeTreeExpression.expression, ctx.receiveTree)!);
        return typeTreeExpression;
    }

    public visitAnnotatedType(annotatedType: Java.AnnotatedType, ctx: ReceiverContext): J {
        annotatedType = annotatedType.withId(ctx.receiveValue(annotatedType.id, ValueType.UUID)!);
        annotatedType = annotatedType.withPrefix(ctx.receiveNode(annotatedType.prefix, receiveSpace)!);
        annotatedType = annotatedType.withMarkers(ctx.receiveNode(annotatedType.markers, ctx.receiveMarkers)!);
        annotatedType = annotatedType.withAnnotations(ctx.receiveNodes(annotatedType.annotations, ctx.receiveTree)!);
        annotatedType = annotatedType.withTypeExpression(ctx.receiveNode(annotatedType.typeExpression, ctx.receiveTree)!);
        return annotatedType;
    }

    public visitAnnotation(annotation: Java.Annotation, ctx: ReceiverContext): J {
        annotation = annotation.withId(ctx.receiveValue(annotation.id, ValueType.UUID)!);
        annotation = annotation.withPrefix(ctx.receiveNode(annotation.prefix, receiveSpace)!);
        annotation = annotation.withMarkers(ctx.receiveNode(annotation.markers, ctx.receiveMarkers)!);
        annotation = annotation.withAnnotationType(ctx.receiveNode(annotation.annotationType, ctx.receiveTree)!);
        annotation = annotation.padding.withArguments(ctx.receiveNode(annotation.padding.arguments, receiveContainer));
        return annotation;
    }

    public visitArrayAccess(arrayAccess: Java.ArrayAccess, ctx: ReceiverContext): J {
        arrayAccess = arrayAccess.withId(ctx.receiveValue(arrayAccess.id, ValueType.UUID)!);
        arrayAccess = arrayAccess.withPrefix(ctx.receiveNode(arrayAccess.prefix, receiveSpace)!);
        arrayAccess = arrayAccess.withMarkers(ctx.receiveNode(arrayAccess.markers, ctx.receiveMarkers)!);
        arrayAccess = arrayAccess.withIndexed(ctx.receiveNode(arrayAccess.indexed, ctx.receiveTree)!);
        arrayAccess = arrayAccess.withDimension(ctx.receiveNode(arrayAccess.dimension, ctx.receiveTree)!);
        arrayAccess = arrayAccess.withType(ctx.receiveValue(arrayAccess.type, ValueType.Object));
        return arrayAccess;
    }

    public visitArrayType(arrayType: Java.ArrayType, ctx: ReceiverContext): J {
        arrayType = arrayType.withId(ctx.receiveValue(arrayType.id, ValueType.UUID)!);
        arrayType = arrayType.withPrefix(ctx.receiveNode(arrayType.prefix, receiveSpace)!);
        arrayType = arrayType.withMarkers(ctx.receiveNode(arrayType.markers, ctx.receiveMarkers)!);
        arrayType = arrayType.withElementType(ctx.receiveNode(arrayType.elementType, ctx.receiveTree)!);
        arrayType = arrayType.withAnnotations(ctx.receiveNodes(arrayType.annotations, ctx.receiveTree));
        arrayType = arrayType.withDimension(ctx.receiveNode(arrayType.dimension, leftPaddedNodeReceiver(Space)));
        arrayType = arrayType.withType(ctx.receiveValue(arrayType.type, ValueType.Object)!);
        return arrayType;
    }

    public visitAssert(assert: Java.Assert, ctx: ReceiverContext): J {
        assert = assert.withId(ctx.receiveValue(assert.id, ValueType.UUID)!);
        assert = assert.withPrefix(ctx.receiveNode(assert.prefix, receiveSpace)!);
        assert = assert.withMarkers(ctx.receiveNode(assert.markers, ctx.receiveMarkers)!);
        assert = assert.withCondition(ctx.receiveNode(assert.condition, ctx.receiveTree)!);
        assert = assert.withDetail(ctx.receiveNode(assert.detail, receiveLeftPaddedTree));
        return assert;
    }

    public visitAssignment(assignment: Java.Assignment, ctx: ReceiverContext): J {
        assignment = assignment.withId(ctx.receiveValue(assignment.id, ValueType.UUID)!);
        assignment = assignment.withPrefix(ctx.receiveNode(assignment.prefix, receiveSpace)!);
        assignment = assignment.withMarkers(ctx.receiveNode(assignment.markers, ctx.receiveMarkers)!);
        assignment = assignment.withVariable(ctx.receiveNode(assignment.variable, ctx.receiveTree)!);
        assignment = assignment.padding.withAssignment(ctx.receiveNode(assignment.padding.assignment, receiveLeftPaddedTree)!);
        assignment = assignment.withType(ctx.receiveValue(assignment.type, ValueType.Object));
        return assignment;
    }

    public visitAssignmentOperation(assignmentOperation: Java.AssignmentOperation, ctx: ReceiverContext): J {
        assignmentOperation = assignmentOperation.withId(ctx.receiveValue(assignmentOperation.id, ValueType.UUID)!);
        assignmentOperation = assignmentOperation.withPrefix(ctx.receiveNode(assignmentOperation.prefix, receiveSpace)!);
        assignmentOperation = assignmentOperation.withMarkers(ctx.receiveNode(assignmentOperation.markers, ctx.receiveMarkers)!);
        assignmentOperation = assignmentOperation.withVariable(ctx.receiveNode(assignmentOperation.variable, ctx.receiveTree)!);
        assignmentOperation = assignmentOperation.padding.withOperator(ctx.receiveNode(assignmentOperation.padding.operator, leftPaddedValueReceiver(ValueType.Enum))!);
        assignmentOperation = assignmentOperation.withAssignment(ctx.receiveNode(assignmentOperation.assignment, ctx.receiveTree)!);
        assignmentOperation = assignmentOperation.withType(ctx.receiveValue(assignmentOperation.type, ValueType.Object));
        return assignmentOperation;
    }

    public visitBinary(binary: Java.Binary, ctx: ReceiverContext): J {
        binary = binary.withId(ctx.receiveValue(binary.id, ValueType.UUID)!);
        binary = binary.withPrefix(ctx.receiveNode(binary.prefix, receiveSpace)!);
        binary = binary.withMarkers(ctx.receiveNode(binary.markers, ctx.receiveMarkers)!);
        binary = binary.withLeft(ctx.receiveNode(binary.left, ctx.receiveTree)!);
        binary = binary.padding.withOperator(ctx.receiveNode(binary.padding.operator, leftPaddedValueReceiver(ValueType.Enum))!);
        binary = binary.withRight(ctx.receiveNode(binary.right, ctx.receiveTree)!);
        binary = binary.withType(ctx.receiveValue(binary.type, ValueType.Object));
        return binary;
    }

    public visitBlock(block: Java.Block, ctx: ReceiverContext): J {
        block = block.withId(ctx.receiveValue(block.id, ValueType.UUID)!);
        block = block.withPrefix(ctx.receiveNode(block.prefix, receiveSpace)!);
        block = block.withMarkers(ctx.receiveNode(block.markers, ctx.receiveMarkers)!);
        block = block.padding.withStatic(ctx.receiveNode(block.padding.static, rightPaddedValueReceiver(ValueType.Primitive))!);
        block = block.padding.withStatements(ctx.receiveNodes(block.padding.statements, receiveRightPaddedTree)!);
        block = block.withEnd(ctx.receiveNode(block.end, receiveSpace)!);
        return block;
    }

    public visitBreak(_break: Java.Break, ctx: ReceiverContext): J {
        _break = _break.withId(ctx.receiveValue(_break.id, ValueType.UUID)!);
        _break = _break.withPrefix(ctx.receiveNode(_break.prefix, receiveSpace)!);
        _break = _break.withMarkers(ctx.receiveNode(_break.markers, ctx.receiveMarkers)!);
        _break = _break.withLabel(ctx.receiveNode(_break.label, ctx.receiveTree));
        return _break;
    }

    public visitCase(_case: Java.Case, ctx: ReceiverContext): J {
        _case = _case.withId(ctx.receiveValue(_case.id, ValueType.UUID)!);
        _case = _case.withPrefix(ctx.receiveNode(_case.prefix, receiveSpace)!);
        _case = _case.withMarkers(ctx.receiveNode(_case.markers, ctx.receiveMarkers)!);
        _case = _case.withType(ctx.receiveValue(_case.type, ValueType.Enum)!);
        _case = _case.padding.withExpressions(ctx.receiveNode(_case.padding.expressions, receiveContainer)!);
        _case = _case.padding.withStatements(ctx.receiveNode(_case.padding.statements, receiveContainer)!);
        _case = _case.padding.withBody(ctx.receiveNode(_case.padding.body, receiveRightPaddedTree));
        return _case;
    }

    public visitClassDeclaration(classDeclaration: Java.ClassDeclaration, ctx: ReceiverContext): J {
        classDeclaration = classDeclaration.withId(ctx.receiveValue(classDeclaration.id, ValueType.UUID)!);
        classDeclaration = classDeclaration.withPrefix(ctx.receiveNode(classDeclaration.prefix, receiveSpace)!);
        classDeclaration = classDeclaration.withMarkers(ctx.receiveNode(classDeclaration.markers, ctx.receiveMarkers)!);
        classDeclaration = classDeclaration.withLeadingAnnotations(ctx.receiveNodes(classDeclaration.leadingAnnotations, ctx.receiveTree)!);
        classDeclaration = classDeclaration.withModifiers(ctx.receiveNodes(classDeclaration.modifiers, ctx.receiveTree)!);
        classDeclaration = classDeclaration.padding.withKind(ctx.receiveNode(classDeclaration.padding.kind, ctx.receiveTree)!);
        classDeclaration = classDeclaration.withName(ctx.receiveNode(classDeclaration.name, ctx.receiveTree)!);
        classDeclaration = classDeclaration.padding.withTypeParameters(ctx.receiveNode(classDeclaration.padding.typeParameters, receiveContainer));
        classDeclaration = classDeclaration.padding.withPrimaryConstructor(ctx.receiveNode(classDeclaration.padding.primaryConstructor, receiveContainer));
        classDeclaration = classDeclaration.padding.withExtends(ctx.receiveNode(classDeclaration.padding.extends, receiveLeftPaddedTree));
        classDeclaration = classDeclaration.padding.withImplements(ctx.receiveNode(classDeclaration.padding.implements, receiveContainer));
        classDeclaration = classDeclaration.padding.withPermits(ctx.receiveNode(classDeclaration.padding.permits, receiveContainer));
        classDeclaration = classDeclaration.withBody(ctx.receiveNode(classDeclaration.body, ctx.receiveTree)!);
        classDeclaration = classDeclaration.withType(ctx.receiveValue(classDeclaration.type, ValueType.Object));
        return classDeclaration;
    }

    public visitClassDeclarationKind(kind: Java.ClassDeclaration.Kind, ctx: ReceiverContext): J {
        kind = kind.withId(ctx.receiveValue(kind.id, ValueType.UUID)!);
        kind = kind.withPrefix(ctx.receiveNode(kind.prefix, receiveSpace)!);
        kind = kind.withMarkers(ctx.receiveNode(kind.markers, ctx.receiveMarkers)!);
        kind = kind.withAnnotations(ctx.receiveNodes(kind.annotations, ctx.receiveTree)!);
        kind = kind.withType(ctx.receiveValue(kind.type, ValueType.Enum)!);
        return kind;
    }

    public visitContinue(_continue: Java.Continue, ctx: ReceiverContext): J {
        _continue = _continue.withId(ctx.receiveValue(_continue.id, ValueType.UUID)!);
        _continue = _continue.withPrefix(ctx.receiveNode(_continue.prefix, receiveSpace)!);
        _continue = _continue.withMarkers(ctx.receiveNode(_continue.markers, ctx.receiveMarkers)!);
        _continue = _continue.withLabel(ctx.receiveNode(_continue.label, ctx.receiveTree));
        return _continue;
    }

    public visitDoWhileLoop(doWhileLoop: Java.DoWhileLoop, ctx: ReceiverContext): J {
        doWhileLoop = doWhileLoop.withId(ctx.receiveValue(doWhileLoop.id, ValueType.UUID)!);
        doWhileLoop = doWhileLoop.withPrefix(ctx.receiveNode(doWhileLoop.prefix, receiveSpace)!);
        doWhileLoop = doWhileLoop.withMarkers(ctx.receiveNode(doWhileLoop.markers, ctx.receiveMarkers)!);
        doWhileLoop = doWhileLoop.padding.withBody(ctx.receiveNode(doWhileLoop.padding.body, receiveRightPaddedTree)!);
        doWhileLoop = doWhileLoop.padding.withWhileCondition(ctx.receiveNode(doWhileLoop.padding.whileCondition, receiveLeftPaddedTree)!);
        return doWhileLoop;
    }

    public visitEmpty(empty: Java.Empty, ctx: ReceiverContext): J {
        empty = empty.withId(ctx.receiveValue(empty.id, ValueType.UUID)!);
        empty = empty.withPrefix(ctx.receiveNode(empty.prefix, receiveSpace)!);
        empty = empty.withMarkers(ctx.receiveNode(empty.markers, ctx.receiveMarkers)!);
        return empty;
    }

    public visitEnumValue(enumValue: Java.EnumValue, ctx: ReceiverContext): J {
        enumValue = enumValue.withId(ctx.receiveValue(enumValue.id, ValueType.UUID)!);
        enumValue = enumValue.withPrefix(ctx.receiveNode(enumValue.prefix, receiveSpace)!);
        enumValue = enumValue.withMarkers(ctx.receiveNode(enumValue.markers, ctx.receiveMarkers)!);
        enumValue = enumValue.withAnnotations(ctx.receiveNodes(enumValue.annotations, ctx.receiveTree)!);
        enumValue = enumValue.withName(ctx.receiveNode(enumValue.name, ctx.receiveTree)!);
        enumValue = enumValue.withInitializer(ctx.receiveNode(enumValue.initializer, ctx.receiveTree));
        return enumValue;
    }

    public visitEnumValueSet(enumValueSet: Java.EnumValueSet, ctx: ReceiverContext): J {
        enumValueSet = enumValueSet.withId(ctx.receiveValue(enumValueSet.id, ValueType.UUID)!);
        enumValueSet = enumValueSet.withPrefix(ctx.receiveNode(enumValueSet.prefix, receiveSpace)!);
        enumValueSet = enumValueSet.withMarkers(ctx.receiveNode(enumValueSet.markers, ctx.receiveMarkers)!);
        enumValueSet = enumValueSet.padding.withEnums(ctx.receiveNodes(enumValueSet.padding.enums, receiveRightPaddedTree)!);
        enumValueSet = enumValueSet.withTerminatedWithSemicolon(ctx.receiveValue(enumValueSet.terminatedWithSemicolon, ValueType.Primitive)!);
        return enumValueSet;
    }

    public visitFieldAccess(fieldAccess: Java.FieldAccess, ctx: ReceiverContext): J {
        fieldAccess = fieldAccess.withId(ctx.receiveValue(fieldAccess.id, ValueType.UUID)!);
        fieldAccess = fieldAccess.withPrefix(ctx.receiveNode(fieldAccess.prefix, receiveSpace)!);
        fieldAccess = fieldAccess.withMarkers(ctx.receiveNode(fieldAccess.markers, ctx.receiveMarkers)!);
        fieldAccess = fieldAccess.withTarget(ctx.receiveNode(fieldAccess.target, ctx.receiveTree)!);
        fieldAccess = fieldAccess.padding.withName(ctx.receiveNode(fieldAccess.padding.name, receiveLeftPaddedTree)!);
        fieldAccess = fieldAccess.withType(ctx.receiveValue(fieldAccess.type, ValueType.Object));
        return fieldAccess;
    }

    public visitForEachLoop(forEachLoop: Java.ForEachLoop, ctx: ReceiverContext): J {
        forEachLoop = forEachLoop.withId(ctx.receiveValue(forEachLoop.id, ValueType.UUID)!);
        forEachLoop = forEachLoop.withPrefix(ctx.receiveNode(forEachLoop.prefix, receiveSpace)!);
        forEachLoop = forEachLoop.withMarkers(ctx.receiveNode(forEachLoop.markers, ctx.receiveMarkers)!);
        forEachLoop = forEachLoop.withControl(ctx.receiveNode(forEachLoop.control, ctx.receiveTree)!);
        forEachLoop = forEachLoop.padding.withBody(ctx.receiveNode(forEachLoop.padding.body, receiveRightPaddedTree)!);
        return forEachLoop;
    }

    public visitForEachControl(control: Java.ForEachLoop.Control, ctx: ReceiverContext): J {
        control = control.withId(ctx.receiveValue(control.id, ValueType.UUID)!);
        control = control.withPrefix(ctx.receiveNode(control.prefix, receiveSpace)!);
        control = control.withMarkers(ctx.receiveNode(control.markers, ctx.receiveMarkers)!);
        control = control.padding.withVariable(ctx.receiveNode(control.padding.variable, receiveRightPaddedTree)!);
        control = control.padding.withIterable(ctx.receiveNode(control.padding.iterable, receiveRightPaddedTree)!);
        return control;
    }

    public visitForLoop(forLoop: Java.ForLoop, ctx: ReceiverContext): J {
        forLoop = forLoop.withId(ctx.receiveValue(forLoop.id, ValueType.UUID)!);
        forLoop = forLoop.withPrefix(ctx.receiveNode(forLoop.prefix, receiveSpace)!);
        forLoop = forLoop.withMarkers(ctx.receiveNode(forLoop.markers, ctx.receiveMarkers)!);
        forLoop = forLoop.withControl(ctx.receiveNode(forLoop.control, ctx.receiveTree)!);
        forLoop = forLoop.padding.withBody(ctx.receiveNode(forLoop.padding.body, receiveRightPaddedTree)!);
        return forLoop;
    }

    public visitForControl(control: Java.ForLoop.Control, ctx: ReceiverContext): J {
        control = control.withId(ctx.receiveValue(control.id, ValueType.UUID)!);
        control = control.withPrefix(ctx.receiveNode(control.prefix, receiveSpace)!);
        control = control.withMarkers(ctx.receiveNode(control.markers, ctx.receiveMarkers)!);
        control = control.padding.withInit(ctx.receiveNodes(control.padding.init, receiveRightPaddedTree)!);
        control = control.padding.withCondition(ctx.receiveNode(control.padding.condition, receiveRightPaddedTree)!);
        control = control.padding.withUpdate(ctx.receiveNodes(control.padding.update, receiveRightPaddedTree)!);
        return control;
    }

    public visitParenthesizedTypeTree(parenthesizedTypeTree: Java.ParenthesizedTypeTree, ctx: ReceiverContext): J {
        parenthesizedTypeTree = parenthesizedTypeTree.withId(ctx.receiveValue(parenthesizedTypeTree.id, ValueType.UUID)!);
        parenthesizedTypeTree = parenthesizedTypeTree.withPrefix(ctx.receiveNode(parenthesizedTypeTree.prefix, receiveSpace)!);
        parenthesizedTypeTree = parenthesizedTypeTree.withMarkers(ctx.receiveNode(parenthesizedTypeTree.markers, ctx.receiveMarkers)!);
        parenthesizedTypeTree = parenthesizedTypeTree.withAnnotations(ctx.receiveNodes(parenthesizedTypeTree.annotations, ctx.receiveTree)!);
        parenthesizedTypeTree = parenthesizedTypeTree.withParenthesizedType(ctx.receiveNode(parenthesizedTypeTree.parenthesizedType, ctx.receiveTree)!);
        return parenthesizedTypeTree;
    }

    public visitIdentifier(identifier: Java.Identifier, ctx: ReceiverContext): J {
        identifier = identifier.withId(ctx.receiveValue(identifier.id, ValueType.UUID)!);
        identifier = identifier.withPrefix(ctx.receiveNode(identifier.prefix, receiveSpace)!);
        identifier = identifier.withMarkers(ctx.receiveNode(identifier.markers, ctx.receiveMarkers)!);
        identifier = identifier.withAnnotations(ctx.receiveNodes(identifier.annotations, ctx.receiveTree)!);
        identifier = identifier.withSimpleName(ctx.receiveValue(identifier.simpleName, ValueType.Primitive)!);
        identifier = identifier.withType(ctx.receiveValue(identifier.type, ValueType.Object));
        identifier = identifier.withFieldType(ctx.receiveValue(identifier.fieldType, ValueType.Object));
        return identifier;
    }

    public visitIf(_if: Java.If, ctx: ReceiverContext): J {
        _if = _if.withId(ctx.receiveValue(_if.id, ValueType.UUID)!);
        _if = _if.withPrefix(ctx.receiveNode(_if.prefix, receiveSpace)!);
        _if = _if.withMarkers(ctx.receiveNode(_if.markers, ctx.receiveMarkers)!);
        _if = _if.withIfCondition(ctx.receiveNode(_if.ifCondition, ctx.receiveTree)!);
        _if = _if.padding.withThenPart(ctx.receiveNode(_if.padding.thenPart, receiveRightPaddedTree)!);
        _if = _if.withElsePart(ctx.receiveNode(_if.elsePart, ctx.receiveTree));
        return _if;
    }

    public visitElse(_else: Java.If.Else, ctx: ReceiverContext): J {
        _else = _else.withId(ctx.receiveValue(_else.id, ValueType.UUID)!);
        _else = _else.withPrefix(ctx.receiveNode(_else.prefix, receiveSpace)!);
        _else = _else.withMarkers(ctx.receiveNode(_else.markers, ctx.receiveMarkers)!);
        _else = _else.padding.withBody(ctx.receiveNode(_else.padding.body, receiveRightPaddedTree)!);
        return _else;
    }

    public visitImport(_import: Java.Import, ctx: ReceiverContext): J {
        _import = _import.withId(ctx.receiveValue(_import.id, ValueType.UUID)!);
        _import = _import.withPrefix(ctx.receiveNode(_import.prefix, receiveSpace)!);
        _import = _import.withMarkers(ctx.receiveNode(_import.markers, ctx.receiveMarkers)!);
        _import = _import.padding.withStatic(ctx.receiveNode(_import.padding.static, leftPaddedValueReceiver(ValueType.Primitive))!);
        _import = _import.withQualid(ctx.receiveNode(_import.qualid, ctx.receiveTree)!);
        _import = _import.padding.withAlias(ctx.receiveNode(_import.padding.alias, receiveLeftPaddedTree));
        return _import;
    }

    public visitInstanceOf(instanceOf: Java.InstanceOf, ctx: ReceiverContext): J {
        instanceOf = instanceOf.withId(ctx.receiveValue(instanceOf.id, ValueType.UUID)!);
        instanceOf = instanceOf.withPrefix(ctx.receiveNode(instanceOf.prefix, receiveSpace)!);
        instanceOf = instanceOf.withMarkers(ctx.receiveNode(instanceOf.markers, ctx.receiveMarkers)!);
        instanceOf = instanceOf.padding.withExpression(ctx.receiveNode(instanceOf.padding.expression, receiveRightPaddedTree)!);
        instanceOf = instanceOf.withClazz(ctx.receiveNode(instanceOf.clazz, ctx.receiveTree)!);
        instanceOf = instanceOf.withPattern(ctx.receiveNode(instanceOf.pattern, ctx.receiveTree));
        instanceOf = instanceOf.withType(ctx.receiveValue(instanceOf.type, ValueType.Object));
        return instanceOf;
    }

    public visitIntersectionType(intersectionType: Java.IntersectionType, ctx: ReceiverContext): J {
        intersectionType = intersectionType.withId(ctx.receiveValue(intersectionType.id, ValueType.UUID)!);
        intersectionType = intersectionType.withPrefix(ctx.receiveNode(intersectionType.prefix, receiveSpace)!);
        intersectionType = intersectionType.withMarkers(ctx.receiveNode(intersectionType.markers, ctx.receiveMarkers)!);
        intersectionType = intersectionType.padding.withBounds(ctx.receiveNode(intersectionType.padding.bounds, receiveContainer)!);
        return intersectionType;
    }

    public visitLabel(label: Java.Label, ctx: ReceiverContext): J {
        label = label.withId(ctx.receiveValue(label.id, ValueType.UUID)!);
        label = label.withPrefix(ctx.receiveNode(label.prefix, receiveSpace)!);
        label = label.withMarkers(ctx.receiveNode(label.markers, ctx.receiveMarkers)!);
        label = label.padding.withLabel(ctx.receiveNode(label.padding.label, receiveRightPaddedTree)!);
        label = label.withStatement(ctx.receiveNode(label.statement, ctx.receiveTree)!);
        return label;
    }

    public visitLambda(lambda: Java.Lambda, ctx: ReceiverContext): J {
        lambda = lambda.withId(ctx.receiveValue(lambda.id, ValueType.UUID)!);
        lambda = lambda.withPrefix(ctx.receiveNode(lambda.prefix, receiveSpace)!);
        lambda = lambda.withMarkers(ctx.receiveNode(lambda.markers, ctx.receiveMarkers)!);
        lambda = lambda.withParameters(ctx.receiveNode(lambda.parameters, ctx.receiveTree)!);
        lambda = lambda.withArrow(ctx.receiveNode(lambda.arrow, receiveSpace)!);
        lambda = lambda.withBody(ctx.receiveNode(lambda.body, ctx.receiveTree)!);
        lambda = lambda.withType(ctx.receiveValue(lambda.type, ValueType.Object));
        return lambda;
    }

    public visitLambdaParameters(parameters: Java.Lambda.Parameters, ctx: ReceiverContext): J {
        parameters = parameters.withId(ctx.receiveValue(parameters.id, ValueType.UUID)!);
        parameters = parameters.withPrefix(ctx.receiveNode(parameters.prefix, receiveSpace)!);
        parameters = parameters.withMarkers(ctx.receiveNode(parameters.markers, ctx.receiveMarkers)!);
        parameters = parameters.withParenthesized(ctx.receiveValue(parameters.parenthesized, ValueType.Primitive)!);
        parameters = parameters.padding.withParameters(ctx.receiveNodes(parameters.padding.parameters, receiveRightPaddedTree)!);
        return parameters;
    }

    public visitLiteral(literal: Java.Literal, ctx: ReceiverContext): J {
        literal = literal.withId(ctx.receiveValue(literal.id, ValueType.UUID)!);
        literal = literal.withPrefix(ctx.receiveNode(literal.prefix, receiveSpace)!);
        literal = literal.withMarkers(ctx.receiveNode(literal.markers, ctx.receiveMarkers)!);
        literal = literal.withValue(ctx.receiveValue(literal.value, ValueType.Object));
        literal = literal.withValueSource(ctx.receiveValue(literal.valueSource, ValueType.Primitive));
        literal = literal.withUnicodeEscapes(ctx.receiveValues(literal.unicodeEscapes, ValueType.Object));
        literal = literal.withType(ctx.receiveValue(literal.type, ValueType.Enum)!);
        return literal;
    }

    public visitMemberReference(memberReference: Java.MemberReference, ctx: ReceiverContext): J {
        memberReference = memberReference.withId(ctx.receiveValue(memberReference.id, ValueType.UUID)!);
        memberReference = memberReference.withPrefix(ctx.receiveNode(memberReference.prefix, receiveSpace)!);
        memberReference = memberReference.withMarkers(ctx.receiveNode(memberReference.markers, ctx.receiveMarkers)!);
        memberReference = memberReference.padding.withContaining(ctx.receiveNode(memberReference.padding.containing, receiveRightPaddedTree)!);
        memberReference = memberReference.padding.withTypeParameters(ctx.receiveNode(memberReference.padding.typeParameters, receiveContainer));
        memberReference = memberReference.padding.withReference(ctx.receiveNode(memberReference.padding.reference, receiveLeftPaddedTree)!);
        memberReference = memberReference.withType(ctx.receiveValue(memberReference.type, ValueType.Object));
        memberReference = memberReference.withMethodType(ctx.receiveValue(memberReference.methodType, ValueType.Object));
        memberReference = memberReference.withVariableType(ctx.receiveValue(memberReference.variableType, ValueType.Object));
        return memberReference;
    }

    public visitMethodDeclaration(methodDeclaration: Java.MethodDeclaration, ctx: ReceiverContext): J {
        methodDeclaration = methodDeclaration.withId(ctx.receiveValue(methodDeclaration.id, ValueType.UUID)!);
        methodDeclaration = methodDeclaration.withPrefix(ctx.receiveNode(methodDeclaration.prefix, receiveSpace)!);
        methodDeclaration = methodDeclaration.withMarkers(ctx.receiveNode(methodDeclaration.markers, ctx.receiveMarkers)!);
        methodDeclaration = methodDeclaration.withLeadingAnnotations(ctx.receiveNodes(methodDeclaration.leadingAnnotations, ctx.receiveTree)!);
        methodDeclaration = methodDeclaration.withModifiers(ctx.receiveNodes(methodDeclaration.modifiers, ctx.receiveTree)!);
        methodDeclaration = methodDeclaration.annotations.withTypeParameters(ctx.receiveNode(methodDeclaration.annotations.typeParameters, ctx.receiveTree));
        methodDeclaration = methodDeclaration.withReturnTypeExpression(ctx.receiveNode(methodDeclaration.returnTypeExpression, ctx.receiveTree));
        methodDeclaration = methodDeclaration.annotations.withName(ctx.receiveNode(methodDeclaration.annotations.name, receiveMethodIdentifierWithAnnotations)!);
        methodDeclaration = methodDeclaration.padding.withParameters(ctx.receiveNode(methodDeclaration.padding.parameters, receiveContainer)!);
        methodDeclaration = methodDeclaration.padding.withThrows(ctx.receiveNode(methodDeclaration.padding.throws, receiveContainer));
        methodDeclaration = methodDeclaration.withBody(ctx.receiveNode(methodDeclaration.body, ctx.receiveTree));
        methodDeclaration = methodDeclaration.padding.withDefaultValue(ctx.receiveNode(methodDeclaration.padding.defaultValue, receiveLeftPaddedTree));
        methodDeclaration = methodDeclaration.withMethodType(ctx.receiveValue(methodDeclaration.methodType, ValueType.Object));
        return methodDeclaration;
    }

    public visitMethodInvocation(methodInvocation: Java.MethodInvocation, ctx: ReceiverContext): J {
        methodInvocation = methodInvocation.withId(ctx.receiveValue(methodInvocation.id, ValueType.UUID)!);
        methodInvocation = methodInvocation.withPrefix(ctx.receiveNode(methodInvocation.prefix, receiveSpace)!);
        methodInvocation = methodInvocation.withMarkers(ctx.receiveNode(methodInvocation.markers, ctx.receiveMarkers)!);
        methodInvocation = methodInvocation.padding.withSelect(ctx.receiveNode(methodInvocation.padding.select, receiveRightPaddedTree));
        methodInvocation = methodInvocation.padding.withTypeParameters(ctx.receiveNode(methodInvocation.padding.typeParameters, receiveContainer));
        methodInvocation = methodInvocation.withName(ctx.receiveNode(methodInvocation.name, ctx.receiveTree)!);
        methodInvocation = methodInvocation.padding.withArguments(ctx.receiveNode(methodInvocation.padding.arguments, receiveContainer)!);
        methodInvocation = methodInvocation.withMethodType(ctx.receiveValue(methodInvocation.methodType, ValueType.Object));
        return methodInvocation;
    }

    public visitModifier(modifier: Java.Modifier, ctx: ReceiverContext): J {
        modifier = modifier.withId(ctx.receiveValue(modifier.id, ValueType.UUID)!);
        modifier = modifier.withPrefix(ctx.receiveNode(modifier.prefix, receiveSpace)!);
        modifier = modifier.withMarkers(ctx.receiveNode(modifier.markers, ctx.receiveMarkers)!);
        modifier = modifier.withKeyword(ctx.receiveValue(modifier.keyword, ValueType.Primitive));
        modifier = modifier.withType(ctx.receiveValue(modifier.type, ValueType.Enum)!);
        modifier = modifier.withAnnotations(ctx.receiveNodes(modifier.annotations, ctx.receiveTree)!);
        return modifier;
    }

    public visitMultiCatch(multiCatch: Java.MultiCatch, ctx: ReceiverContext): J {
        multiCatch = multiCatch.withId(ctx.receiveValue(multiCatch.id, ValueType.UUID)!);
        multiCatch = multiCatch.withPrefix(ctx.receiveNode(multiCatch.prefix, receiveSpace)!);
        multiCatch = multiCatch.withMarkers(ctx.receiveNode(multiCatch.markers, ctx.receiveMarkers)!);
        multiCatch = multiCatch.padding.withAlternatives(ctx.receiveNodes(multiCatch.padding.alternatives, receiveRightPaddedTree)!);
        return multiCatch;
    }

    public visitNewArray(newArray: Java.NewArray, ctx: ReceiverContext): J {
        newArray = newArray.withId(ctx.receiveValue(newArray.id, ValueType.UUID)!);
        newArray = newArray.withPrefix(ctx.receiveNode(newArray.prefix, receiveSpace)!);
        newArray = newArray.withMarkers(ctx.receiveNode(newArray.markers, ctx.receiveMarkers)!);
        newArray = newArray.withTypeExpression(ctx.receiveNode(newArray.typeExpression, ctx.receiveTree));
        newArray = newArray.withDimensions(ctx.receiveNodes(newArray.dimensions, ctx.receiveTree)!);
        newArray = newArray.padding.withInitializer(ctx.receiveNode(newArray.padding.initializer, receiveContainer));
        newArray = newArray.withType(ctx.receiveValue(newArray.type, ValueType.Object));
        return newArray;
    }

    public visitArrayDimension(arrayDimension: Java.ArrayDimension, ctx: ReceiverContext): J {
        arrayDimension = arrayDimension.withId(ctx.receiveValue(arrayDimension.id, ValueType.UUID)!);
        arrayDimension = arrayDimension.withPrefix(ctx.receiveNode(arrayDimension.prefix, receiveSpace)!);
        arrayDimension = arrayDimension.withMarkers(ctx.receiveNode(arrayDimension.markers, ctx.receiveMarkers)!);
        arrayDimension = arrayDimension.padding.withIndex(ctx.receiveNode(arrayDimension.padding.index, receiveRightPaddedTree)!);
        return arrayDimension;
    }

    public visitNewClass(newClass: Java.NewClass, ctx: ReceiverContext): J {
        newClass = newClass.withId(ctx.receiveValue(newClass.id, ValueType.UUID)!);
        newClass = newClass.withPrefix(ctx.receiveNode(newClass.prefix, receiveSpace)!);
        newClass = newClass.withMarkers(ctx.receiveNode(newClass.markers, ctx.receiveMarkers)!);
        newClass = newClass.padding.withEnclosing(ctx.receiveNode(newClass.padding.enclosing, receiveRightPaddedTree));
        newClass = newClass.withNew(ctx.receiveNode(newClass.new, receiveSpace)!);
        newClass = newClass.withClazz(ctx.receiveNode(newClass.clazz, ctx.receiveTree));
        newClass = newClass.padding.withArguments(ctx.receiveNode(newClass.padding.arguments, receiveContainer)!);
        newClass = newClass.withBody(ctx.receiveNode(newClass.body, ctx.receiveTree));
        newClass = newClass.withConstructorType(ctx.receiveValue(newClass.constructorType, ValueType.Object));
        return newClass;
    }

    public visitNullableType(nullableType: Java.NullableType, ctx: ReceiverContext): J {
        nullableType = nullableType.withId(ctx.receiveValue(nullableType.id, ValueType.UUID)!);
        nullableType = nullableType.withPrefix(ctx.receiveNode(nullableType.prefix, receiveSpace)!);
        nullableType = nullableType.withMarkers(ctx.receiveNode(nullableType.markers, ctx.receiveMarkers)!);
        nullableType = nullableType.withAnnotations(ctx.receiveNodes(nullableType.annotations, ctx.receiveTree)!);
        nullableType = nullableType.padding.withTypeTree(ctx.receiveNode(nullableType.padding.typeTree, receiveRightPaddedTree)!);
        return nullableType;
    }

    public visitPackage(_package: Java.Package, ctx: ReceiverContext): J {
        _package = _package.withId(ctx.receiveValue(_package.id, ValueType.UUID)!);
        _package = _package.withPrefix(ctx.receiveNode(_package.prefix, receiveSpace)!);
        _package = _package.withMarkers(ctx.receiveNode(_package.markers, ctx.receiveMarkers)!);
        _package = _package.withExpression(ctx.receiveNode(_package.expression, ctx.receiveTree)!);
        _package = _package.withAnnotations(ctx.receiveNodes(_package.annotations, ctx.receiveTree)!);
        return _package;
    }

    public visitParameterizedType(parameterizedType: Java.ParameterizedType, ctx: ReceiverContext): J {
        parameterizedType = parameterizedType.withId(ctx.receiveValue(parameterizedType.id, ValueType.UUID)!);
        parameterizedType = parameterizedType.withPrefix(ctx.receiveNode(parameterizedType.prefix, receiveSpace)!);
        parameterizedType = parameterizedType.withMarkers(ctx.receiveNode(parameterizedType.markers, ctx.receiveMarkers)!);
        parameterizedType = parameterizedType.withClazz(ctx.receiveNode(parameterizedType.clazz, ctx.receiveTree)!);
        parameterizedType = parameterizedType.padding.withTypeParameters(ctx.receiveNode(parameterizedType.padding.typeParameters, receiveContainer));
        parameterizedType = parameterizedType.withType(ctx.receiveValue(parameterizedType.type, ValueType.Object));
        return parameterizedType;
    }

    public visitParentheses<J2 extends J>(parentheses: Java.Parentheses<J2>, ctx: ReceiverContext): J {
        parentheses = parentheses.withId(ctx.receiveValue(parentheses.id, ValueType.UUID)!);
        parentheses = parentheses.withPrefix(ctx.receiveNode(parentheses.prefix, receiveSpace)!);
        parentheses = parentheses.withMarkers(ctx.receiveNode(parentheses.markers, ctx.receiveMarkers)!);
        parentheses = parentheses.padding.withTree(ctx.receiveNode(parentheses.padding.tree, receiveRightPaddedTree)!);
        return parentheses;
    }

    public visitControlParentheses<J2 extends J>(controlParentheses: Java.ControlParentheses<J2>, ctx: ReceiverContext): J {
        controlParentheses = controlParentheses.withId(ctx.receiveValue(controlParentheses.id, ValueType.UUID)!);
        controlParentheses = controlParentheses.withPrefix(ctx.receiveNode(controlParentheses.prefix, receiveSpace)!);
        controlParentheses = controlParentheses.withMarkers(ctx.receiveNode(controlParentheses.markers, ctx.receiveMarkers)!);
        controlParentheses = controlParentheses.padding.withTree(ctx.receiveNode(controlParentheses.padding.tree, receiveRightPaddedTree)!);
        return controlParentheses;
    }

    public visitPrimitive(primitive: Java.Primitive, ctx: ReceiverContext): J {
        primitive = primitive.withId(ctx.receiveValue(primitive.id, ValueType.UUID)!);
        primitive = primitive.withPrefix(ctx.receiveNode(primitive.prefix, receiveSpace)!);
        primitive = primitive.withMarkers(ctx.receiveNode(primitive.markers, ctx.receiveMarkers)!);
        primitive = primitive.withType(ctx.receiveValue(primitive.type, ValueType.Enum)!);
        return primitive;
    }

    public visitReturn(_return: Java.Return, ctx: ReceiverContext): J {
        _return = _return.withId(ctx.receiveValue(_return.id, ValueType.UUID)!);
        _return = _return.withPrefix(ctx.receiveNode(_return.prefix, receiveSpace)!);
        _return = _return.withMarkers(ctx.receiveNode(_return.markers, ctx.receiveMarkers)!);
        _return = _return.withExpression(ctx.receiveNode(_return.expression, ctx.receiveTree));
        return _return;
    }

    public visitSwitch(_switch: Java.Switch, ctx: ReceiverContext): J {
        _switch = _switch.withId(ctx.receiveValue(_switch.id, ValueType.UUID)!);
        _switch = _switch.withPrefix(ctx.receiveNode(_switch.prefix, receiveSpace)!);
        _switch = _switch.withMarkers(ctx.receiveNode(_switch.markers, ctx.receiveMarkers)!);
        _switch = _switch.withSelector(ctx.receiveNode(_switch.selector, ctx.receiveTree)!);
        _switch = _switch.withCases(ctx.receiveNode(_switch.cases, ctx.receiveTree)!);
        return _switch;
    }

    public visitSwitchExpression(switchExpression: Java.SwitchExpression, ctx: ReceiverContext): J {
        switchExpression = switchExpression.withId(ctx.receiveValue(switchExpression.id, ValueType.UUID)!);
        switchExpression = switchExpression.withPrefix(ctx.receiveNode(switchExpression.prefix, receiveSpace)!);
        switchExpression = switchExpression.withMarkers(ctx.receiveNode(switchExpression.markers, ctx.receiveMarkers)!);
        switchExpression = switchExpression.withSelector(ctx.receiveNode(switchExpression.selector, ctx.receiveTree)!);
        switchExpression = switchExpression.withCases(ctx.receiveNode(switchExpression.cases, ctx.receiveTree)!);
        return switchExpression;
    }

    public visitSynchronized(synchronized: Java.Synchronized, ctx: ReceiverContext): J {
        synchronized = synchronized.withId(ctx.receiveValue(synchronized.id, ValueType.UUID)!);
        synchronized = synchronized.withPrefix(ctx.receiveNode(synchronized.prefix, receiveSpace)!);
        synchronized = synchronized.withMarkers(ctx.receiveNode(synchronized.markers, ctx.receiveMarkers)!);
        synchronized = synchronized.withLock(ctx.receiveNode(synchronized.lock, ctx.receiveTree)!);
        synchronized = synchronized.withBody(ctx.receiveNode(synchronized.body, ctx.receiveTree)!);
        return synchronized;
    }

    public visitTernary(ternary: Java.Ternary, ctx: ReceiverContext): J {
        ternary = ternary.withId(ctx.receiveValue(ternary.id, ValueType.UUID)!);
        ternary = ternary.withPrefix(ctx.receiveNode(ternary.prefix, receiveSpace)!);
        ternary = ternary.withMarkers(ctx.receiveNode(ternary.markers, ctx.receiveMarkers)!);
        ternary = ternary.withCondition(ctx.receiveNode(ternary.condition, ctx.receiveTree)!);
        ternary = ternary.padding.withTruePart(ctx.receiveNode(ternary.padding.truePart, receiveLeftPaddedTree)!);
        ternary = ternary.padding.withFalsePart(ctx.receiveNode(ternary.padding.falsePart, receiveLeftPaddedTree)!);
        ternary = ternary.withType(ctx.receiveValue(ternary.type, ValueType.Object));
        return ternary;
    }

    public visitThrow(_throw: Java.Throw, ctx: ReceiverContext): J {
        _throw = _throw.withId(ctx.receiveValue(_throw.id, ValueType.UUID)!);
        _throw = _throw.withPrefix(ctx.receiveNode(_throw.prefix, receiveSpace)!);
        _throw = _throw.withMarkers(ctx.receiveNode(_throw.markers, ctx.receiveMarkers)!);
        _throw = _throw.withException(ctx.receiveNode(_throw.exception, ctx.receiveTree)!);
        return _throw;
    }

    public visitTry(_try: Java.Try, ctx: ReceiverContext): J {
        _try = _try.withId(ctx.receiveValue(_try.id, ValueType.UUID)!);
        _try = _try.withPrefix(ctx.receiveNode(_try.prefix, receiveSpace)!);
        _try = _try.withMarkers(ctx.receiveNode(_try.markers, ctx.receiveMarkers)!);
        _try = _try.padding.withResources(ctx.receiveNode(_try.padding.resources, receiveContainer));
        _try = _try.withBody(ctx.receiveNode(_try.body, ctx.receiveTree)!);
        _try = _try.withCatches(ctx.receiveNodes(_try.catches, ctx.receiveTree)!);
        _try = _try.padding.withFinally(ctx.receiveNode(_try.padding.finally, receiveLeftPaddedTree));
        return _try;
    }

    public visitTryResource(resource: Java.Try.Resource, ctx: ReceiverContext): J {
        resource = resource.withId(ctx.receiveValue(resource.id, ValueType.UUID)!);
        resource = resource.withPrefix(ctx.receiveNode(resource.prefix, receiveSpace)!);
        resource = resource.withMarkers(ctx.receiveNode(resource.markers, ctx.receiveMarkers)!);
        resource = resource.withVariableDeclarations(ctx.receiveNode(resource.variableDeclarations, ctx.receiveTree)!);
        resource = resource.withTerminatedWithSemicolon(ctx.receiveValue(resource.terminatedWithSemicolon, ValueType.Primitive)!);
        return resource;
    }

    public visitCatch(_catch: Java.Try.Catch, ctx: ReceiverContext): J {
        _catch = _catch.withId(ctx.receiveValue(_catch.id, ValueType.UUID)!);
        _catch = _catch.withPrefix(ctx.receiveNode(_catch.prefix, receiveSpace)!);
        _catch = _catch.withMarkers(ctx.receiveNode(_catch.markers, ctx.receiveMarkers)!);
        _catch = _catch.withParameter(ctx.receiveNode(_catch.parameter, ctx.receiveTree)!);
        _catch = _catch.withBody(ctx.receiveNode(_catch.body, ctx.receiveTree)!);
        return _catch;
    }

    public visitTypeCast(typeCast: Java.TypeCast, ctx: ReceiverContext): J {
        typeCast = typeCast.withId(ctx.receiveValue(typeCast.id, ValueType.UUID)!);
        typeCast = typeCast.withPrefix(ctx.receiveNode(typeCast.prefix, receiveSpace)!);
        typeCast = typeCast.withMarkers(ctx.receiveNode(typeCast.markers, ctx.receiveMarkers)!);
        typeCast = typeCast.withClazz(ctx.receiveNode(typeCast.clazz, ctx.receiveTree)!);
        typeCast = typeCast.withExpression(ctx.receiveNode(typeCast.expression, ctx.receiveTree)!);
        return typeCast;
    }

    public visitTypeParameter(typeParameter: Java.TypeParameter, ctx: ReceiverContext): J {
        typeParameter = typeParameter.withId(ctx.receiveValue(typeParameter.id, ValueType.UUID)!);
        typeParameter = typeParameter.withPrefix(ctx.receiveNode(typeParameter.prefix, receiveSpace)!);
        typeParameter = typeParameter.withMarkers(ctx.receiveNode(typeParameter.markers, ctx.receiveMarkers)!);
        typeParameter = typeParameter.withAnnotations(ctx.receiveNodes(typeParameter.annotations, ctx.receiveTree)!);
        typeParameter = typeParameter.withModifiers(ctx.receiveNodes(typeParameter.modifiers, ctx.receiveTree)!);
        typeParameter = typeParameter.withName(ctx.receiveNode(typeParameter.name, ctx.receiveTree)!);
        typeParameter = typeParameter.padding.withBounds(ctx.receiveNode(typeParameter.padding.bounds, receiveContainer));
        return typeParameter;
    }

    public visitTypeParameters(typeParameters: Java.TypeParameters, ctx: ReceiverContext): J {
        typeParameters = typeParameters.withId(ctx.receiveValue(typeParameters.id, ValueType.UUID)!);
        typeParameters = typeParameters.withPrefix(ctx.receiveNode(typeParameters.prefix, receiveSpace)!);
        typeParameters = typeParameters.withMarkers(ctx.receiveNode(typeParameters.markers, ctx.receiveMarkers)!);
        typeParameters = typeParameters.withAnnotations(ctx.receiveNodes(typeParameters.annotations, ctx.receiveTree)!);
        typeParameters = typeParameters.padding.withTypeParameters(ctx.receiveNodes(typeParameters.padding.typeParameters, receiveRightPaddedTree)!);
        return typeParameters;
    }

    public visitUnary(unary: Java.Unary, ctx: ReceiverContext): J {
        unary = unary.withId(ctx.receiveValue(unary.id, ValueType.UUID)!);
        unary = unary.withPrefix(ctx.receiveNode(unary.prefix, receiveSpace)!);
        unary = unary.withMarkers(ctx.receiveNode(unary.markers, ctx.receiveMarkers)!);
        unary = unary.padding.withOperator(ctx.receiveNode(unary.padding.operator, leftPaddedValueReceiver(ValueType.Enum))!);
        unary = unary.withExpression(ctx.receiveNode(unary.expression, ctx.receiveTree)!);
        unary = unary.withType(ctx.receiveValue(unary.type, ValueType.Object));
        return unary;
    }

    public visitVariableDeclarations(variableDeclarations: Java.VariableDeclarations, ctx: ReceiverContext): J {
        variableDeclarations = variableDeclarations.withId(ctx.receiveValue(variableDeclarations.id, ValueType.UUID)!);
        variableDeclarations = variableDeclarations.withPrefix(ctx.receiveNode(variableDeclarations.prefix, receiveSpace)!);
        variableDeclarations = variableDeclarations.withMarkers(ctx.receiveNode(variableDeclarations.markers, ctx.receiveMarkers)!);
        variableDeclarations = variableDeclarations.withLeadingAnnotations(ctx.receiveNodes(variableDeclarations.leadingAnnotations, ctx.receiveTree)!);
        variableDeclarations = variableDeclarations.withModifiers(ctx.receiveNodes(variableDeclarations.modifiers, ctx.receiveTree)!);
        variableDeclarations = variableDeclarations.withTypeExpression(ctx.receiveNode(variableDeclarations.typeExpression, ctx.receiveTree));
        variableDeclarations = variableDeclarations.withVarargs(ctx.receiveNode(variableDeclarations.varargs, receiveSpace));
        variableDeclarations = variableDeclarations.withDimensionsBeforeName(ctx.receiveNodes(variableDeclarations.dimensionsBeforeName, leftPaddedNodeReceiver(Space))!);
        variableDeclarations = variableDeclarations.padding.withVariables(ctx.receiveNodes(variableDeclarations.padding.variables, receiveRightPaddedTree)!);
        return variableDeclarations;
    }

    public visitVariable(namedVariable: Java.VariableDeclarations.NamedVariable, ctx: ReceiverContext): J {
        namedVariable = namedVariable.withId(ctx.receiveValue(namedVariable.id, ValueType.UUID)!);
        namedVariable = namedVariable.withPrefix(ctx.receiveNode(namedVariable.prefix, receiveSpace)!);
        namedVariable = namedVariable.withMarkers(ctx.receiveNode(namedVariable.markers, ctx.receiveMarkers)!);
        namedVariable = namedVariable.withName(ctx.receiveNode(namedVariable.name, ctx.receiveTree)!);
        namedVariable = namedVariable.withDimensionsAfterName(ctx.receiveNodes(namedVariable.dimensionsAfterName, leftPaddedNodeReceiver(Space))!);
        namedVariable = namedVariable.padding.withInitializer(ctx.receiveNode(namedVariable.padding.initializer, receiveLeftPaddedTree));
        namedVariable = namedVariable.withVariableType(ctx.receiveValue(namedVariable.variableType, ValueType.Object));
        return namedVariable;
    }

    public visitWhileLoop(whileLoop: Java.WhileLoop, ctx: ReceiverContext): J {
        whileLoop = whileLoop.withId(ctx.receiveValue(whileLoop.id, ValueType.UUID)!);
        whileLoop = whileLoop.withPrefix(ctx.receiveNode(whileLoop.prefix, receiveSpace)!);
        whileLoop = whileLoop.withMarkers(ctx.receiveNode(whileLoop.markers, ctx.receiveMarkers)!);
        whileLoop = whileLoop.withCondition(ctx.receiveNode(whileLoop.condition, ctx.receiveTree)!);
        whileLoop = whileLoop.padding.withBody(ctx.receiveNode(whileLoop.padding.body, receiveRightPaddedTree)!);
        return whileLoop;
    }

    public visitWildcard(wildcard: Java.Wildcard, ctx: ReceiverContext): J {
        wildcard = wildcard.withId(ctx.receiveValue(wildcard.id, ValueType.UUID)!);
        wildcard = wildcard.withPrefix(ctx.receiveNode(wildcard.prefix, receiveSpace)!);
        wildcard = wildcard.withMarkers(ctx.receiveNode(wildcard.markers, ctx.receiveMarkers)!);
        wildcard = wildcard.padding.withBound(ctx.receiveNode(wildcard.padding.bound, leftPaddedValueReceiver(ValueType.Enum)));
        wildcard = wildcard.withBoundedType(ctx.receiveNode(wildcard.boundedType, ctx.receiveTree));
        return wildcard;
    }

    public visitYield(_yield: Java.Yield, ctx: ReceiverContext): J {
        _yield = _yield.withId(ctx.receiveValue(_yield.id, ValueType.UUID)!);
        _yield = _yield.withPrefix(ctx.receiveNode(_yield.prefix, receiveSpace)!);
        _yield = _yield.withMarkers(ctx.receiveNode(_yield.markers, ctx.receiveMarkers)!);
        _yield = _yield.withImplicit(ctx.receiveValue(_yield.implicit, ValueType.Primitive)!);
        _yield = _yield.withValue(ctx.receiveNode(_yield.value, ctx.receiveTree)!);
        return _yield;
    }

    public visitUnknown(unknown: Java.Unknown, ctx: ReceiverContext): J {
        unknown = unknown.withId(ctx.receiveValue(unknown.id, ValueType.UUID)!);
        unknown = unknown.withPrefix(ctx.receiveNode(unknown.prefix, receiveSpace)!);
        unknown = unknown.withMarkers(ctx.receiveNode(unknown.markers, ctx.receiveMarkers)!);
        unknown = unknown.withSource(ctx.receiveNode(unknown.source, ctx.receiveTree)!);
        return unknown;
    }

    public visitUnknownSource(source: Java.Unknown.Source, ctx: ReceiverContext): J {
        source = source.withId(ctx.receiveValue(source.id, ValueType.UUID)!);
        source = source.withPrefix(ctx.receiveNode(source.prefix, receiveSpace)!);
        source = source.withMarkers(ctx.receiveNode(source.markers, ctx.receiveMarkers)!);
        source = source.withText(ctx.receiveValue(source.text, ValueType.Primitive)!);
        return source;
    }

    public visitErroneous(erroneous: Java.Erroneous, ctx: ReceiverContext): J {
        erroneous = erroneous.withId(ctx.receiveValue(erroneous.id, ValueType.UUID)!);
        erroneous = erroneous.withPrefix(ctx.receiveNode(erroneous.prefix, receiveSpace)!);
        erroneous = erroneous.withMarkers(ctx.receiveNode(erroneous.markers, ctx.receiveMarkers)!);
        erroneous = erroneous.withText(ctx.receiveValue(erroneous.text, ValueType.Primitive)!);
        return erroneous;
    }

}

class Factory implements ReceiverFactory {
    public create(type: string, ctx: ReceiverContext): Tree {
        if (type === "org.openrewrite.javascript.tree.JS$CompilationUnit") {
            return new CompilationUnit(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveValue(null, ValueType.Primitive),
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveNodes(null, receiveRightPaddedTree)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!,
                ctx.receiveNode(null, receiveSpace)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$Alias") {
            return new Alias(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Java.Identifier>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$ArrowFunction") {
            return new ArrowFunction(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.TypeParameters>(null, ctx.receiveTree),
                ctx.receiveNode<Java.Lambda.Parameters>(null, ctx.receiveTree)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNode<JLeftPadded<J>>(null, receiveLeftPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$Await") {
            return new Await(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$ConditionalType") {
            return new ConditionalType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<TypedTree>>(null, receiveContainer)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$DefaultType") {
            return new DefaultType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$Delete") {
            return new Delete(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$Export") {
            return new Export(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveNode(null, receiveSpace),
                ctx.receiveNode<Java.Literal>(null, ctx.receiveTree),
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$ExpressionStatement") {
            return new ExpressionStatement(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$ExpressionWithTypeArguments") {
            return new ExpressionWithTypeArguments(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<J>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$FunctionType") {
            return new FunctionType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<Java.TypeParameters>(null, ctx.receiveTree),
                ctx.receiveNode<JContainer<Statement>>(null, receiveContainer)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$InferType") {
            return new InferType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<J>>(null, receiveLeftPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$ImportType") {
            return new ImportType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<boolean>>(null, rightPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<Java.ParenthesizedTypeTree>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree),
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$JsImport") {
            return new JsImport(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Java.Identifier>>(null, receiveRightPaddedTree),
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveNode(null, receiveSpace),
                ctx.receiveNode<Java.Literal>(null, ctx.receiveTree),
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$JsImportSpecifier") {
            return new JsImportSpecifier(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$JsBinary") {
            return new JsBinary(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<JsBinary.Type>>(null, leftPaddedValueReceiver(ValueType.Enum))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$LiteralType") {
            return new LiteralType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$MappedType") {
            return new MappedType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<Java.Literal>>(null, receiveLeftPaddedTree),
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<MappedType.KeysRemapping>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Java.Literal>>(null, receiveLeftPaddedTree),
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<JContainer<TypeTree>>(null, receiveContainer)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$MappedType$KeysRemapping") {
            return new MappedType.KeysRemapping(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<MappedType.MappedTypeParameter>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$MappedType$MappedTypeParameter") {
            return new MappedType.MappedTypeParameter(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<TypeTree>>(null, receiveLeftPaddedTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$ObjectBindingDeclarations") {
            return new ObjectBindingDeclarations(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNode<JContainer<J>>(null, receiveContainer)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$PropertyAssignment") {
            return new PropertyAssignment(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)!,
                ctx.receiveValue(null, ValueType.Enum)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$SatisfiesExpression") {
            return new SatisfiesExpression(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<J>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$ScopedVariableDeclarations") {
            return new ScopedVariableDeclarations(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<ScopedVariableDeclarations.Scope>>(null, leftPaddedValueReceiver(ValueType.Enum)),
                ctx.receiveNodes(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$StatementExpression") {
            return new StatementExpression(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode<Statement>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$TaggedTemplateExpression") {
            return new TaggedTemplateExpression(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree),
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$TemplateExpression") {
            return new TemplateExpression(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.Literal>(null, ctx.receiveTree)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$TemplateExpression$TemplateSpan") {
            return new TemplateExpression.TemplateSpan(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<J>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.Literal>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$Tuple") {
            return new Tuple(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JContainer<J>>(null, receiveContainer)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$TypeDeclaration") {
            return new TypeDeclaration(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Java.Identifier>>(null, receiveLeftPaddedTree)!,
                ctx.receiveNode<Java.TypeParameters>(null, ctx.receiveTree),
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$TypeOf") {
            return new TypeOf(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$TypeQuery") {
            return new TypeQuery(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$TypeOperator") {
            return new TypeOperator(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Enum)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$TypePredicate") {
            return new TypePredicate(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<Java.Identifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$Unary") {
            return new Unary(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<Unary.Type>>(null, leftPaddedValueReceiver(ValueType.Enum))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$Union") {
            return new Union(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$Intersection") {
            return new Intersection(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$Void") {
            return new Void(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$Yield") {
            return new Yield(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$TypeInfo") {
            return new TypeInfo(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$JSVariableDeclarations") {
            return new JSVariableDeclarations(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNode(null, receiveSpace),
                ctx.receiveNodes(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$JSVariableDeclarations$JSNamedVariable") {
            return new JSVariableDeclarations.JSNamedVariable(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNodes(null, leftPaddedNodeReceiver(Space))!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$JSMethodDeclaration") {
            return new JSMethodDeclaration(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.TypeParameters>(null, ctx.receiveTree),
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<Statement>>(null, receiveContainer)!,
                ctx.receiveNode<JContainer<NameTree>>(null, receiveContainer),
                ctx.receiveNode<Java.Block>(null, ctx.receiveTree),
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$JSForOfLoop") {
            return new JSForOfLoop(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<JSForInOfLoopControl>(null, ctx.receiveTree)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$JSForInLoop") {
            return new JSForInLoop(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JSForInOfLoopControl>(null, ctx.receiveTree)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$JSForInOfLoopControl") {
            return new JSForInOfLoopControl(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<J>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$NamespaceDeclaration") {
            return new NamespaceDeclaration(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<NamespaceDeclaration.KeywordType>>(null, leftPaddedValueReceiver(ValueType.Enum))!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<Java.Block>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$FunctionDeclaration") {
            return new FunctionDeclaration(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<JLeftPadded<Java.Identifier>>(null, receiveLeftPaddedTree)!,
                ctx.receiveNode<Java.TypeParameters>(null, ctx.receiveTree),
                ctx.receiveNode<JContainer<Statement>>(null, receiveContainer)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNode<J>(null, ctx.receiveTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$TypeLiteral") {
            return new TypeLiteral(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.Block>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$IndexSignatureDeclaration") {
            return new IndexSignatureDeclaration(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<J>>(null, receiveContainer)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$ArrayBindingPattern") {
            return new ArrayBindingPattern(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$BindingElement") {
            return new BindingElement(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree),
                ctx.receiveNode<TypedTree>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$ExportDeclaration") {
            return new ExportDeclaration(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree),
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$ExportAssignment") {
            return new ExportAssignment(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$NamedExports") {
            return new NamedExports(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$ExportSpecifier") {
            return new ExportSpecifier(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$IndexedAccessType") {
            return new IndexedAccessType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$IndexedAccessType$IndexType") {
            return new IndexedAccessType.IndexType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<TypeTree>>(null, receiveRightPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$JsAssignmentOperation") {
            return new JsAssignmentOperation(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<JsAssignmentOperation.Type>>(null, leftPaddedValueReceiver(ValueType.Enum))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.javascript.tree.JS$TypeTreeExpression") {
            return new TypeTreeExpression(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$AnnotatedType") {
            return new Java.AnnotatedType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Annotation") {
            return new Java.Annotation(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<NameTree>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer)
            );
        }

        if (type === "org.openrewrite.java.tree.J$ArrayAccess") {
            return new Java.ArrayAccess(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.ArrayDimension>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$ArrayType") {
            return new Java.ArrayType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree),
                ctx.receiveNode<JLeftPadded<Space>>(null, leftPaddedNodeReceiver(Space)),
                ctx.receiveValue(null, ValueType.Object)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Assert") {
            return new Java.Assert(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Assignment") {
            return new Java.Assignment(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$AssignmentOperation") {
            return new Java.AssignmentOperation(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Java.AssignmentOperation.Type>>(null, leftPaddedValueReceiver(ValueType.Enum))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Binary") {
            return new Java.Binary(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Java.Binary.Type>>(null, leftPaddedValueReceiver(ValueType.Enum))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Block") {
            return new Java.Block(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<boolean>>(null, rightPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!,
                ctx.receiveNode(null, receiveSpace)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Break") {
            return new Java.Break(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.Identifier>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Case") {
            return new Java.Case(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Enum)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer)!,
                ctx.receiveNode<JContainer<Statement>>(null, receiveContainer)!,
                ctx.receiveNode<JRightPadded<J>>(null, receiveRightPaddedTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$ClassDeclaration") {
            return new Java.ClassDeclaration(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.ClassDeclaration.Kind>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.Identifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<Java.TypeParameter>>(null, receiveContainer),
                ctx.receiveNode<JContainer<Statement>>(null, receiveContainer),
                ctx.receiveNode<JLeftPadded<TypeTree>>(null, receiveLeftPaddedTree),
                ctx.receiveNode<JContainer<TypeTree>>(null, receiveContainer),
                ctx.receiveNode<JContainer<TypeTree>>(null, receiveContainer),
                ctx.receiveNode<Java.Block>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$ClassDeclaration$Kind") {
            return new Java.ClassDeclaration.Kind(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Enum)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Continue") {
            return new Java.Continue(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.Identifier>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$DoWhileLoop") {
            return new Java.DoWhileLoop(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<JLeftPadded<Java.ControlParentheses<Expression>>>(null, receiveLeftPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Empty") {
            return new Java.Empty(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$EnumValue") {
            return new Java.EnumValue(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.Identifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.NewClass>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$EnumValueSet") {
            return new Java.EnumValueSet(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!,
                ctx.receiveValue(null, ValueType.Primitive)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$FieldAccess") {
            return new Java.FieldAccess(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Java.Identifier>>(null, receiveLeftPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$ForEachLoop") {
            return new Java.ForEachLoop(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.ForEachLoop.Control>(null, ctx.receiveTree)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$ForEachLoop$Control") {
            return new Java.ForEachLoop.Control(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Java.VariableDeclarations>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$ForLoop") {
            return new Java.ForLoop(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.ForLoop.Control>(null, ctx.receiveTree)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$ForLoop$Control") {
            return new Java.ForLoop.Control(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$ParenthesizedTypeTree") {
            return new Java.ParenthesizedTypeTree(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.Parentheses<TypeTree>>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Identifier") {
            return new Java.Identifier(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$If") {
            return new Java.If(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.ControlParentheses<Expression>>(null, ctx.receiveTree)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<Java.If.Else>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$If$Else") {
            return new Java.If.Else(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Import") {
            return new Java.Import(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<Java.FieldAccess>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Java.Identifier>>(null, receiveLeftPaddedTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$InstanceOf") {
            return new Java.InstanceOf(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<J>(null, ctx.receiveTree)!,
                ctx.receiveNode<J>(null, ctx.receiveTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$IntersectionType") {
            return new Java.IntersectionType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JContainer<TypeTree>>(null, receiveContainer)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Label") {
            return new Java.Label(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Java.Identifier>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<Statement>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Lambda") {
            return new Java.Lambda(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.Lambda.Parameters>(null, ctx.receiveTree)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode<J>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Lambda$Parameters") {
            return new Java.Lambda.Parameters(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Literal") {
            return new Java.Literal(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveValue(null, ValueType.Primitive),
                ctx.receiveValues(null, ValueType.Object),
                ctx.receiveValue(null, ValueType.Enum)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$MemberReference") {
            return new Java.MemberReference(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveNode<JLeftPadded<Java.Identifier>>(null, receiveLeftPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$MethodDeclaration") {
            return new Java.MethodDeclaration(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.TypeParameters>(null, ctx.receiveTree),
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNode<Java.MethodDeclaration.IdentifierWithAnnotations>(null, receiveMethodIdentifierWithAnnotations)!,
                ctx.receiveNode<JContainer<Statement>>(null, receiveContainer)!,
                ctx.receiveNode<JContainer<NameTree>>(null, receiveContainer),
                ctx.receiveNode<Java.Block>(null, ctx.receiveTree),
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$MethodInvocation") {
            return new Java.MethodInvocation(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree),
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveNode<Java.Identifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Modifier") {
            return new Java.Modifier(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive),
                ctx.receiveValue(null, ValueType.Enum)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$MultiCatch") {
            return new Java.MultiCatch(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$NewArray") {
            return new Java.NewArray(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNodes<Java.ArrayDimension>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$ArrayDimension") {
            return new Java.ArrayDimension(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$NewClass") {
            return new Java.NewClass(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree),
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer)!,
                ctx.receiveNode<Java.Block>(null, ctx.receiveTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$NullableType") {
            return new Java.NullableType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNode<JRightPadded<TypeTree>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Package") {
            return new Java.Package(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$ParameterizedType") {
            return new Java.ParameterizedType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<NameTree>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Parentheses") {
            return new Java.Parentheses<J>(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<J>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$ControlParentheses") {
            return new Java.ControlParentheses<J>(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<J>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Primitive") {
            return new Java.Primitive(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Enum)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Return") {
            return new Java.Return(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Switch") {
            return new Java.Switch(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.ControlParentheses<Expression>>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.Block>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$SwitchExpression") {
            return new Java.SwitchExpression(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.ControlParentheses<Expression>>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.Block>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Synchronized") {
            return new Java.Synchronized(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.ControlParentheses<Expression>>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.Block>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Ternary") {
            return new Java.Ternary(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Throw") {
            return new Java.Throw(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Try") {
            return new Java.Try(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JContainer<Java.Try.Resource>>(null, receiveContainer),
                ctx.receiveNode<Java.Block>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Java.Try.Catch>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Java.Block>>(null, receiveLeftPaddedTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Try$Resource") {
            return new Java.Try.Resource(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<TypedTree>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Primitive)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Try$Catch") {
            return new Java.Try.Catch(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.ControlParentheses<Java.VariableDeclarations>>(null, ctx.receiveTree)!,
                ctx.receiveNode<Java.Block>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$TypeCast") {
            return new Java.TypeCast(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.ControlParentheses<TypeTree>>(null, ctx.receiveTree)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$TypeParameter") {
            return new Java.TypeParameter(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<TypeTree>>(null, receiveContainer)
            );
        }

        if (type === "org.openrewrite.java.tree.J$TypeParameters") {
            return new Java.TypeParameters(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Unary") {
            return new Java.Unary(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<Java.Unary.Type>>(null, leftPaddedValueReceiver(ValueType.Enum))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$VariableDeclarations") {
            return new Java.VariableDeclarations(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Java.Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Java.Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNode(null, receiveSpace),
                ctx.receiveNodes(null, leftPaddedNodeReceiver(Space))!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$VariableDeclarations$NamedVariable") {
            return new Java.VariableDeclarations.NamedVariable(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.Identifier>(null, ctx.receiveTree)!,
                ctx.receiveNodes(null, leftPaddedNodeReceiver(Space))!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$WhileLoop") {
            return new Java.WhileLoop(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.ControlParentheses<Expression>>(null, ctx.receiveTree)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Wildcard") {
            return new Java.Wildcard(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<Java.Wildcard.Bound>>(null, leftPaddedValueReceiver(ValueType.Enum)),
                ctx.receiveNode<NameTree>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Yield") {
            return new Java.Yield(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Unknown") {
            return new Java.Unknown(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Java.Unknown.Source>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Unknown$Source") {
            return new Java.Unknown.Source(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Erroneous") {
            return new Java.Erroneous(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive)!
            );
        }

        throw new Error("No factory method for type: " + type);
    }
}

function receiveMethodIdentifierWithAnnotations(before: Java.MethodDeclaration.IdentifierWithAnnotations | null, type: string | null, ctx: ReceiverContext): Java.MethodDeclaration.IdentifierWithAnnotations {
    if (before !== null) {
        before = before.withIdentifier(ctx.receiveNode(before.identifier, ctx.receiveTree)!);
        before = before.withAnnotations(ctx.receiveNodes(before.annotations, ctx.receiveTree)!);
    } else {
        before = new Java.MethodDeclaration.IdentifierWithAnnotations(
            ctx.receiveNode<Java.Identifier>(null, ctx.receiveTree)!,
            ctx.receiveNodes(null, ctx.receiveTree)!
        );
    }
    return before;
}

function receiveContainer<T>(container: JContainer<T> | null, type: string | null, ctx: ReceiverContext): JContainer<T> {
    return extensions.receiveContainer(container, type, ctx);
}

function leftPaddedValueReceiver<T>(type: any): DetailsReceiver<JLeftPadded<T>> {
    return extensions.leftPaddedValueReceiver(type);
}

function leftPaddedNodeReceiver<T>(type: any): DetailsReceiver<JLeftPadded<T>> {
    return extensions.leftPaddedNodeReceiver(type);
}

function receiveLeftPaddedTree<T extends Tree>(leftPadded: JLeftPadded<T> | null, type: string | null, ctx: ReceiverContext): JLeftPadded<T> {
    return extensions.receiveLeftPaddedTree(leftPadded, type, ctx);
}

function rightPaddedValueReceiver<T>(type: any): DetailsReceiver<JRightPadded<T>> {
    return extensions.rightPaddedValueReceiver(type);
}

function rightPaddedNodeReceiver<T>(type: any): DetailsReceiver<JRightPadded<T>> {
    return extensions.rightPaddedNodeReceiver(type);
}

function receiveRightPaddedTree<T extends Tree>(rightPadded: JRightPadded<T> | null, type: string | null, ctx: ReceiverContext): JRightPadded<T> {
    return extensions.receiveRightPaddedTree(rightPadded, type, ctx);
}

function receiveSpace(space: Space | null, type: string | null, ctx: ReceiverContext): Space {
    return extensions.receiveSpace(space, type, ctx);
}
