import { describe, expect, test } from "@jest/globals";
import * as ts from "typescript";
import { JavaScriptTypeMapping } from "../../src/javascript/typeMapping";
import { JavaType } from "../../src/java";

function getFirstVariableInitializer(sourceText: string): ts.Expression {
  const sourceFile = ts.createSourceFile(
    "test.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );
  const [firstStatement] = sourceFile.statements;
  if (!ts.isVariableStatement(firstStatement)) {
    throw new Error(
      "Expected the first statement to be a variable declaration, but got " +
        ts.SyntaxKind[firstStatement.kind]
    );
  }
  const [firstDeclaration] = firstStatement.declarationList.declarations;
  if (!firstDeclaration.initializer) {
    throw new Error("The variable has no initializer.");
  }
  return firstDeclaration.initializer;
}

function getFirstVariableTypeNode(sourceText: string): ts.TypeNode {
  const sourceFile = ts.createSourceFile(
    "test.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );

  const firstStatement = sourceFile.statements[0];
  if (!ts.isVariableStatement(firstStatement)) {
    throw new Error(
      `Expected first statement to be a variable statement, but got: ${
        ts.SyntaxKind[firstStatement.kind]
      }`
    );
  }

  const declaration = firstStatement.declarationList.declarations[0];
  if (!declaration.type) {
    throw new Error(
      `No explicit type declared for: ${declaration.name.getText()}`
    );
  }

  return declaration.type;
}

function createTypeChecker(sourceText: string): ts.TypeChecker {
  const sourceFile = ts.createSourceFile(
    "test.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );

  const options: ts.CompilerOptions = {
    strict: true,
    lib: ["lib.esnext.d.ts"],
  };

  const compilerHost = ts.createCompilerHost(options);
  const defaultGetSourceFile = compilerHost.getSourceFile;

  compilerHost.getSourceFile = (fileName, languageVersion) => {
    if (fileName.endsWith("test.ts")) {
      return sourceFile;
    }
    return defaultGetSourceFile(fileName, languageVersion);
  };

  const program = ts.createProgram(["test.ts"], options, compilerHost);

  return program.getTypeChecker();
}

describe("JavaScriptTypeMapping", () => {
  describe("explicitly declared types", () => {
    const expectedTypeMapping: Record<
      string,
      JavaType.PrimitiveKind | JavaType.Unknown
    > = {
      // JavaScript primitive types
      string: JavaType.PrimitiveKind.String,
      number: JavaType.PrimitiveKind.Double,
      boolean: JavaType.PrimitiveKind.Boolean,
      bigint: JavaType.PrimitiveKind.Long,
      symbol: JavaType.Unknown,

      // JavaScript special value types
      null: JavaType.PrimitiveKind.Null,
      undefined: JavaType.PrimitiveKind.None,
      void: JavaType.PrimitiveKind.Void,
      // TODO this one feels kind of strange
      RegExp: JavaType.PrimitiveKind.String,

      // TypeScript meta types
      any: JavaType.Unknown,
      unknown: JavaType.Unknown,
      never: JavaType.Unknown,
      "unique symbol": JavaType.Unknown,

      // Literal types
      1: JavaType.PrimitiveKind.Double,
      "'someStringLiteral'": JavaType.PrimitiveKind.String,
      true: JavaType.PrimitiveKind.Boolean,
      false: JavaType.PrimitiveKind.Boolean,
    };

    for (const [key, value] of Object.entries(expectedTypeMapping)) {
      const source = `const x: ${key};`;
      test(source, () => {
        const checker = createTypeChecker(source);
        const mapping = new JavaScriptTypeMapping(checker);
        const node = getFirstVariableTypeNode(source);

        const result = mapping.type(node);
        if (value === JavaType.Unknown) {
          expect(result).toBeInstanceOf(JavaType.Unknown);
        } else {
          expect(result).toBeInstanceOf(JavaType.Primitive);
          expect((result as JavaType.Primitive).kind).toBe(value);
        }
      });
    }
  });

  describe("inferred type of initializer", () => {
    const expectedTypeMapping: Record<
      string,
      JavaType.PrimitiveKind | JavaType.Unknown
    > = {
      "'abc'": JavaType.PrimitiveKind.String,
      123: JavaType.PrimitiveKind.Double,
      true: JavaType.PrimitiveKind.Boolean,
      false: JavaType.PrimitiveKind.Boolean,
      "123n": JavaType.PrimitiveKind.Long,
      "Symbol()": JavaType.Unknown,
      null: JavaType.PrimitiveKind.Null,
      undefined: JavaType.PrimitiveKind.None,
    };

    for (const [key, value] of Object.entries(expectedTypeMapping)) {
      const source = `const x = ${key};`;
      test(source, () => {
        const checker = createTypeChecker(source);
        const mapping = new JavaScriptTypeMapping(checker);
        const node = getFirstVariableInitializer(source);

        const result = mapping.type(node);
        if (value === JavaType.Unknown) {
          expect(result).toBeInstanceOf(JavaType.Unknown);
        } else {
          expect(result).toBeInstanceOf(JavaType.Primitive);
          expect((result as JavaType.Primitive).kind).toBe(value);
        }
      });
    }
  });

  describe("common object types that for now we map to unknown", () => {
    const expectedTypeMapping: Record<
      string,
      JavaType.PrimitiveKind | JavaType.Unknown
    > = {
      Function: JavaType.Unknown,
      object: JavaType.Unknown,
      "string[]": JavaType.Unknown,
      "number[]": JavaType.Unknown,
      "any[]": JavaType.Unknown,
      "Array<string>": JavaType.Unknown,
      "Array<number>": JavaType.Unknown,
      "Array<any>": JavaType.Unknown,
      "[string, number]": JavaType.Unknown,
      "Record<string, any>": JavaType.Unknown,
      "Promise<string>": JavaType.Unknown,
      "Promise<any>": JavaType.Unknown,
      "unique symbol": JavaType.Unknown,
    };

    for (const [key, value] of Object.entries(expectedTypeMapping)) {
      const source = `let x: ${key};`;
      test(source, () => {
        const checker = createTypeChecker(source);
        const mapping = new JavaScriptTypeMapping(checker);
        const node = getFirstVariableTypeNode(source);

        const result = mapping.type(node);
        if (value === JavaType.Unknown) {
          expect(result).toBeInstanceOf(JavaType.Unknown);
        } else {
          expect(result).toBeInstanceOf(JavaType.Primitive);
          expect((result as JavaType.Primitive).kind).toBe(value);
        }
      });
    }
  });

  test("union type", () => {
    const source = `let x: string | number;`;
    const checker = createTypeChecker(source);
    const mapping = new JavaScriptTypeMapping(checker);
    const node = getFirstVariableTypeNode(source);

    const result = mapping.type(node);
    expect(result).toBeInstanceOf(JavaType.Union);
    const unionType = result as JavaType.Union;
    expect(unionType.types).toHaveLength(2);
  });
});
