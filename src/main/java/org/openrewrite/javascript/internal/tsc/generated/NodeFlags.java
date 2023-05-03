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

public enum NodeFlags {
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

    NodeFlags(int code) {
        this.code = code;
    }

    public static NodeFlags fromCode(int code) {
        switch (code) {
            case 0:
                return NodeFlags.None;
            case 1:
                return NodeFlags.Let;
            case 2:
                return NodeFlags.Const;
            case 4:
                return NodeFlags.NestedNamespace;
            case 8:
                return NodeFlags.Synthesized;
            case 16:
                return NodeFlags.Namespace;
            case 32:
                return NodeFlags.OptionalChain;
            case 64:
                return NodeFlags.ExportContext;
            case 128:
                return NodeFlags.ContainsThis;
            case 256:
                return NodeFlags.HasImplicitReturn;
            case 512:
                return NodeFlags.HasExplicitReturn;
            case 1024:
                return NodeFlags.GlobalAugmentation;
            case 2048:
                return NodeFlags.HasAsyncFunctions;
            case 4096:
                return NodeFlags.DisallowInContext;
            case 8192:
                return NodeFlags.YieldContext;
            case 16384:
                return NodeFlags.DecoratorContext;
            case 32768:
                return NodeFlags.AwaitContext;
            case 65536:
                return NodeFlags.DisallowConditionalTypesContext;
            case 131072:
                return NodeFlags.ThisNodeHasError;
            case 262144:
                return NodeFlags.JavaScriptFile;
            case 524288:
                return NodeFlags.ThisNodeOrAnySubNodesHasError;
            case 1048576:
                return NodeFlags.HasAggregatedChildData;
            case 2097152:
                return NodeFlags.PossiblyContainsDynamicImport;
            case 4194304:
                return NodeFlags.PossiblyContainsImportMeta;
            case 8388608:
                return NodeFlags.JSDoc;
            case 16777216:
                return NodeFlags.Ambient;
            case 33554432:
                return NodeFlags.InWithStatement;
            case 67108864:
                return NodeFlags.JsonFile;
            case 134217728:
                return NodeFlags.TypeCached;
            case 268435456:
                return NodeFlags.Deprecated;
            case 3:
                return NodeFlags.BlockScoped;
            case 768:
                return NodeFlags.ReachabilityCheckFlags;
            case 2816:
                return NodeFlags.ReachabilityAndEmitFlags;
            case 50720768:
                return NodeFlags.ContextFlags;
            case 40960:
                return NodeFlags.TypeExcludesFlags;
            case 6291456:
                return NodeFlags.PermanentlySetIncrementalFlags;
            default:
                throw new IllegalArgumentException("unknown NodeFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
