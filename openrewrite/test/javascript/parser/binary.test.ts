import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('arithmetic operator mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('plus', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 + 2')
        );
    });

    test('minus', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 - 2')
        );
    });

    test('multiply', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 * 2')
        );
    });

    test('divide', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 / 2')
        );
    });

    test('modulo', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 % 2')
        );
    });

    test('left shift', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 << 2')
        );
    });

    test('right shift', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 >> 2')
        );
    });

    test('unsigned right shift', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 >>> 2')
        );
    });
});

describe('bitwise operator mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('and', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 & 2')
        );
    });
    test('or', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 | 2')
        );
    });
    test('xor', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 ^ 2')
        );
    });
});

describe('relational operator mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('less than', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 < 2')
        );
    });
    test('less than or equal', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 <= 2')
        );
    });
    test('greater than', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 > 2')
        );
    });
    test('greater than or equal', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 >= 2')
        );
    });
    test('equal', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 == 2')
        );
    });
    test('not equal', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 != 2')
        );
    });

    test('strict equal', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 === 2')
        );
    });
    test('strict not equal', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 !== 2')
        );
    });
})

describe('boolean operator mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('and', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 && 2')
        );
    });
    test('or', () => {
        rewriteRun(
          //language=typescript
          typeScript('1 || 2')
        );
    });
});
