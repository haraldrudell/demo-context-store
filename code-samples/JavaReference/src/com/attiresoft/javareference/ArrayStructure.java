package com.attiresoft.javareference;

import java.util.Arrays;

public class ArrayStructure {
    public ArrayStructure() {
        // arrays are created by new or array initializer
        int[] a1 = new int[2];
        int[] a2 = {1, 2, 3};
        int[][][] b1 = {{{1}},{{2, 3}}};

        // to print array use Arrays.toString Arrays.deepToString
        System.out.printf("Array print: %s\n", Arrays.toString(a2)); // for single-level array
        System.out.printf("Array print: %s\n", Arrays.deepToString(b1)); // for array level 2+

        // copy to bigger or smaller array: Arrays.copyOf
        System.out.printf("Array copyOf: %s\n", Arrays.toString(Arrays.copyOf(a2, 1))); // change size
        // copy with start index: Arrays.copyOfRange, new elements has value 0
        System.out.printf("Array copyOf: %s\n", Arrays.toString(Arrays.copyOfRange(a2, 1, 4))); // from index 0.. until but not including index
    }

    public static void main(String [] args) { new ArrayStructure(); }
}
