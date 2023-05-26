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

@SuppressWarnings({"JSFileReferences", "JSUnusedLocalSymbols", "TypeScriptCheckImport", "TypeScriptUnresolvedVariable"})
public class ExportTest extends ParserTest {

    @Test
    void exportDeclaration() {
        rewriteRun(
          javaScript(
            """
              class ZipCodeValidator {
                isAcceptable ( s : string ) {
                  return s . length === 5 ;
                }
              }
              export { ZipCodeValidator } ;
              """
          )
        );
    }

    @Test
    void fromClass() {
        rewriteRun(
          javaScript(
            """
              export * from "./f0.ts" ;
              """
          )
        );
    }

    @Test
    void multiExport() {
        rewriteRun(
          javaScript(
            """
              export {
                  first,
                  second,
                  third
              }
              """
          )
        );
    }

    @Test
    void alias() {
        rewriteRun(
          javaScript(
            """
              export {
                  name as default
              }
              """
          )
        );
    }

    @Test
    void exportProperty() {
        rewriteRun(
          javaScript(
            """
              export const numberRegexp = /^[0-9]+$/ ;
              """
          )
        );
    }

    @ExpectedToFail
    @Test
    void exportInterface() {
        rewriteRun(
          javaScript(
            """
              export interface Foo {
                  ( value : any , defaultEncoder : ( value : any ) => any ) : any ;
              }
              """
          )
        );
    }

    @Test
    void exportInterfaceParameterizedAssignment() {
        rewriteRun(
          javaScript(
            """
              export interface Foo < D = any > {
                  url ? : string ;
                  method ? : Method | string ;
                  baseURL ? : string ;
              }
              """
          )
        );
    }

    @Test
    void exportInterfaceAndExtends() {
        rewriteRun(
          javaScript(
            """
              export interface Foo extends Bar {
                  encode ? : Baz ;
                  serialize ? : Buz ;
              }
              """
          )
        );
    }

    @Test
    void exportFunction() {
        rewriteRun(
          javaScript(
            """
              export default function methodName() {
              }
              """
          )
        );
    }
}
