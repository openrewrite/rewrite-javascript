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
import com.caoccao.javet.values.reference.V8ValueObject;
import org.jspecify.annotations.Nullable;

import java.util.List;
import java.util.function.Supplier;

import static org.openrewrite.javascript.internal.tsc.TSCConversions.NODE_LIST;

public class TSCGlobals extends TSCV8ValueHolder implements TSCV8Backed {

    public static TSCGlobals fromJS(Supplier<TSCProgramContext> context, V8ValueObject objectV8) {
        return new TSCGlobals(context, objectV8);
    }

    private final Supplier<TSCProgramContext> programContext;
    private final V8ValueObject typescriptV8;

    private TSCGlobals(Supplier<TSCProgramContext> programContext, V8ValueObject typescriptV8) {
        this.programContext = programContext;
        this.typescriptV8 = lifecycleLinked(typescriptV8);
    }

    @Override
    public TSCProgramContext getProgramContext() {
        return programContext.get();
    }

    @Override
    public V8ValueObject getBackingV8Object() {
        return typescriptV8;
    }

    public @Nullable List<TSCNode> getDecorators(TSCNode node) {
        return this.invokeMethodNullable("getDecorators", NODE_LIST, node);
    }

    public @Nullable List<TSCNode> getModifiers(TSCNode node) {
        return this.invokeMethodNullable("getModifiers", NODE_LIST, node);
    }
}
