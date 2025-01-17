/*
 * Copyright 2025 the original author or authors.
 * <p>
 * Licensed under the Moderne Source Available License (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * https://docs.moderne.io/licensing/moderne-source-available-license
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


package org.openrewrite.javascript.remote;

import lombok.Builder;
import lombok.SneakyThrows;
import lombok.extern.java.Log;
import org.jspecify.annotations.Nullable;
import org.openrewrite.remote.AbstractRemotingServerEngine;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Log
public class JavaScriptRemotingServerEngine extends AbstractRemotingServerEngine {

    public static final String REWRITE_SERVER_JS_NAME = "node_modules/@openrewrite/rewrite-remote/dist/server.js";
    public static final int DEFAULT_DEBUG_PORT = 54323;

    Config config;

    public static JavaScriptRemotingServerEngine create(Path extractedPackageJsonDir) {
        return create(Config.builder().extractedPackageJsonDir(extractedPackageJsonDir).build());
    }

    @SneakyThrows
    public static JavaScriptRemotingServerEngine create(Config config) {
        installExecutable(config.npmPackageJsonResource, config.extractedPackageJsonDir.toFile());
        // FIXME rather than using hardcoded port, read it after starting up server
        return new JavaScriptRemotingServerEngine(config);
    }

    private JavaScriptRemotingServerEngine(Config config) {
        super(new InetSocketAddress(InetAddress.getLoopbackAddress(), config.port), Duration.ofMillis(config.timeoutInMilliseconds));
        this.config = config;
    }

    @Override
    protected ProcessBuilder configureProcess(ProcessBuilder processBuilder) {

        List<String> command = new ArrayList<>();
        command.add(config.nodeExecutable);
        command.add(config.jsServerFileName);
        command.add(String.valueOf(config.port));

        return processBuilder.command(command).directory(config.extractedPackageJsonDir.toFile());
    }

    private static void installExecutable(String npmPackageJsonResourceName, File installationDir) throws IOException, InterruptedException {
        if (!Files.isDirectory(installationDir.toPath())) {
            installationDir.mkdirs();
        }

        exportResource(npmPackageJsonResourceName, installationDir);

        List<String> command = new ArrayList(Arrays.asList("npm", "update", "--force"));
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        Process process = processBuilder.directory(installationDir).start();
        int exitCode = process.waitFor();
    }

    private static void exportResource(String resourceName, File outputDir) throws IOException {
        try (InputStream stream = JavaScriptRemotingServerEngine.class.getClassLoader().getResourceAsStream(resourceName)) {
            if (stream == null) {
                throw new IllegalArgumentException("Cannot get resource \"" + resourceName + "\" from Jar " +
                        "file.");
            }

            int readBytes;
            byte[] buffer = new byte[4096];
            try (
                    OutputStream resStreamOut =
                            Files.newOutputStream(Paths.get(outputDir.getPath(),
                                    Paths.get(resourceName).getFileName().toString()))) {

                while ((readBytes = stream.read(buffer)) > 0) {
                    resStreamOut.write(buffer, 0, readBytes);
                }
                resStreamOut.flush();
            }
        }
    }

    @Override
    public String getLanguageName() {
        return "JavaScript";
    }

    @Builder
    public static class Config {
        @Builder.Default()
        int port = DEFAULT_DEBUG_PORT;

        @Builder.Default()
        int timeoutInMilliseconds = (int) Duration.ofHours(1).toMillis();

        @Nullable
        @Builder.Default()
        String logFilePath = null;

        @Nullable
        @Builder.Default()
        String nodePackagesFolder = null;

        @Builder.Default()
        String nodeExecutable = "node";

        @Builder.Default()
        String npmPackageJsonResource = "node-server/package.json";

        Path extractedPackageJsonDir;

        @Builder.Default()
        String jsServerFileName = REWRITE_SERVER_JS_NAME;
    }
}
