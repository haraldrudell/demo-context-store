/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import ClassA from './ClassA'
import ClassB from './ClassB'

testGenerator()
testAsyncFunction()

function* generator() {
  const m = 'generator'
  console.log(`${m} function  body executing`)
  yield 1
  console.log(`${m} end of function body`)
}

function testGenerator() {
  console.log('Invoking generator function…')
  const v1 = generator()
  console.log('generator returned:', v1)
  console.log('invoking next…')
  const v2 = v1.next()
  console.log('first next value:', v2)
  console.log('invoking next…')
  const v3 = v1.next()
  console.log('second next value:', v3)
  console.log('invoking next…')
  const v4 = v1.next()
  console.log('second next value:', v4)
}

async function asyncFunction() {
  const m = 'asyncFunction'
  console.log(`${m} will wait 1 s`)
  await new Promise(r => setTimeout(r, 1e3))
  console.log(`${m} done`)
}

function testAsyncFunction() {
  console.log('invoking async function…')
  const v1 = asyncFunction()
  console.log('async function return value:', v1)
}

//for (let value of generator()) console.log(`generator value: ${value}`)
console.log('helper', new ClassA('alpha'), new ClassB('beta'))
console.log('end of program')
