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

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.reference.V8ValueArray;
import com.caoccao.javet.values.reference.V8ValueObject;

import java.util.*;

public class TSCNodeList implements TSCV8Backed, List<TSCNode> {

    public static TSCNodeList wrap(TSCProgramContext programContext, V8ValueObject maybeArrayV8) {
        if (!(maybeArrayV8 instanceof V8ValueArray)) {
            throw new IllegalArgumentException("expected a v8 array");
        }
        return new TSCNodeList(programContext, (V8ValueArray) maybeArrayV8);
    }

    private final TSCProgramContext programContext;
    private final V8ValueArray arrayV8;

    private TSCNodeList(TSCProgramContext programContext, V8ValueArray arrayV8) {
        this.programContext = programContext;
        this.arrayV8 = arrayV8;
    }

    @Override
    public TSCProgramContext getProgramContext() {
        return programContext;
    }

    @Override
    public V8ValueArray getBackingV8Object() {
        return arrayV8;
    }

    @Override
    public int size() {
        try {
            return arrayV8.getLength();
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean isEmpty() {
        return size() == 0;
    }

    @Override
    public boolean contains(Object o) {
        return indexOf(o) >= 0;
    }

    @Override
    public Iterator<TSCNode> iterator() {
        return listIterator();
    }

    @Override
    public Object[] toArray() {
        int size = size();
        Object[] array = new Object[size];
        for (int i = 0; i < size; i++) {
            array[i] = get(i);
        }
        return array;
    }

    @Override
    public <T2> T2[] toArray(T2[] array) {
        int size = size();
        if (array.length < size) {
            array = Arrays.copyOf(array, size);
        }
        for (int i = 0; i < size; i++) {
            array[i] = (T2) get(i);
        }
        return array;
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
    public boolean containsAll(Collection<?> args) {
        for (Object arg : args) {
            if (!contains(arg)) {
                return false;
            }
        }
        return true;
    }

    @Override
    public boolean addAll(Collection<? extends TSCNode> c) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public boolean addAll(int index, Collection<? extends TSCNode> c) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public boolean removeAll(Collection<?> c) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public boolean retainAll(Collection<?> c) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public void clear() {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public TSCNode get(int index) {
        try (V8Value childV8 = arrayV8.get(index)) {
            return programContext.tscNode((V8ValueObject) childV8);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
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
        if (!(o instanceof TSCNode)) {
            return -1;
        }
        TSCNode node = (TSCNode) o;
        final int size = size();
        for (int i = 0; i < size; i++) {
            if (get(i) == node) {
                return i;
            }
        }
        return -1;
    }

    @Override
    public int lastIndexOf(Object o) {
        if (!(o instanceof TSCNode)) {
            return -1;
        }
        TSCNode node = (TSCNode) o;
        final int size = size();
        for (int i = size - 1; i >= 0; i--) {
            if (get(i) == node) {
                return i;
            }
        }
        return -1;
    }

    @Override
    public ListIterator<TSCNode> listIterator() {
        return listIterator(0);
    }

    @Override
    public ListIterator<TSCNode> listIterator(int startIndex) {
        return new ListIterator<TSCNode>() {

            final int size = size();
            int cursor = startIndex;

            @Override
            public boolean hasNext() {
                return cursor < size;
            }

            @Override
            public TSCNode next() {
                return get(cursor++);
            }

            @Override
            public boolean hasPrevious() {
                return cursor > 0;
            }

            @Override
            public TSCNode previous() {
                return get(--cursor);
            }

            @Override
            public int nextIndex() {
                return cursor;
            }

            @Override
            public int previousIndex() {
                return cursor - 1;
            }

            @Override
            public void remove() {
                throw new UnsupportedOperationException("node list is not modifiable");
            }

            @Override
            public void set(TSCNode tscNode) {
                throw new UnsupportedOperationException("node list is not modifiable");
            }

            @Override
            public void add(TSCNode tscNode) {
                throw new UnsupportedOperationException("node list is not modifiable");
            }
        };
    }

    @Override
    public List<TSCNode> subList(int fromIndex, int toIndex) {
        ArrayList<TSCNode> result = new ArrayList<>(toIndex - fromIndex);
        for (int i = fromIndex; i < toIndex; i++) {
            result.add(get(i));
        }
        return result;
    }
}
