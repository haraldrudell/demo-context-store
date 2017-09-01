/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Result from './Result'

export class Skip extends Result {
  constructor(o) {
    super(o)
    this.isSkip = true
    this.message = Array.isArray(o.results)
      ? `Skipped due to failures: ${o.results.filter(v => v.isFailure).map(v => v.printable).join(', ')}`
      : 'Skipped'
  }
}