import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('assignment mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRun(
          //language=typescript
          typeScript('foo = 1')
        );
    });
});
