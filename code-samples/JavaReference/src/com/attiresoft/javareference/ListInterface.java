package com.attiresoft.javareference;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ListInterface {
    /*
    Interface List<E>
    Superinterfaces: Collection<E>, Iterable<E>
    Unmodifiable Lists: List.of and List.copyOf
    Common implementations: ArrayList LinkedList SortedList
    https://docs.oracle.com/javase/10/docs/api/java/util/List.html
     */
    public static void main(String[] args) {
        new ListCreation(); // List creation: new ArrayList List.of Arrays.asList Collectors.toList
        new ListPrint(); // Print list default appearance: [1, 2]
        /*
        To boxed array: .toArray(new Integer[0]) to primitive array: .stream().mapToInt(i -> i).toArray()
        To stream: .stream
        list manipulation: .add .remove .size .contains
        */
        new ListConversion();
    }

    public static class ListCreation {
        public ListCreation() {
            // ArrayList constructor usage
            List<Integer> list = new ArrayList<>(/* int capacity or Collection<? extends E>*/);
            list.add(1);

            /*
            List.of static factory method
            https://docs.oracle.com/javase/10/docs/api/java/util/List.html#of(E...)
            https://docs.oracle.com/javase/10/docs/api/java/util/List.html#unmodifiable
            */
            List<String> listOf = List.of("first", "second"); // initialize using List.of: immutable
            // listOf.add("third"); java.lang.UnsupportedOperationException
            List<String> modifiableList = new ArrayList<>(listOf); // second constructor to make modifiable
            modifiableList.add("third");

            // List from array
            List<String> listAsList = Arrays.asList("a1", "a2");
            // listAsList.add("s"); java.lang.UnsupportedOperationException

            /*
            List from Stream
            */
            Stream<String> stream = Stream.of("a1", "b1");
            List<String> listToList = Stream.of("a1", "b1").collect(Collectors.toList());
            listToList.add("x");

            System.out.printf("List creation: new ArrayList List.of Arrays.asList Collectors.toList\n");
        }
    }

    public static class ListPrint {
        public ListPrint() {
            // lists convert nicely to String
            System.out.printf("Print list default appearance: %s\n", List.of(1, 2));
        }
    }

    public static class ListConversion {
        public ListConversion() {
            // convert to array of boxed int
            Integer[] boxedArray = List.of(1, 2).toArray(new Integer[0]);
            // convert to array of primitive int
            int[] array = List.of(1, 2).stream().mapToInt(i -> i).toArray();
            System.out.printf("To boxed array: .toArray(new Integer[0]) to primitive array: .stream().mapToInt(i -> i).toArray()\n");

            // to stream
            Stream<Integer> iStream = List.of(1, 2).stream();
            System.out.printf("To stream: .stream\n");

            // List manipulation
            List<Integer> li = new ArrayList<>(List.of(1, 2, 3)); // 1 2 3
            li.add(1, 9); // 1 9 2 3
            li.remove(2); // 1 9 3
            int sum = 0;
            for (int value : li) sum += value;
            li.add(sum); // 1 9 3 13
            li.add(li.size()); // 1 9 3 13 4
            li.add(li.contains(5) ? 1 : 0); // 1 9 3 13 4 0
            System.out.printf("list manipulation: .add .remove .size .contains\n");
        }
    }
}
