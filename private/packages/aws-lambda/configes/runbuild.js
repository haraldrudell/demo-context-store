/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Build from './Build'
import classRunner from 'classrunner'

classRunner({construct: Build, options: loadAllOptions})

async function loadAllOptions() {
  const options = {}
  const lastword = process.argv[process.argv.length - 1]
  const otherword = process.argv[process.argv.length - 2]
  if (lastword === 'j' || otherword ==='j') options.doBuild = true
  if (lastword === 'c') options.doDeploy = true
  return options
}
