/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// https://localhost:3001/graphql
import http2 from 'http2'
import Koa from 'koa'
import logger from 'koa-logger'
import koaCors from 'koa2-cors'
import Router from 'koa-router'
import graphqlHTTP from 'koa-graphql'
import schema from './schema'

export default class KoaQL {
  constructor({http2: http2Options}) {
    const router = new Router()
      .all('/graphql', graphqlHTTP({
        schema,
        graphiql: true, // debug: presents a console at uri …/graphiql
      }))
    const app = new Koa()
      .use(logger())
      .use(koaCors({origin: '*'})) // must be before handler
      .use(router.routes())
      .use(router.allowedMethods())
    Object.assign(this, {app})
    this.httpServer = http2.createSecureServer(http2Options, app.callback())
  }

  async listen(port) {
    const {httpServer} = this
    await new Promise(resolve => httpServer.listen(port, resolve))
    const {address, port: p} = httpServer.address()
    const address1 = address !== '::' ? address : 'localhost'
    const url = `https://${address1}:${p}`
    return {url, port: p}
  }
}
