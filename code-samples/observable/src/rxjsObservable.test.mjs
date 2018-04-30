/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// yarn test src/rxjsObservable.test.mjs
// https://github.com/tc39/proposal-observable
import {Observable, from} from 'rxjs'

import util from 'util'

test('from: Observable from Array', () => {
  // instantiate observable
  const observable = from([1])
  expect(observable).toBeInstanceOf(Observable)
  // console.log(`observable: ${util.inspect(observable.constructor.prototype, {colors: true})}`)

  // subscribe to observable
  const subscription = observable.subscribe((...args) => console.log(...args))
})

/*
Observable instance methods:
Observable {
      lift: [Function],
      subscribe: [Function],
      _trySubscribe: [Function],
      forEach: [Function],
      _subscribe: [Function],
      '@@observable': [Function],
      pipe: [Function],
      toPromise: [Function] }

rxjs does not have Observer
/*
from(1)
TypeError: You provided '1' where a stream was expected.
You can provide an Observable, Promise, Array, or Iterable.

Promise: a Promise object which resolves to a single value using await or promise.then()
Array: a list of values
Iterable: An object with iterable.next() function returning {done, value}
Observable:
*/