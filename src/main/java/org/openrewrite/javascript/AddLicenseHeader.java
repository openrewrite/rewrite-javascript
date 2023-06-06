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
