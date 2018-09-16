package com.attiresoft.javareference;

import java.util.Arrays;

public class ArrayStructure {
    /*
    Array Structure: java.util.Arrays
    https://docs.oracle.com/javase/10/docs/api/java/util/Arrays.html
    Arrays https://docs.oracle.com/javase/specs/jls/se10/html/jls-10.html
    */
    public static void main(String[] args) {
        /*
        Arrays are created with the new operator: new int[2]; new int[]{1}
        or the array initializer: int[] a = {1}
         */
        new ArrayCreation();
        /*
        Array.toString print: [1, 2, 3]
        Array.deepToString print: [[[1]], [[2, 3]]]
         */
        new ArrayPrint();
        /*
        Array .copyOf: [1]
        Array .copyOfRange: [2, 3, 0]
         */
        new ArrayCopy();
    }

    public static class ArrayCreation {
        public ArrayCreation() {
            // arrays are created by new or array initializer
            int[] a1 = new int[2];
            int[] a2 = {1, 2, 3};
            int[][][] b1 = {{{1}},{{2, 3}}};
            System.out.printf("Arrays are created with the new operator: new int[2]; new int[]{1}\n");
            System.out.printf("or the array initializer: int[] a = {1}\n");
        }
    }

    public static class ArrayPrint {
        public ArrayPrint() {
            // to print array use Arrays.toString Arrays.deepToString
            System.out.printf("Array.toString print: %s\n", Arrays.toString(new int[]{1, 2, 3})); // for single-level array
            System.out.printf("Array.deepToString print: %s\n", Arrays.deepToString(new int[][][]{{{1}},{{2, 3}}})); // for array level 2+
        }
    }

    public static class ArrayCopy {
        public ArrayCopy() {
            // Arrays.copyOf: copy to bigger or smaller array
            System.out.printf("Array .copyOf: %s\n", Arrays.toString(Arrays.copyOf(new int[]{1, 2, 3}, 1))); // change size
            // Arrays.copyOfRange: copy with start index, new elements have value 0
            System.out.printf("Array .copyOfRange: %s\n", Arrays.toString(Arrays.copyOfRange(new int[]{1, 2, 3}, 1, 4))); // from index 0.. until but not including index
        }
    }
}
