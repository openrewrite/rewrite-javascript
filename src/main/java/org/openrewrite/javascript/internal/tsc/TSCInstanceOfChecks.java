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
import com.caoccao.javet.interop.V8Runtime;
import com.caoccao.javet.interop.V8Scope;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.primitive.V8ValuePrimitive;
import com.caoccao.javet.values.reference.V8ValueArray;
import com.caoccao.javet.values.reference.V8ValueFunction;
import com.caoccao.javet.values.reference.V8ValueObject;
import org.intellij.lang.annotations.Language;

import javax.annotation.Nullable;
import java.util.Collections;
import java.util.Map;

public class TSCInstanceOfChecks {

    public enum InterfaceKind {
        Node,
        Symbol,
        Type,
        Signature,
        SourceMapSource,
    }

    public enum ConstructorKind {
        Node(InterfaceKind.Node, "getNodeConstructor"),
        Token(InterfaceKind.Node, "getTokenConstructor"),
        Identifier(InterfaceKind.Node, "getIdentifierConstructor"),
        PrivateIdentifier(InterfaceKind.Node, "getPrivateIdentifierConstructor"),
        SourceFile(InterfaceKind.Node, "getSourceFileConstructor"),
        Symbol(InterfaceKind.Symbol, "getSymbolConstructor"),
        Type(InterfaceKind.Type, "getTypeConstructor"),
        Signature(InterfaceKind.Signature, "getSignatureConstructor"),
        SourceMapSource(InterfaceKind.SourceMapSource, "getSourceMapSourceConstructor");

        public final InterfaceKind interfaceKind;

        /**
         * see `getServicesObjectAllocator` in services.ts
         */
        private final String allocatorAccessorName;

        ConstructorKind(InterfaceKind interfaceKind, String allocatorAccessorName) {
            this.interfaceKind = interfaceKind;
            this.allocatorAccessorName = allocatorAccessorName;
        }
    }

    public static TSCInstanceOfChecks wrap(V8Scope scope, TSCGlobals globals) {
        V8Runtime runtimeV8 = globals.getBackingV8Object().getV8Runtime();
        try (V8ValueObject allocators = globals.getBackingV8Object().get("objectAllocator")) {
            V8ValueArray constructors = runtimeV8.createV8ValueArray();
            for (ConstructorKind constructorKind : ConstructorKind.values()) {
                try (V8ValueFunction constructor = allocators.invoke(constructorKind.allocatorAccessorName)) {
                    constructors.set(constructorKind.ordinal(), constructor);
                }
            }
            Map<String, Object> outerVars = Collections.singletonMap("ctors", constructors);
            @Language("javascript")
            String code = "" +
                    "(arg) => {\n" +
                    "  for (let i = 0; i < ctors.length; i++) {\n" +
                    "    if (arg.constructor === ctors[i]) return i;\n" +
                    "  }\n" +
                    "}";
            V8ValueFunction constructorOrdinalFunctionV8 = TSCV8Utils.makeFunction(runtimeV8, code, outerVars);
            return new TSCInstanceOfChecks(scope.add(constructorOrdinalFunctionV8));
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    private final V8ValueFunction constructorOrdinalFunctionV8;

    private TSCInstanceOfChecks(V8ValueFunction constructorOrdinalFunctionV8) {
        this.constructorOrdinalFunctionV8 = constructorOrdinalFunctionV8;
    }

    public @Nullable ConstructorKind identifyConstructorKind(V8Value valueV8) {
        try (V8Value ordinalV8 = constructorOrdinalFunctionV8.call(null, valueV8)) {
            if (ordinalV8.isNullOrUndefined()) {
                return null;
            }
            if (!(ordinalV8 instanceof V8ValuePrimitive)) {
                throw new IllegalStateException("expected a primitive; found: " + ordinalV8.getClass().getSimpleName());
            }
            Object ordinalObj = ((V8ValuePrimitive<?>) ordinalV8).getValue();
            if (!(ordinalObj instanceof Number)) {
                throw new IllegalArgumentException("expected a Number; found: " + ordinalObj.getClass());
            }
            int ordinal = ((Number) ordinalObj).intValue();
            return ConstructorKind.values()[ordinal];
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public @Nullable InterfaceKind identifyInterfaceKind(V8Value valueV8) {
        ConstructorKind constructorKind = identifyConstructorKind(valueV8);
        if (constructorKind == null) {
            return null;
        }
        return constructorKind.interfaceKind;
    }
}
