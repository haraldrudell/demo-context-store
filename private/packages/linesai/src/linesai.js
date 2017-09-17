/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import LineReader from './LineReader'

export default async function* asyncLineIterator(readable) {
  const lineReader = new LineReader(readable)
  for(;;) {
    const s = await lineReader.readLine()
    if (s === false) break
    yield s
  }
  lineReader
}
