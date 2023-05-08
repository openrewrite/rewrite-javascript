package org.openrewrite.javascript.tree;

import org.junit.jupiter.api.Test;
import org.junitpioneer.jupiter.ExpectedToFail;

@SuppressWarnings({"JSFileReferences", "JSUnusedLocalSymbols"})
public class ExportTest extends ParserTest {

    @ExpectedToFail
    @Test
    void exportDeclaration() {
        rewriteRun(
          javascript(
            """
              class ZipCodeValidator {
                isAcceptable(s: string) {
                  return s.length === 5;
                }
              }
              export { ZipCodeValidator };
              """
          )
        );
    }

    @ExpectedToFail
    @Test
    void propertyModifier() {
        rewriteRun(
            javascript(
              """
                export const numberRegexp = /^[0-9]+$/;
                """
            )
        );
    }

    @ExpectedToFail
    @Test
    void fromClass() {
        rewriteRun(
          javascript("class CreateFile {}"),
          javascript(
            """
              export * from "./f0.ts";
              """
          )
        );
    }

    @ExpectedToFail
    @Test
    void alias() {
        rewriteRun(
          javascript("class CreateFile {}"),
          javascript(
            """
              export * from "./f0.ts";
              """
          )
        );
    }
}
