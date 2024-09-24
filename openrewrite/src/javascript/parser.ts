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
        return new JS.CompilationUnit(randomId(), Space.EMPTY, Markers.EMPTY, sf.fileName, null, null, false, null, [], [], Space.EMPTY);
    }

    #visit0<T extends J.J>(node: ts.Node) : T {
        const member = this[(`visit${ts.SyntaxKind[node.kind]}` as keyof JavaScriptParserVisitor)];
        if (typeof member === 'function') {
            return member(node as any) as any as T;
        } else {
            return this.visitUnknown(node) as any as T;
        }
    }

    visitUnknown(node: ts.Node) {
        return new J.Unknown(randomId(), Space.EMPTY, Markers.EMPTY, new Source(randomId(), Space.EMPTY, Markers.EMPTY, node.getText()));
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

    visitVariableStatement(node: ts.VariableStatement) {
        return this.visitUnknown(node);
    }

    visitExpressionStatement(node: ts.ExpressionStatement) {
        return this.visitUnknown(node);
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

    visitSourceFile(node: ts.SourceFile) {
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