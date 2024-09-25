import {javaScript, rewriteRunWithOptions} from './testHarness';

describe('variable declaration mapping', () => {
    test('literal with semicolon', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('1 ;')
        );
    });
});
