import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('type alias mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple alias', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                type StringAlias = string;
            `)
        );
    });

    test('simple alias with comments', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                /*a*/type /*b*/ StringAlias /*c*/= /*d*/string /*e*/;/*f*/
            `)
        );
    });

    test('function type alias', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                type MyFunctionType = (x: number, y: number) => string;
            `)
        );
    });

    test('generic function type alias', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                type Response<T, R, Y> = (x: T, y: R) => Y;;
            `)
        );
    });

    test('generic type alias with comments', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                /*a*/type/*b*/ Response/*c*/</*d*/T/*e*/> /*f*/ = /*g*/(x: T, y: number) => string;;
            `)
        );
    });

    test('union type', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                type ID = /*a*/ number /*b*/ | /*c*/ string /*d*/;
            `)
        );
    });

    test('union type with comments', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                type ID = number | string;
            `)
        );
    });

    test('construct function type alias', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                type MyConstructor = new (arg: string) => string;
            `)
        );
    });

    test('construct function type alias with comments', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                type MyConstructor = /*a*/new/*b*/ (/*c*/arg: string) => string;
            `)
        );
    });

    test('recursive array type', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                type NestedArray<T> = T | NestedArray<T[]>;
            `)
        );
    });

    test.skip('conditional type', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                type Flatten<T> = T extends (infer R)[] ? Flatten<R> : T;
            `)
        );
    });

    test('construct function type alias with generic', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                type GenericConstructor<T> = new (/*a*/.../*b*/args: any[]) => T;
            `)
        );
    });
});
