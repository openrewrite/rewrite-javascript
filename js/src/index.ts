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
import * as ts from 'typescript';
import * as tsvfs from '@typescript/vfs';
import {createScanner, ScriptTarget} from 'typescript';

const SYMBOL_NODE_ID = Symbol("NodeId");

// (entry point from Java code)
// noinspection JSUnusedGlobalSymbols
export default function parse(inputs: Map<string, string>) {
    try {
        const system = tsvfs.createSystem(inputs);
        const host = tsvfs.createVirtualCompilerHost(system, {}, ts).compilerHost;
        const program = ts.createProgram({
            host,
            options: {
                noLib: true,
            },
            rootNames: [...inputs.keys()]
        });

        let nextNodeId = BigInt(1);
        const getNodeId = (node: any) => {
            let nodeId = node[SYMBOL_NODE_ID];
            if (nodeId === undefined) {
                nodeId = nextNodeId++;
                node[SYMBOL_NODE_ID] = nodeId;
            }
            return nodeId;
        };

        return {
            meta: {
                syntaxKinds: new Map(Object.entries(ts.SyntaxKind))
            },
            program,
            getNodeId,
            typeChecker: program.getTypeChecker(),
            sourceFiles: program.getSourceFiles(),
            createScanner: () => createScanner(ScriptTarget.ESNext, false, undefined),
        };

        // const sourceFile = ts.createSourceFile('example.ts', text, ScriptTarget.ESNext, true);
        // return {
        //     meta: {
        //         syntaxKinds: new Map(Object.entries(ts.SyntaxKind))
        //     },
        //     sourceFile,
        //     nodeEndPositions: collectNodeEndPositions(sourceFile),
        //     scanner: createScanner(ScriptTarget.ESNext, false, undefined, text),
        // };
    } catch (err) {
        console.error(err);
    }
}
