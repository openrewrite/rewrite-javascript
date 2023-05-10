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
import org.openrewrite.internal.lang.NonNull;

import java.util.*;

import static org.openrewrite.javascript.internal.tsc.TSCConversions.NODE;

public class TSCNodeList<T extends TSCNode> implements TSCV8Backed, List<T> {

    public static <T extends TSCNode> TSCNodeList<T> wrap(TSCProgramContext programContext, V8ValueArray arrayV8, TSCConversion<T> conversion) {
        return new TSCNodeList<>(programContext, arrayV8, conversion);
    }

    private final TSCProgramContext programContext;
    private final V8ValueArray arrayV8;
    private final TSCConversion<T> conversion;

    private TSCNodeList(TSCProgramContext programContext, V8ValueArray arrayV8, TSCConversion<T> conversion) {
        this.programContext = programContext;
        this.arrayV8 = arrayV8;
        this.conversion = conversion;
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

    @NonNull
    @Override
    public Iterator<T> iterator() {
        return listIterator();
    }

    @NonNull
    @Override
    public Object[] toArray() {
        int size = size();
        Object[] array = new Object[size];
        for (int i = 0; i < size; i++) {
            array[i] = get(i);
        }
        return array;
    }

    @NonNull
    @Override
    public <T2> T2[] toArray(@NonNull T2[] array) {
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
    public boolean containsAll(@NonNull Collection<?> args) {
        for (Object arg : args) {
            if (!contains(arg)) {
                return false;
            }
        }
        return true;
    }

    @Override
    public boolean addAll(@NonNull Collection<? extends T> c) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public boolean addAll(int index, @NonNull Collection<? extends T> c) {
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
    public T get(int index) {
        try (V8Value childV8 = arrayV8.get(index)) {
            return conversion.convertNonNull(programContext, childV8);
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public T set(int index, TSCNode element) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public void add(int index, TSCNode element) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public T remove(int index) {
        throw new UnsupportedOperationException("node list is not modifiable");
    }

    @Override
    public int indexOf(Object o) {
        if (!(o instanceof TSCNode)) {
            return -1;
        }
        T node = (T) o;
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

    @NonNull
    @Override
    public ListIterator<T> listIterator() {
        return listIterator(0);
    }

    @NonNull
    @Override
    public ListIterator<T> listIterator(int startIndex) {
        return new ListIterator<T>() {

            final int size = size();
            int cursor = startIndex;

            @Override
            public boolean hasNext() {
                return cursor < size;
            }

            @Override
            public T next() {
                return get(cursor++);
            }

            @Override
            public boolean hasPrevious() {
                return cursor > 0;
            }

            @Override
            public T previous() {
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

    @NonNull
    @Override
    public List<T> subList(int fromIndex, int toIndex) {
        ArrayList<T> result = new ArrayList<>(toIndex - fromIndex);
        for (int i = fromIndex; i < toIndex; i++) {
            result.add(get(i));
        }
        return result;
    }
}
