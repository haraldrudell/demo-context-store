package com.attiresoft.javacs;

import java.util.Arrays;
import java.util.function.Function;
import java.util.stream.Collectors;

public class SelfBalancingTree {
    /*
    https://en.wikipedia.org/wiki/Self-balancing_binary_search_tree
    data structures: 2-3 AA AVL B-tree Red-black Scapegoat Splay Treap weight-balanced
    The most common is AVL and it performs well
    https://en.wikipedia.org/wiki/AVL_tree

    When a node is added to a particular leaf,
    it is possible that the leaf parent becomes imbalanced,
    ie. a difference of 2 in height between its left and right branch
    which forces a rotation at the parent level

    on parent rotation, the root at that level may change,
    therefore, the resulting root is always returned,
    which allows for an update of the reference to parent
    - this rotation is always with two elements on one side and zero on the other

    Whenever there is a node added to either branch
    the node's height needs to be recalculated

    when a new leaf is added,
    the resulting height should be 1 or greater

    left rotation: after adding two increasing numbers: 1, 2, 3
    [1 R:[2]]

     */
    protected static class Node {
        protected Node left;
        protected Node right;
        /*
        height is the number of nodes on the longest path from the root to a leaf
        if left and right are null, the value is 0
         */
        protected int height;
        protected final int value;

        protected Node(int value) {
            this.value = value;
        }

        protected int getBalance() {
            return
                (right != null ? right.height + 1 : 0) -
                (left != null ? left.height + 1 : 0);
        }

        protected Node addNode(Node node) {
            Node root = this;
            boolean setHeight = false;
            boolean rebalance = false;

            // recursively add to the tree
            int newValue = node.value;
            if (newValue < value) // add to left branch
                if (left == null) { // add new left branch: rebalance not necessary
                    left = node;
                    setHeight = true;
                } else {
                    Node newLeft = left.addNode(node);
                    if (newLeft != left) left = newLeft; // update for possible rotation
                    rebalance = true;
                }
            else if (newValue > value) // add to right branch
                if (right == null) { // add new right branch: rebalance not necessary
                    right = node;
                    setHeight = true;
                } else {
                    // save the new node and rebalance right
                    Node newRight = right.addNode(node);
                    if (newRight != right) right = newRight;
                    rebalance = true;
                }

            // duplicates are not allowed
            else throw new IllegalArgumentException("Duplicate value");

            if (setHeight && height < 1) height = 1; // a new branch was added: height is at least 1

            else if (rebalance) { // a node was added to left or right: ensure tree is balanced

                int balance = getBalance();
                if (balance >= 2) root = insertRotateLeft();
                else if (balance <= -2) root = insertRotateRight();
                root.updateHeight(); // update height after tree rebalance
            }

            return root; // if the entire tree rotated, root has changed
        }

        /*
        left rotate from unbalanced tree:
        - root.right has height 2+ root.left
        - root.right.left is higher than root.right.right
        - insert sequence: 132
           ╭a
         ╭3┤ ╭reference
        1┤ ╰2┤
         │   ╰c
         ╰d

        right-rotate right to:
             ╭a
           ╭3┤
         ╭2┤ ╰reference
        1┤ ╰c
         ╰d

        left-rotate to balanced tree:
           ╭a
         ╭3┤
        2┤ ╰reference
         │ ╭c
         ╰1┤
           ╰d

        https://en.wikipedia.org/wiki/AVL_tree#Double_rotation

        en space U+2002: .
        https://en.wikipedia.org/wiki/Box-drawing_character
        U+256d╭
        U+2524┤
        U+2502│
        U+2570╰
        U-2504┄
        */
        protected Node insertRotateLeft() {
            /*
            rotate left because the tree is right heavy, ie. make right the new root
            - one of right.left and right.right may be null

            if right.left is higher than right.right, right need to be right rotated first
            if this pre-rotate is not done, the tree will end up tilted in the other direction
            A null link means height 0
            A link to a height 0 node means 1
            */
            if (right.getBalance() < 0) doRotateRight();
            return rotateLeft();
        }

        protected void doRotateRight() {
            Node newRight = right.rotateRight();
            if (newRight != right) right = newRight;
        }

        protected Node insertRotateRight() {
            if (left.getBalance() > 0) {
                Node newLeft = left.rotateLeft();
                if (newLeft != left) left= newLeft;
            }
            return rotateRight();
        }

        /*
        left rotate from unbalanced tree:
        - root.right has height 2+ root.left
        - root.right.left is not higher than root.right.right
        - insert sequence: 123
           ╭3┄a
         ╭2┤
        1┤ ╰┄b
         ╰c

        left-rotate to balanced tree:
         ╭3┄a
        2┤ ╭reference
         ╰1┤
           ╰c

        https://en.wikipedia.org/wiki/AVL_tree#Simple_rotation
         */
        protected Node rotateLeft() {
            // newRoot.right does not change
            // oldRoot.left ie. left does not change
            Node newRoot = right; // the new root node. newRoot.right does not change
            right = newRoot.left; // oldRoot.right ie. newRoot.left.right is oldRoot.right.left ie. newRoot.left
            newRoot.left = this; // newRoot.left is oldRoot ie. this
            updateHeight(); // update height for 1
            return newRoot; // new root: 2
        }

