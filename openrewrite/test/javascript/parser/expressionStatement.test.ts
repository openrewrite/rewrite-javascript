import {connect, disconnect, rewriteRunWithOptions, typeScript} from '../testHarness';

describe('expression statement mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('literal with semicolon', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          typeScript('1 ;')
        );
    });
    test('multiple', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          typeScript(
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
