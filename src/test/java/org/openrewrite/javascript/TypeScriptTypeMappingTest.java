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
import org.openrewrite.javascript.tree.JS;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.openrewrite.java.tree.JavaType.GenericTypeVariable.Variance.*;

@SuppressWarnings("DataFlowIssue")
public class TypeScriptTypeMappingTest {
    private static final String goat = StringUtils.readFully(TypeScriptSignatureBuilderTest.class.getResourceAsStream("/TypeScriptTypeGoat.ts"));
    private static final JS.CompilationUnit cu = JavaScriptParser.builder().build()
            .parse(new InMemoryExecutionContext(), goat)
            .get(0);
    private static final List<JavaType.FullyQualified> classes = cu
            .getStatements()
            .stream()
            .filter(it -> it instanceof J.ClassDeclaration)
            .map(it -> (J.ClassDeclaration) it)
            .map(J.ClassDeclaration::getType)
            .toList();
    private static final JavaType.Parameterized goatType = TypeUtils.asParameterized(classes.get(0));

    // TODO: add methods to access methods via name.
    // Add methods to access types as types are added.

    private String getSourcePath() {
        return cu.getSourcePath().toString().replace("/", ".");
    }

    @Test
    void className() {
        JavaType.FullyQualified clazz = TypeUtils.asFullyQualified(this.firstMethodParameter("clazz"));
        Assertions.assertThat(clazz).isNotNull();
        Assertions.assertThat(clazz.getFullyQualifiedName()).isEqualTo(getSourcePath() + ".A");
    }

    @Test
    void constructor() {
        JavaType.Method ctor = methodType("<constructor>");
        assertThat(ctor.getDeclaringType().getFullyQualifiedName()).isEqualTo("%s.TypeScriptTypeGoat", getSourcePath());
    }

    @Test
    void parameterizedField() {
        JavaType.Variable type = firstField("parameterizedField");
        assertThat(type.getType().toString()).isEqualTo("%s.PT<type.analysis.Anonymous>", getSourcePath());
    }

    @Test
    void unionField() {
        JavaType.Variable type = firstField("unionField");
        assertThat(type.getType().toString()).isEqualTo("type.analysis.Union", getSourcePath());
    }

    @ExpectedToFail
    @Test
    void extendsJavaTypeGoat() {
        JavaType.Variable type = firstField("ExtendsTypeScriptTypeGoat");
        assertThat(type.getType().toString()).isEqualTo("implement me", getSourcePath());
    }

    @Test
    void parameterized() {
        String sourcePath = getSourcePath();
        JavaType.Parameterized parameterized = (JavaType.Parameterized) firstMethodParameter("parameterized");
        assertThat(parameterized.getType().getFullyQualifiedName()).isEqualTo("%s.PT", sourcePath);
        assertThat(TypeUtils.asFullyQualified(parameterized.getTypeParameters().get(0)).getFullyQualifiedName()).isEqualTo("%s.A", sourcePath);
    }

    @Test
    void parameterizedRecursive() {
        String sourcePath = getSourcePath();
        JavaType.Parameterized parameterized = (JavaType.Parameterized) firstMethodParameter("parameterizedRecursive");
        assertThat(parameterized.getType().getFullyQualifiedName()).isEqualTo("%s.PT", sourcePath);
        assertThat(TypeUtils.asFullyQualified(parameterized.getTypeParameters().get(0)).getFullyQualifiedName()).isEqualTo("%s.PT", sourcePath);
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
        assertThat(TypeUtils.asFullyQualified(generic.getBounds().get(0)).getFullyQualifiedName()).isEqualTo("%s.A", getSourcePath());
    }

    @Test
    void genericT() {
        JavaType.GenericTypeVariable generic = (JavaType.GenericTypeVariable) firstMethodParameter("genericT");
        assertThat(generic.getName()).isEqualTo("T");
        assertThat(generic.getVariance()).isEqualTo(INVARIANT);
    }

    @Test
    void genericUnbounded() {
        JavaType.GenericTypeVariable generic = (JavaType.GenericTypeVariable) TypeUtils.asParameterized(firstMethodParameter("genericUnbounded")).getTypeParameters().get(0);
        assertThat(generic.getName()).isEqualTo("U");
        assertThat(generic.getVariance()).isEqualTo(INVARIANT);
    }

    @Test
    void genericMultipleBounds() {
        String sourcePath = getSourcePath();
        List<JavaType> typeParameters = goatType.getTypeParameters();
        JavaType.GenericTypeVariable generic = (JavaType.GenericTypeVariable) typeParameters.get(typeParameters.size() - 1);
        assertThat(generic.getName()).isEqualTo("S");
        assertThat(generic.getVariance()).isEqualTo(COVARIANT);
        assertThat(TypeUtils.asFullyQualified(generic.getBounds().get(0)).getFullyQualifiedName()).isEqualTo("%s.PT", sourcePath);
        assertThat(TypeUtils.asFullyQualified(generic.getBounds().get(1)).getFullyQualifiedName()).isEqualTo("%s.A", sourcePath);
    }

