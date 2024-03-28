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
import com.caoccao.javet.values.IV8Value;
import com.caoccao.javet.values.primitive.V8ValueNull;
import com.caoccao.javet.values.primitive.V8ValuePrimitive;
import com.caoccao.javet.values.primitive.V8ValueUndefined;
import org.openrewrite.javascript.internal.JavetUtils;

import java.util.ArrayList;
import java.util.List;

public abstract class TSCV8ValueHolder implements AutoCloseable {

    private final List<IV8Value> v8Values = new ArrayList<>();
    private final List<AutoCloseable> otherValues = new ArrayList<>();
    private boolean isClosed;

    protected <T extends AutoCloseable> T lifecycleLinked(T value) {
        if (isClosed) {
            throw new IllegalStateException("attempt to add value when already closed");
        }

        if (value instanceof V8ValuePrimitive || value instanceof V8ValueUndefined || value instanceof V8ValueNull) {
            // primitives, null, and undefined aren't managed
            return value;
        }

        if (value instanceof IV8Value) {
            try {
                //noinspection unchecked
                value = (T) ((IV8Value) value).toClone();
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
            this.v8Values.add((IV8Value) value);
        } else {
            this.otherValues.add(value);
        }

        return value;
    }

    @Override
    public final void close() {
        if (this.isClosed) {
            throw new IllegalStateException("already closed");
        }
        this.isClosed = true;

        for (IV8Value valueV8 : v8Values) {
            JavetUtils.close(valueV8);
        }
        for (AutoCloseable value : otherValues) {
            try {
                value.close();
            } catch (Exception e) {
                System.err.println("Exception while attempting to close a " + value.getClass().getName());
                e.printStackTrace();
            }
        }
    }
}
