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
import com.caoccao.javet.values.reference.IV8ValueArray;
import com.caoccao.javet.values.reference.V8ValueArray;
import com.caoccao.javet.values.reference.V8ValueFunction;
import com.caoccao.javet.values.reference.V8ValueObject;
import org.openrewrite.javascript.internal.tsc.generated.TSCSignatureKind;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.util.*;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.function.IntFunction;

public final class TSCConversions {
    private TSCConversions() {
    }

    public static final TSCConversion<String> STRING = (context, value) -> {
        if (!(value instanceof V8ValueString)) {
            throw new IllegalArgumentException("expected V8 string");
        }
        return ((V8ValueString) value).getValue();
    };

    public static final TSCConversion<Boolean> BOOLEAN = (context, value) -> {
        if (value instanceof V8ValueBoolean) {
            return ((V8ValueBoolean) value).getValue();
        }
        throw new IllegalArgumentException("expected V8 boolean");
    };

    public static final TSCConversion<Integer> INTEGER = (context, value) -> {
        if (value instanceof V8ValueInteger) {
            return ((V8ValueInteger) value).getValue();
        }
        throw new IllegalArgumentException("expected V8 integer");
    };

    public static final TSCConversion<Long> LONG = (context, value) -> {
        if (value instanceof V8ValueLong) {
            return ((V8ValueLong) value).getValue();
        } else if (value instanceof V8ValueInteger) {
            return ((V8ValueInteger) value).getValue().longValue();
        }
        throw new IllegalArgumentException("expected V8 long or integer");
    };

    public static final TSCConversion<TSCIndexInfo> INDEX_INFO = builder(TSCIndexInfo::fromJS);
    public static final TSCConversion<List<TSCIndexInfo>> INDEX_INFO_LIST = list(INDEX_INFO);

    public static final TSCConversion<TSCSyntaxKind> SYNTAX_KIND = enumeration(TSCSyntaxKind::fromCode);
    public static final TSCConversion<TSCSignatureKind> SIGNATURE_KIND = enumeration(TSCSignatureKind::fromCode);

    public static final TSCConversion<TSCType> TYPE = cached(context -> context.typeCache);
    public static final TSCConversion<List<TSCType>> TYPE_LIST = list(TYPE);

    public static final TSCConversion<TSCNode> NODE = cached(context -> context.nodeCache);

    static final TSCConversion<TSCNodeList> NODE_LIST = cached(context -> context.nodeListCache);

    public static final TSCConversion<TSCNode.TypeNode> TYPE_NODE = cast(NODE, TSCNode.TypeNode.class);

    public static final TSCConversion<TSCSyntaxListNode> SYNTAX_LIST_NODE = cast(NODE, TSCSyntaxListNode.class);

    public static final TSCConversion<TSCSymbol> SYMBOL = cached(context -> context.symbolCache);
    public static final TSCConversion<List<TSCSymbol>> SYMBOL_LIST = list(SYMBOL);

    public static final TSCConversion<TSCSignature> SIGNATURE = cached(context -> context.signatureCache);
    public static final TSCConversion<List<TSCSignature>> SIGNATURE_LIST = list(SIGNATURE);

    public static final TSCConversion<Object> AUTO = TSCConversions::autoConvert;

    private static final ThreadLocal<Integer> autoConversionDepth = ThreadLocal.withInitial(() -> 0);
    private static final int MAX_AUTO_CONVERSION_DEPTH = 10;

