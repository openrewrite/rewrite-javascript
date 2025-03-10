import * as J from '../../java';
import * as JS from '..';
import {ClassDeclaration, Space} from '../../java';
import {Cursor, InMemoryExecutionContext} from "../../core";
import {JavaScriptVisitor} from "..";
import {BlankLinesStyle} from "../style";

export class BlankLinesFormatVisitor extends JavaScriptVisitor<InMemoryExecutionContext> {
    private style: BlankLinesStyle;

    constructor(style: BlankLinesStyle) {
        super();
        this.style = style;
        this.cursor = new Cursor(null, Cursor.ROOT_VALUE);
    }

    visitJsCompilationUnit(compilationUnit: JS.CompilationUnit, p: InMemoryExecutionContext): J.J | null {
        if (compilationUnit.prefix.comments.length == 0) {
            compilationUnit = compilationUnit.withPrefix(Space.EMPTY);
        }
        return super.visitJsCompilationUnit(compilationUnit, p);
    }

    visitStatement(statement: J.Statement, p: InMemoryExecutionContext): J.J {
        statement = super.visitStatement(statement, p);

        const parentCursor = this.cursor.parentTreeCursor();
        const topLevel = parentCursor.value() instanceof JS.CompilationUnit;

        let prevBlankLine: number | null | undefined;
        const blankLines = this.getBlankLines(statement, parentCursor);
        if (blankLines) {
            prevBlankLine = parentCursor.getMessage('prev_blank_line', undefined);
            parentCursor.putMessage('prev_blank_line', blankLines);
        } else {
            prevBlankLine = parentCursor.getMessage('prev_blank_line', undefined);
            if (prevBlankLine) {
                parentCursor.putMessage('prev_blank_line', undefined);
            }
        }

        if (topLevel) {
            const isFirstStatement = p.getMessage<boolean>('is_first_statement', true) ?? true;
            if (isFirstStatement) {
                p.putMessage('is_first_statement', false);
            } else {
                const minLines = statement instanceof JS.JsImport ? 0 : max(prevBlankLine, blankLines);
                statement = adjustedLinesForTree(statement, minLines, this.style.keepMaximum.inCode);
            }
        } else {
            const inBlock = parentCursor.value() instanceof J.Block;
            const inClass = inBlock && parentCursor.parentTreeCursor().value() instanceof J.ClassDeclaration;
            let minLines = 0;

            if (inClass) {
                const isFirst = (parentCursor.value() as J.Block).statements[0] === statement;
                minLines = isFirst ? 0 : max(blankLines, prevBlankLine);
            }

            statement = adjustedLinesForTree(statement, minLines, this.style.keepMaximum.inCode);
        }
        return statement;
    }

    getBlankLines(statement: J.Statement, cursor: Cursor): number | undefined {
        const inBlock = cursor.value() instanceof J.Block;
        let type;
        if (inBlock) {
            const val = cursor.parentTreeCursor().value();
            if (val instanceof J.ClassDeclaration) {
                type = val.padding.kind.type;
            }
        }

        if (type === ClassDeclaration.Kind.Type.Interface && (statement instanceof J.MethodDeclaration || statement instanceof JS.JSMethodDeclaration)) {
            return this.style.minimum.aroundMethodInInterface ?? undefined;
        } else if (type === ClassDeclaration.Kind.Type.Interface && (statement instanceof J.VariableDeclarations || statement instanceof JS.JSVariableDeclarations)) {
            return this.style.minimum.aroundFieldInInterface ?? undefined;
        } else if (type === ClassDeclaration.Kind.Type.Class && (statement instanceof J.VariableDeclarations || statement instanceof JS.JSVariableDeclarations)) {
            return this.style.minimum.aroundField;
        } else if (statement instanceof JS.JsImport) {
            return this.style.minimum.afterImports;
        } else if (statement instanceof J.ClassDeclaration) {
            return this.style.minimum.aroundClass;
        } else if (statement instanceof J.MethodDeclaration || statement instanceof JS.JSMethodDeclaration) {
            return this.style.minimum.aroundMethod;
        } else if (statement instanceof JS.FunctionDeclaration) {
            return this.style.minimum.aroundFunction;
        } else {
            return undefined;
        }
    }

}

function adjustedLinesForTree(tree: J.J, minLines: number, maxLines: number): J.J {
        const prefix = tree.prefix;
        return tree.withPrefix(adjustedLinesForSpace(prefix, minLines, maxLines));
}

function adjustedLinesForSpace(prefix: Space, minLines: number, maxLines: number): Space {
    if (prefix.comments.length == 0 || prefix.whitespace?.includes('\n')) {
        return prefix.withWhitespace(adjustedLinesForString(prefix.whitespace ?? '', minLines, maxLines));
    }

    return prefix;
}

function adjustedLinesForString(whitespace: string, minLines: number, maxLines: number): string {
    const existingBlankLines = Math.max(countLineBreaks(whitespace) - 1, 0);
    maxLines = Math.max(minLines, maxLines);

    if (existingBlankLines >= minLines && existingBlankLines <= maxLines) {
        return whitespace;
    } else if (existingBlankLines < minLines) {
        return '\n'.repeat(minLines - existingBlankLines) + whitespace;
    } else {
        return '\n'.repeat(maxLines) + whitespace.substring(whitespace.lastIndexOf('\n'));
    }
}

function countLineBreaks(whitespace: string): number {
    return (whitespace.match(/\n/g) || []).length;
}

function max(x: number | null | undefined, y: number | null | undefined) {
    if (x && y) {
        return Math.max(x, y);
    } else {
        return x ? x : y ? y : 0;
    }
}
