import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';
import * as JS from '../../../dist/javascript/tree';
import {JavaType} from "../../../dist/java/tree";

describe('void operator mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('void', () => {
        rewriteRun(
          //language=typescript
          typeScript('void 1', cu => {
              const statement = cu.statements[0] as JS.ExpressionStatement;
              expect(statement.expression).toBeInstanceOf(JS.Void);
              const type = (statement.expression as JS.Void).type as JavaType.Primitive;
              expect(type.kind).toBe(JavaType.PrimitiveKind.Void);
          })
        );
    });
});
