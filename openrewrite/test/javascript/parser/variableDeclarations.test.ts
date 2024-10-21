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
});
