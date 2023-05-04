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
import org.openrewrite.javascript.internal.tsc.generated.TSCSymbolFlag;

import java.util.ArrayList;
import java.util.List;

public class TSCSymbol implements TSCV8Backed {
    private final TSCProgramContext programContext;
    public final V8ValueObject symbolV8;

    public TSCSymbol(TSCProgramContext programContext, V8ValueObject symbolV8) {
        this.programContext = programContext;
        this.symbolV8 = symbolV8;
    }

    @Override
    public TSCProgramContext getProgramContext() {
        return programContext;
    }

    @Override
    public String debugDescription() {
        return "Symbol(" + listMatchingSymbolFlags() + ")";
    }

    public int getSymbolFlags() {
        try {
            return this.symbolV8.getInteger("flags");
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean hasSymbolFlag(TSCSymbolFlag flag) {
        return flag.matches(this.getSymbolFlags());
    }

    /** Only intended for debugging; this is slow. */
    public List<TSCSymbolFlag> listMatchingSymbolFlags() {
        final int symbolFlags = this.getSymbolFlags();
        List<TSCSymbolFlag> result = new ArrayList<>();
        for (TSCSymbolFlag flag : TSCSymbolFlag.values()) {
            if (flag.matches(symbolFlags)) {
                result.add(flag);
            }
        }
        return result;
    }

    public String getEscapedName() {
        try {
            return this.symbolV8.getString("escapedName");
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public V8ValueObject getBackingV8Object() {
        return symbolV8;
    }
}