package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.values.reference.V8ValueObject;

public class TSCType {
    private final TSCProgramContext programContext;
    public final V8ValueObject typeV8;

    public TSCType(TSCProgramContext programContext, V8ValueObject typeV8) {
        this.programContext = programContext;
        this.typeV8 = typeV8;
    }

    public Number getTypeId() {
        try {
            return this.typeV8.getPrimitive("id");
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }
}
