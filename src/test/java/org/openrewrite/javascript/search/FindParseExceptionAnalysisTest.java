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

import org.junit.jupiter.api.Test;
import org.openrewrite.*;
import org.openrewrite.internal.StringUtils;
import org.openrewrite.java.tree.J;
import org.openrewrite.java.tree.Space;
import org.openrewrite.java.tree.Statement;
import org.openrewrite.javascript.JavaScriptVisitor;
import org.openrewrite.javascript.internal.JavaScriptPrinter;
import org.openrewrite.javascript.table.ParseExceptionAnalysis;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.marker.Markers;
import org.openrewrite.scheduling.WatchableExecutionContext;
import org.openrewrite.test.AdHocRecipe;
import org.openrewrite.test.RecipeSpec;
import org.openrewrite.test.RewriteTest;

import java.nio.file.Path;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.openrewrite.javascript.Assertions.javaScript;
import static org.openrewrite.test.RewriteTest.toRecipe;

@SuppressWarnings({"JSDuplicatedDeclaration", "JSUnusedLocalSymbols", "JSUnresolvedVariable", "JSUndeclaredVariable"})
public class FindParseExceptionAnalysisTest implements RewriteTest {

    private final JavaScriptPrinter<Integer> printer = new JavaScriptPrinter<>();

    @Override
    public void defaults(RecipeSpec spec) {
        spec.recipe(addUnknownElements);
    }

    // Mock ParserVisitor#unknownElement to prevent tests from breaking as parsing issues are fixed.
    private final AdHocRecipe addUnknownElements = toRecipe(() -> new JavaScriptVisitor<>() {
        int count = 0;

        @Override
        public J visitStatement(Statement statement, ExecutionContext executionContext) {
            Statement s = (Statement) super.visitStatement(statement, executionContext);
            if (s instanceof J.VariableDeclarations) {
                count++;
                final ParseExceptionResult result = new ParseExceptionResult(
                  UUID.randomUUID(),
                  "javascript", // TODO
                  "UnknownElement", // TODO
                  ParseExceptionAnalysis.getAnalysisMessage("someNodeType" + count),
                  null // TODO
                );
                PrintOutputCapture<Integer> output = new PrintOutputCapture<>(0);
                printer.visit(s, output);
                s = new JS.UnknownElement(
                        Tree.randomId(),
                        s.getPrefix(),
                        Markers.EMPTY,
                        new JS.UnknownElement.Source(
                                Tree.randomId(),
                                Space.EMPTY,
                                Markers.EMPTY,
                                output.getOut().trim()
                        ).withMarkers(Markers.build(Collections.singletonList(result)))
                );
            }
            return s;
        }
    });

    @Test
    void markSpecifiedNodeType() {
        rewriteRun(
          javaScript(
            """
              class Foo {
                  s1 = 1;
                  s2 = 2;
                  s2 = 3;
              }
              """,
            """
              class Foo {
                  s1 = 1;
                  s2 = 2;
                  s2 = 3;
              }
              """,
            spec -> spec.afterRecipe(cu -> {
                ExecutionContext ctx = new InMemoryExecutionContext();
                FindParseExceptionAnalysis recipe = new FindParseExceptionAnalysis(true, "someNodeType1");
                FindParseExceptionAnalysis.Accumulator acc = recipe.getInitialValue(ctx);
                recipe.getScanner(acc).visit(cu, ctx);
                JS.CompilationUnit after = (JS.CompilationUnit) acc.results.get(0);
                PrintOutputCapture<Integer> output = new PrintOutputCapture<>(0);
                printer.visit(after, output);
                assertThat(output.getOut()).isEqualTo(StringUtils.trimIndent(
                  // language=ts
                  """
                  class Foo {
                      /*~~>*/s1 = 1;
                      s2 = 2;
                      s2 = 3;
                  }
                  """));
            })
          )
        );
    }

    @Test
    void markAllNodeTypes() {
        rewriteRun(
          javaScript(
            """
              class Foo {
                  s1 = 1;
                  s2 = 2;
                  s2 = 3;
              }
              """,
            """
              class Foo {
                  s1 = 1;
                  s2 = 2;
                  s2 = 3;
              }
              """,
            spec -> spec.afterRecipe(cu -> {
                ExecutionContext ctx = new InMemoryExecutionContext();
                FindParseExceptionAnalysis recipe = new FindParseExceptionAnalysis(true, null);
                FindParseExceptionAnalysis.Accumulator acc = recipe.getInitialValue(ctx);
                recipe.getScanner(acc).visit(cu, ctx);
                JS.CompilationUnit after = (JS.CompilationUnit) acc.results.get(0);
                PrintOutputCapture<Integer> output = new PrintOutputCapture<>(0);
                printer.visit(after, output);
                assertThat(output.getOut()).isEqualTo(StringUtils.trimIndent(
                    // language=ts
                    """
                    class Foo {
                        /*~~>*/s1 = 1;
                        /*~~>*/s2 = 2;
                        /*~~>*/s2 = 3;
                    }
                    """));
            })
          )
        );
    }

