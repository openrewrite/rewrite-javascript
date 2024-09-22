import {J, JavaVisitor, Space} from "../java";
import {Markers, Tree, TreeVisitor, UUID} from "../core";
import {JavaScriptVisitor} from "./visitor";

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

export namespace JsSpace {
    export enum Location {
        ALIAS_PREFIX,
        ARROW_FUNCTION_PREFIX,
        ARROW_FUNCTION_ARROW,
        DEFAULT_TYPE_PREFIX,
        DEFAULT_TYPE_BEFORE_EQUALS,
        DELETE_PREFIX,
        EXPORT_PREFIX,
        EXPORT_FROM,
        FUNCTION_TYPE_PREFIX,
        FUNCTION_TYPE_ARROW,
        JS_IMPORT_PREFIX,
        JS_IMPORT_FROM,
        JS_BINARY_PREFIX,
        JS_OPERATOR_PREFIX,
        OBJECT_BINDING_DECLARATIONS_PREFIX,
        OBJECT_BINDING_DECLARATIONS_BINDING_PREFIX,
        OBJECT_BINDING_DECLARATIONS_BINDING_AFTER_VARARG,
        TEMPLATE_EXPRESSION_PREFIX,
        TEMPLATE_EXPRESSION_VALUE_PREFIX,
        TEMPLATE_EXPRESSION_VALUE_AFTER,
        TUPLE_PREFIX,
        TYPE_DECLARATION_PREFIX,
        TYPE_OPERATOR_PREFIX,
        UNARY_PREFIX,
        UNION_PREFIX,
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
        JS_IMPORT_NAME,
        OBJECT_BINDING_DECLARATIONS_BINDING_PROPERTY_NAME,
        TEMPLATE_EXPRESSION_TAG,
        UNION_TYPES,
        COMPILATION_UNIT_STATEMENTS,
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
