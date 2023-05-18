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
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.javascript.JavaScriptVisitor;
import org.openrewrite.javascript.table.ParseExceptionAnalysis;

import java.util.List;
import java.util.stream.Collectors;

/**
 * This recipe is an iteration of {@link org.openrewrite.FindParseFailures} that uses {@link ParseExceptionAnalysis} to
 * identify parser exceptions on a per-node basis.
 * <p>
 * The recipe is a POC for a new approach to identifying and prioritizing parsing failures.
 * And will be moved to the core rewrite project if it's proven to be useful.
 */
@Incubating(since = "0.0")
@Value
@EqualsAndHashCode(callSuper = true)
public class FindParseFailures extends Recipe {
    transient ParseExceptionAnalysis report = new ParseExceptionAnalysis(this);

    @Option(displayName = "Mark source files",
            description = "Adds a `SearchResult` marker to LST elements that resulted in a parser exception.",
            required = false)
    @Nullable
    Boolean markSourceFiles;

    @Option(displayName = "`ParseExceptionAnalysis.nodeType`",
            description = "Limits the marked results to a specific node type.",
            required = false)
    @Nullable
    String nodeType;

    @Override
    public String getDisplayName() {
        return "Parser exception report";
    }

    @Override
    public String getDescription() {
        return "Use data tables and search results to analyze, identify and prioritize fixing parsing failures.";
    }

    @Override
    protected List<SourceFile> visit(List<SourceFile> before, ExecutionContext ctx) {
        ParseExceptionAnalysis.findParserExceptions(before.stream()
                .filter(s -> JavaScriptVisitor.noop().isAcceptable(s, ctx))
                .collect(Collectors.toList()), report, ctx);
        return before;
    }
}
