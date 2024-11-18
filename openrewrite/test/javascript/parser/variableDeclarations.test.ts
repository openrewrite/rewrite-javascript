import * as J from "../../../dist/src/java";
import * as JS from "../../../dist/src/javascript";
import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('variable declaration mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('const', () => {
        rewriteRun(
          typeScript(
            //language=javascript
            `
                const c = 1;
                /* c1*/  /*c2 */
                const d = 1;
            `, cu => {
                expect(cu).toBeDefined();
                expect(cu.statements).toHaveLength(2);
                cu.statements.forEach(statement => {
                    expect(statement).toBeInstanceOf(JS.ScopedVariableDeclarations);
                });
                cu.padding.statements.forEach(statement => {
                    expect(statement.after.comments).toHaveLength(0);
                    expect(statement.after.whitespace).toBe('');
                });
            })
        );
    });
    test('const2', () => {
        rewriteRun(
          typeScript(
            //language=javascript
            `
                const c = 1;
                /* c1*/  /*c2 */
                const d = 1;
            `, cu => {
                expect(cu).toBeDefined();
                expect(cu.statements).toHaveLength(2);
                cu.statements.forEach(statement => {
                    expect(statement).toBeInstanceOf(JS.ScopedVariableDeclarations);
                });
                cu.padding.statements.forEach(statement => {
                    expect(statement.after.comments).toHaveLength(0);
                    expect(statement.after.whitespace).toBe('');
                });
            })
        );
    });
    test('typed', () => {
        rewriteRun(
          //language=typescript
          typeScript('let a : number =2')
        );
    });
    test('typed unknown', () => {
        rewriteRun(
          //language=typescript
          typeScript('const a : unknown')
        );
    });
    test('typed any', () => {
        rewriteRun(
          //language=typescript
          typeScript('let a : any = 2;')
        );
    });
    test('multi', () => {
        rewriteRun(
          //language=typescript
          typeScript('let a=2, b=2 ')
        );
    });
    test('multi typed', () => {
        rewriteRun(
          //language=typescript
          typeScript('  /*0.1*/  let  /*0.2*/    a   /*1*/ :      /*2*/  number =2    /*3*/ , /*4*/   b   /*5*/:/*6*/    /*7*/string  /*8*/   =/*9*/    "2" /*10*/  ; //11')
        );
    });
    test('exported variables', () => {
        rewriteRun(
          //language=typescript
          typeScript(' export /*0.1*/  let  /*0.2*/    a   /*1*/ :      /*2*/  number =2    /*3*/ , /*4*/   b   /*5*/:/*6*/    /*7*/string  /*8*/   =/*9*/    "2" /*10*/  ; //11')
        );
    });

    test('declaration with destruction', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                /*0*/
                const /*1*/  {   Client   ,  Status }  /*2*/ =/*3*/  require("../src");
            `),
            //language=typescript
            typeScript(`
                const obj =  {  a   :   1, b       : { c: 2 } };
                const { a } = obj; // a is constant
                let {
                  /*1*/ b /*2*/:/*3*/ { /*4*/c  /*5*/: /*6*/ d /*7*/} /***/,
                } = obj; // d is re-assignable
            `),
            //language=typescript
            typeScript(`
                const numbers = [];
                const obj = { a: 1, b: 2 };
                ({ a: numbers[0], b: numbers[1] } = obj);
            `),
            //language=typescript
            typeScript(`
                const numbers = [];
                const obj = { a: 1, b: 2 };
                ({ a: numbers[0], b: numbers[1] } = obj);
            `),
            //language=typescript
            typeScript(`
                /*1*/ const /*2*/  {  /*3*/ a/*4*/  :/*5*/  aa /*6*/  = /*7*/  10 /*8*/ , /*9*/  b /*10*/ :  /*11*/ bb = {  } /*12*/ ,  /*13*/ } = { a: 3 };
            `)
        );
    });
});
