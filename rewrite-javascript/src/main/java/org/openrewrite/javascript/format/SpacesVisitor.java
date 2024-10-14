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

import org.openrewrite.Incubating;
import org.openrewrite.internal.ListUtils;
import org.openrewrite.internal.StringUtils;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.JavaScriptIsoVisitor;
import org.openrewrite.javascript.style.SpacesStyle;

import java.util.List;

@Incubating(since = "1.x")
public class SpacesVisitor<P> extends JavaScriptIsoVisitor<P> {

    private final SpacesStyle style;

    public SpacesVisitor(SpacesStyle style) {
        this.style = style;
    }

    <T extends J> T spaceBefore(T j, boolean spaceBefore) {
        if (!j.getComments().isEmpty()) {
            return j;
        }

        if (spaceBefore && notSingleSpace(j.getPrefix().getWhitespace())) {
            return j.withPrefix(j.getPrefix().withWhitespace(" "));
        } else if (!spaceBefore && onlySpacesAndNotEmpty(j.getPrefix().getWhitespace())) {
            return j.withPrefix(j.getPrefix().withWhitespace(""));
        } else {
            return j;
        }
    }

    <T> JContainer<T> spaceBefore(JContainer<T> container, boolean spaceBefore) {
        if (!container.getBefore().getComments().isEmpty()) {
            // Perform the space rule for the suffix of the last comment only. Same as IntelliJ.
            List<Comment> comments = spaceLastCommentSuffix(container.getBefore().getComments(), spaceBefore);
            return container.withBefore(container.getBefore().withComments(comments));
        }

        if (spaceBefore && notSingleSpace(container.getBefore().getWhitespace())) {
            return container.withBefore(container.getBefore().withWhitespace(" "));
        } else if (!spaceBefore && onlySpacesAndNotEmpty(container.getBefore().getWhitespace())) {
            return container.withBefore(container.getBefore().withWhitespace(""));
        } else {
            return container;
        }
    }

    <T extends J> JLeftPadded<T> spaceBefore(JLeftPadded<T> container, boolean spaceBefore) {
        if (!container.getBefore().getComments().isEmpty()) {
            return container;
        }

        if (spaceBefore && notSingleSpace(container.getBefore().getWhitespace())) {
            return container.withBefore(container.getBefore().withWhitespace(" "));
        } else if (!spaceBefore && onlySpacesAndNotEmpty(container.getBefore().getWhitespace())) {
            return container.withBefore(container.getBefore().withWhitespace(""));
        } else {
            return container;
        }
    }

    <T extends J> JLeftPadded<T> spaceBeforeLeftPaddedElement(JLeftPadded<T> container, boolean spaceBefore) {
        return container.withElement(spaceBefore(container.getElement(), spaceBefore));
    }

    <T extends J> JRightPadded<T> spaceBeforeRightPaddedElement(JRightPadded<T> container, boolean spaceBefore) {
        return container.withElement(spaceBefore(container.getElement(), spaceBefore));
    }

    <T extends J> JRightPadded<T> spaceAfter(JRightPadded<T> container, boolean spaceAfter) {
        if (!container.getAfter().getComments().isEmpty()) {
            // Perform the space rule for the suffix of the last comment only. Same as IntelliJ.
            List<Comment> comments = spaceLastCommentSuffix(container.getAfter().getComments(), spaceAfter);
            return container.withAfter(container.getAfter().withComments(comments));
        }

        if (spaceAfter && notSingleSpace(container.getAfter().getWhitespace())) {
            return container.withAfter(container.getAfter().withWhitespace(" "));
        } else if (!spaceAfter && onlySpacesAndNotEmpty(container.getAfter().getWhitespace())) {
            return container.withAfter(container.getAfter().withWhitespace(""));
        } else {
            return container;
        }
    }

    private static List<Comment> spaceLastCommentSuffix(List<Comment> comments, boolean spaceSuffix) {
        return ListUtils.mapLast(comments,
                comment -> spaceSuffix(comment, spaceSuffix));
    }

    private static Comment spaceSuffix(Comment comment, boolean spaceSuffix) {
        if (spaceSuffix && notSingleSpace(comment.getSuffix())) {
            return comment.withSuffix(" ");
        } else if (!spaceSuffix && onlySpacesAndNotEmpty(comment.getSuffix())) {
            return comment.withSuffix("");
        } else {
            return comment;
        }
    }

