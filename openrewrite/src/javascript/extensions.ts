import {JContainer, JLeftPadded, JRightPadded, Space} from "../java/tree";
import * as java_extensions from "../java/extensions";
import {JavaScriptVisitor} from "./visitor";
import {JsContainer, JsLeftPadded, JsRightPadded, JsSpace} from "./tree";

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
    return visitSpace(v, space, Space.Location.LANGUAGE_EXTENSION, p);
}

export function visitJsLeftPadded<P, T>(v: JavaScriptVisitor<P>, left: JLeftPadded<T> | null, loc: JsLeftPadded.Location, p: P): JLeftPadded<T> {
    return visitLeftPadded(v, left, JLeftPadded.Location.LANGUAGE_EXTENSION, p);
}

export function visitJsRightPadded<P, T>(v: JavaScriptVisitor<P>, right: JRightPadded<T> | null, loc: JsRightPadded.Location, p: P): JRightPadded<T> {
    return visitRightPadded(v, right, JRightPadded.Location.LANGUAGE_EXTENSION, p);
}

export function visitJsContainer<P, T>(v: JavaScriptVisitor<P>, container: JContainer<T> | null, loc: JsContainer.Location, p: P): JContainer<T> {
    return visitContainer(v, container, JContainer.Location.LANGUAGE_EXTENSION, p);
}