    @Test
    void genericRecursive() {
        String sourcePath = getSourcePath();
        JavaType.Parameterized param = (JavaType.Parameterized) firstMethodParameter("genericRecursive");
        assertThat(param.toString()).isEqualTo("%s.TypeScriptTypeGoat<Generic{U extends %s.TypeScriptTypeGoat<Generic{U}, unknown>}[], unknown>", sourcePath, sourcePath);
        JavaType.Array.GenericTypeVariable generic = (JavaType.GenericTypeVariable) ((JavaType.Array) param.getTypeParameters().get(0)).getElemType();
        assertThat(generic.getName()).isEqualTo("U");
        assertThat(generic.getVariance()).isEqualTo(COVARIANT);
        assertThat(TypeUtils.asParameterized(generic.getBounds().get(0))).isNotNull();

        JavaType.GenericTypeVariable elemType = (JavaType.GenericTypeVariable) TypeUtils.asParameterized(generic.getBounds().get(0)).getTypeParameters().get(0);
        assertThat(elemType.getName()).isEqualTo("U");
        assertThat(elemType.getVariance()).isEqualTo(COVARIANT);
        assertThat(elemType.getBounds()).hasSize(1);

        JavaType.GenericTypeVariable gtv = (JavaType.GenericTypeVariable) ((JavaType.Parameterized) elemType.getBounds().get(0)).getTypeParameters().get(0);
        assertThat(gtv.toString()).isEqualTo("Generic{U extends %s.TypeScriptTypeGoat<Generic{U}, unknown>}", sourcePath);
    }

    @Test
    void inheritedTypeScriptTypeGoat() {
        String sourcePath = getSourcePath();
        JavaType.Parameterized clazz = (JavaType.Parameterized) firstMethodParameter("inheritedTypeScriptTypeGoat");
        assertThat(clazz.getTypeParameters().get(0).toString()).isEqualTo("Generic{T}");
        assertThat(clazz.getTypeParameters().get(1).toString()).isEqualTo("Generic{U extends %s.PT<Generic{U}> & %s.C}", sourcePath, sourcePath);
        assertThat(clazz.toString()).isEqualTo("%s.InheritedTypeScriptTypeGoat<Generic{T}, Generic{U extends %s.PT<Generic{U}> & %s.C}>", sourcePath, sourcePath, sourcePath);
    }

    @Test
    void genericIntersectionType() {
        String sourcePath = getSourcePath();
        JavaType.GenericTypeVariable clazz = (JavaType.GenericTypeVariable) firstMethodParameter("genericIntersection");
        assertThat(clazz.getBounds().get(0).toString()).isEqualTo("type.analysis.Anonymous");
        assertThat(clazz.getBounds().get(1).toString()).isEqualTo("%s.PT<Generic{U extends type.analysis.Anonymous & %s.C}>", sourcePath, sourcePath, sourcePath);
        assertThat(clazz.getBounds().get(2).toString()).isEqualTo("%s.C", sourcePath);
        assertThat(clazz.toString()).isEqualTo("Generic{U extends type.analysis.Anonymous & %s.PT<Generic{U}> & %s.C}", sourcePath, sourcePath);
    }

    @Test
    void enumTypeA() {
        String sourcePath = getSourcePath();
        JavaType.Class clazz = (JavaType.Class) firstClassType("EnumTypeA");

        List<JavaType.Variable> enumConstants = clazz.getMembers().stream()
                .filter(m -> m instanceof JavaType.Variable)
                .toList();
        assertThat(enumConstants).hasSize(2);
        assertThat(enumConstants.get(0).getName()).isEqualTo("FOO");
        assertThat(TypeUtils.asFullyQualified(enumConstants.get(0).getOwner()).getFullyQualifiedName()).isEqualTo("%s.EnumTypeA", sourcePath);
        assertThat(TypeUtils.asFullyQualified(enumConstants.get(0).getType()).getFullyQualifiedName()).isEqualTo("%s.EnumTypeA", sourcePath);
        assertThat(enumConstants.get(1).getName()).isEqualTo("BAR");
        assertThat(TypeUtils.asFullyQualified(enumConstants.get(1).getOwner()).getFullyQualifiedName()).isEqualTo("%s.EnumTypeA", sourcePath);
        assertThat(TypeUtils.asFullyQualified(enumConstants.get(1).getType()).getFullyQualifiedName()).isEqualTo("%s.EnumTypeA", sourcePath);
    }

    @Test
    void recursiveIntersection() {
        String sourcePath = getSourcePath();
        JavaType.GenericTypeVariable clazz = TypeUtils.asGeneric(firstMethodParameter("recursiveIntersection"));
        assertThat(clazz.toString()).isEqualTo("Generic{U extends %s.Extension<Generic{U}> & %s.Intersection<Generic{U}>}", sourcePath, sourcePath);
    }

    public JavaType.Method methodType(String methodName) {
        JavaType.Method type = goatType.getMethods().stream()
                .filter(m -> m.getName().equals(methodName))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Expected to find matching method named " + methodName));
        Assertions.assertThat(type.getDeclaringType().toString()).isEqualTo("%s.TypeScriptTypeGoat", getSourcePath());
        return type;
    }

    public JavaType firstMethodParameter(String methodName) {
        return methodType(methodName).getParameterTypes().get(0);
    }

    public JavaType.Variable firstField(String fieldName) {
        JavaType.Variable type = goatType.getMembers().stream()
                .filter(m -> m.getName().equals(fieldName))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Expected to find matching member named " + fieldName));
        Assertions.assertThat(type.getOwner().toString()).isEqualTo("%s.TypeScriptTypeGoat", getSourcePath());
        return type;
    }

    public JavaType firstClassType(String className) {
        return classes.stream().filter(it -> className.equals(it.getClassName())).findFirst().orElseThrow();
    }
}
