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

public enum TSCSymbolFlag {
    /** Also includes PropertyExcludes, NamespaceModuleExcludes */
    None(0),
    FunctionScopedVariable(1),
    BlockScopedVariable(2),
    Property(4),
    EnumMember(8),
    Function(16),
    Class(32),
    Interface(64),
    ConstEnum(128),
    RegularEnum(256),
    ValueModule(512),
    NamespaceModule(1024),
    TypeLiteral(2048),
    ObjectLiteral(4096),
    Method(8192),
    Constructor(16384),
    GetAccessor(32768),
    SetAccessor(65536),
    Signature(131072),
    TypeParameter(262144),
    TypeAlias(524288),
    ExportValue(1048576),
    /** Also includes AliasExcludes */
    Alias(2097152),
    Prototype(4194304),
    ExportStar(8388608),
    Optional(16777216),
    Transient(33554432),
    Assignment(67108864),
    ModuleExports(134217728),
    All(67108863),
    Enum(384),
    Variable(3),
    /** Also includes BlockScopedVariableExcludes, ParameterExcludes */
    Value(111551),
    /** Also includes TypeAliasExcludes */
    Type(788968),
    Namespace(1920),
    Module(1536),
    Accessor(98304),
    FunctionScopedVariableExcludes(111550),
    EnumMemberExcludes(900095),
    FunctionExcludes(110991),
    ClassExcludes(899503),
    InterfaceExcludes(788872),
    RegularEnumExcludes(899327),
    ConstEnumExcludes(899967),
    ValueModuleExcludes(110735),
    MethodExcludes(103359),
    GetAccessorExcludes(46015),
    SetAccessorExcludes(78783),
    AccessorExcludes(13247),
    TypeParameterExcludes(526824),
    ModuleMember(2623475),
    ExportHasLocal(944),
    BlockScoped(418),
    PropertyOrAccessor(98308),
    ClassMember(106500),
    ExportSupportsDefaultModifier(112),
    ExportDoesNotSupportDefaultModifier(-113),
    Classifiable(2885600),
    LateBindingContainer(6256);


    public final int code;

    TSCSymbolFlag(int code) {
        this.code = code;
    }

    public static TSCSymbolFlag fromMaskExact(int code) {
        switch (code) {
            case 0:
                return TSCSymbolFlag.None;
            case 1:
                return TSCSymbolFlag.FunctionScopedVariable;
            case 2:
                return TSCSymbolFlag.BlockScopedVariable;
            case 4:
                return TSCSymbolFlag.Property;
            case 8:
                return TSCSymbolFlag.EnumMember;
            case 16:
                return TSCSymbolFlag.Function;
            case 32:
                return TSCSymbolFlag.Class;
            case 64:
                return TSCSymbolFlag.Interface;
            case 128:
                return TSCSymbolFlag.ConstEnum;
            case 256:
                return TSCSymbolFlag.RegularEnum;
            case 512:
                return TSCSymbolFlag.ValueModule;
            case 1024:
                return TSCSymbolFlag.NamespaceModule;
            case 2048:
                return TSCSymbolFlag.TypeLiteral;
            case 4096:
                return TSCSymbolFlag.ObjectLiteral;
            case 8192:
                return TSCSymbolFlag.Method;
            case 16384:
                return TSCSymbolFlag.Constructor;
            case 32768:
                return TSCSymbolFlag.GetAccessor;
            case 65536:
                return TSCSymbolFlag.SetAccessor;
            case 131072:
                return TSCSymbolFlag.Signature;
            case 262144:
                return TSCSymbolFlag.TypeParameter;
            case 524288:
                return TSCSymbolFlag.TypeAlias;
            case 1048576:
                return TSCSymbolFlag.ExportValue;
            case 2097152:
                return TSCSymbolFlag.Alias;
            case 4194304:
                return TSCSymbolFlag.Prototype;
            case 8388608:
                return TSCSymbolFlag.ExportStar;
            case 16777216:
                return TSCSymbolFlag.Optional;
            case 33554432:
                return TSCSymbolFlag.Transient;
            case 67108864:
                return TSCSymbolFlag.Assignment;
            case 134217728:
                return TSCSymbolFlag.ModuleExports;
            case 67108863:
                return TSCSymbolFlag.All;
            case 384:
                return TSCSymbolFlag.Enum;
            case 3:
                return TSCSymbolFlag.Variable;
            case 111551:
                return TSCSymbolFlag.Value;
            case 788968:
                return TSCSymbolFlag.Type;
            case 1920:
                return TSCSymbolFlag.Namespace;
            case 1536:
                return TSCSymbolFlag.Module;
            case 98304:
                return TSCSymbolFlag.Accessor;
            case 111550:
                return TSCSymbolFlag.FunctionScopedVariableExcludes;
            case 900095:
                return TSCSymbolFlag.EnumMemberExcludes;
            case 110991:
                return TSCSymbolFlag.FunctionExcludes;
            case 899503:
                return TSCSymbolFlag.ClassExcludes;
            case 788872:
                return TSCSymbolFlag.InterfaceExcludes;
            case 899327:
                return TSCSymbolFlag.RegularEnumExcludes;
            case 899967:
                return TSCSymbolFlag.ConstEnumExcludes;
            case 110735:
                return TSCSymbolFlag.ValueModuleExcludes;
            case 103359:
                return TSCSymbolFlag.MethodExcludes;
            case 46015:
                return TSCSymbolFlag.GetAccessorExcludes;
            case 78783:
                return TSCSymbolFlag.SetAccessorExcludes;
            case 13247:
                return TSCSymbolFlag.AccessorExcludes;
            case 526824:
                return TSCSymbolFlag.TypeParameterExcludes;
            case 2623475:
                return TSCSymbolFlag.ModuleMember;
            case 944:
                return TSCSymbolFlag.ExportHasLocal;
            case 418:
                return TSCSymbolFlag.BlockScoped;
            case 98308:
                return TSCSymbolFlag.PropertyOrAccessor;
            case 106500:
                return TSCSymbolFlag.ClassMember;
            case 112:
                return TSCSymbolFlag.ExportSupportsDefaultModifier;
            case -113:
                return TSCSymbolFlag.ExportDoesNotSupportDefaultModifier;
            case 2885600:
                return TSCSymbolFlag.Classifiable;
            case 6256:
                return TSCSymbolFlag.LateBindingContainer;
            default:
                throw new IllegalArgumentException("unknown TSCSymbolFlag code: " + code);
        }
    }

    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }

    public static int union(TSCSymbolFlag... args) {
        int result = 0;
        for (TSCSymbolFlag arg : args) {
            result = result | arg.code;
        }
        return result;
    }
}
