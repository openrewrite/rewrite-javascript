import * as extensions from "./extensions";
import {ListUtils, SourceFile, Tree, TreeVisitor} from "../core";
import {Comment, Expression, JavaSourceFile, JavaType, JContainer, JLeftPadded, JRightPadded, Loop, MethodCall, NameTree, Space, Statement, TextComment, TypedTree, TypeTree, J} from "./support_types";
import * as java from "./tree";

export class JavaVisitor<P> extends TreeVisitor<J, P> {
    isAcceptable(sourceFile: SourceFile, p: P): boolean {
        return sourceFile instanceof J;
    }

    visitExpression(expression: Expression, p: P): J {
        return expression;
    }

    visitStatement(statement: Statement, p: P): J {
        return statement;
    }

    public visitAnnotatedType(annotatedType: java.AnnotatedType, p: P): J | null {
        annotatedType = annotatedType.withPrefix(this.visitSpace(annotatedType.prefix, Space.Location.ANNOTATED_TYPE_PREFIX, p)!);
        let tempExpression = this.visitExpression(annotatedType, p) as Expression;
        if (!(tempExpression instanceof java.AnnotatedType))
        {
            return tempExpression;
        }
        annotatedType = tempExpression as java.AnnotatedType;
        annotatedType = annotatedType.withMarkers(this.visitMarkers(annotatedType.markers, p));
        annotatedType = annotatedType.withAnnotations(ListUtils.map(annotatedType.annotations, el => this.visit(el, p) as java.Annotation));
        annotatedType = annotatedType.withTypeExpression(this.visitAndCast(annotatedType.typeExpression, p)!);
        return annotatedType;
    }

    public visitAnnotation(annotation: java.Annotation, p: P): J | null {
        annotation = annotation.withPrefix(this.visitSpace(annotation.prefix, Space.Location.ANNOTATION_PREFIX, p)!);
        let tempExpression = this.visitExpression(annotation, p) as Expression;
        if (!(tempExpression instanceof java.Annotation))
        {
            return tempExpression;
        }
        annotation = tempExpression as java.Annotation;
        annotation = annotation.withMarkers(this.visitMarkers(annotation.markers, p));
        annotation = annotation.withAnnotationType(this.visitAndCast(annotation.annotationType, p)!);
        annotation = annotation.padding.withArguments(this.visitContainer(annotation.padding.arguments, JContainer.Location.ANNOTATION_ARGUMENTS, p));
        return annotation;
    }

    public visitArrayAccess(arrayAccess: java.ArrayAccess, p: P): J | null {
        arrayAccess = arrayAccess.withPrefix(this.visitSpace(arrayAccess.prefix, Space.Location.ARRAY_ACCESS_PREFIX, p)!);
        let tempExpression = this.visitExpression(arrayAccess, p) as Expression;
        if (!(tempExpression instanceof java.ArrayAccess))
        {
            return tempExpression;
        }
        arrayAccess = tempExpression as java.ArrayAccess;
        arrayAccess = arrayAccess.withMarkers(this.visitMarkers(arrayAccess.markers, p));
        arrayAccess = arrayAccess.withIndexed(this.visitAndCast(arrayAccess.indexed, p)!);
        arrayAccess = arrayAccess.withDimension(this.visitAndCast(arrayAccess.dimension, p)!);
        return arrayAccess;
    }

    public visitArrayType(arrayType: java.ArrayType, p: P): J | null {
        arrayType = arrayType.withPrefix(this.visitSpace(arrayType.prefix, Space.Location.ARRAY_TYPE_PREFIX, p)!);
        let tempExpression = this.visitExpression(arrayType, p) as Expression;
        if (!(tempExpression instanceof java.ArrayType))
        {
            return tempExpression;
        }
        arrayType = tempExpression as java.ArrayType;
        arrayType = arrayType.withMarkers(this.visitMarkers(arrayType.markers, p));
        arrayType = arrayType.withElementType(this.visitAndCast(arrayType.elementType, p)!);
        arrayType = arrayType.withAnnotations(ListUtils.map(arrayType.annotations, el => this.visit(el, p) as java.Annotation));
        arrayType = arrayType.withDimension(this.visitLeftPadded(arrayType.dimension, JLeftPadded.Location.ARRAY_TYPE_DIMENSION, p));
        return arrayType;
    }

    public visitAssert(assert: java.Assert, p: P): J | null {
        assert = assert.withPrefix(this.visitSpace(assert.prefix, Space.Location.ASSERT_PREFIX, p)!);
        let tempStatement = this.visitStatement(assert, p) as Statement;
        if (!(tempStatement instanceof java.Assert))
        {
            return tempStatement;
        }
        assert = tempStatement as java.Assert;
        assert = assert.withMarkers(this.visitMarkers(assert.markers, p));
        assert = assert.withCondition(this.visitAndCast(assert.condition, p)!);
        assert = assert.withDetail(this.visitLeftPadded(assert.detail, JLeftPadded.Location.ASSERT_DETAIL, p));
        return assert;
    }

    public visitAssignment(assignment: java.Assignment, p: P): J | null {
        assignment = assignment.withPrefix(this.visitSpace(assignment.prefix, Space.Location.ASSIGNMENT_PREFIX, p)!);
        let tempStatement = this.visitStatement(assignment, p) as Statement;
        if (!(tempStatement instanceof java.Assignment))
        {
            return tempStatement;
        }
        assignment = tempStatement as java.Assignment;
        let tempExpression = this.visitExpression(assignment, p) as Expression;
        if (!(tempExpression instanceof java.Assignment))
        {
            return tempExpression;
        }
        assignment = tempExpression as java.Assignment;
        assignment = assignment.withMarkers(this.visitMarkers(assignment.markers, p));
        assignment = assignment.withVariable(this.visitAndCast(assignment.variable, p)!);
        assignment = assignment.padding.withAssignment(this.visitLeftPadded(assignment.padding.assignment, JLeftPadded.Location.ASSIGNMENT, p)!);
        return assignment;
    }

    public visitAssignmentOperation(assignmentOperation: java.AssignmentOperation, p: P): J | null {
        assignmentOperation = assignmentOperation.withPrefix(this.visitSpace(assignmentOperation.prefix, Space.Location.ASSIGNMENT_OPERATION_PREFIX, p)!);
        let tempStatement = this.visitStatement(assignmentOperation, p) as Statement;
        if (!(tempStatement instanceof java.AssignmentOperation))
        {
            return tempStatement;
        }
        assignmentOperation = tempStatement as java.AssignmentOperation;
        let tempExpression = this.visitExpression(assignmentOperation, p) as Expression;
        if (!(tempExpression instanceof java.AssignmentOperation))
        {
            return tempExpression;
        }
        assignmentOperation = tempExpression as java.AssignmentOperation;
        assignmentOperation = assignmentOperation.withMarkers(this.visitMarkers(assignmentOperation.markers, p));
        assignmentOperation = assignmentOperation.withVariable(this.visitAndCast(assignmentOperation.variable, p)!);
        assignmentOperation = assignmentOperation.padding.withOperator(this.visitLeftPadded(assignmentOperation.padding.operator, JLeftPadded.Location.ASSIGNMENT_OPERATION_OPERATOR, p)!);
        assignmentOperation = assignmentOperation.withAssignment(this.visitAndCast(assignmentOperation.assignment, p)!);
        return assignmentOperation;
    }

    public visitBinary(binary: java.Binary, p: P): J | null {
        binary = binary.withPrefix(this.visitSpace(binary.prefix, Space.Location.BINARY_PREFIX, p)!);
        let tempExpression = this.visitExpression(binary, p) as Expression;
        if (!(tempExpression instanceof java.Binary))
        {
            return tempExpression;
        }
        binary = tempExpression as java.Binary;
        binary = binary.withMarkers(this.visitMarkers(binary.markers, p));
        binary = binary.withLeft(this.visitAndCast(binary.left, p)!);
        binary = binary.padding.withOperator(this.visitLeftPadded(binary.padding.operator, JLeftPadded.Location.BINARY_OPERATOR, p)!);
        binary = binary.withRight(this.visitAndCast(binary.right, p)!);
        return binary;
    }

