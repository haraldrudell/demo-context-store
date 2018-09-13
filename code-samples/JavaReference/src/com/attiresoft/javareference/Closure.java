package com.attiresoft.javareference;

import java.util.function.IntFunction;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class Closure {
    /*
    Closure
    A closure is a record storing a function together with an environment
    https://en.wikipedia.org/wiki/Closure_(computer_programming)

    https://medium.com/@rmanavalan/5-ways-to-implement-closures-in-java-8-590790659ac5
     */
    public static void main(String[] args) {
        new FunctionalInterfaceTest();
        new ClassTest();
        new LambdaTest();
    }

    /*
    functional interface and an inner class: the method f code has to be specified each time
    therefore, a class is better
     */
    interface FunctionalInterface {
        int value = 0;
        int f(int x);
    }

    // use inner class to get mutable context
    public static class FunctionalInterfaceTest {
        public FunctionalInterfaceTest() {
            FunctionalInterface f3 = new FunctionalInterface() {
                int step = 3;
                int value = step;

                @Override
                public int f(int x) {
                    int currentValue = value;
                    value += step;
                    return currentValue;
                }
            };
            System.out.printf("FunctionalInterfaceTest: %s\n", IntStream.range(1, 10).boxed()
                    .map(i -> String.format("%d:%d", i, f3.f(i)))
                    .collect(Collectors.joining(" ")));
        }
    }

    public static class Class {
        final int step;
        public int value;

        Class(int step) {
            value = this.step = step;
        }

        public int f() {
            int currentValue = value;
            value += step;
            return currentValue;
        }
    }

    public static class ClassTest {
        public ClassTest() {
            Class f = new Class(3);
            System.out.printf("ClassTest: %s\n", IntStream.range(1, 10).boxed()
                    .map(i -> String.format("%d:%d", i, f.f()))
                    .collect(Collectors.joining(" ")));
        }
    }

    // use lambda and array to get mutable context
    public static class Lambda {
        public static IntFunction getLambda(int step) {
            int[] value = {step};
            return i -> {
                int nextValue = value[0];
                value[0] += step;
                return nextValue;
            };
        }
    }

    public static class LambdaTest {
        public LambdaTest() {
            IntFunction f = Lambda.getLambda(3);
            System.out.printf("LambdaTest: %s\n", IntStream.range(1, 10)
                    .mapToObj(i -> String.format("%d:%d", i, f.apply(i)))
                    .collect(Collectors.joining(" ")));
        }
    }


    static FunctionalInterface getGenerator(int step0) {
        return new FunctionalInterface() {
            int step = step0;
            int value = step;

            @Override
            public int f(int x) {
                int currentValue = value;
                value += step;
                return currentValue;
            }
        };
    }

    static class G {
        IntFunction f = i -> i + 3;
    }

    static class F implements FunctionalInterface {
        int step;
        int value;

        F(int step) {
            value = this.step = step;
        }

        @Override
        public int f(int x) {
            int currentValue = value;
            value += step;
            return currentValue;
        }
    }

}
