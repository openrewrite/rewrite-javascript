import * as ts from "typescript";
import * as J from '../java'
import * as JS from "./tree";

const is_statements = [
    J.Assert,
    J.Assignment,
    J.AssignmentOperation,
    J.Block,
    J.Break,
    J.Case,
    J.ClassDeclaration,
    J.Continue,
    J.Empty,
    J.EnumValueSet,
    J.Erroneous,
    J.FieldAccess,
    J.If,
    J.Import,
    J.Label,
    J.Lambda,
    J.MethodDeclaration,
    J.MethodInvocation,
    J.NewClass,
    J.Package,
    J.Return,
    J.Switch,
    J.Synchronized,
    J.Ternary,
    J.Throw,
    J.Try,
    J.Unary,
    J.Unknown,
    J.VariableDeclarations,
    J.Yield,
    JS.ArrowFunction,
    JS.BindingElement,
    JS.Delete,
    JS.Export,
    JS.ExportAssignment,
    JS.ExportDeclaration,
    JS.FunctionDeclaration,
    JS.ImportAttribute,
    JS.IndexSignatureDeclaration,
    JS.JsAssignmentOperation,
    JS.JsImport,
    JS.JSMethodDeclaration,
    JS.JSTry,
    JS.JSVariableDeclarations,
    JS.MappedType.KeysRemapping,
    JS.MappedType.MappedTypeParameter,
    JS.NamespaceDeclaration,
    JS.PropertyAssignment,
    JS.ScopedVariableDeclarations,
    JS.TaggedTemplateExpression,
    JS.TemplateExpression,
    JS.TrailingTokenStatement,
    JS.TypeDeclaration,
    JS.Unary,
    JS.Void,
    JS.WithStatement,
    JS.ExpressionStatement,
    JS.StatementExpression
]

const is_expressions = [
    J.AnnotatedType,
    J.Annotation,
    J.ArrayAccess,
    J.ArrayType,
    J.Assignment,
    J.AssignmentOperation,
    J.Binary,
    J.ControlParentheses,
    J.Empty,
    J.Erroneous,
    J.FieldAccess,
    J.Identifier,
    J.InstanceOf,
    J.IntersectionType,
    J.Lambda,
    J.Literal,
    J.MethodInvocation,
    J.MemberReference,
    J.NewArray,
    J.NewClass,
    J.NullableType,
    J.ParameterizedType,
    J.Parentheses,
    J.ParenthesizedTypeTree,
    J.Primitive,
    J.SwitchExpression,
    J.Ternary,
    J.TypeCast,
    J.Unary,
    J.Unknown,
    J.Wildcard,
    JS.Alias,
    JS.ArrayBindingPattern,
    JS.ArrowFunction,
    JS.Await,
    JS.BindingElement,
    JS.ConditionalType,
    JS.DefaultType,
    JS.Delete,
    JS.ExportSpecifier,
    JS.ExpressionWithTypeArguments,
    JS.FunctionDeclaration,
    JS.FunctionType,
    JS.ImportType,
    JS.IndexedAccessType,
    JS.IndexedAccessType.IndexType,
    JS.InferType,
    JS.Intersection,
    JS.JsAssignmentOperation,
    JS.JsBinary,
    JS.JsImportSpecifier,
    JS.LiteralType,
    JS.MappedType,
    JS.NamedExports,
    JS.NamedImports,
    JS.ObjectBindingDeclarations,
    JS.SatisfiesExpression,
    JS.TaggedTemplateExpression,
    JS.TemplateExpression,
    JS.TrailingTokenStatement,
    JS.Tuple,
    JS.TypeInfo,
    JS.TypeLiteral,
    JS.TypeOf,
    JS.TypeOperator,
    JS.TypePredicate,
    JS.TypeQuery,
    JS.TypeTreeExpression,
    JS.Unary,
    JS.Union,
    JS.Void,
    JS.Yield
]

export function isStatement(statement: J.J):  statement is J.Statement {
    return is_statements.some((cls: any) => statement instanceof cls);
}

export function isExpression(expression: J.J):  expression is J.Expression {
    return is_expressions.some((cls: any) => expression instanceof cls);
}