    public visitBlock(block: java.Block, p: P): J | null {
        block = block.withPrefix(this.visitSpace(block.prefix, Space.Location.BLOCK_PREFIX, p)!);
        let tempStatement = this.visitStatement(block, p) as Statement;
        if (!(tempStatement instanceof java.Block))
        {
            return tempStatement;
        }
        block = tempStatement as java.Block;
        block = block.withMarkers(this.visitMarkers(block.markers, p));
        block = block.padding.withStatic(this.visitRightPadded(block.padding.static, JRightPadded.Location.STATIC_INIT, p)!);
        block = block.padding.withStatements(ListUtils.map(block.padding.statements, el => this.visitRightPadded(el, JRightPadded.Location.BLOCK_STATEMENT, p)));
        block = block.withEnd(this.visitSpace(block.end, Space.Location.BLOCK_END, p)!);
        return block;
    }

    public visitBreak(_break: java.Break, p: P): J | null {
        _break = _break.withPrefix(this.visitSpace(_break.prefix, Space.Location.BREAK_PREFIX, p)!);
        let tempStatement = this.visitStatement(_break, p) as Statement;
        if (!(tempStatement instanceof java.Break))
        {
            return tempStatement;
        }
        _break = tempStatement as java.Break;
        _break = _break.withMarkers(this.visitMarkers(_break.markers, p));
        _break = _break.withLabel(this.visitAndCast(_break.label, p));
        return _break;
    }

    public visitCase(_case: java.Case, p: P): J | null {
        _case = _case.withPrefix(this.visitSpace(_case.prefix, Space.Location.CASE_PREFIX, p)!);
        let tempStatement = this.visitStatement(_case, p) as Statement;
        if (!(tempStatement instanceof java.Case))
        {
            return tempStatement;
        }
        _case = tempStatement as java.Case;
        _case = _case.withMarkers(this.visitMarkers(_case.markers, p));
        _case = _case.padding.withExpressions(this.visitContainer(_case.padding.expressions, JContainer.Location.CASE_EXPRESSION, p)!);
        _case = _case.padding.withStatements(this.visitContainer(_case.padding.statements, JContainer.Location.CASE, p)!);
        _case = _case.padding.withBody(this.visitRightPadded(_case.padding.body, JRightPadded.Location.CASE_BODY, p));
        return _case;
    }

    public visitClassDeclaration(classDeclaration: java.ClassDeclaration, p: P): J | null {
        classDeclaration = classDeclaration.withPrefix(this.visitSpace(classDeclaration.prefix, Space.Location.CLASS_DECLARATION_PREFIX, p)!);
        let tempStatement = this.visitStatement(classDeclaration, p) as Statement;
        if (!(tempStatement instanceof java.ClassDeclaration))
        {
            return tempStatement;
        }
        classDeclaration = tempStatement as java.ClassDeclaration;
        classDeclaration = classDeclaration.withMarkers(this.visitMarkers(classDeclaration.markers, p));
        classDeclaration = classDeclaration.withLeadingAnnotations(ListUtils.map(classDeclaration.leadingAnnotations, el => this.visit(el, p) as java.Annotation));
        classDeclaration = classDeclaration.withModifiers(ListUtils.map(classDeclaration.modifiers, el => this.visit(el, p) as java.Modifier));
        classDeclaration = classDeclaration.padding.withKind(this.visitAndCast(classDeclaration.padding.kind, p)!);
        classDeclaration = classDeclaration.withName(this.visitAndCast(classDeclaration.name, p)!);
        classDeclaration = classDeclaration.padding.withTypeParameters(this.visitContainer(classDeclaration.padding.typeParameters, JContainer.Location.TYPE_PARAMETERS, p));
        classDeclaration = classDeclaration.padding.withPrimaryConstructor(this.visitContainer(classDeclaration.padding.primaryConstructor, JContainer.Location.RECORD_STATE_VECTOR, p));
        classDeclaration = classDeclaration.padding.withExtends(this.visitLeftPadded(classDeclaration.padding.extends, JLeftPadded.Location.EXTENDS, p));
        classDeclaration = classDeclaration.padding.withImplements(this.visitContainer(classDeclaration.padding.implements, JContainer.Location.IMPLEMENTS, p));
        classDeclaration = classDeclaration.padding.withPermits(this.visitContainer(classDeclaration.padding.permits, JContainer.Location.PERMITS, p));
        classDeclaration = classDeclaration.withBody(this.visitAndCast(classDeclaration.body, p)!);
        return classDeclaration;
    }

    public visitClassDeclarationKind(classDeclarationKind: java.ClassDeclarationKind, p: P): J | null {
        classDeclarationKind = classDeclarationKind.withPrefix(this.visitSpace(classDeclarationKind.prefix, Space.Location.CLASS_KIND, p)!);
        classDeclarationKind = classDeclarationKind.withMarkers(this.visitMarkers(classDeclarationKind.markers, p));
        classDeclarationKind = classDeclarationKind.withAnnotations(ListUtils.map(classDeclarationKind.annotations, el => this.visit(el, p) as java.Annotation));
        return classDeclarationKind;
    }

    public visitCompilationUnit(compilationUnit: java.CompilationUnit, p: P): J | null {
        compilationUnit = compilationUnit.withPrefix(this.visitSpace(compilationUnit.prefix, Space.Location.COMPILATION_UNIT_PREFIX, p)!);
        compilationUnit = compilationUnit.withMarkers(this.visitMarkers(compilationUnit.markers, p));
        compilationUnit = compilationUnit.padding.withPackageDeclaration(this.visitRightPadded(compilationUnit.padding.packageDeclaration, JRightPadded.Location.PACKAGE, p));
        compilationUnit = compilationUnit.padding.withImports(ListUtils.map(compilationUnit.padding.imports, el => this.visitRightPadded(el, JRightPadded.Location.IMPORT, p)));
        compilationUnit = compilationUnit.withClasses(ListUtils.map(compilationUnit.classes, el => this.visit(el, p) as java.ClassDeclaration));
        compilationUnit = compilationUnit.withEof(this.visitSpace(compilationUnit.eof, Space.Location.COMPILATION_UNIT_EOF, p)!);
        return compilationUnit;
    }

    public visitContinue(_continue: java.Continue, p: P): J | null {
        _continue = _continue.withPrefix(this.visitSpace(_continue.prefix, Space.Location.CONTINUE_PREFIX, p)!);
        let tempStatement = this.visitStatement(_continue, p) as Statement;
        if (!(tempStatement instanceof java.Continue))
        {
            return tempStatement;
        }
        _continue = tempStatement as java.Continue;
        _continue = _continue.withMarkers(this.visitMarkers(_continue.markers, p));
        _continue = _continue.withLabel(this.visitAndCast(_continue.label, p));
        return _continue;
    }

    public visitDoWhileLoop(doWhileLoop: java.DoWhileLoop, p: P): J | null {
        doWhileLoop = doWhileLoop.withPrefix(this.visitSpace(doWhileLoop.prefix, Space.Location.DO_WHILE_PREFIX, p)!);
        let tempStatement = this.visitStatement(doWhileLoop, p) as Statement;
        if (!(tempStatement instanceof java.DoWhileLoop))
        {
            return tempStatement;
        }
        doWhileLoop = tempStatement as java.DoWhileLoop;
        doWhileLoop = doWhileLoop.withMarkers(this.visitMarkers(doWhileLoop.markers, p));
        doWhileLoop = doWhileLoop.padding.withBody(this.visitRightPadded(doWhileLoop.padding.body, JRightPadded.Location.WHILE_BODY, p)!);
        doWhileLoop = doWhileLoop.padding.withWhileCondition(this.visitLeftPadded(doWhileLoop.padding.whileCondition, JLeftPadded.Location.WHILE_CONDITION, p)!);
        return doWhileLoop;
    }

