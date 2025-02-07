import * as extensions from "./extensions";
import {JavaVisitor} from "../../java";
import {Expression, J, JavaType, Space, Statement} from "../../java/tree";
import {LstType, Markers, Tree, TreeVisitor, UUID} from "../../core";
import {JavaScriptVisitor} from "../visitor";

export interface JS extends J {
    get id(): UUID;

    withId(id: UUID): JS;

    get markers(): Markers;

    withMarkers(markers: Markers): JS;

    isAcceptable<P>(v: TreeVisitor<Tree, P>, p: P): boolean;

    accept<R extends Tree, P>(v: TreeVisitor<R, P>, p: P): R | null;

    acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null;
}

type Constructor<T = {}> = new (...args: any[]) => T;

export function isJavaScript(tree: any): tree is JS {
    return !!tree.constructor.isJavaScript || !!tree.isJavaScript;
}

export function JSMixin<TBase extends Constructor<Object>>(Base: TBase) {
    abstract class JSMixed extends Base implements JS {
        static isTree = true;
        static isJava = true;
        static isJavaScript = true;

        abstract get prefix(): Space;

        abstract withPrefix(prefix: Space): JS;

        abstract get id(): UUID;

        abstract withId(id: UUID): JS;

        abstract get markers(): Markers;

        abstract withMarkers(markers: Markers): JS;

        public isAcceptable<P>(v: TreeVisitor<Tree, P>, p: P): boolean {
            return v.isAdaptableTo(JavaScriptVisitor);
        }

        public accept<R extends Tree, P>(v: TreeVisitor<R, P>, p: P): R | null {
            return this.acceptJavaScript(v.adapt(JavaScriptVisitor), p) as unknown as R | null;
        }

        public acceptJava<P>(v: JavaVisitor<P>, p: P): J | null {
            return v.defaultValue(this, p) as J | null;
        }

        public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
            return v.defaultValue(this, p) as J | null;
        }
    }

    return JSMixed;
}

@LstType("org.openrewrite.javascript.tree.JS$ExpressionStatement")
export class ExpressionStatement extends JSMixin(Object) implements Expression, Statement {
    public constructor(id: UUID, expression: Expression) {
        super();
        this._id = id;
        this._expression = expression;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): ExpressionStatement {
        return id === this._id ? this : new ExpressionStatement(id, this._expression);
    }

    public get prefix(): Space {
        return this._expression.prefix;
    }

    public withPrefix(prefix: Space): ExpressionStatement {
        return this.withExpression(this._expression.withPrefix(prefix) as Expression);
    }

    public get markers(): Markers {
        return this._expression.markers;
    }

    public withMarkers(markers: Markers): ExpressionStatement {
        return this.withExpression(this._expression.withMarkers(markers) as Expression);
    }

    private readonly _expression: Expression;

    public get expression(): Expression {
        return this._expression;
    }

    public withExpression(expression: Expression): ExpressionStatement {
        return expression === this._expression ? this : new ExpressionStatement(this._id, expression);
    }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitExpressionStatement(this, p);
    }

    public get type(): JavaType | null {
        return extensions.getJavaType(this);
    }

    public withType(type: JavaType): ExpressionStatement {
        return extensions.withJavaType(this, type);
    }

}

@LstType("org.openrewrite.javascript.tree.JS$StatementExpression")
export class StatementExpression extends JSMixin(Object) implements Expression, Statement {
    public constructor(id: UUID, statement: Statement) {
        super();
        this._id = id;
        this._statement = statement;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): StatementExpression {
        return id === this._id ? this : new StatementExpression(id, this._statement);
    }

    public get prefix(): Space {
        return this._statement.prefix;
    }

    public withPrefix(prefix: Space): StatementExpression {
        return this.withStatement(this._statement.withPrefix(prefix) as Statement);
    }

    public get markers(): Markers {
        return this._statement.markers;
    }

    public withMarkers(markers: Markers): StatementExpression {
        return this.withStatement(this._statement.withMarkers(markers));
    }

    private readonly _statement: Statement;

