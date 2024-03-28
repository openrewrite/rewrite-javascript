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
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.primitive.V8ValueString;
import com.caoccao.javet.values.reference.IV8ValueObject;
import com.caoccao.javet.values.reference.V8ValueFunction;
import org.intellij.lang.annotations.Language;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public final class TSCV8Utils {
    private TSCV8Utils() {
    }

    private static final Pattern IDENTIFIER_PATTERN = Pattern.compile("^([a-zA-Z_$][a-zA-Z\\\\d_$]*)$");

    public static void assertValidIdentifier(String name) {
        if (!IDENTIFIER_PATTERN.matcher(name).matches()) {
            throw new IllegalArgumentException(String.format("not a valid JS identifier: `%s`", name));
        }
    }

    public static V8ValueFunction makeFunction(
            V8Runtime runtime,
            @Language("typescript") String innerCode,
            IV8ValueObject variables
    ) {
        final List<String> varNames;
        try {
            varNames = new ArrayList<>();
            variables.forEach((V8ValueString varName, V8Value varValue) -> {
                TSCV8Utils.assertValidIdentifier(varName.getValue());
                varNames.add(varName.getValue());
            });
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }

        String outerArgs = "{" + String.join(",", varNames) + "}";
        String outerCode = String.format("(%s) => {return %s;}", outerArgs, innerCode);
        try (
                V8ValueFunction outerFn = runtime.createV8ValueFunction(outerCode);
                V8Value innerFnObject = outerFn.call(null, variables)
        ) {
            if (!(innerFnObject instanceof V8ValueFunction)) {
                throw new IllegalStateException("expected a function; found: " + innerFnObject.getClass().getSimpleName());
            }
            return innerFnObject.toClone();
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

}
