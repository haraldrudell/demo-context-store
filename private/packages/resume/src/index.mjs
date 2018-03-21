/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EntryCreator from './EntryCreator'
import pjson from '../package.json'

import util from 'util'

import {OptionsParser, launchProcess, numeralities} from 'es2049options'

const optionsData = {
  properties: {
    company: {help: 'Company name like Acme, Inc', type: 'nestring'},
    resume: {help: 'resume filename', type: 'filename'},
    cover: {help: 'cover letter filename', type: 'filename'},
    text: {help: 'text reference for resume used', type: 'nestring'},
    directory: {help: 'base resume directory', type: 'filename'},
  },
  readYaml: true,
  args: numeralities.none,
}

launchProcess({run, name: pjson && pjson.name, version: pjson && pjson.version})

async function run({name, version, OnRejected}) {
  const options = await new OptionsParser({optionsData, name, version}).parseOptions(process.argv.slice(2))
  options.debug && OnRejected.setDebug() && console.log(`${name} options: ${util.inspect(options, {colors: true, depth: null})}`)
  return new EntryCreator(options).run()
}
