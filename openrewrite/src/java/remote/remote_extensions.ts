import {Comment, JContainer, JLeftPadded, JRightPadded, Space, TextComment} from "../tree";
import {DetailsReceiver, ReceiverContext, SenderContext, ValueType} from "@openrewrite/rewrite-remote";
import {Tree} from "../../core";

export function sendSpace(space: Space, ctx: SenderContext) {
    ctx.sendNodes(space, v => v.comments, sendComment, x => x);
    ctx.sendValue(space, v => v.whitespace, ValueType.Primitive);
}

export function sendComment(comment: Comment, ctx: SenderContext) {
    ctx.sendValue(comment, v => v.multiline, ValueType.Primitive);
    if (comment instanceof TextComment) {
        ctx.sendValue(comment, v => v.text, ValueType.Primitive);
    } else {
        // FIXME add support for Javadoc
        ctx.sendValue(comment, v => "", ValueType.Primitive);
    }
    ctx.sendValue(comment, v => v.suffix, ValueType.Primitive);
    ctx.sendNode(comment, v => v.markers, ctx.sendMarkers);
}

export function sendContainer<T>(type: ValueType): (container: JContainer<T>, ctx: SenderContext) => void {
    return (container: JContainer<T>, ctx: SenderContext) => {
        ctx.sendNode(container, v => v.before, sendSpace);
        ctx.sendNodes(container, v => v.padding.elements, sendRightPadded(ValueType.Tree), e => (e.element as Tree).id);
        ctx.sendNode(container, v => v.markers, ctx.sendMarkers);
    }
}

export function sendLeftPadded<T>(type: ValueType): (leftPadded: JLeftPadded<T>, ctx: SenderContext) => void {
    return (leftPadded: JLeftPadded<T>, ctx: SenderContext) => {
        ctx.sendNode(leftPadded, v => v.before, sendSpace);
        switch (type) {
            case ValueType.Tree:
                ctx.sendNode(leftPadded, e => e.element as Tree, ctx.sendTree);
                break;
            case ValueType.Object:
                if (leftPadded.element instanceof Space) {
                    ctx.sendNode(leftPadded, e => e.element as Space, sendSpace);
                    break;
                }
            // fall-through
            default:
                ctx.sendValue(leftPadded, e => e.element, type);
        }
        ctx.sendNode(leftPadded, v => v.markers, ctx.sendMarkers);
    }
}

export function sendRightPadded<T>(type: ValueType): (rightPadded: JRightPadded<T>, ctx: SenderContext) => void {
    return (rightPadded: JRightPadded<T>, ctx: SenderContext) => {
        switch (type) {
            case ValueType.Tree:
                ctx.sendNode(rightPadded, e => e.element as Tree, ctx.sendTree);
                break;
            case ValueType.Object:
                if (rightPadded.element instanceof Space) {
                    ctx.sendNode(rightPadded, e => e.element as Space, sendSpace);
                    break;
                }
            // fall-through
            default:
                ctx.sendValue(rightPadded, e => e.element, type);
        }
        ctx.sendNode(rightPadded, v => v.after, sendSpace);
        ctx.sendNode(rightPadded, v => v.markers, ctx.sendMarkers);
    }
}

export function receiveContainer<T>(container: JContainer<T> | null, type: string | null, ctx: ReceiverContext): JContainer<T> {
    // FIXME
    throw new Error("Not implemented!");
}

export function leftPaddedValueReceiver<T>(type: any): DetailsReceiver<JLeftPadded<T>> {
    // FIXME
    throw new Error("Not implemented!");
}

export function leftPaddedNodeReceiver<T>(type: any): DetailsReceiver<JLeftPadded<T>> {
    // FIXME
    throw new Error("Not implemented!");
}

export function receiveLeftPaddedTree<T extends Tree>(leftPadded: JLeftPadded<T> | null, type: string | null, ctx: ReceiverContext): JLeftPadded<T> {
    // FIXME
    throw new Error("Not implemented!");
}

export function rightPaddedValueReceiver<T>(valueType: any): DetailsReceiver<JRightPadded<T>> {
    return (rightPadded, type, ctx): JRightPadded<T> => {
        if (rightPadded != null) {
            rightPadded = rightPadded.withElement(ctx.receiveValue(rightPadded.element, valueType)!);
            rightPadded = rightPadded.withAfter(ctx.receiveNode(rightPadded.after, receiveSpace)!);
            rightPadded = rightPadded.withMarkers(ctx.receiveNode(rightPadded.markers, ctx.receiveMarkers)!);
        } else {
            rightPadded = new JRightPadded<T>(
                ctx.receiveValue(null, valueType)!,
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!
            );
        }
        return rightPadded;
    };
}

export function rightPaddedNodeReceiver<T>(type: any): DetailsReceiver<JRightPadded<T>> {
    // FIXME
    throw new Error("Not implemented!");
}

export function receiveRightPaddedTree<T extends Tree>(rightPadded: JRightPadded<T> | null, type: string | null, ctx: ReceiverContext): JRightPadded<T> {
    // FIXME
    throw new Error("Not implemented!");
}

export function receiveSpace(space: Space | null, type: string | null, ctx: ReceiverContext): Space {
    if (space) {
        space = space.withComments(ctx.receiveNodes(space.comments, receiveComment)!);
        space = space.withWhitespace(ctx.receiveValue(space.whitespace, ValueType.Primitive));
    } else {
        space = Space.build(
            ctx.receiveNodes(null, receiveComment)!,
            ctx.receiveValue(null, ValueType.Primitive)
        );
    }
    return space;
}

function receiveComment(comment: Comment | null, type: string | null, ctx: ReceiverContext): Comment {
    throw new Error("Not implemented!");
}
