import CsvJsonConverter from './CsvJsonConverter'

launch({fn: CsvJsonConverter, getOptions, errorHandler}).catch(errorHandler)

function getOptions() {
  const {argv} = process
  console.log('getOptions argv', argv)
  const useHeader = argv[2] === '--header'
  if (argv.length !== (useHeader ? 3 : 2)) throw new Error('usage: csv1480json [--header]')
  return {readStream: process.stdin, writeStream: process.stdout, useHeader}
}

async function launch({fn, getOptions, errorHandler}) {
  process.on('uncaughtException', errorHandler)
    .on('unhandledRejection', errorHandler)
  new fn({...getOptions(), errorHandler})
}

function errorHandler(e) {
  console.error(e instanceof Error ? e/*TODO .message*/ : `errorHandler value: ${typeof e} ${e}`)
  process.exit(1)
}
