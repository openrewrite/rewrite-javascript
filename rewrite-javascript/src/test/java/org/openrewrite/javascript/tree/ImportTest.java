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

@SuppressWarnings({"ES6UnusedImports", "TypeScriptCheckImport"})
class ImportTest implements RewriteTest {

    @Test
    void importStatement() {
        rewriteRun(
          javaScript(
            """
              import num from "./file"
              """
          )
        );
    }

    @Test
    void importAssignment() {
        rewriteRun(
          javaScript(
            """
              import axios = require ( 'foo' ) ;
              """
          )
        );
    }

    @Test
    void importObjectLiteral() {
        rewriteRun(
          javaScript(
            """
              import { First , Second , Third } from 'target';
              """
          )
        );
    }

    @Test
    void mixedTypes() {
        rewriteRun(
          javaScript(
            """
              import nameA , { First , Second } from 'targetA';
              """
          )
        );
    }

    @Test
    void multiAlias() {
        rewriteRun(
          javaScript(
            """
              import { FormData as FormDataPolyfill , Blob as BlobPolyfill , File as FilePolyfill } from 'formdata-node'
              """
          )
        );
    }
}
