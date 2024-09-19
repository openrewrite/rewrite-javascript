import {v4 as uuidv4} from 'uuid';
import {Marker, Markers, ParseExceptionResult} from "./markers";
import {ListUtils, LstType} from "./utils";
import {Parser, ParserInput} from "./parser";
import {ExecutionContext} from "./execution";
import path from "node:path";

export type UUID = string & { readonly __brand: unique symbol };

interface UUIDConstructor {
    new(value?: any): UUID;

    <T>(value?: T): UUID;

    readonly prototype: UUID;
}

export declare var UUID: UUIDConstructor;

export type Enum = { readonly __brand: unique symbol };

interface EnumConstructor {
    new(value?: any): Enum;

    <T>(value?: T): Enum;

    readonly prototype: Enum;
}

export declare var Enum: EnumConstructor;

export const randomId = (): UUID => {
    return uuidv4() as UUID;
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

    defaultValue(tree: Tree | null, p: P): T | null {
        return tree as T;
    }

    visit(tree: Tree | null, p: P, parent?: Cursor): T | null {
        if (parent)
            this._cursor = parent;
        // FIXME
        return tree as T;
    }

    protected visitAndCast<T extends Tree>(t: T | null, p: P): T | null {
        return this.visit(t, p) as unknown as T;
    }

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

    isAdaptableTo<V extends TreeVisitor<any, any>>(adaptTo: Function & { prototype: V }): boolean {
        // FIXME
        return this instanceof adaptTo;
    }

    adapt<R extends Tree, V extends TreeVisitor<R, P>>(adaptTo: Function & { prototype: V }): V {
        // FIXME
        return this as unknown as V;
    }
}

type Constructor<T = {}> = (abstract new(...args: any[]) => T) | ((obj: any) => obj is T) | symbol;

@LstType("org.openrewrite.Cursor")
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

    firstEnclosing<T>(type: Constructor<T>): T | null {
        let c: Cursor | null = this;

        function isInstance(obj: any, type: Constructor<T>) {
            if (typeof type === 'function') {
                if ('prototype' in type) {
                    return obj instanceof type;
                } else {
                    return (type as (obj: any) => obj is T)(obj);
                }
            } else if (typeof type === 'symbol') {
                return obj && (obj[type] === true || (obj as Record<symbol, any>)[type] === true);
            } else {
                return false;
            }
        }

        while (c !== null) {
            if (isInstance(c._value, type)) {
                return c._value as T;
            }
            c = c.parent;
        }
        return null;
    }
}

@LstType("org.openrewrite.Checksum")
export class Checksum {
    private readonly _algorithm: string;
    private readonly _value: ArrayBuffer;

    constructor(algorithm: string, value: ArrayBuffer) {
        this._algorithm = algorithm;
        this._value = value;
    }

    get algorithm(): string {
        return this._algorithm;
    }

    get value(): ArrayBuffer {
        return this._value;
    }
}

@LstType("org.openrewrite.FileAttributes")
export class FileAttributes {
    private readonly _creationTime: Date | undefined;
    private readonly _lastModifiedTime: Date | undefined;
    private readonly _lastAccessTime: Date | undefined;
    private readonly _isReadable: boolean;
    private readonly _isWritable: boolean;
    private readonly _isExecutable: boolean;
    private readonly _size: number;

