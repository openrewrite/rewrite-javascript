package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.values.V8Value;

import javax.annotation.Nullable;

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
