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

@SuppressWarnings({"TypeScriptCheckImport", "JSUnusedLocalSymbols"})
class ArrowFunctionTest implements RewriteTest {

    @Test
    void asMethodParameter() {
        rewriteRun(
                javaScript(
                        """
              import foo from './index.js';
              const bar = foo.map(protocol => {
                return protocol + ':';
              });
              """
                )
        );
    }

    @Test
    void asVariableInitializer() {
        rewriteRun(
                javaScript(
                        """
              let sum = ( a , b ) => {
                  return a + b ;
              };
              """
                )
        );
    }

    @Test
    void varArg() {
        rewriteRun(
                javaScript(
                        """
              let sum = ( a , ... b ) => {
                  return a ;
              } ;
              """
                )
        );
    }

    @Test
    void modifier() {
        rewriteRun(
                javaScript(
                        """
              const c = async ( ) => {
              }
              """
                )
        );
    }
}
