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

import org.intellij.lang.annotations.Language;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.openrewrite.TypeScriptSignatureBuilder;
import org.openrewrite.internal.StringUtils;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCRuntime;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.util.Collections;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class TypeScriptSignatureBuilderTest {
    @Language("typescript")
    private static final String goat = StringUtils.readFully(TypeScriptSignatureBuilderTest.class.getResourceAsStream("/TypeScriptTypeGoat.ts"));

    private static TSCRuntime runtime = TSCRuntime.init();

    @AfterAll
    static void afterAll() {
        runtime.close();
    }

    public TypeScriptSignatureBuilder signatureBuilder() {
        return new TypeScriptSignatureBuilder();
    }

    @Test
    void test() {
//        runtime.parseSourceTexts(
//                Collections.singletonMap("goat.ts", goat),
//                (node, context) -> assertThat(firstMethodParameterSignature(node, "clazz")).isEqualTo("")
//        );
    }

    private String firstMethodParameterSignature(TSCNode node, String methodName) {
        return signatureBuilder().signature(node.getNodeListProperty("statements").stream()
                .filter(it -> it.syntaxKind() == TSCSyntaxKind.ClassDeclaration && it.hasProperty("members"))
                .flatMap(it -> it.getNodeListProperty("members").stream())
                .filter(it -> it.syntaxKind() == TSCSyntaxKind.MethodDeclaration && it.hasProperty("name"))
                .filter(it -> it.getNodeProperty("name").getText().equals(methodName))
                .findFirst()
                .orElseThrow()
                .getNodeListProperty("parameters")
                .get(0)
                .getNodeProperty("type"));
    }
}
