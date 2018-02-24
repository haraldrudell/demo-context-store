/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EmailVerifier from './EmailVerifier'
import pjson from '../package.json'

import {OptionsParser, launchProcess} from 'es2049options'

import util from 'util'

const optionsData = {
  properties: {
    print: {
      help: 'suppress smtp communications',
      type: 'true',
    },
    port: {
      help: 'near port for ssh tunnel',
      type: 'port',
    },
  },
  readYaml: true,
  helpArgs: 'email@domain.com …',
  help: [
    'Tests whether email addresses are valid',
  ].join('\n'),
}

launchProcess({run, name: pjson && pjson.name, version: pjson && pjson.version})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version}).parseOptions(process.argv.slice(2))
  options.debug && OnRejected.setDebug() && console.log(`${name} options: ${util.inspect(options, {colors: true, depth: null})}`)
  const {args: mailboxes} = options
  delete options.args
  const ev = new EmailVerifier(options)
  return Promise.all([
    ev.start(),
    ev.verify(mailboxes, true).then(ev.shutdown),
  ]).catch(ev.shutdownSafe)
}
