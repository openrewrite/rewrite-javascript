import * as ts from "typescript";

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
    1251, 1252, 1253, 1254, 1308, 1314, 1315, 1324, 1329, 1335, 1338, 1340, 1343, 1344, 1345, 1355, 1360, 1378, 1432]);

function isCriticalDiagnostic(code: number): boolean {
    return (code > 1000 && code < 2000 && !excludedCodes.has(code)) || additionalCriticalCodes.has(code);
}
