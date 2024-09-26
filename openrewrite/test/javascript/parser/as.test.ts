import {connect, disconnect, javaScript, rewriteRun} from '../testHarness';

describe('as mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('primitive type', () => {
        rewriteRun(
          //language=typescript
          javaScript('1 as number')
        );
    });
});