    @Test
    void markFailureWithSearchResult() {
        rewriteRun(
          recipeSpec -> recipeSpec.recipe(new FindParseExceptionAnalysis(true, null)),
          javaScript(
            """
              class Foo {
                  foo() {
                      forceError invalid = true
                  }
              }
              """,
            """
              /*~~>*/class Foo {
                  foo() {
                      forceError invalid = true
                  }
              }
              """
          )
        );
    }

    @Test
    void singleJsSources() {
        rewriteRun(
          javaScript(
            """
              class Foo {
                  s1 = 1;
                  s2 = 2;
                  s2 = 3;
              }
              """,
            """
              class Foo {
                  s1 = 1;
                  s2 = 2;
                  s2 = 3;
              }
              """,
            spec -> spec.afterRecipe(cu -> {
                WatchableExecutionContext ctx = new WatchableExecutionContext(new InMemoryExecutionContext());
                ctx.putCycle(0);
                FindParseExceptionAnalysis recipe = new FindParseExceptionAnalysis(null, null);
                FindParseExceptionAnalysis.Accumulator acc = recipe.getInitialValue(ctx);
                recipe.getScanner(acc).visit(cu, ctx);
                recipe.generate(acc, ctx);

                Map<ParseExceptionAnalysis, List<ParseExceptionAnalysis.Row>> map = ctx.getMessage("org.openrewrite.dataTables");
                assertThat(map).isNotNull();

                List<ParseExceptionAnalysis.Row> rows = map.get(map.keySet().toArray(ParseExceptionAnalysis[]::new)[0]);
                assertThat(rows).hasSize(3);
                assertThat(rows.get(0).getExceptionCount()).isEqualTo(1);
            })
          )
        );
    }

    @Test
    void multipleJsSources() {
        rewriteRun(
          javaScript(
            """
              class Foo {
                  s1 = 1;
                  s2 = 2;
                  s2 = 3;
              }
              """,
            """
              class Foo {
                  s1 = 1;
                  s2 = 2;
                  s2 = 3;
              }
              """,
            spec -> spec.afterRecipe(cu -> {
                WatchableExecutionContext ctx = new WatchableExecutionContext(new InMemoryExecutionContext());
                ctx.putCycle(0);
                FindParseExceptionAnalysis recipe = new FindParseExceptionAnalysis(null, null);
                FindParseExceptionAnalysis.Accumulator acc = recipe.getInitialValue(ctx);

                JS.CompilationUnit cu1 = cu.withId(Tree.randomId());
                recipe.getScanner(acc).visit(cu1, ctx);

                JS.CompilationUnit cu2 = cu.withId(Tree.randomId());
                recipe.getScanner(acc).visit(cu2, ctx);

                JS.CompilationUnit cu3 = cu.withId(Tree.randomId());
                recipe.getScanner(acc).visit(cu3, ctx);

                recipe.generate(acc, ctx);

                Map<ParseExceptionAnalysis, List<ParseExceptionAnalysis.Row>> map = ctx.getMessage("org.openrewrite.dataTables");
                assertThat(map).isNotNull();

                List<ParseExceptionAnalysis.Row> rows = map.get(map.keySet().toArray(ParseExceptionAnalysis[]::new)[0]);
                assertThat(rows).hasSize(3);
                assertThat(rows.get(0).getExceptionCount()).isEqualTo(3);
            })
          )
        );
    }

    @Test
    void differentExtensions() {
        rewriteRun(
          javaScript(
            """
              class Foo {
                  s1 = 1;
                  s2 = 2;
                  s2 = 3;
              }
              """,
            """
              class Foo {
                  s1 = 1;
                  s2 = 2;
                  s2 = 3;
              }
              """,
            spec -> spec.afterRecipe(cu -> {
                WatchableExecutionContext ctx = new WatchableExecutionContext(new InMemoryExecutionContext());
                ctx.putCycle(0);
                FindParseExceptionAnalysis recipe = new FindParseExceptionAnalysis(null, null);
                FindParseExceptionAnalysis.Accumulator acc = recipe.getInitialValue(ctx);

                recipe.getScanner(acc).visit(cu, ctx);

                JS.CompilationUnit jsx = cu.withSourcePath(Path.of(cu.getSourcePath().toString().replace(".js", ".jsx")));
                recipe.getScanner(acc).visit(jsx, ctx);

                JS.CompilationUnit ts = cu.withSourcePath(Path.of(cu.getSourcePath().toString().replace(".js", ".ts")));
                recipe.getScanner(acc).visit(ts, ctx);

                recipe.generate(acc, ctx);

                Map<ParseExceptionAnalysis, List<ParseExceptionAnalysis.Row>> map = ctx.getMessage("org.openrewrite.dataTables");
                assertThat(map).isNotNull();

                List<ParseExceptionAnalysis.Row> rows = map.get(map.keySet().toArray(ParseExceptionAnalysis[]::new)[0]);
                assertThat(rows).hasSize(9);
                rows.forEach(row -> assertThat(row.getExceptionCount()).isEqualTo(1));
            })
          )
        );
    }
}
