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

    test('parameter with trailing comma', () => {
      rewriteRun(
        //language=typescript
        typeScript(`
           function  /*1*/   identity  /*2*/    <  Type  , G    ,   C   >       (arg: Type)  /*3*/ :     G  {
            return arg;
          }
        `)
      );
    });

    test.skip('parameter with anonymous type', () => {
      rewriteRun(
        //language=typescript
        typeScript(`
           function create<Type>(c: { new (): Type }): Type {
              return new c();
           }
        `)
      );
    });

    test('function with return type', () => {
        rewriteRun(
            //language=typescript
            typeScript('function f ( a : string ) : void {}')
        );
    });

    test('function type expressions', () => {
        rewriteRun(
            //language=typescript
            typeScript('function greeter(fn: (a: string) => void) { fn("Hello, World"); }')
        );
    });

    test.skip('function expression', () => {
        rewriteRun(
            //language=typescript
            typeScript('const greet = function(name: string): string { return name; }')
        );
    });

    test.skip('function expression with type parameter', () => {
        rewriteRun(
            //language=typescript
            typeScript('const greet = function<T>(name: T): number { return 1; }')
        );
    });
});
