/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ServerRunner from './ServerRunner'

import path from 'path'

launch({args: process.argv.slice(2)}).catch(errorHandler)

async function launch(o) {
  const m = 'runserver'
  const options = getOptions(o, m)
  await new ServerRunner().run(options)
}

function getOptions({args}, m) { // TODO write code
  const relativeFile = args[0]
  args = args.slice(1)
  if (!relativeFile) throw new Error(`${m}: filename not provided`)
  const cmd = path.resolve(relativeFile)
  return {cmd, args, errorHandler}
}

function errorHandler(e) {
  console.error('runserver errorHandler:')
  console.error(e)
  process.exit(1)
}
