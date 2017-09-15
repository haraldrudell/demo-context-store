/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs-extra'
import path from 'path'
import spawn from '../build/spawn'

run(process.argv.slice(2), errorHandler).catch(errorHandler)

async function run(scriptAndArgsList, errorHandler) {
  const scriptName = scriptAndArgsList[0]
  const scriptFilename = `${scriptName}.js`
  const transpiledFile = path.join(__dirname, '../build', scriptFilename)
  if (!await fs.exists(transpiledFile)) {
    const srcFile = path.join(__dirname, '../scripts', scriptFilename)
    if (!await fs.pathExists(srcFile)) errorHandler(new Error(`Unknown script command: ${scriptName}`), true)
    await transpile({srcFile, transpiledFile})
  }

  const construct = require(transpiledFile).default
  const ct = typeof construct
  if (ct !== 'function') errorHandler(new Error(`Internal error: transpilation of script ${scriptName} at ${transpiledFile} default export not function: ${ct}`), true)
  await new construct({errorHandler}).run({args: scriptAndArgsList.slice(1)})
  console.log(`${scriptName} completed successfully`)
}

async function ensureTranspilation(srcFile, transpiledFile) { // 'Build'
  const exists = await fs.pathExists(transpiledFile)
  let doTranspile = !exists
  if (!doTranspile) {
    const updateTimes = await Promise.all([
      await fs.stat(srcFile),
      await fs.stat(transpiledFile),
    ])
    doTranspile = updateTimes[0].mtimeMs > updateTimes[1].mtimeMs
  }
  if (doTranspile) return transpile(srcFile, transpiledFile)
}

async function transpile({srcFile, transpiledFile}) {
  const babel = path.join(require.resolve('babel-cli'), '../bin/babel.js')
  await spawn({cmd: babel, args: ['--out-file', transpiledFile, srcFile], options: {env: {BABEL_ENV: 'transpile'}}})
}

async function errorHandler(e, controlled) {
  if (!controlled) console.error('cmdline-script.errorhandler:')
  console.error(controlled ? e.message : e)
  if (!controlled) console.error(new Error('errorHandler invocation'))
  process.exit(1)
}
