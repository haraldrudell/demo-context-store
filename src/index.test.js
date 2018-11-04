/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import pjson from '../package.json'

import path from 'path'

// get relative path to the built executable
const {main} = Object(pjson)
if (!main || typeof main !== 'string') throw new Error(`package.json main not non-empty string`)
const projectDir = path.resolve()
const absolutePath = path.resolve(projectDir, main)
const srcDir = path.resolve('src')
const haraldreactRelative = path.relative(srcDir, absolutePath)

test('yarn build should have completed', async () => {
  let haraldreact
  let e
  try {
    haraldreact = require(haraldreactRelative)
  } catch (ee) {
    e = ee
  }
  if (e) expect(`failed to require: '${main}': Error: ${e.message}`).toBeNull()
  expect(typeof haraldreact).toBe('object')
  //spawnCapture = haraldreact.spawnCapture
  //expect(typeof spawnCapture).toBe('function')
})
