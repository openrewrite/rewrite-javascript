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

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Value;
import org.openrewrite.*;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.javascript.table.ParseExceptionAnalysis;
import org.openrewrite.marker.SearchResult;

import java.util.*;

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
public class FindParseExceptionAnalysis extends ScanningRecipe<FindParseExceptionAnalysis.Accumulator> {
    transient ParseExceptionAnalysis report = new ParseExceptionAnalysis(this);

    @Option(displayName = "Mark source files",
            description = "Adds a `SearchResult` marker to LST elements that resulted in a parser exception.",
            required = false)
    @Nullable
    Boolean markFailures;

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
        return "Find ParseExceptionResults per LST element and create a data tables to prioritize fixing parsing failures. " +
                "This recipe is an iteration of `FindParseFailures` that uses `ParseExceptionAnalysis` to identify parser exceptions on a per-node basis.";
    }

    @Data
    static class Accumulator {
        Map<String, Map<String, Integer>> counts = new HashMap<>();
        List<SourceFile> results = new ArrayList<>();
    }

    @Override
    public Accumulator getInitialValue(ExecutionContext ctx) {
        return new Accumulator();
    }

    @Override
    public TreeVisitor<?, ExecutionContext> getScanner(Accumulator acc) {
        return new TreeVisitor<Tree, ExecutionContext>() {
            @Override
            public Tree visit(@Nullable Tree tree, ExecutionContext ctx) {
                if (!(tree instanceof SourceFile)) {
                    return tree;
                }

                SourceFile s = (SourceFile) tree;
                if (Boolean.TRUE.equals(markFailures)) {
                    acc.results.add((SourceFile) new AnalysisVisitor(s, acc.getCounts(), markFailures, nodeType).visit(s, ctx));
                } else {
                    new AnalysisVisitor(s, acc.getCounts(), markFailures, nodeType).visit(s, ctx);
                }
                return s;
            }
        };
    }

    @Override
    public Collection<? extends SourceFile> generate(Accumulator acc, ExecutionContext ctx) {
        for (Map.Entry<String, Map<String, Integer>> fileExtensionEntries : acc.getCounts().entrySet()) {
            for (Map.Entry<String, Integer> nodeTypeCounts : fileExtensionEntries.getValue().entrySet()) {
                report.insertRow(ctx, new ParseExceptionAnalysis.Row(fileExtensionEntries.getKey(), nodeTypeCounts.getKey(), nodeTypeCounts.getValue()));
            }
        }
        return acc.results;
    }

    private static class AnalysisVisitor extends TreeVisitor<Tree, ExecutionContext> {
        private final Map<String, Map<String, Integer>> counts;
        private final Set<String> ids = new HashSet<>();
        private final boolean markFailures;

        @Nullable
        private final String markNodeType;

        private final String extension;

        public AnalysisVisitor(SourceFile source, Map<String, Map<String, Integer>> counts, @Nullable Boolean markFailures, @Nullable String markNodeType) {
            this.counts = counts;
            this.markFailures = Boolean.TRUE.equals(markFailures);
            this.markNodeType = markNodeType;

            this.extension = source.getSourcePath().toString().substring(source.getSourcePath().toString().lastIndexOf(".") + 1);
        }

        @Nullable
        @Override
        public Tree visit(@Nullable Tree tree, ExecutionContext ctx) {
            if (tree == null) {
                return null;
            }

            Tree t = super.visit(tree, ctx);
            if (t != null) {
                ParseExceptionResult result = t.getMarkers().findFirst(ParseExceptionResult.class).orElse(null);
                if (result != null) {
                    String nodeType = ParseExceptionAnalysis.getNodeType(result.getMessage());
                    if (markFailures) {
                        if ((markNodeType == null || markNodeType.equals(nodeType))) {
                            // Filter info: The TS parser creates an `UnknownElement` and adds a `ParseExceptionResult` marker to
                            // each element when there is a parsing exception on VALID source code.
                            // If a parsing exception marker exists on an unknown element, the marker is also added to
                            // the CU so that existing recipes will detect a parsing exception.
                            if (ids.add(result.getId().toString())) {
                                t = SearchResult.found(t);
                            }
                        }
                    }
                    Map<String, Integer> nodeTypeCounts = counts.computeIfAbsent(extension, k -> new HashMap<>());
                    nodeTypeCounts.merge(nodeType, 1, Integer::sum);
                }
            }
            return t;
        }
    }
}
