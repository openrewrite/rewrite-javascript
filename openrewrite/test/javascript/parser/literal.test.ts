import * as J from "../../../dist/java/tree";
import * as JS from "../../../dist/javascript/tree";
import {connect, disconnect, javaScript, rewriteRunWithOptions} from '../testHarness';

describe('literal mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('number', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript(' 1', sourceFile => {
              assertLiteralLst(sourceFile, '1');
          }));
    });
    test('string', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('"1"', sourceFile => {
              assertLiteralLst(sourceFile, '"1"');
          }));
    });
    test('boolean', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('true', sourceFile => {
              assertLiteralLst(sourceFile, 'true');
          }));
    });
    test('null', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('null', sourceFile => {
              assertLiteralLst(sourceFile, 'null');
          }));
    });

    function assertLiteralLst(sourceFile: JS.CompilationUnit, expectedValueSource: string) {
        expect(sourceFile).toBeDefined();
        expect(sourceFile.statements).toHaveLength(1);
        let statement = sourceFile.statements[0];
        expect(statement).toBeInstanceOf(JS.ExpressionStatement);
        let expression = (statement as JS.ExpressionStatement).expression;
        expect(expression).toBeInstanceOf(J.Literal);
        expect((expression as J.Literal).valueSource).toBe(expectedValueSource);
    }
});
