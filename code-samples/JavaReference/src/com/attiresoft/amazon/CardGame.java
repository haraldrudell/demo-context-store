package com.attiresoft.amazon;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CardGame {
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
                if (addAces) cards.add(new Card(c, Card.aceValue));
                for (int value = value0; value <= value1; value++) cards.add(new Card(c, value));
            }

            for (int joker = 0; joker < jokers; joker++) cards.add(Card.getJoker());
        }

        public String toString() {
            return cards.stream().map(c->c.toString()).collect(Collectors.joining(" "));
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

    public static void main(String [] args) { new CardGame().run(); }
}
