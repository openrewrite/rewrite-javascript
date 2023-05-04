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

public class TSCSignature implements TSCV8Backed {

    private final TSCProgramContext programContext;
    public final V8ValueObject signatureV8;

    public TSCSignature(TSCProgramContext programContext, V8ValueObject signatureV8) {
        this.programContext = programContext;
        this.signatureV8 = signatureV8;
    }

    @Override
    public TSCProgramContext getProgramContext() {
        return programContext;
    }

    @Override
    public V8ValueObject getBackingV8Object() {
        return signatureV8;
    }

    @Override
    public String debugDescription() {
        // TODO add more information
        return "Signature()";
    }


}
