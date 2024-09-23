import * as ts from 'typescript';
import * as JS from './tree';
import {ExecutionContext, Markers, ParseError, Parser, ParserInput, randomId, SourceFile, Tree} from "../core";
import {Space} from "../java/tree";

export class JavaScriptParser extends Parser {
    parseInputs(inputs: Iterable<ParserInput>, relativeTo: string | null, ctx: ExecutionContext): Iterable<SourceFile> {
        const inputsArray = Array.from(inputs);
        const compilerOptions: ts.CompilerOptions = {
            target: ts.ScriptTarget.Latest,
            module: ts.ModuleKind.CommonJS,
            strict: true,
            allowJs: true
        };
        const host = ts.createCompilerHost(compilerOptions);
        host.getSourceFile = (fileName, languageVersion) => {
            if (fileName.endsWith('lib.d.ts')) {
                // For default library files like lib.d.ts
                const libFilePath = ts.getDefaultLibFilePath(compilerOptions);
                const libSource = ts.sys.readFile(libFilePath);
                return libSource
                    ? ts.createSourceFile(fileName, libSource, languageVersion, true)
                    : undefined;
            }

            let sourceText = inputsArray.find(i => i.path === fileName)?.source().toString('utf8')!;
            return sourceText ? ts.createSourceFile(fileName, sourceText, languageVersion, true) : undefined;
        }

        const program = ts.createProgram(Array.from(inputsArray, i => i.path), compilerOptions, host);
        const typeChecker = program.getTypeChecker();

        const result = new Array(inputsArray.length);
        for (let input of inputsArray) {
            const sourceFile = program.getSourceFile(input.path);
            if (sourceFile) {
                try {
                    result.push(visit(sourceFile, sourceFile, typeChecker) as SourceFile);
                } catch (error) {
                    result.push(ParseError.build(
                        this,
                        input,
                        relativeTo,
                        ctx,
                        error instanceof Error ? error : new Error("Parser threw unknown error: " + error),
                        null
                    ));
                }
            } else {
                result.push(ParseError.build(
                    this,
                    input,
                    relativeTo,
                    ctx,
                    new Error("Parser returned undefined"),
                    null
                ));
            }
        }
        return result;
    }

    accept(path: string): boolean {
        return path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js') || path.endsWith('.jsx');
    }

    sourcePathFromSourceText(prefix: string, sourceCode: string): string {
        return prefix + "/source.js";
    }
}

function visit(node: ts.Node, sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker): Tree {
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
