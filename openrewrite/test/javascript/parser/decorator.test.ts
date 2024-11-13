import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('class decorator mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('unqualified', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo class A {}')
        );
    });
    test('unqualified parens', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo( ) class A {}')
        );
    });
    test('qualified', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo . bar class A {}')
        );
    });
    test('qualified parens', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo . bar ( ) class A {}')
        );
    });
});

// according to TypeScript documentation decorators are not allowed with
// standalone functions https://www.typescriptlang.org/docs/handbook/decorators.html
describe.skip('function decorator mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('unqualified', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo function f() {}')
        );
    });
    test('unqualified parens', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo( ) function f() {}')
        );
    });
    test('qualified', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo . bar function f() {}')
        );
    });
    test('qualified parens', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo . bar ( ) function f() {}')
        );
    });
});
