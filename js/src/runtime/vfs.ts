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
import { PathPrefixes } from "./PathPrefixes";

export type VfsOptions = {
    readonly traceVirtualFileSystem?: boolean;
};

export function createCompilerHost(
    vfsOptions: VfsOptions,
    compilerOptions: ts.CompilerOptions,
    allFiles: Map<string, string>,
) {
    const system = createVirtualFileSystem(vfsOptions, allFiles);
    const host = tsvfs.createVirtualCompilerHost(system, compilerOptions, ts).compilerHost;
    const getSourceFile = host.getSourceFile;

    host.getSourceFile = (filename, ...args) => {
        if (!host.fileExists(filename)) {
            return;
        } else {
            return getSourceFile(filename, ...args);
        }
    };
    host.getDefaultLibLocation = () => PathPrefixes.lib;
    host.getDefaultLibFileName = (compilerOptions) =>
        PathPrefixes.lib + ts.getDefaultLibFileName(compilerOptions);

    return host;
}

function createVirtualFileSystem(vfsOptions: VfsOptions, allFiles: Map<string, string>) {
    const system = tsvfs.createSystem(allFiles);

    if (vfsOptions.traceVirtualFileSystem) {
        const readFile = system.readFile;
        if (readFile) {
            system.readFile = function (...[filename, ...args]: Parameters<typeof readFile>) {
                console.error("system.readFile(", filename, ...args, ")");
                const result = readFile(filename, ...args);
                if (result === undefined && allFiles.has(filename)) {
                    return allFiles.get(filename);
                }
                return result;
            };
        } else {
            console.error("*** no system.readFile");
        }

        const fileExists = system.fileExists;
        system.fileExists = function (path) {
            console.error("system.fileExists(" + path + ")");
            const result = fileExists(path);
            console.error("--> " + result);
            return result;
        };

        const resolvePath = system.resolvePath;
        system.resolvePath = function (path) {
            console.error("system.resolvePath(" + path + ")");
            const result = resolvePath(path);
            console.error("--> " + result);
            return result;
        };

        const realpath = system.realpath;
        if (realpath) {
            system.realpath = function (path) {
                console.error("system.realpath(" + path + ")");
                const result = realpath(path);
                console.error("--> " + result);
                return result;
            };
        } else {
            // for resolving symlinks; assume there are none
            system.realpath = function (path) {
                console.error("system.realpath(" + path + ")");
                const result = path;
                console.error("--> " + result + " [patched]");
                return result;
            };
        }

        const readDirectory = system.readDirectory;
        system.readDirectory = function (path, ...args) {
            console.error("system.readDirectory(" + path + ")");
            const result = readDirectory.call(system, path, ...args);
            console.error("--> " + result);
            return result;
        };

        const directoryExists = system.directoryExists;
        system.directoryExists = function (path) {
            console.error("system.directoryExists(" + path + ")");
            const result = directoryExists(path);
            console.error("--> " + result);
            return result;
        };

        const getFileSize = system.getFileSize;
        if (getFileSize) {
            system.getFileSize = function (path) {
                console.error("system.getFileSize(" + path + ")");
                const result = getFileSize(path);
                console.error("--> " + result);
                return result;
            };
        } else {
            system.getFileSize = function (path) {
                console.error("system.getFileSize(" + path + ")");
                const result = readFile(path)?.length ?? 0;
                console.error("--> " + result + " [patched]");
                return result;
            };
        }
    }

    return system;
}
