import * as extensions from "./extensions";
import {ListUtils, SourceFile, Tree, TreeVisitor} from "../core";
import {JS, isJavaScript, JsLeftPadded, JsRightPadded, JsContainer, JsSpace} from "./tree";
import {CompilationUnit, Alias, ArrowFunction, Await, ConditionalType, DefaultType, Delete, Export, ExpressionStatement, ExpressionWithTypeArguments, FunctionType, InferType, ImportType, JsImport, JsImportSpecifier, JsBinary, LiteralType, ObjectBindingDeclarations, PropertyAssignment, SatisfiesExpression, ScopedVariableDeclarations, StatementExpression, TaggedTemplateExpression, TemplateExpression, Tuple, TypeDeclaration, TypeOf, TypeQuery, TypeOperator, TypePredicate, Unary, Union, Intersection, Void, Yield, TypeInfo, JSVariableDeclarations, JSMethodDeclaration, JSForOfLoop, JSForInLoop, JSForInOfLoopControl, NamespaceDeclaration, FunctionDeclaration, TypeLiteral, IndexSignatureDeclaration, ArrayBindingPattern, BindingElement} from "./tree";
import {Expression, J, JContainer, JLeftPadded, JRightPadded, Space, Statement} from "../java/tree";
import {JavaVisitor} from "../java";
import * as Java from "../java/tree";

export class JavaScriptVisitor<P> extends JavaVisitor<P> {
    isAcceptable(sourceFile: SourceFile, p: P): boolean {
        return isJavaScript(sourceFile);
    }

    public visitJsCompilationUnit(compilationUnit: CompilationUnit, p: P): J | null {
        compilationUnit = compilationUnit.withPrefix(this.visitSpace(compilationUnit.prefix, Space.Location.COMPILATION_UNIT_PREFIX, p)!);
        compilationUnit = compilationUnit.withMarkers(this.visitMarkers(compilationUnit.markers, p));
        compilationUnit = compilationUnit.padding.withImports(ListUtils.map(compilationUnit.padding.imports, el => this.visitRightPadded(el, JRightPadded.Location.IMPORT, p)));
        compilationUnit = compilationUnit.padding.withStatements(ListUtils.map(compilationUnit.padding.statements, el => this.visitJsRightPadded(el, JsRightPadded.Location.COMPILATION_UNIT_STATEMENTS, p)));
        compilationUnit = compilationUnit.withEof(this.visitSpace(compilationUnit.eof, Space.Location.COMPILATION_UNIT_EOF, p)!);
        return compilationUnit;
    }

    public visitAlias(alias: Alias, p: P): J | null {
        alias = alias.withPrefix(this.visitJsSpace(alias.prefix, JsSpace.Location.ALIAS_PREFIX, p)!);
        let tempExpression = this.visitExpression(alias, p) as Expression;
        if (!(tempExpression instanceof Alias))
        {
            return tempExpression;
        }
        alias = tempExpression as Alias;
        alias = alias.withMarkers(this.visitMarkers(alias.markers, p));
        alias = alias.padding.withPropertyName(this.visitJsRightPadded(alias.padding.propertyName, JsRightPadded.Location.ALIAS_PROPERTY_NAME, p)!);
        alias = alias.withAlias(this.visitAndCast(alias.alias, p)!);
        return alias;
    }

    public visitArrowFunction(arrowFunction: ArrowFunction, p: P): J | null {
        arrowFunction = arrowFunction.withPrefix(this.visitJsSpace(arrowFunction.prefix, JsSpace.Location.ARROW_FUNCTION_PREFIX, p)!);
        let tempStatement = this.visitStatement(arrowFunction, p) as Statement;
        if (!(tempStatement instanceof ArrowFunction))
        {
            return tempStatement;
        }
        arrowFunction = tempStatement as ArrowFunction;
        let tempExpression = this.visitExpression(arrowFunction, p) as Expression;
        if (!(tempExpression instanceof ArrowFunction))
        {
            return tempExpression;
        }
        arrowFunction = tempExpression as ArrowFunction;
        arrowFunction = arrowFunction.withMarkers(this.visitMarkers(arrowFunction.markers, p));
        arrowFunction = arrowFunction.withLeadingAnnotations(ListUtils.map(arrowFunction.leadingAnnotations, el => this.visitAndCast(el, p)));
        arrowFunction = arrowFunction.withModifiers(ListUtils.map(arrowFunction.modifiers, el => this.visitAndCast(el, p)));
        arrowFunction = arrowFunction.withTypeParameters(this.visitAndCast(arrowFunction.typeParameters, p));
        arrowFunction = arrowFunction.withParameters(this.visitAndCast(arrowFunction.parameters, p)!);
        arrowFunction = arrowFunction.withReturnTypeExpression(this.visitAndCast(arrowFunction.returnTypeExpression, p));
        arrowFunction = arrowFunction.withArrow(this.visitJsSpace(arrowFunction.arrow, JsSpace.Location.ARROW_FUNCTION_ARROW, p)!);
        arrowFunction = arrowFunction.withBody(this.visitAndCast(arrowFunction.body, p)!);
        return arrowFunction;
    }

    public visitAwait(await: Await, p: P): J | null {
        await = await.withPrefix(this.visitJsSpace(await.prefix, JsSpace.Location.AWAIT_PREFIX, p)!);
        let tempExpression = this.visitExpression(await, p) as Expression;
        if (!(tempExpression instanceof Await))
        {
            return tempExpression;
        }
        await = tempExpression as Await;
        await = await.withMarkers(this.visitMarkers(await.markers, p));
        await = await.withExpression(this.visitAndCast(await.expression, p)!);
        return await;
    }

    public visitConditionalType(conditionalType: ConditionalType, p: P): J | null {
        conditionalType = conditionalType.withPrefix(this.visitJsSpace(conditionalType.prefix, JsSpace.Location.CONDITIONAL_TYPE_PREFIX, p)!);
        let tempExpression = this.visitExpression(conditionalType, p) as Expression;
        if (!(tempExpression instanceof ConditionalType))
        {
            return tempExpression;
        }
        conditionalType = tempExpression as ConditionalType;
        conditionalType = conditionalType.withMarkers(this.visitMarkers(conditionalType.markers, p));
        conditionalType = conditionalType.withCheckType(this.visitAndCast(conditionalType.checkType, p)!);
        conditionalType = conditionalType.padding.withCondition(this.visitJsContainer(conditionalType.padding.condition, JsContainer.Location.CONDITIONAL_TYPE_CONDITION, p)!);
        return conditionalType;
    }

