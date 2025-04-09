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
import org.junitpioneer.jupiter.ExpectedToFail;
import org.openrewrite.test.RewriteTest;

import static org.openrewrite.javascript.Assertions.javaScript;

class ParenthesesTest implements RewriteTest {
    @Test
    void nestedParens() {
        rewriteRun(
                javaScript(
                        """
              var condition = true;
                                                     
              if ( ( ( condition ) ) ) {
                  console.log ( ( exampleFunction (  ) ) )
              }

              function exampleFunction() {
                return ('42');
              }
              """
                )
        );
    }

    @ExpectedToFail
    @Test
    void parensOnType() {
        rewriteRun(
                javaScript(
                        """
              type Point = { x: ( (number) ) , y: number };
              """
                )
        );
    }
}
