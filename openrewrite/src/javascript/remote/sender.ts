import * as extensions from "./remote_extensions";
import {Cursor, ListUtils, Tree} from '../../core';
import {Sender, SenderContext, ValueType} from '@openrewrite/rewrite-remote';
import {JavaScriptVisitor} from '..';
import {JS, JsLeftPadded, JsRightPadded, JsContainer, JsSpace, CompilationUnit, Alias, ArrowFunction, Await, DefaultType, Delete, Export, ExpressionStatement, FunctionType, JsImport, JsBinary, ObjectBindingDeclarations, PropertyAssignment, ScopedVariableDeclarations, StatementExpression, TemplateExpression, Tuple, TypeDeclaration, TypeOf, TypeOperator, Unary, Union, Void, Yield, TypeInfo} from '../tree';
import {Expression, J, JContainer, JLeftPadded, JRightPadded, Space, Statement} from "../../java";
import * as Java from "../../java/tree";

export class JavaScriptSender implements Sender<JS> {
    public send(after: JS, before: JS | null, ctx: SenderContext): void {
        let visitor = new Visitor();
        visitor.visit(after, ctx.fork(visitor, before));
    }
}

class Visitor extends JavaScriptVisitor<SenderContext> {
    public visit(tree: Tree | null, ctx: SenderContext): JS {
        this.cursor = new Cursor(this.cursor, tree!);
        ctx.sendNode(tree, x => x, ctx.sendTree);
        this.cursor = this.cursor.parent!;

        return tree as JS;
    }

