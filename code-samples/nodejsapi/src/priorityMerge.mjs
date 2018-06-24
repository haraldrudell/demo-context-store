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
    const iterators = []
    for (let {name, values} of streams) {
      const items = values.map(ts => new InputItem({name, ts})).concat(InputItem.getFinalItem(name))
      iterators.push(new Iterator({values: items}))
    }
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
    for (let it of iterators) this._fetch(it)

    for (;;) {
      const {iterator, value} = pq.getItem()
      if (value.isEnd()) break
      dispatchFn(value)
      this._fetch(iterator)
    }
  }

  _fetch(iterator) {
    const {pq} = this
    const {value} = iterator.next()
    pq.insert({iterator, value})
  }

  _wrappedCompare(a, b) {
    const {compareFunction} = this
    return compareFunction(a.value, b.value)
  }
}

class PriorityQueue {
  constructor(compareFunction) {
    Object.assign(this, {q: [], cf: compareFunction})
  }

  insert(o) {
    const {q, cf} = this

    // find i0 = insertion point in sorted array
    let i0 = 0
    let i1 = q.length - 1
    while (i1 >= i0) {
      const i = Math.floor((i0 + i1) / 2)
      if (cf(o, q[i]) < 0) i1 = i - 1
      else i0 = i + 1
    }

    q.splice(i0, 0, o) // insert o at i0
  }

  getItem() {
    return this.q.shift()
  }
}

class Iterator { // infinite by repeating the last value
  constructor({values}) {
    Object.assign(this, {values})
  }

  next() {
    const {values} = this
    const value = values[0]
    values.length > 1 && values.shift()
    return {value}
  }
}

class InputItem {
  constructor({name, ts}) {
    Object.assign(this, {name, ts})
  }

  isEnd() {
    return this.ts === InputItem._getEndValue()
  }

  static compareFunction(a, b) { // compare two input items
    return a.ts < b.ts ? -1 : a.ts === b.ts ? 0 : 1
  }

  static _getEndValue() {
    return Number.MAX_SAFE_INTEGER
  }

  static getFinalItem(name) {
    return new InputItem({name, ts: InputItem._getEndValue()})
  }

  toString() {
    const {ts, name} = this
    return `${name}: ${ts !== InputItem._getEndValue() ? ts : 'MAX'}`
  }
}
