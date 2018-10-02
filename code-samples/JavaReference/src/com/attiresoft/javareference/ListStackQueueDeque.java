package com.attiresoft.javareference;

import java.util.*;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.function.Consumer;
import java.util.function.Predicate;

public class ListStackQueueDeque {
    /*
    Interface Queue<E>
    Superinterfaces: Collection<E>, Iterable<E>
    Subinterfaces: BlockingDeque<E>, BlockingQueue<E>, Deque<E>, TransferQueue<E>
    Implementing Classes: AbstractQueue, ArrayBlockingQueue, ArrayDeque, ConcurrentLinkedDeque,
    ConcurrentLinkedQueue, DelayQueue, LinkedBlockingDeque, LinkedBlockingQueue, LinkedList,
    LinkedTransferQueue, PriorityBlockingQueue, PriorityQueue, SynchronousQueue

    limited capacity: BlockingQueue implemented by ArrayBlockingQueue

    BlockingQueue<E>
    Superinterfaces: Collection<E>, Iterable<E>, Queue<E>
    Subinterfaces: BlockingDeque<E>, TransferQueue<E>
    Implementing Classes: ArrayBlockingQueue, DelayQueue, LinkedBlockingDeque, LinkedBlockingQueue,
    LinkedTransferQueue, PriorityBlockingQueue, SynchronousQueue
    ArrayBlockingQueue: fixed capacity, concurrent
    - fairness: true: consumer FIFO: decreases throughput but reduces variability and avoids starvation

    BlockingQueue: can only wait for queue being full
    TransferQueue: can also wait for the element being consumed

    Deque<E>: can operate at both ends of the queue
    BlockingDeque<E>

    TransferQueue<E>

    Queue Stack PriorityQueue BlockingQueue
    Deque
     */
    public static void main(String[] args) {
        /*
         */
        new QueueTest();
        new ConcurrentQueueTest();
    }

    public static class QueueTest {
        public QueueTest() {
            Queue<Integer> queue = new LinkedList<Integer>();

            // write data
            boolean addSuccess = queue.add(1); // exception if full
            boolean offerSuccess = queue.offer(2); // false: queue full, not modified

            // inspect data
            Integer element = queue.element(); // exception if empty
            Integer peek = queue.peek(); // null if empty

            // get data
            Integer poll = queue.poll(); // null if empty
            Integer remove = queue.remove(); // exception if empty

            // from Collection
            Collection<Integer> collection = new ArrayList<>();
            queue.addAll(collection);
            queue.clear();
            queue.contains(1);
            queue.containsAll(collection);
            queue.equals(collection);
            queue.isEmpty();
            queue.iterator();
            queue.parallelStream();
            try {
                Integer removedElement = queue.remove();
            } catch (NoSuchElementException e) {}
            boolean didChange = queue.removeAll(collection);
            Predicate predicate = i -> false;
            boolean didRemove = queue.removeIf(predicate);
            boolean didChange1 = queue.retainAll(collection);
            queue.size();
            queue.spliterator();
            queue.stream();
            queue.toArray(new Integer[0]);

            // from Iterable
            Consumer<Integer> consumer = i -> {
            };
            queue.forEach(consumer);
            System.out.printf("QueueTest: completed\n\n");
        }
    }


    public static class Data implements Comparable<Data> {
        // a comparable class that prints uniquely
        protected final int value;

        public Data(int value) {
            this.value = value;
        }

        @Override
        public int compareTo(Data o) {
            return value - o.value;
        }

        public String toString() {
            return String.format("Data:%d", value);
        }
    }

    public static class ConcurrentQueueTest {
        protected final int ms = 100;
        private final String producerName = "Producer";
        private final String consumerName = "Consumer";
        protected final int size = 2;
        protected final BlockingQueue<Data> q = new ArrayBlockingQueue(size);

        protected class Consumer implements Runnable {
            @Override
            public void run() {
                Thread t = Thread.currentThread();
                String name = t.getName();
                long id = t.getId();

                System.out.printf("%s: first action: thread: %d\n", name, id);
                for (;;) {
                    Data data;

                    try {
                        //q.peek(); // null if empty, does not remove
                        //q.element(); // does not remove, exception if empty

                        //q.remove(); // exception if empty
                        //q.poll(); // null if empty
                        data = q.take(); // removes, wait if empty
                    } catch (InterruptedException e) {
                        System.out.printf("%s: interrupted while in wait\n", name);
                        break;
                    }
                    System.out.printf("%s: received: %s\n", name, data);
                }
                System.out.printf("%s: last action\n", name);
            }
        }

        protected class Producer implements Runnable {
            @Override
            public void run() {
                Thread t = Thread.currentThread();
                String name = t.getName();
                long id = t.getId();

                System.out.printf("%s: first action: thread: %d\n", name, id);
                for (int dataId = 1; dataId <= size + 1; dataId++) {
                    Data data = new Data(dataId);
                System.out.printf("%s: will put: %s\n", name, data);
                    //q.add() // exception if full
                    //q.offer(v) // false if full
                    try {
                        q.put(data); // wait if full
                    } catch (InterruptedException e) {
                        throw new AssertionError(String.format("%s: unexpected interrupt while waiting for queue", name), e);
                    }
                }
                System.out.printf("%s: last action\n", name);
            }
        }

        public ConcurrentQueueTest() {
            System.out.printf("ConcurrentQueueTest: main thread id: %d: launching %s…\n",
                    Thread.currentThread().getId(),
                    producerName);
            Thread producer = new Thread(new Producer(), producerName);
            producer.start();

            System.out.printf("Waiting for %s to enter wait state…\n", producerName);
            for (;;) {
                try {
                    Thread.sleep(ms);
                } catch (InterruptedException e) {
                    throw new AssertionError("Unexpected interrupt of main thread", e);
                }
                if (producer.getState() == Thread.State.WAITING) break;
            }
            System.out.printf("%s detected in state wait\n", producerName);

            System.out.printf("launching %s…\n", consumerName);
            Thread consumer = new Thread(new Consumer(), consumerName);
            consumer.start();

            System.out.printf("Waiting for %s to terminate…\n", producerName);
            try {
                producer.join();
            } catch (InterruptedException e) {
                throw new AssertionError(String.format("Unexpected interrupt while waiting for %s", producerName), e);
            }
            System.out.printf("%s terminated\n", producerName);

            System.out.printf("Waiting for %s to enter wait state…\n", consumerName);
            for (;;) {
                try {
                    Thread.sleep(ms);
                } catch (InterruptedException e) {
                    throw new AssertionError("Unexpected interrupt of main thread", e);
                }
                if (consumer.getState() == Thread.State.WAITING) break;
            }
            System.out.printf("%s detected in state wait\n", consumerName);

            System.out.printf("Interrupting %s…\n", consumerName);
            consumer.interrupt();

            System.out.printf("Waiting for %s to terminate…\n", consumerName);
            try {
                producer.join();
            } catch (InterruptedException e) {
                throw new AssertionError(String.format("Unexpected interrupt while waiting for %s", consumerName), e);
            }
            System.out.printf("%s terminated\n", consumerName);

            System.out.printf("ConcurrentQueueTest: complete\n\n");
        }
    }
}
