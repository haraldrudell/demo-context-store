package com.attiresoft.javareference;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

public class Synchronization {
    /*
    Conclusion: use:
    Atomic
    Atomic object, when null use synchronized write so that only one thread updates
    thread interrupt: .join .interrupt Runnable
    synchronized read and writes

    All execution takes place in the context of threads

    https://en.wikipedia.org/wiki/Java_concurrency

    The Thread class implements the Runnable interface
    https://docs.oracle.com/javase/10/docs/api/java/lang/Thread.html

    the Runnable interface has a single method void Run

    Data race: 17.4.5 17.4.1
    Conflicting access to shared memory not ordered by a happens-before relationship 17.4.1
    shared memory: instance and static fields, array elements stored on the heap 17.4.1 Shared Variables
    - ie. any object variable with at least one write that is read by more than one thread

    happens-before 17.4.5
    A thread can only see an object after that object's constructor has finished 17.5
    An intra-thread action happens before another action if it is before in program order
    - inter-thread synchronizes-with 17.4.4:
    unlock of a monitor synchronizes-with all subsequent lock actions
    write to volatile variable synchronizes-with all subsequent reads
    start of a thread synchronizes-with the first action of the started thread
    write of default values synchronizes-with the first action of every thread
    the final action of a tread synchronizes-with detection in an other thread of that termination
    interrupting another thread synchronizes-with any thread detecting that interrupt

    volatile:
    ++ is not atomic
    long and double are not atomic
    references are atomic

    atomic
    has increment
    has compare and swap
    supports long and double

    monitor 17.1
    Each object has a monitor that is locked using the synchronized statement

    https://docs.oracle.com/javase/specs/jls/se10/html/jls-17.html#jls-17.1
    https://docs.oracle.com/javase/specs/jls/se10/html/jls-17.html#jls-17.4.1
    https://docs.oracle.com/javase/specs/jls/se10/html/jls-17.html#jls-17.4.4
    https://docs.oracle.com/javase/specs/jls/se10/html/jls-17.html#jls-17.4.5
    https://docs.oracle.com/javase/specs/jls/se10/html/jls-17.html#jls-17.5
    */
    public static void main(String[] args) {
        /*
        ThreadStartTerminate: main thread before starting child: thread id: 1 name: 'main' group: 'main'
        Main thread started child id: 12
        Child thread started: thread id: 12 name: 'Thread-0' group: 'main'
        Main thread waiting for child termination…
        Thread 12: final action
        ThreadStartTerminate complete: main thread detected child termination: id: 12
         */
        new ThreadStartTerminate();
        /*
        VolatileSynchronization: starting thread
        Waiting for volatile write…
        Thread 13: writing to volatile
        VolatileSynchronization complete: main thread detected volatile write
         */
        new VolatileSynchronization();
        /*
        MonitorSynchronization: synchrionized value: false, starting child
        Thread 14: performing synchronized write
        Thread started: value: true, waiting for true…
        MonitorSynchronization complete: value: true
         */
        new MonitorSynchronization();
        /*
        ThreadInterrupt: starting thread
        Thread 15: interrupting thread id: 1
        Main thread waiting for interrupt…
        Thread 15: waiting for interrupt…
        Main thread was interrupted
        Main thread interrupting thread: 15
        Main thread waiting for thread termination…
        Thread 15: was interrupted, final action
        ThreadInterrupt complete
         */
        new ThreadInterrupt();
        /*
        AtomicSynchronized: starting thread
        Waiting for atomic write: value: false…
        Thread 16: writing to atomic
        AtomicSynchronized complete: value: true
         */
        new AtomicSynchronization();
        /*
        AtomicSynchronized: starting thread
        Thread 17: attempting update…
        Thread 17: starting update
        Thread 1: attempting update…
        Thread 17: update complete
        Thread 1: update not required
        Main thread waiting for thread termination…
        AtomicSynchronized complete
         */
        new AtomicSynchronized();
    }

    protected static class ThreadStartTerminate {
        public ThreadStartTerminate() {
            System.out.printf("ThreadStartTerminate: main thread before starting child: %s\n", printThread());

            Thread t = new Thread(new ChildThread());
            t.start();
            // t.isAlive is not reliable
            System.out.printf("Main thread started child id: %d\n", t.getId());

            System.out.printf("Main thread waiting for child termination…\n");
            try {
                t.join();
            } catch (InterruptedException e) {
                throw new AssertionError("Main thread interrupted", e);
            }
            System.out.printf("ThreadStartTerminate complete: main thread detected child termination: id: %d\n\n", t.getId());
        }


        protected static String printThread() {
            // Thread id is long
            Thread thread = Thread.currentThread();
            ThreadGroup group = thread.getThreadGroup();
            return String.format("thread id: %d name: '%s' group: '%s'",
                    thread.getId(),
                    thread.getName(),
                    group.getName());
        }

        protected static class ChildThread implements Runnable {
            static final int ms = 100;

            @Override
            public void run() {
                System.out.printf("Child thread started: %s\n", printThread());

                try {
                    Thread.sleep(ms);
                } catch (InterruptedException e) {
                    throw new AssertionError("Child thread interrupted", e);
                }

                System.out.printf("Thread %d: final action\n", Thread.currentThread().getId());
            }
        }
    }

    protected static class VolatileSynchronization {
        protected final int ms = 100;
        protected volatile boolean b;

        public VolatileSynchronization() {
            System.out.printf("VolatileSynchronization: starting thread\n");
            Thread t = new Thread(new VolatileWriter());
            t.start();

            System.out.printf("Waiting for volatile write…\n");
            while (!b)
                try {
                    Thread.sleep(ms);
                } catch (InterruptedException e) {
                    throw new AssertionError("Childthread interrupted", e);
                }
            System.out.printf("VolatileSynchronization complete: main thread detected volatile write\n\n");
        }

