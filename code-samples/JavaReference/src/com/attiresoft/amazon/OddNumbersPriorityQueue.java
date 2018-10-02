package com.attiresoft.amazon;

import java.util.Arrays;
import java.util.PrimitiveIterator;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class OddNumbersPriorityQueue {
    protected static class IntSeries implements PrimitiveIterator.OfInt {
        protected int value;
        protected final PrimitiveIterator.OfInt iterator;

        protected IntSeries(PrimitiveIterator.OfInt iterator) {
            if ((this.iterator = iterator).hasNext()) nextInt();
        }

        @Override
        public int nextInt() {
            int currentValue = value;
            value = iterator.nextInt();
            return currentValue;
        }

        protected static int compareTo(IntSeries a, IntSeries b) {
            return a.value < b.value ? -1 : a.value == b.value ? 0 : 1;
        }

        @Override
        public boolean hasNext() {
            return iterator.hasNext();
        }
    }

    protected final Queue<IntSeries> intSeries;
    protected int lastValue = 0;

    public OddNumbersPriorityQueue(int limit, int[] divisors) {
        intSeries = Arrays.stream(divisors) // IntStream: stream of primitive int
                .mapToObj(step -> new IntSeries(IntStream.iterate(step, n -> n + step).iterator())) // Stream<IntSeries>
                .collect(Collectors.toCollection(() -> new PriorityQueue<IntSeries>(divisors.length, IntSeries::compareTo)));
    }

    public int getNextValue() {
        int nextValue;
        do {
            IntSeries series = intSeries.remove(); // get lowest value counter
            nextValue = series.nextInt(); // get the value
            intSeries.add(series); // re-enqueue the counter
        } while ((nextValue & 1) == 0 || nextValue == lastValue); // do not accept even or repeated values
        return (lastValue = nextValue);
    }
}
