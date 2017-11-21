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
    this._middleware(server)
    this._routes(server, express.Router())
  }

  async listen(o = false) {
    const {port = 3099, hostname = 'localhost'} = o
    const {server} = this
    await new Promise((resolve, reject) => server.listen(port, hostname, resolve))
  }

  _middleware(s) {
    s.use(morgan('dev'))
    s.use(bodyParser.json())
    s.use(bodyParser.urlencoded({extended: false}))
    s.use(cookieParser())
  }

  _routes(s, r) {
    s.use('/api/v1', r)
    r.route('/users')
      .get((req, res) => {
        res.setHeader('Content-Type', 'application/json')

        res.json({message: 'Hello world!'})
      })
  }
}
