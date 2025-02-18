import * as J from '../java';

import {
    JContainer,
    JLeftPadded,
    JRightPadded,
    Literal,
    Semicolon,
    Space,
    TrailingComma
} from '../java';
import * as JS from '.';
import {
    Cursor,
    Markers,
    PrintOutputCapture,
    Tree
} from "../core";
import {JavaScriptVisitor, JsContainer, JsLeftPadded, JsRightPadded, JsSpace, NamespaceDeclaration} from ".";

export class JavaScriptPrinter<P> extends JavaScriptVisitor<PrintOutputCapture<P>> {

    JAVA_SCRIPT_MARKER_WRAPPER: (out: string) => string = (out) => `/*~~${out}${out.length === 0 ? "" : "~~"}>*/`;

    constructor(cursor: Cursor) {
        super();
        this.cursor = cursor;
    }

    visit(tree: Tree | null, p: PrintOutputCapture<P>): J.J | null {
        return super.visit(tree, p);
    }

    visitJsCompilationUnit(cu: JS.CompilationUnit, p: PrintOutputCapture<P>): J.J | null {
        this.beforeSyntax(cu, Space.Location.COMPILATION_UNIT_PREFIX, p);

        this.visitJsRightPaddedLocal(cu.padding.statements, JsRightPadded.Location.COMPILATION_UNIT_STATEMENTS, "", p);

        this.visitSpace(cu.eof, Space.Location.COMPILATION_UNIT_EOF, p);
        this.afterSyntax(cu, p);
        return cu;
    }

    // visitCompilationUnit(cu: J.CompilationUnit, p: PrintOutputCapture<P>): J.J | null {
    //     this.beforeSyntax(cu, Space.Location.COMPILATION_UNIT_PREFIX, p);
    //
    //     //this.visitJRightPadded(cu.padding.getStatements(), JRightPadded.Location.LANGUAGE_EXTENSION, "", p);
    //
    //     this.visitSpace(cu.eof, Space.Location.COMPILATION_UNIT_EOF, p);
    //     this.afterSyntax(cu, p);
    //     return cu;
    // }

    visitAlias(alias: JS.Alias, p: PrintOutputCapture<P>): JS.Alias {
        this.beforeSyntax(alias, JsSpace.Location.ALIAS_PREFIX, p);
        this.visitJsRightPadded(alias.padding.propertyName, JsRightPadded.Location.ALIAS_PROPERTY_NAME, p);
        p.append("as");
        this.visit(alias.alias, p);
        this.afterSyntax(alias, p);
        return alias;
    }

    visitAwait(awaitExpr: JS.Await, p: PrintOutputCapture<P>): JS.Await {
        this.beforeSyntax(awaitExpr, JsSpace.Location.AWAIT_PREFIX, p);
        p.append("await");
        this.visit(awaitExpr.expression, p);
        this.afterSyntax(awaitExpr, p);
        return awaitExpr;
    }

    visitBindingElement(binding: JS.BindingElement, p: PrintOutputCapture<P>): JS.BindingElement {
        this.beforeSyntax(binding, JsSpace.Location.BINDING_ELEMENT_PREFIX, p);
        if (binding.propertyName) {
            this.visitJsRightPadded(binding.padding.propertyName, JsRightPadded.Location.BINDING_ELEMENT_PROPERTY_NAME, p);
            p.append(":");
        }
        this.visit(binding.name, p);
        this.visitJsLeftPaddedLocal("=", binding.padding.initializer, JsLeftPadded.Location.BINDING_ELEMENT_INITIALIZER, p);
        this.afterSyntax(binding, p);
        return binding;
    }

    visitDelete(del: JS.Delete, p: PrintOutputCapture<P>): JS.Delete {
        this.beforeSyntax(del, JsSpace.Location.DELETE_PREFIX, p);
        p.append("delete");
        this.visit(del.expression, p);
        this.afterSyntax(del, p);
        return del;
    }

    visitTrailingTokenStatement(statement: JS.TrailingTokenStatement, p: PrintOutputCapture<P>): JS.TrailingTokenStatement {
        this.beforeSyntax(statement, JsSpace.Location.TRAILING_TOKEN_STATEMENT_PREFIX, p);
        this.visitJsRightPadded(statement.padding.expression, JsRightPadded.Location.TRAILING_TOKEN_STATEMENT_EXPRESSION, p);
        this.afterSyntax(statement, p);
        return statement;
    }

    visitInferType(inferType: JS.InferType, p: PrintOutputCapture<P>): JS.InferType {
        this.beforeSyntax(inferType, JsSpace.Location.INFER_TYPE_PREFIX, p);
        this.visitJsLeftPaddedLocal("infer", inferType.padding.typeParameter, JsLeftPadded.Location.INFER_TYPE_TYPE_PARAMETER, p);
        this.afterSyntax(inferType, p);
        return inferType;
    }

    visitJsImport(jsImport: JS.JsImport, p: PrintOutputCapture<P>): JS.JsImport {
        this.beforeSyntax(jsImport, JsSpace.Location.JS_IMPORT_PREFIX, p);
        jsImport.modifiers.forEach(m => this.visitModifier(m, p));
        p.append("import");
        this.visit(jsImport.importClause, p);

        this.visitJsLeftPaddedLocal(jsImport.importClause ? "from" : "", jsImport.padding.moduleSpecifier, JsLeftPadded.Location.JS_IMPORT_MODULE_SPECIFIER, p);

        this.visit(jsImport.attributes, p);

        this.afterSyntax(jsImport, p);
        return jsImport;
    }

    visitJsImportClause(jsImportClause: JS.JsImportClause, p: PrintOutputCapture<P>): JS.JsImportClause {
        this.beforeSyntax(jsImportClause, JsSpace.Location.JS_IMPORT_CLAUSE_PREFIX, p);

        if (jsImportClause.typeOnly) {
            p.append("type");
        }

        const name = jsImportClause.padding.name;
        this.visitJsRightPadded(name, JsRightPadded.Location.JS_IMPORT_CLAUSE_NAME, p);

        if (name && jsImportClause.namedBindings) {
            p.append(",");
        }

        this.visit(jsImportClause.namedBindings, p);

        this.afterSyntax(jsImportClause, p);

        return jsImportClause;
    }

    visitTypeTreeExpression(typeTreeExpression: JS.TypeTreeExpression, p: PrintOutputCapture<P>): JS.TypeTreeExpression {
        this.beforeSyntax(typeTreeExpression, JsSpace.Location.TYPE_TREE_EXPRESSION_PREFIX, p);
        this.visit(typeTreeExpression.expression, p);
        this.afterSyntax(typeTreeExpression, p);
        return typeTreeExpression;
    }

    visitNamespaceDeclaration(namespaceDeclaration: JS.NamespaceDeclaration, p: PrintOutputCapture<P>): JS.NamespaceDeclaration {
        this.beforeSyntax(namespaceDeclaration, JsSpace.Location.NAMESPACE_DECLARATION_PREFIX, p);
        namespaceDeclaration.modifiers.forEach(it => this.visitModifier(it, p));
        this.visitSpace(namespaceDeclaration.padding.keywordType.before, JsSpace.Location.NAMESPACE_DECLARATION_KEYWORD_TYPE_PREFIX, p);

        switch (namespaceDeclaration.keywordType) {
            case NamespaceDeclaration.KeywordType.Namespace:
                p.append("namespace");
                break;
            case NamespaceDeclaration.KeywordType.Module:
                p.append("module");
                break;
            default:
                break;
        }

        this.visitJsRightPadded(namespaceDeclaration.padding.name, JsRightPadded.Location.NAMESPACE_DECLARATION_NAME, p);

        if (namespaceDeclaration.body) {
            this.visit(namespaceDeclaration.body, p);
        }

        this.afterSyntax(namespaceDeclaration, p);
        return namespaceDeclaration;
    }

    visitSatisfiesExpression(satisfiesExpression: JS.SatisfiesExpression, p: PrintOutputCapture<P>): JS.SatisfiesExpression {
        this.beforeSyntax(satisfiesExpression, JsSpace.Location.SATISFIES_EXPRESSION_PREFIX, p);
        this.visit(satisfiesExpression.expression, p);
        this.visitJsLeftPaddedLocal("satisfies", satisfiesExpression.padding.satisfiesType, JsLeftPadded.Location.SATISFIES_EXPRESSION_SATISFIES_TYPE, p);
        this.afterSyntax(satisfiesExpression, p);
        return satisfiesExpression;
    }

    visitVoid(aVoid: JS.Void, p: PrintOutputCapture<P>): JS.Void {
        this.beforeSyntax(aVoid, JsSpace.Location.VOID_PREFIX, p);
        p.append("void");
        this.visit(aVoid.expression, p);
        this.afterSyntax(aVoid, p);
        return aVoid;
    }

    visitJsYield(yield_: JS.Yield, p: PrintOutputCapture<P>): JS.Yield {
        this.beforeSyntax(yield_, JsSpace.Location.YIELD_PREFIX, p);

        p.append("yield");

        if (yield_.delegated) {
            this.visitJsLeftPaddedLocal("*", yield_.padding.delegated, JsLeftPadded.Location.YIELD_DELEGATED, p);
        }

        this.visit(yield_.expression, p);

        this.afterSyntax(yield_, p);
        return yield_;
    }

    visitTry(try_: J.Try, p: PrintOutputCapture<P>): J.Try {
        this.beforeSyntax(try_, Space.Location.TRY_PREFIX, p);
        p.append("try");
        this.visit(try_.body, p);
        this.visitNodes(try_.catches, p);
        this.visitJLeftPaddedLocal("finally", try_.padding.finally, JLeftPadded.Location.TRY_FINALLY, p);
        this.afterSyntax(try_, p);
        return try_;
    }

    visitCatch(catch_: J.Try.Catch, p: PrintOutputCapture<P>): J.Try.Catch {
        this.beforeSyntax(catch_, Space.Location.CATCH_PREFIX, p);
        p.append("catch");
        if (catch_.parameter.tree.variables.length > 0) {
            this.visit(catch_.parameter, p);
        }
        this.visit(catch_.body, p);
        this.afterSyntax(catch_, p);
        return catch_;
    }

    visitJSTry(jsTry: JS.JSTry, p: PrintOutputCapture<P>): JS.JSTry {
        this.beforeSyntax(jsTry, JsSpace.Location.JSTRY_PREFIX, p);
        p.append("try");
        this.visit(jsTry.body, p);
        this.visit(jsTry.catches, p);
        this.visitJsLeftPaddedLocal("finally", jsTry.padding.finallie, JsLeftPadded.Location.JSTRY_FINALLIE, p);
        this.afterSyntax(jsTry, p);
        return jsTry;
    }

