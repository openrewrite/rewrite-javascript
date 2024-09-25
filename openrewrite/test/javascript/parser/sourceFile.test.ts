import {connect, disconnect, javaScript, rewriteRunWithOptions} from '../testHarness';

describe('source file mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('whitespace after last statement', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript(
            //language=typescript
            `
                1; /* comment 1 */
                // comment 2
            `
          )
        );
    });
});
