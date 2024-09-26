import {connect, disconnect, javaScript, rewriteRun} from '../testHarness';

describe('parenthesis mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('empty', () => {
        rewriteRun(
          //language=typescript
          javaScript('[]')
        );
    });

    test('single', () => {
        rewriteRun(
          //language=typescript
          javaScript('[ 1 ]')
        );
    });

    test('two', () => {
        rewriteRun(
          //language=typescript
          javaScript('[ 1 , 2 ]')
        );
    });

    test('trailing comma', () => {
        rewriteRun(
          //language=typescript
          javaScript('[ 1 , 2 , ]')
        );
    });
});
