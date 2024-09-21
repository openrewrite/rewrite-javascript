import {LstType, Markers, SourceFile, Tree, TreeVisitor, UUID} from "../core";
import {JavaType} from "./types";
import {JavaVisitor} from "./visitor";

export {JavaType} from "./types";

export interface J extends Tree {
    get prefix(): Space;

    withPrefix(prefix: Space): J;

    get id(): UUID;

    withId(id: UUID): J;

    get markers(): Markers;

    withMarkers(markers: Markers): J;

    isAcceptable<P>(v: TreeVisitor<Tree, P>, p: P): boolean;

    accept<R extends Tree, P>(v: TreeVisitor<R, P>, p: P): R | null;

    acceptJava<P>(v: JavaVisitor<P>, p: P): J | null;
}

type Constructor<T = {}> = new (...args: any[]) => T;

export function isJava(tree: any & Tree): tree is J {
    return !!tree.constructor.isJava;
}

export function JMixin<TBase extends Constructor<Object>>(Base: TBase) {
    abstract class JMixed extends Base implements J {
        static isJava = true;

        abstract get prefix(): Space;

        abstract withPrefix(prefix: Space): J;

        abstract get id(): UUID;

        abstract withId(id: UUID): J;

        abstract get markers(): Markers;

        abstract withMarkers(markers: Markers): J;

        public isAcceptable<P>(v: TreeVisitor<Tree, P>, p: P): boolean {
            return v.isAdaptableTo(JavaVisitor);
        }

        public accept<R extends Tree, P>(v: TreeVisitor<R, P>, p: P): R | null {
            return this.acceptJava(v.adapt(JavaVisitor), p) as unknown as R | null;
        }

        public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
            return v.defaultValue(this, p) as J | null;
        }
    }

    return JMixed;
}

export interface JavaSourceFile extends SourceFile {
}

export interface Expression extends J {
    get type(): JavaType | null;

    withType(type: JavaType | null): TypedTree;
}

export interface Statement extends J {
}

export interface Loop extends Statement {
}

export interface MethodCall extends Expression {
}

export interface NameTree extends TypedTree {
}

export interface TypeTree extends NameTree {
}

export interface TypedTree extends J {
    get type(): JavaType | null;

    withType(type: JavaType | null): TypedTree;
}

@LstType("org.openrewrite.java.tree.Space")
export class Space {
    static readonly EMPTY: Space = new Space([], '');
    static readonly SINGLE_SPACE: Space = new Space([], ' ');

    private readonly _comments: Comment[];
    private readonly _whitespace: string | null;

    static build(comments: Comment[], whitespace: string | null): Space {
        if (comments.length == 0) {
            if (whitespace == '') {
                return Space.EMPTY;
            } else if (whitespace == ' ') {
                return Space.SINGLE_SPACE;
            }
        }
        return new Space(comments, whitespace);
    }

    public constructor(comments: Comment[], whitespace: string | null) {
        this._comments = comments;
        this._whitespace = whitespace;
    }

    get comments(): Comment[] {
        return this._comments;
    }

    withComments(comments: Comment[]): Space {
        return Space.build(comments, this._whitespace);
    }

    get whitespace(): string | null {
        return this._whitespace;
    }

    withWhitespace(whitespace: string | null): Space {
        return Space.build(this.comments, whitespace);
    }
}

export interface Comment {
    get multiline(): boolean;

    get suffix(): string;

    withSuffix(suffix: string): Comment;

    get markers(): Markers;

    withMarkers(markers: Markers): Comment;
}

@LstType("org.openrewrite.java.tree.TextComment")
export class TextComment implements Comment {
    private readonly _multiline: boolean;
    private readonly _text: string;
    private readonly _suffix: string;
    private readonly _markers: Markers;

    constructor(multiline: boolean, text: string, suffix: string, markers: Markers) {
        this._multiline = multiline;
        this._text = text;
        this._suffix = suffix;
        this._markers = markers;
    }

    get multiline(): boolean {
        return this._multiline;
    }

