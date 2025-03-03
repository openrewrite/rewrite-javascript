import {LstType, Markers, Tree, TreeVisitor, UUID} from "../../core";
import {JsonVisitor} from "../visitor";

export interface Json extends Tree {
    get prefix(): Space;

    withPrefix(prefix: Space): Json;

    get id(): UUID;

    withId(id: UUID): Json;

    get markers(): Markers;

    withMarkers(markers: Markers): Json;

    isAcceptable<P>(v: TreeVisitor<Tree, P>, p: P): boolean;

    accept<R extends Tree, P>(v: TreeVisitor<R, P>, p: P): R | null;

    acceptJson<P>(v: JsonVisitor<P>, p: P): Json | null;
}

type Constructor<T = {}> = new (...args: any[]) => T;

export function isJson(tree: any): tree is Json {
    return !!tree.constructor.isJson || !!tree.isJson;
}

export function JsonMixin<TBase extends Constructor<Object>>(Base: TBase) {
    abstract class JsonMixed extends Base implements Json {
        static isTree = true;
        static isJson = true;

        abstract get prefix(): Space;

        abstract withPrefix(prefix: Space): Json;

        abstract get id(): UUID;

        abstract withId(id: UUID): Json;

        abstract get markers(): Markers;

        abstract withMarkers(markers: Markers): Json;

        public isAcceptable<P>(v: TreeVisitor<Tree, P>, p: P): boolean {
            return v.isAdaptableTo(JsonVisitor);
        }

        public accept<R extends Tree, P>(v: TreeVisitor<R, P>, p: P): R | null {
            return this.acceptJson(v.adapt(JsonVisitor), p) as unknown as R | null;
        }

        public acceptJson<P>(v: JsonVisitor<P>, p: P): Json | null {
            return v.defaultValue(this, p) as Json | null;
        }
    }

    return JsonMixed;
}

export interface JsonKey extends Tree {
}

export interface JsonValue extends Tree {
}

@LstType("org.openrewrite.json.tree.Space")
export class Space {
}

@LstType("org.openrewrite.json.tree.Comment")
export class Comment {
}

@LstType("org.openrewrite.json.tree.JsonRightPadded")
export class JsonRightPadded<T extends Tree> {
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
