/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
const optionsSet = {
  '-debug': 'debug',
  '-state': 'doState',
  '-parts': 'doPartitions',
  '-data': 'doUserData',
}

const optionsClear = {
  '-no-apk': 'doApk',
}

export default function parseOptions({argv, name, version}) {
  function exit(message, statusCode = 2) {
    const logFn = statusCode ? console.error : console.log
    message && logFn(message)
    logFn([
      `${name} [options]`,
      `    version: ${version}`,
      '  Collects data from Android devices via adb',
      '  -serial n  interact with particular devices, default all, may be provided multiple times',
      '  -no-apk  do not copy apk from devices',
      '  -state',
      '  -parts',
      '  -data',
      '  -help  display usage',
      '  -debug  provide diagnostic information',
    ].join('\n'))
    process.exit(statusCode)
  }

  const options = {}
  for (let p of Object.values(optionsClear)) options[p] = true

  for (let i = 0, arg = argv[i]; i < argv.length; arg = argv[++i]) {
    const prop = optionsSet[arg]
    if (prop) {
      options[prop] = true
      continue
    }
    const p2 = optionsClear[arg]
    if (p2) {
      delete options[p2]
      continue
    } else switch (arg) {
    case '-h':
    case '-help':
    case '--help':
      exit('', 0)
      // eslint-disable-line no-fallthrough
    case '-serial':
      const aSerial = argv[++i]
      if (aSerial) {
        const {serials} = options
        if (!Array.isArray(serials)) options.serials = serials === undefined ? aSerial : [serials, aSerial]
        else serials.push(aSerial)
        break
      }
      exit(`Missing serial value'\n`)
      // eslint-disable-line no-fallthrough
    default:
      exit(`Unknown option: '${arg}'\n`)
    }
  }
  return options
}
