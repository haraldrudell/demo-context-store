/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import * as users from './users'

import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

export default class RESTServer {
  constructor(o = false) {
    const server = this.server = express()
    this._middleware(server)
    const entities = {
      users: o.users || users,
    }
    this._routes(server, express.Router(), entities)
    const isDevelopment = process.env.NODE_ENV !== 'production'
    if (isDevelopment) server.disable('etag')
  }

  async listen(o = false) {
    const {port = 3099, hostname = 'localhost'} = o
    const {server} = this
    await new Promise((resolve, reject) => server.listen(port, hostname, resolve))
  }

  _middleware(s) {
    s.use(morgan('dev'))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({extended: false}))
      .use(cookieParser())
  }

  _routes(s, r, e) {
    s.use('/api/v1', r)
    const usersGet = this._getEntityGetHandler(e.users.get)
    r.route('/users/:id?')
      .get(usersGet)
  }

  _getEntityGetHandler(entityGet) {
    return this::_genericGetWrapper

    function _genericGetWrapper(req, res, next) {
      this._genericGet(entityGet, req, res).catch(e => console.error(e) + next(e))
    }
  }

  async _genericGet(entityGet, req, res) {
    const result = await entityGet(req.params.id, req, res)
    if (result) {
      res.setHeader('Content-Type', 'application/json')
      res.json(result)
    } else res.status(404).end()
  }
}