    public constructor(
        creationTime: Date | undefined,
        lastModifiedTime: Date | undefined,
        lastAccessTime: Date | undefined,
        isReadable: boolean,
        isWritable: boolean,
        isExecutable: boolean,
        size: number,
    ) {
        this._creationTime = creationTime;
        this._lastModifiedTime = lastModifiedTime;
        this._lastAccessTime = lastAccessTime;
        this._isReadable = isReadable;
        this._isWritable = isWritable;
        this._isExecutable = isExecutable;
        this._size = size;
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

const SourceFileSymbol = Symbol('SourceFile');

// This allows using `SourceFile` like a class in certain situations (e.g. `Cursor.firstEnclosing()`)
export const SourceFile = SourceFileSymbol;

export function isSourceFile(tree: any & Tree): tree is SourceFile {
    // return 'sourcePath' in tree && 'printer' in tree;
    return tree && tree[SourceFileSymbol] === true;
}

export interface SourceFile extends Tree {
    [SourceFileSymbol]: true;

    get sourcePath(): string;

    withSourcePath(sourcePath: string): SourceFile;

    get charsetName(): string | null;

    withCharsetName(charset: string | null): SourceFile;

    get charsetBomMarked(): boolean;

    withCharsetBomMarked(isCharsetBomMarked: boolean): SourceFile;

    get checksum(): Checksum | null;

    withChecksum(checksum: Checksum | null): SourceFile;

    get fileAttributes(): FileAttributes | null;

    withFileAttributes(fileAttributes: FileAttributes | null): SourceFile;

    printEqualsInput(parserInput: ParserInput, ctx: ExecutionContext): boolean;

    printAll(): string;

    print<P>(cursor: Cursor, capture: PrintOutputCapture<P>): string;

    printer<P>(cursor: Cursor): TreeVisitor<any, PrintOutputCapture<P>>;
}

type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;

export function SourceFileMixin<TBase extends AbstractConstructor<Tree>>(Base: TBase) {
    abstract class SourceFileMixed extends Base implements SourceFile {
        [SourceFileSymbol]: true = true;

        abstract get sourcePath(): string;

        abstract withSourcePath(sourcePath: string): SourceFile;

        abstract get charsetName(): string | null;

        abstract withCharsetName(charset: string | null): SourceFile;

        abstract get charsetBomMarked(): boolean;

        abstract withCharsetBomMarked(isCharsetBomMarked: boolean): SourceFile;

        abstract get checksum(): Checksum | null;

        abstract withChecksum(checksum: Checksum | null): SourceFile;

        abstract get fileAttributes(): FileAttributes | null;

        abstract withFileAttributes(fileAttributes: FileAttributes | null): SourceFile;

        printEqualsInput(parserInput: ParserInput, ctx: ExecutionContext): boolean {
            let printed: string = this.printAll();
            let charset: string | null = this.charsetName;
            if (charset !== null) {
                return true;
                // FIXME
                // return printed === StringUtils.readFully(parserInput.source(ctx), charset);
            }
            return true;
            // FIXME
            // return printed === StringUtils.readFully(parserInput.source(ctx));
        }

        printAll(): string {
            return this.print(new Cursor(null, Cursor.ROOT_VALUE), new PrintOutputCapture(0))
        }

        print<P>(cursor: Cursor, capture: PrintOutputCapture<P>): string {
            this.printer(cursor).visit(this, capture, cursor);
            return capture.out
        }

        abstract printer<P>(cursor: Cursor): TreeVisitor<any, PrintOutputCapture<P>>;
    }

    return SourceFileMixed;
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

@LstType("org.openrewrite.PrintOutputCapture")
export class PrintOutputCapture<P> {
    private readonly _context: P;
    private readonly _markerPrinter: MarkerPrinter;
    private readonly _out: string[];

    constructor(p: P, markerPrinter: MarkerPrinter = DefaultMarkerPrinter.DEFAULT) {
        this._context = p;
        this._markerPrinter = markerPrinter;
        this._out = [];
    }

    get markerPrinter(): MarkerPrinter {
        return this._markerPrinter;
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

    static get current(): PrinterFactory {
        if (PrinterFactory._current === undefined) {
            throw new Error('PrinterFactory is not initialized');
        }
        return PrinterFactory._current;
    }
    static set current(printerFactory: PrinterFactory) {
        PrinterFactory._current = printerFactory;
    }

    abstract createPrinter<P>(cursor: Cursor): TreeVisitor<Tree, PrintOutputCapture<P>>;
}

@LstType("org.openrewrite.tree.ParseError")
export class ParseError implements SourceFile {
    [SourceFileSymbol]: true = true;

    private readonly _id: UUID;
    private readonly _markers: Markers;
    private readonly _sourcePath: string;
    private readonly _fileAttributes: FileAttributes | null;
    private readonly _charsetName: string | null;
    private readonly _charsetBomMarked: boolean;
    private readonly _checksum: Checksum | null;
    private readonly _text: string;
    private readonly _erroneous: SourceFile | null;

    constructor(
        id: UUID,
        markers: Markers,
        sourcePath: string,
        fileAttributes: FileAttributes | null,
        charsetName: string | null,
        charsetBomMarked: boolean,
        checksum: Checksum | null,
        text: string,
        erroneous: SourceFile | null
    ) {
        this._id = id;
        this._markers = markers;
        this._sourcePath = sourcePath;
        this._fileAttributes = fileAttributes;
        this._charsetName = charsetName;
        this._charsetBomMarked = charsetBomMarked;
        this._checksum = checksum;
        this._text = text;
        this._erroneous = erroneous;
    }

    static build(
        parser: Parser,
        input: ParserInput,
        relativeTo: string | null,
        ctx: ExecutionContext,
        exception: Error,
        erroneous: SourceFile | null = null
    ): ParseError {
        return new ParseError(
            randomId(),
            new Markers(randomId(), [ParseExceptionResult.build(parser, exception)]),
            relativeTo ? path.resolve(input.path, relativeTo) : input.path,
            input.fileAttributes,
            parser.getCharset(ctx),
            false,
            null,
            input.source().read().toString(),
            erroneous
        );
    }

    printEqualsInput(parserInput: ParserInput, ctx: any): boolean {
        return true;
    }

    isAcceptable<P>(v: TreeVisitor<Tree, P>, p: P): boolean {
        return v instanceof ParseErrorVisitor;
    }

    get id(): UUID {
        return this._id;
    }

    withId(id: UUID): ParseError {
        return id === this._id ? this : new ParseError(
            id,
            this._markers,
            this._sourcePath,
            this._fileAttributes,
            this._charsetName,
            this._charsetBomMarked,
            this._checksum,
            this._text,
            this._erroneous
        );
    }

    get markers(): Markers {
        return this._markers;
    }

    withMarkers(markers: Markers): ParseError {
        return markers === this._markers ? this : new ParseError(
            this._id,
            markers,
            this._sourcePath,
            this._fileAttributes,
            this._charsetName,
            this._charsetBomMarked,
            this._checksum,
            this._text,
            this._erroneous
        );
    }

    get sourcePath(): string {
        return this._sourcePath;
    }

    withSourcePath(sourcePath: string): ParseError {
        return sourcePath === this._sourcePath ? this : new ParseError(
            this._id,
            this._markers,
            sourcePath,
            this._fileAttributes,
            this._charsetName,
            this._charsetBomMarked,
            this._checksum,
            this._text,
            this._erroneous
        );
    }

    get fileAttributes(): FileAttributes | null {
        return this._fileAttributes;
    }

    withFileAttributes(fileAttributes: FileAttributes | null): ParseError {
        return fileAttributes === this._fileAttributes ? this : new ParseError(
            this._id,
            this._markers,
            this._sourcePath,
            fileAttributes,
            this._charsetName,
            this._charsetBomMarked,
            this._checksum,
            this._text,
            this._erroneous
        );
    }

    get charsetName(): string | null {
        return this._charsetName;
    }

    withCharsetName(charsetName: string | null): ParseError {
        return charsetName === this._charsetName ? this : new ParseError(
            this._id,
            this._markers,
            this._sourcePath,
            this._fileAttributes,
            charsetName,
            this._charsetBomMarked,
            this._checksum,
            this._text,
            this._erroneous
        );
    }

    get charsetBomMarked(): boolean {
        return this._charsetBomMarked;
    }

    withCharsetBomMarked(charsetBomMarked: boolean): ParseError {
        return charsetBomMarked === this._charsetBomMarked ? this : new ParseError(
            this._id,
            this._markers,
            this._sourcePath,
            this._fileAttributes,
            this._charsetName,
            charsetBomMarked,
            this._checksum,
            this._text,
            this._erroneous
        );
    }

    get checksum(): Checksum | null {
        return this._checksum;
    }

    withChecksum(checksum: Checksum | null): ParseError {
        return checksum === this._checksum ? this : new ParseError(
            this._id,
            this._markers,
            this._sourcePath,
            this._fileAttributes,
            this._charsetName,
            this._charsetBomMarked,
            checksum,
            this._text,
            this._erroneous
        );
    }

    get text(): string {
        return this._text;
    }

    withText(text: string): ParseError {
        return text === this._text ? this : new ParseError(
            this._id,
            this._markers,
            this._sourcePath,
            this._fileAttributes,
            this._charsetName,
            this._charsetBomMarked,
            this._checksum,
            text,
            this._erroneous
        );
    }

    get erroneous(): SourceFile | null {
        return this._erroneous;
    }

    withErroneous(erroneous: SourceFile | null): ParseError {
        return erroneous === this._erroneous ? this : new ParseError(
            this._id,
            this._markers,
            this._sourcePath,
            this._fileAttributes,
            this._charsetName,
            this._charsetBomMarked,
            this._checksum,
            this._text,
            erroneous
        );
    }

    printAll(): string {
        return this.print(new Cursor(null, Cursor.ROOT_VALUE), new PrintOutputCapture(0))
    }

    print<P>(cursor: Cursor, capture: PrintOutputCapture<P>): string {
        this.printer(cursor).visit(this, capture, cursor);
        return capture.out
    }

    printer<T>(cursor: Cursor): TreeVisitor<Tree, PrintOutputCapture<T>> {
        return new ParseErrorPrinter();
    }

    accept<R extends Tree, P>(v: TreeVisitor<R, P>, p: P): R | null {
        return (v as ParseErrorVisitor<P>).visitParseError(this, p) as unknown as R;
    }
}

export class ParseErrorVisitor<P> extends TreeVisitor<Tree, P> {
    isAcceptable(sourceFile: SourceFile, p: P): boolean {
        return sourceFile instanceof ParseError;
    }

    visitParseError(e: ParseError, p: P): ParseError {
        return e.withMarkers(this.visitMarkers(e.markers, p));
    }
}

class ParseErrorPrinter<P> extends ParseErrorVisitor<PrintOutputCapture<P>> {
    public constructor() {
        super();
    }

    visitParseError(e: ParseError, p: PrintOutputCapture<P>): ParseError {
        for (let marker of e.markers.markers) {
            p.append(p.markerPrinter.beforePrefix(marker, new Cursor(this.cursor, marker), it => it))
        }
        this.visitMarkers(e.markers, p);
        for (let marker of e.markers.markers) {
            p.append(p.markerPrinter.beforeSyntax(marker, new Cursor(this.cursor, marker), it => it))
        }
        p.append(e.text);
        for (let marker of e.markers.markers) {
            p.append(p.markerPrinter.afterSyntax(marker, new Cursor(this.cursor, marker), it => it))
        }
        return e;
    }
}