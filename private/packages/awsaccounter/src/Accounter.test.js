/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
//import LineReader from './LineReader'
import pjson from '../package.json'
import path from 'path'
import fs from 'fs-extra'

import {SpawnAsync, spawnCapture} from 'allspawn'

let executableRelative

test('yarn build should have completed', async () => {
  const {main} = Object(pjson)
  if (!main || typeof main !== 'string') throw new Error(`package.json main not non-empty string`)
  const projectDir = path.resolve()
  const executableAbsolute = path.resolve(projectDir, main)
  //const srcDir = path.resolve('src')
  const er = executableRelative = path.relative(projectDir, executableAbsolute)
  if (!await fs.pathExists(er)) expect(`Executable not present at: ${er}`).toBeNull()
})

test('executable -help works', async () => {
  const expected = 'awsaccounter [options]'
  const {stdout} = await spawnCapture({args: [executableRelative, '-h'], options: {silent: false}})
  //console.log(stdout)
  expect(typeof stdout).toBe('string')
  expect(stdout.substring(0, expected.length)).toBe(expected)
  //await new SpawnAsync({args: [executableRelative, '-h']}).startSpawn()
})

test('executable -list works', async () => {
  const expected = 'awsaccounter [options]'
  const {stdout} = await spawnCapture({args: [executableRelative, '-list'], options: {silent: false}})
  //console.log(stdout)
  expect(typeof stdout).toBe('string')
  expect(stdout.length).toBeTruthy()
  console.log('END')
})

test('executable -list-deployable works', async () => {
  const expected = 'awsaccounter [options]'
  const {stdout} = await spawnCapture({args: [executableRelative, '-list-'], options: {silent: false}})
  //console.log(stdout)
  expect(typeof stdout).toBe('string')
  expect(stdout.length).toBeTruthy()
  console.log('END2')
})
