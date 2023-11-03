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

import org.intellij.lang.annotations.Language;
import org.junit.jupiter.api.Test;
import org.junitpioneer.jupiter.ExpectedToFail;
import org.openrewrite.internal.StringUtils;
import org.openrewrite.test.RewriteTest;

class ParserPerfTest implements RewriteTest {

    // from https://github.com/apache/camel/blob/main/components/camel-cometd/src/test/resources/webapp/dojo/org/cometd.js
    @Language("typescript")
    private static final String cometd = StringUtils.readFully(ParserPerfTest.class.getResourceAsStream("/perf/cometd.js"));

    @ExpectedToFail("Requires issue https://github.com/openrewrite/rewrite-javascript/issues/4 to pass parsing.")
    @Test
    void tryParseCometd() {
        rewriteRun(ParserTest.javaScript(cometd));
    }
}
