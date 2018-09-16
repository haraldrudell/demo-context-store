package com.attiresoft.javareference;

import java.util.Arrays;

public class Collections {
    /*
    Types: lists, maps, sets

    List: ArrayList, LinkedList
    Stack: Vector
    Queue: LinkedList ArrayDequeue PriorityQueue
    Deque (double-ended queue): ArrayDeque LinkedList
    BlockingQueue:
    Set : HashSet LinkedHashSet TreeSet
    SortedSet, NavigableSet:
    Map: HashMap LinkedHashMap TreeMap
    SortedMap: TreeMap
    NavigableMap: SortedMap
    */
    protected void resizeArray() {
        int[] a = {1, 2, 3};
        int [] b = Arrays.copyOf(a, 2);
        System.out.println(b); // [I@47d384ee
        System.out.println(Arrays.toString(b)); //
    }
    protected void run() {
        this.resizeArray();
        //System.out.printf("%d\n", 5); // no newline
        System.out.println("javareference");
    }
    public static void main(StringClass[] argv) {
        new Collections().run();
    }
}
