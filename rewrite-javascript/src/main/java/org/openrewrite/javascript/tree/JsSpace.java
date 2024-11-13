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
        ALIAS_PREFIX,
        ALIAS_PROPERTY_NAME_PREFIX,
        ARRAY_LITERAL_ELEMENTS,
        ARRAY_LITERAL_PREFIX,
        ARRAY_LITERAL_SUFFIX,
        ARROW_FUNCTION_PREFIX,
        AWAIT_PREFIX,
        BINARY_PREFIX,
        BINDING_ELEMENTS,
        BINDING_INITIALIZER_PREFIX,
        BINDING_PREFIX,
        BINDING_PROPERTY_NAME_SUFFIX,
        BINDING_SUFFIX,
        DEFAULT_TYPE_PREFIX,
        DELETE_PREFIX,
        EXPORT_ELEMENTS,
        EXPORT_ELEMENT_SUFFIX,
        EXPORT_FROM_PREFIX,
        EXPORT_INITIALIZER_PREFIX,
        EXPORT_PREFIX,
        FUNCTION_TYPE_ARROW_PREFIX,
        FUNCTION_TYPE_PARAMETERS,
        FUNCTION_TYPE_PREFIX,
        FUNCTION_TYPE_SUFFIX,
        IMPORT_ELEMENTS,
        IMPORT_ELEMENT_SUFFIX,
        IMPORT_FROM_PREFIX,
        IMPORT_INITIALIZER_PREFIX,
        IMPORT_NAME_SUFFIX,
        IMPORT_PREFIX,
        OBJECT_BINDING_DECLARATIONS_PREFIX,
        OBJECT_BINDING_PREFIX,
        PROPERTY_ASSIGNMENT_NAME_SUFFIX,
        PROPERTY_ASSIGNMENT_PREFIX,
        SCOPED_VARIABLE_DECLARATIONS_PREFIX,
        SCOPED_VARIABLE_DECLARATIONS_SCOPE_PREFIX,
        SCOPED_VARIABLE_DECLARATIONS_VARIABLE_SUFFIX,
        TAG_SUFFIX,
        TEMPLATE_EXPRESSION_PREFIX,
        TEMPLATE_EXPRESSION_VALUE_PREFIX,
        TEMPLATE_EXPRESSION_VALUE_SUFFIX,
        TUPLE_ELEMENT,
        TUPLE_ELEMENT_SUFFIX,
        TUPLE_PREFIX,
        TYPEOF_PREFIX,
        TYPE_DECLARATION_INITIALIZER_PREFIX,
        TYPE_DECLARATION_PREFIX,
        TYPE_OPERATOR_PREFIX,
        UNION_PREFIX,
        UNION_TYPE_SUFFIX,
        UNKNOWN_PREFIX,
        UNKNOWN_SOURCE_PREFIX,
        VARIABLE_DECLARATION_PREFIX,
        VOID_PREFIX,
        YIELD_PREFIX,
        TYPE_INFO_PREFIX,
        TYPE_REFERENCE_PREFIX,
        JSVARIABLE_DECLARATIONS_PREFIX,
        JSVARIABLE_PREFIX,
        JSVARIABLE_INITIALIZER,
        JSNAMED_VARIABLE_SUFFIX,
        JSMETHOD_DECLARATION_PARAMETERS,
        JSMETHOD_DECLARATION_PREFIX,
        NAMESPACE_DECLARATION_PREFIX,
        NAMESPACE_DECLARATION_KEYWORD_PREFIX,
        FUNCTION_DECLARATION_PREFIX,
    }
}
