package com.attiresoft.amazon;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class Amazon {
    public Amazon() {
        new OddNumbers.Test(); // OddNumbers: 1:3 2:7 3:9 4:15 5:21 6:27
        new BitMask.Test(); // BitMask: 1:2 23:43
        /*
        Deck: HEARTS1 HEARTS2 HEARTS3 HEARTS4 HEARTS5 HEARTS6 SPADES1 SPADES2 SPADES3 SPADES4 SPADES5 SPADES6
        DIAMONDS1 DIAMONDS2 DIAMONDS3 DIAMONDS4 DIAMONDS5 DIAMONDS6 CLUBS1 CLUBS2 CLUBS3 CLUBS4 CLUBS5 CLUBS6
        Deck500: HEARTS1 HEARTS5 HEARTS6 SPADES1 SPADES5 SPADES6 DIAMONDS1 DIAMONDS5 DIAMONDS6
        CLUBS1 CLUBS5 CLUBS6 joker joker
         */
        new CardGame.Test();
    }

    public static class BitMask {
        // A Java int is 4 bytes, 32 bits, 8 hex digits
        protected static final int lowerBits = 0x55555555; // ...010101b

        public static int swapBits(int i) {
            // shift has higher priority than bitwise and, and bitwise or is the lowest
            return (i & lowerBits) << 1 | (i & ~lowerBits) >> 1;
        }

        public static class Test {
            protected static final int[] values = {1, 23}; // BitMask: 1:2 23:43

            public Test() {
                System.out.printf("BitMask: %s\n",
                        Arrays.stream(values).boxed()
                                .map(i -> String.format("%d:%d", i, swapBits(i)))
                                .collect(Collectors.joining(" ")));
            }
        }
    }

    public static class OddNumbers {
        protected static class Counter {
            protected final int step;
            protected int value;

            protected Counter(int step) {
                value = this.step = step;
            }

            protected int increment() {
                int theValue = value;
                value += step;
                return theValue;
            }

            protected static int compareTo(Counter a, Counter b) {
                return a.value < b.value ? -1 : a.value == b.value ? 0 : 1;
            }
        }

        public static class Counters {
            protected final Counter[] counters;
            protected int lastValue = 0;

            public Counters(int[] counterInts) {
                counters =
                        Arrays.stream(counterInts).boxed() // IntStream: stream of primitive int to Stream<Integer>
                                .map(Counter::new) // Stream<Counter>, map does not work for IntStream
                                .toArray(Counter[]::new); // output is Counter[]
            }

            public int getNextValue() {
                int nextValue;
                for (;;) {
                    nextValue = Arrays.stream(counters).min(Counter::compareTo).get().increment();
                    if ((nextValue & 1) != 0 && // must be odd
                            nextValue > lastValue) break; // must be a new value
                }
                return (lastValue = nextValue);
            }
        }

        public static class Test {
            protected static final int[] divisors = {3, 7};
            protected static final int valueCount = 6;

            public Test() {
                Counters counters = new Counters(divisors);
                System.out.printf("OddNumbers: %s\n",
                        IntStream.range(1, valueCount + 1).boxed()
                                .map(i -> String.format("%d:%d", i, counters.getNextValue()))
                                .collect(Collectors.joining(" ")));
            }
        }
    }

    public static class CardGame {
        protected enum Color {
            HEARTS, SPADES, DIAMONDS, CLUBS;
        }

        protected static class Card {
            private static final int jokerValue = 0;
            public static final int aceValue = 1;
            final Color color;
            final int value;

            public Card(Color color0, int value0) { // value 0: joker
                color = color0;
                value = value0;
            }

            static Card getJoker() {
                return new Card(null, jokerValue);
            }

            public String toString() {
                if (value == jokerValue) return "joker";
                if (color == null) return Integer.toString(value);
                return color.toString() + value;
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
                return cards.stream().map(c -> c.toString()).collect(Collectors.joining(" "));
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

        public static class Test {
            public Test() {
                System.out.printf("Deck: %s\n", new Deck());
                System.out.printf("Deck500: %s\n", new Deck500());
            }
        }
    }

    public static void main(String[] args) { new Amazon(); }
}
