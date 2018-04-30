/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import UdpSocket from './UdpSocket'

import grpc from 'grpc'

export default class UdpListener extends UdpSocket {
  constructor(o) {
    super(o)
    throw new Error('UdpListener NIMP')
    const {port} = Object(o)
    //const {host} = UdpListener
    //const server = createSocket()
    Object.assign(this, {port})

    var booksProto = grpc.load('books.proto')

    var client = new booksProto.books.BookService('127.0.0.1:50051',
    grpc.credentials.createInsecure())

    client.list({}, function(error, books) {
      if (error) console.log('Error: ', error)
      else console.log(books);
    })
  }

  async run() {
  }

  async shutdown() {
  }
}
