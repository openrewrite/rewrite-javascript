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

@SuppressWarnings("ALL")
class ForLoopTest extends ParserTest {

    @Test
    void forLoop() {
        rewriteRun(
          javascript(
            """
              for ( let i = 0 ; i < 3 ; i++ ) {
              }
              """
          )
        );
    }

    @Test
    void multiDeclarationForLoop() {
        rewriteRun(
          javascript(
            """
              for ( let i = 0 , j = 1 , k = 2 ; i < 10 ; i++ , j *= 2 , k += 2 ) {
              }
              """
          )
        );
    }
    @Test
    void forOfLoop() {
        rewriteRun(
          javascript(
            """
              let arr = [ 10 , 20 , 30 , 40 ] ;
              for ( var val of arr ) {
              }
              """
          )
        );
    }

    @Test
    void forInLoop() {
        rewriteRun(
          javascript(
            """
              let arr = [ 10 , 20 , 30 , 40 ] ;
              for ( var val in arr ) {
              }
              """
          )
        );
    }

    @ExpectedToFail("The const declaration name returns an ObjectBindingPattern.")
    @Test
    void destruct() {
        rewriteRun(
          javascript(
            """
              for ( const { a , b } of [ { a : 1 , b : 2 } , { a : 3 , b : 4 } ] ) {
              }
              """
          )
        );
    }
}
