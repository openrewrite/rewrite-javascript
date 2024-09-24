import {InMemoryExecutionContext, ParserInput} from '../../src/core';
import {JavaScriptParser} from "../../src/javascript";
import * as J from "../../src/java/tree";
import * as JS from "../../src/javascript/tree";

describe('JavaScriptParser', () => {
    test('parseInputs', () => {
        const parser = JavaScriptParser.builder().build();
        const [sourceFile] = parser.parseInputs([new ParserInput('foo.ts', null, true, () => Buffer.from('1', 'utf8'))], null, new InMemoryExecutionContext());
        console.log(sourceFile);
    });

    test('parseStrings', () => {
        const parser = JavaScriptParser.builder().build();
        const [sourceFile] = parser.parseStrings(`
        const c = 1;
        /* c1*/  /*c2 */const d = 1;`) as Iterable<JS.CompilationUnit>;
        expect(sourceFile).toBeDefined();
        expect(sourceFile.statements).toHaveLength(2);
        sourceFile.statements.forEach(statement => {
            expect(statement).toBeInstanceOf(J.Unknown);
        })
    });
});
