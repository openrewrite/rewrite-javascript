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

        maxLength--; // to accomodate the ellipsis
        int startLength = maxLength / 2;
        int endLength = maxLength - startLength;
        return text.substring(0, startLength) + "…" + text.substring(text.length() - endLength);
    }
}
