/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// ../../node_modules/.bin/jest --rootDir /opt/foxyboy/sw/private/packages/linesai --config /opt/foxyboy/sw/private/jest.transform.js --no-cache
import asyncLineIterator from './linesai'
import {Readable} from 'stream'

const lines = ['first line', 'second line']

class OneLiner extends Readable {
  _read(size) {
    this.push(lines.reduce((r, s) => r += s + '\n', ''))
    this.push(null)
  }
}

test('Read a stream line-by-line using an async iterator', async () => {
  const myLines = lines.slice()
  console.log('linesai.test.js inside async')
  expect.assertions(myLines.length)
  for await (let line of asyncLineIterator(new OneLiner())) {
    expect(line).toEqual(myLines.shift())
    console.log('linesai.test.js inside for loop, got line:', line)
  }
  console.log('linesai.test.js after for')
})
