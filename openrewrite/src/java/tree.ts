// noinspection JSUnusedGlobalSymbols

import * as extensions from "./extensions";
import {Comment, Expression, JavaSourceFile, JavaType, JContainer, JLeftPadded, JRightPadded, Loop, MethodCall, NameTree, Space, Statement, TextComment, TypedTree, TypeTree, J} from "./support_types";
import {JavaVisitor} from "./visitor";
import {UUID, Checksum, FileAttributes, SourceFile, Tree, TreeVisitor, Markers, Cursor, PrintOutputCapture, PrinterFactory} from "../core";

export class AnnotatedType extends J implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, annotations: Annotation[], typeExpression: TypeTree) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._annotations = annotations;
        this._typeExpression = typeExpression;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): AnnotatedType {
        return id === this._id ? this : new AnnotatedType(id, this._prefix, this._markers, this._annotations, this._typeExpression);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): AnnotatedType {
        return prefix === this._prefix ? this : new AnnotatedType(this._id, prefix, this._markers, this._annotations, this._typeExpression);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): AnnotatedType {
        return markers === this._markers ? this : new AnnotatedType(this._id, this._prefix, markers, this._annotations, this._typeExpression);
    }

    private readonly _annotations: Annotation[];

    public get annotations(): Annotation[] {
        return this._annotations;
    }

    public withAnnotations(annotations: Annotation[]): AnnotatedType {
        return annotations === this._annotations ? this : new AnnotatedType(this._id, this._prefix, this._markers, annotations, this._typeExpression);
    }

    private readonly _typeExpression: TypeTree;

    public get typeExpression(): TypeTree {
        return this._typeExpression;
    }

    public withTypeExpression(typeExpression: TypeTree): AnnotatedType {
        return typeExpression === this._typeExpression ? this : new AnnotatedType(this._id, this._prefix, this._markers, this._annotations, typeExpression);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitAnnotatedType(this, p);
    }

}

