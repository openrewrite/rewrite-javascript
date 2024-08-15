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
package org.openrewrite.javascript.internal;

import com.caoccao.javet.values.IV8Value;
import org.jspecify.annotations.Nullable;

public class JavetUtils {
    private JavetUtils() {}

    public static void close(@Nullable IV8Value valueV8) {
        if (valueV8 != null && !valueV8.isClosed()) {
            try {
                valueV8.close();
            } catch (Exception e) {
                System.err.println("Error while attempting to close V8 value: " + e);
                e.printStackTrace();
            }
        }
    }
}
