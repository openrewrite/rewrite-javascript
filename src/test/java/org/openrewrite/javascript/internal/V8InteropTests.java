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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

public class V8InteropTests {

    @Test
    public void testTypeIdentity() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            Map<String, String> sources = new HashMap<>();
            sources.put("example.ts", "function foo() {}");
            runtime.parseSourceTexts(sources, (root, ctx) -> {
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
            Map<String, String> sources = new HashMap<>();
            sources.put("example.ts", "function foo() {}");
            runtime.parseSourceTexts(sources, (root, ctx) -> {
                List<TSCNode> first = root.getAllChildNodes();
                List<TSCNode> second = root.getAllChildNodes();
                for (int i = 0; i < first.size(); i++) {
                    assertSame(first.get(i), second.get(i));
                }
            });
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

}
