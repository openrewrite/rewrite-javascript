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
package org.openrewrite.javascript.tree;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junitpioneer.jupiter.ExpectedToFail;
import org.junitpioneer.jupiter.Issue;
import org.openrewrite.test.RewriteTest;

import static org.openrewrite.javascript.Assertions.javaScript;

class UnaryTest implements RewriteTest {

    @ParameterizedTest
    @ValueSource(strings = {
      "++ n",
      "-- n",
      "n ++",
      "n --",
    })
    void incrementAndDecrement(String arg) {
        rewriteRun(
          javaScript(
            """
              var n = 1
              %s
              """.formatted(arg)
          )
        );
    }

    @ParameterizedTest
    @ValueSource(strings = {
      "! n",
      "- n",
      "+ n",
    })
    void unaryMinusAndPlus(String arg) {
        rewriteRun(
          javaScript(
            """
              const n1 = 1
              const n2 = %s
              """.formatted(arg)
          )
        );
    }

    @Test
    void keyofKeyword() {
        rewriteRun(
          javaScript(
            """
              type Person = { name: string , age: number };
              type KeysOfPerson = keyof Person;
              """
          )
        );
    }

    @Issue("https://github.com/openrewrite/rewrite-javascript/issues/82")
    @Test
    void spreadOperator() {
        rewriteRun(
          javaScript(
            """
              function concat<T>(arr1: T[], arr2: T[]): T[] {
                return [  ...   arr1 , ...  arr2 ];
              }
              """
          )
        );
    }
}
