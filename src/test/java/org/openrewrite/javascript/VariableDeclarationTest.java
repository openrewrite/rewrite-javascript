package org.openrewrite.javascript;

import org.junit.jupiter.api.Test;
import org.junitpioneer.jupiter.ExpectedToFail;
import org.openrewrite.test.RewriteTest;

import static org.openrewrite.javascript.ParserAssertions.javascript;

@SuppressWarnings("JSUnresolvedVariable")
public class VariableDeclarationTest implements RewriteTest {

    @Test
    void let() {
        rewriteRun(
          javascript(
            """
              let hello = "World" ;
              """
          )
        );
    }

    @ExpectedToFail
    @Test
    void multiTypeLet() {
        rewriteRun(
          javascript(
            """
              let stringWord : string | null ;
              """
          )
        );
    }

    @ExpectedToFail
    @Test
    void constant() {
        rewriteRun(
          javascript(
            """
              const hello = "World" ;
              """
          )
        );
    }
}
