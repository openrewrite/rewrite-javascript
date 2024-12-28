// noinspection JSUnusedGlobalSymbols

import * as extensions from "./extensions";
import {JS, JSMixin, JsLeftPadded, JsRightPadded, JsContainer, JsSpace} from "./support_types";
import {JavaScriptVisitor} from "../visitor";
import {Checksum, Cursor, FileAttributes, LstType, Markers, PrintOutputCapture, PrinterFactory, SourceFile, SourceFileMixin, Tree, TreeVisitor, UUID} from "../../core";
import {Expression, J, JavaSourceFile, JavaType, JContainer, JLeftPadded, JRightPadded, NameTree, Space, Statement, TypedTree, TypeTree, MethodCall, Loop} from "../../java/tree";
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
    public constructor(id: UUID, prefix: Space, markers: Markers, propertyName: JRightPadded<Java.Identifier>, alias: Expression) {
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

        private readonly _alias: Expression;

        public get alias(): Expression {
            return this._alias;
        }

        public withAlias(alias: Expression): Alias {
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
    public constructor(id: UUID, prefix: Space, markers: Markers, leadingAnnotations: Java.Annotation[], modifiers: Java.Modifier[], typeParameters: Java.TypeParameters | null, parameters: Java.Lambda.Parameters, returnTypeExpression: TypeTree | null, body: JLeftPadded<J>, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._leadingAnnotations = leadingAnnotations;
        this._modifiers = modifiers;
        this._typeParameters = typeParameters;
        this._parameters = parameters;
        this._returnTypeExpression = returnTypeExpression;
        this._body = body;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): ArrowFunction {
            return id === this._id ? this : new ArrowFunction(id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._parameters, this._returnTypeExpression, this._body, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): ArrowFunction {
            return prefix === this._prefix ? this : new ArrowFunction(this._id, prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._parameters, this._returnTypeExpression, this._body, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): ArrowFunction {
            return markers === this._markers ? this : new ArrowFunction(this._id, this._prefix, markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._parameters, this._returnTypeExpression, this._body, this._type);
        }

        private readonly _leadingAnnotations: Java.Annotation[];

        public get leadingAnnotations(): Java.Annotation[] {
            return this._leadingAnnotations;
        }

        public withLeadingAnnotations(leadingAnnotations: Java.Annotation[]): ArrowFunction {
            return leadingAnnotations === this._leadingAnnotations ? this : new ArrowFunction(this._id, this._prefix, this._markers, leadingAnnotations, this._modifiers, this._typeParameters, this._parameters, this._returnTypeExpression, this._body, this._type);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): ArrowFunction {
            return modifiers === this._modifiers ? this : new ArrowFunction(this._id, this._prefix, this._markers, this._leadingAnnotations, modifiers, this._typeParameters, this._parameters, this._returnTypeExpression, this._body, this._type);
        }

        private readonly _typeParameters: Java.TypeParameters | null;

        public get typeParameters(): Java.TypeParameters | null {
            return this._typeParameters;
        }

        public withTypeParameters(typeParameters: Java.TypeParameters | null): ArrowFunction {
            return typeParameters === this._typeParameters ? this : new ArrowFunction(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, typeParameters, this._parameters, this._returnTypeExpression, this._body, this._type);
        }

        private readonly _parameters: Java.Lambda.Parameters;

        public get parameters(): Java.Lambda.Parameters {
            return this._parameters;
        }

        public withParameters(parameters: Java.Lambda.Parameters): ArrowFunction {
            return parameters === this._parameters ? this : new ArrowFunction(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, parameters, this._returnTypeExpression, this._body, this._type);
        }

        private readonly _returnTypeExpression: TypeTree | null;

        public get returnTypeExpression(): TypeTree | null {
            return this._returnTypeExpression;
        }

        public withReturnTypeExpression(returnTypeExpression: TypeTree | null): ArrowFunction {
            return returnTypeExpression === this._returnTypeExpression ? this : new ArrowFunction(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._parameters, returnTypeExpression, this._body, this._type);
        }

        private readonly _body: JLeftPadded<J>;

        public get body(): J {
            return this._body.element;
        }

        public withBody(body: J): ArrowFunction {
            return this.padding.withBody(this._body.withElement(body));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): ArrowFunction {
            return _type === this._type ? this : new ArrowFunction(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._parameters, this._returnTypeExpression, this._body, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitArrowFunction(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get body(): JLeftPadded<J> {
                return t._body;
            }
            public withBody(body: JLeftPadded<J>): ArrowFunction {
                return t._body === body ? t : new ArrowFunction(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeParameters, t._parameters, t._returnTypeExpression, body, t._type);
            }
        }
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

@LstType("org.openrewrite.javascript.tree.JS$ConditionalType")
export class ConditionalType extends JSMixin(Object) implements TypeTree, Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, checkType: Expression, condition: JContainer<TypedTree>, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._checkType = checkType;
        this._condition = condition;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): ConditionalType {
            return id === this._id ? this : new ConditionalType(id, this._prefix, this._markers, this._checkType, this._condition, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): ConditionalType {
            return prefix === this._prefix ? this : new ConditionalType(this._id, prefix, this._markers, this._checkType, this._condition, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): ConditionalType {
            return markers === this._markers ? this : new ConditionalType(this._id, this._prefix, markers, this._checkType, this._condition, this._type);
        }

        private readonly _checkType: Expression;

        public get checkType(): Expression {
            return this._checkType;
        }

        public withCheckType(checkType: Expression): ConditionalType {
            return checkType === this._checkType ? this : new ConditionalType(this._id, this._prefix, this._markers, checkType, this._condition, this._type);
        }

        private readonly _condition: JContainer<TypedTree>;

        public get condition(): TypedTree[] {
            return this._condition.elements;
        }

        public withCondition(condition: TypedTree[]): ConditionalType {
            return this.padding.withCondition(JContainer.withElements(this._condition, condition));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): ConditionalType {
            return _type === this._type ? this : new ConditionalType(this._id, this._prefix, this._markers, this._checkType, this._condition, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitConditionalType(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get condition(): JContainer<TypedTree> {
                return t._condition;
            }
            public withCondition(condition: JContainer<TypedTree>): ConditionalType {
                return t._condition === condition ? t : new ConditionalType(t._id, t._prefix, t._markers, t._checkType, condition, t._type);
            }
        }
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

@LstType("org.openrewrite.javascript.tree.JS$TrailingTokenStatement")
export class TrailingTokenStatement extends JSMixin(Object) implements Expression, Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, expression: JRightPadded<J>, _type: JavaType | null) {
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

        public withId(id: UUID): TrailingTokenStatement {
            return id === this._id ? this : new TrailingTokenStatement(id, this._prefix, this._markers, this._expression, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TrailingTokenStatement {
            return prefix === this._prefix ? this : new TrailingTokenStatement(this._id, prefix, this._markers, this._expression, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TrailingTokenStatement {
            return markers === this._markers ? this : new TrailingTokenStatement(this._id, this._prefix, markers, this._expression, this._type);
        }

        private readonly _expression: JRightPadded<J>;

        public get expression(): J {
            return this._expression.element;
        }

        public withExpression(expression: J): TrailingTokenStatement {
            return this.padding.withExpression(this._expression.withElement(expression));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): TrailingTokenStatement {
            return _type === this._type ? this : new TrailingTokenStatement(this._id, this._prefix, this._markers, this._expression, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTrailingTokenStatement(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get expression(): JRightPadded<J> {
                return t._expression;
            }
            public withExpression(expression: JRightPadded<J>): TrailingTokenStatement {
                return t._expression === expression ? t : new TrailingTokenStatement(t._id, t._prefix, t._markers, expression, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$ExpressionWithTypeArguments")
export class ExpressionWithTypeArguments extends JSMixin(Object) implements TypeTree, Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, clazz: J, typeArguments: JContainer<Expression> | null, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._clazz = clazz;
        this._typeArguments = typeArguments;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): ExpressionWithTypeArguments {
            return id === this._id ? this : new ExpressionWithTypeArguments(id, this._prefix, this._markers, this._clazz, this._typeArguments, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): ExpressionWithTypeArguments {
            return prefix === this._prefix ? this : new ExpressionWithTypeArguments(this._id, prefix, this._markers, this._clazz, this._typeArguments, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): ExpressionWithTypeArguments {
            return markers === this._markers ? this : new ExpressionWithTypeArguments(this._id, this._prefix, markers, this._clazz, this._typeArguments, this._type);
        }

        private readonly _clazz: J;

        public get clazz(): J {
            return this._clazz;
        }

        public withClazz(clazz: J): ExpressionWithTypeArguments {
            return clazz === this._clazz ? this : new ExpressionWithTypeArguments(this._id, this._prefix, this._markers, clazz, this._typeArguments, this._type);
        }

        private readonly _typeArguments: JContainer<Expression> | null;

        public get typeArguments(): Expression[] | null {
            return this._typeArguments === null ? null : this._typeArguments.elements;
        }

        public withTypeArguments(typeArguments: Expression[] | null): ExpressionWithTypeArguments {
            return this.padding.withTypeArguments(JContainer.withElementsNullable(this._typeArguments, typeArguments));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): ExpressionWithTypeArguments {
            return _type === this._type ? this : new ExpressionWithTypeArguments(this._id, this._prefix, this._markers, this._clazz, this._typeArguments, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitExpressionWithTypeArguments(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get typeArguments(): JContainer<Expression> | null {
                return t._typeArguments;
            }
            public withTypeArguments(typeArguments: JContainer<Expression> | null): ExpressionWithTypeArguments {
                return t._typeArguments === typeArguments ? t : new ExpressionWithTypeArguments(t._id, t._prefix, t._markers, t._clazz, typeArguments, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$FunctionType")
export class FunctionType extends JSMixin(Object) implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, modifiers: Java.Modifier[], constructorType: JLeftPadded<boolean>, typeParameters: Java.TypeParameters | null, parameters: JContainer<Statement>, arrow: Space, returnType: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._modifiers = modifiers;
        this._constructorType = constructorType;
        this._typeParameters = typeParameters;
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
            return id === this._id ? this : new FunctionType(id, this._prefix, this._markers, this._modifiers, this._constructorType, this._typeParameters, this._parameters, this._arrow, this._returnType, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): FunctionType {
            return prefix === this._prefix ? this : new FunctionType(this._id, prefix, this._markers, this._modifiers, this._constructorType, this._typeParameters, this._parameters, this._arrow, this._returnType, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): FunctionType {
            return markers === this._markers ? this : new FunctionType(this._id, this._prefix, markers, this._modifiers, this._constructorType, this._typeParameters, this._parameters, this._arrow, this._returnType, this._type);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): FunctionType {
            return modifiers === this._modifiers ? this : new FunctionType(this._id, this._prefix, this._markers, modifiers, this._constructorType, this._typeParameters, this._parameters, this._arrow, this._returnType, this._type);
        }

        private readonly _constructorType: JLeftPadded<boolean>;

        public get constructorType(): boolean {
            return this._constructorType.element;
        }

        public withConstructorType(constructorType: boolean): FunctionType {
            return this.padding.withConstructorType(this._constructorType.withElement(constructorType));
        }

        private readonly _typeParameters: Java.TypeParameters | null;

        public get typeParameters(): Java.TypeParameters | null {
            return this._typeParameters;
        }

        public withTypeParameters(typeParameters: Java.TypeParameters | null): FunctionType {
            return typeParameters === this._typeParameters ? this : new FunctionType(this._id, this._prefix, this._markers, this._modifiers, this._constructorType, typeParameters, this._parameters, this._arrow, this._returnType, this._type);
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
            return arrow === this._arrow ? this : new FunctionType(this._id, this._prefix, this._markers, this._modifiers, this._constructorType, this._typeParameters, this._parameters, arrow, this._returnType, this._type);
        }

        private readonly _returnType: Expression;

        public get returnType(): Expression {
            return this._returnType;
        }

        public withReturnType(returnType: Expression): FunctionType {
            return returnType === this._returnType ? this : new FunctionType(this._id, this._prefix, this._markers, this._modifiers, this._constructorType, this._typeParameters, this._parameters, this._arrow, returnType, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): FunctionType {
            return _type === this._type ? this : new FunctionType(this._id, this._prefix, this._markers, this._modifiers, this._constructorType, this._typeParameters, this._parameters, this._arrow, this._returnType, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitFunctionType(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get constructorType(): JLeftPadded<boolean> {
                return t._constructorType;
            }
            public withConstructorType(constructorType: JLeftPadded<boolean>): FunctionType {
                return t._constructorType === constructorType ? t : new FunctionType(t._id, t._prefix, t._markers, t._modifiers, constructorType, t._typeParameters, t._parameters, t._arrow, t._returnType, t._type);
            }
            public get parameters(): JContainer<Statement> {
                return t._parameters;
            }
            public withParameters(parameters: JContainer<Statement>): FunctionType {
                return t._parameters === parameters ? t : new FunctionType(t._id, t._prefix, t._markers, t._modifiers, t._constructorType, t._typeParameters, parameters, t._arrow, t._returnType, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$InferType")
export class InferType extends JSMixin(Object) implements TypeTree, Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, typeParameter: JLeftPadded<J>, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._typeParameter = typeParameter;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): InferType {
            return id === this._id ? this : new InferType(id, this._prefix, this._markers, this._typeParameter, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): InferType {
            return prefix === this._prefix ? this : new InferType(this._id, prefix, this._markers, this._typeParameter, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): InferType {
            return markers === this._markers ? this : new InferType(this._id, this._prefix, markers, this._typeParameter, this._type);
        }

        private readonly _typeParameter: JLeftPadded<J>;

        public get typeParameter(): J {
            return this._typeParameter.element;
        }

        public withTypeParameter(typeParameter: J): InferType {
            return this.padding.withTypeParameter(this._typeParameter.withElement(typeParameter));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): InferType {
            return _type === this._type ? this : new InferType(this._id, this._prefix, this._markers, this._typeParameter, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitInferType(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get typeParameter(): JLeftPadded<J> {
                return t._typeParameter;
            }
            public withTypeParameter(typeParameter: JLeftPadded<J>): InferType {
                return t._typeParameter === typeParameter ? t : new InferType(t._id, t._prefix, t._markers, typeParameter, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$ImportType")
export class ImportType extends JSMixin(Object) implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, hasTypeof: JRightPadded<boolean>, importArgument: Java.ParenthesizedTypeTree, qualifier: JLeftPadded<Expression> | null, typeArguments: JContainer<Expression> | null, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._hasTypeof = hasTypeof;
        this._importArgument = importArgument;
        this._qualifier = qualifier;
        this._typeArguments = typeArguments;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): ImportType {
            return id === this._id ? this : new ImportType(id, this._prefix, this._markers, this._hasTypeof, this._importArgument, this._qualifier, this._typeArguments, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): ImportType {
            return prefix === this._prefix ? this : new ImportType(this._id, prefix, this._markers, this._hasTypeof, this._importArgument, this._qualifier, this._typeArguments, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): ImportType {
            return markers === this._markers ? this : new ImportType(this._id, this._prefix, markers, this._hasTypeof, this._importArgument, this._qualifier, this._typeArguments, this._type);
        }

        private readonly _hasTypeof: JRightPadded<boolean>;

        public get hasTypeof(): boolean {
            return this._hasTypeof.element;
        }

        public withHasTypeof(hasTypeof: boolean): ImportType {
            return this.padding.withHasTypeof(this._hasTypeof.withElement(hasTypeof));
        }

        private readonly _importArgument: Java.ParenthesizedTypeTree;

        public get importArgument(): Java.ParenthesizedTypeTree {
            return this._importArgument;
        }

        public withImportArgument(importArgument: Java.ParenthesizedTypeTree): ImportType {
            return importArgument === this._importArgument ? this : new ImportType(this._id, this._prefix, this._markers, this._hasTypeof, importArgument, this._qualifier, this._typeArguments, this._type);
        }

        private readonly _qualifier: JLeftPadded<Expression> | null;

        public get qualifier(): Expression | null {
            return this._qualifier === null ? null : this._qualifier.element;
        }

        public withQualifier(qualifier: Expression | null): ImportType {
            return this.padding.withQualifier(JLeftPadded.withElement(this._qualifier, qualifier));
        }

        private readonly _typeArguments: JContainer<Expression> | null;

        public get typeArguments(): Expression[] | null {
            return this._typeArguments === null ? null : this._typeArguments.elements;
        }

        public withTypeArguments(typeArguments: Expression[] | null): ImportType {
            return this.padding.withTypeArguments(JContainer.withElementsNullable(this._typeArguments, typeArguments));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): ImportType {
            return _type === this._type ? this : new ImportType(this._id, this._prefix, this._markers, this._hasTypeof, this._importArgument, this._qualifier, this._typeArguments, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitImportType(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get hasTypeof(): JRightPadded<boolean> {
                return t._hasTypeof;
            }
            public withHasTypeof(hasTypeof: JRightPadded<boolean>): ImportType {
                return t._hasTypeof === hasTypeof ? t : new ImportType(t._id, t._prefix, t._markers, hasTypeof, t._importArgument, t._qualifier, t._typeArguments, t._type);
            }
            public get qualifier(): JLeftPadded<Expression> | null {
                return t._qualifier;
            }
            public withQualifier(qualifier: JLeftPadded<Expression> | null): ImportType {
                return t._qualifier === qualifier ? t : new ImportType(t._id, t._prefix, t._markers, t._hasTypeof, t._importArgument, qualifier, t._typeArguments, t._type);
            }
            public get typeArguments(): JContainer<Expression> | null {
                return t._typeArguments;
            }
            public withTypeArguments(typeArguments: JContainer<Expression> | null): ImportType {
                return t._typeArguments === typeArguments ? t : new ImportType(t._id, t._prefix, t._markers, t._hasTypeof, t._importArgument, t._qualifier, typeArguments, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$JsImport")
export class JsImport extends JSMixin(Object) implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, name: JRightPadded<Java.Identifier> | null, importType: JLeftPadded<boolean>, imports: JContainer<Expression> | null, _from: Space | null, target: Java.Literal | null, initializer: JLeftPadded<Expression> | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._name = name;
        this._importType = importType;
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
            return id === this._id ? this : new JsImport(id, this._prefix, this._markers, this._name, this._importType, this._imports, this._from, this._target, this._initializer);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): JsImport {
            return prefix === this._prefix ? this : new JsImport(this._id, prefix, this._markers, this._name, this._importType, this._imports, this._from, this._target, this._initializer);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): JsImport {
            return markers === this._markers ? this : new JsImport(this._id, this._prefix, markers, this._name, this._importType, this._imports, this._from, this._target, this._initializer);
        }

        private readonly _name: JRightPadded<Java.Identifier> | null;

        public get name(): Java.Identifier | null {
            return this._name === null ? null : this._name.element;
        }

        public withName(name: Java.Identifier | null): JsImport {
            return this.padding.withName(JRightPadded.withElement(this._name, name));
        }

        private readonly _importType: JLeftPadded<boolean>;

        public get importType(): boolean {
            return this._importType.element;
        }

        public withImportType(importType: boolean): JsImport {
            return this.padding.withImportType(this._importType.withElement(importType));
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
            return _from === this._from ? this : new JsImport(this._id, this._prefix, this._markers, this._name, this._importType, this._imports, _from, this._target, this._initializer);
        }

        private readonly _target: Java.Literal | null;

        public get target(): Java.Literal | null {
            return this._target;
        }

        public withTarget(target: Java.Literal | null): JsImport {
            return target === this._target ? this : new JsImport(this._id, this._prefix, this._markers, this._name, this._importType, this._imports, this._from, target, this._initializer);
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
                return t._name === name ? t : new JsImport(t._id, t._prefix, t._markers, name, t._importType, t._imports, t._from, t._target, t._initializer);
            }
            public get importType(): JLeftPadded<boolean> {
                return t._importType;
            }
            public withImportType(importType: JLeftPadded<boolean>): JsImport {
                return t._importType === importType ? t : new JsImport(t._id, t._prefix, t._markers, t._name, importType, t._imports, t._from, t._target, t._initializer);
            }
            public get imports(): JContainer<Expression> | null {
                return t._imports;
            }
            public withImports(imports: JContainer<Expression> | null): JsImport {
                return t._imports === imports ? t : new JsImport(t._id, t._prefix, t._markers, t._name, t._importType, imports, t._from, t._target, t._initializer);
            }
            public get initializer(): JLeftPadded<Expression> | null {
                return t._initializer;
            }
            public withInitializer(initializer: JLeftPadded<Expression> | null): JsImport {
                return t._initializer === initializer ? t : new JsImport(t._id, t._prefix, t._markers, t._name, t._importType, t._imports, t._from, t._target, initializer);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$JsImportSpecifier")
export class JsImportSpecifier extends JSMixin(Object) implements Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, importType: JLeftPadded<boolean>, specifier: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._importType = importType;
        this._specifier = specifier;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): JsImportSpecifier {
            return id === this._id ? this : new JsImportSpecifier(id, this._prefix, this._markers, this._importType, this._specifier, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): JsImportSpecifier {
            return prefix === this._prefix ? this : new JsImportSpecifier(this._id, prefix, this._markers, this._importType, this._specifier, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): JsImportSpecifier {
            return markers === this._markers ? this : new JsImportSpecifier(this._id, this._prefix, markers, this._importType, this._specifier, this._type);
        }

        private readonly _importType: JLeftPadded<boolean>;

        public get importType(): boolean {
            return this._importType.element;
        }

        public withImportType(importType: boolean): JsImportSpecifier {
            return this.padding.withImportType(this._importType.withElement(importType));
        }

        private readonly _specifier: Expression;

        public get specifier(): Expression {
            return this._specifier;
        }

        public withSpecifier(specifier: Expression): JsImportSpecifier {
            return specifier === this._specifier ? this : new JsImportSpecifier(this._id, this._prefix, this._markers, this._importType, specifier, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): JsImportSpecifier {
            return _type === this._type ? this : new JsImportSpecifier(this._id, this._prefix, this._markers, this._importType, this._specifier, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitJsImportSpecifier(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get importType(): JLeftPadded<boolean> {
                return t._importType;
            }
            public withImportType(importType: JLeftPadded<boolean>): JsImportSpecifier {
                return t._importType === importType ? t : new JsImportSpecifier(t._id, t._prefix, t._markers, importType, t._specifier, t._type);
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
            QuestionQuestion = 4,
            Comma = 5,

    }

}

@LstType("org.openrewrite.javascript.tree.JS$LiteralType")
export class LiteralType extends JSMixin(Object) implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, literal: Expression, _type: JavaType) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._literal = literal;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): LiteralType {
            return id === this._id ? this : new LiteralType(id, this._prefix, this._markers, this._literal, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): LiteralType {
            return prefix === this._prefix ? this : new LiteralType(this._id, prefix, this._markers, this._literal, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): LiteralType {
            return markers === this._markers ? this : new LiteralType(this._id, this._prefix, markers, this._literal, this._type);
        }

        private readonly _literal: Expression;

        public get literal(): Expression {
            return this._literal;
        }

        public withLiteral(literal: Expression): LiteralType {
            return literal === this._literal ? this : new LiteralType(this._id, this._prefix, this._markers, literal, this._type);
        }

        private readonly _type: JavaType;

        public get type(): JavaType {
            return this._type;
        }

        public withType(_type: JavaType): LiteralType {
            return _type === this._type ? this : new LiteralType(this._id, this._prefix, this._markers, this._literal, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitLiteralType(this, p);
    }

}

@LstType("org.openrewrite.javascript.tree.JS$MappedType")
export class MappedType extends JSMixin(Object) implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, prefixToken: JLeftPadded<Java.Literal> | null, hasReadonly: JLeftPadded<boolean>, keysRemapping: MappedType.KeysRemapping, suffixToken: JLeftPadded<Java.Literal> | null, hasQuestionToken: JLeftPadded<boolean>, valueType: JContainer<TypeTree>, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._prefixToken = prefixToken;
        this._hasReadonly = hasReadonly;
        this._keysRemapping = keysRemapping;
        this._suffixToken = suffixToken;
        this._hasQuestionToken = hasQuestionToken;
        this._valueType = valueType;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): MappedType {
            return id === this._id ? this : new MappedType(id, this._prefix, this._markers, this._prefixToken, this._hasReadonly, this._keysRemapping, this._suffixToken, this._hasQuestionToken, this._valueType, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): MappedType {
            return prefix === this._prefix ? this : new MappedType(this._id, prefix, this._markers, this._prefixToken, this._hasReadonly, this._keysRemapping, this._suffixToken, this._hasQuestionToken, this._valueType, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): MappedType {
            return markers === this._markers ? this : new MappedType(this._id, this._prefix, markers, this._prefixToken, this._hasReadonly, this._keysRemapping, this._suffixToken, this._hasQuestionToken, this._valueType, this._type);
        }

        private readonly _prefixToken: JLeftPadded<Java.Literal> | null;

        public get prefixToken(): Java.Literal | null {
            return this._prefixToken === null ? null : this._prefixToken.element;
        }

        public withPrefixToken(prefixToken: Java.Literal | null): MappedType {
            return this.padding.withPrefixToken(JLeftPadded.withElement(this._prefixToken, prefixToken));
        }

        private readonly _hasReadonly: JLeftPadded<boolean>;

        public get hasReadonly(): boolean {
            return this._hasReadonly.element;
        }

        public withHasReadonly(hasReadonly: boolean): MappedType {
            return this.padding.withHasReadonly(this._hasReadonly.withElement(hasReadonly));
        }

        private readonly _keysRemapping: MappedType.KeysRemapping;

        public get keysRemapping(): MappedType.KeysRemapping {
            return this._keysRemapping;
        }

        public withKeysRemapping(keysRemapping: MappedType.KeysRemapping): MappedType {
            return keysRemapping === this._keysRemapping ? this : new MappedType(this._id, this._prefix, this._markers, this._prefixToken, this._hasReadonly, keysRemapping, this._suffixToken, this._hasQuestionToken, this._valueType, this._type);
        }

        private readonly _suffixToken: JLeftPadded<Java.Literal> | null;

        public get suffixToken(): Java.Literal | null {
            return this._suffixToken === null ? null : this._suffixToken.element;
        }

        public withSuffixToken(suffixToken: Java.Literal | null): MappedType {
            return this.padding.withSuffixToken(JLeftPadded.withElement(this._suffixToken, suffixToken));
        }

        private readonly _hasQuestionToken: JLeftPadded<boolean>;

        public get hasQuestionToken(): boolean {
            return this._hasQuestionToken.element;
        }

        public withHasQuestionToken(hasQuestionToken: boolean): MappedType {
            return this.padding.withHasQuestionToken(this._hasQuestionToken.withElement(hasQuestionToken));
        }

        private readonly _valueType: JContainer<TypeTree>;

        public get valueType(): TypeTree[] {
            return this._valueType.elements;
        }

        public withValueType(valueType: TypeTree[]): MappedType {
            return this.padding.withValueType(JContainer.withElements(this._valueType, valueType));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): MappedType {
            return _type === this._type ? this : new MappedType(this._id, this._prefix, this._markers, this._prefixToken, this._hasReadonly, this._keysRemapping, this._suffixToken, this._hasQuestionToken, this._valueType, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitMappedType(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get prefixToken(): JLeftPadded<Java.Literal> | null {
                return t._prefixToken;
            }
            public withPrefixToken(prefixToken: JLeftPadded<Java.Literal> | null): MappedType {
                return t._prefixToken === prefixToken ? t : new MappedType(t._id, t._prefix, t._markers, prefixToken, t._hasReadonly, t._keysRemapping, t._suffixToken, t._hasQuestionToken, t._valueType, t._type);
            }
            public get hasReadonly(): JLeftPadded<boolean> {
                return t._hasReadonly;
            }
            public withHasReadonly(hasReadonly: JLeftPadded<boolean>): MappedType {
                return t._hasReadonly === hasReadonly ? t : new MappedType(t._id, t._prefix, t._markers, t._prefixToken, hasReadonly, t._keysRemapping, t._suffixToken, t._hasQuestionToken, t._valueType, t._type);
            }
            public get suffixToken(): JLeftPadded<Java.Literal> | null {
                return t._suffixToken;
            }
            public withSuffixToken(suffixToken: JLeftPadded<Java.Literal> | null): MappedType {
                return t._suffixToken === suffixToken ? t : new MappedType(t._id, t._prefix, t._markers, t._prefixToken, t._hasReadonly, t._keysRemapping, suffixToken, t._hasQuestionToken, t._valueType, t._type);
            }
            public get hasQuestionToken(): JLeftPadded<boolean> {
                return t._hasQuestionToken;
            }
            public withHasQuestionToken(hasQuestionToken: JLeftPadded<boolean>): MappedType {
                return t._hasQuestionToken === hasQuestionToken ? t : new MappedType(t._id, t._prefix, t._markers, t._prefixToken, t._hasReadonly, t._keysRemapping, t._suffixToken, hasQuestionToken, t._valueType, t._type);
            }
            public get valueType(): JContainer<TypeTree> {
                return t._valueType;
            }
            public withValueType(valueType: JContainer<TypeTree>): MappedType {
                return t._valueType === valueType ? t : new MappedType(t._id, t._prefix, t._markers, t._prefixToken, t._hasReadonly, t._keysRemapping, t._suffixToken, t._hasQuestionToken, valueType, t._type);
            }
        }
    }

}

export namespace MappedType {
    @LstType("org.openrewrite.javascript.tree.JS$MappedType$KeysRemapping")
    export class KeysRemapping extends JSMixin(Object) implements Statement {
        public constructor(id: UUID, prefix: Space, markers: Markers, typeParameter: JRightPadded<MappedType.MappedTypeParameter>, nameType: JRightPadded<Expression> | null) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._typeParameter = typeParameter;
            this._nameType = nameType;
        }

            private readonly _id: UUID;

            public get id(): UUID {
                return this._id;
            }

            public withId(id: UUID): MappedType.KeysRemapping {
                return id === this._id ? this : new MappedType.KeysRemapping(id, this._prefix, this._markers, this._typeParameter, this._nameType);
            }

            private readonly _prefix: Space;

            public get prefix(): Space {
                return this._prefix;
            }

            public withPrefix(prefix: Space): MappedType.KeysRemapping {
                return prefix === this._prefix ? this : new MappedType.KeysRemapping(this._id, prefix, this._markers, this._typeParameter, this._nameType);
            }

            private readonly _markers: Markers;

            public get markers(): Markers {
                return this._markers;
            }

            public withMarkers(markers: Markers): MappedType.KeysRemapping {
                return markers === this._markers ? this : new MappedType.KeysRemapping(this._id, this._prefix, markers, this._typeParameter, this._nameType);
            }

            private readonly _typeParameter: JRightPadded<MappedType.MappedTypeParameter>;

            public get typeParameter(): MappedType.MappedTypeParameter {
                return this._typeParameter.element;
            }

            public withTypeParameter(typeParameter: MappedType.MappedTypeParameter): MappedType.KeysRemapping {
                return this.padding.withTypeParameter(this._typeParameter.withElement(typeParameter));
            }

            private readonly _nameType: JRightPadded<Expression> | null;

            public get nameType(): Expression | null {
                return this._nameType === null ? null : this._nameType.element;
            }

            public withNameType(nameType: Expression | null): MappedType.KeysRemapping {
                return this.padding.withNameType(JRightPadded.withElement(this._nameType, nameType));
            }

        public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
            return v.visitMappedTypeKeysRemapping(this, p);
        }

        get padding() {
            const t = this;
            return new class {
                public get typeParameter(): JRightPadded<MappedType.MappedTypeParameter> {
                    return t._typeParameter;
                }
                public withTypeParameter(typeParameter: JRightPadded<MappedType.MappedTypeParameter>): MappedType.KeysRemapping {
                    return t._typeParameter === typeParameter ? t : new MappedType.KeysRemapping(t._id, t._prefix, t._markers, typeParameter, t._nameType);
                }
                public get nameType(): JRightPadded<Expression> | null {
                    return t._nameType;
                }
                public withNameType(nameType: JRightPadded<Expression> | null): MappedType.KeysRemapping {
                    return t._nameType === nameType ? t : new MappedType.KeysRemapping(t._id, t._prefix, t._markers, t._typeParameter, nameType);
                }
            }
        }

    }

    @LstType("org.openrewrite.javascript.tree.JS$MappedType$MappedTypeParameter")
    export class MappedTypeParameter extends JSMixin(Object) implements Statement {
        public constructor(id: UUID, prefix: Space, markers: Markers, name: Expression, iterateType: JLeftPadded<TypeTree>) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._name = name;
            this._iterateType = iterateType;
        }

            private readonly _id: UUID;

            public get id(): UUID {
                return this._id;
            }

            public withId(id: UUID): MappedType.MappedTypeParameter {
                return id === this._id ? this : new MappedType.MappedTypeParameter(id, this._prefix, this._markers, this._name, this._iterateType);
            }

            private readonly _prefix: Space;

            public get prefix(): Space {
                return this._prefix;
            }

            public withPrefix(prefix: Space): MappedType.MappedTypeParameter {
                return prefix === this._prefix ? this : new MappedType.MappedTypeParameter(this._id, prefix, this._markers, this._name, this._iterateType);
            }

            private readonly _markers: Markers;

            public get markers(): Markers {
                return this._markers;
            }

            public withMarkers(markers: Markers): MappedType.MappedTypeParameter {
                return markers === this._markers ? this : new MappedType.MappedTypeParameter(this._id, this._prefix, markers, this._name, this._iterateType);
            }

            private readonly _name: Expression;

            public get name(): Expression {
                return this._name;
            }

            public withName(name: Expression): MappedType.MappedTypeParameter {
                return name === this._name ? this : new MappedType.MappedTypeParameter(this._id, this._prefix, this._markers, name, this._iterateType);
            }

            private readonly _iterateType: JLeftPadded<TypeTree>;

            public get iterateType(): TypeTree {
                return this._iterateType.element;
            }

            public withIterateType(iterateType: TypeTree): MappedType.MappedTypeParameter {
                return this.padding.withIterateType(this._iterateType.withElement(iterateType));
            }

        public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
            return v.visitMappedTypeMappedTypeParameter(this, p);
        }

        get padding() {
            const t = this;
            return new class {
                public get iterateType(): JLeftPadded<TypeTree> {
                    return t._iterateType;
                }
                public withIterateType(iterateType: JLeftPadded<TypeTree>): MappedType.MappedTypeParameter {
                    return t._iterateType === iterateType ? t : new MappedType.MappedTypeParameter(t._id, t._prefix, t._markers, t._name, iterateType);
                }
            }
        }

    }

}

@LstType("org.openrewrite.javascript.tree.JS$ObjectBindingDeclarations")
export class ObjectBindingDeclarations extends JSMixin(Object) implements Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, leadingAnnotations: Java.Annotation[], modifiers: Java.Modifier[], typeExpression: TypeTree | null, bindings: JContainer<J>, initializer: JLeftPadded<Expression> | null) {
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

        private readonly _bindings: JContainer<J>;

        public get bindings(): J[] {
            return this._bindings.elements;
        }

        public withBindings(bindings: J[]): ObjectBindingDeclarations {
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
            public get bindings(): JContainer<J> {
                return t._bindings;
            }
            public withBindings(bindings: JContainer<J>): ObjectBindingDeclarations {
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

@LstType("org.openrewrite.javascript.tree.JS$PropertyAssignment")
export class PropertyAssignment extends JSMixin(Object) implements Statement, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, name: JRightPadded<Expression>, assigmentToken: PropertyAssignment.AssigmentToken, initializer: Expression | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._name = name;
        this._assigmentToken = assigmentToken;
        this._initializer = initializer;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): PropertyAssignment {
            return id === this._id ? this : new PropertyAssignment(id, this._prefix, this._markers, this._name, this._assigmentToken, this._initializer);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): PropertyAssignment {
            return prefix === this._prefix ? this : new PropertyAssignment(this._id, prefix, this._markers, this._name, this._assigmentToken, this._initializer);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): PropertyAssignment {
            return markers === this._markers ? this : new PropertyAssignment(this._id, this._prefix, markers, this._name, this._assigmentToken, this._initializer);
        }

        private readonly _name: JRightPadded<Expression>;

        public get name(): Expression {
            return this._name.element;
        }

        public withName(name: Expression): PropertyAssignment {
            return this.padding.withName(this._name.withElement(name));
        }

        private readonly _assigmentToken: PropertyAssignment.AssigmentToken;

        public get assigmentToken(): PropertyAssignment.AssigmentToken {
            return this._assigmentToken;
        }

        public withAssigmentToken(assigmentToken: PropertyAssignment.AssigmentToken): PropertyAssignment {
            return assigmentToken === this._assigmentToken ? this : new PropertyAssignment(this._id, this._prefix, this._markers, this._name, assigmentToken, this._initializer);
        }

        private readonly _initializer: Expression | null;

        public get initializer(): Expression | null {
            return this._initializer;
        }

        public withInitializer(initializer: Expression | null): PropertyAssignment {
            return initializer === this._initializer ? this : new PropertyAssignment(this._id, this._prefix, this._markers, this._name, this._assigmentToken, initializer);
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
                return t._name === name ? t : new PropertyAssignment(t._id, t._prefix, t._markers, name, t._assigmentToken, t._initializer);
            }
        }
    }

}

export namespace PropertyAssignment {
    export enum AssigmentToken {
            Colon = 0,
            Equals = 1,
            Empty = 2,

    }

}

@LstType("org.openrewrite.javascript.tree.JS$SatisfiesExpression")
export class SatisfiesExpression extends JSMixin(Object) implements Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, expression: J, satisfiesType: JLeftPadded<Expression>, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._expression = expression;
        this._satisfiesType = satisfiesType;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): SatisfiesExpression {
            return id === this._id ? this : new SatisfiesExpression(id, this._prefix, this._markers, this._expression, this._satisfiesType, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): SatisfiesExpression {
            return prefix === this._prefix ? this : new SatisfiesExpression(this._id, prefix, this._markers, this._expression, this._satisfiesType, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): SatisfiesExpression {
            return markers === this._markers ? this : new SatisfiesExpression(this._id, this._prefix, markers, this._expression, this._satisfiesType, this._type);
        }

        private readonly _expression: J;

        public get expression(): J {
            return this._expression;
        }

        public withExpression(expression: J): SatisfiesExpression {
            return expression === this._expression ? this : new SatisfiesExpression(this._id, this._prefix, this._markers, expression, this._satisfiesType, this._type);
        }

        private readonly _satisfiesType: JLeftPadded<Expression>;

        public get satisfiesType(): Expression {
            return this._satisfiesType.element;
        }

        public withSatisfiesType(satisfiesType: Expression): SatisfiesExpression {
            return this.padding.withSatisfiesType(this._satisfiesType.withElement(satisfiesType));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): SatisfiesExpression {
            return _type === this._type ? this : new SatisfiesExpression(this._id, this._prefix, this._markers, this._expression, this._satisfiesType, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitSatisfiesExpression(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get satisfiesType(): JLeftPadded<Expression> {
                return t._satisfiesType;
            }
            public withSatisfiesType(satisfiesType: JLeftPadded<Expression>): SatisfiesExpression {
                return t._satisfiesType === satisfiesType ? t : new SatisfiesExpression(t._id, t._prefix, t._markers, t._expression, satisfiesType, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$ScopedVariableDeclarations")
export class ScopedVariableDeclarations extends JSMixin(Object) implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, modifiers: Java.Modifier[], scope: JLeftPadded<ScopedVariableDeclarations.Scope> | null, variables: JRightPadded<J>[]) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._modifiers = modifiers;
        this._scope = scope;
        this._variables = variables;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): ScopedVariableDeclarations {
            return id === this._id ? this : new ScopedVariableDeclarations(id, this._prefix, this._markers, this._modifiers, this._scope, this._variables);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): ScopedVariableDeclarations {
            return prefix === this._prefix ? this : new ScopedVariableDeclarations(this._id, prefix, this._markers, this._modifiers, this._scope, this._variables);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): ScopedVariableDeclarations {
            return markers === this._markers ? this : new ScopedVariableDeclarations(this._id, this._prefix, markers, this._modifiers, this._scope, this._variables);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): ScopedVariableDeclarations {
            return modifiers === this._modifiers ? this : new ScopedVariableDeclarations(this._id, this._prefix, this._markers, modifiers, this._scope, this._variables);
        }

        private readonly _scope: JLeftPadded<ScopedVariableDeclarations.Scope> | null;

        public get scope(): ScopedVariableDeclarations.Scope | null {
            return this._scope === null ? null : this._scope.element;
        }

        public withScope(scope: ScopedVariableDeclarations.Scope | null): ScopedVariableDeclarations {
            return this.padding.withScope(JLeftPadded.withElement(this._scope, scope));
        }

        private readonly _variables: JRightPadded<J>[];

        public get variables(): J[] {
            return JRightPadded.getElements(this._variables);
        }

        public withVariables(variables: J[]): ScopedVariableDeclarations {
            return this.padding.withVariables(JRightPadded.withElements(this._variables, variables));
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitScopedVariableDeclarations(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get scope(): JLeftPadded<ScopedVariableDeclarations.Scope> | null {
                return t._scope;
            }
            public withScope(scope: JLeftPadded<ScopedVariableDeclarations.Scope> | null): ScopedVariableDeclarations {
                return t._scope === scope ? t : new ScopedVariableDeclarations(t._id, t._prefix, t._markers, t._modifiers, scope, t._variables);
            }
            public get variables(): JRightPadded<J>[] {
                return t._variables;
            }
            public withVariables(variables: JRightPadded<J>[]): ScopedVariableDeclarations {
                return t._variables === variables ? t : new ScopedVariableDeclarations(t._id, t._prefix, t._markers, t._modifiers, t._scope, variables);
            }
        }
    }

}

export namespace ScopedVariableDeclarations {
    export enum Scope {
            Const = 0,
            Let = 1,
            Var = 2,

    }

}

@LstType("org.openrewrite.javascript.tree.JS$TaggedTemplateExpression")
export class TaggedTemplateExpression extends JSMixin(Object) implements Statement, Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, tag: JRightPadded<Expression> | null, typeArguments: JContainer<Expression> | null, templateExpression: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._tag = tag;
        this._typeArguments = typeArguments;
        this._templateExpression = templateExpression;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): TaggedTemplateExpression {
            return id === this._id ? this : new TaggedTemplateExpression(id, this._prefix, this._markers, this._tag, this._typeArguments, this._templateExpression, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TaggedTemplateExpression {
            return prefix === this._prefix ? this : new TaggedTemplateExpression(this._id, prefix, this._markers, this._tag, this._typeArguments, this._templateExpression, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TaggedTemplateExpression {
            return markers === this._markers ? this : new TaggedTemplateExpression(this._id, this._prefix, markers, this._tag, this._typeArguments, this._templateExpression, this._type);
        }

        private readonly _tag: JRightPadded<Expression> | null;

        public get tag(): Expression | null {
            return this._tag === null ? null : this._tag.element;
        }

        public withTag(tag: Expression | null): TaggedTemplateExpression {
            return this.padding.withTag(JRightPadded.withElement(this._tag, tag));
        }

        private readonly _typeArguments: JContainer<Expression> | null;

        public get typeArguments(): Expression[] | null {
            return this._typeArguments === null ? null : this._typeArguments.elements;
        }

        public withTypeArguments(typeArguments: Expression[] | null): TaggedTemplateExpression {
            return this.padding.withTypeArguments(JContainer.withElementsNullable(this._typeArguments, typeArguments));
        }

        private readonly _templateExpression: Expression;

        public get templateExpression(): Expression {
            return this._templateExpression;
        }

        public withTemplateExpression(templateExpression: Expression): TaggedTemplateExpression {
            return templateExpression === this._templateExpression ? this : new TaggedTemplateExpression(this._id, this._prefix, this._markers, this._tag, this._typeArguments, templateExpression, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): TaggedTemplateExpression {
            return _type === this._type ? this : new TaggedTemplateExpression(this._id, this._prefix, this._markers, this._tag, this._typeArguments, this._templateExpression, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTaggedTemplateExpression(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get tag(): JRightPadded<Expression> | null {
                return t._tag;
            }
            public withTag(tag: JRightPadded<Expression> | null): TaggedTemplateExpression {
                return t._tag === tag ? t : new TaggedTemplateExpression(t._id, t._prefix, t._markers, tag, t._typeArguments, t._templateExpression, t._type);
            }
            public get typeArguments(): JContainer<Expression> | null {
                return t._typeArguments;
            }
            public withTypeArguments(typeArguments: JContainer<Expression> | null): TaggedTemplateExpression {
                return t._typeArguments === typeArguments ? t : new TaggedTemplateExpression(t._id, t._prefix, t._markers, t._tag, typeArguments, t._templateExpression, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$TemplateExpression")
export class TemplateExpression extends JSMixin(Object) implements Statement, Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, head: Java.Literal, templateSpans: JRightPadded<TemplateExpression.TemplateSpan>[], _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._head = head;
        this._templateSpans = templateSpans;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): TemplateExpression {
            return id === this._id ? this : new TemplateExpression(id, this._prefix, this._markers, this._head, this._templateSpans, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TemplateExpression {
            return prefix === this._prefix ? this : new TemplateExpression(this._id, prefix, this._markers, this._head, this._templateSpans, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TemplateExpression {
            return markers === this._markers ? this : new TemplateExpression(this._id, this._prefix, markers, this._head, this._templateSpans, this._type);
        }

        private readonly _head: Java.Literal;

        public get head(): Java.Literal {
            return this._head;
        }

        public withHead(head: Java.Literal): TemplateExpression {
            return head === this._head ? this : new TemplateExpression(this._id, this._prefix, this._markers, head, this._templateSpans, this._type);
        }

        private readonly _templateSpans: JRightPadded<TemplateExpression.TemplateSpan>[];

        public get templateSpans(): TemplateExpression.TemplateSpan[] {
            return JRightPadded.getElements(this._templateSpans);
        }

        public withTemplateSpans(templateSpans: TemplateExpression.TemplateSpan[]): TemplateExpression {
            return this.padding.withTemplateSpans(JRightPadded.withElements(this._templateSpans, templateSpans));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): TemplateExpression {
            return _type === this._type ? this : new TemplateExpression(this._id, this._prefix, this._markers, this._head, this._templateSpans, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTemplateExpression(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get templateSpans(): JRightPadded<TemplateExpression.TemplateSpan>[] {
                return t._templateSpans;
            }
            public withTemplateSpans(templateSpans: JRightPadded<TemplateExpression.TemplateSpan>[]): TemplateExpression {
                return t._templateSpans === templateSpans ? t : new TemplateExpression(t._id, t._prefix, t._markers, t._head, templateSpans, t._type);
            }
        }
    }

}

export namespace TemplateExpression {
    @LstType("org.openrewrite.javascript.tree.JS$TemplateExpression$TemplateSpan")
    export class TemplateSpan extends JSMixin(Object) {
        public constructor(id: UUID, prefix: Space, markers: Markers, expression: J, tail: Java.Literal) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._expression = expression;
            this._tail = tail;
        }

            private readonly _id: UUID;

            public get id(): UUID {
                return this._id;
            }

            public withId(id: UUID): TemplateExpression.TemplateSpan {
                return id === this._id ? this : new TemplateExpression.TemplateSpan(id, this._prefix, this._markers, this._expression, this._tail);
            }

            private readonly _prefix: Space;

            public get prefix(): Space {
                return this._prefix;
            }

            public withPrefix(prefix: Space): TemplateExpression.TemplateSpan {
                return prefix === this._prefix ? this : new TemplateExpression.TemplateSpan(this._id, prefix, this._markers, this._expression, this._tail);
            }

            private readonly _markers: Markers;

            public get markers(): Markers {
                return this._markers;
            }

            public withMarkers(markers: Markers): TemplateExpression.TemplateSpan {
                return markers === this._markers ? this : new TemplateExpression.TemplateSpan(this._id, this._prefix, markers, this._expression, this._tail);
            }

            private readonly _expression: J;

            public get expression(): J {
                return this._expression;
            }

            public withExpression(expression: J): TemplateExpression.TemplateSpan {
                return expression === this._expression ? this : new TemplateExpression.TemplateSpan(this._id, this._prefix, this._markers, expression, this._tail);
            }

            private readonly _tail: Java.Literal;

            public get tail(): Java.Literal {
                return this._tail;
            }

            public withTail(tail: Java.Literal): TemplateExpression.TemplateSpan {
                return tail === this._tail ? this : new TemplateExpression.TemplateSpan(this._id, this._prefix, this._markers, this._expression, tail);
            }

        public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
            return v.visitTemplateExpressionTemplateSpan(this, p);
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
    public constructor(id: UUID, prefix: Space, markers: Markers, modifiers: Java.Modifier[], name: JLeftPadded<Java.Identifier>, typeParameters: Java.TypeParameters | null, initializer: JLeftPadded<Expression>, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
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
            return id === this._id ? this : new TypeDeclaration(id, this._prefix, this._markers, this._modifiers, this._name, this._typeParameters, this._initializer, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TypeDeclaration {
            return prefix === this._prefix ? this : new TypeDeclaration(this._id, prefix, this._markers, this._modifiers, this._name, this._typeParameters, this._initializer, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TypeDeclaration {
            return markers === this._markers ? this : new TypeDeclaration(this._id, this._prefix, markers, this._modifiers, this._name, this._typeParameters, this._initializer, this._type);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): TypeDeclaration {
            return modifiers === this._modifiers ? this : new TypeDeclaration(this._id, this._prefix, this._markers, modifiers, this._name, this._typeParameters, this._initializer, this._type);
        }

        private readonly _name: JLeftPadded<Java.Identifier>;

        public get name(): Java.Identifier {
            return this._name.element;
        }

        public withName(name: Java.Identifier): TypeDeclaration {
            return this.padding.withName(this._name.withElement(name));
        }

        private readonly _typeParameters: Java.TypeParameters | null;

        public get typeParameters(): Java.TypeParameters | null {
            return this._typeParameters;
        }

        public withTypeParameters(typeParameters: Java.TypeParameters | null): TypeDeclaration {
            return typeParameters === this._typeParameters ? this : new TypeDeclaration(this._id, this._prefix, this._markers, this._modifiers, this._name, typeParameters, this._initializer, this._type);
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
            return _type === this._type ? this : new TypeDeclaration(this._id, this._prefix, this._markers, this._modifiers, this._name, this._typeParameters, this._initializer, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTypeDeclaration(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get name(): JLeftPadded<Java.Identifier> {
                return t._name;
            }
            public withName(name: JLeftPadded<Java.Identifier>): TypeDeclaration {
                return t._name === name ? t : new TypeDeclaration(t._id, t._prefix, t._markers, t._modifiers, name, t._typeParameters, t._initializer, t._type);
            }
            public get initializer(): JLeftPadded<Expression> {
                return t._initializer;
            }
            public withInitializer(initializer: JLeftPadded<Expression>): TypeDeclaration {
                return t._initializer === initializer ? t : new TypeDeclaration(t._id, t._prefix, t._markers, t._modifiers, t._name, t._typeParameters, initializer, t._type);
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

@LstType("org.openrewrite.javascript.tree.JS$TypeQuery")
export class TypeQuery extends JSMixin(Object) implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, typeExpression: TypeTree, typeArguments: JContainer<Expression> | null, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._typeExpression = typeExpression;
        this._typeArguments = typeArguments;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): TypeQuery {
            return id === this._id ? this : new TypeQuery(id, this._prefix, this._markers, this._typeExpression, this._typeArguments, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TypeQuery {
            return prefix === this._prefix ? this : new TypeQuery(this._id, prefix, this._markers, this._typeExpression, this._typeArguments, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TypeQuery {
            return markers === this._markers ? this : new TypeQuery(this._id, this._prefix, markers, this._typeExpression, this._typeArguments, this._type);
        }

        private readonly _typeExpression: TypeTree;

        public get typeExpression(): TypeTree {
            return this._typeExpression;
        }

        public withTypeExpression(typeExpression: TypeTree): TypeQuery {
            return typeExpression === this._typeExpression ? this : new TypeQuery(this._id, this._prefix, this._markers, typeExpression, this._typeArguments, this._type);
        }

        private readonly _typeArguments: JContainer<Expression> | null;

        public get typeArguments(): Expression[] | null {
            return this._typeArguments === null ? null : this._typeArguments.elements;
        }

        public withTypeArguments(typeArguments: Expression[] | null): TypeQuery {
            return this.padding.withTypeArguments(JContainer.withElementsNullable(this._typeArguments, typeArguments));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): TypeQuery {
            return _type === this._type ? this : new TypeQuery(this._id, this._prefix, this._markers, this._typeExpression, this._typeArguments, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTypeQuery(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get typeArguments(): JContainer<Expression> | null {
                return t._typeArguments;
            }
            public withTypeArguments(typeArguments: JContainer<Expression> | null): TypeQuery {
                return t._typeArguments === typeArguments ? t : new TypeQuery(t._id, t._prefix, t._markers, t._typeExpression, typeArguments, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$TypeOperator")
export class TypeOperator extends JSMixin(Object) implements Expression, TypeTree {
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
            Unique = 2,

    }

}

@LstType("org.openrewrite.javascript.tree.JS$TypePredicate")
export class TypePredicate extends JSMixin(Object) implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, asserts: JLeftPadded<boolean>, parameterName: Java.Identifier, expression: JLeftPadded<Expression> | null, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._asserts = asserts;
        this._parameterName = parameterName;
        this._expression = expression;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): TypePredicate {
            return id === this._id ? this : new TypePredicate(id, this._prefix, this._markers, this._asserts, this._parameterName, this._expression, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TypePredicate {
            return prefix === this._prefix ? this : new TypePredicate(this._id, prefix, this._markers, this._asserts, this._parameterName, this._expression, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TypePredicate {
            return markers === this._markers ? this : new TypePredicate(this._id, this._prefix, markers, this._asserts, this._parameterName, this._expression, this._type);
        }

        private readonly _asserts: JLeftPadded<boolean>;

        public get asserts(): boolean {
            return this._asserts.element;
        }

        public withAsserts(asserts: boolean): TypePredicate {
            return this.padding.withAsserts(this._asserts.withElement(asserts));
        }

        private readonly _parameterName: Java.Identifier;

        public get parameterName(): Java.Identifier {
            return this._parameterName;
        }

        public withParameterName(parameterName: Java.Identifier): TypePredicate {
            return parameterName === this._parameterName ? this : new TypePredicate(this._id, this._prefix, this._markers, this._asserts, parameterName, this._expression, this._type);
        }

        private readonly _expression: JLeftPadded<Expression> | null;

        public get expression(): Expression | null {
            return this._expression === null ? null : this._expression.element;
        }

        public withExpression(expression: Expression | null): TypePredicate {
            return this.padding.withExpression(JLeftPadded.withElement(this._expression, expression));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): TypePredicate {
            return _type === this._type ? this : new TypePredicate(this._id, this._prefix, this._markers, this._asserts, this._parameterName, this._expression, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTypePredicate(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get asserts(): JLeftPadded<boolean> {
                return t._asserts;
            }
            public withAsserts(asserts: JLeftPadded<boolean>): TypePredicate {
                return t._asserts === asserts ? t : new TypePredicate(t._id, t._prefix, t._markers, asserts, t._parameterName, t._expression, t._type);
            }
            public get expression(): JLeftPadded<Expression> | null {
                return t._expression;
            }
            public withExpression(expression: JLeftPadded<Expression> | null): TypePredicate {
                return t._expression === expression ? t : new TypePredicate(t._id, t._prefix, t._markers, t._asserts, t._parameterName, expression, t._type);
            }
        }
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
            Optional = 1,
            Exclamation = 2,
            QuestionDot = 3,
            QuestionDotWithDot = 4,
            Asterisk = 5,

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

@LstType("org.openrewrite.javascript.tree.JS$Intersection")
export class Intersection extends JSMixin(Object) implements Expression, TypeTree {
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

        public withId(id: UUID): Intersection {
            return id === this._id ? this : new Intersection(id, this._prefix, this._markers, this._types, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Intersection {
            return prefix === this._prefix ? this : new Intersection(this._id, prefix, this._markers, this._types, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Intersection {
            return markers === this._markers ? this : new Intersection(this._id, this._prefix, markers, this._types, this._type);
        }

        private readonly _types: JRightPadded<Expression>[];

        public get types(): Expression[] {
            return JRightPadded.getElements(this._types);
        }

        public withTypes(types: Expression[]): Intersection {
            return this.padding.withTypes(JRightPadded.withElements(this._types, types));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): Intersection {
            return _type === this._type ? this : new Intersection(this._id, this._prefix, this._markers, this._types, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitIntersection(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get types(): JRightPadded<Expression>[] {
                return t._types;
            }
            public withTypes(types: JRightPadded<Expression>[]): Intersection {
                return t._types === types ? t : new Intersection(t._id, t._prefix, t._markers, types, t._type);
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

@LstType("org.openrewrite.javascript.tree.JS$Yield")
export class Yield extends JSMixin(Object) implements Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, delegated: JLeftPadded<boolean>, expression: Expression | null, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._delegated = delegated;
        this._expression = expression;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Yield {
            return id === this._id ? this : new Yield(id, this._prefix, this._markers, this._delegated, this._expression, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Yield {
            return prefix === this._prefix ? this : new Yield(this._id, prefix, this._markers, this._delegated, this._expression, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Yield {
            return markers === this._markers ? this : new Yield(this._id, this._prefix, markers, this._delegated, this._expression, this._type);
        }

        private readonly _delegated: JLeftPadded<boolean>;

        public get delegated(): boolean {
            return this._delegated.element;
        }

        public withDelegated(delegated: boolean): Yield {
            return this.padding.withDelegated(this._delegated.withElement(delegated));
        }

        private readonly _expression: Expression | null;

        public get expression(): Expression | null {
            return this._expression;
        }

        public withExpression(expression: Expression | null): Yield {
            return expression === this._expression ? this : new Yield(this._id, this._prefix, this._markers, this._delegated, expression, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): Yield {
            return _type === this._type ? this : new Yield(this._id, this._prefix, this._markers, this._delegated, this._expression, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitJsYield(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get delegated(): JLeftPadded<boolean> {
                return t._delegated;
            }
            public withDelegated(delegated: JLeftPadded<boolean>): Yield {
                return t._delegated === delegated ? t : new Yield(t._id, t._prefix, t._markers, delegated, t._expression, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$TypeInfo")
export class TypeInfo extends JSMixin(Object) implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, typeIdentifier: TypeTree) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._typeIdentifier = typeIdentifier;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): TypeInfo {
            return id === this._id ? this : new TypeInfo(id, this._prefix, this._markers, this._typeIdentifier);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TypeInfo {
            return prefix === this._prefix ? this : new TypeInfo(this._id, prefix, this._markers, this._typeIdentifier);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TypeInfo {
            return markers === this._markers ? this : new TypeInfo(this._id, this._prefix, markers, this._typeIdentifier);
        }

        private readonly _typeIdentifier: TypeTree;

        public get typeIdentifier(): TypeTree {
            return this._typeIdentifier;
        }

        public withTypeIdentifier(typeIdentifier: TypeTree): TypeInfo {
            return typeIdentifier === this._typeIdentifier ? this : new TypeInfo(this._id, this._prefix, this._markers, typeIdentifier);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTypeInfo(this, p);
    }

    public get type(): JavaType | null {
        return extensions.getJavaType(this);
    }

    public withType(type: JavaType): TypeInfo {
        return extensions.withJavaType(this, type);
    }

}

@LstType("org.openrewrite.javascript.tree.JS$JSVariableDeclarations")
export class JSVariableDeclarations extends JSMixin(Object) implements Statement, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, leadingAnnotations: Java.Annotation[], modifiers: Java.Modifier[], typeExpression: TypeTree | null, varargs: Space | null, variables: JRightPadded<JSVariableDeclarations.JSNamedVariable>[]) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._leadingAnnotations = leadingAnnotations;
        this._modifiers = modifiers;
        this._typeExpression = typeExpression;
        this._varargs = varargs;
        this._variables = variables;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): JSVariableDeclarations {
            return id === this._id ? this : new JSVariableDeclarations(id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeExpression, this._varargs, this._variables);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): JSVariableDeclarations {
            return prefix === this._prefix ? this : new JSVariableDeclarations(this._id, prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeExpression, this._varargs, this._variables);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): JSVariableDeclarations {
            return markers === this._markers ? this : new JSVariableDeclarations(this._id, this._prefix, markers, this._leadingAnnotations, this._modifiers, this._typeExpression, this._varargs, this._variables);
        }

        private readonly _leadingAnnotations: Java.Annotation[];

        public get leadingAnnotations(): Java.Annotation[] {
            return this._leadingAnnotations;
        }

        public withLeadingAnnotations(leadingAnnotations: Java.Annotation[]): JSVariableDeclarations {
            return leadingAnnotations === this._leadingAnnotations ? this : new JSVariableDeclarations(this._id, this._prefix, this._markers, leadingAnnotations, this._modifiers, this._typeExpression, this._varargs, this._variables);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): JSVariableDeclarations {
            return modifiers === this._modifiers ? this : new JSVariableDeclarations(this._id, this._prefix, this._markers, this._leadingAnnotations, modifiers, this._typeExpression, this._varargs, this._variables);
        }

        private readonly _typeExpression: TypeTree | null;

        public get typeExpression(): TypeTree | null {
            return this._typeExpression;
        }

        public withTypeExpression(typeExpression: TypeTree | null): JSVariableDeclarations {
            return typeExpression === this._typeExpression ? this : new JSVariableDeclarations(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, typeExpression, this._varargs, this._variables);
        }

        private readonly _varargs: Space | null;

        public get varargs(): Space | null {
            return this._varargs;
        }

        public withVarargs(varargs: Space | null): JSVariableDeclarations {
            return varargs === this._varargs ? this : new JSVariableDeclarations(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeExpression, varargs, this._variables);
        }

        private readonly _variables: JRightPadded<JSVariableDeclarations.JSNamedVariable>[];

        public get variables(): JSVariableDeclarations.JSNamedVariable[] {
            return JRightPadded.getElements(this._variables);
        }

        public withVariables(variables: JSVariableDeclarations.JSNamedVariable[]): JSVariableDeclarations {
            return this.padding.withVariables(JRightPadded.withElements(this._variables, variables));
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitJSVariableDeclarations(this, p);
    }

    public get type(): JavaType | null {
        return extensions.getJavaType(this);
    }

    public withType(type: JavaType): JSVariableDeclarations {
        return extensions.withJavaType(this, type);
    }

    get padding() {
        const t = this;
        return new class {
            public get variables(): JRightPadded<JSVariableDeclarations.JSNamedVariable>[] {
                return t._variables;
            }
            public withVariables(variables: JRightPadded<JSVariableDeclarations.JSNamedVariable>[]): JSVariableDeclarations {
                return t._variables === variables ? t : new JSVariableDeclarations(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeExpression, t._varargs, variables);
            }
        }
    }

}

export namespace JSVariableDeclarations {
    @LstType("org.openrewrite.javascript.tree.JS$JSVariableDeclarations$JSNamedVariable")
    export class JSNamedVariable extends JSMixin(Object) implements NameTree {
        public constructor(id: UUID, prefix: Space, markers: Markers, name: Expression, dimensionsAfterName: JLeftPadded<Space>[], initializer: JLeftPadded<Expression> | null, variableType: JavaType.Variable | null) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._name = name;
            this._dimensionsAfterName = dimensionsAfterName;
            this._initializer = initializer;
            this._variableType = variableType;
        }

            private readonly _id: UUID;

            public get id(): UUID {
                return this._id;
            }

            public withId(id: UUID): JSVariableDeclarations.JSNamedVariable {
                return id === this._id ? this : new JSVariableDeclarations.JSNamedVariable(id, this._prefix, this._markers, this._name, this._dimensionsAfterName, this._initializer, this._variableType);
            }

            private readonly _prefix: Space;

            public get prefix(): Space {
                return this._prefix;
            }

            public withPrefix(prefix: Space): JSVariableDeclarations.JSNamedVariable {
                return prefix === this._prefix ? this : new JSVariableDeclarations.JSNamedVariable(this._id, prefix, this._markers, this._name, this._dimensionsAfterName, this._initializer, this._variableType);
            }

            private readonly _markers: Markers;

            public get markers(): Markers {
                return this._markers;
            }

            public withMarkers(markers: Markers): JSVariableDeclarations.JSNamedVariable {
                return markers === this._markers ? this : new JSVariableDeclarations.JSNamedVariable(this._id, this._prefix, markers, this._name, this._dimensionsAfterName, this._initializer, this._variableType);
            }

            private readonly _name: Expression;

            public get name(): Expression {
                return this._name;
            }

            public withName(name: Expression): JSVariableDeclarations.JSNamedVariable {
                return name === this._name ? this : new JSVariableDeclarations.JSNamedVariable(this._id, this._prefix, this._markers, name, this._dimensionsAfterName, this._initializer, this._variableType);
            }

            private readonly _dimensionsAfterName: JLeftPadded<Space>[];

            public get dimensionsAfterName(): Space[] {
                return JLeftPadded.getElements(this._dimensionsAfterName);
            }

            public withDimensionsAfterName(dimensionsAfterName: Space[]): JSVariableDeclarations.JSNamedVariable {
                return this.padding.withDimensionsAfterName(JLeftPadded.withElements(this._dimensionsAfterName, dimensionsAfterName));
            }

            private readonly _initializer: JLeftPadded<Expression> | null;

            public get initializer(): Expression | null {
                return this._initializer === null ? null : this._initializer.element;
            }

            public withInitializer(initializer: Expression | null): JSVariableDeclarations.JSNamedVariable {
                return this.padding.withInitializer(JLeftPadded.withElement(this._initializer, initializer));
            }

            private readonly _variableType: JavaType.Variable | null;

            public get variableType(): JavaType.Variable | null {
                return this._variableType;
            }

            public withVariableType(variableType: JavaType.Variable | null): JSVariableDeclarations.JSNamedVariable {
                return variableType === this._variableType ? this : new JSVariableDeclarations.JSNamedVariable(this._id, this._prefix, this._markers, this._name, this._dimensionsAfterName, this._initializer, variableType);
            }

        public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
            return v.visitJSVariableDeclarationsJSNamedVariable(this, p);
        }

        public get type(): JavaType | null {
            return extensions.getJavaType(this);
        }

        public withType(type: JavaType): JSVariableDeclarations.JSNamedVariable {
            return extensions.withJavaType(this, type);
        }

        get padding() {
            const t = this;
            return new class {
                public get dimensionsAfterName(): JLeftPadded<Space>[] {
                    return t._dimensionsAfterName;
                }
                public withDimensionsAfterName(dimensionsAfterName: JLeftPadded<Space>[]): JSVariableDeclarations.JSNamedVariable {
                    return t._dimensionsAfterName === dimensionsAfterName ? t : new JSVariableDeclarations.JSNamedVariable(t._id, t._prefix, t._markers, t._name, dimensionsAfterName, t._initializer, t._variableType);
                }
                public get initializer(): JLeftPadded<Expression> | null {
                    return t._initializer;
                }
                public withInitializer(initializer: JLeftPadded<Expression> | null): JSVariableDeclarations.JSNamedVariable {
                    return t._initializer === initializer ? t : new JSVariableDeclarations.JSNamedVariable(t._id, t._prefix, t._markers, t._name, t._dimensionsAfterName, initializer, t._variableType);
                }
            }
        }

    }

}

@LstType("org.openrewrite.javascript.tree.JS$JSMethodDeclaration")
export class JSMethodDeclaration extends JSMixin(Object) implements Statement, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, leadingAnnotations: Java.Annotation[], modifiers: Java.Modifier[], typeParameters: Java.TypeParameters | null, returnTypeExpression: TypeTree | null, name: Expression, parameters: JContainer<Statement>, throwz: JContainer<NameTree> | null, body: Java.Block | null, defaultValue: JLeftPadded<Expression> | null, methodType: JavaType.Method | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._leadingAnnotations = leadingAnnotations;
        this._modifiers = modifiers;
        this._typeParameters = typeParameters;
        this._returnTypeExpression = returnTypeExpression;
        this._name = name;
        this._parameters = parameters;
        this._throwz = throwz;
        this._body = body;
        this._defaultValue = defaultValue;
        this._methodType = methodType;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): JSMethodDeclaration {
            return id === this._id ? this : new JSMethodDeclaration(id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throwz, this._body, this._defaultValue, this._methodType);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): JSMethodDeclaration {
            return prefix === this._prefix ? this : new JSMethodDeclaration(this._id, prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throwz, this._body, this._defaultValue, this._methodType);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): JSMethodDeclaration {
            return markers === this._markers ? this : new JSMethodDeclaration(this._id, this._prefix, markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throwz, this._body, this._defaultValue, this._methodType);
        }

        private readonly _leadingAnnotations: Java.Annotation[];

        public get leadingAnnotations(): Java.Annotation[] {
            return this._leadingAnnotations;
        }

        public withLeadingAnnotations(leadingAnnotations: Java.Annotation[]): JSMethodDeclaration {
            return leadingAnnotations === this._leadingAnnotations ? this : new JSMethodDeclaration(this._id, this._prefix, this._markers, leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throwz, this._body, this._defaultValue, this._methodType);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): JSMethodDeclaration {
            return modifiers === this._modifiers ? this : new JSMethodDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throwz, this._body, this._defaultValue, this._methodType);
        }

        private readonly _typeParameters: Java.TypeParameters | null;

        public get typeParameters(): Java.TypeParameters | null {
            return this._typeParameters;
        }

        public withTypeParameters(typeParameters: Java.TypeParameters | null): JSMethodDeclaration {
            return typeParameters === this._typeParameters ? this : new JSMethodDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throwz, this._body, this._defaultValue, this._methodType);
        }

        private readonly _returnTypeExpression: TypeTree | null;

        public get returnTypeExpression(): TypeTree | null {
            return this._returnTypeExpression;
        }

        public withReturnTypeExpression(returnTypeExpression: TypeTree | null): JSMethodDeclaration {
            return returnTypeExpression === this._returnTypeExpression ? this : new JSMethodDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, returnTypeExpression, this._name, this._parameters, this._throwz, this._body, this._defaultValue, this._methodType);
        }

        private readonly _name: Expression;

        public get name(): Expression {
            return this._name;
        }

        public withName(name: Expression): JSMethodDeclaration {
            return name === this._name ? this : new JSMethodDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, name, this._parameters, this._throwz, this._body, this._defaultValue, this._methodType);
        }

        private readonly _parameters: JContainer<Statement>;

        public get parameters(): Statement[] {
            return this._parameters.elements;
        }

        public withParameters(parameters: Statement[]): JSMethodDeclaration {
            return this.padding.withParameters(JContainer.withElements(this._parameters, parameters));
        }

        private readonly _throwz: JContainer<NameTree> | null;

        public get throwz(): NameTree[] | null {
            return this._throwz === null ? null : this._throwz.elements;
        }

        public withThrowz(throwz: NameTree[] | null): JSMethodDeclaration {
            return this.padding.withThrowz(JContainer.withElementsNullable(this._throwz, throwz));
        }

        private readonly _body: Java.Block | null;

        public get body(): Java.Block | null {
            return this._body;
        }

        public withBody(body: Java.Block | null): JSMethodDeclaration {
            return body === this._body ? this : new JSMethodDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throwz, body, this._defaultValue, this._methodType);
        }

        private readonly _defaultValue: JLeftPadded<Expression> | null;

        public get defaultValue(): Expression | null {
            return this._defaultValue === null ? null : this._defaultValue.element;
        }

        public withDefaultValue(defaultValue: Expression | null): JSMethodDeclaration {
            return this.padding.withDefaultValue(JLeftPadded.withElement(this._defaultValue, defaultValue));
        }

        private readonly _methodType: JavaType.Method | null;

        public get methodType(): JavaType.Method | null {
            return this._methodType;
        }

        public withMethodType(methodType: JavaType.Method | null): JSMethodDeclaration {
            return methodType === this._methodType ? this : new JSMethodDeclaration(this._id, this._prefix, this._markers, this._leadingAnnotations, this._modifiers, this._typeParameters, this._returnTypeExpression, this._name, this._parameters, this._throwz, this._body, this._defaultValue, methodType);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitJSMethodDeclaration(this, p);
    }

    public get type(): JavaType | null {
        return extensions.getJavaType(this);
    }

    public withType(type: JavaType): JSMethodDeclaration {
        return extensions.withJavaType(this, type);
    }

    get padding() {
        const t = this;
        return new class {
            public get parameters(): JContainer<Statement> {
                return t._parameters;
            }
            public withParameters(parameters: JContainer<Statement>): JSMethodDeclaration {
                return t._parameters === parameters ? t : new JSMethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeParameters, t._returnTypeExpression, t._name, parameters, t._throwz, t._body, t._defaultValue, t._methodType);
            }
            public get throwz(): JContainer<NameTree> | null {
                return t._throwz;
            }
            public withThrowz(throwz: JContainer<NameTree> | null): JSMethodDeclaration {
                return t._throwz === throwz ? t : new JSMethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeParameters, t._returnTypeExpression, t._name, t._parameters, throwz, t._body, t._defaultValue, t._methodType);
            }
            public get defaultValue(): JLeftPadded<Expression> | null {
                return t._defaultValue;
            }
            public withDefaultValue(defaultValue: JLeftPadded<Expression> | null): JSMethodDeclaration {
                return t._defaultValue === defaultValue ? t : new JSMethodDeclaration(t._id, t._prefix, t._markers, t._leadingAnnotations, t._modifiers, t._typeParameters, t._returnTypeExpression, t._name, t._parameters, t._throwz, t._body, defaultValue, t._methodType);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$JSForOfLoop")
export class JSForOfLoop extends JSMixin(Object) implements Loop {
    public constructor(id: UUID, prefix: Space, markers: Markers, await: JLeftPadded<boolean>, control: JSForInOfLoopControl, body: JRightPadded<Statement>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._await = await;
        this._control = control;
        this._body = body;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): JSForOfLoop {
            return id === this._id ? this : new JSForOfLoop(id, this._prefix, this._markers, this._await, this._control, this._body);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): JSForOfLoop {
            return prefix === this._prefix ? this : new JSForOfLoop(this._id, prefix, this._markers, this._await, this._control, this._body);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): JSForOfLoop {
            return markers === this._markers ? this : new JSForOfLoop(this._id, this._prefix, markers, this._await, this._control, this._body);
        }

        private readonly _await: JLeftPadded<boolean>;

        public get await(): boolean {
            return this._await.element;
        }

        public withAwait(await: boolean): JSForOfLoop {
            return this.padding.withAwait(this._await.withElement(await));
        }

        private readonly _control: JSForInOfLoopControl;

        public get control(): JSForInOfLoopControl {
            return this._control;
        }

        public withControl(control: JSForInOfLoopControl): JSForOfLoop {
            return control === this._control ? this : new JSForOfLoop(this._id, this._prefix, this._markers, this._await, control, this._body);
        }

        private readonly _body: JRightPadded<Statement>;

        public get body(): Statement {
            return this._body.element;
        }

        public withBody(body: Statement): JSForOfLoop {
            return this.padding.withBody(this._body.withElement(body));
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitJSForOfLoop(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get await(): JLeftPadded<boolean> {
                return t._await;
            }
            public withAwait(await: JLeftPadded<boolean>): JSForOfLoop {
                return t._await === await ? t : new JSForOfLoop(t._id, t._prefix, t._markers, await, t._control, t._body);
            }
            public get body(): JRightPadded<Statement> {
                return t._body;
            }
            public withBody(body: JRightPadded<Statement>): JSForOfLoop {
                return t._body === body ? t : new JSForOfLoop(t._id, t._prefix, t._markers, t._await, t._control, body);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$JSForInLoop")
export class JSForInLoop extends JSMixin(Object) implements Loop {
    public constructor(id: UUID, prefix: Space, markers: Markers, control: JSForInOfLoopControl, body: JRightPadded<Statement>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._control = control;
        this._body = body;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): JSForInLoop {
            return id === this._id ? this : new JSForInLoop(id, this._prefix, this._markers, this._control, this._body);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): JSForInLoop {
            return prefix === this._prefix ? this : new JSForInLoop(this._id, prefix, this._markers, this._control, this._body);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): JSForInLoop {
            return markers === this._markers ? this : new JSForInLoop(this._id, this._prefix, markers, this._control, this._body);
        }

        private readonly _control: JSForInOfLoopControl;

        public get control(): JSForInOfLoopControl {
            return this._control;
        }

        public withControl(control: JSForInOfLoopControl): JSForInLoop {
            return control === this._control ? this : new JSForInLoop(this._id, this._prefix, this._markers, control, this._body);
        }

        private readonly _body: JRightPadded<Statement>;

        public get body(): Statement {
            return this._body.element;
        }

        public withBody(body: Statement): JSForInLoop {
            return this.padding.withBody(this._body.withElement(body));
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitJSForInLoop(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get body(): JRightPadded<Statement> {
                return t._body;
            }
            public withBody(body: JRightPadded<Statement>): JSForInLoop {
                return t._body === body ? t : new JSForInLoop(t._id, t._prefix, t._markers, t._control, body);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$JSForInOfLoopControl")
export class JSForInOfLoopControl extends JSMixin(Object) {
    public constructor(id: UUID, prefix: Space, markers: Markers, variable: JRightPadded<J>, iterable: JRightPadded<Expression>) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._variable = variable;
        this._iterable = iterable;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): JSForInOfLoopControl {
            return id === this._id ? this : new JSForInOfLoopControl(id, this._prefix, this._markers, this._variable, this._iterable);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): JSForInOfLoopControl {
            return prefix === this._prefix ? this : new JSForInOfLoopControl(this._id, prefix, this._markers, this._variable, this._iterable);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): JSForInOfLoopControl {
            return markers === this._markers ? this : new JSForInOfLoopControl(this._id, this._prefix, markers, this._variable, this._iterable);
        }

        private readonly _variable: JRightPadded<J>;

        public get variable(): J {
            return this._variable.element;
        }

        public withVariable(variable: J): JSForInOfLoopControl {
            return this.padding.withVariable(this._variable.withElement(variable));
        }

        private readonly _iterable: JRightPadded<Expression>;

        public get iterable(): Expression {
            return this._iterable.element;
        }

        public withIterable(iterable: Expression): JSForInOfLoopControl {
            return this.padding.withIterable(this._iterable.withElement(iterable));
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitJSForInOfLoopControl(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get variable(): JRightPadded<J> {
                return t._variable;
            }
            public withVariable(variable: JRightPadded<J>): JSForInOfLoopControl {
                return t._variable === variable ? t : new JSForInOfLoopControl(t._id, t._prefix, t._markers, variable, t._iterable);
            }
            public get iterable(): JRightPadded<Expression> {
                return t._iterable;
            }
            public withIterable(iterable: JRightPadded<Expression>): JSForInOfLoopControl {
                return t._iterable === iterable ? t : new JSForInOfLoopControl(t._id, t._prefix, t._markers, t._variable, iterable);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$NamespaceDeclaration")
export class NamespaceDeclaration extends JSMixin(Object) implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, modifiers: Java.Modifier[], keywordType: JLeftPadded<NamespaceDeclaration.KeywordType>, name: JRightPadded<Expression>, body: Java.Block | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._modifiers = modifiers;
        this._keywordType = keywordType;
        this._name = name;
        this._body = body;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): NamespaceDeclaration {
            return id === this._id ? this : new NamespaceDeclaration(id, this._prefix, this._markers, this._modifiers, this._keywordType, this._name, this._body);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): NamespaceDeclaration {
            return prefix === this._prefix ? this : new NamespaceDeclaration(this._id, prefix, this._markers, this._modifiers, this._keywordType, this._name, this._body);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): NamespaceDeclaration {
            return markers === this._markers ? this : new NamespaceDeclaration(this._id, this._prefix, markers, this._modifiers, this._keywordType, this._name, this._body);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): NamespaceDeclaration {
            return modifiers === this._modifiers ? this : new NamespaceDeclaration(this._id, this._prefix, this._markers, modifiers, this._keywordType, this._name, this._body);
        }

        private readonly _keywordType: JLeftPadded<NamespaceDeclaration.KeywordType>;

        public get keywordType(): NamespaceDeclaration.KeywordType {
            return this._keywordType.element;
        }

        public withKeywordType(keywordType: NamespaceDeclaration.KeywordType): NamespaceDeclaration {
            return this.padding.withKeywordType(this._keywordType.withElement(keywordType));
        }

        private readonly _name: JRightPadded<Expression>;

        public get name(): Expression {
            return this._name.element;
        }

        public withName(name: Expression): NamespaceDeclaration {
            return this.padding.withName(this._name.withElement(name));
        }

        private readonly _body: Java.Block | null;

        public get body(): Java.Block | null {
            return this._body;
        }

        public withBody(body: Java.Block | null): NamespaceDeclaration {
            return body === this._body ? this : new NamespaceDeclaration(this._id, this._prefix, this._markers, this._modifiers, this._keywordType, this._name, body);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitNamespaceDeclaration(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get keywordType(): JLeftPadded<NamespaceDeclaration.KeywordType> {
                return t._keywordType;
            }
            public withKeywordType(keywordType: JLeftPadded<NamespaceDeclaration.KeywordType>): NamespaceDeclaration {
                return t._keywordType === keywordType ? t : new NamespaceDeclaration(t._id, t._prefix, t._markers, t._modifiers, keywordType, t._name, t._body);
            }
            public get name(): JRightPadded<Expression> {
                return t._name;
            }
            public withName(name: JRightPadded<Expression>): NamespaceDeclaration {
                return t._name === name ? t : new NamespaceDeclaration(t._id, t._prefix, t._markers, t._modifiers, t._keywordType, name, t._body);
            }
        }
    }

}

export namespace NamespaceDeclaration {
    export enum KeywordType {
            Namespace = 0,
            Module = 1,
            Empty = 2,

    }

}

@LstType("org.openrewrite.javascript.tree.JS$FunctionDeclaration")
export class FunctionDeclaration extends JSMixin(Object) implements Statement, Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, modifiers: Java.Modifier[], asteriskToken: JLeftPadded<boolean>, name: JLeftPadded<Java.Identifier>, typeParameters: Java.TypeParameters | null, parameters: JContainer<Statement>, returnTypeExpression: TypeTree | null, body: J | null, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._modifiers = modifiers;
        this._asteriskToken = asteriskToken;
        this._name = name;
        this._typeParameters = typeParameters;
        this._parameters = parameters;
        this._returnTypeExpression = returnTypeExpression;
        this._body = body;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): FunctionDeclaration {
            return id === this._id ? this : new FunctionDeclaration(id, this._prefix, this._markers, this._modifiers, this._asteriskToken, this._name, this._typeParameters, this._parameters, this._returnTypeExpression, this._body, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): FunctionDeclaration {
            return prefix === this._prefix ? this : new FunctionDeclaration(this._id, prefix, this._markers, this._modifiers, this._asteriskToken, this._name, this._typeParameters, this._parameters, this._returnTypeExpression, this._body, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): FunctionDeclaration {
            return markers === this._markers ? this : new FunctionDeclaration(this._id, this._prefix, markers, this._modifiers, this._asteriskToken, this._name, this._typeParameters, this._parameters, this._returnTypeExpression, this._body, this._type);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): FunctionDeclaration {
            return modifiers === this._modifiers ? this : new FunctionDeclaration(this._id, this._prefix, this._markers, modifiers, this._asteriskToken, this._name, this._typeParameters, this._parameters, this._returnTypeExpression, this._body, this._type);
        }

        private readonly _asteriskToken: JLeftPadded<boolean>;

        public get asteriskToken(): boolean {
            return this._asteriskToken.element;
        }

        public withAsteriskToken(asteriskToken: boolean): FunctionDeclaration {
            return this.padding.withAsteriskToken(this._asteriskToken.withElement(asteriskToken));
        }

        private readonly _name: JLeftPadded<Java.Identifier>;

        public get name(): Java.Identifier {
            return this._name.element;
        }

        public withName(name: Java.Identifier): FunctionDeclaration {
            return this.padding.withName(this._name.withElement(name));
        }

        private readonly _typeParameters: Java.TypeParameters | null;

        public get typeParameters(): Java.TypeParameters | null {
            return this._typeParameters;
        }

        public withTypeParameters(typeParameters: Java.TypeParameters | null): FunctionDeclaration {
            return typeParameters === this._typeParameters ? this : new FunctionDeclaration(this._id, this._prefix, this._markers, this._modifiers, this._asteriskToken, this._name, typeParameters, this._parameters, this._returnTypeExpression, this._body, this._type);
        }

        private readonly _parameters: JContainer<Statement>;

        public get parameters(): Statement[] {
            return this._parameters.elements;
        }

        public withParameters(parameters: Statement[]): FunctionDeclaration {
            return this.padding.withParameters(JContainer.withElements(this._parameters, parameters));
        }

        private readonly _returnTypeExpression: TypeTree | null;

        public get returnTypeExpression(): TypeTree | null {
            return this._returnTypeExpression;
        }

        public withReturnTypeExpression(returnTypeExpression: TypeTree | null): FunctionDeclaration {
            return returnTypeExpression === this._returnTypeExpression ? this : new FunctionDeclaration(this._id, this._prefix, this._markers, this._modifiers, this._asteriskToken, this._name, this._typeParameters, this._parameters, returnTypeExpression, this._body, this._type);
        }

        private readonly _body: J | null;

        public get body(): J | null {
            return this._body;
        }

        public withBody(body: J | null): FunctionDeclaration {
            return body === this._body ? this : new FunctionDeclaration(this._id, this._prefix, this._markers, this._modifiers, this._asteriskToken, this._name, this._typeParameters, this._parameters, this._returnTypeExpression, body, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): FunctionDeclaration {
            return _type === this._type ? this : new FunctionDeclaration(this._id, this._prefix, this._markers, this._modifiers, this._asteriskToken, this._name, this._typeParameters, this._parameters, this._returnTypeExpression, this._body, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitFunctionDeclaration(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get asteriskToken(): JLeftPadded<boolean> {
                return t._asteriskToken;
            }
            public withAsteriskToken(asteriskToken: JLeftPadded<boolean>): FunctionDeclaration {
                return t._asteriskToken === asteriskToken ? t : new FunctionDeclaration(t._id, t._prefix, t._markers, t._modifiers, asteriskToken, t._name, t._typeParameters, t._parameters, t._returnTypeExpression, t._body, t._type);
            }
            public get name(): JLeftPadded<Java.Identifier> {
                return t._name;
            }
            public withName(name: JLeftPadded<Java.Identifier>): FunctionDeclaration {
                return t._name === name ? t : new FunctionDeclaration(t._id, t._prefix, t._markers, t._modifiers, t._asteriskToken, name, t._typeParameters, t._parameters, t._returnTypeExpression, t._body, t._type);
            }
            public get parameters(): JContainer<Statement> {
                return t._parameters;
            }
            public withParameters(parameters: JContainer<Statement>): FunctionDeclaration {
                return t._parameters === parameters ? t : new FunctionDeclaration(t._id, t._prefix, t._markers, t._modifiers, t._asteriskToken, t._name, t._typeParameters, parameters, t._returnTypeExpression, t._body, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$TypeLiteral")
export class TypeLiteral extends JSMixin(Object) implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, members: Java.Block, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._members = members;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): TypeLiteral {
            return id === this._id ? this : new TypeLiteral(id, this._prefix, this._markers, this._members, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TypeLiteral {
            return prefix === this._prefix ? this : new TypeLiteral(this._id, prefix, this._markers, this._members, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TypeLiteral {
            return markers === this._markers ? this : new TypeLiteral(this._id, this._prefix, markers, this._members, this._type);
        }

        private readonly _members: Java.Block;

        public get members(): Java.Block {
            return this._members;
        }

        public withMembers(members: Java.Block): TypeLiteral {
            return members === this._members ? this : new TypeLiteral(this._id, this._prefix, this._markers, members, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): TypeLiteral {
            return _type === this._type ? this : new TypeLiteral(this._id, this._prefix, this._markers, this._members, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTypeLiteral(this, p);
    }

}

@LstType("org.openrewrite.javascript.tree.JS$IndexSignatureDeclaration")
export class IndexSignatureDeclaration extends JSMixin(Object) implements Statement, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, modifiers: Java.Modifier[], parameters: JContainer<J>, typeExpression: JLeftPadded<Expression>, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._modifiers = modifiers;
        this._parameters = parameters;
        this._typeExpression = typeExpression;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): IndexSignatureDeclaration {
            return id === this._id ? this : new IndexSignatureDeclaration(id, this._prefix, this._markers, this._modifiers, this._parameters, this._typeExpression, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): IndexSignatureDeclaration {
            return prefix === this._prefix ? this : new IndexSignatureDeclaration(this._id, prefix, this._markers, this._modifiers, this._parameters, this._typeExpression, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): IndexSignatureDeclaration {
            return markers === this._markers ? this : new IndexSignatureDeclaration(this._id, this._prefix, markers, this._modifiers, this._parameters, this._typeExpression, this._type);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): IndexSignatureDeclaration {
            return modifiers === this._modifiers ? this : new IndexSignatureDeclaration(this._id, this._prefix, this._markers, modifiers, this._parameters, this._typeExpression, this._type);
        }

        private readonly _parameters: JContainer<J>;

        public get parameters(): J[] {
            return this._parameters.elements;
        }

        public withParameters(parameters: J[]): IndexSignatureDeclaration {
            return this.padding.withParameters(JContainer.withElements(this._parameters, parameters));
        }

        private readonly _typeExpression: JLeftPadded<Expression>;

        public get typeExpression(): Expression {
            return this._typeExpression.element;
        }

        public withTypeExpression(typeExpression: Expression): IndexSignatureDeclaration {
            return this.padding.withTypeExpression(this._typeExpression.withElement(typeExpression));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): IndexSignatureDeclaration {
            return _type === this._type ? this : new IndexSignatureDeclaration(this._id, this._prefix, this._markers, this._modifiers, this._parameters, this._typeExpression, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitIndexSignatureDeclaration(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get parameters(): JContainer<J> {
                return t._parameters;
            }
            public withParameters(parameters: JContainer<J>): IndexSignatureDeclaration {
                return t._parameters === parameters ? t : new IndexSignatureDeclaration(t._id, t._prefix, t._markers, t._modifiers, parameters, t._typeExpression, t._type);
            }
            public get typeExpression(): JLeftPadded<Expression> {
                return t._typeExpression;
            }
            public withTypeExpression(typeExpression: JLeftPadded<Expression>): IndexSignatureDeclaration {
                return t._typeExpression === typeExpression ? t : new IndexSignatureDeclaration(t._id, t._prefix, t._markers, t._modifiers, t._parameters, typeExpression, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$ArrayBindingPattern")
export class ArrayBindingPattern extends JSMixin(Object) implements Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, elements: JContainer<Expression>, _type: JavaType | null) {
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

        public withId(id: UUID): ArrayBindingPattern {
            return id === this._id ? this : new ArrayBindingPattern(id, this._prefix, this._markers, this._elements, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): ArrayBindingPattern {
            return prefix === this._prefix ? this : new ArrayBindingPattern(this._id, prefix, this._markers, this._elements, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): ArrayBindingPattern {
            return markers === this._markers ? this : new ArrayBindingPattern(this._id, this._prefix, markers, this._elements, this._type);
        }

        private readonly _elements: JContainer<Expression>;

        public get elements(): Expression[] {
            return this._elements.elements;
        }

        public withElements(elements: Expression[]): ArrayBindingPattern {
            return this.padding.withElements(JContainer.withElements(this._elements, elements));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): ArrayBindingPattern {
            return _type === this._type ? this : new ArrayBindingPattern(this._id, this._prefix, this._markers, this._elements, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitArrayBindingPattern(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get elements(): JContainer<Expression> {
                return t._elements;
            }
            public withElements(elements: JContainer<Expression>): ArrayBindingPattern {
                return t._elements === elements ? t : new ArrayBindingPattern(t._id, t._prefix, t._markers, elements, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$BindingElement")
export class BindingElement extends JSMixin(Object) implements Statement, Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, propertyName: JRightPadded<Expression> | null, name: TypedTree, initializer: JLeftPadded<Expression> | null, variableType: JavaType.Variable | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._propertyName = propertyName;
        this._name = name;
        this._initializer = initializer;
        this._variableType = variableType;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): BindingElement {
            return id === this._id ? this : new BindingElement(id, this._prefix, this._markers, this._propertyName, this._name, this._initializer, this._variableType);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): BindingElement {
            return prefix === this._prefix ? this : new BindingElement(this._id, prefix, this._markers, this._propertyName, this._name, this._initializer, this._variableType);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): BindingElement {
            return markers === this._markers ? this : new BindingElement(this._id, this._prefix, markers, this._propertyName, this._name, this._initializer, this._variableType);
        }

        private readonly _propertyName: JRightPadded<Expression> | null;

        public get propertyName(): Expression | null {
            return this._propertyName === null ? null : this._propertyName.element;
        }

        public withPropertyName(propertyName: Expression | null): BindingElement {
            return this.padding.withPropertyName(JRightPadded.withElement(this._propertyName, propertyName));
        }

        private readonly _name: TypedTree;

        public get name(): TypedTree {
            return this._name;
        }

        public withName(name: TypedTree): BindingElement {
            return name === this._name ? this : new BindingElement(this._id, this._prefix, this._markers, this._propertyName, name, this._initializer, this._variableType);
        }

        private readonly _initializer: JLeftPadded<Expression> | null;

        public get initializer(): Expression | null {
            return this._initializer === null ? null : this._initializer.element;
        }

        public withInitializer(initializer: Expression | null): BindingElement {
            return this.padding.withInitializer(JLeftPadded.withElement(this._initializer, initializer));
        }

        private readonly _variableType: JavaType.Variable | null;

        public get variableType(): JavaType.Variable | null {
            return this._variableType;
        }

        public withVariableType(variableType: JavaType.Variable | null): BindingElement {
            return variableType === this._variableType ? this : new BindingElement(this._id, this._prefix, this._markers, this._propertyName, this._name, this._initializer, variableType);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitBindingElement(this, p);
    }

    public get type(): JavaType | null {
        return extensions.getJavaType(this);
    }

    public withType(type: JavaType): BindingElement {
        return extensions.withJavaType(this, type);
    }

    get padding() {
        const t = this;
        return new class {
            public get propertyName(): JRightPadded<Expression> | null {
                return t._propertyName;
            }
            public withPropertyName(propertyName: JRightPadded<Expression> | null): BindingElement {
                return t._propertyName === propertyName ? t : new BindingElement(t._id, t._prefix, t._markers, propertyName, t._name, t._initializer, t._variableType);
            }
            public get initializer(): JLeftPadded<Expression> | null {
                return t._initializer;
            }
            public withInitializer(initializer: JLeftPadded<Expression> | null): BindingElement {
                return t._initializer === initializer ? t : new BindingElement(t._id, t._prefix, t._markers, t._propertyName, t._name, initializer, t._variableType);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$ExportDeclaration")
export class ExportDeclaration extends JSMixin(Object) implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, modifiers: Java.Modifier[], typeOnly: JLeftPadded<boolean>, exportClause: Expression | null, moduleSpecifier: JLeftPadded<Expression> | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._modifiers = modifiers;
        this._typeOnly = typeOnly;
        this._exportClause = exportClause;
        this._moduleSpecifier = moduleSpecifier;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): ExportDeclaration {
            return id === this._id ? this : new ExportDeclaration(id, this._prefix, this._markers, this._modifiers, this._typeOnly, this._exportClause, this._moduleSpecifier);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): ExportDeclaration {
            return prefix === this._prefix ? this : new ExportDeclaration(this._id, prefix, this._markers, this._modifiers, this._typeOnly, this._exportClause, this._moduleSpecifier);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): ExportDeclaration {
            return markers === this._markers ? this : new ExportDeclaration(this._id, this._prefix, markers, this._modifiers, this._typeOnly, this._exportClause, this._moduleSpecifier);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): ExportDeclaration {
            return modifiers === this._modifiers ? this : new ExportDeclaration(this._id, this._prefix, this._markers, modifiers, this._typeOnly, this._exportClause, this._moduleSpecifier);
        }

        private readonly _typeOnly: JLeftPadded<boolean>;

        public get typeOnly(): boolean {
            return this._typeOnly.element;
        }

        public withTypeOnly(typeOnly: boolean): ExportDeclaration {
            return this.padding.withTypeOnly(this._typeOnly.withElement(typeOnly));
        }

        private readonly _exportClause: Expression | null;

        public get exportClause(): Expression | null {
            return this._exportClause;
        }

        public withExportClause(exportClause: Expression | null): ExportDeclaration {
            return exportClause === this._exportClause ? this : new ExportDeclaration(this._id, this._prefix, this._markers, this._modifiers, this._typeOnly, exportClause, this._moduleSpecifier);
        }

        private readonly _moduleSpecifier: JLeftPadded<Expression> | null;

        public get moduleSpecifier(): Expression | null {
            return this._moduleSpecifier === null ? null : this._moduleSpecifier.element;
        }

        public withModuleSpecifier(moduleSpecifier: Expression | null): ExportDeclaration {
            return this.padding.withModuleSpecifier(JLeftPadded.withElement(this._moduleSpecifier, moduleSpecifier));
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitExportDeclaration(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get typeOnly(): JLeftPadded<boolean> {
                return t._typeOnly;
            }
            public withTypeOnly(typeOnly: JLeftPadded<boolean>): ExportDeclaration {
                return t._typeOnly === typeOnly ? t : new ExportDeclaration(t._id, t._prefix, t._markers, t._modifiers, typeOnly, t._exportClause, t._moduleSpecifier);
            }
            public get moduleSpecifier(): JLeftPadded<Expression> | null {
                return t._moduleSpecifier;
            }
            public withModuleSpecifier(moduleSpecifier: JLeftPadded<Expression> | null): ExportDeclaration {
                return t._moduleSpecifier === moduleSpecifier ? t : new ExportDeclaration(t._id, t._prefix, t._markers, t._modifiers, t._typeOnly, t._exportClause, moduleSpecifier);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$ExportAssignment")
export class ExportAssignment extends JSMixin(Object) implements Statement {
    public constructor(id: UUID, prefix: Space, markers: Markers, modifiers: Java.Modifier[], exportEquals: JLeftPadded<boolean>, expression: Expression | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._modifiers = modifiers;
        this._exportEquals = exportEquals;
        this._expression = expression;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): ExportAssignment {
            return id === this._id ? this : new ExportAssignment(id, this._prefix, this._markers, this._modifiers, this._exportEquals, this._expression);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): ExportAssignment {
            return prefix === this._prefix ? this : new ExportAssignment(this._id, prefix, this._markers, this._modifiers, this._exportEquals, this._expression);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): ExportAssignment {
            return markers === this._markers ? this : new ExportAssignment(this._id, this._prefix, markers, this._modifiers, this._exportEquals, this._expression);
        }

        private readonly _modifiers: Java.Modifier[];

        public get modifiers(): Java.Modifier[] {
            return this._modifiers;
        }

        public withModifiers(modifiers: Java.Modifier[]): ExportAssignment {
            return modifiers === this._modifiers ? this : new ExportAssignment(this._id, this._prefix, this._markers, modifiers, this._exportEquals, this._expression);
        }

        private readonly _exportEquals: JLeftPadded<boolean>;

        public get exportEquals(): boolean {
            return this._exportEquals.element;
        }

        public withExportEquals(exportEquals: boolean): ExportAssignment {
            return this.padding.withExportEquals(this._exportEquals.withElement(exportEquals));
        }

        private readonly _expression: Expression | null;

        public get expression(): Expression | null {
            return this._expression;
        }

        public withExpression(expression: Expression | null): ExportAssignment {
            return expression === this._expression ? this : new ExportAssignment(this._id, this._prefix, this._markers, this._modifiers, this._exportEquals, expression);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitExportAssignment(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get exportEquals(): JLeftPadded<boolean> {
                return t._exportEquals;
            }
            public withExportEquals(exportEquals: JLeftPadded<boolean>): ExportAssignment {
                return t._exportEquals === exportEquals ? t : new ExportAssignment(t._id, t._prefix, t._markers, t._modifiers, exportEquals, t._expression);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$NamedExports")
export class NamedExports extends JSMixin(Object) implements Expression {
    public constructor(id: UUID, prefix: Space, markers: Markers, elements: JContainer<Expression>, _type: JavaType | null) {
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

        public withId(id: UUID): NamedExports {
            return id === this._id ? this : new NamedExports(id, this._prefix, this._markers, this._elements, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): NamedExports {
            return prefix === this._prefix ? this : new NamedExports(this._id, prefix, this._markers, this._elements, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): NamedExports {
            return markers === this._markers ? this : new NamedExports(this._id, this._prefix, markers, this._elements, this._type);
        }

        private readonly _elements: JContainer<Expression>;

        public get elements(): Expression[] {
            return this._elements.elements;
        }

        public withElements(elements: Expression[]): NamedExports {
            return this.padding.withElements(JContainer.withElements(this._elements, elements));
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): NamedExports {
            return _type === this._type ? this : new NamedExports(this._id, this._prefix, this._markers, this._elements, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitNamedExports(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get elements(): JContainer<Expression> {
                return t._elements;
            }
            public withElements(elements: JContainer<Expression>): NamedExports {
                return t._elements === elements ? t : new NamedExports(t._id, t._prefix, t._markers, elements, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$ExportSpecifier")
export class ExportSpecifier extends JSMixin(Object) implements Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, typeOnly: JLeftPadded<boolean>, specifier: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._typeOnly = typeOnly;
        this._specifier = specifier;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): ExportSpecifier {
            return id === this._id ? this : new ExportSpecifier(id, this._prefix, this._markers, this._typeOnly, this._specifier, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): ExportSpecifier {
            return prefix === this._prefix ? this : new ExportSpecifier(this._id, prefix, this._markers, this._typeOnly, this._specifier, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): ExportSpecifier {
            return markers === this._markers ? this : new ExportSpecifier(this._id, this._prefix, markers, this._typeOnly, this._specifier, this._type);
        }

        private readonly _typeOnly: JLeftPadded<boolean>;

        public get typeOnly(): boolean {
            return this._typeOnly.element;
        }

        public withTypeOnly(typeOnly: boolean): ExportSpecifier {
            return this.padding.withTypeOnly(this._typeOnly.withElement(typeOnly));
        }

        private readonly _specifier: Expression;

        public get specifier(): Expression {
            return this._specifier;
        }

        public withSpecifier(specifier: Expression): ExportSpecifier {
            return specifier === this._specifier ? this : new ExportSpecifier(this._id, this._prefix, this._markers, this._typeOnly, specifier, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): ExportSpecifier {
            return _type === this._type ? this : new ExportSpecifier(this._id, this._prefix, this._markers, this._typeOnly, this._specifier, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitExportSpecifier(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get typeOnly(): JLeftPadded<boolean> {
                return t._typeOnly;
            }
            public withTypeOnly(typeOnly: JLeftPadded<boolean>): ExportSpecifier {
                return t._typeOnly === typeOnly ? t : new ExportSpecifier(t._id, t._prefix, t._markers, typeOnly, t._specifier, t._type);
            }
        }
    }

}

@LstType("org.openrewrite.javascript.tree.JS$IndexedAccessType")
export class IndexedAccessType extends JSMixin(Object) implements Expression, TypeTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, objectType: TypeTree, indexType: TypeTree, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._objectType = objectType;
        this._indexType = indexType;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): IndexedAccessType {
            return id === this._id ? this : new IndexedAccessType(id, this._prefix, this._markers, this._objectType, this._indexType, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): IndexedAccessType {
            return prefix === this._prefix ? this : new IndexedAccessType(this._id, prefix, this._markers, this._objectType, this._indexType, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): IndexedAccessType {
            return markers === this._markers ? this : new IndexedAccessType(this._id, this._prefix, markers, this._objectType, this._indexType, this._type);
        }

        private readonly _objectType: TypeTree;

        public get objectType(): TypeTree {
            return this._objectType;
        }

        public withObjectType(objectType: TypeTree): IndexedAccessType {
            return objectType === this._objectType ? this : new IndexedAccessType(this._id, this._prefix, this._markers, objectType, this._indexType, this._type);
        }

        private readonly _indexType: TypeTree;

        public get indexType(): TypeTree {
            return this._indexType;
        }

        public withIndexType(indexType: TypeTree): IndexedAccessType {
            return indexType === this._indexType ? this : new IndexedAccessType(this._id, this._prefix, this._markers, this._objectType, indexType, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): IndexedAccessType {
            return _type === this._type ? this : new IndexedAccessType(this._id, this._prefix, this._markers, this._objectType, this._indexType, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitIndexedAccessType(this, p);
    }

}

export namespace IndexedAccessType {
    @LstType("org.openrewrite.javascript.tree.JS$IndexedAccessType$IndexType")
    export class IndexType extends JSMixin(Object) implements Expression, TypeTree {
        public constructor(id: UUID, prefix: Space, markers: Markers, element: JRightPadded<TypeTree>, _type: JavaType | null) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._element = element;
            this._type = _type;
        }

            private readonly _id: UUID;

            public get id(): UUID {
                return this._id;
            }

            public withId(id: UUID): IndexedAccessType.IndexType {
                return id === this._id ? this : new IndexedAccessType.IndexType(id, this._prefix, this._markers, this._element, this._type);
            }

            private readonly _prefix: Space;

            public get prefix(): Space {
                return this._prefix;
            }

            public withPrefix(prefix: Space): IndexedAccessType.IndexType {
                return prefix === this._prefix ? this : new IndexedAccessType.IndexType(this._id, prefix, this._markers, this._element, this._type);
            }

            private readonly _markers: Markers;

            public get markers(): Markers {
                return this._markers;
            }

            public withMarkers(markers: Markers): IndexedAccessType.IndexType {
                return markers === this._markers ? this : new IndexedAccessType.IndexType(this._id, this._prefix, markers, this._element, this._type);
            }

            private readonly _element: JRightPadded<TypeTree>;

            public get element(): TypeTree {
                return this._element.element;
            }

            public withElement(element: TypeTree): IndexedAccessType.IndexType {
                return this.padding.withElement(this._element.withElement(element));
            }

            private readonly _type: JavaType | null;

            public get type(): JavaType | null {
                return this._type;
            }

            public withType(_type: JavaType | null): IndexedAccessType.IndexType {
                return _type === this._type ? this : new IndexedAccessType.IndexType(this._id, this._prefix, this._markers, this._element, _type);
            }

        public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
            return v.visitIndexedAccessTypeIndexType(this, p);
        }

        get padding() {
            const t = this;
            return new class {
                public get element(): JRightPadded<TypeTree> {
                    return t._element;
                }
                public withElement(element: JRightPadded<TypeTree>): IndexedAccessType.IndexType {
                    return t._element === element ? t : new IndexedAccessType.IndexType(t._id, t._prefix, t._markers, element, t._type);
                }
            }
        }

    }

}

@LstType("org.openrewrite.javascript.tree.JS$JsAssignmentOperation")
export class JsAssignmentOperation extends JSMixin(Object) implements Statement, Expression, TypedTree {
    public constructor(id: UUID, prefix: Space, markers: Markers, variable: Expression, operator: JLeftPadded<JsAssignmentOperation.Type>, assignment: Expression, _type: JavaType | null) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._variable = variable;
        this._operator = operator;
        this._assignment = assignment;
        this._type = _type;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): JsAssignmentOperation {
            return id === this._id ? this : new JsAssignmentOperation(id, this._prefix, this._markers, this._variable, this._operator, this._assignment, this._type);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): JsAssignmentOperation {
            return prefix === this._prefix ? this : new JsAssignmentOperation(this._id, prefix, this._markers, this._variable, this._operator, this._assignment, this._type);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): JsAssignmentOperation {
            return markers === this._markers ? this : new JsAssignmentOperation(this._id, this._prefix, markers, this._variable, this._operator, this._assignment, this._type);
        }

        private readonly _variable: Expression;

        public get variable(): Expression {
            return this._variable;
        }

        public withVariable(variable: Expression): JsAssignmentOperation {
            return variable === this._variable ? this : new JsAssignmentOperation(this._id, this._prefix, this._markers, variable, this._operator, this._assignment, this._type);
        }

        private readonly _operator: JLeftPadded<JsAssignmentOperation.Type>;

        public get operator(): JsAssignmentOperation.Type {
            return this._operator.element;
        }

        public withOperator(operator: JsAssignmentOperation.Type): JsAssignmentOperation {
            return this.padding.withOperator(this._operator.withElement(operator));
        }

        private readonly _assignment: Expression;

        public get assignment(): Expression {
            return this._assignment;
        }

        public withAssignment(assignment: Expression): JsAssignmentOperation {
            return assignment === this._assignment ? this : new JsAssignmentOperation(this._id, this._prefix, this._markers, this._variable, this._operator, assignment, this._type);
        }

        private readonly _type: JavaType | null;

        public get type(): JavaType | null {
            return this._type;
        }

        public withType(_type: JavaType | null): JsAssignmentOperation {
            return _type === this._type ? this : new JsAssignmentOperation(this._id, this._prefix, this._markers, this._variable, this._operator, this._assignment, _type);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitJsAssignmentOperation(this, p);
    }

    get padding() {
        const t = this;
        return new class {
            public get operator(): JLeftPadded<JsAssignmentOperation.Type> {
                return t._operator;
            }
            public withOperator(operator: JLeftPadded<JsAssignmentOperation.Type>): JsAssignmentOperation {
                return t._operator === operator ? t : new JsAssignmentOperation(t._id, t._prefix, t._markers, t._variable, operator, t._assignment, t._type);
            }
        }
    }

}

export namespace JsAssignmentOperation {
    export enum Type {
            QuestionQuestion = 0,
            And = 1,
            Or = 2,
            Power = 3,

    }

}

@LstType("org.openrewrite.javascript.tree.JS$TypeTreeExpression")
export class TypeTreeExpression extends JSMixin(Object) implements Expression, TypeTree {
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

        public withId(id: UUID): TypeTreeExpression {
            return id === this._id ? this : new TypeTreeExpression(id, this._prefix, this._markers, this._expression);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): TypeTreeExpression {
            return prefix === this._prefix ? this : new TypeTreeExpression(this._id, prefix, this._markers, this._expression);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): TypeTreeExpression {
            return markers === this._markers ? this : new TypeTreeExpression(this._id, this._prefix, markers, this._expression);
        }

        private readonly _expression: Expression;

        public get expression(): Expression {
            return this._expression;
        }

        public withExpression(expression: Expression): TypeTreeExpression {
            return expression === this._expression ? this : new TypeTreeExpression(this._id, this._prefix, this._markers, expression);
        }

    public acceptJavaScript<P>(v: JavaScriptVisitor<P>, p: P): J | null {
        return v.visitTypeTreeExpression(this, p);
    }

    public get type(): JavaType | null {
        return extensions.getJavaType(this);
    }

    public withType(type: JavaType): TypeTreeExpression {
        return extensions.withJavaType(this, type);
    }

}
