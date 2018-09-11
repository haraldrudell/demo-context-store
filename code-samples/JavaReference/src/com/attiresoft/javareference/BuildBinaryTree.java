package com.attiresoft.javareference;

public class BuildBinaryTree {
    protected class Node {
        Node left;
        Node right;
        int value;
        Node(int value) {
            this.value = value;
        }
        public String toString() { // (1 L:(2) R:(3))
            String s = String.format("(%d", this.value);
            if (this.left != null) s += String.format(" L:%s", this.left);
            if (this.right != null) s += String.format(" R:%s", this.right);
            return s + ")";
        }
    }
    protected class Tree {
        Node head;
        Tree() {} // construct empty tree
        Tree(int[] values) { // tree based on array of int
            if (values != null) for (int value : values) this.add(value);
        }
        protected Tree add(int value) {
            Node newNode = new Node(value);
            Node node = this.head;

            if (node == null) this.head = newNode;
            else for (;;) {
                if (value < node.value) { // insert to the left
                    if (node.left == null) {
                        node.left = newNode;
                        break;
                    } else node = node.left;
                } else { // insert to the right
                    if (node.right == null) {
                        node.right = newNode;
                        break;
                    } else node = node.right;
                }
                System.out.println(this);
            }
            return this;
        }
        public String toString() {
            String s = "[";
            if (this.head != null) s += this.head;
            return s + "]";
        }
    }
    protected void run() {
        System.out.printf("Binary Tree: %s\n", new Tree(new int[]{85, 15, 4, 20}));
        System.out.printf("Poor balance: %s\n", new Tree(new int[]{1, 2, 3, 4}));
    }
    public static void main(String [] args) { new BuildBinaryTree().run(); }
}
