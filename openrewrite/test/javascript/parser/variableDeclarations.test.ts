import * as J from "../../../dist/java/tree";
import {javaScript, rewriteRun, rewriteRunWithOptions} from '../testHarness';

describe('variable declaration mapping', () => {
    test('const', () => {
        rewriteRunWithOptions(
          { validatePrintIdempotence: false},
          javaScript(
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
});
