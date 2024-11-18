import * as ts from 'typescript';
import * as J from '../java';
import {JavaType, JContainer, JLeftPadded, JRightPadded, Lambda, Semicolon, Space, TrailingComma} from '../java';
import * as JS from '.';
import {
    ExecutionContext,
    Markers,
    ParseError,
    ParseExceptionResult,
    Parser,
    ParserInput,
    randomId,
    SourceFile
} from "../core";
import {binarySearch, compareTextSpans, getNextSibling, TextSpan} from "./parserUtils";
import {JavaScriptTypeMapping} from "./typeMapping";

export class JavaScriptParser extends Parser {

    private readonly compilerOptions: ts.CompilerOptions;
    private readonly sourceFileCache: Map<string, ts.SourceFile> = new Map();
    private oldProgram: ts.Program | undefined;

    constructor() {
        super();
        this.compilerOptions = {
            target: ts.ScriptTarget.Latest,
            module: ts.ModuleKind.CommonJS,
            allowJs: true,
        };
    }

    reset(): this {
        this.sourceFileCache.clear();
        this.oldProgram = undefined;
        return this;
    }

    parseProgramSources(program: ts.Program, relativeTo: string | null, ctx: ExecutionContext): Iterable<SourceFile> {
        const typeChecker = program.getTypeChecker();

        const result: SourceFile[] = [];
        for (const filePath of program.getRootFileNames()) {
            const sourceFile = program.getSourceFile(filePath)!;
            const input = new ParserInput(filePath, null, false, () => Buffer.from(ts.sys.readFile(filePath)!));
            try {
                const parsed = new JavaScriptParserVisitor(this, sourceFile, typeChecker).visit(sourceFile) as SourceFile;
                result.push(parsed);
            } catch (error) {
                result.push(ParseError.build(this, input, relativeTo, ctx, error instanceof Error ? error : new Error('Parser threw unknown error: ' + error), null));
            }
        }
        return result;
    }

    parseInputs(
        inputs: Iterable<ParserInput>,
        relativeTo: string | null,
        ctx: ExecutionContext
    ): Iterable<SourceFile> {
        const inputFiles = new Map<string, ParserInput>();

        // Populate inputFiles map and remove from cache if necessary
        for (const input of inputs) {
            inputFiles.set(input.path, input);
            // Remove from cache if previously cached
            this.sourceFileCache.delete(input.path);
        }

        // Create a new CompilerHost within parseInputs
        const host = ts.createCompilerHost(this.compilerOptions);

        // Override getSourceFile
        host.getSourceFile = (fileName, languageVersion, onError) => {
            // Check if the SourceFile is in the cache
            let sourceFile = this.sourceFileCache.get(fileName);
            if (sourceFile) {
                return sourceFile;
            }

            // Read the file content
            let sourceText: string | undefined;

            // For input files
            const input = inputFiles.get(fileName);
            if (input) {
                sourceText = input.source().toString('utf8');
            } else {
                // For dependency files
                sourceText = ts.sys.readFile(fileName);
            }

            if (sourceText !== undefined) {
                sourceFile = ts.createSourceFile(fileName, sourceText, languageVersion, true);
                // Cache the SourceFile if it's a dependency
                if (!input) {
                    this.sourceFileCache.set(fileName, sourceFile);
                }
                return sourceFile;
            }

            if (onError) onError(`File not found: ${fileName}`);
            return undefined;
        };

        // Override fileExists
        host.fileExists = (fileName) => {
            return inputFiles.has(fileName) || ts.sys.fileExists(fileName);
        };

        // Override readFile
        host.readFile = (fileName) => {
            const input = inputFiles.get(fileName);
            return input
                ? input.source().toString('utf8')
                : ts.sys.readFile(fileName);
        };

        // Create a new Program, passing the oldProgram for incremental parsing
        const program = ts.createProgram([...inputFiles.keys()], this.compilerOptions, host, this.oldProgram);

        // Update the oldProgram reference
        this.oldProgram = program;

        const typeChecker = program.getTypeChecker();

        const result: SourceFile[] = [];
        for (const input of inputFiles.values()) {
            const filePath = input.path;
            const sourceFile = program.getSourceFile(filePath);
            if (sourceFile) {
                try {
                    const parsed = new JavaScriptParserVisitor(this, sourceFile, typeChecker).visit(sourceFile) as SourceFile;
                    result.push(parsed);
                } catch (error) {
                    result.push(ParseError.build(this, input, relativeTo, ctx, error instanceof Error ? error : new Error('Parser threw unknown error: ' + error), null));
                }
            } else {
                result.push(ParseError.build(this, input, relativeTo, ctx, new Error('Parser returned undefined'), null));
            }
        }

        return result;
    }

    accept(path: string): boolean {
        return path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js') || path.endsWith('.jsx');
    }

