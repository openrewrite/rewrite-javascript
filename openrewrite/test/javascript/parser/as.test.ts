import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('as mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('primitive type', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 as number')
        );
    });
});
