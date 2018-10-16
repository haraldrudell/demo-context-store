/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// node --experimental-modules src/server/server
import fs from 'fs-extra'
import KoaQL from './KoaQL.mjs'
import path from 'path'

const port = 3001
const dir = path.resolve('pki')
const keyFile = path.join(dir, 'localhost.key')
const certFile = path.join(dir, 'localhost.crt')

startServer().catch(errorHandler)

async function startServer() {
  const {url} = await new KoaQL({
    http2: {
      key: await fs.readFile(keyFile),
      cert: await fs.readFile(certFile),
    }
  }).listen(port)
  console.log(`listening: ${url}`)
}

function errorHandler(e) {
  console.error(e)
  process.exit(1)
}
