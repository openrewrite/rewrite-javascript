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

package org.openrewrite.javascript.remote;

import org.junit.jupiter.api.Test;
import org.openrewrite.Cursor;
import org.openrewrite.InMemoryExecutionContext;
import org.openrewrite.Parser;
import org.openrewrite.remote.RemotingInputParser;
import org.openrewrite.scheduling.WatchableExecutionContext;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.concurrent.ThreadLocalRandom;

public class InputParsingTest {

    @Test
    public void testSingleProject() {
        WatchableExecutionContext ctx = new WatchableExecutionContext(new InMemoryExecutionContext());

        int port = ThreadLocalRandom.current().nextInt(50000, 65535);

        try (JavaScriptRemotingServerEngine server = JavaScriptRemotingServerEngine.create(JavaScriptRemotingServerEngine.Config.builder()
                .extractedPackageJsonDir(Paths.get("./build/tmp"))
                .port(port)
                .logFilePath(Paths.get("./build/test.log").toAbsolutePath().toString())
                .build())) {

            server.start();
            var client = new RemotingInputParser(server, FileFilter.INSTANCE);
            client.parseInputs(
                    Arrays.asList(
                            Parser.Input.fromFile(Path.of(ClassLoader.getSystemResource("./__mocks__/monorepo/scripts/script.ts").getPath())),
                            Parser.Input.fromFile(Path.of(ClassLoader.getSystemResource("./__mocks__/monorepo/packages/too-good/too-good.js").getPath()))
                    ),
                    Path.of(ClassLoader.getSystemResource("./__mocks__/monorepo").getPath()),
                    ctx
            ).forEach(sf -> {
                System.out.println("\n\nPrinting source file: " + sf.getSourcePath());
                System.out.println(sf.print(new Cursor(new Cursor(
                        null,
                        Cursor.ROOT_VALUE), sf)));
            });
        }
    }
}
