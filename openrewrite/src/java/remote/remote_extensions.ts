import {Comment, JContainer, JLeftPadded, JRightPadded, Space, TextComment} from "../tree";
import {DetailsReceiver, ReceiverContext, SenderContext, ValueType} from "@openrewrite/rewrite-remote";
import {Markers, Tree} from "../../core";

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
    if (container != null) {
        container = container.withBefore(ctx.receiveNode(container.before, receiveSpace)!);
        container = container.padding.withElements(
            ctx.receiveNodes(container.padding.elements, receiveRightPaddedTree)!
        );
        container = container!.withMarkers(ctx.receiveNode(container.markers, ctx.receiveMarkers)!);
    } else {
        container = JContainer.build(
            ctx.receiveNode<Space>(null, receiveSpace)!,
            ctx.receiveNodes<JRightPadded<T>>(null, receiveRightPaddedTree)!,
            ctx.receiveNode<Markers>(null, ctx.receiveMarkers)!
        );
    }
    return container;
}

export function leftPaddedValueReceiver<T>(valueType: any): DetailsReceiver<JLeftPadded<T>> {
    return (leftPadded, type, ctx): JLeftPadded<T> => {
        if (leftPadded != null) {
            leftPadded = leftPadded.withBefore(ctx.receiveNode(leftPadded.before, receiveSpace)!);
            leftPadded = leftPadded.withElement(ctx.receiveValue(leftPadded.element, valueType)!);
            leftPadded = leftPadded.withMarkers(ctx.receiveNode(leftPadded.markers, ctx.receiveMarkers)!);
        } else {
            leftPadded = new JLeftPadded<T>(
                ctx.receiveNode(null, receiveSpace)!,
                ctx.receiveValue(null, valueType)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!
            );
        }
        return leftPadded;
    };
}

export function leftPaddedNodeReceiver<T>(type: any): DetailsReceiver<JLeftPadded<T>> {
    if (type === Space || type.name === 'Space') {
        return function (leftPadded: JLeftPadded<Space>, t: string | null, ctx: ReceiverContext): JLeftPadded<Space> {
            if (leftPadded !== null) {
                leftPadded = leftPadded.withBefore(ctx.receiveNode<Space>(leftPadded.before, receiveSpace)!);
                leftPadded = leftPadded.withElement(ctx.receiveNode(leftPadded.element, receiveSpace)!);
                leftPadded = leftPadded.withMarkers(ctx.receiveNode(leftPadded.markers, ctx.receiveMarkers)!);
            } else {
                leftPadded = new JLeftPadded<Space>(
                    ctx.receiveNode(null, receiveSpace)!,
                    ctx.receiveNode(null, receiveSpace)!,
                    ctx.receiveNode(null, ctx.receiveMarkers)
                );
            }
            return leftPadded;
        } as unknown as DetailsReceiver<JLeftPadded<T>>;
    }
    throw new Error("Not implemented!");
}

export function receiveLeftPaddedTree<T extends Tree>(leftPadded: JLeftPadded<T> | null, type: string | null, ctx: ReceiverContext): JLeftPadded<T> {
    if (leftPadded !== null) {
        leftPadded = leftPadded.withBefore(ctx.receiveNode<Space>(leftPadded.before, receiveSpace)!);
        leftPadded = leftPadded.withElement(ctx.receiveNode(leftPadded.element, ctx.receiveTree)!);
        leftPadded = leftPadded.withMarkers(ctx.receiveNode(leftPadded.markers, ctx.receiveMarkers)!);
    } else {
        leftPadded = new JLeftPadded<T>(
            ctx.receiveNode(null, receiveSpace)!,
            ctx.receiveNode(null, ctx.receiveTree)!,
            ctx.receiveNode(null, ctx.receiveMarkers)
        );
    }
    return leftPadded;
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
    if (type === Space || type.name === 'Space') {
        return function (rightPadded: JRightPadded<Space>, t: string | null, ctx: ReceiverContext): JRightPadded<Space> {
            if (rightPadded !== null) {
                rightPadded = rightPadded.withElement(ctx.receiveNode(rightPadded.element, receiveSpace)!);
                rightPadded = rightPadded.withAfter(ctx.receiveNode<Space>(rightPadded.after, receiveSpace)!);
                rightPadded = rightPadded.withMarkers(ctx.receiveNode(rightPadded.markers, ctx.receiveMarkers)!);
            } else {
                rightPadded = new JRightPadded<Space>(
                    ctx.receiveNode(null, receiveSpace)!,
                    ctx.receiveNode(null, receiveSpace)!,
                    ctx.receiveNode(null, ctx.receiveMarkers)
                );
            }
            return rightPadded;
        } as unknown as DetailsReceiver<JRightPadded<T>>;
    }
    throw new Error("Not implemented!");
}

export function receiveRightPaddedTree<T extends Tree>(rightPadded: JRightPadded<T> | null, type: string | null, ctx: ReceiverContext): JRightPadded<T> {
    if (rightPadded !== null) {
        rightPadded = rightPadded.withElement(ctx.receiveNode(rightPadded.element, ctx.receiveTree)!);
        rightPadded = rightPadded.withAfter(ctx.receiveNode<Space>(rightPadded.after, receiveSpace)!);
        rightPadded = rightPadded.withMarkers(ctx.receiveNode(rightPadded.markers, ctx.receiveMarkers)!);
    } else {
        rightPadded = new JRightPadded<T>(
            ctx.receiveNode(null, ctx.receiveTree)!,
            ctx.receiveNode(null, receiveSpace)!,
            ctx.receiveNode(null, ctx.receiveMarkers)
        );
    }
    return rightPadded;
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
    if (comment instanceof TextComment) {
        comment = comment.withMultiline(ctx.receiveValue(comment.multiline, ValueType.Primitive)!);
        comment = (comment as TextComment).withText(ctx.receiveValue((comment as TextComment).text, ValueType.Primitive)!);
        comment = comment.withSuffix(ctx.receiveValue(comment.suffix, ValueType.Primitive)!);
        comment = comment.withMarkers(ctx.receiveNode(comment.markers, ctx.receiveMarkers)!);
    } else {
        comment = new TextComment(
            ctx.receiveValue(null, ValueType.Primitive)!,
            ctx.receiveValue(null, ValueType.Primitive)!,
            ctx.receiveValue(null, ValueType.Primitive)!,
            ctx.receiveNode(null, ctx.receiveMarkers)!
        );
    }
    return comment;
}
