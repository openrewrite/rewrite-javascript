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
import com.caoccao.javet.values.primitive.*;
import com.caoccao.javet.values.reference.V8ValueArray;
import com.caoccao.javet.values.reference.V8ValueObject;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import javax.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;

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

    V8ValueObject getBackingV8Object();

    String debugDescription();

    default V8Value getPropertyUnsafe(String name) {
        try {
            if (name.endsWith("()")) {
                return this.getBackingV8Object().invoke(name.substring(0, name.length() - 2));
            } else {
                return this.getBackingV8Object().getProperty(name);
            }
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    //
    //  primitive properties
    //

    default boolean getBooleanProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value instanceof V8ValueBoolean) {
                return ((V8ValueBoolean) v8Value).getValue();
            } else {
                throw new IllegalArgumentException(
                        String.format(
                                "%s does not have a boolean property called '%s'; found: %s",
                                debugDescription(),
                                name,
                                v8Value.getClass().getSimpleName()
                        )
                );
            }
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default Boolean getOptionalBooleanProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            } else if (v8Value instanceof V8ValueBoolean) {
                return ((V8ValueBoolean) v8Value).getValue();
            } else {
                throw new IllegalArgumentException(
                        String.format(
                                "%s does not have a boolean property called '%s'; found: %s",
                                debugDescription(),
                                name,
                                v8Value.getClass().getSimpleName()
                        )
                );
            }
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default int getIntProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value instanceof V8ValueInteger) {
                return ((V8ValueInteger) v8Value).getValue();
            } else {
                throw new IllegalArgumentException(
                        String.format(
                                "%s does not have a int property called '%s'; found: %s",
                                debugDescription(),
                                name,
                                v8Value.getClass().getSimpleName()
                        )
                );
            }
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable Integer getOptionalIntProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            } else if (v8Value instanceof V8ValueInteger) {
                return ((V8ValueInteger) v8Value).getValue();
            } else {
                throw new IllegalArgumentException(
                        String.format(
                                "%s does not have a int property called '%s'; found: %s",
                                debugDescription(),
                                name,
                                v8Value.getClass().getSimpleName()
                        )
                );
            }
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default long getLongProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value instanceof V8ValueInteger) {
                return ((V8ValueInteger) v8Value).getValue();
            } else if (v8Value instanceof V8ValueLong) {
                return ((V8ValueLong) v8Value).getValue();
            } else {
                throw new IllegalArgumentException(
                        String.format(
                                "%s does not have a long property called '%s'; found: %s",
                                debugDescription(),
                                name,
                                v8Value.getClass().getSimpleName()
                        )
                );
            }
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable Long getOptionalLongProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            } else if (v8Value instanceof V8ValueInteger) {
                return ((V8ValueInteger) v8Value).getValue().longValue();
            } else if (v8Value instanceof V8ValueLong) {
                return ((V8ValueLong) v8Value).getValue();
            } else {
                throw new IllegalArgumentException(
                        String.format(
                                "%s does not have a long property called '%s'; found: %s",
                                debugDescription(),
                                name,
                                v8Value.getClass().getSimpleName()
                        )
                );
            }
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }


    default String getStringProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value instanceof V8ValueString) {
                return ((V8ValueString) v8Value).getValue();
            } else {
                throw new IllegalArgumentException(
                        String.format(
                                "%s does not have a string property called '%s'; found: %s",
                                debugDescription(),
                                name,
                                v8Value.getClass().getSimpleName()
                        )
                );
            }
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable String getOptionalStringProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            } else if (v8Value instanceof V8ValueString) {
                return ((V8ValueString) v8Value).getValue();
            } else {
                throw new IllegalArgumentException(
                        String.format(
                                "%s does not have a string property called '%s'; found: %s",
                                debugDescription(),
                                name,
                                v8Value.getClass().getSimpleName()
                        )
                );
            }
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    //
    //  enum properties
    //

    default TSCSyntaxKind getSyntaxKindProperty(String name) {
        final int code = getIntProperty(name);
        return TSCSyntaxKind.fromCode(code);
    }

    default @Nullable TSCSyntaxKind getOptionalSyntaxKindProperty(String name) {
        final Integer code = getOptionalIntProperty(name);
        if (code == null) {
            return null;
        }
        return TSCSyntaxKind.fromCode(code);
    }

    //
    //  node properties
    //

    default TSCNode getNodeProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            return getProgramContext().tscNode((V8ValueObject) v8Value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable TSCNode getOptionalNodeProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            }
            return getProgramContext().tscNode((V8ValueObject) v8Value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default List<TSCNode> getNodeListProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            V8ValueArray v8Array = (V8ValueArray) v8Value;
            List<TSCNode> result = new ArrayList<>(v8Array.getLength());
            ((V8ValueArray) v8Value).forEach(childV8Value -> {
                result.add(getProgramContext().tscNode((V8ValueObject) childV8Value));
            });
            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable List<TSCNode> getOptionalNodeListProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            }
            V8ValueArray v8Array = (V8ValueArray) v8Value;
            List<TSCNode> result = new ArrayList<>(v8Array.getLength());
            ((V8ValueArray) v8Value).forEach(childV8Value -> {
                result.add(getProgramContext().tscNode((V8ValueObject) childV8Value));
            });
            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    //
    //  type properties
    //

    default TSCType getTypeProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            return getProgramContext().tscType((V8ValueObject) v8Value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable TSCType getOptionalTypeProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            }
            return getProgramContext().tscType((V8ValueObject) v8Value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default List<TSCType> getTypeListProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            V8ValueArray v8Array = (V8ValueArray) v8Value;
            List<TSCType> result = new ArrayList<>(v8Array.getLength());
            ((V8ValueArray) v8Value).forEach(childV8Value -> {
                result.add(getProgramContext().tscType((V8ValueObject) childV8Value));
            });
            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable List<TSCType> getOptionalTypeListProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            }
            V8ValueArray v8Array = (V8ValueArray) v8Value;
            List<TSCType> result = new ArrayList<>(v8Array.getLength());
            ((V8ValueArray) v8Value).forEach(childV8Value -> {
                result.add(getProgramContext().tscType((V8ValueObject) childV8Value));
            });
            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    //
    //  symbol properties
    //

    default TSCSymbol getSymbolProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            return getProgramContext().tscSymbol((V8ValueObject) v8Value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable TSCSymbol getOptionalSymbolProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            }
            return getProgramContext().tscSymbol((V8ValueObject) v8Value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default List<TSCSymbol> getSymbolListProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            V8ValueArray v8Array = (V8ValueArray) v8Value;
            List<TSCSymbol> result = new ArrayList<>(v8Array.getLength());
            ((V8ValueArray) v8Value).forEach(childV8Value -> {
                result.add(getProgramContext().tscSymbol((V8ValueObject) childV8Value));
            });
            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable List<TSCSymbol> getOptionalSymbolListProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            }
            V8ValueArray v8Array = (V8ValueArray) v8Value;
            List<TSCSymbol> result = new ArrayList<>(v8Array.getLength());
            ((V8ValueArray) v8Value).forEach(childV8Value -> {
                result.add(getProgramContext().tscSymbol((V8ValueObject) childV8Value));
            });
            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    //
    //  signature properties
    //

    default TSCSignature getSignatureProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            return getProgramContext().tscSignature((V8ValueObject) v8Value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable TSCSignature getOptionalSignatureProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            }
            return getProgramContext().tscSignature((V8ValueObject) v8Value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }


    default List<TSCSignature> getSignatureListProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            V8ValueArray v8Array = (V8ValueArray) v8Value;
            List<TSCSignature> result = new ArrayList<>(v8Array.getLength());
            ((V8ValueArray) v8Value).forEach(childV8Value -> {
                result.add(getProgramContext().tscSignature((V8ValueObject) childV8Value));
            });
            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default @Nullable List<TSCSignature> getOptionalSignatureListProperty(String name) {
        try (V8Value v8Value = getPropertyUnsafe(name)) {
            if (v8Value.isNullOrUndefined()) {
                return null;
            }
            V8ValueArray v8Array = (V8ValueArray) v8Value;
            List<TSCSignature> result = new ArrayList<>(v8Array.getLength());
            ((V8ValueArray) v8Value).forEach(childV8Value -> {
                result.add(getProgramContext().tscSignature((V8ValueObject) childV8Value));
            });
            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
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
        try(V8Value value = getPropertyUnsafe(propertyName)) {
            return !value.isUndefined();
        } catch (JavetException ignored) {
            return false;
        }
    }

}
