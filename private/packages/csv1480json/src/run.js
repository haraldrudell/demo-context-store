/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import CsvJsonConverter from './CsvJsonConverter'

launch({fn: CsvJsonConverter}).catch(errorHandler)
async function launch({fn}) {
  process.on('uncaughtException', errorHandler)
    .on('unhandledRejection', errorHandler)
  return new fn({...getOptions(), errorHandler})
}

function getOptions() {
  const {argv, stdin, stdout} = process
  let useHeader = false
  for (let arg of argv.slice(2)) switch (arg) {
    case '--header': useHeader = true; break
    default: throw new Error('usage: csv1480json [--header]')
  }
  return {readStream: stdin, writeStream: stdout, useHeader}
}

function errorHandler(e) {
  console.error(e instanceof Error ? e.message : `errorHandler value: ${typeof e} ${e}`)
  process.exit(1)
}
