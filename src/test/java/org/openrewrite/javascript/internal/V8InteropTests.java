package org.openrewrite.javascript.internal;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertSame;

public class V8InteropTests {

    @Test
    public void testTypeIdentity() {
        try (TSC.Runtime runtime = TSC.Runtime.init()) {
            Map<String, String> sources = new HashMap<>();
            sources.put("example.ts", "function foo() {}");
            runtime.parseSourceTexts(sources, (root, ctx) -> {
                root.forEachChild(child -> {
                    TSC.Type first = child.getTypeAtNodeLocation();
                    TSC.Type second = child.getTypeAtNodeLocation();
                    assertSame(first, second);
                });
            });
        }
    }

    @Test
    public void testNodeIdentity() {
        try (TSC.Runtime runtime = TSC.Runtime.init()) {
            Map<String, String> sources = new HashMap<>();
            sources.put("example.ts", "function foo() {}");
            runtime.parseSourceTexts(sources, (root, ctx) -> {
                List<TSC.Node> first = new ArrayList<>();
                List<TSC.Node> second = new ArrayList<>();
                root.forEachChild(first::add);
                root.forEachChild(second::add);
                for (int i = 0; i < first.size(); i++) {
                    assertSame(first.get(i), second.get(i));
                }
            });
        }
    }

}
