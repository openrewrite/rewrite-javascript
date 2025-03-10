import {
    connect,
    disconnect,
    rewriteRunWithRecipe,
    rewriteRunWithRecipeAndOptions,
    typeScript
} from '../testHarness';
import {BlankLinesFormatVisitor} from "../../../dist/src/javascript/format/blankLines";
import {NormalizeFormatVisitor} from "../../../dist/src/javascript/format/normalizeSpaces";
import {fromVisitor, RecipeSpec} from "../recipeHarness";
import {IntelliJ} from "../../../dist/src/javascript/style";

describe('blank lines format test', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('leading blank lines', () => {
        rewriteRunWithRecipeAndOptions(
            {normalizeIndent: false},
            new RecipeSpec().withRecipe(fromVisitor(new BlankLinesFormatVisitor(IntelliJ.TypeScript.blankLines()))),
            //language=typescript
            typeScript(
`

let printed = print("sourceFile");`,
'let printed = print("sourceFile");'
            )
        );
    });

    test('blank lines after import and variables', () => {
        rewriteRunWithRecipe(
            new RecipeSpec()
                .withRecipes(
                    fromVisitor(new NormalizeFormatVisitor()),
                    fromVisitor(new BlankLinesFormatVisitor(IntelliJ.TypeScript.blankLines()))
                ),
            //language=typescript
            typeScript(`
                    import {Component} from 'React'
                    import {add, subtract} from 'utils';
                    /*a*/
                    const x = 10;
                `,
                `
                    import {Component} from 'React'
                    import {add, subtract} from 'utils';

                    /*a*/
                    const x = 10;
                `
            )
        );
    });

    test('blank lines exists after import and variables', () => {
        rewriteRunWithRecipe(
            new RecipeSpec()
                .withRecipes(
                    fromVisitor(new NormalizeFormatVisitor()),
                    fromVisitor(new BlankLinesFormatVisitor(IntelliJ.TypeScript.blankLines()))
                ),
            //language=typescript
            typeScript(`
                    import {Component} from 'React'
                    import {add, subtract} from 'utils';

                    const x = 10;
                `,
                `
                    import {Component} from 'React'
                    import {add, subtract} from 'utils';

                    const x = 10;
                `
            )
        );
    });

    test('blank lines exists after import and variables large maximum', () => {
        rewriteRunWithRecipe(
            new RecipeSpec()
                .withRecipes(
                    fromVisitor(new NormalizeFormatVisitor()),
                    fromVisitor(new BlankLinesFormatVisitor(IntelliJ.TypeScript.blankLines()))
                ),
            //language=typescript
            typeScript(`
                    import {Component} from 'React'
                    import {add, subtract} from 'utils';



                    const x = 10;
                `,
                `
                    import {Component} from 'React'
                    import {add, subtract} from 'utils';


                    const x = 10;
                `
            )
        );
    });

    test('blank lines after import and function', () => {
        rewriteRunWithRecipe(
            new RecipeSpec().withRecipe(fromVisitor(new BlankLinesFormatVisitor(IntelliJ.TypeScript.blankLines()))),
            //language=typescript
            typeScript(`
                    import {Component} from 'React'
                    import {add, subtract} from 'utils';
                    function f() {
                    }
                `,
                `
                    import {Component} from 'React'
                    import {add, subtract} from 'utils';

                    function f() {
                    }
                `
            )
        );
    });

    test('blank lines before function, class, interface', () => {
        rewriteRunWithRecipe(
            new RecipeSpec().withRecipe(fromVisitor(new BlankLinesFormatVisitor(IntelliJ.TypeScript.blankLines()))),
            //language=typescript
            typeScript(`
                    const x = 10;
                    function f() {
                    }
                    const y = 10;
                    class Foo {}
                    const z = 10;
                    interface I {}
                    const h = 10;
                `,
                `
                    const x = 10;

                    function f() {
                    }

                    const y = 10;

                    class Foo {}

                    const z = 10;

                    interface I {}

                    const h = 10;
                `
            )
        );
    });


    test('blank lines around class methods', () => {
        rewriteRunWithRecipe(
            new RecipeSpec().withRecipe(fromVisitor(new BlankLinesFormatVisitor(IntelliJ.TypeScript.blankLines()))),
            //language=typescript
            typeScript(`
                    class Foo {
                        x = 10;

                        foo() {}

                        y? = 10;
                    }

                    class Foo2 {
                        x = 10;
                        foo() {}
                        y? = 10;
                    }
                `,
                `
                    class Foo {
                        x = 10;

                        foo() {}

                        y? = 10;
                    }

                    class Foo2 {
                        x = 10;

                        foo() {}

                        y? = 10;
                    }
                `
            )
        );
    });


    test('blank lines around interface methods', () => {
        rewriteRunWithRecipe(
            new RecipeSpec().withRecipe(fromVisitor(new BlankLinesFormatVisitor(IntelliJ.TypeScript.blankLines()))),
            //language=typescript
            typeScript(`
                    interface Foo {
                        field1: number;
                        foo(): void;
                        field2: number;
                    }

                    interface Foo2 {
                        field1: number;

                        foo(): void;

                        field2: number;
                    }
                `,
                `
                    interface Foo {
                        field1: number;

                        foo(): void;

                        field2: number;
                    }

                    interface Foo2 {
                        field1: number;

                        foo(): void;

                        field2: number;
                    }
                `
            )
        );
    });

    test('blank lines', () => {
        rewriteRunWithRecipeAndOptions(
            {normalizeIndent: false},
            new RecipeSpec().withRecipe(fromVisitor(new BlankLinesFormatVisitor(IntelliJ.TypeScript.blankLines()))),
            //language=typescript
            typeScript(`
                    /**
                     * This is a sample file
                     */
                    import {Component} from 'React'
                    import {add, subtract} from 'utils';
                    class Foo {
                        field1 = 1;
                        field2 = 2;

                        foo() {
                            console.log('foo')
                        }

                        static bar() {
                            function hello(n) {
                                console.log('hello ' + n)
                            }

                            var x = 1;



                            while (x < 10) {
                                hello(x)
                            }
                        }
                    }

                    interface IFoo {
                        field: number
                        field2: number

                        foo(): void;
                    }`,
                `
                    /**
                     * This is a sample file
                     */
                    import {Component} from 'React'
                    import {add, subtract} from 'utils';

                    class Foo {
                        field1 = 1;
                        field2 = 2;

                        foo() {
                            console.log('foo')
                        }

                        static bar() {
                            function hello(n) {
                                console.log('hello ' + n)
                            }

                            var x = 1;


                            while (x < 10) {
                                hello(x)
                            }
                        }
                    }

                    interface IFoo {
                        field: number
                        field2: number

                        foo(): void;
                    }`
            )
        );
    });
});
