package com.attiresoft.amazon.amazon180910;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class Amazon {
    protected void run() {
        new OddNumbers().run(); // OddNumbers: 1:3 2:6 3:7 4:9 5:12 6:14 7:15 8:18 9:21
        new BitMask().run(); // BitMask: 1:2 23:43
    /*
    Deck: HEARTS1 HEARTS2 HEARTS3 HEARTS4 HEARTS5 HEARTS6 SPADES1 SPADES2 SPADES3 SPADES4 SPADES5 SPADES6
    DIAMONDS1 DIAMONDS2 DIAMONDS3 DIAMONDS4 DIAMONDS5 DIAMONDS6 CLUBS1 CLUBS2 CLUBS3 CLUBS4 CLUBS5 CLUBS6
    Deck500: HEARTS1 HEARTS5 HEARTS6 SPADES1 SPADES5 SPADES6 DIAMONDS1 DIAMONDS5 DIAMONDS6
    CLUBS1 CLUBS5 CLUBS6 joker joker
     */
        new CardGame().run();
    }

    static protected class BitMask {
        static final int[] values = {1, 23}; // BitMask: 1:2 23:43
        /*
        A Java int is 4 bytes, 32 bits, 8 hex digits
        */
        static final int oddBits = 0x55555555; // ...010101b
        static final int evenBits = 0xaaaaaaaa; // ...0101010b
        int swapBits(int i) {
            // shift has higher priority than bitwise and, and bitwise or is the lowest
            return (i & oddBits) << 1 | (i & evenBits) >> 1;
        }
        protected void run() {
            Function<Integer, String> f = i -> String.format("%d:%d", i, this.swapBits(i));
            System.out.printf("BitMask: %s\n",
                    Arrays.stream(this.values)
                            .boxed()
                            .map(f)
                            .collect(Collectors.joining(" ")));
        }
    }

    static protected class OddNumbers {
        static protected class Counter {
            int step;
            int value;

            Counter(Integer step) {
                this.step = this.value = step;
            }

            int increment() {
                int value = this.value;
                this.value += this.step;
                return value;
            }

            static int compareTo(Counter a, Counter b) {
                return a.value < b.value ? -1 : a.value == b.value ? 0 : 1;
            }
        }

        static protected class Counters {
            Counter[] counters;

            Counters(int[] counters) {
                // counters is an array of primitive int so we get an IntStream primitive stream
                this.counters = // output should be Counter[]
                        Arrays.stream(counters) // IntStream: stream of primitive int
                                .boxed() // StreamInterface<Integer>
                                .map(Counter::new) // StreamInterface<Counter>, map does not work for IntStream
                                .toArray(Counter[]::new); // output is Counter[]
            }

            int getNextValue() {
                return Arrays.stream(this.counters).min(Counter::compareTo).get().increment();
            }
        }
        static protected void run() {
            Counters counters = new Counters(new int[]{3, 7});
            Function<Integer, String> f = i -> String.format("%d:%d", i, counters.getNextValue());
            System.out.printf("OddNumbers: %s\n",
                    IntStream.range(1, 10)
                            .boxed()
                            .map(f)
                            .collect(Collectors.joining(" ")));
        }
    }

    static protected class CardGame {
        protected enum Color {
            HEARTS, SPADES, DIAMONDS, CLUBS;
        }

        static protected class Card {
            static int jokerValue = 0;
            static int aceValue = 1;
            Color c;
            int value;

            Card(Color c, int value) { // value 0: joker
                this.c = c;
                this.value = value;
            }

            static Card getJoker() {
                return new Card(null, jokerValue);
            }

            public String toString() {
                if (value == jokerValue) return "joker";
                if (c == null) return Integer.toString(value);
                return c.toString() + value;
            }
        }

        static abstract class Deck0 {
            static final int jokers = 0;
            static final boolean addAces = false;
            static final int value0 = 1;
            static final int value1 = 6;//13;

            protected List<Card> cards = new ArrayList<>();

            protected void addCards(int value0, int value1, int jokers, boolean addAces) {
                for (Color c : Color.values()) {
                    if (addAces)
                        cards.add(new Card(c, Card.aceValue));
                    for (int value = value0; value <= value1; value++)
                        cards.add(new Card(c, value));
                }

                for (int joker = 0; joker < jokers; joker++)
                    cards.add(Card.getJoker());
            }

            public String toString() {
                return cards.stream().map(c -> c.toString()).collect(Collectors.joining(" "));
            }
        }

        static protected class Deck extends Deck0 {
            Deck() {
                addCards(value0, value1, jokers, addAces);
            }
        }

        static protected class Deck500 extends Deck0 {
            static final int jokers = 2;
            static final boolean addAces = true;
            static final int value0 = 5;

            Deck500() {
                addCards(value0, value1, jokers, addAces);
            }
        }

        protected void run() {
            System.out.printf("Deck: %s\n", new Deck());
            System.out.printf("Deck500: %s\n", new Deck500());
        }
    }

    public static void main(String[] args) { new Amazon().run(); }
}
