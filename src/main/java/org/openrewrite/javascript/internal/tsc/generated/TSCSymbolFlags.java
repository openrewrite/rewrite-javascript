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

public enum TSCSymbolFlags {
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

    TSCSymbolFlags(int code) {
        this.code = code;
    }

    public static TSCSymbolFlags fromCode(int code) {
        switch (code) {
            case 0:
                return TSCSymbolFlags.None;
            case 1:
                return TSCSymbolFlags.FunctionScopedVariable;
            case 2:
                return TSCSymbolFlags.BlockScopedVariable;
            case 4:
                return TSCSymbolFlags.Property;
            case 8:
                return TSCSymbolFlags.EnumMember;
            case 16:
                return TSCSymbolFlags.Function;
            case 32:
                return TSCSymbolFlags.Class;
            case 64:
                return TSCSymbolFlags.Interface;
            case 128:
                return TSCSymbolFlags.ConstEnum;
            case 256:
                return TSCSymbolFlags.RegularEnum;
            case 512:
                return TSCSymbolFlags.ValueModule;
            case 1024:
                return TSCSymbolFlags.NamespaceModule;
            case 2048:
                return TSCSymbolFlags.TypeLiteral;
            case 4096:
                return TSCSymbolFlags.ObjectLiteral;
            case 8192:
                return TSCSymbolFlags.Method;
            case 16384:
                return TSCSymbolFlags.Constructor;
            case 32768:
                return TSCSymbolFlags.GetAccessor;
            case 65536:
                return TSCSymbolFlags.SetAccessor;
            case 131072:
                return TSCSymbolFlags.Signature;
            case 262144:
                return TSCSymbolFlags.TypeParameter;
            case 524288:
                return TSCSymbolFlags.TypeAlias;
            case 1048576:
                return TSCSymbolFlags.ExportValue;
            case 2097152:
                return TSCSymbolFlags.Alias;
            case 4194304:
                return TSCSymbolFlags.Prototype;
            case 8388608:
                return TSCSymbolFlags.ExportStar;
            case 16777216:
                return TSCSymbolFlags.Optional;
            case 33554432:
                return TSCSymbolFlags.Transient;
            case 67108864:
                return TSCSymbolFlags.Assignment;
            case 134217728:
                return TSCSymbolFlags.ModuleExports;
            case 67108863:
                return TSCSymbolFlags.All;
            case 384:
                return TSCSymbolFlags.Enum;
            case 3:
                return TSCSymbolFlags.Variable;
            case 111551:
                return TSCSymbolFlags.Value;
            case 788968:
                return TSCSymbolFlags.Type;
            case 1920:
                return TSCSymbolFlags.Namespace;
            case 1536:
                return TSCSymbolFlags.Module;
            case 98304:
                return TSCSymbolFlags.Accessor;
            case 111550:
                return TSCSymbolFlags.FunctionScopedVariableExcludes;
            case 900095:
                return TSCSymbolFlags.EnumMemberExcludes;
            case 110991:
                return TSCSymbolFlags.FunctionExcludes;
            case 899503:
                return TSCSymbolFlags.ClassExcludes;
            case 788872:
                return TSCSymbolFlags.InterfaceExcludes;
            case 899327:
                return TSCSymbolFlags.RegularEnumExcludes;
            case 899967:
                return TSCSymbolFlags.ConstEnumExcludes;
            case 110735:
                return TSCSymbolFlags.ValueModuleExcludes;
            case 103359:
                return TSCSymbolFlags.MethodExcludes;
            case 46015:
                return TSCSymbolFlags.GetAccessorExcludes;
            case 78783:
                return TSCSymbolFlags.SetAccessorExcludes;
            case 13247:
                return TSCSymbolFlags.AccessorExcludes;
            case 526824:
                return TSCSymbolFlags.TypeParameterExcludes;
            case 2623475:
                return TSCSymbolFlags.ModuleMember;
            case 944:
                return TSCSymbolFlags.ExportHasLocal;
            case 418:
                return TSCSymbolFlags.BlockScoped;
            case 98308:
                return TSCSymbolFlags.PropertyOrAccessor;
            case 106500:
                return TSCSymbolFlags.ClassMember;
            case 112:
                return TSCSymbolFlags.ExportSupportsDefaultModifier;
            case -113:
                return TSCSymbolFlags.ExportDoesNotSupportDefaultModifier;
            case 2885600:
                return TSCSymbolFlags.Classifiable;
            case 6256:
                return TSCSymbolFlags.LateBindingContainer;
            default:
                throw new IllegalArgumentException("unknown TSCSymbolFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
