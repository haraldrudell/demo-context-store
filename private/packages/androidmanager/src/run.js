import AndroidManager from './AndroidManager'
import instantiate from './Process'

import commander from 'commander'

const aSerial = '4e536167'
commander
  .option('--serial [serial]', `Android device serial, default all`)
  .parse(process.argv)

instantiate({
  construct: AndroidManager,
  async: 'run',
  asyncArg: {serial: commander.serial},
})
