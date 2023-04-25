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
import {ScriptTarget} from 'typescript';

// (entry point from Java code)
// noinspection JSUnusedGlobalSymbols
export default function parse(text: string) {
    try {
        return {
            meta: {
                syntaxKinds: new Map(Object.entries(ts.SyntaxKind))
            },
            sourceFile: ts.createSourceFile('example.ts', text, ScriptTarget.ESNext, true)
        };
    } catch (err) {
        console.error(err);
    }
}