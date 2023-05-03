package org.openrewrite.javascript.internal;

import org.junit.jupiter.api.Test;
import org.openrewrite.javascript.internal.tsc.TSCNode;
import org.openrewrite.javascript.internal.tsc.TSCRuntime;
import org.openrewrite.javascript.internal.tsc.TSCType;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertSame;

public class V8InteropTests {

    @Test
    public void testTypeIdentity() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            Map<String, String> sources = new HashMap<>();
            sources.put("example.ts", "function foo() {}");
            runtime.parseSourceTexts(sources, (root, ctx) -> {
                root.forEachChild(child -> {
                    TSCType first = child.getTypeAtNodeLocation();
                    TSCType second = child.getTypeAtNodeLocation();
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

}
