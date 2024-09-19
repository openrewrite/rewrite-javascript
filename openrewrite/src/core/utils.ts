import {v4 as uuidv4} from 'uuid';

export type UUID = Uint8Array;

export const randomId = (): UUID => {
    const buffer = new Uint8Array(16);
    uuidv4({}, buffer);
    return buffer;
}

export class ListUtils {
    static map<T>(ls: T[] | null, map: (item: T) => T | null): T[] {
        if (ls === null || ls === undefined || ls.length === 0) {
            return ls as T[];
        }

        let newLs: (T | null)[] = ls;
        let nullEncountered = false;

        for (let i = 0; i < ls.length; i++) {
            const item = ls[i];
            const newItem = map(item);
            if (newItem !== item) {
                if (newLs === ls) {
                    newLs = [...ls];
                }
                newLs[i] = newItem;
            }
            nullEncountered = nullEncountered || (newItem === null || newItem === undefined);
        }

        if (newLs !== ls && nullEncountered) {
            newLs = newLs.filter(item => item !== null && item !== undefined);
        }

        return newLs as T[];
    }
}

const typeRegistry = new Map<string, new (...args: any[]) => any>();

const LST_TYPE_KEY = Symbol('lstType');

export function LstType(typeName: string) {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        // Add the static symbol property to the class constructor
        Object.defineProperty(constructor, LST_TYPE_KEY, {
            value: typeName,
            writable: false,
            enumerable: false,
        });

        // Register the class in the global type registry
        typeRegistry.set(typeName, constructor);
    };
}

export function _getTypeNameFromClass(constructor: any): string | undefined {
    return constructor[LST_TYPE_KEY];
}