export function getNextSibling(node: ts.Node): ts.Node | null {
    const parent = node.parent;
    if (!parent) {
        return null;
    }

    const syntaxList = findContainingSyntaxList(node);

    if (syntaxList) {
        const children = syntaxList.getChildren();
        const nodeIndex = children.indexOf(node);

        if (nodeIndex === -1) {
            throw new Error('Node not found among SyntaxList\'s children.');
        }

        // If the node is the last child in the SyntaxList, recursively check the parent's next sibling
        if (nodeIndex === children.length - 1) {
            const syntaxListIndex = parent.getChildren().indexOf(syntaxList);
            if (parent.getChildCount() > syntaxListIndex + 1) {
                return parent.getChildAt(syntaxListIndex + 1);
            }
            const parentNextSibling = getNextSibling(parent);
            if (!parentNextSibling) {
                return null;
            }

            // Return the first child of the parent's next sibling
            const parentSyntaxList = findContainingSyntaxList(parentNextSibling);
            if (parentSyntaxList) {
                const siblings = parentSyntaxList.getChildren();
                return siblings[0] || null;
            } else {
                return parentNextSibling;
            }
        }

        // Otherwise, return the next sibling in the SyntaxList
        return children[nodeIndex + 1];
    }

    const parentChildren = parent.getChildren();
    const nodeIndex = parentChildren.indexOf(node);

    if (nodeIndex === -1) {
        throw new Error('Node not found among parent\'s children.');
    }

    // If the node is the last child, recursively check the parent's next sibling
    if (nodeIndex === parentChildren.length - 1) {
        const parentNextSibling = getNextSibling(parent);
        if (!parentNextSibling) {
            return null;
        }

        // Return the first child of the parent's next sibling
        return parentNextSibling.getChildCount() > 0 ? parentNextSibling.getChildAt(0) : parentNextSibling;
    }

    // Otherwise, return the next sibling
    return parentChildren[nodeIndex + 1];
}

export function getPreviousSibling(node: ts.Node): ts.Node | null {
    const parent = node.parent;
    if (!parent) {
        return null;
    }

    const syntaxList = findContainingSyntaxList(node);

    if (syntaxList) {
        const children = syntaxList.getChildren();
        const nodeIndex = children.indexOf(node);

        if (nodeIndex === -1) {
            throw new Error('Node not found among SyntaxList\'s children.');
        }

        // If the node is the first child in the SyntaxList, recursively check the parent's previous sibling
        if (nodeIndex === 0) {
            const parentPreviousSibling = getPreviousSibling(parent);
            if (!parentPreviousSibling) {
                return null;
            }

            // Return the last child of the parent's previous sibling
            const parentSyntaxList = findContainingSyntaxList(parentPreviousSibling);
            if (parentSyntaxList) {
                const siblings = parentSyntaxList.getChildren();
                return siblings[siblings.length - 1] || null;
            } else {
                return parentPreviousSibling;
            }
        }

        // Otherwise, return the previous sibling in the SyntaxList
        return children[nodeIndex - 1];
    }

    const parentChildren = parent.getChildren();
    const nodeIndex = parentChildren.indexOf(node);

    if (nodeIndex === -1) {
        throw new Error('Node not found among parent\'s children.');
    }

    // If the node is the first child, recursively check the parent's previous sibling
    if (nodeIndex === 0) {
        const parentPreviousSibling = getPreviousSibling(parent);
        if (!parentPreviousSibling) {
            return null;
        }

        // Return the last child of the parent's previous sibling
        return parentPreviousSibling.getChildCount() > 0 ? parentPreviousSibling.getLastToken()! : parentPreviousSibling;
    }

    // Otherwise, return the previous sibling
    return parentChildren[nodeIndex - 1];
}

function findContainingSyntaxList(node: ts.Node): ts.SyntaxList | null {
    const parent = node.parent;
    if (!parent) {
        return null;
    }

    const children = parent.getChildren();
    for (const child of children) {
        if (child.kind == ts.SyntaxKind.SyntaxList && child.getChildren().includes(node)) {
            return child as ts.SyntaxList;
        }
    }

    return null;
}

export type TextSpan = [number, number];

export function compareTextSpans(span1: TextSpan, span2: TextSpan) {
    // First, compare the first elements
    if (span1[0] < span2[0]) {
        return -1;
    }
    if (span1[0] > span2[0]) {
        return 1;
    }

    // If the first elements are equal, compare the second elements
    if (span1[1] < span2[1]) {
        return -1;
    }
    if (span1[1] > span2[1]) {
        return 1;
    }

    // If both elements are equal, the tuples are considered equal
    return 0;
}

