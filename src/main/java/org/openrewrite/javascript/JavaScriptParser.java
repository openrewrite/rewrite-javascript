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
import org.openrewrite.ExecutionContext;
import org.openrewrite.InMemoryExecutionContext;
import org.openrewrite.Parser;
import org.openrewrite.internal.lang.NonNull;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.javascript.internal.TSCMapper;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.tree.ParsingExecutionContextView;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class JavaScriptParser implements Parser<JS.CompilationUnit> {
    @Override
    public List<JS.CompilationUnit> parse(@NonNull String... sources) {
        List<Input> inputs = new ArrayList<>(sources.length);
        for (int i = 0; i < sources.length; i++) {
            Path path = Paths.get("f" + i + ".js");
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
    public List<JS.CompilationUnit> parseInputs(Iterable<Input> inputs, @Nullable Path relativeTo, ExecutionContext ogCtx) {
        ParsingExecutionContextView ctx = ParsingExecutionContextView.view(ogCtx);
        List<JS.CompilationUnit> outputs;
        try (TSCMapper mapper = new TSCMapper(relativeTo) {
            @Override
            protected void onParseFailure(Input input, Throwable error) {
                ctx.parseFailure(input, relativeTo, JavaScriptParser.this, error);
                ctx.getOnError().accept(error);
            }
        }) {

            for (Input input : inputs) {
                mapper.add(input, ctx);
            }

            outputs = mapper.build();
        }
        return outputs;
    }

    private final static List<String> EXTENSIONS = Collections.unmodifiableList(Arrays.asList(
            "js", "jsx", "mjs", "cjs",
            "ts", "tsx", "mts", "cts"
    ));

    @Override
    public boolean accept(Path path) {
        final String filename = path.getFileName().toString().toLowerCase();
        for (String ext : EXTENSIONS) {
            if (filename.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public Path sourcePathFromSourceText(Path prefix, String sourceCode) {
        return prefix.resolve("file.js");
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder extends Parser.Builder {
        public Builder() {
            super(JS.CompilationUnit.class);
        }

        public JavaScriptParser build() {
            return new JavaScriptParser();
        }

        @Override
        public String getDslName() {
            return "javascript";
        }
    }

}
