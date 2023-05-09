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
import * as ts from "typescript";
import * as tsvfs from "@typescript/vfs";
import { createScanner, ScriptTarget } from "typescript";

const OPEN_REWRITE_ID = Symbol("OpenRewriteId");

// (entry point from Java code)
// noinspection JSUnusedGlobalSymbols
export default function parse(inputs: Map<string, string>) {
    try {
        const compilerOptions: ts.CompilerOptions = {
            allowJs: true,
            checkJs: true,
            noLib: true,
            noEmit: true,
        };
        const createProgramOptions: Omit<ts.CreateProgramOptions, "host"> = {
            options: compilerOptions,
            rootNames: [...inputs.keys()],
        };

        const system = tsvfs.createSystem(inputs);
        const host = tsvfs.createVirtualCompilerHost(system, compilerOptions, ts).compilerHost;
        const program = ts.createProgram({
            host,
            ...createProgramOptions,
        });

        let nextNodeId = BigInt(1);
        const getOpenRewriteId = (obj: any) => {
            let objId = obj[OPEN_REWRITE_ID];
            if (objId === undefined) {
                objId = nextNodeId++;
                obj[OPEN_REWRITE_ID] = objId;
            }
            return objId;
        };

        return {
            meta: {
                syntaxKinds: new Map(Object.entries(ts.SyntaxKind)),
            },
            program,
            getOpenRewriteId,
            typeChecker: program.getTypeChecker(),
            sourceFiles: program.getSourceFiles(),
            createScanner: () => createScanner(ScriptTarget.ESNext, false, undefined),
        };
    } catch (err) {
        console.error(err);
    }
}
