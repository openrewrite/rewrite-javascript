import {Cursor, Markers, randomId, isSourceFile} from '../../src/core';
import {Document, Documents, isYaml} from "../../src/yaml/tree";

describe('utils', () => {
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
});
