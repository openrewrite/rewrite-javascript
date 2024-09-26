import {connect, disconnect, javaScript, rewriteRun} from '../testHarness';

describe('literal mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRun(
          javaScript('foo')
        );
    });

    test('private', () => {
        rewriteRun(
          javaScript('#foo')
        );
    });
});
