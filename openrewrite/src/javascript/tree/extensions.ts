import {J, JavaType} from "../../java";
import {Alias, BindingElement, ObjectBindingDeclarations, TypeOperator, Void} from "./tree";
import {ExpressionStatement, StatementExpression} from "./support_types";
import * as java_extensions from "../../java/tree/extensions";

export function getJavaType<T extends J>(expr: T): JavaType | null {
    if (expr instanceof Alias) {
        return expr.propertyName.type;
    } else if (expr instanceof ExpressionStatement) {
        return expr.expression.type;
    } else if (expr instanceof ObjectBindingDeclarations) {
        return expr.typeExpression != null ? expr.typeExpression.type : null;
    } else if (expr instanceof BindingElement) {
        return expr.variableType != null ? expr.variableType.type : null;
    } else if (expr instanceof StatementExpression) {
        return null;
    } else if (expr instanceof TypeOperator) {
        return expr.expression.type;
    } else if (expr instanceof Void) {
        return JavaType.Primitive.of(JavaType.PrimitiveKind.Void);
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
    } else if (expr instanceof BindingElement) {
        return (expr.variableType != null ? expr.withVariableType(expr.variableType.withType(type)) : null) as T;
    } else if (expr instanceof StatementExpression) {
        return expr as T;
    } else if (expr instanceof TypeOperator) {
        return expr.withExpression(expr.expression.withType(type)) as T;
    } else if (expr instanceof Void) {
        return expr as T;
    }
    return java_extensions.withJavaType(expr, type);
}

