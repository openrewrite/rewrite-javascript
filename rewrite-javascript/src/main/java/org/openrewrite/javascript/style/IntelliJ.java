/*
 * Copyright 2024 the original author or authors.
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

// TODO: extend NameStyles and implement remaining styles for JS/TS.
public class IntelliJ {

    public static SpacesStyle spaces() {
        return new SpacesStyle(
                new SpacesStyle.BeforeParentheses(false, false, true, true, true, true, true, true, true),
                new SpacesStyle.AroundOperators(true, true, true, true, true, true, true, true, false, true, false, false),
                new SpacesStyle.BeforeLeftBrace(true, true, true, true, true, true, true, true, true, true, true),
                new SpacesStyle.BeforeKeywords(true, true, true, true),
                new SpacesStyle.Within(false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false),
                new SpacesStyle.TernaryOperator(true, true, true, true),
                new SpacesStyle.Other(false, true, false, true, false, true, false, false, true, false, true)
        );
    }
}
