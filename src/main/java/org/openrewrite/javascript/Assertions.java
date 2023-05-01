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


import org.intellij.lang.annotations.Language;
import org.openrewrite.internal.lang.Nullable;
import org.openrewrite.javascript.tree.JS;
import org.openrewrite.test.SourceSpec;
import org.openrewrite.test.SourceSpecs;

import java.util.function.Consumer;

public final class Assertions {
    private Assertions() {
    }

    public static SourceSpecs javascript(@Language("js") @Nullable String before) {
        return javascript(before, s -> {
        });
    }

    public static SourceSpecs javascript(@Language("js") @Nullable String before, Consumer<SourceSpec<JS.CompilationUnit>> spec) {
        SourceSpec<JS.CompilationUnit> js = new SourceSpec<>(JS.CompilationUnit.class, null, JavaScriptParser.builder(), before, null);
        spec.accept(js);
        return js;
    }

    public static SourceSpecs javascript(@Language("js") @Nullable String before, @Language("js") String after) {
        return javascript(before, after, s -> {
        });
    }

    public static SourceSpecs javascript(@Language("js") @Nullable String before, @Language("js") String after,
                                     Consumer<SourceSpec<JS.CompilationUnit>> spec) {
        SourceSpec<JS.CompilationUnit> js = new SourceSpec<>(JS.CompilationUnit.class, null, JavaScriptParser.builder(), before, s -> after);
        spec.accept(js);
        return js;
    }
}
