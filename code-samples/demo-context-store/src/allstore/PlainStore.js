/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { Subject } from 'rxjs'

export default class PlainStore {
  subject = new Subject()
  state = {}
  notify = () => this.subject.next(this.state)
  subscribe = s => this.subject.subscribe(s)
  getState = () => Object(this.state)
}
