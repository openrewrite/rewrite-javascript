export class ListUtils {
    static map<T>(ls: T[] | undefined, map: (item: T) => T): T[] {
        if (ls === undefined || ls.length === 0) {
            return ls as T[];
        }

        let newLs: T[] = ls;
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

        return newLs;
    }
}