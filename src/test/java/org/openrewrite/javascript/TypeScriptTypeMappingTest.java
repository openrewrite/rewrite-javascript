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
import org.junitpioneer.jupiter.ExpectedToFail;
import org.openrewrite.InMemoryExecutionContext;
import org.openrewrite.internal.StringUtils;
import org.openrewrite.java.tree.J;
import org.openrewrite.java.tree.JavaType;
import org.openrewrite.java.tree.TypeUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.openrewrite.java.tree.JavaType.GenericTypeVariable.Variance.*;

@SuppressWarnings("DataFlowIssue")
public class TypeScriptTypeMappingTest {
    private static final String goat = StringUtils.readFully(TypeScriptSignatureBuilderTest.class.getResourceAsStream("/TypeScriptTypeGoat.ts"));
    private static final List<JavaType.FullyQualified> classes = JavaScriptParser.builder().build()
            .parse(new InMemoryExecutionContext(), goat)
            .get(0)
            .getStatements()
            .stream()
            .filter(it -> it instanceof J.ClassDeclaration)
            .map(it -> (J.ClassDeclaration) it)
            .map(J.ClassDeclaration::getType)
            .toList();
    private static final JavaType.Parameterized goatType = TypeUtils.asParameterized(classes.get(0));

    // TODO: add methods to access methods via name.
    // Add methods to access types as types are added.

    @Test
    void className() {
        JavaType.FullyQualified clazz = TypeUtils.asFullyQualified(this.firstMethodParameter("clazz"));
        Assertions.assertThat(clazz).isNotNull();
        Assertions.assertThat(clazz.getFullyQualifiedName()).endsWith(".file.js.A");
    }

    @Test
    void constructor() {
        JavaType.Method ctor = methodType("<constructor>");
        assertThat(ctor.getDeclaringType().getFullyQualifiedName()).endsWith(".file.js.TypeScriptTypeGoat");
    }

    @Test
    void parameterized() {
        JavaType.Parameterized parameterized = (JavaType.Parameterized) firstMethodParameter("parameterized");
        assertThat(parameterized.getType().getFullyQualifiedName()).endsWith(".file.js.PT");
        assertThat(TypeUtils.asFullyQualified(parameterized.getTypeParameters().get(0)).getFullyQualifiedName()).endsWith(".file.js.A");
    }

    @Test
    void primitive() {
        JavaType.Class kotlinBasicType = (JavaType.Class) firstMethodParameter("primitive");
        assertThat(kotlinBasicType.getFullyQualifiedName()).isEqualTo("number");
    }

    @Test
    void generic() {
        JavaType.GenericTypeVariable generic = (JavaType.GenericTypeVariable) TypeUtils.asParameterized(firstMethodParameter("generic")).getTypeParameters().get(0);
        assertThat(generic.getName()).isEqualTo("T");
        assertThat(generic.getVariance()).isEqualTo(COVARIANT);
        assertThat(TypeUtils.asFullyQualified(generic.getBounds().get(0)).getFullyQualifiedName()).endsWith(".file.js.A");
    }

    @ExpectedToFail("add contravariant to type goat.")
    @Test
    void genericContravariant() {
        JavaType.GenericTypeVariable generic = (JavaType.GenericTypeVariable) TypeUtils.asParameterized(firstMethodParameter("genericContravariant")).getTypeParameters().get(0);
        assertThat(generic.getName()).isEqualTo("");
        assertThat(generic.getVariance()).isEqualTo(CONTRAVARIANT);
        assertThat(TypeUtils.asFullyQualified(generic.getBounds().get(0)).getFullyQualifiedName()).
          isEqualTo("org.openrewrite.kotlin.C");
    }

    @Test
    void genericMultipleBounds() {
        List<JavaType> typeParameters = goatType.getTypeParameters();
        JavaType.GenericTypeVariable generic = (JavaType.GenericTypeVariable) typeParameters.get(typeParameters.size() - 1);
        assertThat(generic.getName()).isEqualTo("S");
        assertThat(generic.getVariance()).isEqualTo(COVARIANT);
        assertThat(TypeUtils.asFullyQualified(generic.getBounds().get(0)).getFullyQualifiedName()).endsWith(".file.js.PT");
        assertThat(TypeUtils.asFullyQualified(generic.getBounds().get(1)).getFullyQualifiedName()).
          endsWith(".file.js.A");
    }

    @Test
    void genericUnbounded() {
        JavaType.GenericTypeVariable generic = (JavaType.GenericTypeVariable) TypeUtils.asParameterized(firstMethodParameter("genericUnbounded")).getTypeParameters().get(0);
        assertThat(generic.getName()).isEqualTo("U");
        assertThat(generic.getVariance()).isEqualTo(INVARIANT);
        assertThat(generic.getBounds()).isEmpty();
    }

