/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved
*/
export default class Runner {
  constructor(o) {
    const {name = 'Runner', debug} = o || false
    Object.assign(this, {name, debug})
  }

  async run() {
    return Promise.all([
      (this.server = new HttpServer()).promise, // must instantiate and listen for emitted errors
      this.run2(), // continue execution
    ])
  }

  async run2() {
    const {server} = this
    await server.listen()

  }
}
