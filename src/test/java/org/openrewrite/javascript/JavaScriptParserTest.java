/*
 * Copyright 2024 the original author or authors.
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
package org.openrewrite.javascript;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.openrewrite.SourceFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

class JavaScriptParserTest {

    @Test
    @Disabled
    void simple() throws IOException {
	    Path path = Paths.get("./build/rewrite-js-server").toAbsolutePath().normalize();
	    Files.createDirectories(path);
	    JavaScriptParser parser = JavaScriptParser.usingRemotingInstallation(path).build();
        List<SourceFile> list = parser.parse("""
          const a = 1;""").toList();
        System.out.println(list);
    }
}