    withMultiline(multiline: boolean): TextComment {
        return new TextComment(multiline, this._text, this._suffix, this._markers);
    }

    get text(): string {
        return this._text;
    }

    withText(text: string): TextComment {
        return new TextComment(this._multiline, text, this._suffix, this._markers);
    }

    get suffix(): string {
        return this._suffix;
    }

    withSuffix(suffix: string): TextComment {
        return new TextComment(this._multiline, this._text, suffix, this._markers);
    }

    get markers(): Markers {
        return this._markers;
    }

    withMarkers(markers: Markers): TextComment {
        return new TextComment(this._multiline, this._text, this._suffix, markers);
    }
}

@LstType("org.openrewrite.java.tree.JRightPadded")
export class JRightPadded<T> {
    constructor(element: T, after: Space, markers: Markers) {
        this._element = element;
        this._after = after;
        this._markers = markers;
    }

    static withElements<T>(before: JRightPadded<T>[], elements: T[]): JRightPadded<T>[] {
        // a cheaper check for the most common case when there are no changes
        if (elements.length === before.length) {
            let hasChanges = false;
            for (let i = 0; i < before.length; i++) {
                if (before[i].element !== elements[i]) {
                    hasChanges = true;
                    break;
                }
            }

            if (!hasChanges) {
                return before;
            }
        } else if (elements.length === 0) {
            return [];
        }

        let after: JRightPadded<T>[] = new Array(elements.length);
        let beforeById = new Map<UUID, JRightPadded<T>>();

        for (let j of before) {
            if (beforeById.has((j.element as J).id)) {
                throw new Error("Duplicate key");
            }
            beforeById.set((j.element as J).id, j);
        }

        for (let t of elements) {
            after.push(beforeById.has((t as J).id)
                ? beforeById.get((t as J).id)!.withElement(t)
                : new JRightPadded(t, Space.EMPTY, Markers.EMPTY));
        }

        return after;
    }

    static withElement<T>(before: JRightPadded<T> | null, element: T | null): JRightPadded<T> | null {
        if (element === null)
            return null;

        return before == null ? new JRightPadded(element, Space.EMPTY, Markers.EMPTY) : before.withElement(element);
    }

    static getElements<T>(ls: JRightPadded<T>[]) {
        if (ls === null) {
            return [];
        }

        let list: T[] = new Array<T>(ls.length);

        for (let l of ls) {
            if (l === null) {
                continue;
            }

            let elem = l.element;
            list.push(elem);
        }

        return list;
    }

    private readonly _element: T;

    get element(): T {
        return this._element;
    }

    public withElement(element: T): JRightPadded<T> {
        return element === this._element ? this : new JRightPadded<T>(element, this._after, this._markers);
    }

    private readonly _after: Space;

    get after(): Space {
        return this._after;
    }

    public withAfter(after: Space): JRightPadded<T> {
        return after === this._after ? this : new JRightPadded<T>(this._element, after, this._markers);
    }

    private readonly _markers: Markers;

    get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): JRightPadded<T> {
        return markers === this._markers ? this : new JRightPadded<T>(this._element, this._after, markers);
    }
}

@LstType("org.openrewrite.java.tree.JLeftPadded")
export class JLeftPadded<T> {
    constructor(before: Space, element: T, markers: Markers) {
        this._before = before;
        this._element = element;
        this._markers = markers;
    }

    static withElement<T>(before: JLeftPadded<T> | null, element: T | null): JLeftPadded<T> | null {
        if (element == null) return null;
        if (before == null) return new JLeftPadded<T>(Space.EMPTY, element, Markers.EMPTY);
        return before.withElement(element);
    }

    private readonly _before: Space;

    get before(): Space {
        return this._before;
    }

    withBefore(before: Space): JLeftPadded<T> {
        return before === this._before ? this : new JLeftPadded<T>(before, this._element, this._markers);
    }

    private readonly _element: T;

    public get element(): T {
        return this._element;
    }

