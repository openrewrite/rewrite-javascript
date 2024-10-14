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
import org.openrewrite.test.RewriteTest;

import static org.openrewrite.javascript.Assertions.javaScript;

@SuppressWarnings({"JSUnusedLocalSymbols", "LoopStatementThatDoesntLoopJS"})
class BreakTest implements RewriteTest {

    @Test
    void breakFromWhileLoop() {
        rewriteRun(
          javaScript(
            """
              function method ( ) {
                  while ( true ) break
              }
              """
          )
        );
    }

    @Test
    void labeled() {
        rewriteRun(
          javaScript(
            """
              function test ( ) {
                  outer : for ( var i = 0 ; i < 3 ; i++ ) {
                      for ( var j = 0 ; j < 3 ; j++ ) {
                          if ( j === i ) {
                              break outer ;
                          }
                      }
                  }
              }
              """
          )
        );
    }
}
