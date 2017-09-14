/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'

export default class DependencyChecker {
  async run() {
    const packages = this.getPackageList()
    const failed = []
    for (let pkg of packages) {
      try {
        if (pkg !== 'react-dev-utils') require.resolve(pkg)
        else require('react-dev-utils/eslintFormatter')
      } catch (e) {
        console.log(e)
        failed.push(pkg)
      }
    }
    if (!failed.length) console.log(`Present peer devDependencies: ${packages.join(' ')}`)
    else console.log(`issue command: npm i --save-dev ${failed.join(' ')}`)
  }

  getPackageList() {
    const packageJson = path.join(__dirname, '../package.json')
    const key = 'peerDevDependencies'
    const json = require(packageJson)
    const packages = json.peerDevDependencies
    if (!Array.isArray(packages)) throw new Error(`Key ${key} in file ${packageJson} is not array`)
    return packages
  }
}
