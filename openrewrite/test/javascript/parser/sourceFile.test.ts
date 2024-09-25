import {javaScript, rewriteRunWithOptions} from './testHarness';

describe('source file mapping', () => {
    test('whitespace after last statement', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('1 ; // comment')
        );
    });
});
