/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import { Subject } from 'rxjs'

export default class PlainStore {
  subject = new Subject()
  state = {}
  notify = () => this.subject.next(this.state)
  subscribe = s => this.subject.subscribe(s)
  getState = () => Object(this.state)
}
