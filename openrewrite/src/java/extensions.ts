import {JavaVisitor} from "./visitor";
import {
    JContainer,
    JContainerLocation,
    JLeftPadded,
    JLeftPaddedLocation,
    JRightPadded, JRightPaddedLocation,
    Space,
    SpaceLocation
} from "./support_types";

export function visitSpace<P>(v: JavaVisitor<P>, space: Space | null, loc: SpaceLocation, p: P): Space {
    return space!;
}

export function visitContainer<P, T>(v: JavaVisitor<P>, container: JContainer<T> | null, loc: JContainerLocation, p: P) {
    return container!;
}

export function visitLeftPadded<P, T>(v: JavaVisitor<P>, left: JLeftPadded<T> | null, loc: JLeftPaddedLocation, p: P) {
    return left!;
}

export function visitRightPadded<P, T>(v: JavaVisitor<P>, right: JRightPadded<T> | null, loc: JRightPaddedLocation, p: P) {
    return right!;
}
