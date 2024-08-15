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
import com.caoccao.javet.values.reference.V8ValueFunction;
import com.caoccao.javet.values.reference.V8ValueObject;
import lombok.Getter;
import lombok.Value;
import org.jspecify.annotations.Nullable;

import java.nio.file.Path;
import java.nio.file.Paths;

public class TSCProgramContext extends TSCV8ValueHolder {
    private final V8ValueObject program;
    private final V8ValueFunction createScanner;
    private final V8ValueFunction getOpenRewriteId;

    /**
     * In the virtual filesystem used by the compiler, this is the prefix for all input sources.
     */
    private final Path compilerAppPath;
    /**
     * In the virtual filesystem used by the compiler, this is the prefix for all libs shipped with TS.
     */
    private final Path compilerLibPath;

    private final TSCGlobals typescriptGlobals;

    @Getter
    private final TSCTypeChecker typeChecker;

    @Getter
    private final TSCInstanceOfChecks instanceOfChecks;

    final TSCObjectCache<TSCNode> nodeCache = lifecycleLinked(TSCObjectCache.usingInternalKey(TSCNode::wrap));
    final TSCObjectCache<TSCNodeList> nodeListCache = lifecycleLinked(TSCObjectCache.usingInternalKey(TSCNodeList::wrap));
    final TSCObjectCache<TSCType> typeCache = lifecycleLinked(TSCObjectCache.usingPropertyAsKey("id", TSCType::new));
    final TSCObjectCache<TSCSymbol> symbolCache = lifecycleLinked(TSCObjectCache.usingInternalKey(TSCSymbol::new));
    final TSCObjectCache<TSCSignature> signatureCache = lifecycleLinked(TSCObjectCache.usingInternalKey(TSCSignature::new));

    public TSCProgramContext(
            V8ValueObject program,
            V8ValueObject tsGlobalsV8,
            V8ValueObject typeCheckerV8,
            V8ValueFunction createScanner,
            V8ValueFunction getOpenRewriteId,
            Path compilerAppPath,
            Path compilerLibPath
    ) {
        this.program = lifecycleLinked(program);
        this.typescriptGlobals = lifecycleLinked(TSCGlobals.fromJS(() -> this, tsGlobalsV8));
        this.typeChecker = lifecycleLinked(TSCTypeChecker.fromJS(() -> this, typeCheckerV8));
        this.instanceOfChecks = lifecycleLinked(TSCInstanceOfChecks.fromJS(tsGlobalsV8));
        this.createScanner = lifecycleLinked(createScanner);
        this.getOpenRewriteId = lifecycleLinked(getOpenRewriteId);
        this.compilerAppPath = compilerAppPath;
        this.compilerLibPath = compilerLibPath;
    }

    public static TSCProgramContext fromJS(V8ValueObject contextV8) {
        try (
                V8ValueObject program = contextV8.get("program");
                V8ValueObject tsGlobals = contextV8.get("ts");
                V8ValueObject typeChecker = contextV8.get("typeChecker");
                V8ValueFunction createScanner = contextV8.get("createScanner");
                V8ValueFunction getOpenRewriteId = contextV8.get("getOpenRewriteId");
                V8ValueObject pathPrefixes = contextV8.get("pathPrefixes");
        ) {
            return new TSCProgramContext(
                    program,
                    tsGlobals,
                    typeChecker,
                    createScanner,
                    getOpenRewriteId,
                    Paths.get(pathPrefixes.getString("app")),
                    Paths.get(pathPrefixes.getString("lib"))
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


    public TSCGlobals getTypeScriptGlobals() {
        return this.typescriptGlobals;
    }

    public TSCInstanceOfChecks.@Nullable InterfaceKind identifyInterfaceKind(V8Value valueV8) {
        return this.getInstanceOfChecks().identifyInterfaceKind(valueV8);
    }

    public TSCInstanceOfChecks.@Nullable ConstructorKind identifyConstructorKind(V8Value valueV8) {
        return this.getInstanceOfChecks().identifyConstructorKind(valueV8);
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

    public TSCNodeList tscNodeList(V8ValueObject v8Value) {
        return this.nodeListCache.getOrCreate(this, v8Value);
    }

    public TSCSymbol tscSymbol(V8ValueObject v8Value) {
        return this.symbolCache.getOrCreate(this, v8Value);
    }

    public TSCSignature tscSignature(V8ValueObject v8Value) {
        return this.signatureCache.getOrCreate(this, v8Value);
    }

    /**
     * This is *not* a concept in the TS compiler. This is part of the OpenRewrite-to-TSC bridge.
     */
    public enum CompilerBridgeSourceKind {
        ApplicationCode,
        SystemLibrary,
    }

    @Value
    public static class CompilerBridgeSourceInfo {
        CompilerBridgeSourceKind sourceKind;
        Path relativePath;
    }

    protected CompilerBridgeSourceInfo getBridgeSourceInfo(TSCNode.SourceFile sourceFile) {
        Path rawPath = Paths.get(sourceFile.getOriginalFileName());
        Path sourceKindRoot;
        CompilerBridgeSourceKind sourceKind;
        if (rawPath.startsWith(this.compilerAppPath)) {
            sourceKindRoot = this.compilerAppPath;
            sourceKind = CompilerBridgeSourceKind.ApplicationCode;
        } else if (rawPath.startsWith(this.compilerLibPath)) {
            sourceKindRoot = this.compilerLibPath;
            sourceKind = CompilerBridgeSourceKind.SystemLibrary;
        } else {
            throw new IllegalArgumentException("unknown bridge source path (expected app or lib): " + rawPath);
        }
        return new CompilerBridgeSourceInfo(sourceKind, sourceKindRoot.relativize(rawPath));
    }
}
