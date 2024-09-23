import * as JS from './tree';
import {ExecutionContext, Markers, Parser, ParserInput, randomId, SourceFile} from "../core";
import * as J from "../java/tree";
import {ClassDeclaration, Space, Unknown} from "../java/tree";
import * as ts from "typescript";
import Source = Unknown.Source;

export class JavaScriptParser extends Parser {
    parseInputs(sources: Iterable<ParserInput>, relativeTo: string | null, ctx: ExecutionContext): Iterable<SourceFile> {
        return [new JS.CompilationUnit(
            randomId(),
            Space.EMPTY,
            Markers.EMPTY,
            "file.ts",
            null,
            null,
            false,
            null,
            [],
            [],
            Space.EMPTY
        )];
    }

    accept(path: string): boolean {
        return path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js') || path.endsWith('.jsx');
    }

    sourcePathFromSourceText(prefix: string, sourceCode: string): string {
        return prefix + "/source.js";
    }
}

export class JavaScriptParserVisitor {
    visit(sf: ts.SourceFile) {
        sf.forEachChild((node) => this._visit(node));
    }

    _visit(node: ts.Node) {
        var member = this[(`visit${ts.SyntaxKind[node.kind]}` as keyof JavaScriptParserVisitor)];
        if (typeof member === 'function') {
            return member(node as any);
        } else {
            return this.visitUnknown(node);
        }
    }

    visitClassDeclaration(node: ts.ClassDeclaration) {
        // return new ClassDeclaration(randomId(), node.)
        return this.visitUnknown(node);
    }

    visitUnknown(node: ts.Node) {
        return new J.Unknown(randomId(), Space.EMPTY, Markers.EMPTY, new Source(randomId(), Space.EMPTY, Markers.EMPTY, node.getText()));
    }

    visitEndOfFileToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitSingleLineCommentTrivia(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitMultiLineCommentTrivia(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitNewLineTrivia(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitWhitespaceTrivia(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitShebangTrivia(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitConflictMarkerTrivia(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitNonTextFileMarkerTrivia(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitNumericLiteral(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitBigIntLiteral(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitStringLiteral(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitJsxText(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitJsxTextAllWhiteSpaces(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitRegularExpressionLiteral(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitNoSubstitutionTemplateLiteral(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitTemplateHead(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitTemplateMiddle(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitTemplateTail(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitOpenBraceToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitCloseBraceToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitOpenParenToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitCloseParenToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitOpenBracketToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitCloseBracketToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitDotToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitDotDotDotToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitSemicolonToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitCommaToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitQuestionDotToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitLessThanToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitLessThanSlashToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitGreaterThanToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitLessThanEqualsToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitGreaterThanEqualsToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitEqualsEqualsToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitExclamationEqualsToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitEqualsEqualsEqualsToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitExclamationEqualsEqualsToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitEqualsGreaterThanToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitPlusToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitMinusToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitAsteriskToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitAsteriskAsteriskToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitSlashToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitPercentToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitPlusPlusToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitMinusMinusToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitLessThanLessThanToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitGreaterThanGreaterThanToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitGreaterThanGreaterThanGreaterThanToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitAmpersandToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitBarToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitCaretToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitExclamationToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitTildeToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitAmpersandAmpersandToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitBarBarToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitQuestionToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitColonToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitAtToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitQuestionQuestionToken(node: ts.Node) {
        return this.visitUnknown(node)
    }

    visitBacktickToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitHashToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPlusEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitMinusEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAsteriskEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAsteriskAsteriskEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSlashEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPercentEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLessThanLessThanEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitGreaterThanGreaterThanEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitGreaterThanGreaterThanGreaterThanEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAmpersandEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitBarEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitBarBarEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAmpersandAmpersandEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitQuestionQuestionEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitCaretEqualsToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitIdentifier(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPrivateIdentifier(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitBreakKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitCaseKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitCatchKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitClassKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitConstKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitContinueKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitDebuggerKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitDefaultKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitDeleteKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitDoKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitElseKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitEnumKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitExportKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitExtendsKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFalseKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFinallyKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitForKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFunctionKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitIfKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitImportKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitInKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitInstanceOfKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNewKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNullKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitReturnKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSuperKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSwitchKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitThisKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitThrowKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTrueKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTryKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTypeOfKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitVarKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitVoidKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitWhileKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitWithKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitImplementsKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitInterfaceKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLetKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPackageKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPrivateKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitProtectedKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPublicKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitStaticKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitYieldKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAbstractKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAccessorKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAsKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAssertsKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAssertKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAnyKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAsyncKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAwaitKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitBooleanKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitConstructorKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitDeclareKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitGetKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitInferKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitIntrinsicKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitIsKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitKeyOfKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitModuleKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNamespaceKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNeverKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitOutKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitReadonlyKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitRequireKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNumberKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitObjectKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSatisfiesKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSetKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitStringKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSymbolKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTypeKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitUndefinedKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitUniqueKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitUnknownKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitUsingKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFromKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitGlobalKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitBigIntKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitOverrideKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitOfKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitQualifiedName(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitComputedPropertyName(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTypeParameter(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitParameter(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitDecorator(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPropertySignature(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPropertyDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitMethodSignature(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitMethodDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitClassStaticBlockDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitConstructor(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitGetAccessor(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSetAccessor(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitCallSignature(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitConstructSignature(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitIndexSignature(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTypePredicate(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTypeReference(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFunctionType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitConstructorType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTypeQuery(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTypeLiteral(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitArrayType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTupleType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitOptionalType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitRestType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitUnionType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitIntersectionType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitConditionalType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitInferType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitParenthesizedType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitThisType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTypeOperator(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitIndexedAccessType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitMappedType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLiteralType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNamedTupleMember(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTemplateLiteralType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTemplateLiteralTypeSpan(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitImportType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitObjectBindingPattern(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitArrayBindingPattern(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitBindingElement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitArrayLiteralExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitObjectLiteralExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPropertyAccessExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitElementAccessExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitCallExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNewExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTaggedTemplateExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTypeAssertionExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitParenthesizedExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFunctionExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitArrowFunction(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitDeleteExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTypeOfExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitVoidExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAwaitExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPrefixUnaryExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPostfixUnaryExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitBinaryExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitConditionalExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTemplateExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitYieldExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSpreadElement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitClassExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitOmittedExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitExpressionWithTypeArguments(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitAsExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNonNullExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitMetaProperty(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSyntheticExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSatisfiesExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTemplateSpan(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSemicolonClassElement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitBlock(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitEmptyStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitVariableStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitExpressionStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitIfStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitDoStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitWhileStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitForStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitForInStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitForOfStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitContinueStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitBreakStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitReturnStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitWithStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSwitchStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLabeledStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitThrowStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTryStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitDebuggerStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitVariableDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitVariableDeclarationList(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFunctionDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitInterfaceDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitTypeAliasDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitEnumDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitModuleDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitModuleBlock(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitCaseBlock(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNamespaceExportDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitImportEqualsDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitImportDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitImportClause(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNamespaceImport(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNamedImports(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitImportSpecifier(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitExportAssignment(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitExportDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNamedExports(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNamespaceExport(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitExportSpecifier(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitMissingDeclaration(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitExternalModuleReference(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJsxElement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJsxSelfClosingElement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJsxOpeningElement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJsxClosingElement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJsxFragment(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJsxOpeningFragment(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJsxClosingFragment(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJsxAttribute(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJsxAttributes(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJsxSpreadAttribute(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJsxExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJsxNamespacedName(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitCaseClause(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitDefaultClause(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitHeritageClause(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitCatchClause(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitImportAttributes(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitImportAttribute(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPropertyAssignment(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitShorthandPropertyAssignment(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSpreadAssignment(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitEnumMember(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSourceFile(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitBundle(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocTypeExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocNameReference(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocMemberName(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocAllType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocUnknownType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocNullableType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocNonNullableType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocOptionalType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocFunctionType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocVariadicType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocNamepathType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDoc(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocType(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocText(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocTypeLiteral(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocSignature(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocLink(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocLinkCode(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocLinkPlain(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocAugmentsTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocImplementsTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocAuthorTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocDeprecatedTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocClassTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocPublicTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocPrivateTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocProtectedTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocReadonlyTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocOverrideTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocCallbackTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocOverloadTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocEnumTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocParameterTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocReturnTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocThisTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocTypeTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocTemplateTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocTypedefTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocSeeTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocPropertyTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocThrowsTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocSatisfiesTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitJSDocImportTag(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSyntaxList(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitNotEmittedStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitPartiallyEmittedExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitCommaListExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitSyntheticReferenceExpression(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitCount(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstAssignment(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastAssignment(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstCompoundAssignment(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastCompoundAssignment(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstReservedWord(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastReservedWord(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastKeyword(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstFutureReservedWord(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastFutureReservedWord(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstTypeNode(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastTypeNode(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstPunctuation(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastPunctuation(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstTriviaToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastTriviaToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstLiteralToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastLiteralToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstTemplateToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastTemplateToken(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstBinaryOperator(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastBinaryOperator(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastStatement(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstNode(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstJSDocNode(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastJSDocNode(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitFirstJSDocTagNode(node: ts.Node) {
        return this.visitUnknown(node);
    }

    visitLastJSDocTagNode(node: ts.Node) {
        return this.visitUnknown(node);
    }
}