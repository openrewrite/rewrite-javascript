export interface JavaType {
}

export namespace JavaType {
    export abstract class FullyQualified implements JavaType {
    }

    export abstract class Class extends FullyQualified {
    }

    export abstract class Parameterized extends FullyQualified {
    }

    export class Primitive implements JavaType {
    }

    export class Variable implements JavaType {
        type: JavaType = null!;

        withType(type: JavaType): Variable {
            return null!;
        }
    }

    export class Method implements JavaType {
        returnType: JavaType = null!;
    }
}
