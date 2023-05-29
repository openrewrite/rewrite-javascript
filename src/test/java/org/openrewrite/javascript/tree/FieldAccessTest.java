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

@SuppressWarnings({"JSUnresolvedVariable", "JSUnusedLocalSymbols"})
class FieldAccessTest extends ParserTest {

    @Test
    void thisAccess() {
        rewriteRun(
          javaScript(
            """
              class Test {
                  private id : String = "" ;
                  setId ( id : String ) {
                      this . id = id
                  }
              }
              """
          )
        );
    }

    @Test
    void superAccess() {
        rewriteRun(
          javaScript(
            """
              class Super {
                  id : string = "" ;
                  constructor ( theId : string ) {
                      this . id = theId ;
                  }
              }
                            
              class Test extends Super {
                  constructor ( name : string ) {
                      super ( name ) ;
                  }
                            
                  getId ( ) : string {
                      return super . id
                  }
              }
              """
          )
        );
    }

    @Test
    void nullSafeDereference() {
        rewriteRun(
          javaScript(
            """
              class Test {
                  property : number = 42
              }
                            
              const t = new Test ( )
              const p = t ?. property
              """
          )
        );
    }
}
