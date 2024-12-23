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

    test('simple with comments', () => {
        rewriteRun(
            //language=typescript
            typeScript('/*a*/if /*b*/(/*c*/true/*d*/)/*e*/ console.log("foo")/*f*/;/*g*/')
        );
    });

    test('braces', () => {
        rewriteRun(
          //language=typescript
          typeScript('if (true) /*a*/{/*b*/ console.log("foo")/*c*/; /*d*/}/*e*/')
        );
    });
    test('else', () => {
        rewriteRun(
          //language=typescript
          typeScript('if (true) console.log("foo"); /*a*/ else/*b*/ console.log("bar")/*c*/;/*d*/')
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

    test('if-else-if with semicolon', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                    if (false)
                        console.log("foo")/*b*/;/*c*/
                    else /*d*/if (true)
                        console.log("bar")/*e*/;/*f*/
            `)
        );
    });

    test('if-if-else with semicolon', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                    if (false)
                        /*a*/if (true)
                            console.log("foo")/*b*/;/*c*/
                        else /*d*/if (true)
                            console.log("bar")/*e*/;/*f*/
            `)
        );
    });
});
