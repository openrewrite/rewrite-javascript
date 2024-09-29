// noinspection JSUnusedGlobalSymbols

import * as extensions from "./extensions";
import {JS, JSMixin, JsLeftPadded, JsRightPadded, JsContainer, JsSpace} from "./support_types";
import {JavaScriptVisitor} from "../visitor";
import {Checksum, Cursor, FileAttributes, LstType, Markers, PrintOutputCapture, PrinterFactory, SourceFile, SourceFileMixin, Tree, TreeVisitor, UUID} from "../../core";
import {Expression, J, JavaSourceFile, JavaType, JContainer, JLeftPadded, JRightPadded, NameTree, Space, Statement, TypedTree, TypeTree} from "../../java/tree";
import * as Java from "../../java/tree";

@LstType("org.openrewrite.javascript.tree.JS$CompilationUnit")
export class CompilationUnit extends SourceFileMixin(JSMixin(Object)) implements JavaSourceFile {
    public constructor(id: UUID, prefix: Space, markers: Markers, sourcePath: string, fileAttributes: FileAttributes | null, charsetName: string | null, charsetBomMarked: boolean, checksum: Checksum | null, imports: JRightPadded<Java.Import>[], statements: JRightPadded<Statement>[], eof: Space) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._sourcePath = sourcePath;
        this._fileAttributes = fileAttributes;
        this._charsetName = charsetName;
        this._charsetBomMarked = charsetBomMarked;
        this._checksum = checksum;
        this._imports = imports;
        this._statements = statements;
        this._eof = eof;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): CompilationUnit {
            return id === this._id ? this : new CompilationUnit(id, this._prefix, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._imports, this._statements, this._eof);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): CompilationUnit {
            return prefix === this._prefix ? this : new CompilationUnit(this._id, prefix, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._imports, this._statements, this._eof);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): CompilationUnit {
            return markers === this._markers ? this : new CompilationUnit(this._id, this._prefix, markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._imports, this._statements, this._eof);
        }

        private readonly _sourcePath: string;

        public get sourcePath(): string {
            return this._sourcePath;
        }

        public withSourcePath(sourcePath: string): CompilationUnit {
            return sourcePath === this._sourcePath ? this : new CompilationUnit(this._id, this._prefix, this._markers, sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._imports, this._statements, this._eof);
        }

        private readonly _fileAttributes: FileAttributes | null;

        public get fileAttributes(): FileAttributes | null {
            return this._fileAttributes;
        }

        public withFileAttributes(fileAttributes: FileAttributes | null): CompilationUnit {
            return fileAttributes === this._fileAttributes ? this : new CompilationUnit(this._id, this._prefix, this._markers, this._sourcePath, fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._imports, this._statements, this._eof);
        }

        private readonly _charsetName: string | null;

        public get charsetName(): string | null {
            return this._charsetName;
        }

        public withCharsetName(charsetName: string | null): CompilationUnit {
            return charsetName === this._charsetName ? this : new CompilationUnit(this._id, this._prefix, this._markers, this._sourcePath, this._fileAttributes, charsetName, this._charsetBomMarked, this._checksum, this._imports, this._statements, this._eof);
        }

        private readonly _charsetBomMarked: boolean;

        public get charsetBomMarked(): boolean {
            return this._charsetBomMarked;
        }

        public withCharsetBomMarked(charsetBomMarked: boolean): CompilationUnit {
            return charsetBomMarked === this._charsetBomMarked ? this : new CompilationUnit(this._id, this._prefix, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, charsetBomMarked, this._checksum, this._imports, this._statements, this._eof);
        }

        private readonly _checksum: Checksum | null;

        public get checksum(): Checksum | null {
            return this._checksum;
        }

        public withChecksum(checksum: Checksum | null): CompilationUnit {
            return checksum === this._checksum ? this : new CompilationUnit(this._id, this._prefix, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, checksum, this._imports, this._statements, this._eof);
        }

        private readonly _imports: JRightPadded<Java.Import>[];

        public get imports(): Java.Import[] {
            return JRightPadded.getElements(this._imports);
        }

        public withImports(imports: Java.Import[]): CompilationUnit {
            return this.padding.withImports(JRightPadded.withElements(this._imports, imports));
        }

        private readonly _statements: JRightPadded<Statement>[];

        public get statements(): Statement[] {
            return JRightPadded.getElements(this._statements);
        }

        public withStatements(statements: Statement[]): CompilationUnit {
            return this.padding.withStatements(JRightPadded.withElements(this._statements, statements));
        }

        private readonly _eof: Space;

        public get eof(): Space {
            return this._eof;
        }

        public withEof(eof: Space): CompilationUnit {
            return eof === this._eof ? this : new CompilationUnit(this._id, this._prefix, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._imports, this._statements, eof);
        }

    public printer<P>(cursor: Cursor): TreeVisitor<Tree, PrintOutputCapture<P>> {
        return PrinterFactory.current.createPrinter(cursor);
    }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitJsCompilationUnit(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get imports(): JRightPadded<Java.Import>[] {
                return t._imports;
            }
            public withImports(imports: JRightPadded<Java.Import>[]): CompilationUnit {
                return t._imports === imports ? t : new CompilationUnit(t._id, t._prefix, t._markers, t._sourcePath, t._fileAttributes, t._charsetName, t._charsetBomMarked, t._checksum, imports, t._statements, t._eof);
            }
            public get statements(): JRightPadded<Statement>[] {
                return t._statements;
            }
            public withStatements(statements: JRightPadded<Statement>[]): CompilationUnit {
                return t._statements === statements ? t : new CompilationUnit(t._id, t._prefix, t._markers, t._sourcePath, t._fileAttributes, t._charsetName, t._charsetBomMarked, t._checksum, t._imports, statements, t._eof);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$Alias")
export class Alias extends JSMixin(Object) implements Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, propertyName: JRightPadded<Java.Identifier>, alias: Java.Identifier) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._propertyName = propertyName;
        this._alias = alias;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Alias {
            return id === this._id ? this : new Alias(id, this._prefix, this._markers, this._propertyName, this._alias);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Alias {
            return prefix === this._prefix ? this : new Alias(this._id, prefix, this._markers, this._propertyName, this._alias);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Alias {
            return markers === this._markers ? this : new Alias(this._id, this._prefix, markers, this._propertyName, this._alias);
        }

        private readonly _propertyName: JRightPadded<Java.Identifier>;

        public get propertyName(): Java.Identifier {
            return this._propertyName.element;
        }

        public withPropertyName(propertyName: Java.Identifier): Alias {
            return this.padding.withPropertyName(this._propertyName.withElement(propertyName));
        }

        private readonly _alias: Java.Identifier;

        public get alias(): Java.Identifier {
            return this._alias;
        }

        public withAlias(alias: Java.Identifier): Alias {
            return alias === this._alias ? this : new Alias(this._id, this._prefix, this._markers, this._propertyName, alias);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitAlias(this, p);
    }

    public get type(): JavaType | null {
        return extensions.getJavaType(this);
    }

    public withType(type: JavaType): Alias {
        return extensions.withJavaType(this, type);
    }

    get padding() {
        const t = this;
        return new class {
            public get propertyName(): JRightPadded<Java.Identifier> {
                return t._propertyName;
            }
            public withPropertyName(propertyName: JRightPadded<Java.Identifier>): Alias {
                return t._propertyName === propertyName ? t : new Alias(t._id, t._prefix, t._markers, propertyName, t._alias);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$ArrowFunction")
export class ArrowFunction extends JSMixin(Object) implements Statement, Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, leadingAnnotations: Java.Annotation[], modifiers: Java.Modifier[], parameters: Java.Lambda.Parameters, returnTypeExpression: TypeTree | null, arrow: Space, body: J, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._leadingAnnotations = leadingAnnotations;
        this._modifiers = modifiers;
        this._parameters = parameters;
        this._returnTypeExpression = returnTypeExpression;
        this._arrow = arrow;
        this._body = body;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): ArrowFunction {
            return id === this._id ? this : new ArrowFunction(id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._parameters, this._returnTypeExpression, this._arrow, this._body, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): ArrowFunction {
            return prefix === this._prefix ? this : new ArrowFunction(this._id, prefix, this._markers, this._leadingAnnotations, this._modifiers, this._parameters, this._returnTypeExpression, this._arrow, this._body, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): ArrowFunction {
            return markers === this._markers ? this : new ArrowFunction(this._id, this._prefix, markers, this._leadingAnnotations, this._modifiers, this._parameters, this._returnTypeExpression, this._arrow, this._body, this._type);
        }

        private readonly _leadingAnnotations: Java.Annotation[];

        public get leadingAnnotations(): Java.Annotation[] {
            return this._leadingAnnotations;
        }

        public withLeadingAnnotations(leadingAnnotations: Java.Annotation[]): ArrowFunction {
            return leadingAnnotations === this._leadingAnnotations ? this : new ArrowFunction(this._id, this._prefix, this._markers, leadingAnnotations, this._modifiers, this._parameters, this._returnTypeExpression, this._arrow, this._body, this._type);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): ArrowFunction {
            return modifiers === this._modifiers ? this : new ArrowFunction(this._id, this._prefix, this._markers, this._leadingAnnotations, modifiers, this._parameters, this._returnTypeExpression, this._arrow, this._body, this._type);
        }

        private readonly _parameters: Java.Lambda.Parameters;

        public get parameters(): Java.Lambda.Parameters {
            return this._parameters;
        }

        public withParameters(parameters: Java.Lambda.Parameters): ArrowFunction {
            return parameters === this._parameters ? this : new ArrowFunction(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, parameters, this._returnTypeExpression, this._arrow, this._body, this._type);
        }

        private readonly _returnTypeExpression: TypeTree | null;

        public get returnTypeExpression(): TypeTree | null {
            return this._returnTypeExpression;
        }

        public withReturnTypeExpression(returnTypeExpression: TypeTree | null): ArrowFunction {
            return returnTypeExpression === this._returnTypeExpression ? this : new ArrowFunction(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._parameters, returnTypeExpression, this._arrow, this._body, this._type);
        }

        private readonly _arrow: Space;

        public get arrow(): Space {
            return this._arrow;
        }

        public withArrow(arrow: Space): ArrowFunction {
            return arrow === this._arrow ? this : new ArrowFunction(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._parameters, this._returnTypeExpression, arrow, this._body, this._type);
        }

        private readonly _body: J;

        public get body(): J {
            return this._body;
        }

        public withBody(body: J): ArrowFunction {
            return body === this._body ? this : new ArrowFunction(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._parameters, this._returnTypeExpression, this._arrow, body, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): ArrowFunction {
            return _type === this._type ? this : new ArrowFunction(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._parameters, this._returnTypeExpression, this._arrow, this._body, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitArrowFunction(this, p);
    }

}

@LstType("org.openrewrite.javascript.tree.JS$Await")
export class Await extends JSMixin(Object) implements Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, expression: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._expression = expression;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Await {
            return id === this._id ? this : new Await(id, this._prefix, this._markers, this._expression, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Await {
            return prefix === this._prefix ? this : new Await(this._id, prefix, this._markers, this._expression, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Await {
            return markers === this._markers ? this : new Await(this._id, this._prefix, markers, this._expression, this._type);
        }

        private readonly _expression: Expression;

        public get expression(): Expression {
            return this._expression;
        }

        public withExpression(expression: Expression): Await {
            return expression === this._expression ? this : new Await(this._id, this._prefix, this._markers, expression, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): Await {
            return _type === this._type ? this : new Await(this._id, this._prefix, this._markers, this._expression, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitAwait(this, p);
    }

}

@LstType("org.openrewrite.javascript.tree.JS$DefaultType")
export class DefaultType extends JSMixin(Object) implements Expression, TypedTree, NameTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, left: Expression, beforeEquals: Space, right: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._left = left;
        this._beforeEquals = beforeEquals;
        this._right = right;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): DefaultType {
            return id === this._id ? this : new DefaultType(id, this._prefix, this._markers, this._left, this._beforeEquals, this._right, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): DefaultType {
            return prefix === this._prefix ? this : new DefaultType(this._id, prefix, this._markers, this._left, this._beforeEquals, this._right, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): DefaultType {
            return markers === this._markers ? this : new DefaultType(this._id, this._prefix, markers, this._left, this._beforeEquals, this._right, this._type);
        }

        private readonly _left: Expression;

        public get left(): Expression {
            return this._left;
        }

        public withLeft(left: Expression): DefaultType {
            return left === this._left ? this : new DefaultType(this._id, this._prefix, this._markers, left, this._beforeEquals, this._right, this._type);
        }

        private readonly _beforeEquals: Space;

        public get beforeEquals(): Space {
            return this._beforeEquals;
        }

        public withBeforeEquals(beforeEquals: Space): DefaultType {
            return beforeEquals === this._beforeEquals ? this : new DefaultType(this._id, this._prefix, this._markers, this._left, beforeEquals, this._right, this._type);
        }

        private readonly _right: Expression;

        public get right(): Expression {
            return this._right;
        }

        public withRight(right: Expression): DefaultType {
            return right === this._right ? this : new DefaultType(this._id, this._prefix, this._markers, this._left, this._beforeEquals, right, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): DefaultType {
            return _type === this._type ? this : new DefaultType(this._id, this._prefix, this._markers, this._left, this._beforeEquals, this._right, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitDefaultType(this, p);
    }

}

@LstType("org.openrewrite.javascript.tree.JS$Delete")
export class Delete extends JSMixin(Object) implements Expression, Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, expression: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._expression = expression;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Delete {
            return id === this._id ? this : new Delete(id, this._prefix, this._markers, this._expression, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Delete {
            return prefix === this._prefix ? this : new Delete(this._id, prefix, this._markers, this._expression, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Delete {
            return markers === this._markers ? this : new Delete(this._id, this._prefix, markers, this._expression, this._type);
        }

        private readonly _expression: Expression;

        public get expression(): Expression {
            return this._expression;
        }

        public withExpression(expression: Expression): Delete {
            return expression === this._expression ? this : new Delete(this._id, this._prefix, this._markers, expression, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): Delete {
            return _type === this._type ? this : new Delete(this._id, this._prefix, this._markers, this._expression, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitDelete(this, p);
    }

}

@LstType("org.openrewrite.javascript.tree.JS$Export")
export class Export extends JSMixin(Object) implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, exports: JContainer<Expression> | null, _from: Space | null, target: Java.Literal | null, initializer: JLeftPadded<Expression> | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._exports = exports;
        this._from = _from;
        this._target = target;
        this._initializer = initializer;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Export {
            return id === this._id ? this : new Export(id, this._prefix, this._markers, this._exports, this._from, this._target, this._initializer);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Export {
            return prefix === this._prefix ? this : new Export(this._id, prefix, this._markers, this._exports, this._from, this._target, this._initializer);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Export {
            return markers === this._markers ? this : new Export(this._id, this._prefix, markers, this._exports, this._from, this._target, this._initializer);
        }

        private readonly _exports: JContainer<Expression> | null;

        public get exports(): Expression[] | null {
            return this._exports === null ? null : this._exports.elements;
        }

        public withExports(exports: Expression[] | null): Export {
            return this.padding.withExports(JContainer.withElementsNullable(this._exports, exports));
        }

        private readonly _from: Space | null;

        public get from(): Space | null {
            return this._from;
        }

        public withFrom(_from: Space | null): Export {
            return _from === this._from ? this : new Export(this._id, this._prefix, this._markers, this._exports, _from, this._target, this._initializer);
        }

        private readonly _target: Java.Literal | null;

        public get target(): Java.Literal | null {
            return this._target;
        }

        public withTarget(target: Java.Literal | null): Export {
            return target === this._target ? this : new Export(this._id, this._prefix, this._markers, this._exports, this._from, target, this._initializer);
        }

        private readonly _initializer: JLeftPadded<Expression> | null;

        public get initializer(): Expression | null {
            return this._initializer === null ? null : this._initializer.element;
        }

        public withInitializer(initializer: Expression | null): Export {
            return this.padding.withInitializer(JLeftPadded.withElement(this._initializer, initializer));
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitExport(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get exports(): JContainer<Expression> | null {
                return t._exports;
            }
            public withExports(exports: JContainer<Expression> | null): Export {
                return t._exports === exports ? t : new Export(t._id, t._prefix, t._markers, exports, t._from, t._target, t._initializer);
            }
            public get initializer(): JLeftPadded<Expression> | null {
                return t._initializer;
            }
            public withInitializer(initializer: JLeftPadded<Expression> | null): Export {
                return t._initializer === initializer ? t : new Export(t._id, t._prefix, t._markers, t._exports, t._from, t._target, initializer);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$FunctionType")
export class FunctionType extends JSMixin(Object) implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, parameters: JContainer<Statement>, arrow: Space, returnType: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._parameters = parameters;
        this._arrow = arrow;
        this._returnType = returnType;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): FunctionType {
            return id === this._id ? this : new FunctionType(id, this._prefix, this._markers, this._parameters, this._arrow, this._returnType, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): FunctionType {
            return prefix === this._prefix ? this : new FunctionType(this._id, prefix, this._markers, this._parameters, this._arrow, this._returnType, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): FunctionType {
            return markers === this._markers ? this : new FunctionType(this._id, this._prefix, markers, this._parameters, this._arrow, this._returnType, this._type);
        }

        private readonly _parameters: JContainer<Statement>;

        public get parameters(): Statement[] {
            return this._parameters.elements;
        }

        public withParameters(parameters: Statement[]): FunctionType {
            return this.padding.withParameters(JContainer.withElements(this._parameters, parameters));
        }

        private readonly _arrow: Space;

        public get arrow(): Space {
            return this._arrow;
        }

        public withArrow(arrow: Space): FunctionType {
            return arrow === this._arrow ? this : new FunctionType(this._id, this._prefix, this._markers, this._parameters, arrow, this._returnType, this._type);
        }

        private readonly _returnType: Expression;

        public get returnType(): Expression {
            return this._returnType;
        }

        public withReturnType(returnType: Expression): FunctionType {
            return returnType === this._returnType ? this : new FunctionType(this._id, this._prefix, this._markers, this._parameters, this._arrow, returnType, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): FunctionType {
            return _type === this._type ? this : new FunctionType(this._id, this._prefix, this._markers, this._parameters, this._arrow, this._returnType, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitFunctionType(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get parameters(): JContainer<Statement> {
                return t._parameters;
            }
            public withParameters(parameters: JContainer<Statement>): FunctionType {
                return t._parameters === parameters ? t : new FunctionType(t._id, t._prefix, t._markers, parameters, t._arrow, t._returnType, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$JsImport")
export class JsImport extends JSMixin(Object) implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, name: JRightPadded<Java.Identifier> | null, imports: JContainer<Expression> | null, _from: Space | null, target: Java.Literal | null, initializer: JLeftPadded<Expression> | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._name = name;
        this._imports = imports;
        this._from = _from;
        this._target = target;
        this._initializer = initializer;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): JsImport {
            return id === this._id ? this : new JsImport(id, this._prefix, this._markers, this._name, this._imports, this._from, this._target, this._initializer);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): JsImport {
            return prefix === this._prefix ? this : new JsImport(this._id, prefix, this._markers, this._name, this._imports, this._from, this._target, this._initializer);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): JsImport {
            return markers === this._markers ? this : new JsImport(this._id, this._prefix, markers, this._name, this._imports, this._from, this._target, this._initializer);
        }

        private readonly _name: JRightPadded<Java.Identifier> | null;

        public get name(): Java.Identifier | null {
            return this._name === null ? null : this._name.element;
        }

        public withName(name: Java.Identifier | null): JsImport {
            return this.padding.withName(JRightPadded.withElement(this._name, name));
        }

        private readonly _imports: JContainer<Expression> | null;

        public get imports(): Expression[] | null {
            return this._imports === null ? null : this._imports.elements;
        }

        public withImports(imports: Expression[] | null): JsImport {
            return this.padding.withImports(JContainer.withElementsNullable(this._imports, imports));
        }

        private readonly _from: Space | null;

        public get from(): Space | null {
            return this._from;
        }

        public withFrom(_from: Space | null): JsImport {
            return _from === this._from ? this : new JsImport(this._id, this._prefix, this._markers, this._name, this._imports, _from, this._target, this._initializer);
        }

        private readonly _target: Java.Literal | null;

        public get target(): Java.Literal | null {
            return this._target;
        }

        public withTarget(target: Java.Literal | null): JsImport {
            return target === this._target ? this : new JsImport(this._id, this._prefix, this._markers, this._name, this._imports, this._from, target, this._initializer);
        }

        private readonly _initializer: JLeftPadded<Expression> | null;

        public get initializer(): Expression | null {
            return this._initializer === null ? null : this._initializer.element;
        }

        public withInitializer(initializer: Expression | null): JsImport {
            return this.padding.withInitializer(JLeftPadded.withElement(this._initializer, initializer));
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitJsImport(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get name(): JRightPadded<Java.Identifier> | null {
                return t._name;
            }
            public withName(name: JRightPadded<Java.Identifier> | null): JsImport {
                return t._name === name ? t : new JsImport(t._id, t._prefix, t._markers, name, t._imports, t._from, t._target, t._initializer);
            }
            public get imports(): JContainer<Expression> | null {
                return t._imports;
            }
            public withImports(imports: JContainer<Expression> | null): JsImport {
                return t._imports === imports ? t : new JsImport(t._id, t._prefix, t._markers, t._name, imports, t._from, t._target, t._initializer);
            }
            public get initializer(): JLeftPadded<Expression> | null {
                return t._initializer;
            }
            public withInitializer(initializer: JLeftPadded<Expression> | null): JsImport {
                return t._initializer === initializer ? t : new JsImport(t._id, t._prefix, t._markers, t._name, t._imports, t._from, t._target, initializer);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$JsBinary")
export class JsBinary extends JSMixin(Object) implements Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, left: Expression, operator: JLeftPadded<JsBinary.Type>, right: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._left = left;
        this._operator = operator;
        this._right = right;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): JsBinary {
            return id === this._id ? this : new JsBinary(id, this._prefix, this._markers, this._left, this._operator, this._right, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): JsBinary {
            return prefix === this._prefix ? this : new JsBinary(this._id, prefix, this._markers, this._left, this._operator, this._right, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): JsBinary {
            return markers === this._markers ? this : new JsBinary(this._id, this._prefix, markers, this._left, this._operator, this._right, this._type);
        }

        private readonly _left: Expression;

        public get left(): Expression {
            return this._left;
        }

        public withLeft(left: Expression): JsBinary {
            return left === this._left ? this : new JsBinary(this._id, this._prefix, this._markers, left, this._operator, this._right, this._type);
        }

        private readonly _operator: JLeftPadded<JsBinary.Type>;

        public get operator(): JsBinary.Type {
            return this._operator.element;
        }

        public withOperator(operator: JsBinary.Type): JsBinary {
            return this.padding.withOperator(this._operator.withElement(operator));
        }

        private readonly _right: Expression;

        public get right(): Expression {
            return this._right;
        }

        public withRight(right: Expression): JsBinary {
            return right === this._right ? this : new JsBinary(this._id, this._prefix, this._markers, this._left, this._operator, right, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): JsBinary {
            return _type === this._type ? this : new JsBinary(this._id, this._prefix, this._markers, this._left, this._operator, this._right, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitJsBinary(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get operator(): JLeftPadded<JsBinary.Type> {
                return t._operator;
            }
            public withOperator(operator: JLeftPadded<JsBinary.Type>): JsBinary {
                return t._operator === operator ? t : new JsBinary(t._id, t._prefix, t._markers, t._left, operator, t._right, t._type);
            }
        }
    }

}

export namespace JsBinary {
    export enum Type {
            As = 0,
            IdentityEquals = 1,
            IdentityNotEquals = 2,
            In = 3,

    }

}

@LstType("org.openrewrite.javascript.tree.JS$ObjectBindingDeclarations")
export class ObjectBindingDeclarations extends JSMixin(Object) implements Statement, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, leadingAnnotations: Java.Annotation[], modifiers: Java.Modifier[], typeExpression: TypeTree | null, bindings: JContainer<ObjectBindingDeclarations.Binding>, initializer: JLeftPadded<Expression> | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._leadingAnnotations = leadingAnnotations;
        this._modifiers = modifiers;
        this._typeExpression = typeExpression;
        this._bindings = bindings;
        this._initializer = initializer;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): ObjectBindingDeclarations {
            return id === this._id ? this : new ObjectBindingDeclarations(id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeExpression, this._bindings, this._initializer);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): ObjectBindingDeclarations {
            return prefix === this._prefix ? this : new ObjectBindingDeclarations(this._id, prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeExpression, this._bindings, this._initializer);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): ObjectBindingDeclarations {
            return markers === this._markers ? this : new ObjectBindingDeclarations(this._id, this._prefix, markers, this._leadingAnnotations, this._modifiers, this._typeExpression, this._bindings, this._initializer);
        }

        private readonly _leadingAnnotations: Java.Annotation[];

        public get leadingAnnotations(): Java.Annotation[] {
            return this._leadingAnnotations;
        }

        public withLeadingAnnotations(leadingAnnotations: Java.Annotation[]): ObjectBindingDeclarations {
            return leadingAnnotations === this._leadingAnnotations ? this : new ObjectBindingDeclarations(this._id, this._prefix, this._markers, leadingAnnotations, this._modifiers, this._typeExpression, this._bindings, this._initializer);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): ObjectBindingDeclarations {
            return modifiers === this._modifiers ? this : new ObjectBindingDeclarations(this._id, this._prefix, this._markers, this._leadingAnnotations, modifiers, this._typeExpression, this._bindings, this._initializer);
        }

        private readonly _typeExpression: TypeTree | null;

        public get typeExpression(): TypeTree | null {
            return this._typeExpression;
        }

        public withTypeExpression(typeExpression: TypeTree | null): ObjectBindingDeclarations {
            return typeExpression === this._typeExpression ? this : new ObjectBindingDeclarations(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, typeExpression, this._bindings, this._initializer);
        }

        private readonly _bindings: JContainer<ObjectBindingDeclarations.Binding>;

        public get bindings(): ObjectBindingDeclarations.Binding[] {
            return this._bindings.elements;
        }

        public withBindings(bindings: ObjectBindingDeclarations.Binding[]): ObjectBindingDeclarations {
            return this.padding.withBindings(JContainer.withElements(this._bindings, bindings));
        }

        private readonly _initializer: JLeftPadded<Expression> | null;

        public get initializer(): Expression | null {
            return this._initializer === null ? null : this._initializer.element;
        }

        public withInitializer(initializer: Expression | null): ObjectBindingDeclarations {
            return this.padding.withInitializer(JLeftPadded.withElement(this._initializer, initializer));
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitObjectBindingDeclarations(this, p);
    }

    public get type(): JavaType | null {
        return extensions.getJavaType(this);
    }

    public withType(type: JavaType): ObjectBindingDeclarations {
        return extensions.withJavaType(this, type);
    }

    get padding() {
        const t = this;
        return new class {
            public get bindings(): JContainer<ObjectBindingDeclarations.Binding> {
                return t._bindings;
            }
            public withBindings(bindings: JContainer<ObjectBindingDeclarations.Binding>): ObjectBindingDeclarations {
                return t._bindings === bindings ? t : new ObjectBindingDeclarations(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeExpression, bindings, t._initializer);
            }
            public get initializer(): JLeftPadded<Expression> | null {
                return t._initializer;
            }
            public withInitializer(initializer: JLeftPadded<Expression> | null): ObjectBindingDeclarations {
                return t._initializer === initializer ? t : new ObjectBindingDeclarations(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeExpression, t._bindings, initializer);
            }
        }
    }

}

export namespace ObjectBindingDeclarations {
    @LstType("org.openrewrite.javascript.tree.JS$ObjectBindingDeclarations$Binding")
    export class Binding extends JSMixin(Object) implements NameTree {
        public constructor(id: UUID, prefix: Space, markers: Markers, propertyName: JRightPadded<Java.Identifier> | null, name: Java.Identifier, dimensionsAfterName: JLeftPadded<Space>[], afterVararg: Space | null, initializer: JLeftPadded<Expression> | null, variableType: JavaType.Variable | null) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._propertyName = propertyName;
            this._name = name;
            this._dimensionsAfterName = dimensionsAfterName;
            this._afterVararg = afterVararg;
            this._initializer = initializer;
            this._variableType = variableType;
        }

            private readonly _id: UUID;

            public get id(): UUID {
                return this._id;
            }

            public withId(id: UUID): ObjectBindingDeclarations.Binding {
                return id === this._id ? this : new ObjectBindingDeclarations.Binding(id, this._prefix, this._markers, this._propertyName, this._name, this._dimensionsAfterName, this._afterVararg, this._initializer, this._variableType);
            }

            private readonly _prefix: Space;

            public get prefix(): Space {
                return this._prefix;
            }

            public withPrefix(prefix: Space): ObjectBindingDeclarations.Binding {
                return prefix === this._prefix ? this : new ObjectBindingDeclarations.Binding(this._id, prefix, this._markers, this._propertyName, this._name, this._dimensionsAfterName, this._afterVararg, this._initializer, this._variableType);
            }

            private readonly _markers: Markers;

            public get markers(): Markers {
                return this._markers;
            }

            public withMarkers(markers: Markers): ObjectBindingDeclarations.Binding {
                return markers === this._markers ? this : new ObjectBindingDeclarations.Binding(this._id, this._prefix, markers, this._propertyName, this._name, this._dimensionsAfterName, this._afterVararg, this._initializer, this._variableType);
            }

            private readonly _propertyName: JRightPadded<Java.Identifier> | null;

            public get propertyName(): Java.Identifier | null {
                return this._propertyName === null ? null : this._propertyName.element;
            }

            public withPropertyName(propertyName: Java.Identifier | null): ObjectBindingDeclarations.Binding {
                return this.padding.withPropertyName(JRightPadded.withElement(this._propertyName, propertyName));
            }

            private readonly _name: Java.Identifier;

            public get name(): Java.Identifier {
                return this._name;
            }

            public withName(name: Java.Identifier): ObjectBindingDeclarations.Binding {
                return name === this._name ? this : new ObjectBindingDeclarations.Binding(this._id, this._prefix, this._markers, this._propertyName, name, this._dimensionsAfterName, this._afterVararg, this._initializer, this._variableType);
            }

            private readonly _dimensionsAfterName: JLeftPadded<Space>[];

            public get dimensionsAfterName(): JLeftPadded<Space>[] {
                return this._dimensionsAfterName;
            }

            public withDimensionsAfterName(dimensionsAfterName: JLeftPadded<Space>[]): ObjectBindingDeclarations.Binding {
                return dimensionsAfterName === this._dimensionsAfterName ? this : new ObjectBindingDeclarations.Binding(this._id, this._prefix, this._markers, this._propertyName, this._name, dimensionsAfterName, this._afterVararg, this._initializer, this._variableType);
            }

            private readonly _afterVararg: Space | null;

            public get afterVararg(): Space | null {
                return this._afterVararg;
            }

            public withAfterVararg(afterVararg: Space | null): ObjectBindingDeclarations.Binding {
                return afterVararg === this._afterVararg ? this : new ObjectBindingDeclarations.Binding(this._id, this._prefix, this._markers, this._propertyName, this._name, this._dimensionsAfterName, afterVararg, this._initializer, this._variableType);
            }

            private readonly _initializer: JLeftPadded<Expression> | null;

            public get initializer(): Expression | null {
                return this._initializer === null ? null : this._initializer.element;
            }

            public withInitializer(initializer: Expression | null): ObjectBindingDeclarations.Binding {
                return this.padding.withInitializer(JLeftPadded.withElement(this._initializer, initializer));
            }

            private readonly _variableType: JavaType.Variable | null;

            public get variableType(): JavaType.Variable | null {
                return this._variableType;
            }

            public withVariableType(variableType: JavaType.Variable | null): ObjectBindingDeclarations.Binding {
                return variableType === this._variableType ? this : new ObjectBindingDeclarations.Binding(this._id, this._prefix, this._markers, this._propertyName, this._name, this._dimensionsAfterName, this._afterVararg, this._initializer, variableType);
            }

        public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
            return v.visitBinding(this, p);
        }

        public get type(): JavaType | null {
            return extensions.getJavaType(this);
        }

        public withType(type: JavaType): ObjectBindingDeclarations.Binding {
            return extensions.withJavaType(this, type);
        }

        get padding() {
            const t = this;
            return new class {
                public get propertyName(): JRightPadded<Java.Identifier> | null {
                    return t._propertyName;
                }
                public withPropertyName(propertyName: JRightPadded<Java.Identifier> | null): ObjectBindingDeclarations.Binding {
                    return t._propertyName === propertyName ? t : new ObjectBindingDeclarations.Binding(t._id, t._prefix, t._markers, propertyName, t._name, t._dimensionsAfterName, t._afterVararg, t._initializer, t._variableType);
                }
                public get initializer(): JLeftPadded<Expression> | null {
                    return t._initializer;
                }
                public withInitializer(initializer: JLeftPadded<Expression> | null): ObjectBindingDeclarations.Binding {
                    return t._initializer === initializer ? t : new ObjectBindingDeclarations.Binding(t._id, t._prefix, t._markers, t._propertyName, t._name, t._dimensionsAfterName, t._afterVararg, initializer, t._variableType);
                }
            }
        }

    }

}

@LstType("org.openrewrite.javascript.tree.JS$PropertyAssignment")
export class PropertyAssignment extends JSMixin(Object) implements Statement, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, name: JRightPadded<Expression>, initializer: Expression) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._name = name;
        this._initializer = initializer;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): PropertyAssignment {
            return id === this._id ? this : new PropertyAssignment(id, this._prefix, this._markers, this._name, this._initializer);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): PropertyAssignment {
            return prefix === this._prefix ? this : new PropertyAssignment(this._id, prefix, this._markers, this._name, this._initializer);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): PropertyAssignment {
            return markers === this._markers ? this : new PropertyAssignment(this._id, this._prefix, markers, this._name, this._initializer);
        }

        private readonly _name: JRightPadded<Expression>;

        public get name(): Expression {
            return this._name.element;
        }

        public withName(name: Expression): PropertyAssignment {
            return this.padding.withName(this._name.withElement(name));
        }

        private readonly _initializer: Expression;

        public get initializer(): Expression {
            return this._initializer;
        }

        public withInitializer(initializer: Expression): PropertyAssignment {
            return initializer === this._initializer ? this : new PropertyAssignment(this._id, this._prefix, this._markers, this._name, initializer);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitPropertyAssignment(this, p);
    }

    public get type(): JavaType | null {
        return extensions.getJavaType(this);
    }

    public withType(type: JavaType): PropertyAssignment {
        return extensions.withJavaType(this, type);
    }

    get padding() {
        const t = this;
        return new class {
            public get name(): JRightPadded<Expression> {
                return t._name;
            }
            public withName(name: JRightPadded<Expression>): PropertyAssignment {
                return t._name === name ? t : new PropertyAssignment(t._id, t._prefix, t._markers, name, t._initializer);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$TemplateExpression")
export class TemplateExpression extends JSMixin(Object) implements Statement, Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, delimiter: string, tag: JRightPadded<Expression> | null, strings: J[], _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._delimiter = delimiter;
        this._tag = tag;
        this._strings = strings;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): TemplateExpression {
            return id === this._id ? this : new TemplateExpression(id, this._prefix, this._markers, this._delimiter, this._tag, this._strings, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TemplateExpression {
            return prefix === this._prefix ? this : new TemplateExpression(this._id, prefix, this._markers, this._delimiter, this._tag, this._strings, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TemplateExpression {
            return markers === this._markers ? this : new TemplateExpression(this._id, this._prefix, markers, this._delimiter, this._tag, this._strings, this._type);
        }

        private readonly _delimiter: string;

        public get delimiter(): string {
            return this._delimiter;
        }

        public withDelimiter(delimiter: string): TemplateExpression {
            return delimiter === this._delimiter ? this : new TemplateExpression(this._id, this._prefix, this._markers, delimiter, this._tag, this._strings, this._type);
        }

        private readonly _tag: JRightPadded<Expression> | null;

        public get tag(): Expression | null {
            return this._tag === null ? null : this._tag.element;
        }

        public withTag(tag: Expression | null): TemplateExpression {
            return this.padding.withTag(JRightPadded.withElement(this._tag, tag));
        }

        private readonly _strings: J[];

        public get strings(): J[] {
            return this._strings;
        }

        public withStrings(strings: J[]): TemplateExpression {
            return strings === this._strings ? this : new TemplateExpression(this._id, this._prefix, this._markers, this._delimiter, this._tag, strings, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): TemplateExpression {
            return _type === this._type ? this : new TemplateExpression(this._id, this._prefix, this._markers, this._delimiter, this._tag, this._strings, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTemplateExpression(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get tag(): JRightPadded<Expression> | null {
                return t._tag;
            }
            public withTag(tag: JRightPadded<Expression> | null): TemplateExpression {
                return t._tag === tag ? t : new TemplateExpression(t._id, t._prefix, t._markers, t._delimiter, tag, t._strings, t._type);
            }
        }
    }

}

export namespace TemplateExpression {
    @LstType("org.openrewrite.javascript.tree.JS$TemplateExpression$Value")
    export class Value extends JSMixin(Object) {
        public constructor(id: UUID, prefix: Space, markers: Markers, tree: J, after: Space, enclosedInBraces: boolean) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._tree = tree;
            this._after = after;
            this._enclosedInBraces = enclosedInBraces;
        }

            private readonly _id: UUID;

            public get id(): UUID {
                return this._id;
            }

            public withId(id: UUID): TemplateExpression.Value {
                return id === this._id ? this : new TemplateExpression.Value(id, this._prefix, this._markers, this._tree, this._after, this._enclosedInBraces);
            }

            private readonly _prefix: Space;

            public get prefix(): Space {
                return this._prefix;
            }

            public withPrefix(prefix: Space): TemplateExpression.Value {
                return prefix === this._prefix ? this : new TemplateExpression.Value(this._id, prefix, this._markers, this._tree, this._after, this._enclosedInBraces);
            }

            private readonly _markers: Markers;

            public get markers(): Markers {
                return this._markers;
            }

            public withMarkers(markers: Markers): TemplateExpression.Value {
                return markers === this._markers ? this : new TemplateExpression.Value(this._id, this._prefix, markers, this._tree, this._after, this._enclosedInBraces);
            }

            private readonly _tree: J;

            public get tree(): J {
                return this._tree;
            }

            public withTree(tree: J): TemplateExpression.Value {
                return tree === this._tree ? this : new TemplateExpression.Value(this._id, this._prefix, this._markers, tree, this._after, this._enclosedInBraces);
            }

            private readonly _after: Space;

            public get after(): Space {
                return this._after;
            }

            public withAfter(after: Space): TemplateExpression.Value {
                return after === this._after ? this : new TemplateExpression.Value(this._id, this._prefix, this._markers, this._tree, after, this._enclosedInBraces);
            }

            private readonly _enclosedInBraces: boolean;

            public get enclosedInBraces(): boolean {
                return this._enclosedInBraces;
            }

            public withEnclosedInBraces(enclosedInBraces: boolean): TemplateExpression.Value {
                return enclosedInBraces === this._enclosedInBraces ? this : new TemplateExpression.Value(this._id, this._prefix, this._markers, this._tree, this._after, enclosedInBraces);
            }

        public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
            return v.visitTemplateExpressionValue(this, p);
        }

    }

}

@LstType("org.openrewrite.javascript.tree.JS$Tuple")
export class Tuple extends JSMixin(Object) implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, elements: JContainer<J>, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._elements = elements;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Tuple {
            return id === this._id ? this : new Tuple(id, this._prefix, this._markers, this._elements, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Tuple {
            return prefix === this._prefix ? this : new Tuple(this._id, prefix, this._markers, this._elements, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Tuple {
            return markers === this._markers ? this : new Tuple(this._id, this._prefix, markers, this._elements, this._type);
        }

        private readonly _elements: JContainer<J>;

        public get elements(): J[] {
            return this._elements.elements;
        }

        public withElements(elements: J[]): Tuple {
            return this.padding.withElements(JContainer.withElements(this._elements, elements));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): Tuple {
            return _type === this._type ? this : new Tuple(this._id, this._prefix, this._markers, this._elements, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTuple(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get elements(): JContainer<J> {
                return t._elements;
            }
            public withElements(elements: JContainer<J>): Tuple {
                return t._elements === elements ? t : new Tuple(t._id, t._prefix, t._markers, elements, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$TypeDeclaration")
export class TypeDeclaration extends JSMixin(Object) implements Statement, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, leadingAnnotations: Java.Annotation[], modifiers: Java.Modifier[], name: Java.Identifier, typeParameters: Java.TypeParameters | null, initializer: JLeftPadded<Expression>, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._leadingAnnotations = leadingAnnotations;
        this._modifiers = modifiers;
        this._name = name;
        this._typeParameters = typeParameters;
        this._initializer = initializer;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): TypeDeclaration {
            return id === this._id ? this : new TypeDeclaration(id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._name, this._typeParameters, this._initializer, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TypeDeclaration {
            return prefix === this._prefix ? this : new TypeDeclaration(this._id, prefix, this._markers, this._leadingAnnotations, this._modifiers, this._name, this._typeParameters, this._initializer, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TypeDeclaration {
            return markers === this._markers ? this : new TypeDeclaration(this._id, this._prefix, markers, this._leadingAnnotations, this._modifiers, this._name, this._typeParameters, this._initializer, this._type);
        }

        private readonly _leadingAnnotations: Java.Annotation[];

        public get leadingAnnotations(): Java.Annotation[] {
            return this._leadingAnnotations;
        }

        public withLeadingAnnotations(leadingAnnotations: Java.Annotation[]): TypeDeclaration {
            return leadingAnnotations === this._leadingAnnotations ? this : new TypeDeclaration(this._id, this._prefix, this._markers, leadingAnnotations, this._modifiers, this._name, this._typeParameters, this._initializer, this._type);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): TypeDeclaration {
            return modifiers === this._modifiers ? this : new TypeDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, modifiers, this._name, this._typeParameters, this._initializer, this._type);
        }

        private readonly _name: Java.Identifier;

        public get name(): Java.Identifier {
            return this._name;
        }

        public withName(name: Java.Identifier): TypeDeclaration {
            return name === this._name ? this : new TypeDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, name, this._typeParameters, this._initializer, this._type);
        }

        private readonly _typeParameters: Java.TypeParameters | null;

        public get typeParameters(): Java.TypeParameters | null {
            return this._typeParameters;
        }

        public withTypeParameters(typeParameters: Java.TypeParameters | null): TypeDeclaration {
            return typeParameters === this._typeParameters ? this : new TypeDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._name, typeParameters, this._initializer, this._type);
        }

        private readonly _initializer: JLeftPadded<Expression>;

        public get initializer(): Expression {
            return this._initializer.element;
        }

        public withInitializer(initializer: Expression): TypeDeclaration {
            return this.padding.withInitializer(this._initializer.withElement(initializer));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): TypeDeclaration {
            return _type === this._type ? this : new TypeDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._name, this._typeParameters, this._initializer, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTypeDeclaration(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get initializer(): JLeftPadded<Expression> {
                return t._initializer;
            }
            public withInitializer(initializer: JLeftPadded<Expression>): TypeDeclaration {
                return t._initializer === initializer ? t : new TypeDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._name, t._typeParameters, initializer, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$TypeOf")
export class TypeOf extends JSMixin(Object) implements Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, expression: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._expression = expression;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): TypeOf {
            return id === this._id ? this : new TypeOf(id, this._prefix, this._markers, this._expression, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TypeOf {
            return prefix === this._prefix ? this : new TypeOf(this._id, prefix, this._markers, this._expression, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TypeOf {
            return markers === this._markers ? this : new TypeOf(this._id, this._prefix, markers, this._expression, this._type);
        }

        private readonly _expression: Expression;

        public get expression(): Expression {
            return this._expression;
        }

        public withExpression(expression: Expression): TypeOf {
            return expression === this._expression ? this : new TypeOf(this._id, this._prefix, this._markers, expression, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): TypeOf {
            return _type === this._type ? this : new TypeOf(this._id, this._prefix, this._markers, this._expression, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTypeOf(this, p);
    }

}

@LstType("org.openrewrite.javascript.tree.JS$TypeOperator")
export class TypeOperator extends JSMixin(Object) implements Expression, TypedTree, NameTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, operator: TypeOperator.Type, expression: JLeftPadded<Expression>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._operator = operator;
        this._expression = expression;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): TypeOperator {
            return id === this._id ? this : new TypeOperator(id, this._prefix, this._markers, this._operator, this._expression);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TypeOperator {
            return prefix === this._prefix ? this : new TypeOperator(this._id, prefix, this._markers, this._operator, this._expression);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TypeOperator {
            return markers === this._markers ? this : new TypeOperator(this._id, this._prefix, markers, this._operator, this._expression);
        }

        private readonly _operator: TypeOperator.Type;

        public get operator(): TypeOperator.Type {
            return this._operator;
        }

        public withOperator(operator: TypeOperator.Type): TypeOperator {
            return operator === this._operator ? this : new TypeOperator(this._id, this._prefix, this._markers, operator, this._expression);
        }

        private readonly _expression: JLeftPadded<Expression>;

        public get expression(): Expression {
            return this._expression.element;
        }

        public withExpression(expression: Expression): TypeOperator {
            return this.padding.withExpression(this._expression.withElement(expression));
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTypeOperator(this, p);
    }

    public get type(): JavaType | null {
        return extensions.getJavaType(this);
    }

    public withType(type: JavaType): TypeOperator {
        return extensions.withJavaType(this, type);
    }

    get padding() {
        const t = this;
        return new class {
            public get expression(): JLeftPadded<Expression> {
                return t._expression;
            }
            public withExpression(expression: JLeftPadded<Expression>): TypeOperator {
                return t._expression === expression ? t : new TypeOperator(t._id, t._prefix, t._markers, t._operator, expression);
            }
        }
    }

}

export namespace TypeOperator {
    export enum Type {
            ReadOnly = 0,
            KeyOf = 1,

    }

}

@LstType("org.openrewrite.javascript.tree.JS$Unary")
export class Unary extends JSMixin(Object) implements Statement, Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, operator: JLeftPadded<Unary.Type>, expression: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._operator = operator;
        this._expression = expression;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Unary {
            return id === this._id ? this : new Unary(id, this._prefix, this._markers, this._operator, this._expression, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Unary {
            return prefix === this._prefix ? this : new Unary(this._id, prefix, this._markers, this._operator, this._expression, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Unary {
            return markers === this._markers ? this : new Unary(this._id, this._prefix, markers, this._operator, this._expression, this._type);
        }

        private readonly _operator: JLeftPadded<Unary.Type>;

        public get operator(): Unary.Type {
            return this._operator.element;
        }

        public withOperator(operator: Unary.Type): Unary {
            return this.padding.withOperator(this._operator.withElement(operator));
        }

        private readonly _expression: Expression;

        public get expression(): Expression {
            return this._expression;
        }

        public withExpression(expression: Expression): Unary {
            return expression === this._expression ? this : new Unary(this._id, this._prefix, this._markers, this._operator, expression, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): Unary {
            return _type === this._type ? this : new Unary(this._id, this._prefix, this._markers, this._operator, this._expression, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitJsUnary(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get operator(): JLeftPadded<Unary.Type> {
                return t._operator;
            }
            public withOperator(operator: JLeftPadded<Unary.Type>): Unary {
                return t._operator === operator ? t : new Unary(t._id, t._prefix, t._markers, operator, t._expression, t._type);
            }
        }
    }

}

export namespace Unary {
    export enum Type {
            Spread = 0,

    }

}

@LstType("org.openrewrite.javascript.tree.JS$Union")
export class Union extends JSMixin(Object) implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, types: JRightPadded<Expression>[], _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._types = types;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Union {
            return id === this._id ? this : new Union(id, this._prefix, this._markers, this._types, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Union {
            return prefix === this._prefix ? this : new Union(this._id, prefix, this._markers, this._types, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Union {
            return markers === this._markers ? this : new Union(this._id, this._prefix, markers, this._types, this._type);
        }

        private readonly _types: JRightPadded<Expression>[];

        public get types(): Expression[] {
            return JRightPadded.getElements(this._types);
        }

        public withTypes(types: Expression[]): Union {
            return this.padding.withTypes(JRightPadded.withElements(this._types, types));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): Union {
            return _type === this._type ? this : new Union(this._id, this._prefix, this._markers, this._types, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitUnion(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get types(): JRightPadded<Expression>[] {
                return t._types;
            }
            public withTypes(types: JRightPadded<Expression>[]): Union {
                return t._types === types ? t : new Union(t._id, t._prefix, t._markers, types, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$Void")
export class Void extends JSMixin(Object) implements Expression, Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, expression: Expression) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._expression = expression;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Void {
            return id === this._id ? this : new Void(id, this._prefix, this._markers, this._expression);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Void {
            return prefix === this._prefix ? this : new Void(this._id, prefix, this._markers, this._expression);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Void {
            return markers === this._markers ? this : new Void(this._id, this._prefix, markers, this._expression);
        }

        private readonly _expression: Expression;

        public get expression(): Expression {
            return this._expression;
        }

        public withExpression(expression: Expression): Void {
            return expression === this._expression ? this : new Void(this._id, this._prefix, this._markers, expression);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitVoid(this, p);
    }

    public get type(): JavaType | null {
        return extensions.getJavaType(this);
    }

    public withType(type: JavaType): Void {
        return extensions.withJavaType(this, type);
    }

}
