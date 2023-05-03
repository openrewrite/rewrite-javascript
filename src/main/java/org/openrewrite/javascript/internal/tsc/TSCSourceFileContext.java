package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.values.reference.V8ValueObject;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.io.Closeable;

public class TSCSourceFileContext implements Closeable {
    private final TSCProgramContext programContext;
    private final V8ValueObject scanner;

    TSCSourceFileContext(TSCProgramContext programContext, String sourceText) {
        this.programContext = programContext;
        try {
            this.scanner = programContext.getCreateScannerFunction().call(null);
            this.scanner.invokeVoid("setText", sourceText);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
        resetScanner(0);
    }

    public Integer scannerTokenStart() {
        try {
            return this.scanner.invokeInteger("getTokenPos");
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public Integer scannerTokenEnd() {
        try {
            return this.scanner.invokeInteger("getTextPos");
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public String scannerTokenText() {
        try {
            return this.scanner.invokeString("getTokenText");
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public void resetScanner(int offset) {
        try {
            this.scanner.invokeVoid("setTextPos", offset);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public TSCSyntaxKind nextScannerSyntaxType() {
        try {
            final int code = this.scanner.invokeInteger("scan");
            return TSCSyntaxKind.fromCode(code);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void close() {
        try {
            this.scanner.close();
        } catch (JavetException e) {
        }
    }
}
