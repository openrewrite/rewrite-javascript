/*
 * Copyright 2025 the original author or authors.
 * <p>
 * Licensed under the Moderne Source Available License (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * https://docs.moderne.io/licensing/moderne-source-available-license
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.openrewrite.javascript.style;

import java.util.Arrays;

public class IntelliJ {

    public static class JavaScript {

        public static TabsAndIndentsStyle tabsAndIndents() {
            return new TabsAndIndentsStyle(
                    false, // useTabCharacter
                    4,      // tabSize
                    4,      // indentSize
                    4,      // continuationIndent
                    false,  // keepIndentsOnEmptyLines
                    true,   // indentChainedMethods
                    false   // indentAllChainedCallsInAGroup
            );
        }

        public static SpacesStyle spaces() {
            return new SpacesStyle(
                    new SpacesStyle.BeforeParentheses(false, false, true, true, true, true, true, true, true),
                    new SpacesStyle.AroundOperators(true, true, true, true, true, true, true, true, false, true, false, false),
                    new SpacesStyle.BeforeLeftBrace(true, true, true, true, true, true, true, true, true, true, true),
                    new SpacesStyle.BeforeKeywords(true, true, true, true),
                    new SpacesStyle.Within(false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),
                    new SpacesStyle.TernaryOperator(true, true, true, true),
                    new SpacesStyle.Other(false, true, false, false, true, false, false, true, false, false)
            );
        }

        public static BlankLinesStyle blankLines() {
            return new BlankLinesStyle(
                    new BlankLinesStyle.KeepMaximum(2),
                    new BlankLinesStyle.Minimum(1, 1, null, 0, null, 1, 1)
            );
        }

        public static ImportsStyle imports() {
            return new ImportsStyle(
                    true,
                    false,
                    true,
                    ImportsStyle.UseFileExtensions.Auto,
                    null, // TS specific config
                    null, // TS specific config
                    ImportsStyle.UsePathAliases.Always,
                    Arrays.asList("rxjs/Rx",
                            "node_modules/**",
                             "**/node_modules/**",
                             "@angular/material",
                             "@angular/material/typings/**"),
                    true,
                    false
            );
        }

        public static WrappingAndBraces wrappingAndBraces() {
            return new WrappingAndBraces();
        }

        public static PunctuationStyle punctuation() {
            return new PunctuationStyle(PunctuationStyle.TrailingComma.Keep);
        }
    }

    public static class TypeScript {

        public static TabsAndIndentsStyle tabsAndIndents() {
            return new TabsAndIndentsStyle(
                    false, // useTabCharacter
                    4,      // tabSize
                    4,      // indentSize
                    4,      // continuationIndent
                    false,  // keepIndentsOnEmptyLines
                    true,   // indentChainedMethods
                    false   // indentAllChainedCallsInAGroup
            );
        }

        public static SpacesStyle spaces() {
            return new SpacesStyle(
                    new SpacesStyle.BeforeParentheses(false, false, true, true, true, true, true, true, true),
                    new SpacesStyle.AroundOperators(true, true, true, true, true, true, true, true, false, true, false, false),
                    new SpacesStyle.BeforeLeftBrace(true, true, true, true, true, true, true, true, true, true, false),
                    new SpacesStyle.BeforeKeywords(true, true, true, true),
                    new SpacesStyle.Within(false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false),
                    new SpacesStyle.TernaryOperator(true, true, true, true),
                    new SpacesStyle.Other(false, true, false, false, true, false, false, true, false, true)
            );
        }

        public static BlankLinesStyle blankLines() {
            return new BlankLinesStyle(
                    new BlankLinesStyle.KeepMaximum(2),
                    new BlankLinesStyle.Minimum(1, 1, 0, 0, 1, 1, 1)
            );
        }

        public static ImportsStyle imports() {
            return new ImportsStyle(
                    true,
                    false,
                    true,
                    ImportsStyle.UseFileExtensions.Auto,
                    ImportsStyle.UseTypeModifiersInImports.Auto,
                    ImportsStyle.UsePathMappingsFromTSConfigJson.Always,
                    null, // JS specific config
                    Arrays.asList("rxjs/Rx",
                            "node_modules/**",
                            "**/node_modules/**",
                            "@angular/material",
                            "@angular/material/typings/**"),
                    true,
                    false
            );
        }

        public static WrappingAndBraces wrappingAndBraces() {
            return new WrappingAndBraces();
        }

        public static PunctuationStyle punctuation() {
            return new PunctuationStyle(PunctuationStyle.TrailingComma.Keep);
        }
    }

}