    visitJSTryJSCatch(jsCatch: JS.JSTry.JSCatch, p: PrintOutputCapture<P>): JS.JSTry.JSCatch {
        this.beforeSyntax(jsCatch, JsSpace.Location.JSTRY_JSCATCH_PREFIX, p);
        p.append("catch");
        this.visit(jsCatch.parameter, p);
        this.visit(jsCatch.body, p);
        this.afterSyntax(jsCatch, p);
        return jsCatch;
    }

    visitJSVariableDeclarations(multiVariable: JS.JSVariableDeclarations, p: PrintOutputCapture<P>): JS.JSVariableDeclarations {
        this.beforeSyntax(multiVariable, JsSpace.Location.JSVARIABLE_DECLARATIONS_PREFIX, p);
        this.visitNodes(multiVariable.leadingAnnotations, p);
        multiVariable.modifiers.forEach(it => this.visitModifier(it, p));

        const variables = multiVariable.padding.variables;
        for (let i = 0; i < variables.length; i++) {
            const variable = variables[i];
            this.beforeSyntax(variable.element, JsSpace.Location.JSVARIABLE_DECLARATIONS_JSNAMED_VARIABLE_PREFIX, p);
            if (multiVariable.varargs) {
                p.append("...");
            }

            this.visit(variable.element.name, p);

            this.visitSpace(variable.after, JsSpace.Location.JSVARIABLE_DECLARATIONS_VARIABLES_SUFFIX, p);
            if (multiVariable.typeExpression) {
                this.visit(multiVariable.typeExpression, p);
            }

            if (variable.element.initializer) {
                this.visitJsLeftPaddedLocal("=", variable.element.padding.initializer, JsLeftPadded.Location.JSVARIABLE_DECLARATIONS_JSNAMED_VARIABLE_INITIALIZER, p);
            }

            this.afterSyntax(variable.element, p);
            if (i < variables.length - 1) {
                p.append(",");
            } else if (variable.markers.findFirst(Semicolon) !== undefined) {
                p.append(";");
            }
        }

        this.afterSyntax(multiVariable, p);
        return multiVariable;
    }

    visitJSVariableDeclarationsJSNamedVariable(variable: JS.JSVariableDeclarations.JSNamedVariable, p: PrintOutputCapture<P>): JS.JSVariableDeclarations.JSNamedVariable {
        this.beforeSyntax(variable, JsSpace.Location.JSVARIABLE_DECLARATIONS_JSNAMED_VARIABLE_PREFIX, p);
        this.visit(variable.name, p);
        const initializer = variable.padding.initializer;
        this.visitJsLeftPaddedLocal("=", initializer, JsLeftPadded.Location.JSVARIABLE_DECLARATIONS_JSNAMED_VARIABLE_INITIALIZER, p);
        this.afterSyntax(variable, p);
        return variable;
    }

    visitArrayDimension(arrayDimension: J.ArrayDimension, p: PrintOutputCapture<P>): J.ArrayDimension {
        this.beforeSyntax(arrayDimension, Space.Location.DIMENSION_PREFIX, p);
        p.append("[");
        this.visitJRightPaddedLocalSingle(arrayDimension.padding.index, JRightPadded.Location.ARRAY_INDEX, "]", p);
        this.afterSyntax(arrayDimension, p);
        return arrayDimension;
    }

    visitArrayType(arrayType: J.ArrayType, p: PrintOutputCapture<P>): J.ArrayType {
        this.beforeSyntax(arrayType, Space.Location.ARRAY_TYPE_PREFIX, p);
        let type: J.TypeTree = arrayType;

        while (type instanceof J.ArrayType) {
            type = (type as J.ArrayType).elementType;
        }

        this.visit(type, p);
        this.visitNodes(arrayType.annotations, p);

        if (arrayType.dimension) {
            this.visitSpace(arrayType.dimension.before, Space.Location.DIMENSION_PREFIX, p);
            p.append("[");
            this.visitSpace(arrayType.dimension.element, Space.Location.DIMENSION, p);
            p.append("]");

            if (arrayType.elementType instanceof J.ArrayType) {
                this.printDimensions(arrayType.elementType as J.ArrayType, p);
            }
        }

        this.afterSyntax(arrayType, p);
        return arrayType;
    }

    private printDimensions(arrayType: J.ArrayType, p: PrintOutputCapture<P>) {
        this.beforeSyntax(arrayType, Space.Location.ARRAY_TYPE_PREFIX, p);
        this.visitNodes(arrayType.annotations, p);
        this.visitSpace(arrayType.dimension?.before ?? Space.EMPTY, Space.Location.DIMENSION_PREFIX, p);

        p.append("[");
        this.visitSpace(arrayType.dimension?.element ?? Space.EMPTY, Space.Location.DIMENSION, p);
        p.append("]");

        if (arrayType.elementType instanceof J.ArrayType) {
            this.printDimensions(arrayType.elementType as J.ArrayType, p);
        }

        this.afterSyntax(arrayType, p);
    }

    visitTernary(ternary: J.Ternary, p: PrintOutputCapture<P>): J.Ternary {
        this.beforeSyntax(ternary, Space.Location.TERNARY_PREFIX, p);
        this.visit(ternary.condition, p);
        this.visitJLeftPaddedLocal("?", ternary.padding.truePart, JLeftPadded.Location.TERNARY_TRUE, p);
        this.visitJLeftPaddedLocal(":", ternary.padding.falsePart, JLeftPadded.Location.TERNARY_FALSE, p);
        this.afterSyntax(ternary, p);
        return ternary;
    }

    visitThrow(thrown: J.Throw, p: PrintOutputCapture<P>): J.Throw {
        this.beforeSyntax(thrown, Space.Location.THROW_PREFIX, p);
        p.append("throw");
        this.visit(thrown.exception, p);
        this.afterSyntax(thrown, p);
        return thrown;
    }

    visitIf(iff: J.If, p: PrintOutputCapture<P>): J.If {
        this.beforeSyntax(iff, Space.Location.IF_PREFIX, p);
        p.append("if");
        this.visit(iff.ifCondition, p);
        this.visitStatementLocal(iff.padding.thenPart, JRightPadded.Location.IF_THEN, p);
        this.visit(iff.elsePart, p);
        this.afterSyntax(iff, p);
        return iff;
    }

    visitElse(else_: J.If.Else, p: PrintOutputCapture<P>): J.If.Else {
        this.beforeSyntax(else_, Space.Location.ELSE_PREFIX, p);
        p.append("else");
        this.visitStatementLocal(else_.padding.body, JRightPadded.Location.IF_ELSE, p);
        this.afterSyntax(else_, p);
        return else_;
    }

    visitDoWhileLoop(doWhileLoop: J.DoWhileLoop, p: PrintOutputCapture<P>): J.DoWhileLoop {
        this.beforeSyntax(doWhileLoop, Space.Location.DO_WHILE_PREFIX, p);
        p.append("do");
        this.visitStatementLocal(doWhileLoop.padding.body, JRightPadded.Location.WHILE_BODY, p);
        this.visitJLeftPaddedLocal("while", doWhileLoop.padding.whileCondition, JLeftPadded.Location.WHILE_CONDITION, p);
        this.afterSyntax(doWhileLoop, p);
        return doWhileLoop;
    }

    visitWhileLoop(whileLoop: J.WhileLoop, p: PrintOutputCapture<P>): J.WhileLoop {
        this.beforeSyntax(whileLoop, Space.Location.WHILE_PREFIX, p);
        p.append("while");
        this.visit(whileLoop.condition, p);
        this.visitStatementLocal(whileLoop.padding.body, JRightPadded.Location.WHILE_BODY, p);
        this.afterSyntax(whileLoop, p);
        return whileLoop;
    }

    visitInstanceOf(instanceOf: J.InstanceOf, p: PrintOutputCapture<P>): J.InstanceOf {
        this.beforeSyntax(instanceOf, Space.Location.INSTANCEOF_PREFIX, p);
        this.visitJRightPaddedLocalSingle(instanceOf.padding.expression, JRightPadded.Location.INSTANCEOF, "instanceof", p);
        this.visit(instanceOf.clazz, p);
        this.visit(instanceOf.pattern, p);
        this.afterSyntax(instanceOf, p);
        return instanceOf;
    }

    visitLiteral(literal: Literal, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(literal, Space.Location.LITERAL_PREFIX, p);

        const unicodeEscapes = literal.unicodeEscapes;
        if (!unicodeEscapes) {
            p.append(literal.valueSource!);
        } else if (literal.valueSource) {
            const surrogateIter = unicodeEscapes[Symbol.iterator]();
            let surrogate = surrogateIter.next().value ?? null;
            let i = 0;

            if (surrogate && surrogate.valueSourceIndex === 0) {
                p.append("\\u").append(surrogate.codePoint);
                surrogate = surrogateIter.next().value ?? null;
            }

            const valueSource = literal.valueSource;
            for (let j = 0; j < valueSource.length; j++) {
                const c = valueSource[j];
                p.append(c);

                if (surrogate && surrogate.valueSourceIndex === ++i) {
                    while (surrogate && surrogate.valueSourceIndex === i) {
                        p.append("\\u").append(surrogate.codePoint);
                        surrogate = surrogateIter.next().value ?? null;
                    }
                }
            }
        }

        this.afterSyntax(literal, p);
        return literal;
    }

    public visitScopedVariableDeclarations(variableDeclarations: JS.ScopedVariableDeclarations, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(variableDeclarations, JsSpace.Location.SCOPED_VARIABLE_DECLARATIONS_PREFIX, p);

        variableDeclarations.modifiers.forEach(m => this.visitModifier(m, p));

        const scope = variableDeclarations.padding.scope;
        if (scope) {
            this.visitSpace(scope.before, JsSpace.Location.SCOPED_VARIABLE_DECLARATIONS_SCOPE_PREFIX, p);

            switch (scope.element) {
                case JS.ScopedVariableDeclarations.Scope.Let:
                    p.append("let");
                    break;
                case JS.ScopedVariableDeclarations.Scope.Const:
                    p.append("const");
                    break;
                case JS.ScopedVariableDeclarations.Scope.Var:
                    p.append("var");
                    break;
                case JS.ScopedVariableDeclarations.Scope.Using:
                    p.append("using");
                    break;
                case JS.ScopedVariableDeclarations.Scope.Import:
                    p.append("import");
                    break;
            }
        }

        this.visitJsRightPaddedLocal(variableDeclarations.padding.variables, JsRightPadded.Location.SCOPED_VARIABLE_DECLARATIONS_VARIABLES, ",", p);

        this.afterSyntax(variableDeclarations, p);
        return variableDeclarations;
    }

