/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
test('TODO 180217 hr test .mjs somehow', () => undefined)
/* TODO 180217 hr test .mjs somehow

//import EmailVerifier from './EmailVerifier'
import pjson from '../package.json'

import fs from 'fs-extra'

import path from 'path'

const {main} = Object(pjson)
if (!main || typeof main !== 'string') throw new Error(`package.json main not non-empty string`)

const projectDir = path.resolve()
const binaryAbsolute = path.resolve(projectDir, main)
const srcDir = path.resolve('src')
const binaryRelative = path.relative(srcDir, binaryAbsolute)

let EmailVerifier

test('yarn build should have completed', async () => {
  let binaryExports
  let e
  try {
    binaryExports = require(binaryRelative)
  } catch (ee) {
    e = ee
  }
  if (e) expect(`failed to require: '${main}': Error: ${e.message}`).toBeNull()
  expect(typeof binaryExports).toBe('object')
  EmailVerifier = binaryExports.EmailVerifier
  // TODO expect(typeof EmailVerifier).toBe('function')
})

test('Email parse should work', () => {
  const input = 'president@whitehouse.gov'
  const expected = {address: 'president@whitehouse.gov', domain: 'whitehouse.gov'}
  const actual = new EmailVerifier().parse(input)
  expect(actual).toEqual(expected)
})
*/
