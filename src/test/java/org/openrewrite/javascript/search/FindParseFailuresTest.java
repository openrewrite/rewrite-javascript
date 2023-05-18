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
package org.openrewrite.javascript.search;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openrewrite.*;
import org.openrewrite.internal.StringUtils;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.tree.J;
import org.openrewrite.java.tree.Space;
import org.openrewrite.java.tree.Statement;
import org.openrewrite.javascript.JavaScriptParser;
import org.openrewrite.javascript.JavaScriptVisitor;
import org.openrewrite.javascript.table.ParseExceptionAnalysis;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.marker.Markers;

import java.nio.file.Path;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

public class FindParseFailuresTest {

    @Nullable
    private static JS.CompilationUnit cuWithErrors;

    @BeforeAll
    public static void setup() {
        //language=ts
        String source = StringUtils.trimIndent("""
            // noinspection JSDuplicatedDeclaration,JSUnusedLocalSymbols
            class Foo {
                s1 = 1;
                s2 = 2;
                s2 = 3;
            }
            """);

        JS.CompilationUnit cu = JavaScriptParser.builder().build().parse(StringUtils.trimIndent(source)).get(0);
        cuWithErrors = (JS.CompilationUnit) new JavaScriptVisitor<Integer>() {
            int count = 0;
            final String replace = "const x = ";

            @Override
            public J visitStatement(Statement statement, Integer integer) {
                if (statement instanceof J.VariableDeclarations) {
                    count++;
                    final ParseExceptionResult result = new ParseExceptionResult(
                      UUID.randomUUID(),
                      ParseExceptionAnalysis.getAnalysisMessage("someNodeType" + count)
                    );
                    return new JS.UnknownElement(
                            Tree.randomId(),
                            Space.EMPTY,
                            Markers.EMPTY,
                            replace + count
                    ).withMarkers(Markers.build(Collections.singletonList(result)));
                }
                return super.visitStatement(statement, integer);
            }
        }.visitCompilationUnit(cu, 0);
    }

    @Test
    void sourceFileIsMarked() {
        //language=ts
        String source = StringUtils.trimIndent("""
            // noinspection JSUnusedLocalSymbols
            class Foo {
                foo() {
                    forceError invalid = true
                }
            }
            """);
        JS.CompilationUnit cu = JavaScriptParser.builder().build().parse(StringUtils.trimIndent(source)).get(0);
        assertThat(cu.getMarkers().findFirst(ParseExceptionResult.class).isPresent()).isTrue();
    }

    @Test
    void singleJsSources() {
        assertThat(cuWithErrors).isNotNull();

        ExecutionContext ctx = new InMemoryExecutionContext();
        new FindParseFailures(null, null).visit(Collections.singletonList(cuWithErrors), ctx);

        Map<ParseExceptionAnalysis, List<ParseExceptionAnalysis.Row>> map = ctx.getMessage("org.openrewrite.dataTables");
        assertThat(map).isNotNull();

        List<ParseExceptionAnalysis.Row> rows = map.get(map.keySet().toArray(ParseExceptionAnalysis[]::new)[0]);
        assertThat(rows).hasSize(3);
        assertThat(rows.get(0).getExceptionCount()).isEqualTo(1);
    }

    @Test
    void multipleJsSources() {
        assertThat(cuWithErrors).isNotNull();
        JS.CompilationUnit cu1 = cuWithErrors.withId(Tree.randomId());
        JS.CompilationUnit cu2 = cuWithErrors.withId(Tree.randomId());
        JS.CompilationUnit cu3 = cuWithErrors.withId(Tree.randomId());

        ExecutionContext ctx = new InMemoryExecutionContext();
        new FindParseFailures(null, null).visit(Arrays.asList(cu1, cu2, cu3), ctx);

        Map<ParseExceptionAnalysis, List<ParseExceptionAnalysis.Row>> map = ctx.getMessage("org.openrewrite.dataTables");
        assertThat(map).isNotNull();

        List<ParseExceptionAnalysis.Row> rows = map.get(map.keySet().toArray(ParseExceptionAnalysis[]::new)[0]);
        assertThat(rows).hasSize(3);
        assertThat(rows.get(0).getExceptionCount()).isEqualTo(3);
    }

    @Test
    void differentExtensions() {
        assertThat(cuWithErrors).isNotNull();
        JS.CompilationUnit jsx = cuWithErrors.withSourcePath(Path.of(cuWithErrors.getSourcePath().toString().replace(".js", ".jsx")));
        JS.CompilationUnit ts = cuWithErrors.withSourcePath(Path.of(cuWithErrors.getSourcePath().toString().replace(".js", ".ts")));

        ExecutionContext ctx = new InMemoryExecutionContext();
        new FindParseFailures(null, null).visit(Arrays.asList(cuWithErrors, jsx, ts), ctx);

        Map<ParseExceptionAnalysis, List<ParseExceptionAnalysis.Row>> map = ctx.getMessage("org.openrewrite.dataTables");
        assertThat(map).isNotNull();

        List<ParseExceptionAnalysis.Row> rows = map.get(map.keySet().toArray(ParseExceptionAnalysis[]::new)[0]);
        assertThat(rows).hasSize(9);
        rows.forEach(row -> assertThat(row.getExceptionCount()).isEqualTo(1));
    }
}
