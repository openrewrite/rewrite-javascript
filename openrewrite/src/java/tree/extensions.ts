import {J, JavaType} from "./support_types";
import {AnnotatedType, Annotation, Identifier, MethodDeclaration, MethodInvocation} from "./tree";

export function getJavaType<T extends J>(expr: T): JavaType | null {
    if (expr instanceof AnnotatedType) {
        return expr.typeExpression.type;
    } else if (expr instanceof Annotation) {
        return expr.annotationType.type;
    } else if (expr instanceof MethodDeclaration) {
        return expr.methodType != null ? expr.methodType.returnType : null;
    }
    throw new Error("Unsupported expression type: " + expr.constructor.name);
}

export function withJavaType<T>(expr: T, type: JavaType): T {
    if (expr instanceof AnnotatedType) {
        return expr.withTypeExpression(expr.typeExpression.withType(type)) as T;
    } else if (expr instanceof Annotation) {
        return expr.withAnnotationType(expr.annotationType.withType(type)) as T;
    } else if (expr instanceof MethodDeclaration) {
        throw new Error("To change the return type of this method declaration, use withMethodType(..)");
    }
    throw new Error("Unsupported expression type: " + expr);
}

export function withName(method: MethodInvocation, name: Identifier): MethodInvocation {
    if (method.name === name) return method;
    // FIXME add type attribution logic
    return new MethodInvocation(method.id, method.prefix, method.markers, method.padding.select,
        method.padding.typeParameters, name, method.padding.arguments, method.methodType);
}

