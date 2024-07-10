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
import org.openrewrite.internal.StringUtils;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCRuntime;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.util.List;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;

class TypeScriptSignatureBuilderTest {

    @Language("typescript")
    private static final String goat = StringUtils.readFully(TypeScriptSignatureBuilderTest.class.getResourceAsStream("/TypeScriptTypeGoat.ts"));

    private static final TSCRuntime runtime = TSCRuntime.init();

    @AfterAll
    static void afterAll() {
        runtime.close();
    }

    TypeScriptSignatureBuilder signatureBuilder() {
        return new TypeScriptSignatureBuilder();
    }

    @Test
    void constructor() {
        runtime.parseSingleSource(
                goat,
                (node, context) -> assertThat(constructorSignature(node))
                        .isEqualTo("file.ts.TypeScriptTypeGoat{name=<constructor>,return=file.ts.TypeScriptTypeGoat,parameters=[]}")
        );
    }

    @Test
    void parameterizedField() {
        runtime.parseSingleSource(
                goat,
                (node, context) -> assertThat(fieldSignature(node, "parameterizedField"))
                        .isEqualTo("file.ts.TypeScriptTypeGoat{name=parameterizedField,type=file.ts.PT<file.ts.TypeScriptTypeGoat$TypeA>}")
        );
    }

    @Test
    void array() {
        assertMethodSignature("array",
                "file.ts.A[]",
                "file.ts.TypeScriptTypeGoat{name=array,return=void,parameters=[file.ts.A[]]}");
    }

    @Test
    void multidimensionalArray() {
        assertMethodSignature("multidimensionalArray",
                "file.ts.A[][]",
                "file.ts.TypeScriptTypeGoat{name=multidimensionalArray,return=void,parameters=[file.ts.A[][]]}");
    }

    @Test
    void classSignature() {
        assertMethodSignature("clazz",
                "file.ts.A",
                "file.ts.TypeScriptTypeGoat{name=clazz,return=void,parameters=[file.ts.A]}");
    }

    @Test
    void primitive() {
        assertMethodSignature("primitive",
                "number",
                "file.ts.TypeScriptTypeGoat{name=primitive,return=void,parameters=[number]}");
    }

    @Test
    void parameterized() {
        assertMethodSignature("parameterized",
                "file.ts.PT<file.ts.A>",
                "file.ts.TypeScriptTypeGoat{name=parameterized,return=file.ts.PT<file.ts.A>,parameters=[file.ts.PT<file.ts.A>]}");
    }

    @Test
    void parameterizedRecursive() {
        assertMethodSignature("parameterizedRecursive",
                "file.ts.PT<file.ts.PT<file.ts.A>>",
                "file.ts.TypeScriptTypeGoat{name=parameterizedRecursive,return=file.ts.PT<file.ts.PT<file.ts.A>>,parameters=[file.ts.PT<file.ts.PT<file.ts.A>>]}");
    }

    @Test
    void generic() {
        assertMethodSignature("generic",
                "file.ts.PT<Generic{T extends file.ts.A}>",
                "file.ts.TypeScriptTypeGoat{name=generic,return=file.ts.PT<Generic{T extends file.ts.A}>,parameters=[file.ts.PT<Generic{T extends file.ts.A}>]}");
    }

    @Test
    void genericUnbounded() {
        assertMethodSignature("genericUnbounded",
                "file.ts.PT<Generic{U}>",
                "file.ts.TypeScriptTypeGoat{name=genericUnbounded,return=file.ts.PT<Generic{U}>,parameters=[file.ts.PT<Generic{U}>]}");
    }

    @Test
    void mergedInterfaceGeneric() {
        assertMethodSignature("mergedGeneric",
                "file.ts.PT<Generic{T extends type.analysis.MergedInterface}>",
                "file.ts.TypeScriptTypeGoat{name=mergedGeneric,return=file.ts.PT<Generic{T extends type.analysis.MergedInterface}>,parameters=[file.ts.PT<Generic{T extends type.analysis.MergedInterface}>]}");
    }

    @Test
    void genericT() {
        assertMethodSignature("genericT",
                "Generic{T}",
                "file.ts.TypeScriptTypeGoat{name=genericT,return=Generic{T},parameters=[Generic{T}]}");
    }

    @Test
    void genericRecursiveInClassDefinition() {
        runtime.parseSingleSource(
                goat,
                (node, context) -> assertThat(lastClassTypeParameterSignature(node))
                        .isEqualTo("Generic{S extends file.ts.PT<Generic{S}> & file.ts.A}")
        );
    }

    @Test
    void genericRecursiveInMethodDeclaration() {
        assertMethodSignature("genericRecursive",
                "file.ts.TypeScriptTypeGoat<Generic{U extends file.ts.TypeScriptTypeGoat<Generic{U}, unknown>}[], unknown>",
                "file.ts.TypeScriptTypeGoat{name=genericRecursive,return=file.ts.TypeScriptTypeGoat<Generic{U extends file.ts.TypeScriptTypeGoat<Generic{U}, unknown>}[], unknown>,parameters=[file.ts.TypeScriptTypeGoat<Generic{U extends file.ts.TypeScriptTypeGoat<Generic{U}, unknown>}[], unknown>]}");
    }

    @Test
    void genericIntersection() {
        assertMethodSignature("genericIntersection",
                "Generic{U extends type.analysis.Anonymous & file.ts.PT<Generic{U}> & file.ts.C}",
                "file.ts.TypeScriptTypeGoat{name=genericIntersection,return=Generic{U extends type.analysis.Anonymous & file.ts.PT<Generic{U}> & file.ts.C},parameters=[Generic{U extends type.analysis.Anonymous & file.ts.PT<Generic{U}> & file.ts.C}]}");
    }

    @Test
    void recursiveIntersection() {
        assertMethodSignature("recursiveIntersection",
                "Generic{U extends file.ts.Extension<Generic{U}> & file.ts.Intersection<Generic{U}>}",
                "file.ts.TypeScriptTypeGoat{name=recursiveIntersection,return=void,parameters=[Generic{U extends file.ts.Extension<Generic{U}> & file.ts.Intersection<Generic{U}>}]}");
    }

    @Test
    void merged() {
        assertMethodSignature("merged",
                "type.analysis.MergedInterface",
                "file.ts.TypeScriptTypeGoat{name=merged,return=void,parameters=[type.analysis.MergedInterface]}");
    }

    @Test
    void unionField() {
        runtime.parseSingleSource(
                goat,
                (node, context) -> assertThat(fieldSignature(node, "unionField"))
                        .isEqualTo("file.ts.TypeScriptTypeGoat{name=unionField,type=type.analysis.Union}")
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

    String methodSignature(TSCNode node, String methodName) {
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

    String lastClassTypeParameterSignature(TSCNode node) {
        List<TSCNode> typeParams = node.getNodeListProperty("statements").get(0).getNodeListProperty("typeParameters");
        return Objects.requireNonNull(signatureBuilder().signature(typeParams.get(typeParams.size() - 1)));
    }

    private void assertMethodSignature(String target, String expectedMethodParameterSignature, String expectedMethodSignature) {
        runtime.parseSingleSource(
                goat,
                (node, context) -> {
                    assertThat(firstMethodParameterSignature(node, target))
                            .isEqualTo(expectedMethodParameterSignature);
                    assertThat(methodSignature(node, target))
                            .isEqualTo(expectedMethodSignature);
                }
        );
    }
}