    public visitDefaultType(defaultType: DefaultType, p: P): J | null {
        defaultType = defaultType.withPrefix(this.visitJsSpace(defaultType.prefix, JsSpace.Location.DEFAULT_TYPE_PREFIX, p)!);
        let tempExpression = this.visitExpression(defaultType, p) as Expression;
        if (!(tempExpression instanceof DefaultType))
        {
            return tempExpression;
        }
        defaultType = tempExpression as DefaultType;
        defaultType = defaultType.withMarkers(this.visitMarkers(defaultType.markers, p));
        defaultType = defaultType.withLeft(this.visitAndCast(defaultType.left, p)!);
        defaultType = defaultType.withBeforeEquals(this.visitJsSpace(defaultType.beforeEquals, JsSpace.Location.DEFAULT_TYPE_BEFORE_EQUALS, p)!);
        defaultType = defaultType.withRight(this.visitAndCast(defaultType.right, p)!);
        return defaultType;
    }

    public visitDelete(_delete: Delete, p: P): J | null {
        _delete = _delete.withPrefix(this.visitJsSpace(_delete.prefix, JsSpace.Location.DELETE_PREFIX, p)!);
        let tempStatement = this.visitStatement(_delete, p) as Statement;
        if (!(tempStatement instanceof Delete))
        {
            return tempStatement;
        }
        _delete = tempStatement as Delete;
        let tempExpression = this.visitExpression(_delete, p) as Expression;
        if (!(tempExpression instanceof Delete))
        {
            return tempExpression;
        }
        _delete = tempExpression as Delete;
        _delete = _delete.withMarkers(this.visitMarkers(_delete.markers, p));
        _delete = _delete.withExpression(this.visitAndCast(_delete.expression, p)!);
        return _delete;
    }

    public visitExport(_export: Export, p: P): J | null {
        _export = _export.withPrefix(this.visitJsSpace(_export.prefix, JsSpace.Location.EXPORT_PREFIX, p)!);
        let tempStatement = this.visitStatement(_export, p) as Statement;
        if (!(tempStatement instanceof Export))
        {
            return tempStatement;
        }
        _export = tempStatement as Export;
        _export = _export.withMarkers(this.visitMarkers(_export.markers, p));
        _export = _export.padding.withExports(this.visitJsContainer(_export.padding.exports, JsContainer.Location.EXPORT_EXPORTS, p));
        _export = _export.withFrom(this.visitJsSpace(_export.from, JsSpace.Location.EXPORT_FROM, p));
        _export = _export.withTarget(this.visitAndCast(_export.target, p));
        _export = _export.padding.withInitializer(this.visitJsLeftPadded(_export.padding.initializer, JsLeftPadded.Location.EXPORT_INITIALIZER, p));
        return _export;
    }

    public visitExpressionStatement(expressionStatement: ExpressionStatement, p: P): J | null {
        expressionStatement = expressionStatement.withExpression(this.visitAndCast(expressionStatement.expression, p)!);
        return expressionStatement;
    }

    public visitExpressionWithTypeArguments(expressionWithTypeArguments: ExpressionWithTypeArguments, p: P): J | null {
        expressionWithTypeArguments = expressionWithTypeArguments.withPrefix(this.visitJsSpace(expressionWithTypeArguments.prefix, JsSpace.Location.EXPRESSION_WITH_TYPE_ARGUMENTS_PREFIX, p)!);
        let tempExpression = this.visitExpression(expressionWithTypeArguments, p) as Expression;
        if (!(tempExpression instanceof ExpressionWithTypeArguments))
        {
            return tempExpression;
        }
        expressionWithTypeArguments = tempExpression as ExpressionWithTypeArguments;
        expressionWithTypeArguments = expressionWithTypeArguments.withMarkers(this.visitMarkers(expressionWithTypeArguments.markers, p));
        expressionWithTypeArguments = expressionWithTypeArguments.withClazz(this.visitAndCast(expressionWithTypeArguments.clazz, p)!);
        expressionWithTypeArguments = expressionWithTypeArguments.padding.withTypeArguments(this.visitJsContainer(expressionWithTypeArguments.padding.typeArguments, JsContainer.Location.EXPRESSION_WITH_TYPE_ARGUMENTS_TYPE_ARGUMENTS, p));
        return expressionWithTypeArguments;
    }

    public visitFunctionType(functionType: FunctionType, p: P): J | null {
        functionType = functionType.withPrefix(this.visitJsSpace(functionType.prefix, JsSpace.Location.FUNCTION_TYPE_PREFIX, p)!);
        let tempExpression = this.visitExpression(functionType, p) as Expression;
        if (!(tempExpression instanceof FunctionType))
        {
            return tempExpression;
        }
        functionType = tempExpression as FunctionType;
        functionType = functionType.withMarkers(this.visitMarkers(functionType.markers, p));
        functionType = functionType.padding.withConstructorType(this.visitJsRightPadded(functionType.padding.constructorType, JsRightPadded.Location.FUNCTION_TYPE_CONSTRUCTOR_TYPE, p)!);
        functionType = functionType.padding.withParameters(this.visitJsContainer(functionType.padding.parameters, JsContainer.Location.FUNCTION_TYPE_PARAMETERS, p)!);
        functionType = functionType.withArrow(this.visitJsSpace(functionType.arrow, JsSpace.Location.FUNCTION_TYPE_ARROW, p)!);
        functionType = functionType.withReturnType(this.visitAndCast(functionType.returnType, p)!);
        return functionType;
    }

    public visitInferType(inferType: InferType, p: P): J | null {
        inferType = inferType.withPrefix(this.visitJsSpace(inferType.prefix, JsSpace.Location.INFER_TYPE_PREFIX, p)!);
        let tempExpression = this.visitExpression(inferType, p) as Expression;
        if (!(tempExpression instanceof InferType))
        {
            return tempExpression;
        }
        inferType = tempExpression as InferType;
        inferType = inferType.withMarkers(this.visitMarkers(inferType.markers, p));
        inferType = inferType.padding.withTypeParameter(this.visitJsLeftPadded(inferType.padding.typeParameter, JsLeftPadded.Location.INFER_TYPE_TYPE_PARAMETER, p)!);
        return inferType;
    }

    public visitImportType(importType: ImportType, p: P): J | null {
        importType = importType.withPrefix(this.visitJsSpace(importType.prefix, JsSpace.Location.IMPORT_TYPE_PREFIX, p)!);
        let tempExpression = this.visitExpression(importType, p) as Expression;
        if (!(tempExpression instanceof ImportType))
        {
            return tempExpression;
        }
        importType = tempExpression as ImportType;
        importType = importType.withMarkers(this.visitMarkers(importType.markers, p));
        importType = importType.padding.withHasTypeof(this.visitJsRightPadded(importType.padding.hasTypeof, JsRightPadded.Location.IMPORT_TYPE_HAS_TYPEOF, p)!);
        importType = importType.withImportArgument(this.visitAndCast(importType.importArgument, p)!);
        importType = importType.padding.withQualifier(this.visitJsLeftPadded(importType.padding.qualifier, JsLeftPadded.Location.IMPORT_TYPE_QUALIFIER, p));
        importType = importType.padding.withTypeArguments(this.visitJsContainer(importType.padding.typeArguments, JsContainer.Location.IMPORT_TYPE_TYPE_ARGUMENTS, p));
        return importType;
    }

