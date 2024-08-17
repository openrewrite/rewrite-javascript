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

import lombok.Value;
import org.jspecify.annotations.Nullable;
import org.openrewrite.ExecutionContext;
import org.openrewrite.InMemoryExecutionContext;
import org.openrewrite.Parser;
import org.openrewrite.SourceFile;
import org.openrewrite.internal.EncodingDetectingInputStream;
import org.openrewrite.java.internal.JavaTypeCache;
import org.openrewrite.javascript.internal.JavetNativeBridge;
import org.openrewrite.javascript.internal.TypeScriptParserVisitor;
import org.openrewrite.javascript.internal.tsc.TSCRuntime;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.style.NamedStyles;
import org.openrewrite.tree.ParseError;
import org.openrewrite.tree.ParsingEventListener;
import org.openrewrite.tree.ParsingExecutionContextView;

import java.io.ByteArrayInputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Stream;

public class JavaScriptParser implements Parser {

    @Nullable
    private static TSCRuntime RUNTIME;

    private static TSCRuntime runtime() {
        if (RUNTIME == null) {
            JavetNativeBridge.init();
            RUNTIME = TSCRuntime.init();
            Runtime.getRuntime().addShutdownHook(new Thread(() -> RUNTIME.close()));
        }
        return RUNTIME;
    }

    @Value
    private static class SourceWrapper {
        Parser.Input input;
        Path sourcePath;
        Charset charset;
        boolean isCharsetBomMarked;
        String sourceText;
    }

    private final Collection<NamedStyles> styles;

    private JavaScriptParser(Collection<NamedStyles> styles) {
        this.styles = styles;
    }

    @Override
    public Stream<SourceFile> parse(String... sources) {
        List<Input> inputs = new ArrayList<>(sources.length);
        for (int i = 0; i < sources.length; i++) {
            Path path = Paths.get("f" + i + ".ts");
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
    public Stream<SourceFile> parseInputs(Iterable<Input> sources, @Nullable Path relativeTo, ExecutionContext ctx) {
        ParsingExecutionContextView pctx = ParsingExecutionContextView.view(ctx);
        Map<Path, SourceWrapper> sourcesByRelativePath = new LinkedHashMap<>();

        for (Input input : sources) {
            EncodingDetectingInputStream is = input.getSource(pctx);
            String inputSourceText = is.readFully();
            Path relativePath = input.getRelativePath(relativeTo);

            SourceWrapper source = new SourceWrapper(
                    input,
                    relativePath,
                    is.getCharset(),
                    is.isCharsetBomMarked(),
                    inputSourceText
            );
            sourcesByRelativePath.put(relativePath, source);
        }

        List<SourceFile> compilationUnits = new ArrayList<>(sourcesByRelativePath.size());
        ParsingEventListener parsingListener = ParsingExecutionContextView.view(pctx).getParsingListener();
        Map<Path, String> sourceTextsForTSC = new LinkedHashMap<>();
        sourcesByRelativePath.forEach((relativePath, sourceText) ->
            sourceTextsForTSC.put(relativePath, sourceText.sourceText));

        try {
            //noinspection resource
            runtime().parseSourceTexts(
                    sourceTextsForTSC,
                    (node, context) -> {
                        SourceWrapper source = sourcesByRelativePath.get(context.getRelativeSourcePath());

                        parsingListener.startedParsing(source.getInput());
                        TypeScriptParserVisitor fileMapper = new TypeScriptParserVisitor(
                                node,
                                context,
                                source.getSourcePath(),
                                new JavaTypeCache(),
                                source.getCharset().toString(),
                                source.isCharsetBomMarked(),
                                styles
                        );
                        SourceFile cu;
                        try {
                            cu = fileMapper.visitSourceFile();
                            parsingListener.parsed(source.getInput(), cu);
                        } catch (Throwable t) {
                            ((ExecutionContext) pctx).getOnError().accept(t);
                            cu = ParseError.build(JavaScriptParser.builder().build(), source.getInput(), relativeTo, pctx, t);
                        }

                        compilationUnits.add(cu);
                    }
            );
        } catch (Exception e) {
            return acceptedInputs(sources).map(input -> ParseError.build(this, input, relativeTo, ctx, e));
        }
        return compilationUnits.stream();
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

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder extends Parser.Builder {
        // FIXME add logCompilationWarningsAndErrors.
        Collection<NamedStyles> styles = new ArrayList<>();

        public Builder() {
            super(JS.CompilationUnit.class);
        }

        public Builder styles(Iterable<? extends NamedStyles> styles) {
            for (NamedStyles style : styles) {
                this.styles.add(style);
            }
            return this;
        }

        @Override
        public JavaScriptParser build() {
            return new JavaScriptParser(styles);
        }

        @Override
        public String getDslName() {
            return "javascript";
        }
    }

}
