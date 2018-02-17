/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EmailVerifier from './EmailVerifier'
import pjson from '../package.json'

import {OptionsParser, launchProcess} from 'es2049options'

const optionsData = {
  properties: {
    print: {
      type: 'true',
    },
    port: {
      type: 'integer',
      min: 1,
      max: 65535,
      hasValue: 'always',
    },
  },
  readYaml: true,
  help: {
    args: 'email@domain.com …',
    description: [
      '  Tests whether email addresses are valid',
    ].join('\n'),
  },
}

launchProcess({run, pjson})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version}).parseOptions(process.argv.slice(2))
  options.debug && OnRejected.setDebug() && console.log(`${name} options:`, options)
  const {args: mailboxes} = options
  delete options.args
  const ev = new EmailVerifier(options)
  return Promise.all([
    ev.start(),
    ev.verify(mailboxes, true).then(ev.shutdown),
  ]).catch(ev.shutdownSafe)
}
