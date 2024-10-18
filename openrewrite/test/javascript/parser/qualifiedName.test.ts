import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('empty mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('globalThis qualified name', () => {
        rewriteRun(
          //language=typescript
          typeScript('const value: globalThis.Number = 1')
        );
    });

    test.skip('nested class qualified name', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class OuterClass {
                public static InnerClass = class extends Number { };
              }
              const a: typeof OuterClass.InnerClass.prototype = 1;
          `)
        );
    });

    test.skip('namespace qualified name', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              namespace TestNamespace { 
                export class Test {} 
              };
              const value: TestNamespace.Test = null;
          `)
        );
    });

    test.skip('enum qualified name', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              enum Test {
                  A
              };

              const val: Test.A = Test.A;
          `)
        );
    });
});
