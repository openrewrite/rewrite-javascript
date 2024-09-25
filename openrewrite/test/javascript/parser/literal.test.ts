import * as J from "../../../dist/java/tree";
import * as JS from "../../../dist/javascript/tree";
import {javaScript, rewriteRunWithOptions} from './testHarness';

describe('literal mapping', () => {
    test('number', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('1', sourceFile => {
              expect(sourceFile).toBeDefined();
              expect(sourceFile.statements).toHaveLength(1);
              let statement = sourceFile.statements[0];
              expect(statement).toBeInstanceOf(JS.ExpressionStatement);
              let expression = (statement as JS.ExpressionStatement).expression;
              expect(expression).toBeInstanceOf(J.Literal);
              expect((expression as J.Literal).valueSource).toBe('1');
          }));
    });
});
