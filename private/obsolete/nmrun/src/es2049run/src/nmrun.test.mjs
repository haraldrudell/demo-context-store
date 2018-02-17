/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs-extra'
import path from 'path'
import {spawn} from 'child_process'

const nmrun = path.resolve(path.join('build', 'nmrun'))

test('nmrun should have been built by npm run build', async () => {
  expect(await fs.pathExists(nmrun)).toBeTruthy()
})

test('nmrun should execute rollup', async () => {
  let stderr = ''
  let stdout = ''
  const [status, signal] = await new Promise((resolve, reject) => {
    const cp = spawn(nmrun, ['rollup', '--version'], {stdio: ['ignore', 'pipe', 'pipe']})
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
