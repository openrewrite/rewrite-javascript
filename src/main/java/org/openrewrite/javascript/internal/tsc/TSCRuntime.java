package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.interception.logging.JavetStandardConsoleInterceptor;
import com.caoccao.javet.interop.V8Host;
import com.caoccao.javet.interop.V8Runtime;
import com.caoccao.javet.values.reference.V8ValueArray;
import com.caoccao.javet.values.reference.V8ValueFunction;
import com.caoccao.javet.values.reference.V8ValueMap;
import com.caoccao.javet.values.reference.V8ValueObject;
import org.openrewrite.IOUtils;
import org.openrewrite.internal.lang.Nullable;

import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.function.BiConsumer;

public class TSCRuntime implements Closeable {
    public final V8Runtime v8Runtime;

    @Nullable
    public V8ValueFunction tsParse = null;

    private final JavetStandardConsoleInterceptor javetStandardConsoleInterceptor;

    public static TSCRuntime init() {
        try {
            V8Runtime v8Runtime = V8Host.getV8Instance().createV8Runtime();
            JavetStandardConsoleInterceptor javetStandardConsoleInterceptor = new JavetStandardConsoleInterceptor(v8Runtime);
            javetStandardConsoleInterceptor.register(v8Runtime.getGlobalObject());
            return new TSCRuntime(v8Runtime, javetStandardConsoleInterceptor);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public TSCRuntime(V8Runtime v8Runtime, JavetStandardConsoleInterceptor javetStandardConsoleInterceptor) {
        this.v8Runtime = v8Runtime;
        this.javetStandardConsoleInterceptor = javetStandardConsoleInterceptor;
    }

    private static String getJSEntryProgramText() {
        try (InputStream is = TSCRuntime.class.getClassLoader().getResourceAsStream("index.js")) {
            if (is == null) throw new IllegalStateException("entry JS resource does not exist");
            return IOUtils.readFully(is, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void importTS() {
        if (tsParse != null) {
            return;
        }
        try {
            v8Runtime.getExecutor("const require = () => undefined;").executeVoid();
            v8Runtime.getExecutor("const module = {exports: {}};").executeVoid();
            v8Runtime.getExecutor(getJSEntryProgramText()).executeVoid();
            this.tsParse = v8Runtime.getExecutor("module.exports.default").execute();
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public void parseSourceTexts(Map<String, String> sourceTexts, BiConsumer<TSCNode, TSCSourceFileContext> callback) {
        importTS();
        assert tsParse != null;
        try (V8ValueMap sourceTextsV8 = v8Runtime.createV8ValueMap()) {
            for (Map.Entry<String, String> entry : sourceTexts.entrySet()) {
                sourceTextsV8.set(entry.getKey(), entry.getValue());
            }
            try (
                    V8ValueObject parseResultV8 = tsParse.call(null, sourceTextsV8);
                    TSCProgramContext programContext = TSCProgramContext.fromJS(parseResultV8);
                    V8ValueArray sourceFilesV8 = parseResultV8.get("sourceFiles")
            ) {
                sourceFilesV8.forEach((sourceFileV8) -> {
                    String sourceText = ((V8ValueObject) sourceFileV8).invokeString("getText");
                    try (TSCSourceFileContext sourceFileContext = new TSCSourceFileContext(programContext, sourceText)) {
                        TSCNode node = programContext.tscNode((V8ValueObject) sourceFileV8);
                        callback.accept(node, sourceFileContext);
                    }
                });
            }
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void close() {
        if (this.tsParse != null) {
            try {
                this.tsParse.close();
            } catch (JavetException e) {
            }
        }

        if (!v8Runtime.isClosed()) {
            v8Runtime.await();
            v8Runtime.lowMemoryNotification();

            try {
                javetStandardConsoleInterceptor.unregister(v8Runtime.getGlobalObject());
            } catch (JavetException ignored) {
            }
            v8Runtime.await();
            v8Runtime.lowMemoryNotification();
        }
        try {
            v8Runtime.close();
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }
}
