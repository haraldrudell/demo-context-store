/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Koa from 'koa'
import logger from 'koa-logger'
import Router from 'koa-router'
import bodyParser from 'koa-body'
import data from './data'
import shortid from 'shortid'

export default class ApiServer {
  constructor() {
    ApiServer.scheme = 'http' // TODO Node.js 10.11.0: no static properties
    const router = this._getRouter()
    this.app = this._addMiddleware(new Koa())
      .use(router.routes())
      .use(router.allowedMethods())
  }

  _addMiddleware(app) {
    return app
      .use(logger())
      .use(bodyParser())
  }

  _getRouter() {
    return new Router({prefix: '/api'})
      .get('/jobs', ctx => ctx.body = ({jobs: data.jobs}))
      .get('/software', ctx => ctx.body = ({options: data.software}))
      .get('/hardware', ctx => ctx.body = ({options: data.hardware}))
      .post('/jobs', ctx => { // { name: 'Noname', softwareId: 'cfd', applicationId: 'icing', hardwareId: 'e4', cores: 1 }
        const {name, softwareId, applicationId, hardwareId, cores} = ctx.request.body
        const software0 = data.software.filter(({id}) => id === softwareId)[0]
        const application = software0 && software0.applications.filter(({id}) => id === applicationId)[0]
        const hardware = data.hardware.filter(({id}) => id === hardwareId)[0]
        if (!name || !software0 || !application || !hardware || cores > hardware.max) ctx.throw(400)
        const {label, id: i} = software0
        const software = {type: {label, id: i}, application}
        const id = shortid.generate()
        const duration = this.duration(cores)
        const {images} = data.results[softwareId][applicationId]
        const status = 'finished'
        const results = {duration, images, status}
        const job = {name, id, software, hardware, cores, results}
        ctx.body = job
      })
  }

  duration(hardwareCores) {
    const total = Math.floor(Math.random() * (90000 - 70000 + 1)) + 70000;
    return total - (hardwareCores*1000);
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
