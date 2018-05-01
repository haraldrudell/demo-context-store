/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {parseUrl, isValidPort, isAnyPort, getSocketAddress} from './socketAddress'

// protobufjs 6.8.6 could do named import, but then downgraded
// protobufjs 6.8.6 has no default export, use named exports
import {Root} from 'protobufjs'
// protobufjs 6.8.6: Root is a function with properties className, fromJSON, _configure
const {fromJSON} = Root
// 5.0.2 exports {default: 25, __moduleExports}: use default export
//import protobufjs from 'protobufjs'
//const {loadJson} = protobufjs
import {loadObject, Server, ServerCredentials, credentials} from 'grpc'

//import util from 'util'

export default class GrpcSocket {
  constructor(o) {
    this.m = 'GrpcSocket'
    const {socketAddress, proto} = Object(o)
    const services = loadObject(fromJSON(proto))
    //console.log(typeof Object(services).PacketSink) // function
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
    const {urlObject} = parseUrl(socketAddress)
    const {port: p0} = urlObject
    const updateSocketAddress = !isValidPort(p0)
    const updateBindArgument = updateSocketAddress && !isAnyPort(p0)
    updateBindArgument && (urlObject.port = 0)
    const saUse = !updateBindArgument ? socketAddress : getSocketAddress(urlObject)

    // start socket server
    const server = this.server = new Server()
    server.addService(service, implementationMap)
    const port = server.bind(saUse, ServerCredentials.createInsecure())
    server.start()

    // update socketAddress
    if (updateSocketAddress) {
      urlObject.port = port
      this.socketAddress = getSocketAddress(urlObject)
    }

    return {server, port}
  }

  async shutdown() {
    const {server} = this
    return new Promise((resolve, reject) => server.tryShutdown((e, v) => !e ? resolve(v) : reject(e)))
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
