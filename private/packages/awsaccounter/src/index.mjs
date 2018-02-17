/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Accounter from './Accounter'
import pjson from '../package.json'

import {OptionsParser, launchProcess} from 'es2049options'

const optionsData = {
  properties: {
    render: {
      type: 'nestring',
    },
    listdeployable: {},
    deploy: {},
    list: {},
  },
  readYaml: true,
  args: 'none',
/*
  help: {
    args: 'email@domain.com …',
    description: [
      '  Tests whether email addresses are valid',
    ].join('\n'),
  },
*/
}

launchProcess({run, pjson})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version}).parseOptions(process.argv.slice(2))
  options.debug && OnRejected.setDebug() && console.log(`${name} options:`, options)
  return new Accounter(options).run()
}
