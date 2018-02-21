/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class Events {
  sendEventEmitter() {
    const emitter = new EventEmitter()
    emitter.emit('event')
  }

  receiveEventEmitter(emitter) {
    const listener = this.listener.bind(this)
    emitter.on('event', listener)
    emitter.removeListener('event', listener)
  }

  sendObservable() {
    let f
    const observable = new Observable(o => (f = x => o.next(x)))
    f('event')
  }

  receiveObservable(observable) {
    observable.observe({next: v => this.listener(v)})
    observable.unsubscribe()
  }

  listener() {}
}