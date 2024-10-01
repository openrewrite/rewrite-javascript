import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('for mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('indexed', () => {
        rewriteRun(
          //language=typescript
          typeScript('for (let i = 0; i < 10; i++) ;')
        );
    });
    test('indexed multiple variables', () => {
        rewriteRun(
          //language=typescript
          typeScript('for (let /*0*/ i /*1*/ = /*2*/ 0 /*3*/ , j = 0; i < 10; i++) ;')
        );
    });
});
