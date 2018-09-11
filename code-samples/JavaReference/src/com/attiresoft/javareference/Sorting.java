package com.attiresoft.javareference;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Sorting {
    public int[] bubbleSort(int[] array) { // average O(n**2)
        int length = array.length;
        int a, b;
        for (int i = 0; i < length - 1; i++) {
            a = array[i];
            for (int j = i + 1; j < length; j++) {
                b = array[j];
                if (b < a) {
                    array[j] = a;
                    a = array[i] = b;
                }
            }
        }
        return array;
    }

    public static class BinaryList extends ArrayList<Integer> {
        public BinaryList(int[] array) {
            if (array != null) for (int value : array) this.binaryInsert(value);
        }

        public void binaryInsert(int value) {
            int i0 = 0;
            int i1 = this.size() - 1;
            while (i0 <= i1) {
                int middle = (i0 + i1) / 2; // integer division
                int middleValue = this.get(middle);
                if (value < middleValue) i1 = middle - 1;
                else i0 = middle + 1;
            }
            this.add(i0, value);
        }
    }

    public void run() {
        System.out.printf("Bubblesort: %s\n", Arrays.toString(this.bubbleSort(new int[] {1, 4, 3, 2})));
        System.out.printf("Binary insert: %s\n", new BinaryList(new int[] {1, 4, 3, 2}));
    }

    public static void main(String [] args) { new Sorting().run(); }
}
