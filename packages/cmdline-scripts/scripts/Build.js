/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Clean from './Clean'

import path from 'path'
import webpack from 'webpack'
import fs from 'fs-extra'

export default class Build {
  static envKeys = ['BABEL_ENV', 'NODE_ENV']
  static m = 'cmdline-scripts.Build:'

  async run({args}) {
    const m = Build.m
    this.updateEnvironment(args)
    const webpackConfig = this.getWebpackConfig()

    await new Clean().run()
    await this.compile(webpackConfig)
  }

  async compile(config) {
    const stats = await new Promise((resolve, reject) => webpack(config, (err, stats) => !err ? resolve(stats) : reject(err)))
    console.log(stats.toString({colors: true}))
    if (stats.hasErrors()) throw new Error('Webpack errors')
    if (stats.hasWarnings())  throw new Error('Webpack warnings')
  }

  getWebpackConfig() {
    const appDirectory = fs.realpathSync(process.cwd())
    const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
    const consumingProjectPackageJsonFile = resolveApp('package.json')
    const json = require(consumingProjectPackageJsonFile)
    const name = json.singleFile && json.singleFile.name || json.name
    if (!name || typeof name !== 'string') throw new Error(`${m} executable name missing, should be in package.json name or singleFile.name`)
    const entry = json.singleFile && json.singleFile.entry || name
    if (!entry || typeof entry !== 'string') throw new Error(`${m} entry bad in package.json singleFile.entry`)

    const generateWebpackConfig = require('./webpack.config').default
    return generateWebpackConfig({
      appSrc: resolveApp('src'),
      entry: {[name]: path.join(resolveApp('src'), entry)},
      appBuild: resolveApp('build'),
      appNodeModules: resolveApp('node_modules'),
      nodePath: process.env.NODE_PATH || '',
      appBin: resolveApp('bin'),
      appBinExecutable: path.join(resolveApp('bin'), name),
      appBuildJs: path.join(resolveApp('build'), name + '.js'),
    })
  }

  updateEnvironment(args) {
    const {env} = process
    for (let arg of args) {
      let ok = false
      for (let envKey of Build.envKeys)
        if (arg.startsWith(`${envKey}=`)) {
          process.env[envKey] = arg.substring(envKey.length + 1)
          ok = true
          break
        }
      if (!ok) throw new Error(`Build: unknown argument: ${arg}`)
    }
    if (!env.NODE_ENV) env.NODE_ENV = 'development'
    if (!env.BABEL_ENV) env.BABEL_ENV = 'development'
  }
}
