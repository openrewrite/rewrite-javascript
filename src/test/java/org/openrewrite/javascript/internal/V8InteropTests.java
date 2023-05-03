package org.openrewrite.javascript.internal;

import org.junit.jupiter.api.Test;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCRuntime;
import org.openrewrite.javascript.internal.tsc.TSCType;
import org.openrewrite.javascript.internal.tsc.generated.TSCObjectFlag;
import org.openrewrite.javascript.internal.tsc.generated.TSCTypeFlag;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class V8InteropTests {

    @Test
    public void testTypeIdentity() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            Map<String, String> sources = new HashMap<>();
            sources.put("example.ts", "function foo() {}");
            runtime.parseSourceTexts(sources, (root, ctx) -> {
                root.forEachChild(child -> {
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
                List<TSCNode> first = new ArrayList<>();
                List<TSCNode> second = new ArrayList<>();
                root.forEachChild(first::add);
                root.forEachChild(second::add);
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
                assertNotNull(type);
                assertTrue(type.hasExactTypeFlag(TSCTypeFlag.Object));
                assertTrue(type.hasObjectFlag(TSCObjectFlag.Class));
            });
        }
    }

}
