package com.attiresoft.amazon;

import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class OddNumbers {
    /*
    The last value must be accessible
    - used to sort in PriorityQueue
    - used to generate the next value

    Step needs to be stored

    A stream or Iterator cannot peek at the next value
    Therefore, there must be a class that has value as a public instance value
    The class must have a constructor and a public method to get the next value

    A lambda function cannot modify an instance value, this then have to be an array
     */
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
                Arrays.stream(counterInts).boxed() // IntStream: stream of primitive int to StreamInterface<Integer>
                .map(Counter::new) // StreamInterface<IntSeries>, map does not work for IntStream
                .toArray(Counter[]::new); // output is IntSeries[]
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

    public static void main(String[] args) { new OddNumbers.Test(); }
}
/*



undefin keypress

(date)
 // get directory name
find logfiles -exec egrep "(...)"
egrep "Order" logfiles/20181002/*.log | sort


// cardgame
enum Color {
    SPADE, DIAMOND, HEART, CLUB
}

class CardGame {
    boolean isJoker;
    int value; // 1-13, 0
    Color color;
    StringDataStructure id;
    CardGame(int value, Color color) {
        this.value = value=;
        this.color = color;
    }
}

class Deck {
    static int jokers = false;
    static int minValue = 1;
    static int maxValue = 13;
    List<CardGame> cards = new ArrayList<>();
    Deck() { // makeup of the Deck
    }

    protected constructDeck() {
        for (let color : Colors) {
            for (let i = 1; i <= 13;)
                cards.add(new CardGame(i, color));
        }
    }
}

    shuffle() {

    }
}

class Deck500 extends Deck {
    static int jokers = true;
    static boolean aces = true;
    static int minValue = 5;
    static int maxValue = 13;

    Deck500() {
        this.constructDeck(minValue, maxValue, jokers);
    }
}

class Poker {
    Deck d = new Deck()
    Poker(int players) {

    }

    dealCards() {

    }
}

// 52

// 500: take out 2, 3, 4 + joker


    int swapBits(int i1) {
        int lowerBits = // 10101b
        int evenbBits = 0101010b
        return (i1 & lowerBits) << 1 | ((i1 & evenBits) >> 1)

        int i2 = 0;

        // 32 bit integer
        // b0 <> b1.. 32
        return i1 &

        // 32
        for (int i = 0; i < 32; i += 2) {

            // lowest two bits from i1 to i2
            int b0 = i1 & 1;
            int b1 = (i1 & 2);
            i1 >>= 2;
            i2 = i2 << 2 | b0 << 1 | b1 >> 1;
        }

        return i2;
    }

    int num = 0;ed
        for (int i = 1; i <= 100; i++) System.out.println(num);
        // divisible by 3 and 7
        for (;;) { // find number to print
        // find next odd number
        if (num == 0) num = 3;
        else num += 2;

        // determine if this number should be print
        if (num % 3 == 0 || num % 7 == 0) break;
        }

        2018/09/10 XXX-XXXX-XXXXX

        num +=2;
        }

        undefined
 */