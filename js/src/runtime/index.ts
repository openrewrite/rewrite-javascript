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
import { CompilerOptions } from "typescript";
import libFileData from "../generated/libs.json";
import { PathPrefixes } from "./PathPrefixes";
import { createCompilerHost, VfsOptions } from "./vfs";

const OPEN_REWRITE_ID_SYMBOL = Symbol("OpenRewriteId");

const libMap: Map<string, string> = (ts as any).libMap;
const toFileNameLowerCase: (s: string) => string = (ts as any).toFileNameLowerCase;

type ParseOptions = {
    readonly compilerOptions?: CompilerOptions;
    readonly forwardedPaths?: Map<string, string>;
} & VfsOptions;

// (entry point from Java code)
// noinspection JSUnusedGlobalSymbols
export default function parse(originalInputs: Map<string, string>, options?: ParseOptions) {
    try {
        const allFiles = new Map();

        const originalInputPathToProgramPath = new Map();
        for (const [inputPath, inputData] of originalInputs) {
            const newInputPath = `${PathPrefixes.app}${inputPath}`;
            originalInputPathToProgramPath.set(inputPath, newInputPath);
            allFiles.set(newInputPath, inputData);
        }

        for (const [libPath, libData] of Object.entries(libFileData)) {
            allFiles.set(`${PathPrefixes.lib}${libPath}`, libData);
        }

        let compilerOptions: ts.CompilerOptions = {
            allowJs: true,
            checkJs: true,
            noEmit: true,
            ...options?.compilerOptions,
        };

        compilerOptions = remapLibNames(compilerOptions);

        const createProgramOptions: Omit<ts.CreateProgramOptions, "host"> = {
            options: compilerOptions,
            rootNames: [...originalInputPathToProgramPath.values()],
        };

        const host = createCompilerHost(options ?? {}, compilerOptions, allFiles);

        const program = ts.createProgram({
            host,
            ...createProgramOptions,
        });

        let nextNodeId = BigInt(1);
        const getOpenRewriteId = (obj: any) => {
            let objId = obj[OPEN_REWRITE_ID_SYMBOL];
            if (objId === undefined) {
                objId = nextNodeId++;
                obj[OPEN_REWRITE_ID_SYMBOL] = objId;
            }
            return objId;
        };

        return {
            pathPrefixes: PathPrefixes,
            program,
            getOpenRewriteId,
            typeChecker: program.getTypeChecker(),
            sourceFiles: new Map(
                [...originalInputPathToProgramPath].map(
                    ([originalInputPath, programInputPath]) =>
                        [originalInputPath, program.getSourceFile(programInputPath)] as const,
                ),
            ),
            createScanner: () => ts.createScanner(ts.ScriptTarget.ESNext, false, undefined),
            ts,
        };
    } catch (err) {
        console.error("Error while parsing on the V8 side:", (err as any).stack || err);
    }
}

/**
 * In TS config, the `lib` parameter looks like "ES2020" or "es2019.array".
 * The actual lib paths are like "lib.es2020.d.ts" or "es2019.array.d.ts".
 */
function remapLibNames(compilerOptions: CompilerOptions): CompilerOptions {
    if (compilerOptions.lib) {
        compilerOptions.lib = compilerOptions.lib.map((lib) => {
            const lowercaseLib = toFileNameLowerCase(lib);
            const foundLib = libMap.get(lowercaseLib);
            if (foundLib !== undefined) {
                console.log("found lib: " + foundLib);
                return `${PathPrefixes.lib}${foundLib}`;
            } else {
                console.log("didn't find lib: " + lib);
                return lib;
            }
        });
    }
    return compilerOptions;
}