    public visitJsImport(jsImport: JsImport, p: P): J | null {
        jsImport = jsImport.withPrefix(this.visitJsSpace(jsImport.prefix, JsSpace.Location.JS_IMPORT_PREFIX, p)!);
        let tempStatement = this.visitStatement(jsImport, p) as Statement;
        if (!(tempStatement instanceof JsImport))
        {
            return tempStatement;
        }
        jsImport = tempStatement as JsImport;
        jsImport = jsImport.withMarkers(this.visitMarkers(jsImport.markers, p));
        jsImport = jsImport.padding.withName(this.visitJsRightPadded(jsImport.padding.name, JsRightPadded.Location.JS_IMPORT_NAME, p));
        jsImport = jsImport.padding.withImportType(this.visitJsLeftPadded(jsImport.padding.importType, JsLeftPadded.Location.JS_IMPORT_IMPORT_TYPE, p)!);
        jsImport = jsImport.padding.withImports(this.visitJsContainer(jsImport.padding.imports, JsContainer.Location.JS_IMPORT_IMPORTS, p));
        jsImport = jsImport.withFrom(this.visitJsSpace(jsImport.from, JsSpace.Location.JS_IMPORT_FROM, p));
        jsImport = jsImport.withTarget(this.visitAndCast(jsImport.target, p));
        jsImport = jsImport.padding.withInitializer(this.visitJsLeftPadded(jsImport.padding.initializer, JsLeftPadded.Location.JS_IMPORT_INITIALIZER, p));
        return jsImport;
    }

    public visitJsImportSpecifier(jsImportSpecifier: JsImportSpecifier, p: P): J | null {
        jsImportSpecifier = jsImportSpecifier.withPrefix(this.visitJsSpace(jsImportSpecifier.prefix, JsSpace.Location.JS_IMPORT_SPECIFIER_PREFIX, p)!);
        let tempExpression = this.visitExpression(jsImportSpecifier, p) as Expression;
        if (!(tempExpression instanceof JsImportSpecifier))
        {
            return tempExpression;
        }
        jsImportSpecifier = tempExpression as JsImportSpecifier;
        jsImportSpecifier = jsImportSpecifier.withMarkers(this.visitMarkers(jsImportSpecifier.markers, p));
        jsImportSpecifier = jsImportSpecifier.padding.withImportType(this.visitJsLeftPadded(jsImportSpecifier.padding.importType, JsLeftPadded.Location.JS_IMPORT_SPECIFIER_IMPORT_TYPE, p)!);
        jsImportSpecifier = jsImportSpecifier.withSpecifier(this.visitAndCast(jsImportSpecifier.specifier, p)!);
        return jsImportSpecifier;
    }

    public visitJsBinary(jsBinary: JsBinary, p: P): J | null {
        jsBinary = jsBinary.withPrefix(this.visitJsSpace(jsBinary.prefix, JsSpace.Location.JS_BINARY_PREFIX, p)!);
        let tempExpression = this.visitExpression(jsBinary, p) as Expression;
        if (!(tempExpression instanceof JsBinary))
        {
            return tempExpression;
        }
        jsBinary = tempExpression as JsBinary;
        jsBinary = jsBinary.withMarkers(this.visitMarkers(jsBinary.markers, p));
        jsBinary = jsBinary.withLeft(this.visitAndCast(jsBinary.left, p)!);
        jsBinary = jsBinary.padding.withOperator(this.visitJsLeftPadded(jsBinary.padding.operator, JsLeftPadded.Location.JS_BINARY_OPERATOR, p)!);
        jsBinary = jsBinary.withRight(this.visitAndCast(jsBinary.right, p)!);
        return jsBinary;
    }

    public visitLiteralType(literalType: LiteralType, p: P): J | null {
        literalType = literalType.withPrefix(this.visitJsSpace(literalType.prefix, JsSpace.Location.LITERAL_TYPE_PREFIX, p)!);
        let tempExpression = this.visitExpression(literalType, p) as Expression;
        if (!(tempExpression instanceof LiteralType))
        {
            return tempExpression;
        }
        literalType = tempExpression as LiteralType;
        literalType = literalType.withMarkers(this.visitMarkers(literalType.markers, p));
        literalType = literalType.withLiteral(this.visitAndCast(literalType.literal, p)!);
        return literalType;
    }

    public visitObjectBindingDeclarations(objectBindingDeclarations: ObjectBindingDeclarations, p: P): J | null {
        objectBindingDeclarations = objectBindingDeclarations.withPrefix(this.visitJsSpace(objectBindingDeclarations.prefix, JsSpace.Location.OBJECT_BINDING_DECLARATIONS_PREFIX, p)!);
        let tempExpression = this.visitExpression(objectBindingDeclarations, p) as Expression;
        if (!(tempExpression instanceof ObjectBindingDeclarations))
        {
            return tempExpression;
        }
        objectBindingDeclarations = tempExpression as ObjectBindingDeclarations;
        objectBindingDeclarations = objectBindingDeclarations.withMarkers(this.visitMarkers(objectBindingDeclarations.markers, p));
        objectBindingDeclarations = objectBindingDeclarations.withLeadingAnnotations(ListUtils.map(objectBindingDeclarations.leadingAnnotations, el => this.visitAndCast(el, p)));
        objectBindingDeclarations = objectBindingDeclarations.withModifiers(ListUtils.map(objectBindingDeclarations.modifiers, el => this.visitAndCast(el, p)));
        objectBindingDeclarations = objectBindingDeclarations.withTypeExpression(this.visitAndCast(objectBindingDeclarations.typeExpression, p));
        objectBindingDeclarations = objectBindingDeclarations.padding.withBindings(this.visitJsContainer(objectBindingDeclarations.padding.bindings, JsContainer.Location.OBJECT_BINDING_DECLARATIONS_BINDINGS, p)!);
        objectBindingDeclarations = objectBindingDeclarations.padding.withInitializer(this.visitJsLeftPadded(objectBindingDeclarations.padding.initializer, JsLeftPadded.Location.OBJECT_BINDING_DECLARATIONS_INITIALIZER, p));
        return objectBindingDeclarations;
    }

    public visitPropertyAssignment(propertyAssignment: PropertyAssignment, p: P): J | null {
        propertyAssignment = propertyAssignment.withPrefix(this.visitJsSpace(propertyAssignment.prefix, JsSpace.Location.PROPERTY_ASSIGNMENT_PREFIX, p)!);
        let tempStatement = this.visitStatement(propertyAssignment, p) as Statement;
        if (!(tempStatement instanceof PropertyAssignment))
        {
            return tempStatement;
        }
        propertyAssignment = tempStatement as PropertyAssignment;
        propertyAssignment = propertyAssignment.withMarkers(this.visitMarkers(propertyAssignment.markers, p));
        propertyAssignment = propertyAssignment.padding.withName(this.visitJsRightPadded(propertyAssignment.padding.name, JsRightPadded.Location.PROPERTY_ASSIGNMENT_NAME, p)!);
        propertyAssignment = propertyAssignment.withInitializer(this.visitAndCast(propertyAssignment.initializer, p));
        return propertyAssignment;
    }

