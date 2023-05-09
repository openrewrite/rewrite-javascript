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

public enum TSCNodeFlag {
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

    TSCNodeFlag(int code) {
        this.code = code;
    }

    public static TSCNodeFlag fromMaskExact(int code) {
        switch (code) {
            case 0:
                return TSCNodeFlag.None;
            case 1:
                return TSCNodeFlag.Let;
            case 2:
                return TSCNodeFlag.Const;
            case 4:
                return TSCNodeFlag.NestedNamespace;
            case 8:
                return TSCNodeFlag.Synthesized;
            case 16:
                return TSCNodeFlag.Namespace;
            case 32:
                return TSCNodeFlag.OptionalChain;
            case 64:
                return TSCNodeFlag.ExportContext;
            case 128:
                return TSCNodeFlag.ContainsThis;
            case 256:
                return TSCNodeFlag.HasImplicitReturn;
            case 512:
                return TSCNodeFlag.HasExplicitReturn;
            case 1024:
                return TSCNodeFlag.GlobalAugmentation;
            case 2048:
                return TSCNodeFlag.HasAsyncFunctions;
            case 4096:
                return TSCNodeFlag.DisallowInContext;
            case 8192:
                return TSCNodeFlag.YieldContext;
            case 16384:
                return TSCNodeFlag.DecoratorContext;
            case 32768:
                return TSCNodeFlag.AwaitContext;
            case 65536:
                return TSCNodeFlag.DisallowConditionalTypesContext;
            case 131072:
                return TSCNodeFlag.ThisNodeHasError;
            case 262144:
                return TSCNodeFlag.JavaScriptFile;
            case 524288:
                return TSCNodeFlag.ThisNodeOrAnySubNodesHasError;
            case 1048576:
                return TSCNodeFlag.HasAggregatedChildData;
            case 2097152:
                return TSCNodeFlag.PossiblyContainsDynamicImport;
            case 4194304:
                return TSCNodeFlag.PossiblyContainsImportMeta;
            case 8388608:
                return TSCNodeFlag.JSDoc;
            case 16777216:
                return TSCNodeFlag.Ambient;
            case 33554432:
                return TSCNodeFlag.InWithStatement;
            case 67108864:
                return TSCNodeFlag.JsonFile;
            case 134217728:
                return TSCNodeFlag.TypeCached;
            case 268435456:
                return TSCNodeFlag.Deprecated;
            case 3:
                return TSCNodeFlag.BlockScoped;
            case 768:
                return TSCNodeFlag.ReachabilityCheckFlags;
            case 2816:
                return TSCNodeFlag.ReachabilityAndEmitFlags;
            case 50720768:
                return TSCNodeFlag.ContextFlags;
            case 40960:
                return TSCNodeFlag.TypeExcludesFlags;
            case 6291456:
                return TSCNodeFlag.PermanentlySetIncrementalFlags;
            default:
                throw new IllegalArgumentException("unknown TSCNodeFlag code: " + code);
        }
    }

    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }

    public static int union(TSCNodeFlag... args) {
        int result = 0;
        for (TSCNodeFlag arg : args) {
            result = result | arg.code;
        }
        return result;
    }
}
