/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
/*
../../node_modules/.bin/babel-node src/linesaiuser.js
for await must be inside async function
*/
import asyncLineIterator from './linesai'
import ReadStream from 'stream'

class OneLiner extends ReadStream {
  _read(size) {
    this.push('line\n')
    this.push(null)
  }
}

//f().catch(console.error)

async function f() {
  console.log('before for await')
  for await (let line of asyncLineIterator(new OneLiner())) {
    console.log('linesai.test.js', line)
  }
  console.log('linesai.test.js after for')
}
