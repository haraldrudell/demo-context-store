/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import webpackConfigGenerator from './webpack.config'

import path from 'path'
import fs from 'fs-extra'
import webpack from 'webpack'
import {spawn} from 'child_process'

export default class TranspiledRunner {
  static esFile = 'runscripts'
  static esDir = 'scriptrun'
  static runDir = '../tmp'
  static ext = '.js'
  static node = 'node'

  async run(args) {
    console.log('TranspiledRunner.run')
    const projectDir = process.cwd()
    const entry = TranspiledRunner.esFile
    const filename = `${entry}${TranspiledRunner.ext}`
    const runDir = path.join(projectDir, TranspiledRunner.runDir)
    const transpiledFile = path.join(runDir, filename)

    if (!await fs.exists(transpiledFile)) {
      const esDir = path.join(projectDir, TranspiledRunner.esDir)
      const esFile = path.join(esDir, filename)
      console.log(`TranspiledRunner: transpiling: ${esFile}`)
      await this.compile(
        webpackConfigGenerator({
          entry: {[entry]: esFile},
          appBuild: runDir,
          appNodeModules: path.resolve(projectDir, 'node_modules'),
          appSrc: esDir,
          nodePath: process.env.NODE_PATH || '',
      })).catch(e => this.undoTranspile(e, transpiledFile))
    }

    const cmd = TranspiledRunner.node
    args = [transpiledFile].concat(args)
    console.log(`TranspiledRunner spawning: ${cmd} ${args.join(' ')}`)
    return this.spawn({cmd, args})
  }

  async undoTranspile(e, transpiledFile) {
    await this.removeTranspilation(transpiledFile).catch(e => console.error(e))
    throw e
  }

  async removeTranspilation(transpiledFile) {
    if (await fs.exists(transpiledFile)) {
      console.log(`TranspiledRunner: removing output`)
      await fs.remove(transpiledFile)
    } else console.log(`TranspiledRunner: no output`, transpiledFile)
  }

  async spawn({cmd, args, options}) {
    return new Promise((resolve, reject) => spawn(cmd, args, {stdio: 'inherit', ...options})
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

  async compile(config) {
    const stats = await new Promise((resolve, reject) => webpack(config, (err, stats) => !err ? resolve(stats) : reject(err)))
    console.log(stats.toString({colors: true}))
    if (stats.hasErrors()) throw new Error('Webpack errors')
    if (stats.hasWarnings())  throw new Error('Webpack warnings')
  }
}
