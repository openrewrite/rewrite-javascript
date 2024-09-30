import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';
import * as JS from '../../../dist/src/javascript';
import {JavaType} from "../../../dist/src/java";

describe('yield mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('simple', () => {
        rewriteRun(
          //language=typescript
          typeScript('yield 42')
        );
    });
    test('empty', () => {
        rewriteRun(
          //language=typescript
          typeScript('yield')
        );
    });
    test('delegated', () => {
        rewriteRun(
          //language=typescript
          typeScript('yield* other')
        );
    });
});