    visitVariableDeclarations(multiVariable: J.VariableDeclarations, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(multiVariable, Space.Location.VARIABLE_DECLARATIONS_PREFIX, p);
        this.visitNodes(multiVariable.leadingAnnotations, p);

        multiVariable.modifiers.forEach(it => this.visitModifier(it, p));

        const variables = multiVariable.padding.variables;
        for (let i = 0; i < variables.length; i++) {
            const variable = variables[i];

            this.beforeSyntax(variable.element, Space.Location.VARIABLE_PREFIX, p);

            if (multiVariable.varargs) {
                p.append("...");
            }

            this.visit(variable.element.name, p);
            this.visitSpace(variable.after, Space.Location.NAMED_VARIABLE_SUFFIX, p);

            if (multiVariable.typeExpression) {
                this.visit(multiVariable.typeExpression, p);
            }

            if (variable.element.initializer) {
                this.visitJLeftPaddedLocal("=", variable.element.padding.initializer, JLeftPadded.Location.VARIABLE_INITIALIZER, p);
            }

            this.afterSyntax(variable.element, p);

            if (i < variables.length - 1) {
                p.append(",");
            } else if (variable.markers.findFirst(Semicolon)) {
                p.append(";");
            }
        }

        this.afterSyntax(multiVariable, p);
        return multiVariable;
    }

    visitVariable(variable: J.VariableDeclarations.NamedVariable, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(variable, Space.Location.VARIABLE_PREFIX, p);
        this.visit(variable.name, p);

        const initializer: JLeftPadded<J.Expression> | null = variable.padding.initializer;
        this.visitJLeftPaddedLocal("=", initializer, JLeftPadded.Location.VARIABLE_INITIALIZER, p);

        this.afterSyntax(variable, p);
        return variable;
    }

    visitIdentifier(ident: J.Identifier, p: PrintOutputCapture<P>): J.J {
        this.visitSpace(Space.EMPTY, Space.Location.ANNOTATIONS, p);
        this.visitNodes(ident.annotations, p);
        this.beforeSyntax(ident, Space.Location.IDENTIFIER_PREFIX, p);
        p.append(ident.simpleName);
        this.afterSyntax(ident, p);
        return ident;
    }

    visitFunctionDeclaration(functionDeclaration: JS.FunctionDeclaration, p: PrintOutputCapture<P>): JS.FunctionDeclaration {
        this.beforeSyntax(functionDeclaration, JsSpace.Location.FUNCTION_DECLARATION_PREFIX, p);

        functionDeclaration.modifiers.forEach((m) => this.visitModifier(m, p));

        this.visitJsLeftPaddedLocal("function", functionDeclaration.padding.asteriskToken, JsLeftPadded.Location.FUNCTION_DECLARATION_ASTERISK_TOKEN, p);

        this.visitJsLeftPaddedLocal(functionDeclaration.asteriskToken ? "*" : "", functionDeclaration.padding.name, JsLeftPadded.Location.FUNCTION_DECLARATION_NAME, p);

        const typeParameters = functionDeclaration.typeParameters;
        if (typeParameters !== null) {
            this.visitNodes(typeParameters.annotations, p);
            this.visitSpace(typeParameters.prefix, Space.Location.TYPE_PARAMETERS, p);
            this.visitMarkers(typeParameters.markers, p);
            p.append("<");
            this.visitJRightPaddedLocal(typeParameters.padding.typeParameters, JRightPadded.Location.TYPE_PARAMETER, ",", p);
            p.append(">");
        }

        this.visitJsContainerLocal("(", functionDeclaration.padding.parameters, JsContainer.Location.FUNCTION_DECLARATION_PARAMETERS, ",", ")", p);

        if (functionDeclaration.returnTypeExpression !== null) {
            this.visit(functionDeclaration.returnTypeExpression, p);
        }

        if (functionDeclaration.body !== null) {
            this.visit(functionDeclaration.body, p);
        }

        this.afterSyntax(functionDeclaration, p);

        return functionDeclaration;
    }

    visitBlock(block: J.Block, p: PrintOutputCapture<P>): J.Block {
        this.beforeSyntax(block, Space.Location.BLOCK_PREFIX, p);

        if (block.static) {
            p.append("static");
            this.visitRightPadded(block.padding.static, JRightPadded.Location.STATIC_INIT, p);
        }

        p.append("{");
        this.visitStatements(block.padding.statements, JRightPadded.Location.BLOCK_STATEMENT, p);
        this.visitSpace(block.end, Space.Location.BLOCK_END, p);
        p.append("}");

        this.afterSyntax(block, p);
        return block;
    }

    visitTypeInfo(typeInfo: JS.TypeInfo, p: PrintOutputCapture<P>): JS.TypeInfo {
        this.beforeSyntax(typeInfo, JsSpace.Location.TYPE_INFO_PREFIX, p);
        p.append(":");
        this.visit(typeInfo.typeIdentifier, p);
        this.afterSyntax(typeInfo, p);
        return typeInfo;
    }

    visitReturn(return_: J.Return, p: PrintOutputCapture<P>): J.Return {
        this.beforeSyntax(return_, Space.Location.RETURN_PREFIX, p);
        p.append("return");
        this.visit(return_.expression, p);
        this.afterSyntax(return_, p);
        return return_;
    }

    public visitModifier(mod: J.Modifier, p: PrintOutputCapture<P>): J.Modifier {
        this.visitNodes(mod.annotations, p);

        let keyword: string;
        switch (mod.type) {
            case J.Modifier.Type.Default:
                keyword = "default";
                break;
            case J.Modifier.Type.Public:
                keyword = "public";
                break;
            case J.Modifier.Type.Protected:
                keyword = "protected";
                break;
            case J.Modifier.Type.Private:
                keyword = "private";
                break;
            case J.Modifier.Type.Abstract:
                keyword = "abstract";
                break;
            case J.Modifier.Type.Async:
                keyword = "async";
                break;
            case J.Modifier.Type.Static:
                keyword = "static";
                break;
            case J.Modifier.Type.Final:
                keyword = "final";
                break;
            case J.Modifier.Type.Native:
                keyword = "native";
                break;
            case J.Modifier.Type.NonSealed:
                keyword = "non-sealed";
                break;
            case J.Modifier.Type.Sealed:
                keyword = "sealed";
                break;
            case J.Modifier.Type.Strictfp:
                keyword = "strictfp";
                break;
            case J.Modifier.Type.Synchronized:
                keyword = "synchronized";
                break;
            case J.Modifier.Type.Transient:
                keyword = "transient";
                break;
            case J.Modifier.Type.Volatile:
                keyword = "volatile";
                break;
            default:
                keyword = mod.keyword ?? "";
        }

        this.beforeSyntax(mod, Space.Location.MODIFIER_PREFIX, p);
        p.append(keyword);
        this.afterSyntax(mod, p);
        return mod;
    }

    visitFunctionType(functionType: JS.FunctionType, p: PrintOutputCapture<P>): JS.FunctionType {
        this.beforeSyntax(functionType, JsSpace.Location.FUNCTION_TYPE_PREFIX, p);
        functionType.modifiers.forEach(m => this.visitModifier(m, p));

        if (functionType.constructorType) {
            this.visitJsLeftPaddedLocal("new", functionType.padding.constructorType, JsLeftPadded.Location.FUNCTION_TYPE_CONSTRUCTOR_TYPE, p);
        }

        const typeParameters = functionType.typeParameters;
        if (typeParameters) {
            this.visitNodes(typeParameters.annotations, p);
            this.visitSpace(typeParameters.prefix, Space.Location.TYPE_PARAMETERS, p);
            this.visitMarkers(typeParameters.markers, p);
            p.append("<");
            this.visitJRightPaddedLocal(typeParameters.padding.typeParameters, JRightPadded.Location.TYPE_PARAMETER, ",", p);
            p.append(">");
        }

        this.visitJsContainerLocal("(", functionType.padding.parameters, JsContainer.Location.FUNCTION_TYPE_PARAMETERS, ",", ")", p);
        this.visitJsLeftPaddedLocal("=>", functionType.padding.returnType, JsLeftPadded.Location.FUNCTION_TYPE_RETURN_TYPE, p);

        this.afterSyntax(functionType, p);
        return functionType;
    }

    visitClassDeclaration(classDecl: J.ClassDeclaration, p: PrintOutputCapture<P>): J.ClassDeclaration {
        let kind = "";
        switch (classDecl.padding.kind.type) {
            case J.ClassDeclaration.Kind.Type.Class:
                kind = "class";
                break;
            case J.ClassDeclaration.Kind.Type.Enum:
                kind = "enum";
                break;
            case J.ClassDeclaration.Kind.Type.Interface:
                kind = "interface";
                break;
            case J.ClassDeclaration.Kind.Type.Annotation:
                kind = "@interface";
                break;
            case J.ClassDeclaration.Kind.Type.Record:
                kind = "record";
                break;
        }

        this.beforeSyntax(classDecl, Space.Location.CLASS_DECLARATION_PREFIX, p);
        this.visitSpace(Space.EMPTY, Space.Location.ANNOTATIONS, p);
        this.visitNodes(classDecl.leadingAnnotations, p);
        classDecl.modifiers.forEach(m => this.visitModifier(m, p));
        this.visitNodes(classDecl.padding.kind.annotations, p);
        this.visitSpace(classDecl.padding.kind.prefix, Space.Location.CLASS_KIND, p);
        p.append(kind);
        this.visit(classDecl.name, p);
        this.visitJContainerLocal("<", classDecl.padding.typeParameters, JContainer.Location.TYPE_PARAMETERS, ",", ">", p);
        this.visitJContainerLocal("(", classDecl.padding.primaryConstructor, JContainer.Location.RECORD_STATE_VECTOR, ",", ")", p);
        this.visitJLeftPaddedLocal("extends", classDecl.padding.extends, JLeftPadded.Location.EXTENDS, p);
        this.visitJContainerLocal(classDecl.padding.kind.type === J.ClassDeclaration.Kind.Type.Interface ? "extends" : "implements",
            classDecl.padding.implements, JContainer.Location.IMPLEMENTS, ",", null, p);
        this.visit(classDecl.body, p);
        this.afterSyntax(classDecl, p);

        return classDecl;
    }

    visitMethodDeclaration(method: J.MethodDeclaration, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(method, Space.Location.METHOD_DECLARATION_PREFIX, p);
        this.visitSpace(Space.EMPTY, Space.Location.ANNOTATIONS, p);
        this.visitNodes(method.leadingAnnotations, p);
        method.modifiers.forEach(m => this.visitModifier(m, p));

        this.visit(method.padding.name.identifier, p);

        const typeParameters = method.annotations.typeParameters;
        if (typeParameters) {
            this.visitNodes(typeParameters.annotations, p);
            this.visitSpace(typeParameters.prefix, Space.Location.TYPE_PARAMETERS, p);
            this.visitMarkers(typeParameters.markers, p);
            p.append("<");
            this.visitJRightPaddedLocal(typeParameters.padding.typeParameters, JRightPadded.Location.TYPE_PARAMETER, ",", p);
            p.append(">");
        }

        this.visitJContainerLocal("(", method.padding.parameters, JContainer.Location.METHOD_DECLARATION_PARAMETERS, ",", ")", p);

        if (method.returnTypeExpression) {
            this.visit(method.returnTypeExpression, p);
        }

        this.visit(method.body, p);
        this.afterSyntax(method, p);
        return method;
    }

