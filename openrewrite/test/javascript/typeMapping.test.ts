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

const createTypeChecker = (sourceText: string): ts.TypeChecker => {
  const sourceFile = ts.createSourceFile(
    "test.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );

  const compilerHost = ts.createCompilerHost({});
  compilerHost.getSourceFile = (fileName) =>
    fileName === "test.ts" ? sourceFile : undefined;

  const program = ts.createProgram({
    rootNames: ["test.ts"],
    options: { lib: ["lib.esnext.d.ts"], strict: true },
    host: compilerHost,
  });

  return program.getTypeChecker();
};

describe("JavaScriptTypeMapping", () => {
  describe("literal types", () => {
    test("number literal", () => {
      const source = `const x = 42;`;
      const checker = createTypeChecker(source);
      const mapping = new JavaScriptTypeMapping(checker);
      const initializer = getFirstVariableInitializer(source);

      const result = mapping.type(initializer);
      expect(result).toBeInstanceOf(JavaType.Primitive);
      expect((result as JavaType.Primitive).kind).toBe(
        JavaType.PrimitiveKind.Double
      );
    });

    test("string literal", () => {
      const source = `const x = "hello";`;
      const checker = createTypeChecker(source);
      const mapping = new JavaScriptTypeMapping(checker);
      const initializer = getFirstVariableInitializer(source);

      const result = mapping.type(initializer);
      expect(result).toBeInstanceOf(JavaType.Primitive);
      expect((result as JavaType.Primitive).kind).toBe(
        JavaType.PrimitiveKind.String
      );
    });

    test("boolean literal", () => {
      const source = `const x = true;`;
      const checker = createTypeChecker(source);
      const mapping = new JavaScriptTypeMapping(checker);
      const initializer = getFirstVariableInitializer(source);

      const result = mapping.type(initializer);
      expect(result).toBeInstanceOf(JavaType.Primitive);
      expect((result as JavaType.Primitive).kind).toBe(
        JavaType.PrimitiveKind.Boolean
      );
    });
  });

  describe("explicity declared types", () => {
    test("number type", () => {
      const source = `const x: number = 42;`;
      const checker = createTypeChecker(source);
      const mapping = new JavaScriptTypeMapping(checker);
      const node = getFirstVariableTypeNode(source);

      const result = mapping.type(node);
      expect(result).toBeInstanceOf(JavaType.Primitive);
      expect((result as JavaType.Primitive).kind).toBe(
        JavaType.PrimitiveKind.Double
      );
    });

    test("string type", () => {
      const source = `const x: string = "hello";`;
      const checker = createTypeChecker(source);
      const mapping = new JavaScriptTypeMapping(checker);
      const node = getFirstVariableTypeNode(source);

      const result = mapping.type(node);
      expect(result).toBeInstanceOf(JavaType.Primitive);
      expect((result as JavaType.Primitive).kind).toBe(
        JavaType.PrimitiveKind.String
      );
    });

    test("boolean type", () => {
      const source = `const x: boolean = true;`;
      const checker = createTypeChecker(source);
      const mapping = new JavaScriptTypeMapping(checker);
      const node = getFirstVariableTypeNode(source);

      const result = mapping.type(node);
      expect(result).toBeInstanceOf(JavaType.Primitive);
      expect((result as JavaType.Primitive).kind).toBe(
        JavaType.PrimitiveKind.Boolean
      );
    });
  });

  test("string | number union", () => {
    const source = `let x: string | number;`;
    const checker = createTypeChecker(source);
    const mapping = new JavaScriptTypeMapping(checker);
    const node = getFirstVariableTypeNode(source);

    const result = mapping.type(node);
    expect(result).toBeInstanceOf(JavaType.Union);
    const unionType = result as JavaType.Union;
    expect(unionType.types).toHaveLength(2);
  });

  test("RegExp type", () => {
    const source = `let x: RegExp;`;
    const checker = createTypeChecker(source);
    const mapping = new JavaScriptTypeMapping(checker);
    const node = getFirstVariableTypeNode(source);

    const result = mapping.type(node);
    expect(result).toBeInstanceOf(JavaType.Primitive);
    expect((result as JavaType.Primitive).kind).toBe(
      JavaType.PrimitiveKind.String
    );
  });
});
