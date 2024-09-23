import * as ts from 'typescript';
import * as J from '../java/tree';
import * as JS from './tree';
import {ExecutionContext, Markers, ParseError, Parser, ParserInput, randomId, SourceFile, Tree} from "../core";
import {Expression, JRightPadded, Space, Statement} from "../java/tree";
import {Node} from "typescript";

export class JavaScriptParser extends Parser {
    parseInputs(inputs: Iterable<ParserInput>, relativeTo: string | null, ctx: ExecutionContext): Iterable<SourceFile> {
        const inputsArray = Array.from(inputs);
        const compilerOptions: ts.CompilerOptions = {
            target: ts.ScriptTarget.Latest,
            module: ts.ModuleKind.CommonJS,
            // strict: true,
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

        const result = [];
        for (let input of inputsArray) {
            const sourceFile = program.getSourceFile(input.path);
            if (sourceFile) {
                try {
                    result.push(new ParserVisitor(sourceFile, typeChecker).visit(sourceFile) as SourceFile);
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

class ParserVisitor {
    constructor(private readonly sourceFile: ts.SourceFile, private readonly typeChecker: ts.TypeChecker) {
    }

    public visit(node: ts.Node): Tree {
        switch (node.kind) {
            case ts.SyntaxKind.SourceFile:
                if (ts.isSourceFile(node)) {
                    return new JS.CompilationUnit(
                        randomId(),
                        this.prefix(node),
                        Markers.EMPTY,
                        this.sourceFile.fileName,
                        null,
                        null,
                        false,
                        null,
                        [],
                        node.statements.map((s) => {
                            return new JRightPadded(
                                this.visit(s) as Statement,
                                Space.EMPTY,
                                Markers.EMPTY
                            );
                        }),
                        Space.EMPTY
                    );
                }
                break;
            case ts.SyntaxKind.ExpressionStatement:
                if (ts.isExpressionStatement(node)) {
                    return new JS.ExpressionStatement(
                        randomId(),
                        this.visit(node.expression) as Expression
                    )
                }
                break;
            default:
                return new J.Unknown(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    new J.Unknown.Source(
                        randomId(),
                        Space.EMPTY,
                        Markers.EMPTY,
                        node.getFullText()
                    )
                );
        }
        throw new Error("Unreachable statement");
    }

    private prefix(node: Node) {
        return Space.EMPTY;
    }
}
