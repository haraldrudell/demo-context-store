/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import express from 'express'

export default class RESTServer {
  constructor() {
    const server = this.server = express()
    this.middleware(server)
    this.routes(s)
  }

  middleware(s) {

  }

  routes(s) {

  }
}