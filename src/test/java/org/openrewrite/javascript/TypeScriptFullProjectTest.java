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

import org.junit.jupiter.api.Test;
import org.openrewrite.ExecutionContext;
import org.openrewrite.InMemoryExecutionContext;
import org.openrewrite.Parser;
import org.openrewrite.TypeScriptSignatureBuilder;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class TypeScriptFullProjectTest {

    /**
     * Not intended to be checked in.
     * <p>
     * Make sure that axios is checked out to the directory containing `rewrite-javascript`
     * from git@github.com:axios/axios.git.
     */
    @Test
    void testAxiosRepo() {
        Path root = Paths.get("../axios");
        List<Parser.Input> inputs = new ArrayList<>();
        JavaScriptParser parser = JavaScriptParser.builder().build();
        collectInputs(parser, root, path -> {
            inputs.add(new Parser.Input(path, () -> {
                try {
                    return new FileInputStream(path.toFile());
                } catch (FileNotFoundException e) {
                    throw new RuntimeException(e);
                }
            }));
        });

        ExecutionContext context = new InMemoryExecutionContext();
        Map<String, Integer> maxes = new HashMap<>();
        TypeScriptSignatureBuilder.globalResolveNodeCallback = (node, nestingCount) -> {
            if (nestingCount > 1000) {
                maxes.compute(
                        node.getSourceFile().getPath() + ": " + node.getText(),
                        (_text, oldCount) -> Math.max(oldCount == null ? 0 : oldCount, nestingCount)
                );
            }
        };
        try {
            parser.parseInputs(inputs, root, context);
        } finally {
            TypeScriptSignatureBuilder.globalResolveNodeCallback = null;
        }

        for (Map.Entry<String, Integer> entry : maxes.entrySet()) {
            System.err.println(entry.getValue() + "\t" + entry.getKey());
        }

        assertTrue(maxes.isEmpty());
    }

    private void collectInputs(JavaScriptParser parser, Path path, Consumer<Path> into) {
        if (Files.isDirectory(path)) {
            try (Stream<Path> children = Files.list(path)) {
                children.forEach(child -> collectInputs(parser, child, into));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else if (parser.accept(path)) {
            into.accept(path);
        }
    }

}