    private static Object autoConvert(TSCProgramContext context, V8Value value) throws JavetException {
        final int initialDepth = autoConversionDepth.get();
        if (initialDepth > MAX_AUTO_CONVERSION_DEPTH) {
            return value.getV8Runtime().getConverter().toObject(value, true);
        }
        autoConversionDepth.set(initialDepth + 1);
        try {
            if (value instanceof V8ValuePrimitive) {
                return ((V8ValuePrimitive<?>) value).getValue();
            }

            if (value instanceof V8ValueObject) {
                TSCInstanceOfChecks.InterfaceKind interfaceKind = context.getInstanceOfChecks().identifyInterfaceKind(value);
                if (interfaceKind != null) {
                    switch (interfaceKind) {
                        case Node:
                            return NODE.convertUnsafe(context, value);
                        case Type:
                            return TYPE.convertUnsafe(context, value);
                        case Symbol:
                            return SYMBOL.convertUnsafe(context, value);
                        case Signature:
                            return SIGNATURE.convertUnsafe(context, value);
                        case SourceMapSource:
                        default:
                            break;
                    }
                }
            }

            if (value instanceof V8ValueArray) {
                return list(AUTO).convertUnsafe(context, value);
            }

            if (value instanceof V8ValueFunction) {
                V8ValueFunction copy = value.toClone();
                copy.setWeak();
                return copy;
            }

            if (value instanceof V8ValueObject) {
                return objectMap(AUTO).convertUnsafe(context, value);
            }

            // TODO better auto-conversion?
            return value.getV8Runtime().getConverter().toObject(value, true);
        } finally {
            autoConversionDepth.set(initialDepth);
        }
    }

    public static <T> TSCConversion<List<T>> list(TSCConversion<T> of) {
        return (context, value) -> {
            if (!(value instanceof V8ValueArray)) {
                throw new IllegalArgumentException("expected V8 array");
            }
            V8ValueArray array = (V8ValueArray) value;
            List<T> result = new ArrayList<>(array.getLength());
            array.forEach(element -> result.add(of.convertNonNull(context, element)));
            return result;
        };
    }

    public static <T> TSCConversion<Map<String, T>> objectMap(TSCConversion<T> ofValue) {
        return (context, value) -> {
            if (!(value instanceof V8ValueObject)) {
                throw new IllegalArgumentException("expected a V8 object");
            }
            Map<String, T> primitives = new LinkedHashMap<>();
            Map<String, T> objects = new LinkedHashMap<>();
            Map<String, T> collections = new LinkedHashMap<>();

            V8ValueObject object = (V8ValueObject) value;
            IV8ValueArray propNames = object.getPropertyNames();
            for (int i = 0; i < propNames.getLength(); i++) {
                String propName = propNames.getString(i);
                T propValue = ofValue.convertNullable(context, object.get(propName));
                if (propValue == null || propValue instanceof Number || propValue instanceof String || propValue instanceof Enum) {
                    primitives.put(propName, propValue);
                } else if (propValue instanceof Collection) {
                    collections.put(propName, propValue);
                } else {
                    objects.put(propName, propValue);
                }
            }

            Map<String, T> converted = new LinkedHashMap<>();
            converted.putAll(primitives);
            converted.putAll(objects);
            converted.putAll(collections);

            return converted;
        };
    }

    static <T extends TSCV8Backed> TSCConversion<T> cached(Function<TSCProgramContext, TSCObjectCache<T>> getCache) {
        return (context, value) -> getCache.apply(context).getOrCreate(context, (V8ValueObject) value);
    }

    static <T extends TSCV8Backed, U extends T> TSCConversion<U> cast(TSCConversion<T> base, Class<U> subtype) {
        return (context, value) -> {
            T object = base.convertUnsafe(context, value);
            if (!subtype.isInstance(object)) {
                throw new IllegalArgumentException("expected a " + subtype.getSimpleName() + ", but got a " + object.getClass().getSimpleName());
            }
            return (U) object;
        };
    }

    static <T> TSCConversion<T> builder(BiFunction<TSCProgramContext, V8ValueObject, T> fromJS) {
        return (context, value) -> {
            if (!(value instanceof V8ValueObject)) {
                throw new IllegalArgumentException("expected V8 object");
            }
            return fromJS.apply(context, (V8ValueObject) value);
        };
    }

    static <T> TSCConversion<T> enumeration(IntFunction<T> fromCode) {
        return (context, value) -> {
            final int code = INTEGER.convertNonNull(context, value);
            return fromCode.apply(code);
        };
    }

}
