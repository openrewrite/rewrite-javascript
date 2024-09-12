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