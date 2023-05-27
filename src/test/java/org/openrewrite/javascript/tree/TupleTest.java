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

@SuppressWarnings({"JSUnresolvedVariable", "JSUnusedLocalSymbols"})
class TupleTest extends ParserTest {

    @ExpectedToFail
    @Test
    void emptyTuple() {
        rewriteRun(
          javaScript(
            """
              let tuple : [ ]
              """
          )
        );
    }

    @ExpectedToFail
    @Test
    void tuple() {
        rewriteRun(
          javaScript(
            """
              let tuple : [ number , boolean , ] = [ 1 , true ]
              """
          )
        );
    }

    @ExpectedToFail
    @Test
    void typed() {
        rewriteRun(
          javaScript(
            """
              let input : [ x : number , y : number ] = [ 1 , 2 ]
              """
          )
        );
    }
}
