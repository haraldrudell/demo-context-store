/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ClassA from './ClassA'
import ClassB from './ClassB'

function* generator() {
  const m = 'generator'
  console.log(`${m} invoked`)
  yield 1
  console.log(`${m} returning`)
}

async function asyncFunction() {
  const m = 'asyncFunction'
  console.log(`${m} will wait 1 s`)
  await new Promise(r => setTimeout(r, 1e3))
  console.log(`${m} done`)
}

for (let value of generator()) console.log(`generator value: ${value}`)
asyncFunction()
console.log('helper', new ClassA('alpha'), new ClassB('beta'))
