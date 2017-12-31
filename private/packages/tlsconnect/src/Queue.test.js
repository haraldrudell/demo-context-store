/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Queue from './Queue'

test('Queue runs successfully', async () => {
  const expected = 1
  const e = new Queue()
  const actual = await e.submit(() => Promise.resolve(expected))
  expect(actual).toEqual(expected)
})

test('Queue handles errors', async () => {
  const expected = 'bad'
  function task() {
    throw new Error(expected)
  }
  const e = new Queue()
  let ee
  const a = await e.submit(task).catch(err => ee = err)
  if (!ee) throw new Error('Failed to throw')
  expect(() => {
    throw ee
  }).toThrow(expected)
})

test('Queue queues properly', async () => {
  const waitMs = 100
  const margin = 5
  const one = 1
  const two = 2
  const add = 10

  let t0
  async function task(x) {
    const result = {invocation: Date.now() - t0}
    await new Promise((resolve, reject) => setTimeout(resolve, waitMs + margin))
    return {...result, input: x, output: x + add, done: Date.now() - t0}
  }
  const getTaskThunk = x => () => task(x)
  const e = new Queue()
  t0 = Date.now()
  const p1 = e.submit(getTaskThunk(one))
  const p2 = e.submit(getTaskThunk(two))
  const t2Submitted = Date.now() - t0
  const v1 = await p1
  const v2 = await p2

  // submission should be quick
  const submitDuration = t2Submitted - t0
  expect(submitDuration).toBeLessThan(waitMs)

  // tasks should take long time
  expect(v1.done - v1.invocation).toBeGreaterThan(waitMs)
  expect(v2.done - v2.invocation).toBeGreaterThan(waitMs)

  // task2 should be held and start after submit complete
  expect(v2.invocation).toBeGreaterThan(t2Submitted)

  // task2 should start after task1 completes
  expect(v2.invocation).toBeGreaterThanOrEqual(v1.done)

  // tasks should be executed one after the other
  const taskDuration = v2.done - v1.invocation
  expect(taskDuration).toBeGreaterThan(2 * waitMs)
})
