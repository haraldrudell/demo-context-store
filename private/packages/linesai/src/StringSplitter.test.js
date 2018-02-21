/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
//import StringSplitter from './StringSplitter'
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

const exportName = 'StringSplitter'
let StringSplitter

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
  StringSplitter = theExport
})

test('Empty string immediately ends', async () => {
  const fetchValues = ['', false]
  let fetchInvocations = 0
  const fetch = () => {
    fetchInvocations++
    return fetchValues.shift()
  }

  const s = new StringSplitter(fetch)
  expect(await s.readLine()).toEqual(false)
  expect(s.hadFinalEOL()).toEqual(false)
  expect(fetchInvocations).toEqual(2)
})

test('hadFinalEOL', async () => {
  const fetchValues = ['a\n', false]
  let fetchInvocations = 0
  const fetch = () => {
    fetchInvocations++
    return fetchValues.shift()
  }

  const s = new StringSplitter(fetch)
  expect(await s.readLine()).toEqual('a')
  expect(await s.readLine()).toEqual(false)
  expect(s.hadFinalEOL()).toEqual(true)
  expect(fetchInvocations).toEqual(2)
})

test('crlf on data boundary, split into lines', async () => {
  const fetchValues = ['a\r', '\nb\n', false]
  let fetchInvocations = 0
  const fetch = () => {
    fetchInvocations++
    return fetchValues.shift()
  }

  const s = new StringSplitter(fetch)
  expect(await s.readLine()).toEqual('a')
  expect(await s.readLine()).toEqual('b')
  expect(await s.readLine()).toEqual(false)
  expect(s.hadFinalEOL()).toEqual(true)
  expect(fetchInvocations).toEqual(3)
})