    public visitSatisfiesExpression(satisfiesExpression: SatisfiesExpression, p: P): J | null {
        satisfiesExpression = satisfiesExpression.withPrefix(this.visitJsSpace(satisfiesExpression.prefix, JsSpace.Location.SATISFIES_EXPRESSION_PREFIX, p)!);
        let tempExpression = this.visitExpression(satisfiesExpression, p) as Expression;
        if (!(tempExpression instanceof SatisfiesExpression))
        {
            return tempExpression;
        }
        satisfiesExpression = tempExpression as SatisfiesExpression;
        satisfiesExpression = satisfiesExpression.withMarkers(this.visitMarkers(satisfiesExpression.markers, p));
        satisfiesExpression = satisfiesExpression.withExpression(this.visitAndCast(satisfiesExpression.expression, p)!);
        satisfiesExpression = satisfiesExpression.padding.withSatisfiesType(this.visitJsLeftPadded(satisfiesExpression.padding.satisfiesType, JsLeftPadded.Location.SATISFIES_EXPRESSION_SATISFIES_TYPE, p)!);
        return satisfiesExpression;
    }

    public visitScopedVariableDeclarations(scopedVariableDeclarations: ScopedVariableDeclarations, p: P): J | null {
        scopedVariableDeclarations = scopedVariableDeclarations.withPrefix(this.visitJsSpace(scopedVariableDeclarations.prefix, JsSpace.Location.SCOPED_VARIABLE_DECLARATIONS_PREFIX, p)!);
        let tempStatement = this.visitStatement(scopedVariableDeclarations, p) as Statement;
        if (!(tempStatement instanceof ScopedVariableDeclarations))
        {
            return tempStatement;
        }
        scopedVariableDeclarations = tempStatement as ScopedVariableDeclarations;
        scopedVariableDeclarations = scopedVariableDeclarations.withMarkers(this.visitMarkers(scopedVariableDeclarations.markers, p));
        scopedVariableDeclarations = scopedVariableDeclarations.withModifiers(ListUtils.map(scopedVariableDeclarations.modifiers, el => this.visitAndCast(el, p)));
        scopedVariableDeclarations = scopedVariableDeclarations.padding.withScope(this.visitJsLeftPadded(scopedVariableDeclarations.padding.scope, JsLeftPadded.Location.SCOPED_VARIABLE_DECLARATIONS_SCOPE, p));
        scopedVariableDeclarations = scopedVariableDeclarations.padding.withVariables(ListUtils.map(scopedVariableDeclarations.padding.variables, el => this.visitJsRightPadded(el, JsRightPadded.Location.SCOPED_VARIABLE_DECLARATIONS_VARIABLES, p)));
        return scopedVariableDeclarations;
    }

    public visitStatementExpression(statementExpression: StatementExpression, p: P): J | null {
        statementExpression = statementExpression.withStatement(this.visitAndCast(statementExpression.statement, p)!);
        return statementExpression;
    }

    public visitTaggedTemplateExpression(taggedTemplateExpression: TaggedTemplateExpression, p: P): J | null {
        taggedTemplateExpression = taggedTemplateExpression.withPrefix(this.visitJsSpace(taggedTemplateExpression.prefix, JsSpace.Location.TAGGED_TEMPLATE_EXPRESSION_PREFIX, p)!);
        let tempStatement = this.visitStatement(taggedTemplateExpression, p) as Statement;
        if (!(tempStatement instanceof TaggedTemplateExpression))
        {
            return tempStatement;
        }
        taggedTemplateExpression = tempStatement as TaggedTemplateExpression;
        let tempExpression = this.visitExpression(taggedTemplateExpression, p) as Expression;
        if (!(tempExpression instanceof TaggedTemplateExpression))
        {
            return tempExpression;
        }
        taggedTemplateExpression = tempExpression as TaggedTemplateExpression;
        taggedTemplateExpression = taggedTemplateExpression.withMarkers(this.visitMarkers(taggedTemplateExpression.markers, p));
        taggedTemplateExpression = taggedTemplateExpression.padding.withTag(this.visitJsRightPadded(taggedTemplateExpression.padding.tag, JsRightPadded.Location.TAGGED_TEMPLATE_EXPRESSION_TAG, p));
        taggedTemplateExpression = taggedTemplateExpression.padding.withTypeArguments(this.visitJsContainer(taggedTemplateExpression.padding.typeArguments, JsContainer.Location.TAGGED_TEMPLATE_EXPRESSION_TYPE_ARGUMENTS, p));
        taggedTemplateExpression = taggedTemplateExpression.withTemplateExpression(this.visitAndCast(taggedTemplateExpression.templateExpression, p)!);
        return taggedTemplateExpression;
    }

    public visitTemplateExpression(templateExpression: TemplateExpression, p: P): J | null {
        templateExpression = templateExpression.withPrefix(this.visitJsSpace(templateExpression.prefix, JsSpace.Location.TEMPLATE_EXPRESSION_PREFIX, p)!);
        let tempStatement = this.visitStatement(templateExpression, p) as Statement;
        if (!(tempStatement instanceof TemplateExpression))
        {
            return tempStatement;
        }
        templateExpression = tempStatement as TemplateExpression;
        let tempExpression = this.visitExpression(templateExpression, p) as Expression;
        if (!(tempExpression instanceof TemplateExpression))
        {
            return tempExpression;
        }
        templateExpression = tempExpression as TemplateExpression;
        templateExpression = templateExpression.withMarkers(this.visitMarkers(templateExpression.markers, p));
        templateExpression = templateExpression.withHead(this.visitAndCast(templateExpression.head, p)!);
        templateExpression = templateExpression.padding.withTemplateSpans(ListUtils.map(templateExpression.padding.templateSpans, el => this.visitJsRightPadded(el, JsRightPadded.Location.TEMPLATE_EXPRESSION_TEMPLATE_SPANS, p)));
        return templateExpression;
    }

    public visitTemplateExpressionTemplateSpan(templateSpan: TemplateExpression.TemplateSpan, p: P): J | null {
        templateSpan = templateSpan.withPrefix(this.visitJsSpace(templateSpan.prefix, JsSpace.Location.TEMPLATE_EXPRESSION_TEMPLATE_SPAN_PREFIX, p)!);
        templateSpan = templateSpan.withMarkers(this.visitMarkers(templateSpan.markers, p));
        templateSpan = templateSpan.withExpression(this.visitAndCast(templateSpan.expression, p)!);
        templateSpan = templateSpan.withTail(this.visitAndCast(templateSpan.tail, p)!);
        return templateSpan;
    }

