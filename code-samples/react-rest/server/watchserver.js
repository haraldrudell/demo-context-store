/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ServerWatcher from './ServerWatcher'

// TODO hr171121: remove import path from 'path'

const m = 'watchserver'

launch({args: process.argv.slice(2)}).catch(errorHandler)

async function launch(o) {
  new ServerWatcher(getOptions(o))
}

function getOptions({args}) {
  const watchFilename = args[0]
  const cmd = args[1]
  args = args.slice(2)
  if (!cmd) throw new Error(`${m}: command not provided`)
  return {cmd, args, watchFilename, errorHandler}
}

function errorHandler(e) {
  console.error(`${m} errorHandler:`)
  console.error(e)
  process.exit(1)
}
