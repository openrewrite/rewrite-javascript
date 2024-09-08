import { random_id } from '../../src/core';

describe('tree utils', () => {
    test('new random ID', () => {
        expect(random_id()).toBeDefined();
    });
});