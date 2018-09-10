package com.attiresoft.javareference;

public class ReverseLinkedList {
    // A list cannot be empty
    protected class Node {
       Node next;
       int value;
       Node(int value) {
           this.value = value;
       }
       Node(int[] values) throws Exception {
           if (values == null || values.length == 0) throw new Exception("Empty Node list not allowed");
           Node tail = null;
           for (int value : values) {
               if (tail == null) { // first cvalue goes into this
                   this.value = value;
                   tail = this;
               } else { // subsequent values are appended to the list
                   Node node = new Node(value);
                   tail.next = node;
                   tail = node;
               }
           }
       }
       public String toString() {
           String s = "";
           String sep = "[";
           for (Node n = this; n != null; n = n.next) {
               s += String.format("%s%d", sep, n.value);
               if (n == this) sep = ", ";
           }
           return s + "]";
       }
    }
    protected void run() {
        try {
            System.out.printf("Reverse: %s\n", this.reverse(new Node(new int[]{85, 15, 4, 20})));
        } catch (Exception e) {
            System.out.println(e.toString());
        }
    }

    protected String reverse(Node nodes) {
        System.out.printf("reverseStart: %s\n", nodes);

        // build another linked list head from the tail list, by putting each element at the front
        Node headofNewList = null;
        Node tail = nodes;
        while (tail != null) {

            // get the subsequent node
            Node next = tail.next;

            // prepend this node to new list
            if (headofNewList == null) {
                headofNewList = tail;
                headofNewList.next = null;
            } else {
                Node secondNode = headofNewList;
                headofNewList = tail;
                headofNewList.next = secondNode;
            }

            // get next input list element
            tail = next;
        }

        return headofNewList.toString();
    }
    public static void main(String [] args) { new ReverseLinkedList().run(); }
}
