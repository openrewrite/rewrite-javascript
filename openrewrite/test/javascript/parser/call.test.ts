import {connect, disconnect, javaScript, rewriteRun} from '../testHarness';

describe('call mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('single', () => {
        rewriteRun(
          //language=typescript
          javaScript('parseInt("42")')
        );
    });

    test('multiple', () => {
        rewriteRun(
          //language=typescript
          javaScript('setTimeout(null, 2000, \'Hello\');')
        );
    });

    test('with array literal receiver', () => {
        rewriteRun(
          //language=typescript
          javaScript('[1] . splice(0)')
        );
    });

    test('with call receiver', () => {
        rewriteRun(
          //language=typescript
          javaScript('"1" . substring(0) . substring(0)')
        );
    });

    test('trailing comma', () => {
        rewriteRun(
          //language=typescript
          javaScript('parseInt("42" , )')
        );
    });
});
