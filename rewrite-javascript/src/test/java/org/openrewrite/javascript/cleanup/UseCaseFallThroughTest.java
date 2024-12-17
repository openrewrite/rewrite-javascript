/*
 * Copyright 2024 the original author or authors.
 * <p>
 * Licensed under the Moderne Source Available License (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * https://docs.moderne.io/licensing/moderne-source-available-license
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.openrewrite.javascript.cleanup;

import org.junit.jupiter.api.Test;
import org.openrewrite.DocumentExample;
import org.openrewrite.Issue;
import org.openrewrite.test.RecipeSpec;
import org.openrewrite.test.RewriteTest;

import static org.openrewrite.javascript.Assertions.javaScript;

@SuppressWarnings({"JSUnusedLocalSymbols", "CommaExpressionJS"})
@Issue("https://github.com/openrewrite/rewrite-javascript/issues/64")
class UseCaseFallThroughTest implements RewriteTest {

    @Override
    public void defaults(RecipeSpec spec) {
        spec.recipe(new UseCaseFallThrough());
    }

    @Test
    void noChange() {
        rewriteRun(
          javaScript(
            """
              function foo(x) {
                  switch (x) {
                      case "a":
                      case "b":
                      case "c":
                          console.log("1");
                          break;
                      case "d":
                          console.log("2");
                          break;
                      default:
                          console.log("default");
                  }
              }
              """
          )
        );
    }

    @Test
    void booleanLiteral() {
        rewriteRun(
          javaScript(
            """
              function method(x: number) {
                  switch (true) {
                      case foo(), bar():
                          console.log("1");
                          break;
                      default:
                          console.log("default");
                  }
              }
              function foo(): boolean {
              }
              function bar(): boolean {
              }
              """
          )
        );
    }

    @Test
    void logicalAndWithOr() {
        rewriteRun(
          javaScript(
            """
              function foo(x) {
                  switch (x) {
                      case "a" && "b" || "c":
                          console.log("1");
                          break;
                      default:
                          console.log("default");
                  }
              }
              """
          )
        );
    }

    @DocumentExample
    @Test
    void logicalOrs() {
        rewriteRun(
          javaScript(
            """
              function foo(x) {
                  switch (x) {
                      case "a" || "b" || "c":
                          console.log("1");
                          break;
                      default:
                          console.log("default");
                  }
              }
              """,
            """
              function foo(x) {
                  switch (x) {
                      case "a":
                      case "b":
                      case "c":
                          console.log("1");
                          break;
                      default:
                          console.log("default");
                  }
              }
              """
          )
        );
    }

    @Test
    void logicalComma() {
        rewriteRun(
          javaScript(
            """
              function foo(x) {
                  switch (x) {
                      case "a" , "b" , "c":
                          console.log("1");
                          break;
                      default:
                          console.log("default");
                  }
              }
              """,
            """
              function foo(x) {
                  switch (x) {
                      case "a":
                      case "b":
                      case "c":
                          console.log("1");
                          break;
                      default:
                          console.log("default");
                  }
              }
              """
          )
        );
    }

    @Test
    void withBraces() {
        rewriteRun(
          javaScript(
            """
              function foo(x) {
                  switch (x) {
                      case "a" , "b" , "c": {
                          console.log("1");
                          break;
                      }
                      default:
                          console.log("default");
                  }
              }
              """,
            """
              function foo(x) {
                  switch (x) {
                      case "a":
                      case "b":
                      case "c": {
                          console.log("1");
                          break;
                      }
                      default:
                          console.log("default");
                  }
              }
              """
          )
        );
    }
}
