import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('call mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('single', () => {
        rewriteRun(
          //language=typescript
          typeScript('parseInt("42")')
        );
    });

    test('multiple', () => {
        rewriteRun(
          //language=typescript
          typeScript('setTimeout(null, 2000, \'Hello\');')
        );
    });

    test('with array literal receiver', () => {
        rewriteRun(
          //language=typescript
          typeScript('[1] . splice(0)')
        );
    });

    test('with call receiver', () => {
        rewriteRun(
          //language=typescript
          typeScript('"1" . substring(0) . substring(0)')
        );
    });

    test('trailing comma', () => {
        rewriteRun(
          //language=typescript
          typeScript('parseInt("42" , )')
        );
    });
});
