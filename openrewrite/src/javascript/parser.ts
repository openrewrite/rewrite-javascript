import * as ts from 'typescript';
import * as JS from './tree';
import {ExecutionContext, Markers, Parser, ParserInput, randomId, SourceFile, Tree} from "../core";
import {Space} from "../java/tree";

export class JavaScriptParser extends Parser {
    parseInputs(inputs: Iterable<ParserInput>, relativeTo: string | null, ctx: ExecutionContext): Iterable<SourceFile> {
        const inputsArray = Array.from(inputs);
        const compilerOptions: ts.CompilerOptions = {
            target: ts.ScriptTarget.Latest,
            module: ts.ModuleKind.CommonJS,
            strict: true,
        };
        const host = ts.createCompilerHost(compilerOptions);
        host.getSourceFile = (fileName, languageVersion) => {
            if (!fileName.endsWith('lib.d.ts')) {
                let sourceText = inputsArray.find(i => i.path === fileName)?.source().toString('utf8')!;
                return sourceText ? ts.createSourceFile(fileName, sourceText, languageVersion, true) : undefined;
            }

            // For default library files like lib.d.ts
            const libFilePath = ts.getDefaultLibFilePath(compilerOptions);
            const libSource = ts.sys.readFile(libFilePath);
            return libSource
                ? ts.createSourceFile(fileName, libSource, languageVersion, true)
                : undefined;
        }

        const program = ts.createProgram(Array.from(inputsArray, i => i.path), compilerOptions, host);
        const typeChecker = program.getTypeChecker();
        return inputsArray.map(i => program.getSourceFile(i.path)).map(sf => this.visit(sf!, sf!, typeChecker) as SourceFile);
    }

    private visit(node: ts.Node, sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker): Tree {
        const kind = ts.SyntaxKind[node.kind];
        return new JS.CompilationUnit(
            randomId(),
            Space.EMPTY,
            Markers.EMPTY,
            sourceFile.fileName,
            null,
            null,
            false,
            null,
            [],
            [],
            Space.EMPTY
        );
    }

    accept(path: string): boolean {
        return path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js') || path.endsWith('.jsx');
    }

    sourcePathFromSourceText(prefix: string, sourceCode: string): string {
        return prefix + "/source.js";
    }
}