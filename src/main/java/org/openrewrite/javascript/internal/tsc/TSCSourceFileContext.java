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
package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.values.reference.V8ValueObject;
import org.openrewrite.javascript.internal.tsc.generated.TSCSyntaxKind;

import java.nio.file.Path;

public class TSCSourceFileContext extends TSCV8ValueHolder {
    private final TSCProgramContext programContext;
    private final V8ValueObject scanner;

    private final Path relativeSourcePath;

    TSCSourceFileContext(TSCProgramContext programContext, String sourceText, Path relativeSourcePath) {
        this.programContext = programContext;
        this.relativeSourcePath = relativeSourcePath;
        try (V8ValueObject scannerV8 = programContext.getCreateScannerFunction().call(null)) {
            this.scanner = lifecycleLinked(scannerV8);
            this.scanner.invokeVoid("setText", sourceText);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
        resetScanner(0);
    }

    public TSCProgramContext getProgramContext() {
        return programContext;
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

    public Path getRelativeSourcePath() {
        return relativeSourcePath;
    }
}
