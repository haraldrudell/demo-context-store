package com.attiresoft.javareference;

import java.util.*;
import java.util.function.Consumer;
import java.util.function.Predicate;
import java.util.stream.Stream;

// what is the most convenient data type:
// array List otherCollection iterator Stream Spliterator

public class SetInterface {
    /*
    TODO
    Set: HashSet
    also: EnumSet TreeSet
    Unmodifiable Sets: Set.of Set.copyOf

    NavigableSet
    Superinterfaces: Collection<E>, Iterable<E>, Set<E>, SortedSet<E>
    Implementing Classes: ConcurrentSkipListSet, TreeSet

    SortedSet - always use NavigableSet
    Interface SortedSet<E>
    Superinterfaces: Collection<E>, Iterable<E>, Set<E>
    Subinterfaces: NavigableSet<E>
    Implementing Classes: ConcurrentSkipListSet, TreeSet
    */

    public SetInterface() {
        NavigableSet<Integer> set = new TreeSet<>();

        // from NavigableSet
        set.ceiling(2); // least element greater or equal to or null - above this ceiling
        set.higher(2);
        set.descendingIterator();
        set.floor(2);  // greatest element that is less than or equal to or null - below this floor
        set.lower(2);
        set.headSet(2, false); // set of smaller values
        set.tailSet(2, false); // set of smaller values
        set.iterator();
        set.pollFirst();
        set.pollLast();
        set.subSet(1, true, 2, true);

        // from Collections
        Stream<Integer> stream = set.parallelStream();
        Predicate<Integer> predicate = i -> i != 1;
        set.removeIf(predicate);
        set.stream();

        // from Iterable
        Consumer<Integer> consumer = i -> {};
        set.forEach(consumer);

        // from Set
        boolean isNew = set.add(1);
        Collection<Integer> collection = new ArrayList<>();
        set.addAll(collection);
        set.clear();
        set.contains(1);
        set.containsAll(collection);
        set.equals(set);
        set.isEmpty();
        set.remove(1);
        set.removeAll(collection);
        set.size();
        Integer[] integers = set.toArray(new Integer[0]);

        // from SortedSet
        Integer i1 = set.first() + set.last();
        // Spliterator can split the source into parts for parallel processing
        set.spliterator();
    }
}
