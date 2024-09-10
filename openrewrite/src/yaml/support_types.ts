import {Markers, Tree, TreeVisitor, UUID} from "../core";

export abstract class Yaml implements Tree {
    accept<R extends Tree, P>(v: TreeVisitor<R, P>, p: P): R | null {
        return null;
    }

    isAcceptable<P>(v: TreeVisitor<Tree, P>, p: P): boolean {
        return false;
    }

    abstract get id(): UUID;

    abstract get markers(): Markers;

    abstract withId(id: UUID): Tree;

    abstract withMarkers(markers: Markers): Tree;
}

export interface YamlKey extends Tree {
    // get value(): string;

    withPrefix(prefix: string): YamlKey;
}