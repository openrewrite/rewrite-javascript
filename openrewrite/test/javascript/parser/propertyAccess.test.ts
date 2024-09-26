import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('property access mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('with array literal receiver', () => {
        rewriteRun(
          //language=typescript
          typeScript('[1] . length')
        );
    });

    test('with array literal receiver', () => {
        rewriteRun(
          //language=typescript
          typeScript('foo . bar . baz')
        );
    });
});
