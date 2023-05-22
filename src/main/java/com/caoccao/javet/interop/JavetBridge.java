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
package com.caoccao.javet.interop;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.interop.options.V8RuntimeOptions;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.reference.IV8ValueReference;
import com.caoccao.javet.values.reference.V8ValueFunction;
import com.caoccao.javet.values.reference.V8ValueObject;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.util.HashMap;
import java.util.Map;

public final class JavetBridge {
    private JavetBridge() {}

    public static Map<Long, IV8ValueReference> getReferenceMapSnapshot(V8Runtime runtime) {
        synchronized (runtime.referenceLock) {
            return new HashMap<>(runtime.referenceMap);
        }
    }

    public static V8Runtime makeWrappedV8Runtime() {
        V8Host host = V8Host.getV8Instance();
        V8RuntimeOptions runtimeOptions = host.getJSRuntimeType().getRuntimeOptions();
        if (!host.isLibraryLoaded()) {
            throw new IllegalStateException("native v8 library is not loaded");
        }
        final long handle = host.getV8Native().createV8Runtime(runtimeOptions);
        V8Runtime v8Runtime = new V8Runtime(host, handle, false, host.getV8Native(), runtimeOptions) {
            private final Map<Long, String> remainingReferences = new HashMap<>();

            @Override
            void addReference(IV8ValueReference iV8ValueReference) {
                super.addReference(iV8ValueReference);
                StringBuilder sb = new StringBuilder();
                for (StackTraceElement element : Thread.currentThread().getStackTrace()) {
                    sb.append("\t").append(element.toString()).append("\n");
                }
                remainingReferences.put(iV8ValueReference.getHandle(), sb.toString());
            }

            @Override
            void removeReference(IV8ValueReference iV8ValueReference) throws JavetException {
                super.removeReference(iV8ValueReference);
                // Uncommenting this surfaces unmatched references for some reason
//                remainingReferences.remove(iV8ValueReference.getHandle());
            }



            public void close(boolean forceClose) throws JavetException {
                if (!isClosed() && forceClose) {
                    debugOpenReferences();
                    removeAllReferences();
                    host.getV8Native().closeV8Runtime(handle);
                }
            }

            private void debugOpenReferences() {
                Map<Long, IV8ValueReference> referenceMap = getReferenceMapSnapshot(this);
                boolean hasOpen = false;
                for (IV8ValueReference valueV8 : referenceMap.values()) {
                    if (!valueV8.isClosed()) {
                        hasOpen = true;
                        System.err.print("** still open: ");
                        if (valueV8 instanceof V8ValueFunction) {
                            System.err.print(valueV8);
                        } else if (valueV8 instanceof V8ValueObject) {
                            try (V8Value constructor = ((V8ValueObject) valueV8).get("constructor")) {
                                if (constructor instanceof V8ValueObject) {
                                    String name = ((V8ValueObject) constructor).getPrimitive("name");
                                    if (name.equals("NodeObject")) {
                                        System.err.print("[" + name + ":" + TSCSyntaxKind.fromCode(((V8ValueObject) valueV8).getInteger("kind")) + "]");
                                    } else {
                                        System.err.print("[" + name + "]");
                                    }
                                } else {
                                    System.err.print("[object without a constructor]");
                                }
                            } catch (JavetException e) {
                                System.err.print("[error while trying to display a JS object]");
                            }
                        } else {
                            // TODO
                            System.err.print(valueV8);
                        }
                        try {
                            if (valueV8.isWeak()) {
                                System.err.print(" (weak)");
                            }
                        } catch (JavetException e) {
                            throw new RuntimeException(e);
                        }
                        System.err.println();
                        String caller = remainingReferences.get(valueV8.getHandle());
                        System.err.println("\tfrom " + caller);
                    }
                }

                if (hasOpen) {
                    throw new IllegalStateException("runtime contains un-recycled V8 references");
                }
            }
        };
        host.getV8Native().registerV8Runtime(handle, v8Runtime);
        return v8Runtime;
    }
}
