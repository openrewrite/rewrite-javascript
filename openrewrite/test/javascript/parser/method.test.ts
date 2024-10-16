import {connect, disconnect, rewriteRun, rewriteRunWithOptions, typeScript} from '../testHarness';

describe('method mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class Handler {
                  test() {
                      // hello world comment
                  }
              }
          `)
        );
    });


    test('single parameter', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class Handler {
                  test(input) {
                      // hello world comment
                  }
              }
          `)
        );
    });

    test('single typed parameter', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class Handler {
                  test(input: string) {
                      // hello world comment
                  }
              }
          `)
        );
    });

    test('single typed parameter with initializer', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class Handler {
                  test(input  /*asda*/:  string    =    /*8asdas */ "hello world"   ) {
                      // hello world comment
                  }
              }
          `)
        );
    });

    test('single parameter with initializer', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class Handler {
                  test(input =    1) {
                      // hello world comment
                  }
              }
          `)
        );
    });

    test('multi parameters', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class Handler {
                  test(input: string, a = 1, test: number) {
                      // hello world comment
                  }
              }
          `)
        );
    });

    test('parameter with trailing comma', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class Handler {
                  test(input: string    , ) {
                      // hello world comment
                  }
              }
          `)
        );
    });

    test('type parameters', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class Handler {
                  test<T>(input: T    , ) {
                      // hello world comment
                  }
              }
          `)
        );
    });

    // test('type parameters with bounds', () => {
    //     rewriteRun(
    //       //language=typescript
    //       typeScript(`
    //           class Handler {
    //               test<T extends string>(input: T    , ) {
    //                   // hello world comment
    //               }
    //           }
    //       `)
    //     );
    // });

    test('return type', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class Handler {
                  test(input: string    , ) /*1*/ : /*asda*/ string {
                      // hello world comment
                      return input;
                  }
              }
          `)
        );
    });
});
