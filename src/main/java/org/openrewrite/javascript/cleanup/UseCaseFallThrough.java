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
package org.openrewrite.javascript.cleanup;

import lombok.EqualsAndHashCode;
import lombok.Value;
import org.openrewrite.ExecutionContext;
import org.openrewrite.Recipe;
import org.openrewrite.Tree;
import org.openrewrite.TreeVisitor;
import org.openrewrite.internal.ListUtils;
import org.openrewrite.java.tree.*;
import org.openrewrite.javascript.JavaScriptIsoVisitor;
import org.openrewrite.marker.Markers;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static java.util.Collections.singletonList;

@Value
@EqualsAndHashCode(callSuper = true)
public class UseCaseFallThrough extends Recipe {

    @Override
    public String getDisplayName() {
        return "Replaces comma and logical OR operator with fall-through cases in switch statements";
    }

    @Override
    public String getDescription() {
        return "The comma `,` operator evaluates each of its operands (from left to right) and returns the value of the last operand." +
                "The logical OR `||` operator only evaluates the first argument." +
                "This recipe replaces the comma and logical OR operator with fall-through cases in switch statements.";
    }

    @Override
    public Set<String> getTags() {
        return Collections.singleton("RSPEC-3616");
    }

    @Override
    public Duration getEstimatedEffortPerOccurrence() {
        return Duration.ofMinutes(5);
    }

    @Override
    public TreeVisitor<?, ExecutionContext> getVisitor() {
        return new JavaScriptIsoVisitor<ExecutionContext>() {
            @Override
            public J.Switch visitSwitch(J.Switch switch_, ExecutionContext executionContext) {
                J.Switch s = super.visitSwitch(switch_, executionContext);
                if (switch_.getSelector().getType() == JavaType.Primitive.Boolean) {
                    return switch_;
                }

                s = s.withCases(s.getCases().withStatements(ListUtils.flatMap(s.getCases().getStatements(), it -> {
                    if (it instanceof J.Case && changeCondition(((J.Case) it).getExpressions())) {
                        J.Case c = (J.Case) it;
                        final List<Statement> converted = convertToFallThrough(c);
                        return ListUtils.map(converted, (i, st) -> {
                            if (st instanceof J.Case) {
                                if (i == converted.size() - 1) {
                                    return ((J.Case) st).getPadding().withStatements(c.getPadding().getStatements());
                                }
                            }
                            return st;
                        });
                    }
                    return it;
                })));
                return s;
            }

            class CaseFallThrough extends JavaScriptIsoVisitor<List<Statement>> {
                final Space prefix;

                public CaseFallThrough(Space prefix) {
                    this.prefix = prefix;
                }

                @Override
                public J.Binary visitBinary(J.Binary binary, List<Statement> statements) {
                    if (binary.getLeft() instanceof J.Binary) {
                        super.visitBinary(binary, statements);
                        statements.add(convertToCase(binary.getRight()));
                    } else {
                        statements.add(convertToCase(binary.getLeft()));
                        statements.add(convertToCase(binary.getRight()));
                    }
                    return binary;
                }

                private Statement convertToCase(Expression expression) {
                    return new J.Case(
                            Tree.randomId(),
                            prefix,
                            Markers.EMPTY,
                            J.Binary.Case.Type.Statement,
                            null,
                            JContainer.build(singletonList(JRightPadded.build(expression.withPrefix(Space.build(" ", expression.getPrefix().getComments()))))),
                            JContainer.empty(),
                            null
                    );
                }
            }

            private List<Statement> convertToFallThrough(J.Case c) {
                List<Statement> cases = new ArrayList<>();
                new CaseFallThrough(c.getPrefix()).visit(c, cases);
                return cases;
            }

            private boolean changeCondition(List<Expression> expressions) {
                for (Expression expression : expressions) {
                    if (!(expression instanceof J.Binary) || !isTarget((J.Binary) expression)) {
                        return false;
                    }
                }
                return true;
            }

            private boolean isTarget(J.Binary binary) {
                if (!(binary.getLeft() instanceof J.Binary)) {
                    return binary.getOperator() == J.Binary.Type.Or;
                }
                return isTarget((J.Binary) binary.getLeft()) && binary.getOperator() == J.Binary.Type.Or;
            }
        };
    }
}
