import {LstType} from "../../core";

export interface JavaType {
}

export namespace JavaType {
    export abstract class FullyQualified implements JavaType {
    }

    @LstType("org.openrewrite.java.tree.JavaType$Class")
    export class Class extends FullyQualified {
        private _flagsBitMap: number | undefined;
        private _fullyQualifiedName: string | undefined;
        private _kind: Class.Kind | undefined;
        private _typeParameters: JavaType[] | undefined;
        private _supertype: JavaType | undefined;
        private _owningClass: FullyQualified | undefined;
        private _annotations: FullyQualified[] | undefined;
        private _interfaces: FullyQualified[] | undefined;
        private _members: Variable[] | undefined;
        private _methods: Method[] | undefined;

        constructor(flagsBitMap?: number, fullyQualifiedName?: string, kind?: Class.Kind) {
            super();
            this._flagsBitMap = flagsBitMap;
            this._fullyQualifiedName = fullyQualifiedName;
            this._kind = kind;
        }

        get flagsBitMap(): number {
            return this._flagsBitMap!;
        }

        get fullyQualifiedName(): string {
            return this._fullyQualifiedName!;
        }

        get kind(): Class.Kind {
            return this._kind!;
        }

        get typeParameters(): JavaType[] | undefined {
            return this._typeParameters;
        }

        get supertype(): JavaType | undefined {
            return this._supertype;
        }

        get owningClass(): FullyQualified | undefined {
            return this._owningClass;
        }

        get annotations(): FullyQualified[] | undefined {
            return this._annotations;
        }

        get interfaces(): FullyQualified[] | undefined {
            return this._interfaces;
        }

        get members(): Variable[] | undefined {
            return this._members;
        }

        get methods(): Method[] | undefined {
            return this._methods;
        }

        unsafeSet(typeParameters: JavaType[], supertype: JavaType, owningClass: FullyQualified, annotations: FullyQualified[], interfaces: FullyQualified[], members: Variable[], methods: Method[]): this {
            this._typeParameters = typeParameters;
            this._supertype = supertype;
            this._owningClass = owningClass;
            this._annotations = annotations;
            this._interfaces = interfaces;
            this._members = members;
            this._methods = methods;
            return this;
        }
    }

    export namespace Class {
        export const enum Kind {
            Class,
            Enum,
            Interface,
            Annotation,
            Record,
            Value,
        }
    }

    @LstType("org.openrewrite.java.tree.JavaType$MultiCatch")
    export class Union implements JavaType {
        private _types: JavaType[] | undefined;

        get types(): JavaType[] {
            return this._types!;
        }

        unsafeSet(types: JavaType[]): this {
            this._types = types;
            return this;
        }
    }

    @LstType("org.openrewrite.java.tree.JavaType$ShallowClass")
    export class ShallowClass extends FullyQualified {
    }

    @LstType("org.openrewrite.java.tree.JavaType$Parameterized")
    export class Parameterized extends FullyQualified {
    }

    @LstType("org.openrewrite.java.tree.JavaType$Primitive")
    export class Primitive implements JavaType {
        public constructor(private readonly _kind: PrimitiveKind) {
        }

        static of(kind: PrimitiveKind): Primitive {
            return new Primitive(kind);
        }

        get kind(): PrimitiveKind {
            return this._kind;
        }
    }

    export const enum PrimitiveKind {
        Boolean,
        Byte,
        Char,
        Double,
        Float,
        Int,
        Long,
        Short,
        Void,
        String,
        None,
        Null,
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

    @LstType("org.openrewrite.java.tree.JavaType$Unknown")
    export class Unknown implements JavaType {
        static INSTANCE = new Unknown();
    }
}
