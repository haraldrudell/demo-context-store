package com.attiresoft.separatepackage2;

public class ConstructorAccess { // tested from com.attiresoft.separatepackage.AmazonUser
    public int i;

    public ConstructorAccess(int i0) {
        i = i0;
    }

    ConstructorAccess() {
        i = 5;
    } // package-private constructor
}
