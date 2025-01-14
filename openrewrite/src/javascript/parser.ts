import * as ts from 'typescript';
import * as J from '../java';
import {
    FieldAccess,
    JavaType,
    JContainer,
    JLeftPadded,
    JRightPadded,
    Lambda,
    Semicolon,
    Space,
    TrailingComma,
    TypedTree
} from '../java';
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
import {binarySearch, compareTextSpans, getNextSibling, getPreviousSibling, TextSpan} from "./parserUtils";
import {JavaScriptTypeMapping} from "./typeMapping";
import path from "node:path";
import {ExpressionStatement, TypeTreeExpression} from ".";

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
                result.push(parsed.withSourcePath(relativeTo != null ? path.relative(relativeTo, input.path) : input.path));
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
                    result.push(parsed.withSourcePath(relativeTo != null ? path.relative(relativeTo, input.path) : input.path));
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

    detectBOMAndTextEncoding(content: String) : { hasBom: boolean; encoding: string | null } {
        const BOM_UTF8 = "\uFEFF"; // BOM for UTF-8
        const BOM_UTF16_LE = [0xFF, 0xFE]; // BOM for UTF-16 Little Endian

        // Detect BOM
        const hasUtf8Bom = content.startsWith(BOM_UTF8);
        const hasUtf16LeBom = content.charCodeAt(0) === BOM_UTF16_LE[0] && content.charCodeAt(1) === BOM_UTF16_LE[1];

        if (hasUtf8Bom) {
            return { hasBom: true, encoding: 'utf8' };
        } else if (hasUtf16LeBom) {
            return { hasBom: true, encoding: 'utf16le' };
        }

        return { hasBom: false, encoding: null };
    }

    visitSourceFile(node: ts.SourceFile): JS.CompilationUnit {

        let bomAndTextEncoding = this.detectBOMAndTextEncoding(node.getFullText());

        let prefix = this.prefix(node);
        if (bomAndTextEncoding.hasBom) {
            // If a node full text has a BOM marker, it becomes a part of the prefix, so we remove it
            if (bomAndTextEncoding.encoding === 'utf8') {
                prefix = prefix.withWhitespace(prefix.whitespace!.slice(1));
            } else if (bomAndTextEncoding.encoding === 'utf16le') {
                prefix = prefix.withWhitespace(prefix.whitespace!.slice(2));
            }
        }

        return new JS.CompilationUnit(
            randomId(),
            prefix,
            Markers.EMPTY,
            this.sourceFile.fileName,
            null,
            bomAndTextEncoding.encoding,
            bomAndTextEncoding.hasBom,
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
        | ts.PropertySignature | ts.ConstructorDeclaration | ts.ModuleDeclaration | ts.GetAccessorDeclaration | ts.SetAccessorDeclaration
        | ts.ArrowFunction | ts.IndexSignatureDeclaration | ts.TypeAliasDeclaration | ts.ExportDeclaration | ts.ExportAssignment | ts.FunctionExpression
        | ts.ConstructorTypeNode | ts.TypeParameterDeclaration | ts.ImportDeclaration | ts.ImportEqualsDeclaration) {
        if (ts.isVariableStatement(node) || ts.isModuleDeclaration(node)  || ts.isClassDeclaration(node) || ts.isEnumDeclaration(node)
            || ts.isInterfaceDeclaration(node) || ts.isPropertyDeclaration(node) || ts.isPropertySignature(node) || ts.isParameter(node)
            || ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isArrowFunction(node)
            || ts.isIndexSignatureDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isExportDeclaration(node)
            || ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isConstructorTypeNode(node) || ts.isTypeParameterDeclaration(node) || ts.isImportDeclaration(node) || ts.isImportEqualsDeclaration(node)) {
            return node.modifiers ? node.modifiers?.filter(ts.isModifier).map(this.mapModifier) : [];
        }
        else if (ts.isExportAssignment(node)) {
            const defaultModifier = this.findChildNode(node, ts.SyntaxKind.DefaultKeyword);
            return [
                ...node.modifiers ? node.modifiers?.filter(ts.isModifier).map(this.mapModifier) : [],
                ...defaultModifier && ts.isModifier(defaultModifier) ? [this.mapModifier(defaultModifier)] : []
            ]
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

    private keywordPrefix = (token: ts.PunctuationSyntaxKind, findSibling : (node: ts.Node) => ts.Node | null) => (node: ts.Node): Space => {
        const last = findSibling(node);
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
                const expression = this.visit(heritageClause.types[0]);
                return this.leftPadded(this.prefix(heritageClause.getFirstToken()!), new TypeTreeExpression(randomId(), Space.EMPTY, Markers.EMPTY, expression));
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

    visitIntrinsicKeyword(node: ts.Node) {
        return this.mapIdentifier(node, 'intrinsic');
    }

    visitObjectKeyword(node: ts.Node) {
        return this.mapIdentifier(node, 'object');
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

    visitNeverKeyword(node: ts.Node) {
        return this.mapIdentifier(node, 'never');
    }

    visitSymbolKeyword(node: ts.Node) {
        return this.mapIdentifier(node, 'symbol');
    }

    visitBigIntKeyword(node: ts.Node) {
        return this.mapIdentifier(node, 'bigint');
    }

    private mapLiteral(node: ts.LiteralExpression | ts.TrueLiteral | ts.FalseLiteral | ts.NullLiteral | ts.Identifier
        | ts.TemplateHead | ts.TemplateMiddle | ts.TemplateTail, value: any): J.Literal {
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
        return this.mapLiteral(node, node.text);
    }

    visitTemplateMiddle(node: ts.TemplateMiddle) {
        return this.mapLiteral(node, node.text);
    }

    visitTemplateTail(node: ts.TemplateTail) {
        return this.mapLiteral(node, node.text);
    }

    visitIdentifier(node: ts.Identifier) {
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
        return new J.TypeParameter(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            this.mapModifiers(node),
            this.visit(node.name),
            (node.constraint || node.default) ?
                new JContainer(
                    this.prefix(this.findChildNode(node, ts.SyntaxKind.ExtendsKeyword) ?? this.findChildNode(node, ts.SyntaxKind.EqualsToken)!),
                    [node.constraint ? this.rightPadded(this.visit(node.constraint), this.suffix(node.constraint)) : this.rightPadded(this.newJEmpty(), Space.EMPTY),
                        node.default ? this.rightPadded(this.visit(node.default), this.suffix(node.default)) : this.rightPadded(this.newJEmpty(), Space.EMPTY)],
                Markers.EMPTY)
                : null
        );
    }

    visitParameter(node: ts.ParameterDeclaration) {
        if (node.questionToken) {
            return new JS.JSVariableDeclarations(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.mapDecorators(node),
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
                    this.suffix(node.name)
                )]
            );
        }

        if (node.dotDotDotToken) {
            return new JS.JSVariableDeclarations(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.mapDecorators(node),
                this.mapModifiers(node),
                this.mapTypeInfo(node),
                null,
                [this.rightPadded(
                    new JS.JSVariableDeclarations.JSNamedVariable(
                        randomId(),
                        Space.EMPTY,
                        Markers.EMPTY,
                        new JS.Unary(
                            randomId(),
                            Space.EMPTY,
                            Markers.EMPTY,
                            this.leftPadded(Space.EMPTY, JS.Unary.Type.Spread),
                            this.visit(node.name),
                            this.mapType(node)
                        ),
                        [],
                        node.initializer ? this.leftPadded(this.prefix(node.getChildAt(node.getChildren().indexOf(node.initializer) - 1)), this.visit(node.initializer)) : null,
                        this.mapVariableType(node)
                    ),
                    this.suffix(node.name)
                )]
            );
        }

        const nameExpression = this.visit(node.name)

        if (nameExpression instanceof J.Identifier) {
            return new J.VariableDeclarations(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.mapDecorators(node),
                this.mapModifiers(node),
                this.mapTypeInfo(node),
                null,
                [],
                [this.rightPadded(
                    new J.VariableDeclarations.NamedVariable(
                        randomId(),
                        this.prefix(node.name),
                        Markers.EMPTY,
                        nameExpression,
                        [],
                        node.initializer ? this.leftPadded(this.prefix(node.getChildAt(node.getChildren().indexOf(node.initializer) - 1)), this.visit(node.initializer)) : null,
                        this.mapVariableType(node)
                    ),
                    this.suffix(node.name)
                )]
            );
        }

        return new JS.JSVariableDeclarations(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapDecorators(node),
            this.mapModifiers(node),
            this.mapTypeInfo(node),
            null,
            [this.rightPadded(
                new JS.JSVariableDeclarations.JSNamedVariable(
                    randomId(),
                    this.prefix(node.name),
                    Markers.EMPTY,
                    nameExpression,
                    [],
                    node.initializer ? this.leftPadded(this.prefix(node.getChildAt(node.getChildren().indexOf(node.initializer) - 1)), this.visit(node.initializer)) : null,
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
            annotationType = new JS.ExpressionWithTypeArguments(
                randomId(),
                Space.EMPTY,
                Markers.EMPTY,
                this.convert(node.expression.expression),
                node.expression.typeArguments ? this.mapTypeArguments(this.suffix(node.expression.expression), node.expression.typeArguments) : null,
                null
            );
            _arguments = this.mapCommaSeparatedList(node.expression.getChildren(this.sourceFile).slice(-3))
        } else if (ts.isIdentifier(node.expression)) {
            annotationType = this.convert(node.expression);
        } else if (ts.isPropertyAccessExpression(node.expression)) {
            annotationType = this.convert(node.expression);
        } else if (ts.isParenthesizedExpression(node.expression)) {
            annotationType = new JS.TypeTreeExpression(
                randomId(),
                this.prefix(node.expression),
                Markers.EMPTY,
                this.convert(node.expression)
            );
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

        const nameExpression = this.visit(node.name)

        if (nameExpression instanceof J.Identifier) {
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
                        nameExpression,
                        [],
                        null,
                        this.mapVariableType(node)
                    ),
                    Space.EMPTY
                )]
            );
        } else {
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
                        nameExpression,
                        [],
                        null,
                        this.mapVariableType(node)
                    ),
                    Space.EMPTY
                )]
            );
        }
    }

    visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        if (node.questionToken) {
            return new JS.JSVariableDeclarations(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.mapDecorators(node),
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

        if (node.exclamationToken) {
            return new JS.JSVariableDeclarations(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.mapDecorators(node),
                this.mapModifiers(node),
                this.mapTypeInfo(node),
                null,
                [this.rightPadded(
                    new JS.JSVariableDeclarations.JSNamedVariable(
                        randomId(),
                        this.prefix(node.name),
                        Markers.EMPTY,
                        new JS.Unary(
                            randomId(),
                            Space.EMPTY,
                            Markers.EMPTY,
                            this.leftPadded(this.suffix(node.name), JS.Unary.Type.Exclamation),
                            this.visit(node.name),
                            this.mapType(node)
                        ),
                        [],
                        node.initializer ? this.leftPadded(this.prefix(node.getChildAt(node.getChildren().indexOf(node.initializer) - 1)), this.visit(node.initializer)) : null,
                        this.mapVariableType(node)
                    ),
                    Space.EMPTY
                )]
            );
        }

        const nameExpression = this.visit(node.name)

        if (nameExpression instanceof J.Identifier) {
            return new J.VariableDeclarations(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.mapDecorators(node),
                this.mapModifiers(node),
                this.mapTypeInfo(node),
                null,
                [],
                [this.rightPadded(
                    new J.VariableDeclarations.NamedVariable(
                        randomId(),
                        this.prefix(node.name),
                        Markers.EMPTY,
                        nameExpression,
                        [],
                        node.initializer ? this.leftPadded(this.prefix(node.getChildAt(node.getChildren().indexOf(node.initializer) - 1)), this.visit(node.initializer)) : null,
                        this.mapVariableType(node)
                    ),
                    this.suffix(node.name)
                )]
            );
        }

        return new JS.JSVariableDeclarations(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapDecorators(node),
            this.mapModifiers(node),
            this.mapTypeInfo(node),
            null,
            [this.rightPadded(
                new JS.JSVariableDeclarations.JSNamedVariable(
                    randomId(),
                    this.prefix(node.name),
                    Markers.EMPTY,
                    nameExpression,
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

        if (ts.isComputedPropertyName(node.name)) {
            return new JS.JSMethodDeclaration(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                [], // no decorators allowed
                [], // no modifiers allowed
                this.mapTypeParametersAsObject(node),
                this.mapTypeInfo(node),
                this.convert(node.name),
                this.mapCommaSeparatedList(this.getParameterListNodes(node)),
                null,
                null,
                null,
                this.mapMethodType(node)
            );
        }

        const name: J.Identifier = !node.name
            ? this.mapIdentifier(node, "")
            : ts.isStringLiteral(node.name)
                ? this.mapIdentifier(node.name, node.name.getText())
                : this.visit(node.name);

        return new J.MethodDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [], // no decorators allowed
            [], // no modifiers allowed
            this.mapTypeParametersAsObject(node),
            this.mapTypeInfo(node),
            new J.MethodDeclaration.IdentifierWithAnnotations(
                name,
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
        if (node.questionToken || node.asteriskToken) {
            let methodName = node.questionToken ? this.getOptionalUnary(node) : this.visit(node.name);

            if (node.asteriskToken) {
                methodName = new JS.Unary(
                    randomId(),
                    this.prefix(node.asteriskToken),
                    Markers.EMPTY,
                    this.leftPadded(this.prefix(node.name), JS.Unary.Type.Asterisk),
                    methodName,
                    this.mapType(node)
                )
            }

            return new JS.JSMethodDeclaration(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.mapDecorators(node),
                this.mapModifiers(node),
                this.mapTypeParametersAsObject(node),
                this.mapTypeInfo(node),
                methodName,
                this.mapCommaSeparatedList(this.getParameterListNodes(node)),
                null,
                node.body ? this.convert<J.Block>(node.body) : null,
                null,
                this.mapMethodType(node)
            );
        }
        const name = node.name ? this.visit(node.name) : this.mapIdentifier(node, "");
        if (!(name instanceof J.Identifier)) {
            return new JS.JSMethodDeclaration(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.mapDecorators(node),
                this.mapModifiers(node),
                this.mapTypeParametersAsObject(node),
                this.mapTypeInfo(node),
                name,
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
                name,
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
        | ts.FunctionDeclaration | ts.ConstructSignatureDeclaration | ts.FunctionExpression | ts.NamedTupleMember) {
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
        const name = this.visit(node.name);
        if (!(name instanceof J.Identifier)) {
            return new JS.JSMethodDeclaration(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.mapDecorators(node),
                this.mapModifiers(node),
                null,
                this.mapTypeInfo(node),
                name,
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
            null,
            this.mapTypeInfo(node),
            new J.MethodDeclaration.IdentifierWithAnnotations(
                name,
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
        const name = this.visit(node.name);
        if (!(name instanceof J.Identifier)) {
            return new JS.JSMethodDeclaration(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.mapDecorators(node),
                this.mapModifiers(node),
                null,
                null,
                name,
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
            null,
            null,
            new J.MethodDeclaration.IdentifierWithAnnotations(
                name,
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
        return new JS.IndexSignatureDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapModifiers(node),
            this.mapCommaSeparatedList(this.getParameterListNodes(node, ts.SyntaxKind.OpenBracketToken)),
            this.leftPadded(this.prefix(node.getChildAt(node.getChildren().indexOf(node.type) - 1)), this.convert(node.type)),
            this.mapType(node)
        );
    }

    visitTypePredicate(node: ts.TypePredicateNode) {
        return new JS.TypePredicate(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.assertsModifier ? this.leftPadded(this.prefix(node.assertsModifier), true) : this.leftPadded(Space.EMPTY, false),
            this.visit(node.parameterName),
            node.type ? this.leftPadded(this.suffix(node.parameterName), this.convert(node.type)) : null,
            this.mapType(node)
        );
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
            [],
            this.leftPadded(Space.EMPTY, false),
            this.mapTypeParametersAsObject(node),
            new JContainer(
                this.prefix(node.getChildAt(node.getChildren().findIndex(n => n.pos === node.parameters.pos) - 1)),
                node.parameters.length == 0 ?
                    [this.rightPadded(this.newJEmpty(), this.prefix(this.findChildNode(node, ts.SyntaxKind.CloseParenToken)!))]
                    : node.parameters.map(p => this.rightPadded(this.visit(p), this.suffix(p)))
                    .concat(node.parameters.hasTrailingComma ? this.rightPadded(this.newJEmpty(), this.prefix(this.findChildNode(node, ts.SyntaxKind.CloseParenToken)!)) : []),
                Markers.EMPTY),
            this.prefix(this.findChildNode(node, ts.SyntaxKind.EqualsGreaterThanToken)!),
            this.convert(node.type),
            null);
    }

    visitConstructorType(node: ts.ConstructorTypeNode) {
        return new JS.FunctionType(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapModifiers(node),
            this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.NewKeyword)!), true),
            this.mapTypeParametersAsObject(node),
            new JContainer(
                this.prefix(node.getChildAt(node.getChildren().findIndex(n => n.pos === node.parameters.pos) - 1)),
                node.parameters.length == 0 ?
                    [this.rightPadded(this.newJEmpty(), this.prefix(this.findChildNode(node, ts.SyntaxKind.CloseParenToken)!))]
                    : node.parameters.map(p => this.rightPadded(this.visit(p), this.suffix(p)))
                        .concat(node.parameters.hasTrailingComma ? this.rightPadded(this.newJEmpty(), this.prefix(this.findChildNode(node, ts.SyntaxKind.CloseParenToken)!)) : []),
                Markers.EMPTY),
            this.prefix(this.findChildNode(node, ts.SyntaxKind.EqualsGreaterThanToken)!),
            this.convert(node.type),
            null);
    }

    visitTypeQuery(node: ts.TypeQueryNode) {
        return new JS.TypeQuery(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.convert(node.exprName),
            node.typeArguments ? this.mapTypeArguments(this.suffix(node.exprName), node.typeArguments) : null,
            this.mapType(node)
        )
    }

    visitTypeLiteral(node: ts.TypeLiteralNode) {
        return new JS.TypeLiteral(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
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

    visitArrayType(node: ts.ArrayTypeNode) {
        return new J.ArrayType(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.convert(node.elementType),
            null,
            this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenBracketToken)!), this.prefix(this.findChildNode(node, ts.SyntaxKind.CloseBracketToken)!) ),
            this.mapType(node)!
        )
    }

    visitTupleType(node: ts.TupleTypeNode) {
        return new JS.Tuple(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            new JContainer(
                Space.EMPTY,
                node.elements.length > 0 ?
                    node.elements.map(p => this.rightPadded(this.convert(p), this.suffix(p)))
                        .concat(node.elements.hasTrailingComma ? this.rightPadded(this.newJEmpty(), this.prefix(this.findChildNode(node, ts.SyntaxKind.CloseBracketToken)!)) : [])
                    : [this.rightPadded(this.newJEmpty(this.prefix(this.findChildNode(node, ts.SyntaxKind.CloseBracketToken)!)), Space.EMPTY)], // to handle the case: [/*no*/]
                    Markers.EMPTY),
            this.mapType(node)
        );
    }

    visitOptionalType(node: ts.OptionalTypeNode) {
        return new JS.Unary(
            randomId(),
            Space.EMPTY,
            Markers.EMPTY,
            this.leftPadded(this.suffix(node.type), JS.Unary.Type.Optional),
            this.visit(node.type),
            this.mapType(node)
        );
    }

    visitRestType(node: ts.RestTypeNode) {
        return new JS.Unary(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.leftPadded(Space.EMPTY, JS.Unary.Type.Spread),
            this.convert(node.type),
            this.mapType(node)
        );
    }

    visitUnionType(node: ts.UnionTypeNode) {
        const initialBar = getPreviousSibling(node.types[0]);
        return new JS.Union(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [
                ...(initialBar?.kind == ts.SyntaxKind.BarToken ? [this.rightPadded<J.Expression>(this.newJEmpty(), this.prefix(initialBar))] : []),
                ...this.rightPaddedList<ts.Node, J.Expression>([...node.types], (n) => this.keywordPrefix(ts.SyntaxKind.BarToken, getNextSibling)(n))
            ],
            this.mapType(node),
        );
    }

    visitIntersectionType(node: ts.IntersectionTypeNode) {
        const initialAmpersand = getPreviousSibling(node.types[0]);
        return new JS.Intersection(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [
                ...(initialAmpersand?.kind == ts.SyntaxKind.AmpersandToken ? [this.rightPadded<J.Expression>(this.newJEmpty(), this.prefix(initialAmpersand))] : []),
                ...this.rightPaddedList<ts.Node, J.Expression>([...node.types], (n) => this.keywordPrefix(ts.SyntaxKind.AmpersandToken, getNextSibling)(n))
            ],
            this.mapType(node),
        );
    }

    visitConditionalType(node: ts.ConditionalTypeNode) {
        return new JS.ConditionalType(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.visit(node.checkType),
            new JContainer(
                this.prefix(this.findChildNode(node, ts.SyntaxKind.ExtendsKeyword)!),
                [this.rightPadded(
                    new J.Ternary(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    this.convert(node.extendsType),
                    this.leftPadded(this.suffix(node.extendsType), this.convert(node.trueType)),
                    this.leftPadded(this.suffix(node.trueType), this.convert(node.falseType)),
                    this.mapType(node)),
                    Space.EMPTY
                )],
                Markers.EMPTY
            ),
            this.mapType(node)
        );
    }

    visitInferType(node: ts.InferTypeNode) {
        return new JS.InferType(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.leftPadded(Space.EMPTY, this.convert(node.typeParameter)),
            this.mapType(node)
        );
    }

    visitParenthesizedType(node: ts.ParenthesizedTypeNode) {
        return new J.ParenthesizedTypeTree(
            randomId(),
            Space.EMPTY,
            Markers.EMPTY,
            [],
            new J.Parentheses(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.rightPadded(this.convert(node.type), this.prefix(node.getLastToken()!))
            )
        );
    }

    visitThisType(node: ts.ThisTypeNode) {
        return this.mapIdentifier(node, 'this');
    }

    visitTypeOperator(node: ts.TypeOperatorNode) {
        function mapTypeOperator(operator: ts.SyntaxKind.KeyOfKeyword | ts.SyntaxKind.UniqueKeyword | ts.SyntaxKind.ReadonlyKeyword): JS.TypeOperator.Type | undefined {
            switch (operator) {
                case ts.SyntaxKind.KeyOfKeyword:
                    return JS.TypeOperator.Type.KeyOf;
                case ts.SyntaxKind.ReadonlyKeyword:
                    return JS.TypeOperator.Type.ReadOnly;
                case ts.SyntaxKind.UniqueKeyword:
                    return JS.TypeOperator.Type.Unique;
            }
        }

        return new JS.TypeOperator(
          randomId(),
          this.prefix(node),
          Markers.EMPTY,
          mapTypeOperator(node.operator)!,
          this.leftPadded(this.prefix(node.type), this.visit(node.type))
        );
    }

    visitIndexedAccessType(node: ts.IndexedAccessTypeNode) {
        return new JS.IndexedAccessType(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.convert(node.objectType),
            new JS.IndexedAccessType.IndexType(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenBracketToken)!),
                Markers.EMPTY,
                this.rightPadded(this.convert(node.indexType), this.suffix(node.indexType)),
                this.mapType(node.indexType)
            ),
            this.mapType(node)
        );
    }

    visitMappedType(node: ts.MappedTypeNode) {
        function hasPrefixToken(readonlyToken?: ts.ReadonlyKeyword | ts.PlusToken | ts.MinusToken): boolean {
            return !!(readonlyToken && (readonlyToken.kind == ts.SyntaxKind.PlusToken || readonlyToken.kind == ts.SyntaxKind.MinusToken));
        }

        function hasSuffixToken(questionToken?: ts.QuestionToken | ts.PlusToken | ts.MinusToken): boolean {
            return !!(questionToken && (questionToken.kind == ts.SyntaxKind.PlusToken || questionToken.kind == ts.SyntaxKind.MinusToken));
        }

        return new JS.MappedType(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            hasPrefixToken(node.readonlyToken) ? this.leftPadded(this.prefix(node.readonlyToken!),
                new J.Literal(
                    randomId(),
                    this.prefix(node.readonlyToken!),
                    Markers.EMPTY,
                    null,
                    node.readonlyToken!.getText(),
                    null,
                    this.mapPrimitiveType(node.readonlyToken!)
                )) : null,
            node.readonlyToken ? this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.ReadonlyKeyword)!), true) : this.leftPadded(Space.EMPTY, false),
            new JS.MappedType.KeysRemapping(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenBracketToken)!),
                Markers.EMPTY,
                this.rightPadded(
                    new JS.MappedType.MappedTypeParameter(
                        randomId(),
                        this.prefix(node.typeParameter),
                        Markers.EMPTY,
                        this.visit(node.typeParameter.name),
                        this.leftPadded(this.suffix(node.typeParameter.name), this.visit(node.typeParameter.constraint!))
                    ),
                    this.suffix(node.typeParameter)),
                node.nameType ? this.rightPadded(this.visit(node.nameType), this.suffix(node.nameType)) : null,
            ),
            hasSuffixToken(node.questionToken) ? this.leftPadded(this.prefix(node.questionToken!),
                new J.Literal(
                    randomId(),
                    this.prefix(node.questionToken!),
                    Markers.EMPTY,
                    null,
                    node.questionToken!.getText(),
                    null,
                    this.mapPrimitiveType(node.questionToken!)
                )
            ): null,
            node.questionToken ? this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.QuestionToken)!), true) : this.leftPadded(Space.EMPTY, false),
            new JContainer(
                this.prefix(this.findChildNode(node, ts.SyntaxKind.ColonToken)!),
                [this.rightPadded(this.visit(node.type!), this.suffix(node.type!)),
                    this.findChildNode(node, ts.SyntaxKind.SemicolonToken) ?
                       this.rightPadded(this.newJEmpty(Space.EMPTY, Markers.build([new Semicolon(randomId())])), this.prefix(node.getLastToken()!))
                       : this.rightPadded(this.newJEmpty(), this.prefix(node.getLastToken()!))
                ],
                Markers.EMPTY
            ),
            this.mapType(node)
        );
    }

    visitLiteralType(node: ts.LiteralTypeNode) {
        return new JS.LiteralType(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.visit(node.literal),
            this.mapType(node)!
        );
    }

    visitNamedTupleMember(node: ts.NamedTupleMember) {
        if (node.questionToken) {
            return new JS.JSVariableDeclarations(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                [],
                [],
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
                    this.suffix(node.name)
                )]
            );
        }

        if (node.dotDotDotToken) {
            return new JS.JSVariableDeclarations(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                [],
                [],
                this.mapTypeInfo(node),
                null,
                [this.rightPadded(
                    new JS.JSVariableDeclarations.JSNamedVariable(
                        randomId(),
                        Space.EMPTY,
                        Markers.EMPTY,
                        new JS.Unary(
                            randomId(),
                            Space.EMPTY,
                            Markers.EMPTY,
                            this.leftPadded(Space.EMPTY, JS.Unary.Type.Spread),
                            this.visit(node.name),
                            this.mapType(node)
                        ),
                        [],
                        null,
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
            [],
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
                this.suffix(node.name)
            )]
        );
    }

    visitTemplateLiteralType(node: ts.TemplateLiteralTypeNode) {
        return new JS.TemplateExpression(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.visit(node.head),
            node.templateSpans.map(s => this.rightPadded(this.visit(s), this.suffix(s))),
            this.mapType(node)
        )
    }

    visitTemplateLiteralTypeSpan(node: ts.TemplateLiteralTypeSpan) {
        return new JS.TemplateExpression.TemplateSpan(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.convert(node.type),
            this.visit(node.literal)
        )
    }

    visitImportType(node: ts.ImportTypeNode) {
        return new JS.ImportType(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.isTypeOf ? this.rightPadded(true, this.suffix(this.findChildNode(node, ts.SyntaxKind.TypeOfKeyword)!)) : this.rightPadded(false, Space.EMPTY),
            new J.ParenthesizedTypeTree(
                randomId(),
                this.suffix(this.findChildNode(node, ts.SyntaxKind.ImportKeyword)!),
                Markers.EMPTY,
                [],
                new J.Parentheses(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    this.rightPadded(this.visit(node.argument), this.suffix(node.argument))
                )
            ),
            node.qualifier ? this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.DotToken)!), this.visit(node.qualifier)): null,
            node.typeArguments ? this.mapTypeArguments(this.suffix(node.qualifier!), node.typeArguments) : null,
            this.mapType(node)
        );
    }

    visitObjectBindingPattern(node: ts.ObjectBindingPattern) {
        return new JS.ObjectBindingDeclarations(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            [],
            null,
            this.mapCommaSeparatedList(node.getChildren(this.sourceFile)),
            null
        );
    }

    visitArrayBindingPattern(node: ts.ArrayBindingPattern) {
        return new JS.ArrayBindingPattern(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapCommaSeparatedList(node.getChildren(this.sourceFile)),
            this.mapType(node)
        );
    }

    visitBindingElement(node: ts.BindingElement) {
        return new JS.BindingElement(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.propertyName ? this.rightPadded(this.convert<J.Identifier>(node.propertyName), this.suffix(node.propertyName)) : null,
            node.dotDotDotToken ? new JS.Unary(
                randomId(),
                this.prefix(node.dotDotDotToken),
                Markers.EMPTY,
                this.leftPadded(Space.EMPTY, JS.Unary.Type.Spread),
                this.convert<J.Expression>(node.name),
                null
            ) : this.convert<TypedTree>(node.name),
            node.initializer ? this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.EqualsToken)!), this.convert<J.Expression>(node.initializer)) : null,
            this.mapVariableType(node),
        );
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
            node.questionDotToken ?
                new JS.Unary(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    this.leftPadded(this.suffix(node.expression), JS.Unary.Type.QuestionDotWithDot),
                    this.visit(node.expression),
                    this.mapType(node)
                ) :
                this.convert(node.expression),
            new J.ArrayDimension(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenBracketToken)!),
                Markers.EMPTY,
                this.rightPadded(this.convert(node.argumentExpression), this.suffix(node.argumentExpression))
            ),
            this.mapType(node)
        );
    }

    visitCallExpression(node: ts.CallExpression) {
        const prefix = this.prefix(node);
        const typeArguments = node.typeArguments ? this.mapTypeArguments(this.prefix(this.findChildNode(node, ts.SyntaxKind.LessThanToken)!), node.typeArguments) : null;

        let select: JRightPadded<J.Expression> | null;
        let name: J.Identifier = new J.Identifier(randomId(), Space.EMPTY, Markers.EMPTY, [], "", null, null);

        if (ts.isIdentifier(node.expression) && !node.questionDotToken) {
            select = null;
            name = this.convert(node.expression);
        } else if (node.questionDotToken) {
            select = this.rightPadded(new JS.Unary(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    this.leftPadded(this.suffix(node.expression), JS.Unary.Type.QuestionDotWithDot),
                    this.visit(node.expression),
                    this.mapType(node)
                ),
                Space.EMPTY
            )
        } else {
            select = this.rightPadded(this.visit(node.expression), this.suffix(node.expression))
        }

        return new J.MethodInvocation(
            randomId(),
            prefix,
            Markers.EMPTY,
            select,
            typeArguments,
            name,
            this.mapCommaSeparatedList(node.getChildren(this.sourceFile).slice(-3)),
            this.mapMethodType(node)
        )
    }

    visitSuperKeyword(node: ts.KeywordToken<ts.SyntaxKind.SuperKeyword>) {
        return this.mapIdentifier(node, node.getText());
    }

    visitNewExpression(node: ts.NewExpression) {
        return new J.NewClass(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            null,
            Space.EMPTY,
            node.typeArguments ? new J.ParameterizedType(
                randomId(),
                Space.EMPTY,
                Markers.EMPTY,
                new TypeTreeExpression(randomId(), Space.EMPTY, Markers.EMPTY, this.visit(node.expression)),
                this.mapTypeArguments(this.prefix(this.findChildNode(node, ts.SyntaxKind.LessThanToken)!), node.typeArguments),
                null
            ): new TypeTreeExpression(randomId(), Space.EMPTY, Markers.EMPTY, this.visit(node.expression)),
            node.arguments ? this.mapCommaSeparatedList(this.getParameterListNodes(node)) : JContainer.empty<J.Expression>().withMarkers(Markers.build([(new J.OmitParentheses(randomId()))])),
            null,
            this.mapMethodType(node)
        );
    }

    visitTaggedTemplateExpression(node: ts.TaggedTemplateExpression) {
        return new JS.TaggedTemplateExpression(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(this.visit(node.tag), this.suffix(node.tag)),
            node.typeArguments ? this.mapTypeArguments(Space.EMPTY, node.typeArguments) : null,
            this.convert(node.template),
            this.mapType(node)
        )
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
            this.mapModifiers(node),
            this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.FunctionKeyword)!), !!node.asteriskToken),
            this.leftPadded(node.asteriskToken ? this.prefix(node.asteriskToken) : Space.EMPTY, node.name ? this.visit(node.name) : new J.Identifier(randomId(), Space.EMPTY, Markers.EMPTY, [], "", null, null)),
            this.mapTypeParametersAsObject(node),
            this.mapCommaSeparatedList(this.getParameterListNodes(node)),
            this.mapTypeInfo(node),
            this.convert(node.body),
            this.mapMethodType(node)
        );
    }

    visitArrowFunction(node: ts.ArrowFunction) {
        const openParenToken = this.findChildNode(node, ts.SyntaxKind.OpenParenToken);
        const isParenthesized = openParenToken != undefined;
        return new JS.ArrowFunction(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            this.mapModifiers(node),
            node.typeParameters ? this.mapTypeParametersAsObject(node) : null,
            new Lambda.Parameters(
                randomId(),
                isParenthesized ? this.prefix(openParenToken) : Space.EMPTY,
                Markers.EMPTY,
                isParenthesized,
                node.parameters.length > 0 ?
                    node.parameters.map(p => this.rightPadded(this.convert(p), this.suffix(p)))
                        .concat(node.parameters.hasTrailingComma ? this.rightPadded(this.newJEmpty(), this.prefix(this.findChildNode(node, ts.SyntaxKind.CloseParenToken)!)) : []) :
                    isParenthesized ? [this.rightPadded(this.newJEmpty(), this.prefix(this.findChildNode(node, ts.SyntaxKind.CloseParenToken)!))] : [] // to handle the case: (/*no*/) => ...
            ),
            this.mapTypeInfo(node),
            this.leftPadded(this.prefix(node.equalsGreaterThanToken), this.convert(node.body)),
            this.mapType(node)
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
            this.leftPadded(this.suffix(node.operand), unaryOperator),
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
            case ts.SyntaxKind.InKeyword:
                binaryOperator = JS.JsBinary.Type.In;
                break;
            case ts.SyntaxKind.CommaToken:
                binaryOperator = JS.JsBinary.Type.Comma;
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
            let assignmentOperation;

            switch (node.operatorToken.kind) {
                case ts.SyntaxKind.QuestionQuestionEqualsToken:
                    assignmentOperation = JS.JsAssignmentOperation.Type.QuestionQuestion;
                    break;
                case ts.SyntaxKind.AmpersandAmpersandEqualsToken:
                    assignmentOperation = JS.JsAssignmentOperation.Type.And;
                    break;
                case ts.SyntaxKind.BarBarEqualsToken:
                    assignmentOperation = JS.JsAssignmentOperation.Type.Or;
                    break;
                case ts.SyntaxKind.AsteriskAsteriskToken:
                    assignmentOperation = JS.JsAssignmentOperation.Type.Power;
                    break;
                case ts.SyntaxKind.AsteriskAsteriskEqualsToken:
                    assignmentOperation = JS.JsAssignmentOperation.Type.Exp;
                    break;
            }

            if (assignmentOperation !== undefined) {
                return new JS.JsAssignmentOperation(
                    randomId(),
                    this.prefix(node),
                    Markers.EMPTY,
                    this.convert(node.left),
                    this.leftPadded(this.prefix(node.operatorToken), assignmentOperation),
                    this.convert(node.right),
                    this.mapType(node)
                )
            }

            assignmentOperation = this.mapAssignmentOperation(node);
            if (assignmentOperation === undefined) {
                return this.visitUnknown(node);
            }
            return new J.AssignmentOperation(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.convert(node.left),
                this.leftPadded(this.prefix(node.operatorToken), assignmentOperation),
                this.convert(node.right),
                this.mapType(node)
            )
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

    private mapAssignmentOperation(node: ts.BinaryExpression): J.AssignmentOperation.Type | undefined {
        switch (node.operatorToken.kind) {
            case ts.SyntaxKind.PlusEqualsToken:
                return J.AssignmentOperation.Type.Addition;
            case ts.SyntaxKind.MinusEqualsToken:
                return J.AssignmentOperation.Type.Subtraction;
            case ts.SyntaxKind.AsteriskEqualsToken:
                return J.AssignmentOperation.Type.Multiplication;
            case ts.SyntaxKind.SlashEqualsToken:
                return J.AssignmentOperation.Type.Division;
            case ts.SyntaxKind.PercentEqualsToken:
                return J.AssignmentOperation.Type.Modulo;
            case ts.SyntaxKind.LessThanLessThanEqualsToken:
                return J.AssignmentOperation.Type.LeftShift;
            case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
                return J.AssignmentOperation.Type.RightShift;
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
                return J.AssignmentOperation.Type.UnsignedRightShift;
            case ts.SyntaxKind.AmpersandEqualsToken:
                return J.AssignmentOperation.Type.BitAnd;
            case ts.SyntaxKind.BarEqualsToken:
                return J.AssignmentOperation.Type.BitOr;
            case ts.SyntaxKind.CaretEqualsToken:
                return J.AssignmentOperation.Type.BitXor;

            // case ts.SyntaxKind.AmpersandAmpersandEqualsToken:
            //     return J.AssignmentOperation.Type.And;
            // case ts.SyntaxKind.BarBarEqualsToken:
            //     return J.AssignmentOperation.Type.Or;
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
        return new JS.TemplateExpression(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.visit(node.head),
            node.templateSpans.map(s => this.rightPadded(this.visit(s), this.suffix(s))),
            this.mapType(node)
        )
    }

    visitYieldExpression(node: ts.YieldExpression) {
        return new JS.Yield(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.asteriskToken ? this.leftPadded(this.prefix(node.asteriskToken), true) : this.leftPadded(Space.EMPTY, false),
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
                this.mapDecorators(node),
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
        return this.newJEmpty(this.prefix(node));
    }

    visitExpressionWithTypeArguments(node: ts.ExpressionWithTypeArguments) {
        if (node.typeArguments) {
            return new JS.ExpressionWithTypeArguments(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.visit(node.expression),
                this.mapTypeArguments(this.suffix(node.expression), node.typeArguments),
                this.mapType(node)
            )
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
        return new J.FieldAccess(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.keywordToken === ts.SyntaxKind.NewKeyword ? this.mapIdentifier(node, 'new') : this.mapIdentifier(node, 'import'),
            this.leftPadded(this.prefix(node.getChildAt(1, this.sourceFile)), this.convert(node.name)),
            this.mapType(node)
        );
    }

    visitSyntheticExpression(node: ts.SyntheticExpression) {
        // SyntheticExpression is a special type of node used internally by the TypeScript compiler
        return this.visitUnknown(node);
    }

    visitSatisfiesExpression(node: ts.SatisfiesExpression) {
        return new JS.SatisfiesExpression(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.visit(node.expression),
            this.leftPadded(this.suffix(node.expression), this.visit(node.type)),
            this.mapType(node)
        );
    }

    visitTemplateSpan(node: ts.TemplateSpan) {
        return new JS.TemplateExpression.TemplateSpan(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.convert(node.expression),
            this.visit(node.literal)
        )
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
        const declaration =  this.visitVariableDeclarationList(node.declarationList);
        return declaration.withModifiers(this.mapModifiers(node).concat(declaration.modifiers)).withPrefix(this.prefix(node));
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
        const semicolonAfterThen = (node.thenStatement.getChildAt(node.thenStatement.getChildCount() - 1)?.kind == ts.SyntaxKind.SemicolonToken);
        const semicolonAfterElse = (node.elseStatement?.getChildAt(node.elseStatement.getChildCount() - 1)?.kind == ts.SyntaxKind.SemicolonToken);
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
                    semicolonAfterElse ? this.prefix(node.elseStatement.getLastToken()!) : Space.EMPTY,
                    semicolonAfterElse ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
                )
            ) : null
        );
    }

    visitDoStatement(node: ts.DoStatement) {
        return new J.DoWhileLoop(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(this.visit(node.statement),
                node.statement.kind === ts.SyntaxKind.ExpressionStatement ? this.prefix(node.statement.getLastToken()!) : this.suffix(node.statement),
                node.statement.kind === ts.SyntaxKind.ExpressionStatement ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY),
            this.leftPadded(
                this.prefix(this.findChildNode(node, ts.SyntaxKind.WhileKeyword)!),
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
               node.statement.getChildAt(node.statement.getChildCount() - 1)?.kind == ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
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
                        this.rightPadded(new ExpressionStatement(randomId(), this.visit(node.initializer)), this.suffix(node.initializer))) :
                    this.rightPadded(this.newJEmpty(), this.suffix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!))],  // to handle for (/*_*/; ; );
                node.condition ? this.rightPadded(ts.isStatement(node.condition) ? this.visit(node.condition) : new ExpressionStatement(randomId(), this.visit(node.condition)), this.suffix(node.condition)) :
                    this.rightPadded(this.newJEmpty(), this.suffix(this.findChildNode(node, ts.SyntaxKind.SemicolonToken)!)),  // to handle for ( ;/*_*/; );
                [node.incrementor ? this.rightPadded(ts.isStatement(node.incrementor) ? this.visit(node.incrementor) : new ExpressionStatement(randomId(), this.visit(node.incrementor)), this.suffix(node.incrementor)) :
                    this.rightPadded(this.newJEmpty(this.prefix(this.findChildNode(node, ts.SyntaxKind.CloseParenToken)!)), Space.EMPTY)],  // to handle for ( ; ;/*_*/);
            ),
            this.rightPadded(
                this.convert(node.statement),
                this.semicolonPrefix(node.statement),
                node.statement.getChildAt(node.statement.getChildCount() - 1)?.kind == ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
            )
        );
    }

    visitForInStatement(node: ts.ForInStatement) {
        return new JS.JSForInLoop(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            new JS.JSForInOfLoopControl(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!),
                Markers.EMPTY,
                this.rightPadded(this.visit(node.initializer), this.suffix(node.initializer)),
                this.rightPadded(this.visit(node.expression), this.suffix(node.expression))
            ),
            this.rightPadded(
                this.convert(node.statement),
                this.semicolonPrefix(node.statement),
                node.statement.getChildAt(node.statement.getChildCount() - 1)?.kind == ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
            )
        );
    }

    visitForOfStatement(node: ts.ForOfStatement) {
        return new JS.JSForOfLoop(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.awaitModifier ? this.leftPadded(this.prefix(node.awaitModifier), true) : this.leftPadded(Space.EMPTY, false),
            new JS.JSForInOfLoopControl(
                randomId(),
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!),
                Markers.EMPTY,
                this.rightPadded(this.visit(node.initializer), this.suffix(node.initializer)),
                this.rightPadded(this.visit(node.expression), this.suffix(node.expression))
            ),
            this.rightPadded(
                this.convert(node.statement),
                this.semicolonPrefix(node.statement),
                node.statement.getChildAt(node.statement.getChildCount() - 1)?.kind == ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
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
        return new JS.WithStatement(
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
                node.statement.getChildAt(node.statement.getChildCount() - 1)?.kind == ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
            )
        );
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
            new JS.TrailingTokenStatement(
                randomId(),
                Space.EMPTY,
                Markers.EMPTY,
                this.rightPadded(
                    this.visit(node.statement),
                    this.semicolonPrefix(node.statement),
                    node.statement.getChildAt(node.statement.getChildCount() - 1)?.kind == ts.SyntaxKind.SemicolonToken ? Markers.build([new Semicolon(randomId())]) : Markers.EMPTY
                ),
                this.mapType(node.statement)
            )
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
        if (node.catchClause?.variableDeclaration?.name && !ts.isIdentifier(node.catchClause?.variableDeclaration?.name)) {
            return new JS.JSTry(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                this.visit(node.tryBlock),
                this.visit(node.catchClause),
                node.finallyBlock ? this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.FinallyKeyword)!), this.visit(node.finallyBlock)) : null
            );
        }

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
        return new ExpressionStatement(
            randomId(),
            this.mapIdentifier(node, 'debugger')
        );
    }

    visitVariableDeclaration(node: ts.VariableDeclaration) {
        const nameExpression = this.visit(node.name);

        if (nameExpression instanceof J.Identifier && !node.exclamationToken) {
            return new J.VariableDeclarations.NamedVariable(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                nameExpression,
                [],
                node.initializer ? this.leftPadded(this.prefix(node.getChildAt(node.getChildCount(this.sourceFile) - 2)), this.visit(node.initializer)) : null,
                this.mapVariableType(node)
            );
        }

        return new JS.JSVariableDeclarations.JSNamedVariable(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.exclamationToken ? new JS.Unary(
                randomId(),
                Space.EMPTY,
                Markers.EMPTY,
                this.leftPadded(
                    this.suffix(node.name),
                    JS.Unary.Type.Exclamation
                ),
                nameExpression,
                this.mapType(node)
            ) : nameExpression,
            [],
            node.initializer ? this.leftPadded(this.prefix(node.getChildAt(node.getChildCount(this.sourceFile) - 2)), this.visit(node.initializer)) : null,
            this.mapVariableType(node)
        );
    }

    visitVariableDeclarationList(node: ts.VariableDeclarationList) {
        let kind = node.getFirstToken();

        // to parse the declaration case: await using db = ...
        let modifier;
        if (kind?.kind === ts.SyntaxKind.AwaitKeyword) {
            modifier = new J.Modifier(
                randomId(),
                this.prefix(kind),
                Markers.EMPTY,
                'await',
                J.Modifier.Type.LanguageExtension,
                []
            );
            kind = node.getChildAt(1);
        }
        return new JS.ScopedVariableDeclarations(
            randomId(),
            Space.EMPTY,
            Markers.EMPTY,
            modifier ? [modifier] : [],
            this.leftPadded(
                kind ? this.prefix(kind) : this.prefix(node),
                kind?.kind === ts.SyntaxKind.LetKeyword
                    ? JS.ScopedVariableDeclarations.Scope.Let
                    : kind?.kind === ts.SyntaxKind.ConstKeyword
                    ? JS.ScopedVariableDeclarations.Scope.Const
                    : kind?.kind === ts.SyntaxKind.UsingKeyword
                    ? JS.ScopedVariableDeclarations.Scope.Using
                    : JS.ScopedVariableDeclarations.Scope.Var
            ),
            node.declarations.map((declaration) => {
                const declarationExpression = this.visit(declaration);

                return this.rightPadded(
                    JS.isJavaScript(declarationExpression)
                        ? new JS.JSVariableDeclarations(
                            randomId(),
                            this.prefix(declaration),
                            Markers.EMPTY,
                            [], // FIXME decorators?
                            [], // FIXME modifiers?
                            this.mapTypeInfo(declaration),
                            null, // FIXME varargs
                            [this.rightPadded(declarationExpression as JS.JSVariableDeclarations.JSNamedVariable, Space.EMPTY)]
                        )
                        : new J.VariableDeclarations(
                            randomId(),
                            this.prefix(declaration),
                            Markers.EMPTY,
                            [], // FIXME decorators?
                            [], // FIXME modifiers?
                            this.mapTypeInfo(declaration),
                            null, // FIXME varargs
                            [],
                            [this.rightPadded(declarationExpression, Space.EMPTY)]
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
            this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.FunctionKeyword)!), !!node.asteriskToken),
            this.leftPadded(node.asteriskToken ? this.prefix(node.asteriskToken) : Space.EMPTY, node.name ? this.visit(node.name) : new J.Identifier(randomId(), Space.EMPTY, Markers.EMPTY, [], "", null, null)),
            this.mapTypeParametersAsObject(node),
            this.mapCommaSeparatedList(this.getParameterListNodes(node)),
            this.mapTypeInfo(node),
            node.body ? this.convert(node.body) : null,
            this.mapMethodType(node)
        );
    }

    private getParameterListNodes(node: ts.SignatureDeclarationBase | ts.NewExpression, openToken : ts.SyntaxKind = ts.SyntaxKind.OpenParenToken) {
        const children = node.getChildren(this.sourceFile);
        for (let i = 0; i < children.length; i++) {
            if (children[i].kind == openToken) {
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
        return new JS.TypeDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapModifiers(node),
            this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.TypeKeyword)!), this.visit(node.name)),
            node.typeParameters ? this.mapTypeParametersAsObject(node) : null,
            this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.EqualsToken)!), this.convert(node.type)),
            this.mapType(node)
        );
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
        const body = node.body ? this.visit(node.body as ts.Node) : null;

        let namespaceKeyword = this.findChildNode(node, ts.SyntaxKind.NamespaceKeyword) ?? this.findChildNode(node, ts.SyntaxKind.ModuleKeyword);
        let keywordType: JS.NamespaceDeclaration.KeywordType;
        if (namespaceKeyword == undefined) {
            keywordType = JS.NamespaceDeclaration.KeywordType.Empty;
        } else if (namespaceKeyword?.kind === ts.SyntaxKind.NamespaceKeyword) {
            keywordType = JS.NamespaceDeclaration.KeywordType.Namespace;
        } else {
            keywordType = JS.NamespaceDeclaration.KeywordType.Module;
        }
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
                    (body.name instanceof J.FieldAccess)
                        ? this.remapFieldAccess(body.name, node.name)
                        : new J.FieldAccess(
                            randomId(),
                            Space.EMPTY,
                            Markers.EMPTY,
                            this.visit(node.name),
                            new J.JLeftPadded(
                                this.suffix(node.name),
                                body.name as J.Identifier,
                                Markers.EMPTY
                            ),
                            null
                        ),
                    body.padding.name.after
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
                this.rightPadded(this.convert(node.name), this.suffix(node.name)), // J.FieldAccess
                body // J.Block
            );
        }
    }

    private remapFieldAccess(fa: FieldAccess, name: ts.ModuleName): FieldAccess {
        if (fa.target instanceof J.Identifier) {
            return new J.FieldAccess(
                randomId(),
                Space.EMPTY,
                Markers.EMPTY,
                new J.FieldAccess(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    this.visit(name),
                    this.leftPadded(
                        this.suffix(name),
                        fa.target
                    ),
                    null
                ),
                fa.padding.name,
                null
            );
        }

        return new J.FieldAccess(
            randomId(),
            Space.EMPTY,
            Markers.EMPTY,
            this.remapFieldAccess(fa.target as FieldAccess, name),
            fa.padding.name,
            null
        );
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
        return new JS.NamespaceDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [
                new J.Modifier(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    'export',
                    J.Modifier.Type.LanguageExtension,
                    []
                ),
                new J.Modifier(
                    randomId(),
                    this.prefix(this.findChildNode(node, ts.SyntaxKind.AsKeyword)!),
                    Markers.EMPTY,
                    'as',
                    J.Modifier.Type.LanguageExtension,
                    []
                )
            ],
            this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.NamespaceKeyword)!), JS.NamespaceDeclaration.KeywordType.Namespace),
            this.rightPadded(this.convert(node.name), this.suffix(node.name)),
            null
        );
    }

    visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        const kind = this.findChildNode(node, ts.SyntaxKind.ImportKeyword)!;

        return new JS.ScopedVariableDeclarations(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapModifiers(node),
            this.leftPadded(
                this.prefix(kind),
                JS.ScopedVariableDeclarations.Scope.Import
            ),
            [
                this.rightPadded(new J.VariableDeclarations(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    [],
                    node.isTypeOnly ? [new J.Modifier(
                        randomId(),
                        this.prefix(this.findChildNode(node, ts.SyntaxKind.TypeKeyword)!),
                        Markers.EMPTY,
                        "type",
                        J.Modifier.Type.LanguageExtension,
                        []
                    )] : [],
                    null,
                    null,
                    [],
                    [this.rightPadded(new J.VariableDeclarations.NamedVariable(
                        randomId(),
                        Space.EMPTY,
                        Markers.EMPTY,
                        this.visit(node.name),
                        [],
                        this.leftPadded(this.suffix(node.name), this.visit(node.moduleReference)),
                        this.mapVariableType(node)
                    ), Space.EMPTY)]
                ), Space.EMPTY)
            ]
        )
    }

    visitImportKeyword(node: ts.ImportExpression) {
        // this is used for dynamic imports as in `await import('foo')`
        return this.mapIdentifier(node, 'import');
    }

    visitImportDeclaration(node: ts.ImportDeclaration) {
        return new JS.JsImport(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapModifiers(node),
            node.importClause ? this.visit(node.importClause) : null,
            this.leftPadded(node.importClause ? this.prefix(this.findChildNode(node, ts.SyntaxKind.FromKeyword)!) : Space.EMPTY, this.visit(node.moduleSpecifier)),
            node.attributes ? this.visit(node.attributes) : null
        );
    }

    visitImportClause(node: ts.ImportClause) {
        return new JS.JsImportClause(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            node.isTypeOnly,
            node.name ? this.rightPadded(this.visit(node.name), this.suffix(node.name)) : null,
            node.namedBindings ? this.visit(node.namedBindings) : null
        );
    }

    visitNamespaceImport(node: ts.NamespaceImport) {
        return new JS.Alias(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(this.mapIdentifier(node, "*"), this.prefix(this.findChildNode(node, ts.SyntaxKind.AsKeyword)!)),
            this.visit(node.name)
        );
    }

    visitNamedImports(node: ts.NamedImports) {
        return new JS.NamedImports(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapCommaSeparatedList(node.getChildren(this.sourceFile)),
            null
        );
    }

    visitImportSpecifier(node: ts.ImportSpecifier) {
        return new JS.JsImportSpecifier(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.leftPadded(
                node.isTypeOnly ? this.prefix(this.findChildNode(node, ts.SyntaxKind.TypeKeyword)!) : Space.EMPTY,
                node.isTypeOnly
            ),
            node.propertyName
                ? new JS.Alias(
                    randomId(),
                    this.prefix(node.propertyName),
                    Markers.EMPTY,
                    this.rightPadded(this.convert(node.propertyName), this.suffix(node.propertyName)),
                    this.convert(node.name)
                )
                : this.convert(node.name),
            this.mapType(node)
        );
    }

    visitExportAssignment(node: ts.ExportAssignment) {
        return new JS.ExportAssignment(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapModifiers(node),
            this.leftPadded(node.isExportEquals ? this.prefix(this.findChildNode(node, ts.SyntaxKind.EqualsToken)!) : Space.EMPTY, (!!node.isExportEquals)),
            this.visit(node.expression)
        );
    }

    visitExportDeclaration(node: ts.ExportDeclaration) {
        return new JS.ExportDeclaration(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapModifiers(node),
            this.leftPadded(node.isTypeOnly ? this.prefix(this.findChildNode(node, ts.SyntaxKind.TypeKeyword)!) : Space.EMPTY, node.isTypeOnly),
            node.exportClause ? this.visit(node.exportClause) : this.mapIdentifier(this.findChildNode(node, ts.SyntaxKind.AsteriskToken)!, "*"),
            node.moduleSpecifier ? this.leftPadded(this.prefix(this.findChildNode(node, ts.SyntaxKind.FromKeyword)!), this.visit(node.moduleSpecifier)) : null
        );
    }

    visitNamedExports(node: ts.NamedExports) {
        return new JS.NamedExports(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.mapCommaSeparatedList(node.getChildren()),
            this.mapType(node)
        );
    }

    visitNamespaceExport(node: ts.NamespaceExport) {
        return new JS.Alias(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(this.mapIdentifier(this.findChildNode(node, ts.SyntaxKind.AsteriskToken)!, "*"), this.prefix(this.findChildNode(node, ts.SyntaxKind.AsKeyword)!)),
            this.visit(node.name)
        )
    }

    visitExportSpecifier(node: ts.ExportSpecifier) {
        return new JS.ExportSpecifier(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.leftPadded(node.isTypeOnly ? this.prefix(this.findChildNode(node, ts.SyntaxKind.TypeKeyword)!) : Space.EMPTY, node.isTypeOnly),
            node.propertyName
                ? new JS.Alias(
                    randomId(),
                    this.prefix(node.propertyName),
                    Markers.EMPTY,
                    this.rightPadded(this.convert(node.propertyName), this.suffix(node.propertyName)),
                    this.convert(node.name)
                )
                : this.convert(node.name),
            this.mapType(node)
        );
    }

    visitMissingDeclaration(node: ts.MissingDeclaration) {
        return this.visitUnknown(node);
    }

    visitExternalModuleReference(node: ts.ExternalModuleReference) {
        return new J.MethodInvocation(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            null,
            null,
            this.mapIdentifier(node, "require"),
            new J.JContainer(
                this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!),
                [this.rightPadded(this.visit(node.expression), this.suffix(node.expression))],
                Markers.EMPTY
            ),
            this.mapMethodType(node)
        )
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
        if (node.variableDeclaration?.name && !ts.isIdentifier(node.variableDeclaration?.name)) {
            return new JS.JSTry.JSCatch(
                randomId(),
                this.prefix(node),
                Markers.EMPTY,
                new J.ControlParentheses(
                    randomId(),
                    this.prefix(this.findChildNode(node, ts.SyntaxKind.OpenParenToken)!),
                    Markers.EMPTY,
                    this.rightPadded(
                        new JS.JSVariableDeclarations(
                            randomId(),
                            this.prefix(node.variableDeclaration),
                            Markers.EMPTY,
                            [],
                            [],
                            this.mapTypeInfo(node.variableDeclaration),
                            null,
                            [this.rightPadded(this.visit(node.variableDeclaration), Space.EMPTY)]
                        ),
                        this.suffix(node.variableDeclaration))
                    ),
                this.visit(node.block)
            )
        }

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
        const openBraceIndex = node.getChildren().findIndex(n => n.kind === ts.SyntaxKind.OpenBraceToken);
        const elements = this.mapCommaSeparatedList<JS.ImportAttribute>(node.getChildren(this.sourceFile).slice(openBraceIndex, openBraceIndex + 3));
        return new JS.ImportAttributes(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            ts.SyntaxKind.WithKeyword === node.token ? JS.ImportAttributes.Token.With : JS.ImportAttributes.Token.Assert,
            elements
        );
    }

    visitImportAttribute(node: ts.ImportAttribute) {
        return new JS.ImportAttribute(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.visit(node.name),
            this.leftPadded(this.suffix(node.name), this.visit(node.value))
        );
    }

    visitPropertyAssignment(node: ts.PropertyAssignment) {
        return new JS.PropertyAssignment(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(this.visit(node.name), this.suffix(node.name)),
            JS.PropertyAssignment.AssigmentToken.Colon,
            this.visit(node.initializer)
        );
    }

    visitShorthandPropertyAssignment(node: ts.ShorthandPropertyAssignment) {
        return new JS.PropertyAssignment(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(this.visit(node.name), this.suffix(node.name)),
            JS.PropertyAssignment.AssigmentToken.Equals,
            node.objectAssignmentInitializer ? this.visit(node.objectAssignmentInitializer) : null
        );
    }

    visitSpreadAssignment(node: ts.SpreadAssignment) {
        return new JS.PropertyAssignment(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            this.rightPadded(
                new JS.Unary(
                    randomId(),
                    Space.EMPTY,
                    Markers.EMPTY,
                    this.leftPadded(
                        Space.EMPTY,
                        JS.Unary.Type.Spread
                    ),
                    this.visit(node.expression),
                    this.mapType(node.expression)
                ),
                this.suffix(node.expression)
            ),
            JS.PropertyAssignment.AssigmentToken.Empty,
            null
        );
    }

    visitEnumMember(node: ts.EnumMember) {
        return new J.EnumValue(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            node.name ? ts.isStringLiteral(node.name) ? this.mapIdentifier(node.name, node.name.getText()) : this.convert(node.name) : this.mapIdentifier(node, ""),
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

    private mapCommaSeparatedList<T extends J.J>(nodes: readonly ts.Node[]): JContainer<T> {
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

    private mapDecorators(node: ts.ClassDeclaration | ts.FunctionDeclaration | ts.MethodDeclaration | ts.ConstructorDeclaration | ts.ParameterDeclaration | ts.PropertyDeclaration | ts.SetAccessorDeclaration | ts.GetAccessorDeclaration | ts.ClassExpression): J.Annotation[] {
        return node.modifiers?.filter(ts.isDecorator)?.map(this.convert<J.Annotation>) ?? [];
    }

    private mapTypeParametersAsJContainer(node: ts.ClassDeclaration | ts.InterfaceDeclaration | ts.ClassExpression): JContainer<J.TypeParameter> | null {
        return node.typeParameters
            ? JContainer.build(
                this.prefix(this.findChildNode(node, ts.SyntaxKind.LessThanToken)!),
                this.mapTypeParametersList(node.typeParameters)
                    .concat(node.typeParameters.hasTrailingComma ? this.rightPadded(
                        new J.TypeParameter(randomId(), Space.EMPTY, Markers.EMPTY, [], [], this.newJEmpty(), null),
                        this.prefix(this.findChildNode(node, ts.SyntaxKind.GreaterThanToken)!)) : []),
                Markers.EMPTY
            )
            : null;
    }

    private mapTypeParametersAsObject(node: ts.MethodDeclaration | ts.MethodSignature | ts.FunctionDeclaration
        | ts.CallSignatureDeclaration | ts.ConstructSignatureDeclaration | ts.FunctionExpression | ts.ArrowFunction | ts.TypeAliasDeclaration | ts.FunctionTypeNode | ts.ConstructorTypeNode) : J.TypeParameters | null {
        const typeParameters = node.typeParameters;
        if (!typeParameters) return null;

        return new J.TypeParameters(
            randomId(),
            this.prefix(this.findChildNode(node, ts.SyntaxKind.LessThanToken)!),
            Markers.EMPTY,
            [],
            typeParameters.length == 0 ?
                [this.rightPadded(new J.TypeParameter(randomId(), Space.EMPTY, Markers.EMPTY, [], [], this.newJEmpty(), null), this.prefix(this.findChildNode(node, ts.SyntaxKind.GreaterThanToken)!))]
                : typeParameters.map(tp => this.rightPadded(this.visit(tp), this.suffix(tp)))
                .concat(typeParameters.hasTrailingComma ? this.rightPadded(
                    new J.TypeParameter(randomId(), Space.EMPTY, Markers.EMPTY, [], [], this.newJEmpty(), null),
                    this.prefix(this.findChildNode(node, ts.SyntaxKind.GreaterThanToken)!)) : []),
        );
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

    private getOptionalUnary(node: ts.MethodSignature | ts.MethodDeclaration | ts.ParameterDeclaration | ts.PropertySignature | ts.PropertyDeclaration | ts.NamedTupleMember) {
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
