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
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.primitive.V8ValueInteger;
import com.caoccao.javet.values.primitive.V8ValueString;
import com.caoccao.javet.values.reference.V8ValueMap;
import com.caoccao.javet.values.reference.V8ValueObject;

import java.util.HashMap;
import java.util.Map;

public class TSCMeta {
    private final Map<String, Integer> syntaxKindsByName = new HashMap<>();
    private final Map<Integer, String> syntaxKindsByCode = new HashMap<>();

    public static TSCMeta fromJS(V8ValueObject metaV8) throws JavetException {
        try {
            TSCMeta result = new TSCMeta();

            try (V8Value syntaxKinds = metaV8.get("syntaxKinds")) {
                if (!(syntaxKinds instanceof V8ValueMap)) {
                    throw new IllegalArgumentException("expected syntaxKinds to be a Map");
                }

                ((V8ValueMap) syntaxKinds).forEach((V8Value keyV8, V8Value valueV8) -> {
                    if (keyV8 instanceof V8ValueString && valueV8 instanceof V8ValueInteger) {
                        int code = ((V8ValueInteger) valueV8).getValue();
                        String name = ((V8ValueString) keyV8).getValue();
                        result.syntaxKindsByCode.put(code, name);
                        result.syntaxKindsByName.put(name, code);
                    }
                });
            }

            return result;
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public int syntaxKindCode(String name) {
        return this.syntaxKindsByName.get(name);
    }

    public String syntaxKindName(int code) {
        return this.syntaxKindsByCode.get(code);
    }
}