    public visitEmpty(empty: java.Empty, p: P): J | null {
        empty = empty.withPrefix(this.visitSpace(empty.prefix, Space.Location.EMPTY_PREFIX, p)!);
        let tempStatement = this.visitStatement(empty, p) as Statement;
        if (!(tempStatement instanceof java.Empty))
        {
            return tempStatement;
        }
        empty = tempStatement as java.Empty;
        let tempExpression = this.visitExpression(empty, p) as Expression;
        if (!(tempExpression instanceof java.Empty))
        {
            return tempExpression;
        }
        empty = tempExpression as java.Empty;
        empty = empty.withMarkers(this.visitMarkers(empty.markers, p));
        return empty;
    }

    public visitEnumValue(enumValue: java.EnumValue, p: P): J | null {
        enumValue = enumValue.withPrefix(this.visitSpace(enumValue.prefix, Space.Location.ENUM_VALUE_PREFIX, p)!);
        enumValue = enumValue.withMarkers(this.visitMarkers(enumValue.markers, p));
        enumValue = enumValue.withAnnotations(ListUtils.map(enumValue.annotations, el => this.visit(el, p) as java.Annotation));
        enumValue = enumValue.withName(this.visitAndCast(enumValue.name, p)!);
        enumValue = enumValue.withInitializer(this.visitAndCast(enumValue.initializer, p));
        return enumValue;
    }

    public visitEnumValueSet(enumValueSet: java.EnumValueSet, p: P): J | null {
        enumValueSet = enumValueSet.withPrefix(this.visitSpace(enumValueSet.prefix, Space.Location.ENUM_VALUE_SET_PREFIX, p)!);
        let tempStatement = this.visitStatement(enumValueSet, p) as Statement;
        if (!(tempStatement instanceof java.EnumValueSet))
        {
            return tempStatement;
        }
        enumValueSet = tempStatement as java.EnumValueSet;
        enumValueSet = enumValueSet.withMarkers(this.visitMarkers(enumValueSet.markers, p));
        enumValueSet = enumValueSet.padding.withEnums(ListUtils.map(enumValueSet.padding.enums, el => this.visitRightPadded(el, JRightPadded.Location.ENUM_VALUE, p)));
        return enumValueSet;
    }

    public visitFieldAccess(fieldAccess: java.FieldAccess, p: P): J | null {
        fieldAccess = fieldAccess.withPrefix(this.visitSpace(fieldAccess.prefix, Space.Location.FIELD_ACCESS_PREFIX, p)!);
        let tempStatement = this.visitStatement(fieldAccess, p) as Statement;
        if (!(tempStatement instanceof java.FieldAccess))
        {
            return tempStatement;
        }
        fieldAccess = tempStatement as java.FieldAccess;
        let tempExpression = this.visitExpression(fieldAccess, p) as Expression;
        if (!(tempExpression instanceof java.FieldAccess))
        {
            return tempExpression;
        }
        fieldAccess = tempExpression as java.FieldAccess;
        fieldAccess = fieldAccess.withMarkers(this.visitMarkers(fieldAccess.markers, p));
        fieldAccess = fieldAccess.withTarget(this.visitAndCast(fieldAccess.target, p)!);
        fieldAccess = fieldAccess.padding.withName(this.visitLeftPadded(fieldAccess.padding.name, JLeftPadded.Location.FIELD_ACCESS_NAME, p)!);
        return fieldAccess;
    }

    public visitForEachLoop(forEachLoop: java.ForEachLoop, p: P): J | null {
        forEachLoop = forEachLoop.withPrefix(this.visitSpace(forEachLoop.prefix, Space.Location.FOR_EACH_LOOP_PREFIX, p)!);
        let tempStatement = this.visitStatement(forEachLoop, p) as Statement;
        if (!(tempStatement instanceof java.ForEachLoop))
        {
            return tempStatement;
        }
        forEachLoop = tempStatement as java.ForEachLoop;
        forEachLoop = forEachLoop.withMarkers(this.visitMarkers(forEachLoop.markers, p));
        forEachLoop = forEachLoop.withControl(this.visitAndCast(forEachLoop.control, p)!);
        forEachLoop = forEachLoop.padding.withBody(this.visitRightPadded(forEachLoop.padding.body, JRightPadded.Location.FOR_BODY, p)!);
        return forEachLoop;
    }

    public visitForEachControl(forEachLoopControl: java.ForEachLoopControl, p: P): J | null {
        forEachLoopControl = forEachLoopControl.withPrefix(this.visitSpace(forEachLoopControl.prefix, Space.Location.FOR_EACH_CONTROL_PREFIX, p)!);
        forEachLoopControl = forEachLoopControl.withMarkers(this.visitMarkers(forEachLoopControl.markers, p));
        forEachLoopControl = forEachLoopControl.padding.withVariable(this.visitRightPadded(forEachLoopControl.padding.variable, JRightPadded.Location.FOREACH_VARIABLE, p)!);
        forEachLoopControl = forEachLoopControl.padding.withIterable(this.visitRightPadded(forEachLoopControl.padding.iterable, JRightPadded.Location.FOREACH_ITERABLE, p)!);
        return forEachLoopControl;
    }

    public visitForLoop(forLoop: java.ForLoop, p: P): J | null {
        forLoop = forLoop.withPrefix(this.visitSpace(forLoop.prefix, Space.Location.FOR_PREFIX, p)!);
        let tempStatement = this.visitStatement(forLoop, p) as Statement;
        if (!(tempStatement instanceof java.ForLoop))
        {
            return tempStatement;
        }
        forLoop = tempStatement as java.ForLoop;
        forLoop = forLoop.withMarkers(this.visitMarkers(forLoop.markers, p));
        forLoop = forLoop.withControl(this.visitAndCast(forLoop.control, p)!);
        forLoop = forLoop.padding.withBody(this.visitRightPadded(forLoop.padding.body, JRightPadded.Location.FOR_BODY, p)!);
        return forLoop;
    }

    public visitForControl(forLoopControl: java.ForLoopControl, p: P): J | null {
        forLoopControl = forLoopControl.withPrefix(this.visitSpace(forLoopControl.prefix, Space.Location.FOR_CONTROL_PREFIX, p)!);
        forLoopControl = forLoopControl.withMarkers(this.visitMarkers(forLoopControl.markers, p));
        forLoopControl = forLoopControl.padding.withInit(ListUtils.map(forLoopControl.padding.init, el => this.visitRightPadded(el, JRightPadded.Location.FOR_INIT, p)));
        forLoopControl = forLoopControl.padding.withCondition(this.visitRightPadded(forLoopControl.padding.condition, JRightPadded.Location.FOR_CONDITION, p)!);
        forLoopControl = forLoopControl.padding.withUpdate(ListUtils.map(forLoopControl.padding.update, el => this.visitRightPadded(el, JRightPadded.Location.FOR_UPDATE, p)));
        return forLoopControl;
    }

