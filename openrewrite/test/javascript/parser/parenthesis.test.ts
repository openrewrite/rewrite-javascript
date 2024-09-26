import {connect, disconnect, javaScript, rewriteRun} from '../testHarness';

describe('parenthesis mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRun(
          javaScript('(1)')
        );
    });

    test('space', () => {
        rewriteRun(
          javaScript('( 1 )')
        );
    });
});