export class Annotation extends J implements Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, annotationType: NameTree, _arguments: JContainer<Expression> | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._annotationType = annotationType;
        this.__arguments = _arguments;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Annotation {
        return id === this._id ? this : new Annotation(id, this._prefix, this._markers, this._annotationType, this.__arguments);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Annotation {
        return prefix === this._prefix ? this : new Annotation(this._id, prefix, this._markers, this._annotationType, this.__arguments);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Annotation {
        return markers === this._markers ? this : new Annotation(this._id, this._prefix, markers, this._annotationType, this.__arguments);
    }

    private readonly _annotationType: NameTree;

    public get annotationType(): NameTree {
        return this._annotationType;
    }

    public withAnnotationType(annotationType: NameTree): Annotation {
        return annotationType === this._annotationType ? this : new Annotation(this._id, this._prefix, this._markers, annotationType, this.__arguments);
    }

    private readonly __arguments: JContainer<Expression> | null;

    public get _arguments(): Expression[] | null {
        return this.__arguments === null ? null : this.__arguments.elements;
    }

    public withArguments(_arguments: Expression[] | null): Annotation {
        return this.padding.withArguments(JContainer.withElementsNullable(this.__arguments, _arguments));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitAnnotation(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get _arguments(): JContainer<Expression> | null {
                return t.__arguments;
            }
            public withArguments(_arguments: JContainer<Expression> | null): Annotation {
                return t._arguments === _arguments ? t : new Annotation(t._id, t._prefix, t._markers, t._annotationType, _arguments);
            }
        }
    }

}

export class ArrayAccess extends J implements Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, indexed: Expression, dimension: ArrayDimension, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._indexed = indexed;
        this._dimension = dimension;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ArrayAccess {
        return id === this._id ? this : new ArrayAccess(id, this._prefix, this._markers, this._indexed, this._dimension, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): ArrayAccess {
        return prefix === this._prefix ? this : new ArrayAccess(this._id, prefix, this._markers, this._indexed, this._dimension, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): ArrayAccess {
        return markers === this._markers ? this : new ArrayAccess(this._id, this._prefix, markers, this._indexed, this._dimension, this.__type);
    }

    private readonly _indexed: Expression;

    public get indexed(): Expression {
        return this._indexed;
    }

    public withIndexed(indexed: Expression): ArrayAccess {
        return indexed === this._indexed ? this : new ArrayAccess(this._id, this._prefix, this._markers, indexed, this._dimension, this.__type);
    }

    private readonly _dimension: ArrayDimension;

    public get dimension(): ArrayDimension {
        return this._dimension;
    }

    public withDimension(dimension: ArrayDimension): ArrayAccess {
        return dimension === this._dimension ? this : new ArrayAccess(this._id, this._prefix, this._markers, this._indexed, dimension, this.__type);
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): ArrayAccess {
        return _type === this.__type ? this : new ArrayAccess(this._id, this._prefix, this._markers, this._indexed, this._dimension, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitArrayAccess(this, p);
    }

}

export class ArrayType extends J implements TypeTree, Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, elementType: TypeTree, annotations: Annotation[] | null, dimension: JLeftPadded<Space> | null, _type: JavaType) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._elementType = elementType;
        this._annotations = annotations;
        this._dimension = dimension;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ArrayType {
        return id === this._id ? this : new ArrayType(id, this._prefix, this._markers, this._elementType, this._annotations, this._dimension, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): ArrayType {
        return prefix === this._prefix ? this : new ArrayType(this._id, prefix, this._markers, this._elementType, this._annotations, this._dimension, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): ArrayType {
        return markers === this._markers ? this : new ArrayType(this._id, this._prefix, markers, this._elementType, this._annotations, this._dimension, this.__type);
    }

    private readonly _elementType: TypeTree;

    public get elementType(): TypeTree {
        return this._elementType;
    }

    public withElementType(elementType: TypeTree): ArrayType {
        return elementType === this._elementType ? this : new ArrayType(this._id, this._prefix, this._markers, elementType, this._annotations, this._dimension, this.__type);
    }

    private readonly _annotations: Annotation[] | null;

    public get annotations(): Annotation[] | null {
        return this._annotations;
    }

    public withAnnotations(annotations: Annotation[] | null): ArrayType {
        return annotations === this._annotations ? this : new ArrayType(this._id, this._prefix, this._markers, this._elementType, annotations, this._dimension, this.__type);
    }

    private readonly _dimension: JLeftPadded<Space> | null;

    public get dimension(): JLeftPadded<Space> | null {
        return this._dimension;
    }

    public withDimension(dimension: JLeftPadded<Space> | null): ArrayType {
        return dimension === this._dimension ? this : new ArrayType(this._id, this._prefix, this._markers, this._elementType, this._annotations, dimension, this.__type);
    }

    private readonly __type: JavaType;

    public get _type(): JavaType {
        return this.__type;
    }

    public withType(_type: JavaType): ArrayType {
        return _type === this.__type ? this : new ArrayType(this._id, this._prefix, this._markers, this._elementType, this._annotations, this._dimension, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitArrayType(this, p);
    }

}

export class Assert extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, condition: Expression, detail: JLeftPadded<Expression> | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._condition = condition;
        this._detail = detail;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Assert {
        return id === this._id ? this : new Assert(id, this._prefix, this._markers, this._condition, this._detail);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Assert {
        return prefix === this._prefix ? this : new Assert(this._id, prefix, this._markers, this._condition, this._detail);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Assert {
        return markers === this._markers ? this : new Assert(this._id, this._prefix, markers, this._condition, this._detail);
    }

    private readonly _condition: Expression;

    public get condition(): Expression {
        return this._condition;
    }

    public withCondition(condition: Expression): Assert {
        return condition === this._condition ? this : new Assert(this._id, this._prefix, this._markers, condition, this._detail);
    }

    private readonly _detail: JLeftPadded<Expression> | null;

    public get detail(): JLeftPadded<Expression> | null {
        return this._detail;
    }

    public withDetail(detail: JLeftPadded<Expression> | null): Assert {
        return detail === this._detail ? this : new Assert(this._id, this._prefix, this._markers, this._condition, detail);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitAssert(this, p);
    }

}

export class Assignment extends J implements Statement, Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, variable: Expression, assignment: JLeftPadded<Expression>, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._variable = variable;
        this._assignment = assignment;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Assignment {
        return id === this._id ? this : new Assignment(id, this._prefix, this._markers, this._variable, this._assignment, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Assignment {
        return prefix === this._prefix ? this : new Assignment(this._id, prefix, this._markers, this._variable, this._assignment, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Assignment {
        return markers === this._markers ? this : new Assignment(this._id, this._prefix, markers, this._variable, this._assignment, this.__type);
    }

    private readonly _variable: Expression;

    public get variable(): Expression {
        return this._variable;
    }

    public withVariable(variable: Expression): Assignment {
        return variable === this._variable ? this : new Assignment(this._id, this._prefix, this._markers, variable, this._assignment, this.__type);
    }

    private readonly _assignment: JLeftPadded<Expression>;

    public get assignment(): Expression {
        return this._assignment.element;
    }

    public withAssignment(assignment: Expression): Assignment {
        return this.padding.withAssignment(JLeftPadded.withElement(this._assignment, assignment));
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): Assignment {
        return _type === this.__type ? this : new Assignment(this._id, this._prefix, this._markers, this._variable, this._assignment, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitAssignment(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get assignment(): JLeftPadded<Expression> {
                return t._assignment;
            }
            public withAssignment(assignment: JLeftPadded<Expression>): Assignment {
                return t._assignment === assignment ? t : new Assignment(t._id, t._prefix, t._markers, t._variable, assignment, t.__type);
            }
        }
    }

}

export class AssignmentOperation extends J implements Statement, Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, variable: Expression, operator: JLeftPadded<AssignmentOperationType>, assignment: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._variable = variable;
        this._operator = operator;
        this._assignment = assignment;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): AssignmentOperation {
        return id === this._id ? this : new AssignmentOperation(id, this._prefix, this._markers, this._variable, this._operator, this._assignment, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): AssignmentOperation {
        return prefix === this._prefix ? this : new AssignmentOperation(this._id, prefix, this._markers, this._variable, this._operator, this._assignment, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): AssignmentOperation {
        return markers === this._markers ? this : new AssignmentOperation(this._id, this._prefix, markers, this._variable, this._operator, this._assignment, this.__type);
    }

    private readonly _variable: Expression;

    public get variable(): Expression {
        return this._variable;
    }

    public withVariable(variable: Expression): AssignmentOperation {
        return variable === this._variable ? this : new AssignmentOperation(this._id, this._prefix, this._markers, variable, this._operator, this._assignment, this.__type);
    }

    private readonly _operator: JLeftPadded<AssignmentOperationType>;

    public get operator(): AssignmentOperationType {
        return this._operator.element;
    }

    public withOperator(operator: AssignmentOperationType): AssignmentOperation {
        return this.padding.withOperator(JLeftPadded.withElement(this._operator, operator));
    }

    private readonly _assignment: Expression;

    public get assignment(): Expression {
        return this._assignment;
    }

    public withAssignment(assignment: Expression): AssignmentOperation {
        return assignment === this._assignment ? this : new AssignmentOperation(this._id, this._prefix, this._markers, this._variable, this._operator, assignment, this.__type);
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): AssignmentOperation {
        return _type === this.__type ? this : new AssignmentOperation(this._id, this._prefix, this._markers, this._variable, this._operator, this._assignment, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitAssignmentOperation(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get operator(): JLeftPadded<AssignmentOperationType> {
                return t._operator;
            }
            public withOperator(operator: JLeftPadded<AssignmentOperationType>): AssignmentOperation {
                return t._operator === operator ? t : new AssignmentOperation(t._id, t._prefix, t._markers, t._variable, operator, t._assignment, t.__type);
            }
        }
    }

}

enum AssignmentOperationType {
    Addition = 0,
    BitAnd = 1,
    BitOr = 2,
    BitXor = 3,
    Division = 4,
    Exponentiation = 5,
    FloorDivision = 6,
    LeftShift = 7,
    MatrixMultiplication = 8,
    Modulo = 9,
    Multiplication = 10,
    RightShift = 11,
    Subtraction = 12,
    UnsignedRightShift = 13,

}

export class Binary extends J implements Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, left: Expression, operator: JLeftPadded<BinaryType>, right: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._left = left;
        this._operator = operator;
        this._right = right;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Binary {
        return id === this._id ? this : new Binary(id, this._prefix, this._markers, this._left, this._operator, this._right, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Binary {
        return prefix === this._prefix ? this : new Binary(this._id, prefix, this._markers, this._left, this._operator, this._right, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Binary {
        return markers === this._markers ? this : new Binary(this._id, this._prefix, markers, this._left, this._operator, this._right, this.__type);
    }

    private readonly _left: Expression;

    public get left(): Expression {
        return this._left;
    }

    public withLeft(left: Expression): Binary {
        return left === this._left ? this : new Binary(this._id, this._prefix, this._markers, left, this._operator, this._right, this.__type);
    }

    private readonly _operator: JLeftPadded<BinaryType>;

    public get operator(): BinaryType {
        return this._operator.element;
    }

    public withOperator(operator: BinaryType): Binary {
        return this.padding.withOperator(JLeftPadded.withElement(this._operator, operator));
    }

    private readonly _right: Expression;

    public get right(): Expression {
        return this._right;
    }

    public withRight(right: Expression): Binary {
        return right === this._right ? this : new Binary(this._id, this._prefix, this._markers, this._left, this._operator, right, this.__type);
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): Binary {
        return _type === this.__type ? this : new Binary(this._id, this._prefix, this._markers, this._left, this._operator, this._right, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitBinary(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get operator(): JLeftPadded<BinaryType> {
                return t._operator;
            }
            public withOperator(operator: JLeftPadded<BinaryType>): Binary {
                return t._operator === operator ? t : new Binary(t._id, t._prefix, t._markers, t._left, operator, t._right, t.__type);
            }
        }
    }

}

enum BinaryType {
    Addition = 0,
    Subtraction = 1,
    Multiplication = 2,
    Division = 3,
    Modulo = 4,
    LessThan = 5,
    GreaterThan = 6,
    LessThanOrEqual = 7,
    GreaterThanOrEqual = 8,
    Equal = 9,
    NotEqual = 10,
    BitAnd = 11,
    BitOr = 12,
    BitXor = 13,
    LeftShift = 14,
    RightShift = 15,
    UnsignedRightShift = 16,
    Or = 17,
    And = 18,

}

export class Block extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, _static: JRightPadded<boolean>, statements: JRightPadded<Statement>[], end: Space) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this.__static = _static;
        this._statements = statements;
        this._end = end;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Block {
        return id === this._id ? this : new Block(id, this._prefix, this._markers, this.__static, this._statements, this._end);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Block {
        return prefix === this._prefix ? this : new Block(this._id, prefix, this._markers, this.__static, this._statements, this._end);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Block {
        return markers === this._markers ? this : new Block(this._id, this._prefix, markers, this.__static, this._statements, this._end);
    }

    private readonly __static: JRightPadded<boolean>;

    public get _static(): boolean {
        return this.__static.element;
    }

    public withStatic(_static: boolean): Block {
        return this.padding.withStatic(JRightPadded.withElement(this.__static, _static));
    }

    private readonly _statements: JRightPadded<Statement>[];

    public get statements(): Statement[] {
        return JRightPadded.getElements(this._statements);
    }

    public withStatements(statements: Statement[]): Block {
        return this.padding.withStatements(JRightPadded.withElements(this._statements, statements));
    }

    private readonly _end: Space;

    public get end(): Space {
        return this._end;
    }

    public withEnd(end: Space): Block {
        return end === this._end ? this : new Block(this._id, this._prefix, this._markers, this.__static, this._statements, end);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitBlock(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get _static(): JRightPadded<boolean> {
                return t.__static;
            }
            public withStatic(_static: JRightPadded<boolean>): Block {
                return t._static === _static ? t : new Block(t._id, t._prefix, t._markers, _static, t._statements, t._end);
            }
            public get statements(): JRightPadded<Statement>[] {
                return t._statements;
            }
            public withStatements(statements: JRightPadded<Statement>[]): Block {
                return t._statements === statements ? t : new Block(t._id, t._prefix, t._markers, t.__static, statements, t._end);
            }
        }
    }

}

export class Break extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, label: Identifier | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._label = label;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Break {
        return id === this._id ? this : new Break(id, this._prefix, this._markers, this._label);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Break {
        return prefix === this._prefix ? this : new Break(this._id, prefix, this._markers, this._label);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Break {
        return markers === this._markers ? this : new Break(this._id, this._prefix, markers, this._label);
    }

    private readonly _label: Identifier | null;

    public get label(): Identifier | null {
        return this._label;
    }

    public withLabel(label: Identifier | null): Break {
        return label === this._label ? this : new Break(this._id, this._prefix, this._markers, label);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitBreak(this, p);
    }

}

export class Case extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, _type: CaseType, expressions: JContainer<Expression>, statements: JContainer<Statement>, body: JRightPadded<J> | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this.__type = _type;
        this._expressions = expressions;
        this._statements = statements;
        this._body = body;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Case {
        return id === this._id ? this : new Case(id, this._prefix, this._markers, this.__type, this._expressions, this._statements, this._body);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Case {
        return prefix === this._prefix ? this : new Case(this._id, prefix, this._markers, this.__type, this._expressions, this._statements, this._body);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Case {
        return markers === this._markers ? this : new Case(this._id, this._prefix, markers, this.__type, this._expressions, this._statements, this._body);
    }

    private readonly __type: CaseType;

    public withType(_type: CaseType): Case {
        return _type === this.__type ? this : new Case(this._id, this._prefix, this._markers, _type, this._expressions, this._statements, this._body);
    }

    private readonly _expressions: JContainer<Expression>;

    public get expressions(): Expression[] {
        return this._expressions.elements;
    }

    public withExpressions(expressions: Expression[]): Case {
        return this.padding.withExpressions(JContainer.withElements(this._expressions, expressions));
    }

    private readonly _statements: JContainer<Statement>;

    public get statements(): Statement[] {
        return this._statements.elements;
    }

    public withStatements(statements: Statement[]): Case {
        return this.padding.withStatements(JContainer.withElements(this._statements, statements));
    }

    private readonly _body: JRightPadded<J> | null;

    public get body(): J | null {
        return this._body === null ? null : this._body.element;
    }

    public withBody(body: J | null): Case {
        return this.padding.withBody(JRightPadded.withElement(this._body, body));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitCase(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get expressions(): JContainer<Expression> {
                return t._expressions;
            }
            public withExpressions(expressions: JContainer<Expression>): Case {
                return t._expressions === expressions ? t : new Case(t._id, t._prefix, t._markers, t.__type, expressions, t._statements, t._body);
            }
            public get statements(): JContainer<Statement> {
                return t._statements;
            }
            public withStatements(statements: JContainer<Statement>): Case {
                return t._statements === statements ? t : new Case(t._id, t._prefix, t._markers, t.__type, t._expressions, statements, t._body);
            }
            public get body(): JRightPadded<J> | null {
                return t._body;
            }
            public withBody(body: JRightPadded<J> | null): Case {
                return t._body === body ? t : new Case(t._id, t._prefix, t._markers, t.__type, t._expressions, t._statements, body);
            }
        }
    }

}

enum CaseType {
    Statement = 0,
    Rule = 1,

}

export class ClassDeclaration extends J implements Statement, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, leadingAnnotations: Annotation[], modifiers: Modifier[], kind: ClassDeclarationKind, name: Identifier, typeParameters: JContainer<TypeParameter> | null, primaryConstructor: JContainer<Statement> | null, extends: JLeftPadded<TypeTree> | null, implements: JContainer<TypeTree> | null, permits: JContainer<TypeTree> | null, body: Block, _type: JavaType.FullyQualified | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._leadingAnnotations = leadingAnnotations;
        this._modifiers = modifiers;
        this._kind = kind;
        this._name = name;
        this._typeParameters = typeParameters;
        this._primaryConstructor = primaryConstructor;
        this._extends = extends;
        this._implements = implements;
        this._permits = permits;
        this._body = body;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ClassDeclaration {
        return id === this._id ? this : new ClassDeclaration(id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._kind, this._name, this._typeParameters, this._primaryConstructor, this._extends, this._implements, this._permits, this._body, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): ClassDeclaration {
        return prefix === this._prefix ? this : new ClassDeclaration(this._id, prefix, this._markers, this._leadingAnnotations, this._modifiers, this._kind, this._name, this._typeParameters, this._primaryConstructor, this._extends, this._implements, this._permits, this._body, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): ClassDeclaration {
        return markers === this._markers ? this : new ClassDeclaration(this._id, this._prefix, markers, this._leadingAnnotations, this._modifiers, this._kind, this._name, this._typeParameters, this._primaryConstructor, this._extends, this._implements, this._permits, this._body, this.__type);
    }

    private readonly _leadingAnnotations: Annotation[];

    public get leadingAnnotations(): Annotation[] {
        return this._leadingAnnotations;
    }

    public withLeadingAnnotations(leadingAnnotations: Annotation[]): ClassDeclaration {
        return leadingAnnotations === this._leadingAnnotations ? this : new ClassDeclaration(this._id, this._prefix, this._markers, leadingAnnotations, this._modifiers, this._kind, this._name, this._typeParameters, this._primaryConstructor, this._extends, this._implements, this._permits, this._body, this.__type);
    }

    private readonly _modifiers: Modifier[];

    public get modifiers(): Modifier[] {
        return this._modifiers;
    }

    public withModifiers(modifiers: Modifier[]): ClassDeclaration {
        return modifiers === this._modifiers ? this : new ClassDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, modifiers, this._kind, this._name, this._typeParameters, this._primaryConstructor, this._extends, this._implements, this._permits, this._body, this.__type);
    }

    private readonly _kind: ClassDeclarationKind;

    public withKind(kind: ClassDeclarationKind): ClassDeclaration {
        return kind === this._kind ? this : new ClassDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, kind, this._name, this._typeParameters, this._primaryConstructor, this._extends, this._implements, this._permits, this._body, this.__type);
    }

    private readonly _name: Identifier;

    public get name(): Identifier {
        return this._name;
    }

    public withName(name: Identifier): ClassDeclaration {
        return name === this._name ? this : new ClassDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._kind, name, this._typeParameters, this._primaryConstructor, this._extends, this._implements, this._permits, this._body, this.__type);
    }

    private readonly _typeParameters: JContainer<TypeParameter> | null;

    public get typeParameters(): TypeParameter[] | null {
        return this._typeParameters === null ? null : this._typeParameters.elements;
    }

    public withTypeParameters(typeParameters: TypeParameter[] | null): ClassDeclaration {
        return this.padding.withTypeParameters(JContainer.withElementsNullable(this._typeParameters, typeParameters));
    }

    private readonly _primaryConstructor: JContainer<Statement> | null;

    public get primaryConstructor(): Statement[] | null {
        return this._primaryConstructor === null ? null : this._primaryConstructor.elements;
    }

    public withPrimaryConstructor(primaryConstructor: Statement[] | null): ClassDeclaration {
        return this.padding.withPrimaryConstructor(JContainer.withElementsNullable(this._primaryConstructor, primaryConstructor));
    }

    private readonly _extends: JLeftPadded<TypeTree> | null;

    public get _extends(): TypeTree | null {
        return this._extends === null ? null : this._extends.element;
    }

    public withExtends(_extends: TypeTree | null): ClassDeclaration {
        return this.padding.withExtends(JLeftPadded.withElement(this._extends, _extends));
    }

    private readonly _implements: JContainer<TypeTree> | null;

    public get _implements(): TypeTree[] | null {
        return this._implements === null ? null : this._implements.elements;
    }

    public withImplements(_implements: TypeTree[] | null): ClassDeclaration {
        return this.padding.withImplements(JContainer.withElementsNullable(this._implements, _implements));
    }

    private readonly _permits: JContainer<TypeTree> | null;

    public get permits(): TypeTree[] | null {
        return this._permits === null ? null : this._permits.elements;
    }

    public withPermits(permits: TypeTree[] | null): ClassDeclaration {
        return this.padding.withPermits(JContainer.withElementsNullable(this._permits, permits));
    }

    private readonly _body: Block;

    public get body(): Block {
        return this._body;
    }

    public withBody(body: Block): ClassDeclaration {
        return body === this._body ? this : new ClassDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._kind, this._name, this._typeParameters, this._primaryConstructor, this._extends, this._implements, this._permits, body, this.__type);
    }

    private readonly __type: JavaType.FullyQualified | null;

    public get _type(): JavaType.FullyQualified | null {
        return this.__type;
    }

    public withType(_type: JavaType.FullyQualified | null): ClassDeclaration {
        return _type === this.__type ? this : new ClassDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._kind, this._name, this._typeParameters, this._primaryConstructor, this._extends, this._implements, this._permits, this._body, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitClassDeclaration(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get kind(): ClassDeclarationKind {
                return t._kind;
            }
            public withKind(kind: ClassDeclarationKind): ClassDeclaration {
                return t._kind === kind ? t : new ClassDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, kind, t._name, t._typeParameters, t._primaryConstructor, t._extends, t._implements, t._permits, t._body, t.__type);
            }
            public get typeParameters(): JContainer<TypeParameter> | null {
                return t._typeParameters;
            }
            public withTypeParameters(typeParameters: JContainer<TypeParameter> | null): ClassDeclaration {
                return t._typeParameters === typeParameters ? t : new ClassDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._kind, t._name, typeParameters, t._primaryConstructor, t._extends, t._implements, t._permits, t._body, t.__type);
            }
            public get primaryConstructor(): JContainer<Statement> | null {
                return t._primaryConstructor;
            }
            public withPrimaryConstructor(primaryConstructor: JContainer<Statement> | null): ClassDeclaration {
                return t._primaryConstructor === primaryConstructor ? t : new ClassDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._kind, t._name, t._typeParameters, primaryConstructor, t._extends, t._implements, t._permits, t._body, t.__type);
            }
            public get _extends(): JLeftPadded<TypeTree> | null {
                return t._extends;
            }
            public withExtends(_extends: JLeftPadded<TypeTree> | null): ClassDeclaration {
                return t._extends === _extends ? t : new ClassDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._kind, t._name, t._typeParameters, t._primaryConstructor, _extends, t._implements, t._permits, t._body, t.__type);
            }
            public get _implements(): JContainer<TypeTree> | null {
                return t._implements;
            }
            public withImplements(_implements: JContainer<TypeTree> | null): ClassDeclaration {
                return t._implements === _implements ? t : new ClassDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._kind, t._name, t._typeParameters, t._primaryConstructor, t._extends, _implements, t._permits, t._body, t.__type);
            }
            public get permits(): JContainer<TypeTree> | null {
                return t._permits;
            }
            public withPermits(permits: JContainer<TypeTree> | null): ClassDeclaration {
                return t._permits === permits ? t : new ClassDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._kind, t._name, t._typeParameters, t._primaryConstructor, t._extends, t._implements, permits, t._body, t.__type);
            }
        }
    }

}

export class ClassDeclarationKind extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, annotations: Annotation[], _type: ClassDeclarationKindType) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._annotations = annotations;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ClassDeclarationKind {
        return id === this._id ? this : new ClassDeclarationKind(id, this._prefix, this._markers, this._annotations, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): ClassDeclarationKind {
        return prefix === this._prefix ? this : new ClassDeclarationKind(this._id, prefix, this._markers, this._annotations, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): ClassDeclarationKind {
        return markers === this._markers ? this : new ClassDeclarationKind(this._id, this._prefix, markers, this._annotations, this.__type);
    }

    private readonly _annotations: Annotation[];

    public get annotations(): Annotation[] {
        return this._annotations;
    }

    public withAnnotations(annotations: Annotation[]): ClassDeclarationKind {
        return annotations === this._annotations ? this : new ClassDeclarationKind(this._id, this._prefix, this._markers, annotations, this.__type);
    }

    private readonly __type: ClassDeclarationKindType;

    public get _type(): ClassDeclarationKindType {
        return this.__type;
    }

    public withType(_type: ClassDeclarationKindType): ClassDeclarationKind {
        return _type === this.__type ? this : new ClassDeclarationKind(this._id, this._prefix, this._markers, this._annotations, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitClassDeclarationKind(this, p);
    }

}

enum ClassDeclarationKindType {
    Class = 0,
    Enum = 1,
    Interface = 2,
    Annotation = 3,
    Record = 4,
    Value = 5,

}

export class CompilationUnit extends J implements JavaSourceFile<CompilationUnit>, SourceFile {
    public constructor(id: UUID, prefix: Space, markers: Markers, sourcePath: string, fileAttributes: FileAttributes | null, charsetName: string | null, charsetBomMarked: boolean, checksum: Checksum | null, packageDeclaration: JRightPadded<Package> | null, imports: JRightPadded<Import>[], classes: ClassDeclaration[], eof: Space) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._sourcePath = sourcePath;
        this._fileAttributes = fileAttributes;
        this._charsetName = charsetName;
        this._charsetBomMarked = charsetBomMarked;
        this._checksum = checksum;
        this._packageDeclaration = packageDeclaration;
        this._imports = imports;
        this._classes = classes;
        this._eof = eof;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): CompilationUnit {
        return id === this._id ? this : new CompilationUnit(id, this._prefix, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._packageDeclaration, this._imports, this._classes, this._eof);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): CompilationUnit {
        return prefix === this._prefix ? this : new CompilationUnit(this._id, prefix, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._packageDeclaration, this._imports, this._classes, this._eof);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): CompilationUnit {
        return markers === this._markers ? this : new CompilationUnit(this._id, this._prefix, markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._packageDeclaration, this._imports, this._classes, this._eof);
    }

    private readonly _sourcePath: string;

    public get sourcePath(): string {
        return this._sourcePath;
    }

    public withSourcePath(sourcePath: string): CompilationUnit {
        return sourcePath === this._sourcePath ? this : new CompilationUnit(this._id, this._prefix, this._markers, sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._packageDeclaration, this._imports, this._classes, this._eof);
    }

    private readonly _fileAttributes: FileAttributes | null;

    public get fileAttributes(): FileAttributes | null {
        return this._fileAttributes;
    }

    public withFileAttributes(fileAttributes: FileAttributes | null): CompilationUnit {
        return fileAttributes === this._fileAttributes ? this : new CompilationUnit(this._id, this._prefix, this._markers, this._sourcePath, fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._packageDeclaration, this._imports, this._classes, this._eof);
    }

    private readonly _charsetName: string | null;

    public withCharsetName(charsetName: string | null): CompilationUnit {
        return charsetName === this._charsetName ? this : new CompilationUnit(this._id, this._prefix, this._markers, this._sourcePath, this._fileAttributes, charsetName, this._charsetBomMarked, this._checksum, this._packageDeclaration, this._imports, this._classes, this._eof);
    }

    private readonly _charsetBomMarked: boolean;

    public get charsetBomMarked(): boolean {
        return this._charsetBomMarked;
    }

    public withCharsetBomMarked(charsetBomMarked: boolean): CompilationUnit {
        return charsetBomMarked === this._charsetBomMarked ? this : new CompilationUnit(this._id, this._prefix, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, charsetBomMarked, this._checksum, this._packageDeclaration, this._imports, this._classes, this._eof);
    }

    private readonly _checksum: Checksum | null;

    public get checksum(): Checksum | null {
        return this._checksum;
    }

    public withChecksum(checksum: Checksum | null): CompilationUnit {
        return checksum === this._checksum ? this : new CompilationUnit(this._id, this._prefix, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, checksum, this._packageDeclaration, this._imports, this._classes, this._eof);
    }

    private readonly _packageDeclaration: JRightPadded<Package> | null;

    public get packageDeclaration(): Package | null {
        return this._packageDeclaration === null ? null : this._packageDeclaration.element;
    }

    public withPackageDeclaration(packageDeclaration: Package | null): CompilationUnit {
        return this.padding.withPackageDeclaration(JRightPadded.withElement(this._packageDeclaration, packageDeclaration));
    }

    private readonly _imports: JRightPadded<Import>[];

    public get imports(): Import[] {
        return JRightPadded.getElements(this._imports);
    }

    public withImports(imports: Import[]): CompilationUnit {
        return this.padding.withImports(JRightPadded.withElements(this._imports, imports));
    }

    private readonly _classes: ClassDeclaration[];

    public get classes(): ClassDeclaration[] {
        return this._classes;
    }

    public withClasses(classes: ClassDeclaration[]): CompilationUnit {
        return classes === this._classes ? this : new CompilationUnit(this._id, this._prefix, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._packageDeclaration, this._imports, classes, this._eof);
    }

    private readonly _eof: Space;

    public get eof(): Space {
        return this._eof;
    }

    public withEof(eof: Space): CompilationUnit {
        return eof === this._eof ? this : new CompilationUnit(this._id, this._prefix, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._packageDeclaration, this._imports, this._classes, eof);
    }

    public printer<P>(cursor: Cursor): TreeVisitor<Tree, PrintOutputCapture<P>> {
        return PrinterFactory.current().createPrinter(cursor);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitCompilationUnit(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get packageDeclaration(): JRightPadded<Package> | null {
                return t._packageDeclaration;
            }
            public withPackageDeclaration(packageDeclaration: JRightPadded<Package> | null): CompilationUnit {
                return t._packageDeclaration === packageDeclaration ? t : new CompilationUnit(t._id, t._prefix, t._markers, t._sourcePath, t._fileAttributes, t._charsetName, t._charsetBomMarked, t._checksum, packageDeclaration, t._imports, t._classes, t._eof);
            }
            public get imports(): JRightPadded<Import>[] {
                return t._imports;
            }
            public withImports(imports: JRightPadded<Import>[]): CompilationUnit {
                return t._imports === imports ? t : new CompilationUnit(t._id, t._prefix, t._markers, t._sourcePath, t._fileAttributes, t._charsetName, t._charsetBomMarked, t._checksum, t._packageDeclaration, imports, t._classes, t._eof);
            }
        }
    }

}

export class Continue extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, label: Identifier | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._label = label;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Continue {
        return id === this._id ? this : new Continue(id, this._prefix, this._markers, this._label);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Continue {
        return prefix === this._prefix ? this : new Continue(this._id, prefix, this._markers, this._label);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Continue {
        return markers === this._markers ? this : new Continue(this._id, this._prefix, markers, this._label);
    }

    private readonly _label: Identifier | null;

    public get label(): Identifier | null {
        return this._label;
    }

    public withLabel(label: Identifier | null): Continue {
        return label === this._label ? this : new Continue(this._id, this._prefix, this._markers, label);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitContinue(this, p);
    }

}

export class DoWhileLoop extends J implements Loop {
    public constructor(id: UUID, prefix: Space, markers: Markers, body: JRightPadded<Statement>, whileCondition: JLeftPadded<ControlParentheses<Expression>>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._body = body;
        this._whileCondition = whileCondition;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): DoWhileLoop {
        return id === this._id ? this : new DoWhileLoop(id, this._prefix, this._markers, this._body, this._whileCondition);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): DoWhileLoop {
        return prefix === this._prefix ? this : new DoWhileLoop(this._id, prefix, this._markers, this._body, this._whileCondition);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): DoWhileLoop {
        return markers === this._markers ? this : new DoWhileLoop(this._id, this._prefix, markers, this._body, this._whileCondition);
    }

    private readonly _body: JRightPadded<Statement>;

    public get body(): Statement {
        return this._body.element;
    }

    public withBody(body: Statement): DoWhileLoop {
        return this.padding.withBody(JRightPadded.withElement(this._body, body));
    }

    private readonly _whileCondition: JLeftPadded<ControlParentheses<Expression>>;

    public get whileCondition(): ControlParentheses<Expression> {
        return this._whileCondition.element;
    }

    public withWhileCondition(whileCondition: ControlParentheses<Expression>): DoWhileLoop {
        return this.padding.withWhileCondition(JLeftPadded.withElement(this._whileCondition, whileCondition));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitDoWhileLoop(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get body(): JRightPadded<Statement> {
                return t._body;
            }
            public withBody(body: JRightPadded<Statement>): DoWhileLoop {
                return t._body === body ? t : new DoWhileLoop(t._id, t._prefix, t._markers, body, t._whileCondition);
            }
            public get whileCondition(): JLeftPadded<ControlParentheses<Expression>> {
                return t._whileCondition;
            }
            public withWhileCondition(whileCondition: JLeftPadded<ControlParentheses<Expression>>): DoWhileLoop {
                return t._whileCondition === whileCondition ? t : new DoWhileLoop(t._id, t._prefix, t._markers, t._body, whileCondition);
            }
        }
    }

}

export class Empty extends J implements Statement, Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Empty {
        return id === this._id ? this : new Empty(id, this._prefix, this._markers);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Empty {
        return prefix === this._prefix ? this : new Empty(this._id, prefix, this._markers);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Empty {
        return markers === this._markers ? this : new Empty(this._id, this._prefix, markers);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitEmpty(this, p);
    }

}

export class EnumValue extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, annotations: Annotation[], name: Identifier, initializer: NewClass | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._annotations = annotations;
        this._name = name;
        this._initializer = initializer;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): EnumValue {
        return id === this._id ? this : new EnumValue(id, this._prefix, this._markers, this._annotations, this._name, this._initializer);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): EnumValue {
        return prefix === this._prefix ? this : new EnumValue(this._id, prefix, this._markers, this._annotations, this._name, this._initializer);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): EnumValue {
        return markers === this._markers ? this : new EnumValue(this._id, this._prefix, markers, this._annotations, this._name, this._initializer);
    }

    private readonly _annotations: Annotation[];

    public get annotations(): Annotation[] {
        return this._annotations;
    }

    public withAnnotations(annotations: Annotation[]): EnumValue {
        return annotations === this._annotations ? this : new EnumValue(this._id, this._prefix, this._markers, annotations, this._name, this._initializer);
    }

    private readonly _name: Identifier;

    public get name(): Identifier {
        return this._name;
    }

    public withName(name: Identifier): EnumValue {
        return name === this._name ? this : new EnumValue(this._id, this._prefix, this._markers, this._annotations, name, this._initializer);
    }

    private readonly _initializer: NewClass | null;

    public get initializer(): NewClass | null {
        return this._initializer;
    }

    public withInitializer(initializer: NewClass | null): EnumValue {
        return initializer === this._initializer ? this : new EnumValue(this._id, this._prefix, this._markers, this._annotations, this._name, initializer);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitEnumValue(this, p);
    }

}

export class EnumValueSet extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, enums: JRightPadded<EnumValue>[], terminatedWithSemicolon: boolean) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._enums = enums;
        this._terminatedWithSemicolon = terminatedWithSemicolon;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): EnumValueSet {
        return id === this._id ? this : new EnumValueSet(id, this._prefix, this._markers, this._enums, this._terminatedWithSemicolon);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): EnumValueSet {
        return prefix === this._prefix ? this : new EnumValueSet(this._id, prefix, this._markers, this._enums, this._terminatedWithSemicolon);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): EnumValueSet {
        return markers === this._markers ? this : new EnumValueSet(this._id, this._prefix, markers, this._enums, this._terminatedWithSemicolon);
    }

    private readonly _enums: JRightPadded<EnumValue>[];

    public get enums(): EnumValue[] {
        return JRightPadded.getElements(this._enums);
    }

    public withEnums(enums: EnumValue[]): EnumValueSet {
        return this.padding.withEnums(JRightPadded.withElements(this._enums, enums));
    }

    private readonly _terminatedWithSemicolon: boolean;

    public get terminatedWithSemicolon(): boolean {
        return this._terminatedWithSemicolon;
    }

    public withTerminatedWithSemicolon(terminatedWithSemicolon: boolean): EnumValueSet {
        return terminatedWithSemicolon === this._terminatedWithSemicolon ? this : new EnumValueSet(this._id, this._prefix, this._markers, this._enums, terminatedWithSemicolon);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitEnumValueSet(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get enums(): JRightPadded<EnumValue>[] {
                return t._enums;
            }
            public withEnums(enums: JRightPadded<EnumValue>[]): EnumValueSet {
                return t._enums === enums ? t : new EnumValueSet(t._id, t._prefix, t._markers, enums, t._terminatedWithSemicolon);
            }
        }
    }

}

export class FieldAccess extends J implements TypeTree, Expression, Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, target: Expression, name: JLeftPadded<Identifier>, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._target = target;
        this._name = name;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): FieldAccess {
        return id === this._id ? this : new FieldAccess(id, this._prefix, this._markers, this._target, this._name, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): FieldAccess {
        return prefix === this._prefix ? this : new FieldAccess(this._id, prefix, this._markers, this._target, this._name, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): FieldAccess {
        return markers === this._markers ? this : new FieldAccess(this._id, this._prefix, markers, this._target, this._name, this.__type);
    }

    private readonly _target: Expression;

    public get target(): Expression {
        return this._target;
    }

    public withTarget(target: Expression): FieldAccess {
        return target === this._target ? this : new FieldAccess(this._id, this._prefix, this._markers, target, this._name, this.__type);
    }

    private readonly _name: JLeftPadded<Identifier>;

    public get name(): Identifier {
        return this._name.element;
    }

    public withName(name: Identifier): FieldAccess {
        return this.padding.withName(JLeftPadded.withElement(this._name, name));
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): FieldAccess {
        return _type === this.__type ? this : new FieldAccess(this._id, this._prefix, this._markers, this._target, this._name, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitFieldAccess(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get name(): JLeftPadded<Identifier> {
                return t._name;
            }
            public withName(name: JLeftPadded<Identifier>): FieldAccess {
                return t._name === name ? t : new FieldAccess(t._id, t._prefix, t._markers, t._target, name, t.__type);
            }
        }
    }

}

export class ForEachLoop extends J implements Loop {
    public constructor(id: UUID, prefix: Space, markers: Markers, control: ForEachLoopControl, body: JRightPadded<Statement>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._control = control;
        this._body = body;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ForEachLoop {
        return id === this._id ? this : new ForEachLoop(id, this._prefix, this._markers, this._control, this._body);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): ForEachLoop {
        return prefix === this._prefix ? this : new ForEachLoop(this._id, prefix, this._markers, this._control, this._body);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): ForEachLoop {
        return markers === this._markers ? this : new ForEachLoop(this._id, this._prefix, markers, this._control, this._body);
    }

    private readonly _control: ForEachLoopControl;

    public get control(): ForEachLoopControl {
        return this._control;
    }

    public withControl(control: ForEachLoopControl): ForEachLoop {
        return control === this._control ? this : new ForEachLoop(this._id, this._prefix, this._markers, control, this._body);
    }

    private readonly _body: JRightPadded<Statement>;

    public get body(): Statement {
        return this._body.element;
    }

    public withBody(body: Statement): ForEachLoop {
        return this.padding.withBody(JRightPadded.withElement(this._body, body));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitForEachLoop(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get body(): JRightPadded<Statement> {
                return t._body;
            }
            public withBody(body: JRightPadded<Statement>): ForEachLoop {
                return t._body === body ? t : new ForEachLoop(t._id, t._prefix, t._markers, t._control, body);
            }
        }
    }

}

export class ForEachLoopControl extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, variable: JRightPadded<VariableDeclarations>, iterable: JRightPadded<Expression>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._variable = variable;
        this._iterable = iterable;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ForEachLoopControl {
        return id === this._id ? this : new ForEachLoopControl(id, this._prefix, this._markers, this._variable, this._iterable);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): ForEachLoopControl {
        return prefix === this._prefix ? this : new ForEachLoopControl(this._id, prefix, this._markers, this._variable, this._iterable);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): ForEachLoopControl {
        return markers === this._markers ? this : new ForEachLoopControl(this._id, this._prefix, markers, this._variable, this._iterable);
    }

    private readonly _variable: JRightPadded<VariableDeclarations>;

    public get variable(): VariableDeclarations {
        return this._variable.element;
    }

    public withVariable(variable: VariableDeclarations): ForEachLoopControl {
        return this.padding.withVariable(JRightPadded.withElement(this._variable, variable));
    }

    private readonly _iterable: JRightPadded<Expression>;

    public get iterable(): Expression {
        return this._iterable.element;
    }

    public withIterable(iterable: Expression): ForEachLoopControl {
        return this.padding.withIterable(JRightPadded.withElement(this._iterable, iterable));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitForEachControl(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get variable(): JRightPadded<VariableDeclarations> {
                return t._variable;
            }
            public withVariable(variable: JRightPadded<VariableDeclarations>): ForEachLoopControl {
                return t._variable === variable ? t : new ForEachLoopControl(t._id, t._prefix, t._markers, variable, t._iterable);
            }
            public get iterable(): JRightPadded<Expression> {
                return t._iterable;
            }
            public withIterable(iterable: JRightPadded<Expression>): ForEachLoopControl {
                return t._iterable === iterable ? t : new ForEachLoopControl(t._id, t._prefix, t._markers, t._variable, iterable);
            }
        }
    }

}

export class ForLoop extends J implements Loop {
    public constructor(id: UUID, prefix: Space, markers: Markers, control: ForLoopControl, body: JRightPadded<Statement>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._control = control;
        this._body = body;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ForLoop {
        return id === this._id ? this : new ForLoop(id, this._prefix, this._markers, this._control, this._body);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): ForLoop {
        return prefix === this._prefix ? this : new ForLoop(this._id, prefix, this._markers, this._control, this._body);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): ForLoop {
        return markers === this._markers ? this : new ForLoop(this._id, this._prefix, markers, this._control, this._body);
    }

    private readonly _control: ForLoopControl;

    public get control(): ForLoopControl {
        return this._control;
    }

    public withControl(control: ForLoopControl): ForLoop {
        return control === this._control ? this : new ForLoop(this._id, this._prefix, this._markers, control, this._body);
    }

    private readonly _body: JRightPadded<Statement>;

    public get body(): Statement {
        return this._body.element;
    }

    public withBody(body: Statement): ForLoop {
        return this.padding.withBody(JRightPadded.withElement(this._body, body));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitForLoop(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get body(): JRightPadded<Statement> {
                return t._body;
            }
            public withBody(body: JRightPadded<Statement>): ForLoop {
                return t._body === body ? t : new ForLoop(t._id, t._prefix, t._markers, t._control, body);
            }
        }
    }

}

export class ForLoopControl extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, init: JRightPadded<Statement>[], condition: JRightPadded<Expression>, update: JRightPadded<Statement>[]) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._init = init;
        this._condition = condition;
        this._update = update;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ForLoopControl {
        return id === this._id ? this : new ForLoopControl(id, this._prefix, this._markers, this._init, this._condition, this._update);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): ForLoopControl {
        return prefix === this._prefix ? this : new ForLoopControl(this._id, prefix, this._markers, this._init, this._condition, this._update);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): ForLoopControl {
        return markers === this._markers ? this : new ForLoopControl(this._id, this._prefix, markers, this._init, this._condition, this._update);
    }

    private readonly _init: JRightPadded<Statement>[];

    public get init(): Statement[] {
        return JRightPadded.getElements(this._init);
    }

    public withInit(init: Statement[]): ForLoopControl {
        return this.padding.withInit(JRightPadded.withElements(this._init, init));
    }

    private readonly _condition: JRightPadded<Expression>;

    public get condition(): Expression {
        return this._condition.element;
    }

    public withCondition(condition: Expression): ForLoopControl {
        return this.padding.withCondition(JRightPadded.withElement(this._condition, condition));
    }

    private readonly _update: JRightPadded<Statement>[];

    public get update(): Statement[] {
        return JRightPadded.getElements(this._update);
    }

    public withUpdate(update: Statement[]): ForLoopControl {
        return this.padding.withUpdate(JRightPadded.withElements(this._update, update));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitForControl(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get init(): JRightPadded<Statement>[] {
                return t._init;
            }
            public withInit(init: JRightPadded<Statement>[]): ForLoopControl {
                return t._init === init ? t : new ForLoopControl(t._id, t._prefix, t._markers, init, t._condition, t._update);
            }
            public get condition(): JRightPadded<Expression> {
                return t._condition;
            }
            public withCondition(condition: JRightPadded<Expression>): ForLoopControl {
                return t._condition === condition ? t : new ForLoopControl(t._id, t._prefix, t._markers, t._init, condition, t._update);
            }
            public get update(): JRightPadded<Statement>[] {
                return t._update;
            }
            public withUpdate(update: JRightPadded<Statement>[]): ForLoopControl {
                return t._update === update ? t : new ForLoopControl(t._id, t._prefix, t._markers, t._init, t._condition, update);
            }
        }
    }

}

export class ParenthesizedTypeTree extends J implements TypeTree, Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, annotations: Annotation[], parenthesizedType: Parentheses<TypeTree>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._annotations = annotations;
        this._parenthesizedType = parenthesizedType;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ParenthesizedTypeTree {
        return id === this._id ? this : new ParenthesizedTypeTree(id, this._prefix, this._markers, this._annotations, this._parenthesizedType);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): ParenthesizedTypeTree {
        return prefix === this._prefix ? this : new ParenthesizedTypeTree(this._id, prefix, this._markers, this._annotations, this._parenthesizedType);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): ParenthesizedTypeTree {
        return markers === this._markers ? this : new ParenthesizedTypeTree(this._id, this._prefix, markers, this._annotations, this._parenthesizedType);
    }

    private readonly _annotations: Annotation[];

    public get annotations(): Annotation[] {
        return this._annotations;
    }

    public withAnnotations(annotations: Annotation[]): ParenthesizedTypeTree {
        return annotations === this._annotations ? this : new ParenthesizedTypeTree(this._id, this._prefix, this._markers, annotations, this._parenthesizedType);
    }

    private readonly _parenthesizedType: Parentheses<TypeTree>;

    public get parenthesizedType(): Parentheses<TypeTree> {
        return this._parenthesizedType;
    }

    public withParenthesizedType(parenthesizedType: Parentheses<TypeTree>): ParenthesizedTypeTree {
        return parenthesizedType === this._parenthesizedType ? this : new ParenthesizedTypeTree(this._id, this._prefix, this._markers, this._annotations, parenthesizedType);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitParenthesizedTypeTree(this, p);
    }

}

export class Identifier extends J implements TypeTree, Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, annotations: Annotation[], simpleName: string, _type: JavaType | null, fieldType: JavaType.Variable | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._annotations = annotations;
        this._simpleName = simpleName;
        this.__type = _type;
        this._fieldType = fieldType;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Identifier {
        return id === this._id ? this : new Identifier(id, this._prefix, this._markers, this._annotations, this._simpleName, this.__type, this._fieldType);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Identifier {
        return prefix === this._prefix ? this : new Identifier(this._id, prefix, this._markers, this._annotations, this._simpleName, this.__type, this._fieldType);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Identifier {
        return markers === this._markers ? this : new Identifier(this._id, this._prefix, markers, this._annotations, this._simpleName, this.__type, this._fieldType);
    }

    private readonly _annotations: Annotation[];

    public get annotations(): Annotation[] {
        return this._annotations;
    }

    public withAnnotations(annotations: Annotation[]): Identifier {
        return annotations === this._annotations ? this : new Identifier(this._id, this._prefix, this._markers, annotations, this._simpleName, this.__type, this._fieldType);
    }

    private readonly _simpleName: string;

    public get simpleName(): string {
        return this._simpleName;
    }

    public withSimpleName(simpleName: string): Identifier {
        return simpleName === this._simpleName ? this : new Identifier(this._id, this._prefix, this._markers, this._annotations, simpleName, this.__type, this._fieldType);
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): Identifier {
        return _type === this.__type ? this : new Identifier(this._id, this._prefix, this._markers, this._annotations, this._simpleName, _type, this._fieldType);
    }

    private readonly _fieldType: JavaType.Variable | null;

    public get fieldType(): JavaType.Variable | null {
        return this._fieldType;
    }

    public withFieldType(fieldType: JavaType.Variable | null): Identifier {
        return fieldType === this._fieldType ? this : new Identifier(this._id, this._prefix, this._markers, this._annotations, this._simpleName, this.__type, fieldType);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitIdentifier(this, p);
    }

}

export class If extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, ifCondition: ControlParentheses<Expression>, thenPart: JRightPadded<Statement>, elsePart: IfElse | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._ifCondition = ifCondition;
        this._thenPart = thenPart;
        this._elsePart = elsePart;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): If {
        return id === this._id ? this : new If(id, this._prefix, this._markers, this._ifCondition, this._thenPart, this._elsePart);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): If {
        return prefix === this._prefix ? this : new If(this._id, prefix, this._markers, this._ifCondition, this._thenPart, this._elsePart);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): If {
        return markers === this._markers ? this : new If(this._id, this._prefix, markers, this._ifCondition, this._thenPart, this._elsePart);
    }

    private readonly _ifCondition: ControlParentheses<Expression>;

    public get ifCondition(): ControlParentheses<Expression> {
        return this._ifCondition;
    }

    public withIfCondition(ifCondition: ControlParentheses<Expression>): If {
        return ifCondition === this._ifCondition ? this : new If(this._id, this._prefix, this._markers, ifCondition, this._thenPart, this._elsePart);
    }

    private readonly _thenPart: JRightPadded<Statement>;

    public get thenPart(): Statement {
        return this._thenPart.element;
    }

    public withThenPart(thenPart: Statement): If {
        return this.padding.withThenPart(JRightPadded.withElement(this._thenPart, thenPart));
    }

    private readonly _elsePart: IfElse | null;

    public get elsePart(): IfElse | null {
        return this._elsePart;
    }

    public withElsePart(elsePart: IfElse | null): If {
        return elsePart === this._elsePart ? this : new If(this._id, this._prefix, this._markers, this._ifCondition, this._thenPart, elsePart);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitIf(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get thenPart(): JRightPadded<Statement> {
                return t._thenPart;
            }
            public withThenPart(thenPart: JRightPadded<Statement>): If {
                return t._thenPart === thenPart ? t : new If(t._id, t._prefix, t._markers, t._ifCondition, thenPart, t._elsePart);
            }
        }
    }

}

export class IfElse extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, body: JRightPadded<Statement>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._body = body;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): IfElse {
        return id === this._id ? this : new IfElse(id, this._prefix, this._markers, this._body);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): IfElse {
        return prefix === this._prefix ? this : new IfElse(this._id, prefix, this._markers, this._body);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): IfElse {
        return markers === this._markers ? this : new IfElse(this._id, this._prefix, markers, this._body);
    }

    private readonly _body: JRightPadded<Statement>;

    public get body(): Statement {
        return this._body.element;
    }

    public withBody(body: Statement): IfElse {
        return this.padding.withBody(JRightPadded.withElement(this._body, body));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitElse(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get body(): JRightPadded<Statement> {
                return t._body;
            }
            public withBody(body: JRightPadded<Statement>): IfElse {
                return t._body === body ? t : new IfElse(t._id, t._prefix, t._markers, body);
            }
        }
    }

}

