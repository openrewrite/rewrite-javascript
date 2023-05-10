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
package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.values.reference.V8ValueObject;
import lombok.Value;
import org.openrewrite.javascript.internal.tsc.generated.TSCObjectFlag;
import org.openrewrite.javascript.internal.tsc.generated.TSCTypeFlag;

import javax.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TSCType implements TSCV8Backed {

    @Value
    static class DebugInfo {
        List<TSCTypeFlag> typeFlags;
        List<TSCObjectFlag> objectFlags;
        Map<String, Object> properties;
    }

    /** Indicates that a type or method is marked `@internal` in the TSC source code. */
    @interface TSCInternal {}

    interface AccessorsBase {
        TSCType wrapped();
    }

    public interface ObjectType extends AccessorsBase {
        // TODO unmapped properties: `members`

        @TSCInternal
        default @Nullable List<TSCSymbol> getProperties() {
            return wrapped().getOptionalSymbolListProperty("properties");
        }

        @TSCInternal
        default @Nullable List<TSCSignature> getCallSignatures() {
            return wrapped().getOptionalSignatureListProperty("callSignatures");
        }

        @TSCInternal
        default @Nullable List<TSCSignature> getConstructSignatures() {
            return wrapped().getOptionalSignatureListProperty("constructSignatures");
        }

        @TSCInternal
        default @Nullable List<TSCIndexInfo> getIndexInfos() {
            return wrapped().getOptionalIndexInfoListProperty("indexInfos");
        }

        @TSCInternal
        default @Nullable ObjectType getObjectTypeWithoutAbstractConstructSignatures() {
            TSCType resultType = wrapped().getOptionalTypeProperty("objectTypeWithoutAbstractConstructSignatures");
            return resultType == null ? null : resultType.asObjectType();
        }
    }

    public interface InterfaceType extends AccessorsBase, ObjectType {
        default @Nullable List<TSCType> getTypeParameters() {
            return wrapped().getOptionalTypeListProperty("typeParameters");
        }

        default @Nullable List<TSCType> getOuterTypeParameters() {
            return wrapped().getOptionalTypeListProperty("outerTypeParameters");
        }

        default @Nullable List<TSCType> getLocalTypeParameters() {
            return wrapped().getOptionalTypeListProperty("localTypeParameters");
        }

        default @Nullable TSCType getThisType() {
            return wrapped().getOptionalTypeProperty("thisType");
        }

        @TSCInternal
        default @Nullable TSCType getResolvedBaseConstructorType() {
            return wrapped().getOptionalTypeProperty("resolvedBaseConstructorType");
        }

        @TSCInternal
        default List<TSCType> getResolvedBaseTypes() {
            return wrapped().getTypeListProperty("resolvedBaseTypes");
        }

        @TSCInternal
        default boolean getBaseTypesResolved() {
            return wrapped().getBooleanProperty("baseTypesResolved");
        }
    }

    public interface UnionOrIntersectionType extends AccessorsBase {
        // TODO unmapped properties: all @internal properties
        default List<TSCType> getTypes() {
            return wrapped().getTypeListProperty("types");
        }
    }


    private final TSCProgramContext programContext;
    public final V8ValueObject typeV8;

    public TSCType(TSCProgramContext programContext, V8ValueObject typeV8) {
        this.programContext = programContext;
        this.typeV8 = typeV8;
    }

    @Override
    public TSCProgramContext getProgramContext() {
        return programContext;
    }

    @Override
    public String toString() {
        return "Type(" + getTypeChecker().typeToString(this) + ")";
    }

    @Override
    public DebugInfo getDebugInfo() {
        return new DebugInfo(listMatchingTypeFlags(), listMatchingObjectFlags(), getAllPropertiesForDebugging());
    }

    public long getTypeId() {
        return getLongProperty("id");
    }

    public TSCSymbol getSymbolForType() {
        return getSymbolProperty("symbol");
    }

    public int getTypeFlags() {
        return getIntProperty("flags");
    }

    public boolean hasTypeFlag(TSCTypeFlag flag) {
        return flag.matches(this.getTypeFlags());
    }

    public boolean hasExactTypeFlag(TSCTypeFlag flag) {
        return flag.code == this.getTypeFlags();
    }

    /**
     * This is not what you usually want. Type flags are a bit field.
     */
    public TSCTypeFlag getExactTypeFlag() {
        return TSCTypeFlag.fromMaskExact(this.getTypeFlags());
    }

    /**
     * Only intended for debugging; this is slow.
     */
    public List<TSCTypeFlag> listMatchingTypeFlags() {
        final int typeFlags = this.getTypeFlags();
        List<TSCTypeFlag> result = new ArrayList<>();
        for (TSCTypeFlag flag : TSCTypeFlag.values()) {
            if (flag.matches(typeFlags)) {
                result.add(flag);
            }
        }
        return result;
    }

    public int getObjectFlags() {
        if (!this.hasTypeFlag(TSCTypeFlag.ObjectFlagsType)) {
            return 0;
        } else {
            return getIntProperty("objectFlags");
        }
    }

    public boolean hasObjectFlag(TSCObjectFlag flag) {
        return flag.matches(this.getObjectFlags());
    }

    /**
     * Only intended for debugging; this is slow.
     */
    public List<TSCObjectFlag> listMatchingObjectFlags() {
        final int objectFlags = this.getObjectFlags();
        List<TSCObjectFlag> result = new ArrayList<>();
        for (TSCObjectFlag flag : TSCObjectFlag.values()) {
            if (flag.matches(objectFlags)) {
                result.add(flag);
            }
        }
        return result;
    }

    public List<TSCSymbol> getTypeProperties() {
        return this.getSymbolListProperty("getProperties()");
    }

    public @Nullable InterfaceType asInterfaceType() {
        if (hasObjectFlag(TSCObjectFlag.Interface) || hasObjectFlag(TSCObjectFlag.Class)) {
            return () -> TSCType.this;
        }
        return null;
    }

    public @Nullable UnionOrIntersectionType asUnionOrIntersectionType() {
        if (hasTypeFlag(TSCTypeFlag.UnionOrIntersection)) {
            return () -> TSCType.this;
        }
        return null;
    }

    public @Nullable ObjectType asObjectType() {
        if (hasTypeFlag(TSCTypeFlag.Object)) {
            return () -> TSCType.this;
        }
        return null;
    }

    @Override
    public V8ValueObject getBackingV8Object() {
        return typeV8;
    }
}
