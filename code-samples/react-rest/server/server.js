/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import RESTServer from './RESTServer'

const m = `server.js:${process.pid}`

launch({args: process.argv.slice(2)}).catch(errorHandler)

async function launch(o) {
  console.log(`${m}: launching…`)
  const options = getOptions(o)
  const s = new RESTServer(options)
  await s.listen()
  console.log(`${m}: listening`)
}

function getOptions({args}) {
  return {}
}

function errorHandler(e) {
  console.error(`${m} errorHandler:`)
  console.error(e)
  process.exit(1)
}
