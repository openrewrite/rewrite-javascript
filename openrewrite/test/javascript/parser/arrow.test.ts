import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('arrow mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('function with simple body', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              const multiply = (a: number, b: number): number => a * b;
          `)
        );
    });

    test('function with empty body', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                const empty = (/*a*/) /*b*/ => {/*c*/};
            `)
        );
    });

    test('function with simple body and comments', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              const multiply = /*0*/ (/*1*/a/*2*/: /*3*/number/*4*/,/*5*/ b: /*6*/ number/*7*/) /*a*/ : /*b*/ number /*c*/ => a * b;
          `)
        );
    });

    test('function with body', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              let sum = (x: number, y: number): number => {
                  return x + y;
              }
          `)
        );
    });

    test('function without params', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              const greet = (/*no*/): string => 'Hello';
          `)
        );
    });

    test('function with implicit return', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              let sum = (x: number, y: number) => x + y;
          `)
        );
    });

    test('function with trailing comma', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                let sum = (x: number, y: number /*a*/, /*b*/) => x + y;
            `)
        );
    });

    test('function with async modifier', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                let sum = async (x: number, y: number ) => x + y;
            `)
        );
    });

    test('basic async arrow function', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                const fetchData = async (): Promise<string> => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve("Data fetched successfully!");
                        }, 2000);
                    });
                };

                // Using the function
                fetchData().then((message) => {
                    console.log(message); // Outputs: Data fetched successfully! (after 2 seconds)
                });
            `)
        );
    });

    test('function with async modifier and comments', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                let sum = /*a*/async /*b*/ (/*c*/x: number, y: number /*d*/) /*e*/ => x + y;
            `)
        );
    });

    test('function with implicit return and comments', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              let sum = (x: number, y: number) /*a*/ => /*b*/ x + y;
          `)
        );
    });

    test('function with default parameter', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              const increment = (value: number, step: number = 1): number => value + step;
          `)
        );
    });

    test('function with default parameter and comments', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              const increment = (value: number, step: /*a*/ number /*b*/ = /*c*/1 /*d*/): number => value + step;
          `)
        );
    });

});
