import {v4 as uuidv4} from 'uuid';

export type UUID = string;

export const random_id = (): UUID => {
    return uuidv4();
}

export class Cursor {
    private readonly _parent: Cursor | null;
    private readonly _value: Object;
    private _messages: Map<string, Object>;

    constructor(parent: Cursor | null, value: Object) {
        this._parent = parent;
        this._value = value;
        this._messages = new Map<string, Object>();
    }

    public parent(): Cursor | null {
        return this._parent;
    }

    public value<T>(): T {
        return this._value as T;
    }

    public fork(): Cursor {
        return new Cursor(this._parent === null ? null : this._parent.fork(), this.value);
    }
}