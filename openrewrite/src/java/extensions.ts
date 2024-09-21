import {JavaVisitor} from "./visitor";
import {
    isJava,
    J,
    JavaType,
    JContainer,
    JLeftPadded,
    JRightPadded,
    Space,
} from "./support_types";
import {Cursor, ListUtils} from "../core";
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


export function visitSpace<P>(v: JavaVisitor<P>, space: Space | null, loc: Space.Location, p: P): Space {
    return space!;
}

export function visitContainer<P, T>(v: JavaVisitor<P>, container: JContainer<T> | null, loc: JContainer.Location, p: P): JContainer<T> | null {
    if (container == null)
        return null;

    v.cursor = new Cursor(v.cursor, container);

    let before = v.visitSpace(container.before, JContainer.Location.beforeLocation(loc), p);
    let js = ListUtils.map(container.padding.elements, t => v.visitRightPadded(t, JContainer.Location.elementLocation(loc), p));

    v.cursor = v.cursor.parent!;

    return js == container.padding.elements && before == container.before ?
        container :
        JContainer.build(before!, js, container.markers);
}

export function visitLeftPadded<P, T>(v: JavaVisitor<P>, left: JLeftPadded<T> | null, loc: JLeftPadded.Location, p: P): JLeftPadded<T> | null {
    if (left == null)
        return null;

    v.cursor = new Cursor(v.cursor, left);

    let before = v.visitSpace(left.before, JLeftPadded.Location.beforeLocation(loc), p)!;
    let t = left.element;
    if (isJava(left.element))
        t = v.visit(t as J, p) as T;
    v.cursor = v.cursor.parent!;

    // If nothing changed leave AST node the same
    if (left.element === t && before == left.before) {
        return left;
    }

    return t == null ? null : new JLeftPadded<T>(before, t, left.markers);
}

export function visitRightPadded<P, T>(v: JavaVisitor<P>, right: JRightPadded<T> | null, loc: JRightPadded.Location, p: P): JRightPadded<T> | null {
    if (right == null)
        return null;

    let t = right.element;
    if (isJava(t)) {
        v.cursor = new Cursor(v.cursor, right);
        t = v.visit(t as J, p) as T;
        v.cursor = v.cursor.parent!;
    }

    if (t == null)
        return null;

    right = right.withElement(t);
    right = right.withAfter(v.visitSpace(right.after, JRightPadded.Location.afterLocation(loc), p)!);
    right = right.withMarkers(v.visitMarkers(right.markers, p));
    return right;
}
