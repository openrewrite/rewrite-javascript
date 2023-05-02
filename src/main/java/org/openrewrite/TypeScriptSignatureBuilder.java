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
package org.openrewrite;

import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.JavaTypeSignatureBuilder;

@Incubating(since = "0.0")
public class TypeScriptSignatureBuilder implements JavaTypeSignatureBuilder {

    @Override
    public String signature(@Nullable Object type) {
        return null;
    }

    @Override
    public String arraySignature(Object type) {
        return null;
    }

    @Override
    public String classSignature(Object type) {
        return null;
    }

    @Override
    public String genericSignature(Object type) {
        return null;
    }

    @Override
    public String parameterizedSignature(Object type) {
        return null;
    }

    @Override
    public String primitiveSignature(Object type) {
        return null;
    }
}
