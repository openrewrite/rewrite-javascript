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
package org.openrewrite.javascript.internal.tsc.generated;

//
// THIS FILE IS GENERATED. Do not modify it by hand.
// See `js/README.md` for instructions to regenerate this file.
//

public enum TSCNodeFlags {
    None(0),
    Let(1),
    Const(2),
    NestedNamespace(4),
    Synthesized(8),
    Namespace(16),
    OptionalChain(32),
    ExportContext(64),
    /** Also includes IdentifierHasExtendedUnicodeEscape */
    ContainsThis(128),
    HasImplicitReturn(256),
    HasExplicitReturn(512),
    GlobalAugmentation(1024),
    /** Also includes IdentifierIsInJSDocNamespace */
    HasAsyncFunctions(2048),
    DisallowInContext(4096),
    YieldContext(8192),
    DecoratorContext(16384),
    AwaitContext(32768),
    DisallowConditionalTypesContext(65536),
    ThisNodeHasError(131072),
    JavaScriptFile(262144),
    ThisNodeOrAnySubNodesHasError(524288),
    HasAggregatedChildData(1048576),
    PossiblyContainsDynamicImport(2097152),
    PossiblyContainsImportMeta(4194304),
    JSDoc(8388608),
    Ambient(16777216),
    InWithStatement(33554432),
    JsonFile(67108864),
    TypeCached(134217728),
    Deprecated(268435456),
    BlockScoped(3),
    ReachabilityCheckFlags(768),
    ReachabilityAndEmitFlags(2816),
    ContextFlags(50720768),
    TypeExcludesFlags(40960),
    PermanentlySetIncrementalFlags(6291456);


    public final int code;

    TSCNodeFlags(int code) {
        this.code = code;
    }

    public static TSCNodeFlags fromCode(int code) {
        switch (code) {
            case 0:
                return TSCNodeFlags.None;
            case 1:
                return TSCNodeFlags.Let;
            case 2:
                return TSCNodeFlags.Const;
            case 4:
                return TSCNodeFlags.NestedNamespace;
            case 8:
                return TSCNodeFlags.Synthesized;
            case 16:
                return TSCNodeFlags.Namespace;
            case 32:
                return TSCNodeFlags.OptionalChain;
            case 64:
                return TSCNodeFlags.ExportContext;
            case 128:
                return TSCNodeFlags.ContainsThis;
            case 256:
                return TSCNodeFlags.HasImplicitReturn;
            case 512:
                return TSCNodeFlags.HasExplicitReturn;
            case 1024:
                return TSCNodeFlags.GlobalAugmentation;
            case 2048:
                return TSCNodeFlags.HasAsyncFunctions;
            case 4096:
                return TSCNodeFlags.DisallowInContext;
            case 8192:
                return TSCNodeFlags.YieldContext;
            case 16384:
                return TSCNodeFlags.DecoratorContext;
            case 32768:
                return TSCNodeFlags.AwaitContext;
            case 65536:
                return TSCNodeFlags.DisallowConditionalTypesContext;
            case 131072:
                return TSCNodeFlags.ThisNodeHasError;
            case 262144:
                return TSCNodeFlags.JavaScriptFile;
            case 524288:
                return TSCNodeFlags.ThisNodeOrAnySubNodesHasError;
            case 1048576:
                return TSCNodeFlags.HasAggregatedChildData;
            case 2097152:
                return TSCNodeFlags.PossiblyContainsDynamicImport;
            case 4194304:
                return TSCNodeFlags.PossiblyContainsImportMeta;
            case 8388608:
                return TSCNodeFlags.JSDoc;
            case 16777216:
                return TSCNodeFlags.Ambient;
            case 33554432:
                return TSCNodeFlags.InWithStatement;
            case 67108864:
                return TSCNodeFlags.JsonFile;
            case 134217728:
                return TSCNodeFlags.TypeCached;
            case 268435456:
                return TSCNodeFlags.Deprecated;
            case 3:
                return TSCNodeFlags.BlockScoped;
            case 768:
                return TSCNodeFlags.ReachabilityCheckFlags;
            case 2816:
                return TSCNodeFlags.ReachabilityAndEmitFlags;
            case 50720768:
                return TSCNodeFlags.ContextFlags;
            case 40960:
                return TSCNodeFlags.TypeExcludesFlags;
            case 6291456:
                return TSCNodeFlags.PermanentlySetIncrementalFlags;
            default:
                throw new IllegalArgumentException("unknown TSCNodeFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