    public get statement(): Statement {
        return this._statement;
    }

    public withStatement(statement: Statement): StatementExpression {
        return statement === this._statement ? this : new StatementExpression(this._id, statement);
    }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitStatementExpression(this, p);
    }

    public get type(): JavaType | null {
        return extensions.getJavaType(this);
    }

    public withType(type: JavaType): StatementExpression {
        return extensions.withJavaType(this, type);
    }

}

export namespace JsSpace {
    export enum Location {
        ALIAS_PREFIX,
        ARROW_FUNCTION_ARROW,
        ARROW_FUNCTION_PREFIX,
        AWAIT_PREFIX,
        DEFAULT_TYPE_BEFORE_EQUALS,
        DEFAULT_TYPE_PREFIX,
        DELETE_PREFIX,
        EXPORT_FROM,
        EXPORT_PREFIX,
        FUNCTION_TYPE_ARROW,
        FUNCTION_TYPE_PREFIX,
        JS_BINARY_PREFIX,
        JS_IMPORT_FROM,
        JS_IMPORT_PREFIX,
        JS_IMPORT_IMPORT_TYPE_PREFIX,
        JS_IMPORT_SPECIFIER_PREFIX,
        JS_IMPORT_SPECIFIER_IMPORT_TYPE_PREFIX,
        OBJECT_BINDING_DECLARATIONS_BINDING_AFTER_VARARG,
        BINDING_ELEMENT_PREFIX,
        OBJECT_BINDING_DECLARATIONS_PREFIX,
        PROPERTY_ASSIGNMENT_PREFIX,
        SCOPED_VARIABLE_DECLARATIONS_PREFIX,
        SCOPED_VARIABLE_DECLARATIONS_SCOPE_PREFIX,
        TEMPLATE_EXPRESSION_PREFIX,
        TEMPLATE_EXPRESSION_VALUE_AFTER,
        TEMPLATE_EXPRESSION_VALUE_PREFIX,
        TUPLE_PREFIX,
        TYPE_DECLARATION_PREFIX,
        TYPE_DECLARATION_NAME_PREFIX,
        TYPE_OF_PREFIX,
        TYPE_OPERATOR_PREFIX,
        UNARY_PREFIX,
        UNION_PREFIX,
        VOID_PREFIX,
        YIELD_PREFIX,
        TYPE_INFO_PREFIX,
        JSVARIABLE_DECLARATIONS_PREFIX,
        JSVARIABLE_DECLARATIONS_VARARGS,
        JSVARIABLE_DECLARATIONS_JSNAMED_VARIABLE_PREFIX,
        NAMESPACE_DECLARATION_PREFIX,
        JSMETHOD_DECLARATION_PREFIX,
        FUNCTION_DECLARATION_PREFIX,
        INTERSECTION_PREFIX,
        TYPE_LITERAL_PREFIX,
        TYPE_LITERAL_MEMBERS_PREFIX,
        TYPE_LITERAL_MEMBERS_SUFFIX,
        INDEX_SIGNATURE_DECLARATION_PREFIX,
        INDEX_SIGNATURE_DECLARATION_PARAMETERS_PREFIX,
        INDEX_SIGNATURE_DECLARATION_PARAMETERS_SUFFIX,
        INDEX_SIGNATURE_DECLARATION_TYPE_EXPRESSION_PREFIX,
        JSFOR_OF_LOOP_PREFIX,
        JSFOR_IN_LOOP_PREFIX,
        JSFOR_IN_OF_LOOP_CONTROL_PREFIX,
        TYPE_QUERY_PREFIX,
        ARRAY_BINDING_PATTERN_PREFIX,
        EXPRESSION_WITH_TYPE_ARGUMENTS_PREFIX,
        TEMPLATE_EXPRESSION_TEMPLATE_SPAN_PREFIX,
        TAGGED_TEMPLATE_EXPRESSION_PREFIX,
        CONDITIONAL_TYPE_PREFIX,
        INFER_TYPE_PREFIX,
        TYPE_PREDICATE_PREFIX,
        LITERAL_TYPE_PREFIX,
        SATISFIES_EXPRESSION_PREFIX,
        IMPORT_TYPE_PREFIX,
        EXPORT_DECLARATION_PREFIX,
        EXPORT_DECLARATION_TYPE_ONLY_PREFIX,
        EXPORT_SPECIFIER_PREFIX,
        NAMED_EXPORTS_PREFIX,
        EXPORT_ASSIGNMENT_PREFIX,
        INDEXED_ACCESS_TYPE_PREFIX,
        INDEXED_ACCESS_TYPE_INDEX_TYPE_PREFIX,
        INDEXED_ACCESS_TYPE_INDEX_TYPE_SUFFIX,
        INDEXED_ACCESS_TYPE_INDEX_TYPE_ELEMENT_SUFFIX,
        JS_ASSIGNMENT_OPERATION_PREFIX,
        MAPPED_TYPE_PREFIX,
        MAPPED_TYPE_KEYS_REMAPPING_PREFIX,
        MAPPED_TYPE_MAPPED_TYPE_PARAMETER_PREFIX,
        TYPE_TREE_EXPRESSION_PREFIX,
        TRAILING_TOKEN_STATEMENT_PREFIX,
        JSTRY_PREFIX,
        JSTRY_JSCATCH_PREFIX,
        WITH_STATEMENT_PREFIX,
        IMPORT_ATTRIBUTE_PREFIX,
        IMPORT_ATTRIBUTES_PREFIX,
        NAMED_IMPORTS_PREFIX,
        JS_IMPORT_CLAUSE_PREFIX,
        IMPORT_TYPE_ATTRIBUTES_PREFIX,
        IMPORT_TYPE_ATTRIBUTES_END,
    }
}
export namespace JsLeftPadded {
    export enum Location {
        EXPORT_INITIALIZER,
        JS_IMPORT_INITIALIZER,
        JS_IMPORT_IMPORT_TYPE,
        JS_BINARY_OPERATOR,
        JS_OPERATOR_OPERATOR,
        OBJECT_BINDING_DECLARATIONS_INITIALIZER,
        OBJECT_BINDING_DECLARATIONS_BINDING_DIMENSIONS_AFTER_NAME,
        OBJECT_BINDING_DECLARATIONS_BINDING_INITIALIZER,
        TYPE_DECLARATION_INITIALIZER,
        TYPE_DECLARATION_NAME,
        TYPE_OPERATOR_EXPRESSION,
        UNARY_OPERATOR,
        JSVARIABLE_DECLARATIONS_JSNAMED_VARIABLE_INITIALIZER,
        JSVARIABLE_DECLARATIONS_JSNAMED_VARIABLE_DIMENSIONS_AFTER_NAME,
        JSMETHOD_DECLARATION_DEFAULT_VALUE,
        NAMESPACE_DECLARATION_KEYWORD_TYPE,
        SCOPED_VARIABLE_DECLARATIONS_SCOPE,
        JS_IMPORT_SPECIFIER_IMPORT_TYPE,
        INDEX_SIGNATURE_DECLARATION_TYPE_EXPRESSION,
        JSFOR_OF_LOOP_AWAIT,
        BINDING_ELEMENT_INITIALIZER,
        INFER_TYPE_TYPE_PARAMETER,
        TYPE_PREDICATE_ASSERTS,
        TYPE_PREDICATE_EXPRESSION,
        SATISFIES_EXPRESSION_SATISFIES_TYPE,
        IMPORT_TYPE_QUALIFIER,
        EXPORT_DECLARATION_TYPE_ONLY,
        EXPORT_SPECIFIER_TYPE_ONLY,
        EXPORT_ASSIGNMENT_EXPORT_EQUALS,
        EXPORT_DECLARATION_MODULE_SPECIFIER,
        FUNCTION_DECLARATION_ASTERISK_TOKEN,
        FUNCTION_DECLARATION_NAME,
        JS_ASSIGNMENT_OPERATION_OPERATOR,
        MAPPED_TYPE_PREFIX_TOKEN,
        MAPPED_TYPE_SUFFIX_TOKEN,
        MAPPED_TYPE_MAPPED_TYPE_PARAMETER_ITERATE_TYPE,
        MAPPED_TYPE_HAS_READONLY,
        MAPPED_TYPE_HAS_QUESTION_TOKEN,
        ARROW_FUNCTION_BODY,
        YIELD_DELEGATED,
        FUNCTION_TYPE_CONSTRUCTOR_TYPE,
        FUNCTION_TYPE_RETURN_TYPE,
        JSTRY_FINALLIE,
        IMPORT_ATTRIBUTE_VALUE,
        JS_IMPORT_MODULE_SPECIFIER,
        JS_IMPORT_IMPORT_CLAUSE,
    }
}
export namespace JsRightPadded {
    export enum Location {
        ALIAS_PROPERTY_NAME,
        COMPILATION_UNIT_STATEMENTS,
        JS_IMPORT_NAME,
        BINDING_ELEMENT_PROPERTY_NAME,
        PROPERTY_ASSIGNMENT_NAME,
        SCOPED_VARIABLE_DECLARATIONS_VARIABLES,
        UNION_TYPES,
        JSVARIABLE_DECLARATIONS_VARIABLES,
        NAMESPACE_DECLARATION_NAME,
        INTERSECTION_TYPES,
        TYPE_LITERAL_MEMBERS,
        INDEX_SIGNATURE_DECLARATION_PARAMETERS,
        JSFOR_IN_OF_LOOP_CONTROL_VARIABLE,
        JSFOR_IN_OF_LOOP_CONTROL_ITERABLE,
        JSFOR_OF_LOOP_BODY,
        JSFOR_IN_LOOP_BODY,
        TEMPLATE_EXPRESSION_TEMPLATE_SPANS,
        TAGGED_TEMPLATE_EXPRESSION_TAG,
        IMPORT_TYPE_HAS_TYPEOF,
        INDEXED_ACCESS_TYPE_INDEX_TYPE,
        INDEXED_ACCESS_TYPE_INDEX_TYPE_ELEMENT,
        MAPPED_TYPE_KEYS_REMAPPING_TYPE_PARAMETER,
        MAPPED_TYPE_KEYS_REMAPPING_NAME_TYPE,
        TRAILING_TOKEN_STATEMENT_EXPRESSION,
        WITH_STATEMENT_BODY,
        JS_IMPORT_CLAUSE_NAME,
        IMPORT_TYPE_ATTRIBUTES_TOKEN,
    }
}
export namespace JsContainer {
    export enum Location {
        EXPORT_EXPORTS,
        FUNCTION_TYPE_PARAMETERS,
        JS_IMPORT_IMPORTS,
        OBJECT_BINDING_DECLARATIONS_BINDINGS,
        TUPLE_ELEMENTS,
        JSMETHOD_DECLARATION_PARAMETERS,
        JSMETHOD_DECLARATION_THROWZ,
        FUNCTION_DECLARATION_PARAMETERS,
        TYPE_LITERAL_MEMBERS,
        INDEX_SIGNATURE_DECLARATION_PARAMETERS,
        ARRAY_BINDING_PATTERN_ELEMENTS,
        EXPRESSION_WITH_TYPE_ARGUMENTS_TYPE_ARGUMENTS,
        TAGGED_TEMPLATE_EXPRESSION_TYPE_ARGUMENTS,
        CONDITIONAL_TYPE_CONDITION,
        IMPORT_TYPE_TYPE_ARGUMENTS,
        NAMED_EXPORTS_ELEMENTS,
        MAPPED_TYPE_VALUE_TYPE,
        TYPE_QUERY_TYPE_ARGUMENTS,
        IMPORT_ATTRIBUTES_ELEMENTS,
        NAMED_IMPORTS_ELEMENTS,
        IMPORT_TYPE_ARGUMENT_AND_ATTRIBUTES,
        IMPORT_TYPE_ATTRIBUTES_ELEMENTS,
    }
}
