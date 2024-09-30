import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('if mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRun(
          //language=typescript
          typeScript('if (true) console.log("foo");')
        );
    });
});
