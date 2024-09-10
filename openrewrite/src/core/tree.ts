import {v4 as uuidv4} from 'uuid';
import {Marker, Markers} from "./markers";
import {ListUtils} from "./utils";

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

    get cursor(): Cursor {
        return this._cursor;
    }

    set cursor(cursor: Cursor) {
        this._cursor = cursor;
    }

    abstract visit(tree: Tree | null, p: P): T | null;

    visitMarkers(markers: Markers | undefined, p: P): Markers {
        if (markers == undefined || markers === Markers.EMPTY) {
            return Markers.EMPTY;
        } else if (markers.markers.length === 0) {
            return markers;
        }
        return markers.withMarkers(ListUtils.map(markers.markers, m => this.visitMarker(m, p))!);
    }

    visitMarker<M>(marker: M, p: P): M {
        return marker;
    }
}

export class Cursor {
    static ROOT_VALUE: String = "root";

    private readonly _parent: Cursor | null;
    private readonly _value: Object;
    private _messages: Map<string, Object>;

    constructor(parent: Cursor | null, value: Object) {
        this._parent = parent;
        this._value = value;
        this._messages = new Map<string, Object>();
    }

    get parent(): Cursor | null {
        return this._parent;
    }

    value<T>(): T {
        return this._value as T;
    }

    fork(): Cursor {
        return new Cursor(this._parent === null ? null : this._parent.fork(), this.value);
    }
}

export class Checksum {
    constructor(private readonly _algorithm: string, private readonly _value: ArrayBuffer) {
    }

    get algorithm(): string {
        return this._algorithm;
    }

    get value(): ArrayBuffer {
        return this._value;
    }
}

export class FileAttributes {
    public constructor(
        private readonly _creationTime: Date | undefined,
        private readonly _lastModifiedTime: Date | undefined,
        private readonly _lastAccessTime: Date | undefined,
        private readonly _isReadable: boolean,
        private readonly _isWritable: boolean,
        private readonly _isExecutable: boolean,
        private readonly _size: number,
    ) {
    }

    get creationTime(): Date | undefined {
        return this._creationTime;
    }

    withCreationTime(creationTime: Date | undefined): FileAttributes {
        return new FileAttributes(creationTime, this._lastModifiedTime, this._lastAccessTime, this._isReadable, this._isWritable, this._isExecutable, this._size);
    }

    get lastModifiedTime(): Date | undefined {
        return this._lastModifiedTime;
    }

    withLastModifiedTime(lastModifiedTime: Date | undefined): FileAttributes {
        return new FileAttributes(this._creationTime, lastModifiedTime, this._lastAccessTime, this._isReadable, this._isWritable, this._isExecutable, this._size);
    }

    get lastAccessTime(): Date | undefined {
        return this._lastAccessTime;
    }

    withLastAccessTime(lastAccessTime: Date | undefined): FileAttributes {
        return new FileAttributes(this._creationTime, this._lastModifiedTime, lastAccessTime, this._isReadable, this._isWritable, this._isExecutable, this._size);
    }

    get isReadable(): boolean {
        return this._isReadable;
    }

    withReadable(readable: boolean): FileAttributes {
        return new FileAttributes(this._creationTime, this._lastModifiedTime, this._lastAccessTime, readable, this._isWritable, this._isExecutable, this._size);
    }

    get isWritable(): boolean {
        return this._isWritable;
    }

    withWritable(writable: boolean): FileAttributes {
        return new FileAttributes(this._creationTime, this._lastModifiedTime, this._lastAccessTime, this._isReadable, writable, this._isExecutable, this._size);
    }

    get isExecutable(): boolean {
        return this._isExecutable;
    }

    withExecutable(executable: boolean): FileAttributes {
        return new FileAttributes(this._creationTime, this._lastModifiedTime, this._lastAccessTime, this._isReadable, this._isWritable, executable, this._size);
    }

    get size(): number {
        return this._size;
    }

    withSize(size: number): FileAttributes {
        return new FileAttributes(this._creationTime, this._lastModifiedTime, this._lastAccessTime, this._isReadable, this._isWritable, this._isExecutable, size);
    }
}

export interface SourceFile extends Tree {

    get sourcePath(): string;

    withSourcePath(sourcePath: string): SourceFile;

    get charsetName(): string | undefined;

    withCharsetName(charset: string | undefined): SourceFile;

    get charsetBomMarked(): boolean;

    withCharsetBomMarked(isCharsetBomMarked: boolean): SourceFile;

    get checksum(): Checksum | undefined;

    withChecksum(checksum: Checksum | undefined): SourceFile;

    get fileAttributes(): FileAttributes | undefined;

    withFileAttributes(fileAttributes: FileAttributes | undefined): SourceFile;
}

type CommentWrapper = (input: string) => string;

export interface MarkerPrinter {
    beforeSyntax(marker: Marker, cursor: Cursor, commentWrapper: CommentWrapper): string;

    beforePrefix(marker: Marker, cursor: Cursor, commentWrapper: CommentWrapper): string;

    afterSyntax(marker: Marker, cursor: Cursor, commentWrapper: CommentWrapper): string;
}

class DefaultMarkerPrinter implements MarkerPrinter {
    static DEFAULT: MarkerPrinter = new DefaultMarkerPrinter();

    beforeSyntax(marker: Marker, cursor: Cursor, commentWrapper: CommentWrapper): string {
        return "";
    }

    beforePrefix(marker: Marker, cursor: Cursor, commentWrapper: CommentWrapper): string {
        return "";
    }

    afterSyntax(marker: Marker, cursor: Cursor, commentWrapper: CommentWrapper): string {
        return "";
    }
}

export class PrintOutputCapture<P> {
    private readonly _context: P;
    private readonly _markerPrinter: MarkerPrinter;
    private readonly _out: string[];

    constructor(p: P, markerPrinter: MarkerPrinter = DefaultMarkerPrinter.DEFAULT) {
        this._context = p;
        this._markerPrinter = markerPrinter;
        this._out = [];
    }

    get out(): string {
        return this._out.join('');
    }

    append(text: string | undefined): PrintOutputCapture<P> {
        if (text && text.length > 0) {
            this._out.push(text);
        }
        return this;
    }

    clone(): PrintOutputCapture<P> {
        return new PrintOutputCapture(this._context, this._markerPrinter);
    }
}

export abstract class PrinterFactory {
    private static _current: PrinterFactory | undefined;

    static current(): PrinterFactory {
        if (PrinterFactory._current === undefined) {
            throw new Error('PrinterFactory is not initialized');
        }
        return PrinterFactory._current;
    }

    abstract createPrinter<P>(cursor: Cursor): TreeVisitor<Tree, PrintOutputCapture<P>>;
}