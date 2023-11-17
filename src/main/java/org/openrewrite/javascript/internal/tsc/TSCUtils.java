/*
 * Copyright 2023 the original author or authors.
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
package org.openrewrite.javascript.internal.tsc;

public final class TSCUtils {
    private TSCUtils() {
    }

    public static String preview(String text, int maxLength) {
        text = text.replace("\n", "⏎")
                .replace("\t", "⇥")
                .replace(" ", "·");

        if (text.length() <= maxLength) {
            return text;
        }

        maxLength--; // to accommodate the ellipsis
        int startLength = maxLength / 2;
        int endLength = maxLength - startLength;
        return text.substring(0, startLength) + "…" + text.substring(text.length() - endLength);
    }
}
