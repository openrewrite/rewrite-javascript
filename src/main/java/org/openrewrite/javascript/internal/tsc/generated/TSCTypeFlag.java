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

public enum TSCTypeFlag {
    Any(1),
    Unknown(2),
    String(4),
    Number(8),
    Boolean(16),
    Enum(32),
    BigInt(64),
    StringLiteral(128),
    NumberLiteral(256),
    BooleanLiteral(512),
    EnumLiteral(1024),
    BigIntLiteral(2048),
    ESSymbol(4096),
    UniqueESSymbol(8192),
    Void(16384),
    Undefined(32768),
    Null(65536),
    Never(131072),
    /** Also includes IncludesMissingType */
    TypeParameter(262144),
    Object(524288),
    Union(1048576),
    Intersection(2097152),
    /** Also includes IncludesNonWideningType */
    Index(4194304),
    /** Also includes IncludesWildcard */
    IndexedAccess(8388608),
    /** Also includes IncludesEmptyObject */
    Conditional(16777216),
    /** Also includes IncludesInstantiable */
    Substitution(33554432),
    NonPrimitive(67108864),
    TemplateLiteral(134217728),
    StringMapping(268435456),
    AnyOrUnknown(3),
    Nullable(98304),
    Literal(2944),
    Unit(109472),
    Freshable(2976),
    StringOrNumberLiteral(384),
    StringOrNumberLiteralOrUnique(8576),
    DefinitelyFalsy(117632),
    PossiblyFalsy(117724),
    Intrinsic(67359327),
    Primitive(134348796),
    StringLike(402653316),
    NumberLike(296),
    BigIntLike(2112),
    BooleanLike(528),
    EnumLike(1056),
    ESSymbolLike(12288),
    VoidLike(49152),
    DefinitelyNonNullable(470302716),
    DisjointDomains(469892092),
    UnionOrIntersection(3145728),
    StructuredType(3670016),
    TypeVariable(8650752),
    InstantiableNonPrimitive(58982400),
    InstantiablePrimitive(406847488),
    Instantiable(465829888),
    StructuredOrInstantiable(469499904),
    ObjectFlagsType(3899393),
    Simplifiable(25165824),
    Singleton(67358815),
    Narrowable(536624127),
    IncludesMask(205258751),
    NotPrimitiveUnion(36323363);


    public final int code;

    TSCTypeFlag(int code) {
        this.code = code;
    }

    public static TSCTypeFlag fromMaskExact(int code) {
        switch (code) {
            case 1:
                return TSCTypeFlag.Any;
            case 2:
                return TSCTypeFlag.Unknown;
            case 4:
                return TSCTypeFlag.String;
            case 8:
                return TSCTypeFlag.Number;
            case 16:
                return TSCTypeFlag.Boolean;
            case 32:
                return TSCTypeFlag.Enum;
            case 64:
                return TSCTypeFlag.BigInt;
            case 128:
                return TSCTypeFlag.StringLiteral;
            case 256:
                return TSCTypeFlag.NumberLiteral;
            case 512:
                return TSCTypeFlag.BooleanLiteral;
            case 1024:
                return TSCTypeFlag.EnumLiteral;
            case 2048:
                return TSCTypeFlag.BigIntLiteral;
            case 4096:
                return TSCTypeFlag.ESSymbol;
            case 8192:
                return TSCTypeFlag.UniqueESSymbol;
            case 16384:
                return TSCTypeFlag.Void;
            case 32768:
                return TSCTypeFlag.Undefined;
            case 65536:
                return TSCTypeFlag.Null;
            case 131072:
                return TSCTypeFlag.Never;
            case 262144:
                return TSCTypeFlag.TypeParameter;
            case 524288:
                return TSCTypeFlag.Object;
            case 1048576:
                return TSCTypeFlag.Union;
            case 2097152:
                return TSCTypeFlag.Intersection;
            case 4194304:
                return TSCTypeFlag.Index;
            case 8388608:
                return TSCTypeFlag.IndexedAccess;
            case 16777216:
                return TSCTypeFlag.Conditional;
            case 33554432:
                return TSCTypeFlag.Substitution;
            case 67108864:
                return TSCTypeFlag.NonPrimitive;
            case 134217728:
                return TSCTypeFlag.TemplateLiteral;
            case 268435456:
                return TSCTypeFlag.StringMapping;
            case 3:
                return TSCTypeFlag.AnyOrUnknown;
            case 98304:
                return TSCTypeFlag.Nullable;
            case 2944:
                return TSCTypeFlag.Literal;
            case 109472:
                return TSCTypeFlag.Unit;
            case 2976:
                return TSCTypeFlag.Freshable;
            case 384:
                return TSCTypeFlag.StringOrNumberLiteral;
            case 8576:
                return TSCTypeFlag.StringOrNumberLiteralOrUnique;
            case 117632:
                return TSCTypeFlag.DefinitelyFalsy;
            case 117724:
                return TSCTypeFlag.PossiblyFalsy;
            case 67359327:
                return TSCTypeFlag.Intrinsic;
            case 134348796:
                return TSCTypeFlag.Primitive;
            case 402653316:
                return TSCTypeFlag.StringLike;
            case 296:
                return TSCTypeFlag.NumberLike;
            case 2112:
                return TSCTypeFlag.BigIntLike;
            case 528:
                return TSCTypeFlag.BooleanLike;
            case 1056:
                return TSCTypeFlag.EnumLike;
            case 12288:
                return TSCTypeFlag.ESSymbolLike;
            case 49152:
                return TSCTypeFlag.VoidLike;
            case 470302716:
                return TSCTypeFlag.DefinitelyNonNullable;
            case 469892092:
                return TSCTypeFlag.DisjointDomains;
            case 3145728:
                return TSCTypeFlag.UnionOrIntersection;
            case 3670016:
                return TSCTypeFlag.StructuredType;
            case 8650752:
                return TSCTypeFlag.TypeVariable;
            case 58982400:
                return TSCTypeFlag.InstantiableNonPrimitive;
            case 406847488:
                return TSCTypeFlag.InstantiablePrimitive;
            case 465829888:
                return TSCTypeFlag.Instantiable;
            case 469499904:
                return TSCTypeFlag.StructuredOrInstantiable;
            case 3899393:
                return TSCTypeFlag.ObjectFlagsType;
            case 25165824:
                return TSCTypeFlag.Simplifiable;
            case 67358815:
                return TSCTypeFlag.Singleton;
            case 536624127:
                return TSCTypeFlag.Narrowable;
            case 205258751:
                return TSCTypeFlag.IncludesMask;
            case 36323363:
                return TSCTypeFlag.NotPrimitiveUnion;
            default:
                throw new IllegalArgumentException("unknown TSCTypeFlag code: " + code);
        }
    }

    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }

    public static int union(TSCTypeFlag... args) {
        int result = 0;
        for (TSCTypeFlag arg : args) {
            result = result | arg.code;
        }
        return result;
    }
}
