import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import {spawnSync} from 'child_process';

export enum PackageManager {
    Npm = 'npm',
    Yarn = 'yarn',
    Pnpm = 'pnpm',
}

export class Subproject {
    rootDir: string;
    packageManager: PackageManager | undefined;
    packageManagerInstalled: boolean;
    dependenciesInstalled: boolean;
    tsConfigPath?: string;
    tsTestConfigPath?: string;

    constructor(rootDir: string, packageManager: PackageManager | undefined = undefined) {
        this.rootDir = rootDir;
        this.packageManagerInstalled = false;
        this.dependenciesInstalled = false;
        this.packageManager = packageManager;
    }

    detectPackageManager(): PackageManager {
        if (this.packageManager) return this.packageManager;

        const hasYarnLock = fs.existsSync(path.join(this.rootDir, 'yarn.lock'));
        const hasPnpmLock = fs.existsSync(path.join(this.rootDir, 'pnpm-lock.yaml'));

        if (hasYarnLock) {
            this.packageManager = PackageManager.Yarn;
        } else if (hasPnpmLock) {
            this.packageManager = PackageManager.Pnpm;
        } else {
            this.packageManager = PackageManager.Npm;
        }
        return this.packageManager;
    }

    locateTsConfigs(): void {
        // Use ts.findConfigFile to locate tsconfig.json
        this.tsConfigPath = ts.findConfigFile(
            this.rootDir,
            ts.sys.fileExists,
            'tsconfig.json'
        );

        // Use ts.findConfigFile to locate tsconfig.test.json
        this.tsTestConfigPath = ts.findConfigFile(
            this.rootDir,
            ts.sys.fileExists,
            'tsconfig.test.json'
        );
    }

    installPackageManager(installedPackageManagers: Set<PackageManager>): void {
        if (this.packageManager === PackageManager.Npm) {
            this.packageManagerInstalled = true;
            return;
        }

        if (!installedPackageManagers.has(this.packageManager!)) {
            console.log(`Installing package manager: ${this.packageManager} globally...`);
            const result = spawnSync('corepack', ['enable', this.packageManager!], {stdio: 'inherit'});
            if (result.status !== 0) {
                throw new Error(`Failed to install ${this.packageManager} globally.`);
            }
            installedPackageManagers.add(this.packageManager!);
        }

        this.packageManagerInstalled = true;
    }

    installDependencies(): void {
        if (this.dependenciesInstalled) return;

        console.log(`Installing dependencies for subproject at ${this.rootDir} using ${this.packageManager}...`);
        let args = ['-c', `yes " " | ${this.packageManager} install`];
        const result = spawnSync('bash', args, {cwd: this.rootDir, stdio: 'inherit'});
        if (result.status !== 0) {
            throw new Error(`Failed to install dependencies in ${this.rootDir} using ${this.packageManager}.`);
        }

        this.dependenciesInstalled = true;
    }
}

export class TypeScriptParser {
    parseTsConfig(tsConfigPath: string): ts.ParsedCommandLine {
        const configFileText = fs.readFileSync(tsConfigPath, 'utf8');
        const result = ts.parseConfigFileTextToJson(tsConfigPath, configFileText);

        if (result.error) {
            throw new Error(`Error parsing ${tsConfigPath}: ${result.error.messageText}`);
        }

        const configParseResult = ts.parseJsonConfigFileContent(
            result.config,
            ts.sys,
            path.dirname(tsConfigPath)
        );

        if (configParseResult.errors.length > 0) {
            const errors = ts.formatDiagnosticsWithColorAndContext(configParseResult.errors, {
                getCurrentDirectory: ts.sys.getCurrentDirectory,
                getCanonicalFileName: (fileName) => fileName,
                getNewLine: () => ts.sys.newLine,
            });
            throw new Error(`Errors parsing ${tsConfigPath}:\n${errors}`);
        }

        // make sure that JS sources also get parsed
        configParseResult.options.allowJs = true;
        configParseResult.options.checkJs = true;

        return configParseResult;
    }

    parseProject(tsConfigPath: string, oldProgram?: ts.Program): ts.Program {
        console.log(`Parsing project using ${tsConfigPath}...`);
        const configParseResult = this.parseTsConfig(tsConfigPath);
        const program = ts.createProgram({
            rootNames: configParseResult.fileNames,
            options: configParseResult.options,
            projectReferences: configParseResult.projectReferences,
            oldProgram: oldProgram,
        });

        // Perform type checking (if needed)
        const diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.length > 0) {
            const formattedDiagnostics = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
                getCurrentDirectory: ts.sys.getCurrentDirectory,
                getCanonicalFileName: (fileName) => fileName,
                getNewLine: () => ts.sys.newLine,
            });
            console.warn(`TypeScript diagnostics for ${tsConfigPath}:\n${formattedDiagnostics}`);
        }

        return program;
    }
}

export function findSubprojects(rootDir: string): string[] {
    const subprojects: string[] = [];

    function searchDirectory(directory: string): void {
        const entries = fs.readdirSync(directory, {withFileTypes: true});

        if (entries.some((entry) => entry.name === 'package.json')) {
            subprojects.push(directory);
        }
        for (const entry of entries) {
            if (entry.isDirectory() && !entry.name.startsWith('.')) {
                searchDirectory(path.join(directory, entry.name));
            }
        }
    }

    searchDirectory(rootDir);
    return subprojects;
}
