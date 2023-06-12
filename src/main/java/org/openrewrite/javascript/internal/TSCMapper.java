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
import org.openrewrite.Parser;
import org.openrewrite.SourceFile;
import org.openrewrite.internal.EncodingDetectingInputStream;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.internal.JavaTypeCache;
import org.openrewrite.javascript.internal.tsc.TSCRuntime;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.tree.ParsingExecutionContextView;

import java.nio.charset.Charset;
import java.nio.file.Path;
import java.util.*;

public class TSCMapper implements AutoCloseable {

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

    private final ParsingExecutionContextView pctx;
    private final Map<Path, SourceWrapper> sourcesByRelativePath = new LinkedHashMap<>();

    public TSCMapper(@Nullable Path relativeTo, ParsingExecutionContextView pctx) {
        JavetNativeBridge.init();
        this.runtime = TSCRuntime.init();
        this.relativeTo = relativeTo;
        this.pctx = pctx;
    }

    public void add(Parser.Input input) {
        final EncodingDetectingInputStream is = input.getSource(pctx);
        final String inputSourceText = is.readFully();
        final Path relativePath = input.getRelativePath(relativeTo);

        final SourceWrapper source = new SourceWrapper(
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

        Map<Path, String> sourceTextsForTSC = new LinkedHashMap<>();
        this.sourcesByRelativePath.forEach((relativePath, sourceText) -> {
            sourceTextsForTSC.put(relativePath, sourceText.sourceText);
        });

        this.runtime.parseSourceTexts(
                sourceTextsForTSC,
                (node, context) -> {
                    final SourceWrapper source = this.sourcesByRelativePath.get(context.getRelativeSourcePath());
                    final TypeScriptParserVisitor fileMapper = new TypeScriptParserVisitor(
                            node,
                            context,
                            source.getSourcePath(),
                            new JavaTypeCache(),
                            source.getCharset().toString(),
                            source.isCharsetBomMarked()
                    );
                    JS.CompilationUnit cu = fileMapper.visitSourceFile();
                    pctx.getParsingListener().parsed(source.getInput(), cu);
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
