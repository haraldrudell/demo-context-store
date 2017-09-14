/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import spawn from './spawn'
import instantiate from './Process'

import path from 'path'
import fs from 'fs-extra'

export default class Build {
  async run() {
    this.buildDir = path.join(__dirname, '../build')
    this.binDir = path.join(__dirname, '../bin')
    await this.clean()
    this.babel = path.join(require.resolve('babel-cli'), '../bin/babel.js')
    await this.transpilePlugins()
    await this.transpileBinaries()
    await this.transpileScripts()
    await this.transpileWebpackConfig()
  }

  async transpilePlugins() {
    const pluginsDir = path.join(this.buildDir, 'babel-plugins')
    const pluginsSrc = path.join(__dirname, '../src/babel-plugins')
    await spawn({cmd: this.babel, args: ['--out-dir', pluginsDir, pluginsSrc], options: {env: {BABEL_ENV: 'plugins'}}})
  }

  async transpileBinaries() {
    const binSrc = path.join(__dirname, '../src/binaries')
    await spawn({cmd: this.babel, args: ['--out-dir', this.binDir, binSrc], options: {env: {BABEL_ENV: 'binaries'}}})
  }

  async transpileScripts() {
    const scriptsSrc = path.join(__dirname, '../scripts')
    await spawn({cmd: this.babel, args: ['--out-dir', this.buildDir, scriptsSrc], options: {env: {BABEL_ENV: 'production'}}})
  }

  async transpileWebpackConfig() {
    const webpackSrc = path.join(__dirname, '../config')
    await spawn({cmd: this.babel, args: ['--out-dir', this.buildDir, webpackSrc], options: {env: {BABEL_ENV: 'production'}}})
  }

  async clean() {
    await fs.remove(this.buildDir)
    await fs.remove(this.binDir)
  }
}

instantiate({
  construct: Build,
  async: 'run',
  require: typeof require !== 'undefined' && require,
  module: typeof module !== 'undefined' && module,
})
