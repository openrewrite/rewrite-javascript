package org.openrewrite.javascript.recipe;

import org.junit.jupiter.api.Test;
import org.openrewrite.java.cleanup.SimplifyBooleanExpression;
import org.openrewrite.test.RewriteTest;

import static org.openrewrite.javascript.Assertions.javaScript;

@SuppressWarnings({"PointlessBooleanExpressionJS", "JSUnusedLocalSymbols"})
public class RecipeTest implements RewriteTest {

    @Test
    void simplifyBooleanExpression() {
        rewriteRun(
          spec -> spec.recipe(new SimplifyBooleanExpression()),
          javaScript(
            """
              const b = !false
              """,
              """
              const b = true
              """
          )
        );
    }
}
