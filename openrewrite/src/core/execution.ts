import {createTwoFilesPatch} from 'diff';
import {PathLike} from 'fs';
import {Cursor, SourceFile, TreeVisitor} from "./tree";

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

interface LargeSourceSet {
    edit(map: (source: SourceFile) => SourceFile | null): LargeSourceSet;
    getChangeSet(): RecipeRunResult[];
}

export class InMemoryLargeSourceSet implements LargeSourceSet {
    private readonly initialState?: InMemoryLargeSourceSet;
    private readonly sources: SourceFile[];
    private readonly deletions: SourceFile[];

    constructor(sources: SourceFile[], deletions: SourceFile[] = [], initialState?: InMemoryLargeSourceSet) {
        this.initialState = initialState;
        this.sources = sources;
        this.deletions = deletions;
    }

    edit(map: (source: SourceFile) => SourceFile | null): InMemoryLargeSourceSet {
        const mapped: SourceFile[] = [];
        const deleted: SourceFile[] = this.initialState ? [...this.initialState.deletions] : [];
        let changed = false;

        for (const source of this.sources) {
            const mappedSource = map(source);
            if (mappedSource !== null) {
                mapped.push(mappedSource);
                changed = mappedSource !== source;
            } else {
                deleted.push(source);
                changed = true;
            }
        }

        return changed ? new InMemoryLargeSourceSet(mapped, deleted, this.initialState ?? this) : this;
    }

    getChangeSet(): RecipeRunResult[] {
        const sourceFileById = new Map(this.initialState?.sources.map(sf => [sf.id, sf]));
        const changes: RecipeRunResult[] = [];

        for (const source of this.sources) {
            const original = sourceFileById.get(source.id) || null;
            changes.push(new RecipeRunResult(original, source));
        }

        for (const source of this.deletions) {
            changes.push(new RecipeRunResult(source, null));
        }

        return changes;
    }
}

export class RecipeRunResult {
    constructor(
        public readonly before: SourceFile | null,
        public readonly after: SourceFile | null
    ) {}
}

export class Recipe {
    getVisitor(): TreeVisitor<any, ExecutionContext> {
        return TreeVisitor.noop();
    }

    getRecipeList(): Recipe[] {
        return [];
    }

    run(before: LargeSourceSet, ctx: ExecutionContext): RecipeRunResult[] {
        const lss = this.runInternal(before, ctx, new Cursor(null, Cursor.ROOT_VALUE));
        return lss.getChangeSet();
    }

    runInternal(before: LargeSourceSet, ctx: ExecutionContext, root: Cursor): LargeSourceSet {
        let after = before.edit((beforeFile) => this.getVisitor().visit(beforeFile, ctx, root));
        for (const recipe of this.getRecipeList()) {
            after = recipe.runInternal(after, ctx, root);
        }
        return after;
    }
}

export class RecipeRunException extends Error {
    private readonly _cause: Error;
    private readonly _cursor?: Cursor;

    constructor(cause: Error, cursor?: Cursor) {
        super();
        this._cause = cause;
        this._cursor = cursor;
    }

    get cause(): Error {
        return this._cause;
    }

    get cursor(): Cursor | undefined {
        return this._cursor;
    }
}
