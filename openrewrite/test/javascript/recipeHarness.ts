import {
    Cursor,
    InMemoryExecutionContext,
    isParseError,
    ParseExceptionResult,
    ParserInput,
    PrinterFactory,
    PrintOutputCapture,
    RecipeRunException,
    SourceFile,
    Tree,
    TreeVisitor,
    ExecutionContext,
    Recipe,
    InMemoryLargeSourceSet,
    RecipeRunResult
} from '../../dist/src/core';

export class RecipeSpec {
    private readonly _recipe?: Recipe;

    constructor(recipe?: Recipe) {
        this._recipe = recipe;
    }

    get recipe(): Recipe | undefined {
        return this._recipe;
    }

    withRecipe(recipe: Recipe): RecipeSpec {
        return recipe === this._recipe ? this : new RecipeSpec(recipe);
    }
}

export class AdHocRecipe extends Recipe {
    constructor(private readonly visitor: TreeVisitor<any, ExecutionContext>) {
        super();
    }

    getVisitor(): TreeVisitor<any, ExecutionContext> {
        return this.visitor;
    }
}

export function fromVisitor(visitor: TreeVisitor<any, any>): Recipe {
    return new AdHocRecipe(visitor);
}
