import * as extensions from "./remote_extensions";
import {Checksum, Cursor, FileAttributes, ListUtils, Tree} from '../../core';
import {DetailsReceiver, Receiver, ReceiverContext, ReceiverFactory, ValueType} from '@openrewrite/rewrite-remote';
import {JavaVisitor} from '../visitor';
import {J, Comment, Expression, JavaSourceFile, JavaType, JContainer, JLeftPadded, JRightPadded, Loop, MethodCall, NameTree, Space, Statement, TextComment, TypedTree, TypeTree, AnnotatedType, Annotation, ArrayAccess, ArrayType, Assert, Assignment, AssignmentOperation, Binary, Block, Break, Case, ClassDeclaration, CompilationUnit, Continue, DoWhileLoop, Empty, EnumValue, EnumValueSet, FieldAccess, ForEachLoop, ForLoop, ParenthesizedTypeTree, Identifier, If, Import, InstanceOf, IntersectionType, Label, Lambda, Literal, MemberReference, MethodDeclaration, MethodInvocation, Modifier, MultiCatch, NewArray, ArrayDimension, NewClass, NullableType, Package, ParameterizedType, Parentheses, ControlParentheses, Primitive, Return, Switch, SwitchExpression, Synchronized, Ternary, Throw, Try, TypeCast, TypeParameter, TypeParameters, Unary, VariableDeclarations, WhileLoop, Wildcard, Yield, Unknown} from '../tree';
import * as Java from "../tree";

export class JavaReceiver implements Receiver<J> {
    public fork(ctx: ReceiverContext): ReceiverContext {
        return ctx.fork(new Visitor(), new Factory());
    }

    public receive(before: J | null, ctx: ReceiverContext): Tree {
        let forked = this.fork(ctx);
        return forked.visitor!.visit(before, forked)!;
    }
}

class Visitor extends JavaVisitor<ReceiverContext> {
    public visit(tree: Tree | null, ctx: ReceiverContext): J | null {
        this.cursor = new Cursor(this.cursor, tree!);

        tree = ctx.receiveNode(tree as (J | null), ctx.receiveTree);

        this.cursor = this.cursor.parent!;
        return tree as (J | null);
    }

    public visitAnnotatedType(annotatedType: AnnotatedType, ctx: ReceiverContext): J {
        annotatedType = annotatedType.withId(ctx.receiveValue(annotatedType.id, ValueType.UUID)!);
        annotatedType = annotatedType.withPrefix(ctx.receiveNode(annotatedType.prefix, receiveSpace)!);
        annotatedType = annotatedType.withMarkers(ctx.receiveNode(annotatedType.markers, ctx.receiveMarkers)!);
        annotatedType = annotatedType.withAnnotations(ctx.receiveNodes(annotatedType.annotations, ctx.receiveTree)!);
        annotatedType = annotatedType.withTypeExpression(ctx.receiveNode(annotatedType.typeExpression, ctx.receiveTree)!);
        return annotatedType;
    }

    public visitAnnotation(annotation: Annotation, ctx: ReceiverContext): J {
        annotation = annotation.withId(ctx.receiveValue(annotation.id, ValueType.UUID)!);
        annotation = annotation.withPrefix(ctx.receiveNode(annotation.prefix, receiveSpace)!);
        annotation = annotation.withMarkers(ctx.receiveNode(annotation.markers, ctx.receiveMarkers)!);
        annotation = annotation.withAnnotationType(ctx.receiveNode(annotation.annotationType, ctx.receiveTree)!);
        annotation = annotation.padding.withArguments(ctx.receiveNode(annotation.padding.arguments, receiveContainer));
        return annotation;
    }

    public visitArrayAccess(arrayAccess: ArrayAccess, ctx: ReceiverContext): J {
        arrayAccess = arrayAccess.withId(ctx.receiveValue(arrayAccess.id, ValueType.UUID)!);
        arrayAccess = arrayAccess.withPrefix(ctx.receiveNode(arrayAccess.prefix, receiveSpace)!);
        arrayAccess = arrayAccess.withMarkers(ctx.receiveNode(arrayAccess.markers, ctx.receiveMarkers)!);
        arrayAccess = arrayAccess.withIndexed(ctx.receiveNode(arrayAccess.indexed, ctx.receiveTree)!);
        arrayAccess = arrayAccess.withDimension(ctx.receiveNode(arrayAccess.dimension, ctx.receiveTree)!);
        arrayAccess = arrayAccess.withType(ctx.receiveValue(arrayAccess.type, ValueType.Object));
        return arrayAccess;
    }

    public visitArrayType(arrayType: ArrayType, ctx: ReceiverContext): J {
        arrayType = arrayType.withId(ctx.receiveValue(arrayType.id, ValueType.UUID)!);
        arrayType = arrayType.withPrefix(ctx.receiveNode(arrayType.prefix, receiveSpace)!);
        arrayType = arrayType.withMarkers(ctx.receiveNode(arrayType.markers, ctx.receiveMarkers)!);
        arrayType = arrayType.withElementType(ctx.receiveNode(arrayType.elementType, ctx.receiveTree)!);
        arrayType = arrayType.withAnnotations(ctx.receiveNodes(arrayType.annotations, ctx.receiveTree));
        arrayType = arrayType.withDimension(ctx.receiveNode(arrayType.dimension, leftPaddedNodeReceiver(Space)));
        arrayType = arrayType.withType(ctx.receiveValue(arrayType.type, ValueType.Object)!);
        return arrayType;
    }

    public visitAssert(assert: Assert, ctx: ReceiverContext): J {
        assert = assert.withId(ctx.receiveValue(assert.id, ValueType.UUID)!);
        assert = assert.withPrefix(ctx.receiveNode(assert.prefix, receiveSpace)!);
        assert = assert.withMarkers(ctx.receiveNode(assert.markers, ctx.receiveMarkers)!);
        assert = assert.withCondition(ctx.receiveNode(assert.condition, ctx.receiveTree)!);
        assert = assert.withDetail(ctx.receiveNode(assert.detail, receiveLeftPaddedTree));
        return assert;
    }

    public visitAssignment(assignment: Assignment, ctx: ReceiverContext): J {
        assignment = assignment.withId(ctx.receiveValue(assignment.id, ValueType.UUID)!);
        assignment = assignment.withPrefix(ctx.receiveNode(assignment.prefix, receiveSpace)!);
        assignment = assignment.withMarkers(ctx.receiveNode(assignment.markers, ctx.receiveMarkers)!);
        assignment = assignment.withVariable(ctx.receiveNode(assignment.variable, ctx.receiveTree)!);
        assignment = assignment.padding.withAssignment(ctx.receiveNode(assignment.padding.assignment, receiveLeftPaddedTree)!);
        assignment = assignment.withType(ctx.receiveValue(assignment.type, ValueType.Object));
        return assignment;
    }

    public visitAssignmentOperation(assignmentOperation: AssignmentOperation, ctx: ReceiverContext): J {
        assignmentOperation = assignmentOperation.withId(ctx.receiveValue(assignmentOperation.id, ValueType.UUID)!);
        assignmentOperation = assignmentOperation.withPrefix(ctx.receiveNode(assignmentOperation.prefix, receiveSpace)!);
        assignmentOperation = assignmentOperation.withMarkers(ctx.receiveNode(assignmentOperation.markers, ctx.receiveMarkers)!);
        assignmentOperation = assignmentOperation.withVariable(ctx.receiveNode(assignmentOperation.variable, ctx.receiveTree)!);
        assignmentOperation = assignmentOperation.padding.withOperator(ctx.receiveNode(assignmentOperation.padding.operator, leftPaddedValueReceiver(ValueType.Enum))!);
        assignmentOperation = assignmentOperation.withAssignment(ctx.receiveNode(assignmentOperation.assignment, ctx.receiveTree)!);
        assignmentOperation = assignmentOperation.withType(ctx.receiveValue(assignmentOperation.type, ValueType.Object));
        return assignmentOperation;
    }

