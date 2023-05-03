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

public enum TypeFlags {
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

    TypeFlags(int code) {
        this.code = code;
    }

    public static TypeFlags fromCode(int code) {
        switch (code) {
            case 1:
                return TypeFlags.Any;
            case 2:
                return TypeFlags.Unknown;
            case 4:
                return TypeFlags.String;
            case 8:
                return TypeFlags.Number;
            case 16:
                return TypeFlags.Boolean;
            case 32:
                return TypeFlags.Enum;
            case 64:
                return TypeFlags.BigInt;
            case 128:
                return TypeFlags.StringLiteral;
            case 256:
                return TypeFlags.NumberLiteral;
            case 512:
                return TypeFlags.BooleanLiteral;
            case 1024:
                return TypeFlags.EnumLiteral;
            case 2048:
                return TypeFlags.BigIntLiteral;
            case 4096:
                return TypeFlags.ESSymbol;
            case 8192:
                return TypeFlags.UniqueESSymbol;
            case 16384:
                return TypeFlags.Void;
            case 32768:
                return TypeFlags.Undefined;
            case 65536:
                return TypeFlags.Null;
            case 131072:
                return TypeFlags.Never;
            case 262144:
                return TypeFlags.TypeParameter;
            case 524288:
                return TypeFlags.Object;
            case 1048576:
                return TypeFlags.Union;
            case 2097152:
                return TypeFlags.Intersection;
            case 4194304:
                return TypeFlags.Index;
            case 8388608:
                return TypeFlags.IndexedAccess;
            case 16777216:
                return TypeFlags.Conditional;
            case 33554432:
                return TypeFlags.Substitution;
            case 67108864:
                return TypeFlags.NonPrimitive;
            case 134217728:
                return TypeFlags.TemplateLiteral;
            case 268435456:
                return TypeFlags.StringMapping;
            case 3:
                return TypeFlags.AnyOrUnknown;
            case 98304:
                return TypeFlags.Nullable;
            case 2944:
                return TypeFlags.Literal;
            case 109472:
                return TypeFlags.Unit;
            case 2976:
                return TypeFlags.Freshable;
            case 384:
                return TypeFlags.StringOrNumberLiteral;
            case 8576:
                return TypeFlags.StringOrNumberLiteralOrUnique;
            case 117632:
                return TypeFlags.DefinitelyFalsy;
            case 117724:
                return TypeFlags.PossiblyFalsy;
            case 67359327:
                return TypeFlags.Intrinsic;
            case 134348796:
                return TypeFlags.Primitive;
            case 402653316:
                return TypeFlags.StringLike;
            case 296:
                return TypeFlags.NumberLike;
            case 2112:
                return TypeFlags.BigIntLike;
            case 528:
                return TypeFlags.BooleanLike;
            case 1056:
                return TypeFlags.EnumLike;
            case 12288:
                return TypeFlags.ESSymbolLike;
            case 49152:
                return TypeFlags.VoidLike;
            case 470302716:
                return TypeFlags.DefinitelyNonNullable;
            case 469892092:
                return TypeFlags.DisjointDomains;
            case 3145728:
                return TypeFlags.UnionOrIntersection;
            case 3670016:
                return TypeFlags.StructuredType;
            case 8650752:
                return TypeFlags.TypeVariable;
            case 58982400:
                return TypeFlags.InstantiableNonPrimitive;
            case 406847488:
                return TypeFlags.InstantiablePrimitive;
            case 465829888:
                return TypeFlags.Instantiable;
            case 469499904:
                return TypeFlags.StructuredOrInstantiable;
            case 3899393:
                return TypeFlags.ObjectFlagsType;
            case 25165824:
                return TypeFlags.Simplifiable;
            case 67358815:
                return TypeFlags.Singleton;
            case 536624127:
                return TypeFlags.Narrowable;
            case 205258751:
                return TypeFlags.IncludesMask;
            case 36323363:
                return TypeFlags.NotPrimitiveUnion;
            default:
                throw new IllegalArgumentException("unknown TypeFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
