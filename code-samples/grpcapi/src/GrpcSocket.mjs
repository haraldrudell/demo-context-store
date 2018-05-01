/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {Root} from 'protobufjs'
import {loadObject, Server, ServerCredentials, credentials} from 'grpc'

import url from 'url'
import util from 'util'

export default class GrpcSocket {
  constructor(o) {
    this.m = 'GrpcSocket'
    const {socketAddress, proto} = Object(o)
    const services = loadObject(Root.fromJSON(proto))
    Object.assign(this, {socketAddress, services})
  }

  getClient(serviceName) {
    const {socketAddress} = this
    const {client, text} = this._getService({serviceName, isClient: true})
    if (text) throw new Error(`${this.m}.getClient: ${text}`)
    return new client(socketAddress, credentials.createInsecure())
  }

  startServer({serviceName, implementationMap}) {
    const {socketAddress} = this

    // find the service
    const {service, text} = this._getService({serviceName})
    if (text) throw new Error(`${this.m}.startServer: ${text}`)

    // ensure we have a port
    const {urlObject} = this._parseUrl(socketAddress)
    const {port: p0} = urlObject
    const updateSocketAddress = !this._isValidPort(p0)
    const updateBindArgument = updateSocketAddress && !this._isAnyPort(p0)
    updateBindArgument && (urlObject.port = 0)
    const saUse = !updateBindArgument ? socketAddress : this._getSocketAddress(urlObject)

    // start socket server
    const server = this.server = new Server()
    server.addService(service, implementationMap)
    const port = server.bind(saUse, ServerCredentials.createInsecure())
    server.start()

    // update socketAddress
    if (updateSocketAddress) {
      urlObject.port = port
      this.socketAddress = this._getSocketAddress(urlObject)
    }

    return {server, port}
  }

  async shutdown() {
    const {server} = this
    return new Promise((resolve, reject) => server.tryShutdown((e, v) => {debugger; !e ? resolve(v) : reject(e)}))
  }

  _parseUrl(textUrl) {
    const urlObject = url.parse(textUrl)
    const hasProtocol = urlObject.protocol && !String(urlObject.protocol).slice(0, -1).replace(/[a-z0-9]/, '')
    if (hasProtocol) return {hasProtocol, urlObject}
    const url1 = url.parse(`http://${textUrl}`)
    url1.protocol = null
    url1.slashes = false
    return {hasProtocol, urlObject: url1}
  }

  _isAnyPort(p) {
    p = +p
    return !isNaN(p) && p === 0
  }

  _isValidPort(p) {
    p = +p
    return p >= 1 && p <= 65535 && Number.isInteger(p) && p || false
  }

  _getSocketAddress(urlObject) {
    const {hostname, port} = urlObject
    return `${hostname}:${port}`
  }

  _getService({serviceName, isClient}) {
    const {services} = this
    const result = {}
    const value = Object(services)[serviceName] // services and message are top level keys
    typeof value === 'function' && (result.client = value)
    const {service} = Object(value)
    service && (result.service = service)
    if (!(isClient ? result.client : result.service)) {
      const serviceNames = this._getServiceNames(services)
      const names = serviceNames.length ? `'${serviceNames.join(`'\x20'`)}` : 'none'
      result.text = `service '${serviceName}' not found: have: ${names}'`
    }
    return result
  }

  _getServiceNames(services) {
    const topLevels = Object.keys(Object(services))
    return topLevels.filter(key => services[key].service && typeof services[key] === 'function')
  }
}
