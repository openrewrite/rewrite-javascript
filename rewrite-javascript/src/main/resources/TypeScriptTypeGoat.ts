/*
 * Copyright 2023 the original author or authors.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * https://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
abstract class TypeScriptTypeGoat<T, S extends PT<S> & A> {

    protected constructor() {
    }

    public static parameterizedField: PT<typeof TypeScriptTypeGoat.TypeA>;

    public static unionField: typeof TypeScriptTypeGoat.TypeA | typeof TypeScriptTypeGoat.TypeB

    public static TypeA = class {
    }

    public static TypeB = class {
    }

    ExtendsTypeScriptTypeGoat = class extends TypeScriptTypeGoat<T, S> {
        enumTypeA(n: EnumTypeA): void {
        }
        genericIntersection<U>(n: U): U {
            return undefined;
        }
        genericRecursive<U>(n: TypeScriptTypeGoat<readonly U[], unknown>): TypeScriptTypeGoat<readonly U[], unknown> {
            return undefined;
        }
        inheritedTypeScriptTypeGoat<U>(n: InheritedTypeScriptTypeGoat<T, U>): InheritedTypeScriptTypeGoat<T, U> {
            return undefined;
        }
    }

    clazz(n: A): void {
    }

    primitive(n: number): void {
    }

    array(n: A[]): void {
    }

    multidimensionalArray(n: A[][]): void {
    }

    parameterized(n: PT<A>): PT<A> {
        return n
    }

    parameterizedRecursive(n: PT<PT<A>>): PT<PT<A>> {
        return n
    }

    generic<T extends A>(n: PT<T>): PT<T> {
        return n
    }

    public abstract genericRecursive<U extends TypeScriptTypeGoat<U, unknown>>(n: TypeScriptTypeGoat<readonly U[], unknown>): TypeScriptTypeGoat<readonly U[], unknown>;

    genericUnbounded<U>(n: PT<U>): PT<U> {
        return n
    }

    public abstract enumTypeA(n: EnumTypeA): void;
    public abstract inheritedTypeScriptTypeGoat<U extends PT<U> & C>(n: InheritedTypeScriptTypeGoat<T, U>): InheritedTypeScriptTypeGoat<T, U>;
    public abstract genericIntersection<U extends (typeof TypeScriptTypeGoat)['TypeA'] & PT<U> & C>(n: U): U;

    genericT(n: T): T {
        return n
    }

    recursiveIntersection<U extends Extension<U> & Intersection<U>>(n: U): void {
    }

    merged(n: B) {
        n.foo()
        n.bar()
        n.buz()
    }

    mergedGeneric<T extends B>(n: PT<T>): PT<T> {
        return n
    }
}

interface A {
}

interface B {
    foo(): void
}

interface B {
    bar(): void
}

class B {
    buz(): void {
    }
}

interface C {

}

interface PT<T> {
}

interface Intersection<T extends Extension<T> & Intersection<T>> {
    getIntersectionType(): T
}

abstract class Extension<U extends Extension<U>> {
}

function decorator(value: boolean) {
    return function (target: any,
                     propertyKey: string,
                     descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}

enum EnumTypeA {
    FOO, BAR
}

abstract class InheritedTypeScriptTypeGoat<T, U extends PT<U> & C> extends TypeScriptTypeGoat<T, U> {
    protected constructor() {
        super();
    }
}