    sourcePathFromSourceText(prefix: string, sourceCode: string): string {
        return prefix + "/source.ts";
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

// we use this instead of `ts.SyntaxKind[node.kind]` because the numeric values are not unique, and we want
// the first one rather than the last one, as the last ones are things like `FirstToken`, `LastToken`, etc.
const visitMethodMap = new Map<number, string>();
for (const [key, value] of Object.entries(ts.SyntaxKind)) {
    if (typeof value === 'number' && !visitMethodMap.has(value)) {
        visitMethodMap.set(value, 'visit' + key);
    }
}

// noinspection JSUnusedGlobalSymbols
export class JavaScriptParserVisitor {
    private readonly typeMapping: JavaScriptTypeMapping;

    constructor(
        private readonly parser: Parser,
        private readonly sourceFile: ts.SourceFile,
        typeChecker: ts.TypeChecker) {
        this.typeMapping = new JavaScriptTypeMapping(typeChecker);
    }

    visit = (node: ts.Node): any => {
        const member = this[(visitMethodMap.get(node.kind) as keyof JavaScriptParserVisitor)];
        if (typeof member === 'function') {
            return member.bind(this)(node as any);
        } else {
            return this.visitUnknown(node);
        }
    }

    convert = <T extends J.J>(node: ts.Node): T => {
        return this.visit(node) as T;
    }

    visitSourceFile(node: ts.SourceFile): JS.CompilationUnit {
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
            this.semicolonPaddedStatementList(node.statements),
            this.prefix(node.endOfFileToken)
        );
    }

    private semicolonPaddedStatementList(statements: ts.NodeArray<ts.Statement>) {
        return [...statements].map(n => {
            const j: J.Statement = this.convert(n);
            if (j instanceof J.Unknown) {
                // in case of `J.Unknown` its source will already contain any `;`
                return this.rightPadded(j, Space.EMPTY, Markers.EMPTY);
            }
            return this.rightPadded(j, this.semicolonPrefix(n), (n => {
                const last = n.getChildAt(n.getChildCount(this.sourceFile) - 1, this.sourceFile);
                return last?.kind == ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY;
            })?.(n));
        });
    }

    visitUnknown(node: ts.Node) {
        return new J.Unknown(
            randomId(),
            Space.EMPTY,
            Markers.EMPTY,
            new J.Unknown.Source(
                randomId(),
                Space.EMPTY,
                Markers.build([
                    ParseExceptionResult.build(
                        this.parser,
                        new Error("Unsupported AST element: " + node)
                    ).withTreeType(visitMethodMap.get(node.kind)!.substring(5))
                ]),
                node.getFullText()
            )
        );
    }

    private mapModifiers(node: ts.VariableDeclarationList | ts.VariableStatement | ts.ClassDeclaration | ts.PropertyDeclaration
        | ts.FunctionDeclaration | ts.ParameterDeclaration | ts.MethodDeclaration | ts.EnumDeclaration | ts.InterfaceDeclaration
        | ts.PropertySignature | ts.ConstructorDeclaration | ts.ModuleDeclaration | ts.GetAccessorDeclaration | ts.SetAccessorDeclaration) {
        if (ts.isVariableStatement(node) || ts.isModuleDeclaration(node)  || ts.isClassDeclaration(node) || ts.isEnumDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isPropertyDeclaration(node) || ts.isPropertySignature(node) || ts.isParameter(node) || ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node)) {
            return node.modifiers ? node.modifiers?.filter(ts.isModifier).map(this.mapModifier) : [];
        }  else if (ts.isFunctionDeclaration(node)) {
            return [...node.modifiers ? node.modifiers?.filter(ts.isModifier).map(this.mapModifier) : [],
                // empty modifier is used to capture spaces before FunctionKeyword
                new J.Modifier(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.FunctionKeyword)!),
                Markers.EMPTY,
                null,
                J.Modifier.Type.LanguageExtension,
                []
            )]
        }
        else if (ts.isVariableDeclarationList(node)) {
            let modifier: string | undefined;
            if ((node.flags & ts.NodeFlags.Let) !== 0) {
                modifier = "let";
            } else if ((node.flags & ts.NodeFlags.Const) !== 0) {
                modifier = "const";
            } else {
                modifier = "var";
            }
            return modifier ? [new J.Modifier(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                "let",
                J.Modifier.Type.LanguageExtension,
                []
            )] : [];
        } else if (ts.isGetAccessorDeclaration(node)) {
            return (node.modifiers ? node.modifiers?.filter(ts.isModifier).map(this.mapModifier) : []).concat(new J.Modifier(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.GetKeyword)!),
                Markers.EMPTY,
                'get',
                J.Modifier.Type.LanguageExtension,
                []
            ));
        } else if (ts.isSetAccessorDeclaration(node)) {
            return (node.modifiers ? node.modifiers?.filter(ts.isModifier).map(this.mapModifier) : []).concat(new J.Modifier(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.SetKeyword)!),
                Markers.EMPTY,
                'set',
                J.Modifier.Type.LanguageExtension,
                []
            ));
        }
        throw new Error(`Cannot get modifiers from ${node}`);
    }

    private mapModifier = (node: ts.Modifier | ts.ModifierLike) => {
        let kind: J.Modifier.Type;
        switch (node.kind) {
            case ts.SyntaxKind.PublicKeyword:
                kind = J.Modifier.Type.Public;
                break;
            case ts.SyntaxKind.PrivateKeyword:
                kind = J.Modifier.Type.Private;
                break;
            case ts.SyntaxKind.ProtectedKeyword:
                kind = J.Modifier.Type.Protected;
                break;
            case ts.SyntaxKind.StaticKeyword:
                kind = J.Modifier.Type.Static;
                break;
            case ts.SyntaxKind.AbstractKeyword:
                kind = J.Modifier.Type.Abstract;
                break;
            default:
                kind = J.Modifier.Type.LanguageExtension;
        }
        return new J.Modifier(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            kind == J.Modifier.Type.LanguageExtension ? node.getText() : null,
            kind,
            []
        );
    }

    private rightPadded<T>(t: T, trailing: Space, markers?: Markers) {
        return new JRightPadded<T>(t, trailing, markers ?? Markers.EMPTY);
    }

    // private rightPaddedList<N extends ts.Node, T extends J.J>(nodes: ts.NodeArray<N>, trailing: (node: N) => Space, markers?: (node: N) => Markers): JRightPadded<T>[] {
    //     return nodes.map(n => this.rightPadded(this.convert(n), trailing(n), markers?.(n)));
    // }

    private rightPaddedList<N extends ts.Node, T extends J.J>(nodes: N[], trailing: (node: N) => Space, markers?: (node: N) => Markers): JRightPadded<T>[] {
        return nodes.map(n => this.rightPadded(this.convert(n), trailing(n), markers?.(n)));
    }

    private rightPaddedSeparatedList<N extends ts.Node, T extends J.J>(nodes: N[], separator: ts.PunctuationSyntaxKind, markers?: (nodes: N[], i: number) => Markers): JRightPadded<T>[] {
        if (nodes.length === 0) {
            return [];
        }
        const ts: JRightPadded<T>[] = [];

        for (let i = 0; i < nodes.length - 1; i += 2) {
            // FIXME right padding and trailing comma
            ts.push(this.rightPadded(
                this.convert(nodes[i]),
                this.prefix(nodes[i + 1]),
                markers ? markers(nodes, i) : Markers.EMPTY
            ));
        }
        if ((nodes.length & 1) === 1) {
            ts.push(this.rightPadded(this.convert(nodes[nodes.length - 1]), Space.EMPTY, markers ? markers(nodes, nodes.length - 1) : Markers.EMPTY));
        }

        return ts;
    }

    private leftPadded<T>(before: Space, t: T, markers?: Markers) {
        return new JLeftPadded<T>(before, t, markers ?? Markers.EMPTY);
    }

    private leftPaddedList<N extends ts.Node, T extends J.J>(before: (node: N) => Space, nodes: ts.NodeArray<N>, markers?: (node: N) => Markers): JLeftPadded<T>[] {
        return nodes.map(n => this.leftPadded(before(n), this.convert(n), markers?.(n)));
    }

    private semicolonPrefix = (node: ts.Node) => {
        const last = node.getChildren(this.sourceFile).slice(-1)[0];
        return last?.kind == ts.SyntaxKind.SemicolonToken ? this.prefix(last) : Space.EMPTY;
    }

    private keywordPrefix = (token: ts.PunctuationSyntaxKind) => (node: ts.Node): Space => {
        const last = getNextSibling(node);
        return last?.kind == token ? this.prefix(last) : Space.EMPTY;
    }

    visitClassDeclaration(node: ts.ClassDeclaration) {
        return new J.ClassDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapDecorators(node),
            this.mapModifiers(node),
            new J.ClassDeclaration.Kind(
                randomId(),
                node.modifiers ? this.suffix(node.modifiers[node.modifiers.length - 1]) : this.prefix(node),
                Markers.EMPTY,
                [],
                J.ClassDeclaration.Kind.Type.Class
            ),
            node.name ? this.convert(node.name) : this.mapIdentifier(node, ""),
            this.mapTypeParametersAsJContainer(node),
            null, // FIXME primary constructor
            this.mapExtends(node),
            this.mapImplements(node),
            null,
            new J.Block(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenBraceToken)!),
                Markers.EMPTY,
                new JRightPadded(false, Space.EMPTY, Markers.EMPTY),
                node.members.map((ce : ts.ClassElement) => new JRightPadded(
                    this.convert(ce),
                    ce.getLastToken()?.kind === ts.SyntaxKind.SemicolonToken ? this.prefix(ce.getLastToken()!) : Space.EMPTY,
                    ce.getLastToken()?.kind === ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
                )),
                this.prefix(node.getLastToken()!)
            ),
            this.mapType(node)
        );
    }

    private mapExtends(node: ts.ClassDeclaration | ts.ClassExpression): JLeftPadded<J.TypeTree> | null {
        if (node.heritageClauses == undefined || node.heritageClauses.length == 0) {
            return null;
        }
        for (let heritageClause of node.heritageClauses) {
            if (heritageClause.token == ts.SyntaxKind.ExtendsKeyword) {
                return this.leftPadded(this.prefix(heritageClause.getFirstToken()!), this.visit(heritageClause.types[0]));
            }
        }
        return null;
    }

    private mapInterfaceExtends(node: ts.InterfaceDeclaration): JContainer<J.TypeTree> | null {
        if (node.heritageClauses == undefined || node.heritageClauses.length == 0) {
            return null;
        }
        for (let heritageClause of node.heritageClauses) {
            if ((heritageClause.token == ts.SyntaxKind.ExtendsKeyword)) {
                const _extends: JRightPadded<J.TypeTree>[] = [];
                for (let type of heritageClause.types) {
                    _extends.push(this.rightPadded(this.visit(type), this.suffix(type)));
                }
                return _extends.length > 0 ? new JContainer(
                    this.prefix(heritageClause.getFirstToken()!),
                    _extends,
                    Markers.EMPTY
                ) : null;
            }
        }
        return null;
    }

    private mapImplements(node: ts.ClassDeclaration | ts.ClassExpression): JContainer<J.TypeTree> | null {
        if (node.heritageClauses == undefined || node.heritageClauses.length == 0) {
            return null;
        }
        for (let heritageClause of node.heritageClauses) {
            if (heritageClause.token == ts.SyntaxKind.ImplementsKeyword) {
                const _implements: JRightPadded<J.TypeTree>[] = [];
                for (let type of heritageClause.types) {
                    _implements.push(this.rightPadded(this.visit(type), this.suffix(type)));
                }
                return _implements.length > 0 ? new JContainer(
                    this.prefix(heritageClause.getFirstToken()!),
                    _implements,
                    Markers.EMPTY
                ) : null;
            }
        }
        return null;
    }

    visitNumericLiteral(node: ts.NumericLiteral) {
        return this.mapLiteral(node, node.text); // FIXME value not in AST
    }

    visitTrueKeyword(node: ts.TrueLiteral) {
        return this.mapLiteral(node, true);
    }

    visitNumberKeyword(node: ts.Node) {
        return this.mapIdentifier(node, 'number');
    }

    visitBooleanKeyword(node: ts.Node) {
        return this.mapIdentifier(node, 'boolean');
    }

    visitStringKeyword(node: ts.Node) {
        return this.mapIdentifier(node, 'string');
    }

    visitUndefinedKeyword(node: ts.Node) {
        return this.mapIdentifier(node, 'undefined');
    }

    visitAnyKeyword(node: ts.Node) {
        return this.mapIdentifier(node, 'any');
    }

    visitUnknownKeyword(node: ts.Node) {
        return this.mapIdentifier(node, 'unknown');
    }

    visitVoidKeyword(node: ts.Node) {
        return this.mapIdentifier(node, 'void');
    }

    visitFalseKeyword(node: ts.FalseLiteral) {
        return this.mapLiteral(node, false);
    }

    visitNullKeyword(node: ts.NullLiteral) {
        return this.mapLiteral(node, null);
    }

    private mapLiteral(node: ts.LiteralExpression | ts.TrueLiteral | ts.FalseLiteral | ts.NullLiteral | ts.Identifier, value: any): J.Literal {
        return new J.Literal(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            value,
            node.getText(),
            null,
            this.mapPrimitiveType(node)
        );
    }

    visitBigIntLiteral(node: ts.BigIntLiteral) {
        return this.mapLiteral(node, node.text); // FIXME value not in AST
    }

    visitStringLiteral(node: ts.StringLiteral) {
        return this.mapLiteral(node, node.text); // FIXME value not in AST
    }

    visitJsxText(node: ts.JsxText) {
        return this.visitUnknown(node);
    }

    visitRegularExpressionLiteral(node: ts.RegularExpressionLiteral) {
        return this.mapLiteral(node, node.text); // FIXME value not in AST
    }

    visitNoSubstitutionTemplateLiteral(node: ts.NoSubstitutionTemplateLiteral) {
        return this.mapLiteral(node, node.text); // FIXME value not in AST
    }

    visitTemplateHead(node: ts.TemplateHead) {
        return this.visitUnknown(node);
    }

    visitTemplateMiddle(node: ts.TemplateMiddle) {
        return this.visitUnknown(node);
    }

    visitTemplateTail(node: ts.TemplateTail) {
        return this.visitUnknown(node);
    }

    visitIdentifier(node: ts.Identifier) {
        if (node.text === 'undefined') {
            // unsure why this appears as a ts.Identifier in the AST
            return this.mapLiteral(node, undefined);
        }
        return this.mapIdentifier(node, node.text);
    }

    private mapIdentifier(node: ts.Node, name: string, withType: boolean = true) {
        let type = withType ? this.mapType(node) : null;
        return new J.Identifier(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [], // FIXME decorators
            name,
            type instanceof JavaType.Variable ? type.type : type,
            type instanceof JavaType.Variable ? type : null
        )
    }

    visitThisKeyword(node: ts.ThisExpression) {
        return this.mapIdentifier(node, 'this');
    }

    visitPrivateIdentifier(node: ts.PrivateIdentifier) {
        return this.mapIdentifier(node, node.text);
    }

    visitQualifiedName(node: ts.QualifiedName) {
        return new J.FieldAccess(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.visit(node.left),
            this.leftPadded(this.suffix(node.left), this.convert(node.right)),
            this.mapType(node)
        );
    }

    visitComputedPropertyName(node: ts.ComputedPropertyName) {
        // using a `J.NewArray` is a bit of a trick; in the TS Compiler AST there is no array for this
        return new J.NewArray(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            null,
            [],
            new JContainer(Space.EMPTY, [this.rightPadded(this.convert(node.expression), this.suffix(node.expression))], Markers.EMPTY),
            this.mapType(node)
        );
    }

    visitTypeParameter(node: ts.TypeParameterDeclaration) {
        if (node.constraint || (node.modifiers && node.modifiers.length) || node.default) {
            return this.visitUnknown(node);
        }

        return new J.TypeParameter(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            [],
            this.visit(node.name),
            null
        );
    }

    visitParameter(node: ts.ParameterDeclaration) {
        if (node.questionToken) {
            return new JS.JSVariableDeclarations(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                [],
                this.mapModifiers(node),
                this.mapTypeInfo(node),
                null,
                [this.rightPadded(
                    new JS.JSVariableDeclarations.JSNamedVariable(
                        randomId(),
                        this.prefix(node.name),
                        Markers.EMPTY,
                        this.getOptionalUnary(node),
                        [],
                        node.initializer ? this.leftPadded(this.prefix(node.getChildAt(node.getChildCount(this.sourceFile) - 2)), this.visit(node.initializer)) : null,
                        this.mapVariableType(node)
                    ),
                    this.suffix(node.name)
                )]
            );
        }

        return new J.VariableDeclarations(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            this.mapModifiers(node),
            this.mapTypeInfo(node),
            null,
            [],
            [this.rightPadded(
                new J.VariableDeclarations.NamedVariable(
                    randomId(),
                    this.prefix(node.name),
                    Markers.EMPTY,
                    this.visit(node.name),
                    [],
                    node.initializer ? this.leftPadded(this.prefix(node.getChildAt(node.getChildCount(this.sourceFile) - 2)), this.visit(node.initializer)) : null,
                    this.mapVariableType(node)
                ),
                this.suffix(node.name)
            )]
        );
    }

    visitDecorator(node: ts.Decorator) {
        let annotationType: J.NameTree;
        let _arguments: JContainer<J.Expression> | null = null;

        if (ts.isCallExpression(node.expression)) {
            let callExpression: J.MethodInvocation = this.convert(node.expression);
            annotationType = callExpression.select === null ? callExpression.name :
                new J.FieldAccess(
                    randomId(),
                    callExpression.prefix,
                    Markers.EMPTY,
                    callExpression.select,
                    this.leftPadded(callExpression.padding.select!.after, callExpression.name),
                    callExpression.type
                );
            _arguments = callExpression.padding.arguments;
        } else if (ts.isIdentifier(node.expression)) {
            annotationType = this.convert(node.expression);
        } else if (ts.isPropertyAccessExpression(node.expression)) {
            annotationType = this.convert(node.expression);
        } else {
            return this.visitUnknown(node);
        }

        return new J.Annotation(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            annotationType,
            _arguments
        );
    }

    visitPropertySignature(node: ts.PropertySignature) {
        if (node.questionToken) {
            return new JS.JSVariableDeclarations(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                [], // no decorators allowed
                this.mapModifiers(node),
                this.mapTypeInfo(node),
                null,
                [this.rightPadded(
                    new JS.JSVariableDeclarations.JSNamedVariable(
                        randomId(),
                        this.prefix(node.name),
                        Markers.EMPTY,
                        this.getOptionalUnary(node),
                        [],
                        null,
                        this.mapVariableType(node)
                    ),
                    Space.EMPTY
                )]
            );
        }

        return new J.VariableDeclarations(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [], // no decorators allowed
            this.mapModifiers(node),
            this.mapTypeInfo(node),
            null,
            [],
            [this.rightPadded(
                new J.VariableDeclarations.NamedVariable(
                    randomId(),
                    this.prefix(node.name),
                    Markers.EMPTY,
                    this.visit(node.name),
                    [],
                    null,
                    this.mapVariableType(node)
                ),
                Space.EMPTY
            )]
        );
    }

    visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        if (node.questionToken) {
            return new JS.JSVariableDeclarations(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                [],
                this.mapModifiers(node),
                this.mapTypeInfo(node),
                null,
                [this.rightPadded(
                    new JS.JSVariableDeclarations.JSNamedVariable(
                        randomId(),
                        this.prefix(node.name),
                        Markers.EMPTY,
                        this.getOptionalUnary(node),
                        [],
                        node.initializer ? this.leftPadded(this.prefix(node.getChildAt(node.getChildren().indexOf(node.initializer) - 1)), this.visit(node.initializer)) : null,
                        this.mapVariableType(node)
                    ),
                    Space.EMPTY
                )]
            );
        }

        return new J.VariableDeclarations(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            this.mapModifiers(node),
            this.mapTypeInfo(node),
            null,
            [],
            [this.rightPadded(
                new J.VariableDeclarations.NamedVariable(
                    randomId(),
                    this.prefix(node.name),
                    Markers.EMPTY,
                    this.visit(node.name),
                    [],
                    node.initializer ? this.leftPadded(this.prefix(node.getChildAt(node.getChildren().indexOf(node.initializer) - 1)), this.visit(node.initializer)) : null,
                    this.mapVariableType(node)
                ),
                Space.EMPTY
            )]
        );
    }

    visitMethodSignature(node: ts.MethodSignature) {
        if (node.questionToken) {
            return new JS.JSMethodDeclaration(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                [], // no decorators allowed
                [], // no modifiers allowed
                this.mapTypeParametersAsObject(node),
                this.mapTypeInfo(node),
                this.getOptionalUnary(node),
                this.mapCommaSeparatedList(this.getParameterListNodes(node)),
                null,
                null,
                null,
                this.mapMethodType(node)
            );
        }

        return new J.MethodDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [], // no decorators allowed
            [], // no modifiers allowed
            this.mapTypeParametersAsObject(node),
            this.mapTypeInfo(node),
            new J.MethodDeclaration.IdentifierWithAnnotations(
                node.name ? this.visit(node.name) : this.mapIdentifier(node, ""),
                []
            ),
            this.mapCommaSeparatedList(this.getParameterListNodes(node)),
            null,
            null,
            null,
            this.mapMethodType(node)
        );
    }

    visitMethodDeclaration(node: ts.MethodDeclaration) {
        if (node.questionToken) {
            return new JS.JSMethodDeclaration(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.mapDecorators(node),
                this.mapModifiers(node),
                this.mapTypeParametersAsObject(node),
                this.mapTypeInfo(node),
                this.getOptionalUnary(node),
                this.mapCommaSeparatedList(this.getParameterListNodes(node)),
                null,
                node.body ? this.convert<J.Block>(node.body) : null,
                null,
                this.mapMethodType(node)
            );
        }

        return new J.MethodDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapDecorators(node),
            this.mapModifiers(node),
            this.mapTypeParametersAsObject(node),
            this.mapTypeInfo(node),
            new J.MethodDeclaration.IdentifierWithAnnotations(
                node.name ? this.visit(node.name) : this.mapIdentifier(node, ""),
                []
            ),
            this.mapCommaSeparatedList(this.getParameterListNodes(node)),
            null,
            node.body ? this.convert<J.Block>(node.body) : null,
            null,
            this.mapMethodType(node)
        );
    }

    private mapTypeInfo(node: ts.MethodDeclaration | ts.PropertyDeclaration | ts.VariableDeclaration | ts.ParameterDeclaration
        | ts.PropertySignature | ts.MethodSignature | ts.ArrowFunction | ts.CallSignatureDeclaration | ts.GetAccessorDeclaration
        | ts.FunctionDeclaration | ts.ConstructSignatureDeclaration | ts.FunctionExpression) {
        return node.type ? new JS.TypeInfo(randomId(), this.prefix(node.getChildAt(node.getChildren().indexOf(node.type) - 1)), Markers.EMPTY, this.visit(node.type)) : null;
    }

    visitClassStaticBlockDeclaration(node: ts.ClassStaticBlockDeclaration) {
        return new J.Block(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            new JRightPadded(true, this.prefix(this.findChildNode(node.body, ts.SyntaxKind.OpenBraceToken)!), Markers.EMPTY),
            node.body.statements.map(ce => new JRightPadded(
                this.convert(ce),
                ce.getLastToken()?.kind === ts.SyntaxKind.SemicolonToken ? this.prefix(ce.getLastToken()!) : Space.EMPTY,
                ce.getLastToken()?.kind === ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
            )),
            this.prefix(node.getLastToken()!)
        );
    }

    visitConstructor(node: ts.ConstructorDeclaration) {
        return new J.MethodDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapDecorators(node),
            this.mapModifiers(node),
            null,
            null,
            new J.MethodDeclaration.IdentifierWithAnnotations(
                this.mapIdentifier(node.getChildren().find(n => n.kind == ts.SyntaxKind.ConstructorKeyword)!, "constructor"), []
            ),
            this.mapCommaSeparatedList(this.getParameterListNodes(node)),
            null,
            node.body ? this.convert<J.Block>(node.body) : null,
            null,
            this.mapMethodType(node)
        );
    }

    visitGetAccessor(node: ts.GetAccessorDeclaration) {
        return new J.MethodDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            this.mapModifiers(node),
            null,
            this.mapTypeInfo(node),
            new J.MethodDeclaration.IdentifierWithAnnotations(
                this.visit(node.name),
                []
            ),
            this.mapCommaSeparatedList(this.getParameterListNodes(node)),
            null,
            node.body ? this.convert<J.Block>(node.body) : null,
            null,
            this.mapMethodType(node)
        );
    }

    visitSetAccessor(node: ts.SetAccessorDeclaration) {
        return new J.MethodDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            this.mapModifiers(node),
            null,
            null,
            new J.MethodDeclaration.IdentifierWithAnnotations(
                this.visit(node.name),
                []
            ),
            this.mapCommaSeparatedList(this.getParameterListNodes(node)),
            null,
            node.body ? this.convert<J.Block>(node.body) : null,
            null,
            this.mapMethodType(node)
        );
    }

    visitCallSignature(node: ts.CallSignatureDeclaration) {
        return new J.MethodDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            [],
            this.mapTypeParametersAsObject(node),
            this.mapTypeInfo(node),
            new J.MethodDeclaration.IdentifierWithAnnotations(
                new J.Identifier(
                    randomId(),
                    Space.EMPTY/* this.prefix(node.getChildren().find(n => n.kind == ts.SyntaxKind.OpenBraceToken)!) */,
                    Markers.EMPTY,
                    [], // FIXME decorators
                    "",
                    null,
                    null
                ), []
            ),
            this.mapCommaSeparatedList(this.getParameterListNodes(node)),
            null,
            null,
            null,
            this.mapMethodType(node)
        );
    }

    visitConstructSignature(node: ts.ConstructSignatureDeclaration) {
        return new J.MethodDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [], // no decorators allowed
            [], // no modifiers allowed
            this.mapTypeParametersAsObject(node),
            this.mapTypeInfo(node),
            new J.MethodDeclaration.IdentifierWithAnnotations(
                new J.Identifier(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    [],
                    'new',
                    null,
                    null
                ),
                []
            ),
            this.mapCommaSeparatedList(this.getParameterListNodes(node)),
            null,
            null,
            null,
            this.mapMethodType(node)
        );
    }

    visitIndexSignature(node: ts.IndexSignatureDeclaration) {
        return this.visitUnknown(node);
    }

    visitTypePredicate(node: ts.TypePredicateNode) {
        return this.visitUnknown(node);
    }

    visitTypeReference(node: ts.TypeReferenceNode) {
        if (node.typeArguments) {
            return new J.ParameterizedType(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.visit(node.typeName),
                this.mapTypeArguments(this.suffix(node.typeName), node.typeArguments),
                this.mapType(node)
            )
        }
        return this.visit(node.typeName);
    }

    visitFunctionType(node: ts.FunctionTypeNode) {
        return new JS.FunctionType(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            new JContainer(
                this.prefix(node),
                node.parameters.map(p => this.rightPadded(this.visit(p), this.suffix(p))),
                Markers.EMPTY),
            this.prefix(node.getChildren().find(v => v.kind === ts.SyntaxKind.EqualsGreaterThanToken)!),
            this.convert(node.type),
            null);
    }

    visitConstructorType(node: ts.ConstructorTypeNode) {
        return this.visitUnknown(node);
    }

    visitTypeQuery(node: ts.TypeQueryNode) {
        return this.visitUnknown(node);
    }

    visitTypeLiteral(node: ts.TypeLiteralNode) {
        return this.visitUnknown(node);
    }

    visitArrayType(node: ts.ArrayTypeNode) {
        return this.visitUnknown(node);
    }

    visitTupleType(node: ts.TupleTypeNode) {
        return this.visitUnknown(node);
    }

    visitOptionalType(node: ts.OptionalTypeNode) {
        return this.visitUnknown(node);
    }

    visitRestType(node: ts.RestTypeNode) {
        return this.visitUnknown(node);
    }

    visitUnionType(node: ts.UnionTypeNode) {
        return new JS.Union(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPaddedList([...node.types], (n) => this.keywordPrefix(ts.SyntaxKind.BarToken)(n)),
            this.mapType(node),
        );
    }

    visitIntersectionType(node: ts.IntersectionTypeNode) {
        return this.visitUnknown(node);
    }

    visitConditionalType(node: ts.ConditionalTypeNode) {
        return this.visitUnknown(node);
    }

    visitInferType(node: ts.InferTypeNode) {
        return this.visitUnknown(node);
    }

    visitParenthesizedType(node: ts.ParenthesizedTypeNode) {
        return this.visitUnknown(node);
    }

    visitThisType(node: ts.ThisTypeNode) {
        return this.visitUnknown(node);
    }

    visitTypeOperator(node: ts.TypeOperatorNode) {
        return this.visitUnknown(node);
    }

    visitIndexedAccessType(node: ts.IndexedAccessTypeNode) {
        return this.visitUnknown(node);
    }

    visitMappedType(node: ts.MappedTypeNode) {
        return this.visitUnknown(node);
    }

    visitLiteralType(node: ts.LiteralTypeNode) {
        return this.visit(node.literal);
    }

    visitNamedTupleMember(node: ts.NamedTupleMember) {
        return this.visitUnknown(node);
    }

    visitTemplateLiteralType(node: ts.TemplateLiteralTypeNode) {
        return this.visitUnknown(node);
    }

    visitTemplateLiteralTypeSpan(node: ts.TemplateLiteralTypeSpan) {
        return this.visitUnknown(node);
    }

    visitImportType(node: ts.ImportTypeNode) {
        return this.visitUnknown(node);
    }

    visitObjectBindingPattern(node: ts.ObjectBindingPattern) {
        return this.visitUnknown(node);
    }

    visitArrayBindingPattern(node: ts.ArrayBindingPattern) {
        return this.visitUnknown(node);
    }

    visitBindingElement(node: ts.BindingElement) {
        return this.visitUnknown(node);
    }

    visitArrayLiteralExpression(node: ts.ArrayLiteralExpression) {
        return new J.NewArray(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            null,
            [],
            this.mapCommaSeparatedList(node.getChildren(this.sourceFile)),
            this.mapType(node)
        );
    }

    visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        return new J.NewClass(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            null,
            Space.EMPTY,
            null,
            JContainer.empty(),
            this.convertPropertyAssignments(node.getChildren(this.sourceFile).slice(-3)),
            this.mapMethodType(node)
        );
    }

    private convertPropertyAssignments(nodes: ts.Node[]): J.Block {
        const prefix = this.prefix(nodes[0]);
        let statementList = nodes[1] as ts.SyntaxList;

        const statements: JRightPadded<J.Statement>[] = this.rightPaddedSeparatedList(
            [...statementList.getChildren(this.sourceFile)],
            ts.SyntaxKind.CommaToken,
            (nodes, i) => i == nodes.length - 2 && nodes[i + 1].kind == ts.SyntaxKind.CommaToken ? Markers.build([new TrailingComma(randomId(), this.prefix(nodes[i + 1]))]) : Markers.EMPTY
        );

        return new J.Block(
            randomId(),
            prefix,
            Markers.EMPTY,
            this.rightPadded(false, Space.EMPTY),
            statements,
            this.prefix(nodes[nodes.length - 1])
        );
    }

    visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
        return new J.FieldAccess(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.questionDotToken ?
                new JS.Unary(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    this.leftPadded(this.suffix(node.expression), JS.Unary.Type.QuestionDot),
                    this.visit(node.expression),
                    this.mapType(node)
                ) : this.convert(node.expression),
            this.leftPadded(this.prefix(node.getChildAt(1, this.sourceFile)), this.convert(node.name)),
            this.mapType(node)
        );
    }

    visitElementAccessExpression(node: ts.ElementAccessExpression) {
        return new J.ArrayAccess(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.visit(node.expression),
            new J.ArrayDimension(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenBracketToken)!),
                Markers.EMPTY,
                this.rightPadded(this.visit(node.argumentExpression), this.suffix(node.argumentExpression))
            ),
            this.mapType(node)
        );
    }

    visitCallExpression(node: ts.CallExpression) {
        const prefix = this.prefix(node);
        let select: JRightPadded<J.Expression> | null;
        let name: J.Identifier;
        if (ts.isPropertyAccessExpression(node.expression)) {
            select = this.rightPadded(
                node.expression.questionDotToken ?
                    new JS.Unary(
                        randomId(),
                        Space.EMPTY,
                        Markers.EMPTY,
                        this.leftPadded(this.suffix(node.expression.expression), JS.Unary.Type.QuestionDot),
                        this.visit(node.expression.expression),
                        this.mapType(node)
                    ) :
                    this.convert<J.Expression>(node.expression.expression),
                this.prefix(node.expression.getChildAt(1, this.sourceFile))
            );
            name = this.convert(node.expression.name);
        } else {
            select = null;
            name = this.convert(node.expression);
        }
        return new J.MethodInvocation(
            randomId(),
            prefix,
            Markers.EMPTY,
            select,
            null, // FIXME type parameters
            name,
            this.mapCommaSeparatedList(node.getChildren(this.sourceFile).slice(-3)),
            this.mapMethodType(node)
        );
    }

    visitNewExpression(node: ts.NewExpression) {
        return new J.NewClass(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            null,
            Space.EMPTY,
            this.visit(node.expression),
            this.mapCommaSeparatedList(node.arguments ? node.getChildren(this.sourceFile).slice(2) : []),
            null,
            this.mapMethodType(node)
        );
    }

    visitTaggedTemplateExpression(node: ts.TaggedTemplateExpression) {
        return this.visitUnknown(node);
    }

    visitTypeAssertionExpression(node: ts.TypeAssertion) {
        return new J.TypeCast(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            new J.ControlParentheses(
                randomId(),
                this.prefix(node.getFirstToken()!),
                Markers.EMPTY,
                this.rightPadded(this.convert(node.type), this.prefix(node.getChildAt(2, this.sourceFile)))
            ),
            this.convert(node.expression)
        );
    }

    visitParenthesizedExpression(node: ts.ParenthesizedExpression) {
        return new J.Parentheses(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(this.convert(node.expression), this.prefix(node.getLastToken()!))
        )
    }

    visitFunctionExpression(node: ts.FunctionExpression) {
        return new JS.FunctionDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            null,
            this.mapTypeParametersAsObject(node),
            this.mapCommaSeparatedList(this.getParameterListNodes(node)),
            this.mapTypeInfo(node),
            this.convert(node.body),
            this.mapMethodType(node)
        );
    }

    visitArrowFunction(node: ts.ArrowFunction) {
        return new JS.ArrowFunction(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            [],
            new Lambda.Parameters(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                true,
                node.parameters.length > 0 ?
                    node.parameters.map(p => this.rightPadded(this.convert(p), this.suffix(p))) :
                    [this.rightPadded(this.newJEmpty(), this.prefix(node.getChildren().find(n => n.kind === ts.SyntaxKind.CloseParenToken)!))] // to handle the case: (/*no*/) => ...
            ),
            this.mapTypeInfo(node),
            this.prefix(node.equalsGreaterThanToken),
            node.body ? this.convert<J.Block>(node.body) : this.newJEmpty(),
            null
        );
    }

    visitDeleteExpression(node: ts.DeleteExpression) {
        return new JS.Delete(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.convert(node.expression),
            this.mapType(node)
        );
    }

    visitTypeOfExpression(node: ts.TypeOfExpression) {
        return new JS.TypeOf(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.convert(node.expression),
            this.mapType(node)
        )
    }

    visitVoidExpression(node: ts.VoidExpression) {
        return new JS.Void(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.convert(node.expression)
        );
    }

    visitAwaitExpression(node: ts.AwaitExpression) {
        return new JS.Await(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.convert(node.expression),
            this.mapType(node)
        );
    }

    visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        let unaryOperator: J.Unary.Type | undefined;
        switch (node.operator) {
            case ts.SyntaxKind.PlusToken:
                unaryOperator = J.Unary.Type.Positive;
                break;
            case ts.SyntaxKind.MinusToken:
                unaryOperator = J.Unary.Type.Negative;
                break;
            case ts.SyntaxKind.ExclamationToken:
                unaryOperator = J.Unary.Type.Not;
                break;
            case ts.SyntaxKind.PlusPlusToken:
                unaryOperator = J.Unary.Type.PreIncrement;
                break;
            case ts.SyntaxKind.MinusMinusToken:
                unaryOperator = J.Unary.Type.PreDecrement;
                break;
            case ts.SyntaxKind.TildeToken:
                unaryOperator = J.Unary.Type.Complement;
        }

        if (unaryOperator === undefined) {
            return this.visitUnknown(node);
        }

        return new J.Unary(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.leftPadded(this.prefix(node.getFirstToken()!), unaryOperator),
            this.convert(node.operand),
            this.mapType(node)
        );
    }

    visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression) {
        let unaryOperator: J.Unary.Type | undefined;
        switch (node.operator) {
            case ts.SyntaxKind.PlusPlusToken:
                unaryOperator = J.Unary.Type.PostIncrement;
                break;
            case ts.SyntaxKind.MinusMinusToken:
                unaryOperator = J.Unary.Type.PostDecrement;
                break;
        }

        if (unaryOperator === undefined) {
            return this.visitUnknown(node);
        }

        return new J.Unary(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.leftPadded(this.prefix(node.getFirstToken()!), unaryOperator),
            this.convert(node.operand),
            this.mapType(node)
        );
    }

    visitBinaryExpression(node: ts.BinaryExpression) {
        if (node.operatorToken.kind == ts.SyntaxKind.EqualsToken) {
            // assignment is also represented as `ts.BinaryExpression`
            return new J.Assignment(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.convert(node.left),
                this.leftPadded(this.suffix(node.left), this.convert(node.right)),
                this.mapType(node)
            );
        }

        let binaryOperator: J.Binary.Type | JS.JsBinary.Type | undefined;
        switch (node.operatorToken.kind) {
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
                binaryOperator = JS.JsBinary.Type.IdentityEquals;
                break;
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
                binaryOperator = JS.JsBinary.Type.IdentityNotEquals;
                break;
            case ts.SyntaxKind.QuestionQuestionToken:
                binaryOperator = JS.JsBinary.Type.QuestionQuestion;
                break;
        }

        if (binaryOperator !== undefined) {
            return new JS.JsBinary(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.convert(node.left),
                this.leftPadded(this.prefix(node.operatorToken), binaryOperator as JS.JsBinary.Type),
                this.convert(node.right),
                this.mapType(node)
            );
        }

        if (node.operatorToken.kind == ts.SyntaxKind.InstanceOfKeyword) {
            return new J.InstanceOf(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.rightPadded(this.convert(node.left), this.prefix(node.operatorToken)),
                this.convert(node.right),
                null,
                this.mapType(node)
            );
        }

        binaryOperator = this.mapBinaryOperator(node);
        if (binaryOperator === undefined) {
            return this.visitUnknown(node);
        }

        return new J.Binary(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.convert(node.left),
            this.leftPadded(this.prefix(node.operatorToken), binaryOperator),
            this.convert(node.right),
            this.mapType(node)
        )
    }

    private mapBinaryOperator(node: ts.BinaryExpression): J.Binary.Type | undefined {
        switch (node.operatorToken.kind) {
            case ts.SyntaxKind.PlusToken:
                return J.Binary.Type.Addition;
            case ts.SyntaxKind.MinusToken:
                return J.Binary.Type.Subtraction;
            case ts.SyntaxKind.AsteriskToken:
                return J.Binary.Type.Multiplication;
            case ts.SyntaxKind.SlashToken:
                return J.Binary.Type.Division;
            case ts.SyntaxKind.PercentToken:
                return J.Binary.Type.Modulo;
            case ts.SyntaxKind.LessThanLessThanToken:
                return J.Binary.Type.LeftShift;
            case ts.SyntaxKind.GreaterThanGreaterThanToken:
                return J.Binary.Type.RightShift;
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
                return J.Binary.Type.UnsignedRightShift;
            // case ts.SyntaxKind.LessThanLessThanEqualsToken:
            //     return J.Binary.Type.LeftShiftEquals;
            // case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
            //     return J.Binary.Type.RightShiftEquals;

            case ts.SyntaxKind.AmpersandToken:
                return J.Binary.Type.BitAnd;
            // case ts.SyntaxKind.AmpersandEqualsToken:
            //     return J.Binary.Type.BitwiseAndEquals;
            case ts.SyntaxKind.BarToken:
                return J.Binary.Type.BitOr;
            // case ts.SyntaxKind.BarEqualsToken:
            //     return J.Binary.Type.BitwiseOrEquals;
            case ts.SyntaxKind.CaretToken:
                return J.Binary.Type.BitXor;
            // case ts.SyntaxKind.CaretEqualsToken:
            //     return J.Binary.Type.BitwiseXorEquals;

            case ts.SyntaxKind.EqualsEqualsToken:
                return J.Binary.Type.Equal;
            // case ts.SyntaxKind.EqualsEqualsEqualsToken:
            //     return J.Binary.Type.StrictEquals;
            case ts.SyntaxKind.ExclamationEqualsToken:
                return J.Binary.Type.NotEqual;
            // case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            //     return J.Binary.Type.StrictNotEquals;
            case ts.SyntaxKind.LessThanToken:
                return J.Binary.Type.LessThan;
            case ts.SyntaxKind.LessThanEqualsToken:
                return J.Binary.Type.LessThanOrEqual;
            case ts.SyntaxKind.GreaterThanToken:
                return J.Binary.Type.GreaterThan;
            case ts.SyntaxKind.GreaterThanEqualsToken:
                return J.Binary.Type.GreaterThanOrEqual;

            case ts.SyntaxKind.AmpersandAmpersandToken:
                return J.Binary.Type.And;
            case ts.SyntaxKind.BarBarToken:
                return J.Binary.Type.Or;
            // case ts.SyntaxKind.BarBarEqualsToken:
            //     return J.Binary.Type.OrEquals;
            // case ts.SyntaxKind.AmpersandEqualsToken:
            //     return J.Binary.Type.AndEquals;
        }
        return undefined;
    }

    visitConditionalExpression(node: ts.ConditionalExpression) {
        return new J.Ternary(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.convert(node.condition),
            this.leftPadded(this.suffix(node.condition), this.convert(node.whenTrue)),
            this.leftPadded(this.suffix(node.whenTrue), this.convert(node.whenFalse)),
            this.mapType(node)
        );
    }

    visitTemplateExpression(node: ts.TemplateExpression) {
        return this.visitUnknown(node);
    }

    visitYieldExpression(node: ts.YieldExpression) {
        return new JS.Yield(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            false,
            node.expression ? this.visit(node.expression) : null,
            this.mapType(node)
        );
    }

    visitSpreadElement(node: ts.SpreadElement) {
        return new JS.Unary(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.leftPadded(Space.EMPTY, JS.Unary.Type.Spread),
            this.convert(node.expression),
            this.mapType(node)
        );
    }

    visitClassExpression(node: ts.ClassExpression) {
        return new JS.StatementExpression(
            randomId(),
            new J.ClassDeclaration(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                [], //this.mapDecorators(node),
                [], //this.mapModifiers(node),
                new J.ClassDeclaration.Kind(
                    randomId(),
                    node.modifiers ? this.suffix(node.modifiers[node.modifiers.length - 1]) : this.prefix(node),
                    Markers.EMPTY,
                    [],
                    J.ClassDeclaration.Kind.Type.Class
                ),
                node.name ? this.convert(node.name) : this.mapIdentifier(node, ""),
                this.mapTypeParametersAsJContainer(node),
                null, // FIXME primary constructor
                this.mapExtends(node),
                this.mapImplements(node),
                null,
                new J.Block(
                    randomId(),
                    this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenBraceToken)!),
                    Markers.EMPTY,
                    this.rightPadded(false, Space.EMPTY),
                    node.members.map(ce  => new JRightPadded(
                        this.convert(ce),
                        ce.getLastToken()?.kind === ts.SyntaxKind.SemicolonToken ? this.prefix(ce.getLastToken()!) : Space.EMPTY,
                        ce.getLastToken()?.kind === ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
                    )),
                    this.prefix(node.getLastToken()!)
                ),
                this.mapType(node)
            )
        )
    }

    visitOmittedExpression(node: ts.OmittedExpression) {
        return this.visitUnknown(node);
    }

    visitExpressionWithTypeArguments(node: ts.ExpressionWithTypeArguments) {
        if (node.typeArguments) {
            // FIXME
            return this.visitUnknown(node);
        }
        return this.visit(node.expression);
    }

    visitAsExpression(node: ts.AsExpression) {
        return new JS.JsBinary(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.convert(node.expression),
            this.leftPadded(this.prefix(node.getChildAt(1, this.sourceFile)), JS.JsBinary.Type.As),
            this.convert(node.type),
            this.mapType(node)
        );
    }

    visitNonNullExpression(node: ts.NonNullExpression) {
        return new JS.Unary(
            randomId(),
            Space.EMPTY,
            Markers.EMPTY,
            this.leftPadded(this.suffix(node.expression), JS.Unary.Type.Exclamation),
            this.visit(node.expression),
            this.mapType(node)
        )
    }

    visitMetaProperty(node: ts.MetaProperty) {
        return this.visitUnknown(node);
    }

    visitSyntheticExpression(node: ts.SyntheticExpression) {
        return this.visitUnknown(node);
    }

    visitSatisfiesExpression(node: ts.SatisfiesExpression) {
        return this.visitUnknown(node);
    }

    visitTemplateSpan(node: ts.TemplateSpan) {
        return this.visitUnknown(node);
    }

    visitSemicolonClassElement(node: ts.SemicolonClassElement) {
        return this.newJEmpty(this.semicolonPrefix(node));
    }

    visitBlock(node: ts.Block) {
        return new J.Block(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(false, Space.EMPTY),
            this.semicolonPaddedStatementList(node.statements),
            this.prefix(node.getLastToken()!)
        );
    }

    visitEmptyStatement(node: ts.EmptyStatement) {
        return this.newJEmpty(this.prefix(node));
    }

    visitVariableStatement(node: ts.VariableStatement) {
        return this.visitVariableDeclarationList(node.declarationList).withModifiers(this.mapModifiers(node)).withPrefix(this.prefix(node));
    }

    visitExpressionStatement(node: ts.ExpressionStatement): J.Statement {
        const expression = this.visit(node.expression) as J.Expression;
        if (expression instanceof J.MethodInvocation || expression instanceof J.NewClass || expression instanceof J.Unknown ||
            expression instanceof J.AssignmentOperation || expression instanceof J.Ternary || expression instanceof J.Empty ||
            expression instanceof JS.ExpressionStatement || expression instanceof J.Assignment || expression instanceof J.FieldAccess) {
            // FIXME this is a hack we currently require because our `Expression` and `Statement` interfaces don't have any type guards
            return expression as J.Statement;
        }
        return new JS.ExpressionStatement(
            randomId(),
            expression
        )
    }

    visitIfStatement(node: ts.IfStatement) {
        const semicolonAfterThen = node.thenStatement.getLastToken()?.kind == ts.SyntaxKind.SemicolonToken;
        return new J.If(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            new J.ControlParentheses(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!),
                Markers.EMPTY,
                this.rightPadded(this.visit(node.expression), this.suffix(node.expression))
            ),
            this.rightPadded(
                this.convert(node.thenStatement),
                semicolonAfterThen ? this.prefix(node.thenStatement.getLastToken()!) : Space.EMPTY,
                semicolonAfterThen ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
            ),
            node.elseStatement ? new J.If.Else(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.ElseKeyword)!),
                Markers.EMPTY,
                this.rightPadded(
                    this.convert(node.elseStatement),
                    semicolonAfterThen ? this.prefix(node.elseStatement.getLastToken()!) : Space.EMPTY,
                    semicolonAfterThen ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
                )
            ) : null
        );
    }

    visitDoStatement(node: ts.DoStatement) {
        return new J.DoWhileLoop(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(this.visit(node.statement), this.suffix(node.statement)),
            this.leftPadded(
                Space.EMPTY,
                new J.ControlParentheses(
                    randomId(),
                    this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!),
                    Markers.EMPTY,
                    this.rightPadded(this.visit(node.expression), this.suffix(node.expression))
                )
            )
        );
    }

    visitWhileStatement(node: ts.WhileStatement) {
       return new J.WhileLoop(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            new J.ControlParentheses(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!),
                Markers.EMPTY,
                this.rightPadded(this.visit(node.expression), this.suffix(node.expression))
            ),
           this.rightPadded(
               this.convert(node.statement),
               this.semicolonPrefix(node.statement),
               node.statement.getLastToken()?.kind == ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
           )
        );
    }

    visitForStatement(node: ts.ForStatement) {
        return new J.ForLoop(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            new J.ForLoop.Control(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!),
                Markers.EMPTY,
                [node.initializer ?
                    (ts.isVariableDeclarationList(node.initializer) ? this.rightPadded(this.visit(node.initializer), Space.EMPTY) :
                        this.rightPadded(this.convert(node.initializer), this.suffix(node.initializer.getLastToken()!))) :
                    this.rightPadded(this.newJEmpty(), this.suffix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!))],  // to handle for (/*_*/; ; );
                node.condition ? this.rightPadded(this.convert(node.condition), this.suffix(node.condition.getLastToken()!)) :
                    this.rightPadded(this.newJEmpty(), this.suffix(this.findChildNode(node, ts.SyntaxKind.SemicolonToken)!)),  // to handle for ( ;/*_*/; );
                [node.incrementor ? this.rightPadded(this.convert(node.incrementor), this.suffix(node.incrementor.getLastToken()!)) :
                    this.rightPadded(this.newJEmpty(this.prefix(this.findChildNode(node, ts.SyntaxKind.CloseParenToken)!)), Space.EMPTY)],  // to handle for ( ; ;/*_*/);
            ),
            this.rightPadded(
                this.convert(node.statement),
                this.semicolonPrefix(node.statement),
                node.statement.getLastToken()?.kind == ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
            )
        );
    }

    visitForInStatement(node: ts.ForInStatement) {
        return this.visitUnknown(node);
    }

    visitForOfStatement(node: ts.ForOfStatement) {
        return new J.ForEachLoop(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            new J.ForEachLoop.Control(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!),
                Markers.EMPTY,
                this.rightPadded(this.visit(node.initializer), Space.EMPTY),
                this.rightPadded(this.visit(node.expression), this.suffix(node.expression))
            ),
            this.rightPadded(
                this.convert(node.statement),
                this.semicolonPrefix(node.statement),
                node.statement.getLastToken()?.kind == ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
            )
        );
    }

    visitContinueStatement(node: ts.ContinueStatement) {
        return new J.Continue(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.label ? this.visit(node.label) : null
        );
    }

    visitBreakStatement(node: ts.BreakStatement) {
        return new J.Break(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.label ? this.visit(node.label) : null
        );
    }

    visitReturnStatement(node: ts.ReturnStatement) {
        return new J.Return(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.expression ? this.convert<J.Expression>(node.expression) : null
        );
    }

    visitWithStatement(node: ts.WithStatement) {
        return this.visitUnknown(node);
    }

    visitSwitchStatement(node: ts.SwitchStatement) {
        return new J.Switch(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            new J.ControlParentheses(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!),
                Markers.EMPTY,
                this.rightPadded(this.visit(node.expression), this.suffix(node.expression))
            ),
            this.visit(node.caseBlock)
        );
    }

    visitLabeledStatement(node: ts.LabeledStatement) {
        return new J.Label(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(this.visit(node.label), this.suffix(node.label)),
            this.visit(node.statement)
        );
    }

    visitThrowStatement(node: ts.ThrowStatement) {
        return new J.Throw(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.visit(node.expression)
        );
    }

    visitTryStatement(node: ts.TryStatement) {
        return new J.Try(
          randomId(),
          this.prefix(node),
          Markers.EMPTY,
          null,
          this.visit(node.tryBlock),
          node.catchClause ? [this.visit(node.catchClause)] : [],
          node.finallyBlock ? this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.FinallyKeyword)!), this.visit(node.finallyBlock)) : null
        );
    }

    visitDebuggerStatement(node: ts.DebuggerStatement) {
        return this.visitUnknown(node);
    }

    visitVariableDeclaration(node: ts.VariableDeclaration) {
        return new J.VariableDeclarations.NamedVariable(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.visit(node.name),
            [],
            node.initializer ? this.leftPadded(this.prefix(node.getChildAt(node.getChildCount(this.sourceFile) - 2)), this.visit(node.initializer)) : null,
            this.mapVariableType(node)
        );
    }

    visitVariableDeclarationList(node: ts.VariableDeclarationList) {
        const kind = node.getFirstToken(this.sourceFile);
        return new JS.ScopedVariableDeclarations(
            randomId(),
            Space.EMPTY,
            Markers.EMPTY,
            [],
            this.leftPadded(
                this.prefix(node),
                kind?.kind === ts.SyntaxKind.LetKeyword
                    ? JS.ScopedVariableDeclarations.Scope.Let
                    : kind?.kind === ts.SyntaxKind.ConstKeyword
                    ? JS.ScopedVariableDeclarations.Scope.Const
                    : JS.ScopedVariableDeclarations.Scope.Var
            ),
            node.declarations.map((declaration) => {
                return this.rightPadded(
                    new J.VariableDeclarations(
                        randomId(),
                        this.prefix(declaration),
                        Markers.EMPTY,
                        [], // FIXME decorators?
                        [], // FIXME modifiers?
                        this.mapTypeInfo(declaration),
                        null, // FIXME varargs
                        [],
                        [this.rightPadded(this.visit(declaration), Space.EMPTY)]
                    ),
                    this.suffix(declaration)
                );
            })
        );
    }

    visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        return new JS.FunctionDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapModifiers(node),
            this.visit(node.name!),
            this.mapTypeParametersAsObject(node),
            this.mapCommaSeparatedList(this.getParameterListNodes(node)),
            this.mapTypeInfo(node),
            this.convert(node.body!),
            this.mapMethodType(node)
        );
    }

    private getParameterListNodes(node: ts.SignatureDeclarationBase) {
        const children = node.getChildren(this.sourceFile);
        for (let i = 0; i < children.length; i++) {
            if (children[i].kind == ts.SyntaxKind.OpenParenToken) {
                return children.slice(i, i + 3);
            }
        }
        return [];
    }

    visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        return new J.ClassDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [], // interface has no decorators
            this.mapModifiers(node),
            new J.ClassDeclaration.Kind(
                randomId(),
                node.modifiers ? this.suffix(node.modifiers[node.modifiers.length - 1]) : this.prefix(node),
                Markers.EMPTY,
                [],
                J.ClassDeclaration.Kind.Type.Interface
            ),
            node.name ? this.convert(node.name) : this.mapIdentifier(node, ""),
            this.mapTypeParametersAsJContainer(node),
            null, // interface has no constructor
            null, // implements should be used
            this.mapInterfaceExtends(node), // interface extends modeled as implements
            null,
            new J.Block(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenBraceToken)!),
                Markers.EMPTY,
               this.rightPadded(false, Space.EMPTY),
                node.members.map(te  => new JRightPadded(
                    this.convert(te),
                    (te.getLastToken()?.kind === ts.SyntaxKind.SemicolonToken) || (te.getLastToken()?.kind === ts.SyntaxKind.CommaToken) ? this.prefix(te.getLastToken()!) : Space.EMPTY,
                    (te.getLastToken()?.kind === ts.SyntaxKind.SemicolonToken) || (te.getLastToken()?.kind === ts.SyntaxKind.CommaToken) ? Markers.build([this.convertToken(te.getLastToken())!]) : Markers.EMPTY
                )),
                this.prefix(node.getLastToken()!)
            ),
            this.mapType(node)
        );
    }

    visitTypeAliasDeclaration(node: ts.TypeAliasDeclaration) {
        return this.visitUnknown(node);
    }

    visitEnumDeclaration(node: ts.EnumDeclaration) {
        return new J.ClassDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [], // enum has no decorators
            this.mapModifiers(node),
            new J.ClassDeclaration.Kind(
                randomId(),
                node.modifiers ? this.suffix(node.modifiers[node.modifiers.length - 1]) : this.prefix(node),
                Markers.EMPTY,
                [],
                J.ClassDeclaration.Kind.Type.Enum
            ),
            node.name ? this.convert(node.name) : this.mapIdentifier(node, ""),
            null, // enum has no type parameters
            null, // enum has no constructor
            null, // enum can't extend smth.
            null, // enum can't implement smth.
            null,
            new J.Block(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenBraceToken)!),
                Markers.EMPTY,
                this.rightPadded(false, Space.EMPTY),
                [this.rightPadded(
                    new J.EnumValueSet(
                        randomId(),
                        Space.EMPTY,
                        Markers.EMPTY,
                        node.members.map(em => this.rightPadded(this.visit(em), this.suffix(em))),
                        node.members.hasTrailingComma),
                    Space.EMPTY)],
                this.prefix(node.getLastToken()!)
            ),
            this.mapType(node)
        );
    }

    visitModuleDeclaration(node: ts.ModuleDeclaration) {
        const body = this.visit(node.body as ts.Node);

        let namespaceKeyword = this.findChildNode(node, ts.SyntaxKind.NamespaceKeyword);
        const keywordType = namespaceKeyword ? JS.NamespaceDeclaration.KeywordType.Namespace : JS.NamespaceDeclaration.KeywordType.Module
        namespaceKeyword ??= this.findChildNode(node, ts.SyntaxKind.ModuleKeyword);
        if (body instanceof JS.NamespaceDeclaration) {
            return new JS.NamespaceDeclaration(
                randomId(),
                Space.EMPTY,
                Markers.EMPTY,
                this.mapModifiers(node),
                this.leftPadded(
                    namespaceKeyword ? this.prefix(namespaceKeyword) : Space.EMPTY,
                    keywordType
                ),
                this.rightPadded(
                        new J.FieldAccess(
                            randomId(),
                            this.prefix(node),
                            Markers.EMPTY,
                            this.visit(node.name),
                            new J.JLeftPadded(
                                this.suffix(node.name),
                                body.name as J.Identifier,
                                Markers.EMPTY
                            ),
                            null
                        ),
                    Space.EMPTY
                ),
                body.body
            );
        } else {
            return new JS.NamespaceDeclaration(
                randomId(),
                node.parent.kind === ts.SyntaxKind.ModuleBlock ? this.prefix(node) : Space.EMPTY,
                Markers.EMPTY,
                this.mapModifiers(node),
                this.leftPadded(
                    namespaceKeyword ? this.prefix(namespaceKeyword) : Space.EMPTY,
                    keywordType
                ),
                this.rightPadded(this.convert(node.name), this.prefix(node)), // J.FieldAccess
                body // J.Block
            );
        }
    }

    visitModuleBlock(node: ts.ModuleBlock) {
         return new J.Block(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(false, Space.EMPTY),
            this.semicolonPaddedStatementList(node.statements),
            this.prefix(node.getLastToken()!)
        );
    }

    visitCaseBlock(node: ts.CaseBlock) {
        return new J.Block(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(false, Space.EMPTY),
            node.clauses.map(clause =>
                this.rightPadded(
                    this.visit(clause),
                    this.suffix(clause)
                )),
            this.prefix(node.getLastToken()!)
        )
    }

    visitNamespaceExportDeclaration(node: ts.NamespaceExportDeclaration) {
        return this.visitUnknown(node);
    }

    visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        return this.visitUnknown(node);
    }

    visitImportKeyword(node: ts.ImportExpression) {
        // this is used for dynamic imports as in `await import('foo')`
        return this.mapIdentifier(node, 'import');
    }

    visitImportDeclaration(node: ts.ImportDeclaration) {
        const children = node.getChildren(this.sourceFile);
        const _default = !!node.importClause?.name;
        const onlyDefault = _default && node.importClause.namedBindings == undefined;
        return new JS.JsImport(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            _default ? this.rightPadded(this.visit(node.importClause?.name), this.suffix(node.importClause?.name)) : null,
            node.importClause && !onlyDefault ? this.visit(node.importClause) : null,
            children[children.indexOf(node.moduleSpecifier) - 1].kind == ts.SyntaxKind.FromKeyword ? this.prefix(children[children.indexOf(node.moduleSpecifier) - 1]) : null,
            this.convert<J.Literal>(node.moduleSpecifier),
            null
        );
    }

    visitImportClause(node: ts.ImportClause) {
        if (node.namedBindings && ts.isNamespaceImport(node.namedBindings)) {
            return new JContainer(
                this.prefix(node),
                [this.rightPadded(new JS.Alias(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    this.rightPadded(this.mapIdentifier(node.namedBindings, "*"), this.prefix(node.namedBindings.getChildAt(1, this.sourceFile))),
                    this.convert(node.namedBindings.name)
                ), Space.EMPTY)],
                Markers.EMPTY
            );
        }
        return this.mapCommaSeparatedList(node.namedBindings?.getChildren(this.sourceFile)!);
    }

    visitNamespaceImport(node: ts.NamespaceImport) {
        return this.visitUnknown(node);
    }

    visitNamedImports(node: ts.NamedImports) {
        return this.visitUnknown(node);
    }

    visitImportSpecifier(node: ts.ImportSpecifier) {
        return this.mapIdentifier(node, node.name.text, false);
    }

    visitExportAssignment(node: ts.ExportAssignment) {
        return this.visitUnknown(node);
    }

    visitExportDeclaration(node: ts.ExportDeclaration) {
        return this.visitUnknown(node);
    }

    visitNamedExports(node: ts.NamedExports) {
        return this.visitUnknown(node);
    }

    visitNamespaceExport(node: ts.NamespaceExport) {
        return this.visitUnknown(node);
    }

    visitExportSpecifier(node: ts.ExportSpecifier) {
        return this.visitUnknown(node);
    }

    visitMissingDeclaration(node: ts.MissingDeclaration) {
        return this.visitUnknown(node);
    }

    visitExternalModuleReference(node: ts.ExternalModuleReference) {
        return this.visitUnknown(node);
    }

    visitJsxElement(node: ts.JsxElement) {
        return this.visitUnknown(node);
    }

    visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
        return this.visitUnknown(node);
    }

    visitJsxOpeningElement(node: ts.JsxOpeningElement) {
        return this.visitUnknown(node);
    }

    visitJsxClosingElement(node: ts.JsxClosingElement) {
        return this.visitUnknown(node);
    }

    visitJsxFragment(node: ts.JsxFragment) {
        return this.visitUnknown(node);
    }

    visitJsxOpeningFragment(node: ts.JsxOpeningFragment) {
        return this.visitUnknown(node);
    }

    visitJsxClosingFragment(node: ts.JsxClosingFragment) {
        return this.visitUnknown(node);
    }

    visitJsxAttribute(node: ts.JsxAttribute) {
        return this.visitUnknown(node);
    }

    visitJsxAttributes(node: ts.JsxAttributes) {
        return this.visitUnknown(node);
    }

    visitJsxSpreadAttribute(node: ts.JsxSpreadAttribute) {
        return this.visitUnknown(node);
    }

    visitJsxExpression(node: ts.JsxExpression) {
        return this.visitUnknown(node);
    }

    visitJsxNamespacedName(node: ts.JsxNamespacedName) {
        return this.visitUnknown(node);
    }

    visitCaseClause(node: ts.CaseClause) {
        return new J.Case(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            J.Case.Type.Statement,
            new JContainer(
                this.prefix(node.expression),
                [this.rightPadded(
                    this.visit(node.expression),
                    this.suffix(node.expression)
                )],
                Markers.EMPTY
            ),
            new JContainer(
                this.prefix(node),
                this.semicolonPaddedStatementList(node.statements),
                Markers.EMPTY
            ),
            null
        );
    }

    visitDefaultClause(node: ts.DefaultClause) {
        return new J.Case(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            J.Case.Type.Statement,
            new JContainer(
                this.prefix(node),
                [this.rightPadded(this.mapIdentifier(node, 'default'), this.suffix(this.findChildNode(node, ts.SyntaxKind.DefaultKeyword)!))],
                Markers.EMPTY
            ),
            new JContainer(
                this.prefix(node),
                this.semicolonPaddedStatementList(node.statements),
                Markers.EMPTY
            ),
            null
        );
    }

    visitHeritageClause(node: ts.HeritageClause) {
        return this.convert(node.types[0]);
    }

    visitCatchClause(node: ts.CatchClause) {
        return new J.Try.Catch(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.variableDeclaration ?
                new J.ControlParentheses(
                    randomId(),
                    this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!),
                    Markers.EMPTY,
                    this.rightPadded(
                        new J.VariableDeclarations(
                            randomId(),
                            this.prefix(node.variableDeclaration),
                            Markers.EMPTY,
                            [],
                            [],
                            this.mapTypeInfo(node.variableDeclaration),
                            null,
                            [],
                            [this.rightPadded(this.visit(node.variableDeclaration), Space.EMPTY)]
                        ),
                        this.suffix(node.variableDeclaration))
                ) :
                // should return empty variables list to handle: try { } catch { }
                new J.ControlParentheses(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    this.rightPadded(new J.VariableDeclarations(randomId(), Space.EMPTY, Markers.EMPTY, [], [], null, null, [], []), Space.EMPTY)
                ),
            this.visit(node.block)
        )
    }

    visitImportAttributes(node: ts.ImportAttributes) {
        return this.visitUnknown(node);
    }

    visitImportAttribute(node: ts.ImportAttribute) {
        return this.visitUnknown(node);
    }

    visitPropertyAssignment(node: ts.PropertyAssignment) {
        return new JS.PropertyAssignment(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(this.visit(node.name), this.suffix(node.name)),
            this.visit(node.initializer)
        );
    }

    visitShorthandPropertyAssignment(node: ts.ShorthandPropertyAssignment) {
        return this.visitUnknown(node);
    }

    visitSpreadAssignment(node: ts.SpreadAssignment) {
        return this.visitUnknown(node);
    }

    visitEnumMember(node: ts.EnumMember) {
        return new J.EnumValue(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            node.name ? this.convert(node.name) : this.mapIdentifier(node, ""),
            node.initializer ? new J.NewClass(
                    randomId(),
                    this.suffix(node.name),
                    Markers.EMPTY,
                    null,
                    Space.EMPTY,
                    null,
                    new JContainer(
                        Space.EMPTY,
                        [this.rightPadded(this.visit(node.initializer), Space.EMPTY)],
                        Markers.EMPTY
                    ),
                    null,
                    this.mapMethodType(node)
                ) : null
        )
    }

    visitBundle(node: ts.Bundle) {
        return this.visitUnknown(node);
    }

    visitJSDocTypeExpression(node: ts.JSDocTypeExpression) {
        return this.visitUnknown(node);
    }

    visitJSDocNameReference(node: ts.JSDocNameReference) {
        return this.visitUnknown(node);
    }

    visitJSDocMemberName(node: ts.JSDocMemberName) {
        return this.visitUnknown(node);
    }

    visitJSDocAllType(node: ts.JSDocAllType) {
        return this.visitUnknown(node);
    }

    visitJSDocUnknownType(node: ts.JSDocUnknownType) {
        return this.visitUnknown(node);
    }

    visitJSDocNullableType(node: ts.JSDocNullableType) {
        return this.visitUnknown(node);
    }

    visitJSDocNonNullableType(node: ts.JSDocNonNullableType) {
        return this.visitUnknown(node);
    }

    visitJSDocOptionalType(node: ts.JSDocOptionalType) {
        return this.visitUnknown(node);
    }

    visitJSDocFunctionType(node: ts.JSDocFunctionType) {
        return this.visitUnknown(node);
    }

    visitJSDocVariadicType(node: ts.JSDocVariadicType) {
        return this.visitUnknown(node);
    }

    visitJSDocNamepathType(node: ts.JSDocNamepathType) {
        return this.visitUnknown(node);
    }

    visitJSDoc(node: ts.JSDoc) {
        return this.visitUnknown(node);
    }

    visitJSDocType(node: ts.JSDocType) {
        return this.visitUnknown(node);
    }

    visitJSDocText(node: ts.JSDocText) {
        return this.visitUnknown(node);
    }

    visitJSDocTypeLiteral(node: ts.JSDocTypeLiteral) {
        return this.visitUnknown(node);
    }

    visitJSDocSignature(node: ts.JSDocSignature) {
        return this.visitUnknown(node);
    }

    visitJSDocLink(node: ts.JSDocLink) {
        return this.visitUnknown(node);
    }

    visitJSDocLinkCode(node: ts.JSDocLinkCode) {
        return this.visitUnknown(node);
    }

    visitJSDocLinkPlain(node: ts.JSDocLinkPlain) {
        return this.visitUnknown(node);
    }

    visitJSDocTag(node: ts.JSDocTag) {
        return this.visitUnknown(node);
    }

    visitJSDocAugmentsTag(node: ts.JSDocAugmentsTag) {
        return this.visitUnknown(node);
    }

    visitJSDocImplementsTag(node: ts.JSDocImplementsTag) {
        return this.visitUnknown(node);
    }

    visitJSDocAuthorTag(node: ts.JSDocAuthorTag) {
        return this.visitUnknown(node);
    }

    visitJSDocDeprecatedTag(node: ts.JSDocDeprecatedTag) {
        return this.visitUnknown(node);
    }

    visitJSDocClassTag(node: ts.JSDocClassTag) {
        return this.visitUnknown(node);
    }

    visitJSDocPublicTag(node: ts.JSDocPublicTag) {
        return this.visitUnknown(node);
    }

    visitJSDocPrivateTag(node: ts.JSDocPrivateTag) {
        return this.visitUnknown(node);
    }

    visitJSDocProtectedTag(node: ts.JSDocProtectedTag) {
        return this.visitUnknown(node);
    }

    visitJSDocReadonlyTag(node: ts.JSDocReadonlyTag) {
        return this.visitUnknown(node);
    }

    visitJSDocOverrideTag(node: ts.JSDocOverrideTag) {
        return this.visitUnknown(node);
    }

    visitJSDocCallbackTag(node: ts.JSDocCallbackTag) {
        return this.visitUnknown(node);
    }

    visitJSDocOverloadTag(node: ts.JSDocOverloadTag) {
        return this.visitUnknown(node);
    }

    visitJSDocEnumTag(node: ts.JSDocEnumTag) {
        return this.visitUnknown(node);
    }

    visitJSDocParameterTag(node: ts.JSDocParameterTag) {
        return this.visitUnknown(node);
    }

    visitJSDocReturnTag(node: ts.JSDocReturnTag) {
        return this.visitUnknown(node);
    }

    visitJSDocThisTag(node: ts.JSDocThisTag) {
        return this.visitUnknown(node);
    }

    visitJSDocTypeTag(node: ts.JSDocTypeTag) {
        return this.visitUnknown(node);
    }

    visitJSDocTemplateTag(node: ts.JSDocTemplateTag) {
        return this.visitUnknown(node);
    }

    visitJSDocTypedefTag(node: ts.JSDocTypedefTag) {
        return this.visitUnknown(node);
    }

    visitJSDocSeeTag(node: ts.JSDocSeeTag) {
        return this.visitUnknown(node);
    }

    visitJSDocPropertyTag(node: ts.JSDocPropertyTag) {
        return this.visitUnknown(node);
    }

    visitJSDocThrowsTag(node: ts.JSDocThrowsTag) {
        return this.visitUnknown(node);
    }

    visitJSDocSatisfiesTag(node: ts.JSDocSatisfiesTag) {
        return this.visitUnknown(node);
    }

    visitJSDocImportTag(node: ts.JSDocImportTag) {
        return this.visitUnknown(node);
    }

    visitSyntaxList(node: ts.SyntaxList) {
        return this.visitUnknown(node);
    }

    visitNotEmittedStatement(node: ts.NotEmittedStatement) {
        return this.visitUnknown(node);
    }

    visitPartiallyEmittedExpression(node: ts.PartiallyEmittedExpression) {
        return this.visitUnknown(node);
    }

    visitCommaListExpression(node: ts.CommaListExpression) {
        return this.visitUnknown(node);
    }

    visitSyntheticReferenceExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    private _seenTriviaSpans: TextSpan[] = [];

    private prefix(node: ts.Node, consume: boolean = true): Space {
        if (node.getFullStart() == node.getStart()) {
            return Space.EMPTY;
        }

        if (consume) {
            const nodeStart = node.getFullStart();
            const span: TextSpan = [nodeStart, node.getStart()];
            let idx = binarySearch(this._seenTriviaSpans, span, compareTextSpans);
            if (idx >= 0)
                return Space.EMPTY;
            idx = ~idx;
            if (idx > 0 && this._seenTriviaSpans[idx - 1][1] > span[0])
                return Space.EMPTY;
            this._seenTriviaSpans.splice(idx, 0, span);
        }
        return prefixFromNode(node, this.sourceFile);
        // return Space.format(this.sourceFile.text, node.getFullStart(), node.getFullStart() + node.getLeadingTriviaWidth());
    }

    private suffix = (node: ts.Node, consume: boolean = true): Space => {
        return this.prefix(getNextSibling(node)!, consume);
    }

    private mapType(node: ts.Node): JavaType | null {
        return this.typeMapping.type(node);
    }

    private mapPrimitiveType(node: ts.Node): JavaType.Primitive {
        return this.typeMapping.primitiveType(node);
    }

    private mapVariableType(node: ts.NamedDeclaration): JavaType.Variable | null {
        return this.typeMapping.variableType(node);
    }

    private mapMethodType(node: ts.Node): JavaType.Method | null {
        return this.typeMapping.methodType(node);
    }

    private mapCommaSeparatedList(nodes: readonly ts.Node[]): JContainer<J.Expression> {
        return this.mapToContainer(nodes, this.trailingComma(nodes));
    }

    private mapTypeArguments(prefix: Space, nodes: readonly ts.Node[]): JContainer<J.Expression> {
        if (nodes.length === 0) {
            return JContainer.empty();
        }

        const args = nodes.map(node =>
            this.rightPadded(
                this.visit(node),
                this.suffix(node),
                Markers.EMPTY
            ))
        return new JContainer(
            prefix,
            args,
            Markers.EMPTY
        );
    }

    private trailingComma = (nodes: readonly ts.Node[]) => (ns: readonly ts.Node[], i: number) => {
        const last = i === ns.length - 2;
        return last ? Markers.build([new TrailingComma(randomId(), this.prefix(nodes[2], false))]) : Markers.EMPTY;
    }

    private mapToContainer<T>(nodes: readonly ts.Node[], markers?: (ns: readonly ts.Node[], i: number) => Markers): JContainer<T> {
        if (nodes.length === 0) {
            return JContainer.empty();
        }
        const prefix = this.prefix(nodes[0]);
        const args: JRightPadded<T>[] = this.mapToRightPaddedList(nodes[1] as ts.SyntaxList, this.prefix(nodes[2]), markers);
        return new JContainer(
            prefix,
            args,
            Markers.EMPTY
        );
    }

    private mapToRightPaddedList<T>(node: ts.SyntaxList, lastAfter: Space, markers?: (ns: readonly ts.Node[], i: number) => Markers): JRightPadded<T>[] {
        let elementList = node.getChildren(this.sourceFile);
        let childCount = elementList.length;

        const args: JRightPadded<T>[] = [];
        if (childCount === 0) {
            args.push(this.rightPadded(
                this.newJEmpty() as T,
                lastAfter,
                Markers.EMPTY
            ));
        } else {
            for (let i = 0; i < childCount - 1; i += 2) {
                // FIXME right padding and trailing comma
                const last = i === childCount - 2;
                args.push(this.rightPadded(
                    this.visit(elementList[i]),
                    this.prefix(elementList[i + 1]),
                    markers ? markers(elementList, i) : Markers.EMPTY
                ));
            }
            if ((childCount & 1) === 1) {
                args.push(this.rightPadded(this.visit(elementList[childCount - 1]), lastAfter));
            }
        }
        return args;
    }

    private mapDecorators(node: ts.ClassDeclaration | ts.FunctionDeclaration | ts.MethodDeclaration | ts.ConstructorDeclaration): J.Annotation[] {
        return node.modifiers?.filter(ts.isDecorator)?.map(this.convert<J.Annotation>) ?? [];
    }

    private mapTypeParametersAsJContainer(node: ts.ClassDeclaration | ts.InterfaceDeclaration | ts.ClassExpression): JContainer<J.TypeParameter> | null {
        return node.typeParameters
            ? JContainer.build(
                this.suffix(this.findChildNode(node, ts.SyntaxKind.Identifier)!),
                this.mapTypeParametersList(node.typeParameters),
                Markers.EMPTY
            )
            : null;
    }

    private mapTypeParametersAsObject(node: ts.MethodDeclaration | ts.MethodSignature | ts.FunctionDeclaration
        | ts.CallSignatureDeclaration | ts.ConstructSignatureDeclaration | ts.FunctionExpression) : J.TypeParameters | null {
        if (!node.typeParameters) return null;

        let ts_prefix: Space;
        if (ts.isConstructSignatureDeclaration(node)) {
            ts_prefix = this.suffix(this.findChildNode(node, ts.SyntaxKind.NewKeyword)!);
        } else if (ts.isFunctionExpression(node)) {
            ts_prefix = this.suffix(this.findChildNode(node, ts.SyntaxKind.FunctionKeyword)!);
        } else {
            ts_prefix = node.questionToken ? this.suffix(node.questionToken) : node.name ? this.suffix(node.name) : Space.EMPTY;
        }
        return new J.TypeParameters(randomId(), ts_prefix, Markers.EMPTY, [], node.typeParameters.map(tp => this.rightPadded(this.visit(tp), this.suffix(tp))));
    }

    private mapTypeParametersList(typeParamsNodeArray: ts.NodeArray<ts.TypeParameterDeclaration>) : JRightPadded<J.TypeParameter>[] {
        return typeParamsNodeArray.map(tp => this.rightPadded<J.TypeParameter>(this.visit(tp), this.suffix(tp)));
    }

    private findChildNode(node: ts.Node, kind: ts.SyntaxKind): ts.Node | undefined {
        for (let i = 0; i < node.getChildCount(this.sourceFile); i++) {
            if (node.getChildAt(i, this.sourceFile).kind == kind) {
                return node.getChildAt(i, this.sourceFile);
            }
        }
        return undefined;
    }

    private convertToken(token?: ts.Node) {
        if (token?.kind === ts.SyntaxKind.CommaToken) return new TrailingComma(randomId(), Space.EMPTY);
        if (token?.kind === ts.SyntaxKind.SemicolonToken) return new Semicolon(randomId());
        return null;
    }

    private newJEmpty(prefix: Space = Space.EMPTY, markers?: Markers) {
        return new J.Empty(randomId(), prefix, markers ?? Markers.EMPTY);
    }

    private getOptionalUnary(node: ts.MethodSignature | ts.MethodDeclaration | ts.ParameterDeclaration | ts.PropertySignature | ts.PropertyDeclaration) {
        return new JS.Unary(
            randomId(),
            Space.EMPTY,
            Markers.EMPTY,
            this.leftPadded(this.suffix(node.name), JS.Unary.Type.Optional),
            this.visit(node.name),
            this.mapType(node)
        );
    }
}

function prefixFromNode(node: ts.Node, sourceFile: ts.SourceFile): Space {
    const comments: J.Comment[] = [];
    const text = sourceFile.getFullText();
    const nodeStart = node.getFullStart();

    // FIXME merge with whitespace from previous sibling
    // let previousSibling = getPreviousSibling(node);
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

        comments.push(new J.TextComment(isMultiline, commentBody, suffix, Markers.EMPTY));
    });

    // Step 3: Extract leading whitespace (before the first comment)
    let whitespace = '';
    if (leadingWhitespacePos > nodeStart) {
        whitespace = text.slice(nodeStart, leadingWhitespacePos);
    }

    // Step 4: Return the Space object with comments and leading whitespace
    return new Space(comments, whitespace.length > 0 ? whitespace : null);
}
