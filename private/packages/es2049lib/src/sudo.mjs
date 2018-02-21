/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {getNonEmptyString, Failure} from './typeVerifiers'

import {spawnAsync} from 'allspawn'
import fs from 'fs-extra'

import path from 'path'

const sudo = 'sudo'

export async function doSudo(o) {
  let {args} = o || false
  if (!Array.isArray(args)) args = [args]
  const cmd = await getAbsolute({file: args[0], shouldExist: true, usePath: true})
  return launchSudo({args: [cmd].concat(args.slice(1))})
}

export async function getAbsolute(o) {
  const {file, usePath, shouldExist} = o || false
  const fileString = getNonEmptyString(file)
  if (fileString instanceof Failure) throw new Error(`getAbsolute file: ${Failure.text}`)

  let absolute, doesExist
  if (path.isAbsolute(fileString)) absolute = fileString
  else if (usePath) {
    for (let p of String(process.env.PATH).split(':')) {
      const a = path.resolve(p, fileString)
      if (await fs.pathExists(a)) {
        absolute = a
        break
      }
    }
    doesExist = !!absolute
    if (!doesExist) absolute = fileString
  } else absolute = path.resolve(fileString)

  if (shouldExist) {
    if (doesExist == null) doesExist = await fs.pathExists(absolute)
    if (!doesExist) throw new Error(`getAbsolute: file does not exist: '${absolute}'`)
  }

  return absolute
}

export async function launchSudo({args}) {
  return spawnAsync({args: [sudo].concat(args), options: {stdio: 'inherit'}, echo: true})
}
