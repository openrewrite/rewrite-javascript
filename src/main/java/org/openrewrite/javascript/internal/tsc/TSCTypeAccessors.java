package org.openrewrite.javascript.internal.tsc;

import org.openrewrite.DebugOnly;
import org.openrewrite.javascript.internal.tsc.generated.TSCObjectFlag;
import org.openrewrite.javascript.internal.tsc.generated.TSCTypeFlag;

import javax.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public interface TSCTypeAccessors extends TSCV8Backed {

    //
    //  common accessors for all types, including the base TSCType
    //

    TSCType _typeInstanceInternal();

    default String typeToString() {
        return getTypeChecker().typeToString(_typeInstanceInternal());
    }

    default TSCType.DebugInfo getDebugInfo() {
        return new TSCType.DebugInfo(listMatchingTypeFlags(), listMatchingObjectFlags(), getAllPropertiesForDebugging());
    }

    default long getTypeId() {
        return getLongProperty("id");
    }

    default TSCSymbol getSymbolForType() {
        return getSymbolProperty("symbol");
    }

    default int getTypeFlags() {
        return getIntProperty("flags");
    }

    default boolean hasTypeFlag(TSCTypeFlag flag) {
        return flag.matches(this.getTypeFlags());
    }

    default boolean hasExactTypeFlag(TSCTypeFlag flag) {
        return flag.code == this.getTypeFlags();
    }

    /** This is not what you usually want. Type flags are a bit field. */
    default TSCTypeFlag getExactTypeFlag() {
        return TSCTypeFlag.fromMaskExact(this.getTypeFlags());
    }

    @DebugOnly
    default List<TSCTypeFlag> listMatchingTypeFlags() {
        final int typeFlags = this.getTypeFlags();
        List<TSCTypeFlag> result = new ArrayList<>();
        for (TSCTypeFlag flag : TSCTypeFlag.values()) {
            if (flag.matches(typeFlags)) {
                result.add(flag);
            }
        }
        return result;
    }

    default int getObjectFlags() {
        if (!this.hasTypeFlag(TSCTypeFlag.ObjectFlagsType)) {
            return 0;
        } else {
            return getIntProperty("objectFlags");
        }
    }

    default boolean hasObjectFlag(TSCObjectFlag flag) {
        return flag.matches(this.getObjectFlags());
    }

    @DebugOnly
    default List<TSCObjectFlag> listMatchingObjectFlags() {
        final int objectFlags = this.getObjectFlags();
        List<TSCObjectFlag> result = new ArrayList<>();
        for (TSCObjectFlag flag : TSCObjectFlag.values()) {
            if (flag.matches(objectFlags)) {
                result.add(flag);
            }
        }
        return result;
    }

    default List<TSCSymbol> getTypeProperties() {
        return this.getSymbolListProperty("getProperties()");
    }

    default @Nullable TSCType getConstraint() {
        return this.getOptionalTypeProperty("getConstraint()");
    }

    default @Nullable TSCType getDefault() {
        return this.getOptionalTypeProperty("getDefault()");
    }

    default @Nullable InterfaceType asInterfaceType() {
        if (hasObjectFlag(TSCObjectFlag.Interface) || hasObjectFlag(TSCObjectFlag.Class)) {
            return this::_typeInstanceInternal;
        }
        return null;
    }

    default InterfaceType assertInterfaceType() {
        return Objects.requireNonNull(asInterfaceType());
    }

    default @Nullable UnionOrIntersectionType asUnionOrIntersectionType() {
        if (hasTypeFlag(TSCTypeFlag.UnionOrIntersection)) {
            return this::_typeInstanceInternal;
        }
        return null;
    }

    default UnionOrIntersectionType assertUnionOrIntersectionType() {
        return Objects.requireNonNull(asUnionOrIntersectionType());
    }

    default @Nullable ObjectType asObjectType() {
        if (hasTypeFlag(TSCTypeFlag.Object)) {
            return this::_typeInstanceInternal;
        }
        return null;
    }

    default ObjectType assertObjectType() {
        return Objects.requireNonNull(asObjectType());
    }

    default @Nullable TypeReference asTypeReference() {
        if (hasObjectFlag(TSCObjectFlag.Reference)) {
            return this::_typeInstanceInternal;
        }
        return null;
    }

    default TypeReference assertTypeReference() {
        return Objects.requireNonNull(asTypeReference());
    }


    //
    //  specialized accessors for each interface under `Type` in the TSC
    //

    interface TypeWrapper extends TSCV8Backed.Wrapper, TSCTypeAccessors {
        default TSCType wrapped() {
            return _typeInstanceInternal();
        }
    }

    interface ObjectType extends TypeWrapper {
        // TODO unmapped properties: `members`

        @TSCInternal
        default @Nullable List<TSCSymbol> getProperties() {
            return getOptionalSymbolListProperty("properties");
        }

        @TSCInternal
        default @Nullable List<TSCSignature> getCallSignatures() {
            return getOptionalSignatureListProperty("callSignatures");
        }

        @TSCInternal
        default @Nullable List<TSCSignature> getConstructSignatures() {
            return getOptionalSignatureListProperty("constructSignatures");
        }

        @TSCInternal
        default @Nullable List<TSCIndexInfo> getIndexInfos() {
            return getOptionalIndexInfoListProperty("indexInfos");
        }

        @TSCInternal
        default @Nullable ObjectType getObjectTypeWithoutAbstractConstructSignatures() {
            TSCType resultType = getOptionalTypeProperty("objectTypeWithoutAbstractConstructSignatures");
            return resultType == null ? null : resultType.asObjectType();
        }
    }

    interface InterfaceType extends TypeWrapper, ObjectType {
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

    interface UnionOrIntersectionType extends TypeWrapper {
        // TODO unmapped properties: all @internal properties
        default List<TSCType> getTypes() {
            return wrapped().getTypeListProperty("types");
        }
    }

    interface TypeReference extends TypeWrapper, ObjectType {
        default TSCType getTarget() {
            return getTypeProperty("target");
        }

        default @Nullable TSCNode.TypeNode getNode() {
            return getOptionalTypeNodeProperty("node");
        }

        default List<TSCType> getTypeArguments() {
            return getTypeChecker().getTypeArguments(_typeInstanceInternal());
        }
    }

}
