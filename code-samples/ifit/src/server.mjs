//
// node --experimental-modules src/server
// Node.js v8.5+

import http from 'http'

const options = {
  port: 5001,
  request: 3e3, // artifical slow of request
  origin: 'http://localhost:3000', // allowOrigin response header value
}

console.log('server.mjs starting…')
Promise.resolve().then(() => new Server(options).start())
  .catch(e => console.error(e) + process.exit(1))

class Server {
  constructor({port, duration, origin}) {
    const headers = {'Content-Type': 'text/plain'}
    origin && (headers['Access-Control-Allow-Origin'] = origin)
    Object.assign(this, {port, duration, headers, rqno: 0})
  }

  async start() {
    const {port} = this
    return new Promise((resolve, reject) => new http.Server((req, res) =>
      this.serverRequest(req, res).catch(reject))
      .listen(port, () => console.log(`server.mjs server is up on port: ${port}`))
    )
  }

  async serverRequest(req, res) {
    const {duration, headers} = this
    const rqno = ++this.rqno

    console.log(`received: ${rqno}`)
    await new Promise(resolve => setTimeout(resolve, duration))

    res.writeHead(200, headers)
    res.end('Text sent from server.')
    console.log(`completed: ${rqno}`)
  }
}
