package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.values.V8Value;

public interface TSCContextCallback {
    V8Value apply(V8Value... args);
}
