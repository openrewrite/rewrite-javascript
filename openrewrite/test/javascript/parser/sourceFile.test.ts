import {javaScript, rewriteRunWithOptions} from '../testHarness';

describe('source file mapping', () => {
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
