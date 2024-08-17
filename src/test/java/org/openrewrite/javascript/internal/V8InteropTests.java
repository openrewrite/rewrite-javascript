/*
 * Copyright 2023 the original author or authors.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * https://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.openrewrite.javascript.internal;

import org.intellij.lang.annotations.Language;
import org.junit.jupiter.api.Test;
import org.openrewrite.javascript.internal.tsc.*;
import org.openrewrite.javascript.internal.tsc.generated.TSCObjectFlag;
import org.openrewrite.javascript.internal.tsc.generated.TSCTypeFlag;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.BiConsumer;
import java.util.function.Function;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.junit.jupiter.api.Assertions.*;

public class V8InteropTests {

    private void parseSingleSource(
      @Language("typescript") String source,
      BiConsumer<TSCNode, TSCSourceFileContext> callback
    ) {
        parseSingleSource(source, "test.ts", runtime -> runtime, callback);
    }

    private void parseSingleSource(
      @Language("typescript") String source,
      Function<TSCRuntime, TSCRuntime> configureRuntime,
      BiConsumer<TSCNode, TSCSourceFileContext> callback
    ) {
        parseSingleSource(source, "test.ts", configureRuntime, callback);
    }

    private void parseSingleSource(
      @Language("typescript") String source,
      String filename,
      BiConsumer<TSCNode, TSCSourceFileContext> callback
    ) {
        parseSingleSource(source, filename, runtime -> runtime, callback);
    }

    private void parseSingleSource(
      @Language("typescript") String source,
      String filename,
      Function<TSCRuntime, TSCRuntime> configureRuntime,
      BiConsumer<TSCNode, TSCSourceFileContext> callback
    ) {
        AtomicBoolean ran = new AtomicBoolean();
        try (TSCRuntime runtime = configureRuntime.apply(TSCRuntime.init())) {
            runtime.parseSingleSource(source, filename, (root, ctx) -> {
                callback.accept(root, ctx);
                ran.set(true);
            });
        }
        if (!ran.get()) {
            fail("Single-source parsing did not complete normally during the test.");
        }
    }

    @Test
    public void testTypeIdentity() {
        parseSingleSource("function foo() {}", (root, ctx) ->
            root.getAllChildNodes().forEach(child -> {
                TSCType first = child.getTypeForNode();
                TSCType second = child.getTypeForNode();
                assertSame(first, second);
            }));
    }

    @Test
    public void testNodeIdentity() {
        parseSingleSource("function foo() {}", (root, ctx) -> {
            List<TSCNode> first = root.getAllChildNodes();
            List<TSCNode> second = root.getAllChildNodes();
            for (int i = 0; i < first.size(); i++) {
                assertSame(first.get(i), second.get(i));
            }
        });
    }

    @Test
    public void testTypeIdentityInDifferentLocations() {
        parseSingleSource("class Foo{} const x = new Foo(); const y = new Foo();", (root, ctx) -> {
            TSCType xType = root.firstNodeWithText("x").getTypeForNode();
            TSCType yType = root.firstNodeWithText("y").getTypeForNode();
            assertSame(xType, yType);
        });
    }

    @Test
    public void testTypeIdentityInDifferentFiles() {
        try (TSCRuntime runtime = TSCRuntime.init()) {
            Map<Path, String> sources = new HashMap<>();
            sources.put(Paths.get("a.ts"), "export class Foo {}");
            sources.put(Paths.get("b.ts"), "import {Foo} from './a'; const x = new Foo();");
            sources.put(Paths.get("c.ts"), "import {Foo} from './a'; const x = new Foo();");
            AtomicReference<TSCType> inOtherFile = new AtomicReference<>();
            AtomicBoolean checked = new AtomicBoolean();
            runtime.parseSourceTexts(sources, (root, ctx) -> {
                if (ctx.getRelativeSourcePath().toString().equals("a.ts")) {
                    return;
                }
                TSCType type = root.firstNodeWithText("x").getTypeForNode();
                if (inOtherFile.get() == null) {
                    inOtherFile.set(type);
                } else {
                    checked.set(true);
                    assertSame(inOtherFile.get(), type);
                }
            });
            assertThat(checked.get()).isTrue();
        }
    }

    @Test
    public void testNumberFlags() {
        parseSingleSource("const x: number = 2;", (root, ctx) -> {
            TSCNode name = root.firstNodeWithText("x");
            TSCType type = Objects.requireNonNull(name.getTypeForNode());
            assertNotNull(type);
            assertTrue(type.hasExactTypeFlag(TSCTypeFlag.Number));
        });
    }

    @Test
    public void testClassTypeFlags() {
        parseSingleSource("class Cls{} const x: Cls = new Cls();", (root, ctx) -> {
            TSCNode name = root.firstNodeWithText("x");
            TSCType type = Objects.requireNonNull(name.getTypeForNode());
            assertTrue(type.hasExactTypeFlag(TSCTypeFlag.Object));
            assertTrue(type.hasObjectFlag(TSCObjectFlag.Class));
        });
    }

    @Test
    public void testInterfaceTypeWrapper() {
        parseSingleSource("class Cls{y: string} const x: Cls = new Cls();", (root, ctx) -> {
            TSCNode name = root.firstNodeWithText("x");
            TSCType type = Objects.requireNonNull(name.getTypeForNode());

            TSCType.InterfaceType wrapper = Objects.requireNonNull(type.asInterfaceType());
            assertNotNull(wrapper.getThisType());
        });
    }

    @Test
    public void compilerOptionsHandleJsExtension() {
        parseSingleSource("const x = 3;", "file.js", (root, ctx) -> {
        });
    }

    @Test
    public void nodeReturnsSourceFile() {
        parseSingleSource("const x = 3;", "file.js", (root, ctx) -> {
            TSCNode ident = root.firstNodeWithText("x");
            TSCNode.SourceFile sourceFile = ident.getSourceFile();
            assertEquals("/app/file.js", sourceFile.getFileName());
            assertEquals("/app/file.js", sourceFile.getPath());
        });
    }

    @Test
    public void nodeHasParent() {
        parseSingleSource("const x = 3;", "file.js", (root, ctx) -> {
            TSCNode ident = root.firstNodeWithText("x");
            TSCNode parent = ident.getParent().getParent().getParent().getParent();
            assertSame(root, parent);
        });
    }

    @Test
    public void testGlobalFunctions() {
        parseSingleSource("class A {private foo: string;}", (root, ctx) -> {
            TSCNode stmt = root.firstNodeWithText("private foo: string;");
            List<TSCNode> modifiers = stmt.getProgramContext().getTypeScriptGlobals().getModifiers(stmt);
            assertNotNull(modifiers);
            assertEquals(1, modifiers.size());
        });
    }

    @Test
    public void testNodeConstructorName() {
        parseSingleSource("const x = 3;", (root, ctx) -> {
            TSCNode ident = root.firstNodeWithText("x");
            assertEquals("IdentifierObject", ident.getConstructorName());
        });
    }

    @Test
    public void testNodeConstructorKind() {
        parseSingleSource("const x = 3;", (root, ctx) -> {
            TSCInstanceOfChecks instanceOfChecks = ctx.getProgramContext().getInstanceOfChecks();

            assertEquals(
              TSCInstanceOfChecks.ConstructorKind.SourceFile,
              instanceOfChecks.identifyConstructorKind(root.getBackingV8Object())
            );

            TSCNode ident = root.firstNodeWithText("x");
            assertEquals(
              TSCInstanceOfChecks.ConstructorKind.Identifier,
              instanceOfChecks.identifyConstructorKind(ident.getBackingV8Object())
            );

            TSCNode stmt = root.firstNodeWithText("const x = 3;");
            assertEquals(
              TSCInstanceOfChecks.ConstructorKind.Node,
              instanceOfChecks.identifyConstructorKind(stmt.getBackingV8Object())
            );
        });
    }

    @Test
    public void testTypeNodeType() {
        parseSingleSource(
          """
          class Foo {}
                          
          function test(x: Foo) {
          }
          """,
          (root, ctx) -> {
              TSCNode Foo = root.firstNodeWithText("class Foo {}");
              TSCType FooType = Foo.getTypeForNode();

              TSCNode x = root.firstNodeWithText("x: Foo");
              TSCNode.TypeNode xTypeNode = x.getTypeNodeProperty("type");
              TSCType xType = xTypeNode.getTypeFromTypeNode();

              assertSame(FooType, xType);
          }
        );
    }

    @Test
    public void testGenericTypeBound() {
        parseSingleSource(
          """
          class A<T extends string> {}
          """,
          (root, ctx) -> {
              TSCNode classDef = root.firstNodeContaining("class A");
              TSCType classType = classDef.getTypeForNode();
              assertNotNull(classType);

              TSCType.InterfaceType asInterfaceType = classType.assertInterfaceType();
              List<TSCType> typeParams = asInterfaceType.getTypeParameters();
              assertNotNull(typeParams);
              assertEquals(1, typeParams.size());

              TSCType typeParam = typeParams.get(0);
              assertNotNull(typeParam);

              TSCType typeParamConstraint = typeParam.getConstraint();
              assertNotNull(typeParamConstraint);

              TSCType globalStringType = ctx.getProgramContext().getTypeChecker().getStringType();
              assertSame(globalStringType, typeParamConstraint);
          }
        );
    }

    @Test
    public void testGenericTypeBoundWithLocalReference() {
        parseSingleSource(
          """
          class A<T1, T2 extends B<string, T1, number>> {}
          interface B<U1, U2, U3> {
              foo(): [U1, U2, U3];
          }
          """,
          (root, ctx) -> {
              TSCType classA = root.firstNodeContaining("class A").getTypeForNode();
              assertNotNull(classA);

              TSCType interfaceB = root.firstNodeContaining("interface B").getTypeForNode();
              assertNotNull(interfaceB);

              TSCType.InterfaceType asInterfaceType = classA.assertInterfaceType();
              List<TSCType> typeParams = asInterfaceType.getTypeParameters();
              assertNotNull(typeParams);
              assertEquals(2, typeParams.size());

              TSCType typeParam1 = typeParams.get(0);
              TSCType typeParam2 = typeParams.get(1);
              assertNotNull(typeParam1);
              assertNotNull(typeParam2);

              TSCType typeParam1Constraint = typeParam1.getConstraint();
              TSCType typeParam2Constraint = typeParam2.getConstraint();
              assertNull(typeParam1Constraint);
              assertNotNull(typeParam2Constraint);

              TSCType globalStringType = ctx.getProgramContext().getTypeChecker().getStringType();
              TSCType globalNumberType = ctx.getProgramContext().getTypeChecker().getNumberType();

              // The constraint type args are those passed to `B` in `T2 extends B<string, T1, number>`
              List<TSCType> constraintTypeArgs = typeParam2Constraint.assertTypeReference().getTypeArguments();
              assertEquals(3, constraintTypeArgs.size());
              // Used type variables, i.e. `string, T1, number`
              assertSame(globalStringType, constraintTypeArgs.get(0));
              assertSame(typeParam1, constraintTypeArgs.get(1));
              assertSame(globalNumberType, constraintTypeArgs.get(2));
          }
        );
    }

    @Test
    public void testLibSupport() {
        // Explicitly turn libs off --> `string` type should be empty
        parseSingleSource(
          "const x: string = '';",
          runtime -> runtime.setCompilerOptionOverride("noLib", true),
          (root, ctx) -> {
              TSCNode x = root.firstNodeContaining("x");
              TSCType xType = x.getTypeForNode();
              assertNotNull(xType);
              assertEquals(0, xType.getTypeProperties().size());
          }
        );

        // Explicitly turn libs on --> `string` type should have properties
        parseSingleSource(
          "const x: string = '';",
          runtime -> runtime.setCompilerOptionOverride("lib", Collections.singletonList("ES2020")),
          (root, ctx) -> {
              TSCNode x = root.firstNodeContaining("x");
              TSCType xType = x.getTypeForNode();
              assertNotNull(xType);
              assertNotEquals(0, xType.getTypeProperties().size());
          }
        );

        // Default lib --> `string` type should also have properties
        parseSingleSource(
          "const x: string = '';",
          (root, ctx) -> {
              TSCNode x = root.firstNodeContaining("x");
              TSCType xType = x.getTypeForNode();
              assertNotNull(xType);
              assertNotEquals(0, xType.getTypeProperties().size());
          }
        );
    }

    @Test
    public void testBridgeSourceInfo() {
        parseSingleSource(
          """
          class Foo {}
                          
          function test(x: String) {}
          """,
          "example.ts",
          (root, ctx) -> {
              TSCNode Foo = root.firstNodeWithText("Foo");
              assertEquals(
                new TSCProgramContext.CompilerBridgeSourceInfo(
                  TSCProgramContext.CompilerBridgeSourceKind.ApplicationCode,
                  Paths.get("example.ts")
                ),
                Foo.getSourceFile().getCompilerBridgeSourceInfo()
              );

              TSCNode string = root.firstNodeWithText("String");
              TSCType stringType = string.getTypeForNode();
              assertNotNull(stringType);
              List<TSCNode> declarations = stringType.getSymbolForType().getDeclarations();
              assertNotNull(declarations);
              assertFalse(declarations.isEmpty());
              for (TSCNode declaration : declarations) {
                  TSCProgramContext.CompilerBridgeSourceInfo declSourceInfo = declaration.getSourceFile().getCompilerBridgeSourceInfo();
                  assertEquals(
                    TSCProgramContext.CompilerBridgeSourceKind.SystemLibrary,
                    declSourceInfo.getSourceKind()
                  );
                  assertTrue(declSourceInfo.getRelativePath().toString().startsWith("lib."));
              }
          }
        );
    }

    @Test
    public void missingImportDoesNotThrow() {
        parseSingleSource(
                """
                import * as doesNotExist from './does/not/exist';
                                
                function test() {
                    return doesNotExist;
                }
                """,
                "example.ts",
                (root, ctx) -> {
                }
        );
    }

    @Test
    public void missingDirectiveOrDirectiveDoesNotThrow() {
        parseSingleSource(
                """
                /// <reference path='..\\..\\src\\compiler\\tsc.ts'/>
                                
                function test() {
                    return 42;
                }
                """,
                "example.ts",
                (root, ctx) -> {
                }
        );
    }

    @Test
    public void testEmptyFile() {
        parseSingleSource("", (root, ctx) -> {});
    }
}