export class Import extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, _static: JLeftPadded<boolean>, qualid: FieldAccess, alias: JLeftPadded<Identifier> | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this.__static = _static;
        this._qualid = qualid;
        this._alias = alias;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Import {
        return id === this._id ? this : new Import(id, this._prefix, this._markers, this.__static, this._qualid, this._alias);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Import {
        return prefix === this._prefix ? this : new Import(this._id, prefix, this._markers, this.__static, this._qualid, this._alias);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Import {
        return markers === this._markers ? this : new Import(this._id, this._prefix, markers, this.__static, this._qualid, this._alias);
    }

    private readonly __static: JLeftPadded<boolean>;

    public get _static(): boolean {
        return this.__static.element;
    }

    public withStatic(_static: boolean): Import {
        return this.padding.withStatic(JLeftPadded.withElement(this.__static, _static));
    }

    private readonly _qualid: FieldAccess;

    public get qualid(): FieldAccess {
        return this._qualid;
    }

    public withQualid(qualid: FieldAccess): Import {
        return qualid === this._qualid ? this : new Import(this._id, this._prefix, this._markers, this.__static, qualid, this._alias);
    }

    private readonly _alias: JLeftPadded<Identifier> | null;

    public get alias(): Identifier | null {
        return this._alias === null ? null : this._alias.element;
    }

    public withAlias(alias: Identifier | null): Import {
        return this.padding.withAlias(JLeftPadded.withElement(this._alias, alias));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitImport(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get _static(): JLeftPadded<boolean> {
                return t.__static;
            }
            public withStatic(_static: JLeftPadded<boolean>): Import {
                return t._static === _static ? t : new Import(t._id, t._prefix, t._markers, _static, t._qualid, t._alias);
            }
            public get alias(): JLeftPadded<Identifier> | null {
                return t._alias;
            }
            public withAlias(alias: JLeftPadded<Identifier> | null): Import {
                return t._alias === alias ? t : new Import(t._id, t._prefix, t._markers, t.__static, t._qualid, alias);
            }
        }
    }

}

export class InstanceOf extends J implements Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, expression: JRightPadded<Expression>, clazz: J, pattern: J | null, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._expression = expression;
        this._clazz = clazz;
        this._pattern = pattern;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): InstanceOf {
        return id === this._id ? this : new InstanceOf(id, this._prefix, this._markers, this._expression, this._clazz, this._pattern, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): InstanceOf {
        return prefix === this._prefix ? this : new InstanceOf(this._id, prefix, this._markers, this._expression, this._clazz, this._pattern, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): InstanceOf {
        return markers === this._markers ? this : new InstanceOf(this._id, this._prefix, markers, this._expression, this._clazz, this._pattern, this.__type);
    }

    private readonly _expression: JRightPadded<Expression>;

    public get expression(): Expression {
        return this._expression.element;
    }

    public withExpression(expression: Expression): InstanceOf {
        return this.padding.withExpression(JRightPadded.withElement(this._expression, expression));
    }

    private readonly _clazz: J;

    public get clazz(): J {
        return this._clazz;
    }

    public withClazz(clazz: J): InstanceOf {
        return clazz === this._clazz ? this : new InstanceOf(this._id, this._prefix, this._markers, this._expression, clazz, this._pattern, this.__type);
    }

    private readonly _pattern: J | null;

    public get pattern(): J | null {
        return this._pattern;
    }

    public withPattern(pattern: J | null): InstanceOf {
        return pattern === this._pattern ? this : new InstanceOf(this._id, this._prefix, this._markers, this._expression, this._clazz, pattern, this.__type);
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): InstanceOf {
        return _type === this.__type ? this : new InstanceOf(this._id, this._prefix, this._markers, this._expression, this._clazz, this._pattern, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitInstanceOf(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get expression(): JRightPadded<Expression> {
                return t._expression;
            }
            public withExpression(expression: JRightPadded<Expression>): InstanceOf {
                return t._expression === expression ? t : new InstanceOf(t._id, t._prefix, t._markers, expression, t._clazz, t._pattern, t.__type);
            }
        }
    }

}

export class IntersectionType extends J implements TypeTree, Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, bounds: JContainer<TypeTree>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._bounds = bounds;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): IntersectionType {
        return id === this._id ? this : new IntersectionType(id, this._prefix, this._markers, this._bounds);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): IntersectionType {
        return prefix === this._prefix ? this : new IntersectionType(this._id, prefix, this._markers, this._bounds);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): IntersectionType {
        return markers === this._markers ? this : new IntersectionType(this._id, this._prefix, markers, this._bounds);
    }

    private readonly _bounds: JContainer<TypeTree>;

    public get bounds(): TypeTree[] {
        return this._bounds.elements;
    }

    public withBounds(bounds: TypeTree[]): IntersectionType {
        return this.padding.withBounds(JContainer.withElements(this._bounds, bounds));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitIntersectionType(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get bounds(): JContainer<TypeTree> {
                return t._bounds;
            }
            public withBounds(bounds: JContainer<TypeTree>): IntersectionType {
                return t._bounds === bounds ? t : new IntersectionType(t._id, t._prefix, t._markers, bounds);
            }
        }
    }

}

