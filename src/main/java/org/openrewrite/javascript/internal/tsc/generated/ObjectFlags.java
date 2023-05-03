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

public enum ObjectFlags {
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

    ObjectFlags(int code) {
        this.code = code;
    }

    public static ObjectFlags fromCode(int code) {
        switch (code) {
            case 0:
                return ObjectFlags.None;
            case 1:
                return ObjectFlags.Class;
            case 2:
                return ObjectFlags.Interface;
            case 4:
                return ObjectFlags.Reference;
            case 8:
                return ObjectFlags.Tuple;
            case 16:
                return ObjectFlags.Anonymous;
            case 32:
                return ObjectFlags.Mapped;
            case 64:
                return ObjectFlags.Instantiated;
            case 128:
                return ObjectFlags.ObjectLiteral;
            case 256:
                return ObjectFlags.EvolvingArray;
            case 512:
                return ObjectFlags.ObjectLiteralPatternWithComputedProperties;
            case 1024:
                return ObjectFlags.ReverseMapped;
            case 2048:
                return ObjectFlags.JsxAttributes;
            case 4096:
                return ObjectFlags.JSLiteral;
            case 8192:
                return ObjectFlags.FreshLiteral;
            case 16384:
                return ObjectFlags.ArrayLiteral;
            case 32768:
                return ObjectFlags.PrimitiveUnion;
            case 65536:
                return ObjectFlags.ContainsWideningType;
            case 131072:
                return ObjectFlags.ContainsObjectOrArrayLiteral;
            case 262144:
                return ObjectFlags.NonInferrableType;
            case 524288:
                return ObjectFlags.CouldContainTypeVariablesComputed;
            case 1048576:
                return ObjectFlags.CouldContainTypeVariables;
            case 3:
                return ObjectFlags.ClassOrInterface;
            case 196608:
                return ObjectFlags.RequiresWidening;
            case 458752:
                return ObjectFlags.PropagatingFlags;
            case 1343:
                return ObjectFlags.ObjectTypeKindMask;
            case 2097152:
                return ObjectFlags.ContainsSpread;
            case 4194304:
                return ObjectFlags.ObjectRestType;
            case 8388608:
                return ObjectFlags.InstantiationExpressionType;
            case 16777216:
                return ObjectFlags.IsClassInstanceClone;
            case 33554432:
                return ObjectFlags.IdenticalBaseTypeCalculated;
            case 67108864:
                return ObjectFlags.IdenticalBaseTypeExists;
            case 12582912:
                return ObjectFlags.IsGenericType;
            default:
                throw new IllegalArgumentException("unknown ObjectFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
