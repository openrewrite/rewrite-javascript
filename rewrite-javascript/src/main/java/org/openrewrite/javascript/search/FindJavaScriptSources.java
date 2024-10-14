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
package org.openrewrite.javascript.search;

import lombok.EqualsAndHashCode;
import lombok.Value;
import org.jspecify.annotations.Nullable;
import org.openrewrite.*;
import org.openrewrite.javascript.table.JavaScriptSourceFile;
import org.openrewrite.marker.SearchResult;
import org.openrewrite.quark.Quark;
import org.openrewrite.text.PlainText;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Value
@EqualsAndHashCode(callSuper = false)
public class FindJavaScriptSources extends Recipe {
    transient JavaScriptSourceFile javaScriptSourceFile = new JavaScriptSourceFile(this);

    @Override
    public String getDisplayName() {
        return "Find JavaScript sources and collect data metrics";
    }

    @Override
    public String getDescription() {
        return "Use data table to collect source files types and counts of files with extensions `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`.";
    }

    @Override
    public TreeVisitor<?, ExecutionContext> getVisitor() {
        return new TreeVisitor<Tree, ExecutionContext>() {
            final Set<String> jsExtensions = new HashSet<>(Arrays.asList(".js", ".jsx", ".mjs", ".cjs"));
            final Set<String> tsExtensions = new HashSet<>(Arrays.asList(".ts", ".tsx", ".mts", ".cts"));

            @Override
            public @Nullable Tree visit(@Nullable Tree tree, ExecutionContext ctx) {
                if (!(tree instanceof SourceFile)) {
                    return tree;
                }
                SourceFile s = (SourceFile) tree;
                String extension = s.getSourcePath().toString().substring(s.getSourcePath().toString().lastIndexOf("."));
                if (jsExtensions.contains(extension) || tsExtensions.contains(extension)) {
                    JavaScriptSourceFile.SourceFileType sourceFileType = null;
                    if (s instanceof Quark) {
                        sourceFileType = JavaScriptSourceFile.SourceFileType.Quark;
                    } else if (s instanceof PlainText) {
                        sourceFileType = JavaScriptSourceFile.SourceFileType.PlainText;
                    } else if (jsExtensions.contains(extension)) {
                        sourceFileType = JavaScriptSourceFile.SourceFileType.JavaScript;
                    } else if (tsExtensions.contains(extension)) {
                        sourceFileType = JavaScriptSourceFile.SourceFileType.TypeScript;
                    }

                    if (sourceFileType != null) {
                        javaScriptSourceFile.insertRow(ctx, new JavaScriptSourceFile.Row(s.getSourcePath().toString(), sourceFileType));
                        return SearchResult.found(s);
                    }
                }
                return super.visit(tree, ctx);
            }
        };
    }
}
