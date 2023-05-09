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
import com.caoccao.javet.utils.JavetResourceUtils;
import com.caoccao.javet.values.reference.V8ValueFunction;
import com.caoccao.javet.values.reference.V8ValueObject;

import javax.annotation.Nullable;
import java.io.Closeable;

public class TSCProgramContext implements Closeable {
    private final V8Runtime runtime;
    private final V8ValueObject program;
    private final V8ValueObject typeCheckerV8;
    private final V8ValueFunction createScanner;
    private final V8ValueFunction getOpenRewriteId;

    private @Nullable TSCTypeChecker typeChecker;

    final TSCObjectCache<TSCNode> nodeCache = TSCObjectCache.usingInternalKey(TSCNode::new);
    final TSCObjectCache<TSCType> typeCache = TSCObjectCache.usingPropertyAsKey("id", TSCType::new);
    final TSCObjectCache<TSCSymbol> symbolCache = TSCObjectCache.usingInternalKey(TSCSymbol::new);
    final TSCObjectCache<TSCSignature> signatureCache = TSCObjectCache.usingInternalKey(TSCSignature::new);

    public TSCProgramContext(V8Runtime runtime, V8ValueObject program, V8ValueObject typeChecker, V8ValueFunction createScanner, V8ValueFunction getOpenRewriteId) {
        this.runtime = runtime;
        this.program = program;
        this.typeCheckerV8 = typeChecker;
        this.createScanner = createScanner;
        this.getOpenRewriteId = getOpenRewriteId;
    }

    public static TSCProgramContext fromJS(V8ValueObject contextV8) {
        try (
                V8ValueObject program = contextV8.get("program");
                V8ValueObject typeChecker = contextV8.get("typeChecker");
                V8ValueFunction createScanner = contextV8.get("createScanner");
                V8ValueFunction getOpenRewriteId = contextV8.get("getOpenRewriteId");
        ) {
            return new TSCProgramContext(
                    contextV8.getV8Runtime(),
                    program.toClone(),
                    typeChecker.toClone(),
                    createScanner.toClone(),
                    getOpenRewriteId.toClone()
            );
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public long getInternalObjectId(V8ValueObject objectV8) {
        try {
            return getOpenRewriteId.callLong(null, objectV8);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }


    public TSCTypeChecker getTypeChecker() {
        if (this.typeChecker == null) {
            this.typeChecker = TSCTypeChecker.wrap(this, this.typeCheckerV8);
        }
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

    @Override
    public void close() {
        JavetResourceUtils.safeClose(program, typeCheckerV8, createScanner, getOpenRewriteId);
        this.nodeCache.close();
        this.typeCache.close();
        this.symbolCache.close();
        this.signatureCache.close();
        this.typeChecker = null;
    }
}
