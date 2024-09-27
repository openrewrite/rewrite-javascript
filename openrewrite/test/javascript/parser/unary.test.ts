import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('prefix operator mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('plus', () => {
        rewriteRun(
          //language=typescript
          typeScript('+1')
        );
    });
    test('minus', () => {
        rewriteRun(
          //language=typescript
          typeScript('-1')
        );
    });
    test('not', () => {
        rewriteRun(
          //language=typescript
          typeScript('!1')
        );
    });
    test('tilde', () => {
        rewriteRun(
          //language=typescript
          typeScript('~1')
        );
    });
    test('increment', () => {
        rewriteRun(
          //language=typescript
          typeScript('++1')
        );
    });
    test('decrement', () => {
        rewriteRun(
          //language=typescript
          typeScript('--a;')
        );
    });
});
