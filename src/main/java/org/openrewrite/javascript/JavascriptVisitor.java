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
package org.openrewrite.javascript;

import org.openrewrite.SourceFile;
import org.openrewrite.java.JavaVisitor;
import org.openrewrite.java.tree.J;
import org.openrewrite.java.tree.JRightPadded;
import org.openrewrite.java.tree.JavaSourceFile;
import org.openrewrite.java.tree.Space;
import org.openrewrite.javascript.tree.JS;

public class JavascriptVisitor<P> extends JavaVisitor<P> {

    @Override
    public boolean isAcceptable(SourceFile sourceFile, P p) {
        return sourceFile instanceof JS.CompilationUnit;
    }

    @Override
    public String getLanguage() {
        return "javascript";
    }

    @Override
    public J visitJavaSourceFile(JavaSourceFile cu, P p) {
        return cu instanceof JS.CompilationUnit ? visitCompilationUnit((JS.CompilationUnit) cu, p) : cu;
    }

    @Override
    public J visitCompilationUnit(J.CompilationUnit cu, P p) {
        throw new UnsupportedOperationException("JS has a different structure for its compilation unit. See JS.CompilationUnit.");
    }

    public J visitCompilationUnit(JS.CompilationUnit cu, P p) {
//        beforeSyntax(cu, Space.Location.COMPILATION_UNIT_PREFIX, p);
        visit(cu.getStatements(), p);
//        afterSyntax(cu, p);
        visitSpace(cu.getEof(), Space.Location.COMPILATION_UNIT_EOF, p);
        return cu;
    }

}