export class Label extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, label: JRightPadded<Identifier>, statement: Statement) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._label = label;
        this._statement = statement;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Label {
        return id === this._id ? this : new Label(id, this._prefix, this._markers, this._label, this._statement);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Label {
        return prefix === this._prefix ? this : new Label(this._id, prefix, this._markers, this._label, this._statement);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Label {
        return markers === this._markers ? this : new Label(this._id, this._prefix, markers, this._label, this._statement);
    }

    private readonly _label: JRightPadded<Identifier>;

    public get label(): Identifier {
        return this._label.element;
    }

    public withLabel(label: Identifier): Label {
        return this.padding.withLabel(JRightPadded.withElement(this._label, label));
    }

    private readonly _statement: Statement;

    public get statement(): Statement {
        return this._statement;
    }

    public withStatement(statement: Statement): Label {
        return statement === this._statement ? this : new Label(this._id, this._prefix, this._markers, this._label, statement);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitLabel(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get label(): JRightPadded<Identifier> {
                return t._label;
            }
            public withLabel(label: JRightPadded<Identifier>): Label {
                return t._label === label ? t : new Label(t._id, t._prefix, t._markers, label, t._statement);
            }
        }
    }

}

export class Lambda extends J implements Statement, Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, parameters: LambdaParameters, arrow: Space, body: J, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._parameters = parameters;
        this._arrow = arrow;
        this._body = body;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Lambda {
        return id === this._id ? this : new Lambda(id, this._prefix, this._markers, this._parameters, this._arrow, this._body, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Lambda {
        return prefix === this._prefix ? this : new Lambda(this._id, prefix, this._markers, this._parameters, this._arrow, this._body, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Lambda {
        return markers === this._markers ? this : new Lambda(this._id, this._prefix, markers, this._parameters, this._arrow, this._body, this.__type);
    }

    private readonly _parameters: LambdaParameters;

    public get parameters(): LambdaParameters {
        return this._parameters;
    }

    public withParameters(parameters: LambdaParameters): Lambda {
        return parameters === this._parameters ? this : new Lambda(this._id, this._prefix, this._markers, parameters, this._arrow, this._body, this.__type);
    }

    private readonly _arrow: Space;

    public get arrow(): Space {
        return this._arrow;
    }

    public withArrow(arrow: Space): Lambda {
        return arrow === this._arrow ? this : new Lambda(this._id, this._prefix, this._markers, this._parameters, arrow, this._body, this.__type);
    }

    private readonly _body: J;

    public get body(): J {
        return this._body;
    }

    public withBody(body: J): Lambda {
        return body === this._body ? this : new Lambda(this._id, this._prefix, this._markers, this._parameters, this._arrow, body, this.__type);
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): Lambda {
        return _type === this.__type ? this : new Lambda(this._id, this._prefix, this._markers, this._parameters, this._arrow, this._body, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitLambda(this, p);
    }

}

export class LambdaParameters extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, parenthesized: boolean, parameters: JRightPadded<J>[]) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._parenthesized = parenthesized;
        this._parameters = parameters;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): LambdaParameters {
        return id === this._id ? this : new LambdaParameters(id, this._prefix, this._markers, this._parenthesized, this._parameters);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): LambdaParameters {
        return prefix === this._prefix ? this : new LambdaParameters(this._id, prefix, this._markers, this._parenthesized, this._parameters);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): LambdaParameters {
        return markers === this._markers ? this : new LambdaParameters(this._id, this._prefix, markers, this._parenthesized, this._parameters);
    }

    private readonly _parenthesized: boolean;

    public get parenthesized(): boolean {
        return this._parenthesized;
    }

    public withParenthesized(parenthesized: boolean): LambdaParameters {
        return parenthesized === this._parenthesized ? this : new LambdaParameters(this._id, this._prefix, this._markers, parenthesized, this._parameters);
    }

    private readonly _parameters: JRightPadded<J>[];

    public get parameters(): J[] {
        return JRightPadded.getElements(this._parameters);
    }

    public withParameters(parameters: J[]): LambdaParameters {
        return this.padding.withParameters(JRightPadded.withElements(this._parameters, parameters));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitLambdaParameters(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get parameters(): JRightPadded<J>[] {
                return t._parameters;
            }
            public withParameters(parameters: JRightPadded<J>[]): LambdaParameters {
                return t._parameters === parameters ? t : new LambdaParameters(t._id, t._prefix, t._markers, t._parenthesized, parameters);
            }
        }
    }

}

export class Literal extends J implements Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, value: Object | null, valueSource: string | null, unicodeEscapes: LiteralUnicodeEscape[] | null, _type: JavaType.Primitive) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._value = value;
        this._valueSource = valueSource;
        this._unicodeEscapes = unicodeEscapes;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Literal {
        return id === this._id ? this : new Literal(id, this._prefix, this._markers, this._value, this._valueSource, this._unicodeEscapes, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Literal {
        return prefix === this._prefix ? this : new Literal(this._id, prefix, this._markers, this._value, this._valueSource, this._unicodeEscapes, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Literal {
        return markers === this._markers ? this : new Literal(this._id, this._prefix, markers, this._value, this._valueSource, this._unicodeEscapes, this.__type);
    }

    private readonly _value: Object | null;

    public get value(): Object | null {
        return this._value;
    }

    public withValue(value: Object | null): Literal {
        return value === this._value ? this : new Literal(this._id, this._prefix, this._markers, value, this._valueSource, this._unicodeEscapes, this.__type);
    }

    private readonly _valueSource: string | null;

    public get valueSource(): string | null {
        return this._valueSource;
    }

    public withValueSource(valueSource: string | null): Literal {
        return valueSource === this._valueSource ? this : new Literal(this._id, this._prefix, this._markers, this._value, valueSource, this._unicodeEscapes, this.__type);
    }

    private readonly _unicodeEscapes: LiteralUnicodeEscape[] | null;

    public get unicodeEscapes(): LiteralUnicodeEscape[] | null {
        return this._unicodeEscapes;
    }

    public withUnicodeEscapes(unicodeEscapes: LiteralUnicodeEscape[] | null): Literal {
        return unicodeEscapes === this._unicodeEscapes ? this : new Literal(this._id, this._prefix, this._markers, this._value, this._valueSource, unicodeEscapes, this.__type);
    }

    private readonly __type: JavaType.Primitive;

    public get _type(): JavaType.Primitive {
        return this.__type;
    }

    public withType(_type: JavaType.Primitive): Literal {
        return _type === this.__type ? this : new Literal(this._id, this._prefix, this._markers, this._value, this._valueSource, this._unicodeEscapes, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitLiteral(this, p);
    }

}

class LiteralUnicodeEscape {
    public constructor(valueSourceIndex: number, codePoint: string) {
        this._valueSourceIndex = valueSourceIndex;
        this._codePoint = codePoint;
    }

    private readonly _valueSourceIndex: number;

    public get valueSourceIndex(): number {
        return this._valueSourceIndex;
    }

    public withValueSourceIndex(valueSourceIndex: number): LiteralUnicodeEscape {
        return valueSourceIndex === this._valueSourceIndex ? this : new LiteralUnicodeEscape(valueSourceIndex, this._codePoint);
    }

    private readonly _codePoint: string;

    public get codePoint(): string {
        return this._codePoint;
    }

    public withCodePoint(codePoint: string): LiteralUnicodeEscape {
        return codePoint === this._codePoint ? this : new LiteralUnicodeEscape(this._valueSourceIndex, codePoint);
    }

}

export class MemberReference extends J implements TypedTree, MethodCall {
    public constructor(id: UUID, prefix: Space, markers: Markers, containing: JRightPadded<Expression>, typeParameters: JContainer<Expression> | null, reference: JLeftPadded<Identifier>, _type: JavaType | null, methodType: JavaType.Method | null, variableType: JavaType.Variable | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._containing = containing;
        this._typeParameters = typeParameters;
        this._reference = reference;
        this.__type = _type;
        this._methodType = methodType;
        this._variableType = variableType;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): MemberReference {
        return id === this._id ? this : new MemberReference(id, this._prefix, this._markers, this._containing, this._typeParameters, this._reference, this.__type, this._methodType, this._variableType);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): MemberReference {
        return prefix === this._prefix ? this : new MemberReference(this._id, prefix, this._markers, this._containing, this._typeParameters, this._reference, this.__type, this._methodType, this._variableType);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): MemberReference {
        return markers === this._markers ? this : new MemberReference(this._id, this._prefix, markers, this._containing, this._typeParameters, this._reference, this.__type, this._methodType, this._variableType);
    }

    private readonly _containing: JRightPadded<Expression>;

    public get containing(): Expression {
        return this._containing.element;
    }

    public withContaining(containing: Expression): MemberReference {
        return this.padding.withContaining(JRightPadded.withElement(this._containing, containing));
    }

    private readonly _typeParameters: JContainer<Expression> | null;

    public get typeParameters(): Expression[] | null {
        return this._typeParameters === null ? null : this._typeParameters.elements;
    }

    public withTypeParameters(typeParameters: Expression[] | null): MemberReference {
        return this.padding.withTypeParameters(JContainer.withElementsNullable(this._typeParameters, typeParameters));
    }

    private readonly _reference: JLeftPadded<Identifier>;

    public get reference(): Identifier {
        return this._reference.element;
    }

    public withReference(reference: Identifier): MemberReference {
        return this.padding.withReference(JLeftPadded.withElement(this._reference, reference));
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): MemberReference {
        return _type === this.__type ? this : new MemberReference(this._id, this._prefix, this._markers, this._containing, this._typeParameters, this._reference, _type, this._methodType, this._variableType);
    }

    private readonly _methodType: JavaType.Method | null;

    public get methodType(): JavaType.Method | null {
        return this._methodType;
    }

    public withMethodType(methodType: JavaType.Method | null): MemberReference {
        return methodType === this._methodType ? this : new MemberReference(this._id, this._prefix, this._markers, this._containing, this._typeParameters, this._reference, this.__type, methodType, this._variableType);
    }

    private readonly _variableType: JavaType.Variable | null;

    public get variableType(): JavaType.Variable | null {
        return this._variableType;
    }

    public withVariableType(variableType: JavaType.Variable | null): MemberReference {
        return variableType === this._variableType ? this : new MemberReference(this._id, this._prefix, this._markers, this._containing, this._typeParameters, this._reference, this.__type, this._methodType, variableType);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitMemberReference(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get containing(): JRightPadded<Expression> {
                return t._containing;
            }
            public withContaining(containing: JRightPadded<Expression>): MemberReference {
                return t._containing === containing ? t : new MemberReference(t._id, t._prefix, t._markers, containing, t._typeParameters, t._reference, t.__type, t._methodType, t._variableType);
            }
            public get typeParameters(): JContainer<Expression> | null {
                return t._typeParameters;
            }
            public withTypeParameters(typeParameters: JContainer<Expression> | null): MemberReference {
                return t._typeParameters === typeParameters ? t : new MemberReference(t._id, t._prefix, t._markers, t._containing, typeParameters, t._reference, t.__type, t._methodType, t._variableType);
            }
            public get reference(): JLeftPadded<Identifier> {
                return t._reference;
            }
            public withReference(reference: JLeftPadded<Identifier>): MemberReference {
                return t._reference === reference ? t : new MemberReference(t._id, t._prefix, t._markers, t._containing, t._typeParameters, reference, t.__type, t._methodType, t._variableType);
            }
        }
    }

}

export class MethodDeclaration extends J implements Statement, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, leadingAnnotations: Annotation[], modifiers: Modifier[], typeParameters: TypeParameters | null, returnTypeExpression: TypeTree | null, name: MethodDeclarationIdentifierWithAnnotations, parameters: JContainer<Statement>, throws: JContainer<NameTree> | null, body: Block | null, defaultValue: JLeftPadded<Expression> | null, methodType: JavaType.Method | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._leadingAnnotations = leadingAnnotations;
        this._modifiers = modifiers;
        this._typeParameters = typeParameters;
        this._returnTypeExpression = returnTypeExpression;
        this._name = name;
        this._parameters = parameters;
        this._throws = throws;
        this._body = body;
        this._defaultValue = defaultValue;
        this._methodType = methodType;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): MethodDeclaration {
        return id === this._id ? this : new MethodDeclaration(id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throws, this._body, this._defaultValue, this._methodType);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): MethodDeclaration {
        return prefix === this._prefix ? this : new MethodDeclaration(this._id, prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throws, this._body, this._defaultValue, this._methodType);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): MethodDeclaration {
        return markers === this._markers ? this : new MethodDeclaration(this._id, this._prefix, markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throws, this._body, this._defaultValue, this._methodType);
    }

    private readonly _leadingAnnotations: Annotation[];

    public get leadingAnnotations(): Annotation[] {
        return this._leadingAnnotations;
    }

    public withLeadingAnnotations(leadingAnnotations: Annotation[]): MethodDeclaration {
        return leadingAnnotations === this._leadingAnnotations ? this : new MethodDeclaration(this._id, this._prefix, this._markers, leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throws, this._body, this._defaultValue, this._methodType);
    }

    private readonly _modifiers: Modifier[];

    public get modifiers(): Modifier[] {
        return this._modifiers;
    }

    public withModifiers(modifiers: Modifier[]): MethodDeclaration {
        return modifiers === this._modifiers ? this : new MethodDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throws, this._body, this._defaultValue, this._methodType);
    }

    private readonly _typeParameters: TypeParameters | null;

    private readonly _returnTypeExpression: TypeTree | null;

    public get returnTypeExpression(): TypeTree | null {
        return this._returnTypeExpression;
    }

    public withReturnTypeExpression(returnTypeExpression: TypeTree | null): MethodDeclaration {
        return returnTypeExpression === this._returnTypeExpression ? this : new MethodDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, returnTypeExpression, this._name, this._parameters, this._throws, this._body, this._defaultValue, this._methodType);
    }

    private readonly _name: MethodDeclarationIdentifierWithAnnotations;

    private readonly _parameters: JContainer<Statement>;

    public get parameters(): Statement[] {
        return this._parameters.elements;
    }

    public withParameters(parameters: Statement[]): MethodDeclaration {
        return this.padding.withParameters(JContainer.withElements(this._parameters, parameters));
    }

    private readonly _throws: JContainer<NameTree> | null;

    public get throws(): NameTree[] | null {
        return this._throws === null ? null : this._throws.elements;
    }

    public withThrows(throws: NameTree[] | null): MethodDeclaration {
        return this.padding.withThrows(JContainer.withElementsNullable(this._throws, throws));
    }

    private readonly _body: Block | null;

    public get body(): Block | null {
        return this._body;
    }

    public withBody(body: Block | null): MethodDeclaration {
        return body === this._body ? this : new MethodDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throws, body, this._defaultValue, this._methodType);
    }

    private readonly _defaultValue: JLeftPadded<Expression> | null;

    public get defaultValue(): Expression | null {
        return this._defaultValue === null ? null : this._defaultValue.element;
    }

    public withDefaultValue(defaultValue: Expression | null): MethodDeclaration {
        return this.padding.withDefaultValue(JLeftPadded.withElement(this._defaultValue, defaultValue));
    }

    private readonly _methodType: JavaType.Method | null;

    public get methodType(): JavaType.Method | null {
        return this._methodType;
    }

    public withMethodType(methodType: JavaType.Method | null): MethodDeclaration {
        return methodType === this._methodType ? this : new MethodDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throws, this._body, this._defaultValue, methodType);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitMethodDeclaration(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get typeParameters(): TypeParameters | null {
                return t._typeParameters;
            }
            public withTypeParameters(typeParameters: TypeParameters | null): MethodDeclaration {
                return t._typeParameters === typeParameters ? t : new MethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, typeParameters, t._returnTypeExpression, t._name, t._parameters, t._throws, t._body, t._defaultValue, t._methodType);
            }
            public get name(): MethodDeclarationIdentifierWithAnnotations {
                return t._name;
            }
            public withName(name: MethodDeclarationIdentifierWithAnnotations): MethodDeclaration {
                return t._name === name ? t : new MethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeParameters, t._returnTypeExpression, name, t._parameters, t._throws, t._body, t._defaultValue, t._methodType);
            }
            public get parameters(): JContainer<Statement> {
                return t._parameters;
            }
            public withParameters(parameters: JContainer<Statement>): MethodDeclaration {
                return t._parameters === parameters ? t : new MethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeParameters, t._returnTypeExpression, t._name, parameters, t._throws, t._body, t._defaultValue, t._methodType);
            }
            public get throws(): JContainer<NameTree> | null {
                return t._throws;
            }
            public withThrows(throws: JContainer<NameTree> | null): MethodDeclaration {
                return t._throws === throws ? t : new MethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeParameters, t._returnTypeExpression, t._name, t._parameters, throws, t._body, t._defaultValue, t._methodType);
            }
            public get defaultValue(): JLeftPadded<Expression> | null {
                return t._defaultValue;
            }
            public withDefaultValue(defaultValue: JLeftPadded<Expression> | null): MethodDeclaration {
                return t._defaultValue === defaultValue ? t : new MethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeParameters, t._returnTypeExpression, t._name, t._parameters, t._throws, t._body, defaultValue, t._methodType);
            }
        }
    }

    get annotations() {
        const t = this;
        return new class {
            public get typeParameters(): TypeParameters | null {
                return t._typeParameters;
            }
            public withTypeParameters(typeParameters: TypeParameters | null): MethodDeclaration {
                return t._typeParameters === typeParameters ? t : new MethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, typeParameters, t._returnTypeExpression, t._name, t._parameters, t._throws, t._body, t._defaultValue, t._methodType);
            }
            public get name(): MethodDeclarationIdentifierWithAnnotations {
                return t._name;
            }
            public withName(name: MethodDeclarationIdentifierWithAnnotations): MethodDeclaration {
                return t._name === name ? t : new MethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeParameters, t._returnTypeExpression, name, t._parameters, t._throws, t._body, t._defaultValue, t._methodType);
            }
            public get parameters(): JContainer<Statement> {
                return t._parameters;
            }
            public withParameters(parameters: JContainer<Statement>): MethodDeclaration {
                return t._parameters === parameters ? t : new MethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeParameters, t._returnTypeExpression, t._name, parameters, t._throws, t._body, t._defaultValue, t._methodType);
            }
            public get throws(): JContainer<NameTree> | null {
                return t._throws;
            }
            public withThrows(throws: JContainer<NameTree> | null): MethodDeclaration {
                return t._throws === throws ? t : new MethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeParameters, t._returnTypeExpression, t._name, t._parameters, throws, t._body, t._defaultValue, t._methodType);
            }
            public get defaultValue(): JLeftPadded<Expression> | null {
                return t._defaultValue;
            }
            public withDefaultValue(defaultValue: JLeftPadded<Expression> | null): MethodDeclaration {
                return t._defaultValue === defaultValue ? t : new MethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeParameters, t._returnTypeExpression, t._name, t._parameters, t._throws, t._body, defaultValue, t._methodType);
            }
        }
    }

}

