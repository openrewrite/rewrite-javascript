import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('as mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('empty interface', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
                interface Empty {}
            `)
        );
    });

    test('interface with export modifier', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              export interface Empty {
                  greet(name: string, surname: string): void;
              }
          `)
        );
    });

    test('interface with declare modifier', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              declare interface Empty {
                  greet(name: string, surname: string): void;
              }
          `)
        );
    });

    test('interface with extends', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Animal {
                  name: string;
              }

              interface Dog extends Animal {
                  breed: string;
              }
          `)
        );
    });

    test('interface with extending multiple interfaces', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface HasLegs {
                  count: string;
              }
              
              interface Animal {
                  name: string;
              }

              interface Dog extends Animal, HasLegs {
                  breed: string;
              }
          `)
        );
    });

    test('interface with properties', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
                interface Person {
                  name: string
                  age: number
                }
            `)
        );
    });

    test('interface with properties with semicolons', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Person {
                  name: string;
                  age: number;
              }
          `)
        );
    });

    test('interface with properties with coma', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Person {
                  name: string,
                  age: number,
              }
          `)
        );
    });

    test('interface with properties with semicolons and comma', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Person {
                  name: string,
                  age: number;
              }
          `)
        );
    });

    test('interface with properties with semicolons, comma and comments', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Person {
                  /*a*/ name /*b*/: /*c*/ string /*d*/ ; /*e*/
                  age: number /*f*/
              }
          `)
        );
    });

    test('interface with methods', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Person {
                  greet(): void;
                  age(): number;
                  name(): string,
                  greet_name: (name: string) => string;
              }
          `)
        );
    });

    test('interface with methods and comments', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Person {
                  /*a*/ greet() /*b*/ :  /*c*/ void /*d*/;
                  age(): number; /*e*/
                  name(): string /*f*/
                  greet_name/*g*/: /*h*/(/*i*/name/*j*/: /*k*/string/*l*/) /*m*/=> /*n*/string  /*o*/;

              }
          `)
        );
    });

    test('interface with properties and methods', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Person {
                  greet(name: string): void
                  name: string
                  name(): string;
                  age: number
                  age(): number;
              }
            `)
        );
    });

    test.skip('interface with get/set methods', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Person {
                  name: string;
                  get age(): number; // Getter for age
                  set age(a: number); // Setter for age
              }
          `)
        );
    });

    test('interface with properties and methods with modifiers ', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Person {
                  greet(name: string): void
                  readonly name: string
              }
          `)
        );
    });

    test.skip('interface with properties and methods with optional ', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Person {
                  greet?(name: string): void
                  readonly name?: string
              }
          `)
        );
    });

    test('interface with properties, methods and comments', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Person {
                  /*a*/ greet(/*1*/name/*2*/: /*3*/string/*4*/, /*5*/ surname: string/*6*/): /*b*/ void /*c*/
                  name /*d*/ : string
                  name(/*11*/name/*22*/: /*33*/string/*44*/): string;
                  age: /*e*/ number /*f*/
                  age(): number;
              }
          `)
        );
    });

    test('interface with function type', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Add {
                  add(): (x: number, y: number) => number;
              }
          `)
        );
    });

    test('interface with function type and zero param', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Add {
                  produce(): () => number;
              }
          `)
        );
    });

    test('interface with function type and several return types', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Add {
                  consume(): () => number /*a*/ | /*b*/ void;
              }
          `)
        );
    });

    test('interface with function type and comments', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Add {
                  /*a*/ add/*b*/(/*c*/)/*d*/ : /*e*/ (/*f*/ x/*g */:/*h*/ number /*i*/, /*j*/y /*k*/: /*l*/ number/*m*/)/*n*/ => /*o*/ number /*p*/;
              }
          `)
        );
    });

    test.skip('interface with call signature', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Add {
                  greet: (name: string) => string;
                  (x: number, y: number): number;
              }
            `)
        );
    });

    test.skip('interface with indexable type', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Add {
                  [index: number]: string
              }
            `)
        );
    });

    test.skip('interface with hybrid types', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              interface Counter {
                  (start: number): string;   // Call signature
                  interval: number;          // Property
                  reset(): void;             // Method
                  [index: number]: string    // Indexable
                  add(): (x: number, y: number) => number; //Function signature
              }
          `)
        );
    });

});
