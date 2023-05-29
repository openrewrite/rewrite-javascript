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

@SuppressWarnings({"JSUnusedLocalSymbols", "TypeScriptCheckImport", "TypeScriptUnresolvedFunction"})
class LiteralTest extends ParserTest {

    @Test
    void stringLiteral() {
        rewriteRun(
          javaScript(
            """
              let hello = 'World' ;
              """
          )
        );
    }

    @Test
    void numericLiteral() {
        rewriteRun(
          javaScript(
            """
              let n = 0 ;
              """
          )
        );
    }

    @Test
    void intentionallyBadUnicodeCharacter() {
        rewriteRun(
          javaScript(
            """
              let s1 = "\\\\u{U1}"
              let s2 = "\\\\u1234"
              let s3 = "\\\\u{00AUF}"
              """
          )
        );
    }

    @Test
    void unmatchedSurrogatePair() {
        rewriteRun(
          javaScript(
            """
              let c1 = '\uD800'
              let c2 = '\uDfFf'
              """
          )
        );
    }

    @Test
    void unmatchedSurrogatePairInString() {
        rewriteRun(
          javaScript(
            """
              let s1 : String = "\uD800"
              let s2 : String = "\uDfFf"
              """
          )
        );
    }

    @Test
    void stringTemplateSingleSpan() {
        rewriteRun(
          javaScript(
            """
              function foo ( group : string ) {
                  console . log ( `${group}` )
              }
              """
          )
        );
    }

    @Test
    void whitespaceBetween() {
        rewriteRun(
          javaScript(
            """
              function foo ( group : string ) {
                  console . log ( `${ group }` )
              }
              """
          )
        );
    }

    @Test
    void stringTemplateSingleSpanWithHead() {
        rewriteRun(
          javaScript(
            """
              function foo ( group : string ) {
                  console . log ( `group: ${ group }` )
              }
              """
          )
        );
    }

    @Test
    void stringTemplateSingleSpanWithTail() {
        rewriteRun(
          javaScript(
            """
              function foo ( group : string ) {
                  console . log ( `group: ${ group } after` )
              }
              """
          )
        );
    }

    @Test
    void stringTemplateWithMiddleSpan() {
        rewriteRun(
          javaScript(
            """
              function foo ( group : string , version : string ) {
                  console . log ( `group: ${ group } version: ${ version } after` )
              }
              """
          )
        );
    }

    @Test
    void template() {
        rewriteRun(
          javaScript(
            """
              import utils from "../utils.js" ;
              const CRLF = '\\r\\n' ;
              class Foo {
                  constructor ( name , value ) {
                      const { escapeName } = this . constructor ;
                      const isStringValue = utils . isString ( value ) ;
                      let headers = `Content-Disposition: form-data; name=" ${ escapeName (name ) }" ${
                          ! isStringValue && value . name ? `; filename=" ${ escapeName ( value . name ) } "` : ''
                      } ${ CRLF }` ;
                  }
              }
              """
          )
        );
    }
}
