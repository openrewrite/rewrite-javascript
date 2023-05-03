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

import java.io.Closeable;
import java.util.HashMap;
import java.util.Map;

public abstract class TSCObjectCache<TKey, T extends TSCV8Backed> implements Closeable {

    private final Map<TKey, T> cache = new HashMap<>();

    public T getOrCreate(TSCProgramContext programContext, V8ValueObject objectV8) {
        try {
            TKey key = getKey(objectV8);
            T result = this.cache.computeIfAbsent(key, (_key) -> makeInstance(programContext, objectV8));
            if (objectV8 != result.getBackingV8Object()) {
                objectV8.setWeak();
            }
            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    protected abstract TKey getKey(V8ValueObject objectV8) throws JavetException;

    protected abstract T makeInstance(TSCProgramContext programContext, V8ValueObject objectV8);

    @Override
    public void close() {
        this.cache.values().forEach(node -> {
            try {
                node.getBackingV8Object().close();
            } catch (JavetException e) {
            }
        });
    }
}
