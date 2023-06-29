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
package org.openrewrite.javascript.format;

import org.junit.jupiter.api.Test;
import org.openrewrite.Tree;
import org.openrewrite.javascript.JavaScriptParser;
import org.openrewrite.javascript.style.IntelliJ;
import org.openrewrite.javascript.style.SpacesStyle;
import org.openrewrite.style.NamedStyles;
import org.openrewrite.test.RecipeSpec;
import org.openrewrite.test.RewriteTest;

import java.util.function.Consumer;
import java.util.function.UnaryOperator;

import static java.util.Collections.emptySet;
import static java.util.Collections.singletonList;
import static org.openrewrite.javascript.Assertions.javaScript;

@SuppressWarnings({"JSDuplicatedDeclaration", "ReservedWordAsName", "JSUnusedLocalSymbols", "InfiniteRecursionJS", "JSUnresolvedReference", "TrailingWhitespacesInTextBlock"})
class SpacesTest implements RewriteTest {

    private static Consumer<RecipeSpec> spaces(UnaryOperator<SpacesStyle> with) {
        return spec -> spec.recipe(new Spaces())
                .parser(JavaScriptParser.builder().styles(singletonList(
                        new NamedStyles(Tree.randomId(), "test", "test", "test", emptySet(),
                                singletonList(with.apply(IntelliJ.spaces())))
                )));
    }

    @Test
    void beforeParensFunctionDeclarationTrue() {
        rewriteRun(
          spaces(style -> style.withBeforeParentheses(style.getBeforeParentheses().withFunctionDeclarationParentheses(true))),
          javaScript(
            """
              function method1() {
              }
              function method2()    {
              }
              function method3()	{
              }
              """,
            """
              function method1 () {
              }
              function method2 () {
              }
              function method3 () {
              }
              """
          )
        );
    }

    @Test
    void beforeParensFunctionDeclarationTrueWithComment() {
        rewriteRun(
          spaces(style -> style.withBeforeParentheses(style.getBeforeParentheses().withFunctionDeclarationParentheses(true))),
          javaScript(
            """
              function method1    /*comment*/() {
              }
              """,
            """
              function method1    /*comment*/ () {
              }
              """
          )
        );
    }

    @Test
    void beforeParensFunctionDeclarationFalse() {
        rewriteRun(
          spaces(style -> style.withBeforeParentheses(style.getBeforeParentheses().withFunctionDeclarationParentheses(false))),
          javaScript(
            """
              function method1 () {
              }
              function method2    () {
              }
              function method3  	() {
              }
              """,
            """
              function method1() {
              }
              function method2() {
              }
              function method3() {
              }
              """
          )
        );
    }

    @Test
    void beforeParensFunctionDeclarationFalseWithComment() {
        rewriteRun(
          spaces(style -> style.withBeforeParentheses(style.getBeforeParentheses().withFunctionDeclarationParentheses(false))),
          javaScript(
            """
              function method1    /*comment*/    () {
              }
              """,
            """
              function method1    /*comment*/() {
              }
              """
          )
        );
    }

    @Test
    void beforeParensFunctionDeclarationFalseWithLineBreakIgnored() {
        rewriteRun(
          spaces(style -> style.withBeforeParentheses(style.getBeforeParentheses().withFunctionDeclarationParentheses(false))),
          javaScript(
            """
              function method1 
              () {
              }
              """
          )
        );
    }

    @Test
    void beforeParensFunctionCallTrue() {
        rewriteRun(
          spaces(style -> style.withBeforeParentheses(style.getBeforeParentheses().withFunctionCallParentheses(true))),
          javaScript(
            """
              class Test {}
              function foo() {
                  foo();
                  const test = new Test();
              }
              """,
            """
              class Test {}
              function foo() {
                  foo ();
                  const test = new Test ();
              }
              """
          )
        );
    }

    @Test
    void beforeParensFunctionCallFalse() {
        rewriteRun(
          spaces(style -> style.withBeforeParentheses(style.getBeforeParentheses().withFunctionCallParentheses(false))),
          javaScript(
            """
              class Test {}
              function foo() {
                  foo ();
                  const test = new Test ();
              }
              """,
            """
              class Test {}
              function foo() {
                  foo();
                  const test = new Test();
              }
              """
          )
        );
    }

    @Test
    void beforeLeftBraceFunctionLeftBraceFalse() {
        rewriteRun(
          spaces(style -> style.withBeforeLeftBrace(style.getBeforeLeftBrace().withFunctionLeftBrace(false))),
          javaScript(
            """
              function foo() {
              }
              """,
            """
              function foo(){
              }
              """
          )
        );
    }

    @Test
    void beforeLeftBraceFunctionLeftBraceTrue() {
        rewriteRun(
          spaces(style -> style.withBeforeLeftBrace(style.getBeforeLeftBrace().withFunctionLeftBrace(true))),
          javaScript(
            """
              function foo(){
              }
              """,
            """
              function foo() {
              }
              """
          )
        );
    }

