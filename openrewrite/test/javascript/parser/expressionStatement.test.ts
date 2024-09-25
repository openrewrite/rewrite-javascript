import {connect, disconnect, javaScript, rewriteRunWithOptions} from '../testHarness';

describe('expression statement mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('literal with semicolon', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('1 ;')
        );
    });
    test('multiple', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript(
            //language=ts
            `
                1; // foo
                // bar
                /*baz*/
                2;`
          )
        );
    });
});
