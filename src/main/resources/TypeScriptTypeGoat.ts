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
// TODO: add generic params.
abstract class TypeScriptTypeGoat<T, S extends PT<S> & A> {
    clazzA(n: A) {
    }

    clazzB(n: B) {
        n.foo()
        n.bar()
        n.buz()
    }

    parameterized(n: PT<A>): PT<A> {
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

interface PT<T> {
}

// TODO: add source level fields and methods.
// TODO: add code unique to type script.