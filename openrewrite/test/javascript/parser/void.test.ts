import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('void operator mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('void', () => {
        rewriteRun(
          //language=typescript
          typeScript('void 1')
        );
    });
});
