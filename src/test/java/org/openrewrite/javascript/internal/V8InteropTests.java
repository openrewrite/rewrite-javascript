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

import org.junit.jupiter.api.Test;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCRuntime;
import org.openrewrite.javascript.internal.tsc.TSCType;
import org.openrewrite.javascript.internal.tsc.generated.TSCObjectFlag;
import org.openrewrite.javascript.internal.tsc.generated.TSCTypeFlag;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

public class V8InteropTests {

    @Test
    public void testTypeIdentity() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            runtime.parseSingleSource("function foo() {}", (root, ctx) -> {
                root.getAllChildNodes().forEach(child -> {
                    TSCType first = child.getTypeForNode();
                    TSCType second = child.getTypeForNode();
                    assertSame(first, second);
                });
            });
        }
    }

    @Test
    public void testNodeIdentity() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            runtime.parseSingleSource("function foo() {}", (root, ctx) -> {
                List<TSCNode> first = root.getAllChildNodes();
                List<TSCNode> second = root.getAllChildNodes();
                for (int i = 0; i < first.size(); i++) {
                    assertSame(first.get(i), second.get(i));
                }
            });
        }
    }

    @Test
    public void testTypeIdentityInDifferentLocations() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            runtime.parseSingleSource("class Foo{} const x = new Foo(); const y = new Foo();", (root, ctx) -> {
                TSCType xType = Objects.requireNonNull(root.findFirstNodeWithText("x")).getTypeForNode();
                TSCType yType = Objects.requireNonNull(root.findFirstNodeWithText("y")).getTypeForNode();
                assertSame(xType, yType);
            });
        }
    }

    @Test
    public void testTypeIdentityInDifferentFiles() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            Map<Path, String> sources = new HashMap<>();
            sources.put(Paths.get("a.ts"), "export class Foo {}");
            sources.put(Paths.get("b.ts"), "import {Foo} from './a'; const x = new Foo();");
            sources.put(Paths.get("c.ts"), "import {Foo} from './a'; const x = new Foo();");
            AtomicReference<TSCType> inOtherFile = new AtomicReference<>();
            AtomicBoolean checked = new AtomicBoolean();
            runtime.parseSourceTexts(sources, (root, ctx) -> {
                if (ctx.getRelativeSourcePath().toString().equals("a.ts")) {
                    return;
                }
                TSCType type = Objects.requireNonNull(root.findFirstNodeWithText("x")).getTypeForNode();
                if (inOtherFile.get() == null) {
                    inOtherFile.set(type);
                } else {
                    checked.set(true);
                    assertSame(type, inOtherFile.get());
                }
            });
            assertTrue(checked.get());
        }
    }

    @Test
    public void testNumberFlags() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            runtime.parseSingleSource("const x: number = 2;", (root, ctx) -> {
                TSCNode name = Objects.requireNonNull(root.findFirstNodeWithText("x"));
                TSCType type = Objects.requireNonNull(name.getTypeForNode());
                assertNotNull(type);
                assertTrue(type.hasExactTypeFlag(TSCTypeFlag.Number));
            });
        }
    }

    @Test
    public void testClassTypeFlags() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            runtime.parseSingleSource("class Cls{} const x: Cls = new Cls();", (root, ctx) -> {
                TSCNode name = Objects.requireNonNull(root.findFirstNodeWithText("x"));
                TSCType type = Objects.requireNonNull(name.getTypeForNode());
                assertTrue(type.hasExactTypeFlag(TSCTypeFlag.Object));
                assertTrue(type.hasObjectFlag(TSCObjectFlag.Class));
            });
        }
    }

    @Test
    public void testInterfaceTypeWrapper() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            runtime.parseSingleSource("class Cls{y: string} const x: Cls = new Cls();", (root, ctx) -> {
                TSCNode name = Objects.requireNonNull(root.findFirstNodeWithText("x"));
                TSCType type = Objects.requireNonNull(name.getTypeForNode());

                TSCType.InterfaceType wrapper = Objects.requireNonNull(type.asInterfaceType());
                assertNotNull(wrapper.getThisType());
            });
        }
    }

    @Test
    public void compilerOptionsHandleJsExtension() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            AtomicInteger count = new AtomicInteger();
            runtime.parseSingleSource("const x = 3;", "file.js", (root, ctx) -> {
                count.incrementAndGet();
            });
            assertEquals(count.get(), 1);
        }
    }

    @Test
    public void nodeReturnsSourceFile() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            AtomicBoolean ran = new AtomicBoolean();
            runtime.parseSingleSource("const x = 3;", "file.js", (root, ctx) -> {
                ran.set(true);
                TSCNode ident = Objects.requireNonNull(root.findFirstNodeWithText("x"));
                TSCNode.SourceFile sourceFile = ident.getSourceFile();
                assertEquals(sourceFile.getFileName(), "file.js");
                assertEquals(sourceFile.getPath(), "/file.js");
            });
            assertTrue(ran.get());
        }
    }

    @Test
    public void nodeHasParent() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            AtomicBoolean ran = new AtomicBoolean();
            runtime.parseSingleSource("const x = 3;", "file.js", (root, ctx) -> {
                ran.set(true);
                TSCNode ident = Objects.requireNonNull(root.findFirstNodeWithText("x"));
                TSCNode parent = ident.getParent().getParent().getParent().getParent();
                assertSame(parent, root);
            });
            assertTrue(ran.get());
        }
    }

}
