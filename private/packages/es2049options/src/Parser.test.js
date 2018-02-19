/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
/*
TODO 180130 hr jest 22.1.4 test can not have .mjs extension https://github.com/facebook/jest/issues/4637
get-around: name tests: .test.js

TODO 180130 hr jest 22.1.4 does not support import https://github.com/facebook/jest/issues/4842
get-around: import from the transpiled CommonJS library
*/
//import OptionsParser from './OptionsParser.mjs'
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

const exportName = 'OptionsParser'
let Parser

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
  Parser = theExport
})

test('instantiate Parser', () => {
  const o = {
    optionsData: {
      properties: {},
    },
    name: 'test:instantiate'
  }
  new Parser(o)
})

test('-debug option and numeralityDescription', () => {
  const o = {
    optionsData: {
      properties: {},
    },
    name: 'test:-debug'
  }
  const expected = {
    numeralityDescription: 'once',
    numeralityCount: 0,
    isHasValueNever: true,
    valueFlagDescription: '',
    names: [ '-debug' ],
    property: 'debug',
    help: 'diagnostic output',
    count: 0,
    props: {}
  }
  const parser = new Parser(o)
  const index = Object(parser.optionIndex)['-debug']
  expect(typeof index).toBe('number')
  const debugOption = parser.optionList[index]
  const actual = {}
  for(let p of Object.keys(expected)) actual[p] = debugOption[p]
  expect(actual).toEqual(expected)
})

test('parse single non-option argument', async () => {
  const arg = 'command-line-argument'
  const o = {
    optionsData: {
      properties: {},
      exit: function mockExit(s) {
        throw new Error(`exit ${s}`)
      },
    },
    name: 'test:-parse-single-argument',
    debug: false,
  }
  const expected = {
    args: [arg]
  }
  const argv = [arg]
  const actual = await new Parser(o).parseOptions(argv)
  expect(actual).toEqual(expected)
})

test('parse boolean option and args numerality', async () => {
  const optionName = '-testBooleanOptionName'
  const prop = optionName.substring(1)
  const o = {
    optionsData: {
      properties: {
        [prop]: {},
      },
      exit: function mockExit(s) {
        throw new Error(`exit ${s}`)
      },
    },
    name: 'test:-single-boolean-option',
    debug: false,
    args: 'none',
  }
  const expectedArgs = {
    isNumeralityNever: true,
    numeralityDescription: 'prohibited',
  }
  const expected = {
    [prop]: true,
  }
  const argv = [optionName]
  const parser = new Parser(o)
  const actualArgs = {}
  for (let p of Object.keys(expectedArgs)) actualArgs[p] = parser[p]
  expect(actualArgs).toEqual(expectedArgs)

  const actual = await parser.parseOptions(argv)
  expect(actual).toEqual(expected)
})

test('parse -help', async () => {
  let i = 0
  const o = {
    optionsData: {
      properties: {},
      exit: function mockExit(s) {
        if (s) throw new Error(`exit ${s}`);
        else i++
      },
    },
    name: 'test:help-option',
  }
  const argv = ['-help']
  await new Parser(o).parseOptions(argv)
  expect(i).toBe(1)
})

test('parse integer 1 and valueFlagDescription', async () => {
  const optionName = '-testInteger'
  const value = 1
  const prop = optionName.substring(1)
  const min = 0
  const max = 10
  const o = {
    optionsData: {
      properties: {
        [prop]: {
          type: 'integer',
          min,
          max,
          hasValue: 'always',
          numerality: 'optionalOnce',
        }
      },
      exit: function mockExit(s) {
        throw new Error(`exit ${s}`)
      },
    },
    name: 'test:-single-integer-option'
  }
  const expectedInt = {
    numeralityDescription: 'once',
    numeralityCount: 0,
    isHasValueAlways: true,
    valueFlagDescription: 'mandatory value',
    names: [optionName],
    property: prop,
    valueName: 'integer',
    count: 0,
    props: {
      min,
      max,
    },
  }
  const expected = {[prop]: value}
  const argv = [optionName, String(value)]

  const parser = new Parser(o)

  const index = Object(parser.optionIndex)[optionName]
  expect(typeof index).toBe('number')
  const intOption = parser.optionList[index]
  const actualInt = {}
  for(let p of Object.keys(expectedInt)) actualInt[p] = intOption[p]
  expect(actualInt).toEqual(expectedInt)

  const actual = await parser.parseOptions(argv)
  expect(actual).toEqual(expected)
})
