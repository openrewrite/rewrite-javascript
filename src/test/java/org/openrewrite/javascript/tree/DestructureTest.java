package org.openrewrite.javascript.tree;

import org.junit.jupiter.api.Test;
import org.junitpioneer.jupiter.ExpectedToFail;

@SuppressWarnings("JSUnusedLocalSymbols")
public class DestructureTest extends ParserTest {

    @ExpectedToFail
    @Test
    void destruct() {
        rewriteRun(
          javascript(
            """
              let input = [ 1 , 2 ] ;
              let [ first , second ] = input ;
              """
          )
        );
    }

    @ExpectedToFail
    @Test
    void varArg() {
        rewriteRun(
          javascript(
            """
              let [ first , ... rest ] = [ 1 , 2 , 3 ]
              """
          )
        );
    }

    @ExpectedToFail
    @Test
    void destructObject() {
        rewriteRun(
          javascript(
            """
              const c = { fName : 'Foo' , lName : 'Bar' }
              const { fName, lName } = c
              """
          )
        );
    }
}
