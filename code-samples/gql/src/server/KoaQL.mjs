/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import http2 from 'http2'
import Koa from 'koa'
import koaCors from 'koa2-cors'
import Router from 'koa-router'
import graphqlHTTP from 'koa-graphql'
import schema from "./schema"

export default class KoaQL {
  constructor({http2: http2Options}) {
    const app = new Koa
    const router = new Router
    router.all('/graphql', graphqlHTTP({
      schema,
      graphiql: true, // debug: presents a console at uri …/graphiql
    }))
    this.handler = ctx => {  // TODO: Node.js v10.11.0: no class properies
      console.log('rq')
      ctx.body = 'Hello Koa'
    }
    app
      .use(koaCors({origin: '*'})) // must be before handler
      .use(router.routes())
      .use(router.allowedMethods())
      //.use(this.handler)
          Object.assign(this, {app})
    this.http2 = http2.createSecureServer(http2Options, app.callback())
  }

  async listen(port) {
    return new Promise(resolve => this.http2.listen(port, resolve))
  }
}