    public visitJsCompilationUnit(compilationUnit: CompilationUnit, ctx: SenderContext): J {
        ctx.sendValue(compilationUnit, v => v.id, ValueType.UUID);
        ctx.sendNode(compilationUnit, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(compilationUnit, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(compilationUnit, v => v.sourcePath, ValueType.Primitive);
        ctx.sendTypedValue(compilationUnit, v => v.fileAttributes, ValueType.Object);
        ctx.sendValue(compilationUnit, v => v.charsetName, ValueType.Primitive);
        ctx.sendValue(compilationUnit, v => v.charsetBomMarked, ValueType.Primitive);
        ctx.sendTypedValue(compilationUnit, v => v.checksum, ValueType.Object);
        ctx.sendNodes(compilationUnit, v => v.padding.imports, Visitor.sendRightPadded(ValueType.Tree), t => t.element.id);
        ctx.sendNodes(compilationUnit, v => v.padding.statements, Visitor.sendRightPadded(ValueType.Tree), t => t.element.id);
        ctx.sendNode(compilationUnit, v => v.eof, Visitor.sendSpace);
        return compilationUnit;
    }

    public visitAlias(alias: Alias, ctx: SenderContext): J {
        ctx.sendValue(alias, v => v.id, ValueType.UUID);
        ctx.sendNode(alias, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(alias, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(alias, v => v.padding.propertyName, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNode(alias, v => v.alias, ctx.sendTree);
        return alias;
    }

    public visitArrowFunction(arrowFunction: ArrowFunction, ctx: SenderContext): J {
        ctx.sendValue(arrowFunction, v => v.id, ValueType.UUID);
        ctx.sendNode(arrowFunction, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(arrowFunction, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(arrowFunction, v => v.leadingAnnotations, ctx.sendTree, t => t.id);
        ctx.sendNodes(arrowFunction, v => v.modifiers, ctx.sendTree, t => t.id);
        ctx.sendNode(arrowFunction, v => v.parameters, ctx.sendTree);
        ctx.sendNode(arrowFunction, v => v.returnTypeExpression, ctx.sendTree);
        ctx.sendNode(arrowFunction, v => v.arrow, Visitor.sendSpace);
        ctx.sendNode(arrowFunction, v => v.body, ctx.sendTree);
        ctx.sendTypedValue(arrowFunction, v => v.type, ValueType.Object);
        return arrowFunction;
    }

    public visitAwait(await: Await, ctx: SenderContext): J {
        ctx.sendValue(await, v => v.id, ValueType.UUID);
        ctx.sendNode(await, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(await, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(await, v => v.expression, ctx.sendTree);
        ctx.sendTypedValue(await, v => v.type, ValueType.Object);
        return await;
    }

    public visitDefaultType(defaultType: DefaultType, ctx: SenderContext): J {
        ctx.sendValue(defaultType, v => v.id, ValueType.UUID);
        ctx.sendNode(defaultType, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(defaultType, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(defaultType, v => v.left, ctx.sendTree);
        ctx.sendNode(defaultType, v => v.beforeEquals, Visitor.sendSpace);
        ctx.sendNode(defaultType, v => v.right, ctx.sendTree);
        ctx.sendTypedValue(defaultType, v => v.type, ValueType.Object);
        return defaultType;
    }

    public visitDelete(_delete: Delete, ctx: SenderContext): J {
        ctx.sendValue(_delete, v => v.id, ValueType.UUID);
        ctx.sendNode(_delete, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_delete, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_delete, v => v.expression, ctx.sendTree);
        ctx.sendTypedValue(_delete, v => v.type, ValueType.Object);
        return _delete;
    }

    public visitExport(_export: Export, ctx: SenderContext): J {
        ctx.sendValue(_export, v => v.id, ValueType.UUID);
        ctx.sendNode(_export, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_export, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_export, v => v.padding.exports, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(_export, v => v.from, Visitor.sendSpace);
        ctx.sendNode(_export, v => v.target, ctx.sendTree);
        ctx.sendNode(_export, v => v.padding.initializer, Visitor.sendLeftPadded(ValueType.Tree));
        return _export;
    }

    public visitExpressionStatement(expressionStatement: ExpressionStatement, ctx: SenderContext): J {
        ctx.sendValue(expressionStatement, v => v.id, ValueType.UUID);
        ctx.sendNode(expressionStatement, v => v.expression, ctx.sendTree);
        return expressionStatement;
    }

    public visitFunctionType(functionType: FunctionType, ctx: SenderContext): J {
        ctx.sendValue(functionType, v => v.id, ValueType.UUID);
        ctx.sendNode(functionType, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(functionType, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(functionType, v => v.padding.parameters, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(functionType, v => v.arrow, Visitor.sendSpace);
        ctx.sendNode(functionType, v => v.returnType, ctx.sendTree);
        ctx.sendTypedValue(functionType, v => v.type, ValueType.Object);
        return functionType;
    }

    public visitJsImport(jsImport: JsImport, ctx: SenderContext): J {
        ctx.sendValue(jsImport, v => v.id, ValueType.UUID);
        ctx.sendNode(jsImport, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(jsImport, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(jsImport, v => v.padding.name, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNode(jsImport, v => v.padding.imports, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(jsImport, v => v.from, Visitor.sendSpace);
        ctx.sendNode(jsImport, v => v.target, ctx.sendTree);
        ctx.sendNode(jsImport, v => v.padding.initializer, Visitor.sendLeftPadded(ValueType.Tree));
        return jsImport;
    }

    public visitJsBinary(jsBinary: JsBinary, ctx: SenderContext): J {
        ctx.sendValue(jsBinary, v => v.id, ValueType.UUID);
        ctx.sendNode(jsBinary, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(jsBinary, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(jsBinary, v => v.left, ctx.sendTree);
        ctx.sendNode(jsBinary, v => v.padding.operator, Visitor.sendLeftPadded(ValueType.Enum));
        ctx.sendNode(jsBinary, v => v.right, ctx.sendTree);
        ctx.sendTypedValue(jsBinary, v => v.type, ValueType.Object);
        return jsBinary;
    }

    public visitObjectBindingDeclarations(objectBindingDeclarations: ObjectBindingDeclarations, ctx: SenderContext): J {
        ctx.sendValue(objectBindingDeclarations, v => v.id, ValueType.UUID);
        ctx.sendNode(objectBindingDeclarations, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(objectBindingDeclarations, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(objectBindingDeclarations, v => v.leadingAnnotations, ctx.sendTree, t => t.id);
        ctx.sendNodes(objectBindingDeclarations, v => v.modifiers, ctx.sendTree, t => t.id);
        ctx.sendNode(objectBindingDeclarations, v => v.typeExpression, ctx.sendTree);
        ctx.sendNode(objectBindingDeclarations, v => v.padding.bindings, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(objectBindingDeclarations, v => v.padding.initializer, Visitor.sendLeftPadded(ValueType.Tree));
        return objectBindingDeclarations;
    }

    public visitBinding(binding: ObjectBindingDeclarations.Binding, ctx: SenderContext): J {
        ctx.sendValue(binding, v => v.id, ValueType.UUID);
        ctx.sendNode(binding, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(binding, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(binding, v => v.padding.propertyName, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNode(binding, v => v.name, ctx.sendTree);
        ctx.sendNodes(binding, v => v.dimensionsAfterName, Visitor.sendLeftPadded(ValueType.Object), t => t);
        ctx.sendNode(binding, v => v.afterVararg, Visitor.sendSpace);
        ctx.sendNode(binding, v => v.padding.initializer, Visitor.sendLeftPadded(ValueType.Tree));
        ctx.sendTypedValue(binding, v => v.variableType, ValueType.Object);
        return binding;
    }

    public visitPropertyAssignment(propertyAssignment: PropertyAssignment, ctx: SenderContext): J {
        ctx.sendValue(propertyAssignment, v => v.id, ValueType.UUID);
        ctx.sendNode(propertyAssignment, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(propertyAssignment, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(propertyAssignment, v => v.padding.name, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNode(propertyAssignment, v => v.initializer, ctx.sendTree);
        return propertyAssignment;
    }

    public visitScopedVariableDeclarations(scopedVariableDeclarations: ScopedVariableDeclarations, ctx: SenderContext): J {
        ctx.sendValue(scopedVariableDeclarations, v => v.id, ValueType.UUID);
        ctx.sendNode(scopedVariableDeclarations, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(scopedVariableDeclarations, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(scopedVariableDeclarations, v => v.scope, ValueType.Enum);
        ctx.sendNodes(scopedVariableDeclarations, v => v.padding.variables, Visitor.sendRightPadded(ValueType.Tree), t => t.element.id);
        return scopedVariableDeclarations;
    }

    public visitStatementExpression(statementExpression: StatementExpression, ctx: SenderContext): J {
        ctx.sendValue(statementExpression, v => v.id, ValueType.UUID);
        ctx.sendNode(statementExpression, v => v.statement, ctx.sendTree);
        return statementExpression;
    }

    public visitTemplateExpression(templateExpression: TemplateExpression, ctx: SenderContext): J {
        ctx.sendValue(templateExpression, v => v.id, ValueType.UUID);
        ctx.sendNode(templateExpression, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(templateExpression, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(templateExpression, v => v.delimiter, ValueType.Primitive);
        ctx.sendNode(templateExpression, v => v.padding.tag, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNodes(templateExpression, v => v.strings, ctx.sendTree, t => t.id);
        ctx.sendTypedValue(templateExpression, v => v.type, ValueType.Object);
        return templateExpression;
    }

    public visitTemplateExpressionValue(value: TemplateExpression.Value, ctx: SenderContext): J {
        ctx.sendValue(value, v => v.id, ValueType.UUID);
        ctx.sendNode(value, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(value, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(value, v => v.tree, ctx.sendTree);
        ctx.sendNode(value, v => v.after, Visitor.sendSpace);
        ctx.sendValue(value, v => v.enclosedInBraces, ValueType.Primitive);
        return value;
    }

    public visitTuple(tuple: Tuple, ctx: SenderContext): J {
        ctx.sendValue(tuple, v => v.id, ValueType.UUID);
        ctx.sendNode(tuple, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(tuple, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(tuple, v => v.padding.elements, Visitor.sendContainer(ValueType.Tree));
        ctx.sendTypedValue(tuple, v => v.type, ValueType.Object);
        return tuple;
    }

    public visitTypeDeclaration(typeDeclaration: TypeDeclaration, ctx: SenderContext): J {
        ctx.sendValue(typeDeclaration, v => v.id, ValueType.UUID);
        ctx.sendNode(typeDeclaration, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(typeDeclaration, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(typeDeclaration, v => v.leadingAnnotations, ctx.sendTree, t => t.id);
        ctx.sendNodes(typeDeclaration, v => v.modifiers, ctx.sendTree, t => t.id);
        ctx.sendNode(typeDeclaration, v => v.name, ctx.sendTree);
        ctx.sendNode(typeDeclaration, v => v.typeParameters, ctx.sendTree);
        ctx.sendNode(typeDeclaration, v => v.padding.initializer, Visitor.sendLeftPadded(ValueType.Tree));
        ctx.sendTypedValue(typeDeclaration, v => v.type, ValueType.Object);
        return typeDeclaration;
    }

    public visitTypeOf(typeOf: TypeOf, ctx: SenderContext): J {
        ctx.sendValue(typeOf, v => v.id, ValueType.UUID);
        ctx.sendNode(typeOf, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(typeOf, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(typeOf, v => v.expression, ctx.sendTree);
        ctx.sendTypedValue(typeOf, v => v.type, ValueType.Object);
        return typeOf;
    }

    public visitTypeOperator(typeOperator: TypeOperator, ctx: SenderContext): J {
        ctx.sendValue(typeOperator, v => v.id, ValueType.UUID);
        ctx.sendNode(typeOperator, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(typeOperator, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(typeOperator, v => v.operator, ValueType.Enum);
        ctx.sendNode(typeOperator, v => v.padding.expression, Visitor.sendLeftPadded(ValueType.Tree));
        return typeOperator;
    }

    public visitJsUnary(unary: Unary, ctx: SenderContext): J {
        ctx.sendValue(unary, v => v.id, ValueType.UUID);
        ctx.sendNode(unary, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(unary, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(unary, v => v.padding.operator, Visitor.sendLeftPadded(ValueType.Enum));
        ctx.sendNode(unary, v => v.expression, ctx.sendTree);
        ctx.sendTypedValue(unary, v => v.type, ValueType.Object);
        return unary;
    }

    public visitUnion(union: Union, ctx: SenderContext): J {
        ctx.sendValue(union, v => v.id, ValueType.UUID);
        ctx.sendNode(union, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(union, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(union, v => v.padding.types, Visitor.sendRightPadded(ValueType.Tree), t => t.element.id);
        ctx.sendTypedValue(union, v => v.type, ValueType.Object);
        return union;
    }

    public visitVoid(_void: Void, ctx: SenderContext): J {
        ctx.sendValue(_void, v => v.id, ValueType.UUID);
        ctx.sendNode(_void, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_void, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_void, v => v.expression, ctx.sendTree);
        return _void;
    }

    public visitJsYield(_yield: Yield, ctx: SenderContext): J {
        ctx.sendValue(_yield, v => v.id, ValueType.UUID);
        ctx.sendNode(_yield, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_yield, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(_yield, v => v.delegated, ValueType.Primitive);
        ctx.sendNode(_yield, v => v.expression, ctx.sendTree);
        ctx.sendTypedValue(_yield, v => v.type, ValueType.Object);
        return _yield;
    }

    public visitTypeInfo(typeInfo: TypeInfo, ctx: SenderContext): J {
        ctx.sendValue(typeInfo, v => v.id, ValueType.UUID);
        ctx.sendNode(typeInfo, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(typeInfo, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(typeInfo, v => v.typeIdentifier, ctx.sendTree);
        return typeInfo;
    }

    public visitAnnotatedType(annotatedType: Java.AnnotatedType, ctx: SenderContext): J {
        ctx.sendValue(annotatedType, v => v.id, ValueType.UUID);
        ctx.sendNode(annotatedType, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(annotatedType, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(annotatedType, v => v.annotations, ctx.sendTree, t => t.id);
        ctx.sendNode(annotatedType, v => v.typeExpression, ctx.sendTree);
        return annotatedType;
    }

    public visitAnnotation(annotation: Java.Annotation, ctx: SenderContext): J {
        ctx.sendValue(annotation, v => v.id, ValueType.UUID);
        ctx.sendNode(annotation, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(annotation, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(annotation, v => v.annotationType, ctx.sendTree);
        ctx.sendNode(annotation, v => v.padding.arguments, Visitor.sendContainer(ValueType.Tree));
        return annotation;
    }

    public visitArrayAccess(arrayAccess: Java.ArrayAccess, ctx: SenderContext): J {
        ctx.sendValue(arrayAccess, v => v.id, ValueType.UUID);
        ctx.sendNode(arrayAccess, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(arrayAccess, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(arrayAccess, v => v.indexed, ctx.sendTree);
        ctx.sendNode(arrayAccess, v => v.dimension, ctx.sendTree);
        ctx.sendTypedValue(arrayAccess, v => v.type, ValueType.Object);
        return arrayAccess;
    }

    public visitArrayType(arrayType: Java.ArrayType, ctx: SenderContext): J {
        ctx.sendValue(arrayType, v => v.id, ValueType.UUID);
        ctx.sendNode(arrayType, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(arrayType, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(arrayType, v => v.elementType, ctx.sendTree);
        ctx.sendNodes(arrayType, v => v.annotations, ctx.sendTree, t => t.id);
        ctx.sendNode(arrayType, v => v.dimension, Visitor.sendLeftPadded(ValueType.Object));
        ctx.sendTypedValue(arrayType, v => v.type, ValueType.Object);
        return arrayType;
    }

    public visitAssert(assert: Java.Assert, ctx: SenderContext): J {
        ctx.sendValue(assert, v => v.id, ValueType.UUID);
        ctx.sendNode(assert, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(assert, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(assert, v => v.condition, ctx.sendTree);
        ctx.sendNode(assert, v => v.detail, Visitor.sendLeftPadded(ValueType.Tree));
        return assert;
    }

    public visitAssignment(assignment: Java.Assignment, ctx: SenderContext): J {
        ctx.sendValue(assignment, v => v.id, ValueType.UUID);
        ctx.sendNode(assignment, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(assignment, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(assignment, v => v.variable, ctx.sendTree);
        ctx.sendNode(assignment, v => v.padding.assignment, Visitor.sendLeftPadded(ValueType.Tree));
        ctx.sendTypedValue(assignment, v => v.type, ValueType.Object);
        return assignment;
    }

    public visitAssignmentOperation(assignmentOperation: Java.AssignmentOperation, ctx: SenderContext): J {
        ctx.sendValue(assignmentOperation, v => v.id, ValueType.UUID);
        ctx.sendNode(assignmentOperation, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(assignmentOperation, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(assignmentOperation, v => v.variable, ctx.sendTree);
        ctx.sendNode(assignmentOperation, v => v.padding.operator, Visitor.sendLeftPadded(ValueType.Enum));
        ctx.sendNode(assignmentOperation, v => v.assignment, ctx.sendTree);
        ctx.sendTypedValue(assignmentOperation, v => v.type, ValueType.Object);
        return assignmentOperation;
    }

    public visitBinary(binary: Java.Binary, ctx: SenderContext): J {
        ctx.sendValue(binary, v => v.id, ValueType.UUID);
        ctx.sendNode(binary, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(binary, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(binary, v => v.left, ctx.sendTree);
        ctx.sendNode(binary, v => v.padding.operator, Visitor.sendLeftPadded(ValueType.Enum));
        ctx.sendNode(binary, v => v.right, ctx.sendTree);
        ctx.sendTypedValue(binary, v => v.type, ValueType.Object);
        return binary;
    }

    public visitBlock(block: Java.Block, ctx: SenderContext): J {
        ctx.sendValue(block, v => v.id, ValueType.UUID);
        ctx.sendNode(block, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(block, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(block, v => v.padding.static, Visitor.sendRightPadded(ValueType.Primitive));
        ctx.sendNodes(block, v => v.padding.statements, Visitor.sendRightPadded(ValueType.Tree), t => t.element.id);
        ctx.sendNode(block, v => v.end, Visitor.sendSpace);
        return block;
    }

    public visitBreak(_break: Java.Break, ctx: SenderContext): J {
        ctx.sendValue(_break, v => v.id, ValueType.UUID);
        ctx.sendNode(_break, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_break, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_break, v => v.label, ctx.sendTree);
        return _break;
    }

    public visitCase(_case: Java.Case, ctx: SenderContext): J {
        ctx.sendValue(_case, v => v.id, ValueType.UUID);
        ctx.sendNode(_case, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_case, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(_case, v => v.type, ValueType.Enum);
        ctx.sendNode(_case, v => v.padding.expressions, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(_case, v => v.padding.statements, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(_case, v => v.padding.body, Visitor.sendRightPadded(ValueType.Tree));
        return _case;
    }

    public visitClassDeclaration(classDeclaration: Java.ClassDeclaration, ctx: SenderContext): J {
        ctx.sendValue(classDeclaration, v => v.id, ValueType.UUID);
        ctx.sendNode(classDeclaration, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(classDeclaration, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(classDeclaration, v => v.leadingAnnotations, ctx.sendTree, t => t.id);
        ctx.sendNodes(classDeclaration, v => v.modifiers, ctx.sendTree, t => t.id);
        ctx.sendNode(classDeclaration, v => v.padding.kind, ctx.sendTree);
        ctx.sendNode(classDeclaration, v => v.name, ctx.sendTree);
        ctx.sendNode(classDeclaration, v => v.padding.typeParameters, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(classDeclaration, v => v.padding.primaryConstructor, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(classDeclaration, v => v.padding.extends, Visitor.sendLeftPadded(ValueType.Tree));
        ctx.sendNode(classDeclaration, v => v.padding.implements, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(classDeclaration, v => v.padding.permits, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(classDeclaration, v => v.body, ctx.sendTree);
        ctx.sendTypedValue(classDeclaration, v => v.type, ValueType.Object);
        return classDeclaration;
    }

    public visitClassDeclarationKind(kind: Java.ClassDeclaration.Kind, ctx: SenderContext): J {
        ctx.sendValue(kind, v => v.id, ValueType.UUID);
        ctx.sendNode(kind, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(kind, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(kind, v => v.annotations, ctx.sendTree, t => t.id);
        ctx.sendValue(kind, v => v.type, ValueType.Enum);
        return kind;
    }

    public visitContinue(_continue: Java.Continue, ctx: SenderContext): J {
        ctx.sendValue(_continue, v => v.id, ValueType.UUID);
        ctx.sendNode(_continue, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_continue, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_continue, v => v.label, ctx.sendTree);
        return _continue;
    }

    public visitDoWhileLoop(doWhileLoop: Java.DoWhileLoop, ctx: SenderContext): J {
        ctx.sendValue(doWhileLoop, v => v.id, ValueType.UUID);
        ctx.sendNode(doWhileLoop, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(doWhileLoop, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(doWhileLoop, v => v.padding.body, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNode(doWhileLoop, v => v.padding.whileCondition, Visitor.sendLeftPadded(ValueType.Tree));
        return doWhileLoop;
    }

    public visitEmpty(empty: Java.Empty, ctx: SenderContext): J {
        ctx.sendValue(empty, v => v.id, ValueType.UUID);
        ctx.sendNode(empty, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(empty, v => v.markers, ctx.sendMarkers);
        return empty;
    }

    public visitEnumValue(enumValue: Java.EnumValue, ctx: SenderContext): J {
        ctx.sendValue(enumValue, v => v.id, ValueType.UUID);
        ctx.sendNode(enumValue, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(enumValue, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(enumValue, v => v.annotations, ctx.sendTree, t => t.id);
        ctx.sendNode(enumValue, v => v.name, ctx.sendTree);
        ctx.sendNode(enumValue, v => v.initializer, ctx.sendTree);
        return enumValue;
    }

    public visitEnumValueSet(enumValueSet: Java.EnumValueSet, ctx: SenderContext): J {
        ctx.sendValue(enumValueSet, v => v.id, ValueType.UUID);
        ctx.sendNode(enumValueSet, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(enumValueSet, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(enumValueSet, v => v.padding.enums, Visitor.sendRightPadded(ValueType.Tree), t => t.element.id);
        ctx.sendValue(enumValueSet, v => v.terminatedWithSemicolon, ValueType.Primitive);
        return enumValueSet;
    }

    public visitFieldAccess(fieldAccess: Java.FieldAccess, ctx: SenderContext): J {
        ctx.sendValue(fieldAccess, v => v.id, ValueType.UUID);
        ctx.sendNode(fieldAccess, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(fieldAccess, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(fieldAccess, v => v.target, ctx.sendTree);
        ctx.sendNode(fieldAccess, v => v.padding.name, Visitor.sendLeftPadded(ValueType.Tree));
        ctx.sendTypedValue(fieldAccess, v => v.type, ValueType.Object);
        return fieldAccess;
    }

    public visitForEachLoop(forEachLoop: Java.ForEachLoop, ctx: SenderContext): J {
        ctx.sendValue(forEachLoop, v => v.id, ValueType.UUID);
        ctx.sendNode(forEachLoop, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(forEachLoop, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(forEachLoop, v => v.control, ctx.sendTree);
        ctx.sendNode(forEachLoop, v => v.padding.body, Visitor.sendRightPadded(ValueType.Tree));
        return forEachLoop;
    }

    public visitForEachControl(control: Java.ForEachLoop.Control, ctx: SenderContext): J {
        ctx.sendValue(control, v => v.id, ValueType.UUID);
        ctx.sendNode(control, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(control, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(control, v => v.padding.variable, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNode(control, v => v.padding.iterable, Visitor.sendRightPadded(ValueType.Tree));
        return control;
    }

    public visitForLoop(forLoop: Java.ForLoop, ctx: SenderContext): J {
        ctx.sendValue(forLoop, v => v.id, ValueType.UUID);
        ctx.sendNode(forLoop, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(forLoop, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(forLoop, v => v.control, ctx.sendTree);
        ctx.sendNode(forLoop, v => v.padding.body, Visitor.sendRightPadded(ValueType.Tree));
        return forLoop;
    }

    public visitForControl(control: Java.ForLoop.Control, ctx: SenderContext): J {
        ctx.sendValue(control, v => v.id, ValueType.UUID);
        ctx.sendNode(control, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(control, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(control, v => v.padding.init, Visitor.sendRightPadded(ValueType.Tree), t => t.element.id);
        ctx.sendNode(control, v => v.padding.condition, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNodes(control, v => v.padding.update, Visitor.sendRightPadded(ValueType.Tree), t => t.element.id);
        return control;
    }

    public visitParenthesizedTypeTree(parenthesizedTypeTree: Java.ParenthesizedTypeTree, ctx: SenderContext): J {
        ctx.sendValue(parenthesizedTypeTree, v => v.id, ValueType.UUID);
        ctx.sendNode(parenthesizedTypeTree, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(parenthesizedTypeTree, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(parenthesizedTypeTree, v => v.annotations, ctx.sendTree, t => t.id);
        ctx.sendNode(parenthesizedTypeTree, v => v.parenthesizedType, ctx.sendTree);
        return parenthesizedTypeTree;
    }

    public visitIdentifier(identifier: Java.Identifier, ctx: SenderContext): J {
        ctx.sendValue(identifier, v => v.id, ValueType.UUID);
        ctx.sendNode(identifier, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(identifier, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(identifier, v => v.annotations, ctx.sendTree, t => t.id);
        ctx.sendValue(identifier, v => v.simpleName, ValueType.Primitive);
        ctx.sendTypedValue(identifier, v => v.type, ValueType.Object);
        ctx.sendTypedValue(identifier, v => v.fieldType, ValueType.Object);
        return identifier;
    }

    public visitIf(_if: Java.If, ctx: SenderContext): J {
        ctx.sendValue(_if, v => v.id, ValueType.UUID);
        ctx.sendNode(_if, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_if, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_if, v => v.ifCondition, ctx.sendTree);
        ctx.sendNode(_if, v => v.padding.thenPart, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNode(_if, v => v.elsePart, ctx.sendTree);
        return _if;
    }

    public visitElse(_else: Java.If.Else, ctx: SenderContext): J {
        ctx.sendValue(_else, v => v.id, ValueType.UUID);
        ctx.sendNode(_else, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_else, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_else, v => v.padding.body, Visitor.sendRightPadded(ValueType.Tree));
        return _else;
    }

    public visitImport(_import: Java.Import, ctx: SenderContext): J {
        ctx.sendValue(_import, v => v.id, ValueType.UUID);
        ctx.sendNode(_import, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_import, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_import, v => v.padding.static, Visitor.sendLeftPadded(ValueType.Primitive));
        ctx.sendNode(_import, v => v.qualid, ctx.sendTree);
        ctx.sendNode(_import, v => v.padding.alias, Visitor.sendLeftPadded(ValueType.Tree));
        return _import;
    }

    public visitInstanceOf(instanceOf: Java.InstanceOf, ctx: SenderContext): J {
        ctx.sendValue(instanceOf, v => v.id, ValueType.UUID);
        ctx.sendNode(instanceOf, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(instanceOf, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(instanceOf, v => v.padding.expression, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNode(instanceOf, v => v.clazz, ctx.sendTree);
        ctx.sendNode(instanceOf, v => v.pattern, ctx.sendTree);
        ctx.sendTypedValue(instanceOf, v => v.type, ValueType.Object);
        return instanceOf;
    }

    public visitIntersectionType(intersectionType: Java.IntersectionType, ctx: SenderContext): J {
        ctx.sendValue(intersectionType, v => v.id, ValueType.UUID);
        ctx.sendNode(intersectionType, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(intersectionType, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(intersectionType, v => v.padding.bounds, Visitor.sendContainer(ValueType.Tree));
        return intersectionType;
    }

    public visitLabel(label: Java.Label, ctx: SenderContext): J {
        ctx.sendValue(label, v => v.id, ValueType.UUID);
        ctx.sendNode(label, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(label, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(label, v => v.padding.label, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNode(label, v => v.statement, ctx.sendTree);
        return label;
    }

    public visitLambda(lambda: Java.Lambda, ctx: SenderContext): J {
        ctx.sendValue(lambda, v => v.id, ValueType.UUID);
        ctx.sendNode(lambda, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(lambda, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(lambda, v => v.parameters, ctx.sendTree);
        ctx.sendNode(lambda, v => v.arrow, Visitor.sendSpace);
        ctx.sendNode(lambda, v => v.body, ctx.sendTree);
        ctx.sendTypedValue(lambda, v => v.type, ValueType.Object);
        return lambda;
    }

    public visitLambdaParameters(parameters: Java.Lambda.Parameters, ctx: SenderContext): J {
        ctx.sendValue(parameters, v => v.id, ValueType.UUID);
        ctx.sendNode(parameters, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(parameters, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(parameters, v => v.parenthesized, ValueType.Primitive);
        ctx.sendNodes(parameters, v => v.padding.parameters, Visitor.sendRightPadded(ValueType.Tree), t => t.element.id);
        return parameters;
    }

    public visitLiteral(literal: Java.Literal, ctx: SenderContext): J {
        ctx.sendValue(literal, v => v.id, ValueType.UUID);
        ctx.sendNode(literal, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(literal, v => v.markers, ctx.sendMarkers);
        ctx.sendTypedValue(literal, v => v.value, ValueType.Object);
        ctx.sendValue(literal, v => v.valueSource, ValueType.Primitive);
        ctx.sendValues(literal, v => v.unicodeEscapes, x => x, ValueType.Object);
        ctx.sendValue(literal, v => v.type, ValueType.Enum);
        return literal;
    }

    public visitMemberReference(memberReference: Java.MemberReference, ctx: SenderContext): J {
        ctx.sendValue(memberReference, v => v.id, ValueType.UUID);
        ctx.sendNode(memberReference, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(memberReference, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(memberReference, v => v.padding.containing, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNode(memberReference, v => v.padding.typeParameters, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(memberReference, v => v.padding.reference, Visitor.sendLeftPadded(ValueType.Tree));
        ctx.sendTypedValue(memberReference, v => v.type, ValueType.Object);
        ctx.sendTypedValue(memberReference, v => v.methodType, ValueType.Object);
        ctx.sendTypedValue(memberReference, v => v.variableType, ValueType.Object);
        return memberReference;
    }

    public visitMethodDeclaration(methodDeclaration: Java.MethodDeclaration, ctx: SenderContext): J {
        ctx.sendValue(methodDeclaration, v => v.id, ValueType.UUID);
        ctx.sendNode(methodDeclaration, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(methodDeclaration, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(methodDeclaration, v => v.leadingAnnotations, ctx.sendTree, t => t.id);
        ctx.sendNodes(methodDeclaration, v => v.modifiers, ctx.sendTree, t => t.id);
        ctx.sendNode(methodDeclaration, v => v.annotations.typeParameters, ctx.sendTree);
        ctx.sendNode(methodDeclaration, v => v.returnTypeExpression, ctx.sendTree);
        ctx.sendNode(methodDeclaration, v => v.annotations.name, this.sendMethodIdentifierWithAnnotations);
        ctx.sendNode(methodDeclaration, v => v.padding.parameters, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(methodDeclaration, v => v.padding.throws, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(methodDeclaration, v => v.body, ctx.sendTree);
        ctx.sendNode(methodDeclaration, v => v.padding.defaultValue, Visitor.sendLeftPadded(ValueType.Tree));
        ctx.sendTypedValue(methodDeclaration, v => v.methodType, ValueType.Object);
        return methodDeclaration;
    }

    private sendMethodIdentifierWithAnnotations(identifierWithAnnotations: Java.MethodDeclaration.IdentifierWithAnnotations, ctx: SenderContext): void {
        ctx.sendNode(identifierWithAnnotations, v => v.identifier, ctx.sendTree);
        ctx.sendNodes(identifierWithAnnotations, v => v.annotations, ctx.sendTree, v => v.id);
    }

    public visitMethodInvocation(methodInvocation: Java.MethodInvocation, ctx: SenderContext): J {
        ctx.sendValue(methodInvocation, v => v.id, ValueType.UUID);
        ctx.sendNode(methodInvocation, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(methodInvocation, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(methodInvocation, v => v.padding.select, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNode(methodInvocation, v => v.padding.typeParameters, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(methodInvocation, v => v.name, ctx.sendTree);
        ctx.sendNode(methodInvocation, v => v.padding.arguments, Visitor.sendContainer(ValueType.Tree));
        ctx.sendTypedValue(methodInvocation, v => v.methodType, ValueType.Object);
        return methodInvocation;
    }

    public visitModifier(modifier: Java.Modifier, ctx: SenderContext): J {
        ctx.sendValue(modifier, v => v.id, ValueType.UUID);
        ctx.sendNode(modifier, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(modifier, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(modifier, v => v.keyword, ValueType.Primitive);
        ctx.sendValue(modifier, v => v.type, ValueType.Enum);
        ctx.sendNodes(modifier, v => v.annotations, ctx.sendTree, t => t.id);
        return modifier;
    }

    public visitMultiCatch(multiCatch: Java.MultiCatch, ctx: SenderContext): J {
        ctx.sendValue(multiCatch, v => v.id, ValueType.UUID);
        ctx.sendNode(multiCatch, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(multiCatch, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(multiCatch, v => v.padding.alternatives, Visitor.sendRightPadded(ValueType.Tree), t => t.element.id);
        return multiCatch;
    }

    public visitNewArray(newArray: Java.NewArray, ctx: SenderContext): J {
        ctx.sendValue(newArray, v => v.id, ValueType.UUID);
        ctx.sendNode(newArray, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(newArray, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(newArray, v => v.typeExpression, ctx.sendTree);
        ctx.sendNodes(newArray, v => v.dimensions, ctx.sendTree, t => t.id);
        ctx.sendNode(newArray, v => v.padding.initializer, Visitor.sendContainer(ValueType.Tree));
        ctx.sendTypedValue(newArray, v => v.type, ValueType.Object);
        return newArray;
    }

    public visitArrayDimension(arrayDimension: Java.ArrayDimension, ctx: SenderContext): J {
        ctx.sendValue(arrayDimension, v => v.id, ValueType.UUID);
        ctx.sendNode(arrayDimension, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(arrayDimension, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(arrayDimension, v => v.padding.index, Visitor.sendRightPadded(ValueType.Tree));
        return arrayDimension;
    }

    public visitNewClass(newClass: Java.NewClass, ctx: SenderContext): J {
        ctx.sendValue(newClass, v => v.id, ValueType.UUID);
        ctx.sendNode(newClass, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(newClass, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(newClass, v => v.padding.enclosing, Visitor.sendRightPadded(ValueType.Tree));
        ctx.sendNode(newClass, v => v.new, Visitor.sendSpace);
        ctx.sendNode(newClass, v => v.clazz, ctx.sendTree);
        ctx.sendNode(newClass, v => v.padding.arguments, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(newClass, v => v.body, ctx.sendTree);
        ctx.sendTypedValue(newClass, v => v.constructorType, ValueType.Object);
        return newClass;
    }

    public visitNullableType(nullableType: Java.NullableType, ctx: SenderContext): J {
        ctx.sendValue(nullableType, v => v.id, ValueType.UUID);
        ctx.sendNode(nullableType, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(nullableType, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(nullableType, v => v.annotations, ctx.sendTree, t => t.id);
        ctx.sendNode(nullableType, v => v.padding.typeTree, Visitor.sendRightPadded(ValueType.Tree));
        return nullableType;
    }

    public visitPackage(_package: Java.Package, ctx: SenderContext): J {
        ctx.sendValue(_package, v => v.id, ValueType.UUID);
        ctx.sendNode(_package, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_package, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_package, v => v.expression, ctx.sendTree);
        ctx.sendNodes(_package, v => v.annotations, ctx.sendTree, t => t.id);
        return _package;
    }

    public visitParameterizedType(parameterizedType: Java.ParameterizedType, ctx: SenderContext): J {
        ctx.sendValue(parameterizedType, v => v.id, ValueType.UUID);
        ctx.sendNode(parameterizedType, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(parameterizedType, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(parameterizedType, v => v.clazz, ctx.sendTree);
        ctx.sendNode(parameterizedType, v => v.padding.typeParameters, Visitor.sendContainer(ValueType.Tree));
        ctx.sendTypedValue(parameterizedType, v => v.type, ValueType.Object);
        return parameterizedType;
    }

    public visitParentheses<J2 extends J>(parentheses: Java.Parentheses<J2>, ctx: SenderContext): J {
        ctx.sendValue(parentheses, v => v.id, ValueType.UUID);
        ctx.sendNode(parentheses, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(parentheses, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(parentheses, v => v.padding.tree, Visitor.sendRightPadded(ValueType.Tree));
        return parentheses;
    }

    public visitControlParentheses<J2 extends J>(controlParentheses: Java.ControlParentheses<J2>, ctx: SenderContext): J {
        ctx.sendValue(controlParentheses, v => v.id, ValueType.UUID);
        ctx.sendNode(controlParentheses, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(controlParentheses, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(controlParentheses, v => v.padding.tree, Visitor.sendRightPadded(ValueType.Tree));
        return controlParentheses;
    }

    public visitPrimitive(primitive: Java.Primitive, ctx: SenderContext): J {
        ctx.sendValue(primitive, v => v.id, ValueType.UUID);
        ctx.sendNode(primitive, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(primitive, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(primitive, v => v.type, ValueType.Enum);
        return primitive;
    }

    public visitReturn(_return: Java.Return, ctx: SenderContext): J {
        ctx.sendValue(_return, v => v.id, ValueType.UUID);
        ctx.sendNode(_return, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_return, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_return, v => v.expression, ctx.sendTree);
        return _return;
    }

    public visitSwitch(_switch: Java.Switch, ctx: SenderContext): J {
        ctx.sendValue(_switch, v => v.id, ValueType.UUID);
        ctx.sendNode(_switch, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_switch, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_switch, v => v.selector, ctx.sendTree);
        ctx.sendNode(_switch, v => v.cases, ctx.sendTree);
        return _switch;
    }

    public visitSwitchExpression(switchExpression: Java.SwitchExpression, ctx: SenderContext): J {
        ctx.sendValue(switchExpression, v => v.id, ValueType.UUID);
        ctx.sendNode(switchExpression, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(switchExpression, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(switchExpression, v => v.selector, ctx.sendTree);
        ctx.sendNode(switchExpression, v => v.cases, ctx.sendTree);
        return switchExpression;
    }

    public visitSynchronized(synchronized: Java.Synchronized, ctx: SenderContext): J {
        ctx.sendValue(synchronized, v => v.id, ValueType.UUID);
        ctx.sendNode(synchronized, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(synchronized, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(synchronized, v => v.lock, ctx.sendTree);
        ctx.sendNode(synchronized, v => v.body, ctx.sendTree);
        return synchronized;
    }

    public visitTernary(ternary: Java.Ternary, ctx: SenderContext): J {
        ctx.sendValue(ternary, v => v.id, ValueType.UUID);
        ctx.sendNode(ternary, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(ternary, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(ternary, v => v.condition, ctx.sendTree);
        ctx.sendNode(ternary, v => v.padding.truePart, Visitor.sendLeftPadded(ValueType.Tree));
        ctx.sendNode(ternary, v => v.padding.falsePart, Visitor.sendLeftPadded(ValueType.Tree));
        ctx.sendTypedValue(ternary, v => v.type, ValueType.Object);
        return ternary;
    }

    public visitThrow(_throw: Java.Throw, ctx: SenderContext): J {
        ctx.sendValue(_throw, v => v.id, ValueType.UUID);
        ctx.sendNode(_throw, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_throw, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_throw, v => v.exception, ctx.sendTree);
        return _throw;
    }

    public visitTry(_try: Java.Try, ctx: SenderContext): J {
        ctx.sendValue(_try, v => v.id, ValueType.UUID);
        ctx.sendNode(_try, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_try, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_try, v => v.padding.resources, Visitor.sendContainer(ValueType.Tree));
        ctx.sendNode(_try, v => v.body, ctx.sendTree);
        ctx.sendNodes(_try, v => v.catches, ctx.sendTree, t => t.id);
        ctx.sendNode(_try, v => v.padding.finally, Visitor.sendLeftPadded(ValueType.Tree));
        return _try;
    }

    public visitTryResource(resource: Java.Try.Resource, ctx: SenderContext): J {
        ctx.sendValue(resource, v => v.id, ValueType.UUID);
        ctx.sendNode(resource, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(resource, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(resource, v => v.variableDeclarations, ctx.sendTree);
        ctx.sendValue(resource, v => v.terminatedWithSemicolon, ValueType.Primitive);
        return resource;
    }

    public visitCatch(_catch: Java.Try.Catch, ctx: SenderContext): J {
        ctx.sendValue(_catch, v => v.id, ValueType.UUID);
        ctx.sendNode(_catch, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_catch, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(_catch, v => v.parameter, ctx.sendTree);
        ctx.sendNode(_catch, v => v.body, ctx.sendTree);
        return _catch;
    }

    public visitTypeCast(typeCast: Java.TypeCast, ctx: SenderContext): J {
        ctx.sendValue(typeCast, v => v.id, ValueType.UUID);
        ctx.sendNode(typeCast, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(typeCast, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(typeCast, v => v.clazz, ctx.sendTree);
        ctx.sendNode(typeCast, v => v.expression, ctx.sendTree);
        return typeCast;
    }

    public visitTypeParameter(typeParameter: Java.TypeParameter, ctx: SenderContext): J {
        ctx.sendValue(typeParameter, v => v.id, ValueType.UUID);
        ctx.sendNode(typeParameter, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(typeParameter, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(typeParameter, v => v.annotations, ctx.sendTree, t => t.id);
        ctx.sendNodes(typeParameter, v => v.modifiers, ctx.sendTree, t => t.id);
        ctx.sendNode(typeParameter, v => v.name, ctx.sendTree);
        ctx.sendNode(typeParameter, v => v.padding.bounds, Visitor.sendContainer(ValueType.Tree));
        return typeParameter;
    }

    public visitTypeParameters(typeParameters: Java.TypeParameters, ctx: SenderContext): J {
        ctx.sendValue(typeParameters, v => v.id, ValueType.UUID);
        ctx.sendNode(typeParameters, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(typeParameters, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(typeParameters, v => v.annotations, ctx.sendTree, t => t.id);
        ctx.sendNodes(typeParameters, v => v.padding.typeParameters, Visitor.sendRightPadded(ValueType.Tree), t => t.element.id);
        return typeParameters;
    }

    public visitUnary(unary: Java.Unary, ctx: SenderContext): J {
        ctx.sendValue(unary, v => v.id, ValueType.UUID);
        ctx.sendNode(unary, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(unary, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(unary, v => v.padding.operator, Visitor.sendLeftPadded(ValueType.Enum));
        ctx.sendNode(unary, v => v.expression, ctx.sendTree);
        ctx.sendTypedValue(unary, v => v.type, ValueType.Object);
        return unary;
    }

    public visitVariableDeclarations(variableDeclarations: Java.VariableDeclarations, ctx: SenderContext): J {
        ctx.sendValue(variableDeclarations, v => v.id, ValueType.UUID);
        ctx.sendNode(variableDeclarations, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(variableDeclarations, v => v.markers, ctx.sendMarkers);
        ctx.sendNodes(variableDeclarations, v => v.leadingAnnotations, ctx.sendTree, t => t.id);
        ctx.sendNodes(variableDeclarations, v => v.modifiers, ctx.sendTree, t => t.id);
        ctx.sendNode(variableDeclarations, v => v.typeExpression, ctx.sendTree);
        ctx.sendNode(variableDeclarations, v => v.varargs, Visitor.sendSpace);
        ctx.sendNodes(variableDeclarations, v => v.dimensionsBeforeName, Visitor.sendLeftPadded(ValueType.Object), t => t);
        ctx.sendNodes(variableDeclarations, v => v.padding.variables, Visitor.sendRightPadded(ValueType.Tree), t => t.element.id);
        return variableDeclarations;
    }

    public visitVariable(namedVariable: Java.VariableDeclarations.NamedVariable, ctx: SenderContext): J {
        ctx.sendValue(namedVariable, v => v.id, ValueType.UUID);
        ctx.sendNode(namedVariable, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(namedVariable, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(namedVariable, v => v.name, ctx.sendTree);
        ctx.sendNodes(namedVariable, v => v.dimensionsAfterName, Visitor.sendLeftPadded(ValueType.Object), t => t);
        ctx.sendNode(namedVariable, v => v.padding.initializer, Visitor.sendLeftPadded(ValueType.Tree));
        ctx.sendTypedValue(namedVariable, v => v.variableType, ValueType.Object);
        return namedVariable;
    }

    public visitWhileLoop(whileLoop: Java.WhileLoop, ctx: SenderContext): J {
        ctx.sendValue(whileLoop, v => v.id, ValueType.UUID);
        ctx.sendNode(whileLoop, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(whileLoop, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(whileLoop, v => v.condition, ctx.sendTree);
        ctx.sendNode(whileLoop, v => v.padding.body, Visitor.sendRightPadded(ValueType.Tree));
        return whileLoop;
    }

    public visitWildcard(wildcard: Java.Wildcard, ctx: SenderContext): J {
        ctx.sendValue(wildcard, v => v.id, ValueType.UUID);
        ctx.sendNode(wildcard, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(wildcard, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(wildcard, v => v.padding.bound, Visitor.sendLeftPadded(ValueType.Enum));
        ctx.sendNode(wildcard, v => v.boundedType, ctx.sendTree);
        return wildcard;
    }

    public visitYield(_yield: Java.Yield, ctx: SenderContext): J {
        ctx.sendValue(_yield, v => v.id, ValueType.UUID);
        ctx.sendNode(_yield, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(_yield, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(_yield, v => v.implicit, ValueType.Primitive);
        ctx.sendNode(_yield, v => v.value, ctx.sendTree);
        return _yield;
    }

    public visitUnknown(unknown: Java.Unknown, ctx: SenderContext): J {
        ctx.sendValue(unknown, v => v.id, ValueType.UUID);
        ctx.sendNode(unknown, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(unknown, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(unknown, v => v.source, ctx.sendTree);
        return unknown;
    }

    public visitUnknownSource(source: Java.Unknown.Source, ctx: SenderContext): J {
        ctx.sendValue(source, v => v.id, ValueType.UUID);
        ctx.sendNode(source, v => v.prefix, Visitor.sendSpace);
        ctx.sendNode(source, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(source, v => v.text, ValueType.Primitive);
        return source;
    }

    private static sendContainer<T>(type: ValueType): (container: JContainer<T>, ctx: SenderContext) => void {
        return extensions.sendContainer(type);
    }

    private static sendLeftPadded<T>(type: ValueType): (leftPadded: JLeftPadded<T>, ctx: SenderContext) => void {
        return extensions.sendLeftPadded(type);
    }

    private static sendRightPadded<T>(type: ValueType): (rightPadded: JRightPadded<T>, ctx: SenderContext) => void {
        return extensions.sendRightPadded(type);
    }

    private static sendSpace(space: Space, ctx: SenderContext) {
        extensions.sendSpace(space, ctx);
    }

}
