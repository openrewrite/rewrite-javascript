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

public enum SymbolFlags {
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

    SymbolFlags(int code) {
        this.code = code;
    }

    public static SymbolFlags fromCode(int code) {
        switch (code) {
            case 0:
                return SymbolFlags.None;
            case 1:
                return SymbolFlags.FunctionScopedVariable;
            case 2:
                return SymbolFlags.BlockScopedVariable;
            case 4:
                return SymbolFlags.Property;
            case 8:
                return SymbolFlags.EnumMember;
            case 16:
                return SymbolFlags.Function;
            case 32:
                return SymbolFlags.Class;
            case 64:
                return SymbolFlags.Interface;
            case 128:
                return SymbolFlags.ConstEnum;
            case 256:
                return SymbolFlags.RegularEnum;
            case 512:
                return SymbolFlags.ValueModule;
            case 1024:
                return SymbolFlags.NamespaceModule;
            case 2048:
                return SymbolFlags.TypeLiteral;
            case 4096:
                return SymbolFlags.ObjectLiteral;
            case 8192:
                return SymbolFlags.Method;
            case 16384:
                return SymbolFlags.Constructor;
            case 32768:
                return SymbolFlags.GetAccessor;
            case 65536:
                return SymbolFlags.SetAccessor;
            case 131072:
                return SymbolFlags.Signature;
            case 262144:
                return SymbolFlags.TypeParameter;
            case 524288:
                return SymbolFlags.TypeAlias;
            case 1048576:
                return SymbolFlags.ExportValue;
            case 2097152:
                return SymbolFlags.Alias;
            case 4194304:
                return SymbolFlags.Prototype;
            case 8388608:
                return SymbolFlags.ExportStar;
            case 16777216:
                return SymbolFlags.Optional;
            case 33554432:
                return SymbolFlags.Transient;
            case 67108864:
                return SymbolFlags.Assignment;
            case 134217728:
                return SymbolFlags.ModuleExports;
            case 67108863:
                return SymbolFlags.All;
            case 384:
                return SymbolFlags.Enum;
            case 3:
                return SymbolFlags.Variable;
            case 111551:
                return SymbolFlags.Value;
            case 788968:
                return SymbolFlags.Type;
            case 1920:
                return SymbolFlags.Namespace;
            case 1536:
                return SymbolFlags.Module;
            case 98304:
                return SymbolFlags.Accessor;
            case 111550:
                return SymbolFlags.FunctionScopedVariableExcludes;
            case 900095:
                return SymbolFlags.EnumMemberExcludes;
            case 110991:
                return SymbolFlags.FunctionExcludes;
            case 899503:
                return SymbolFlags.ClassExcludes;
            case 788872:
                return SymbolFlags.InterfaceExcludes;
            case 899327:
                return SymbolFlags.RegularEnumExcludes;
            case 899967:
                return SymbolFlags.ConstEnumExcludes;
            case 110735:
                return SymbolFlags.ValueModuleExcludes;
            case 103359:
                return SymbolFlags.MethodExcludes;
            case 46015:
                return SymbolFlags.GetAccessorExcludes;
            case 78783:
                return SymbolFlags.SetAccessorExcludes;
            case 13247:
                return SymbolFlags.AccessorExcludes;
            case 526824:
                return SymbolFlags.TypeParameterExcludes;
            case 2623475:
                return SymbolFlags.ModuleMember;
            case 944:
                return SymbolFlags.ExportHasLocal;
            case 418:
                return SymbolFlags.BlockScoped;
            case 98308:
                return SymbolFlags.PropertyOrAccessor;
            case 106500:
                return SymbolFlags.ClassMember;
            case 112:
                return SymbolFlags.ExportSupportsDefaultModifier;
            case -113:
                return SymbolFlags.ExportDoesNotSupportDefaultModifier;
            case 2885600:
                return SymbolFlags.Classifiable;
            case 6256:
                return SymbolFlags.LateBindingContainer;
            default:
                throw new IllegalArgumentException("unknown SymbolFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
