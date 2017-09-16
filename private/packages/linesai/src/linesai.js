/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import readline from 'readline'

export default async function* asyncLineIterator(readStream) {
  let isEnd
  readStream.on('error', asyncLineIteratorErrorListener)
  const input = readline.createInterface({input: readStream})
    .on('line', )
    .once('end', asyncLineIteratorEndListener)
    .on('error', asyncLineIteratorErrorListener)

  while (!isEnd) yield await getLine(input)

  function asyncLineIteratorEndListener() {
    isEnd = true
  }

  function asyncLineIteratorErrorListener(e) {
    console.error('asyncLineIteratorErrorListener:')
    asyncLineIteratorEndListener()
    throw e
  }
}

async function getLine() {
  return new Promise((resolve, reject) => {
    input.resume()
    input.once('line', line => {
      input.pause()
      resolve(line)
    })
  })
}
