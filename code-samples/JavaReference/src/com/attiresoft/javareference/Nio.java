package com.attiresoft.javareference;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;

public class Nio {
    public Nio() {
        try {
            Iterator<String> iterator =  Files.lines(Paths.get("/Users/foxyboy/f")).iterator();
            if (iterator.hasNext()) System.out.printf("First line: '%s'\n", iterator.next());
            else System.out.printf("EMptyy file");

        } catch (IOException e) {
            throw new AssertionError("Files.lines:", e);
        }
    }

    public static void main(String [] args) { new Nio(); }

}
