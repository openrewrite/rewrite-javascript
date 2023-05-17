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
import org.openrewrite.*;
import org.openrewrite.javascript.table.JavaScriptSourceFile;
import org.openrewrite.marker.SearchResult;
import org.openrewrite.quark.Quark;
import org.openrewrite.text.PlainText;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Value
@EqualsAndHashCode(callSuper = true)
public class FindJavaScriptSources extends Recipe {
    transient JavaScriptSourceFile javaScriptSourceFile = new JavaScriptSourceFile(this);

    @Override
    public String getDisplayName() {
        return "Find Kotlin sources and collect data metrics";
    }

    @Override
    public String getDescription() {
        return "Use data table to collect source files types and counts of files with extensions `.kt`.";
    }

    @Override
    protected TreeVisitor<?, ExecutionContext> getVisitor() {
        return new TreeVisitor<Tree, ExecutionContext>() {
            final Set<String> jsExtensions = new HashSet<>(Arrays.asList("js", "jsx", "mjs", "cjs"));
            final Set<String> tsExtensions = new HashSet<>(Arrays.asList("ts", "tsx", "mts", "cts"));

            @Override
            public Tree visitSourceFile(SourceFile sourceFile, ExecutionContext ctx) {
                JavaScriptSourceFile.SourceFileType sourceFileType = null;
                if (sourceFile instanceof Quark) {
                    sourceFileType = JavaScriptSourceFile.SourceFileType.Quark;
                } else if (sourceFile instanceof PlainText) {
                    sourceFileType = JavaScriptSourceFile.SourceFileType.PlainText;
                } else {
                    String extension = sourceFile.getSourcePath().toString().substring(sourceFile.getSourcePath().toString().lastIndexOf(".") + 1);
                    if (jsExtensions.contains(extension)) {
                        sourceFileType = JavaScriptSourceFile.SourceFileType.JavaScript;
                    } else if (tsExtensions.contains(extension)) {
                        sourceFileType = JavaScriptSourceFile.SourceFileType.TypeScript;
                    }
                }

                if (sourceFileType != null) {
                    javaScriptSourceFile.insertRow(ctx, new JavaScriptSourceFile.Row(sourceFile.getSourcePath().toString(), sourceFileType));
                    return SearchResult.found(sourceFile);
                }
                return sourceFile;
            }
        };
    }
}
