package com.attiresoft.javareference;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class ListInterface {
    protected List<String> construct() {
        // ArrayList constructor usage
        List<Integer> li1 = new ArrayList<>();
        List<String> ls1 = List.of("first", "second"); // initialize using List.of: immutable
        // ls1.add("third"); java.lang.UnsupportedOperationException
        List<String> ls2 = new ArrayList<>(ls1); // second constructor to make modifiable
        ls2.add("third");
        return ls2;
    }

    protected List<Integer> listFromArray(int[] a1) {
        return Arrays.stream(a1).boxed().collect(Collectors.toList());
    }

    protected int[] arrayFromList(List<Integer> a1) {
        return a1.stream().mapToInt(i->i).toArray();
    }

    protected List<Integer> listing() {
        List<Integer> li = new ArrayList<>(List.of(1, 2, 3)); // 1 2 3
        li.add(1, 9); // 1 9 2 3
        li.remove(2); // 1 9 3
        int sum = 0;
        for (int value : li) sum += value;
        li.add(sum); // 1 9 3 13
        li.add(li.size()); // 1 9 3 13 4
        li.add(li.contains(5) ? 1 : 0); // 1 9 3 13 4 0
        return li;
    }

    protected void run() {
        // lists convert nicely to String
        System.out.printf("Print list default appearance: %s\n", this.construct());

        // array to list: Arrays.stream
        System.out.printf("list from Array: %s\n", this.listFromArray(new int[] {1, 2, 3}));

        // list to array: mapToInt
        System.out.printf("Array from list: %s\n", Arrays.toString(this.arrayFromList(List.of(1, 2, 3))));

        // list manipulation
        System.out.printf("list manipulation: %s\n", this.listing());
    }

    public static void main(String [] args) { new ListInterface().run(); }
}
