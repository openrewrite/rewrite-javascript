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

import lombok.Getter;

public class JsContainer {
    @Getter
    public enum Location {
        ARRAY_LITERAL_EXPRESSION(JsSpace.Location.ARRAY_LITERAL_ELEMENTS, JsRightPadded.Location.ARRAY_LITERAL_ELEMENT_SUFFIX),
        BINDING_ELEMENT(JsSpace.Location.BINDING_ELEMENTS, JsRightPadded.Location.BINDING_ELEMENT),
        EXPORT_ELEMENT(JsSpace.Location.EXPORT_ELEMENTS, JsRightPadded.Location.EXPORT_ELEMENT_SUFFIX),
        FUNCTION_TYPE_PARAMETER(JsSpace.Location.FUNCTION_TYPE_PARAMETERS, JsRightPadded.Location.FUNCTION_TYPE_PARAMETER_SUFFIX),
        IMPORT_ELEMENT(JsSpace.Location.IMPORT_ELEMENTS, JsRightPadded.Location.IMPORT_ELEMENT_SUFFIX),
        TUPLE_ELEMENT(JsSpace.Location.TUPLE_ELEMENT, JsRightPadded.Location.TUPLE_ELEMENT_SUFFIX),
        JSMETHOD_DECLARATION_PARAMETERS(JsSpace.Location.JSMETHOD_DECLARATION_PARAMETERS, JsRightPadded.Location.JSMETHOD_DECLARATION_PARAMETER),
        JSTYPE_PARAMETERS(JsSpace.Location.JSTYPE_PARAMETERS, JsRightPadded.Location.JSTYPE_PARAMETER),
        JSMETHOD_INVOCATION_ARGUMENTS(JsSpace.Location.JSTYPE_PARAMETERS, JsRightPadded.Location.JSTYPE_PARAMETER),
        TYPE_LITERAL_MEMBERS(JsSpace.Location.TYPE_LITERAL_MEMBERS_PREFIX, JsRightPadded.Location.TYPE_LITERAL_MEMBERS),
        INDEXED_SIGNATURE_DECLARATION_PARAMETERS(JsSpace.Location.INDEXED_SIGNATURE_DECLARATION_PARAMETERS_PREFIX, JsRightPadded.Location.INDEXED_SIGNATURE_DECLARATION_PARAMETERS),
        ARRAY_BINDING_PATTERN_ELEMENTS(JsSpace.Location.ARRAY_BINDING_PATTERN_ELEMENTS_PREFIX, JsRightPadded.Location.ARRAY_BINDING_PATTERN_ELEMENTS),
        ;

        private final JsSpace.Location beforeLocation;
        private final JsRightPadded.Location elementLocation;

        Location(JsSpace.Location beforeLocation, JsRightPadded.Location elementLocation) {
            this.beforeLocation = beforeLocation;
            this.elementLocation = elementLocation;
        }

    }
}
