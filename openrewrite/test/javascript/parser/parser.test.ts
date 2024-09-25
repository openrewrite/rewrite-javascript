import {InMemoryExecutionContext, ParserInput} from '../../../dist/core';
import {JavaScriptParser} from "../../../dist/javascript";
import * as JS from "../../../dist/javascript/tree";

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