    @Test
    void withinFunctionDeclarationParenthesesTrue() {
        rewriteRun(
          spaces(style -> style.withWithin(style.getWithin().withFunctionDeclarationParentheses(true))),
          javaScript(
            """
              function foo(x: number) {
              }
              function bar(    y: number    ) {
              }
              """,
            """
              function foo( x: number ) {
              }
              function bar( y: number ) {
              }
              """
          )
        );
    }

    @Test
    void compositeFunctionDeclarationParentheses() {
        rewriteRun(
          spaces(style -> style.withWithin(style.getWithin().withFunctionDeclarationParentheses(true))
              .withBeforeParentheses(style.getBeforeParentheses().withFunctionDeclarationParentheses(true))
          ),
          javaScript(
            """
              function  /*c1*/   foo  /*c2*/   (  /*c3*/   x: number, y: number  /*c4*/   ) {
              }
              """,
            """
              function  /*c1*/   foo  /*c2*/ (  /*c3*/   x: number, y: number  /*c4*/ ) {
              }
              """
          )
        );
    }

    @Test
    void withinFunctionDeclarationParenthesesTrueWithComment() {
        rewriteRun(
          spaces(style -> style.withWithin(style.getWithin().withFunctionDeclarationParentheses(true))),
          javaScript(
            """
              function foo(    /*c1*/    x: number    ) {
              }
              function bar(    y: number    /*c2*/    ) {
              }
              function baz(    /*c3*/    z: number    /*c4*/    ) {
              }
              """,
            """
              function foo(    /*c1*/    x: number ) {
              }
              function bar( y: number    /*c2*/ ) {
              }
              function baz(    /*c3*/    z: number    /*c4*/ ) {
              }
              """
          )
        );
    }

    @Test
    void withinFunctionDeclarationParenthesesTrueWithLineBreakIgnored() {
        rewriteRun(
          spaces(style -> style.withWithin(style.getWithin().withFunctionDeclarationParentheses(true))),
          javaScript(
            """
              function foo(
                  x: number
              ) {
              }
              """
          )
        );
    }

    @Test
    void withinFunctionDeclarationParenthesesFalse() {
        rewriteRun(
          spaces(style -> style.withWithin(style.getWithin().withFunctionDeclarationParentheses(false))),
          javaScript(
            """
              function foo( x: number ) {
              }
              """,
            """
              function foo(x: number) {
              }
              """
          )
        );
    }

    @Test
    void withinFunctionCallParenthesesTrue() {
        rewriteRun(
          spaces(style -> style.withWithin(style.getWithin().withFunctionCallParentheses(true))),
          javaScript(
            """
              function bar(x: number) {
              }
              function foo() {
                  bar(1);
              }
              """,
            """
              function bar(x: number) {
              }
              function foo() {
                  bar( 1 );
              }
              """
          )
        );
    }

    @Test
    void withinFunctionCallParenthesesFalse() {
        rewriteRun(
          spaces(style -> style.withWithin(style.getWithin().withFunctionCallParentheses(false))),
          javaScript(
            """
              function bar(x: number) {
              }
              function foo() {
                  bar( 1 );
              }
              """,
            """
              function bar(x: number) {
              }
              function foo() {
                  bar(1);
              }
              """
          )
        );
    }

