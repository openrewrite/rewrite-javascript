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

@SuppressWarnings({"JSUnusedLocalSymbols", "JSUnresolvedVariable"})
class MethodDeclarationTest implements RewriteTest {

    @Test
    void functionDeclaration() {
        rewriteRun(
                javaScript(
                        """
              function foo ( ) { }
              """
                )
        );
    }

    @Test
    void functionParameters() {
        rewriteRun(
                javaScript(
                        """
              function foo ( x : number , y : number ) { }
              """
                )
        );
    }

    @ExpectedToFail
    @Test
    void typeLiteral() {
        rewriteRun(
                javaScript(
                        """
              function foo ( x : { suit : string , card : number } [ ] ) { }
              """
                )
        );
    }

    @Test
    void decorator() {
        rewriteRun(
                javaScript(
                        """
              function enumerable ( value : boolean ) {
                  return function ( target : any ,
                          propertyKey : string ,
                          descriptor : PropertyDescriptor ) {
                      descriptor . enumerable = value ;
                  };
              }
              """
                )
        );
    }

    @Test
    void methodDeclaration() {
        rewriteRun(
                javaScript(
                        """
              class Foo {
                  foo ( ) {
                  }
              }
              """
                )
        );
    }

    @Test
    void arrowDeclaration() {
        rewriteRun(
                javaScript(
                        """
              let sum = ( a : number , b : number ) : number => {
                  return a + b ;
              }
              """
                )
        );
    }

    @Test
    void typeArguments() {
        rewriteRun(
                javaScript(
                        """
              class User {
              }
              
              function foo < T > ( arg : T ) : T {
                  return arg ;
              }
              """
                )
        );
    }
}
