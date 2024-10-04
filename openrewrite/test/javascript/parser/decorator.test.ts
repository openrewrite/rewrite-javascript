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

describe('function decorator mapping', () => {
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
