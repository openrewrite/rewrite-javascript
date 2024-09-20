import {Cursor, Markers, randomId, SourceFile} from '../../src/core';
import {isYaml, Yaml} from "../../src/yaml";
import {isSourceFile} from "typescript";

describe('tree utils', () => {
    test('new random ID', () => {
        expect(randomId()).toBeDefined();
    });

    test('Cursor.firstEnclosing()', () => {
        let documents = new Yaml.Documents(randomId(), Markers.EMPTY, 'test.yaml', null, null, false, null, []);
        let c = new Cursor(null, documents);

        expect(c.firstEnclosing(isSourceFile)).toBeDefined();
        expect(c.firstEnclosing(isYaml)).toBeDefined();
        expect(c.firstEnclosing(Yaml.Documents)).toBeDefined();
        expect(c.firstEnclosing(Yaml.Document)).toBeNull();
    });
});