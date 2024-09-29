import {connect, disconnect, rewriteRun, rewriteRunWithOptions, typeScript} from '../testHarness';

describe('class mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('empty', () => {
        rewriteRun(
          //language=typescript
          typeScript('class A {}')
        );
    });
    test('decorator', () => {
        rewriteRunWithOptions(
          {expectUnknowns: true},
          //language=typescript
          typeScript('@foo class A {}')
        );
    });
    test('type parameter', () => {
        rewriteRunWithOptions(
          {expectUnknowns: true},
          //language=typescript
          typeScript('class A<T> {}')
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
    test('export', () => {
        rewriteRun(
          //language=typescript
          typeScript('export class A {}')
        );
    });
    test('public', () => {
        rewriteRun(
          //language=typescript
          typeScript('public class A {}')
        );
    });
    test('export default', () => {
        rewriteRun(
          //language=typescript
          typeScript('export default class A {}')
        );
    });
});
