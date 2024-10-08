import {connect, disconnect, rewriteRun, rewriteRunWithOptions, typeScript} from '../testHarness';

describe('function mapping', () => {
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

    test('multiple type parameters', () => {
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
});