    public visitParenthesizedTypeTree(parenthesizedTypeTree: java.ParenthesizedTypeTree, p: P): J | null {
        parenthesizedTypeTree = parenthesizedTypeTree.withPrefix(this.visitSpace(parenthesizedTypeTree.prefix, Space.Location.PARENTHESES_PREFIX, p)!);
        let tempExpression = this.visitExpression(parenthesizedTypeTree, p) as Expression;
        if (!(tempExpression instanceof java.ParenthesizedTypeTree))
        {
            return tempExpression;
        }
        parenthesizedTypeTree = tempExpression as java.ParenthesizedTypeTree;
        parenthesizedTypeTree = parenthesizedTypeTree.withMarkers(this.visitMarkers(parenthesizedTypeTree.markers, p));
        parenthesizedTypeTree = parenthesizedTypeTree.withAnnotations(ListUtils.map(parenthesizedTypeTree.annotations, el => this.visit(el, p) as java.Annotation));
        parenthesizedTypeTree = parenthesizedTypeTree.withParenthesizedType(this.visitAndCast(parenthesizedTypeTree.parenthesizedType, p)!);
        return parenthesizedTypeTree;
    }

    public visitIdentifier(identifier: java.Identifier, p: P): J | null {
        identifier = identifier.withPrefix(this.visitSpace(identifier.prefix, Space.Location.IDENTIFIER_PREFIX, p)!);
        let tempExpression = this.visitExpression(identifier, p) as Expression;
        if (!(tempExpression instanceof java.Identifier))
        {
            return tempExpression;
        }
        identifier = tempExpression as java.Identifier;
        identifier = identifier.withMarkers(this.visitMarkers(identifier.markers, p));
        identifier = identifier.withAnnotations(ListUtils.map(identifier.annotations, el => this.visit(el, p) as java.Annotation));
        return identifier;
    }

    public visitIf(_if: java.If, p: P): J | null {
        _if = _if.withPrefix(this.visitSpace(_if.prefix, Space.Location.IF_PREFIX, p)!);
        let tempStatement = this.visitStatement(_if, p) as Statement;
        if (!(tempStatement instanceof java.If))
        {
            return tempStatement;
        }
        _if = tempStatement as java.If;
        _if = _if.withMarkers(this.visitMarkers(_if.markers, p));
        _if = _if.withIfCondition(this.visitAndCast(_if.ifCondition, p)!);
        _if = _if.padding.withThenPart(this.visitRightPadded(_if.padding.thenPart, JRightPadded.Location.IF_THEN, p)!);
        _if = _if.withElsePart(this.visitAndCast(_if.elsePart, p));
        return _if;
    }

    public visitElse(ifElse: java.IfElse, p: P): J | null {
        ifElse = ifElse.withPrefix(this.visitSpace(ifElse.prefix, Space.Location.ELSE_PREFIX, p)!);
        ifElse = ifElse.withMarkers(this.visitMarkers(ifElse.markers, p));
        ifElse = ifElse.padding.withBody(this.visitRightPadded(ifElse.padding.body, JRightPadded.Location.IF_ELSE, p)!);
        return ifElse;
    }

    public visitImport(_import: java.Import, p: P): J | null {
        _import = _import.withPrefix(this.visitSpace(_import.prefix, Space.Location.IMPORT_PREFIX, p)!);
        let tempStatement = this.visitStatement(_import, p) as Statement;
        if (!(tempStatement instanceof java.Import))
        {
            return tempStatement;
        }
        _import = tempStatement as java.Import;
        _import = _import.withMarkers(this.visitMarkers(_import.markers, p));
        _import = _import.padding.withStatic(this.visitLeftPadded(_import.padding.static, JLeftPadded.Location.STATIC_IMPORT, p)!);
        _import = _import.withQualid(this.visitAndCast(_import.qualid, p)!);
        _import = _import.padding.withAlias(this.visitLeftPadded(_import.padding.alias, JLeftPadded.Location.IMPORT_ALIAS_PREFIX, p));
        return _import;
    }

    public visitInstanceOf(instanceOf: java.InstanceOf, p: P): J | null {
        instanceOf = instanceOf.withPrefix(this.visitSpace(instanceOf.prefix, Space.Location.INSTANCEOF_PREFIX, p)!);
        let tempExpression = this.visitExpression(instanceOf, p) as Expression;
        if (!(tempExpression instanceof java.InstanceOf))
        {
            return tempExpression;
        }
        instanceOf = tempExpression as java.InstanceOf;
        instanceOf = instanceOf.withMarkers(this.visitMarkers(instanceOf.markers, p));
        instanceOf = instanceOf.padding.withExpression(this.visitRightPadded(instanceOf.padding.expression, JRightPadded.Location.INSTANCEOF, p)!);
        instanceOf = instanceOf.withClazz(this.visitAndCast(instanceOf.clazz, p)!);
        instanceOf = instanceOf.withPattern(this.visitAndCast(instanceOf.pattern, p));
        return instanceOf;
    }

    public visitIntersectionType(intersectionType: java.IntersectionType, p: P): J | null {
        intersectionType = intersectionType.withPrefix(this.visitSpace(intersectionType.prefix, Space.Location.INTERSECTION_TYPE_PREFIX, p)!);
        let tempExpression = this.visitExpression(intersectionType, p) as Expression;
        if (!(tempExpression instanceof java.IntersectionType))
        {
            return tempExpression;
        }
        intersectionType = tempExpression as java.IntersectionType;
        intersectionType = intersectionType.withMarkers(this.visitMarkers(intersectionType.markers, p));
        intersectionType = intersectionType.padding.withBounds(this.visitContainer(intersectionType.padding.bounds, JContainer.Location.TYPE_BOUNDS, p)!);
        return intersectionType;
    }

    public visitLabel(label: java.Label, p: P): J | null {
        label = label.withPrefix(this.visitSpace(label.prefix, Space.Location.LABEL_PREFIX, p)!);
        let tempStatement = this.visitStatement(label, p) as Statement;
        if (!(tempStatement instanceof java.Label))
        {
            return tempStatement;
        }
        label = tempStatement as java.Label;
        label = label.withMarkers(this.visitMarkers(label.markers, p));
        label = label.padding.withLabel(this.visitRightPadded(label.padding.label, JRightPadded.Location.LABEL, p)!);
        label = label.withStatement(this.visitAndCast(label.statement, p)!);
        return label;
    }

    public visitLambda(lambda: java.Lambda, p: P): J | null {
        lambda = lambda.withPrefix(this.visitSpace(lambda.prefix, Space.Location.LAMBDA_PREFIX, p)!);
        let tempStatement = this.visitStatement(lambda, p) as Statement;
        if (!(tempStatement instanceof java.Lambda))
        {
            return tempStatement;
        }
        lambda = tempStatement as java.Lambda;
        let tempExpression = this.visitExpression(lambda, p) as Expression;
        if (!(tempExpression instanceof java.Lambda))
        {
            return tempExpression;
        }
        lambda = tempExpression as java.Lambda;
        lambda = lambda.withMarkers(this.visitMarkers(lambda.markers, p));
        lambda = lambda.withParameters(this.visitAndCast(lambda.parameters, p)!);
        lambda = lambda.withArrow(this.visitSpace(lambda.arrow, Space.Location.LAMBDA_ARROW_PREFIX, p)!);
        lambda = lambda.withBody(this.visitAndCast(lambda.body, p)!);
        return lambda;
    }

    public visitLambdaParameters(lambdaParameters: java.LambdaParameters, p: P): J | null {
        lambdaParameters = lambdaParameters.withPrefix(this.visitSpace(lambdaParameters.prefix, Space.Location.LAMBDA_PARAMETERS_PREFIX, p)!);
        lambdaParameters = lambdaParameters.withMarkers(this.visitMarkers(lambdaParameters.markers, p));
        lambdaParameters = lambdaParameters.padding.withParameters(ListUtils.map(lambdaParameters.padding.parameters, el => this.visitRightPadded(el, JRightPadded.Location.LAMBDA_PARAM, p)));
        return lambdaParameters;
    }

