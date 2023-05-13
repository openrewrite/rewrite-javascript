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
import org.junitpioneer.jupiter.ExpectedToFail;
import org.openrewrite.TypeScriptSignatureBuilder;
import org.openrewrite.internal.StringUtils;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCRuntime;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class TypeScriptSignatureBuilderTest {

    //TODO: identify why `app.` is added to FQNs. Happened after libs change.

    @Language("typescript")
    private static final String goat = StringUtils.readFully(TypeScriptSignatureBuilderTest.class.getResourceAsStream("/TypeScriptTypeGoat.ts"));

    private static final TSCRuntime runtime = TSCRuntime.init();

    @AfterAll
    static void afterAll() {
        runtime.close();
    }

    public TypeScriptSignatureBuilder signatureBuilder() {
        return new TypeScriptSignatureBuilder();
    }

    @Test
    void constructor() {
        runtime.parseSourceTexts(
                Collections.singletonMap(Paths.get("goat.ts"), goat),
                (node, context) -> assertThat(constructorSignature(node))
                        .isEqualTo("app.goat.ts.TypeScriptTypeGoat{name=<constructor>,return=app.goat.ts.TypeScriptTypeGoat,parameters=[]}")
        );
    }

    @Test
    void parameterizedField() {
        runtime.parseSourceTexts(
                Collections.singletonMap(Paths.get("goat.ts"), goat),
                (node, context) -> assertThat(fieldSignature(node, "parameterizedField"))
                        .isEqualTo("app.goat.ts.TypeScriptTypeGoat{name=parameterizedField,type=app.goat.ts.PT<app.goat.ts.TypeScriptTypeGoat$TypeA>}")
        );
    }

    @Test
    void array() {
        assertMethodSignature("array",
                "app.goat.ts.A[]",
                "app.goat.ts.TypeScriptTypeGoat{name=array,return=void,parameters=[app.goat.ts.A[]]}");
    }

    @Test
    void multidimensionalArray() {
        assertMethodSignature("multidimensionalArray",
                "app.goat.ts.A[][]",
                "app.goat.ts.TypeScriptTypeGoat{name=multidimensionalArray,return=void,parameters=[app.goat.ts.A[][]]}");
    }

    @Test
    void classSignature() {
        assertMethodSignature("clazz",
                "app.goat.ts.A",
                "app.goat.ts.TypeScriptTypeGoat{name=clazz,return=void,parameters=[app.goat.ts.A]}");
    }

    @Test
    void primitive() {
        assertMethodSignature("primitive",
                "number",
                "app.goat.ts.TypeScriptTypeGoat{name=primitive,return=void,parameters=[number]}");
    }

    @Test
    void parameterized() {
        assertMethodSignature("parameterized",
                "app.goat.ts.PT<app.goat.ts.A>",
                "app.goat.ts.TypeScriptTypeGoat{name=parameterized,return=app.goat.ts.PT<app.goat.ts.A>,parameters=[app.goat.ts.PT<app.goat.ts.A>]}");
    }

    @Test
    void parameterizedRecursive() {
        assertMethodSignature("parameterizedRecursive",
                "app.goat.ts.PT<app.goat.ts.PT<app.goat.ts.A>>",
                "app.goat.ts.TypeScriptTypeGoat{name=parameterizedRecursive,return=app.goat.ts.PT<app.goat.ts.PT<app.goat.ts.A>>,parameters=[app.goat.ts.PT<app.goat.ts.PT<app.goat.ts.A>>]}");
    }

    @Test
    void generic() {
        assertMethodSignature("generic",
                "app.goat.ts.PT<Generic{T extends app.goat.ts.A}>",
                "app.goat.ts.TypeScriptTypeGoat{name=generic,return=app.goat.ts.PT<Generic{T extends app.goat.ts.A}>,parameters=[app.goat.ts.PT<Generic{T extends app.goat.ts.A}>]}");
    }

    @Test
    void mergedInterfaceGeneric() {
        assertMethodSignature("mergedGeneric",
          "app.goat.ts.PT<Generic{T extends type.analysis.MergedInterface}>",
          "app.goat.ts.TypeScriptTypeGoat{name=mergedGeneric,return=app.goat.ts.PT<Generic{T extends type.analysis.MergedInterface}>,parameters=[app.goat.ts.PT<Generic{T extends type.analysis.MergedInterface}>]}");
    }

    @Test
    void genericT() {
        assertMethodSignature("genericT",
                "Generic{T}",
                "app.goat.ts.TypeScriptTypeGoat{name=genericT,return=Generic{T},parameters=[Generic{T}]}");
    }

    @ExpectedToFail("Requires adding Contravariant to TSTypeGoat")
    @Test
    void genericContravariant() {
        assertMethodSignature("genericContravariant",
                "Add me",
                "Add me");
    }

    @Test
    void genericRecursiveInClassDefinition() {
        runtime.parseSourceTexts(
                Collections.singletonMap(Paths.get("goat.ts"), goat),
                (node, context) -> assertThat(lastClassTypeParameterSignature(node))
                        .isEqualTo("Generic{S extends app.goat.ts.PT<Generic{S}> & app.goat.ts.A}")
        );
    }

    @ExpectedToFail("Implement TS recursive generic")
    @Test
    void genericRecursiveInMethodDeclaration() {
        assertMethodSignature("genericRecursive",
                "Add me",
                "Add me");
    }

    @Test
    void merged() {
        assertMethodSignature("merged",
                "type.analysis.MergedInterface",
                "app.goat.ts.TypeScriptTypeGoat{name=merged,return=void,parameters=[type.analysis.MergedInterface]}");
    }

    @Test
    void unionField() {
        runtime.parseSourceTexts(
          Collections.singletonMap(Paths.get("goat.ts"), goat),
          (node, context) -> assertThat(fieldSignature(node, "unionField"))
                  .isEqualTo("app.goat.ts.TypeScriptTypeGoat{name=unionField,type=type.analysis.Union}")
        );
    }

    private String fieldSignature(TSCNode node, String field) {
        return signatureBuilder().variableSignature(node.getNodeListProperty("statements").stream()
                .filter(it -> it.syntaxKind() == TSCSyntaxKind.ClassDeclaration && it.hasProperty("members"))
                .flatMap(it -> it.getNodeListProperty("members").stream())
                .filter(it -> it.syntaxKind() == TSCSyntaxKind.PropertyDeclaration && it.hasProperty("name") && field.equals(it.getNodeProperty("name").getText()))
                .findFirst()
                .orElseThrow());
    }

    public String methodSignature(TSCNode node, String methodName) {
        return signatureBuilder().methodSignature(node.getNodeListProperty("statements").stream()
                .filter(it -> it.syntaxKind() == TSCSyntaxKind.ClassDeclaration && it.hasProperty("members"))
                .flatMap(it -> it.getNodeListProperty("members").stream())
                .filter(it -> it.syntaxKind() == TSCSyntaxKind.MethodDeclaration && it.hasProperty("name"))
                .filter(it -> it.getNodeProperty("name").getText().equals(methodName))
                .findFirst()
                .orElseThrow());
    }

    private String constructorSignature(TSCNode node) {
        return signatureBuilder().methodSignature(node.getNodeListProperty("statements").stream()
                .filter(it -> it.syntaxKind() == TSCSyntaxKind.ClassDeclaration && it.hasProperty("members"))
                .flatMap(it -> it.getNodeListProperty("members").stream())
                .filter(it -> it.syntaxKind() == TSCSyntaxKind.Constructor)
                .findFirst()
                .orElseThrow());
    }

    private String firstMethodParameterSignature(TSCNode node, String methodName) {
        return Objects.requireNonNull(signatureBuilder().signature(node.getNodeListProperty("statements").stream()
                .filter(it -> it.syntaxKind() == TSCSyntaxKind.ClassDeclaration && it.hasProperty("members"))
                .flatMap(it -> it.getNodeListProperty("members").stream())
                .filter(it -> it.syntaxKind() == TSCSyntaxKind.MethodDeclaration && it.hasProperty("name"))
                .filter(it -> it.getNodeProperty("name").getText().equals(methodName))
                .findFirst()
                .orElseThrow()
                .getNodeListProperty("parameters")
                .get(0)
                .getNodeProperty("type")));
    }

    private String innerClassSignature(TSCNode node, String innerClassSimpleName) {
        throw new UnsupportedOperationException("todo");
    }

    public String lastClassTypeParameterSignature(TSCNode node) {
        List<TSCNode> typeParams = node.getNodeListProperty("statements").get(0).getNodeListProperty("typeParameters");
        return Objects.requireNonNull(signatureBuilder().signature(typeParams.get(typeParams.size() - 1)));
    }

    private void assertMethodSignature(String target, String expectedMethodParameterSignature, String expectedMethodSignature) {
        runtime.parseSourceTexts(
                Collections.singletonMap(Paths.get("goat.ts"), goat),
                (node, context) -> {
                    assertThat(firstMethodParameterSignature(node, target))
                            .isEqualTo(expectedMethodParameterSignature);
                    assertThat(methodSignature(node, target))
                            .isEqualTo(expectedMethodSignature);
                }
        );
    }
}
