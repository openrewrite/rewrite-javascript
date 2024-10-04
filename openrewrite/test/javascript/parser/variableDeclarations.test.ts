import * as J from "../../../dist/src/java";
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
                    expect(statement).toBeInstanceOf(J.VariableDeclarations);
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
                    expect(statement).toBeInstanceOf(J.VariableDeclarations);
                });
                cu.padding.statements.forEach(statement => {
                    expect(statement.after.comments).toHaveLength(0);
                    expect(statement.after.whitespace).toBe('');
                });
            })
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
          typeScript('let a: number =2, b: string = "2" ')
        );
    });
});
