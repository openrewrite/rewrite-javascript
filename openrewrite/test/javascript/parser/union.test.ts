import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('union type mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRun(
          //language=typescript
          typeScript('let c: number/*1*/|/*2*/undefined/*3*/|/*4*/null')
        );
    });
    test('literals', () => {
        rewriteRun(
          //language=typescript
          typeScript('let c: true | 1 | "foo"')
        );
    });
});
