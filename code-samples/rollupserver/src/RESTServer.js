/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

export default class RESTServer {
  constructor() {
    const server = this.server = express()
    this.middleware(server)
    this.routes(server)
  }

  middleware(s) {
    s.use(morgan('dev'))
    s.use(bodyParser.json())
    s.use(bodyParser.urlencoded({extended: false}))
    s.use(cookieParser())
  }

  routes(s) {
    s.use((req, res) => {
      res.json({ message: 'Hello world!' })
    })
  }
}