    public visitBinary(binary: Binary, ctx: ReceiverContext): J {
        binary = binary.withId(ctx.receiveValue(binary.id, ValueType.UUID)!);
        binary = binary.withPrefix(ctx.receiveNode(binary.prefix, receiveSpace)!);
        binary = binary.withMarkers(ctx.receiveNode(binary.markers, ctx.receiveMarkers)!);
        binary = binary.withLeft(ctx.receiveNode(binary.left, ctx.receiveTree)!);
        binary = binary.padding.withOperator(ctx.receiveNode(binary.padding.operator, leftPaddedValueReceiver(ValueType.Enum))!);
        binary = binary.withRight(ctx.receiveNode(binary.right, ctx.receiveTree)!);
        binary = binary.withType(ctx.receiveValue(binary.type, ValueType.Object));
        return binary;
    }

    public visitBlock(block: Block, ctx: ReceiverContext): J {
        block = block.withId(ctx.receiveValue(block.id, ValueType.UUID)!);
        block = block.withPrefix(ctx.receiveNode(block.prefix, receiveSpace)!);
        block = block.withMarkers(ctx.receiveNode(block.markers, ctx.receiveMarkers)!);
        block = block.padding.withStatic(ctx.receiveNode(block.padding.static, rightPaddedValueReceiver(ValueType.Primitive))!);
        block = block.padding.withStatements(ctx.receiveNodes(block.padding.statements, receiveRightPaddedTree)!);
        block = block.withEnd(ctx.receiveNode(block.end, receiveSpace)!);
        return block;
    }

    public visitBreak(_break: Break, ctx: ReceiverContext): J {
        _break = _break.withId(ctx.receiveValue(_break.id, ValueType.UUID)!);
        _break = _break.withPrefix(ctx.receiveNode(_break.prefix, receiveSpace)!);
        _break = _break.withMarkers(ctx.receiveNode(_break.markers, ctx.receiveMarkers)!);
        _break = _break.withLabel(ctx.receiveNode(_break.label, ctx.receiveTree));
        return _break;
    }

    public visitCase(_case: Case, ctx: ReceiverContext): J {
        _case = _case.withId(ctx.receiveValue(_case.id, ValueType.UUID)!);
        _case = _case.withPrefix(ctx.receiveNode(_case.prefix, receiveSpace)!);
        _case = _case.withMarkers(ctx.receiveNode(_case.markers, ctx.receiveMarkers)!);
        _case = _case.withType(ctx.receiveValue(_case.type, ValueType.Enum)!);
        _case = _case.padding.withExpressions(ctx.receiveNode(_case.padding.expressions, receiveContainer)!);
        _case = _case.padding.withStatements(ctx.receiveNode(_case.padding.statements, receiveContainer)!);
        _case = _case.padding.withBody(ctx.receiveNode(_case.padding.body, receiveRightPaddedTree));
        return _case;
    }

