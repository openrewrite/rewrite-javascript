import {javaScript, rewriteRunWithOptions} from './testHarness';

describe('expression statement mapping', () => {
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
                1 ; // foo
                2 ;`
          )
        );
    });
});
