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

import org.openrewrite.ExecutionContext;
import org.openrewrite.Parser;
import org.openrewrite.internal.EncodingDetectingInputStream;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.java.internal.JavaTypeCache;
import org.openrewrite.javascript.tree.JS;

import java.io.Closeable;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public abstract class TSCMapper implements Closeable {
    private final TSC.Runtime runtime;

    @Nullable
    private final Path relativeTo;

    private final List<JS.CompilationUnit> compilationUnits = new ArrayList<>();

    public TSCMapper(@Nullable Path relativeTo) {
        this.runtime = TSC.Runtime.init();
        this.relativeTo = relativeTo;
    }

    // TODO: add method that parses all inputs.

    // Temporary method to parse files.
    public void add(Parser.Input input, ExecutionContext ctx) {
        EncodingDetectingInputStream is = input.getSource(ctx);
        String inputSourceText = is.readFully();
        this.runtime.parseSourceTexts(
                Collections.singletonMap("example.ts", inputSourceText),
                (node, context) -> {
                    // TODO: sort out type caching
                    TypeScriptParserVisitor fileMapper = new TypeScriptParserVisitor(node, context, input.getPath(), relativeTo, new JavaTypeCache(), is.getCharset().toString(), is.isCharsetBomMarked());
                    this.compilationUnits.add(fileMapper.mapSourceFile());
                }
        );
    }

    protected abstract void onParseFailure(Parser.Input input, Throwable error);

    public List<JS.CompilationUnit> build() {
        return this.compilationUnits;
    }

    @Override
    public void close() {
        this.runtime.close();
    }

}