    @ExpectedToFail("add to type goat")
    @Test
    void genericRecursive() {
        JavaType.Parameterized param = (JavaType.Parameterized) firstMethodParameter("genericRecursive");
        JavaType typeParam = param.getTypeParameters().get(0);
        JavaType.GenericTypeVariable generic = (JavaType.GenericTypeVariable) typeParam;
        assertThat(generic.getName()).isEqualTo("");
        assertThat(generic.getVariance()).isEqualTo(COVARIANT);
        assertThat(TypeUtils.asParameterized(generic.getBounds().get(0))).isNotNull();

        JavaType.GenericTypeVariable elemType = (JavaType.GenericTypeVariable) TypeUtils.asParameterized(generic.getBounds().get(0)).getTypeParameters().get(0);
        assertThat(elemType.getName()).isEqualTo("U");
        assertThat(elemType.getVariance()).isEqualTo(COVARIANT);
        assertThat(elemType.getBounds()).hasSize(1);
    }

    @ExpectedToFail("add to type goat")
    @Test
    void innerClass() {
        JavaType.FullyQualified clazz = TypeUtils.asFullyQualified(firstMethodParameter("inner"));
        assertThat(clazz.getFullyQualifiedName()).isEqualTo("org.openrewrite.kotlin.C$Inner");
    }

    @ExpectedToFail("add to type goat")
    @Test
    void inheritedJavaTypeGoat() {
        JavaType.Parameterized clazz = (JavaType.Parameterized) firstMethodParameter("InheritedKotlinTypeGoat");
        assertThat(clazz.getTypeParameters().get(0).toString()).isEqualTo("Generic{T}");
        assertThat(clazz.getTypeParameters().get(1).toString()).isEqualTo("Generic{U extends org.openrewrite.kotlin.PT<Generic{U}> & org.openrewrite.kotlin.C}");
        assertThat(clazz.toString()).isEqualTo("org.openrewrite.kotlin.KotlinTypeGoat$InheritedKotlinTypeGoat<Generic{T}, Generic{U extends org.openrewrite.kotlin.PT<Generic{U}> & org.openrewrite.kotlin.C}>");
    }

    @ExpectedToFail("add to type goat")
    @Test
    void genericIntersectionType() {
        JavaType.GenericTypeVariable clazz = (JavaType.GenericTypeVariable) firstMethodParameter("genericIntersection");
        assertThat(clazz.getBounds().get(0).toString()).isEqualTo("org.openrewrite.java.JavaTypeGoat$TypeA");
        assertThat(clazz.getBounds().get(1).toString()).isEqualTo("org.openrewrite.java.PT<Generic{U extends org.openrewrite.java.JavaTypeGoat$TypeA & org.openrewrite.java.C}>");
        assertThat(clazz.getBounds().get(2).toString()).isEqualTo("org.openrewrite.java.C");
        assertThat(clazz.toString()).isEqualTo("Generic{U extends org.openrewrite.java.JavaTypeGoat$TypeA & org.openrewrite.java.PT<Generic{U}> & org.openrewrite.java.C}");
    }

    @Test
    void enumTypeA() {
        JavaType.Class clazz = (JavaType.Class) firstClassType("EnumTypeA");

        List<JavaType.Variable> enumConstants = clazz.getMembers().stream()
                .filter(m -> m instanceof JavaType.Variable)
                .toList();
        assertThat(enumConstants).hasSize(2);
        assertThat(enumConstants.get(0).getName()).isEqualTo("FOO");
        assertThat(TypeUtils.asFullyQualified(enumConstants.get(0).getOwner()).getFullyQualifiedName()).endsWith(".file.js.EnumTypeA");
        assertThat(TypeUtils.asFullyQualified(enumConstants.get(0).getType()).getFullyQualifiedName()).endsWith(".file.js.EnumTypeA");
        assertThat(enumConstants.get(1).getName()).isEqualTo("BAR");
        assertThat(TypeUtils.asFullyQualified(enumConstants.get(1).getOwner()).getFullyQualifiedName()).endsWith(".file.js.EnumTypeA");
        assertThat(TypeUtils.asFullyQualified(enumConstants.get(1).getType()).getFullyQualifiedName()).endsWith(".file.js.EnumTypeA");
    }

    @ExpectedToFail("add to type goat")
    @Test
    void recursiveIntersection() {
        JavaType.GenericTypeVariable clazz = TypeUtils.asGeneric(firstMethodParameter("recursiveIntersection"));
        assertThat(clazz.toString()).isEqualTo("Generic{U extends org.openrewrite.java.JavaTypeGoat$Extension<Generic{U}> & org.openrewrite.java.Intersection<Generic{U}>}");
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

    public JavaType firstClassType(String className) {
        return classes.stream().filter(it -> className.equals(it.getClassName())).findFirst().orElseThrow();
    }
}
