package org.openrewrite.javascript;

import org.junit.jupiter.api.Test;
import org.openrewrite.test.RewriteTest;

import static org.openrewrite.javascript.ParserAssertions.javascript;

public class LiteralTest implements RewriteTest {

    @Test
    void stringLiteral() {
        rewriteRun(
          javascript(
            """
              let hello = 'World' ;
              """
          )
        );
    }

    @Test
    void numericLiteral() {
        rewriteRun(
          javascript(
            """
              let n = 0 ;
              """
          )
        );
    }
}
