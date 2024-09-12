import {J, JavaType, JavaVisitor, JContainer, JLeftPadded, JRightPadded, Space} from "../java";
import * as java_extensions from "../java/extensions";
import {JavaScriptVisitor} from "./visitor";
import {JsContainer, JsLeftPadded, JsRightPadded, JsSpace} from "./support_types";

export function getJavaType<T extends J>(expr: T): JavaType | null {
    // FIXME implement for JS types
    return java_extensions.getJavaType(expr);
}

export function withJavaType<T>(expr: T, type: JavaType): T {
    // FIXME implement for JS types
    return java_extensions.withJavaType(expr, type);
}

export function visitSpace<P>(v: JavaScriptVisitor<P>, space: Space | null, loc: Space.Location | JsSpace.Location, p: P): Space {
    // FIXME this won't quite work
    if (Object.values(Space.Location).includes(loc as any)) {
        return java_extensions.visitSpace(v, space, loc as Space.Location, p);
    }
    return space!;
}

export function visitContainer<P, T>(v: JavaScriptVisitor<P>, container: JContainer<T> | null, loc: JContainer.Location | JsContainer.Location, p: P): JContainer<T> {
    // FIXME this won't quite work
    if (Object.values(JContainer.Location).includes(loc as any)) {
        return java_extensions.visitContainer(v, container, loc as JContainer.Location, p);
    }
    return container!;
}

export function visitLeftPadded<P, T>(v: JavaScriptVisitor<P>, left: JLeftPadded<T> | null, loc: JLeftPadded.Location | JsLeftPadded.Location, p: P): JLeftPadded<T> {
    // FIXME this won't quite work
    if (Object.values(JLeftPadded.Location).includes(loc as any)) {
        return java_extensions.visitLeftPadded(v, left, loc as JLeftPadded.Location, p);
    }
    return left!;
}

export function visitRightPadded<P, T>(v: JavaScriptVisitor<P>, right: JRightPadded<T> | null, loc: JRightPadded.Location | JsRightPadded.Location, p: P): JRightPadded<T> {
    // FIXME this won't quite work
    if (Object.values(JRightPadded.Location).includes(loc as any)) {
        return java_extensions.visitRightPadded(v, right, loc as JRightPadded.Location, p);
    }
    return right!;
}