    visitJSMethodDeclaration(method: JS.JSMethodDeclaration, p: PrintOutputCapture<P>): JS.JSMethodDeclaration {
        this.beforeSyntax(method, JsSpace.Location.JSMETHOD_DECLARATION_PREFIX, p);
        this.visitSpace(Space.EMPTY, Space.Location.ANNOTATIONS, p);
        this.visitNodes(method.leadingAnnotations, p);
        method.modifiers.forEach(it => this.visitModifier(it, p));

        this.visit(method.name, p);

        const typeParameters = method.typeParameters;
        if (typeParameters) {
            this.visitNodes(typeParameters.annotations, p);
            this.visitSpace(typeParameters.prefix, Space.Location.TYPE_PARAMETERS, p);
            this.visitMarkers(typeParameters.markers, p);
            p.append("<");
            this.visitJRightPaddedLocal(typeParameters.padding.typeParameters, JRightPadded.Location.TYPE_PARAMETER, ",", p);
            p.append(">");
        }

        this.visitJsContainerLocal("(", method.padding.parameters, JsContainer.Location.JSMETHOD_DECLARATION_PARAMETERS, ",", ")", p);
        if (method.returnTypeExpression) {
            this.visit(method.returnTypeExpression, p);
        }

        this.visit(method.body, p);
        this.afterSyntax(method, p);
        return method;
    }

    visitMethodInvocation(method: J.MethodInvocation, p: PrintOutputCapture<P>): J.MethodInvocation {
        this.beforeSyntax(method, Space.Location.METHOD_INVOCATION_PREFIX, p);

        if (method.name.toString().length === 0) {
            this.visitRightPadded(method.padding.select, JRightPadded.Location.METHOD_SELECT, p);
        } else {
            this.visitJRightPaddedLocalSingle(method.padding.select, JRightPadded.Location.METHOD_SELECT, "", p);
            this.visit(method.name, p);
        }

        this.visitJContainerLocal("<", method.padding.typeParameters, JContainer.Location.TYPE_PARAMETERS, ",", ">", p);
        this.visitJContainerLocal("(", method.padding.arguments, JContainer.Location.METHOD_INVOCATION_ARGUMENTS, ",", ")", p);

        this.afterSyntax(method, p);
        return method;
    }

    visitTypeParameter(typeParameter: J.TypeParameter, p: PrintOutputCapture<P>): J.TypeParameter {
        this.beforeSyntax(typeParameter, Space.Location.TYPE_PARAMETERS_PREFIX, p);
        this.visitNodes(typeParameter.annotations, p);
        typeParameter.modifiers.forEach(m => this.visitModifier(m, p));
        this.visit(typeParameter.name, p);

        const bounds = typeParameter.padding.bounds;
        if (bounds) {
            this.visitSpace(bounds.before, JContainer.Location.beforeLocation(JContainer.Location.TYPE_BOUNDS), p);
            const constraintType = bounds.padding.elements[0];

            if (!(constraintType.element instanceof J.Empty)) {
                p.append("extends");
                this.visitRightPadded(constraintType, JContainer.Location.elementLocation(JContainer.Location.TYPE_BOUNDS), p);
            }

            const defaultType = bounds.padding.elements[1];
            if (!(defaultType.element instanceof J.Empty)) {
                p.append("=");
                this.visitRightPadded(defaultType, JContainer.Location.elementLocation(JContainer.Location.TYPE_BOUNDS), p);
            }
        }

        this.afterSyntax(typeParameter, p);
        return typeParameter;
    }

    visitArrowFunction(arrowFunction: JS.ArrowFunction, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(arrowFunction, JsSpace.Location.ARROW_FUNCTION_PREFIX, p);
        this.visitNodes(arrowFunction.leadingAnnotations, p);
        arrowFunction.modifiers.forEach(m => this.visitModifier(m, p));

        const typeParameters = arrowFunction.typeParameters;
        if (typeParameters) {
            this.visitNodes(typeParameters.annotations, p);
            this.visitSpace(typeParameters.prefix, Space.Location.TYPE_PARAMETERS, p);
            this.visitMarkers(typeParameters.markers, p);
            p.append("<");
            this.visitJRightPaddedLocal(typeParameters.padding.typeParameters, JRightPadded.Location.TYPE_PARAMETER, ",", p);
            p.append(">");
        }

        if (arrowFunction.parameters.parenthesized) {
            this.visitSpace(arrowFunction.parameters.prefix, Space.Location.LAMBDA_PARAMETERS_PREFIX, p);
            p.append("(");
            this.visitJRightPaddedLocal(arrowFunction.parameters.padding.parameters, JRightPadded.Location.LAMBDA_PARAM, ",", p);
            p.append(")");
        } else {
            this.visitJRightPaddedLocal(arrowFunction.parameters.padding.parameters, JRightPadded.Location.LAMBDA_PARAM, ",", p);
        }

        if (arrowFunction.returnTypeExpression) {
            this.visit(arrowFunction.returnTypeExpression, p);
        }

        this.visitJsLeftPaddedLocal("=>", arrowFunction.padding.body, JsLeftPadded.Location.ARROW_FUNCTION_BODY, p);

        this.afterSyntax(arrowFunction, p);
        return arrowFunction;
    }

    visitConditionalType(conditionalType: JS.ConditionalType, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(conditionalType, JsSpace.Location.CONDITIONAL_TYPE_PREFIX, p);
        this.visit(conditionalType.checkType, p);
        this.visitJsContainerLocal("extends", conditionalType.padding.condition, JsContainer.Location.CONDITIONAL_TYPE_CONDITION, "", "", p);
        this.afterSyntax(conditionalType, p);
        return conditionalType;
    }

    visitExpressionWithTypeArguments(type: JS.ExpressionWithTypeArguments, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(type, JsSpace.Location.EXPRESSION_WITH_TYPE_ARGUMENTS_PREFIX, p);
        this.visit(type.clazz, p);
        this.visitJsContainerLocal("<", type.padding.typeArguments, JsContainer.Location.EXPRESSION_WITH_TYPE_ARGUMENTS_TYPE_ARGUMENTS, ",", ">", p);
        this.afterSyntax(type, p);
        return type;
    }

    visitImportType(importType: JS.ImportType, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(importType, JsSpace.Location.IMPORT_TYPE_PREFIX, p);

        if (importType.hasTypeof) {
            p.append("typeof");
            this.visitJsRightPadded(importType.padding.hasTypeof, JsRightPadded.Location.IMPORT_TYPE_HAS_TYPEOF, p);
        }

        p.append("import");
        this.visitJsContainerLocal("(", importType.padding.argumentAndAttributes, JsContainer.Location.IMPORT_TYPE_ARGUMENT_AND_ATTRIBUTES, ",", ")", p);
        this.visitJsLeftPaddedLocal(".", importType.padding.qualifier, JsLeftPadded.Location.IMPORT_TYPE_QUALIFIER, p);
        this.visitJsContainerLocal("<", importType.padding.typeArguments, JsContainer.Location.IMPORT_TYPE_TYPE_ARGUMENTS, ",", ">", p);

        this.afterSyntax(importType, p);
        return importType;
    }

    visitTypeDeclaration(typeDeclaration: JS.TypeDeclaration, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(typeDeclaration, JsSpace.Location.TYPE_DECLARATION_PREFIX, p);

        typeDeclaration.modifiers.forEach(m => this.visitModifier(m, p));

        this.visitJsLeftPaddedLocal("type", typeDeclaration.padding.name, JsLeftPadded.Location.TYPE_DECLARATION_NAME, p);

        const typeParameters = typeDeclaration.typeParameters;
        if (typeParameters) {
            this.visitNodes(typeParameters.annotations, p);
            this.visitSpace(typeParameters.prefix, Space.Location.TYPE_PARAMETERS, p);
            this.visitMarkers(typeParameters.markers, p);
            p.append("<");
            this.visitJRightPaddedLocal(typeParameters.padding.typeParameters, JRightPadded.Location.TYPE_PARAMETER, ",", p);
            p.append(">");
        }

        this.visitJsLeftPaddedLocal("=", typeDeclaration.padding.initializer, JsLeftPadded.Location.TYPE_DECLARATION_INITIALIZER, p);

        this.afterSyntax(typeDeclaration, p);
        return typeDeclaration;
    }

    visitLiteralType(literalType: JS.LiteralType, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(literalType, JsSpace.Location.LITERAL_TYPE_PREFIX, p);
        this.visit(literalType.literal, p);
        this.afterSyntax(literalType, p);
        return literalType;
    }

    visitNamedImports(namedImports: JS.NamedImports, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(namedImports, JsSpace.Location.NAMED_IMPORTS_PREFIX, p);
        this.visitJsContainerLocal("{", namedImports.padding.elements, JsContainer.Location.NAMED_IMPORTS_ELEMENTS, ",", "}", p);
        this.afterSyntax(namedImports, p);
        return namedImports;
    }

    visitJsImportSpecifier(jis: JS.JsImportSpecifier, p: PrintOutputCapture<P>): JS.JsImportSpecifier {
        this.beforeSyntax(jis, JsSpace.Location.JS_IMPORT_SPECIFIER_PREFIX, p);

        if (jis.importType) {
            this.visitJsLeftPaddedLocal("type", jis.padding.importType, JsLeftPadded.Location.JS_IMPORT_SPECIFIER_IMPORT_TYPE, p);
        }

        this.visit(jis.specifier, p);

        this.afterSyntax(jis, p);
        return jis;
    }

    visitExportDeclaration(ed: JS.ExportDeclaration, p: PrintOutputCapture<P>): JS.ExportDeclaration {
        this.beforeSyntax(ed, JsSpace.Location.EXPORT_DECLARATION_PREFIX, p);
        p.append("export");
        ed.modifiers.forEach(it => this.visitModifier(it, p));

        if (ed.typeOnly) {
            this.visitJsLeftPaddedLocal("type", ed.padding.typeOnly, JsLeftPadded.Location.EXPORT_DECLARATION_TYPE_ONLY, p);
        }

        this.visit(ed.exportClause, p);
        this.visitJsLeftPaddedLocal("from", ed.padding.moduleSpecifier, JsLeftPadded.Location.EXPORT_DECLARATION_MODULE_SPECIFIER, p);
        this.visit(ed.attributes, p);

        this.afterSyntax(ed, p);
        return ed;
    }

    visitExportAssignment(es: JS.ExportAssignment, p: PrintOutputCapture<P>): JS.ExportAssignment {
        this.beforeSyntax(es, JsSpace.Location.EXPORT_ASSIGNMENT_PREFIX, p);
        p.append("export");
        es.modifiers.forEach(it => this.visitModifier(it, p));

        if (es.exportEquals) {
            this.visitJsLeftPaddedLocal("=", es.padding.exportEquals, JsLeftPadded.Location.EXPORT_ASSIGNMENT_EXPORT_EQUALS, p);
        }

        this.visit(es.expression, p);
        this.afterSyntax(es, p);
        return es;
    }