        protected Node rotateRight() {
            Node newRoot = left;
            left = newRoot.right;
            newRoot.right = this;
            updateHeight(); // update height for 1
            return newRoot; // new root is previous left
        }

        protected void updateHeight() {
            int newHeight = Integer.max(
                left != null ? left.height + 1 : 0,
                right != null ? right.height + 1 : 0);
            if (newHeight != height) height = newHeight;
        }

        public String toString() { // (1 L:(2) R:(3))
            return String.format("(%d-%d%s%s)", value, height,
                left != null ? " L:" + left : "",
                right != null ? " R:" + right : "");
        }
    }

    public static class Tree {
        protected Node head;

        public Tree() {} // public constructor: empty tree

        public Tree(int[] values) { // tree based on array of int
            if (values != null) for (int value : values) this.add(new Node(value));
        }

        protected Tree add(Node newNode) { // add item to entire tree
            if (head == null) head = newNode; // tree was empty: tree height is 0
            else {

                // add a node to the tree
                Node root = head.addNode(newNode);
                // if the tree rotated, update head
                if (root != head) head = root;
            }

            return this;
        }

        public String toString() {
            return String.format("[%s]", head != null ? head : "");
        }
    }

    public static class TreeTest {
        public TreeTest() {
            testTree("Rotate-Left", new int[]{1, 2, 3}, "[(2-1 L:(1-0) R:(3-0))]");
            testTree("Rotate-Right", new int[]{3, 2, 1}, "[(2-1 L:(1-0) R:(3-0))]");
            /*
            132:
            1.addNode(2):
            - right: 3.addNode(2): adds 2 as a new left, 3.height is 1
            - return to 1.addNode: a node was added to right
             */
            testTree("Rotate-Left-Right", new int[]{1, 3, 2}, "[(2-1 L:(1-0) R:(3-0))]");
            testTree("Rotate-Right-Left", new int[]{3, 1, 2}, "[(2-1 L:(1-0) R:(3-0))]");

            /*
            right-left rotate from unbalanced tree:
            - root.right has height 2+ root.left
            - root.right.left is higher than root.right.right
            - insert sequence: 216745
               ╭7┄
             ╭6┤ ╭5┄
            2┤ ╰4┤
             │   ╰┄
             ╰1┄

            right-rotate right.right to:
                 ╭7┄
               ╭6┤
             ╭4┤ ╰5┄
            2┤ ╰┄
             ╰1┄

            left-rotate to balanced tree:
               ╭7┄
             ╭6┤
            4┤ ╰5┄
             │ ╭┄
             ╰2┤
               ╰1┄
            */
            testTree("Rotate-Right-Left2", new int[]{2, 1, 6, 7, 4, 5}, "[(4-2 L:(2-1 L:(1-0)) R:(6-1 L:(5-0) R:(7-0)))]");
            testTree("Rotate-Left-Right2", new int[]{6, 7, 2, 1, 4, 3}, "[(4-2 L:(2-1 L:(1-0) R:(3-0)) R:(6-1 R:(7-0)))]");

            testTree("initial", new int[]{85, 15, 4, 20}, "[(15-2 L:(4-0) R:(85-1 L:(20-0)))]");//System.out.printf("Binary Tree: %s\n", new Tree(new int[]{85, 15, 4, 20}));
        }

        public void testTree(String name, int[] input, String expected) {
            System.out.printf("%s input: %s:\n", name,
                    Arrays.stream(input).mapToObj(i -> Integer.toString(i)).collect(Collectors.joining(",")));

            Tree t = new Tree2(input);
            String actual = t.toString();
            System.out.printf("Result: %s: %s\n\n", actual.equals(expected) ? "ok" : "FAIL", t);
        }

        public static class Node2 extends Node {
            public Node2(int value) {
                super(value);
            }

            protected Node insertRotateLeft() {
                System.out.printf("insertRotateLeft node: %d-%d right: %d bal: %d left: %d bal: %d rl: %d-%d rr: %d-%d double: %s\n",
                    // current node
                    value,
                    height,

                    // right
                    right != null ? right.value : 0,
                    right != null ? right.getBalance() : 0,

                    // left
                    left != null ? left.value : 0,
                    left != null ? left.getBalance() : 0,

                    // right.left
                    right.left != null ? right.left.value : 0,
                    Node2.getHeight(right.left),

                    // right.right
                    right.right != null ? right.right.value : 0,
                    Node2.getHeight(right.right),

                    right.getBalance() < 0);

                return super.insertRotateLeft();
            }

            protected void doRotateRight() {
                System.out.printf("beforeRight: %s\n", this);
                super.doRotateRight();
                System.out.printf("afterRight: %s\n", this);
            }

            protected static int getHeight(Node n) {
                return n != null ? n.height : 0;
            }
        }

        public class Tree2 extends Tree {
            public Tree2(int[] values) { // tree based on array of int
                if (values != null) for (int value : values) {
                    super.add(new Node2(value));
                    System.out.printf("add: %s\n", this);
                }
            }
        }
    }

    public static void main(String [] args) { new SelfBalancingTree.TreeTest(); }
}
