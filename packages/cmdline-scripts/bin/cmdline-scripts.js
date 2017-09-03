#!/usr/bin/env node
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the ISC-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * Node.js 8.0 ECMAScript
 * - no: import
 */
const fs = require('fs-extra')
const path = require('path')
const crossSpawn = require('cross-spawn')

console.log(__filename)
run(process.argv.slice(2)).catch(errorHandler).catch(console.error)

async function run(argv) {
  const script = argv[0]
  const absScript = await ensureTranspilation(script)
  await spawn('node', [absScript].concat(argv.slice(1)))
  console.log(`${script} completed successfully`)
}

async function spawn (cmd, args) {
  return new Promise((resolve, reject) => crossSpawn(cmd, args, {stdio: 'inherit'})
    .once('close', (status, signal) => {
      if (status === 0 && !signal) resolve(status)
      else {
        let msg = `status code: ${status}`
        if (signal) msg += ` signal: ${signal}`
        msg += ` '${cmd} ${args.join(' ')}'`
        reject(new Error(msg))
      }
    }).on('error', reject)
  )
}

async function ensureTranspilation(script) {
  script = script + '.js'
  const es = path.join(__dirname, '../src', script)
  const js = path.join(__dirname, '../build', script)
  const exists = await fs.pathExists(js)
  let doTranspile = !exists
  if (!doTranspile) {
    const updateTimes = await Promise.all([
      await fs.stat(es),
      await fs.stat(js),
    ])
    doTranspile = updateTimes[0].mtimeMs > updateTimes[1].mtimeMs
  }
  if (doTranspile) await spawn('babel-node', path.join(__dirname, '../Transpiler/transpile'), [es, js])
  return js
}

async function errorHandler(e) {
  console.error('cmdline-script.errorhandler:')
  console.error(e)
  console.error(new Error('errorHandler invocation'))
  process.exit(1)
}
