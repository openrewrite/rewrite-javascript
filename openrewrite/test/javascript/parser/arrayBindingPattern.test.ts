import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('array binding pattern', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('empty', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              const [ ] = [10, 20, 30, 40, 50];
          `)
        );
    });

    test('simple destructuring', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              const [a, b, ...rest] = [10, 20, 30, 40, 50];
          `)
        );
    });

    test('advanced destructuring', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              const aDefault = "";
              const array = [];
              const /*1*/ [/*2*/a/*3*/, /*4*/b/*5*/, /*6*/] /*7*/=/*8*/ array/*9*/;/*10*/
              const [a1/*12*/, /*11*/,/*3*/ b1] = array;
              const [/*16*/a2 /*14*/=/*15*/ aDefault/*17*/, b2/*18*/] = array;
              const [/*21*/a3, /*22*/b3, /*20*/... /*19*/rest/*23*/] = array;
              const [a4, , b4, ...rest1] = array;
              const [a5, b5, /*26*/.../*25*/{/*27*/ pop/*28*/,/*29*/ push /*30*/, /*31*/}] = array;
              const [a6, b6, /*33*/.../*32*/[/*34*/c, d]/*35*/] = array;
          `)
        );
    });

    test('destructuring with existing variables', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              let aDefault = 1;
              let array = [];
              let a, b, a1, b1, c, d, rest, pop, push;
              [a, b] = array;
              [a, , b] = array;
              [a = aDefault, b] = array;
              [a, b, ...rest] = array;
              [a, , b, ...rest] = array;
              [a, b, ...{ pop, push }] = array;
              [a, b, ...[c, d]] = array;
          `)
        );
    });
});
