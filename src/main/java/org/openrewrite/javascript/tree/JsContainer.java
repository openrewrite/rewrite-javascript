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
package org.openrewrite.javascript.tree;

public class JsContainer {
    public enum Location {
        ARRAY_LITERAL_EXPRESSION(JsSpace.Location.ARRAY_LITERAL_ELEMENTS, JsRightPadded.Location.ARRAY_LITERAL_ELEMENT_SUFFIX),
        FUNCTION_TYPE_PARAMETER(JsSpace.Location.FUNCTION_TYPE_PARAMETERS, JsRightPadded.Location.FUNCTION_TYPE_PARAMETER_SUFFIX);

        private final JsSpace.Location beforeLocation;
        private final JsRightPadded.Location elementLocation;

        Location(JsSpace.Location beforeLocation, JsRightPadded.Location elementLocation) {
            this.beforeLocation = beforeLocation;
            this.elementLocation = elementLocation;
        }

        public JsSpace.Location getBeforeLocation() {
            return beforeLocation;
        }

        public JsRightPadded.Location getElementLocation() {
            return elementLocation;
        }
    }
}
