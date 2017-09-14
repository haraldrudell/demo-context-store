/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import spawn from './spawn'

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
  }

  transpilePlugins() {
    const pluginsDir = path.join(this.buildDir, 'babel-plugins')
    const pluginsSrc = path.join(__dirname, '../src/babel-plugins')
    await spawn({cmd: this.babel, args: ['--out-dir', pluginsDir, pluginsSrc], options: {env: {BABEL_ENV: 'plugins'}}})
  }

  transpileBinaries() {
    const binSrc = path.join(__dirname, '../src/binaries')
    await spawn({cmd: this.babel, args: ['--out-dir', this.binDir, binSrc], options: {env: {BABEL_ENV: 'binaries'}}})
  }

  async clean() {
    console.log('build', this.buildDir)
    //await fs.remove(buildDir)
    console.log('bin', this.binDir)
    //await fs.remove(binDir)
  }
}