    public visitTuple(tuple: Tuple, p: P): J | null {
        tuple = tuple.withPrefix(this.visitJsSpace(tuple.prefix, JsSpace.Location.TUPLE_PREFIX, p)!);
        let tempExpression = this.visitExpression(tuple, p) as Expression;
        if (!(tempExpression instanceof Tuple))
        {
            return tempExpression;
        }
        tuple = tempExpression as Tuple;
        tuple = tuple.withMarkers(this.visitMarkers(tuple.markers, p));
        tuple = tuple.padding.withElements(this.visitJsContainer(tuple.padding.elements, JsContainer.Location.TUPLE_ELEMENTS, p)!);
        return tuple;
    }

    public visitTypeDeclaration(typeDeclaration: TypeDeclaration, p: P): J | null {
        typeDeclaration = typeDeclaration.withPrefix(this.visitJsSpace(typeDeclaration.prefix, JsSpace.Location.TYPE_DECLARATION_PREFIX, p)!);
        let tempStatement = this.visitStatement(typeDeclaration, p) as Statement;
        if (!(tempStatement instanceof TypeDeclaration))
        {
            return tempStatement;
        }
        typeDeclaration = tempStatement as TypeDeclaration;
        typeDeclaration = typeDeclaration.withMarkers(this.visitMarkers(typeDeclaration.markers, p));
        typeDeclaration = typeDeclaration.withModifiers(ListUtils.map(typeDeclaration.modifiers, el => this.visitAndCast(el, p)));
        typeDeclaration = typeDeclaration.padding.withName(this.visitJsLeftPadded(typeDeclaration.padding.name, JsLeftPadded.Location.TYPE_DECLARATION_NAME, p)!);
        typeDeclaration = typeDeclaration.withTypeParameters(this.visitAndCast(typeDeclaration.typeParameters, p));
        typeDeclaration = typeDeclaration.padding.withInitializer(this.visitJsLeftPadded(typeDeclaration.padding.initializer, JsLeftPadded.Location.TYPE_DECLARATION_INITIALIZER, p)!);
        return typeDeclaration;
    }

    public visitTypeOf(typeOf: TypeOf, p: P): J | null {
        typeOf = typeOf.withPrefix(this.visitJsSpace(typeOf.prefix, JsSpace.Location.TYPE_OF_PREFIX, p)!);
        let tempExpression = this.visitExpression(typeOf, p) as Expression;
        if (!(tempExpression instanceof TypeOf))
        {
            return tempExpression;
        }
        typeOf = tempExpression as TypeOf;
        typeOf = typeOf.withMarkers(this.visitMarkers(typeOf.markers, p));
        typeOf = typeOf.withExpression(this.visitAndCast(typeOf.expression, p)!);
        return typeOf;
    }

    public visitTypeQuery(typeQuery: TypeQuery, p: P): J | null {
        typeQuery = typeQuery.withPrefix(this.visitJsSpace(typeQuery.prefix, JsSpace.Location.TYPE_QUERY_PREFIX, p)!);
        let tempExpression = this.visitExpression(typeQuery, p) as Expression;
        if (!(tempExpression instanceof TypeQuery))
        {
            return tempExpression;
        }
        typeQuery = tempExpression as TypeQuery;
        typeQuery = typeQuery.withMarkers(this.visitMarkers(typeQuery.markers, p));
        typeQuery = typeQuery.withTypeExpression(this.visitAndCast(typeQuery.typeExpression, p)!);
        return typeQuery;
    }

    public visitTypeOperator(typeOperator: TypeOperator, p: P): J | null {
        typeOperator = typeOperator.withPrefix(this.visitJsSpace(typeOperator.prefix, JsSpace.Location.TYPE_OPERATOR_PREFIX, p)!);
        let tempExpression = this.visitExpression(typeOperator, p) as Expression;
        if (!(tempExpression instanceof TypeOperator))
        {
            return tempExpression;
        }
        typeOperator = tempExpression as TypeOperator;
        typeOperator = typeOperator.withMarkers(this.visitMarkers(typeOperator.markers, p));
        typeOperator = typeOperator.padding.withExpression(this.visitJsLeftPadded(typeOperator.padding.expression, JsLeftPadded.Location.TYPE_OPERATOR_EXPRESSION, p)!);
        return typeOperator;
    }

    public visitTypePredicate(typePredicate: TypePredicate, p: P): J | null {
        typePredicate = typePredicate.withPrefix(this.visitJsSpace(typePredicate.prefix, JsSpace.Location.TYPE_PREDICATE_PREFIX, p)!);
        let tempExpression = this.visitExpression(typePredicate, p) as Expression;
        if (!(tempExpression instanceof TypePredicate))
        {
            return tempExpression;
        }
        typePredicate = tempExpression as TypePredicate;
        typePredicate = typePredicate.withMarkers(this.visitMarkers(typePredicate.markers, p));
        typePredicate = typePredicate.padding.withAsserts(this.visitJsLeftPadded(typePredicate.padding.asserts, JsLeftPadded.Location.TYPE_PREDICATE_ASSERTS, p)!);
        typePredicate = typePredicate.withParameterName(this.visitAndCast(typePredicate.parameterName, p)!);
        typePredicate = typePredicate.padding.withExpression(this.visitJsLeftPadded(typePredicate.padding.expression, JsLeftPadded.Location.TYPE_PREDICATE_EXPRESSION, p));
        return typePredicate;
    }

    public visitJsUnary(unary: Unary, p: P): J | null {
        unary = unary.withPrefix(this.visitJsSpace(unary.prefix, JsSpace.Location.UNARY_PREFIX, p)!);
        let tempStatement = this.visitStatement(unary, p) as Statement;
        if (!(tempStatement instanceof Unary))
        {
            return tempStatement;
        }
        unary = tempStatement as Unary;
        let tempExpression = this.visitExpression(unary, p) as Expression;
        if (!(tempExpression instanceof Unary))
        {
            return tempExpression;
        }
        unary = tempExpression as Unary;
        unary = unary.withMarkers(this.visitMarkers(unary.markers, p));
        unary = unary.padding.withOperator(this.visitJsLeftPadded(unary.padding.operator, JsLeftPadded.Location.UNARY_OPERATOR, p)!);
        unary = unary.withExpression(this.visitAndCast(unary.expression, p)!);
        return unary;
    }

    public visitUnion(union: Union, p: P): J | null {
        union = union.withPrefix(this.visitJsSpace(union.prefix, JsSpace.Location.UNION_PREFIX, p)!);
        let tempExpression = this.visitExpression(union, p) as Expression;
        if (!(tempExpression instanceof Union))
        {
            return tempExpression;
        }
        union = tempExpression as Union;
        union = union.withMarkers(this.visitMarkers(union.markers, p));
        union = union.padding.withTypes(ListUtils.map(union.padding.types, el => this.visitJsRightPadded(el, JsRightPadded.Location.UNION_TYPES, p)));
        return union;
    }

