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
package org.openrewrite.javascript;

import lombok.EqualsAndHashCode;
import lombok.Value;
import org.openrewrite.ExecutionContext;
import org.openrewrite.Option;
import org.openrewrite.Recipe;
import org.openrewrite.TreeVisitor;
import org.openrewrite.java.MethodMatcher;


@Value
@EqualsAndHashCode(callSuper = true)
public class AddLicenseHeader extends Recipe {
    /**
     * A method pattern that is used to find matching method declarations/invocations.
     * See {@link  MethodMatcher} for details on the expression's syntax.
     */
    @Option(displayName = "License text",
        description = "The license header text without the block comment. May contain ${CURRENT_YEAR} property.",
        example = "Copyright ${CURRENT_YEAR} the original author or authors...")
    String licenseText;

    @Override
    public String getDisplayName() {
        return "Add license header";
    }

    @Override
    public String getDescription() {
        return "Adds license headers to JavaScript source files when missing. Does not override existing license headers.";
    }

    @Override
    public TreeVisitor<?, ExecutionContext> getVisitor() {
        return new org.openrewrite.java.AddLicenseHeader(licenseText).getVisitor();
    }
}
