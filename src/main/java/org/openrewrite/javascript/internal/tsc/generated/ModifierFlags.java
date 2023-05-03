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

public enum ModifierFlags {
    None(0),
    Export(1),
    Ambient(2),
    Public(4),
    Private(8),
    Protected(16),
    Static(32),
    Readonly(64),
    Accessor(128),
    Abstract(256),
    Async(512),
    Default(1024),
    Const(2048),
    HasComputedJSDocModifiers(4096),
    Deprecated(8192),
    Override(16384),
    In(32768),
    Out(65536),
    Decorator(131072),
    HasComputedFlags(536870912),
    AccessibilityModifier(28),
    ParameterPropertyModifier(16476),
    NonPublicAccessibilityModifier(24),
    TypeScriptModifier(117086),
    ExportDefault(1025),
    All(258047),
    Modifier(126975);


    public final int code;

    ModifierFlags(int code) {
        this.code = code;
    }

    public static ModifierFlags fromCode(int code) {
        switch (code) {
            case 0:
                return ModifierFlags.None;
            case 1:
                return ModifierFlags.Export;
            case 2:
                return ModifierFlags.Ambient;
            case 4:
                return ModifierFlags.Public;
            case 8:
                return ModifierFlags.Private;
            case 16:
                return ModifierFlags.Protected;
            case 32:
                return ModifierFlags.Static;
            case 64:
                return ModifierFlags.Readonly;
            case 128:
                return ModifierFlags.Accessor;
            case 256:
                return ModifierFlags.Abstract;
            case 512:
                return ModifierFlags.Async;
            case 1024:
                return ModifierFlags.Default;
            case 2048:
                return ModifierFlags.Const;
            case 4096:
                return ModifierFlags.HasComputedJSDocModifiers;
            case 8192:
                return ModifierFlags.Deprecated;
            case 16384:
                return ModifierFlags.Override;
            case 32768:
                return ModifierFlags.In;
            case 65536:
                return ModifierFlags.Out;
            case 131072:
                return ModifierFlags.Decorator;
            case 536870912:
                return ModifierFlags.HasComputedFlags;
            case 28:
                return ModifierFlags.AccessibilityModifier;
            case 16476:
                return ModifierFlags.ParameterPropertyModifier;
            case 24:
                return ModifierFlags.NonPublicAccessibilityModifier;
            case 117086:
                return ModifierFlags.TypeScriptModifier;
            case 1025:
                return ModifierFlags.ExportDefault;
            case 258047:
                return ModifierFlags.All;
            case 126975:
                return ModifierFlags.Modifier;
            default:
                throw new IllegalArgumentException("unknown ModifierFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