    public visitClassDeclaration(classDeclaration: ClassDeclaration, ctx: ReceiverContext): J {
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

    public visitClassDeclarationKind(kind: ClassDeclaration.Kind, ctx: ReceiverContext): J {
        kind = kind.withId(ctx.receiveValue(kind.id, ValueType.UUID)!);
        kind = kind.withPrefix(ctx.receiveNode(kind.prefix, receiveSpace)!);
        kind = kind.withMarkers(ctx.receiveNode(kind.markers, ctx.receiveMarkers)!);
        kind = kind.withAnnotations(ctx.receiveNodes(kind.annotations, ctx.receiveTree)!);
        kind = kind.withType(ctx.receiveValue(kind.type, ValueType.Enum)!);
        return kind;
    }

    public visitCompilationUnit(compilationUnit: CompilationUnit, ctx: ReceiverContext): J {
        compilationUnit = compilationUnit.withId(ctx.receiveValue(compilationUnit.id, ValueType.UUID)!);
        compilationUnit = compilationUnit.withPrefix(ctx.receiveNode(compilationUnit.prefix, receiveSpace)!);
        compilationUnit = compilationUnit.withMarkers(ctx.receiveNode(compilationUnit.markers, ctx.receiveMarkers)!);
        compilationUnit = compilationUnit.withSourcePath(ctx.receiveValue(compilationUnit.sourcePath, ValueType.Primitive)!);
        compilationUnit = compilationUnit.withFileAttributes(ctx.receiveValue(compilationUnit.fileAttributes, ValueType.Object));
        compilationUnit = compilationUnit.withCharsetName(ctx.receiveValue(compilationUnit.charsetName, ValueType.Primitive));
        compilationUnit = compilationUnit.withCharsetBomMarked(ctx.receiveValue(compilationUnit.charsetBomMarked, ValueType.Primitive)!);
        compilationUnit = compilationUnit.withChecksum(ctx.receiveValue(compilationUnit.checksum, ValueType.Object));
        compilationUnit = compilationUnit.padding.withPackageDeclaration(ctx.receiveNode(compilationUnit.padding.packageDeclaration, receiveRightPaddedTree));
        compilationUnit = compilationUnit.padding.withImports(ctx.receiveNodes(compilationUnit.padding.imports, receiveRightPaddedTree)!);
        compilationUnit = compilationUnit.withClasses(ctx.receiveNodes(compilationUnit.classes, ctx.receiveTree)!);
        compilationUnit = compilationUnit.withEof(ctx.receiveNode(compilationUnit.eof, receiveSpace)!);
        return compilationUnit;
    }

    public visitContinue(_continue: Continue, ctx: ReceiverContext): J {
        _continue = _continue.withId(ctx.receiveValue(_continue.id, ValueType.UUID)!);
        _continue = _continue.withPrefix(ctx.receiveNode(_continue.prefix, receiveSpace)!);
        _continue = _continue.withMarkers(ctx.receiveNode(_continue.markers, ctx.receiveMarkers)!);
        _continue = _continue.withLabel(ctx.receiveNode(_continue.label, ctx.receiveTree));
        return _continue;
    }

    public visitDoWhileLoop(doWhileLoop: DoWhileLoop, ctx: ReceiverContext): J {
        doWhileLoop = doWhileLoop.withId(ctx.receiveValue(doWhileLoop.id, ValueType.UUID)!);
        doWhileLoop = doWhileLoop.withPrefix(ctx.receiveNode(doWhileLoop.prefix, receiveSpace)!);
        doWhileLoop = doWhileLoop.withMarkers(ctx.receiveNode(doWhileLoop.markers, ctx.receiveMarkers)!);
        doWhileLoop = doWhileLoop.padding.withBody(ctx.receiveNode(doWhileLoop.padding.body, receiveRightPaddedTree)!);
        doWhileLoop = doWhileLoop.padding.withWhileCondition(ctx.receiveNode(doWhileLoop.padding.whileCondition, receiveLeftPaddedTree)!);
        return doWhileLoop;
    }

    public visitEmpty(empty: Empty, ctx: ReceiverContext): J {
        empty = empty.withId(ctx.receiveValue(empty.id, ValueType.UUID)!);
        empty = empty.withPrefix(ctx.receiveNode(empty.prefix, receiveSpace)!);
        empty = empty.withMarkers(ctx.receiveNode(empty.markers, ctx.receiveMarkers)!);
        return empty;
    }

    public visitEnumValue(enumValue: EnumValue, ctx: ReceiverContext): J {
        enumValue = enumValue.withId(ctx.receiveValue(enumValue.id, ValueType.UUID)!);
        enumValue = enumValue.withPrefix(ctx.receiveNode(enumValue.prefix, receiveSpace)!);
        enumValue = enumValue.withMarkers(ctx.receiveNode(enumValue.markers, ctx.receiveMarkers)!);
        enumValue = enumValue.withAnnotations(ctx.receiveNodes(enumValue.annotations, ctx.receiveTree)!);
        enumValue = enumValue.withName(ctx.receiveNode(enumValue.name, ctx.receiveTree)!);
        enumValue = enumValue.withInitializer(ctx.receiveNode(enumValue.initializer, ctx.receiveTree));
        return enumValue;
    }

    public visitEnumValueSet(enumValueSet: EnumValueSet, ctx: ReceiverContext): J {
        enumValueSet = enumValueSet.withId(ctx.receiveValue(enumValueSet.id, ValueType.UUID)!);
        enumValueSet = enumValueSet.withPrefix(ctx.receiveNode(enumValueSet.prefix, receiveSpace)!);
        enumValueSet = enumValueSet.withMarkers(ctx.receiveNode(enumValueSet.markers, ctx.receiveMarkers)!);
        enumValueSet = enumValueSet.padding.withEnums(ctx.receiveNodes(enumValueSet.padding.enums, receiveRightPaddedTree)!);
        enumValueSet = enumValueSet.withTerminatedWithSemicolon(ctx.receiveValue(enumValueSet.terminatedWithSemicolon, ValueType.Primitive)!);
        return enumValueSet;
    }

    public visitFieldAccess(fieldAccess: FieldAccess, ctx: ReceiverContext): J {
        fieldAccess = fieldAccess.withId(ctx.receiveValue(fieldAccess.id, ValueType.UUID)!);
        fieldAccess = fieldAccess.withPrefix(ctx.receiveNode(fieldAccess.prefix, receiveSpace)!);
        fieldAccess = fieldAccess.withMarkers(ctx.receiveNode(fieldAccess.markers, ctx.receiveMarkers)!);
        fieldAccess = fieldAccess.withTarget(ctx.receiveNode(fieldAccess.target, ctx.receiveTree)!);
        fieldAccess = fieldAccess.padding.withName(ctx.receiveNode(fieldAccess.padding.name, receiveLeftPaddedTree)!);
        fieldAccess = fieldAccess.withType(ctx.receiveValue(fieldAccess.type, ValueType.Object));
        return fieldAccess;
    }

    public visitForEachLoop(forEachLoop: ForEachLoop, ctx: ReceiverContext): J {
        forEachLoop = forEachLoop.withId(ctx.receiveValue(forEachLoop.id, ValueType.UUID)!);
        forEachLoop = forEachLoop.withPrefix(ctx.receiveNode(forEachLoop.prefix, receiveSpace)!);
        forEachLoop = forEachLoop.withMarkers(ctx.receiveNode(forEachLoop.markers, ctx.receiveMarkers)!);
        forEachLoop = forEachLoop.withControl(ctx.receiveNode(forEachLoop.control, ctx.receiveTree)!);
        forEachLoop = forEachLoop.padding.withBody(ctx.receiveNode(forEachLoop.padding.body, receiveRightPaddedTree)!);
        return forEachLoop;
    }

    public visitForEachControl(control: ForEachLoop.Control, ctx: ReceiverContext): J {
        control = control.withId(ctx.receiveValue(control.id, ValueType.UUID)!);
        control = control.withPrefix(ctx.receiveNode(control.prefix, receiveSpace)!);
        control = control.withMarkers(ctx.receiveNode(control.markers, ctx.receiveMarkers)!);
        control = control.padding.withVariable(ctx.receiveNode(control.padding.variable, receiveRightPaddedTree)!);
        control = control.padding.withIterable(ctx.receiveNode(control.padding.iterable, receiveRightPaddedTree)!);
        return control;
    }

    public visitForLoop(forLoop: ForLoop, ctx: ReceiverContext): J {
        forLoop = forLoop.withId(ctx.receiveValue(forLoop.id, ValueType.UUID)!);
        forLoop = forLoop.withPrefix(ctx.receiveNode(forLoop.prefix, receiveSpace)!);
        forLoop = forLoop.withMarkers(ctx.receiveNode(forLoop.markers, ctx.receiveMarkers)!);
        forLoop = forLoop.withControl(ctx.receiveNode(forLoop.control, ctx.receiveTree)!);
        forLoop = forLoop.padding.withBody(ctx.receiveNode(forLoop.padding.body, receiveRightPaddedTree)!);
        return forLoop;
    }

    public visitForControl(control: ForLoop.Control, ctx: ReceiverContext): J {
        control = control.withId(ctx.receiveValue(control.id, ValueType.UUID)!);
        control = control.withPrefix(ctx.receiveNode(control.prefix, receiveSpace)!);
        control = control.withMarkers(ctx.receiveNode(control.markers, ctx.receiveMarkers)!);
        control = control.padding.withInit(ctx.receiveNodes(control.padding.init, receiveRightPaddedTree)!);
        control = control.padding.withCondition(ctx.receiveNode(control.padding.condition, receiveRightPaddedTree)!);
        control = control.padding.withUpdate(ctx.receiveNodes(control.padding.update, receiveRightPaddedTree)!);
        return control;
    }

    public visitParenthesizedTypeTree(parenthesizedTypeTree: ParenthesizedTypeTree, ctx: ReceiverContext): J {
        parenthesizedTypeTree = parenthesizedTypeTree.withId(ctx.receiveValue(parenthesizedTypeTree.id, ValueType.UUID)!);
        parenthesizedTypeTree = parenthesizedTypeTree.withPrefix(ctx.receiveNode(parenthesizedTypeTree.prefix, receiveSpace)!);
        parenthesizedTypeTree = parenthesizedTypeTree.withMarkers(ctx.receiveNode(parenthesizedTypeTree.markers, ctx.receiveMarkers)!);
        parenthesizedTypeTree = parenthesizedTypeTree.withAnnotations(ctx.receiveNodes(parenthesizedTypeTree.annotations, ctx.receiveTree)!);
        parenthesizedTypeTree = parenthesizedTypeTree.withParenthesizedType(ctx.receiveNode(parenthesizedTypeTree.parenthesizedType, ctx.receiveTree)!);
        return parenthesizedTypeTree;
    }

    public visitIdentifier(identifier: Identifier, ctx: ReceiverContext): J {
        identifier = identifier.withId(ctx.receiveValue(identifier.id, ValueType.UUID)!);
        identifier = identifier.withPrefix(ctx.receiveNode(identifier.prefix, receiveSpace)!);
        identifier = identifier.withMarkers(ctx.receiveNode(identifier.markers, ctx.receiveMarkers)!);
        identifier = identifier.withAnnotations(ctx.receiveNodes(identifier.annotations, ctx.receiveTree)!);
        identifier = identifier.withSimpleName(ctx.receiveValue(identifier.simpleName, ValueType.Primitive)!);
        identifier = identifier.withType(ctx.receiveValue(identifier.type, ValueType.Object));
        identifier = identifier.withFieldType(ctx.receiveValue(identifier.fieldType, ValueType.Object));
        return identifier;
    }

    public visitIf(_if: If, ctx: ReceiverContext): J {
        _if = _if.withId(ctx.receiveValue(_if.id, ValueType.UUID)!);
        _if = _if.withPrefix(ctx.receiveNode(_if.prefix, receiveSpace)!);
        _if = _if.withMarkers(ctx.receiveNode(_if.markers, ctx.receiveMarkers)!);
        _if = _if.withIfCondition(ctx.receiveNode(_if.ifCondition, ctx.receiveTree)!);
        _if = _if.padding.withThenPart(ctx.receiveNode(_if.padding.thenPart, receiveRightPaddedTree)!);
        _if = _if.withElsePart(ctx.receiveNode(_if.elsePart, ctx.receiveTree));
        return _if;
    }

    public visitElse(_else: If.Else, ctx: ReceiverContext): J {
        _else = _else.withId(ctx.receiveValue(_else.id, ValueType.UUID)!);
        _else = _else.withPrefix(ctx.receiveNode(_else.prefix, receiveSpace)!);
        _else = _else.withMarkers(ctx.receiveNode(_else.markers, ctx.receiveMarkers)!);
        _else = _else.padding.withBody(ctx.receiveNode(_else.padding.body, receiveRightPaddedTree)!);
        return _else;
    }

    public visitImport(_import: Import, ctx: ReceiverContext): J {
        _import = _import.withId(ctx.receiveValue(_import.id, ValueType.UUID)!);
        _import = _import.withPrefix(ctx.receiveNode(_import.prefix, receiveSpace)!);
        _import = _import.withMarkers(ctx.receiveNode(_import.markers, ctx.receiveMarkers)!);
        _import = _import.padding.withStatic(ctx.receiveNode(_import.padding.static, leftPaddedValueReceiver(ValueType.Primitive))!);
        _import = _import.withQualid(ctx.receiveNode(_import.qualid, ctx.receiveTree)!);
        _import = _import.padding.withAlias(ctx.receiveNode(_import.padding.alias, receiveLeftPaddedTree));
        return _import;
    }

    public visitInstanceOf(instanceOf: InstanceOf, ctx: ReceiverContext): J {
        instanceOf = instanceOf.withId(ctx.receiveValue(instanceOf.id, ValueType.UUID)!);
        instanceOf = instanceOf.withPrefix(ctx.receiveNode(instanceOf.prefix, receiveSpace)!);
        instanceOf = instanceOf.withMarkers(ctx.receiveNode(instanceOf.markers, ctx.receiveMarkers)!);
        instanceOf = instanceOf.padding.withExpression(ctx.receiveNode(instanceOf.padding.expression, receiveRightPaddedTree)!);
        instanceOf = instanceOf.withClazz(ctx.receiveNode(instanceOf.clazz, ctx.receiveTree)!);
        instanceOf = instanceOf.withPattern(ctx.receiveNode(instanceOf.pattern, ctx.receiveTree));
        instanceOf = instanceOf.withType(ctx.receiveValue(instanceOf.type, ValueType.Object));
        return instanceOf;
    }

    public visitIntersectionType(intersectionType: IntersectionType, ctx: ReceiverContext): J {
        intersectionType = intersectionType.withId(ctx.receiveValue(intersectionType.id, ValueType.UUID)!);
        intersectionType = intersectionType.withPrefix(ctx.receiveNode(intersectionType.prefix, receiveSpace)!);
        intersectionType = intersectionType.withMarkers(ctx.receiveNode(intersectionType.markers, ctx.receiveMarkers)!);
        intersectionType = intersectionType.padding.withBounds(ctx.receiveNode(intersectionType.padding.bounds, receiveContainer)!);
        return intersectionType;
    }

    public visitLabel(label: Label, ctx: ReceiverContext): J {
        label = label.withId(ctx.receiveValue(label.id, ValueType.UUID)!);
        label = label.withPrefix(ctx.receiveNode(label.prefix, receiveSpace)!);
        label = label.withMarkers(ctx.receiveNode(label.markers, ctx.receiveMarkers)!);
        label = label.padding.withLabel(ctx.receiveNode(label.padding.label, receiveRightPaddedTree)!);
        label = label.withStatement(ctx.receiveNode(label.statement, ctx.receiveTree)!);
        return label;
    }

    public visitLambda(lambda: Lambda, ctx: ReceiverContext): J {
        lambda = lambda.withId(ctx.receiveValue(lambda.id, ValueType.UUID)!);
        lambda = lambda.withPrefix(ctx.receiveNode(lambda.prefix, receiveSpace)!);
        lambda = lambda.withMarkers(ctx.receiveNode(lambda.markers, ctx.receiveMarkers)!);
        lambda = lambda.withParameters(ctx.receiveNode(lambda.parameters, ctx.receiveTree)!);
        lambda = lambda.withArrow(ctx.receiveNode(lambda.arrow, receiveSpace)!);
        lambda = lambda.withBody(ctx.receiveNode(lambda.body, ctx.receiveTree)!);
        lambda = lambda.withType(ctx.receiveValue(lambda.type, ValueType.Object));
        return lambda;
    }

    public visitLambdaParameters(parameters: Lambda.Parameters, ctx: ReceiverContext): J {
        parameters = parameters.withId(ctx.receiveValue(parameters.id, ValueType.UUID)!);
        parameters = parameters.withPrefix(ctx.receiveNode(parameters.prefix, receiveSpace)!);
        parameters = parameters.withMarkers(ctx.receiveNode(parameters.markers, ctx.receiveMarkers)!);
        parameters = parameters.withParenthesized(ctx.receiveValue(parameters.parenthesized, ValueType.Primitive)!);
        parameters = parameters.padding.withParameters(ctx.receiveNodes(parameters.padding.parameters, receiveRightPaddedTree)!);
        return parameters;
    }

    public visitLiteral(literal: Literal, ctx: ReceiverContext): J {
        literal = literal.withId(ctx.receiveValue(literal.id, ValueType.UUID)!);
        literal = literal.withPrefix(ctx.receiveNode(literal.prefix, receiveSpace)!);
        literal = literal.withMarkers(ctx.receiveNode(literal.markers, ctx.receiveMarkers)!);
        literal = literal.withValue(ctx.receiveValue(literal.value, ValueType.Object));
        literal = literal.withValueSource(ctx.receiveValue(literal.valueSource, ValueType.Primitive));
        literal = literal.withUnicodeEscapes(ctx.receiveValues(literal.unicodeEscapes, ValueType.Object));
        literal = literal.withType(ctx.receiveValue(literal.type, ValueType.Enum)!);
        return literal;
    }

    public visitMemberReference(memberReference: MemberReference, ctx: ReceiverContext): J {
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

    public visitMethodDeclaration(methodDeclaration: MethodDeclaration, ctx: ReceiverContext): J {
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

    public visitMethodInvocation(methodInvocation: MethodInvocation, ctx: ReceiverContext): J {
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

    public visitModifier(modifier: Modifier, ctx: ReceiverContext): J {
        modifier = modifier.withId(ctx.receiveValue(modifier.id, ValueType.UUID)!);
        modifier = modifier.withPrefix(ctx.receiveNode(modifier.prefix, receiveSpace)!);
        modifier = modifier.withMarkers(ctx.receiveNode(modifier.markers, ctx.receiveMarkers)!);
        modifier = modifier.withKeyword(ctx.receiveValue(modifier.keyword, ValueType.Primitive));
        modifier = modifier.withType(ctx.receiveValue(modifier.type, ValueType.Enum)!);
        modifier = modifier.withAnnotations(ctx.receiveNodes(modifier.annotations, ctx.receiveTree)!);
        return modifier;
    }

    public visitMultiCatch(multiCatch: MultiCatch, ctx: ReceiverContext): J {
        multiCatch = multiCatch.withId(ctx.receiveValue(multiCatch.id, ValueType.UUID)!);
        multiCatch = multiCatch.withPrefix(ctx.receiveNode(multiCatch.prefix, receiveSpace)!);
        multiCatch = multiCatch.withMarkers(ctx.receiveNode(multiCatch.markers, ctx.receiveMarkers)!);
        multiCatch = multiCatch.padding.withAlternatives(ctx.receiveNodes(multiCatch.padding.alternatives, receiveRightPaddedTree)!);
        return multiCatch;
    }

    public visitNewArray(newArray: NewArray, ctx: ReceiverContext): J {
        newArray = newArray.withId(ctx.receiveValue(newArray.id, ValueType.UUID)!);
        newArray = newArray.withPrefix(ctx.receiveNode(newArray.prefix, receiveSpace)!);
        newArray = newArray.withMarkers(ctx.receiveNode(newArray.markers, ctx.receiveMarkers)!);
        newArray = newArray.withTypeExpression(ctx.receiveNode(newArray.typeExpression, ctx.receiveTree));
        newArray = newArray.withDimensions(ctx.receiveNodes(newArray.dimensions, ctx.receiveTree)!);
        newArray = newArray.padding.withInitializer(ctx.receiveNode(newArray.padding.initializer, receiveContainer));
        newArray = newArray.withType(ctx.receiveValue(newArray.type, ValueType.Object));
        return newArray;
    }

    public visitArrayDimension(arrayDimension: ArrayDimension, ctx: ReceiverContext): J {
        arrayDimension = arrayDimension.withId(ctx.receiveValue(arrayDimension.id, ValueType.UUID)!);
        arrayDimension = arrayDimension.withPrefix(ctx.receiveNode(arrayDimension.prefix, receiveSpace)!);
        arrayDimension = arrayDimension.withMarkers(ctx.receiveNode(arrayDimension.markers, ctx.receiveMarkers)!);
        arrayDimension = arrayDimension.padding.withIndex(ctx.receiveNode(arrayDimension.padding.index, receiveRightPaddedTree)!);
        return arrayDimension;
    }

    public visitNewClass(newClass: NewClass, ctx: ReceiverContext): J {
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

    public visitNullableType(nullableType: NullableType, ctx: ReceiverContext): J {
        nullableType = nullableType.withId(ctx.receiveValue(nullableType.id, ValueType.UUID)!);
        nullableType = nullableType.withPrefix(ctx.receiveNode(nullableType.prefix, receiveSpace)!);
        nullableType = nullableType.withMarkers(ctx.receiveNode(nullableType.markers, ctx.receiveMarkers)!);
        nullableType = nullableType.withAnnotations(ctx.receiveNodes(nullableType.annotations, ctx.receiveTree)!);
        nullableType = nullableType.padding.withTypeTree(ctx.receiveNode(nullableType.padding.typeTree, receiveRightPaddedTree)!);
        return nullableType;
    }

    public visitPackage(_package: Package, ctx: ReceiverContext): J {
        _package = _package.withId(ctx.receiveValue(_package.id, ValueType.UUID)!);
        _package = _package.withPrefix(ctx.receiveNode(_package.prefix, receiveSpace)!);
        _package = _package.withMarkers(ctx.receiveNode(_package.markers, ctx.receiveMarkers)!);
        _package = _package.withExpression(ctx.receiveNode(_package.expression, ctx.receiveTree)!);
        _package = _package.withAnnotations(ctx.receiveNodes(_package.annotations, ctx.receiveTree)!);
        return _package;
    }

    public visitParameterizedType(parameterizedType: ParameterizedType, ctx: ReceiverContext): J {
        parameterizedType = parameterizedType.withId(ctx.receiveValue(parameterizedType.id, ValueType.UUID)!);
        parameterizedType = parameterizedType.withPrefix(ctx.receiveNode(parameterizedType.prefix, receiveSpace)!);
        parameterizedType = parameterizedType.withMarkers(ctx.receiveNode(parameterizedType.markers, ctx.receiveMarkers)!);
        parameterizedType = parameterizedType.withClazz(ctx.receiveNode(parameterizedType.clazz, ctx.receiveTree)!);
        parameterizedType = parameterizedType.padding.withTypeParameters(ctx.receiveNode(parameterizedType.padding.typeParameters, receiveContainer));
        parameterizedType = parameterizedType.withType(ctx.receiveValue(parameterizedType.type, ValueType.Object));
        return parameterizedType;
    }

    public visitParentheses<J2 extends J>(parentheses: Parentheses<J2>, ctx: ReceiverContext): J {
        parentheses = parentheses.withId(ctx.receiveValue(parentheses.id, ValueType.UUID)!);
        parentheses = parentheses.withPrefix(ctx.receiveNode(parentheses.prefix, receiveSpace)!);
        parentheses = parentheses.withMarkers(ctx.receiveNode(parentheses.markers, ctx.receiveMarkers)!);
        parentheses = parentheses.padding.withTree(ctx.receiveNode(parentheses.padding.tree, receiveRightPaddedTree)!);
        return parentheses;
    }

    public visitControlParentheses<J2 extends J>(controlParentheses: ControlParentheses<J2>, ctx: ReceiverContext): J {
        controlParentheses = controlParentheses.withId(ctx.receiveValue(controlParentheses.id, ValueType.UUID)!);
        controlParentheses = controlParentheses.withPrefix(ctx.receiveNode(controlParentheses.prefix, receiveSpace)!);
        controlParentheses = controlParentheses.withMarkers(ctx.receiveNode(controlParentheses.markers, ctx.receiveMarkers)!);
        controlParentheses = controlParentheses.padding.withTree(ctx.receiveNode(controlParentheses.padding.tree, receiveRightPaddedTree)!);
        return controlParentheses;
    }

    public visitPrimitive(primitive: Primitive, ctx: ReceiverContext): J {
        primitive = primitive.withId(ctx.receiveValue(primitive.id, ValueType.UUID)!);
        primitive = primitive.withPrefix(ctx.receiveNode(primitive.prefix, receiveSpace)!);
        primitive = primitive.withMarkers(ctx.receiveNode(primitive.markers, ctx.receiveMarkers)!);
        primitive = primitive.withType(ctx.receiveValue(primitive.type, ValueType.Enum)!);
        return primitive;
    }

    public visitReturn(_return: Return, ctx: ReceiverContext): J {
        _return = _return.withId(ctx.receiveValue(_return.id, ValueType.UUID)!);
        _return = _return.withPrefix(ctx.receiveNode(_return.prefix, receiveSpace)!);
        _return = _return.withMarkers(ctx.receiveNode(_return.markers, ctx.receiveMarkers)!);
        _return = _return.withExpression(ctx.receiveNode(_return.expression, ctx.receiveTree));
        return _return;
    }

    public visitSwitch(_switch: Switch, ctx: ReceiverContext): J {
        _switch = _switch.withId(ctx.receiveValue(_switch.id, ValueType.UUID)!);
        _switch = _switch.withPrefix(ctx.receiveNode(_switch.prefix, receiveSpace)!);
        _switch = _switch.withMarkers(ctx.receiveNode(_switch.markers, ctx.receiveMarkers)!);
        _switch = _switch.withSelector(ctx.receiveNode(_switch.selector, ctx.receiveTree)!);
        _switch = _switch.withCases(ctx.receiveNode(_switch.cases, ctx.receiveTree)!);
        return _switch;
    }

    public visitSwitchExpression(switchExpression: SwitchExpression, ctx: ReceiverContext): J {
        switchExpression = switchExpression.withId(ctx.receiveValue(switchExpression.id, ValueType.UUID)!);
        switchExpression = switchExpression.withPrefix(ctx.receiveNode(switchExpression.prefix, receiveSpace)!);
        switchExpression = switchExpression.withMarkers(ctx.receiveNode(switchExpression.markers, ctx.receiveMarkers)!);
        switchExpression = switchExpression.withSelector(ctx.receiveNode(switchExpression.selector, ctx.receiveTree)!);
        switchExpression = switchExpression.withCases(ctx.receiveNode(switchExpression.cases, ctx.receiveTree)!);
        return switchExpression;
    }

    public visitSynchronized(synchronized: Synchronized, ctx: ReceiverContext): J {
        synchronized = synchronized.withId(ctx.receiveValue(synchronized.id, ValueType.UUID)!);
        synchronized = synchronized.withPrefix(ctx.receiveNode(synchronized.prefix, receiveSpace)!);
        synchronized = synchronized.withMarkers(ctx.receiveNode(synchronized.markers, ctx.receiveMarkers)!);
        synchronized = synchronized.withLock(ctx.receiveNode(synchronized.lock, ctx.receiveTree)!);
        synchronized = synchronized.withBody(ctx.receiveNode(synchronized.body, ctx.receiveTree)!);
        return synchronized;
    }

    public visitTernary(ternary: Ternary, ctx: ReceiverContext): J {
        ternary = ternary.withId(ctx.receiveValue(ternary.id, ValueType.UUID)!);
        ternary = ternary.withPrefix(ctx.receiveNode(ternary.prefix, receiveSpace)!);
        ternary = ternary.withMarkers(ctx.receiveNode(ternary.markers, ctx.receiveMarkers)!);
        ternary = ternary.withCondition(ctx.receiveNode(ternary.condition, ctx.receiveTree)!);
        ternary = ternary.padding.withTruePart(ctx.receiveNode(ternary.padding.truePart, receiveLeftPaddedTree)!);
        ternary = ternary.padding.withFalsePart(ctx.receiveNode(ternary.padding.falsePart, receiveLeftPaddedTree)!);
        ternary = ternary.withType(ctx.receiveValue(ternary.type, ValueType.Object));
        return ternary;
    }

    public visitThrow(_throw: Throw, ctx: ReceiverContext): J {
        _throw = _throw.withId(ctx.receiveValue(_throw.id, ValueType.UUID)!);
        _throw = _throw.withPrefix(ctx.receiveNode(_throw.prefix, receiveSpace)!);
        _throw = _throw.withMarkers(ctx.receiveNode(_throw.markers, ctx.receiveMarkers)!);
        _throw = _throw.withException(ctx.receiveNode(_throw.exception, ctx.receiveTree)!);
        return _throw;
    }

    public visitTry(_try: Try, ctx: ReceiverContext): J {
        _try = _try.withId(ctx.receiveValue(_try.id, ValueType.UUID)!);
        _try = _try.withPrefix(ctx.receiveNode(_try.prefix, receiveSpace)!);
        _try = _try.withMarkers(ctx.receiveNode(_try.markers, ctx.receiveMarkers)!);
        _try = _try.padding.withResources(ctx.receiveNode(_try.padding.resources, receiveContainer));
        _try = _try.withBody(ctx.receiveNode(_try.body, ctx.receiveTree)!);
        _try = _try.withCatches(ctx.receiveNodes(_try.catches, ctx.receiveTree)!);
        _try = _try.padding.withFinally(ctx.receiveNode(_try.padding.finally, receiveLeftPaddedTree));
        return _try;
    }

    public visitTryResource(resource: Try.Resource, ctx: ReceiverContext): J {
        resource = resource.withId(ctx.receiveValue(resource.id, ValueType.UUID)!);
        resource = resource.withPrefix(ctx.receiveNode(resource.prefix, receiveSpace)!);
        resource = resource.withMarkers(ctx.receiveNode(resource.markers, ctx.receiveMarkers)!);
        resource = resource.withVariableDeclarations(ctx.receiveNode(resource.variableDeclarations, ctx.receiveTree)!);
        resource = resource.withTerminatedWithSemicolon(ctx.receiveValue(resource.terminatedWithSemicolon, ValueType.Primitive)!);
        return resource;
    }

    public visitCatch(_catch: Try.Catch, ctx: ReceiverContext): J {
        _catch = _catch.withId(ctx.receiveValue(_catch.id, ValueType.UUID)!);
        _catch = _catch.withPrefix(ctx.receiveNode(_catch.prefix, receiveSpace)!);
        _catch = _catch.withMarkers(ctx.receiveNode(_catch.markers, ctx.receiveMarkers)!);
        _catch = _catch.withParameter(ctx.receiveNode(_catch.parameter, ctx.receiveTree)!);
        _catch = _catch.withBody(ctx.receiveNode(_catch.body, ctx.receiveTree)!);
        return _catch;
    }

    public visitTypeCast(typeCast: TypeCast, ctx: ReceiverContext): J {
        typeCast = typeCast.withId(ctx.receiveValue(typeCast.id, ValueType.UUID)!);
        typeCast = typeCast.withPrefix(ctx.receiveNode(typeCast.prefix, receiveSpace)!);
        typeCast = typeCast.withMarkers(ctx.receiveNode(typeCast.markers, ctx.receiveMarkers)!);
        typeCast = typeCast.withClazz(ctx.receiveNode(typeCast.clazz, ctx.receiveTree)!);
        typeCast = typeCast.withExpression(ctx.receiveNode(typeCast.expression, ctx.receiveTree)!);
        return typeCast;
    }

    public visitTypeParameter(typeParameter: TypeParameter, ctx: ReceiverContext): J {
        typeParameter = typeParameter.withId(ctx.receiveValue(typeParameter.id, ValueType.UUID)!);
        typeParameter = typeParameter.withPrefix(ctx.receiveNode(typeParameter.prefix, receiveSpace)!);
        typeParameter = typeParameter.withMarkers(ctx.receiveNode(typeParameter.markers, ctx.receiveMarkers)!);
        typeParameter = typeParameter.withAnnotations(ctx.receiveNodes(typeParameter.annotations, ctx.receiveTree)!);
        typeParameter = typeParameter.withModifiers(ctx.receiveNodes(typeParameter.modifiers, ctx.receiveTree)!);
        typeParameter = typeParameter.withName(ctx.receiveNode(typeParameter.name, ctx.receiveTree)!);
        typeParameter = typeParameter.padding.withBounds(ctx.receiveNode(typeParameter.padding.bounds, receiveContainer));
        return typeParameter;
    }

    public visitTypeParameters(typeParameters: TypeParameters, ctx: ReceiverContext): J {
        typeParameters = typeParameters.withId(ctx.receiveValue(typeParameters.id, ValueType.UUID)!);
        typeParameters = typeParameters.withPrefix(ctx.receiveNode(typeParameters.prefix, receiveSpace)!);
        typeParameters = typeParameters.withMarkers(ctx.receiveNode(typeParameters.markers, ctx.receiveMarkers)!);
        typeParameters = typeParameters.withAnnotations(ctx.receiveNodes(typeParameters.annotations, ctx.receiveTree)!);
        typeParameters = typeParameters.padding.withTypeParameters(ctx.receiveNodes(typeParameters.padding.typeParameters, receiveRightPaddedTree)!);
        return typeParameters;
    }

    public visitUnary(unary: Unary, ctx: ReceiverContext): J {
        unary = unary.withId(ctx.receiveValue(unary.id, ValueType.UUID)!);
        unary = unary.withPrefix(ctx.receiveNode(unary.prefix, receiveSpace)!);
        unary = unary.withMarkers(ctx.receiveNode(unary.markers, ctx.receiveMarkers)!);
        unary = unary.padding.withOperator(ctx.receiveNode(unary.padding.operator, leftPaddedValueReceiver(ValueType.Enum))!);
        unary = unary.withExpression(ctx.receiveNode(unary.expression, ctx.receiveTree)!);
        unary = unary.withType(ctx.receiveValue(unary.type, ValueType.Object));
        return unary;
    }

    public visitVariableDeclarations(variableDeclarations: VariableDeclarations, ctx: ReceiverContext): J {
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

    public visitVariable(namedVariable: VariableDeclarations.NamedVariable, ctx: ReceiverContext): J {
        namedVariable = namedVariable.withId(ctx.receiveValue(namedVariable.id, ValueType.UUID)!);
        namedVariable = namedVariable.withPrefix(ctx.receiveNode(namedVariable.prefix, receiveSpace)!);
        namedVariable = namedVariable.withMarkers(ctx.receiveNode(namedVariable.markers, ctx.receiveMarkers)!);
        namedVariable = namedVariable.withName(ctx.receiveNode(namedVariable.name, ctx.receiveTree)!);
        namedVariable = namedVariable.withDimensionsAfterName(ctx.receiveNodes(namedVariable.dimensionsAfterName, leftPaddedNodeReceiver(Space))!);
        namedVariable = namedVariable.padding.withInitializer(ctx.receiveNode(namedVariable.padding.initializer, receiveLeftPaddedTree));
        namedVariable = namedVariable.withVariableType(ctx.receiveValue(namedVariable.variableType, ValueType.Object));
        return namedVariable;
    }

    public visitWhileLoop(whileLoop: WhileLoop, ctx: ReceiverContext): J {
        whileLoop = whileLoop.withId(ctx.receiveValue(whileLoop.id, ValueType.UUID)!);
        whileLoop = whileLoop.withPrefix(ctx.receiveNode(whileLoop.prefix, receiveSpace)!);
        whileLoop = whileLoop.withMarkers(ctx.receiveNode(whileLoop.markers, ctx.receiveMarkers)!);
        whileLoop = whileLoop.withCondition(ctx.receiveNode(whileLoop.condition, ctx.receiveTree)!);
        whileLoop = whileLoop.padding.withBody(ctx.receiveNode(whileLoop.padding.body, receiveRightPaddedTree)!);
        return whileLoop;
    }

    public visitWildcard(wildcard: Wildcard, ctx: ReceiverContext): J {
        wildcard = wildcard.withId(ctx.receiveValue(wildcard.id, ValueType.UUID)!);
        wildcard = wildcard.withPrefix(ctx.receiveNode(wildcard.prefix, receiveSpace)!);
        wildcard = wildcard.withMarkers(ctx.receiveNode(wildcard.markers, ctx.receiveMarkers)!);
        wildcard = wildcard.padding.withBound(ctx.receiveNode(wildcard.padding.bound, leftPaddedValueReceiver(ValueType.Enum)));
        wildcard = wildcard.withBoundedType(ctx.receiveNode(wildcard.boundedType, ctx.receiveTree));
        return wildcard;
    }

    public visitYield(_yield: Yield, ctx: ReceiverContext): J {
        _yield = _yield.withId(ctx.receiveValue(_yield.id, ValueType.UUID)!);
        _yield = _yield.withPrefix(ctx.receiveNode(_yield.prefix, receiveSpace)!);
        _yield = _yield.withMarkers(ctx.receiveNode(_yield.markers, ctx.receiveMarkers)!);
        _yield = _yield.withImplicit(ctx.receiveValue(_yield.implicit, ValueType.Primitive)!);
        _yield = _yield.withValue(ctx.receiveNode(_yield.value, ctx.receiveTree)!);
        return _yield;
    }

    public visitUnknown(unknown: Unknown, ctx: ReceiverContext): J {
        unknown = unknown.withId(ctx.receiveValue(unknown.id, ValueType.UUID)!);
        unknown = unknown.withPrefix(ctx.receiveNode(unknown.prefix, receiveSpace)!);
        unknown = unknown.withMarkers(ctx.receiveNode(unknown.markers, ctx.receiveMarkers)!);
        unknown = unknown.withSource(ctx.receiveNode(unknown.source, ctx.receiveTree)!);
        return unknown;
    }

    public visitUnknownSource(source: Unknown.Source, ctx: ReceiverContext): J {
        source = source.withId(ctx.receiveValue(source.id, ValueType.UUID)!);
        source = source.withPrefix(ctx.receiveNode(source.prefix, receiveSpace)!);
        source = source.withMarkers(ctx.receiveNode(source.markers, ctx.receiveMarkers)!);
        source = source.withText(ctx.receiveValue(source.text, ValueType.Primitive)!);
        return source;
    }

}

class Factory implements ReceiverFactory {
    public create(type: string, ctx: ReceiverContext): Tree {
        if (type === "org.openrewrite.java.tree.J$AnnotatedType") {
            return new AnnotatedType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Annotation") {
            return new Annotation(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<NameTree>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer)
            );
        }

        if (type === "org.openrewrite.java.tree.J$ArrayAccess") {
            return new ArrayAccess(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<ArrayDimension>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$ArrayType") {
            return new ArrayType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree),
                ctx.receiveNode<JLeftPadded<Space>>(null, leftPaddedNodeReceiver(Space)),
                ctx.receiveValue(null, ValueType.Object)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Assert") {
            return new Assert(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Assignment") {
            return new Assignment(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$AssignmentOperation") {
            return new AssignmentOperation(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<AssignmentOperation.Type>>(null, leftPaddedValueReceiver(ValueType.Enum))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Binary") {
            return new Binary(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Binary.Type>>(null, leftPaddedValueReceiver(ValueType.Enum))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Block") {
            return new Block(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<boolean>>(null, rightPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!,
                ctx.receiveNode(null, receiveSpace)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Break") {
            return new Break(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Identifier>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Case") {
            return new Case(
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
            return new ClassDeclaration(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<ClassDeclaration.Kind>(null, ctx.receiveTree)!,
                ctx.receiveNode<Identifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<TypeParameter>>(null, receiveContainer),
                ctx.receiveNode<JContainer<Statement>>(null, receiveContainer),
                ctx.receiveNode<JLeftPadded<TypeTree>>(null, receiveLeftPaddedTree),
                ctx.receiveNode<JContainer<TypeTree>>(null, receiveContainer),
                ctx.receiveNode<JContainer<TypeTree>>(null, receiveContainer),
                ctx.receiveNode<Block>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$ClassDeclaration$Kind") {
            return new ClassDeclaration.Kind(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Enum)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$CompilationUnit") {
            return new CompilationUnit(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveValue(null, ValueType.Primitive),
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveNode<JRightPadded<Package>>(null, receiveRightPaddedTree),
                ctx.receiveNodes(null, receiveRightPaddedTree)!,
                ctx.receiveNodes<ClassDeclaration>(null, ctx.receiveTree)!,
                ctx.receiveNode(null, receiveSpace)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Continue") {
            return new Continue(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Identifier>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$DoWhileLoop") {
            return new DoWhileLoop(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<JLeftPadded<ControlParentheses<Expression>>>(null, receiveLeftPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Empty") {
            return new Empty(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$EnumValue") {
            return new EnumValue(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNode<Identifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<NewClass>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$EnumValueSet") {
            return new EnumValueSet(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!,
                ctx.receiveValue(null, ValueType.Primitive)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$FieldAccess") {
            return new FieldAccess(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Identifier>>(null, receiveLeftPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$ForEachLoop") {
            return new ForEachLoop(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<ForEachLoop.Control>(null, ctx.receiveTree)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$ForEachLoop$Control") {
            return new ForEachLoop.Control(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<VariableDeclarations>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$ForLoop") {
            return new ForLoop(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<ForLoop.Control>(null, ctx.receiveTree)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$ForLoop$Control") {
            return new ForLoop.Control(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$ParenthesizedTypeTree") {
            return new ParenthesizedTypeTree(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNode<Parentheses<TypeTree>>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Identifier") {
            return new Identifier(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$If") {
            return new If(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<ControlParentheses<Expression>>(null, ctx.receiveTree)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<If.Else>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$If$Else") {
            return new If.Else(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Import") {
            return new Import(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<boolean>>(null, leftPaddedValueReceiver(ValueType.Primitive))!,
                ctx.receiveNode<FieldAccess>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Identifier>>(null, receiveLeftPaddedTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$InstanceOf") {
            return new InstanceOf(
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
            return new IntersectionType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JContainer<TypeTree>>(null, receiveContainer)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Label") {
            return new Label(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Identifier>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<Statement>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Lambda") {
            return new Lambda(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Lambda.Parameters>(null, ctx.receiveTree)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode<J>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Lambda$Parameters") {
            return new Lambda.Parameters(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Literal") {
            return new Literal(
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
            return new MemberReference(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveNode<JLeftPadded<Identifier>>(null, receiveLeftPaddedTree)!,
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$MethodDeclaration") {
            return new MethodDeclaration(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<TypeParameters>(null, ctx.receiveTree),
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNode<MethodDeclaration.IdentifierWithAnnotations>(null, receiveMethodIdentifierWithAnnotations)!,
                ctx.receiveNode<JContainer<Statement>>(null, receiveContainer)!,
                ctx.receiveNode<JContainer<NameTree>>(null, receiveContainer),
                ctx.receiveNode<Block>(null, ctx.receiveTree),
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$MethodInvocation") {
            return new MethodInvocation(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree),
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveNode<Identifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Modifier") {
            return new Modifier(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive),
                ctx.receiveValue(null, ValueType.Enum)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$MultiCatch") {
            return new MultiCatch(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$NewArray") {
            return new NewArray(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNodes<ArrayDimension>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$ArrayDimension") {
            return new ArrayDimension(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$NewClass") {
            return new NewClass(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<Expression>>(null, receiveRightPaddedTree),
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer)!,
                ctx.receiveNode<Block>(null, ctx.receiveTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$NullableType") {
            return new NullableType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNode<JRightPadded<TypeTree>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Package") {
            return new Package(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$ParameterizedType") {
            return new ParameterizedType(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<NameTree>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<Expression>>(null, receiveContainer),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Parentheses") {
            return new Parentheses<J>(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<J>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$ControlParentheses") {
            return new ControlParentheses<J>(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JRightPadded<J>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Primitive") {
            return new Primitive(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Enum)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Return") {
            return new Return(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Switch") {
            return new Switch(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<ControlParentheses<Expression>>(null, ctx.receiveTree)!,
                ctx.receiveNode<Block>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$SwitchExpression") {
            return new SwitchExpression(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<ControlParentheses<Expression>>(null, ctx.receiveTree)!,
                ctx.receiveNode<Block>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Synchronized") {
            return new Synchronized(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<ControlParentheses<Expression>>(null, ctx.receiveTree)!,
                ctx.receiveNode<Block>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Ternary") {
            return new Ternary(
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
            return new Throw(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Try") {
            return new Try(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JContainer<Try.Resource>>(null, receiveContainer),
                ctx.receiveNode<Block>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Try.Catch>(null, ctx.receiveTree)!,
                ctx.receiveNode<JLeftPadded<Block>>(null, receiveLeftPaddedTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Try$Resource") {
            return new Try.Resource(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<TypedTree>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Primitive)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Try$Catch") {
            return new Try.Catch(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<ControlParentheses<VariableDeclarations>>(null, ctx.receiveTree)!,
                ctx.receiveNode<Block>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$TypeCast") {
            return new TypeCast(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<ControlParentheses<TypeTree>>(null, ctx.receiveTree)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$TypeParameter") {
            return new TypeParameter(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveNode<JContainer<TypeTree>>(null, receiveContainer)
            );
        }

        if (type === "org.openrewrite.java.tree.J$TypeParameters") {
            return new TypeParameters(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Unary") {
            return new Unary(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<Unary.Type>>(null, leftPaddedValueReceiver(ValueType.Enum))!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$VariableDeclarations") {
            return new VariableDeclarations(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNodes<Annotation>(null, ctx.receiveTree)!,
                ctx.receiveNodes<Modifier>(null, ctx.receiveTree)!,
                ctx.receiveNode<TypeTree>(null, ctx.receiveTree),
                ctx.receiveNode(null, receiveSpace),
                ctx.receiveNodes(null, leftPaddedNodeReceiver(Space))!,
                ctx.receiveNodes(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$VariableDeclarations$NamedVariable") {
            return new VariableDeclarations.NamedVariable(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Identifier>(null, ctx.receiveTree)!,
                ctx.receiveNodes(null, leftPaddedNodeReceiver(Space))!,
                ctx.receiveNode<JLeftPadded<Expression>>(null, receiveLeftPaddedTree),
                ctx.receiveValue(null, ValueType.Object)
            );
        }

        if (type === "org.openrewrite.java.tree.J$WhileLoop") {
            return new WhileLoop(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<ControlParentheses<Expression>>(null, ctx.receiveTree)!,
                ctx.receiveNode<JRightPadded<Statement>>(null, receiveRightPaddedTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Wildcard") {
            return new Wildcard(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<JLeftPadded<Wildcard.Bound>>(null, leftPaddedValueReceiver(ValueType.Enum)),
                ctx.receiveNode<NameTree>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.java.tree.J$Yield") {
            return new Yield(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNode<Expression>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Unknown") {
            return new Unknown(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Unknown.Source>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.java.tree.J$Unknown$Source") {
            return new Unknown.Source(
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
