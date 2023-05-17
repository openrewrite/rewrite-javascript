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
import lombok.Value;
import org.openrewrite.javascript.internal.tsc.generated.TSCObjectFlag;
import org.openrewrite.javascript.internal.tsc.generated.TSCTypeFlag;

import java.util.List;
import java.util.Map;

public class TSCType implements TSCV8Backed, TSCTypeAccessors {
    @Value
    static class DebugInfo {
        List<TSCTypeFlag> typeFlags;
        List<TSCObjectFlag> objectFlags;
        Map<String, Object> properties;
        List<TSCTypeAccessors> typedInterfaces;
    }

    private final TSCProgramContext programContext;
    public final V8ValueObject typeV8;

    public TSCType(TSCProgramContext programContext, V8ValueObject typeV8) {
        this.programContext = programContext;
        this.typeV8 = typeV8;
    }

    @Override
    public TSCType _typeInstanceInternal() {
        return this;
    }

    @Override
    public TSCProgramContext getProgramContext() {
        return programContext;
    }

    @Override
    public String toString() {
        return "Type#" + getTypeId() + "(" + typeToString() + ")";
    }

    @Override
    public V8ValueObject getBackingV8Object() {
        return typeV8;
    }

//    @Override
//    @DebugOnly
//    public DebugInfo getDebugInfo() {
//        return new DebugInfo(
//                listMatchingTypeFlags(),
//                listMatchingObjectFlags(),
//                getAllPropertiesForDebugging(),
//                listMatchingTypeInterfaces()
//        );
//    }
}
