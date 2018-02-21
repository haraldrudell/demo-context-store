/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
//import LineReader from './LineReader'

import {Readable} from 'stream'
import pjson from '../package.json'

import fs from 'fs-extra'

import path from 'path'
import childProcess from 'child_process'
const {ChildProcess, execSync} = childProcess

const {main} = Object(pjson)
if (!main || typeof main !== 'string') throw new Error(`package.json main not non-empty string`)

const projectDir = path.resolve()
const executableAbsolute = path.resolve(projectDir, main)
const srcDir = path.resolve('src')
const executableRelative = path.relative(srcDir, executableAbsolute)

const exportName = 'LineReader'
let LineReader

test('yarn build should have completed', () => {
  let executableExports
  let e
  try {
    executableExports = require(executableRelative)
  } catch (ee) {
    e = ee
  }
  if (e) expect(`failed to require: '${main}': Error: ${e.message}`).toBeNull()
  expect(typeof executableExports).toBe('object')
  const theExport = executableExports[exportName]
  expect(typeof theExport).toBe('function')
  LineReader = theExport
})

test('extend works', async () => {
  const lr = new LineReader(new Readable())
  expect(typeof lr.readLine).toEqual('function')
})

import LineReader5 from '../lib/LineReader'
test('extend works in transpiled', async () => {
  const lr = new LineReader(new Readable())
  expect(typeof lr.readLine).toEqual('function')
})
