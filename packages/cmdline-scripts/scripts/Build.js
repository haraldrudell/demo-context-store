/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import spawn from 'spawn-async'
import Clean from './Clean'

import path from 'path'
import fs from 'fs-extra'

console.log('Build parse')

export default class Build {
  async run() {
    console.log('Build.run')
    await new Clean().run()

    this.babel = path.join(require.resolve('babel-cli'), '../bin/babel.js')
    console.log('bef')
    await this.transpilePlugins()
    console.log('bef9re')
    await this.transpileCrossSpawn()
    console.log('after')
    await Promise.all([
      this.transpileBinaries(),
      this.transpileScripts(),
      this.transpileWebpackConfig(),
    ])
    console.log('Build complete.')
  }

  async transpilePlugins() {
    const pluginsDir = path.join(this.buildDir, 'babel-plugins')
    const pluginsSrc = path.join(__dirname, '../src/babel-plugins')
    return spawn({cmd: this.babel, args: ['--out-dir', pluginsDir, pluginsSrc], options: {env: {BABEL_ENV: 'plugins'}}})
  }

  async transpileBinaries() {
    const binSrc = path.join(__dirname, '../src/binaries')
    return spawn({cmd: this.babel, args: ['--out-dir', this.binDir, binSrc], options: {env: {BABEL_ENV: 'binaries'}}})
  }

  async transpileScripts() {
    const scriptsSrc = path.join(__dirname, '../scripts')
    return spawn({cmd: this.babel, args: ['--out-dir', this.buildDir, scriptsSrc], options: {env: {BABEL_ENV: 'production'}}})
  }

  async transpileWebpackConfig() {
    const webpackSrc = path.join(__dirname, '../config')
    return spawn({cmd: this.babel, args: ['--out-dir', this.buildDir, webpackSrc], options: {env: {BABEL_ENV: 'production'}}})
  }

  async transpileCrossSpawn() {
    const outfile = path.join(this.buildDir, 'spawn.js')
    return spawn({cmd: this.babel, args: ['--out-file', outfile, require.resolve('spawn-async')], options: {env: {BABEL_ENV: 'production'}}})
  }
}
