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
import org.openrewrite.javascript.internal.tsc.generated.TSCObjectFlag;
import org.openrewrite.javascript.internal.tsc.generated.TSCTypeFlag;

public class TSCType implements TSCV8Backed {
    private final TSCProgramContext programContext;
    public final V8ValueObject typeV8;

    public TSCType(TSCProgramContext programContext, V8ValueObject typeV8) {
        this.programContext = programContext;
        this.typeV8 = typeV8;
    }

    public long getTypeId() {
        try {
            Number typeId = this.typeV8.getPrimitive("id");
            return typeId.longValue();
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public int getTypeFlags() {
        try {
            return this.typeV8.getInteger("flags");
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean hasTypeFlag(TSCTypeFlag flag) {
        return flag.matches(this.getTypeFlags());
    }

    public int getObjectFlags() {
        if (!this.hasTypeFlag(TSCTypeFlag.ObjectFlagsType)) {
            return 0;
        } else {
            try {
                return this.typeV8.getInteger("objectFlags");
            } catch (JavetException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public boolean hasObjectFlag(TSCObjectFlag flag) {
        return flag.matches(this.getObjectFlags());
    }

    @Override
    public V8ValueObject getBackingV8Object() {
        return typeV8;
    }
}