    public visitLiteral(literal: java.Literal, p: P): J | null {
        literal = literal.withPrefix(this.visitSpace(literal.prefix, Space.Location.LITERAL_PREFIX, p)!);
        let tempExpression = this.visitExpression(literal, p) as Expression;
        if (!(tempExpression instanceof java.Literal))
        {
            return tempExpression;
        }
        literal = tempExpression as java.Literal;
        literal = literal.withMarkers(this.visitMarkers(literal.markers, p));
        return literal;
    }

    public visitMemberReference(memberReference: java.MemberReference, p: P): J | null {
        memberReference = memberReference.withPrefix(this.visitSpace(memberReference.prefix, Space.Location.MEMBER_REFERENCE_PREFIX, p)!);
        let tempExpression = this.visitExpression(memberReference, p) as Expression;
        if (!(tempExpression instanceof java.MemberReference))
        {
            return tempExpression;
        }
        memberReference = tempExpression as java.MemberReference;
        memberReference = memberReference.withMarkers(this.visitMarkers(memberReference.markers, p));
        memberReference = memberReference.padding.withContaining(this.visitRightPadded(memberReference.padding.containing, JRightPadded.Location.MEMBER_REFERENCE_CONTAINING, p)!);
        memberReference = memberReference.padding.withTypeParameters(this.visitContainer(memberReference.padding.typeParameters, JContainer.Location.TYPE_PARAMETERS, p));
        memberReference = memberReference.padding.withReference(this.visitLeftPadded(memberReference.padding.reference, JLeftPadded.Location.MEMBER_REFERENCE_NAME, p)!);
        return memberReference;
    }

    public visitMethodDeclaration(methodDeclaration: java.MethodDeclaration, p: P): J | null {
        methodDeclaration = methodDeclaration.withPrefix(this.visitSpace(methodDeclaration.prefix, Space.Location.METHOD_DECLARATION_PREFIX, p)!);
        let tempStatement = this.visitStatement(methodDeclaration, p) as Statement;
        if (!(tempStatement instanceof java.MethodDeclaration))
        {
            return tempStatement;
        }
        methodDeclaration = tempStatement as java.MethodDeclaration;
        methodDeclaration = methodDeclaration.withMarkers(this.visitMarkers(methodDeclaration.markers, p));
        methodDeclaration = methodDeclaration.withLeadingAnnotations(ListUtils.map(methodDeclaration.leadingAnnotations, el => this.visit(el, p) as java.Annotation));
        methodDeclaration = methodDeclaration.withModifiers(ListUtils.map(methodDeclaration.modifiers, el => this.visit(el, p) as java.Modifier));
        methodDeclaration = methodDeclaration.annotations.withTypeParameters(this.visitAndCast(methodDeclaration.annotations.typeParameters, p));
        methodDeclaration = methodDeclaration.withReturnTypeExpression(this.visitAndCast(methodDeclaration.returnTypeExpression, p));
        methodDeclaration = methodDeclaration.annotations.withName(methodDeclaration.annotations.name.withAnnotations(ListUtils.map(methodDeclaration.annotations.name.annotations, el => this.visit(el, p) as java.Annotation)).withIdentifier(this.visitAndCast(methodDeclaration.annotations.name.identifier, p)!));
        methodDeclaration = methodDeclaration.padding.withParameters(this.visitContainer(methodDeclaration.padding.parameters, JContainer.Location.METHOD_DECLARATION_PARAMETERS, p)!);
        methodDeclaration = methodDeclaration.padding.withThrows(this.visitContainer(methodDeclaration.padding.throws, JContainer.Location.THROWS, p));
        methodDeclaration = methodDeclaration.withBody(this.visitAndCast(methodDeclaration.body, p));
        methodDeclaration = methodDeclaration.padding.withDefaultValue(this.visitLeftPadded(methodDeclaration.padding.defaultValue, JLeftPadded.Location.METHOD_DECLARATION_DEFAULT_VALUE, p));
        return methodDeclaration;
    }

    public visitMethodInvocation(methodInvocation: java.MethodInvocation, p: P): J | null {
        methodInvocation = methodInvocation.withPrefix(this.visitSpace(methodInvocation.prefix, Space.Location.METHOD_INVOCATION_PREFIX, p)!);
        let tempStatement = this.visitStatement(methodInvocation, p) as Statement;
        if (!(tempStatement instanceof java.MethodInvocation))
        {
            return tempStatement;
        }
        methodInvocation = tempStatement as java.MethodInvocation;
        let tempExpression = this.visitExpression(methodInvocation, p) as Expression;
        if (!(tempExpression instanceof java.MethodInvocation))
        {
            return tempExpression;
        }
        methodInvocation = tempExpression as java.MethodInvocation;
        methodInvocation = methodInvocation.withMarkers(this.visitMarkers(methodInvocation.markers, p));
        methodInvocation = methodInvocation.padding.withSelect(this.visitRightPadded(methodInvocation.padding.select, JRightPadded.Location.METHOD_SELECT, p));
        methodInvocation = methodInvocation.padding.withTypeParameters(this.visitContainer(methodInvocation.padding.typeParameters, JContainer.Location.TYPE_PARAMETERS, p));
        methodInvocation = methodInvocation.withName(this.visitAndCast(methodInvocation.name, p)!);
        methodInvocation = methodInvocation.padding.withArguments(this.visitContainer(methodInvocation.padding.arguments, JContainer.Location.METHOD_INVOCATION_ARGUMENTS, p)!);
        return methodInvocation;
    }

    public visitModifier(modifier: java.Modifier, p: P): J | null {
        modifier = modifier.withPrefix(this.visitSpace(modifier.prefix, Space.Location.MODIFIER_PREFIX, p)!);
        modifier = modifier.withMarkers(this.visitMarkers(modifier.markers, p));
        modifier = modifier.withAnnotations(ListUtils.map(modifier.annotations, el => this.visit(el, p) as java.Annotation));
        return modifier;
    }

    public visitMultiCatch(multiCatch: java.MultiCatch, p: P): J | null {
        multiCatch = multiCatch.withPrefix(this.visitSpace(multiCatch.prefix, Space.Location.MULTI_CATCH_PREFIX, p)!);
        multiCatch = multiCatch.withMarkers(this.visitMarkers(multiCatch.markers, p));
        multiCatch = multiCatch.padding.withAlternatives(ListUtils.map(multiCatch.padding.alternatives, el => this.visitRightPadded(el, JRightPadded.Location.CATCH_ALTERNATIVE, p)));
        return multiCatch;
    }

    public visitNewArray(newArray: java.NewArray, p: P): J | null {
        newArray = newArray.withPrefix(this.visitSpace(newArray.prefix, Space.Location.NEW_ARRAY_PREFIX, p)!);
        let tempExpression = this.visitExpression(newArray, p) as Expression;
        if (!(tempExpression instanceof java.NewArray))
        {
            return tempExpression;
        }
        newArray = tempExpression as java.NewArray;
        newArray = newArray.withMarkers(this.visitMarkers(newArray.markers, p));
        newArray = newArray.withTypeExpression(this.visitAndCast(newArray.typeExpression, p));
        newArray = newArray.withDimensions(ListUtils.map(newArray.dimensions, el => this.visit(el, p) as java.ArrayDimension));
        newArray = newArray.padding.withInitializer(this.visitContainer(newArray.padding.initializer, JContainer.Location.NEW_ARRAY_INITIALIZER, p));
        return newArray;
    }

    public visitArrayDimension(arrayDimension: java.ArrayDimension, p: P): J | null {
        arrayDimension = arrayDimension.withPrefix(this.visitSpace(arrayDimension.prefix, Space.Location.DIMENSION_PREFIX, p)!);
        arrayDimension = arrayDimension.withMarkers(this.visitMarkers(arrayDimension.markers, p));
        arrayDimension = arrayDimension.padding.withIndex(this.visitRightPadded(arrayDimension.padding.index, JRightPadded.Location.ARRAY_INDEX, p)!);
        return arrayDimension;
    }

