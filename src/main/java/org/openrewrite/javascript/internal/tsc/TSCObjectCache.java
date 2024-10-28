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
package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.values.reference.V8ValueObject;
import org.jspecify.annotations.Nullable;

import java.util.HashMap;
import java.util.Map;

public abstract class TSCObjectCache<T extends TSCV8Backed> extends TSCV8ValueHolder {

    public interface KeyProvider<TKey> {
        TKey getKey(TSCProgramContext context, V8ValueObject objectV8) throws JavetException;
    }

    public interface InstanceConstructor<T extends TSCV8Backed> {
        T makeInstance(TSCProgramContext programContext, V8ValueObject objectV8) throws JavetException;
    }

    public static <T extends TSCV8Backed> TSCObjectCache<T> usingInternalKey(InstanceConstructor<T> makeInstance) {
        return new Impl<>(TSCProgramContext::getInternalObjectId, makeInstance);
    }

    public static <T extends TSCV8Backed> TSCObjectCache<T> usingPropertyAsKey(String propertyName, InstanceConstructor<T> makeInstance) {
        return new Impl<>((context, objectV8) -> objectV8.getPrimitive(propertyName), makeInstance);
    }

    public abstract T getOrCreate(TSCProgramContext programContext, V8ValueObject objectV8);

    /** Hide the `TKey` implementation detail within an Impl class. */
    private static class Impl<TKey, T extends TSCV8Backed> extends TSCObjectCache<T> {
        private final Map<TKey, T> cache = new HashMap<>();
        private final KeyProvider<TKey> getKey;
        private final InstanceConstructor<T> makeInstance;

        public Impl(KeyProvider<TKey> getKey, InstanceConstructor<T> makeInstance) {
            this.getKey = getKey;
            this.makeInstance = makeInstance;
        }

        @Override
        public @Nullable T getOrCreate(TSCProgramContext programContext, V8ValueObject objectV8) {
            try {
                TKey key = getKey.getKey(programContext, objectV8);
                return this.cache.computeIfAbsent(key, (_key) -> {
                    V8ValueObject clone = lifecycleLinked(objectV8);
                    try {
                        return makeInstance.makeInstance(programContext, clone);
                    } catch (JavetException e) {
                        throw new RuntimeException(e);
                    }
                });
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
