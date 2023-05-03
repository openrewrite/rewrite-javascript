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

public enum TSCTokenFlags {
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
    /** Also includes TemplateLiteralLikeFlags */
    ContainsInvalidEscape(2048),
    BinaryOrOctalSpecifier(384),
    NumericLiteralFlags(1008);


    public final int code;

    TSCTokenFlags(int code) {
        this.code = code;
    }

    public static TSCTokenFlags fromCode(int code) {
        switch (code) {
            case 0:
                return TSCTokenFlags.None;
            case 1:
                return TSCTokenFlags.PrecedingLineBreak;
            case 2:
                return TSCTokenFlags.PrecedingJSDocComment;
            case 4:
                return TSCTokenFlags.Unterminated;
            case 8:
                return TSCTokenFlags.ExtendedUnicodeEscape;
            case 16:
                return TSCTokenFlags.Scientific;
            case 32:
                return TSCTokenFlags.Octal;
            case 64:
                return TSCTokenFlags.HexSpecifier;
            case 128:
                return TSCTokenFlags.BinarySpecifier;
            case 256:
                return TSCTokenFlags.OctalSpecifier;
            case 512:
                return TSCTokenFlags.ContainsSeparator;
            case 1024:
                return TSCTokenFlags.UnicodeEscape;
            case 2048:
                return TSCTokenFlags.ContainsInvalidEscape;
            case 384:
                return TSCTokenFlags.BinaryOrOctalSpecifier;
            case 1008:
                return TSCTokenFlags.NumericLiteralFlags;
            default:
                throw new IllegalArgumentException("unknown TSCTokenFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
