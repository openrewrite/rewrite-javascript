import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('object literal mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('empty', () => {
        rewriteRun(
          //language=typescript
          typeScript('const c = {}')
        );
    });

    test('single', () => {
        rewriteRun(
          //language=typescript
          typeScript('const c = { foo: 1 }')
        );
    });

    test('multiple', () => {
        rewriteRun(
          //language=typescript
          typeScript('const c = { foo: 1, bar: 2 }')
        );
    });
    test('trailing comma', () => {
        rewriteRun(
          //language=typescript
          typeScript('const c = { foo: 1, /*1*/ }')
        );
    });
});
