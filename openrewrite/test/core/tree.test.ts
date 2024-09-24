import {Cursor, InMemoryExecutionContext, Markers, ParserInput, randomId} from '../../src/core';
import {isSourceFile} from "typescript";
import {Document, Documents, isYaml} from "../../src/yaml/tree";
import {JavaScriptParser} from "../../src/javascript";
import {Space} from "../../src/java/tree";

describe('tree utils', () => {
    test('new random ID', () => {
        expect(randomId()).toBeDefined();
    });

    test('Cursor.firstEnclosing()', () => {
        let documents = new Documents(randomId(), Markers.EMPTY, 'test.yaml', null, null, false, null, []);
        let c = new Cursor(null, documents);

        expect(c.firstEnclosing(isSourceFile)).toBeDefined();
        expect(c.firstEnclosing(isYaml)).toBeDefined();
        expect(c.firstEnclosing(Documents)).toBeDefined();
        expect(c.firstEnclosing(Document)).toBeNull();
    });

    test('parse', () => {
        const parser = JavaScriptParser.builder().build();
        const [sourceFile] = parser.parseInputs([new ParserInput('foo.ts', null, true, () => Buffer.from('1', 'utf8'))], null, new InMemoryExecutionContext());
        console.log(sourceFile);
    });

    test('parse strings', () => {
        const parser = JavaScriptParser.builder().build();
        const [sourceFile] = parser.parseStrings(`
        const c = 1;
        const d = 1;`);
        console.log(sourceFile);
    });

    test('parse space', () => {
        let str = ' /* c1*/  /*c2 */ ';
        console.log(Space.format(str, 0, str.length));
    });

    test('parse space 2', () => {
        let str = ' // c1 \n  // c2\n//c3';
        console.log(Space.format(str, 0, str.length));
    });

    test('parse empty space', () => {
        let str = '';
        console.log(Space.format(str, 0, str.length));
    });

    test('parse single space', () => {
        let str = ' ';
        console.log(Space.format(str, 0, str.length));
    });
});
