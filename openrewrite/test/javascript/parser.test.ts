import {InMemoryExecutionContext, ParserInput} from '../../src/core';
import {JavaScriptParser} from "../../src/javascript";
import * as J from "../../src/java/tree";
import * as JS from "../../src/javascript/tree";
import dedent from "dedent";

describe('Parser API', () => {
    const parser = JavaScriptParser.builder().build();

    test('parseInputs', () => {
        const [sourceFile] = parser.parseInputs(
          [new ParserInput('foo.ts', null, true, () => Buffer.from('1', 'utf8'))],
          null,
          new InMemoryExecutionContext()
        ) as Iterable<JS.CompilationUnit>;
        expect(sourceFile).toBeDefined();
    });

    test('parseStrings', () => {
        const [sourceFile] = parser.parseStrings(`
        const c = 1;
        /* c1*/  /*c2 */const d = 1;`) as Iterable<JS.CompilationUnit>;
        expect(sourceFile).toBeDefined();
    });
});

type SourceSpec = () => void;

describe('LST mapping', () => {
    const parser = JavaScriptParser.builder().build();

    test('parseInputs', () => {
        rewriteRun(
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

    test('parseStrings', () => {
        rewriteRun(
          javaScript(
            //language=javascript
            `
                const c = 1;
                /* c1*/  /*c2 */
                const d = 1;
            `, cu => {
                expect(cu).toBeDefined();
                expect(cu.statements).toHaveLength(2);
                cu.statements.forEach(statement => {
                    expect(statement).toBeInstanceOf(J.Unknown);
                });
                cu.padding.statements.forEach(statement => {
                    expect(statement.after.comments).toHaveLength(0);
                    expect(statement.after.whitespace).toBe(' ');
                });
            })
        );
    });

    function rewriteRun(...sourceSpecs: SourceSpec[]) {
        sourceSpecs.forEach(sourceSpec => sourceSpec());
    }

    function javaScript(before: string, spec?: (sourceFile: JS.CompilationUnit) => void): SourceSpec {
        return () => {
            const [sourceFile] = parser.parseStrings(dedent(before)) as Iterable<JS.CompilationUnit>;
            if (spec) {
                spec(sourceFile);
            }
        };
    }
});
