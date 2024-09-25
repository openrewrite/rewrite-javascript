import {connect, disconnect, javaScript, rewriteRunWithOptions} from '../testHarness';

describe('this mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('this')
        );
    });
});
