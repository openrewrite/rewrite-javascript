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

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class BinaryTest extends ParserTest {

    @ParameterizedTest
    @ValueSource(strings = {
      "+",
      "-",
      "*",
      "/",
      "%",
    })
    void arithmeticOps(String arg) {
        rewriteRun(
          javaScript(
            """
              let n = 0 %s 1
              """.formatted(arg)
          )
        );
    }

    @ParameterizedTest
    @ValueSource(strings = {
      "<",
      "<=",
      ">",
      "==",
      "!=",
    })
    void comparisonOps(String arg) {
        rewriteRun(
          javaScript(
            """
              let n = 0 %s 1
              """.formatted(arg)
          )
        );
    }

    @ParameterizedTest
    @ValueSource(strings = {
      "&&",
      "||",
    })
    void logicalOps(String arg) {
        rewriteRun(
          javaScript(
            """
              function foo( left : boolean , right : boolean ) {
                  if ( left %s right ) {
                  }
              }
              """.formatted(arg)
          )
        );
    }

    @ParameterizedTest
    @ValueSource(strings = {
      "&",
      "|",
      "^",
      "<<",
    })
    void bitwiseOps(String arg) {
        rewriteRun(
          javaScript(
            """
              let n = 0 %s 1
              """.formatted(arg)
          )
        );
    }

    @ParameterizedTest
    @ValueSource(strings = {
      ">=",
      ">>",
      ">>>",
    })
    void greaterThanOps(String arg) {
        rewriteRun(
          javaScript(
            """
              let n = 0 %s 1
              """.formatted(arg)
          )
        );
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "===",
            "!==",
    })
    void identityEquals(String arg) {
        rewriteRun(
          javaScript(
            """
              if ( 1 %s 2 ) {
              }
              """.formatted(arg)
          )
        );
    }
}
