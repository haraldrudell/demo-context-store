/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// node --experimental-modules src/orderedMap.mjs
//import {OrderedMap} from 'immutable'
import * as immutableExport from 'immutable'
const immutable = immutableExport.OrderedMap ? immutableExport : immutableExport.default
const {OrderedMap} = immutable
import util from 'util'

Promise.resolve().then(() => new OMap().run())
/*
pagination of an infite amount of records:
- get the initial list of some page length -> cursor
- move to some other cursor: get page-length index values, get data for those values
*/
/*
what if one view displays a record in a sort order, and that record is deleted?
- sort is stable
- the only unique value is id
- the solution is to hold on to the sort function and the index value
- on delete, recreate the sort order and use the same index - displays the subsequent record
- the easiest way to get the index is to track what line you are on and then get the new key: orderedMap.keySeq().skip(n).first()
*/

class OMap {
  constructor() {
    const data = this.data = [
      {id: '1', first: 'Bob', last: 'Dlast'},
      {id: '2', first: 'Alice', last: 'Clast'},
      {id: '4', first: 'David', last: 'Blast'},
      {id: '5', first: 'Charles', last: 'Alast'},
    ]
    const iterable = data.map(d => [d.id, d])
    //console.log('OrderedMap argument:', iterable)
    this.oMap = OrderedMap(iterable)
    const data0 = data[0]
    this.oneMap = OrderedMap([[data0.id, data0]])
  }

  run() {
    console.log('\nOrderedMap from immutable package')
    this.whyOrderedMap()
    this.instantiateOrderedMap()
    this.staticOrderedMap()
    this.orderedMapTestData()
    this.mapOrderedMap()
    this.iterateOrderedMap()
  }

  whyOrderedMap() {
    console.log([
      '',
      'OrderedMap is used because:',
      '- O(1) access to values by id: it\'s a Map',
      '- Stable iteration of items in the order they were added: it is ordered',
      'Other collections: List Map Set OrderedSet Stack'
    ].join('\n'))
  }

  instantiateOrderedMap() {
    console.log([
      '',
      'OrderedMap is created by a factory function: the argument can be:',
      'Iterable of key-value pairs: OrderedMap([[\'key1\', \'value1\'], [\'key2\', \'value2\']])',
      'Iterable of single value: key and value are the same: OrderedMap([\'v1\', \'v2\'])',
      'An object (key order is not certain): OrderedMap({\'key1\': \'value1\'})',
      'Empty: OrderedMap()',
      'In practice, the first method is used',
    ].join('\n'))
  }

  staticOrderedMap() {
    console.log([
      '',
      'To get a singleton empty OrderedMap, use OrderedMap()',
      `Two subsequent invocations return an identical object: OrderedMap() === OrderedMap(): ${OrderedMap() === OrderedMap()}`,
    ].join('\n'))
  }

  orderedMapTestData() {
    const {data} = this
    console.log([
      '',
      'Test data with different ordering by id, first and last',
      data.map(d => JSON.stringify(d)).join('\n'),
    ].join('\n'))
  }

  mapOrderedMap() {
    const {oMap, oneMap} = this

    //oMap OrderedMap { "1": [object Object], "2": [object Object],
    //console.log('oMap', oMap)

    //oMap.first { id: '1', first: 'Bob', last: 'Dlast' }
    //console.log('oMap.first', oMap.first())

    // oMap.map((value, key, orderedMap) => …)
    // .map { id: '1', first: 'Bob', last: 'Dlast' }, '1', OrderedMap { "1": [object Object] }
    //console.log('.map', oneMap.map((...args) => args.map(a => util.inspect(a)).join(', ')).first())
    // .map example: OrderedMap { "1": "Bob" }
    //console.log('.map example:', oneMap.map(value => value.first))

    // oMap.mapKeys(key => …)
    // .mapKeys { id: '1', first: 'Bob', last: 'Dlast' }
    //console.log('.mapKeys', oneMap.mapKeys((...args) => args.map(a => util.inspect(a)).join(', ')).first())
    // .mapKeys example: OrderedMap { "-1-": [object Object] }
    //console.log('.mapKeys example:', oneMap.mapKeys(key => `-${key}-`))


    // .mapEntries oMap.mapEntries(([key, value], index, orderedMap) => [key, value]) need to return array [key, value]
    //.mapEntries [ [ '1', { id: '1', first: 'Bob', last: 'Dlast' } ], 0, OrderedMap { "1": [object Object] } ]
    //console.log('.mapEntries', oneMap.mapEntries((...args) => [1, util.inspect(args)]).first())

    console.log([
      '',
      `Number of values: orderedMap.size: ${oMap.size}`,
      `orderedMap.first() gets the first value: ${util.inspect(oMap.first())}`,
      'map functions produce an ordered map:',
      `omap.map((value, key, map) => value): ${oneMap.map((...args) => `length: ${args.length} arguments: ${args.map(a => util.inspect(a)).join(', ')}`).first()}`,
      `omap.mapKeys(key => key): ${oneMap.mapKeys(key => `newKey, oldkey: ${key}`).keySeq().first()}`,
      `omap.mapEntries(([key, value], index, ordxeredMap) => [key, value]): ${oneMap.mapEntries((...args) => [0, args.map(a => util.inspect(a)).join(', ')]).first()}`,
    ].join('\n'))
  }


  iterateOrderedMap() {
    const {oMap} = this
    //for (let key of oMap.keys()) console.log(key) // 1 2 3 4
    console.log([
      '',
      'iterators are .keys() .values() .entries()',
      `for (let key of orderedMap.keys()) …`,
      'Seq provides iteration via a lazy-executing collection: keySeq() valueSeq() entrySeq()',
      'Seq behaves like an array: orderedMap.valueSeq().skip(1).take(2):',
      util.inspect(oMap.valueSeq().skip(1).take(2).toArray()),
      'Using a different sort order: orderedMap.sort((a, b) => a.first < b.first ? -1 : a.first === b.first ? 0 : 1).valueSeq().skip(1).take(2)',
      util.inspect(oMap.sort((a, b) => a.first < b.first ? -1 : a.first === b.first ? 0 : 1).valueSeq().skip(1).take(2).toArray()),
      `oMap.findKey((value, key) => key >= '3'): ${oMap.findKey((value, key) => key >= '3')}`,
    ].join('\n'))
  }
}
