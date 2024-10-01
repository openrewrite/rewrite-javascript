import {connect, disconnect, rewriteRun, rewriteRunWithOptions, typeScript} from '../testHarness';

describe('function mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRun(
          //language=typescript
          typeScript('function f () { let c = 1; }')
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
          typeScript('function f(a /*0*/ : /*1*/ number /*2*/ = /*3*/ 2 /*4*/ ) {}')
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
    test('parameter with trailing comma', () => {
        rewriteRun(
          //language=typescript
          typeScript('function f(a  , ) {}')
        );
    });
});