    withElement(element: T): JLeftPadded<T> {
        return element === this._element ? this : new JLeftPadded<T>(this._before, element, this._markers);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    withMarkers(markers: Markers): JLeftPadded<T> {
        return markers === this._markers ? this : new JLeftPadded<T>(this._before, this._element, markers);
    }
}

@LstType("org.openrewrite.java.tree.JContainer")
export class JContainer<T> {
    constructor(before: Space, elements: JRightPadded<T>[], markers: Markers) {
        this._before = before;
        this._elements = elements;
        this._markers = markers;
    }

    static build<J2>(before: Space, elements: JRightPadded<J2>[], markers: Markers): JContainer<J2> {
        return new JContainer(before, elements, markers);
    }

    static withElements<J2>(before: JContainer<J2>, elements: J2[]): JContainer<J2> {
        if (elements == null) return before.padding.withElements([]);

        return before.padding.withElements(JRightPadded.withElements(before._elements, elements));
    }

    static withElementsNullable<T>(before: JContainer<T> | null, elements: T[] | null): JContainer<T> | null {
        if (elements == null || elements.length == 0)
            return null;

        if (before == null)
            return JContainer.build(Space.EMPTY, JRightPadded.withElements([], elements as J[]), Markers.EMPTY) as JContainer<T>;

        return before.padding.withElements(JRightPadded.withElements(before._elements as JRightPadded<J>[], elements as J[]) as JRightPadded<T>[]);
    }

    private readonly _before: Space;

    get before(): Space {
        return this._before;
    }

    withBefore(before: Space): JContainer<T> {
        return before === this._before ? this : new JContainer<T>(before, this._elements, this._markers);
    }

    private readonly _elements: JRightPadded<T>[];

    get elements(): T[] {
        return [];
    }

    private readonly _markers: Markers;

    get markers(): Markers {
        return this._markers;
    }

    withMarkers(markers: Markers): JContainer<T> {
        return markers === this._markers ? this : new JContainer<T>(this._before, this._elements, markers);
    }

