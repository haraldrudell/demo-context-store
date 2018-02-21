/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

/*
Asynchronous execution means that execution continues while an invoked function
is executing, and that those multiple paths of execution may synchronize with each
other or merge at a future point.

A generator function returns a generator object. Invoking next on the generator
object eecutes the generator function body until the next yield.

An async function can await promises in its function body, ie. execute asynchronous
invocations without starting another function, and execute multiple asynchronous
incovations concurrently.

An async generator function can invoke asynchronous tasks during execution of the
generator function body
*/

export function forIterationOverGeneratorFunction() {
  const m = 'for-generator'
  console.log(`${m} before for`)
  for (let x of generator()) console.log(`${m} for loop: ${x}`)
  console.log(`${m} after for`)
}

function* generator() {
  const m = 'generatorFunction'
  console.log(`${m} at beginning: first yield`)
  yield 'g1'
  console.log(`${m} second yield`)
  yield 'g2'
  console.log(`${m} returning`)
}

export async function whileIterationOverAsyncGeneratorFunction() {
  const m = 'for-generator'
  console.log(`${m} before for`)
  const generator = asyncGenerator()
  for (;;) {
    const p = await generator.next()
    console.log(`${m} for loop:`, p)
    if (p.done) {
      console.log(`${m} extra:`, await generator.next())
      break
    }
  }
  console.log(`${m} after for`)
}

// does not work 180219

export async function forAwaitIterationOverAsyncGeneratorFunction() {
  const m = 'for-generator'
  console.log(`${m} before for`)
  for await (let x of asyncGenerator()) console.log(`${m} for loop: ${x}`)
  console.log(`${m} after for`)
}

async function* asyncGenerator() {
  const m = 'generatorFunction'
  console.log(`${m} at beginning`)
  await new Promise((resolve, reject) => setTimeout(resolve, 1e3))

  console.log(`${m} first yield`)
  yield 'g1'
  await new Promise((resolve, reject) => setTimeout(resolve, 1e3))

  console.log(`${m} second yield`)
  yield 'g2'
  await new Promise((resolve, reject) => setTimeout(resolve, 1e3))

  console.log(`${m} returning`)
  return 'r'
}
