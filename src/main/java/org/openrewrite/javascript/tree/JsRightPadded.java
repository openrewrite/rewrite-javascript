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

public class JsRightPadded {
    @Getter
    public enum Location {
        ALIAS_PROPERTY_NAME(JsSpace.Location.ALIAS_PROPERTY_NAME_PREFIX),
        ARRAY_LITERAL_ELEMENT_SUFFIX(JsSpace.Location.ARRAY_LITERAL_SUFFIX),
        BINDING_ELEMENT_SUFFIX(JsSpace.Location.BINDING_SUFFIX),
        BINDING_PROPERTY_NAME_SUFFIX(JsSpace.Location.BINDING_PROPERTY_NAME_SUFFIX),
        EXPORT_ELEMENT_SUFFIX(JsSpace.Location.EXPORT_ELEMENT_SUFFIX),
        FUNCTION_TYPE_PARAMETER_SUFFIX(JsSpace.Location.FUNCTION_TYPE_SUFFIX),
        IMPORT_ELEMENT_SUFFIX(JsSpace.Location.IMPORT_ELEMENT_SUFFIX),
        IMPORT_NAME_SUFFIX(JsSpace.Location.IMPORT_NAME_SUFFIX),
        PROPERTY_ASSIGNMENT_NAME(JsSpace.Location.PROPERTY_ASSIGNMENT_NAME_SUFFIX),
        SCOPED_VARIABLE_DECLARATIONS_VARIABLE(JsSpace.Location.SCOPED_VARIABLE_DECLARATIONS_VARIABLE_SUFFIX),
        TAG(JsSpace.Location.TAG_SUFFIX),
        TUPLE_ELEMENT_SUFFIX(JsSpace.Location.TUPLE_ELEMENT_SUFFIX),
        UNION_TYPE(JsSpace.Location.UNION_TYPE_SUFFIX),
        ;

        private final JsSpace.Location afterLocation;

        Location(JsSpace.Location afterLocation) {
            this.afterLocation = afterLocation;
        }

    }
}
