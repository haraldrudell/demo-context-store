/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// import for yarn build
import pjson from '../package.json'
import path from 'path'

const exportName = 'EntityBase'
let EntityBase

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
  EntityBase = theExport
})

test('Entity can be constructed', () => {
  new EntityBase()
})

test('Can store and retrieve payload', () => {
  const expected = 1
  const actual = new EntityBase({payload: expected}).getPayload()
  expect(actual).toBe(expected)
})

test('Can store and retrieve array', () => {
  const expected = [1]
  const actual = new EntityBase({payload: expected}).getPayload()
  expect(actual).toEqual(expected)
})

test('Can store and retrieve object', () => {
  const expected = {a: 1}
  const actual = new EntityBase({payload: expected}).getPayload()
  expect(actual).toEqual(expected)
})
