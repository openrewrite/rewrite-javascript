import {connect, disconnect, javaScript, rewriteRun} from '../testHarness';

describe('new mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRun(
          //language=typescript
          javaScript('new Uint8Array(1)')
        );
    });

    test('space', () => {
        rewriteRun(
          //language=typescript
          javaScript('new Uint8Array/*1*/(/*2*/1/*3*/)/*4*/')
        );
    });

    test('multiple', () => {
        rewriteRun(
          //language=typescript
          javaScript('new Date(2023, 9, 25, 10, 30, 15, 500)')
        );
    });

    test('trailing comma', () => {
        rewriteRun(
          //language=typescript
          javaScript('new Uint8Array(1 ,  )')
        );
    });
});