    visitIndexedAccessType(iat: JS.IndexedAccessType, p: PrintOutputCapture<P>): JS.IndexedAccessType {
        this.beforeSyntax(iat, JsSpace.Location.INDEXED_ACCESS_TYPE_PREFIX, p);

        this.visit(iat.objectType, p);
        // expect that this element is printed accordingly
        // <space_before>[<inner_space_before>index<inner_right_padded_suffix_space>]<right_padded_suffix_space>
        this.visit(iat.indexType, p);

        this.afterSyntax(iat, p);
        return iat;
    }

    visitIndexedAccessTypeIndexType(iatit: JS.IndexedAccessType.IndexType, p: PrintOutputCapture<P>): JS.IndexedAccessType.IndexType {
        this.beforeSyntax(iatit, JsSpace.Location.INDEXED_ACCESS_TYPE_INDEX_TYPE_PREFIX, p);

        p.append("[");
        this.visitJsRightPadded(iatit.padding.element, JsRightPadded.Location.INDEXED_ACCESS_TYPE_INDEX_TYPE_ELEMENT, p);
        p.append("]");

        this.afterSyntax(iatit, p);
        return iatit;
    }

    visitWithStatement(withStatement: JS.WithStatement, p: PrintOutputCapture<P>): JS.WithStatement {
        this.beforeSyntax(withStatement, JsSpace.Location.WITH_STATEMENT_PREFIX, p);
        p.append("with");
        this.visit(withStatement.expression, p);
        this.visitJsRightPadded(withStatement.padding.body, JsRightPadded.Location.WITH_STATEMENT_BODY, p);
        this.afterSyntax(withStatement, p);
        return withStatement;
    }

    visitExportSpecifier(es: JS.ExportSpecifier, p: PrintOutputCapture<P>): JS.ExportSpecifier {
        this.beforeSyntax(es, JsSpace.Location.EXPORT_SPECIFIER_PREFIX, p);
        if (es.typeOnly) {
            this.visitJsLeftPaddedLocal("type", es.padding.typeOnly, JsLeftPadded.Location.EXPORT_SPECIFIER_TYPE_ONLY, p);
        }

        this.visit(es.specifier, p);

        this.afterSyntax(es, p);
        return es;
    }



    visitNamedExports(ne: JS.NamedExports, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(ne, JsSpace.Location.NAMED_EXPORTS_PREFIX, p);
        this.visitJsContainerLocal("{", ne.padding.elements, JsContainer.Location.NAMED_EXPORTS_ELEMENTS, ",", "}", p);
        this.afterSyntax(ne, p);
        return ne;
    }

    visitImportAttributes(importAttributes: JS.ImportAttributes, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(importAttributes, JsSpace.Location.IMPORT_ATTRIBUTES_PREFIX, p);

        p.append(JS.ImportAttributes.Token[importAttributes.token].toLowerCase());
        this.visitJsContainerLocal("{", importAttributes.padding.elements, JsContainer.Location.IMPORT_ATTRIBUTES_ELEMENTS, ",", "}", p);

        this.afterSyntax(importAttributes, p);
        return importAttributes;
    }

    visitImportAttribute(importAttribute: JS.ImportAttribute, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(importAttribute, JsSpace.Location.IMPORT_ATTRIBUTE_PREFIX, p);

        this.visit(importAttribute.name, p);
        this.visitJsLeftPaddedLocal(":", importAttribute.padding.value, JsLeftPadded.Location.IMPORT_ATTRIBUTE_VALUE, p);

        this.afterSyntax(importAttribute, p);
        return importAttribute;
    }

    visitImportTypeAttributes(importAttributes: JS.ImportTypeAttributes, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(importAttributes, JsSpace.Location.IMPORT_TYPE_ATTRIBUTES_PREFIX, p);
        p.append("{");

        this.visitJsRightPadded(importAttributes.padding.token, JsRightPadded.Location.IMPORT_TYPE_ATTRIBUTES_TOKEN, p);
        p.append(":");
        this.visitJsContainerLocal("{", importAttributes.padding.elements, JsContainer.Location.IMPORT_TYPE_ATTRIBUTES_ELEMENTS, ",", "}", p);
        this.visitSpace(importAttributes.end, JsSpace.Location.IMPORT_TYPE_ATTRIBUTES_END, p);

        p.append("}");
        this.afterSyntax(importAttributes, p);
        return importAttributes;
    }

    visitArrayBindingPattern(abp: JS.ArrayBindingPattern, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(abp, JsSpace.Location.ARRAY_BINDING_PATTERN_PREFIX, p);

        this.visitJsContainerLocal("[", abp.padding.elements, JsContainer.Location.ARRAY_BINDING_PATTERN_ELEMENTS, ",", "]", p);

        this.afterSyntax(abp, p);
        return abp;
    }

    visitMappedType(mappedType: JS.MappedType, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(mappedType, JsSpace.Location.MAPPED_TYPE_PREFIX, p);
        p.append("{");

        if (mappedType.prefixToken != null) {
            this.visitJsLeftPadded(mappedType.padding.prefixToken, JsLeftPadded.Location.MAPPED_TYPE_PREFIX_TOKEN, p);
        }

        if (mappedType.hasReadonly) {
            this.visitJsLeftPaddedLocal("readonly", mappedType.padding.hasReadonly, JsLeftPadded.Location.MAPPED_TYPE_HAS_READONLY, p);
        }

        this.visitMappedTypeKeysRemapping(mappedType.keysRemapping, p);

        if (mappedType.suffixToken != null) {
            this.visitJsLeftPadded(mappedType.padding.suffixToken, JsLeftPadded.Location.MAPPED_TYPE_SUFFIX_TOKEN, p);
        }

        if (mappedType.hasQuestionToken) {
            this.visitJsLeftPaddedLocal("?", mappedType.padding.hasQuestionToken, JsLeftPadded.Location.MAPPED_TYPE_HAS_QUESTION_TOKEN, p);
        }

        const colon = mappedType.valueType[0] instanceof J.Empty ? "" : ":";
        this.visitJsContainerLocal(colon, mappedType.padding.valueType, JsContainer.Location.MAPPED_TYPE_VALUE_TYPE, "", "", p);

        p.append("}");
        this.afterSyntax(mappedType, p);
        return mappedType;
    }

    visitMappedTypeKeysRemapping(mappedTypeKeys: JS.MappedType.KeysRemapping, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(mappedTypeKeys, JsSpace.Location.MAPPED_TYPE_KEYS_REMAPPING_PREFIX, p);
        p.append("[");
        this.visitJsRightPadded(mappedTypeKeys.padding.typeParameter, JsRightPadded.Location.MAPPED_TYPE_KEYS_REMAPPING_TYPE_PARAMETER, p);

        if (mappedTypeKeys.nameType != null) {
            p.append("as");
            this.visitJsRightPadded(mappedTypeKeys.padding.nameType, JsRightPadded.Location.MAPPED_TYPE_KEYS_REMAPPING_NAME_TYPE, p);
        }

        p.append("]");
        this.afterSyntax(mappedTypeKeys, p);
        return mappedTypeKeys;
    }

    visitMappedTypeMappedTypeParameter(mappedTypeParameter: JS.MappedType.MappedTypeParameter, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(mappedTypeParameter, JsSpace.Location.MAPPED_TYPE_MAPPED_TYPE_PARAMETER_PREFIX, p);
        this.visit(mappedTypeParameter.name, p);
        this.visitJsLeftPaddedLocal("in", mappedTypeParameter.padding.iterateType, JsLeftPadded.Location.MAPPED_TYPE_MAPPED_TYPE_PARAMETER_ITERATE_TYPE, p);
        this.afterSyntax(mappedTypeParameter, p);
        return mappedTypeParameter;
    }

    visitObjectBindingDeclarations(objectBindingDeclarations: JS.ObjectBindingDeclarations, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(objectBindingDeclarations, JsSpace.Location.OBJECT_BINDING_DECLARATIONS_PREFIX, p);
        this.visitNodes(objectBindingDeclarations.leadingAnnotations, p);
        objectBindingDeclarations.modifiers.forEach(m => this.visitModifier(m, p));

        this.visit(objectBindingDeclarations.typeExpression, p);
        this.visitJsContainerLocal("{", objectBindingDeclarations.padding.bindings, JsContainer.Location.OBJECT_BINDING_DECLARATIONS_BINDINGS, ",", "}", p);
        this.visitJsLeftPaddedLocal("=", objectBindingDeclarations.padding.initializer, JsLeftPadded.Location.OBJECT_BINDING_DECLARATIONS_INITIALIZER, p);
        this.afterSyntax(objectBindingDeclarations, p);
        return objectBindingDeclarations;
    }

    visitTaggedTemplateExpression(taggedTemplateExpression: JS.TaggedTemplateExpression, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(taggedTemplateExpression, JsSpace.Location.TAGGED_TEMPLATE_EXPRESSION_PREFIX, p);
        this.visitJsRightPadded(taggedTemplateExpression.padding.tag, JsRightPadded.Location.TAGGED_TEMPLATE_EXPRESSION_TAG, p);
        this.visitJsContainerLocal("<", taggedTemplateExpression.padding.typeArguments, JsContainer.Location.TAGGED_TEMPLATE_EXPRESSION_TYPE_ARGUMENTS, ",", ">", p);
        this.visit(taggedTemplateExpression.templateExpression, p);
        this.afterSyntax(taggedTemplateExpression, p);
        return taggedTemplateExpression;
    }

    visitTemplateExpression(templateExpression: JS.TemplateExpression, p: PrintOutputCapture<P>): JS.TemplateExpression {
        this.beforeSyntax(templateExpression, JsSpace.Location.TEMPLATE_EXPRESSION_PREFIX, p);
        this.visit(templateExpression.head, p);
        this.visitJsRightPaddedLocal(templateExpression.padding.templateSpans, JsRightPadded.Location.TEMPLATE_EXPRESSION_TEMPLATE_SPANS, "", p);
        this.afterSyntax(templateExpression, p);
        return templateExpression;
    }

    visitTemplateExpressionTemplateSpan(value: JS.TemplateExpression.TemplateSpan, p: PrintOutputCapture<P>): JS.TemplateExpression.TemplateSpan {
        this.beforeSyntax(value, JsSpace.Location.TEMPLATE_EXPRESSION_TEMPLATE_SPAN_PREFIX, p);
        this.visit(value.expression, p);
        this.visit(value.tail, p);
        this.afterSyntax(value, p);
        return value;
    }

    visitTuple(tuple: JS.Tuple, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(tuple, JsSpace.Location.TUPLE_PREFIX, p);
        this.visitJsContainerLocal("[", tuple.padding.elements, JsContainer.Location.TUPLE_ELEMENTS, ",", "]", p);
        this.afterSyntax(tuple, p);
        return tuple;
    }

