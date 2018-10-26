package javachallenge;

import java.util.Scanner;

/*
Input a string and output the number of words (need to run  on coderpad)
https://www.glassdoor.com/Interview/Uber-Software-Engineer-Interview-Questions-EI_IE575263.0,4_KO5,22_IP4.htm
150331

Scanner sc = new Scanner(System.in);
A Scanner breaks its input into tokens using a delimiter pattern, which by default matches whitespace
https://docs.oracle.com/javase/10/docs/api/java/util/Scanner.html
nextBigDecimal
nextBigInteger([int radix])
next([String pattern | Pattern pattern])
nextBoolean
nextByte
nextDouble
nextFloat
nextInt([int radix])
nextLine
nextLong([int radix])
nextShort([int radix])
hasNext()
*/
public class ReadLineWordCount {
    public static void main(String[] args) throws Exception {
        Scanner s = new Scanner(System.in);
        for (;;) {
            System.out.printf("input: ");
            String str = s.nextLine();
            Scanner s2 = new Scanner(str);
            int i = 0;
            while (s2.hasNext()) {
                s2.next();
                i++;
            }
            System.out.printf("Tokens: %d line: '%s'\n", i, str);
        }
    }
}
