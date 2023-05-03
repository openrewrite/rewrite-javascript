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

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.primitive.V8ValueBoolean;
import com.caoccao.javet.values.primitive.V8ValueString;
import com.caoccao.javet.values.primitive.V8ValueUndefined;
import com.caoccao.javet.values.reference.V8ValueObject;

public interface TSCV8Backed {
    TSCProgramContext getProgramContext();
    V8ValueObject getBackingV8Object();
    String debugDescription();

    default boolean getBooleanPropertyValue(String propertyName) {
        V8Value val;
        try {
            val = this.getBackingV8Object().getProperty(propertyName);
        } catch (JavetException ignored) {
            throw new IllegalStateException(String.format("Property <%s> does not exist on %s", propertyName, this.debugDescription()));
        }

        boolean propertyValue;
        if (val instanceof V8ValueBoolean) {
            propertyValue = ((V8ValueBoolean) val).getValue();
        } else {
            throw new IllegalStateException(String.format("Property <%s> is not a boolean type.", propertyName));
        }
        return propertyValue;
    }

    default String getStringPropertyValue(String propertyName) {
        V8Value val;
        try {
            val = this.getBackingV8Object().getProperty(propertyName);
        } catch (JavetException ignored) {
            throw new IllegalStateException(String.format("Property <%s> does not exist on %s", propertyName, this.debugDescription()));
        }

        String propertyValue = "";
        if (val instanceof V8ValueString) {
            propertyValue = ((V8ValueString) val).getValue();
        } else {
            throw new IllegalStateException(String.format("Property <%s> is not a string type.", propertyName));
        }
        return propertyValue;
    }

    default Number getNumericPropertyValue(String propertyName) {
        try {
            return getBackingV8Object().getPrimitive(propertyName);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    default boolean hasProperty(String propertyName) {
        boolean isFound = false;
        try {
            isFound = !(this.getBackingV8Object().getProperty(propertyName) instanceof V8ValueUndefined);
        } catch (JavetException ignored) {
        }
        return isFound;
    }

}
