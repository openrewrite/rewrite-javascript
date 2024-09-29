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

import com.fasterxml.jackson.dataformat.cbor.CBORFactory;
import org.junit.jupiter.api.Test;
import org.openrewrite.InMemoryExecutionContext;
import org.openrewrite.Issue;
import org.openrewrite.SourceFile;
import org.openrewrite.remote.ReceiverContext;
import org.openrewrite.remote.RemotingContext;
import org.openrewrite.remote.RemotingMessenger;
import org.openrewrite.remote.java.RemotingClient;
import org.openrewrite.test.RewriteTest;

import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

import static org.openrewrite.javascript.Assertions.javaScript;

class ParserTest implements RewriteTest {

    @Issue("https://github.com/openrewrite/rewrite-javascript/issues/57")
    @Test
    void preservesOrder() {
        rewriteRun(
          javaScript("class A {}", s -> s.path("A.js")),
          javaScript("class B {}", s -> s.path("B.js")),
          javaScript("class C {}", s -> s.path("C.js"))
        );
    }

    @Test
    void project() {
        RemotingContext context = new RemotingContext(RewriteTest.class.getClassLoader(), false);
        Map<String, Supplier<RemotingMessenger.RequestHandler<?>>> handlers = Map.of();
        RemotingClient client = new RemotingClient(() -> {
            try {
                return new Socket(InetAddress.getLoopbackAddress(), 54323);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }, context, new RemotingMessenger((CBORFactory) context.objectMapper().getFactory(), handlers, (m) -> new InMemoryExecutionContext()));

        List<SourceFile> sourceFileStream = client.runUsingSocket((socket, messenger) -> messenger.sendRequest(generator -> {
            generator.writeString("parse-project-sources");
            generator.writeString("/Users/knut/git/emilkowalski/vaul");
        }, parser -> {
            parser.nextToken();
            int count = parser.getIntValue();

            ReceiverContext receiverContext = new ReceiverContext(context.newReceiver(parser), context);
            List<SourceFile> sourceFiles = new ArrayList<>(count);
            for (int i = 0; i < count; i++) {
                SourceFile sourceFile = receiverContext.receiveTree(null);
                System.out.println(sourceFile.getSourcePath());
                sourceFiles.add(sourceFile);
            }
            return sourceFiles.stream();
        }, socket)).toList();
        System.out.println(sourceFileStream);
    }
}
