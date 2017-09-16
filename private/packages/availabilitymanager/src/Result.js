/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export default class Result {
  /*
  v: optional object
  if v falsey: isFailure = true, message = 'Failure'
  otherwise:
  .isFailure: optional boolean default false
  .message: string if isFailure default 'Failure'
  */
  constructor(v = false) {
    const isFailure = this.isFailure = !v || !!v.isFailure
    this.message = String(isFailure
      ? v.message || 'Failure'
      : v.message || '')
  }

  toString() {
    return this.message
  }
}
