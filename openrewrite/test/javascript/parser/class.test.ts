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


    test('class with simple ctor', () => {
        rewriteRun(
          //language=typescript
          typeScript(`class A {
              constructor() {
              }
          }`)
        );
    });

    test('class with private ctor', () => {
        rewriteRun(
            //language=typescript
            typeScript(`class A {
              /*0*/     private      /*1*/   constructor  /*2*/    (    /*3*/  )  /*4*/     {
              }
          }`)
        );
    });

    test('class with parametrized ctor', () => {
        rewriteRun(
            //language=typescript
            typeScript(`class A {
                    /*1*/   constructor  /*2*/    (  a,  /*3*/   b   :     string, /*4*/    c     /*5*/     ) {
              }
          }`)
        );
    });

    test('class with optional properties, ctor and modifiers', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                class Employee {
                    public id: number;
                    protected name: string;
                    private department?: string; // Optional property

                    constructor(id: number, name: string, department?: string) {
                        this.id = id;
                        this.name = name;
                        this.department = department;
                    }
                }
          `)
        );
    });

    test('class with optional properties and methods', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                class Person {
                    name: string;
                    age?: number;              // Optional property
                    greetFirst ?: () => void;   // Optional method
                    greetSecond ?(): string;    // Optional method
                }
            `)
        );
    });

    test('class with get/set accessors', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                class Person {
                    private _name = '';

                    // Getter
                    public get name(): string {
                        return this._name;
                    }

                    Setter
                    set name(value: string) {
                        this._name = value;
                    }
                }
            `)
        );
    });

    test('class with get/set accessors with comments', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                class Person {
                    private _name = '';

                    // Getter
                    public /*a*/ get /*b*/ name/*c*/(/*d*/): string {
                        return this._name;
                    }

                    // Setter
                    public /*a*/ set /*b*/ name/*c*/(/*d*/value/*e*/: /*f*/ string /*g*/) {
                        this._name = value;
                    }
                }
            `)
        );
    });

    test.skip('class with static blocks', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                class Example {
                    static valueA: number;
                    static valueB: number;

                    static {
                        this.valueA = 10;
                        console.log("Static block 1 executed. valueA:", this.valueA);
                    }

                    static {
                        this.valueB = this.valueA * 2;
                        console.log("Static block 2 executed. valueB:", this.valueB);
                    }
                }
          `)
        );
    });

});
