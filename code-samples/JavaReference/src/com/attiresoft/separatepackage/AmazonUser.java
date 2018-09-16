package com.attiresoft.separatepackage;

import com.attiresoft.amazon.Amazon;
import com.attiresoft.amazon.Amazon.BitMask;
import com.attiresoft.separatepackage2.ConstructorAccess;
import com.attiresoft.amazon.Amazon.OddNumbers;
import com.attiresoft.amazon.Amazon.CardGame.Deck;

public class AmazonUser {
    /*
    Conclusion: to instantiate a public class from outside the package,
    the selected constructor must be public
     */
    public void run() {

        // the public Amazon class can be used
        Amazon a = new Amazon();
        // a only has the instance method run() available
        // a.run();

        // BitMask has to be imported
        // because BitMask is static, it can be instantiated without an Amazon instance
        // the default constructor can be used
        // public methods run, swapBits are available
        System.out.printf("BitMask: %d\n", new BitMask().swapBits(23));

        // Counters is a static inner class of OddNumbers
        System.out.printf("Counters: %d\n", new OddNumbers(new int[]{3, 7}).getNextValue());

        // use OddNumbers.Test
        new Amazon.OddNumbersTest();

        // Deck: only non-argument constructor and toString are public
        System.out.printf("Deck: %s\n", new Deck());

        // the default package-private constructor cannot be used: is not public, cannot be accessed
        //ConstructorAccess ca = new ConstructorAccess();
        System.out.printf("ConstructorAccess: %d\n", new ConstructorAccess(5).i);

        int mask = ~0x55555555;
        System.out.printf("bitmask: %d %x\n", mask, mask); // bitmask: -1431655766 aaaaaaaa

        System.out.printf("bitmask value: 0x%x\n", 23); // bitmask value: 0x17
        // 10111
        //101011 = 32 + 8 + 3 = 43
    }
    public static void main(String[] args) { new AmazonUser().run(); }
}

