import * as J from "../../../dist/java/tree";
import * as JS from "../../../dist/javascript/tree";
import {connect, disconnect, javaScript, rewriteRunWithOptions} from '../testHarness';
import {JavaType} from "../../../dist/java/tree";

describe('identifier mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('number', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript(' 1', sourceFile => {
              assertLiteralLst(sourceFile, '1', JavaType.PrimitiveKind.Int);
          }));
    });
    test('string', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('"1"', sourceFile => {
              assertLiteralLst(sourceFile, '"1"', JavaType.PrimitiveKind.String);
          }));
    });
    test('boolean', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('true', sourceFile => {
              assertLiteralLst(sourceFile, 'true', JavaType.PrimitiveKind.Boolean);
          }));
    });
    test('null', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('null', sourceFile => {
              assertLiteralLst(sourceFile, 'null', JavaType.PrimitiveKind.Null);
          }));
    });
    test('regex', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('/hello/gi', sourceFile => {
              assertLiteralLst(sourceFile, '/hello/gi', JavaType.PrimitiveKind.String);
          }));
    });
    test('template without substitutions', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          javaScript('`hello!`', sourceFile => {
              assertLiteralLst(sourceFile, '`hello!`', JavaType.PrimitiveKind.String);
          }));
    });

    function assertLiteralLst(sourceFile: JS.CompilationUnit, expectedValueSource: string, expectedType: JavaType.PrimitiveKind) {
        expect(sourceFile).toBeDefined();
        expect(sourceFile.statements).toHaveLength(1);
        let statement = sourceFile.statements[0];
        expect(statement).toBeInstanceOf(JS.ExpressionStatement);
        let expression = (statement as JS.ExpressionStatement).expression;
        expect(expression).toBeInstanceOf(J.Literal);
        expect((expression as J.Literal).valueSource).toBe(expectedValueSource);
        expect((expression as J.Literal).type.kind).toBe(expectedType);
    }
});
