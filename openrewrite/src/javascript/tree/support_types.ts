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
        OBJECT_BINDING_DECLARATIONS_BINDING_AFTER_VARARG,
        OBJECT_BINDING_DECLARATIONS_BINDING_PREFIX,
        OBJECT_BINDING_DECLARATIONS_PREFIX,
        PROPERTY_ASSIGNMENT_PREFIX,
        SCOPED_VARIABLE_DECLARATIONS_PREFIX,
        TEMPLATE_EXPRESSION_PREFIX,
        TEMPLATE_EXPRESSION_VALUE_AFTER,
        TEMPLATE_EXPRESSION_VALUE_PREFIX,
        TUPLE_PREFIX,
        TYPE_DECLARATION_PREFIX,
        TYPE_OF_PREFIX,
        TYPE_OPERATOR_PREFIX,
        UNARY_PREFIX,
        UNION_PREFIX,
        VOID_PREFIX,
        YIELD_PREFIX,
        TYPE_INFO_PREFIX,
        NAMESPACE_DECLARATION_PREFIX,
        NAMESPACE_KEYWORD_DECLARATION_PREFIX
    }
}
export namespace JsLeftPadded {
    export enum Location {
        EXPORT_INITIALIZER,
        JS_IMPORT_INITIALIZER,
        JS_BINARY_OPERATOR,
        JS_OPERATOR_OPERATOR,
        OBJECT_BINDING_DECLARATIONS_INITIALIZER,
        OBJECT_BINDING_DECLARATIONS_BINDING_DIMENSIONS_AFTER_NAME,
        OBJECT_BINDING_DECLARATIONS_BINDING_INITIALIZER,
        TYPE_DECLARATION_INITIALIZER,
        TYPE_OPERATOR_EXPRESSION,
        UNARY_OPERATOR,
    }
}
export namespace JsRightPadded {
    export enum Location {
        ALIAS_PROPERTY_NAME,
        COMPILATION_UNIT_STATEMENTS,
        JS_IMPORT_NAME,
        OBJECT_BINDING_DECLARATIONS_BINDING_PROPERTY_NAME,
        PROPERTY_ASSIGNMENT_NAME,
        SCOPED_VARIABLE_DECLARATIONS_VARIABLES,
        TEMPLATE_EXPRESSION_TAG,
        UNION_TYPES,
        NAMESPACE_DECLARATION_NAME,
    }
}
export namespace JsContainer {
    export enum Location {
        EXPORT_EXPORTS,
        FUNCTION_TYPE_PARAMETERS,
        JS_IMPORT_IMPORTS,
        OBJECT_BINDING_DECLARATIONS_BINDINGS,
        TUPLE_ELEMENTS,
    }
}
