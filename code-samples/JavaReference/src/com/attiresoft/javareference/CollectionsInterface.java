package com.attiresoft.javareference;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

public class CollectionsInterface {
    /*
    Types: lists, maps, sets

    What is the most convenient data structure?
    - array: cannot easily iterate, cannot add elements, cannot be immutable
    - ArrayList: can add elements, can be sorted+immutable, can get .stream()+.iterator(), cannot be primitive
    - iterator: for (Integer i : iterator) does not have element access, no total count, no partitioning
    - stream: no element access+total count

    probably use ArrayList
    something else if primitives are required

    primitives are offered by: array iterator stream
    mutability is offered by: Collection
    total count is offered by: Collection array
    All offer: sorted data, easy iteration

    PriorityQueue: iterator is not sorted
    PriorityBlockingQueue for concurrency

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

        Collections.unmodifiableList(new ArrayList<Integer>()); // provides a read-only view of the ArrayList
    }
    protected void run() {
        this.resizeArray();
        //System.out.printf("%d\n", 5); // no newline
        System.out.println("javareference");
    }
    public static void main(StringDataStructure[] argv) {
        new CollectionsInterface().run();
    }
}
