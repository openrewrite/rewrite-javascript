import {javaType, Tree} from "../core";

export interface JsonKey extends Tree {
}

export interface JsonValue extends Tree {
}

export class Space {
    static [javaType] = "org.openrewrite.json.tree.Space";
}

export class Comment {
    static [javaType] = "org.openrewrite.json.tree.Comment";
}

export class JsonRightPadded<T extends Tree> {
    static [javaType] = "org.openrewrite.json.tree.JsonRightPadded";
    constructor(element: T) {
        this._element = element;
    }

    private readonly _element: T;

    get element(): T {
        return this._element;
    }

    static getElements<T extends Tree>(padded: JsonRightPadded<T>[]) {
        return [];
    }

    static withElements<T extends Tree>(padded: JsonRightPadded<T>[], elements: T[]) {
        return [];
    }

    static withElement<T extends Tree>(padded: JsonRightPadded<T>, element: T): JsonRightPadded<T> {
        return padded;
    }

    withElement(element: T) : JsonRightPadded<T> {
        return undefined!;
    }
}