package org.openrewrite.javascript;

import org.junit.jupiter.api.Test;
import org.openrewrite.test.RewriteTest;

import static org.openrewrite.javascript.ParserAssertions.javascript;

@SuppressWarnings("JSUnresolvedVariable")
public class ClassDeclarationTest implements RewriteTest {

    @Test
    public void classDeclaration() {
        rewriteRun(
            javascript(
              "class Foo { }"
            )
        );
    }

    @Test
    public void abstractClass() {
        rewriteRun(
            javascript(
              "abstract class Foo { }"
            )
        );
    }

    @Test
    public void interfaceDeclaration() {
        rewriteRun(
            javascript(
              "interface Foo { }"
            )
        );
    }
}
