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

public enum TSCFlowFlag {
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

    TSCFlowFlag(int code) {
        this.code = code;
    }

    public static TSCFlowFlag fromMaskExact(int code) {
        switch (code) {
            case 1:
                return TSCFlowFlag.Unreachable;
            case 2:
                return TSCFlowFlag.Start;
            case 4:
                return TSCFlowFlag.BranchLabel;
            case 8:
                return TSCFlowFlag.LoopLabel;
            case 16:
                return TSCFlowFlag.Assignment;
            case 32:
                return TSCFlowFlag.TrueCondition;
            case 64:
                return TSCFlowFlag.FalseCondition;
            case 128:
                return TSCFlowFlag.SwitchClause;
            case 256:
                return TSCFlowFlag.ArrayMutation;
            case 512:
                return TSCFlowFlag.Call;
            case 1024:
                return TSCFlowFlag.ReduceLabel;
            case 2048:
                return TSCFlowFlag.Referenced;
            case 4096:
                return TSCFlowFlag.Shared;
            case 12:
                return TSCFlowFlag.Label;
            case 96:
                return TSCFlowFlag.Condition;
            default:
                throw new IllegalArgumentException("unknown TSCFlowFlag code: " + code);
        }
    }

    public boolean matches(int bitfield) {
        return (bitfield & this.code) != 0;
    }

    public static int union(TSCFlowFlag... args) {
        int result = 0;
        for (TSCFlowFlag arg : args) {
            result = result | arg.code;
        }
        return result;
    }
}
