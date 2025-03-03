import {JsonVisitor} from "./visitor";
import {JsonRightPadded, Space} from "./tree";
import {Tree} from "../core";

export function visitRightPadded<P, T extends Tree>(v: JsonVisitor<P>, right: JsonRightPadded<T> | null, p: P): JsonRightPadded<T> {
    return right!;
}

export function visitSpace<P>(v: JsonVisitor<P>, space: Space | null, p: P): Space {
    return space!;
}
