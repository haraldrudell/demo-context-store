package com.attiresoft.javareference;

import java.util.*;
import java.util.stream.Collectors;

public class SortedDataStructure {
    /*
    to sort an array of class instances, implement Comparable<>
     */
    public static void main(String[] args) {
        /*
        sortInt: [1, 2, 3]
        values after sortInt: [1, 3, 2]
         */
        new TestComparableTest();
    }

    public static class ObjectSorter {
        public static class Data implements Comparable<Data> {
            protected final int value;

            public Data(int value) {
                this.value = value;
            }

            @Override
            public int compareTo(Data o) {
                if (o == null) throw new NullPointerException("Data: compare with null value");
                return value - o.value;
            }

            public String toString() {
                return String.format("data:%d", value);
            }
        }

        public static int[] sortInt(int[] values) {
            int[] result = values.clone(); // do not modify the input array
            Arrays.sort(result);
            return result;
        }

        public static Data[] sortComparable(int[] values) {
            Data[] data = Arrays.stream(values)
                    .mapToObj(Data::new)
                    .toArray(Data[]::new);
            Arrays.sort(data);
            return data;
        }


        public static Queue<Data> getQueue(int[] values) {
            return Arrays.stream(values)
                    .mapToObj(Data::new)
                    //.collect(Collectors.toCollection(() -> new PriorityQueue<Data>(Data::compareTo)));
                    //.collect(Collectors.toCollection(PriorityQueue<Data>::new));
                    .collect(Collectors.toCollection(PriorityQueue::new));
        }

        public static List<Data> getList(int[] values) {
            List<Data> list = Arrays.stream(values)
                    .mapToObj(Data::new)
                    //.collect(Collectors.toCollection(() -> new PriorityQueue<Data>(Data::compareTo)));
                    .collect(Collectors.toCollection(ArrayList::new));
            //list.sort(); must have a compareTo method
            Collections.sort(list);
            return list;
        }

        public static Set<Data> getSet(int[] values) {
            return Arrays.stream(values)
                    .mapToObj(Data::new)
                    .collect(Collectors.toCollection(TreeSet::new));
        }

        PrimitiveIterator.OfInt getIterator(int[] values) {
            return null;
        }
    }

    public static class TestComparableTest {
        protected static final int[] values = {1, 3, 2};

        public TestComparableTest() {

            // java.lang.NullPointerException: compare with null value
            //new ObjectSorter.Data(1).compareTo(null);

            System.out.printf("sortInt: %s\n", Arrays.toString(ObjectSorter.sortInt(values)));
            System.out.printf("values should be unsorted after sortInt: %s\n", Arrays.toString(values));

            System.out.printf("sortComparable: %s\n", Arrays.toString(ObjectSorter.sortComparable(values)));

            Queue<ObjectSorter.Data> q = ObjectSorter.getQueue(values);
            System.out.printf("Print PriorityQueue: %s\n", q);

            List<String> list = new ArrayList<>();
            while (!q.isEmpty()) list.add(q.remove().toString());
            System.out.printf("Process PriorityQueue: %s\n", list);

            Queue<ObjectSorter.Data> q1 = ObjectSorter.getQueue(values);
            q1.remove();
            System.out.printf("PriorityQueue is sorted on first remove(): %s\n", q1);

            System.out.printf("getList: %s\n", ObjectSorter.getList(values));

            System.out.printf("getSet: %s\n", ObjectSorter.getSet(values));

            System.out.printf("getQueue: %s\n", ObjectSorter.getQueue(values).stream()
                    .map(data -> data.toString())
                    .collect(Collectors.joining(" ")));
        }
    }
}
