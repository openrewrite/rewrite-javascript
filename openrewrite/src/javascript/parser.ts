import * as ts from 'typescript';
import * as J from '../java/tree';
import {Comment, JRightPadded, Space, TextComment} from '../java/tree';
import * as JS from './tree';
import {ExecutionContext, Markers, ParseError, Parser, ParserInput, randomId, SourceFile} from "../core";

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
                    result.push(new JavaScriptParserVisitor(sourceFile, typeChecker).visit(sourceFile) as SourceFile);
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

export class JavaScriptParserVisitor {
    constructor(private readonly sourceFile: ts.SourceFile, private readonly typeChecker: ts.TypeChecker) {
    }

    visit(node: ts.Node): any {
        const member = this[(`visit${ts.SyntaxKind[node.kind]}` as keyof JavaScriptParserVisitor)];
        if (typeof member === 'function') {
            return member(node as any);
        } else {
            return this.visitUnknown(node);
        }
    }

    private prefix(node: ts.Node) {
        if (node.getLeadingTriviaWidth(this.sourceFile) == 0) {
            return Space.EMPTY;
        }
        return prefixFromNode(node, this.sourceFile);
        // return Space.format(this.sourceFile.text, node.getFullStart(), node.getFullStart() + node.getLeadingTriviaWidth());
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
            this.rightPaddedList<J.Statement>(node.statements),
            Space.EMPTY
        );
    }

    visitUnknown(node: ts.Node) {
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

    visitClassDeclaration(node: ts.ClassDeclaration) {
        // return new ClassDeclaration(randomId(), node.)
        return this.visitUnknown(node);
    }

    visitNumericLiteral(node: ts.NumericLiteral) {
        return this.visitUnknown(node)
    }

    visitBigIntLiteral(node: ts.BigIntLiteral) {
        return this.visitUnknown(node)
    }

    visitStringLiteral(node: ts.StringLiteral) {
        return this.visitUnknown(node)
    }

    visitJsxText(node: ts.JsxText) {
        return this.visitUnknown(node)
    }

    visitRegularExpressionLiteral(node: ts.RegularExpressionLiteral) {
        return this.visitUnknown(node)
    }

    visitNoSubstitutionTemplateLiteral(node: ts.NoSubstitutionTemplateLiteral) {
        return this.visitUnknown(node)
    }

    visitTemplateHead(node: ts.TemplateHead) {
        return this.visitUnknown(node)
    }

    visitTemplateMiddle(node: ts.TemplateMiddle) {
        return this.visitUnknown(node)
    }

    visitTemplateTail(node: ts.TemplateTail) {
        return this.visitUnknown(node)
    }

    visitIdentifier(node: ts.Identifier) {
        return this.visitUnknown(node);
    }

    visitPrivateIdentifier(node: ts.PrivateIdentifier) {
        return this.visitUnknown(node);
    }

    visitQualifiedName(node: ts.QualifiedName) {
        return this.visitUnknown(node);
    }

    visitComputedPropertyName(node: ts.ComputedPropertyName) {
        return this.visitUnknown(node);
    }

    visitTypeParameter(node: ts.TypeParameterDeclaration) {
        return this.visitUnknown(node);
    }

    visitParameter(node: ts.ParameterDeclaration) {
        return this.visitUnknown(node);
    }

    visitDecorator(node: ts.Decorator) {
        return this.visitUnknown(node);
    }

    visitPropertySignature(node: ts.PropertySignature) {
        return this.visitUnknown(node);
    }

    visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        return this.visitUnknown(node);
    }

    visitMethodSignature(node: ts.MethodSignature) {
        return this.visitUnknown(node);
    }

    visitMethodDeclaration(node: ts.MethodDeclaration) {
        return this.visitUnknown(node);
    }

    visitClassStaticBlockDeclaration(node: ts.ClassStaticBlockDeclaration) {
        return this.visitUnknown(node);
    }

    visitConstructor(node: ts.ConstructorDeclaration) {
        return this.visitUnknown(node);
    }

    visitGetAccessor(node: ts.GetAccessorDeclaration) {
        return this.visitUnknown(node);
    }

    visitSetAccessor(node: ts.SetAccessorDeclaration) {
        return this.visitUnknown(node);
    }

    visitCallSignature(node: ts.CallSignatureDeclaration) {
        return this.visitUnknown(node);
    }

    visitConstructSignature(node: ts.ConstructSignatureDeclaration) {
        return this.visitUnknown(node);
    }

    visitIndexSignature(node: ts.IndexSignatureDeclaration) {
        return this.visitUnknown(node);
    }

    visitTypePredicate(node: ts.TypePredicateNode) {
        return this.visitUnknown(node);
    }

    visitTypeReference(node: ts.TypeReferenceNode) {
        return this.visitUnknown(node)
    }

    visitFunctionType(node: ts.FunctionTypeNode) {
        return this.visitUnknown(node);
    }

    visitConstructorType(node: ts.ConstructorTypeNode) {
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
        return this.visitUnknown(node);
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
        return this.visitUnknown(node);
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
        return this.visitUnknown(node);
    }

    visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
        return this.visitUnknown(node);
    }

    visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
        return this.visitUnknown(node);
    }

    visitElementAccessExpression(node: ts.ElementAccessExpression) {
        return this.visitUnknown(node);
    }

    visitCallExpression(node: ts.CallExpression) {
        return this.visitUnknown(node);
    }

    visitNewExpression(node: ts.NewExpression) {
        return this.visitUnknown(node);
    }

    visitTaggedTemplateExpression(node: ts.TaggedTemplateExpression) {
        return this.visitUnknown(node);
    }

    visitTypeAssertionExpression(node: ts.TypeAssertion) {
        return this.visitUnknown(node);
    }

    visitParenthesizedExpression(node: ts.ParenthesizedExpression) {
        return this.visitUnknown(node);
    }

    visitFunctionExpression(node: ts.FunctionExpression) {
        return this.visitUnknown(node);
    }

    visitArrowFunction(node: ts.ArrowFunction) {
        return this.visitUnknown(node);
    }

    visitDeleteExpression(node: ts.DeleteExpression) {
        return this.visitUnknown(node);
    }

    visitTypeOfExpression(node: ts.TypeOfExpression) {
        return this.visitUnknown(node);
    }

    visitVoidExpression(node: ts.VoidExpression) {
        return this.visitUnknown(node);
    }

    visitAwaitExpression(node: ts.AwaitExpression) {
        return this.visitUnknown(node);
    }

    visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression) {
        return this.visitUnknown(node);
    }

    visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression) {
        return this.visitUnknown(node);
    }

    visitBinaryExpression(node: ts.BinaryExpression) {
        return this.visitUnknown(node);
    }

    visitConditionalExpression(node: ts.ConditionalExpression) {
        return this.visitUnknown(node);
    }

    visitTemplateExpression(node: ts.TemplateExpression) {
        return this.visitUnknown(node);
    }

    visitYieldExpression(node: ts.YieldExpression) {
        return this.visitUnknown(node);
    }

    visitSpreadElement(node: ts.SpreadElement) {
        return this.visitUnknown(node);
    }

    visitClassExpression(node: ts.ClassExpression) {
        return this.visitUnknown(node);
    }

    visitOmittedExpression(node: ts.OmittedExpression) {
        return this.visitUnknown(node);
    }

    visitExpressionWithTypeArguments(node: ts.ExpressionWithTypeArguments) {
        return this.visitUnknown(node);
    }

    visitAsExpression(node: ts.AsExpression) {
        return this.visitUnknown(node);
    }

    visitNonNullExpression(node: ts.NonNullExpression) {
        return this.visitUnknown(node);
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
        return this.visitUnknown(node);
    }

    visitBlock(node: ts.Block) {
        return this.visitUnknown(node);
    }

    visitEmptyStatement(node: ts.EmptyStatement) {
        return this.visitUnknown(node);
    }

    visitVariableStatement(node: ts.VariableStatement): J.VariableDeclarations {
        return new J.VariableDeclarations(
            randomId(),
            this.prefix(node),
            Markers.EMPTY,
            [],
            this.mapModifiers(node),
            null,
            null,
            [],
            this.rightPaddedList(node.declarationList.declarations)
        )
    }

    visitExpressionStatement(node: ts.ExpressionStatement): JS.ExpressionStatement {
        return new JS.ExpressionStatement(
            randomId(),
            this.visit(node.expression) as J.Expression
        )
    }

    visitIfStatement(node: ts.IfStatement) {
        return this.visitUnknown(node);
    }

    visitDoStatement(node: ts.DoStatement) {
        return this.visitUnknown(node);
    }

    visitWhileStatement(node: ts.WhileStatement) {
        return this.visitUnknown(node);
    }

    visitForStatement(node: ts.ForStatement) {
        return this.visitUnknown(node);
    }

    visitForInStatement(node: ts.ForInStatement) {
        return this.visitUnknown(node);
    }

    visitForOfStatement(node: ts.ForOfStatement) {
        return this.visitUnknown(node);
    }

    visitContinueStatement(node: ts.ContinueStatement) {
        return this.visitUnknown(node);
    }

    visitBreakStatement(node: ts.BreakStatement) {
        return this.visitUnknown(node);
    }

    visitReturnStatement(node: ts.ReturnStatement) {
        return this.visitUnknown(node);
    }

    visitWithStatement(node: ts.WithStatement) {
        return this.visitUnknown(node);
    }

    visitSwitchStatement(node: ts.SwitchStatement) {
        return this.visitUnknown(node);
    }

    visitLabeledStatement(node: ts.LabeledStatement) {
        return this.visitUnknown(node);
    }

    visitThrowStatement(node: ts.ThrowStatement) {
        return this.visitUnknown(node);
    }

    visitTryStatement(node: ts.TryStatement) {
        return this.visitUnknown(node);
    }

    visitDebuggerStatement(node: ts.DebuggerStatement) {
        return this.visitUnknown(node);
    }

    visitVariableDeclaration(node: ts.VariableDeclaration) {
        return this.visitUnknown(node);
    }

    visitVariableDeclarationList(node: ts.VariableDeclarationList) {
        return this.visitUnknown(node);
    }

    visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        return this.visitUnknown(node);
    }

    visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
        return this.visitUnknown(node);
    }

    visitTypeAliasDeclaration(node: ts.TypeAliasDeclaration) {
        return this.visitUnknown(node);
    }

    visitEnumDeclaration(node: ts.EnumDeclaration) {
        return this.visitUnknown(node);
    }

    visitModuleDeclaration(node: ts.ModuleDeclaration) {
        return this.visitUnknown(node);
    }

    visitModuleBlock(node: ts.ModuleBlock) {
        return this.visitUnknown(node);
    }

    visitCaseBlock(node: ts.CaseBlock) {
        return this.visitUnknown(node);
    }

    visitNamespaceExportDeclaration(node: ts.NamespaceExportDeclaration) {
        return this.visitUnknown(node);
    }

    visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        return this.visitUnknown(node);
    }

    visitImportDeclaration(node: ts.ImportDeclaration) {
        return this.visitUnknown(node);
    }

    visitImportClause(node: ts.ImportClause) {
        return this.visitUnknown(node);
    }

    visitNamespaceImport(node: ts.NamespaceImport) {
        return this.visitUnknown(node);
    }

    visitNamedImports(node: ts.NamedImports) {
        return this.visitUnknown(node);
    }

    visitImportSpecifier(node: ts.ImportSpecifier) {
        return this.visitUnknown(node);
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
        return this.visitUnknown(node);
    }

    visitDefaultClause(node: ts.DefaultClause) {
        return this.visitUnknown(node);
    }

    visitHeritageClause(node: ts.HeritageClause) {
        return this.visitUnknown(node);
    }

    visitCatchClause(node: ts.CatchClause) {
        return this.visitUnknown(node);
    }

    visitImportAttributes(node: ts.ImportAttributes) {
        return this.visitUnknown(node);
    }

    visitImportAttribute(node: ts.ImportAttribute) {
        return this.visitUnknown(node);
    }

    visitPropertyAssignment(node: ts.PropertyAssignment) {
        return this.visitUnknown(node);
    }

    visitShorthandPropertyAssignment(node: ts.ShorthandPropertyAssignment) {
        return this.visitUnknown(node);
    }

    visitSpreadAssignment(node: ts.SpreadAssignment) {
        return this.visitUnknown(node);
    }

    visitEnumMember(node: ts.EnumMember) {
        return this.visitUnknown(node);
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
}

function prefixFromNode(node: ts.Node, sourceFile: ts.SourceFile): Space {
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
