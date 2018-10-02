package com.attiresoft.javareference;

public class Throwables {
    /*
    Throwable
    superclass of all errors and exceptions
    contains a snapshot of the execution stack of its thread
    https://docs.oracle.com/javase/10/docs/api/java/lang/Throwable.html

    unchecked exception: instance of RuntimeException or Error
    checked exception: runtime issues that cannot be predicted at compile time and likely needs to be handled
    to make the program reliable. All other Throwables

    Error subclass: indicates serious problems that a reasonable application should not try to catch
    AssertionError

    Exception subclass: conditions that a reasonable application might want to catch
    IOException
    https://docs.oracle.com/javase/10/docs/api/java/lang/Exception.html

    RuntimeException Unchecked exceptions do not need to be declared in a method or constructor's throws clause
    IllegalArgumentException
    https://docs.oracle.com/javase/10/docs/api/java/lang/RuntimeException.html
     */
    public static void main(String[] args) {
        new ThrowableCreation();
    }

    protected static class ThrowableCreation {
        public ThrowableCreation() {
            Throwable t1 = new Throwable();
            Throwable t2 = new Throwable("message");
            Throwable t3 = new Throwable("message", new Throwable("cause"));
            Throwable t4 = new Throwable(new Throwable("cause"));
        }
    }
}