    public visitNewClass(newClass: java.NewClass, p: P): J | null {
        newClass = newClass.withPrefix(this.visitSpace(newClass.prefix, Space.Location.NEW_CLASS_PREFIX, p)!);
        let tempStatement = this.visitStatement(newClass, p) as Statement;
        if (!(tempStatement instanceof java.NewClass))
        {
            return tempStatement;
        }
        newClass = tempStatement as java.NewClass;
        let tempExpression = this.visitExpression(newClass, p) as Expression;
        if (!(tempExpression instanceof java.NewClass))
        {
            return tempExpression;
        }
        newClass = tempExpression as java.NewClass;
        newClass = newClass.withMarkers(this.visitMarkers(newClass.markers, p));
        newClass = newClass.padding.withEnclosing(this.visitRightPadded(newClass.padding.enclosing, JRightPadded.Location.NEW_CLASS_ENCLOSING, p));
        newClass = newClass.withNew(this.visitSpace(newClass.new, Space.Location.NEW_PREFIX, p)!);
        newClass = newClass.withClazz(this.visitAndCast(newClass.clazz, p));
        newClass = newClass.padding.withArguments(this.visitContainer(newClass.padding.arguments, JContainer.Location.NEW_CLASS_ARGUMENTS, p)!);
        newClass = newClass.withBody(this.visitAndCast(newClass.body, p));
        return newClass;
    }

    public visitNullableType(nullableType: java.NullableType, p: P): J | null {
        nullableType = nullableType.withPrefix(this.visitSpace(nullableType.prefix, Space.Location.NULLABLE_TYPE_PREFIX, p)!);
        let tempExpression = this.visitExpression(nullableType, p) as Expression;
        if (!(tempExpression instanceof java.NullableType))
        {
            return tempExpression;
        }
        nullableType = tempExpression as java.NullableType;
        nullableType = nullableType.withMarkers(this.visitMarkers(nullableType.markers, p));
        nullableType = nullableType.withAnnotations(ListUtils.map(nullableType.annotations, el => this.visit(el, p) as java.Annotation));
        nullableType = nullableType.padding.withTypeTree(this.visitRightPadded(nullableType.padding.typeTree, JRightPadded.Location.NULLABLE, p)!);
        return nullableType;
    }

    public visitPackage(_package: java.Package, p: P): J | null {
        _package = _package.withPrefix(this.visitSpace(_package.prefix, Space.Location.PACKAGE_PREFIX, p)!);
        let tempStatement = this.visitStatement(_package, p) as Statement;
        if (!(tempStatement instanceof java.Package))
        {
            return tempStatement;
        }
        _package = tempStatement as java.Package;
        _package = _package.withMarkers(this.visitMarkers(_package.markers, p));
        _package = _package.withExpression(this.visitAndCast(_package.expression, p)!);
        _package = _package.withAnnotations(ListUtils.map(_package.annotations, el => this.visit(el, p) as java.Annotation));
        return _package;
    }

    public visitParameterizedType(parameterizedType: java.ParameterizedType, p: P): J | null {
        parameterizedType = parameterizedType.withPrefix(this.visitSpace(parameterizedType.prefix, Space.Location.PARAMETERIZED_TYPE_PREFIX, p)!);
        let tempExpression = this.visitExpression(parameterizedType, p) as Expression;
        if (!(tempExpression instanceof java.ParameterizedType))
        {
            return tempExpression;
        }
        parameterizedType = tempExpression as java.ParameterizedType;
        parameterizedType = parameterizedType.withMarkers(this.visitMarkers(parameterizedType.markers, p));
        parameterizedType = parameterizedType.withClazz(this.visitAndCast(parameterizedType.clazz, p)!);
        parameterizedType = parameterizedType.padding.withTypeParameters(this.visitContainer(parameterizedType.padding.typeParameters, JContainer.Location.TYPE_PARAMETERS, p));
        return parameterizedType;
    }

    public visitParentheses<J2 extends J>(parentheses: java.Parentheses<J2>, p: P): J | null {
        parentheses = parentheses.withPrefix(this.visitSpace(parentheses.prefix, Space.Location.PARENTHESES_PREFIX, p)!);
        let tempExpression = this.visitExpression(parentheses, p) as Expression;
        if (!(tempExpression instanceof java.Parentheses<J2>))
        {
            return tempExpression;
        }
        parentheses = tempExpression as java.Parentheses<J2>;
        parentheses = parentheses.withMarkers(this.visitMarkers(parentheses.markers, p));
        parentheses = parentheses.padding.withTree(this.visitRightPadded(parentheses.padding.tree, JRightPadded.Location.PARENTHESES, p)!);
        return parentheses;
    }

    public visitControlParentheses<J2 extends J>(controlParentheses: java.ControlParentheses<J2>, p: P): J | null {
        controlParentheses = controlParentheses.withPrefix(this.visitSpace(controlParentheses.prefix, Space.Location.CONTROL_PARENTHESES_PREFIX, p)!);
        let tempExpression = this.visitExpression(controlParentheses, p) as Expression;
        if (!(tempExpression instanceof java.ControlParentheses<J2>))
        {
            return tempExpression;
        }
        controlParentheses = tempExpression as java.ControlParentheses<J2>;
        controlParentheses = controlParentheses.withMarkers(this.visitMarkers(controlParentheses.markers, p));
        controlParentheses = controlParentheses.padding.withTree(this.visitRightPadded(controlParentheses.padding.tree, JRightPadded.Location.PARENTHESES, p)!);
        return controlParentheses;
    }

    public visitPrimitive(primitive: java.Primitive, p: P): J | null {
        primitive = primitive.withPrefix(this.visitSpace(primitive.prefix, Space.Location.PRIMITIVE_PREFIX, p)!);
        let tempExpression = this.visitExpression(primitive, p) as Expression;
        if (!(tempExpression instanceof java.Primitive))
        {
            return tempExpression;
        }
        primitive = tempExpression as java.Primitive;
        primitive = primitive.withMarkers(this.visitMarkers(primitive.markers, p));
        return primitive;
    }

    public visitReturn(_return: java.Return, p: P): J | null {
        _return = _return.withPrefix(this.visitSpace(_return.prefix, Space.Location.RETURN_PREFIX, p)!);
        let tempStatement = this.visitStatement(_return, p) as Statement;
        if (!(tempStatement instanceof java.Return))
        {
            return tempStatement;
        }
        _return = tempStatement as java.Return;
        _return = _return.withMarkers(this.visitMarkers(_return.markers, p));
        _return = _return.withExpression(this.visitAndCast(_return.expression, p));
        return _return;
    }

    public visitSwitch(_switch: java.Switch, p: P): J | null {
        _switch = _switch.withPrefix(this.visitSpace(_switch.prefix, Space.Location.SWITCH_PREFIX, p)!);
        let tempStatement = this.visitStatement(_switch, p) as Statement;
        if (!(tempStatement instanceof java.Switch))
        {
            return tempStatement;
        }
        _switch = tempStatement as java.Switch;
        _switch = _switch.withMarkers(this.visitMarkers(_switch.markers, p));
        _switch = _switch.withSelector(this.visitAndCast(_switch.selector, p)!);
        _switch = _switch.withCases(this.visitAndCast(_switch.cases, p)!);
        return _switch;
    }

