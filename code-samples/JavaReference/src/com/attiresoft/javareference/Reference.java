package com.attiresoft.javareference;

import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

/**
 * Created by foxyboy on 1/22/18.
 */
public class Reference {
  protected void run() {
    this.arrays();
    this.lists();
    System.out.println("javareference");
  }

  protected void arrays() {
    // arrays are created using new or brace initializer
    int[] a; // array variable is the type with brackets
    int [] b = {1, 2, 3}; // array initializer is braces
    a = b.clone(); // clone array
    a[1] = 9; // modify array value
    // the size of an array cannot be modified, use ArrayList
    for (int v : a) System.out.print(v); // iterate over array
    // System.out.print(a); // [I@60e53b93
  }

  protected void lists() {
    // List: ArrayList, LinkedList
    // Stack: Vector
    // Queue: LinkedList ArrayDequeue PriorityQueue
    // Set: HashSet LinkedHashSet TreeSet
    // Map: HashMap LinkedHashMap TreeMap
    // SortedMap: TreeMap
    // NavigableMap: SortedMap
    List<Integer> li = new ArrayList<>();
    li.add(5);
    li.add(0, 4);  // may have an index for insert
    System.out.println("" + li.size() + li.toString()); // [4, 5]
  }

  public static void main(String[] argv) {
    new Reference().run();
  }
}