    @Test
    void otherBeforeCommaTrueFunctionDeclArgs() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withBeforeComma(true))),
          javaScript(
            """
              function bar(x: number, y: number) {
              }
              """,
            """
              function bar(x: number , y: number) {
              }
              """
          )
        );
    }

    @Test
    void otherBeforeCommaFalseFunctionDeclArgs() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withBeforeComma(false))),
          javaScript(
            """
              function bar(x: number , y: number) {
              }
              """,
            """
              function bar(x: number, y: number) {
              }
              """
          )
        );
    }

    @Test
    void otherAfterCommaFalseFunctionDeclArgs() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withAfterComma(false))),
          javaScript(
            """
              function bar(x: number, y: number) {
              }
              """,
            """
              function bar(x: number,y: number) {
              }
              """
          )
        );
    }

    @Test
    void otherAfterCommaTrueFunctionDeclArgs() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withAfterComma(true))),
          javaScript(
            """
              function bar(x: number,y: number) {
              }
              """,
            """
              function bar(x: number, y: number) {
              }
              """
          )
        );
    }

    @Test
    void otherBeforeCommaTrueFunctionInvocationParams() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withBeforeComma(true))),
          javaScript(
            """
              function foo() {
                  bar(1, 2);
              }
              function bar(x: number, y: number) {
              }
              """,
            """
              function foo() {
                  bar(1 , 2);
              }
              function bar(x: number , y: number) {
              }
              """
          )
        );
    }

    @Test
    void otherBeforeCommaFalseFunctionInvocationParams() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withBeforeComma(false))),
          javaScript(
            """
              function foo() {
                  bar(1 , 2);
              }
              function bar(x: number , y: number) {
              }
              """,
            """
              function foo() {
                  bar(1, 2);
              }
              function bar(x: number, y: number) {
              }
              """
          )
        );
    }

    @Test
    void otherAfterCommaFalseFunctionInvocationParams() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withAfterComma(false))),
          javaScript(
            """
              function foo() {
                  bar(1, 2);
              }
              function bar(x: number, y: number) {
              }
              """,
            """
              function foo() {
                  bar(1,2);
              }
              function bar(x: number,y: number) {
              }
              """
          )
        );
    }

    @Test
    void otherAfterCommaTrueFunctionInvocationParams() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withAfterComma(true))),
          javaScript(
            """
              function foo() {
                  bar(1,2);
              }
              function bar(x: number,y: number) {
              }
              """,
            """
              function foo() {
                  bar(1, 2);
              }
              function bar(x: number, y: number) {
              }
              """
          )
        );
    }

    @Test
    void otherBeforeCommaTrueNewClassArgs() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withBeforeComma(true))),
          javaScript(
            """
              function foo() {
                  new A("hello", 1);
              }
              class A {
                  private s: string
                  private i: number
                  constructor(s: string, i: number) {
                      this.s = s
                      this.i = i
                  }
              }
              """,
            """
              function foo() {
                  new A("hello" , 1);
              }
              class A {
                  private s: string
                  private i: number
                  constructor(s: string , i: number) {
                      this.s = s
                      this.i = i
                  }
              }
              """
          )
        );
    }

    @Test
    void otherBeforeCommaFalseNewClassArgs() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withBeforeComma(false))),
          javaScript(
            """
              function foo() {
                  new A("hello" , 1);
              }
              class A {
                  private s: string
                  private i: number
                  constructor(s: string , i: number) {
                      this.s = s
                      this.i = i
                  }
              }
              """,
            """
              function foo() {
                  new A("hello", 1);
              }
              class A {
                  private s: string
                  private i: number
                  constructor(s: string, i: number) {
                      this.s = s
                      this.i = i
                  }
              }
              """
          )
        );
    }

    @Test
    void otherAfterCommaFalseNewClassArgs() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withAfterComma(false))),
          javaScript(
            """
              function foo() {
                  new A("hello", 1);
              }
              class A {
                  private s: string
                  private i: number
                  constructor(s: string, i: number) {
                      this.s = s
                      this.i = i
                  }
              }
              """,
            """
              function foo() {
                  new A("hello",1);
              }
              class A {
                  private s: string
                  private i: number
                  constructor(s: string,i: number) {
                      this.s = s
                      this.i = i
                  }
              }
              """
          )
        );
    }

    @Test
    void otherAfterCommaTrueNewClassArgs() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withAfterComma(true))),
          javaScript(
            """
              function foo() {
                  new A("hello",1);
              }
              class A {
                  private s: string
                  private i: number
                  constructor(s: string,i: number) {
                      this.s = s
                      this.i = i
                  }
              }
              """,
            """
              function foo() {
                  new A("hello", 1);
              }
              class A {
                  private s: string
                  private i: number
                  constructor(s: string, i: number) {
                      this.s = s
                      this.i = i
                  }
              }
              """
          )
        );
    }

    @Test
    void otherBeforeTypeReferenceColonFalse() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withBeforeTypeReferenceColon(false))),
          javaScript(
            """
              function foo() : boolean {
                  return true
              }
              """,
            """
              function foo(): boolean {
                  return true
              }
              """
          )
        );
    }

    @Test
    void otherBeforeTypeReferenceColonTrue() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withBeforeTypeReferenceColon(true))),
          javaScript(
            """
              function foo(): boolean {
                  return true
              }
              """,
            """
              function foo() : boolean {
                  return true
              }
              """
          )
        );
    }

    @Test
    void otherAfterTypeReferenceColonFalse() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withAfterTypeReferenceColon(false))),
          javaScript(
            """
              function foo(): boolean {
                  return true
              }
              """,
            """
              function foo():boolean {
                  return true
              }
              """
          )
        );
    }

    @Test
    void otherAfterTypeReferenceColonTrue() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withAfterTypeReferenceColon(true))),
          javaScript(
            """
              function foo():boolean {
                  return true
              }
              """,
            """
              function foo(): boolean {
                  return true
              }
              """
          )
        );
    }

    @Test
    void otherBeforePropertyNameValueColonFalse() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withBeforePropertyNameValueSeparator(false))),
          javaScript(
            """
              function foo(x : boolean) {
              }
              """,
            """
              function foo(x: boolean) {
              }
              """
          )
        );
    }

    @Test
    void otherBeforePropertyNameValueColonTrue() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withBeforePropertyNameValueSeparator(true))),
          javaScript(
            """
              function foo(x: boolean) {
              }
              """,
            """
              function foo(x : boolean) {
              }
              """
          )
        );
    }

    @Test
    void otherAfterPropertyNameValueColonFalse() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withAfterPropertyNameValueSeparator(false))),
          javaScript(
            """
              function foo(x: boolean) {
              }
              """,
            """
              function foo(x:boolean) {
              }
              """
          )
        );
    }

    @Test
    void otherAfterPropertyNameValueColonTrue() {
        rewriteRun(
          spaces(style -> style.withOther(style.getOther().withAfterPropertyNameValueSeparator(true))),
          javaScript(
            """
              function foo(x:boolean) {
              }
              """,
            """
              function foo(x: boolean) {
              }
              """
          )
        );
    }
}
