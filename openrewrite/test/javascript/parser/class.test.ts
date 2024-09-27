import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('class mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('empty', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A {}')
        );
    });
    test('body', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A { foo: number; }')
        );
    });
    test('extends', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A extends Object {}')
        );
    });
    test('implements single', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A implements B {}')
        );
    });
    test('implements multiple', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A implements B , C,D {}')
        );
    });
    test('extends and implements', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A extends Object implements B , C,D {}')
        );
    });
});
