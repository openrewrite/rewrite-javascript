import {JavaVisitor} from "./visitor";
import {
    JavaType,
    JContainer,
    JLeftPadded,
    JRightPadded,
    Space,
} from "./support_types";
import {J} from "./tree";

export function getJavaType<T extends J>(expr: T): JavaType | null {
    if (expr instanceof J.AnnotatedType) {
        return expr.typeExpression.type;
    } else if (expr instanceof J.Annotation) {
        return expr.annotationType.type;
    } else if (expr instanceof J.MethodDeclaration) {
        return expr.methodType != null ? expr.methodType.returnType : null;
    }
    throw new Error("Unsupported expression type: " + expr.constructor.name);
}

export function withJavaType<T>(expr: T, type: JavaType): T {
    if (expr instanceof J.AnnotatedType) {
        return expr.withTypeExpression(expr.typeExpression.withType(type)) as T;
    } else if (expr instanceof J.Annotation) {
        return expr.withAnnotationType(expr.annotationType.withType(type)) as T;
    } else if (expr instanceof J.MethodDeclaration) {
        throw new Error("To change the return type of this method declaration, use withMethodType(..)");
    }
    throw new Error("Unsupported expression type: " + expr);
}

export function withName(method: J.MethodInvocation, name: J.Identifier): J.MethodInvocation {
    // FIXME
    return undefined;
}


export function visitSpace<P>(v: JavaVisitor<P>, space: Space | null, loc: Space.Location, p: P): Space {
    return space!;
}

export function visitContainer<P, T>(v: JavaVisitor<P>, container: JContainer<T> | null, loc: JContainer.Location, p: P) {
    return container!;
}

export function visitLeftPadded<P, T>(v: JavaVisitor<P>, left: JLeftPadded<T> | null, loc: JLeftPadded.Location, p: P) {
    return left!;
}

export function visitRightPadded<P, T>(v: JavaVisitor<P>, right: JRightPadded<T> | null, loc: JRightPadded.Location, p: P) {
    return right!;
}
