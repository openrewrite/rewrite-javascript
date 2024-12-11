import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('if mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRun(
          //language=typescript
          typeScript('if (true) console.log("foo");')
        );
    });
    test('braces', () => {
        rewriteRun(
          //language=typescript
          typeScript('if (true) { console.log("foo"); }')
        );
    });
    test('else', () => {
        rewriteRun(
          //language=typescript
          typeScript('if (true) console.log("foo"); else console.log("bar");')
        );
    });

    test('if-else with semicolon', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                if (true) {
                    console.log("foo");
                } else
                    console.log("bar");
            `)
        );
    });
});
