import * as J from '../../java';
import * as JS from '..';
import {JavaScriptVisitor} from "..";
import {Cursor, InMemoryExecutionContext} from "../../core";
import {Space, TextComment} from '../../java';

export class NormalizeFormatVisitor extends JavaScriptVisitor<InMemoryExecutionContext> {

    constructor() {
        super();
        this.cursor = new Cursor(null, Cursor.ROOT_VALUE);
    }

    visitScopedVariableDeclarations(scopedVariableDeclarations: JS.ScopedVariableDeclarations, p: InMemoryExecutionContext): J.J | null {
        let vd = super.visitScopedVariableDeclarations(scopedVariableDeclarations, p) as JS.ScopedVariableDeclarations;

        if (vd.padding.scope) {
            vd = concatenatePrefix(vd, vd.padding.scope.before);
            if (vd.padding.scope) {
                vd = vd.padding.withScope(vd.padding.scope.withBefore(Space.EMPTY));
            }
        }

        return vd;
    }

}

function concatenatePrefix<J2 extends J.J>(j: J2, prefix: Space): J2 {
    const shift = commonMargin(null, j.prefix.whitespace ?? "");

    const comments = [
        ...j.prefix.comments,
        ...prefix.comments.map((comment) => {
            let c = comment;

            if (shift === "") {
                return c;
            }

            if (c instanceof TextComment) {
                const textComment = c as TextComment;
                c = textComment.withText(textComment.text.replace("\n", "\n" + shift));
            }

            if (c.suffix.includes("\n")) {
                c = c.withSuffix(c.suffix.replace("\n", "\n" + shift));
            }

            return c;
        })
    ];

    return j.withPrefix(
                j.prefix.withWhitespace((j.prefix.whitespace ?? "") + (prefix.whitespace ?? ""))
                .withComments(comments)
    ) as J2;
}


function commonMargin(s1: string | null, s2: string): string {
    if (s1 === null) {
        const s = s2.toString();
        return s.substring(s.lastIndexOf('\n') + 1);
    }
    for (let i = 0; i < s1.length && i < s2.length; i++) {
        if (s1.charAt(i) !== s2.charAt(i) || !/\s/.test(s1.charAt(i))) {
            return s1.substring(0, i);
        }
    }
    return s2.length < s1.length ? s2 : s1;
}
