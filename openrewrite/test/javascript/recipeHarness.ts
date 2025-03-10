import {
    TreeVisitor,
    ExecutionContext,
    Recipe,
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

    withRecipes(...recipes: Recipe[]): RecipeSpec {
        return new RecipeSpec(new CompositeRecipe(recipes));
    }

}

export class CompositeRecipe extends Recipe {
    readonly recipes: Iterable<Recipe>;

    constructor(recipes: Iterable<Recipe>) {
        super();
        this.recipes = recipes;
    }

    override getRecipeList(): Recipe[] {
        return Array.from(this.recipes);
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
