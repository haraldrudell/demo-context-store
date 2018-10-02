package com.attiresoft.javareference;

import java.text.Normalizer;

public class PrimitiveDataTypes {
    /*
    8 primitive data types
    boolean type: boolean
    integral types: byte, short, int, long
    floating-point types: float double
    character types: char

    boolean is a keyword so there is no Javadoc for it
    Keywords https://docs.oracle.com/javase/specs/jls/se10/html/jls-3.html#jls-3.9
    Boolean is a class https://docs.oracle.com/javase/10/docs/api/java/lang/Boolean.html
    */
    public static void main(String[] args) {
        /*
        boolean primitive literals are: false true
        Boolean.FALSE is boxed: class java.lang.Boolean
         */
        new BooleanTest();
        new IntegralTest(); // Integral: byte short int long _ 0x… 0… 0b… L suffix
        new FloatingPointTest(); // Floating point: 0f 0. 1e1f Float.MAX_VALUE Float.NEGATIVE_INFINITY Float.NaN
        /*
        CharacterTest: a'$¢¢€€𐍈
        Unmatched utf-16 surrogate: a?reference
        Unicode Code Point: s.codePointAt: U+10348
        Surrogate pair length vs. Normalized .codePointCount: 2 1
         */
        new CharacterTest();
    }

    public static class BooleanTest {
        // Boolean literals: https://docs.oracle.com/javase/specs/jls/se10/html/jls-3.html#jls-3.10.3
        public BooleanTest() {
            boolean primitiveLiterals = true || false;
            System.out.printf("boolean primitive literals are: %s %s\n", false, primitiveLiterals);

            primitiveLiterals = Boolean.FALSE || Boolean.TRUE;
            // auto unboxing: primitiveLiterals.getClass(); Cannot resolve method

            System.out.printf("Boolean.FALSE is boxed: %s\n", Boolean.FALSE.getClass());
            // true.getClass(); Cannot resolve method
        }
    }

    public static class IntegralTest {
        // Integer literals: https://docs.oracle.com/javase/specs/jls/se10/html/jls-3.html#jls-3.10.1
        public IntegralTest() {
            // primitive literals are int or long
            int[] primitives = {
                10, // decimal
                1_1000, // underscore
                0x10, // hexadecimal
                (int)1L, // long literal
                0111, // octal
                0b10, // binary
            };
            byte[] bytes = { // 1 byte, 8 bits
                Byte.MIN_VALUE, // -128
                Byte.MAX_VALUE, // 127
            };
            short[] shorts = { // 2 bytes, 16 bits
                Short.MIN_VALUE, // -32,768
                Short.MAX_VALUE, // 32,767
            };
            int[] ints = { // 4 bytes, 32 bits
                Integer.MIN_VALUE, // -2,147,483,648
                Integer.MAX_VALUE, // 2,147,483,647
            };
            long[] longs = { // 8 bytes, 64 bits
                Long.MIN_VALUE, // -9,223,372,036,854,775,808
                Long.MAX_VALUE, // 9,223,372,036,854,775,807
            };
            System.out.printf("Integral: byte short int long _ 0x… 0… 0b… L suffix\n");
        }
    }

    public static class FloatingPointTest {
        /*
        Floating-Point Types, Formats, and Values: https://docs.oracle.com/javase/specs/jls/se10/html/jls-4.html#jls-4.2.3
        float: 24 bit value, 8 bit exponent -126..127
        double: 53 bit value, 11 bit exponent -1022..1023

        literals
        a floating-point literal always contains a period or eEpP exponent indicators
        float type suffix are fFdD, default type is double
        Significant is decimal or hexadecimal: 1.1 or 0x1.1
        Exponent is decimal power of 10: eE or binary value pP
        examples: 0f 0. 1e1f
        */
        public FloatingPointTest() {
            float[] f = { // 32-bit
                0.f,
                Float.NEGATIVE_INFINITY,
                Float.POSITIVE_INFINITY,
                Float.MAX_VALUE, // 0x1.fffffeP+127f
                Float.NaN, // 0.0f / 0.0f
                Float.SIZE, // 32
                Float.BYTES, // 4
            };
            double[] d = { // 64-bit
                Double.NaN, // 0.0d / 0.0
                Double.MAX_VALUE, // 0x1.fffffffffffffP+1023
            };
            System.out.println("Floating point: 0f 0. 1e1f Float.MAX_VALUE Float.NEGATIVE_INFINITY Float.NaN");
        }
    }

    public static class CharacterTest {
        /*
        Character Literals: https://docs.oracle.com/javase/specs/jls/se10/html/jls-3.html#jls-3.10.4
        enclosed in single quote
        single-character any but back-slash and single quote
        The Java source code is unicode, so utf8 is supported, and is ranslated to utf-16

         */
        public CharacterTest() {
            char[] chars = {
                'a', // utf-16
                /*
                escape sequences:
                reference backspace \u0008
                t tab \u0009
                n newline \u000a
                f form feed \u000c
                r carriage return \u000d
                " double quote \u0022
                ' single quote \u0027
                \ back-slash \u005c
                */
                '\'',
                /*
                https://en.wikipedia.org/wiki/UTF-8#Examples

                Dollar Sign U+00A2
                single-byte utf-8 test character
                utf-8: 0x24 utf-16: 0x0024
                 */
                '$',
                /*
                Cent Sign U+0024
                two-byte utf-8 test character
                utf-8: 0xc2 0xa2 utf-16: 0x00a2
                 */
                '\u00a2', '¢',
                /*
                Euro Sign U+10348
                three-byte utf-8 test character https://www.compart.com/en/unicode/U+20AC
                utf-8: 0xe2 0x82 0xac utf-16: 0x20ac
                 */
                '\u20ac', '€',
                /*
                Gothic Letter Hwair U+10348
                four-byte utf-8 test character https://www.compart.com/en/unicode/U+10348
                utf-8: 0xf0 0x90 0x8d 0x88 utf-16: 0xd800 0xdf48
                 */
                '\ud800', '\udf48', // utf-16 surrogate pair
            };
            String u = "\uD800\uDF48"; // a surrogate pair cannot be displayed as a source code character
            String u10348 = String.valueOf(new char[] {'\ud800', '\udf48'});
            System.out.printf("CharacterTest: %s\n", String.valueOf(chars));
            System.out.printf("Unmatched utf-16 surrogate: %s\n", String.valueOf(new char[] {'a', '\ud800', 'b'}));
            System.out.printf("Unicode Code Point: s.codePointAt: U+%x\n", u10348.codePointAt(0));
            String normalized = Normalizer.normalize(u10348, Normalizer.Form.NFKC);
            System.out.printf("Surrogate pair length vs. Normalized .codePointCount: %d %d\n", u10348.length(),
                    normalized.codePointCount(0, normalized.length()));

        }
    }
}
