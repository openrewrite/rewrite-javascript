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
package org.openrewrite.javascript.recipe;

import org.junit.jupiter.api.Test;
import org.openrewrite.java.ShortenFullyQualifiedTypeReferences;
import org.openrewrite.staticanalysis.SimplifyBooleanExpression;
import org.openrewrite.test.RewriteTest;

import static org.openrewrite.javascript.Assertions.javaScript;

@SuppressWarnings({"PointlessBooleanExpressionJS", "JSUnusedLocalSymbols"})
public class RecipeTest implements RewriteTest {

    @Test
    void simplifyBooleanExpression() {
        rewriteRun(
          spec -> spec.recipe(new SimplifyBooleanExpression()),
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
          spec -> spec.recipe(new ShortenFullyQualifiedTypeReferences()),
          javaScript(
            """
              const a = { b: false }
              const c = a.b
              """
          )
        );
    }
}
