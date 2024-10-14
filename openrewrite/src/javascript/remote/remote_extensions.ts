import {JContainer, JLeftPadded, JRightPadded, Space} from "@openrewrite/rewrite/java/tree";
import * as javaExtensions from "../../java/remote/remote_extensions";
import {SenderContext} from "@openrewrite/rewrite-remote";
import {DetailsReceiver, ReceiverContext} from "@openrewrite/rewrite-remote";
import {Tree} from "@openrewrite/rewrite/core";
import {ValueType} from "@openrewrite/rewrite-remote";

export function sendContainer<T>(type: ValueType): (container: JContainer<T>, ctx: SenderContext) => void {
    return javaExtensions.sendContainer(type);
}

export function sendLeftPadded<T>(type: ValueType): (leftPadded: JLeftPadded<T>, ctx: SenderContext) => void {
    return javaExtensions.sendLeftPadded(type);
}

export function sendRightPadded<T>(type: ValueType): (rightPadded: JRightPadded<T>, ctx: SenderContext) => void {
    return javaExtensions.sendRightPadded(type);
}

export function sendSpace(space: Space, ctx: SenderContext) {
    javaExtensions.sendSpace(space, ctx);
}

export function receiveContainer<T>(container: JContainer<T> | null, type: string | null, ctx: ReceiverContext): JContainer<T> {
    return javaExtensions.receiveContainer(container, type, ctx);
}

export function leftPaddedValueReceiver<T>(type: any): DetailsReceiver<JLeftPadded<T>> {
    return javaExtensions.leftPaddedValueReceiver(type);
}

export function leftPaddedNodeReceiver<T>(type: any): DetailsReceiver<JLeftPadded<T>> {
    return javaExtensions.leftPaddedNodeReceiver(type);
}

export function receiveLeftPaddedTree<T extends Tree>(leftPadded: JLeftPadded<T> | null, type: string | null, ctx: ReceiverContext): JLeftPadded<T> {
    return javaExtensions.receiveLeftPaddedTree(leftPadded, type, ctx);
}

export function rightPaddedValueReceiver<T>(valueType: any): DetailsReceiver<JRightPadded<T>> {
    return javaExtensions.rightPaddedValueReceiver(valueType);
}

export function rightPaddedNodeReceiver<T>(type: any): DetailsReceiver<JRightPadded<T>> {
    return javaExtensions.rightPaddedNodeReceiver(type);
}

export function receiveRightPaddedTree<T extends Tree>(rightPadded: JRightPadded<T> | null, type: string | null, ctx: ReceiverContext): JRightPadded<T> {
    return javaExtensions.receiveRightPaddedTree(rightPadded, type, ctx);
}

export function receiveSpace(space: Space | null, type: string | null, ctx: ReceiverContext): Space {
    return javaExtensions.receiveSpace(space, type, ctx);
}
