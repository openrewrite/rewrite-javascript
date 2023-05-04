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
import com.caoccao.javet.interop.V8Runtime;
import com.caoccao.javet.interop.callback.JavetCallbackContext;
import com.caoccao.javet.utils.JavetResourceUtils;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.reference.V8ValueFunction;
import com.caoccao.javet.values.reference.V8ValueObject;

import java.io.Closeable;
import java.lang.reflect.Method;
import java.util.function.Consumer;
import java.util.function.Function;

public class TSCProgramContext implements Closeable {
    private static final Method CONTEXT_CALLBACK_APPLY_METHOD;

    static {
        try {
            CONTEXT_CALLBACK_APPLY_METHOD = TSCContextCallback.class.getDeclaredMethod("apply", V8Value[].class);
        } catch (NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
    }

    private final V8Runtime runtime;
    private final TSCMeta metadata;
    private final V8ValueObject program;
    private final V8ValueObject typeChecker;
    private final V8ValueFunction createScanner;
    private final V8ValueFunction getOpenRewriteId;

    private final TSCObjectCache<Long, TSCNode> nodeCache = new TSCObjectCache<Long, TSCNode>() {
        @Override
        protected Long getKey(V8ValueObject objectV8) throws JavetException {
            return getOpenRewriteId.callLong(null, objectV8);
        }

        @Override
        protected TSCNode makeInstance(TSCProgramContext programContext, V8ValueObject objectV8) {
            return new TSCNode(programContext, objectV8);
        }
    };

    private final TSCObjectCache<Long, TSCType> typeCache = new TSCObjectCache<Long, TSCType>() {
        @Override
        protected Long getKey(V8ValueObject objectV8) throws JavetException {
            Number tmp = objectV8.getPrimitive("id");
            return tmp.longValue();
        }

        @Override
        protected TSCType makeInstance(TSCProgramContext programContext, V8ValueObject objectV8) {
            return new TSCType(programContext, objectV8);
        }
    };

    private final TSCObjectCache<Long, TSCSymbol> symbolCache = new TSCObjectCache<Long, TSCSymbol>() {
        @Override
        protected Long getKey(V8ValueObject objectV8) throws JavetException {
            return getOpenRewriteId.callLong(null, objectV8);
        }

        @Override
        protected TSCSymbol makeInstance(TSCProgramContext programContext, V8ValueObject objectV8) {
            return new TSCSymbol(programContext, objectV8);
        }
    };

    private final TSCObjectCache<Long, TSCSignature> signatureCache = new TSCObjectCache<Long, TSCSignature>() {
        @Override
        protected Long getKey(V8ValueObject objectV8) throws JavetException {
            return getOpenRewriteId.callLong(null, objectV8);
        }

        @Override
        protected TSCSignature makeInstance(TSCProgramContext programContext, V8ValueObject objectV8) {
            return new TSCSignature(programContext, objectV8);
        }
    };

    public TSCProgramContext(V8Runtime runtime, TSCMeta metadata, V8ValueObject program, V8ValueObject typeChecker, V8ValueFunction createScanner, V8ValueFunction getOpenRewriteId) {
        this.runtime = runtime;
        this.metadata = metadata;
        this.program = program;
        this.typeChecker = typeChecker;
        this.createScanner = createScanner;
        this.getOpenRewriteId = getOpenRewriteId;
    }

    public static TSCProgramContext fromJS(V8ValueObject contextV8) {
        try (
                V8ValueObject metaV8Object = contextV8.get("meta");
                V8ValueObject program = contextV8.get("program");
                V8ValueObject typeChecker = contextV8.get("typeChecker");
                V8ValueFunction createScanner = contextV8.get("createScanner");
                V8ValueFunction getOpenRewriteId = contextV8.get("getOpenRewriteId");
        ) {
            TSCMeta metadata = TSCMeta.fromJS(metaV8Object);
            return new TSCProgramContext(
                    contextV8.getV8Runtime(),
                    metadata,
                    program.toClone(),
                    typeChecker.toClone(),
                    createScanner.toClone(),
                    getOpenRewriteId.toClone()
            );
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public V8ValueObject getTypeChecker() {
        return this.typeChecker;
    }

    public V8ValueFunction getCreateScannerFunction() {
        return this.createScanner;
    }

    public TSCType tscType(V8ValueObject v8Value) {
        return this.typeCache.getOrCreate(this, v8Value);
    }

    public TSCNode tscNode(V8ValueObject v8Value) {
        return this.nodeCache.getOrCreate(this, v8Value);
    }

    public TSCSymbol tscSymbol(V8ValueObject v8Value) {
        return this.symbolCache.getOrCreate(this, v8Value);
    }

    public TSCSignature tscSignature(V8ValueObject v8Value) {
        return this.signatureCache.getOrCreate(this, v8Value);
    }

    public V8ValueFunction asJSFunction(TSCContextCallback func) {
        JavetCallbackContext callbackContext = new JavetCallbackContext(func, CONTEXT_CALLBACK_APPLY_METHOD);
        try {
            return this.runtime.createV8ValueFunction(callbackContext);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public V8ValueFunction asJSFunction(Function<? super V8Value, ? extends V8Value> func) {
        TSCContextCallback callback = (V8Value[] args) -> func.apply(args[0]);
        return asJSFunction(callback);
    }

    public V8ValueFunction asJSFunction(Consumer<? super V8Value> func) {
        TSCContextCallback callback = (V8Value[] args) -> {
            func.accept(args[0]);
            return runtime.createV8ValueUndefined();
        };
        return asJSFunction(callback);
    }

    @Override
    public void close() {
        JavetResourceUtils.safeClose(program);
        JavetResourceUtils.safeClose(typeChecker);
        JavetResourceUtils.safeClose(createScanner);
        JavetResourceUtils.safeClose(getOpenRewriteId);

        this.nodeCache.close();
        this.typeCache.close();
        this.symbolCache.close();
        this.signatureCache.close();
    }
}
