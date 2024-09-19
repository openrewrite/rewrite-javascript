import {createTwoFilesPatch} from 'diff';
import {PathLike} from 'fs';
import {Cursor, TreeVisitor} from "./tree";

export class Result {
    static diff(before: string, after: string, path: PathLike): string {
        const beforeFileName = path.toString();
        const afterFileName = path.toString();

        // Generate the unified diff
        const patch = createTwoFilesPatch(
            beforeFileName, // fromFile
            afterFileName,  // toFile
            before,         // fromString
            after,          // toString
            '',             // fromFileHeader (optional)
            '',             // toFileHeader (optional)
            {context: 3}  // options (e.g., number of context lines)
        );

        return patch;
    }
}

export interface ExecutionContext {
    getMessage<T>(key: string, defaultValue?: T | null): T;

    putMessage(key: string, value: any): void;
}

export namespace ExecutionContext {
    export const REQUIRE_PRINT_EQUALS_INPUT: string = "org.openrewrite.requirePrintEqualsInput";
    export const CHARSET: string = "org.openrewrite.parser.charset";
}


export class InMemoryExecutionContext implements ExecutionContext {

    private readonly _messages: Map<string, any> = new Map();

    getMessage<T>(key: string, defaultValue?: T | null): T {
        return this._messages.get(key) ?? defaultValue;
    }

    putMessage(key: string, value: any): void {
        this._messages.set(key, value);
    }
}

export class DelegatingExecutionContext implements ExecutionContext {
    public constructor(private readonly _delegate: ExecutionContext) {
    }

    getMessage<T>(key: string, defaultValue?: T | null): T {
        return this._delegate.getMessage(key, defaultValue);
    }

    putMessage(key: string, value: any) {
        this._delegate.putMessage(key, value);
    }
}

export class Recipe {
    getVisitor(): TreeVisitor<any, ExecutionContext> {
        return TreeVisitor.noop();
    }
}

export class RecipeRunException extends Error {
    private readonly _cause: Error;
    private _cursor: Cursor | undefined;

    constructor(cause: Error, cursor?: Cursor) {
        super();
        this._cause = cause;
        this._cursor = cursor;
    }
}