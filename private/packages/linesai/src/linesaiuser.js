/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// ../../node_modules/.bin/babel-node src/linesaiuser.js

import LineReader from './LineReader'
import {Readable} from 'stream'

const lines = ['first line', 'second line']
const errorMessage = 'Fake Error'

class OneLiner extends Readable {
  _read(size) {
    this.push(lines.reduce((r, s) => r += s + '\n', ''))
    this.push(null)
  }
}

runTests().catch(errorHandler)

async function runTests() {
  await success()
  await errorWhileReading().catch(e => {
    if (e.message == errorMessage) console.log('error handled properly')
    else throw e
  })
  // 170916 6.24.1 this fails
  console.log('note: NODE BUG 170916 6.24.1 this fails errorBeforeRead')
  // await errorBeforeRead()
  await errorAfterRead()
  console.log('All tests completed successfully')
}

async function errorAfterRead() {
  console.log('function errorAfterRead')
  const o = new OneLiner()
  const lr = new LineReader(o)
  for await (let line of lr.asyncLineIterator()) console.log(line)
  o.emit('error', new Error(errorMessage))
  console.log('closing')
  await lr.close().catch(e => {
    if (e.message == errorMessage) console.log('error handled properly')
    else throw e
  })
}

async function errorBeforeRead() {
  console.log('function errorBeforeRead')
  const o = new OneLiner()
  const lr = new LineReader(o)
  o.emit('error', new Error(errorMessage))
  console.log(lr.isError)
  for await (let line of lr.asyncLineIterator()) console.log(line)
  console.log('closing', lr.isError)
  await lr.close()
}

async function success() {
  console.log('function success')
  const lr = new LineReader(new OneLiner())
  for await (let line of lr.asyncLineIterator()) console.log(line)
  console.log('closing')
  await lr.close()
}

async function errorWhileReading() {
  console.log('function errorWhileReading')
  const o = new OneLiner()
  o._read = () => {throw new Error(errorMessage)}
  const lr = new LineReader(o)
  console.log('at for loop')
  for await (let line of lr.asyncLineIterator()) console.log(line)
  console.log('closing')
  await lr.close()
}

function errorHandler(e) {
  console.error('errorHandler:')
  console.error(e)
  process.exit(1)
}
