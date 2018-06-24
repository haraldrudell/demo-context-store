// 180618 Harald Rudell
// Codepair environment: Node.js 8.10 ECMAScript 2017: no: class properties, bind operator, import, packages
/*
const fs = require('fs')

Promise.resolve().then(() => new C().run()).catch(console.error) // enter async method with onRejected

class C {
    async run() { //throw new Error(1)
        const files = await new Promise((resolve, reject) => fs.readdir('/', (e, f0) => !e ? resolve(f0) : reject(e)))
        console.log('C.run', files)
    }
}
*/

const c = new C
c.merger([stream1, stream2])
c.on('order')


// stream, is actually iterator
// not getrting event, .next

new C().start()

class C extends EventEmitter {
    constructor(streams) {
        this.queue = new PriorityQueue
        for (let stream of streams) {
            const o = stream.next()
            this.queue.insert(o.ts, o)
        }
    }

    start() {
        const o = this.getOrder()
        process.next(this.getOrdxer())
    }

    addOrder(o) { // streamns: array of eventemitters
        // if eveything is not going prioritiy queue
        // and I c an get any num ber events
        // store items in fifo

        this.queue.insert(o.ts, o)


        // expanding in definitely
        // pop original message from



    }

    processOrder() {
        const lowestTsOrder = this.queue.getFirstItem()
        this.emit('order' lowestTsOrder)
        const iterator = lowestTsOrder.iterator
        const neextOrder = iterator.next()
        this.addOrder(nextOrder)
        this.queue.insert(o.ts, o)
    }
    // s
    // messages sorted b y timestamp
    // when to emit a message? globbally lkowest timestamp message
    // track sorted timestamps value: message

}

class QueueMerger {
    constructor() {

    }
    // constructor: list of streams, list of queues
    // getLowestTimeStampItem: emit

    // streams do dark...
}

// inserting more optimized
// SortedMap NavigaBl,e
// Binary Tree
// queued each list first element: global lowest
// sorted list one entry per stream

// k queues
// matching of the lowest timestamp from each queue
// if I find a match, emit that item, update the head of that queue

class SortedQueue { // one for each stream
    constructor(stream) {
        this.q = new PriorityQueue
        stream.on('order', o => this.addOrder.bind(this)
    }

    addOrder(o) {
        this.q.insert(o)
    }
    // consume incoming events
    // getLowestTimeStamp
    // getAndRemoveItem

    // items comes in, put that in a queue sorted order
    // binary search. PriorityQueue log N insetrion, removal

}


class PriorityQueue() {
    // Ron: https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript
    // heap fron list
    // why heap, runtime mem vs. rt
    insert() {
        // binary search - insaertion: log NB
    }

    getFirstItem() {

    }
}

class SortedList {
    insert() {

    }
    getLowestTimeStampMessages() {

    }
}
// timestamp: sorted list
// lowest timestamp
// sort ed array


/*
Stream - emits 'orders'
EventEmitter
'error' 'data'

ts 10
ts 8
- resulting output ordered by timestamp
- wait
- every stream is in order


window?

Item
{
    Number timestamp
    Number Quantity
    Number Price
    String Symbol WMT
    Type: Buy Sell

}
K feeds
merge to out strem

merge themn by symbol



.read() ->
request by and sell. streams in order
- timestamp
- buy $10 $8, quantity
- sell
- events
discrepancy of price
*/
*/
import java.util.*;

class F {
    public static void main(String []args) {
        F f = new F();
        f.run();
    }
    protected void run() {
        Map<Integer, String> m = new HashMap<>();
        m.put(1, "One");
        System.out.println("Java");
        System.out.println(m);
    }
}
*/