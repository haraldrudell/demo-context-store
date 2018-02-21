/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// import for yarn build
import pjson from '../package.json'
import path from 'path'

const exportName = 'Entity'
let Entity

test('yarn build should have completed', () => {

  // get require path
  const {main} = Object(pjson)
  if (!main || typeof main !== 'string') throw new Error(`package.json main not non-empty string`)
  const projectDir = path.resolve()
  const executableAbsolute = path.resolve(projectDir, main)
  const srcDir = path.resolve('src')
  const executableRelative = path.relative(srcDir, executableAbsolute)

  // require
  let executableExports
  let e
  try {
    executableExports = require(executableRelative)
  } catch (ee) {
    e = ee
  }
  if (e) expect(`failed to require: '${main}': Error: ${e.message}`).toBeNull()

  // get the exported value
  expect(typeof executableExports).toBe('object')
  const theExport = executableExports[exportName]
  expect(typeof theExport).toBe('function')
  Entity = theExport
})

test('Entity can be constructed', () => {
  new Entity({urn: 'urn', updated: 1, debug: true})
})
