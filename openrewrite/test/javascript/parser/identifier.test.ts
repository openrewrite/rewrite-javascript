import {connect, disconnect, javaScript, rewriteRunWithOptions} from '../testHarness';

describe('literal mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('foo')
        );
    });
});
