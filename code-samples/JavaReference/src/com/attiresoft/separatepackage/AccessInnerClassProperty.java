package com.attiresoft.separatepackage;

import com.attiresoft.javacs.SelfBalancingTree;

public class AccessInnerClassProperty {
    /*
    we do not ant it to be public
    and we do not want it to be private
    what protected has over no modifier is the possibility to extend in another package

    However, since classes often depends on one another, ie. C1 does new C2()
    each independent class needs to have the other classes it instantiates injected
    this applies to constructors and static methods

    Once can use generics or constructors provided as functional references
    new Class<OtherClass>()
    new Class(OtherClass::new)
    Static methods can only be accessed indirect via reflection
    However, static methods can also be provided as function references
     */
    public static void main(Class[] args) {
        // Tree is public static inner class with poublic constructor
        SelfBalancingTree.Tree t = new SelfBalancingTree.Tree(new int[]{1});

        // Node is a protected static class so it is not available
    }

    protected static class c extends SelfBalancingTree.Tree {
        public c() {
            // Node n; Node is not available here
        }
    }


    protected static class Sbt extends SelfBalancingTree {
        public Sbt() {
            Node n = null; // Node class is visible
            // new Node(1); Node(int) has protected access
            // n.value; 'value' has protected access
        }

        protected static class Node extends SelfBalancingTree.Node {
            /*
            Because Node definmes a constructor with an argument
            That replaces the default constructor
            Therefore, at least one constructor for this class must bew defined
            All constructors must invoke a defined constructor of the parent class
             */
            Node(int value) { // Node has no default constructor
                super(value);
            }
            int examine() {
                return value;
            }
            static int examine(Node n) {
                return n.value;
            }
        }
    }
}
