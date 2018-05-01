/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// listen grpc-tcp, send udp
import {composeAddressPort} from './socketAddress'
import UdpSocket from './UdpSocket'
import GrpcSocket from './GrpcSocket'
import bufferService from './bufferService'

export default class UdpSender extends UdpSocket {
  SendPacket = this.SendPacket.bind(this)

  constructor(o) {
    super(Object.assign({name: 'UdpSender'}, o))
    const {address, port} = Object(o)
    Object.assign(this, {address, port})
    const socketAddress = composeAddressPort({address, port})
    this.grpcSocket = new GrpcSocket({socketAddress, proto: bufferService})
  }

  async run() {
    const {grpcSocket, SendPacket} = this
    // proto data
    const serviceName = 'PacketSink'
    const implementationMap = {SendPacket}
    /*const server =*/ return grpcSocket.startServer({serviceName, implementationMap})
  }

  SendPacket(call, callback) {
    this.sendUdp(call, callback).catch(callback)
  }

  async sendUdp(call, callback) {
    const {address, port} = this
    const message = call.request.data
    await this.sendMessage({address, port, message})
    callback(null, {bool: true}) // err, value[, trailer[, flags]] name: sendUnaryData
  }

  async shutdown() {
    // TODO 180430 hr
  }
}
