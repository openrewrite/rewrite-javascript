import {connect, disconnect, rewriteRun, rewriteRunWithOptions, typeScript} from '../testHarness';

describe('class mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('empty', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A {}')
        );
    });
    test('type parameter', () => {
        rewriteRunWithOptions(
          {expectUnknowns: true},
          //language=typescript
          typeScript('class A<T> {}')
        );
    });
    test('body', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A { foo: number; }')
        );
    });
    test('extends', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A extends Object {}')
        );
    });
    test('implements single', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A implements B {}')
        );
    });
    test('implements multiple', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A implements B , C,D {}')
        );
    });
    test('extends and implements', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A extends Object implements B , C,D {}')
        );
    });
    test('export', () => {
        rewriteRun(
          //language=typescript
          typeScript('export class A {}')
        );
    });
    test('public', () => {
        rewriteRun(
          //language=typescript
          typeScript('public class A {}')
        );
    });
    test('export default', () => {
        rewriteRun(
          //language=typescript
          typeScript('export default class A {}')
        );
    });

    test('class with properties', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
                class X {
                    a = 5
                    b = 6
                }
          `)
        );
    });

    test('class with properties and semicolon', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
               class X {
                  a = 5;
                  b = 6;
              } /*asdasdas*/
              //asdasf
          `)
        );
    });

    test('class with mixed properties with semicolons', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class X {

                  b = 6
                  c = 10;
                  a /*asdasd*/ =  /*abc*/   5
                  d = "d";

              } /*asdasdas*/
              //asdasf
          `)
        );
    });

    test('class with properties, semicolon, methods, comments', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
                class X {
                    a /*asdasd*/ =  /*abc*/   5;
                    b = 6;

                    // method 1
                    abs(): string{
                        return "1";
                    }

                    //method 2
                    max(): number {
                        return 2;
                    }
                } /*asdasdas*/ 
                //asdasf
          `)
        );
    });

    test('class with several typed properties', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
                class X {
                   
                    b: number = 6
                    c: string = "abc";
                    a /*asdasd*/ =  /*abc*/   5
                    
                } /*asdasdas*/ 
                //asdasf
          `)
        );
    });

    test('class with reference-typed property', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class X {

                  a: globalThis.Promise<string> = null;
                  b: number = 6;
                  c /*asdasd*/ =  /*abc*/   5

              } /*asdasdas*/
              //asdasf
          `)
        );
    });

    test('class with typed properties, modifiers, comments', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              class X /*abc*/ {
                  public name   /*asdasda*/    :  /*dasdasda*/   string;
                  private surname   /*asdasda*/    :  /*dasdasda*/   string =  "abc";
                  b: number /* abc */ = 6;
                  c = 10;
                  a /*asdasd*/ =  /*abc*/   5
                 
              }
              //asdasf
          `)
        );
    });
});
