/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import AvailabilityManager from './AvailabilityManager'
import instantiate from 'asyncprocess'

import commander from 'commander'

const aSerial = '4e536167'
commander
  .option('--serial [serial]', `Android device serial, default all`)
  .parse(process.argv)

instantiate({
  construct: AvailabilityManager,
  async: 'run',
  asyncArg: {serial: commander.serial},
})