    visitTypeQuery(typeQuery: JS.TypeQuery, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(typeQuery, JsSpace.Location.TYPE_QUERY_PREFIX, p);
        p.append("typeof");
        this.visit(typeQuery.typeExpression, p);
        this.visitJsContainerLocal("<", typeQuery.padding.typeArguments, JsContainer.Location.TYPE_QUERY_TYPE_ARGUMENTS, ",", ">", p);
        this.afterSyntax(typeQuery, p);
        return typeQuery;
    }

    visitTypeOf(typeOf: JS.TypeOf, p: PrintOutputCapture<P>): JS.TypeOf {
        this.beforeSyntax(typeOf, JsSpace.Location.TYPE_OF_PREFIX, p);
        p.append("typeof");
        this.visit(typeOf.expression, p);
        this.afterSyntax(typeOf, p);
        return typeOf;
    }

    visitTypeOperator(typeOperator: JS.TypeOperator, p: PrintOutputCapture<P>): JS.TypeOperator {
        this.beforeSyntax(typeOperator, JsSpace.Location.TYPE_OPERATOR_PREFIX, p);

        let keyword = "";
        if (typeOperator.operator === JS.TypeOperator.Type.ReadOnly) {
            keyword = "readonly";
        } else if (typeOperator.operator === JS.TypeOperator.Type.KeyOf) {
            keyword = "keyof";
        } else if (typeOperator.operator === JS.TypeOperator.Type.Unique) {
            keyword = "unique";
        }

        p.append(keyword);

        this.visitJsLeftPadded(typeOperator.padding.expression, JsLeftPadded.Location.TYPE_OPERATOR_EXPRESSION, p);

        this.afterSyntax(typeOperator, p);
        return typeOperator;
    }

    visitTypePredicate(typePredicate: JS.TypePredicate, p: PrintOutputCapture<P>): JS.TypePredicate {
        this.beforeSyntax(typePredicate, JsSpace.Location.TYPE_PREDICATE_PREFIX, p);

        if (typePredicate.asserts) {
            this.visitJsLeftPaddedLocal("asserts", typePredicate.padding.asserts, JsLeftPadded.Location.TYPE_PREDICATE_ASSERTS, p);
        }

        this.visit(typePredicate.parameterName, p);
        this.visitJsLeftPaddedLocal("is", typePredicate.padding.expression, JsLeftPadded.Location.TYPE_PREDICATE_EXPRESSION, p);

        this.afterSyntax(typePredicate, p);
        return typePredicate;
    }

    visitIndexSignatureDeclaration(isd: JS.IndexSignatureDeclaration, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(isd, JsSpace.Location.INDEX_SIGNATURE_DECLARATION_PREFIX, p);

        isd.modifiers.forEach(m => this.visitModifier(m, p));
        this.visitJsContainerLocal("[", isd.padding.parameters, JsContainer.Location.INDEX_SIGNATURE_DECLARATION_PARAMETERS, "", "]", p);
        this.visitJsLeftPaddedLocal(":", isd.padding.typeExpression, JsLeftPadded.Location.INDEX_SIGNATURE_DECLARATION_TYPE_EXPRESSION, p);

        this.afterSyntax(isd, p);
        return isd;
    }

    visitAnnotation(annotation: J.Annotation, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(annotation, Space.Location.ANNOTATION_PREFIX, p);

        p.append("@");
        this.visit(annotation.annotationType, p);
        this.visitJContainerLocal("(", annotation.padding.arguments, JContainer.Location.ANNOTATION_ARGUMENTS, ",", ")", p);

        this.afterSyntax(annotation, p);
        return annotation;
    }

    visitNewArray(newArray: J.NewArray, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(newArray, Space.Location.NEW_ARRAY_PREFIX, p);
        this.visit(newArray.typeExpression, p);
        this.visitNodes(newArray.dimensions, p);
        this.visitJContainerLocal("[", newArray.padding.initializer, JContainer.Location.NEW_ARRAY_INITIALIZER, ",", "]", p);
        this.afterSyntax(newArray, p);
        return newArray;
    }

    visitNewClass(newClass: J.NewClass, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(newClass, Space.Location.NEW_CLASS_PREFIX, p);
        this.visitJRightPaddedLocalSingle(newClass.padding.enclosing, JRightPadded.Location.NEW_CLASS_ENCLOSING, ".", p);
        this.visitSpace(newClass.new, Space.Location.NEW_PREFIX, p);

        if (newClass.clazz) {
            p.append("new");
            this.visit(newClass.clazz, p);

            if (!newClass.padding.arguments.markers.findFirst(J.OmitParentheses)) {
                this.visitJContainerLocal("(", newClass.padding.arguments, JContainer.Location.NEW_CLASS_ARGUMENTS, ",", ")", p);
            }
        }

        this.visit(newClass.body, p);
        this.afterSyntax(newClass, p);
        return newClass;
    }

    visitSwitch(switch_: J.Switch, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(switch_, Space.Location.SWITCH_PREFIX, p);
        p.append("switch");
        this.visit(switch_.selector, p);
        this.visit(switch_.cases, p);
        this.afterSyntax(switch_, p);
        return switch_;
    }

    visitCase(case_: J.Case, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(case_, Space.Location.CASE_PREFIX, p);

        const elem = case_.caseLabels[0];
        if (!(elem instanceof J.Identifier) || elem.simpleName !== "default") {
            p.append("case");
        }

        this.visitJContainerLocal("", case_.padding.caseLabels, JContainer.Location.CASE_CASE_LABELS, ",", "", p);

        this.visitSpace(case_.padding.statements.before, Space.Location.CASE, p);
        p.append(case_.type === J.Case.Type.Statement ? ":" : "->");

        this.visitStatements(case_.padding.statements.padding.elements, JRightPadded.Location.CASE, p);

        this.afterSyntax(case_, p);
        return case_;
    }

    visitLabel(label: J.Label, p: PrintOutputCapture<P>): J.Label {
        this.beforeSyntax(label, Space.Location.LABEL_PREFIX, p);
        this.visitJRightPaddedLocalSingle(label.padding.label, JRightPadded.Location.LABEL, ":", p);
        this.visit(label.statement, p);
        this.afterSyntax(label, p);
        return label;
    }

    visitContinue(continueStatement: J.Continue, p: PrintOutputCapture<P>): J.Continue {
        this.beforeSyntax(continueStatement, Space.Location.CONTINUE_PREFIX, p);
        p.append("continue");
        this.visit(continueStatement.label, p);
        this.afterSyntax(continueStatement, p);
        return continueStatement;
    }

    visitBreak(breakStatement: J.Break, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(breakStatement, Space.Location.BREAK_PREFIX, p);
        p.append("break");
        this.visit(breakStatement.label, p);
        this.afterSyntax(breakStatement, p);
        return breakStatement;
    }

    visitFieldAccess(fieldAccess: J.FieldAccess, p: PrintOutputCapture<P>): J.FieldAccess {
        this.beforeSyntax(fieldAccess, Space.Location.FIELD_ACCESS_PREFIX, p);
        this.visit(fieldAccess.target, p);
        //const postFixOperator = fieldAccess.markers.findFirst(PostFixOperator).orElse(null);

        this.visitJLeftPaddedLocal(".", fieldAccess.padding.name, JLeftPadded.Location.FIELD_ACCESS_NAME, p);
        this.afterSyntax(fieldAccess, p);
        return fieldAccess;
    }


    visitTypeLiteral(tl: JS.TypeLiteral, p: PrintOutputCapture<P>): JS.TypeLiteral {
        this.beforeSyntax(tl, JsSpace.Location.TYPE_LITERAL_PREFIX, p);

        this.visit(tl.members, p);

        this.afterSyntax(tl, p);
        return tl;
    }

    visitParentheses<T extends J.J>(parens: J.Parentheses<T>, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(parens, Space.Location.PARENTHESES_PREFIX, p);
        p.append('(');
        this.visitJRightPaddedLocalSingle(parens.padding.tree, JRightPadded.Location.PARENTHESES, ")", p);
        this.afterSyntax(parens, p);
        return parens;
    }

    visitParameterizedType(type: J.ParameterizedType, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(type, Space.Location.PARAMETERIZED_TYPE_PREFIX, p);
        this.visit(type.clazz, p);
        this.visitJContainerLocal("<", type.padding.typeParameters, JContainer.Location.TYPE_PARAMETERS, ",", ">", p);
        this.afterSyntax(type, p);
        return type;
    }

    visitAssignment(assignment: J.Assignment, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(assignment, Space.Location.ASSIGNMENT_PREFIX, p);
        this.visit(assignment.variable, p);
        this.visitJLeftPaddedLocal("=", assignment.padding.assignment, JLeftPadded.Location.ASSIGNMENT, p);
        this.afterSyntax(assignment, p);
        return assignment;
    }

    public visitPropertyAssignment(propertyAssignment: JS.PropertyAssignment, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(propertyAssignment, JsSpace.Location.PROPERTY_ASSIGNMENT_PREFIX, p);

        this.visitJsRightPadded(propertyAssignment.padding.name, JsRightPadded.Location.PROPERTY_ASSIGNMENT_NAME, p);

        if (propertyAssignment.initializer) {
            // if property is not null, we should print it like `{ a: b }`
            // otherwise, it is a shorthand assignment where we have stuff like `{ a }` only
            if (propertyAssignment.assigmentToken === JS.PropertyAssignment.AssigmentToken.Colon) {
                p.append(':');
            } else if (propertyAssignment.assigmentToken === JS.PropertyAssignment.AssigmentToken.Equals) {
                p.append('=');
            }
            this.visit(propertyAssignment.initializer, p);
        }

        this.afterSyntax(propertyAssignment, p);
        return propertyAssignment;
    }

    public visitAssignmentOperation(assignOp: J.AssignmentOperation, p: PrintOutputCapture<P>): J.J {
        let keyword = "";
        switch (assignOp.operator) {
            case J.AssignmentOperation.Type.Addition:
                keyword = "+=";
                break;
            case J.AssignmentOperation.Type.Subtraction:
                keyword = "-=";
                break;
            case J.AssignmentOperation.Type.Multiplication:
                keyword = "*=";
                break;
            case J.AssignmentOperation.Type.Division:
                keyword = "/=";
                break;
            case J.AssignmentOperation.Type.Modulo:
                keyword = "%=";
                break;
            case J.AssignmentOperation.Type.BitAnd:
                keyword = "&=";
                break;
            case J.AssignmentOperation.Type.BitOr:
                keyword = "|=";
                break;
            case J.AssignmentOperation.Type.BitXor:
                keyword = "^=";
                break;
            case J.AssignmentOperation.Type.LeftShift:
                keyword = "<<=";
                break;
            case J.AssignmentOperation.Type.RightShift:
                keyword = ">>=";
                break;
            case J.AssignmentOperation.Type.UnsignedRightShift:
                keyword = ">>>=";
                break;
        }

        this.beforeSyntax(assignOp, Space.Location.ASSIGNMENT_OPERATION_PREFIX, p);
        this.visit(assignOp.variable, p);
        this.visitSpace(assignOp.padding.operator.before, Space.Location.ASSIGNMENT_OPERATION_OPERATOR, p);
        p.append(keyword);
        this.visit(assignOp.assignment, p);
        this.afterSyntax(assignOp, p);

        return assignOp;
    }

