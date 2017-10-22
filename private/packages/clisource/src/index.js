/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import PackageFinder from './PackageFinder'

import classRunner from 'classrunner'

const m = 'clisource'

classRunner({construct: PackageFinder, options: getOptions})

async function getOptions() {
  const {argv} = process
  const command = argv[2]
  if (argv.length !== 3 || !command) throw new Error(`usage: ${m} command\nFinds what package command comes from`)
  return {command, marker: m}
}