class MethodDeclarationIdentifierWithAnnotations {
    public constructor(identifier: Identifier, annotations: Annotation[]) {
        this._identifier = identifier;
        this._annotations = annotations;
    }

    private readonly _identifier: Identifier;

    public get identifier(): Identifier {
        return this._identifier;
    }

    public withIdentifier(identifier: Identifier): MethodDeclarationIdentifierWithAnnotations {
        return identifier === this._identifier ? this : new MethodDeclarationIdentifierWithAnnotations(identifier, this._annotations);
    }

    private readonly _annotations: Annotation[];

    public get annotations(): Annotation[] {
        return this._annotations;
    }

    public withAnnotations(annotations: Annotation[]): MethodDeclarationIdentifierWithAnnotations {
        return annotations === this._annotations ? this : new MethodDeclarationIdentifierWithAnnotations(this._identifier, annotations);
    }

}

export class MethodInvocation extends J implements Statement, TypedTree, MethodCall {
    public constructor(id: UUID, prefix: Space, markers: Markers, select: JRightPadded<Expression> | null, typeParameters: JContainer<Expression> | null, name: Identifier, _arguments: JContainer<Expression>, methodType: JavaType.Method | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._select = select;
        this._typeParameters = typeParameters;
        this._name = name;
        this.__arguments = _arguments;
        this._methodType = methodType;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): MethodInvocation {
        return id === this._id ? this : new MethodInvocation(id, this._prefix, this._markers, this._select, this._typeParameters, this._name, this.__arguments, this._methodType);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): MethodInvocation {
        return prefix === this._prefix ? this : new MethodInvocation(this._id, prefix, this._markers, this._select, this._typeParameters, this._name, this.__arguments, this._methodType);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): MethodInvocation {
        return markers === this._markers ? this : new MethodInvocation(this._id, this._prefix, markers, this._select, this._typeParameters, this._name, this.__arguments, this._methodType);
    }

    private readonly _select: JRightPadded<Expression> | null;

    public get select(): Expression | null {
        return this._select === null ? null : this._select.element;
    }

    public withSelect(select: Expression | null): MethodInvocation {
        return this.padding.withSelect(JRightPadded.withElement(this._select, select));
    }

    private readonly _typeParameters: JContainer<Expression> | null;

    public get typeParameters(): Expression[] | null {
        return this._typeParameters === null ? null : this._typeParameters.elements;
    }

    public withTypeParameters(typeParameters: Expression[] | null): MethodInvocation {
        return this.padding.withTypeParameters(JContainer.withElementsNullable(this._typeParameters, typeParameters));
    }

    private readonly _name: Identifier;

    public get name(): Identifier {
        return this._name;
    }

    public withName(name: Identifier): MethodInvocation {
        return extensions.withName(this, name);
    }

    private readonly __arguments: JContainer<Expression>;

    public get _arguments(): Expression[] {
        return this.__arguments.elements;
    }

    public withArguments(_arguments: Expression[]): MethodInvocation {
        return this.padding.withArguments(JContainer.withElements(this.__arguments, _arguments));
    }

    private readonly _methodType: JavaType.Method | null;

    public get methodType(): JavaType.Method | null {
        return this._methodType;
    }

