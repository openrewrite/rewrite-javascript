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
import lombok.NonNull;
import lombok.Value;

@Value
public class TSCIndexInfo {
    @NonNull TSCType keyType;

    @NonNull TSCType type;

    boolean isReadonly;
    TSCNode declaration;

    public static TSCIndexInfo fromJS(TSCProgramContext programContext, V8ValueObject objectV8) {
        TSCV8Backed temp = TSCV8Backed.temporary(programContext, objectV8);
        return new TSCIndexInfo(
                temp.getTypeProperty("keyType"),
                temp.getTypeProperty("type"),
                temp.getBooleanProperty("isReadonly"),
                temp.getOptionalNodeProperty("declaration")
        );
    }
}
