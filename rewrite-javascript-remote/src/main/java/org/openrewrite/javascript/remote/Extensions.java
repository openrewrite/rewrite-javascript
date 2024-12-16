/*
 * Copyright 2024 the original author or authors.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * https://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.openrewrite.javascript.remote;

import org.jspecify.annotations.Nullable;
import org.openrewrite.java.tree.*;
import org.openrewrite.remote.ReceiverContext;
import org.openrewrite.remote.SenderContext;

class Extensions {
    public static <T extends J> void sendContainer(JContainer<T> container, SenderContext ctx) {
        org.openrewrite.java.remote.Extensions.sendContainer(container, ctx);
    }

    public static <T> void sendLeftPadded(JLeftPadded<T> leftPadded, SenderContext ctx) {
        org.openrewrite.java.remote.Extensions.sendLeftPadded(leftPadded, ctx);
    }

    public static <T> void sendRightPadded(JRightPadded<T> rightPadded, SenderContext ctx) {
        org.openrewrite.java.remote.Extensions.sendRightPadded(rightPadded, ctx);
    }

    public static void sendSpace(Space space, SenderContext ctx) {
        org.openrewrite.java.remote.Extensions.sendSpace(space, ctx);
    }

    public static void sendComment(Comment comment, SenderContext ctx) {
        org.openrewrite.java.remote.Extensions.sendComment(comment, ctx);
    }

    public static <T extends J> JContainer<T> receiveContainer(@Nullable JContainer<T> container, @Nullable Class<?> type, ReceiverContext ctx) {
        return org.openrewrite.java.remote.Extensions.receiveContainer(container, type, ctx);
    }

    public static <T> ReceiverContext.DetailsReceiver<JLeftPadded<T>> leftPaddedValueReceiver(Class<T> valueType) {
        return org.openrewrite.java.remote.Extensions.leftPaddedValueReceiver(valueType);
    }

    public static <T> ReceiverContext.DetailsReceiver<JLeftPadded<T>> leftPaddedNodeReceiver(Class<T> nodeType) {
        return org.openrewrite.java.remote.Extensions.leftPaddedNodeReceiver(nodeType);
    }

    public static <T extends J> JLeftPadded<T> receiveLeftPaddedTree(@Nullable JLeftPadded<T> leftPadded, @Nullable Class<?> type, ReceiverContext ctx) {
        return org.openrewrite.java.remote.Extensions.receiveLeftPaddedTree(leftPadded, type, ctx);
    }

    public static <T> ReceiverContext.DetailsReceiver<JRightPadded<T>> rightPaddedValueReceiver(Class<T> valueType) {
        return org.openrewrite.java.remote.Extensions.rightPaddedValueReceiver(valueType);
    }

    public static <T> ReceiverContext.DetailsReceiver<JRightPadded<T>> rightPaddedNodeReceiver(Class<T> nodeType) {
        return org.openrewrite.java.remote.Extensions.rightPaddedNodeReceiver(nodeType);
    }

    public static <T extends J> JRightPadded<T> receiveRightPaddedTree(@Nullable JRightPadded<T> rightPadded, @Nullable Class<?> type, ReceiverContext ctx) {
        return org.openrewrite.java.remote.Extensions.receiveRightPaddedTree(rightPadded, type, ctx);
    }

    public static Space receiveSpace(@Nullable Space space, Class<?> type, ReceiverContext ctx) {
        return org.openrewrite.java.remote.Extensions.receiveSpace(space, type, ctx);
    }

    public static Comment receiveComment(@Nullable Comment comment, @Nullable Class<Comment> type, ReceiverContext ctx) {
        return org.openrewrite.java.remote.Extensions.receiveComment(comment, type, ctx);
    }
}
