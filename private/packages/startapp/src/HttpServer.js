/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {Server} from 'http'

export default class HttpServer extends Server {
  constructor(o) {
    super(typeof (o && o.request) === 'function' ? o.request : function () {})
    if (typeof (o && o.request) !== 'function') {
      this.removeAllListeners('request')
      this.setListener(this._request)
    }
    this.superListen = super.listen // TODO https://github.com/babel/babel/issues/3930 v7.0.0-alpha.12
  }

  setListener(fn) {
    return this.removeListener('request', this._request)
      .on('request', fn)
  }

  async listen(o) {
    const {host = 'localhost', port = 0, handle, path} = o || false
    let args = []
    if (handle != null) args.push(handle)
    else if (path != null) args.push(path)
    else args.push(port, host)
    return new Promise((resolve, reject) => {
      this.once('error', reject)
      this.superListen(...args, () => this.removeListener('error', reject) + resolve())
    })
  }

  _request(IncomingMessage, serverResponse) {
    console.error('HttpServer: request listener not set')
    serverResponse.writeHead(500, {'Content-Type': 'text/plain'})
    serverResponse.end('server error')
  }
}
