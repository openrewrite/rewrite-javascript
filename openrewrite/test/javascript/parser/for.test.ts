import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('for mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('empty for', () => {
        rewriteRun(
            //language=typescript
            typeScript('for (;;);')
        );
    });

    test('empty for with comments', () => {
        rewriteRun(
            //language=typescript
            typeScript('/*a*/for /*b*/ (/*c*/;/*d*/;/*e*/)/*f*/;/*g*/')
        );
    });

    test('for indexed', () => {
        rewriteRun(
          //language=typescript
          typeScript('for (let i = 0; i < 10; i++) ;')
        );
    });

    test('for indexed multiple variables', () => {
        rewriteRun(
          //language=typescript
          typeScript('for (let /*0*/ i /*1*/ = /*2*/ 0 /*3*/ , j = 0/*4*/; /*5*/ i /*6*/ < 10 /*7*/; /*8*/i++/*9*/)/*10*/ ;/*11*/')
        );
    });

    test('for indexed with empty body', () => {
        rewriteRun(
            //language=typescript
            typeScript('for (let i = 0; i < 10; i++) /*a*/ {/*b*/} /*c*/;')
        );
    });

    test('for indexed with body', () => {
        rewriteRun(
            //language=typescript
            typeScript('for (let i = 0; i < 10; i++) { console.log(i); };')
        );
    });

    test('for with continue', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                for (let i = 0; i < 5; i++) {
                    if (i === 2) {
                        continue /*a*/; // Skip the current iteration when i equals 2
                    }
                    console.log(i);
                }
            `)
        );
    });

    test('for with break', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                for (let i = 0; i < 5; i++) {
                    if (i === 2) {
                        break /*a*/; // Exit the loop when i equals 5
                    }
                    console.log(i);
                }
            `)
        );
    });

    test('for with labeled break', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                /*a*/labelName/*b*/:/*c*/ for (let i = 0; i < 5; i++) {
                    for (let j = 0; j < 5; j++) {
                        if (i === 2 && j === 2) {
                            /*d*/break /*e*/ labelName/*f*/; // Exits the outer loop when i and j are both 2
                        }
                    }
                }
            `)
        );
    });

    test('for-of empty', () => {
        rewriteRun(
            //language=typescript
            typeScript('for (let char of "text") ;')
        );
    });

    test('for-of empty with array', () => {
        rewriteRun(
            //language=typescript
            typeScript('for (let i of [0, 1, 2, [3, 4, 5]]) ;')
        );
    });

    test('for-of with object binding pattern', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                const list : any = [];
                for (let {a, b} of list) {
                    console.log(a); // 4, 5, 6
                }
            `)
        );
    });

    test('for-of with comments', () => {
        rewriteRun(
            //language=typescript
            typeScript('/*a*/for/*b*/ (/*c*/const /*d*/char /*e*/of /*f*/ "text"/*g*/)/*h*/ {/*j*/} /*k*/;/*l*/')
        );
    });

    test.skip('for-in empty', () => {
        rewriteRun(
            //language=typescript
            typeScript('for (const index in []) ;')
        );
    });

    test.skip('for-in with comments', () => {
        rewriteRun(
            //language=typescript
            typeScript('/*a*/for/*b*/ (/*c*/const /*d*/index /*e*/in /*f*/ []/*g*/)/*h*/ {/*j*/} /*k*/;/*l*/')
        );
    });
});
