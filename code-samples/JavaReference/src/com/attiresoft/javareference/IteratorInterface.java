package com.attiresoft.javareference;

import java.util.*;
import java.util.function.IntConsumer;
import java.util.stream.IntStream;

public class IteratorInterface {
    /*
    Interface IteratorInterface<E>
    https://docs.oracle.com/javase/10/docs/api/java/util/Iterator.html

    default void	forEachRemaining​(Consumer<? super E> action)
    boolean	hasNext()
    E	next()
    default void	remove()
    */
    public static void main(String[] args) {
        /*
        Iterable Creation:
        Collection Arrays.stream().forEach stream.iterator
        PrimitiveIterator.forEachRemaining
         */
        new IteratorCreation();
        new IteratorUse();
    }

    public static class IteratorCreation {
        public IteratorCreation() {

            // iterate over int array 1
            IntConsumer ic = i -> {}; // single int argument, no return value
            Arrays.stream(new int[]{1}).forEach(ic); // IntStream.forEach
            Arrays.stream(new int[]{1}).iterator().forEachRemaining(ic); // PrimitiveIterator.OfInt

            // iterate over int array 2
            IntStream.of(new int[]{1}).forEach(i -> {}); // PrimitiveIterator.OfInt

            // iterate over object array
            for (Integer i : Arrays.asList(new Integer[]{1})) ;

            // custom iterator
            for (Integer i : new CustomIterable()) ;

            System.out.printf("Iterable Creation: Collection Arrays.stream().forEach stream.iterator PrimitiveIterator.forEachRemaining\n");
        }

        public static class CustomIterable implements Iterable<Integer> {
            protected static class CustomIterator implements Iterator<Integer> {
                int[] ints = {1, 2};
                int index = 0;

                @Override
                public boolean hasNext() {
                    return index < ints.length;
                }

                @Override
                public Integer next() {
                    return hasNext()
                            ? ints[index++]
                            : null;
                }
            }
            protected final CustomIterator iterator = new CustomIterator();

            @Override
            public Iterator<Integer> iterator() {
                return iterator;
            }
        }
    }

    public static class IteratorUse {
        public IteratorUse() {
            // TODO PrimitiveIterator.OfInt

            iterateUsingMethods();
            iterateForEach();
            iterateForEachRemaining();
            iterateRemove();
            System.out.printf("IteratorUse complete\n");
        }

        protected void iterateUsingMethods() {
            String result = "12";
            Iterator<Integer> iterator = List.of(1, 2).iterator();
            String s = "";
            while (iterator.hasNext()) {
                Integer i = iterator.next();
                s += i;
            }
            if (!s.equals(result)) System.err.printf("iterateUsingMethods failed: '%s'\n", s);
        }

        protected void iterateForEach() {
            String result = "12";
            String s = "";
            for (int i : List.of(1, 2)) s += i;
            if (!s.equals(result)) System.err.printf("iterateForEach failed: '%s'\n", s);
        }

        protected void iterateForEachRemaining() {
            String result = "12";
            String[]s = {""};
            List.of(1, 2).iterator().forEachRemaining(i -> s[0] += i);
            if (!s[0].equals(result)) System.err.printf("iterateForEach failed: '%s'\n", s);
        }

        protected void iterateRemove() {
            List<Integer> list = new ArrayList<>(List.of(1, 2));
            Iterator<Integer> iterator = list.iterator();
            iterator.next();
            iterator.remove(); // removes the first element
            // System.out.println(list);
            if (list.size() != 1 || list.get(0) != 2) System.err.printf("iterateForEach failed: '%d'\n", list);
        }
    }
}
