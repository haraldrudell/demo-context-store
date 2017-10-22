/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import CodeServer from './CodeServer'

run().catch(errorHandler)

async function run() {
  const o = {port: 3030, host: 'localhost', listen}
  const server = new CodeServer()
  await server.listen(o)
  console.log('listening…')
}

function errorHandler(e) {
  console.error('index.js errorHandler:')
  console.error(/*e instanceof Error ? e.message :*/ e)
  process.exit(1)
}
