import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('array literal mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('empty', () => {
        rewriteRun(
          //language=typescript
          typeScript('[ ]')
        );
    });

    test('single', () => {
        rewriteRun(
          //language=typescript
          typeScript('[ 1 ]')
        );
    });

    test('two', () => {
        rewriteRun(
          //language=typescript
          typeScript('[ 1 , 2 ]')
        );
    });

    test('trailing comma', () => {
        rewriteRun(
          //language=typescript
          typeScript('[ 1 , 2 , ]')
        );
    });
});
