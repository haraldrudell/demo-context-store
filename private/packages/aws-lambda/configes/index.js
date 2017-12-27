/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Executor from './Executor'

import classRunner from 'classrunner'

import path from 'path'

const mapCommandToOption = {
  build: 'build',
  deploy: 'deploy',
  createBucket: 'createBucket',
  deleteBucket: 'deleteBucket',
  createStack: 'createStack',
  deleteStack: 'deleteStack',
}
const m = 'config/index.js'

classRunner(getOptions)

async function getOptions() {
  const executorOptions = {}
  const classOptions = {
    construct: Executor,
    options: executorOptions,
    debug: false,
  }

  // package.json scripts build: nmrun babel-node configes/runbuild build
  // process.argv: node …configes build
  const args = process.argv.slice(2)
  for (let arg of args) {
    const option = mapCommandToOption[arg]
    if (!option) throw new Error(`${m} unknown command: '${arg}'`)
    executorOptions[option] = true
  }

  return classOptions
}