    public visitIntersection(intersection: Intersection, p: P): J | null {
        intersection = intersection.withPrefix(this.visitJsSpace(intersection.prefix, JsSpace.Location.INTERSECTION_PREFIX, p)!);
        let tempExpression = this.visitExpression(intersection, p) as Expression;
        if (!(tempExpression instanceof Intersection))
        {
            return tempExpression;
        }
        intersection = tempExpression as Intersection;
        intersection = intersection.withMarkers(this.visitMarkers(intersection.markers, p));
        intersection = intersection.padding.withTypes(ListUtils.map(intersection.padding.types, el => this.visitJsRightPadded(el, JsRightPadded.Location.INTERSECTION_TYPES, p)));
        return intersection;
    }

    public visitVoid(_void: Void, p: P): J | null {
        _void = _void.withPrefix(this.visitJsSpace(_void.prefix, JsSpace.Location.VOID_PREFIX, p)!);
        let tempStatement = this.visitStatement(_void, p) as Statement;
        if (!(tempStatement instanceof Void))
        {
            return tempStatement;
        }
        _void = tempStatement as Void;
        let tempExpression = this.visitExpression(_void, p) as Expression;
        if (!(tempExpression instanceof Void))
        {
            return tempExpression;
        }
        _void = tempExpression as Void;
        _void = _void.withMarkers(this.visitMarkers(_void.markers, p));
        _void = _void.withExpression(this.visitAndCast(_void.expression, p)!);
        return _void;
    }

    public visitJsYield(_yield: Yield, p: P): J | null {
        _yield = _yield.withPrefix(this.visitJsSpace(_yield.prefix, JsSpace.Location.YIELD_PREFIX, p)!);
        let tempExpression = this.visitExpression(_yield, p) as Expression;
        if (!(tempExpression instanceof Yield))
        {
            return tempExpression;
        }
        _yield = tempExpression as Yield;
        _yield = _yield.withMarkers(this.visitMarkers(_yield.markers, p));
        _yield = _yield.withExpression(this.visitAndCast(_yield.expression, p));
        return _yield;
    }

    public visitTypeInfo(typeInfo: TypeInfo, p: P): J | null {
        typeInfo = typeInfo.withPrefix(this.visitJsSpace(typeInfo.prefix, JsSpace.Location.TYPE_INFO_PREFIX, p)!);
        let tempExpression = this.visitExpression(typeInfo, p) as Expression;
        if (!(tempExpression instanceof TypeInfo))
        {
            return tempExpression;
        }
        typeInfo = tempExpression as TypeInfo;
        typeInfo = typeInfo.withMarkers(this.visitMarkers(typeInfo.markers, p));
        typeInfo = typeInfo.withTypeIdentifier(this.visitAndCast(typeInfo.typeIdentifier, p)!);
        return typeInfo;
    }

    public visitJSVariableDeclarations(jSVariableDeclarations: JSVariableDeclarations, p: P): J | null {
        jSVariableDeclarations = jSVariableDeclarations.withPrefix(this.visitJsSpace(jSVariableDeclarations.prefix, JsSpace.Location.JSVARIABLE_DECLARATIONS_PREFIX, p)!);
        let tempStatement = this.visitStatement(jSVariableDeclarations, p) as Statement;
        if (!(tempStatement instanceof JSVariableDeclarations))
        {
            return tempStatement;
        }
        jSVariableDeclarations = tempStatement as JSVariableDeclarations;
        jSVariableDeclarations = jSVariableDeclarations.withMarkers(this.visitMarkers(jSVariableDeclarations.markers, p));
        jSVariableDeclarations = jSVariableDeclarations.withLeadingAnnotations(ListUtils.map(jSVariableDeclarations.leadingAnnotations, el => this.visitAndCast(el, p)));
        jSVariableDeclarations = jSVariableDeclarations.withModifiers(ListUtils.map(jSVariableDeclarations.modifiers, el => this.visitAndCast(el, p)));
        jSVariableDeclarations = jSVariableDeclarations.withTypeExpression(this.visitAndCast(jSVariableDeclarations.typeExpression, p));
        jSVariableDeclarations = jSVariableDeclarations.withVarargs(this.visitJsSpace(jSVariableDeclarations.varargs, JsSpace.Location.JSVARIABLE_DECLARATIONS_VARARGS, p));
        jSVariableDeclarations = jSVariableDeclarations.padding.withVariables(ListUtils.map(jSVariableDeclarations.padding.variables, el => this.visitJsRightPadded(el, JsRightPadded.Location.JSVARIABLE_DECLARATIONS_VARIABLES, p)));
        return jSVariableDeclarations;
    }

    public visitJSVariableDeclarationsJSNamedVariable(jSNamedVariable: JSVariableDeclarations.JSNamedVariable, p: P): J | null {
        jSNamedVariable = jSNamedVariable.withPrefix(this.visitJsSpace(jSNamedVariable.prefix, JsSpace.Location.JSVARIABLE_DECLARATIONS_JSNAMED_VARIABLE_PREFIX, p)!);
        jSNamedVariable = jSNamedVariable.withMarkers(this.visitMarkers(jSNamedVariable.markers, p));
        jSNamedVariable = jSNamedVariable.withName(this.visitAndCast(jSNamedVariable.name, p)!);
        jSNamedVariable = jSNamedVariable.padding.withDimensionsAfterName(ListUtils.map(jSNamedVariable.padding.dimensionsAfterName, el => this.visitJsLeftPadded(el, JsLeftPadded.Location.JSVARIABLE_DECLARATIONS_JSNAMED_VARIABLE_DIMENSIONS_AFTER_NAME, p)));
        jSNamedVariable = jSNamedVariable.padding.withInitializer(this.visitJsLeftPadded(jSNamedVariable.padding.initializer, JsLeftPadded.Location.JSVARIABLE_DECLARATIONS_JSNAMED_VARIABLE_INITIALIZER, p));
        return jSNamedVariable;
    }

    public visitJSMethodDeclaration(jSMethodDeclaration: JSMethodDeclaration, p: P): J | null {
        jSMethodDeclaration = jSMethodDeclaration.withPrefix(this.visitJsSpace(jSMethodDeclaration.prefix, JsSpace.Location.JSMETHOD_DECLARATION_PREFIX, p)!);
        let tempStatement = this.visitStatement(jSMethodDeclaration, p) as Statement;
        if (!(tempStatement instanceof JSMethodDeclaration))
        {
            return tempStatement;
        }
        jSMethodDeclaration = tempStatement as JSMethodDeclaration;
        jSMethodDeclaration = jSMethodDeclaration.withMarkers(this.visitMarkers(jSMethodDeclaration.markers, p));
        jSMethodDeclaration = jSMethodDeclaration.withLeadingAnnotations(ListUtils.map(jSMethodDeclaration.leadingAnnotations, el => this.visitAndCast(el, p)));
        jSMethodDeclaration = jSMethodDeclaration.withModifiers(ListUtils.map(jSMethodDeclaration.modifiers, el => this.visitAndCast(el, p)));
        jSMethodDeclaration = jSMethodDeclaration.withTypeParameters(this.visitAndCast(jSMethodDeclaration.typeParameters, p));
        jSMethodDeclaration = jSMethodDeclaration.withReturnTypeExpression(this.visitAndCast(jSMethodDeclaration.returnTypeExpression, p));
        jSMethodDeclaration = jSMethodDeclaration.withName(this.visitAndCast(jSMethodDeclaration.name, p)!);
        jSMethodDeclaration = jSMethodDeclaration.padding.withParameters(this.visitJsContainer(jSMethodDeclaration.padding.parameters, JsContainer.Location.JSMETHOD_DECLARATION_PARAMETERS, p)!);
        jSMethodDeclaration = jSMethodDeclaration.padding.withThrowz(this.visitJsContainer(jSMethodDeclaration.padding.throwz, JsContainer.Location.JSMETHOD_DECLARATION_THROWZ, p));
        jSMethodDeclaration = jSMethodDeclaration.withBody(this.visitAndCast(jSMethodDeclaration.body, p));
        jSMethodDeclaration = jSMethodDeclaration.padding.withDefaultValue(this.visitJsLeftPadded(jSMethodDeclaration.padding.defaultValue, JsLeftPadded.Location.JSMETHOD_DECLARATION_DEFAULT_VALUE, p));
        return jSMethodDeclaration;
    }

