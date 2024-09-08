import { v4 as uuidv4 } from 'uuid';

type UUID = string;

export const random_id = (): UUID => {
    return uuidv4();
}

class CompilationUnit {
    constructor(
        public readonly id: UUID
    ) {
    }

    withId(newId: UUID): CompilationUnit {
        return newId == this.id ? this : new CompilationUnit(newId);
    }
}
