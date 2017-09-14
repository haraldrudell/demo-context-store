/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/

export default class Start {
  async run() {
    console.log('Start.run')
  }

  doWebpack = config => new Promise((resolve, reject) => webpack(config, (err, status) => {
    if (!err) {
      if (status.hasErrors()) err = new Error('webpack errors')
      if (status.hasWarnings()) err = new Error('webpack waringns')
      console.log(status.toString())
    }
    if (!err) resolve(status)
    else reject(err)
  }))
}
