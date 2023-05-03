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

public enum TSCObjectFlags {
    None(0),
    Class(1),
    Interface(2),
    Reference(4),
    Tuple(8),
    Anonymous(16),
    Mapped(32),
    Instantiated(64),
    ObjectLiteral(128),
    EvolvingArray(256),
    ObjectLiteralPatternWithComputedProperties(512),
    ReverseMapped(1024),
    JsxAttributes(2048),
    JSLiteral(4096),
    FreshLiteral(8192),
    ArrayLiteral(16384),
    PrimitiveUnion(32768),
    ContainsWideningType(65536),
    ContainsObjectOrArrayLiteral(131072),
    NonInferrableType(262144),
    CouldContainTypeVariablesComputed(524288),
    CouldContainTypeVariables(1048576),
    ClassOrInterface(3),
    RequiresWidening(196608),
    PropagatingFlags(458752),
    ObjectTypeKindMask(1343),
    /** Also includes IsGenericTypeComputed */
    ContainsSpread(2097152),
    /** Also includes IsGenericObjectType */
    ObjectRestType(4194304),
    /** Also includes IsGenericIndexType */
    InstantiationExpressionType(8388608),
    /** Also includes ContainsIntersections, IsNeverIntersectionComputed */
    IsClassInstanceClone(16777216),
    /** Also includes IsUnknownLikeUnionComputed, IsNeverIntersection */
    IdenticalBaseTypeCalculated(33554432),
    /** Also includes IsUnknownLikeUnion */
    IdenticalBaseTypeExists(67108864),
    IsGenericType(12582912);


    public final int code;

    TSCObjectFlags(int code) {
        this.code = code;
    }

    public static TSCObjectFlags fromCode(int code) {
        switch (code) {
            case 0:
                return TSCObjectFlags.None;
            case 1:
                return TSCObjectFlags.Class;
            case 2:
                return TSCObjectFlags.Interface;
            case 4:
                return TSCObjectFlags.Reference;
            case 8:
                return TSCObjectFlags.Tuple;
            case 16:
                return TSCObjectFlags.Anonymous;
            case 32:
                return TSCObjectFlags.Mapped;
            case 64:
                return TSCObjectFlags.Instantiated;
            case 128:
                return TSCObjectFlags.ObjectLiteral;
            case 256:
                return TSCObjectFlags.EvolvingArray;
            case 512:
                return TSCObjectFlags.ObjectLiteralPatternWithComputedProperties;
            case 1024:
                return TSCObjectFlags.ReverseMapped;
            case 2048:
                return TSCObjectFlags.JsxAttributes;
            case 4096:
                return TSCObjectFlags.JSLiteral;
            case 8192:
                return TSCObjectFlags.FreshLiteral;
            case 16384:
                return TSCObjectFlags.ArrayLiteral;
            case 32768:
                return TSCObjectFlags.PrimitiveUnion;
            case 65536:
                return TSCObjectFlags.ContainsWideningType;
            case 131072:
                return TSCObjectFlags.ContainsObjectOrArrayLiteral;
            case 262144:
                return TSCObjectFlags.NonInferrableType;
            case 524288:
                return TSCObjectFlags.CouldContainTypeVariablesComputed;
            case 1048576:
                return TSCObjectFlags.CouldContainTypeVariables;
            case 3:
                return TSCObjectFlags.ClassOrInterface;
            case 196608:
                return TSCObjectFlags.RequiresWidening;
            case 458752:
                return TSCObjectFlags.PropagatingFlags;
            case 1343:
                return TSCObjectFlags.ObjectTypeKindMask;
            case 2097152:
                return TSCObjectFlags.ContainsSpread;
            case 4194304:
                return TSCObjectFlags.ObjectRestType;
            case 8388608:
                return TSCObjectFlags.InstantiationExpressionType;
            case 16777216:
                return TSCObjectFlags.IsClassInstanceClone;
            case 33554432:
                return TSCObjectFlags.IdenticalBaseTypeCalculated;
            case 67108864:
                return TSCObjectFlags.IdenticalBaseTypeExists;
            case 12582912:
                return TSCObjectFlags.IsGenericType;
            default:
                throw new IllegalArgumentException("unknown TSCObjectFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
