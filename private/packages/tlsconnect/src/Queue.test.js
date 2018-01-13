/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Queue from './Queue'

test('Queue.submit works', async () => {
  const expected = 1
  function task() {
    return expected
  }

  const q = new Queue()
  const actual = await q.submit(task)
  expect(actual).toEqual(expected)
})

test('Queue.submit throws task errors', async () => {
  const expected = 'bad'
  const errorMessageMatcher = new RegExp(`^${expected}$`)
  function task() {
    throw new Error(expected)
  }

  const e = new Queue()
  await asyncThrowInJest(e.submit(task), errorMessageMatcher)

  async function asyncThrowInJest(p, expectedErrorMessage) {
    let thrownError
    const v = await p.catch(e => thrownError = e)
    expect(() => {
      if (thrownError) throw thrownError
    }).toThrow(expectedErrorMessage)
    return v
  }
})

test('Queue queues properly', async () => {
  const waitMs = 100
  const setTimeoutMarginMs = 5
  const setTimeoutMs = waitMs + setTimeoutMarginMs
  const submitDurationMax = waitMs / 2
  const taskOneName = 'taskOne'
  const taskTwoName = 'taskTwo'

  let t0 = 0
  function getTimeval() {
    return Date.now() - t0
  }
  async function doWork(task) {
    const invocation = getTimeval()
    await new Promise((resolve, reject) => setTimeout(resolve, setTimeoutMs))
    return {done: getTimeval(), invocation, task}
  }
  async function task1() {
    return doWork(taskOneName)
  }
  async function task2() {
    return doWork(taskTwoName)
  }

  const q = new Queue()
  t0 = getTimeval()
  const ps = [q.submit(task1), q.submit(task2)]
  const submitDuration = getTimeval()
  const values = await Promise.all(ps)
  let s, v, a

  // Jest cannot print a custom failure message, so:
  for (let [i, o] of values.entries()) {
    v = Object(o).task
    s = `task${i + 1} resolved to incorrect value: ${v}`
    a = [taskOneName, taskTwoName][i]
    if (v !== a) expect().toBe(s)
  }

  s = `Queue.submit duration slow: ${submitDurationMax} ms or slower: ${submitDuration} expected < 3 ms`
  if (submitDuration >= submitDurationMax || isNaN(submitDuration)) expect().toBe(s)

  for (let [i, o] of values.entries()) {
    v = o.done - o.invocation
    s = `task${i + 1} resolved too quickly: ${v} ms, expected >= ${waitMs}`
    if (v < waitMs || isNaN(v)) expect().toBe(s)
  }

  v = values[1].invocation
  s = `Expected task2 to be held until after submit complete: ` +
    `task2.invocation: ${v} submitDuration: ${submitDuration}`
  if (v <= submitDuration || isNaN(v)) expect().toBe(s)

  v = values[1].invocation
  a = values[0].done
  s = `Expected task2 to start after task1 completed: ` +
    `task2 invocation: ${v} task1 done: ${a}`
  if (v < a) expect().toBe(s)

  v = values[1].done - values[0].invocation
  a = 2 * waitMs
  s = `Expected tasks to be executed in sequence ` +
    `tasks duration: ${v} expected greater or equal to: ${a}`
  if (v < a) expect().toBe(s)
})
