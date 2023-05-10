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

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.reference.V8ValueArray;
import com.caoccao.javet.values.reference.V8ValueFunction;
import com.caoccao.javet.values.reference.V8ValueObject;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import javax.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;

import static org.openrewrite.javascript.internal.tsc.TSCConversions.*;

public interface TSCV8Backed {

    /**
     * For mapping objects that don't have long-lived V8 wrappers.
     */
    static TSCV8Backed temporary(TSCProgramContext programContext, V8ValueObject objectV8) {
        return new TSCV8Backed() {
            @Override
            public TSCProgramContext getProgramContext() {
                return programContext;
            }

            @Override
            public V8ValueObject getBackingV8Object() {
                return objectV8;
            }

            @Override
            public String debugDescription() {
                return "(temporary)";
            }
        };
    }

    TSCProgramContext getProgramContext();

    default TSCTypeChecker getTypeChecker() {
        return getProgramContext().getTypeChecker();
    }

    default TSCGlobals getTS() {
        return getProgramContext().getTypeScriptGlobals();
    }

    V8ValueObject getBackingV8Object();

    default String debugDescription() {
        return this.toString();
    }

    default V8Value getPropertyUnsafe(String name) {
        try {
            if (name.endsWith("()")) {
                return this.getBackingV8Object().invoke(name.substring(0, name.length() - 2));
            } else {
                return this.getBackingV8Object().get(name);
            }
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default V8Value invokeMethodUnsafe(String name, Object... args) {
        Object[] converted = null;
        for (int i = 0; i < args.length; i++) {
            if (args[i] instanceof TSCV8Backed) {
                if (converted == null) {
                    converted = args.clone();
                }
                converted[i] = ((TSCV8Backed) args[i]).getBackingV8Object();
            }
        }
        if (converted == null) {
            converted = args;
        }
        try {
            return this.getBackingV8Object().invoke(name, converted);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default <T> @Nullable T invokeMethodNullable(String name, TSCConversion<T> conversion, Object... args) {
        try (V8Value valueV8 = invokeMethodUnsafe(name, args)) {
            return conversion.convertNullable(getProgramContext(), valueV8);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default <T> T invokeMethodNonNull(String name, TSCConversion<T> conversion, Object... args) {
        try (V8Value valueV8 = invokeMethodUnsafe(name, args)) {
            return conversion.convertNonNull(getProgramContext(), valueV8);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default boolean invokeMethodBoolean(String name, Object... args) {
        return invokeMethodNonNull(name, BOOLEAN, args);
    }

    default <T> T getPropertyNullable(String name, TSCConversion<T> conversion) {
        try (V8Value value = getPropertyUnsafe(name)) {
            return conversion.convertNullable(getProgramContext(), value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default <T> T getPropertyNonNull(String name, TSCConversion<T> conversion) {
        try (V8Value value = getPropertyUnsafe(name)) {
            return conversion.convertNonNull(getProgramContext(), value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    //
    //  primitive properties
    //

    default boolean getBooleanProperty(String name) {
        return getPropertyNonNull(name, BOOLEAN);
    }

    default Boolean getOptionalBooleanProperty(String name) {
        return getPropertyNullable(name, BOOLEAN);
    }

    default int getIntProperty(String name) {
        return getPropertyNonNull(name, INTEGER);
    }

    default @Nullable Integer getOptionalIntProperty(String name) {
        return getPropertyNullable(name, INTEGER);
    }

    default long getLongProperty(String name) {
        return getPropertyNonNull(name, LONG);
    }

    default @Nullable Long getOptionalLongProperty(String name) {
        return getPropertyNullable(name, LONG);
    }


    default String getStringProperty(String name) {
        return getPropertyNonNull(name, STRING);
    }

    default @Nullable String getOptionalStringProperty(String name) {
        return getPropertyNullable(name, STRING);
    }

    //
    //  enum properties
    //

    default TSCSyntaxKind getSyntaxKindProperty(String name) {
        return getPropertyNonNull(name, SYNTAX_KIND);
    }

    default @Nullable TSCSyntaxKind getOptionalSyntaxKindProperty(String name) {
        return getPropertyNullable(name, SYNTAX_KIND);
    }

    //
    //  node properties
    //

    default TSCNode getNodeProperty(String name) {
        return getPropertyNonNull(name, NODE);
    }

    default @Nullable TSCNode getOptionalNodeProperty(String name) {
        return getPropertyNullable(name, NODE);
    }

    default TSCNodeList<TSCNode> getNodeListProperty(String name) {
        return getPropertyNonNull(name, NODE_LIST);
    }

    default @Nullable TSCNodeList<TSCNode> getOptionalNodeListProperty(String name) {
        return getPropertyNullable(name, NODE_LIST);
    }

    default TSCNode.TypeNode getTypeNodeProperty(String name) {
        return getPropertyNonNull(name, TYPE_NODE);
    }

    default TSCNode.TypeNode getOptionalTypeNodeProperty(String name) {
        return getPropertyNullable(name, TYPE_NODE);
    }

    default TSCSyntaxListNode getSyntaxListProperty(String name) {
        return getPropertyNonNull(name, SYNTAX_LIST_NODE);
    }

    default @Nullable TSCSyntaxListNode getOptionalSyntaxListProperty(String name) {
        return getPropertyNullable(name, SYNTAX_LIST_NODE);
    }

    //
    //  type properties
    //

    default TSCType getTypeProperty(String name) {
        return getPropertyNonNull(name, TYPE);
    }

    default @Nullable TSCType getOptionalTypeProperty(String name) {
        return getPropertyNullable(name, TYPE);
    }

    default List<TSCType> getTypeListProperty(String name) {
        return getPropertyNonNull(name, TYPE_LIST);
    }

    default @Nullable List<TSCType> getOptionalTypeListProperty(String name) {
        return getPropertyNullable(name, TYPE_LIST);
    }

    //
    //  symbol properties
    //

    default TSCSymbol getSymbolProperty(String name) {
        return getPropertyNonNull(name, SYMBOL);
    }

    default @Nullable TSCSymbol getOptionalSymbolProperty(String name) {
        return getPropertyNullable(name, SYMBOL);
    }

    default List<TSCSymbol> getSymbolListProperty(String name) {
        return getPropertyNonNull(name, SYMBOL_LIST);
    }

    default @Nullable List<TSCSymbol> getOptionalSymbolListProperty(String name) {
        return getPropertyNullable(name, SYMBOL_LIST);
    }

    //
    //  signature properties
    //

    default TSCSignature getSignatureProperty(String name) {
        return getPropertyNonNull(name, SIGNATURE);
    }

    default @Nullable TSCSignature getOptionalSignatureProperty(String name) {
        return getPropertyNullable(name, SIGNATURE);
    }


    default List<TSCSignature> getSignatureListProperty(String name) {
        return getPropertyNonNull(name, SIGNATURE_LIST);
    }

    default @Nullable List<TSCSignature> getOptionalSignatureListProperty(String name) {
        return getPropertyNullable(name, SIGNATURE_LIST);
    }

    //
    //  IndexInfo properties
    //

    default TSCIndexInfo getIndexInfoProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            return TSCIndexInfo.fromJS(getProgramContext(), (V8ValueObject) v8Value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable TSCIndexInfo getOptionalIndexInfoProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            }
            return TSCIndexInfo.fromJS(getProgramContext(), (V8ValueObject) v8Value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }


    default List<TSCIndexInfo> getIndexInfoListProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            V8ValueArray v8Array = (V8ValueArray) v8Value;
            List<TSCIndexInfo> result = new ArrayList<>(v8Array.getLength());
            ((V8ValueArray) v8Value).forEach(childV8Value -> {
                result.add(TSCIndexInfo.fromJS(getProgramContext(), (V8ValueObject) childV8Value));
            });
            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable List<TSCIndexInfo> getOptionalIndexInfoListProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            }
            V8ValueArray v8Array = (V8ValueArray) v8Value;
            List<TSCIndexInfo> result = new ArrayList<>(v8Array.getLength());
            ((V8ValueArray) v8Value).forEach(childV8Value -> {
                result.add(TSCIndexInfo.fromJS(getProgramContext(), (V8ValueObject) childV8Value));
            });
            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    //
    //  misc
    //

    default boolean hasProperty(String propertyName) {
        try (V8Value value = getPropertyUnsafe(propertyName)) {
            return !value.isUndefined();
        } catch (JavetException ignored) {
            return false;
        }
    }

    default @Nullable String getConstructorName() {
        try (V8Value constructor = this.getPropertyUnsafe("constructor")) {
            if (constructor.isNullOrUndefined()) {
                return null;
            }
            if (!(constructor instanceof V8ValueFunction)) {
                return null;
            }
            return ((V8ValueFunction) constructor).getPropertyString("name");
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default <T> T as(TSCConversion<T> conversion) {
        return conversion.convertNonNull(this.getProgramContext(), this.getBackingV8Object());
    }

}
