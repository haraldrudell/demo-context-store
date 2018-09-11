package com.attiresoft.amazon;

public class BitMask {
    /*
    1: 2
    23: 43
     */
    static final int[] values = {1, 23};
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
        for (int value : values) System.out.printf("%d: %d\n", value, this.swapBits(value));
    }
    public static void main(String[] args) { new BitMask().run(); }
}
