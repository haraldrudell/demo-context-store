/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// node --experimental-modules --no-warnings src/server/server
import ApiServer from './ApiServer.mjs'

const options = {
  port: Number(process.SPORT || 3001),
  koa: {
  }
}

startServer(options).catch(errorHandler)

async function startServer(o) {
  const {port = 0, koa = {}} = Object(o)
  const {url} = await new ApiServer(koa)
    .listen(port)
  console.log(`listening: ${url}`)
}

function errorHandler(e) {
  console.error(e)
  process.exit(1)
}
