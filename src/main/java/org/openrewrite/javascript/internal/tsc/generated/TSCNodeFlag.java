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
    Using(4),
    /** Also includes Constant */
    AwaitUsing(6),
    NestedNamespace(8),
    Synthesized(16),
    Namespace(32),
    OptionalChain(64),
    ExportContext(128),
    /** Also includes IdentifierHasExtendedUnicodeEscape */
    ContainsThis(256),
    HasImplicitReturn(512),
    HasExplicitReturn(1024),
    GlobalAugmentation(2048),
    /** Also includes IdentifierIsInJSDocNamespace */
    HasAsyncFunctions(4096),
    DisallowInContext(8192),
    YieldContext(16384),
    DecoratorContext(32768),
    AwaitContext(65536),
    DisallowConditionalTypesContext(131072),
    ThisNodeHasError(262144),
    JavaScriptFile(524288),
    ThisNodeOrAnySubNodesHasError(1048576),
    HasAggregatedChildData(2097152),
    PossiblyContainsDynamicImport(4194304),
    PossiblyContainsImportMeta(8388608),
    JSDoc(16777216),
    Ambient(33554432),
    InWithStatement(67108864),
    JsonFile(134217728),
    TypeCached(268435456),
    Deprecated(536870912),
    BlockScoped(7),
    ReachabilityCheckFlags(1536),
    ReachabilityAndEmitFlags(5632),
    ContextFlags(101441536),
    TypeExcludesFlags(81920),
    PermanentlySetIncrementalFlags(12582912);


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
                return TSCNodeFlag.Using;
            case 6:
                return TSCNodeFlag.AwaitUsing;
            case 8:
                return TSCNodeFlag.NestedNamespace;
            case 16:
                return TSCNodeFlag.Synthesized;
            case 32:
                return TSCNodeFlag.Namespace;
            case 64:
                return TSCNodeFlag.OptionalChain;
            case 128:
                return TSCNodeFlag.ExportContext;
            case 256:
                return TSCNodeFlag.ContainsThis;
            case 512:
                return TSCNodeFlag.HasImplicitReturn;
            case 1024:
                return TSCNodeFlag.HasExplicitReturn;
            case 2048:
                return TSCNodeFlag.GlobalAugmentation;
            case 4096:
                return TSCNodeFlag.HasAsyncFunctions;
            case 8192:
                return TSCNodeFlag.DisallowInContext;
            case 16384:
                return TSCNodeFlag.YieldContext;
            case 32768:
                return TSCNodeFlag.DecoratorContext;
            case 65536:
                return TSCNodeFlag.AwaitContext;
            case 131072:
                return TSCNodeFlag.DisallowConditionalTypesContext;
            case 262144:
                return TSCNodeFlag.ThisNodeHasError;
            case 524288:
                return TSCNodeFlag.JavaScriptFile;
            case 1048576:
                return TSCNodeFlag.ThisNodeOrAnySubNodesHasError;
            case 2097152:
                return TSCNodeFlag.HasAggregatedChildData;
            case 4194304:
                return TSCNodeFlag.PossiblyContainsDynamicImport;
            case 8388608:
                return TSCNodeFlag.PossiblyContainsImportMeta;
            case 16777216:
                return TSCNodeFlag.JSDoc;
            case 33554432:
                return TSCNodeFlag.Ambient;
            case 67108864:
                return TSCNodeFlag.InWithStatement;
            case 134217728:
                return TSCNodeFlag.JsonFile;
            case 268435456:
                return TSCNodeFlag.TypeCached;
            case 536870912:
                return TSCNodeFlag.Deprecated;
            case 7:
                return TSCNodeFlag.BlockScoped;
            case 1536:
                return TSCNodeFlag.ReachabilityCheckFlags;
            case 5632:
                return TSCNodeFlag.ReachabilityAndEmitFlags;
            case 101441536:
                return TSCNodeFlag.ContextFlags;
            case 81920:
                return TSCNodeFlag.TypeExcludesFlags;
            case 12582912:
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
