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
      help: 'render a stack of current Ubuntu EC2 instance',
      valueName: 'stackName',
    },
    'list-deployable': {
      property: 'listdeployable',
      help: 'list rendered stacks.\nRendered stack may be deployed to Amazon',
    },
    deploy: {
      type: 'nestring',
      valueName: 'stackName',
    },
    del: {
      type: 'string',
      hasValue: 'may',
      valueName: 'stackName',
    },
    'id': {
      type: 'nestring',
      valueName: 'stackId',
    },
    up: {
      type: 'nestring',
      valueName: 'stackName',
    },
    list: {help: 'list stacks deployed with Amazon'},
    cachedid: {help: 'use cached imageId for -render, saves 7 s'},
    codename: {help: 'Ubuntu codename, default artful'},
  },
  readYaml: true,
  args: 'none',
}

launchProcess({run, name: pjson && pjson.name, version: pjson && pjson.version})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version}).parseOptions(process.argv.slice(2))
  options.debug && OnRejected.setDebug() && console.log(`${name} options:`, options)
  return new Accounter(options).run()
}