    get padding() {
        const t = this;
        return new class {
            public get elements(): JRightPadded<T>[] {
                return t._elements;
            }

            public withElements(elements: JRightPadded<T>[]): JContainer<T> {
                return t._elements === elements ? t : new JContainer<T>(t._before, elements, t._markers);
            }
        }
    }
}

export namespace Space {
    export enum Location {
        ANY,
        ANNOTATED_TYPE_PREFIX,
        ANNOTATION_ARGUMENTS,
        ANNOTATION_ARGUMENT_SUFFIX,
        ANNOTATIONS,
        ANNOTATION_PREFIX,
        ARRAY_ACCESS_PREFIX,
        ARRAY_INDEX_SUFFIX,
        ARRAY_TYPE_PREFIX,
        ASSERT_PREFIX,
        ASSERT_DETAIL,
        ASSERT_DETAIL_PREFIX,
        ASSIGNMENT,
        ASSIGNMENT_OPERATION_PREFIX,
        ASSIGNMENT_OPERATION_OPERATOR,
        ASSIGNMENT_PREFIX,
        BINARY_OPERATOR,
        BINARY_PREFIX,
        BLOCK_END,
        BLOCK_PREFIX,
        BLOCK_STATEMENT_SUFFIX,
        BREAK_PREFIX,
        CASE,
        CASE_PREFIX,
        CASE_BODY,
        CASE_EXPRESSION,
        CASE_SUFFIX,
        CATCH_ALTERNATIVE_SUFFIX,
        CATCH_PREFIX,
        CLASS_DECLARATION_PREFIX,
        CLASS_KIND,
        COMPILATION_UNIT_EOF,
        COMPILATION_UNIT_PREFIX,
        CONTINUE_PREFIX,
        CONTROL_PARENTHESES_PREFIX,
        DIMENSION_PREFIX,
        DIMENSION,
        DIMENSION_SUFFIX,
        DO_WHILE_PREFIX,
        ELSE_PREFIX,
        EMPTY_PREFIX,
        ENUM_VALUE_PREFIX,
        ENUM_VALUE_SET_PREFIX,
        ENUM_VALUE_SUFFIX,
        EXPRESSION_PREFIX,
        EXTENDS,
        FIELD_ACCESS_NAME,
        FIELD_ACCESS_PREFIX,
        FOREACH_ITERABLE_SUFFIX,
        FOREACH_VARIABLE_SUFFIX,
        FOR_BODY_SUFFIX,
        FOR_CONDITION_SUFFIX,
        FOR_CONTROL_PREFIX,
        FOR_EACH_CONTROL_PREFIX,
        FOR_EACH_LOOP_PREFIX,
        FOR_INIT_SUFFIX,
        FOR_PREFIX,
        FOR_UPDATE_SUFFIX,
        IDENTIFIER_PREFIX,
        IF_ELSE_SUFFIX,
        IF_PREFIX,
        IF_THEN_SUFFIX,
        IMPLEMENTS,
        IMPORT_ALIAS_PREFIX,
        PERMITS,
        IMPLEMENTS_SUFFIX,
        IMPORT_PREFIX,
        IMPORT_SUFFIX,
        INSTANCEOF_PREFIX,
        INSTANCEOF_SUFFIX,
        INTERSECTION_TYPE_PREFIX,
        LABEL_PREFIX,
        LABEL_SUFFIX,
        LAMBDA_ARROW_PREFIX,
        LAMBDA_PARAMETER,
        LAMBDA_PARAMETERS_PREFIX,
        LAMBDA_PREFIX,
        LANGUAGE_EXTENSION,
        LITERAL_PREFIX,
        MEMBER_REFERENCE_CONTAINING,
        MEMBER_REFERENCE_NAME,
        MEMBER_REFERENCE_PREFIX,
        METHOD_DECLARATION_PARAMETERS,
        METHOD_DECLARATION_PARAMETER_SUFFIX,
        METHOD_DECLARATION_DEFAULT_VALUE,
        METHOD_DECLARATION_PREFIX,
        METHOD_INVOCATION_ARGUMENTS,
        METHOD_INVOCATION_ARGUMENT_SUFFIX,
        METHOD_INVOCATION_NAME,
        METHOD_INVOCATION_PREFIX,
        METHOD_SELECT_SUFFIX,
        MODIFIER_PREFIX,
        MULTI_CATCH_PREFIX,
        NAMED_VARIABLE_SUFFIX,
        NEW_ARRAY_INITIALIZER,
        NEW_ARRAY_INITIALIZER_SUFFIX,
        NEW_ARRAY_PREFIX,
        NEW_CLASS_ARGUMENTS,
        NEW_CLASS_ARGUMENTS_SUFFIX,
        NEW_CLASS_ENCLOSING_SUFFIX,
        NEW_CLASS_PREFIX,
        NEW_PREFIX,
        NULLABLE_TYPE_PREFIX,
        NULLABLE_TYPE_SUFFIX,
        PACKAGE_PREFIX,
        PACKAGE_SUFFIX,
        PARAMETERIZED_TYPE_PREFIX,
        PARENTHESES_PREFIX,
        PARENTHESES_SUFFIX,
        PERMITS_SUFFIX,
        PRIMITIVE_PREFIX,
        RECORD_STATE_VECTOR,
        RECORD_STATE_VECTOR_SUFFIX,
        RETURN_PREFIX,
        STATEMENT_PREFIX,
        STATIC_IMPORT,
        STATIC_INIT_SUFFIX,
        SWITCH_PREFIX,
        SWITCH_EXPRESSION_PREFIX,
        SYNCHRONIZED_PREFIX,
        TERNARY_FALSE,
        TERNARY_PREFIX,
        TERNARY_TRUE,
        THROWS,
        THROWS_SUFFIX,
        THROW_PREFIX,
        TRY_FINALLY,
        TRY_PREFIX,
        TRY_RESOURCE,
        TRY_RESOURCES,
        TRY_RESOURCE_SUFFIX,
        TYPE_BOUNDS,
        TYPE_BOUND_SUFFIX,
        TYPE_CAST_PREFIX,
        TYPE_PARAMETERS,
        TYPE_PARAMETERS_PREFIX,
        TYPE_PARAMETER_SUFFIX,
        UNARY_OPERATOR,
        UNARY_PREFIX,
        UNKNOWN_PREFIX,
        UNKNOWN_SOURCE_PREFIX,
        VARARGS,
        VARIABLE_DECLARATIONS_PREFIX,
        VARIABLE_INITIALIZER,
        VARIABLE_PREFIX,
        WHILE_BODY_SUFFIX,
        WHILE_CONDITION,
        WHILE_PREFIX,
        WILDCARD_BOUND,
        WILDCARD_PREFIX,
        YIELD_PREFIX,
    }
}

export namespace JRightPadded {
    export enum Location {
        ANNOTATION_ARGUMENT,
        ARRAY_INDEX,
        BLOCK_STATEMENT,
        CASE,
        CASE_BODY,
        CASE_EXPRESSION,
        CATCH_ALTERNATIVE,
        CONTROL_PARENTHESES_TREE,
        DIMENSION,
        ENUM_VALUE,
        FOREACH_ITERABLE,
        FOREACH_VARIABLE,
        FOR_BODY,
        FOR_CONDITION,
        FOR_INIT,
        FOR_UPDATE,
        IF_ELSE,
        IF_THEN,
        IMPLEMENTS,
        IMPORT,
        INSTANCEOF,
        LABEL,
        LAMBDA_PARAM,
        LANGUAGE_EXTENSION,
        MEMBER_REFERENCE_CONTAINING,
        METHOD_DECLARATION_PARAMETER,
        METHOD_INVOCATION_ARGUMENT,
        METHOD_SELECT,
        NAMED_VARIABLE,
        NEW_ARRAY_INITIALIZER,
        NEW_CLASS_ARGUMENTS,
        NEW_CLASS_ENCLOSING,
        NULLABLE,
        PACKAGE,
        PARENTHESES,
        PERMITS,
        RECORD_STATE_VECTOR,
        STATIC_INIT,
        THROWS,
        TRY_RESOURCE,
        TYPE_BOUND,
        TYPE_PARAMETER,
        WHILE_BODY,
    }