    public withMethodType(methodType: JavaType.Method | null): MethodInvocation {
        return methodType === this._methodType ? this : new MethodInvocation(this._id, this._prefix, this._markers, this._select, this._typeParameters, this._name, this.__arguments, methodType);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitMethodInvocation(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get select(): JRightPadded<Expression> | null {
                return t._select;
            }
            public withSelect(select: JRightPadded<Expression> | null): MethodInvocation {
                return t._select === select ? t : new MethodInvocation(t._id, t._prefix, t._markers, select, t._typeParameters, t._name, t.__arguments, t._methodType);
            }
            public get typeParameters(): JContainer<Expression> | null {
                return t._typeParameters;
            }
            public withTypeParameters(typeParameters: JContainer<Expression> | null): MethodInvocation {
                return t._typeParameters === typeParameters ? t : new MethodInvocation(t._id, t._prefix, t._markers, t._select, typeParameters, t._name, t.__arguments, t._methodType);
            }
            public get _arguments(): JContainer<Expression> {
                return t.__arguments;
            }
            public withArguments(_arguments: JContainer<Expression>): MethodInvocation {
                return t._arguments === _arguments ? t : new MethodInvocation(t._id, t._prefix, t._markers, t._select, t._typeParameters, t._name, _arguments, t._methodType);
            }
        }
    }

}

export class Modifier extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, keyword: string | null, _type: ModifierType, annotations: Annotation[]) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._keyword = keyword;
        this.__type = _type;
        this._annotations = annotations;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Modifier {
        return id === this._id ? this : new Modifier(id, this._prefix, this._markers, this._keyword, this.__type, this._annotations);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Modifier {
        return prefix === this._prefix ? this : new Modifier(this._id, prefix, this._markers, this._keyword, this.__type, this._annotations);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Modifier {
        return markers === this._markers ? this : new Modifier(this._id, this._prefix, markers, this._keyword, this.__type, this._annotations);
    }

    private readonly _keyword: string | null;

    public get keyword(): string | null {
        return this._keyword;
    }

    public withKeyword(keyword: string | null): Modifier {
        return keyword === this._keyword ? this : new Modifier(this._id, this._prefix, this._markers, keyword, this.__type, this._annotations);
    }

    private readonly __type: ModifierType;

    public get _type(): ModifierType {
        return this.__type;
    }

    public withType(_type: ModifierType): Modifier {
        return _type === this.__type ? this : new Modifier(this._id, this._prefix, this._markers, this._keyword, _type, this._annotations);
    }

    private readonly _annotations: Annotation[];

    public get annotations(): Annotation[] {
        return this._annotations;
    }

    public withAnnotations(annotations: Annotation[]): Modifier {
        return annotations === this._annotations ? this : new Modifier(this._id, this._prefix, this._markers, this._keyword, this.__type, annotations);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitModifier(this, p);
    }

}

enum ModifierType {
    Default = 0,
    Public = 1,
    Protected = 2,
    Private = 3,
    Abstract = 4,
    Static = 5,
    Final = 6,
    Sealed = 7,
    NonSealed = 8,
    Transient = 9,
    Volatile = 10,
    Synchronized = 11,
    Native = 12,
    Strictfp = 13,
    Async = 14,
    Reified = 15,
    Inline = 16,
    LanguageExtension = 17,

}

export class MultiCatch extends J implements TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, alternatives: JRightPadded<NameTree>[]) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._alternatives = alternatives;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): MultiCatch {
        return id === this._id ? this : new MultiCatch(id, this._prefix, this._markers, this._alternatives);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): MultiCatch {
        return prefix === this._prefix ? this : new MultiCatch(this._id, prefix, this._markers, this._alternatives);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): MultiCatch {
        return markers === this._markers ? this : new MultiCatch(this._id, this._prefix, markers, this._alternatives);
    }

    private readonly _alternatives: JRightPadded<NameTree>[];

    public get alternatives(): NameTree[] {
        return JRightPadded.getElements(this._alternatives);
    }

    public withAlternatives(alternatives: NameTree[]): MultiCatch {
        return this.padding.withAlternatives(JRightPadded.withElements(this._alternatives, alternatives));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitMultiCatch(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get alternatives(): JRightPadded<NameTree>[] {
                return t._alternatives;
            }
            public withAlternatives(alternatives: JRightPadded<NameTree>[]): MultiCatch {
                return t._alternatives === alternatives ? t : new MultiCatch(t._id, t._prefix, t._markers, alternatives);
            }
        }
    }

}

export class NewArray extends J implements Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, typeExpression: TypeTree | null, dimensions: ArrayDimension[], initializer: JContainer<Expression> | null, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._typeExpression = typeExpression;
        this._dimensions = dimensions;
        this._initializer = initializer;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): NewArray {
        return id === this._id ? this : new NewArray(id, this._prefix, this._markers, this._typeExpression, this._dimensions, this._initializer, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): NewArray {
        return prefix === this._prefix ? this : new NewArray(this._id, prefix, this._markers, this._typeExpression, this._dimensions, this._initializer, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): NewArray {
        return markers === this._markers ? this : new NewArray(this._id, this._prefix, markers, this._typeExpression, this._dimensions, this._initializer, this.__type);
    }

    private readonly _typeExpression: TypeTree | null;

    public get typeExpression(): TypeTree | null {
        return this._typeExpression;
    }

    public withTypeExpression(typeExpression: TypeTree | null): NewArray {
        return typeExpression === this._typeExpression ? this : new NewArray(this._id, this._prefix, this._markers, typeExpression, this._dimensions, this._initializer, this.__type);
    }

    private readonly _dimensions: ArrayDimension[];

    public get dimensions(): ArrayDimension[] {
        return this._dimensions;
    }

    public withDimensions(dimensions: ArrayDimension[]): NewArray {
        return dimensions === this._dimensions ? this : new NewArray(this._id, this._prefix, this._markers, this._typeExpression, dimensions, this._initializer, this.__type);
    }

    private readonly _initializer: JContainer<Expression> | null;

    public get initializer(): Expression[] | null {
        return this._initializer === null ? null : this._initializer.elements;
    }

    public withInitializer(initializer: Expression[] | null): NewArray {
        return this.padding.withInitializer(JContainer.withElementsNullable(this._initializer, initializer));
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): NewArray {
        return _type === this.__type ? this : new NewArray(this._id, this._prefix, this._markers, this._typeExpression, this._dimensions, this._initializer, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitNewArray(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get initializer(): JContainer<Expression> | null {
                return t._initializer;
            }
            public withInitializer(initializer: JContainer<Expression> | null): NewArray {
                return t._initializer === initializer ? t : new NewArray(t._id, t._prefix, t._markers, t._typeExpression, t._dimensions, initializer, t.__type);
            }
        }
    }

}

export class ArrayDimension extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, index: JRightPadded<Expression>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._index = index;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ArrayDimension {
        return id === this._id ? this : new ArrayDimension(id, this._prefix, this._markers, this._index);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): ArrayDimension {
        return prefix === this._prefix ? this : new ArrayDimension(this._id, prefix, this._markers, this._index);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): ArrayDimension {
        return markers === this._markers ? this : new ArrayDimension(this._id, this._prefix, markers, this._index);
    }

    private readonly _index: JRightPadded<Expression>;

    public get index(): Expression {
        return this._index.element;
    }

    public withIndex(index: Expression): ArrayDimension {
        return this.padding.withIndex(JRightPadded.withElement(this._index, index));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitArrayDimension(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get index(): JRightPadded<Expression> {
                return t._index;
            }
            public withIndex(index: JRightPadded<Expression>): ArrayDimension {
                return t._index === index ? t : new ArrayDimension(t._id, t._prefix, t._markers, index);
            }
        }
    }

}

export class NewClass extends J implements Statement, TypedTree, MethodCall {
    public constructor(id: UUID, prefix: Space, markers: Markers, enclosing: JRightPadded<Expression> | null, _new: Space, clazz: TypeTree | null, _arguments: JContainer<Expression>, body: Block | null, constructorType: JavaType.Method | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._enclosing = enclosing;
        this.__new = _new;
        this._clazz = clazz;
        this.__arguments = _arguments;
        this._body = body;
        this._constructorType = constructorType;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): NewClass {
        return id === this._id ? this : new NewClass(id, this._prefix, this._markers, this._enclosing, this.__new, this._clazz, this.__arguments, this._body, this._constructorType);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): NewClass {
        return prefix === this._prefix ? this : new NewClass(this._id, prefix, this._markers, this._enclosing, this.__new, this._clazz, this.__arguments, this._body, this._constructorType);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): NewClass {
        return markers === this._markers ? this : new NewClass(this._id, this._prefix, markers, this._enclosing, this.__new, this._clazz, this.__arguments, this._body, this._constructorType);
    }

    private readonly _enclosing: JRightPadded<Expression> | null;

    public get enclosing(): Expression | null {
        return this._enclosing === null ? null : this._enclosing.element;
    }

    public withEnclosing(enclosing: Expression | null): NewClass {
        return this.padding.withEnclosing(JRightPadded.withElement(this._enclosing, enclosing));
    }

    private readonly __new: Space;

    public get _new(): Space {
        return this.__new;
    }

    public withNew(_new: Space): NewClass {
        return _new === this.__new ? this : new NewClass(this._id, this._prefix, this._markers, this._enclosing, _new, this._clazz, this.__arguments, this._body, this._constructorType);
    }

    private readonly _clazz: TypeTree | null;

    public get clazz(): TypeTree | null {
        return this._clazz;
    }

    public withClazz(clazz: TypeTree | null): NewClass {
        return clazz === this._clazz ? this : new NewClass(this._id, this._prefix, this._markers, this._enclosing, this.__new, clazz, this.__arguments, this._body, this._constructorType);
    }

    private readonly __arguments: JContainer<Expression>;

    public get _arguments(): Expression[] {
        return this.__arguments.elements;
    }

    public withArguments(_arguments: Expression[]): NewClass {
        return this.padding.withArguments(JContainer.withElements(this.__arguments, _arguments));
    }

    private readonly _body: Block | null;

    public get body(): Block | null {
        return this._body;
    }

    public withBody(body: Block | null): NewClass {
        return body === this._body ? this : new NewClass(this._id, this._prefix, this._markers, this._enclosing, this.__new, this._clazz, this.__arguments, body, this._constructorType);
    }

    private readonly _constructorType: JavaType.Method | null;

    public get constructorType(): JavaType.Method | null {
        return this._constructorType;
    }

    public withConstructorType(constructorType: JavaType.Method | null): NewClass {
        return constructorType === this._constructorType ? this : new NewClass(this._id, this._prefix, this._markers, this._enclosing, this.__new, this._clazz, this.__arguments, this._body, constructorType);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitNewClass(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get enclosing(): JRightPadded<Expression> | null {
                return t._enclosing;
            }
            public withEnclosing(enclosing: JRightPadded<Expression> | null): NewClass {
                return t._enclosing === enclosing ? t : new NewClass(t._id, t._prefix, t._markers, enclosing, t.__new, t._clazz, t.__arguments, t._body, t._constructorType);
            }
            public get _arguments(): JContainer<Expression> {
                return t.__arguments;
            }
            public withArguments(_arguments: JContainer<Expression>): NewClass {
                return t._arguments === _arguments ? t : new NewClass(t._id, t._prefix, t._markers, t._enclosing, t.__new, t._clazz, _arguments, t._body, t._constructorType);
            }
        }
    }

}

export class NullableType extends J implements TypeTree, Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, annotations: Annotation[], typeTree: JRightPadded<TypeTree>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._annotations = annotations;
        this._typeTree = typeTree;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): NullableType {
        return id === this._id ? this : new NullableType(id, this._prefix, this._markers, this._annotations, this._typeTree);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): NullableType {
        return prefix === this._prefix ? this : new NullableType(this._id, prefix, this._markers, this._annotations, this._typeTree);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): NullableType {
        return markers === this._markers ? this : new NullableType(this._id, this._prefix, markers, this._annotations, this._typeTree);
    }

    private readonly _annotations: Annotation[];

    public get annotations(): Annotation[] {
        return this._annotations;
    }

    public withAnnotations(annotations: Annotation[]): NullableType {
        return annotations === this._annotations ? this : new NullableType(this._id, this._prefix, this._markers, annotations, this._typeTree);
    }

    private readonly _typeTree: JRightPadded<TypeTree>;

    public get typeTree(): TypeTree {
        return this._typeTree.element;
    }

    public withTypeTree(typeTree: TypeTree): NullableType {
        return this.padding.withTypeTree(JRightPadded.withElement(this._typeTree, typeTree));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitNullableType(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get typeTree(): JRightPadded<TypeTree> {
                return t._typeTree;
            }
            public withTypeTree(typeTree: JRightPadded<TypeTree>): NullableType {
                return t._typeTree === typeTree ? t : new NullableType(t._id, t._prefix, t._markers, t._annotations, typeTree);
            }
        }
    }

}

