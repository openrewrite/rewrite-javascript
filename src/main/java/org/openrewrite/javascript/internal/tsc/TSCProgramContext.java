package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.interop.V8Runtime;
import com.caoccao.javet.interop.callback.JavetCallbackContext;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.reference.V8ValueFunction;
import com.caoccao.javet.values.reference.V8ValueObject;

import java.io.Closeable;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;

public class TSCProgramContext implements Closeable {
    private static final Method CONTEXT_CALLBACK_APPLY_METHOD;

    static {
        try {
            CONTEXT_CALLBACK_APPLY_METHOD = TSCContextCallback.class.getDeclaredMethod("apply", V8Value[].class);
        } catch (NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
    }


    private final V8Runtime runtime;
    private final TSCMeta metadata;
    private final V8ValueObject program;
    private final V8ValueObject typeChecker;
    private final V8ValueFunction createScanner;
    private final V8ValueFunction getNodeId;
    private final Map<Long, TSCNode> nodeCache = new HashMap<>();
    private final Map<Long, TSCType> typeCache = new HashMap<>();

    public TSCProgramContext(V8Runtime runtime, TSCMeta metadata, V8ValueObject program, V8ValueObject typeChecker, V8ValueFunction createScanner, V8ValueFunction getNodeId) {
        this.runtime = runtime;
        this.metadata = metadata;
        this.program = program;
        this.typeChecker = typeChecker;
        this.createScanner = createScanner;
        this.getNodeId = getNodeId;
    }

    public static TSCProgramContext fromJS(V8ValueObject contextV8) {
        try (V8ValueObject metaV8Object = contextV8.get("meta")) {
            TSCMeta metadata = TSCMeta.fromJS(metaV8Object);

            V8ValueObject program = contextV8.get("program");
            V8ValueObject typeChecker = contextV8.get("typeChecker");
            V8ValueFunction createScanner = contextV8.get("createScanner");
            V8ValueFunction getNodeId = contextV8.get("getNodeId");

            return new TSCProgramContext(contextV8.getV8Runtime(), metadata, program, typeChecker, createScanner, getNodeId);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public V8ValueObject getTypeChecker() {
        return this.typeChecker;
    }

    public V8ValueFunction getCreateScannerFunction() {
        return this.createScanner;
    }

    public TSCType tscType(V8ValueObject v8Value) {
        final long typeId;
        try {
            Number tmp = v8Value.getPrimitive("id");
            typeId = tmp.longValue();
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }

        TSCType type = this.typeCache.computeIfAbsent(typeId, (_handle) -> new TSCType(this, v8Value));
        if (type.typeV8 != v8Value) {
            try {
                v8Value.setWeak();
            } catch (JavetException e) {
            }
        }

        return type;
    }

    public TSCNode tscNode(V8ValueObject v8Value) {
        final long nodeId;
        try {
            nodeId = this.getNodeId.callLong(null, v8Value);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }

        TSCNode node = this.nodeCache.computeIfAbsent(nodeId, (_handle) -> new TSCNode(this, v8Value));
        if (node.nodeV8 != v8Value) {
            try {
                v8Value.setWeak();
            } catch (JavetException e) {
            }
        }
        return node;
    }

    public V8ValueFunction asJSFunction(TSCContextCallback func) {
        JavetCallbackContext callbackContext = new JavetCallbackContext(func, CONTEXT_CALLBACK_APPLY_METHOD);
        try {
            return this.runtime.createV8ValueFunction(callbackContext);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public V8ValueFunction asJSFunction(Function<? super V8Value, ? extends V8Value> func) {
        TSCContextCallback callback = (V8Value[] args) -> func.apply(args[0]);
        return asJSFunction(callback);
    }

    public V8ValueFunction asJSFunction(Consumer<? super V8Value> func) {
        TSCContextCallback callback = (V8Value[] args) -> {
            func.accept(args[0]);
            return runtime.createV8ValueUndefined();
        };
        return asJSFunction(callback);
    }

    @Override
    public void close() {
        try {
            program.close();
        } catch (JavetException e) {
        }
        try {
            typeChecker.close();
        } catch (JavetException e) {
        }
        try {
            createScanner.close();
        } catch (JavetException e) {
        }
        try {
            getNodeId.close();
        } catch (JavetException e) {
        }

        this.nodeCache.values().forEach(node -> {
            try {
                node.nodeV8.close();
            } catch (JavetException e) {
            }
        });
        this.typeCache.values().forEach(type -> {
            try {
                type.typeV8.close();
            } catch (JavetException e) {
            }
        });
    }
}
