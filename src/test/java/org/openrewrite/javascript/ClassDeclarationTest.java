package org.openrewrite.javascript;

import org.junit.jupiter.api.Test;
import org.openrewrite.test.RewriteTest;

import static org.openrewrite.javascript.ParserAssertions.javascript;

@SuppressWarnings("JSUnresolvedVariable")
public class ClassDeclarationTest implements RewriteTest {

    @Test
    void classDeclaration() {
        rewriteRun(
            javascript(
              "class Foo { }"
            )
        );
    }

    @Test
    void abstractClass() {
        rewriteRun(
            javascript(
              "abstract class Foo { }"
            )
        );
    }

    @Test
    void interfaceDeclaration() {
        rewriteRun(
            javascript(
              "interface Foo { }"
            )
        );
    }
}
