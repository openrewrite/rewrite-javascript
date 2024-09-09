import {v4 as uuidv4} from 'uuid';
import {Markers} from "./markers";

export type UUID = string;

export const random_id = (): UUID => {
    return uuidv4();
}

export interface Tree {
    get id(): UUID;

    withId(id: UUID): Tree;

    get markers(): Markers;

    withMarkers(markers: Markers): Tree;

    isAcceptable<P>(v: TreeVisitor<Tree, P>, p: P): boolean;

    accept<R extends Tree, P>(v: TreeVisitor<R, P>, p: P): R | null;
}

export abstract class TreeVisitor<T extends Tree, P> {
    private _cursor: Cursor;

    protected constructor() {
        this._cursor = new Cursor(null, Cursor.ROOT_VALUE);
    }

    public get cursor(): Cursor {
        return this._cursor;
    }

    public set cursor(cursor: Cursor) {
        this._cursor = cursor;
    }

    abstract visit(tree: Tree | null, p: P): T | null;
}

export class Cursor {
    public static ROOT_VALUE: String = "root";

    private readonly _parent: Cursor | null;
    private readonly _value: Object;
    private _messages: Map<string, Object>;

    constructor(parent: Cursor | null, value: Object) {
        this._parent = parent;
        this._value = value;
        this._messages = new Map<string, Object>();
    }

    public get parent(): Cursor | null {
        return this._parent;
    }

    public value<T>(): T {
        return this._value as T;
    }

    public fork(): Cursor {
        return new Cursor(this._parent === null ? null : this._parent.fork(), this.value);
    }
}
