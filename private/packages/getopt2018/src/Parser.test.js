/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// TODO 180130 hr jest 22.1.4 test can not have .mjs extension https://github.com/facebook/jest/issues/4637
// get-around: name tests: .test.js

// TODO 180130 hr jest 22.1.4 does not support import https://github.com/facebook/jest/issues/4842
// get-around: import from the transpiled CommonJS library
//import OptionsParser from './OptionsParser.mjs'
import {OptionsParser} from '../lib/OptionsParser'

test('instantiate OptionsParser', () => {
  const optionsData = {properties: {}}
  const o = {optionsData, name: 'test: instantiate'}
  const op = new OptionsParser(o)
})

test('parse single argument', async () => {
  const arg = 'filename'
  const exit = function mockExit(s) {throw new Error(`exit ${s}`)}
  const optionsData = {properties: {}, exit}
  const o = {optionsData, name: 'test:singleArg'}
  const expected = [arg]
  const argv = [arg]
  const options = await new OptionsParser(o).parseOptions(argv)
  expect(Object(options).args).toEqual(expected)
})

test('parse boolean option', async () => {
  const optionName = '-testBooleanOptionName'
  const prop = optionName.substring(1)
  const exit = function mockExit(s) {throw new Error(`exit ${s}`)}
  const optionsData = {
    properties: {
      [prop]: {
        type: 'boolean',
      }
    },
    exit,
  }
  const o = {optionsData, name: 'test:boolean', debug: false}
  const expected = {[prop]: true}
  const args = [optionName]

  const argv = args.slice()
  const options = await new OptionsParser(o).parseOptions(argv)
  expect(options).toEqual(expected)
})

test('parse -help', async () => {
  let i = 0
  const exit = function mockExit(s) {if (s) throw new Error(`exit ${s}`); else i++}
  const optionsData = {properties: {}, exit}
  const o = {optionsData, name: 'test:help'}
  const argv = ['-help']
  const options = await new OptionsParser(o).parseOptions(argv)
  expect(i).toBe(1)
})

test('parse integer 1', async () => {
  const optionName = '-testInteger'
  const value = 1
  const prop = optionName.substring(1)
  const exit = function mockExit(s) {console.error('mockExit', s); /*throw new Error(`exit ${s}`)*/}
  const optionsData = {
    properties: {
      [prop]: {
        type: 'integer',
        min: 0,
        max: 10,
        hasValue: 'always',
      }
    },
    exit,
  }
  const expected = {[prop]: value}
  const o = {optionsData, name: 'test:integer'}
  const argv = [optionName, String(value)]
  const options = await new OptionsParser(o).parseOptions(argv)
  expect(options).toEqual(expected)
})