        protected class VolatileWriter implements Runnable {
            @Override
            public void run() {
                System.out.printf("Thread %d: writing to volatile\n", Thread.currentThread().getId());
                b = true;
            }
        }
    }

    protected static class MonitorSynchronization {
        protected final int ms = 100;
        // monitor is an object, ie. has a monitor, and a value reference
        protected static Monitor monitor = new Monitor();

        public MonitorSynchronization() {
            System.out.printf("MonitorSynchronization: synchrionized value: %s, starting child\n", monitor.read());
            Thread t = new Thread(new MonitorWriter());
            t.start();

            boolean b = monitor.read();
            System.out.printf("Thread started: value: %s, waiting for true…\n", b);
            do {
                try {
                    Thread.sleep(ms);
                } catch (InterruptedException e) {
                    throw new AssertionError("Childthread interrupted", e);
                }
            } while (!(b = monitor.read()));
            System.out.printf("MonitorSynchronization complete: value: %s\n\n", b);
        }

        protected static class Monitor {
            public boolean b;

            synchronized void write(boolean value) {
                b = value;
            }

            synchronized boolean read() {
                return b;
            }
        }

        protected class MonitorWriter implements Runnable {
            @Override
            public void run() {
                System.out.printf("Thread %d: performing synchronized write\n", Thread.currentThread().getId());
                monitor.write(true);
            }
        }
    }

    protected static class ThreadInterrupt {
        protected static final Thread mainThread = Thread.currentThread();

        public ThreadInterrupt() {
            System.out.printf("ThreadInterrupt: starting thread\n");
            Thread t = new Thread(new Interruptor());
            t.start();

            // InterruptedException: if interrupted during or before the activity
            // if interrupt with immediate termination, termination is detected first
            System.out.printf("Main thread waiting for interrupt…\n");
            boolean hadInterrupt = false;
            try {
                t.join();
            } catch (InterruptedException e) {
                System.out.printf("Main thread was interrupted\n");
                hadInterrupt = true;
            }
            if (!hadInterrupt) throw new AssertionError("ThreadInterrupt failed");

            System.out.printf("Main thread interrupting thread: %d\n", t.getId());
            t.interrupt();

            System.out.printf("Main thread waiting for thread termination…\n");
            try {
                t.join();
            } catch (InterruptedException e) {
                throw new AssertionError("Main thread was interrupted", e);
            }
            System.out.printf("ThreadInterrupt complete\n\n");
        }

        protected class Interruptor implements Runnable {
            @Override
            public void run() {
                System.out.printf("Thread %d: interrupting thread id: %d\n",
                        Thread.currentThread().getId(),
                        mainThread.getId());
                mainThread.interrupt();

                System.out.printf("Thread %d: waiting for interrupt…\n", Thread.currentThread().getId());
                boolean hadInterrupt = false;
                try {
                    Thread.currentThread().join();
                } catch (InterruptedException e) {
                    hadInterrupt = true;
                }
                System.out.printf("Thread %d: was interrupted, final action\n", Thread.currentThread().getId());
            }
        }
    }

    protected static class AtomicSynchronization {
        protected final int ms = 100;
        protected AtomicBoolean b = new AtomicBoolean();

        public AtomicSynchronization() {
            System.out.printf("AtomicSynchronized: starting thread\n");
            Thread t = new Thread(new AtomicWriter());
            t.start();

            boolean value = b.get();
            System.out.printf("Waiting for atomic write: value: %s…\n", value);
            do {
                try {
                    Thread.sleep(ms);
                } catch (InterruptedException e) {
                    throw new AssertionError("Childthread interrupted", e);
                }
                value = b.get();
            } while (!value);
            System.out.printf("AtomicSynchronized complete: value: %s\n\n", value);
        }

        protected class AtomicWriter implements Runnable {
            @Override
            public void run() {
                System.out.printf("Thread %d: writing to atomic\n", Thread.currentThread().getId());
                b.set(true);
            }
        }
    }

    protected static class AtomicSynchronized {
        protected final int ms = 100;
        protected AtomicReference<Integer> reference = new AtomicReference<>();

        public AtomicSynchronized() {
            System.out.printf("AtomicSynchronized: starting thread\n");
            Thread t = new Thread(new AtomicWriter());
            t.start();

            getReference();

            System.out.printf("Main thread waiting for thread termination…\n");
            try {
                t.join();
            } catch (InterruptedException e) {
                throw new AssertionError("Main thread was interrupted", e);
            }
            System.out.printf("AtomicSynchronized complete\n\n");
        }

        Integer getReference() {
            Integer i = reference.get();
            if (i != null) {
                System.out.printf("Thread %d: value was present\n", Thread.currentThread().getId());
                return i;
            }
            System.out.printf("Thread %d: attempting update…\n", Thread.currentThread().getId());
            synchronized (reference) {
                i = reference.get();
                if (i == null) {
                    System.out.printf("Thread %d: starting update\n", Thread.currentThread().getId());
                    try {
                        Thread.sleep(ms);
                    } catch (InterruptedException e) {
                        throw new AssertionError("Unexpected interrupt", e);
                    }
                    reference.set(1);
                    System.out.printf("Thread %d: update complete\n", Thread.currentThread().getId());
                } else System.out.printf("Thread %d: update was already complete\n", Thread.currentThread().getId());
            }
            return i;
        }

        protected class AtomicWriter implements Runnable {
            @Override
            public void run() {
                getReference();
            }
        }
    }
}