    public visitSwitchExpression(switchExpression: java.SwitchExpression, p: P): J | null {
        switchExpression = switchExpression.withPrefix(this.visitSpace(switchExpression.prefix, Space.Location.SWITCH_EXPRESSION_PREFIX, p)!);
        let tempExpression = this.visitExpression(switchExpression, p) as Expression;
        if (!(tempExpression instanceof java.SwitchExpression))
        {
            return tempExpression;
        }
        switchExpression = tempExpression as java.SwitchExpression;
        switchExpression = switchExpression.withMarkers(this.visitMarkers(switchExpression.markers, p));
        switchExpression = switchExpression.withSelector(this.visitAndCast(switchExpression.selector, p)!);
        switchExpression = switchExpression.withCases(this.visitAndCast(switchExpression.cases, p)!);
        return switchExpression;
    }

    public visitSynchronized(synchronized: java.Synchronized, p: P): J | null {
        synchronized = synchronized.withPrefix(this.visitSpace(synchronized.prefix, Space.Location.SYNCHRONIZED_PREFIX, p)!);
        let tempStatement = this.visitStatement(synchronized, p) as Statement;
        if (!(tempStatement instanceof java.Synchronized))
        {
            return tempStatement;
        }
        synchronized = tempStatement as java.Synchronized;
        synchronized = synchronized.withMarkers(this.visitMarkers(synchronized.markers, p));
        synchronized = synchronized.withLock(this.visitAndCast(synchronized.lock, p)!);
        synchronized = synchronized.withBody(this.visitAndCast(synchronized.body, p)!);
        return synchronized;
    }

    public visitTernary(ternary: java.Ternary, p: P): J | null {
        ternary = ternary.withPrefix(this.visitSpace(ternary.prefix, Space.Location.TERNARY_PREFIX, p)!);
        let tempStatement = this.visitStatement(ternary, p) as Statement;
        if (!(tempStatement instanceof java.Ternary))
        {
            return tempStatement;
        }
        ternary = tempStatement as java.Ternary;
        let tempExpression = this.visitExpression(ternary, p) as Expression;
        if (!(tempExpression instanceof java.Ternary))
        {
            return tempExpression;
        }
        ternary = tempExpression as java.Ternary;
        ternary = ternary.withMarkers(this.visitMarkers(ternary.markers, p));
        ternary = ternary.withCondition(this.visitAndCast(ternary.condition, p)!);
        ternary = ternary.padding.withTruePart(this.visitLeftPadded(ternary.padding.truePart, JLeftPadded.Location.TERNARY_TRUE, p)!);
        ternary = ternary.padding.withFalsePart(this.visitLeftPadded(ternary.padding.falsePart, JLeftPadded.Location.TERNARY_FALSE, p)!);
        return ternary;
    }

    public visitThrow(_throw: java.Throw, p: P): J | null {
        _throw = _throw.withPrefix(this.visitSpace(_throw.prefix, Space.Location.THROW_PREFIX, p)!);
        let tempStatement = this.visitStatement(_throw, p) as Statement;
        if (!(tempStatement instanceof java.Throw))
        {
            return tempStatement;
        }
        _throw = tempStatement as java.Throw;
        _throw = _throw.withMarkers(this.visitMarkers(_throw.markers, p));
        _throw = _throw.withException(this.visitAndCast(_throw.exception, p)!);
        return _throw;
    }

    public visitTry(_try: java.Try, p: P): J | null {
        _try = _try.withPrefix(this.visitSpace(_try.prefix, Space.Location.TRY_PREFIX, p)!);
        let tempStatement = this.visitStatement(_try, p) as Statement;
        if (!(tempStatement instanceof java.Try))
        {
            return tempStatement;
        }
        _try = tempStatement as java.Try;
        _try = _try.withMarkers(this.visitMarkers(_try.markers, p));
        _try = _try.padding.withResources(this.visitContainer(_try.padding.resources, JContainer.Location.TRY_RESOURCES, p));
        _try = _try.withBody(this.visitAndCast(_try.body, p)!);
        _try = _try.withCatches(ListUtils.map(_try.catches, el => this.visit(el, p) as java.TryCatch));
        _try = _try.padding.withFinally(this.visitLeftPadded(_try.padding.finally, JLeftPadded.Location.TRY_FINALLY, p));
        return _try;
    }

    public visitTryResource(tryResource: java.TryResource, p: P): J | null {
        tryResource = tryResource.withPrefix(this.visitSpace(tryResource.prefix, Space.Location.TRY_RESOURCE, p)!);
        tryResource = tryResource.withMarkers(this.visitMarkers(tryResource.markers, p));
        tryResource = tryResource.withVariableDeclarations(this.visitAndCast(tryResource.variableDeclarations, p)!);
        return tryResource;
    }

    public visitCatch(tryCatch: java.TryCatch, p: P): J | null {
        tryCatch = tryCatch.withPrefix(this.visitSpace(tryCatch.prefix, Space.Location.CATCH_PREFIX, p)!);
        tryCatch = tryCatch.withMarkers(this.visitMarkers(tryCatch.markers, p));
        tryCatch = tryCatch.withParameter(this.visitAndCast(tryCatch.parameter, p)!);
        tryCatch = tryCatch.withBody(this.visitAndCast(tryCatch.body, p)!);
        return tryCatch;
    }

    public visitTypeCast(typeCast: java.TypeCast, p: P): J | null {
        typeCast = typeCast.withPrefix(this.visitSpace(typeCast.prefix, Space.Location.TYPE_CAST_PREFIX, p)!);
        let tempExpression = this.visitExpression(typeCast, p) as Expression;
        if (!(tempExpression instanceof java.TypeCast))
        {
            return tempExpression;
        }
        typeCast = tempExpression as java.TypeCast;
        typeCast = typeCast.withMarkers(this.visitMarkers(typeCast.markers, p));
        typeCast = typeCast.withClazz(this.visitAndCast(typeCast.clazz, p)!);
        typeCast = typeCast.withExpression(this.visitAndCast(typeCast.expression, p)!);
        return typeCast;
    }

    public visitTypeParameter(typeParameter: java.TypeParameter, p: P): J | null {
        typeParameter = typeParameter.withPrefix(this.visitSpace(typeParameter.prefix, Space.Location.TYPE_PARAMETERS_PREFIX, p)!);
        typeParameter = typeParameter.withMarkers(this.visitMarkers(typeParameter.markers, p));
        typeParameter = typeParameter.withAnnotations(ListUtils.map(typeParameter.annotations, el => this.visit(el, p) as java.Annotation));
        typeParameter = typeParameter.withModifiers(ListUtils.map(typeParameter.modifiers, el => this.visit(el, p) as java.Modifier));
        typeParameter = typeParameter.withName(this.visitAndCast(typeParameter.name, p)!);
        typeParameter = typeParameter.padding.withBounds(this.visitContainer(typeParameter.padding.bounds, JContainer.Location.TYPE_BOUNDS, p));
        return typeParameter;
    }

    public visitTypeParameters(typeParameters: java.TypeParameters, p: P): J | null {
        typeParameters = typeParameters.withPrefix(this.visitSpace(typeParameters.prefix, Space.Location.TYPE_PARAMETERS_PREFIX, p)!);
        typeParameters = typeParameters.withMarkers(this.visitMarkers(typeParameters.markers, p));
        typeParameters = typeParameters.withAnnotations(ListUtils.map(typeParameters.annotations, el => this.visit(el, p) as java.Annotation));
        typeParameters = typeParameters.padding.withTypeParameters(ListUtils.map(typeParameters.padding.typeParameters, el => this.visitRightPadded(el, JRightPadded.Location.TYPE_PARAMETER, p)));
        return typeParameters;
    }

