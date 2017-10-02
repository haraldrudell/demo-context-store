/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {spawn} from 'child_process'

test('nmrun should exeute rollup', async () => {
  let stderr = ''
  let stdout = ''
  const [status, signal] = await new Promise((resolve, reject) => {
    const cp = spawn('build/nmrun', ['rollup', '--version'], {stdio: ['ignore', 'pipe', 'pipe']})
      .once('close', (statusX, signalX) => resolve([statusX, signalX]))
      .on('error', reject)
      cp.stdout.on('data', s => stdout += s).on('error', reject).setEncoding('utf8')
      cp.stderr.on('data', s => stderr += s).on('error', reject).setEncoding('utf8')
  })
  expect(signal).toBeFalsy()
  expect(status).toEqual(0)
  expect(stderr).toEqual('')
  expect(stdout).toMatch(/rollup version/)
})
