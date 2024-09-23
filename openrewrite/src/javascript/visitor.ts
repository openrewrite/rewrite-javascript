import * as extensions from "./extensions";
import {ListUtils, SourceFile, Tree, TreeVisitor} from "../core";
import {JS, isJavaScript, JsLeftPadded, JsRightPadded, JsContainer, JsSpace} from "./tree";
import {CompilationUnit, Alias, ArrowFunction, DefaultType, Delete, Export, ExpressionStatement, FunctionType, JsImport, JsBinary, JsOperator, ObjectBindingDeclarations, StatementExpression, TemplateExpression, Tuple, TypeDeclaration, TypeOperator, Unary, Union} from "./tree";
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
        arrowFunction = arrowFunction.withParameters(this.visitAndCast(arrowFunction.parameters, p)!);
        arrowFunction = arrowFunction.withReturnTypeExpression(this.visitAndCast(arrowFunction.returnTypeExpression, p));
        arrowFunction = arrowFunction.withArrow(this.visitJsSpace(arrowFunction.arrow, JsSpace.Location.ARROW_FUNCTION_ARROW, p)!);
        arrowFunction = arrowFunction.withBody(this.visitAndCast(arrowFunction.body, p)!);
        return arrowFunction;
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

    public visitFunctionType(functionType: FunctionType, p: P): J | null {
        functionType = functionType.withPrefix(this.visitJsSpace(functionType.prefix, JsSpace.Location.FUNCTION_TYPE_PREFIX, p)!);
        let tempExpression = this.visitExpression(functionType, p) as Expression;
        if (!(tempExpression instanceof FunctionType))
        {
            return tempExpression;
        }
        functionType = tempExpression as FunctionType;
        functionType = functionType.withMarkers(this.visitMarkers(functionType.markers, p));
        functionType = functionType.padding.withParameters(this.visitJsContainer(functionType.padding.parameters, JsContainer.Location.FUNCTION_TYPE_PARAMETERS, p)!);
        functionType = functionType.withArrow(this.visitJsSpace(functionType.arrow, JsSpace.Location.FUNCTION_TYPE_ARROW, p)!);
        functionType = functionType.withReturnType(this.visitAndCast(functionType.returnType, p)!);
        return functionType;
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
        jsImport = jsImport.padding.withImports(this.visitJsContainer(jsImport.padding.imports, JsContainer.Location.JS_IMPORT_IMPORTS, p));
        jsImport = jsImport.withFrom(this.visitJsSpace(jsImport.from, JsSpace.Location.JS_IMPORT_FROM, p));
        jsImport = jsImport.withTarget(this.visitAndCast(jsImport.target, p));
        jsImport = jsImport.padding.withInitializer(this.visitJsLeftPadded(jsImport.padding.initializer, JsLeftPadded.Location.JS_IMPORT_INITIALIZER, p));
        return jsImport;
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

    public visitJsOperator(jsOperator: JsOperator, p: P): J | null {
        jsOperator = jsOperator.withPrefix(this.visitJsSpace(jsOperator.prefix, JsSpace.Location.JS_OPERATOR_PREFIX, p)!);
        let tempStatement = this.visitStatement(jsOperator, p) as Statement;
        if (!(tempStatement instanceof JsOperator))
        {
            return tempStatement;
        }
        jsOperator = tempStatement as JsOperator;
        let tempExpression = this.visitExpression(jsOperator, p) as Expression;
        if (!(tempExpression instanceof JsOperator))
        {
            return tempExpression;
        }
        jsOperator = tempExpression as JsOperator;
        jsOperator = jsOperator.withMarkers(this.visitMarkers(jsOperator.markers, p));
        jsOperator = jsOperator.withLeft(this.visitAndCast(jsOperator.left, p));
        jsOperator = jsOperator.padding.withOperator(this.visitJsLeftPadded(jsOperator.padding.operator, JsLeftPadded.Location.JS_OPERATOR_OPERATOR, p)!);
        jsOperator = jsOperator.withRight(this.visitAndCast(jsOperator.right, p)!);
        return jsOperator;
    }

    public visitObjectBindingDeclarations(objectBindingDeclarations: ObjectBindingDeclarations, p: P): J | null {
        objectBindingDeclarations = objectBindingDeclarations.withPrefix(this.visitJsSpace(objectBindingDeclarations.prefix, JsSpace.Location.OBJECT_BINDING_DECLARATIONS_PREFIX, p)!);
        let tempStatement = this.visitStatement(objectBindingDeclarations, p) as Statement;
        if (!(tempStatement instanceof ObjectBindingDeclarations))
        {
            return tempStatement;
        }
        objectBindingDeclarations = tempStatement as ObjectBindingDeclarations;
        objectBindingDeclarations = objectBindingDeclarations.withMarkers(this.visitMarkers(objectBindingDeclarations.markers, p));
        objectBindingDeclarations = objectBindingDeclarations.withLeadingAnnotations(ListUtils.map(objectBindingDeclarations.leadingAnnotations, el => this.visitAndCast(el, p)));
        objectBindingDeclarations = objectBindingDeclarations.withModifiers(ListUtils.map(objectBindingDeclarations.modifiers, el => this.visitAndCast(el, p)));
        objectBindingDeclarations = objectBindingDeclarations.withTypeExpression(this.visitAndCast(objectBindingDeclarations.typeExpression, p));
        objectBindingDeclarations = objectBindingDeclarations.padding.withBindings(this.visitJsContainer(objectBindingDeclarations.padding.bindings, JsContainer.Location.OBJECT_BINDING_DECLARATIONS_BINDINGS, p)!);
        objectBindingDeclarations = objectBindingDeclarations.padding.withInitializer(this.visitJsLeftPadded(objectBindingDeclarations.padding.initializer, JsLeftPadded.Location.OBJECT_BINDING_DECLARATIONS_INITIALIZER, p));
        return objectBindingDeclarations;
    }

    public visitBinding(binding: ObjectBindingDeclarations.Binding, p: P): J | null {
        binding = binding.withPrefix(this.visitJsSpace(binding.prefix, JsSpace.Location.OBJECT_BINDING_DECLARATIONS_BINDING_PREFIX, p)!);
        binding = binding.withMarkers(this.visitMarkers(binding.markers, p));
        binding = binding.padding.withPropertyName(this.visitJsRightPadded(binding.padding.propertyName, JsRightPadded.Location.OBJECT_BINDING_DECLARATIONS_BINDING_PROPERTY_NAME, p));
        binding = binding.withName(this.visitAndCast(binding.name, p)!);
        binding = binding.withDimensionsAfterName(ListUtils.map(binding.dimensionsAfterName, el => this.visitJsLeftPadded(el, JsLeftPadded.Location.OBJECT_BINDING_DECLARATIONS_BINDING_DIMENSIONS_AFTER_NAME, p)));
        binding = binding.withAfterVararg(this.visitJsSpace(binding.afterVararg, JsSpace.Location.OBJECT_BINDING_DECLARATIONS_BINDING_AFTER_VARARG, p));
        binding = binding.padding.withInitializer(this.visitJsLeftPadded(binding.padding.initializer, JsLeftPadded.Location.OBJECT_BINDING_DECLARATIONS_BINDING_INITIALIZER, p));
        return binding;
    }

    public visitStatementExpression(statementExpression: StatementExpression, p: P): J | null {
        statementExpression = statementExpression.withStatement(this.visitAndCast(statementExpression.statement, p)!);
        return statementExpression;
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
        templateExpression = templateExpression.padding.withTag(this.visitJsRightPadded(templateExpression.padding.tag, JsRightPadded.Location.TEMPLATE_EXPRESSION_TAG, p));
        templateExpression = templateExpression.withStrings(ListUtils.map(templateExpression.strings, el => this.visitAndCast(el, p)));
        return templateExpression;
    }

    public visitTemplateExpressionValue(value: TemplateExpression.Value, p: P): J | null {
        value = value.withPrefix(this.visitJsSpace(value.prefix, JsSpace.Location.TEMPLATE_EXPRESSION_VALUE_PREFIX, p)!);
        value = value.withMarkers(this.visitMarkers(value.markers, p));
        value = value.withTree(this.visitAndCast(value.tree, p)!);
        value = value.withAfter(this.visitJsSpace(value.after, JsSpace.Location.TEMPLATE_EXPRESSION_VALUE_AFTER, p)!);
        return value;
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
        typeDeclaration = typeDeclaration.withLeadingAnnotations(ListUtils.map(typeDeclaration.leadingAnnotations, el => this.visitAndCast(el, p)));
        typeDeclaration = typeDeclaration.withModifiers(ListUtils.map(typeDeclaration.modifiers, el => this.visitAndCast(el, p)));
        typeDeclaration = typeDeclaration.withName(this.visitAndCast(typeDeclaration.name, p)!);
        typeDeclaration = typeDeclaration.withTypeParameters(this.visitAndCast(typeDeclaration.typeParameters, p));
        typeDeclaration = typeDeclaration.padding.withInitializer(this.visitJsLeftPadded(typeDeclaration.padding.initializer, JsLeftPadded.Location.TYPE_DECLARATION_INITIALIZER, p)!);
        return typeDeclaration;
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
