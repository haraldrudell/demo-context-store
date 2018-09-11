package com.attiresoft.javareference;

public class ConstructorAccess { // tested from com.attiresoft.anotherpackage.AmazonUser
    public int i;

    public ConstructorAccess(int i0) {
        i = i0;
    }

    ConstructorAccess() {
        i = 5;
    } // package-private constructor
}
