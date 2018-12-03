/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Koa from 'koa'
import logger from 'koa-logger'
import Router from 'koa-router'
import bodyParser from 'koa-body'

import { getFiles, initDb, getDb } from './dbWrapper'

export default class ApiServer {
  constructor() {
    ApiServer.scheme = 'http' // TODO Node.js 10.11.0: no static properties
    const router = this._getRouter()
    this.app = this._addMiddleware(new Koa())
      .use(router.routes())
      .use(router.allowedMethods())
    initDb().catch(console.error)
  }

  _addMiddleware(app) {
    return app
      .use(logger())
      .use(bodyParser())
  }

  _getRouter() {
    return new Router({prefix: '/api'})
      .get('/files', async ctx => ctx.body = ({files:await getFiles()}))
      .get('/status', async ctx => ctx.body = ({status: getDb().getStatus()}))
  }

  async listen(port) {
    const {app} = this
    const {scheme} = ApiServer
    const httpServer = await new Promise(resolve => {
      const server = app.listen(port, () => resolve(server))
    })
    const {address, port: p} = httpServer.address()
    const address1 = address !== '::' ? address : 'localhost'
    const url = `${scheme}://${address1}:${p}`
    return {url, port: p}
  }
}
