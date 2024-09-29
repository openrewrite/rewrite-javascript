import {connect, disconnect, rewriteRun, rewriteRunWithOptions, typeScript} from '../testHarness';

describe('class mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRun(
          //language=typescript
          typeScript('function f () { }')
        );
    });
    test('single parameter', () => {
        rewriteRun(
          //language=typescript
          typeScript('function f(a) {}')
        );
    });
    test('single typed parameter', () => {
        rewriteRun(
          //language=typescript
          typeScript('function f(a : number) {}')
        );
    });
    test('single typed parameter with initializer', () => {
        rewriteRun(
          //language=typescript
          typeScript('function f(a : number =  2) {}')
        );
    });
    test('single parameter with initializer', () => {
        rewriteRun(
          //language=typescript
          typeScript('function f(a =  2) {}')
        );
    });
    test('two parameters', () => {
        rewriteRun(
          //language=typescript
          typeScript('function f(a =  2 , b) {}')
        );
    });
});
