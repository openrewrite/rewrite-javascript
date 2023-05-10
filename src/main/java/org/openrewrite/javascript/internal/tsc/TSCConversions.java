package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.values.primitive.V8ValueBoolean;
import com.caoccao.javet.values.primitive.V8ValueInteger;
import com.caoccao.javet.values.primitive.V8ValueLong;
import com.caoccao.javet.values.primitive.V8ValueString;
import com.caoccao.javet.values.reference.V8ValueArray;
import com.caoccao.javet.values.reference.V8ValueObject;
import org.openrewrite.javascript.internal.tsc.generated.TSCSignatureKind;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.util.ArrayList;
import java.util.List;
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

    static final TSCConversion<TSCNodeList<TSCNode>> NODE_LIST = nodeList(NODE);

    public static final TSCConversion<TSCNode.TypeNode> TYPE_NODE = cast(NODE, TSCNode.TypeNode.class);

    public static final TSCConversion<TSCNodeList<TSCNode.TypeNode>> TYPE_NODE_LIST = nodeList(TYPE_NODE);

    public static final TSCConversion<TSCSyntaxListNode> SYNTAX_LIST_NODE = cast(NODE, TSCSyntaxListNode.class);

    public static final TSCConversion<TSCSymbol> SYMBOL = cached(context -> context.symbolCache);
    public static final TSCConversion<List<TSCSymbol>> SYMBOL_LIST = list(SYMBOL);

    public static final TSCConversion<TSCSignature> SIGNATURE = cached(context -> context.signatureCache);
    public static final TSCConversion<List<TSCSignature>> SIGNATURE_LIST = list(SIGNATURE);

    public static <T> TSCConversion<List<T>> list(TSCConversion<T> of) {
        return (context, value) -> {
            if (!(value instanceof V8ValueArray)) {
                throw new IllegalArgumentException("expected V8 array");
            }
            V8ValueArray array = (V8ValueArray) value;
            List<T> result = new ArrayList<>(array.getLength());
            array.forEach(element -> {
                result.add(of.convertNonNull(context, element));
            });
            return result;
        };
    }

    static <T extends TSCNode> TSCConversion<TSCNodeList<T>> nodeList(TSCConversion<T> conversion) {
        return (context, valueV8) -> {
            if (!(valueV8 instanceof V8ValueArray)) {
                throw new IllegalStateException("expected a V8 array");
            }

            V8ValueArray arrayV8 = valueV8.toClone();
            arrayV8.setWeak();

            return TSCNodeList.wrap(context, arrayV8, conversion);
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
