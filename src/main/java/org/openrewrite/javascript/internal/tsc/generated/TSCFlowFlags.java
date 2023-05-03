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

public enum TSCFlowFlags {
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

    TSCFlowFlags(int code) {
        this.code = code;
    }

    public static TSCFlowFlags fromCode(int code) {
        switch (code) {
            case 1:
                return TSCFlowFlags.Unreachable;
            case 2:
                return TSCFlowFlags.Start;
            case 4:
                return TSCFlowFlags.BranchLabel;
            case 8:
                return TSCFlowFlags.LoopLabel;
            case 16:
                return TSCFlowFlags.Assignment;
            case 32:
                return TSCFlowFlags.TrueCondition;
            case 64:
                return TSCFlowFlags.FalseCondition;
            case 128:
                return TSCFlowFlags.SwitchClause;
            case 256:
                return TSCFlowFlags.ArrayMutation;
            case 512:
                return TSCFlowFlags.Call;
            case 1024:
                return TSCFlowFlags.ReduceLabel;
            case 2048:
                return TSCFlowFlags.Referenced;
            case 4096:
                return TSCFlowFlags.Shared;
            case 12:
                return TSCFlowFlags.Label;
            case 96:
                return TSCFlowFlags.Condition;
            default:
                throw new IllegalArgumentException("unknown TSCFlowFlags code: " + code);
        }
    }
    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }
}