    public visitJSForOfLoop(jSForOfLoop: JSForOfLoop, p: P): J | null {
        jSForOfLoop = jSForOfLoop.withPrefix(this.visitJsSpace(jSForOfLoop.prefix, JsSpace.Location.JSFOR_OF_LOOP_PREFIX, p)!);
        let tempStatement = this.visitStatement(jSForOfLoop, p) as Statement;
        if (!(tempStatement instanceof JSForOfLoop))
        {
            return tempStatement;
        }
        jSForOfLoop = tempStatement as JSForOfLoop;
        jSForOfLoop = jSForOfLoop.withMarkers(this.visitMarkers(jSForOfLoop.markers, p));
        jSForOfLoop = jSForOfLoop.padding.withAwait(this.visitJsLeftPadded(jSForOfLoop.padding.await, JsLeftPadded.Location.JSFOR_OF_LOOP_AWAIT, p)!);
        jSForOfLoop = jSForOfLoop.withControl(this.visitAndCast(jSForOfLoop.control, p)!);
        jSForOfLoop = jSForOfLoop.padding.withBody(this.visitJsRightPadded(jSForOfLoop.padding.body, JsRightPadded.Location.JSFOR_OF_LOOP_BODY, p)!);
        return jSForOfLoop;
    }

    public visitJSForInLoop(jSForInLoop: JSForInLoop, p: P): J | null {
        jSForInLoop = jSForInLoop.withPrefix(this.visitJsSpace(jSForInLoop.prefix, JsSpace.Location.JSFOR_IN_LOOP_PREFIX, p)!);
        let tempStatement = this.visitStatement(jSForInLoop, p) as Statement;
        if (!(tempStatement instanceof JSForInLoop))
        {
            return tempStatement;
        }
        jSForInLoop = tempStatement as JSForInLoop;
        jSForInLoop = jSForInLoop.withMarkers(this.visitMarkers(jSForInLoop.markers, p));
        jSForInLoop = jSForInLoop.withControl(this.visitAndCast(jSForInLoop.control, p)!);
        jSForInLoop = jSForInLoop.padding.withBody(this.visitJsRightPadded(jSForInLoop.padding.body, JsRightPadded.Location.JSFOR_IN_LOOP_BODY, p)!);
        return jSForInLoop;
    }

    public visitJSForInOfLoopControl(jSForInOfLoopControl: JSForInOfLoopControl, p: P): J | null {
        jSForInOfLoopControl = jSForInOfLoopControl.withPrefix(this.visitJsSpace(jSForInOfLoopControl.prefix, JsSpace.Location.JSFOR_IN_OF_LOOP_CONTROL_PREFIX, p)!);
        jSForInOfLoopControl = jSForInOfLoopControl.withMarkers(this.visitMarkers(jSForInOfLoopControl.markers, p));
        jSForInOfLoopControl = jSForInOfLoopControl.padding.withVariable(this.visitJsRightPadded(jSForInOfLoopControl.padding.variable, JsRightPadded.Location.JSFOR_IN_OF_LOOP_CONTROL_VARIABLE, p)!);
        jSForInOfLoopControl = jSForInOfLoopControl.padding.withIterable(this.visitJsRightPadded(jSForInOfLoopControl.padding.iterable, JsRightPadded.Location.JSFOR_IN_OF_LOOP_CONTROL_ITERABLE, p)!);
        return jSForInOfLoopControl;
    }

    public visitNamespaceDeclaration(namespaceDeclaration: NamespaceDeclaration, p: P): J | null {
        namespaceDeclaration = namespaceDeclaration.withPrefix(this.visitJsSpace(namespaceDeclaration.prefix, JsSpace.Location.NAMESPACE_DECLARATION_PREFIX, p)!);
        let tempStatement = this.visitStatement(namespaceDeclaration, p) as Statement;
        if (!(tempStatement instanceof NamespaceDeclaration))
        {
            return tempStatement;
        }
        namespaceDeclaration = tempStatement as NamespaceDeclaration;
        namespaceDeclaration = namespaceDeclaration.withMarkers(this.visitMarkers(namespaceDeclaration.markers, p));
        namespaceDeclaration = namespaceDeclaration.withModifiers(ListUtils.map(namespaceDeclaration.modifiers, el => this.visitAndCast(el, p)));
        namespaceDeclaration = namespaceDeclaration.padding.withKeywordType(this.visitJsLeftPadded(namespaceDeclaration.padding.keywordType, JsLeftPadded.Location.NAMESPACE_DECLARATION_KEYWORD_TYPE, p)!);
        namespaceDeclaration = namespaceDeclaration.padding.withName(this.visitJsRightPadded(namespaceDeclaration.padding.name, JsRightPadded.Location.NAMESPACE_DECLARATION_NAME, p)!);
        namespaceDeclaration = namespaceDeclaration.withBody(this.visitAndCast(namespaceDeclaration.body, p)!);
        return namespaceDeclaration;
    }

    public visitFunctionDeclaration(functionDeclaration: FunctionDeclaration, p: P): J | null {
        functionDeclaration = functionDeclaration.withPrefix(this.visitJsSpace(functionDeclaration.prefix, JsSpace.Location.FUNCTION_DECLARATION_PREFIX, p)!);
        let tempStatement = this.visitStatement(functionDeclaration, p) as Statement;
        if (!(tempStatement instanceof FunctionDeclaration))
        {
            return tempStatement;
        }
        functionDeclaration = tempStatement as FunctionDeclaration;
        let tempExpression = this.visitExpression(functionDeclaration, p) as Expression;
        if (!(tempExpression instanceof FunctionDeclaration))
        {
            return tempExpression;
        }
        functionDeclaration = tempExpression as FunctionDeclaration;
        functionDeclaration = functionDeclaration.withMarkers(this.visitMarkers(functionDeclaration.markers, p));
        functionDeclaration = functionDeclaration.withModifiers(ListUtils.map(functionDeclaration.modifiers, el => this.visitAndCast(el, p)));
        functionDeclaration = functionDeclaration.withName(this.visitAndCast(functionDeclaration.name, p));
        functionDeclaration = functionDeclaration.withTypeParameters(this.visitAndCast(functionDeclaration.typeParameters, p));
        functionDeclaration = functionDeclaration.padding.withParameters(this.visitJsContainer(functionDeclaration.padding.parameters, JsContainer.Location.FUNCTION_DECLARATION_PARAMETERS, p)!);
        functionDeclaration = functionDeclaration.withReturnTypeExpression(this.visitAndCast(functionDeclaration.returnTypeExpression, p));
        functionDeclaration = functionDeclaration.withBody(this.visitAndCast(functionDeclaration.body, p)!);
        return functionDeclaration;
    }

