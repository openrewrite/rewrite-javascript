import {Space} from "../../src/java/tree";

describe('Space parsing', () => {
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
