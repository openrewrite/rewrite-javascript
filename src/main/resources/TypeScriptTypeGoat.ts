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
    // public static parameterizedField: PT<typeof TypeScriptTypeGoat.TypeA>;

    // static TypeA = class {
    // }

    // static TypeB = class {
    // }

    // public static abstract class InheritedJavaTypeGoat<T, U extends PT<U> & C> extends JavaTypeGoat<T, U> {
    // public InheritedJavaTypeGoat() {
    //         super();
    //     }
    // }

//     public enum EnumTypeA {
//     FOO, BAR(),
//     @AnnotationWithRuntimeRetention
//     FUZ
// }

// public enum EnumTypeB {
//     FOO(null);
// private TypeA label;
// EnumTypeB(TypeA label) {
//     this.label = label;
// }
// }

// public abstract class ExtendsJavaTypeGoat extends JavaTypeGoat<T, S> {
// }

// public static abstract class Extension<U extends Extension<U>> {}

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

    generic<T extends B>(n: PT<T>): PT<T> {
        return n
    }

    // public abstract PT<? super C> genericContravariant(PT<? super C> n);
    // public abstract <U extends JavaTypeGoat<U, ?>> JavaTypeGoat<? extends U[], ?> genericRecursive(JavaTypeGoat<? extends U[], ?> n);

    genericUnbounded<U>(n: PT<U>): PT<U> {
        return n
    }

    genericArray(n: PT<A>[]): void {
    }

    // public abstract void inner(C.Inner n);
    // public abstract void enumTypeA(EnumTypeA n);
    // public abstract void enumTypeB(EnumTypeB n);
    // public abstract <U extends PT<U> & C> InheritedJavaTypeGoat<T, U> inheritedJavaTypeGoat(InheritedJavaTypeGoat<T, U> n);
    // public abstract <U extends TypeA & PT<U> & C> U genericIntersection(U n);
    genericT(n: T): T {
        return n
    }

    // recursiveIntersection<U extends Extension<U> & Intersection<U>>(n: U): void {
    //     return n
    // }

    mergedClass(n: B) {
        n.foo()
        n.bar()
        n.buz()
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

interface PT<T> {
}

// interface Intersection<T extends TypeScriptTypeGoat.Extension<T> & Intersection<T>> {
//     getIntersectionType(): T
// }

function decorator ( value : boolean ) {
    return function ( target : any ,
                      propertyKey : string,
                      descriptor : PropertyDescriptor ) {
        descriptor . enumerable = value ;
    } ;
}

// TODO: add as much parody to JavaTypeGoat as possible.
// TODO: add code unique to type script.