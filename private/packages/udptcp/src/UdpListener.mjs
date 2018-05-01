/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {composeAddressPort} from './socketAddress'
import UdpSocket from './UdpSocket'
import GrpcSocket from './GrpcSocket'
import bufferService from './bufferService'

export default class UdpListener extends UdpSocket {
  receivePacket = this.receivePacket.bind(this)

  constructor(o) {
    super(Object.assign({name: 'UdpListener'}, o))
    const {address, port} = Object(o)
    const socketAddress = composeAddressPort({address, port})
    this.grpcSocket = new GrpcSocket({socketAddress, proto: bufferService})
    this.subscription = this.subscribe(this.receivePacket)
  }

  async run() {
    const {grpcSocket} = this

    // proto data
    const serviceName = 'PacketSink'
    this.client = grpcSocket.getClient(serviceName)

    return this.listen()
  }

  async receivePacket(list) {
    const {client} = this
    const [msg/*, rinfo*/] = list
    const value = {data: msg}
    /*const data =*/ await new Promise((resolve, reject) => client.SendPacket(value, (e, d) => !e ? resolve(d) : reject(e)))
    // data.bool: true
  }

  async shutdown() {
    // TODO 180430 hr
  }
}