    visitJsAssignmentOperation(assignOp: JS.JsAssignmentOperation, p: PrintOutputCapture<P>): J.J {
        let keyword = "";
        switch (assignOp.operator) {
            case JS.JsAssignmentOperation.Type.QuestionQuestion:
                keyword = "??=";
                break;
            case JS.JsAssignmentOperation.Type.And:
                keyword = "&&=";
                break;
            case JS.JsAssignmentOperation.Type.Or:
                keyword = "||=";
                break;
            case JS.JsAssignmentOperation.Type.Power:
                keyword = "**";
                break;
            case JS.JsAssignmentOperation.Type.Exp:
                keyword = "**=";
                break;
        }

        this.beforeSyntax(assignOp, JsSpace.Location.JS_ASSIGNMENT_OPERATION_PREFIX, p);
        this.visit(assignOp.variable, p);
        this.visitSpace(assignOp.padding.operator.before, JsSpace.Location.JS_ASSIGNMENT_OPERATION_OPERATOR_PREFIX, p);
        p.append(keyword);
        this.visit(assignOp.assignment, p);
        this.afterSyntax(assignOp, p);

        return assignOp;
    }

    visitEnumValue(enum_: J.EnumValue, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(enum_, Space.Location.ENUM_VALUE_PREFIX, p);
        this.visit(enum_.name, p);

        const initializer = enum_.initializer;
        if (initializer) {
            this.visitSpace(initializer.prefix, Space.Location.NEW_CLASS_PREFIX, p);
            p.append("=");
            // There can be only one argument
            const expression = initializer.arguments[0];
            this.visit(expression, p);
            return enum_;
        }

        this.afterSyntax(enum_, p);
        return enum_;
    }

    visitEnumValueSet(enums: J.EnumValueSet, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(enums, Space.Location.ENUM_VALUE_SET_PREFIX, p);
        this.visitJRightPaddedLocal(enums.padding.enums, JRightPadded.Location.ENUM_VALUE, ",", p);

        if (enums.terminatedWithSemicolon) {
            p.append(",");
        }

        this.afterSyntax(enums, p);
        return enums;
    }

    visitBinary(binary: J.Binary, p: PrintOutputCapture<P>): J.J {
        let keyword = "";
        switch (binary.operator) {
            case J.Binary.Type.Addition:
                keyword = "+";
                break;
            case J.Binary.Type.Subtraction:
                keyword = "-";
                break;
            case J.Binary.Type.Multiplication:
                keyword = "*";
                break;
            case J.Binary.Type.Division:
                keyword = "/";
                break;
            case J.Binary.Type.Modulo:
                keyword = "%";
                break;
            case J.Binary.Type.LessThan:
                keyword = "<";
                break;
            case J.Binary.Type.GreaterThan:
                keyword = ">";
                break;
            case J.Binary.Type.LessThanOrEqual:
                keyword = "<=";
                break;
            case J.Binary.Type.GreaterThanOrEqual:
                keyword = ">=";
                break;
            case J.Binary.Type.Equal:
                keyword = "==";
                break;
            case J.Binary.Type.NotEqual:
                keyword = "!=";
                break;
            case J.Binary.Type.BitAnd:
                keyword = "&";
                break;
            case J.Binary.Type.BitOr:
                keyword = "|";
                break;
            case J.Binary.Type.BitXor:
                keyword = "^";
                break;
            case J.Binary.Type.LeftShift:
                keyword = "<<";
                break;
            case J.Binary.Type.RightShift:
                keyword = ">>";
                break;
            case J.Binary.Type.UnsignedRightShift:
                keyword = ">>>";
                break;
            case J.Binary.Type.Or:
                //keyword = binary.markers.find((marker) => marker instanceof Comma) ? "," : "||";
                keyword = "||";
                break;
            case J.Binary.Type.And:
                keyword = "&&";
                break;
        }

        this.beforeSyntax(binary, Space.Location.BINARY_PREFIX, p);
        this.visit(binary.left, p);
        this.visitSpace(binary.padding.operator.before, Space.Location.BINARY_OPERATOR, p);
        p.append(keyword);
        this.visit(binary.right, p);
        this.afterSyntax(binary, p);

        return binary;
    }

    visitJsBinary(binary: JS.JsBinary, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(binary, JsSpace.Location.JS_BINARY_PREFIX, p);

        this.visit(binary.left, p);
        let keyword = "";

        switch (binary.operator) {
            case JS.JsBinary.Type.As:
                keyword = "as";
                break;
            case JS.JsBinary.Type.IdentityEquals:
                keyword = "===";
                break;
            case JS.JsBinary.Type.IdentityNotEquals:
                keyword = "!==";
                break;
            case JS.JsBinary.Type.In:
                keyword = "in";
                break;
            case JS.JsBinary.Type.QuestionQuestion:
                keyword = "??";
                break;
            case JS.JsBinary.Type.Comma:
                keyword = ",";
                break;
        }

        this.visitSpace(binary.padding.operator.before, JsSpace.Location.JS_BINARY_OPERATOR, p);
        p.append(keyword);

        this.visit(binary.right, p);

        this.afterSyntax(binary, p);
        return binary;
    }

    visitUnary(unary: J.Unary, p: PrintOutputCapture<P>): J.Unary {
        this.beforeSyntax(unary, Space.Location.UNARY_PREFIX, p);
        switch (unary.operator) {
            case J.Unary.Type.PreIncrement:
                p.append("++");
                this.visit(unary.expression, p);
                break;
            case J.Unary.Type.PreDecrement:
                p.append("--");
                this.visit(unary.expression, p);
                break;
            case J.Unary.Type.PostIncrement:
                this.visit(unary.expression, p);
                this.visitSpace(unary.padding.operator.before, Space.Location.UNARY_OPERATOR, p);
                p.append("++");
                break;
            case J.Unary.Type.PostDecrement:
                this.visit(unary.expression, p);
                this.visitSpace(unary.padding.operator.before, Space.Location.UNARY_OPERATOR, p);
                p.append("--");
                break;
            case J.Unary.Type.Positive:
                p.append('+');
                this.visit(unary.expression, p);
                break;
            case J.Unary.Type.Negative:
                p.append('-');
                this.visit(unary.expression, p);
                break;
            case J.Unary.Type.Complement:
                p.append('~');
                this.visit(unary.expression, p);
                break;
            case J.Unary.Type.Not:
            default:
                p.append('!');
                this.visit(unary.expression, p);
        }
        this.afterSyntax(unary, p);
        return unary;
    }

    visitJsUnary(unary: JS.Unary, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(unary, JsSpace.Location.UNARY_PREFIX, p);

        switch (unary.operator) {
            case JS.Unary.Type.Spread:
                this.visitSpace(unary.padding.operator.before, JsSpace.Location.UNARY_OPERATOR, p);
                p.append("...");
                this.visit(unary.expression, p);
                break;
            case JS.Unary.Type.Optional:
                this.visit(unary.expression, p);
                this.visitSpace(unary.padding.operator.before, JsSpace.Location.UNARY_OPERATOR, p);
                p.append("?");
                break;
            case JS.Unary.Type.Exclamation:
                this.visit(unary.expression, p);
                this.visitSpace(unary.padding.operator.before, JsSpace.Location.UNARY_OPERATOR, p);
                p.append("!");
                break;
            case JS.Unary.Type.QuestionDot:
                this.visit(unary.expression, p);
                this.visitSpace(unary.padding.operator.before, JsSpace.Location.UNARY_OPERATOR, p);
                p.append("?");
                break;
            case JS.Unary.Type.QuestionDotWithDot:
                this.visit(unary.expression, p);
                this.visitSpace(unary.padding.operator.before, JsSpace.Location.UNARY_OPERATOR, p);
                p.append("?.");
                break;
            case JS.Unary.Type.Asterisk:
                p.append("*");
                this.visitSpace(unary.padding.operator.before, JsSpace.Location.UNARY_OPERATOR, p);
                this.visit(unary.expression, p);
                break;
            default:
                break;
        }

        this.afterSyntax(unary, p);
        return unary;
    }

    visitUnion(union: JS.Union, p: PrintOutputCapture<P>): JS.Union {
        this.beforeSyntax(union, JsSpace.Location.UNION_PREFIX, p);

        this.visitJsRightPaddedLocal(union.padding.types, JsRightPadded.Location.UNION_TYPES, "|", p);

        this.afterSyntax(union, p);
        return union;
    }

    visitIntersection(intersection: JS.Intersection, p: PrintOutputCapture<P>): JS.Intersection {
        this.beforeSyntax(intersection, JsSpace.Location.INTERSECTION_PREFIX, p);

        this.visitJsRightPaddedLocal(intersection.padding.types, JsRightPadded.Location.INTERSECTION_TYPES, "&", p);

        this.afterSyntax(intersection, p);
        return intersection;
    }

    visitForLoop(forLoop: J.ForLoop, p: PrintOutputCapture<P>): J.ForLoop {
        this.beforeSyntax(forLoop, Space.Location.FOR_PREFIX, p);
        p.append("for");
        const ctrl = forLoop.control;
        this.visitSpace(ctrl.prefix, Space.Location.FOR_CONTROL_PREFIX, p);
        p.append('(');
        this.visitJRightPaddedLocal(ctrl.padding.init, JRightPadded.Location.FOR_INIT, ",", p);
        p.append(';');
        this.visitJRightPaddedLocalSingle(ctrl.padding.condition, JRightPadded.Location.FOR_CONDITION, ";", p);
        this.visitJRightPaddedLocal(ctrl.padding.update, JRightPadded.Location.FOR_UPDATE, ",", p);
        p.append(')');
        this.visitStatementLocal(forLoop.padding.body, JRightPadded.Location.FOR_BODY, p);
        this.afterSyntax(forLoop, p);
        return forLoop;
    }

    visitJSForOfLoop(loop: JS.JSForOfLoop, p: PrintOutputCapture<P>): JS.JSForOfLoop {
        this.beforeSyntax(loop, JsSpace.Location.JSFOR_OF_LOOP_PREFIX, p);
        p.append("for");
        if (loop.await) {
            this.visitJsLeftPaddedLocal("await", loop.padding.await, JsLeftPadded.Location.JSFOR_OF_LOOP_AWAIT, p);
        }

        const control = loop.control;
        this.visitSpace(control.prefix, JsSpace.Location.JSFOR_IN_OF_LOOP_CONTROL_PREFIX, p);
        p.append('(');
        this.visitJsRightPadded(control.padding.variable, JsRightPadded.Location.JSFOR_IN_OF_LOOP_CONTROL_VARIABLE, p);
        p.append("of");
        this.visitJsRightPadded(control.padding.iterable, JsRightPadded.Location.JSFOR_IN_OF_LOOP_CONTROL_ITERABLE, p);
        p.append(')');
        this.visitJsRightPadded(loop.padding.body, JsRightPadded.Location.JSFOR_OF_LOOP_BODY, p);
        this.afterSyntax(loop, p);
        return loop;
    }