export function binarySearch<T>(arr: T[], target: T, compare: (a: T, b: T) => number) {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        const comparison = compare(arr[mid], target);

        if (comparison === 0) {
            return mid;  // Element found, return index
        } else if (comparison < 0) {
            low = mid + 1;  // Search the right half
        } else {
            high = mid - 1;  // Search the left half
        }
    }
    return ~low;  // Element not found, return bitwise complement of the insertion point
}

export function hasFlowAnnotation(sourceFile: ts.SourceFile) {
    if (sourceFile.fileName.endsWith('.js') || sourceFile.fileName.endsWith('.jsx')) {
        const comments = sourceFile.getFullText().match(/\/\*[\s\S]*?\*\/|\/\/.*(?=[\r\n])/g);
        if (comments) {
            return comments.some(comment => comment.includes("@flow"));
        }
    }
    return false;
}

export function checkSyntaxErrors(program: ts.Program, sourceFile: ts.SourceFile) {
    const diagnostics = ts.getPreEmitDiagnostics(program, sourceFile);
    // checking Parsing and Syntax Errors
    let syntaxErrors : [errorMsg: string, errorCode: number][] = [];
    if (diagnostics.length > 0) {
        const errors = diagnostics.filter(d =>  (d.category === ts.DiagnosticCategory.Error) && isCriticalDiagnostic(d.code));
        if (errors.length > 0) {
            syntaxErrors = errors.map(e => {
                let errorMsg;
                if (e.file) {
                    let {line, character} = ts.getLineAndCharacterOfPosition(e.file, e.start!);
                    let message = ts.flattenDiagnosticMessageText(e.messageText, "\n");
                    errorMsg = `(${line + 1},${character + 1}): ${message}`;
                } else {
                    errorMsg = ts.flattenDiagnosticMessageText(e.messageText, "\n");
                }
                return [errorMsg, e.code];
            });
        }
    }
    return syntaxErrors;
}

const additionalCriticalCodes = new Set([
    // Syntax errors
    17019, // "'{0}' at the end of a type is not valid TypeScript syntax. Did you mean to write '{1}'?"
    17020, // "'{0}' at the start of a type is not valid TypeScript syntax. Did you mean to write '{1}'?"

    // Other critical errors
]);

// errors code description available at https://github.com/microsoft/TypeScript/blob/main/src/compiler/diagnosticMessages.json
const excludedCodes = new Set([1039, 1064, 1101, 1107, 1111, 1155, 1166, 1170, 1183, 1203, 1207, 1215, 1238, 1239, 1240, 1241, 1244, 1250,
    1251, 1252, 1253, 1254, 1308, 1314, 1315, 1324, 1329, 1335, 1338, 1340, 1343, 1344, 1345, 1355, 1360, 1375, 1378, 1432]);

function isCriticalDiagnostic(code: number): boolean {
    return (code > 1000 && code < 2000 && !excludedCodes.has(code)) || additionalCriticalCodes.has(code);
}

export function isValidSurrogateRange(unicodeString: string): boolean {
    const matches = unicodeString.match(/(?<!\\)\\u([a-fA-F0-9]{4})/g);

    if (!matches) {
        return true;
    }

    const codes = matches.map(m => {
        const codePointStr = m.slice(2);
        const codePoint = parseInt(codePointStr, 16);
        return codePoint;
    });

    const isHighSurrogate = (charCode: number): boolean => charCode >= 0xD800 && charCode <= 0xDBFF;
    const isLowSurrogate = (charCode: number): boolean => charCode >= 0xDC00 && charCode <= 0xDFFF;

    for (let i = 0; i < codes.length; i++) {
        const c = codes[i];

        if (isHighSurrogate(c)) {
            // Ensure that the high surrogate is followed by a valid low surrogate
            if (i + 1 >= codes.length || !isLowSurrogate(codes[i + 1])) {
                return false; // Invalid high surrogate or no low surrogate after it
            }
            i++; // Skip the low surrogate
        } else if (isLowSurrogate(c)) {
            return false; // Lone low surrogate (not preceded by a high surrogate)
        }
    }
    return true;
}
