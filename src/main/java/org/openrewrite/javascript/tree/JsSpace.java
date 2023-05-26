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

public class JsSpace {
    public enum Location {
        TODO,
        ALIAS_PREFIX,
        ALIAS_PROPERTY_NAME_PREFIX,
        ARRAY_LITERAL_PREFIX,
        ARRAY_LITERAL_ELEMENTS,
        BINARY_PREFIX,
        DEFAULT_TYPE_PREFIX,
        EXPORT_PREFIX,
        EXPORT_FROM_PREFIX,
        FUNCTION_TYPE_PREFIX,
        FUNCTION_TYPE_PARAMETERS,
        FUNCTION_TYPE_SUFFIX,
        FUNCTION_TYPE_ARROW_PREFIX,
        OPERATOR_PREFIX,
        ARRAY_LITERAL_SUFFIX,
        UNION_PREFIX,
        UNION_TYPE_SUFFIX,
        UNKNOWN_PREFIX,
        UNKNOWN_SOURCE_PREFIX,
        TYPE_OPERATOR_PREFIX,
        VARIABLE_DECLARATION_PREFIX
    }
}
