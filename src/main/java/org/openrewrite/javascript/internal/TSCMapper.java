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
package org.openrewrite.javascript.internal;

import lombok.Value;
import org.openrewrite.ExecutionContext;
import org.openrewrite.Parser;
import org.openrewrite.SourceFile;
import org.openrewrite.internal.EncodingDetectingInputStream;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.internal.JavaTypeCache;
import org.openrewrite.javascript.JavaScriptParser;
import org.openrewrite.javascript.internal.tsc.TSCRuntime;
import org.openrewrite.style.NamedStyles;
import org.openrewrite.tree.ParseError;
import org.openrewrite.tree.ParsingEventListener;
import org.openrewrite.tree.ParsingExecutionContextView;

import java.nio.charset.Charset;
import java.nio.file.Path;
import java.util.*;

public abstract class TSCMapper implements AutoCloseable {

    @Value
    private static class SourceWrapper {
        Parser.Input input;
        Path sourcePath;
        Charset charset;
        boolean isCharsetBomMarked;
        String sourceText;
    }

    private final TSCRuntime runtime;

    @Nullable
    private final Path relativeTo;

    private final Collection<NamedStyles> styles;

    private final ExecutionContext ctx;
    private final Map<Path, SourceWrapper> sourcesByRelativePath = new LinkedHashMap<>();

    public TSCMapper(@Nullable Path relativeTo, Collection<NamedStyles> styles, ExecutionContext ctx) {
        JavetNativeBridge.init();
        this.runtime = TSCRuntime.init();
        this.relativeTo = relativeTo;
        this.styles = styles;
        this.ctx = ctx;
    }

    public void add(Parser.Input input) {
        EncodingDetectingInputStream is = input.getSource(ctx);
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

    public List<SourceFile> build() {
        List<SourceFile> compilationUnits = new ArrayList<>(sourcesByRelativePath.size());
        ParsingEventListener parsingListener = ParsingExecutionContextView.view(ctx).getParsingListener();
        Map<Path, String> sourceTextsForTSC = new LinkedHashMap<>();
        this.sourcesByRelativePath.forEach((relativePath, sourceText) -> {
            sourceTextsForTSC.put(relativePath, sourceText.sourceText);
        });

        this.runtime.parseSourceTexts(
                sourceTextsForTSC,
                (node, context) -> {
                    SourceWrapper source = this.sourcesByRelativePath.get(context.getRelativeSourcePath());
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
                        ctx.getOnError().accept(t);
                        cu = ParseError.build(JavaScriptParser.builder().build(), source.getInput(), relativeTo, ctx, t);
                    }
                    compilationUnits.add(cu);
                }
        );
        return compilationUnits;
    }

    @Override
    public void close() {
        this.runtime.close();
    }

}
