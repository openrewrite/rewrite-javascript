import {connect, disconnect, javaScript, rewriteRun} from '../testHarness';

describe('property access mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('with array literal receiver', () => {
        rewriteRun(
          //language=typescript
          javaScript('[1] . length')
        );
    });

    test('with array literal receiver', () => {
        rewriteRun(
          //language=typescript
          javaScript('foo . bar . baz')
        );
    });
});
