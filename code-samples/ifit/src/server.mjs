//
// node --experimental-modules src/server
// Node.js v8.5+
import http from 'http'
const port = 5001

console.log('server.mjs starting…')
Promise.resolve().then(() => new Server().start(port))

class Server {
  async start(port) {
    this.rqno = 0
    return new Promise((resolve, reject) => new http.Server((req, res) =>
      this.serverRequest(req, res).catch(reject))
      .listen(port, () => console.log(`server.mjs server is up on port: ${port}`))
    )
  }

  async serverRequest(req, res) {
    console.log(++this.rqno)
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Text sent from server.')
  }
}
