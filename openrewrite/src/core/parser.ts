// Import necessary modules and types
import * as fs from 'fs';
import {FileAttributes, ParseError, SourceFile} from './tree';
import {ExecutionContext, InMemoryExecutionContext, Result} from './execution';

export class ParserInput {
    private readonly _path: string;
    private readonly _fileAttributes: FileAttributes | null;
    private readonly _synthetic: boolean;
    private readonly _source: () => Buffer;

    constructor(
        path: string,
        fileAttributes: FileAttributes | null,
        synthetic: boolean,
        source: () => Buffer
    ) {
        this._path = path;
        this._fileAttributes = fileAttributes;
        this._synthetic = synthetic;
        this._source = source;
    }

    get path(): string {
        return this._path;
    }

    get fileAttributes(): FileAttributes | null {
        return this._fileAttributes;
    }

    get synthetic(): boolean {
        return this._synthetic;
    }

    get source(): () => Buffer {
        return this._source;
    }
}

export abstract class Parser {
    abstract parseInputs(
        sources: Iterable<ParserInput>,
        relativeTo: string | null,
        ctx: ExecutionContext
    ): Iterable<SourceFile>;

    abstract accept(path: string): boolean;

    abstract sourcePathFromSourceText(prefix: string, sourceCode: string): string;

    parse(
        sourceFilesPaths: Iterable<string>,
        relativeTo: string | null,
        ctx: ExecutionContext
    ): Iterable<SourceFile> {
        const inputs: ParserInput[] = [];
        for (const path of sourceFilesPaths) {
            inputs.push(
                new ParserInput(
                    path,
                    null,
                    false,
                    () => fs.readFileSync(path)
                )
            );
        }
        return this.parseInputs(inputs, relativeTo, ctx);
    }

    parseStrings(...sources: string[]): Iterable<SourceFile> {
        return this.parseStringsWithContext(new InMemoryExecutionContext(), ...sources);
    }

    private parseStringsWithContext(ctx: ExecutionContext, ...sources: string[]): Iterable<SourceFile> {
        const inputs: ParserInput[] = sources.map(source => {
            const path = this.sourcePathFromSourceText(performance.now().toString(), source);
            return new ParserInput(
                path,
                null,
                true,
                () => Buffer.from(source)
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

export namespace Parser {
    export abstract class Builder {
        protected _sourceFileType: any;

        get sourceFileType(): any {
            return this._sourceFileType;
        }

        abstract build(): Parser;
    }
}

export function requirePrintEqualsInput(
    parser: Parser,
    sourceFile: SourceFile,
    parserInput: ParserInput,
    relativeTo: string | null,
    ctx: ExecutionContext
): SourceFile {
    const required = ctx.getMessage(ExecutionContext.REQUIRE_PRINT_EQUALS_INPUT, true);
    if (required && !sourceFile.printEqualsInput(parserInput, ctx)) {
        const diff = Result.diff(
            parserInput.source().toString(),
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