export class Package extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, expression: Expression, annotations: Annotation[]) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._expression = expression;
        this._annotations = annotations;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Package {
        return id === this._id ? this : new Package(id, this._prefix, this._markers, this._expression, this._annotations);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Package {
        return prefix === this._prefix ? this : new Package(this._id, prefix, this._markers, this._expression, this._annotations);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Package {
        return markers === this._markers ? this : new Package(this._id, this._prefix, markers, this._expression, this._annotations);
    }

    private readonly _expression: Expression;

    public get expression(): Expression {
        return this._expression;
    }

    public withExpression(expression: Expression): Package {
        return expression === this._expression ? this : new Package(this._id, this._prefix, this._markers, expression, this._annotations);
    }

    private readonly _annotations: Annotation[];

    public get annotations(): Annotation[] {
        return this._annotations;
    }

    public withAnnotations(annotations: Annotation[]): Package {
        return annotations === this._annotations ? this : new Package(this._id, this._prefix, this._markers, this._expression, annotations);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitPackage(this, p);
    }

}

export class ParameterizedType extends J implements TypeTree, Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, clazz: NameTree, typeParameters: JContainer<Expression> | null, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._clazz = clazz;
        this._typeParameters = typeParameters;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ParameterizedType {
        return id === this._id ? this : new ParameterizedType(id, this._prefix, this._markers, this._clazz, this._typeParameters, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): ParameterizedType {
        return prefix === this._prefix ? this : new ParameterizedType(this._id, prefix, this._markers, this._clazz, this._typeParameters, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): ParameterizedType {
        return markers === this._markers ? this : new ParameterizedType(this._id, this._prefix, markers, this._clazz, this._typeParameters, this.__type);
    }

    private readonly _clazz: NameTree;

    public get clazz(): NameTree {
        return this._clazz;
    }

    public withClazz(clazz: NameTree): ParameterizedType {
        return clazz === this._clazz ? this : new ParameterizedType(this._id, this._prefix, this._markers, clazz, this._typeParameters, this.__type);
    }

    private readonly _typeParameters: JContainer<Expression> | null;

    public get typeParameters(): Expression[] | null {
        return this._typeParameters === null ? null : this._typeParameters.elements;
    }

    public withTypeParameters(typeParameters: Expression[] | null): ParameterizedType {
        return this.padding.withTypeParameters(JContainer.withElementsNullable(this._typeParameters, typeParameters));
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): ParameterizedType {
        return _type === this.__type ? this : new ParameterizedType(this._id, this._prefix, this._markers, this._clazz, this._typeParameters, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitParameterizedType(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get typeParameters(): JContainer<Expression> | null {
                return t._typeParameters;
            }
            public withTypeParameters(typeParameters: JContainer<Expression> | null): ParameterizedType {
                return t._typeParameters === typeParameters ? t : new ParameterizedType(t._id, t._prefix, t._markers, t._clazz, typeParameters, t.__type);
            }
        }
    }

}

export class Parentheses<J2> extends J implements Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, tree: JRightPadded<J2>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._tree = tree;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Parentheses<J2> {
        return id === this._id ? this : new Parentheses<J2>(id, this._prefix, this._markers, this._tree);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Parentheses<J2> {
        return prefix === this._prefix ? this : new Parentheses<J2>(this._id, prefix, this._markers, this._tree);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Parentheses<J2> {
        return markers === this._markers ? this : new Parentheses<J2>(this._id, this._prefix, markers, this._tree);
    }

    private readonly _tree: JRightPadded<J2>;

    public get tree(): J2 {
        return this._tree.element;
    }

    public withTree(tree: J2): Parentheses<J2> {
        return this.padding.withTree(JRightPadded.withElement(this._tree, tree));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitParentheses(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get tree(): JRightPadded<J2> {
                return t._tree;
            }
            public withTree(tree: JRightPadded<J2>): Parentheses<J> {
                return t._tree === tree ? t : new Parentheses<J2>(t._id, t._prefix, t._markers, tree);
            }
        }
    }

}

export class ControlParentheses<J2> extends J implements Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, tree: JRightPadded<J2>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._tree = tree;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ControlParentheses<J2> {
        return id === this._id ? this : new ControlParentheses<J2>(id, this._prefix, this._markers, this._tree);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): ControlParentheses<J2> {
        return prefix === this._prefix ? this : new ControlParentheses<J2>(this._id, prefix, this._markers, this._tree);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): ControlParentheses<J2> {
        return markers === this._markers ? this : new ControlParentheses<J2>(this._id, this._prefix, markers, this._tree);
    }

    private readonly _tree: JRightPadded<J2>;

    public get tree(): J2 {
        return this._tree.element;
    }

    public withTree(tree: J2): ControlParentheses<J2> {
        return this.padding.withTree(JRightPadded.withElement(this._tree, tree));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitControlParentheses(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get tree(): JRightPadded<J2> {
                return t._tree;
            }
            public withTree(tree: JRightPadded<J2>): ControlParentheses<J> {
                return t._tree === tree ? t : new ControlParentheses<J2>(t._id, t._prefix, t._markers, tree);
            }
        }
    }

}

export class Primitive extends J implements TypeTree, Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, _type: JavaType.Primitive) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Primitive {
        return id === this._id ? this : new Primitive(id, this._prefix, this._markers, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Primitive {
        return prefix === this._prefix ? this : new Primitive(this._id, prefix, this._markers, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Primitive {
        return markers === this._markers ? this : new Primitive(this._id, this._prefix, markers, this.__type);
    }

    private readonly __type: JavaType.Primitive;

    public withType(_type: JavaType.Primitive): Primitive {
        return _type === this.__type ? this : new Primitive(this._id, this._prefix, this._markers, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitPrimitive(this, p);
    }

}

export class Return extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, expression: Expression | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._expression = expression;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Return {
        return id === this._id ? this : new Return(id, this._prefix, this._markers, this._expression);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Return {
        return prefix === this._prefix ? this : new Return(this._id, prefix, this._markers, this._expression);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Return {
        return markers === this._markers ? this : new Return(this._id, this._prefix, markers, this._expression);
    }

    private readonly _expression: Expression | null;

    public get expression(): Expression | null {
        return this._expression;
    }

    public withExpression(expression: Expression | null): Return {
        return expression === this._expression ? this : new Return(this._id, this._prefix, this._markers, expression);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitReturn(this, p);
    }

}

export class Switch extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, selector: ControlParentheses<Expression>, cases: Block) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._selector = selector;
        this._cases = cases;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Switch {
        return id === this._id ? this : new Switch(id, this._prefix, this._markers, this._selector, this._cases);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Switch {
        return prefix === this._prefix ? this : new Switch(this._id, prefix, this._markers, this._selector, this._cases);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Switch {
        return markers === this._markers ? this : new Switch(this._id, this._prefix, markers, this._selector, this._cases);
    }

    private readonly _selector: ControlParentheses<Expression>;

    public get selector(): ControlParentheses<Expression> {
        return this._selector;
    }

    public withSelector(selector: ControlParentheses<Expression>): Switch {
        return selector === this._selector ? this : new Switch(this._id, this._prefix, this._markers, selector, this._cases);
    }

    private readonly _cases: Block;

    public get cases(): Block {
        return this._cases;
    }

    public withCases(cases: Block): Switch {
        return cases === this._cases ? this : new Switch(this._id, this._prefix, this._markers, this._selector, cases);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitSwitch(this, p);
    }

}

export class SwitchExpression extends J implements Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, selector: ControlParentheses<Expression>, cases: Block) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._selector = selector;
        this._cases = cases;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): SwitchExpression {
        return id === this._id ? this : new SwitchExpression(id, this._prefix, this._markers, this._selector, this._cases);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): SwitchExpression {
        return prefix === this._prefix ? this : new SwitchExpression(this._id, prefix, this._markers, this._selector, this._cases);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): SwitchExpression {
        return markers === this._markers ? this : new SwitchExpression(this._id, this._prefix, markers, this._selector, this._cases);
    }

    private readonly _selector: ControlParentheses<Expression>;

    public get selector(): ControlParentheses<Expression> {
        return this._selector;
    }

    public withSelector(selector: ControlParentheses<Expression>): SwitchExpression {
        return selector === this._selector ? this : new SwitchExpression(this._id, this._prefix, this._markers, selector, this._cases);
    }

    private readonly _cases: Block;

    public get cases(): Block {
        return this._cases;
    }

    public withCases(cases: Block): SwitchExpression {
        return cases === this._cases ? this : new SwitchExpression(this._id, this._prefix, this._markers, this._selector, cases);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitSwitchExpression(this, p);
    }

}

export class Synchronized extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, lock: ControlParentheses<Expression>, body: Block) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._lock = lock;
        this._body = body;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Synchronized {
        return id === this._id ? this : new Synchronized(id, this._prefix, this._markers, this._lock, this._body);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Synchronized {
        return prefix === this._prefix ? this : new Synchronized(this._id, prefix, this._markers, this._lock, this._body);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Synchronized {
        return markers === this._markers ? this : new Synchronized(this._id, this._prefix, markers, this._lock, this._body);
    }

    private readonly _lock: ControlParentheses<Expression>;

    public get lock(): ControlParentheses<Expression> {
        return this._lock;
    }

    public withLock(lock: ControlParentheses<Expression>): Synchronized {
        return lock === this._lock ? this : new Synchronized(this._id, this._prefix, this._markers, lock, this._body);
    }

    private readonly _body: Block;

    public get body(): Block {
        return this._body;
    }

    public withBody(body: Block): Synchronized {
        return body === this._body ? this : new Synchronized(this._id, this._prefix, this._markers, this._lock, body);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitSynchronized(this, p);
    }

}

export class Ternary extends J implements Expression, Statement, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, condition: Expression, truePart: JLeftPadded<Expression>, falsePart: JLeftPadded<Expression>, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._condition = condition;
        this._truePart = truePart;
        this._falsePart = falsePart;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Ternary {
        return id === this._id ? this : new Ternary(id, this._prefix, this._markers, this._condition, this._truePart, this._falsePart, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Ternary {
        return prefix === this._prefix ? this : new Ternary(this._id, prefix, this._markers, this._condition, this._truePart, this._falsePart, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Ternary {
        return markers === this._markers ? this : new Ternary(this._id, this._prefix, markers, this._condition, this._truePart, this._falsePart, this.__type);
    }

    private readonly _condition: Expression;

    public get condition(): Expression {
        return this._condition;
    }

    public withCondition(condition: Expression): Ternary {
        return condition === this._condition ? this : new Ternary(this._id, this._prefix, this._markers, condition, this._truePart, this._falsePart, this.__type);
    }

    private readonly _truePart: JLeftPadded<Expression>;

    public get truePart(): Expression {
        return this._truePart.element;
    }

    public withTruePart(truePart: Expression): Ternary {
        return this.padding.withTruePart(JLeftPadded.withElement(this._truePart, truePart));
    }

    private readonly _falsePart: JLeftPadded<Expression>;

    public get falsePart(): Expression {
        return this._falsePart.element;
    }

    public withFalsePart(falsePart: Expression): Ternary {
        return this.padding.withFalsePart(JLeftPadded.withElement(this._falsePart, falsePart));
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): Ternary {
        return _type === this.__type ? this : new Ternary(this._id, this._prefix, this._markers, this._condition, this._truePart, this._falsePart, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitTernary(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get truePart(): JLeftPadded<Expression> {
                return t._truePart;
            }
            public withTruePart(truePart: JLeftPadded<Expression>): Ternary {
                return t._truePart === truePart ? t : new Ternary(t._id, t._prefix, t._markers, t._condition, truePart, t._falsePart, t.__type);
            }
            public get falsePart(): JLeftPadded<Expression> {
                return t._falsePart;
            }
            public withFalsePart(falsePart: JLeftPadded<Expression>): Ternary {
                return t._falsePart === falsePart ? t : new Ternary(t._id, t._prefix, t._markers, t._condition, t._truePart, falsePart, t.__type);
            }
        }
    }

}

export class Throw extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, exception: Expression) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._exception = exception;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Throw {
        return id === this._id ? this : new Throw(id, this._prefix, this._markers, this._exception);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Throw {
        return prefix === this._prefix ? this : new Throw(this._id, prefix, this._markers, this._exception);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Throw {
        return markers === this._markers ? this : new Throw(this._id, this._prefix, markers, this._exception);
    }

    private readonly _exception: Expression;

    public get exception(): Expression {
        return this._exception;
    }

    public withException(exception: Expression): Throw {
        return exception === this._exception ? this : new Throw(this._id, this._prefix, this._markers, exception);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitThrow(this, p);
    }

}

export class Try extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, resources: JContainer<TryResource> | null, body: Block, catches: TryCatch[], _finally: JLeftPadded<Block> | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._resources = resources;
        this._body = body;
        this._catches = catches;
        this.__finally = _finally;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Try {
        return id === this._id ? this : new Try(id, this._prefix, this._markers, this._resources, this._body, this._catches, this.__finally);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Try {
        return prefix === this._prefix ? this : new Try(this._id, prefix, this._markers, this._resources, this._body, this._catches, this.__finally);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Try {
        return markers === this._markers ? this : new Try(this._id, this._prefix, markers, this._resources, this._body, this._catches, this.__finally);
    }

    private readonly _resources: JContainer<TryResource> | null;

    public get resources(): TryResource[] | null {
        return this._resources === null ? null : this._resources.elements;
    }

    public withResources(resources: TryResource[] | null): Try {
        return this.padding.withResources(JContainer.withElementsNullable(this._resources, resources));
    }

    private readonly _body: Block;

    public get body(): Block {
        return this._body;
    }

    public withBody(body: Block): Try {
        return body === this._body ? this : new Try(this._id, this._prefix, this._markers, this._resources, body, this._catches, this.__finally);
    }

    private readonly _catches: TryCatch[];

    public get catches(): TryCatch[] {
        return this._catches;
    }

    public withCatches(catches: TryCatch[]): Try {
        return catches === this._catches ? this : new Try(this._id, this._prefix, this._markers, this._resources, this._body, catches, this.__finally);
    }

    private readonly __finally: JLeftPadded<Block> | null;

    public get _finally(): Block | null {
        return this.__finally === null ? null : this.__finally.element;
    }

    public withFinally(_finally: Block | null): Try {
        return this.padding.withFinally(JLeftPadded.withElement(this.__finally, _finally));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitTry(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get resources(): JContainer<TryResource> | null {
                return t._resources;
            }
            public withResources(resources: JContainer<TryResource> | null): Try {
                return t._resources === resources ? t : new Try(t._id, t._prefix, t._markers, resources, t._body, t._catches, t.__finally);
            }
            public get _finally(): JLeftPadded<Block> | null {
                return t.__finally;
            }
            public withFinally(_finally: JLeftPadded<Block> | null): Try {
                return t._finally === _finally ? t : new Try(t._id, t._prefix, t._markers, t._resources, t._body, t._catches, _finally);
            }
        }
    }

}

export class TryResource extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, variableDeclarations: TypedTree, terminatedWithSemicolon: boolean) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._variableDeclarations = variableDeclarations;
        this._terminatedWithSemicolon = terminatedWithSemicolon;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): TryResource {
        return id === this._id ? this : new TryResource(id, this._prefix, this._markers, this._variableDeclarations, this._terminatedWithSemicolon);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): TryResource {
        return prefix === this._prefix ? this : new TryResource(this._id, prefix, this._markers, this._variableDeclarations, this._terminatedWithSemicolon);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): TryResource {
        return markers === this._markers ? this : new TryResource(this._id, this._prefix, markers, this._variableDeclarations, this._terminatedWithSemicolon);
    }

    private readonly _variableDeclarations: TypedTree;

    public get variableDeclarations(): TypedTree {
        return this._variableDeclarations;
    }

    public withVariableDeclarations(variableDeclarations: TypedTree): TryResource {
        return variableDeclarations === this._variableDeclarations ? this : new TryResource(this._id, this._prefix, this._markers, variableDeclarations, this._terminatedWithSemicolon);
    }

    private readonly _terminatedWithSemicolon: boolean;

    public get terminatedWithSemicolon(): boolean {
        return this._terminatedWithSemicolon;
    }

    public withTerminatedWithSemicolon(terminatedWithSemicolon: boolean): TryResource {
        return terminatedWithSemicolon === this._terminatedWithSemicolon ? this : new TryResource(this._id, this._prefix, this._markers, this._variableDeclarations, terminatedWithSemicolon);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitTryResource(this, p);
    }

}

export class TryCatch extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, parameter: ControlParentheses<VariableDeclarations>, body: Block) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._parameter = parameter;
        this._body = body;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): TryCatch {
        return id === this._id ? this : new TryCatch(id, this._prefix, this._markers, this._parameter, this._body);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): TryCatch {
        return prefix === this._prefix ? this : new TryCatch(this._id, prefix, this._markers, this._parameter, this._body);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): TryCatch {
        return markers === this._markers ? this : new TryCatch(this._id, this._prefix, markers, this._parameter, this._body);
    }

    private readonly _parameter: ControlParentheses<VariableDeclarations>;

    public get parameter(): ControlParentheses<VariableDeclarations> {
        return this._parameter;
    }

    public withParameter(parameter: ControlParentheses<VariableDeclarations>): TryCatch {
        return parameter === this._parameter ? this : new TryCatch(this._id, this._prefix, this._markers, parameter, this._body);
    }

    private readonly _body: Block;

    public get body(): Block {
        return this._body;
    }

    public withBody(body: Block): TryCatch {
        return body === this._body ? this : new TryCatch(this._id, this._prefix, this._markers, this._parameter, body);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitCatch(this, p);
    }

}

export class TypeCast extends J implements Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, clazz: ControlParentheses<TypeTree>, expression: Expression) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._clazz = clazz;
        this._expression = expression;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): TypeCast {
        return id === this._id ? this : new TypeCast(id, this._prefix, this._markers, this._clazz, this._expression);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): TypeCast {
        return prefix === this._prefix ? this : new TypeCast(this._id, prefix, this._markers, this._clazz, this._expression);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): TypeCast {
        return markers === this._markers ? this : new TypeCast(this._id, this._prefix, markers, this._clazz, this._expression);
    }

    private readonly _clazz: ControlParentheses<TypeTree>;

    public get clazz(): ControlParentheses<TypeTree> {
        return this._clazz;
    }

    public withClazz(clazz: ControlParentheses<TypeTree>): TypeCast {
        return clazz === this._clazz ? this : new TypeCast(this._id, this._prefix, this._markers, clazz, this._expression);
    }

    private readonly _expression: Expression;

    public get expression(): Expression {
        return this._expression;
    }

    public withExpression(expression: Expression): TypeCast {
        return expression === this._expression ? this : new TypeCast(this._id, this._prefix, this._markers, this._clazz, expression);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitTypeCast(this, p);
    }

}

export class TypeParameter extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, annotations: Annotation[], modifiers: Modifier[], name: Expression, bounds: JContainer<TypeTree> | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._annotations = annotations;
        this._modifiers = modifiers;
        this._name = name;
        this._bounds = bounds;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): TypeParameter {
        return id === this._id ? this : new TypeParameter(id, this._prefix, this._markers, this._annotations, this._modifiers, this._name, this._bounds);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): TypeParameter {
        return prefix === this._prefix ? this : new TypeParameter(this._id, prefix, this._markers, this._annotations, this._modifiers, this._name, this._bounds);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): TypeParameter {
        return markers === this._markers ? this : new TypeParameter(this._id, this._prefix, markers, this._annotations, this._modifiers, this._name, this._bounds);
    }

    private readonly _annotations: Annotation[];

    public get annotations(): Annotation[] {
        return this._annotations;
    }

    public withAnnotations(annotations: Annotation[]): TypeParameter {
        return annotations === this._annotations ? this : new TypeParameter(this._id, this._prefix, this._markers, annotations, this._modifiers, this._name, this._bounds);
    }

    private readonly _modifiers: Modifier[];

    public get modifiers(): Modifier[] {
        return this._modifiers;
    }

    public withModifiers(modifiers: Modifier[]): TypeParameter {
        return modifiers === this._modifiers ? this : new TypeParameter(this._id, this._prefix, this._markers, this._annotations, modifiers, this._name, this._bounds);
    }

    private readonly _name: Expression;

    public get name(): Expression {
        return this._name;
    }

    public withName(name: Expression): TypeParameter {
        return name === this._name ? this : new TypeParameter(this._id, this._prefix, this._markers, this._annotations, this._modifiers, name, this._bounds);
    }

    private readonly _bounds: JContainer<TypeTree> | null;

    public get bounds(): TypeTree[] | null {
        return this._bounds === null ? null : this._bounds.elements;
    }

    public withBounds(bounds: TypeTree[] | null): TypeParameter {
        return this.padding.withBounds(JContainer.withElementsNullable(this._bounds, bounds));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitTypeParameter(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get bounds(): JContainer<TypeTree> | null {
                return t._bounds;
            }
            public withBounds(bounds: JContainer<TypeTree> | null): TypeParameter {
                return t._bounds === bounds ? t : new TypeParameter(t._id, t._prefix, t._markers, t._annotations, t._modifiers, t._name, bounds);
            }
        }
    }

}

