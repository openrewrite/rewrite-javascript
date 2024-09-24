import * as ts from 'typescript';
import * as J from '../java/tree';
import * as JS from './tree';
import {ExecutionContext, Markers, ParseError, Parser, ParserInput, randomId, SourceFile, Tree} from "../core";
import {Comment, JRightPadded, Space, TextComment} from "../java/tree";

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

    static builder(): JavaScriptParser.Builder {
        return new JavaScriptParser.Builder();
    }
}

export namespace JavaScriptParser {
    export class Builder extends Parser.Builder {
        build(): JavaScriptParser {
            return new JavaScriptParser();
        }
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
                        this.rightPaddedList<J.Statement>(node.statements),
                        Space.EMPTY
                    );
                }
                break;
            case ts.SyntaxKind.ExpressionStatement:
                if (ts.isExpressionStatement(node)) {
                    return new JS.ExpressionStatement(
                        randomId(),
                        this.visit(node.expression) as J.Expression
                    )
                }
                break;
            case ts.SyntaxKind.VariableStatement:
                let variableStatement = node as ts.VariableStatement;
                return new J.VariableDeclarations(
                    randomId(),
                    this.prefix(node),
                    Markers.EMPTY,
                    [],
                    this.mapModifiers(variableStatement),
                    null,
                    null,
                    [],
                    this.rightPaddedList(variableStatement.declarationList.declarations)
                )
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

    private prefix(node: ts.Node) {
        if (node.getLeadingTriviaWidth(this.sourceFile) == 0) {
            return Space.EMPTY;
        }
        return ParserVisitor.prefixFromNode(node, this.sourceFile);
        // return Space.format(this.sourceFile.text, node.getFullStart(), node.getFullStart() + node.getLeadingTriviaWidth());
    }

    static prefixFromNode(node: ts.Node, sourceFile: ts.SourceFile): Space {
        const comments: Comment[] = [];
        const text = sourceFile.getFullText();
        const nodeStart = node.getFullStart();

        let leadingWhitespacePos = node.getStart();

        // Step 1: Use forEachLeadingCommentRange to extract comments
        ts.forEachLeadingCommentRange(text, nodeStart, (pos, end, kind) => {
            leadingWhitespacePos = Math.min(leadingWhitespacePos, pos);

            const isMultiline = kind === ts.SyntaxKind.MultiLineCommentTrivia;
            const commentStart = isMultiline ? pos + 2 : pos + 2;  // Skip `/*` or `//`
            const commentEnd = isMultiline ? end - 2 : end;  // Exclude closing `*/` or nothing for `//`

            // Step 2: Capture suffix (whitespace after the comment)
            let suffixEnd = end;
            while (suffixEnd < text.length && (text[suffixEnd] === ' ' || text[suffixEnd] === '\t' || text[suffixEnd] === '\n' || text[suffixEnd] === '\r')) {
                suffixEnd++;
            }

            const commentBody = text.slice(commentStart, commentEnd);  // Extract comment body
            const suffix = text.slice(end, suffixEnd);  // Extract suffix (whitespace after comment)

            comments.push(new TextComment(isMultiline, commentBody, suffix, Markers.EMPTY));
        });

        // Step 3: Extract leading whitespace (before the first comment)
        let whitespace = '';
        if (leadingWhitespacePos > node.getFullStart()) {
            whitespace = text.slice(node.getFullStart(), leadingWhitespacePos);
        }

        // Step 4: Return the Space object with comments and leading whitespace
        return new Space(comments, whitespace.length > 0 ? whitespace : null);
    }

    private mapModifiers(node: ts.VariableStatement) {
        return [];
    }

    private rightPaddedList<T extends J.J>(nodes: ts.NodeArray<ts.Node>) {
        return nodes.map((s) => {
            return new JRightPadded(
                this.visit(s) as T,
                Space.EMPTY,
                Markers.EMPTY
            );
        });
    }
}