    public visitTypeLiteral(typeLiteral: TypeLiteral, p: P): J | null {
        typeLiteral = typeLiteral.withPrefix(this.visitJsSpace(typeLiteral.prefix, JsSpace.Location.TYPE_LITERAL_PREFIX, p)!);
        let tempExpression = this.visitExpression(typeLiteral, p) as Expression;
        if (!(tempExpression instanceof TypeLiteral))
        {
            return tempExpression;
        }
        typeLiteral = tempExpression as TypeLiteral;
        typeLiteral = typeLiteral.withMarkers(this.visitMarkers(typeLiteral.markers, p));
        typeLiteral = typeLiteral.withMembers(this.visitAndCast(typeLiteral.members, p)!);
        return typeLiteral;
    }

    public visitIndexSignatureDeclaration(indexSignatureDeclaration: IndexSignatureDeclaration, p: P): J | null {
        indexSignatureDeclaration = indexSignatureDeclaration.withPrefix(this.visitJsSpace(indexSignatureDeclaration.prefix, JsSpace.Location.INDEX_SIGNATURE_DECLARATION_PREFIX, p)!);
        let tempStatement = this.visitStatement(indexSignatureDeclaration, p) as Statement;
        if (!(tempStatement instanceof IndexSignatureDeclaration))
        {
            return tempStatement;
        }
        indexSignatureDeclaration = tempStatement as IndexSignatureDeclaration;
        indexSignatureDeclaration = indexSignatureDeclaration.withMarkers(this.visitMarkers(indexSignatureDeclaration.markers, p));
        indexSignatureDeclaration = indexSignatureDeclaration.withModifiers(ListUtils.map(indexSignatureDeclaration.modifiers, el => this.visitAndCast(el, p)));
        indexSignatureDeclaration = indexSignatureDeclaration.padding.withParameters(this.visitJsContainer(indexSignatureDeclaration.padding.parameters, JsContainer.Location.INDEX_SIGNATURE_DECLARATION_PARAMETERS, p)!);
        indexSignatureDeclaration = indexSignatureDeclaration.padding.withTypeExpression(this.visitJsLeftPadded(indexSignatureDeclaration.padding.typeExpression, JsLeftPadded.Location.INDEX_SIGNATURE_DECLARATION_TYPE_EXPRESSION, p)!);
        return indexSignatureDeclaration;
    }

    public visitArrayBindingPattern(arrayBindingPattern: ArrayBindingPattern, p: P): J | null {
        arrayBindingPattern = arrayBindingPattern.withPrefix(this.visitJsSpace(arrayBindingPattern.prefix, JsSpace.Location.ARRAY_BINDING_PATTERN_PREFIX, p)!);
        let tempExpression = this.visitExpression(arrayBindingPattern, p) as Expression;
        if (!(tempExpression instanceof ArrayBindingPattern))
        {
            return tempExpression;
        }
        arrayBindingPattern = tempExpression as ArrayBindingPattern;
        arrayBindingPattern = arrayBindingPattern.withMarkers(this.visitMarkers(arrayBindingPattern.markers, p));
        arrayBindingPattern = arrayBindingPattern.padding.withElements(this.visitJsContainer(arrayBindingPattern.padding.elements, JsContainer.Location.ARRAY_BINDING_PATTERN_ELEMENTS, p)!);
        return arrayBindingPattern;
    }

    public visitBindingElement(bindingElement: BindingElement, p: P): J | null {
        bindingElement = bindingElement.withPrefix(this.visitJsSpace(bindingElement.prefix, JsSpace.Location.BINDING_ELEMENT_PREFIX, p)!);
        let tempStatement = this.visitStatement(bindingElement, p) as Statement;
        if (!(tempStatement instanceof BindingElement))
        {
            return tempStatement;
        }
        bindingElement = tempStatement as BindingElement;
        let tempExpression = this.visitExpression(bindingElement, p) as Expression;
        if (!(tempExpression instanceof BindingElement))
        {
            return tempExpression;
        }
        bindingElement = tempExpression as BindingElement;
        bindingElement = bindingElement.withMarkers(this.visitMarkers(bindingElement.markers, p));
        bindingElement = bindingElement.padding.withPropertyName(this.visitJsRightPadded(bindingElement.padding.propertyName, JsRightPadded.Location.BINDING_ELEMENT_PROPERTY_NAME, p));
        bindingElement = bindingElement.withName(this.visitAndCast(bindingElement.name, p)!);
        bindingElement = bindingElement.padding.withInitializer(this.visitJsLeftPadded(bindingElement.padding.initializer, JsLeftPadded.Location.BINDING_ELEMENT_INITIALIZER, p));
        return bindingElement;
    }

    public visitJsLeftPadded<T>(left: JLeftPadded<T> | null, loc: JsLeftPadded.Location, p: P): JLeftPadded<T> {
        return extensions.visitJsLeftPadded(this, left, loc, p);
    }

    public visitJsRightPadded<T>(right: JRightPadded<T> | null, loc: JsRightPadded.Location, p: P): JRightPadded<T> {
        return extensions.visitJsRightPadded(this, right, loc, p);
    }

    public visitJsContainer<T>(container: JContainer<T> | null, loc: JsContainer.Location, p: P): JContainer<T> {
        return extensions.visitJsContainer(this, container, loc, p);
    }

    public visitJsSpace(space: Space | null, loc: JsSpace.Location, p: P): Space {
        return extensions.visitJsSpace(this, space, loc, p);
    }

    public visitContainer<T>(container: JContainer<T> | null, loc: JContainer.Location, p: P): JContainer<T> | null {
        return extensions.visitContainer(this, container, loc, p);
    }

    public visitLeftPadded<T>(left: JLeftPadded<T> | null, loc: JLeftPadded.Location, p: P): JLeftPadded<T> | null {
        return extensions.visitLeftPadded(this, left, loc, p);
    }

    public visitRightPadded<T>(right: JRightPadded<T> | null, loc: JRightPadded.Location, p: P): JRightPadded<T> | null {
        return extensions.visitRightPadded(this, right, loc, p);
    }

    public visitSpace(space: Space | null, loc: Space.Location, p: P): Space {
        return extensions.visitSpace(this, space, loc, p);
    }

}
