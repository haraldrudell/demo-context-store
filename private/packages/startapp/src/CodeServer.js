/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import HttpServer from './HttpServer'

import path from 'path'
import fs from 'fs'

export default class CodeServer extends HttpServer {
  constructor(o) {
    super(o)
    this.setListener(this.codeRequestWrapper)
  }

  async codeRequest(IncomingMessage, serverResponse) {
    serverResponse.writeHead(200, {'Content-Type': 'text/plain'})
    fs.createReadStream(path.join(__dirname, 'bootstrap.js')).pipe(serverResponse)
  }
  codeRequestWrapper = (i, r) => this.codeRequest(i, r).catch(this.codeRequestError)

  codeRequestError = console.error // TODO fix error handling
}
