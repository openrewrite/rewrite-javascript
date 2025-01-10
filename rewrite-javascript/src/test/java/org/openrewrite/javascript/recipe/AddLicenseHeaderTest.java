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

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.openrewrite.javascript.AddLicenseHeader;
import org.openrewrite.javascript.JavaScriptParser;
import org.openrewrite.test.RecipeSpec;
import org.openrewrite.test.RewriteTest;

import java.nio.file.Paths;

import static java.util.Calendar.YEAR;
import static java.util.Calendar.getInstance;
import static org.openrewrite.javascript.Assertions.javaScript;

class AddLicenseHeaderTest implements RewriteTest {

    @Override
    public void defaults(RecipeSpec spec) {
        spec.recipe(new AddLicenseHeader(
          """
            Copyright ${CURRENT_YEAR} the original author or authors.
            <p>
            Licensed under the Apache License, Version 2.0 (the "License");
            you may not use this file except in compliance with the License.
            You may obtain a copy of the License at
            """.trim()
        )).parser(JavaScriptParser.usingRemotingInstallation(Paths.get("./build/node-installation-dir")));
    }

    @Test
    void addLicenseHeader() {
        rewriteRun(
          javaScript(
            """
              class Foo {
              }
              """,
            """
              /*
               * Copyright %s the original author or authors.
               * <p>
               * Licensed under the Apache License, Version 2.0 (the "License");
               * you may not use this file except in compliance with the License.
               * You may obtain a copy of the License at
               */
              class Foo {
              }
              """.formatted(getInstance().get(YEAR))
          )
        );
    }

    @Disabled
    @Test
    void dontChangeExistingHeader() {
        rewriteRun(
          javaScript(
            """
              /*
               * My license header
               */
              class Test {
              }
              """
          )
        );
    }
}
