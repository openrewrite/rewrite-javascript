import {JavaVisitor} from "./visitor";
import {
    JContainer,
    JLeftPadded,
    JRightPadded,
    Space,
} from "./support_types";
import {J} from "./tree";

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
