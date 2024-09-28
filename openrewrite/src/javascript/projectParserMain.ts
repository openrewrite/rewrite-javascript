#!/usr/bin/env ts-node

import path from "path";
import fs from "fs";
import * as ts from "typescript";
import {JavaScriptParser} from "./parser";
import {InMemoryExecutionContext, SourceFile} from "../core";
import {findSubprojects, PackageManager, Subproject, TypeScriptParser} from "./projectParser";

function main(): void {
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.error('Usage: ts-node script.ts <path_to_project_root>');
        process.exit(1);
    }

    const rootDir = path.resolve(args[0]);
    if (!fs.existsSync(rootDir) || !fs.statSync(rootDir).isDirectory()) {
        console.error(`Invalid directory: ${rootDir}`);
        process.exit(1);
    }

    const subprojectPaths = findSubprojects(rootDir);
    console.log(`Found ${subprojectPaths.length} subproject(s).`);

    const installedPackageManagers = new Set<PackageManager>();
    const tsParser = new TypeScriptParser();
    let detectedPackageManager: PackageManager | undefined = undefined;

    for (const subprojectPath of subprojectPaths) {
        try {
            console.log(`\nProcessing subproject at ${subprojectPath}...`);
            const subproject: Subproject = new Subproject(subprojectPath, detectedPackageManager);
            detectedPackageManager = subproject.detectPackageManager();
            subproject.locateTsConfigs();
            subproject.installPackageManager(installedPackageManagers);
            subproject.installDependencies();

            let productionProgram: ts.Program | undefined = undefined;

            const parser = JavaScriptParser.builder().build();
            const sourceFiles: SourceFile[] = [];
            if (subproject.tsConfigPath) {
                productionProgram = tsParser.parseProject(subproject.tsConfigPath);
                sourceFiles.push(...parser.parseProgramSources(productionProgram, rootDir, new InMemoryExecutionContext()));
            }

            if (subproject.tsTestConfigPath) {
                let testProgram = tsParser.parseProject(subproject.tsTestConfigPath, productionProgram);
                sourceFiles.push(...parser.parseProgramSources(testProgram, rootDir, new InMemoryExecutionContext()));
            }

            console.log(`\nParsed ${sourceFiles.length} source files:`);
            for (let sourceFile of sourceFiles) {
                console.log(`\t${sourceFile.sourcePath}`);
            }
        } catch (e) {
            console.log('\nSkipping subproject.');
        }
    }

    console.log('\nProcessing completed.');
}

main();
