import {SourceFile, Tree} from "../core";

export interface JavaSourceFile extends SourceFile {
}

export interface Expression extends Tree {
}

export interface Statement extends Tree {
}

export interface Loop extends Statement {
}

export interface MethodCall extends Expression {
}

export interface NameTree extends TypedTree {
}

export interface TypeTree extends NameTree {
}

export interface JavaType {
}

export namespace JavaType {
    export abstract class FullyQualified implements JavaType {
    }
    export abstract class Class extends FullyQualified {
    }
    export abstract class Parameterized extends FullyQualified {
    }
    export class Primitive implements JavaType {
    }
    export class Variable implements JavaType {
    }
    export class Method implements JavaType {
    }
}

export interface TypedTree extends Tree {
    get type(): JavaType | null;
    withType(type: JavaType | null): TypedTree;
}

export class Space {
}

export class TextComment {
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

export class Comment {
}

export class JRightPadded<T> {
    constructor(element: T) {
        this._element = element;
    }

    private readonly _element: T;

    get element(): T {
        return this._element;
    }

    static getElements<T>(padded: JRightPadded<T>[]) {
        return [];
    }

    static withElements<T>(padded: JRightPadded<T>[], elements: T[]) {
        return [];
    }

    static withElement<T>(padded: JRightPadded<T> | null, element: T | null): JRightPadded<T> {
        return padded!;
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
}

export class JLeftPadded<T> {
    private _before: Space;
    element: T;

    withElement<T>(element: T | null): JLeftPadded<T> {
        return null;
    }

    static withElement<T>(left: JLeftPadded<T> | null, element: T | null): JLeftPadded<T> {
        return null;
    }

    get before(): Space {
        return this._before;
    }

    withBefore(before: Space): JLeftPadded<T> {
        // FIXME
        return this;
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
}

export class JContainer<T> {
    private _elements: JRightPadded<T>[];
    get elements(): T[] {
        return [];
    }
    static withElementsNullable<T>(__arguments: JContainer<T> | null, _arguments: T[] | null): JContainer<T> {
        return undefined;
    }

    static withElements<T>(container: JContainer<Expression> | null, elements: T[]): JContainer<T> {
        return undefined;
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
}