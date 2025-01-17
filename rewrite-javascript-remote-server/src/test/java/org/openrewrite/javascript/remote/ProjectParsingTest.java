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

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.openrewrite.Cursor;
import org.openrewrite.InMemoryExecutionContext;
import org.openrewrite.remote.RemotingProjectParser;
import org.openrewrite.scheduling.WatchableExecutionContext;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class ProjectParsingTest {

    private void runTestOnProjectConfigurationFile(Path projectConfigurationFilePath) {
        WatchableExecutionContext ctx = new WatchableExecutionContext(new InMemoryExecutionContext());

        int port = ThreadLocalRandom.current().nextInt(50000, 65535);

        try (JavaScriptRemotingServerEngine server = JavaScriptRemotingServerEngine.create(JavaScriptRemotingServerEngine.Config.builder()
          .extractedPackageJsonDir(Paths.get("./build/tmp"))
          .port(port)
          .logFilePath(Paths.get("./build/test.log").toAbsolutePath().toString())
          .build())) {

            server.start();
            var client = new RemotingProjectParser(server);

            List<Path> projectPaths = client.findAllProjects(projectConfigurationFilePath, ctx).toList();

            System.out.println("\n" + projectPaths.size() + " projects found: ");
            projectPaths.forEach(path -> System.out.println("\t" + path));

            projectPaths.forEach(proj -> {
                System.out.println("\n\nParsing project: " + proj + "\n");
                client.parseProjectSources(proj,
                    projectConfigurationFilePath,
                    proj.getParent(),
                    ctx)
                  .forEach(sf -> {
                      System.out.println("\n\nPrinting source file: " + sf.getSourcePath());
                      System.out.println(sf.print(new Cursor(new Cursor(
                        null,
                        Cursor.ROOT_VALUE), sf)));
                  });
            });
        }
    }

    @Test
    public void testSingleProject() {
        Path projectConfigurationFilePath = Path.of(ClassLoader.getSystemResource("./__mocks__/monorepo/packages/upvote/package.json").getPath());
        runTestOnProjectConfigurationFile(projectConfigurationFilePath);
    }

    @Test
    public void testMonoRepo() {
        Path projectConfigurationFilePath = Path.of(ClassLoader.getSystemResource("./__mocks__/monorepo/package.json").getPath());
        runTestOnProjectConfigurationFile(projectConfigurationFilePath);
    }
//
//    @Test
//    public void testThrowExceptionOnIncorrectDotnetPath() {
//        int port = ThreadLocalRandom.current().nextInt(50000, 65535);
//        try (DotNetRemotingServerEngine server = DotNetRemotingServerEngine.create(DotNetRemotingServerEngine.Config.builder().dotnetExecutable("dotnet1").extractedDotnetBinaryDir(
//          Paths.get(System.getProperty("java.io.tmpdir"))).port(port).build())) {
//            assertThatThrownBy(server::start)
//              .isInstanceOf(IOException.class);
//        }
//    }
//
//    @Test
//    public void testThrowExceptionOnIncorrectRunnable() {
//        int port = ThreadLocalRandom.current().nextInt(50000, 65535);
//        try (DotNetRemotingServerEngine server = DotNetRemotingServerEngine.create(DotNetRemotingServerEngine.Config.builder()
//          .extractedDotnetBinaryDir(Paths.get(System.getProperty("java.io.tmpdir")))
//          .dotnetServerDllName("Rewrite.Server1.dll")
//          .port(port)
//          .build())) {
//            assertThatThrownBy(server::start)
//              .isInstanceOf(IllegalStateException.class);
//        }
//    }
}
