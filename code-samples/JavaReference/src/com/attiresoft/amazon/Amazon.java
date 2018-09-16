package com.attiresoft.amazon;

import java.util.*;
import java.util.function.IntUnaryOperator;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class Amazon {
    public static void main(String[] args) {
        new OddNumbersTest(); // OddNumbers: 1:3 2:7 3:9 4:15 5:21 6:27
        new BitMaskTest(); // BitMask: 1:2 23:43
        /*
        Deck: 24: HEARTS1 HEARTS2 HEARTS3 HEARTS4 HEARTS5 HEARTS6 SPADES1 SPADES2 SPADES3 SPADES4 SPADES5 SPADES6
        DIAMONDS1 DIAMONDS2 DIAMONDS3 DIAMONDS4 DIAMONDS5 DIAMONDS6 CLUBS1 CLUBS2 CLUBS3 CLUBS4 CLUBS5 CLUBS6
        Deck500: 14: HEARTS1 HEARTS5 HEARTS6 SPADES1 SPADES5 SPADES6 DIAMONDS1 DIAMONDS5 DIAMONDS6 CLUBS1 CLUBS5 CLUBS6 joker joker
         */
        new CardGameTest();
    }

    public static class BitMask {
        // A Java int is 4 bytes, 32 bits, 8 hex digits
        protected static final int lowerBits = 0x55_55_55_55; // ...010101b

        public static int swapBits(int i) {
            // shift has higher priority than bitwise and, and bitwise or is the lowest
            return (i & lowerBits) << 1 | (i & ~lowerBits) >> 1;
        }
    }

    public static class BitMaskTest {
        protected static final int[] values = {1, 23}; // BitMask: 1:2 23:43

        public BitMaskTest() {
            System.out.printf("BitMask: %s\n", Arrays.stream(values)
                    .mapToObj(i -> String.format("%d:%d", i, BitMask.swapBits(i)))
                    .collect(Collectors.joining(" ")));
        }
    }

    public static class OddNumbers { // OddNumbers: 1:3 2:7 3:9 4:15 5:21 6:27
        protected static class Counter implements PrimitiveIterator.OfInt {
            protected int value;
            protected final IntUnaryOperator f;

            protected Counter(int seed, IntUnaryOperator f) {
                this.value = seed;
                this.f = f;
            }

            @Override
            public int nextInt() {
                int currentValue = value;
                value = f.applyAsInt(value);
                return currentValue;
            }

            protected static int compareTo(Counter a, Counter b) {
                return a.value < b.value ? -1 : a.value == b.value ? 0 : 1;
            }

            @Override
            public boolean hasNext() {
                return true;
            }
        }

        protected final Queue<Counter> counters;
        protected int lastValue = 0;

        public OddNumbers(int[] divisors) {
            counters = Arrays.stream(divisors) // IntStream: stream of primitive int
                    .mapToObj(step -> new Counter(step, value -> value + step)) // StreamInterface<Counter>
                    .collect(Collectors.toCollection(() -> new PriorityQueue<Counter>(divisors.length, Counter::compareTo)));
            //int i = IntStream.iterate(3, n -> n + 3).iterator();
        }

        public int getNextValue() {
            int nextValue;
            do {
                Counter counter = counters.remove(); // get lowest value counter
                nextValue = counter.nextInt(); // get the value
                counters.add(counter); // re-enqueue the counter
            } while (!((nextValue & 1) != 0 && // must be odd and
                    nextValue > lastValue)); // must not be a repeated value
            return (lastValue = nextValue);
        }
    }

    public static class OddNumbersTest {
        protected static final int[] divisors = {3, 7};
        protected static final int valueCount = 6;

        public OddNumbersTest() {
            OddNumbers oddNumbers = new OddNumbers(divisors);
            System.out.printf("OddNumbers: %s\n", IntStream.rangeClosed(1, valueCount)
                    .mapToObj(i -> String.format("%d:%d", i, oddNumbers.getNextValue()))
                    .collect(Collectors.joining(" ")));
        }
    }

    public static class CardGame {
        protected enum Color {
            HEARTS, SPADES, DIAMONDS, CLUBS;
        }

        protected static class Card {
            protected static final int jokerValue = 0;
            protected static final int aceValue = 1;
            protected final Color color;
            protected final int value;

            protected Card(Color color, int value) { // value 0: joker
                this.color = color;
                this.value = value;
            }

            protected static Card getJoker() {
                return new Card(null, jokerValue);
            }

            public String toString() {
                return value == jokerValue
                        ? "joker"
                        : color == null
                        ? Integer.toString(value)
                        : color.toString() + value;
            }
        }

        protected static abstract class Deck0 {
            protected static final int jokers = 0;
            protected static final boolean addAces = false;
            protected static final int value0 = 1;
            protected static final int value1 = 6;//13;
            protected List<Card> cards = new ArrayList<>();

            protected void addCards(int value0, int value1, int jokers, boolean addAces) {
                for (Color c : Color.values()) {
                    if (addAces) cards.add(new Card(c, Card.aceValue));
                    for (int value = value0; value <= value1; value++) cards.add(new Card(c, value));
                }
                for (int joker = 0; joker < jokers; joker++) cards.add(Card.getJoker());
            }

            public String toString() {
                return String.format("%d: %s", cards.size(), cards.stream().map(c -> c.toString()).collect(Collectors.joining(" ")));
            }
        }

        public static class Deck extends Deck0 {
            public Deck() {
                addCards(value0, value1, jokers, addAces);
            }
        }

        public static class Deck500 extends Deck0 {
            protected static final int jokers = 2;
            protected static final boolean addAces = true;
            protected static final int value0 = 5;

            public Deck500() {
                addCards(value0, value1, jokers, addAces);
            }
        }
    }

    public static class CardGameTest {
        public CardGameTest() {
            System.out.printf("Deck: %s\n", new CardGame.Deck());
            System.out.printf("Deck500: %s\n", new CardGame.Deck500());
        }
    }
}
