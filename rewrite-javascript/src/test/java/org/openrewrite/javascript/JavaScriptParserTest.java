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
import org.openrewrite.InMemoryExecutionContext;
import org.openrewrite.SourceFile;
import org.openrewrite.remote.RemotingContext;
import org.openrewrite.remote.java.RemotingClient;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.InetAddress;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import static java.util.Objects.requireNonNull;

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

    @Test
    @Disabled
    void parseString() {
        JavaScriptParser parser = JavaScriptParser.builder().build();
        List<SourceFile> sourceFiles = parser.parse("""
          const a = 1;
          """).toList();
        RemotingClient client = RemotingClient.create(new InMemoryExecutionContext(), JavaScriptParserTest.class, () -> {
            try {
                return new Socket(InetAddress.getLoopbackAddress(), 54323);
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        });
        RemotingContext context = client.getContext();
        Integer recipeId = client.withNewSocket((socket, messenger) ->
          messenger.sendRequest(generator -> {
              generator.writeString("load-recipe");
              generator.writeString("org.openrewrite.javascript.format.Spaces");
              generator.writeObject(Map.of());
          }, p -> p.nextIntValue(0), socket)
        );
        SourceFile updated = client.withNewSocket((socket, messenger) ->
          requireNonNull(messenger.sendRequest(generator -> {
              generator.writeString("run-recipe-visitor");
              generator.writeNumber(recipeId);
              context.newSenderContext(generator).sendTree(sourceFiles.get(0), (SourceFile) null);
          }, p -> context.newReceiverContext(p).receiveTree(sourceFiles.get(0)), socket))
        );
        System.out.println("BEFORE: " + sourceFiles.get(0).printAll());
        System.out.println("AFTER:  " + updated.printAll());
    }
}
