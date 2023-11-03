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

public enum TSCTokenFlag {
    None(0),
    PrecedingLineBreak(1),
    PrecedingJSDocComment(2),
    Unterminated(4),
    ExtendedUnicodeEscape(8),
    Scientific(16),
    Octal(32),
    HexSpecifier(64),
    BinarySpecifier(128),
    OctalSpecifier(256),
    ContainsSeparator(512),
    UnicodeEscape(1024),
    ContainsInvalidEscape(2048),
    HexEscape(4096),
    ContainsLeadingZero(8192),
    ContainsInvalidSeparator(16384),
    BinaryOrOctalSpecifier(384),
    WithSpecifier(448),
    /** Also includes TemplateLiteralLikeFlags */
    StringLiteralFlags(7176),
    NumericLiteralFlags(25584),
    IsInvalid(26656);


    public final int code;

    TSCTokenFlag(int code) {
        this.code = code;
    }

    public static TSCTokenFlag fromMaskExact(int code) {
        switch (code) {
            case 0:
                return TSCTokenFlag.None;
            case 1:
                return TSCTokenFlag.PrecedingLineBreak;
            case 2:
                return TSCTokenFlag.PrecedingJSDocComment;
            case 4:
                return TSCTokenFlag.Unterminated;
            case 8:
                return TSCTokenFlag.ExtendedUnicodeEscape;
            case 16:
                return TSCTokenFlag.Scientific;
            case 32:
                return TSCTokenFlag.Octal;
            case 64:
                return TSCTokenFlag.HexSpecifier;
            case 128:
                return TSCTokenFlag.BinarySpecifier;
            case 256:
                return TSCTokenFlag.OctalSpecifier;
            case 512:
                return TSCTokenFlag.ContainsSeparator;
            case 1024:
                return TSCTokenFlag.UnicodeEscape;
            case 2048:
                return TSCTokenFlag.ContainsInvalidEscape;
            case 4096:
                return TSCTokenFlag.HexEscape;
            case 8192:
                return TSCTokenFlag.ContainsLeadingZero;
            case 16384:
                return TSCTokenFlag.ContainsInvalidSeparator;
            case 384:
                return TSCTokenFlag.BinaryOrOctalSpecifier;
            case 448:
                return TSCTokenFlag.WithSpecifier;
            case 7176:
                return TSCTokenFlag.StringLiteralFlags;
            case 25584:
                return TSCTokenFlag.NumericLiteralFlags;
            case 26656:
                return TSCTokenFlag.IsInvalid;
            default:
                throw new IllegalArgumentException("unknown TSCTokenFlag code: " + code);
        }
    }

    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }

    public static int union(TSCTokenFlag... args) {
        int result = 0;
        for (TSCTokenFlag arg : args) {
            result = result | arg.code;
        }
        return result;
    }
}
