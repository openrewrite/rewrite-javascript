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

public enum TSCTypeFlags {
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

    TSCTypeFlags(int code) {
        this.code = code;
    }

    public static TSCTypeFlags fromCode(int code) {
        switch (code) {
            case 1:
                return TSCTypeFlags.Any;
            case 2:
                return TSCTypeFlags.Unknown;
            case 4:
                return TSCTypeFlags.String;
            case 8:
                return TSCTypeFlags.Number;
            case 16:
                return TSCTypeFlags.Boolean;
            case 32:
                return TSCTypeFlags.Enum;
            case 64:
                return TSCTypeFlags.BigInt;
            case 128:
                return TSCTypeFlags.StringLiteral;
            case 256:
                return TSCTypeFlags.NumberLiteral;
            case 512:
                return TSCTypeFlags.BooleanLiteral;
            case 1024:
                return TSCTypeFlags.EnumLiteral;
            case 2048:
                return TSCTypeFlags.BigIntLiteral;
            case 4096:
                return TSCTypeFlags.ESSymbol;
            case 8192:
                return TSCTypeFlags.UniqueESSymbol;
            case 16384:
                return TSCTypeFlags.Void;
            case 32768:
                return TSCTypeFlags.Undefined;
            case 65536:
                return TSCTypeFlags.Null;
            case 131072:
                return TSCTypeFlags.Never;
            case 262144:
                return TSCTypeFlags.TypeParameter;
            case 524288:
                return TSCTypeFlags.Object;
            case 1048576:
                return TSCTypeFlags.Union;
            case 2097152:
                return TSCTypeFlags.Intersection;
            case 4194304:
                return TSCTypeFlags.Index;
            case 8388608:
                return TSCTypeFlags.IndexedAccess;
            case 16777216:
                return TSCTypeFlags.Conditional;
            case 33554432:
                return TSCTypeFlags.Substitution;
            case 67108864:
                return TSCTypeFlags.NonPrimitive;
            case 134217728:
                return TSCTypeFlags.TemplateLiteral;
            case 268435456:
                return TSCTypeFlags.StringMapping;
            case 3:
                return TSCTypeFlags.AnyOrUnknown;
            case 98304:
                return TSCTypeFlags.Nullable;
            case 2944:
                return TSCTypeFlags.Literal;
            case 109472:
                return TSCTypeFlags.Unit;
            case 2976:
                return TSCTypeFlags.Freshable;
            case 384:
                return TSCTypeFlags.StringOrNumberLiteral;
            case 8576:
                return TSCTypeFlags.StringOrNumberLiteralOrUnique;
            case 117632:
                return TSCTypeFlags.DefinitelyFalsy;
            case 117724:
                return TSCTypeFlags.PossiblyFalsy;
            case 67359327:
                return TSCTypeFlags.Intrinsic;
            case 134348796:
                return TSCTypeFlags.Primitive;
            case 402653316:
                return TSCTypeFlags.StringLike;
            case 296:
                return TSCTypeFlags.NumberLike;
            case 2112:
                return TSCTypeFlags.BigIntLike;
            case 528:
                return TSCTypeFlags.BooleanLike;
            case 1056:
                return TSCTypeFlags.EnumLike;
            case 12288:
                return TSCTypeFlags.ESSymbolLike;
            case 49152:
                return TSCTypeFlags.VoidLike;
            case 470302716:
                return TSCTypeFlags.DefinitelyNonNullable;
            case 469892092:
                return TSCTypeFlags.DisjointDomains;
            case 3145728:
                return TSCTypeFlags.UnionOrIntersection;
            case 3670016:
                return TSCTypeFlags.StructuredType;
            case 8650752:
                return TSCTypeFlags.TypeVariable;
            case 58982400:
                return TSCTypeFlags.InstantiableNonPrimitive;
            case 406847488:
                return TSCTypeFlags.InstantiablePrimitive;
            case 465829888:
                return TSCTypeFlags.Instantiable;
            case 469499904:
                return TSCTypeFlags.StructuredOrInstantiable;
            case 3899393:
                return TSCTypeFlags.ObjectFlagsType;
            case 25165824:
                return TSCTypeFlags.Simplifiable;
            case 67358815:
                return TSCTypeFlags.Singleton;
            case 536624127:
                return TSCTypeFlags.Narrowable;
            case 205258751:
                return TSCTypeFlags.IncludesMask;
            case 36323363:
                return TSCTypeFlags.NotPrimitiveUnion;
            default:
                throw new IllegalArgumentException("unknown TSCTypeFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
