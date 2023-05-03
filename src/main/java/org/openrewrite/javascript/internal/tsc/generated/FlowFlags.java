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
package org.openrewrite.javascript.internal.tsc.generated;

//
// THIS FILE IS GENERATED. Do not modify it by hand.
// See `js/README.md` for instructions to regenerate this file.
//

public enum FlowFlags {
    Unreachable(1),
    Start(2),
    BranchLabel(4),
    LoopLabel(8),
    Assignment(16),
    TrueCondition(32),
    FalseCondition(64),
    SwitchClause(128),
    ArrayMutation(256),
    Call(512),
    ReduceLabel(1024),
    Referenced(2048),
    Shared(4096),
    Label(12),
    Condition(96);


    public final int code;

    FlowFlags(int code) {
        this.code = code;
    }

    public static FlowFlags fromCode(int code) {
        switch (code) {
            case 1:
                return FlowFlags.Unreachable;
            case 2:
                return FlowFlags.Start;
            case 4:
                return FlowFlags.BranchLabel;
            case 8:
                return FlowFlags.LoopLabel;
            case 16:
                return FlowFlags.Assignment;
            case 32:
                return FlowFlags.TrueCondition;
            case 64:
                return FlowFlags.FalseCondition;
            case 128:
                return FlowFlags.SwitchClause;
            case 256:
                return FlowFlags.ArrayMutation;
            case 512:
                return FlowFlags.Call;
            case 1024:
                return FlowFlags.ReduceLabel;
            case 2048:
                return FlowFlags.Referenced;
            case 4096:
                return FlowFlags.Shared;
            case 12:
                return FlowFlags.Label;
            case 96:
                return FlowFlags.Condition;
            default:
                throw new IllegalArgumentException("unknown FlowFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
