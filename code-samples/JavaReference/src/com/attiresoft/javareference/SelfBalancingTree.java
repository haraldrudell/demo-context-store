package com.attiresoft.javareference;

public class SelfBalancingTree {
    /*
    https://en.wikipedia.org/wiki/Self-balancing_binary_search_tree
    data structures: 2-3 AA AVL B-tree Red-black Scapegoat Splay Treap weigt-balanced
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

        protected Node(int value0) {
            value = value0;
        }

        protected int getBalance() {
            return
                (right != null ? right.height + 1 : 0) -
                (left != null ? left.height + 1 : 0);
        }

        protected Node addNode(Node node) throws IllegalArgumentException {
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
                    if (newLeft != left) left = newLeft;
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

            if (setHeight && height < 1) height = 1;

            if (rebalance) {
                int balance = getBalance();
                if (balance >= 2) root = insertRotateLeft();
                else if (balance <= -2) root = insertRotateRight();
                root.updateHeight();
            }

            return root;
        }

        protected Node insertRotateLeft() {
            /*
            rotate left because the tree is right heavy, ie. make right the new root
            the right branch has two nodes: right is non-null
            the left branch has no nodes: left is null
            exactly one of right.left and right.right is non-null

            right-left rotate: eg. insert 1-3-2 leads to right.left being set
            do right-rotate of right first

            in: this: 1, right: 2, right-right: 3
            out: root: 2
            */
            if (right.left != null) right = right.rotateRight();
            return rotateLeft();
        }

        protected Node insertRotateRight() {
            if (left.right != null) left = left.rotateLeft();
            return rotateRight();
        }

        protected Node rotateLeft() {
            Node root = right; // the new root node
            root.left = this; // root.left was null
            right = null; // used to be the new root, left is unchanged
            updateHeight(); // update height for 1
            return root; // new root: 2
        }

        protected Node rotateRight() {
            Node root = left;
            root.right = this;
            left = null;
            updateHeight(); // update height for 1
            return root; // new root is previous left
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

        public Tree() {} // construct empty tree

        public Tree(int[] values) throws IllegalArgumentException { // tree based on array of int
            if (values != null) for (int value : values) this.add(value);
        }

        public Tree add(int newValue) throws IllegalArgumentException { // add item to entire tree

            // create a new node to add to the tree
            Node newNode = new Node(newValue);
            if (head == null) head = newNode; // tree was empty: tree height is 0
            else {

                // add a node to the tree
                Node root = head.addNode(newNode);
                // if the tree rotated, update head
                if (root != head) head = root;
            }

            System.out.printf("add: %s\n", this);

            return this;
        }

        public String toString() {
            return String.format("[%s]", head != null ? head : "");
        }
    }

    public void run() {
        try {
            System.out.printf("Rotate-Left: %s\n", new Tree(new int[]{1, 2, 3}));
            System.out.printf("Rotate-Right: %s\n", new Tree(new int[]{3, 2, 1}));
            System.out.printf("Rotate-Left: %s\n", new Tree(new int[]{3, 1, 2}));
            System.out.printf("Binary Tree: %s\n", new Tree(new int[]{85, 15, 4, 20}));
            System.out.printf("Poor balance: %s\n", new Tree(new int[]{1, 2, 3, 4}));
        } catch (IllegalArgumentException e) {
            System.out.println(e.toString());
        }

    }

    public static void main(String [] args) { new SelfBalancingTree().run(); }
}