    /**
     * Checks if a string only contains spaces or tabs (excluding newline characters).
     *
     * @return true if contains spaces or tabs only, or true for empty string.
     */
    private static boolean onlySpaces(String s) {
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c != ' ' && c != '\t') {
                return false;
            }
        }
        return true;
    }

    private static boolean onlySpacesAndNotEmpty(String s) {
        return !StringUtils.isNullOrEmpty(s) && onlySpaces(s);
    }

    private static boolean notSingleSpace(String str) {
        return onlySpaces(str) && !" ".equals(str);
    }

    @Override
    public J.MethodDeclaration visitMethodDeclaration(J.MethodDeclaration method, P p) {
        J.MethodDeclaration m = super.visitMethodDeclaration(method, p);
        if (m.getReturnTypeExpression() != null) {
            boolean useSpaceAfter = style.getOther().getAfterTypeReferenceColon();
            m = m.withReturnTypeExpression(spaceBefore(m.getReturnTypeExpression(), useSpaceAfter));
        }
        m = m.getPadding().withParameters(
                spaceBefore(m.getPadding().getParameters(), style.getBeforeParentheses().getFunctionDeclarationParentheses()));
        if (m.getBody() != null) {
            m = m.withBody(spaceBefore(m.getBody(), style.getBeforeLeftBrace().getFunctionLeftBrace()));
        }
        if (!m.getParameters().isEmpty() && !(m.getParameters().iterator().next() instanceof J.Empty)) {
            final int paramsSize = m.getParameters().size();
            boolean useSpace = style.getWithin().getFunctionDeclarationParentheses();
            m = m.getPadding().withParameters(
                    m.getPadding().getParameters().getPadding().withElements(
                            ListUtils.map(m.getPadding().getParameters().getPadding().getElements(),
                                    (index, param) -> {
                                        if (index == 0) {
                                            param = param.withElement(spaceBefore(param.getElement(), useSpace));
                                        } else {
                                            param = param.withElement(
                                                    spaceBefore(param.getElement(), style.getOther().getAfterComma())
                                            );
                                        }
                                        if (index == paramsSize - 1) {
                                            param = spaceAfter(param, useSpace);
                                        } else {
                                            param = spaceAfter(param, style.getOther().getBeforeComma());
                                        }
                                        return param;
                                    }
                            )
                    )
            );
        }
//        if (m.getAnnotations().getTypeParameters() != null) {
//            boolean spaceWithinAngleBrackets = style.getWithin().getAngleBrackets();
//            int typeParametersSize = m.getAnnotations().getTypeParameters().getTypeParameters().size();
//            m = m.getAnnotations().withTypeParameters(
//                    m.getAnnotations().getTypeParameters().getPadding().withTypeParameters(
//                            ListUtils.map(m.getAnnotations().getTypeParameters().getPadding().getTypeParameters(),
//                                    (index, elemContainer) -> {
//                                        if (index == 0) {
//                                            elemContainer = elemContainer.withElement(
//                                                    spaceBefore(elemContainer.getElement(), spaceWithinAngleBrackets)
//                                            );
//                                        } else {
//                                            elemContainer = elemContainer.withElement(
//                                                    spaceBefore(elemContainer.getElement(),
//                                                            style.getOther().getAfterComma())
//                                            );
//                                        }
//                                        if (index == typeParametersSize - 1) {
//                                            elemContainer = spaceAfter(elemContainer, spaceWithinAngleBrackets);
//                                        }
//                                        return elemContainer;
//                                    })
//                    )
//            );
//        }
        return m;
    }

    @Override
    public J.MethodInvocation visitMethodInvocation(J.MethodInvocation method, P p) {
        J.MethodInvocation m = super.visitMethodInvocation(method, p);
        m = m.getPadding().withArguments(spaceBefore(m.getPadding().getArguments(), style.getBeforeParentheses().getFunctionCallParentheses()));
        if (!m.getArguments().isEmpty() && !(m.getArguments().iterator().next() instanceof J.Empty)) {
            final int argsSize = m.getArguments().size();
            boolean useSpace = style.getWithin().getFunctionCallParentheses();
            m = m.getPadding().withArguments(
                    m.getPadding().getArguments().getPadding().withElements(
                            ListUtils.map(m.getPadding().getArguments().getPadding().getElements(),
                                    (index, arg) -> {
                                        if (index == 0) {
                                            arg = arg.withElement(spaceBefore(arg.getElement(), useSpace));
                                        } else {
                                            arg = arg.withElement(
                                                    spaceBefore(arg.getElement(), style.getOther().getAfterComma())
                                            );
                                        }
                                        if (index == argsSize - 1) {
                                            arg = spaceAfter(arg, useSpace);
                                        } else {
                                            arg = spaceAfter(arg, style.getOther().getBeforeComma());
                                        }
                                        return arg;
                                    }
                            )
                    )
            );
        }
        return m;
    }

    @Override
    public J.NewClass visitNewClass(J.NewClass newClass, P p) {
        J.NewClass nc = super.visitNewClass(newClass, p);
        if (nc.getPadding().getArguments() != null) {
            nc = nc.getPadding().withArguments(spaceBefore(nc.getPadding().getArguments(), style.getBeforeParentheses().getFunctionCallParentheses()));
            int argsSize = nc.getPadding().getArguments().getElements().size();
            nc = nc.getPadding().withArguments(
                    nc.getPadding().getArguments().getPadding().withElements(
                            ListUtils.map(nc.getPadding().getArguments().getPadding().getElements(),
                                    (index, elemContainer) -> {
                                        if (index != 0) {
                                            elemContainer = elemContainer.withElement(
                                                    spaceBefore(elemContainer.getElement(), style.getOther().getAfterComma())
                                            );
                                        }
                                        if (index != argsSize - 1) {
                                            elemContainer = spaceAfter(elemContainer, style.getOther().getBeforeComma());
                                        }
                                        return elemContainer;
                                    }
                            )
                    )
            );
        }
        return nc;
    }

    @Override
    public J.VariableDeclarations visitVariableDeclarations(J.VariableDeclarations multiVariable, P p) {
        J.VariableDeclarations m = super.visitVariableDeclarations(multiVariable, p);
        if (m.getTypeExpression() != null) {
            boolean useSpaceAfter = style.getOther().getAfterPropertyNameValueSeparator();
            m = m.withTypeExpression(spaceBefore(m.getTypeExpression(), useSpaceAfter));
        }
        return m;
    }
}
