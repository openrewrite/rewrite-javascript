import {JavaVisitor} from "./visitor";
import {Cursor, ListUtils} from "../core";
import {isJava, J, JContainer, JLeftPadded, JRightPadded, Space} from "./tree";

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
