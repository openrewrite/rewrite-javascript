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

@SuppressWarnings("JSUnusedLocalSymbols")
class TypeOperatorTest extends ParserTest {

    @ExpectedToFail
    @Test
    void in() {
        rewriteRun(
          javaScript(
            """
              let foo = { bar : 'v1' , buz : 'v2' }
              v = 'bar' in foo
              """
          )
        );
    }

    @ExpectedToFail
    @Test
    void delete() {
        rewriteRun(
          javaScript(
            """
              let foo = { bar : 'v1' , buz : 'v2' }
              delete foo . buz
              """
          )
        );
    }

    @Test
    void typeof() {
        rewriteRun(
          javaScript(
            """
              let s = "hello"
              let t = typeof s
              """
          )
        );
    }

    @Test
    void instanceofOp() {
        rewriteRun(
          javaScript(
            """
              let arr = [ 1, 2 ]
              let t = arr instanceof Array
              """
          )
        );
    }
}
