/*
 * Copyright 2025 the original author or authors.
 * <p>
 * Licensed under the Moderne Source Available License (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * https://docs.moderne.io/licensing/moderne-source-available-license
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.openrewrite.javascript.remote;

import java.nio.file.Path;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.function.Predicate;

public class FileFilter implements Predicate<Path> {

    public static final FileFilter INSTANCE = new FileFilter();

    @Override
    public boolean test(Path path) {
        if (path.toString().contains("/dist/")) {
            // FIXME this is a workaround to not having tsconfig info
            return false;
        }

        final String filename = path.getFileName().toString().toLowerCase();
        for (String ext : EXTENSIONS) {
            if (filename.endsWith(ext) && !EXCLUSIONS.contains(filename)) {
                return true;
            }
        }
        return false;
    }

    private final static List<String> EXTENSIONS = Collections.unmodifiableList(Arrays.asList(
            ".js", ".jsx", ".mjs", ".cjs",
            ".ts", ".tsx", ".mts", ".cts"
    ));

    // Exclude Yarn's Plug'n'Play loader files (https://yarnpkg.com/features/pnp)
    private final static List<String> EXCLUSIONS = Collections.unmodifiableList(Arrays.asList(
            ".pnp.cjs", ".pnp.loader.mjs"
    ));

}
