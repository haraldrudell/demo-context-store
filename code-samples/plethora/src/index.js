/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import RegionsService from './RegionsService'

run().catch(errorHandler)

async function run() {
  await new RegionsService().listen(3001, 'localhost')
  //
}

function errorHandler(e) {
  console.error(e)
  process.exit(1)
}
