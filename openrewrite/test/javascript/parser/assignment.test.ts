import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('assignment mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRun(
          //language=typescript
          typeScript('foo = 1')
        );
    });
    test('?? assignment', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              const a = { duration: 50 };

              a.speed ??= 25;
              console.log(a.speed);
              // Expected output: 25

              a.duration ??= 10;
              console.log(a.duration);
              // Expected output: 50
          `)
        );
    });
    test('And assignment', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              let a = 1;
              let b = 0;

              a &&= 2;
              console.log(a);
              // Expected output: 2

              b &&= 2;
              console.log(b);
              // Expected output: 0

          `)
        );
    });
    test('Or assignment', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              const a = { duration: 50, title: '' };

              a.duration ||= 10;
              console.log(a.duration);
              // Expected output: 50

              a.title ||= 'title is empty.';
              console.log(a.title);
              // Expected output: "title is empty."

          `)
        );
    });
});
