import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('do-while mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('empty do-while', () => {
        rewriteRun(
          //language=typescript
          typeScript('do {} while (true);')
        );
    });

    test('empty do-while with comments', () => {
        rewriteRun(
            //language=typescript
            typeScript('/*a*/ do /*b*/{/*c*/} /*d*/while/*e*/ (/*f*/true/*g*/)/*h*/;')
        );
    });

    test('empty do-while with expression and comments', () => {
        rewriteRun(
            //language=typescript
            typeScript('/*a*/ do /*b*/{/*c*/} /*d*/while/*e*/ (/*f*/Math/*0*/./*1*/random(/*2*/) /*3*/ > /*4*/0.7/*g*/)/*h*/;')
        );
    });

    test('do-while with statements', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                let count = 0;
                do {
                    console.log(count)
                    /*count*/
                    count++;
                } while (count < 10);
            `)
        );
    });
});
