package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.values.reference.V8ValueObject;

import javax.annotation.Nullable;
import java.util.List;

import static org.openrewrite.javascript.internal.tsc.TSCConversions.*;

public class TSCGlobals implements TSCV8Backed {

    public static TSCGlobals wrap(TSCProgramContext context, V8ValueObject objectV8) {
        return new TSCGlobals(context, objectV8);
    }

    private final TSCProgramContext programContext;
    private final V8ValueObject typescriptV8;

    private TSCGlobals(TSCProgramContext programContext, V8ValueObject typescriptV8) {
        this.programContext = programContext;
        this.typescriptV8 = typescriptV8;
    }

    @Override
    public TSCProgramContext getProgramContext() {
        return programContext;
    }

    @Override
    public V8ValueObject getBackingV8Object() {
        return typescriptV8;
    }

    public @Nullable List<TSCNode> getDecorators(TSCNode node) {
        return this.invokeMethodNullable("getDecorators", NODE_LIST, node);
    }

    public @Nullable List<TSCNode> getModifiers(TSCNode node) {
        return this.invokeMethodNullable("getModifiers", NODE_LIST, node);
    }
}
