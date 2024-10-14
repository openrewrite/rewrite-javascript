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
package org.openrewrite.javascript.format;

import org.jspecify.annotations.Nullable;
import org.openrewrite.*;
import org.openrewrite.java.tree.J;
import org.openrewrite.javascript.JavaScriptIsoVisitor;
import org.openrewrite.javascript.style.IntelliJ;
import org.openrewrite.javascript.style.SpacesStyle;
import org.openrewrite.javascript.tree.JS;

import static java.util.Objects.requireNonNull;

@Incubating(since = "1.x")
public class Spaces extends Recipe {

    @Override
    public String getDisplayName() {
        return "JavaScript and TypeScript Spaces";
    }

    @Override
    public String getDescription() {
        return "Format whitespace in Java/Type Script code.";
    }

    @Override
    public TreeVisitor<?, ExecutionContext> getVisitor() {
        return new SpacesFromCompilationUnitStyle();
    }

    private static class SpacesFromCompilationUnitStyle extends JavaScriptIsoVisitor<ExecutionContext> {
        @Override
        public J visit(@Nullable Tree tree, ExecutionContext ctx) {
            if (tree instanceof JS.CompilationUnit) {
                JS.CompilationUnit cu = (JS.CompilationUnit) requireNonNull(tree);
                SpacesStyle style = cu.getStyle(SpacesStyle.class);
                if (style == null) {
                    style = IntelliJ.spaces();
                }
                doAfterVisit(new SpacesVisitor<>(style));
            }
            return super.visit(tree, ctx);
        }
    }
}
