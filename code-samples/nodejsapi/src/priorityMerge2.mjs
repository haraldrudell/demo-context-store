// © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
// Node.js 9.10 ECMAScript 2017

const streams = [
  {name: 'one', values: [1, 5, 9]},
  {name: 'two', values: [2, 4]},
]

Promise.resolve().then(() => new Runner().run()).catch(console.error)

class Runner {
  run () {
    console.log('Runner.run: merging streams:', streams)
    const iterators = streams
      .map(({name, values}) => values.map(ts => new InputItem({name, ts})))
      .map(inputItems => inputItems[Symbol.iterator]())
    const {compareFunction} = InputItem
    const dispatchFn = this._processOutputItem.bind(this)
    new Merger({iterators, compareFunction, dispatchFn}).merge()
    console.log('Runner.run complete')
  }

  _processOutputItem(v) {
    console.log(`Runner.processOutputItem ${v}`)
  }
}

class Merger {
  constructor({iterators, compareFunction, dispatchFn}) {
    Object.assign(this, {iterators, compareFunction, dispatchFn})
    this.pq = new PriorityQueue(this._wrappedCompare.bind(this))
  }

  merge() {
    const {iterators, pq, dispatchFn} = this
    for (let it of iterators) this._fetchFromIterator(it)
    for (let {iterator, value} of pq) {
      dispatchFn(value)
      this._fetchFromIterator(iterator)
    }
  }

  _fetchFromIterator(iterator) {
    const {pq} = this
    const {value, done} = iterator.next()
    !done && pq.insert({iterator, value})
  }

  _wrappedCompare(a, b) {
    return this.compareFunction(a.value, b.value)
  }
}

class PriorityQueue { // iterator
  constructor(compareFunction) {
    Object.assign(this, {q: [], cf: compareFunction})
  }

  insert(entity) {
    const {q, cf} = this

    // find i0 = insertion point in sorted array
    let i0 = 0
    let i1 = q.length - 1
    while (i1 >= i0) {
      const i = Math.floor((i0 + i1) / 2)
      if (cf(entity, q[i]) < 0) i1 = i - 1
      else i0 = i + 1
    }

    q.splice(i0, 0, entity) // insert o at i0
  }

  *[Symbol.iterator]() {
    const {q} = this
    while (q.length) yield q.shift()
  }
}

class InputItem {
  constructor({name, ts}) {
    Object.assign(this, {name, ts})
  }

  static compareFunction(a, b) { // compare two input items
    return a.ts < b.ts ? -1 : a.ts === b.ts ? 0 : 1
  }

  toString() {
    const {ts, name} = this
    return `${name}: ${ts}`
  }
}
