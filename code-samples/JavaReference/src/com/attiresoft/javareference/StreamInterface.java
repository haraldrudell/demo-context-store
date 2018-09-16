package com.attiresoft.javareference;

import java.util.*;
import java.util.function.IntConsumer;
import java.util.function.IntSupplier;
import java.util.function.IntUnaryOperator;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class StreamInterface {
    /*
    sequential aggregate operations
    parallel aggregate operations

    types of operation
    lazy or terminal operation: fetched when required, infinite streams
    eager or intermediate operation: good performance, high memory consumption

    https://www.developer.com/java/data/stream-operations-supported-by-the-java-streams-api.html

    Collection.parallelStream()
    https://docs.oracle.com/javase/10/docs/api/java/util/Collection.html#parallelStream()
    IntStream.range(1, 10).parallel()

    IntStream: https://docs.oracle.com/javase/10/docs/api/java/util/stream/IntStream.html
    Interface IntSupplier https://docs.oracle.com/javase/10/docs/api/java/util/function/IntSupplier.html
    PrimitiveIterator

    A stream is not a data structure, it is a storage-free pipeline of computational operations
    Functional and unbounded
    Intermediate operation: produces a stream Stream.filter Stream.map
    - stateless: filter map
    - stateful: distinct sorted
    Terminal operations: produces values or side-effects: Stream.forEach Stream.reduce

    Traversal of the pipeline source occurs when the terminal operation of the pipeline is executed
     */
    public static void main(String[] args) {
        new IntStreamCreation(); // Stream creation: of range rangeClosed generate builder concat empty iterate
        new IntStreamIntermediate();
        new IntStreamTerminal();
        new StreamTest();
        new ReactiveStreamTest();
        new OddNumbersTest();
    }

    public static class IntStreamCreation {
        /*
        java.util.stream.IntStream
        https://docs.oracle.com/javase/10/docs/api/java/util/stream/IntStream.html
        also: DoubleStream, LongStream

        Collection.stream() .parallelStream()
        Arrays.stream()
        Stream.of() IntStream.range() Stream.iterate()
        BufferedReader.lines()
        File methods, Random.ints()
        JDK methods BitSet.stream() Pattern.splitAsStream(java.lang.CharSequence) JarFile.stream()

        does not have push streams: supply data asynchronously

        the architecture is lazy pull stream, there is no push stream
        - push stream need all new code
         */
        public IntStreamCreation() {
            //testArrayEquals();

            int[] result = {1, 2, 3};
            if (!Arrays.equals(IntStream.of(1, 2, 3).toArray(), result)) throw new AssertionError();;
            if (!Arrays.equals(IntStream.rangeClosed(1, 3).toArray(), result)) throw new AssertionError();;
            if (!Arrays.equals(IntStream.range(1, 4).toArray(), result)) throw new AssertionError();

            // IntSupplier: no argument, produces an int each time
            IntSupplier is = new IntSupplier() {
                int value = 0;

                @Override
                public int getAsInt() {
                    return ++value;
                }
            };

            if (!Arrays.equals(IntStream.generate(is).limit(3L).toArray(), result)) throw new AssertionError();
            if (!Arrays.equals(IntStream.builder().add(1).add(2).add(3).build().toArray(), result)) throw new AssertionError();
            if (!Arrays.equals(IntStream.concat(IntStream.empty(), IntStream.rangeClosed(1, 3)).toArray(), result)) throw new AssertionError();
            if (!Arrays.equals(IntStream.iterate(1, i -> i + 1).limit(3L).toArray(), result)) throw new AssertionError();

            System.out.printf("Stream creation: of range rangeClosed generate builder concat empty iterate\n");
        }

        void testArrayEquals() {
            int[] result = {1, 2, 3};

            System.out.printf("int 1: %s\n", getArrayType(1)); // int 1: notArray
            System.out.printf("Integer[]: %s\n", getArrayType(new Integer[1])); // Integer[]: Array: class java.lang.Integer
            System.out.printf("int[]: %s\n", getArrayType(new int[1])); // int[]: Array: int

            // result: 3 Array: int [1, 2, 3]
            System.out.printf("result: %d %s %s\n", result.length, getArrayType(result), Arrays.toString(result));

            // IntStream: 3 Array: int [1, 2, 3]
            System.out.printf("IntStream: %d %s %s\n", IntStream.of(1, 2, 3).toArray().length,
                    getArrayType(IntStream.of(1, 2, 3).toArray()),
                    Arrays.toString(IntStream.of(1, 2, 3).toArray()));

            // IntStream equals result: true
            System.out.printf("IntStream equals result: %s\n", Arrays.equals(IntStream.of(1, 2, 3).toArray(), result));

            // result equals [1, 2, 3]: true
            System.out.printf("result equals [1, 2, 3]: %s\n", Arrays.equals(result, new int[]{1, 2, 3}));

            // [1, 2, 3] equals [1, 2, 3]: true
            System.out.printf("[1, 2, 3] equals [1, 2, 3]: %s\n", Arrays.equals(new int[]{1, 2, 3}, new int[]{1, 2, 3}));
        }

        String getArrayType(Object o) {
            // a primitive argument gets boxed
            Class<?> c = o.getClass();
            if (!c.isArray()) return "notArray";
            return String.format("Array: %s", c.getComponentType());
        }
    }

    public static class IntStreamIntermediate {
        public IntStreamIntermediate() {
            // onlyOnce(); // streams can only be executed once
            duplicateSource(); // re-use: duplicate the data source, and convert into stream, each time
            //findFirstFindAny(); // findFirst and findAny are terminal operations
            iterateStream(); // stream.iterator allows processing one element at a time
            //streamLimit(); // stream.limit() does not work because terminal operations on the resulting stream termimnates

            int[] input = {1, 2, 3};
            int firstLength = 2;
            IntStream inf = Arrays.stream(input).limit(firstLength);
            PrimitiveIterator.OfInt iterator = inf.iterator();
            List<Integer> infList = new ArrayList<>();
            for (int index = 0; index < input.length; index++) {

                // fake possible incoming data
                IntStream streamToAppend = index == firstLength
                        ? IntStream.of(input[index])
                        : null;

                // append data as required
                if (streamToAppend != null) {
                    if (iterator.hasNext()) inf = IntStream.concat(inf, streamToAppend);
                    else iterator = (inf = streamToAppend).iterator();
                }

                if (!iterator.hasNext()) throw new AssertionError();
                infList.add(iterator.nextInt());
            }
            if (!Arrays.equals(infList.stream().mapToInt(i -> i).toArray(), input)) throw new AssertionError();

            /*
            IntStream.empty().mapToObj();
            IntStream.empty().map();
            IntStream.empty().boxed();
            IntStream.empty().allMatch();
            IntStream.empty().anyMatch();
            IntStream.empty().asDoubleStream();
            IntStream.empty().asLongStream();
            IntStream.empty().distinct();
            IntStream.empty().dropWhile();
            IntStream.empty().filter();
            IntStream.empty().flatMap();
            IntStream.empty().limit();
            IntStream.empty().mapToDouble();
            IntStream.empty().mapToLong();
            IntStream.empty().parallel();
            IntStream.empty().peek();
            IntStream.empty().reduce(a, b);
            IntStream.empty().sequential();
            IntStream.empty().skip();
            IntStream.empty().sorted();
            IntStream.empty().takeWhile();
            IntStream.empty().onClose();
            IntStream.empty().unordered();
            */
            System.out.printf("IntStreamIntermediate complete\n");
        }

        void onlyOnce() {
            IntStream is = IntStream.of(1, 2, 3);
            is.toArray();
            is.toArray(); // java.lang.IllegalStateException: stream has already been operated upon or closed
        }

        void duplicateSource() {
            /*
            re-use: duplicate the data source, and convert into stream, each time
             */
            int[] ia = {1, 2, 3};
            Arrays.stream(ia).toArray();
            Arrays.stream(ia).toArray();
        }

        void findFirstFindAny() {
            int[] ia1 = {1, 2, 3};
            IntStream is1 = Arrays.stream(ia1);
            int[] ia1result = new int[ia1.length];
            for (int ia1index = 0; ia1index < ia1result.length; ia1index++) {
                OptionalInt oi = is1.findFirst(); // java.lang.IllegalStateException: stream has already been operated upon or closed
                if (!oi.isPresent()) break;
                ia1result[ia1index] = oi.getAsInt();
            }
            if (!ia1result.equals(ia1)) throw new AssertionError();
        }

        void iterateStream() {
            int[] poiInput = {1, 2, 3};
            PrimitiveIterator.OfInt poi = Arrays.stream(poiInput).iterator();
            List<Integer> poiList = new ArrayList<>();
            // for (int i : poi) // foreach not applicable to type java.util.PrimitiveIterator.OfInt
            poi.forEachRemaining((IntConsumer)i -> poiList.add(i));
            if (!Arrays.equals(poiList.stream().mapToInt(i -> i).toArray(), poiInput)) throw new AssertionError();
        }

        void streamLimit() {
            int[] limInput = {1, 2, 3};
            IntStream lim = Arrays.stream(limInput);
            List<Integer> limList = new ArrayList<>();
            for (;;) {
                OptionalInt limInt = lim.limit(1L).findFirst(); // java.lang.IllegalStateException: stream has already been operated upon or closed
                if (!limInt.isPresent()) break;
                limList.add(limInt.getAsInt());
            }
            if (!limList.stream().mapToInt(i -> i).toArray().equals(limInput)) throw new AssertionError();
        }
    }

    public static class IntStreamTerminal {
        public IntStreamTerminal() {
            /*
            IntStream.empty().toArray();
            IntStream.empty().max();
            IntStream.empty().min();
            IntStream.empty().collect();
            IntStream.empty().count();
            IntStream.empty().iterator();
            IntStream.empty().findAny();
            IntStream.empty().findFirst();
            IntStream.empty().forEach();
            IntStream.empty().forEachOrdered();
            IntStream.empty().average();
            IntStream.empty().anyMatch();
            IntStream.empty().allMatch();
            IntStream.empty().toArray();
            IntStream.empty().noneMatch();
            IntStream.empty().reduce();
            IntStream.empty().spliterator();
            IntStream.empty().sum();
            IntStream.empty().summaryStatistics();
            IntStream.empty().close();
            IntStream.empty().isParallel();
            */
            System.out.printf("IntStreamTerminal complete\n");
        }
    }

    public static class StreamTest {
        public StreamTest() {
            // List to StreamInterface
             System.out.printf("List to StreamInterface<Integer>: %s\n", List.of(1, 2, 3).stream() // StreamInterface<Integer>
                     .map(i -> Integer.toString(i)) // StreamInterface<String>
                     .collect(Collectors.joining(" ")));
        }
    }

    public static class Counter {
        public int value = 0;
        protected final IntUnaryOperator f;

        public Counter(IntUnaryOperator f) {
            this.f = f;
            this.getValue();
        }

        public int getValue() {
            int currentValue = value;
            value = f.applyAsInt(value);
            return currentValue;
        }

        public static int compareTo(Counter a, Counter b) {
            return a.value < b.value ? -1 : a.value == b.value ? 0 : 1;
        }
    }

    public static class Counters {
        protected final Queue<Counter> counters;
        protected int lastValue = 0;

        public Counters(int[] divisors) {
            counters = Arrays.stream(divisors)
                    .mapToObj(step -> new Counter(value -> value + step))
                    .collect(Collectors.toCollection(() -> new PriorityQueue<Counter>(Counter::compareTo)));
        }

        public int getNextValue() {
            int nextValue;
            for (; ; ) {
                Counter counter = counters.remove(); // get lowest value counter
                nextValue = counter.getValue(); // get the value
                counters.add(counter); // re-enqueue the counter
                if ((nextValue & 1) != 0 && // must be odd
                        nextValue > lastValue) break; // must be a new value
            }
            return (lastValue = nextValue);
        }
    }

    public static class OddNumbersTest {
        protected static final int[] divisors = {3, 7};
        protected static final int valueCount = 6;

        public OddNumbersTest() {
            Counters counters = new Counters(divisors);
            System.out.printf("OddNumbers: %s\n", IntStream.range(1, valueCount + 1)
                    .mapToObj(i -> String.format("%d:%d", i, counters.getNextValue()))
                    .collect(Collectors.joining(" ")));
        }
    }


    public static class ReactiveStreamTest {
        IntSupplier getIntSupplier(int step) {
            int[] value = {step};
            return () -> {
                int current = value[0];
                value[0] += step;
                return current;
            };
        }

        public ReactiveStreamTest() {
            //int seed3
            //IntSupplier i3 = () ->
            //IntStream.iterate();

            IntStream is = IntStream.range(1, 2);
            PrimitiveIterator.OfInt pi = is.iterator();
            System.out.printf("Value: %d\n", pi.nextInt());

            /*
            IntStream is = IntStream.generate(getIntSupplier(3));
            Iterator ii = is.iterator();
            System.out.printf("", ii.)
            IntStream s = IntStream.range(1, 10);
            Iterator iter = s.iterator();
            int i = i.next()
            // TODO int i = s.iterator();
            */
            System.out.printf("ReactiveStreamTest complete\n");
        }

    }
}
