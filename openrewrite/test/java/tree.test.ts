import {Space, TextComment} from "../../src/java/tree";

describe('Space parsing', () => {
    test('multi-line comments', () => {
        let space = Space.format(' /* c1*/  /*c2 */ ');
        expect(space.whitespace).toBe(' ');
        expect(space.comments).toHaveLength(2);
        expect((space.comments[0] as TextComment).text).toBe(' c1');
        expect(space.comments[0].suffix).toBe('  ');
        expect((space.comments[1] as TextComment).text).toBe('c2 ');
        expect(space.comments[1].suffix).toBe(' ');
    });

    test('single-line comments', () => {
        let space = Space.format(' // c1 \n  // c2\n//c3');
        expect(space.whitespace).toBe(' ');
        expect(space.comments).toHaveLength(3);
        expect((space.comments[0] as TextComment).text).toBe(' c1 ');
        expect(space.comments[0].suffix).toBe('\n  ');
        expect((space.comments[1] as TextComment).text).toBe(' c2');
        expect(space.comments[1].suffix).toBe('\n');
        expect((space.comments[2] as TextComment).text).toBe('c3');
        expect(space.comments[2].suffix).toBe('');
    });

    test('parse empty space', () => {
        let space = Space.format('');
        expect(space).toBe(Space.EMPTY);
    });

    test('parse single space', () => {
        let space = Space.format(' ');
        expect(space).toBe(Space.SINGLE_SPACE);
    });
});
