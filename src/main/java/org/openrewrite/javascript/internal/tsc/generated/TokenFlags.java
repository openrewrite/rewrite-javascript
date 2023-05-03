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

public enum TokenFlags {
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

    TokenFlags(int code) {
        this.code = code;
    }

    public static TokenFlags fromCode(int code) {
        switch (code) {
            case 0:
                return TokenFlags.None;
            case 1:
                return TokenFlags.PrecedingLineBreak;
            case 2:
                return TokenFlags.PrecedingJSDocComment;
            case 4:
                return TokenFlags.Unterminated;
            case 8:
                return TokenFlags.ExtendedUnicodeEscape;
            case 16:
                return TokenFlags.Scientific;
            case 32:
                return TokenFlags.Octal;
            case 64:
                return TokenFlags.HexSpecifier;
            case 128:
                return TokenFlags.BinarySpecifier;
            case 256:
                return TokenFlags.OctalSpecifier;
            case 512:
                return TokenFlags.ContainsSeparator;
            case 1024:
                return TokenFlags.UnicodeEscape;
            case 2048:
                return TokenFlags.ContainsInvalidEscape;
            case 384:
                return TokenFlags.BinaryOrOctalSpecifier;
            case 1008:
                return TokenFlags.NumericLiteralFlags;
            default:
                throw new IllegalArgumentException("unknown TokenFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
