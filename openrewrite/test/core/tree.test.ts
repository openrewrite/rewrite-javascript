import {Cursor, Markers, randomId, SourceFile} from '../../src/core';
import {Yaml} from "../../src/yaml";
import Documents = Yaml.Documents;
import Document = Yaml.Document;

describe('tree utils', () => {
    test('new random ID', () => {
        expect(randomId()).toBeDefined();
    });

    test('Cursor.firstEnclosing()', () => {
        let documents = new Documents(randomId(), Markers.EMPTY, 'test.yaml', null, null, false, null, []);
        let c = new Cursor(null, documents);

        expect(c.firstEnclosing(SourceFile)).toBeDefined();
        expect(c.firstEnclosing(Yaml)).toBeDefined();
        expect(c.firstEnclosing(Documents)).toBeDefined();
        expect(c.firstEnclosing(Document)).toBeNull();
    });
});