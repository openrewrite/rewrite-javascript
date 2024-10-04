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
package org.openrewrite.javascript;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.openrewrite.*;
import org.openrewrite.internal.EncodingDetectingInputStream;
import org.openrewrite.java.internal.JavaTypeCache;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.remote.ReceiverContext;
import org.openrewrite.remote.RemotingContext;
import org.openrewrite.remote.RemotingExecutionContextView;
import org.openrewrite.remote.java.RemotingClient;
import org.openrewrite.style.NamedStyles;
import org.openrewrite.text.PlainTextParser;
import org.openrewrite.tree.ParseError;
import org.openrewrite.tree.ParsingEventListener;
import org.openrewrite.tree.ParsingExecutionContextView;

import java.io.*;
import java.net.InetAddress;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Objects.requireNonNull;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class JavaScriptParser implements Parser {

    private final Collection<NamedStyles> styles;
    private final boolean logCompilationWarningsAndErrors;
    private final JavaTypeCache typeCache;
    private final List<Path> nodePath;
    private final Path installationDir;

    private @Nullable Process nodeProcess;
    private @Nullable RemotingContext remotingContext;
    private @Nullable RemotingClient client;

    @Override
    public Stream<SourceFile> parse(String... sources) {
        List<Input> inputs = new ArrayList<>(sources.length);
        for (int i = 0; i < sources.length; i++) {
            Path path = Paths.get("p" + i + ".ts");
            int j = i;
            inputs.add(new Input(
                    path, null,
                    () -> new ByteArrayInputStream(sources[j].getBytes(StandardCharsets.UTF_8)),
                    true
            ));
        }

        return parseInputs(
                inputs,
                null,
                new InMemoryExecutionContext()
        );
    }

    @Override
    public Stream<SourceFile> parseInputs(Iterable<Input> inputs, @Nullable Path relativeTo, ExecutionContext ctx) {
        if (!ensureServerRunning(ctx)) {
            return PlainTextParser.builder().build().parseInputs(inputs, relativeTo, ctx);
        }

        ParsingExecutionContextView pctx = ParsingExecutionContextView.view(ctx);
        ParsingEventListener parsingListener = pctx.getParsingListener();

        return acceptedInputs(inputs).map(input -> {
            Path path = input.getRelativePath(relativeTo);
            parsingListener.startedParsing(input);

            try (EncodingDetectingInputStream is = input.getSource(ctx)) {
                SourceFile parsed = client.runUsingSocket((socket, messenger) -> requireNonNull(messenger.sendRequest(generator -> {
                            if (input.isSynthetic() || !Files.isRegularFile(input.getPath())) {
                                generator.writeString("parse-javascript-source");
                                generator.writeString(is.readFully());
                            } else {
                                generator.writeString("parse-javascript-file");
                                generator.writeString(input.getPath().toString());
                                generator.writeString(relativeTo.toString());
                            }
                        }, parser -> {
                            Tree tree = new ReceiverContext(remotingContext.newReceiver(parser), remotingContext).receiveTree(null);
                            return (SourceFile) tree;
                        }, socket)))
                        .withSourcePath(path)
                        .withFileAttributes(FileAttributes.fromPath(input.getPath()))
                        .withCharset(getCharset(ctx));

                if (parsed instanceof ParseError) {
                    ctx.getOnError().accept(new AssertionError(parsed));
                    return parsed;
                }

                JS.CompilationUnit py = (JS.CompilationUnit) parsed;
                parsingListener.parsed(input, py);
                return requirePrintEqualsInput(py, input, relativeTo, ctx);
            } catch (Throwable t) {
                ctx.getOnError().accept(t);
                return ParseError.build(this, input, relativeTo, ctx, t);
            }
        });
    }

    private final static List<String> EXTENSIONS = Collections.unmodifiableList(Arrays.asList(
            ".js", ".jsx", ".mjs", ".cjs",
            ".ts", ".tsx", ".mts", ".cts"
    ));

    // Exclude Yarn's Plug'n'Play loader files (https://yarnpkg.com/features/pnp)
    private final static List<String> EXCLUSIONS = Collections.unmodifiableList(Arrays.asList(
            ".pnp.cjs", ".pnp.loader.mjs"
    ));

    @Override
    public boolean accept(Path path) {
        if (path.toString().contains("/dist/")) {
            // FIXME this is a workaround to not having tsconfig info
            return false;
        }

        final String filename = path.getFileName().toString().toLowerCase();
        for (String ext : EXTENSIONS) {
            if (filename.endsWith(ext) && !EXCLUSIONS.contains(filename)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public Path sourcePathFromSourceText(Path prefix, String sourceCode) {
        return prefix.resolve("file.ts");
    }

    @Override
    public JavaScriptParser reset() {
        typeCache.clear();
        if (remotingContext != null) {
            remotingContext.reset();
            remotingContext = null;
        }
        if (nodeProcess != null) {
            nodeProcess.destroy();
            nodeProcess = null;
        }
        client = null;
        return this;
    }

    public static Builder usingRemotingInstallation(Path dir) {
        try {
            return verifyRemotingInstallation(dir);
        } catch (InterruptedException | IOException var2) {
            return builder();
        }
    }

    private static Builder verifyRemotingInstallation(Path dir) throws IOException, InterruptedException {
        if (!Files.isDirectory(dir, new LinkOption[0])) {
            Files.createDirectories(dir);
        }

        exportResource("META-INF/package.json", dir.toFile());

        List<String> command = new ArrayList(Arrays.asList("npm", "install"));
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        Process process = processBuilder.directory(dir.toFile()).start();
        int exitCode = process.waitFor();

        return new Builder().installationDir(dir);
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder extends Parser.Builder {
        private JavaTypeCache typeCache = new JavaTypeCache();
        private boolean logCompilationWarningsAndErrors;
        private final Collection<NamedStyles> styles = new ArrayList<>();
        private List<Path> nodePath = new ArrayList<>();
        private Path installationDir;

        public Builder() {
            super(JS.CompilationUnit.class);
        }

        public Builder logCompilationWarningsAndErrors(boolean logCompilationWarningsAndErrors) {
            this.logCompilationWarningsAndErrors = logCompilationWarningsAndErrors;
            return this;
        }

        public Builder typeCache(JavaTypeCache typeCache) {
            this.typeCache = typeCache;
            return this;
        }

        public Builder styles(Iterable<? extends NamedStyles> styles) {
            for (NamedStyles style : styles) {
                this.styles.add(style);
            }
            return this;
        }

        public Builder nodePath(List<Path> path) {
            this.nodePath = new ArrayList<>(path);
            return this;
        }

        public Builder installationDir(Path installationDir) {
            this.installationDir = installationDir;
            return this;
        }

        @Override
        public JavaScriptParser build() {
            return new JavaScriptParser(styles, logCompilationWarningsAndErrors,
                    typeCache, nodePath, installationDir);
        }

        @Override
        public String getDslName() {
            return "javascript";
        }
    }

    private static void exportResource(String resourceName, File outputDir) throws IOException {
        try (InputStream stream = JavaScriptParser.class.getClassLoader().getResourceAsStream(resourceName)) {
            if(stream == null) {
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

    private boolean ensureServerRunning(ExecutionContext ctx) {
        if (client == null || !isAlive()) {
            try {
                initializeRemoting(ctx);
            } catch (IOException e) {
                return false;
            }
        } else {
            requireNonNull(remotingContext).reset();
        }
        return client != null && isAlive();
    }

    private boolean isAlive() {
        try {
            return requireNonNull(client).runUsingSocket((socket, messenger) -> {
                messenger.sendReset(socket);
                return true;
            });
        } catch (Exception e) {
            return false;
        }
    }

    private void initializeRemoting(ExecutionContext ctx) throws IOException {
        RemotingExecutionContextView view = RemotingExecutionContextView.view(ctx);
        remotingContext = view.getRemotingContext();
        if (remotingContext == null) {
            remotingContext = new RemotingContext(JavaScriptParser.class.getClassLoader(), false);
            view.setRemotingContext(remotingContext);
        } else {
            remotingContext.reset();
        }

        int port = 54323;
        if (!isServerRunning(port)) {
            ProcessBuilder processBuilder = new ProcessBuilder("node",
                    "node_modules/@openrewrite/rewrite-remote/dist/server.js",
                    Integer.toString(port));
            if (!nodePath.isEmpty()) {
                Map<String, String> environment = processBuilder.environment();
                environment.compute("NODE_PATH", (k, current) ->
                        (current != null ? current + File.pathSeparator : "") + nodePath.stream().map(Path::toString).collect(Collectors.joining(File.pathSeparator)));
            }

            processBuilder.directory(installationDir.toFile());

            if (System.getProperty("os.name").startsWith("Windows")) {
                processBuilder.redirectOutput(new File("NUL"));
                processBuilder.redirectError(new File("NUL"));
            } else {
                processBuilder.redirectOutput(new File("/dev/null"));
                processBuilder.redirectError(new File("/dev/null"));
            }
            nodeProcess = processBuilder.start();
            for (int i = 0; i < 5 && nodeProcess.isAlive(); i++) {
                if (isServerRunning(port)) {
                    break;
                }
                try {
                    Thread.sleep(50);
                } catch (InterruptedException ignore) {
                }
            }

            if (nodeProcess == null || !nodeProcess.isAlive()) {
                remotingContext = null;
                return;
            }
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                if (nodeProcess != null && nodeProcess.isAlive()) {
                    nodeProcess.destroy();
                }
            }));
        }

        client = RemotingClient.create(ctx, JavaScriptParser.class, () -> {
            try {
                return new Socket(InetAddress.getLoopbackAddress(), port);
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        });
    }

    public static boolean isServerRunning(int port) {
        try (Socket ignored = new Socket(InetAddress.getLoopbackAddress(), port)) {
            return true;
        } catch (IOException e) {
            return false;
        }
    }

}
