package javachallenge;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/*
From GlassDoor 181021
https://www.glassdoor.com/Interview/Uber-Software-Engineer-Interview-Questions-EI_IE575263.0,4_KO5,22_IP4.htm
Given a list of words, find whether a new word is anagram of word in list

an·a·gram: a word, phrase, or name formed by rearranging the letters of another, such as cinema, formed from iceman.

sort the letters of the word
store those words in a map
see if the word already exists
 */
public class Anagram {
    Set<String> anagrams = new HashSet<>();
    protected boolean isAnagram(String word) {
        String sorted = this.sortLetters(word);
        //System.out.printf("input: %s sorted: %s set: %s\n", word, sorted, anagrams);
        boolean result = anagrams.contains(sorted);
        if (!result) anagrams.add(sorted);
        return result;
    }

    protected String sortLetters(String s) {
        String result = "";

        // iterate over each character of s
        for (int i = 0, n = s.length(); i < n; i++) {
            char c = s.charAt(i);

            // find where c is in the sorted result
            int i0 = 0;
            int i1 = result.length() - 1;
            //System.out.printf("char %s i0 %d i1 %d result '%s'\n", c, i0, i1, result);
            while (i0 <= i1) {
                int i2 = (i0 + i1) / 2;
                //System.out.printf("i0 %d i1 %d i2 %d len %d\n", i0, i1, i2, result.length());
                if (result.charAt(i2) > c) i1 = i2 - 1;
                else i0 = i2 + 1;
            }
            //System.out.printf("pos %d\n", i0);
            String newResult = i0 > 0
                ? result.substring(0, i0) + c
                : Character.toString(c);

            if (i0 <= result.length() - 1) newResult += result.substring(i0);
            result = newResult;
        }
        return result;
    }

    public static class AnagramTest {
        AnagramTest() {
            Anagram anagram = new Anagram();
            String[] words = {
                    "b",
                    "a",
                    "c",
                    "a",
                    "abc",
                    "cba",
            };

            // is dsivision of two ints integer division? yes
            int three = 3;
            System.out.printf("int division: %d\n", three / 2); // 1

            // can second argument to sub string be negative? no: java.lang.StringIndexOutOfBoundsException
            //"a".substring(0, -1);

            // can a single argument to substring be beyonf the end of the string? no java.lang.StringIndexOutOfBoundsException: String index out of range: -1
            //"a".substring(2);

            // can a single argument to substring be at the end of the string? yes
            "a".substring(1);

            for (String word : words) System.out.printf("Anagram: %s -> %s\n", word, anagram.isAnagram(word));
        }
    }

    public static void main(String args[] ) throws Exception {
        new Anagram.AnagramTest();
    }
}
