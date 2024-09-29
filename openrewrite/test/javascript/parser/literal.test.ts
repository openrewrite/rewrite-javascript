import * as J from "../../../dist/src/java/tree";
import {JavaType} from "../../../dist/src/java";
import * as JS from "../../../dist/src/javascript";
import {connect, disconnect, rewriteRunWithOptions, typeScript} from '../testHarness';

describe('identifier mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('number', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          typeScript(' 1', sourceFile => {
              assertLiteralLst(sourceFile, '1', JavaType.PrimitiveKind.Double);
          }));
    });
    test('string', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          typeScript('"1"', sourceFile => {
              assertLiteralLst(sourceFile, '"1"', JavaType.PrimitiveKind.String);
          }));
    });
    test('boolean', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          typeScript('true', sourceFile => {
              assertLiteralLst(sourceFile, 'true', JavaType.PrimitiveKind.Boolean);
          }));
    });
    test('null', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          typeScript('null', sourceFile => {
              assertLiteralLst(sourceFile, 'null', JavaType.PrimitiveKind.Null);
          }));
    });
    test('undefined', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          typeScript('undefined', sourceFile => {
              assertLiteralLst(sourceFile, 'undefined', JavaType.PrimitiveKind.None);
          }));
    });
    test('regex', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          typeScript('/hello/gi', sourceFile => {
              assertLiteralLst(sourceFile, '/hello/gi', JavaType.PrimitiveKind.String);
          }));
    });
    test('template without substitutions', () => {
        rewriteRunWithOptions(
          {normalizeIndent: false},
          typeScript('`hello!`', sourceFile => {
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