    visitJSForInLoop(loop: JS.JSForInLoop, p: PrintOutputCapture<P>): JS.JSForInLoop {
        this.beforeSyntax(loop, JsSpace.Location.JSFOR_IN_LOOP_PREFIX, p);
        p.append("for");

        const control = loop.control;
        this.visitSpace(control.prefix, JsSpace.Location.JSFOR_IN_OF_LOOP_CONTROL_PREFIX, p);
        p.append('(');
        this.visitJsRightPadded(control.padding.variable, JsRightPadded.Location.JSFOR_IN_OF_LOOP_CONTROL_VARIABLE, p);
        p.append("in");
        this.visitJsRightPadded(control.padding.iterable, JsRightPadded.Location.JSFOR_IN_OF_LOOP_CONTROL_ITERABLE, p);
        p.append(')');
        this.visitJsRightPadded(loop.padding.body, JsRightPadded.Location.JSFOR_IN_LOOP_BODY, p);
        this.afterSyntax(loop, p);
        return loop;
    }
    
    // ---- print utils

    private visitStatements(statements: JRightPadded<J.Statement>[], location: JRightPadded.Location, p: PrintOutputCapture<P>) {
        const objectLiteral =
            this.getParentCursor(0)?.value() instanceof J.Block &&
            this.getParentCursor(1)?.value() instanceof J.NewClass;

        for (let i = 0; i < statements.length; i++) {
            const paddedStat = statements[i];
            this.visitStatementLocal(paddedStat, location, p);
            if (i < statements.length - 1 && objectLiteral) {
                p.append(",");
            }
        }
    }

    private visitStatementLocal(paddedStat: JRightPadded<J.Statement> | null, location: JRightPadded.Location, p: PrintOutputCapture<P>) {
        if (paddedStat !== null) {
            this.visit(paddedStat.element, p);
            this.visitSpace(paddedStat.after, JRightPadded.Location.afterLocation(location), p);
            this.visitMarkers(paddedStat.markers, p);
        }
    }

    private getParentCursor(levels: number): Cursor | null {
        let cursor: Cursor | null = this.cursor;

        for (let i = 0; i < levels && cursor !== null; i++) {
            cursor = cursor.parent;
        }

        return cursor;
    }

    private afterSyntax(j: J.J, p: PrintOutputCapture<P>) {
        this.afterSyntaxMarkers(j.markers, p);
    }

    private afterSyntaxMarkers(markers: Markers, p: PrintOutputCapture<P>) {
        for (const marker of markers.markers) {
            p.out.concat(p.markerPrinter.afterSyntax(marker, new Cursor(this.cursor, marker), this.JAVA_SCRIPT_MARKER_WRAPPER));
        }
    }

    private beforeSyntax(j: J.J, loc: Space.Location | JsSpace.Location | null, p: PrintOutputCapture<P>) {
        this.beforeSyntaxExt(j.prefix, j.markers, loc, p);
    }

    private beforeSyntaxExt(prefix: Space, markers: Markers, loc: Space.Location | JsSpace.Location | null, p: PrintOutputCapture<P>) {
        for (const marker of markers.markers) {
            p.out.concat(
                p.markerPrinter.beforePrefix(marker, new Cursor(this.cursor, marker), this.JAVA_SCRIPT_MARKER_WRAPPER)
            );
        }

        if (loc !== null) {
            this.visitSpace(prefix, loc, p);
        }

        this.visitMarkers(markers, p);

        for (const marker of markers.markers) {
            p.out.concat(
                p.markerPrinter.beforeSyntax(marker, new Cursor(this.cursor, marker), this.JAVA_SCRIPT_MARKER_WRAPPER)
            );
        }
    }

    visitSpace(space: Space, loc: Space.Location | JsSpace.Location | null, p: PrintOutputCapture<P>): Space {
        p.append(space.whitespace!);

        const comments = space.comments;
        for (let i = 0; i < comments.length; i++) {
            const comment = comments[i];
            this.visitMarkers(comment.markers, p);
            this.printComment(comment, this.cursor, p);
            p.append(comment.suffix);
        }

        return space;
    }

    private visitJRightPaddedLocal(nodes: JRightPadded<J.J>[], location: JRightPadded.Location, suffixBetween: string, p: PrintOutputCapture<P>) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            this.visit(node.element, p);

            if (location) {
                const loc = JRightPadded.Location.afterLocation(location);
                this.visitSpace(node.after, loc, p);
            }
            this.visitMarkers(node.markers, p);

            if (i < nodes.length - 1) {
                p.append(suffixBetween);
            }
        }
    }

    private visitJRightPaddedLocalSingle(node: JRightPadded<J.J> | null, location: JRightPadded.Location, suffix: string, p: PrintOutputCapture<P>) {
        if (node) {
            this.visit(node.element, p);

            if (location) {
                const loc = JRightPadded.Location.afterLocation(location);
                this.visitSpace(node.after, loc, p);
            }
            this.visitMarkers(node.markers, p);

            p.append(suffix);
        }
    }

    private visitJsRightPaddedLocal(nodes: JRightPadded<J.J>[], location: JsRightPadded.Location, suffixBetween: string, p: PrintOutputCapture<P>) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            this.visit(node.element, p);

            if (location) {
                const loc = JsRightPadded.Location.afterLocation(location);
                this.visitSpace(node.after, loc, p);
            }
            this.visitMarkers(node.markers, p);

            if (i < nodes.length - 1) {
                p.append(suffixBetween);
            }
        }
    }

    private visitJsRightPaddedLocalSingle(node: JRightPadded<J.J> | null, location: JsRightPadded.Location, suffix: string, p: PrintOutputCapture<P>) {
        if (node) {
            this.visit(node.element, p);

            if (location) {
                const loc = JsRightPadded.Location.afterLocation(location);
                this.visitSpace(node.after, loc, p);
            }
            this.visitMarkers(node.markers, p);

            p.append(suffix);
        }
    }

    private visitJLeftPaddedLocal(prefix: string | null, leftPadded: JLeftPadded<J.J> | JLeftPadded<boolean> | null, location: JLeftPadded.Location, p: PrintOutputCapture<P>) {
        if (leftPadded) {
            const loc = JLeftPadded.Location.beforeLocation(location);

            this.beforeSyntaxExt(leftPadded.before, leftPadded.markers, loc, p);

            if (prefix) {
                p.append(prefix);
            }

            if (typeof leftPadded.element !== 'boolean') {
                this.visit(leftPadded.element, p);
            }

            this.afterSyntaxMarkers(leftPadded.markers, p);
        }
    }

    private visitJsLeftPaddedLocal(prefix: string | null, leftPadded: JLeftPadded<J.J> | JLeftPadded<boolean> | null, location: JsLeftPadded.Location, p: PrintOutputCapture<P>) {
        if (leftPadded) {
            const loc =  JsLeftPadded.Location.beforeLocation(location);

            this.beforeSyntaxExt(leftPadded.before, leftPadded.markers, loc, p);

            if (prefix) {
                p.append(prefix);
            }

            if (typeof leftPadded.element !== 'boolean') {
                this.visit(leftPadded.element, p);
            }

            this.afterSyntaxMarkers(leftPadded.markers, p);
        }
    }

    private visitJContainerLocal(before: string, container: JContainer<J.J> | null, location: JContainer.Location, suffixBetween: string, after: string | null, p: PrintOutputCapture<P>) {
        if (container === null) {
            return;
        }

        const beforeLocation = JContainer.Location.beforeLocation(location);
        const elementLocation = JContainer.Location.elementLocation(location);
        this.beforeSyntaxExt(container.before, container.markers, beforeLocation, p);

        p.append(before);
        this.visitJRightPaddedLocal(container.padding.elements, elementLocation, suffixBetween, p);
        this.afterSyntaxMarkers(container.markers, p);

        p.append(after === null ? "" : after);
    }

    private visitJsContainerLocal(before: string, container: JContainer<J.J> | null, location: JsContainer.Location, suffixBetween: string, after: string | null, p: PrintOutputCapture<P>) {
        if (container === null) {
            return;
        }

        const beforeLocation = JsContainer.Location.beforeLocation(location);
        const elementLocation = JsContainer.Location.elementLocation(location);
        this.beforeSyntaxExt(container.before, container.markers, beforeLocation, p);

        p.append(before);
        this.visitJsRightPaddedLocal(container.padding.elements, elementLocation, suffixBetween, p);
        this.afterSyntaxMarkers(container.markers, p);

        p.append(after === null ? "" : after);
    }

    visitMarker<M>(marker: M, p: PrintOutputCapture<P>): M {
        if (marker instanceof Semicolon) {
            p.append(';');
        }
        if (marker instanceof TrailingComma) {
            p.append(',');
            this.visitSpace(marker.suffix, Space.Location.TRAILING_COMMA_SUFFIX, p);
        }
        return marker;
    }

    private printComment(comment: J.Comment, cursor: Cursor, p: PrintOutputCapture<P>): void {
        for (const marker of comment.markers.markers) {
            p.append(p.markerPrinter.beforeSyntax(marker, new Cursor(cursor, this), this.JAVA_SCRIPT_MARKER_WRAPPER));
        }

        if (comment instanceof J.TextComment) {
            p.append(comment.multiline ? `/*${comment.text}*/` : `//${comment.text}`);
        }

        for (const marker of comment.markers.markers) {
            p.append(p.markerPrinter.afterSyntax(marker, new Cursor(cursor, this), this.JAVA_SCRIPT_MARKER_WRAPPER));
        }
    }

    private visitNodes<T extends Tree>(nodes: T[] | null | undefined, p: PrintOutputCapture<P>): void {
        if (nodes) {
            for (const node of nodes) {
                this.visit(node, p);
            }
        }
    }

    public visitControlParentheses<T extends J.J>(controlParens: J.ControlParentheses<T>, p: PrintOutputCapture<P>): J.J {
        this.beforeSyntax(controlParens, Space.Location.CONTROL_PARENTHESES_PREFIX, p);

        if (this.getParentCursor(1)?.value() instanceof J.TypeCast) {
            p.append('<');
            this.visitJRightPaddedLocalSingle(controlParens.padding.tree, JRightPadded.Location.PARENTHESES, ">", p);
        } else {
            p.append('(');
            this.visitJRightPaddedLocalSingle(controlParens.padding.tree, JRightPadded.Location.PARENTHESES, ")", p);
        }

        this.afterSyntax(controlParens, p);
        return controlParens;
    }
}
