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
package org.openrewrite.javascript.internal.tsc;

import com.caoccao.javet.values.reference.V8ValueObject;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;

import java.util.*;

public class TSCSyntaxListNode extends TSCNode implements List<TSCNode> {
    @Nullable
    private List<TSCNode> children;

    public TSCSyntaxListNode(TSCProgramContext programContext, V8ValueObject nodeV8) {
        super(programContext, nodeV8);
    }

    private List<TSCNode> getChildren() {
        if (children == null) {
            children = this.getNodeListProperty("_children");
        }
        return children;
    }

    @Override
    public int size() {
        return getChildren().size();
    }

    @Override
    public boolean isEmpty() {
        return getChildren().isEmpty();
    }

    @Override
    public boolean contains(Object o) {
        return getChildren().contains(o);
    }

    @NonNull
    @Override
    public Iterator<TSCNode> iterator() {
        return getChildren().iterator();
    }

    @NonNull
    @Override
    public Object[] toArray() {
        return getChildren().toArray();
    }

    @NonNull
    @Override
    public <T> T[] toArray(@NonNull T[] a) {
        return getChildren().toArray(a);
    }

    @Override
    public boolean add(TSCNode tscNode) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public boolean remove(Object o) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public boolean containsAll(@NonNull Collection<?> c) {
        return new HashSet<>(getChildren()).containsAll(c);
    }

    @Override
    public boolean addAll(@NonNull Collection<? extends TSCNode> c) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public boolean addAll(int index, @NonNull Collection<? extends TSCNode> c) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public boolean removeAll(@NonNull Collection<?> c) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public boolean retainAll(@NonNull Collection<?> c) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public void clear() {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public TSCNode get(int index) {
        return getChildren().get(index);
    }

    @Override
    public TSCNode set(int index, TSCNode element) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public void add(int index, TSCNode element) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public TSCNode remove(int index) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public int indexOf(Object o) {
        return getChildren().indexOf(o);
    }

    @Override
    public int lastIndexOf(Object o) {
        return getChildren().lastIndexOf(o);
    }

    @NonNull
    @Override
    public ListIterator<TSCNode> listIterator() {
        return getChildren().listIterator();
    }

    @NonNull
    @Override
    public ListIterator<TSCNode> listIterator(int index) {
        return getChildren().listIterator(index);
    }

    @NonNull
    @Override
    public List<TSCNode> subList(int fromIndex, int toIndex) {
        return getChildren().subList(fromIndex, toIndex);
    }
}
