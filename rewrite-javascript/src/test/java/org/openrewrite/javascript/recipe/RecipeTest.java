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
package org.openrewrite.javascript.recipe;

import org.junit.jupiter.api.Test;
import org.openrewrite.DocumentExample;
import org.openrewrite.java.ShortenFullyQualifiedTypeReferences;
import org.openrewrite.javascript.JavaScriptParser;
import org.openrewrite.staticanalysis.SimplifyBooleanExpression;
import org.openrewrite.test.RewriteTest;

import java.nio.file.Paths;

import static org.openrewrite.javascript.Assertions.javaScript;

@SuppressWarnings({"PointlessBooleanExpressionJS", "JSUnusedLocalSymbols"})
class RecipeTest implements RewriteTest {

    @DocumentExample
    @Test
    void simplifyBooleanExpression() {
        rewriteRun(
          spec -> spec.recipe(new SimplifyBooleanExpression())
            .parser(JavaScriptParser.usingRemotingInstallation(Paths.get("./build/node-installation-dir"))),
          javaScript(
            """
              const b = !false
              """,
              """
              const b = true
              """
          )
        );
    }

    @Test
    void shortenFullyQualifiedNames() {
        rewriteRun(
          spec -> spec.recipe(new ShortenFullyQualifiedTypeReferences())
            .parser(JavaScriptParser.usingRemotingInstallation(Paths.get("./build/node-installation-dir"))),
          javaScript(
            """
              const a = { b: false }
              const c = a.b
              """
          )
        );
    }
}