export class TypeParameters extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, annotations: Annotation[], typeParameters: JRightPadded<TypeParameter>[]) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._annotations = annotations;
        this._typeParameters = typeParameters;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): TypeParameters {
        return id === this._id ? this : new TypeParameters(id, this._prefix, this._markers, this._annotations, this._typeParameters);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): TypeParameters {
        return prefix === this._prefix ? this : new TypeParameters(this._id, prefix, this._markers, this._annotations, this._typeParameters);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): TypeParameters {
        return markers === this._markers ? this : new TypeParameters(this._id, this._prefix, markers, this._annotations, this._typeParameters);
    }

    private readonly _annotations: Annotation[];

    public get annotations(): Annotation[] {
        return this._annotations;
    }

    public withAnnotations(annotations: Annotation[]): TypeParameters {
        return annotations === this._annotations ? this : new TypeParameters(this._id, this._prefix, this._markers, annotations, this._typeParameters);
    }

    private readonly _typeParameters: JRightPadded<TypeParameter>[];

    public get typeParameters(): TypeParameter[] {
        return JRightPadded.getElements(this._typeParameters);
    }

    public withTypeParameters(typeParameters: TypeParameter[]): TypeParameters {
        return this.padding.withTypeParameters(JRightPadded.withElements(this._typeParameters, typeParameters));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitTypeParameters(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get typeParameters(): JRightPadded<TypeParameter>[] {
                return t._typeParameters;
            }
            public withTypeParameters(typeParameters: JRightPadded<TypeParameter>[]): TypeParameters {
                return t._typeParameters === typeParameters ? t : new TypeParameters(t._id, t._prefix, t._markers, t._annotations, typeParameters);
            }
        }
    }

}

export class Unary extends J implements Statement, Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, operator: JLeftPadded<UnaryType>, expression: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._operator = operator;
        this._expression = expression;
        this.__type = _type;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Unary {
        return id === this._id ? this : new Unary(id, this._prefix, this._markers, this._operator, this._expression, this.__type);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Unary {
        return prefix === this._prefix ? this : new Unary(this._id, prefix, this._markers, this._operator, this._expression, this.__type);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Unary {
        return markers === this._markers ? this : new Unary(this._id, this._prefix, markers, this._operator, this._expression, this.__type);
    }

    private readonly _operator: JLeftPadded<UnaryType>;

    public get operator(): UnaryType {
        return this._operator.element;
    }

    public withOperator(operator: UnaryType): Unary {
        return this.padding.withOperator(JLeftPadded.withElement(this._operator, operator));
    }

    private readonly _expression: Expression;

    public get expression(): Expression {
        return this._expression;
    }

    public withExpression(expression: Expression): Unary {
        return expression === this._expression ? this : new Unary(this._id, this._prefix, this._markers, this._operator, expression, this.__type);
    }

    private readonly __type: JavaType | null;

    public get _type(): JavaType | null {
        return this.__type;
    }

    public withType(_type: JavaType | null): Unary {
        return _type === this.__type ? this : new Unary(this._id, this._prefix, this._markers, this._operator, this._expression, _type);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitUnary(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get operator(): JLeftPadded<UnaryType> {
                return t._operator;
            }
            public withOperator(operator: JLeftPadded<UnaryType>): Unary {
                return t._operator === operator ? t : new Unary(t._id, t._prefix, t._markers, operator, t._expression, t.__type);
            }
        }
    }

}

enum UnaryType {
    PreIncrement = 0,
    PreDecrement = 1,
    PostIncrement = 2,
    PostDecrement = 3,
    Positive = 4,
    Negative = 5,
    Complement = 6,
    Not = 7,

}

export class VariableDeclarations extends J implements Statement, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, leadingAnnotations: Annotation[], modifiers: Modifier[], typeExpression: TypeTree | null, varargs: Space | null, dimensionsBeforeName: JLeftPadded<Space>[], variables: JRightPadded<VariableDeclarationsNamedVariable>[]) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._leadingAnnotations = leadingAnnotations;
        this._modifiers = modifiers;
        this._typeExpression = typeExpression;
        this._varargs = varargs;
        this._dimensionsBeforeName = dimensionsBeforeName;
        this._variables = variables;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): VariableDeclarations {
        return id === this._id ? this : new VariableDeclarations(id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeExpression, this._varargs, this._dimensionsBeforeName, this._variables);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): VariableDeclarations {
        return prefix === this._prefix ? this : new VariableDeclarations(this._id, prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeExpression, this._varargs, this._dimensionsBeforeName, this._variables);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): VariableDeclarations {
        return markers === this._markers ? this : new VariableDeclarations(this._id, this._prefix, markers, this._leadingAnnotations, this._modifiers, this._typeExpression, this._varargs, this._dimensionsBeforeName, this._variables);
    }

    private readonly _leadingAnnotations: Annotation[];

    public get leadingAnnotations(): Annotation[] {
        return this._leadingAnnotations;
    }

    public withLeadingAnnotations(leadingAnnotations: Annotation[]): VariableDeclarations {
        return leadingAnnotations === this._leadingAnnotations ? this : new VariableDeclarations(this._id, this._prefix, this._markers, leadingAnnotations, this._modifiers, this._typeExpression, this._varargs, this._dimensionsBeforeName, this._variables);
    }

    private readonly _modifiers: Modifier[];

    public get modifiers(): Modifier[] {
        return this._modifiers;
    }

    public withModifiers(modifiers: Modifier[]): VariableDeclarations {
        return modifiers === this._modifiers ? this : new VariableDeclarations(this._id, this._prefix, this._markers, this._leadingAnnotations, modifiers, this._typeExpression, this._varargs, this._dimensionsBeforeName, this._variables);
    }

    private readonly _typeExpression: TypeTree | null;

    public get typeExpression(): TypeTree | null {
        return this._typeExpression;
    }

    public withTypeExpression(typeExpression: TypeTree | null): VariableDeclarations {
        return typeExpression === this._typeExpression ? this : new VariableDeclarations(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, typeExpression, this._varargs, this._dimensionsBeforeName, this._variables);
    }

    private readonly _varargs: Space | null;

    public get varargs(): Space | null {
        return this._varargs;
    }

    public withVarargs(varargs: Space | null): VariableDeclarations {
        return varargs === this._varargs ? this : new VariableDeclarations(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeExpression, varargs, this._dimensionsBeforeName, this._variables);
    }

    private readonly _dimensionsBeforeName: JLeftPadded<Space>[];

    public get dimensionsBeforeName(): JLeftPadded<Space>[] {
        return this._dimensionsBeforeName;
    }

    public withDimensionsBeforeName(dimensionsBeforeName: JLeftPadded<Space>[]): VariableDeclarations {
        return dimensionsBeforeName === this._dimensionsBeforeName ? this : new VariableDeclarations(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeExpression, this._varargs, dimensionsBeforeName, this._variables);
    }

    private readonly _variables: JRightPadded<VariableDeclarationsNamedVariable>[];

    public get variables(): VariableDeclarationsNamedVariable[] {
        return JRightPadded.getElements(this._variables);
    }

    public withVariables(variables: VariableDeclarationsNamedVariable[]): VariableDeclarations {
        return this.padding.withVariables(JRightPadded.withElements(this._variables, variables));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitVariableDeclarations(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get variables(): JRightPadded<VariableDeclarationsNamedVariable>[] {
                return t._variables;
            }
            public withVariables(variables: JRightPadded<VariableDeclarationsNamedVariable>[]): VariableDeclarations {
                return t._variables === variables ? t : new VariableDeclarations(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeExpression, t._varargs, t._dimensionsBeforeName, variables);
            }
        }
    }

}

export class VariableDeclarationsNamedVariable extends J implements NameTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, name: Identifier, dimensionsAfterName: JLeftPadded<Space>[], initializer: JLeftPadded<Expression> | null, variableType: JavaType.Variable | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._name = name;
        this._dimensionsAfterName = dimensionsAfterName;
        this._initializer = initializer;
        this._variableType = variableType;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): VariableDeclarationsNamedVariable {
        return id === this._id ? this : new VariableDeclarationsNamedVariable(id, this._prefix, this._markers, this._name, this._dimensionsAfterName, this._initializer, this._variableType);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): VariableDeclarationsNamedVariable {
        return prefix === this._prefix ? this : new VariableDeclarationsNamedVariable(this._id, prefix, this._markers, this._name, this._dimensionsAfterName, this._initializer, this._variableType);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): VariableDeclarationsNamedVariable {
        return markers === this._markers ? this : new VariableDeclarationsNamedVariable(this._id, this._prefix, markers, this._name, this._dimensionsAfterName, this._initializer, this._variableType);
    }

    private readonly _name: Identifier;

    public get name(): Identifier {
        return this._name;
    }

    public withName(name: Identifier): VariableDeclarationsNamedVariable {
        return name === this._name ? this : new VariableDeclarationsNamedVariable(this._id, this._prefix, this._markers, name, this._dimensionsAfterName, this._initializer, this._variableType);
    }

    private readonly _dimensionsAfterName: JLeftPadded<Space>[];

    public get dimensionsAfterName(): JLeftPadded<Space>[] {
        return this._dimensionsAfterName;
    }

    public withDimensionsAfterName(dimensionsAfterName: JLeftPadded<Space>[]): VariableDeclarationsNamedVariable {
        return dimensionsAfterName === this._dimensionsAfterName ? this : new VariableDeclarationsNamedVariable(this._id, this._prefix, this._markers, this._name, dimensionsAfterName, this._initializer, this._variableType);
    }

    private readonly _initializer: JLeftPadded<Expression> | null;

    public get initializer(): Expression | null {
        return this._initializer === null ? null : this._initializer.element;
    }

    public withInitializer(initializer: Expression | null): VariableDeclarationsNamedVariable {
        return this.padding.withInitializer(JLeftPadded.withElement(this._initializer, initializer));
    }

    private readonly _variableType: JavaType.Variable | null;

    public get variableType(): JavaType.Variable | null {
        return this._variableType;
    }

    public withVariableType(variableType: JavaType.Variable | null): VariableDeclarationsNamedVariable {
        return variableType === this._variableType ? this : new VariableDeclarationsNamedVariable(this._id, this._prefix, this._markers, this._name, this._dimensionsAfterName, this._initializer, variableType);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitVariable(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get initializer(): JLeftPadded<Expression> | null {
                return t._initializer;
            }
            public withInitializer(initializer: JLeftPadded<Expression> | null): VariableDeclarationsNamedVariable {
                return t._initializer === initializer ? t : new VariableDeclarationsNamedVariable(t._id, t._prefix, t._markers, t._name, t._dimensionsAfterName, initializer, t._variableType);
            }
        }
    }

}

export class WhileLoop extends J implements Loop {
    public constructor(id: UUID, prefix: Space, markers: Markers, condition: ControlParentheses<Expression>, body: JRightPadded<Statement>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._condition = condition;
        this._body = body;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): WhileLoop {
        return id === this._id ? this : new WhileLoop(id, this._prefix, this._markers, this._condition, this._body);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): WhileLoop {
        return prefix === this._prefix ? this : new WhileLoop(this._id, prefix, this._markers, this._condition, this._body);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): WhileLoop {
        return markers === this._markers ? this : new WhileLoop(this._id, this._prefix, markers, this._condition, this._body);
    }

    private readonly _condition: ControlParentheses<Expression>;

    public get condition(): ControlParentheses<Expression> {
        return this._condition;
    }

    public withCondition(condition: ControlParentheses<Expression>): WhileLoop {
        return condition === this._condition ? this : new WhileLoop(this._id, this._prefix, this._markers, condition, this._body);
    }

    private readonly _body: JRightPadded<Statement>;

    public get body(): Statement {
        return this._body.element;
    }

    public withBody(body: Statement): WhileLoop {
        return this.padding.withBody(JRightPadded.withElement(this._body, body));
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitWhileLoop(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get body(): JRightPadded<Statement> {
                return t._body;
            }
            public withBody(body: JRightPadded<Statement>): WhileLoop {
                return t._body === body ? t : new WhileLoop(t._id, t._prefix, t._markers, t._condition, body);
            }
        }
    }

}

export class Wildcard extends J implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, bound: JLeftPadded<WildcardBound> | null, boundedType: NameTree | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._bound = bound;
        this._boundedType = boundedType;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Wildcard {
        return id === this._id ? this : new Wildcard(id, this._prefix, this._markers, this._bound, this._boundedType);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Wildcard {
        return prefix === this._prefix ? this : new Wildcard(this._id, prefix, this._markers, this._bound, this._boundedType);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Wildcard {
        return markers === this._markers ? this : new Wildcard(this._id, this._prefix, markers, this._bound, this._boundedType);
    }

    private readonly _bound: JLeftPadded<WildcardBound> | null;

    public get bound(): WildcardBound | null {
        return this._bound === null ? null : this._bound.element;
    }

    public withBound(bound: WildcardBound | null): Wildcard {
        return this.padding.withBound(JLeftPadded.withElement(this._bound, bound));
    }

    private readonly _boundedType: NameTree | null;

    public get boundedType(): NameTree | null {
        return this._boundedType;
    }

    public withBoundedType(boundedType: NameTree | null): Wildcard {
        return boundedType === this._boundedType ? this : new Wildcard(this._id, this._prefix, this._markers, this._bound, boundedType);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitWildcard(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get bound(): JLeftPadded<WildcardBound> | null {
                return t._bound;
            }
            public withBound(bound: JLeftPadded<WildcardBound> | null): Wildcard {
                return t._bound === bound ? t : new Wildcard(t._id, t._prefix, t._markers, bound, t._boundedType);
            }
        }
    }

}

enum WildcardBound {
    Extends = 0,
    Super = 1,

}

export class Yield extends J implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, implicit: boolean, value: Expression) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._implicit = implicit;
        this._value = value;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Yield {
        return id === this._id ? this : new Yield(id, this._prefix, this._markers, this._implicit, this._value);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Yield {
        return prefix === this._prefix ? this : new Yield(this._id, prefix, this._markers, this._implicit, this._value);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Yield {
        return markers === this._markers ? this : new Yield(this._id, this._prefix, markers, this._implicit, this._value);
    }

    private readonly _implicit: boolean;

    public get implicit(): boolean {
        return this._implicit;
    }

    public withImplicit(implicit: boolean): Yield {
        return implicit === this._implicit ? this : new Yield(this._id, this._prefix, this._markers, implicit, this._value);
    }

    private readonly _value: Expression;

    public get value(): Expression {
        return this._value;
    }

    public withValue(value: Expression): Yield {
        return value === this._value ? this : new Yield(this._id, this._prefix, this._markers, this._implicit, value);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitYield(this, p);
    }

}

export class Unknown extends J implements Statement, Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, source: UnknownSource) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._source = source;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Unknown {
        return id === this._id ? this : new Unknown(id, this._prefix, this._markers, this._source);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): Unknown {
        return prefix === this._prefix ? this : new Unknown(this._id, prefix, this._markers, this._source);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Unknown {
        return markers === this._markers ? this : new Unknown(this._id, this._prefix, markers, this._source);
    }

    private readonly _source: UnknownSource;

    public get source(): UnknownSource {
        return this._source;
    }

    public withSource(source: UnknownSource): Unknown {
        return source === this._source ? this : new Unknown(this._id, this._prefix, this._markers, source);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitUnknown(this, p);
    }

}

export class UnknownSource extends J {
    public constructor(id: UUID, prefix: Space, markers: Markers, text: string) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._text = text;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): UnknownSource {
        return id === this._id ? this : new UnknownSource(id, this._prefix, this._markers, this._text);
    }

    private readonly _prefix: Space;

    public get prefix(): Space {
        return this._prefix;
    }

    public withPrefix(prefix: Space): UnknownSource {
        return prefix === this._prefix ? this : new UnknownSource(this._id, prefix, this._markers, this._text);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): UnknownSource {
        return markers === this._markers ? this : new UnknownSource(this._id, this._prefix, markers, this._text);
    }

    private readonly _text: string;

    public get text(): string {
        return this._text;
    }

    public withText(text: string): UnknownSource {
        return text === this._text ? this : new UnknownSource(this._id, this._prefix, this._markers, text);
    }

    public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
        return v.visitUnknownSource(this, p);
    }

}
