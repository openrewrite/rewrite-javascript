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
    void constructor() {
        runtime.parseSourceTexts(
                Collections.singletonMap(Paths.get("goat.ts"), goat),
                (node, context) -> assertThat(constructorSignature(node))
                        .isEqualTo("goat.ts.TypeScriptTypeGoat{name=<constructor>,return=goat.ts.TypeScriptTypeGoat,parameters=[]}")
        );
    }

    @ExpectedToFail("Requires typeof")
    @Test
    void parameterizedField() {
        runtime.parseSourceTexts(
                Collections.singletonMap(Paths.get("goat.ts"), goat),
                (node, context) -> assertThat(fieldSignature(node, "parameterizedField"))
                        .isEqualTo("goat.ts.TypeScriptTypeGoat{name=parameterizedField,type=goat.ts.PT<goat.ts.TypeScriptTypeGoat$TypeA>}")
        );
    }

    @Test
    void array() {
        assertMethodSignature("array",
                "goat.ts.A[]",
                "goat.ts.TypeScriptTypeGoat{name=array,return=void,parameters=[goat.ts.A[]]}");
    }

    @Test
    void multidimensionalArray() {
        assertMethodSignature("multidimensionalArray",
                "goat.ts.A[][]",
                "goat.ts.TypeScriptTypeGoat{name=multidimensionalArray,return=void,parameters=[goat.ts.A[][]]}");
    }

    @Test
    void classSignature() {
        assertMethodSignature("clazz",
                "goat.ts.A",
                "goat.ts.TypeScriptTypeGoat{name=clazz,return=void,parameters=[goat.ts.A]}");
    }

    @Test
    void primitive() {
        assertMethodSignature("primitive",
                "number",
                "goat.ts.TypeScriptTypeGoat{name=primitive,return=void,parameters=[number]}");
    }

    @ExpectedToFail("Requires bounded named of generics instead of declaration name")
    @Test
    void parameterized() {
        assertMethodSignature("parameterized",
                "goat.ts.PT<goat.ts.A>",
                "goat.ts.TypeScriptTypeGoat{name=parameterized,return=goat.ts.PT<goat.ts.A>,parameters=[goat.ts.PT<goat.ts.A>]}");
    }

    @ExpectedToFail("Requires bounded named of generics instead of declaration name")
    @Test
    void parameterizedRecursive() {
        assertMethodSignature("parameterizedRecursive",
                "goat.ts.PT<goat.ts.PT<Generic{goat.ts.A}>",
                "goat.ts.TypeScriptTypeGoat{name=parameterizedRecursive,return=goat.ts.PT<goat.ts.PT<Generic{goat.ts.A}>,parameters=[goat.ts.PT<goat.ts.PT<Generic{goat.ts.A}>]}");
    }

    @ExpectedToFail("Requires bounded named of generics instead of declaration name")
    @Test
    void generic() {
        assertMethodSignature("generic",
                "goat.ts.PT<Generic{T extends goat.ts.B}>",
                "goat.ts.TypeScriptTypeGoat{name=generic,return=goat.ts.PT<Generic{T extends goat.ts.B}>,parameters=[goat.ts.PT<Generic{T extends goat.ts.B}>]}");
    }

    @Test
    void genericT() {
        assertMethodSignature("genericT",
                "Generic{T}",
                "goat.ts.TypeScriptTypeGoat{name=genericT,return=Generic{T},parameters=[Generic{T}]}");
    }

    @ExpectedToFail("Requires adding Contravariant to TSTypeGoat")
    @Test
    void genericContravariant() {
        assertMethodSignature("genericContravariant",
                "Add me",
                "Add me");
    }

    @ExpectedToFail("Requires bounded named of generics instead of declaration name")
    @Test
    void genericRecursiveInClassDefinition() {
        runtime.parseSourceTexts(
                Collections.singletonMap(Paths.get("goat.ts"), goat),
                (node, context) -> assertThat(lastClassTypeParameterSignature(node))
                        .isEqualTo("Generic{S extends goat.ts.PT<Generic{S}> & goat.ts.A}")
        );
    }

    @ExpectedToFail("Requires bounded named of generics instead of declaration name")
    @Test
    void genericRecursiveInMethodDeclaration() {
        assertMethodSignature("genericRecursive",
                "Add me",
                "Add me");
    }

    @ExpectedToFail("Requires support for merged classes")
    @Test
    void mergedClass() {
        assertMethodSignature("mergedClass",
                "Add me",
                "Add me");
    }

    private String fieldSignature(TSCNode node, String field) {
        throw new UnsupportedOperationException("todo");
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

    private String innerClassSignature(TSCNode node, String innerClassSimpleName) {
        throw new UnsupportedOperationException("todo");
    }

    public String lastClassTypeParameterSignature(TSCNode node) {
        List<TSCNode> typeParams = node.getNodeListProperty("statements").get(0).getNodeListProperty("typeParameters");
        return signatureBuilder().signature(typeParams.get(typeParams.size() - 1));
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
