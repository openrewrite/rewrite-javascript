import {J, JavaType, JContainer, JLeftPadded, JRightPadded, Space} from "../java";
import * as java_extensions from "../java/extensions";
import {JavaScriptVisitor} from "./visitor";
import {JsContainer, JsLeftPadded, JsRightPadded, JsSpace} from "./support_types";
import {JS} from "./support_types";
import {Alias, ExpressionStatement, ObjectBindingDeclarations, StatementExpression, TypeOperator} from "./tree";

export function getJavaType<T extends J>(expr: T): JavaType | null {
    if (expr instanceof Alias) {
        return expr.propertyName.type;
    } else if (expr instanceof ExpressionStatement) {
        return expr.expression.type;
    } else if (expr instanceof ObjectBindingDeclarations) {
        return expr.typeExpression != null ? expr.typeExpression.type : null;
    } else if (expr instanceof ObjectBindingDeclarations.Binding) {
        return expr.variableType != null ? expr.variableType.type : null;
    } else if (expr instanceof StatementExpression) {
        return null;
    } else if (expr instanceof TypeOperator) {
        return expr.expression.type;
    }
    return java_extensions.getJavaType(expr);
}

export function withJavaType<T>(expr: T, type: JavaType): T {
    if (expr instanceof Alias) {
        return expr.withPropertyName(expr.propertyName.withType(type)) as T;
    } else if (expr instanceof ExpressionStatement) {
        return expr.withExpression(expr.expression.withType(type)) as T;
    } else if (expr instanceof ObjectBindingDeclarations) {
        return (expr.typeExpression != null ? expr.withTypeExpression(expr.typeExpression.withType(type)) : null) as T;
    } else if (expr instanceof ObjectBindingDeclarations.Binding) {
        return (expr.variableType != null ? expr.withVariableType(expr.variableType.withType(type)) : null) as T;
    } else if (expr instanceof StatementExpression) {
        return expr as T;
    } else if (expr instanceof TypeOperator) {
        return expr.withExpression(expr.expression.withType(type)) as T;
    }
    return java_extensions.withJavaType(expr, type);
}

export function visitSpace<P>(v: JavaScriptVisitor<P>, space: Space | null, loc: Space.Location, p: P): Space {
    return java_extensions.visitSpace(v, space, loc as Space.Location, p);
}

export function visitContainer<P, T>(v: JavaScriptVisitor<P>, container: JContainer<T> | null, loc: JContainer.Location, p: P): JContainer<T> {
    return java_extensions.visitContainer(v, container, loc as JContainer.Location, p)!;
}

export function visitLeftPadded<P, T>(v: JavaScriptVisitor<P>, left: JLeftPadded<T> | null, loc: JLeftPadded.Location, p: P): JLeftPadded<T> {
    return java_extensions.visitLeftPadded(v, left, loc as JLeftPadded.Location, p)!;
}

export function visitRightPadded<P, T>(v: JavaScriptVisitor<P>, right: JRightPadded<T> | null, loc: JRightPadded.Location, p: P): JRightPadded<T> {
    return java_extensions.visitRightPadded(v, right, loc as JRightPadded.Location, p)!;
}

export function visitJsSpace<P>(v: JavaScriptVisitor<P>, space: Space | null, loc: JsSpace.Location, p: P): Space {
    throw new Error("Not yet implemented!");
}

export function visitJsLeftPadded<P, T>(v: JavaScriptVisitor<P>, left: JLeftPadded<T> | null, loc: JsLeftPadded.Location, p: P): JLeftPadded<T> {
    throw new Error("Not yet implemented!");
}

export function visitJsRightPadded<P, T>(v: JavaScriptVisitor<P>, right: JRightPadded<T> | null, loc: JsRightPadded.Location, p: P): JRightPadded<T> {
    throw new Error("Not yet implemented!");
}

export function visitJsContainer<P, T>(v: JavaScriptVisitor<P>, container: JContainer<T> | null, loc: JsContainer.Location, p: P): JContainer<T> {
    throw new Error("Not yet implemented!");
}
