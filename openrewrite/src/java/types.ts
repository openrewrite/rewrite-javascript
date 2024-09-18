import {javaType} from "../core";

export interface JavaType {
}

export namespace JavaType {
    export abstract class FullyQualified implements JavaType {
        static [javaType] = "org.openrewrite.java.tree.JavaType$FullyQualified";
    }

    export abstract class Class extends FullyQualified {
        static [javaType] = "org.openrewrite.java.tree.JavaType$Class";
    }

    export abstract class Parameterized extends FullyQualified {
        static [javaType] = "org.openrewrite.java.tree.JavaType$Parameterized";
    }

    export class Primitive implements JavaType {
        static [javaType] = "org.openrewrite.java.tree.JavaType$Primitive";
    }

    export class Variable implements JavaType {
        static [javaType] = "org.openrewrite.java.tree.JavaType$Variable";
        type: JavaType = null!;

        withType(type: JavaType): Variable {
            return null!;
        }
    }

    export class Method implements JavaType {
        static [javaType] = "org.openrewrite.java.tree.JavaType$Method";
        returnType: JavaType = null!;
    }
}
