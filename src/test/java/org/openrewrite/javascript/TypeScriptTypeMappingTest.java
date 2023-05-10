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
package org.openrewrite.javascript;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openrewrite.InMemoryExecutionContext;
import org.openrewrite.internal.StringUtils;
import org.openrewrite.java.tree.J;
import org.openrewrite.java.tree.JavaType;
import org.openrewrite.java.tree.TypeUtils;

import static java.util.Objects.requireNonNull;

public class TypeScriptTypeMappingTest {
    private static final String goat = StringUtils.readFully(TypeScriptSignatureBuilderTest.class.getResourceAsStream("/TypeScriptTypeGoat.ts"));
    private static JavaType.FullyQualified goatType = requireNonNull(TypeUtils.asFullyQualified(JavaScriptParser.builder().build()
            .parse(new InMemoryExecutionContext(), goat)
            .get(0)
            .getStatements()
            .stream()
            .filter(it -> it instanceof J.ClassDeclaration)
            .map(it -> (J.ClassDeclaration) it)
            .findFirst()
            .orElseThrow()
            .getType()));

    // TODO: add methods to access methods via name.
    // Add methods to access types as types are added.

    @Test
    void className() {
        JavaType.FullyQualified clazz = TypeUtils.asFullyQualified(this.firstMethodParameter("clazzA"));
        Assertions.assertThat(clazz).isNotNull();
        Assertions.assertThat(clazz.getFullyQualifiedName()).endsWith(".file.js.A");
    }

    public JavaType.Method methodType(String methodName) {
        JavaType.Method type = goatType.getMethods().stream()
                .filter(m -> m.getName().equals(methodName))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Expected to find matching method named " + methodName));
        Assertions.assertThat(type.getDeclaringType().toString()).endsWith(".file.js.TypeScriptTypeGoat");
        return type;
    }

    public JavaType firstMethodParameter(String methodName) {
        return methodType(methodName).getParameterTypes().get(0);
    }
}
