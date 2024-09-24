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

describe('LST mapping', () => {
    const parser = JavaScriptParser.builder().build();

    test('parseInputs', () => {
        rewriteRun(() => {
            const sourceFile = javaScript('1');
            expect(sourceFile).toBeDefined();
            expect(sourceFile.statements).toHaveLength(1);
            expect(sourceFile.statements[0]).toBeInstanceOf(JS.ExpressionStatement);
        });
    });

    test('parseStrings', () => {
        rewriteRun(() => {
            //language=typescript
            const sourceFile = javaScript(`
                const c = 1;
                /* c1*/  /*c2 */
                const d = 1;
            `);
            expect(sourceFile).toBeDefined();
            expect(sourceFile.statements).toHaveLength(2);
            sourceFile.statements.forEach(statement => {
                expect(statement).toBeInstanceOf(J.Unknown);
            })
        });
    });

    function rewriteRun(runnable: () => void) {
        runnable();
    }

    function javaScript(source: string): JS.CompilationUnit {
        const [sourceFile] = parser.parseStrings(dedent(source)) as Iterable<JS.CompilationUnit>;
        return sourceFile;
    }
});
