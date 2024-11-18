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

    test('function with modifiers', () => {
        rewriteRun(
            //language=typescript
            typeScript('export async function f (a =  2 , b) {}')
        );
    });

    test('function with modifiers and comments', () => {
        rewriteRun(
            //language=typescript
            typeScript('/*a*/ export /*b*/ async /*c*/ function /*d*/f /*e*/ (a =  2 , b) {}')
        );
    });

    test('function expression', () => {
        rewriteRun(
            //language=typescript
            typeScript('const greet = function  (name: string) : string { return name; }')
        );
    });

    test('function expression with type parameter', () => {
        rewriteRun(
            //language=typescript
            typeScript('const greet = function<T> (name: T): number { return 1; }')
        );
    });

    test('function expression with type parameter and comments', () => {
        rewriteRun(
            //language=typescript
            typeScript('const greet = /*a*/ function/*b*/ </*c*/T/*d*/>/*e*/(/*g*/name/*h*/:/*j*/T)/*k*/:/*l*/ number /*m*/{ return 1; }')
        );
    });

    test('function with void return type', () => {
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

    test('function with type ref', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                function getLength(arr: Array<string>): number {
                    return arr.length;
                }
            `)
        );
    });

    test('function declaration with obj binding params', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                export function reverseGeocode(
                    {
                        params,
                        method = "get",
                        url = defaultUrl,
                        paramsSerializer = defaultParamsSerializer,
                        ...config
                    }: ReverseGeocodeRequest,
                    axiosInstance: AxiosInstance = defaultAxiosInstance
                ): Promise<ReverseGeocodeResponse> {
                    return axiosInstance({
                        params,
                        method,
                        url,
                        paramsSerializer,
                        ...config,
                    }) as Promise<ReverseGeocodeResponse>;
                }
            `)
        );
    });

    test.skip('function type with parameter', () => {
        rewriteRun(
            //language=typescript
            typeScript('type Transformer<T> = (input: T) => T;')
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

    test('immediately invoked anonymous function', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                (function() {
                    console.log('IIFE');
                })();
        `)
        );
    });
});
