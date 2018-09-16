package com.attiresoft.javacs;

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
               if (tail == null) { // first value goes into this
                   this.value = value;
                   tail = this;
               } else { // subsequent values are appended to the list
                   Node node = new Node(value);
                   tail = tail.next = node;
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
        Node input;
        try {
            input = new Node(new int[]{85, 15, 4, 20});
        } catch (Exception e) {
            System.out.println(e.toString());
            return;
        }
        String s = input.toString();
        System.out.printf("Reverse: input: %s output: %s\n", s, this.reverse(input));
    }

    protected Node reverse(Node nodes) {

        // nodes is a list of elements each with a next link
        // nodes can be null

        // build a reversed list by putting each element in front of the previous one
        Node reversedList = null;

        // iterate over each input element
        Node currentNode = nodes;
        Node temp = null;
        while (currentNode != null) {

            // remember the subsequent node
            temp = currentNode.next;

            // put currentNode at front of reversedList
            currentNode.next = reversedList;
            reversedList = currentNode;

            // advance to next input element
            currentNode = temp;
        }

        return reversedList;
    }
    public static void main(String [] args) { new ReverseLinkedList().run(); }
}
