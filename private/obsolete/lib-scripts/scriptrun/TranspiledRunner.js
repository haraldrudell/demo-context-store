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
  async run(args) { // args: [ 'Build', … ], default BABEL_ENV=development
    const scriptName = args[0]
    const scriptBasename = `${scriptName}.js`
    const projectDir = path.join(__dirname, '..')
    const esDir = path.join(projectDir, 'scripts')
    const scriptFile = path.join(esDir, scriptBasename)
    if (!await fs.exists(scriptFile)) throw new Error(`Unknown command ${scriptName}: file does not exist: ${scriptFile}`)

    const transpileDir = path.join(projectDir, 'tmp')
    const transpiledFile = path.join(transpileDir, scriptBasename)
    if (!await fs.exists(transpiledFile)) {
      await this.compile(
      webpackConfigGenerator({
        entry: {[scriptName]: [scriptFile, path.join(__dirname, 'asyncClassRunner')]},
        appBuild: transpileDir,
        appNodeModules: path.resolve(projectDir, 'node_modules'),
        appSrc: esDir,
        nodePath: process.env.NODE_PATH || '',
      }))
    }

    args = [transpiledFile].concat(args.slice(1))
    console.log('spawning:', 'node', args)
    await this.spawn({cmd: 'node', args})
  }

  async spawn({cmd, args, options}) {
    return new Promise((resolve, reject) => spawn(cmd, args, {...options, stdio: 'inherit'})
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
    console.log('compile')
    const stats = await new Promise((resolve, reject) => webpack(config, (err, stats) => !err ? resolve(stats) : reject(err)))
    console.log(stats.toString({colors: true}))
    if (stats.hasErrors()) throw new Error('Webpack errors')
    if (stats.hasWarnings())  throw new Error('Webpack warnings')
  }

  static instantiate(...args) {
    return new TranspiledRunner().run(...args)
  }

  static errorHandler(e) {
    console.error(e instanceof Error && e.message || e)
    process.exit(1)
  }
}

if (typeof require !== 'undefined' && require &&
  typeof module !== 'undefined' && require.main === module)
  TranspiledRunner.instantiate(process.argv.slice(2)).catch(TranspiledRunner.errorHandler)
