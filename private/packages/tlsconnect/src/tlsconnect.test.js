/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {exec} from 'child_process'
import path from 'path'
import pjson from '../package.json'

test('Executable should run command-line', async () => {
  const packageName = pjson.name

  const absolute = path.resolve('bin', packageName) // TODO fetch from package.json
  const command = `"${absolute}" --help`

  const {error, stdout, stderr} = await new Promise((resolve, reject) =>
    exec(command, (error, stdout, stderr) => resolve({error, stdout, stderr})))

  if (error) throw error
  expect(stderr).toBe('')
  expect(stdout).toMatch(new RegExp(`^${packageName}`))
})
