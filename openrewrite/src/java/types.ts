import {LstType} from "../core";

export interface JavaType {
}

export namespace JavaType {
    export abstract class FullyQualified implements JavaType {
    }

    @LstType("org.openrewrite.java.tree.JavaType$Class")
    export class Class extends FullyQualified {
    }

    @LstType("org.openrewrite.java.tree.JavaType$Parameterized")
    export class Parameterized extends FullyQualified {
    }

    @LstType("org.openrewrite.java.tree.JavaType$Primitive")
    export class Primitive implements JavaType {
    }

    @LstType("org.openrewrite.java.tree.JavaType$Variable")
    export class Variable implements JavaType {
        type: JavaType = null!;

        withType(type: JavaType): Variable {
            return null!;
        }
    }

    @LstType("org.openrewrite.java.tree.JavaType$Method")
    export class Method implements JavaType {
        returnType: JavaType = null!;
    }
}
