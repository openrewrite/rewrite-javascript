// Import necessary modules and types
import * as fs from 'fs';
import {PathLike} from 'fs';
import {timeNs} from 'process';
import {Result} from './result';
import {
    Checksum,
    Cursor,
    FileAttributes,
    PrinterFactory,
    PrintOutputCapture,
    randomId,
    SourceFile,
    Tree,
    TreeVisitor,
    UUID
} from './tree';
import {ExecutionContext} from './execution';
import {Markers, ParseExceptionResult} from './markers';

// Type variables using generics
type P = any;

// ParserInput class
class ParserInput {
    private readonly _path: PathLike;
    private readonly _fileAttributes: FileAttributes | null;
    private readonly _synthetic: boolean;
    private readonly _source: () => fs.ReadStream;

    constructor(
        path: PathLike,
        fileAttributes: FileAttributes | null,
        synthetic: boolean,
        source: () => fs.ReadStream
    ) {
        this._path = path;
        this._fileAttributes = fileAttributes;
        this._synthetic = synthetic;
        this._source = source;
    }

    get path(): PathLike {
        return this._path;
    }

    get fileAttributes(): FileAttributes | null {
        return this._fileAttributes;
    }

    get synthetic(): boolean {
        return this._synthetic;
    }

    get source(): () => fs.ReadStream {
        return this._source;
    }
}

// ParseError class
class ParseError implements SourceFile {
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
            relativeTo ? input.path.toString().replace(relativeTo.toString(), '') : input.path,
            input.fileAttributes,
            parser.getCharset(ctx),
            false,
            null,
            input.source().read().toString(),
            erroneous
        );
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

    printer<T>(cursor: Cursor): TreeVisitor<Tree, PrintOutputCapture<T>> {
        return PrinterFactory.current().createPrinter(cursor);
    }

    accept(v: TreeVisitor<any, P>, p: P): any | null {
        return (v as ParseErrorVisitor).visitParseError(this, p);
    }

    // Implement other methods required by SourceFile interface
}

// ParseErrorVisitor class
class ParseErrorVisitor extends TreeVisitor<Tree, P> {
    isAcceptable(sourceFile: SourceFile, p: P): boolean {
        return sourceFile instanceof ParseError;
    }

    visitParseError(e: ParseError, p: P): ParseError {
        return e.withMarkers(this.visitMarkers(e.markers, p));
    }
}

// Abstract Parser class
abstract class Parser {
    abstract parseInputs(
        sources: Iterable<ParserInput>,
        relativeTo: PathLike | null,
        ctx: ExecutionContext
    ): Iterable<SourceFile>;

    abstract accept(path: PathLike): boolean;

    abstract sourcePathFromSourceText(prefix: PathLike, sourceCode: string): PathLike;

    parse(
        sourceFiles: Iterable<PathLike>,
        relativeTo: PathLike | null,
        ctx: ExecutionContext
    ): Iterable<SourceFile> {
        const inputs: ParserInput[] = [];
        for (const path of sourceFiles) {
            inputs.push(
                new ParserInput(
                    path,
                    null,
                    false,
                    () => fs.createReadStream(path)
                )
            );
        }
        return this.parseInputs(inputs, relativeTo, ctx);
    }

    parseStrings(...sources: string[]): Iterable<SourceFile> {
        return this.parseStringsWithContext(new ExecutionContext(), ...sources);
    }

    private parseStringsWithContext(ctx: ExecutionContext, ...sources: string[]): Iterable<SourceFile> {
        const inputs: ParserInput[] = sources.map(source => {
            const path = this.sourcePathFromSourceText(timeNs().toString(), source);
            return new ParserInput(
                path,
                null,
                true,
                () => {
                    const stream = new fs.ReadStream(null);
                    stream.push(source);
                    stream.push(null);
                    return stream;
                }
            );
        });
        return this.parseInputs(inputs, null, ctx);
    }

    acceptInput(parserInput: ParserInput): boolean {
        return parserInput.synthetic || this.accept(parserInput.path);
    }

    acceptedInputs(inputs: Iterable<ParserInput>): Iterable<ParserInput> {
        const result: ParserInput[] = [];
        for (const input of inputs) {
            if (this.acceptInput(input)) {
                result.push(input);
            }
        }
        return result;
    }

    reset(): this {
        return this;
    }

    getCharset(ctx: ExecutionContext): string {
        return ctx.getMessage(ExecutionContext.CHARSET, 'utf-8');
    }
}

// Abstract ParserBuilder class
abstract class ParserBuilder {
    protected _sourceFileType: any;
    protected _dslName: string | null;

    get sourceFileType(): any {
        return this._sourceFileType;
    }

    get dslName(): string | null {
        return this._dslName;
    }

    abstract build(): Parser;
}

// Function requirePrintEqualsInput
function requirePrintEqualsInput(
    parser: Parser,
    sourceFile: SourceFile,
    parserInput: ParserInput,
    relativeTo: PathLike | null,
    ctx: ExecutionContext
): SourceFile {
    const required = ctx.getMessage(ExecutionContext.REQUIRE_PRINT_EQUALS_INPUT, true);
    if (required && !sourceFile.printEqualsInput(parserInput, ctx)) {
        const diff = Result.diff(
            parserInput.source().read().toString(),
            sourceFile.printAll(),
            parserInput.path
        );
        return ParseError.build(
            parser,
            parserInput,
            relativeTo,
            ctx,
            new Error(`${sourceFile.sourcePath} is not print idempotent. \n${diff}`),
            sourceFile
        );
    }
    return sourceFile;
}
