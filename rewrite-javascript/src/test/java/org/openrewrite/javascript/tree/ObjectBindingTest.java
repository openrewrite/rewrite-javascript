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
package org.openrewrite.javascript.tree;

import org.junit.jupiter.api.Test;
import org.openrewrite.test.RewriteTest;

import static org.openrewrite.javascript.Assertions.javaScript;

@SuppressWarnings({"JSUnusedLocalSymbols", "LoopStatementThatDoesntLoopJS", "ES6UnusedImports", "TypeScriptCheckImport"})
class ObjectBindingTest implements RewriteTest {

    @Test
    void destructObject() {
        rewriteRun(
          javaScript(
            """
              const c = { fName : 'Foo' , lName : 'Bar' }
              const { fName, lName } = c
              """
          )
        );
    }

    @Test
    void binding() {
        rewriteRun(
          javaScript(
            """
              const { o1 , o2 , o3 } = "" ;
              """
          )
        );
    }

    @Test
    void varArg() {
        rewriteRun(
          javaScript(
            """
              const { o1 , o2 , ... o3 } = "" ;
              """
          )
        );
    }

    @Test
    void propertyNames() {
        rewriteRun(
          javaScript(
            """
              import followRedirects from 'follow-redirects';
              
              const { http : httpFollow , https : httpsFollow } = followRedirects ;
              """
          )
        );
    }

    @Test
    void bindingInitializers() {
        rewriteRun(
          javaScript(
            """
              const formDataToStream = ( form , headersHandler , options ) => {
                  const {
                      tag = 'form-data-boundary' ,
                      size = 25 ,
                      boundary = tag
                  } = options || { } ;
              }
              """
          )
        );
    }
}