    export namespace Location {
        export function afterLocation(location: Location): Space.Location {
            // FIXME
            return null!;
        }
    }
}

export namespace JLeftPadded {
    export enum Location {
        ASSERT_DETAIL,
        ASSIGNMENT,
        ASSIGNMENT_OPERATION_OPERATOR,
        BINARY_OPERATOR,
        CLASS_KIND,
        EXTENDS,
        FIELD_ACCESS_NAME,
        IMPORT_ALIAS_PREFIX,
        LANGUAGE_EXTENSION,
        MEMBER_REFERENCE_NAME,
        METHOD_DECLARATION_DEFAULT_VALUE,
        STATIC_IMPORT,
        TERNARY_TRUE,
        TERNARY_FALSE,
        TRY_FINALLY,
        UNARY_OPERATOR,
        VARIABLE_INITIALIZER,
        WHILE_CONDITION,
        WILDCARD_BOUND,
    }

    export namespace Location {
        export function beforeLocation(location: Location): Space.Location {
            // FIXME
            return null!;
        }
    }
}

export namespace JContainer {
    export enum Location {
        ANNOTATION_ARGUMENTS,
        CASE,
        CASE_EXPRESSION,
        IMPLEMENTS,
        PERMITS,
        LANGUAGE_EXTENSION,
        METHOD_DECLARATION_PARAMETERS,
        METHOD_INVOCATION_ARGUMENTS,
        NEW_ARRAY_INITIALIZER,
        NEW_CLASS_ARGUMENTS,
        RECORD_STATE_VECTOR,
        THROWS,
        TRY_RESOURCES,
        TYPE_BOUNDS,
        TYPE_PARAMETERS,
    }

    export namespace Location {
        export function beforeLocation(location: Location): Space.Location {
            // FIXME
            return null!;
        }

        export function elementLocation(location: Location): JRightPadded.Location {
            // FIXME
            return null!;
        }
    }
}