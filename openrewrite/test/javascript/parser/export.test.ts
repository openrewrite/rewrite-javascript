import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('export keyword tests', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('module.export', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                const nxPreset = require('@nx/jest/preset').default;

                module.exports = { ...nxPreset };
            `)
        );
    });
});