    public visitUnary(unary: java.Unary, p: P): J | null {
        unary = unary.withPrefix(this.visitSpace(unary.prefix, Space.Location.UNARY_PREFIX, p)!);
        let tempStatement = this.visitStatement(unary, p) as Statement;
        if (!(tempStatement instanceof java.Unary))
        {
            return tempStatement;
        }
        unary = tempStatement as java.Unary;
        let tempExpression = this.visitExpression(unary, p) as Expression;
        if (!(tempExpression instanceof java.Unary))
        {
            return tempExpression;
        }
        unary = tempExpression as java.Unary;
        unary = unary.withMarkers(this.visitMarkers(unary.markers, p));
        unary = unary.padding.withOperator(this.visitLeftPadded(unary.padding.operator, JLeftPadded.Location.UNARY_OPERATOR, p)!);
        unary = unary.withExpression(this.visitAndCast(unary.expression, p)!);
        return unary;
    }

    public visitVariableDeclarations(variableDeclarations: java.VariableDeclarations, p: P): J | null {
        variableDeclarations = variableDeclarations.withPrefix(this.visitSpace(variableDeclarations.prefix, Space.Location.VARIABLE_DECLARATIONS_PREFIX, p)!);
        let tempStatement = this.visitStatement(variableDeclarations, p) as Statement;
        if (!(tempStatement instanceof java.VariableDeclarations))
        {
            return tempStatement;
        }
        variableDeclarations = tempStatement as java.VariableDeclarations;
        variableDeclarations = variableDeclarations.withMarkers(this.visitMarkers(variableDeclarations.markers, p));
        variableDeclarations = variableDeclarations.withLeadingAnnotations(ListUtils.map(variableDeclarations.leadingAnnotations, el => this.visit(el, p) as java.Annotation));
        variableDeclarations = variableDeclarations.withModifiers(ListUtils.map(variableDeclarations.modifiers, el => this.visit(el, p) as java.Modifier));
        variableDeclarations = variableDeclarations.withTypeExpression(this.visitAndCast(variableDeclarations.typeExpression, p));
        variableDeclarations = variableDeclarations.withVarargs(this.visitSpace(variableDeclarations.varargs, Space.Location.VARARGS, p));
        variableDeclarations = variableDeclarations.withDimensionsBeforeName([el.with_before(self.visit_space(el.before, Space.Location.DIMENSION_PREFIX, p)).with_element(self.visit_space(el.element, Space.Location.DIMENSION, p)) for el in variable_declarations.dimensions_before_name]);
        variableDeclarations = variableDeclarations.padding.withVariables(ListUtils.map(variableDeclarations.padding.variables, el => this.visitRightPadded(el, JRightPadded.Location.NAMED_VARIABLE, p)));
        return variableDeclarations;
    }

    public visitVariable(variableDeclarationsNamedVariable: java.VariableDeclarationsNamedVariable, p: P): J | null {
        variableDeclarationsNamedVariable = variableDeclarationsNamedVariable.withPrefix(this.visitSpace(variableDeclarationsNamedVariable.prefix, Space.Location.VARIABLE_PREFIX, p)!);
        variableDeclarationsNamedVariable = variableDeclarationsNamedVariable.withMarkers(this.visitMarkers(variableDeclarationsNamedVariable.markers, p));
        variableDeclarationsNamedVariable = variableDeclarationsNamedVariable.withName(this.visitAndCast(variableDeclarationsNamedVariable.name, p)!);
        variableDeclarationsNamedVariable = variableDeclarationsNamedVariable.withDimensionsAfterName([el.with_before(self.visit_space(el.before, Space.Location.DIMENSION_PREFIX, p)).with_element(self.visit_space(el.element, Space.Location.DIMENSION, p)) for el in named_variable.dimensions_after_name]);
        variableDeclarationsNamedVariable = variableDeclarationsNamedVariable.padding.withInitializer(this.visitLeftPadded(variableDeclarationsNamedVariable.padding.initializer, JLeftPadded.Location.VARIABLE_INITIALIZER, p));
        return variableDeclarationsNamedVariable;
    }

    public visitWhileLoop(whileLoop: java.WhileLoop, p: P): J | null {
        whileLoop = whileLoop.withPrefix(this.visitSpace(whileLoop.prefix, Space.Location.WHILE_PREFIX, p)!);
        let tempStatement = this.visitStatement(whileLoop, p) as Statement;
        if (!(tempStatement instanceof java.WhileLoop))
        {
            return tempStatement;
        }
        whileLoop = tempStatement as java.WhileLoop;
        whileLoop = whileLoop.withMarkers(this.visitMarkers(whileLoop.markers, p));
        whileLoop = whileLoop.withCondition(this.visitAndCast(whileLoop.condition, p)!);
        whileLoop = whileLoop.padding.withBody(this.visitRightPadded(whileLoop.padding.body, JRightPadded.Location.WHILE_BODY, p)!);
        return whileLoop;
    }

    public visitWildcard(wildcard: java.Wildcard, p: P): J | null {
        wildcard = wildcard.withPrefix(this.visitSpace(wildcard.prefix, Space.Location.WILDCARD_PREFIX, p)!);
        let tempExpression = this.visitExpression(wildcard, p) as Expression;
        if (!(tempExpression instanceof java.Wildcard))
        {
            return tempExpression;
        }
        wildcard = tempExpression as java.Wildcard;
        wildcard = wildcard.withMarkers(this.visitMarkers(wildcard.markers, p));
        wildcard = wildcard.padding.withBound(this.visitLeftPadded(wildcard.padding.bound, JLeftPadded.Location.WILDCARD_BOUND, p));
        wildcard = wildcard.withBoundedType(this.visitAndCast(wildcard.boundedType, p));
        return wildcard;
    }

    public visitYield(_yield: java.Yield, p: P): J | null {
        _yield = _yield.withPrefix(this.visitSpace(_yield.prefix, Space.Location.YIELD_PREFIX, p)!);
        let tempStatement = this.visitStatement(_yield, p) as Statement;
        if (!(tempStatement instanceof java.Yield))
        {
            return tempStatement;
        }
        _yield = tempStatement as java.Yield;
        _yield = _yield.withMarkers(this.visitMarkers(_yield.markers, p));
        _yield = _yield.withValue(this.visitAndCast(_yield.value, p)!);
        return _yield;
    }

    public visitUnknown(unknown: java.Unknown, p: P): J | null {
        unknown = unknown.withPrefix(this.visitSpace(unknown.prefix, Space.Location.UNKNOWN_PREFIX, p)!);
        let tempStatement = this.visitStatement(unknown, p) as Statement;
        if (!(tempStatement instanceof java.Unknown))
        {
            return tempStatement;
        }
        unknown = tempStatement as java.Unknown;
        let tempExpression = this.visitExpression(unknown, p) as Expression;
        if (!(tempExpression instanceof java.Unknown))
        {
            return tempExpression;
        }
        unknown = tempExpression as java.Unknown;
        unknown = unknown.withMarkers(this.visitMarkers(unknown.markers, p));
        unknown = unknown.withSource(this.visitAndCast(unknown.source, p)!);
        return unknown;
    }

    public visitUnknownSource(unknownSource: java.UnknownSource, p: P): J | null {
        unknownSource = unknownSource.withPrefix(this.visitSpace(unknownSource.prefix, Space.Location.UNKNOWN_SOURCE_PREFIX, p)!);
        unknownSource = unknownSource.withMarkers(this.visitMarkers(unknownSource.markers, p));
        return unknownSource;
    }

    public visitContainer<T>(container: JContainer<T> | null, loc: JContainerLocation, p: P) {
        return extensions.visitContainer(this, container, loc, p);
    }

    public visitLeftPadded<T>(left: JLeftPadded<T> | null, loc: JLeftPaddedLocation, p: P) {
        return extensions.visitLeftPadded(this, left, loc, p);
    }

    public visitRightPadded<T>(right: JRightPadded<T> | null, loc: JRightPaddedLocation, p: P) {
        return extensions.visitRightPadded(this, right, loc, p);
    }

    public visitSpace(space: Space | null, loc: SpaceLocation, p: P): Space {
        return extensions.visitSpace(this, space, loc, p);
    }

}
