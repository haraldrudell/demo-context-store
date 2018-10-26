package javachallenge;

import java.util.*;
import java.util.stream.Collectors;

/*
have multiple inputs
merge those together
 */
public class PrioQueue {
    protected static class Input {
        int i;
        List<Integer> ints;
        Input(int[] inputs) {
            ints = new ArrayList<Integer>(Arrays.stream(inputs).boxed().collect(Collectors.toList()));
            System.out.printf("Input: %s\n", ints);
            getNext();
        }

        int getNext() {
            i = ints.size() > 0
            ? ints.remove(0)
            : Integer.MAX_VALUE;
            return i;
        }

        public static Comparator<Input> comparator = (a, b) -> a.i < b.i ? -1 : a.i == b.i ? 0 : 1;
    }

    List<Integer> merge(int[][]inputs) {
        List<Integer> result = new ArrayList<>();
        Queue<Input> q = new PriorityQueue<>(inputs.length, Input.comparator);
        for (int[] input : inputs) q.add(new Input(input));

        for (;;) {
            Input input = q.remove();
            int value = input.i;
            System.out.printf("value: %d\n", value);
            if (value == Integer.MAX_VALUE) break;

            // process the value
            result.add(input.i);
            input.getNext();
            q.add(input);
        }
        return result;
    }

    protected static class PrioTest {
        PrioTest() {
            PrioQueue prioQueue = new PrioQueue();
            int[][] inputs = {
                {2, 4},
                {3},
                {1, 5},
            };
            List<Integer> actual = prioQueue.merge(inputs);
            System.out.printf("Result: %s inputs: %s", actual, Arrays.deepToString(inputs));
        }
    }

    public static void main(String args[] ) throws Exception {
        new PrioQueue.PrioTest();
    }
}
