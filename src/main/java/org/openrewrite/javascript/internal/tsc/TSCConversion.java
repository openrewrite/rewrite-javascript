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
import com.caoccao.javet.values.V8Value;
import org.jspecify.annotations.Nullable;

public interface TSCConversion<T> {
    T convertUnsafe(TSCProgramContext context, V8Value value) throws JavetException;

    default @Nullable T convertNullable(TSCProgramContext context, V8Value value) {
        try {
            if (value.isNullOrUndefined()) {
                return null;
            } else {
                return convertUnsafe(context, value);
            }
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default T convertNonNull(TSCProgramContext context, V8Value value) {
        @Nullable T converted = convertNullable(context, value);
        if (converted == null) {
            throw new IllegalArgumentException("value converted to null, but was required to be non-null");
        }
        return converted;
    }
}
