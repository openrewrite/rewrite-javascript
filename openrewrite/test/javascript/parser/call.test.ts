import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('call mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('single', () => {
        rewriteRun(
          //language=typescript
          typeScript('parseInt("42")')
        );
    });

    test('multiple', () => {
        rewriteRun(
          //language=typescript
          typeScript('setTimeout(null, 2000, \'Hello\');')
        );
    });

    test('with array literal receiver', () => {
        rewriteRun(
          //language=typescript
          typeScript('[1] . splice(0)')
        );
    });

    test('with call receiver', () => {
        rewriteRun(
          //language=typescript
          typeScript('"1" . substring(0) . substring(0)')
        );
    });

    test('trailing comma', () => {
        rewriteRun(
          //language=typescript
          typeScript('parseInt("42" , )')
        );
    });

    test('with optional chaining operator', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                const func = (message: string) => message;
                const result1 = func/*a*/?./*b*/("TS"); // Invokes the function
            `)
        );
    });

    test('call expression with type parameters', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                function identity<T>(value: T): T {
                    return value;
                }

                const result = identity<string>("Hello TypeScript");
            `)
        );
    });

    test('call expression with type parameters and comments', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                function identity<T>(value: T): T {
                    return value;
                }

                const result = /*a*/identity/*b*/</*c*/string/*d*/>/*e*/("Hello TypeScript");
            `)
        );
    });

    test('call expression with type parameters and optional chaining operator', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                function identity<T>(value: T): T {
                    return value;
                }

                const result1 = identity<string>?.("Hello TypeScript");
                const result2 = identity?.<string>("Hello TypeScript");
            `)
        );
    });

    test('call expression with type parameters and optional chaining operator with comments', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                function identity<T>(value: T): T {
                    return value;
                }

                const result1 = /*a*/identity/*b*/<string>/*c*/?./*d*/("Hello TypeScript");
                const result2 = /*a*/identity/*b*/?./*c*/<string>/*d*/("Hello TypeScript");
            `)
        );
    });

});
