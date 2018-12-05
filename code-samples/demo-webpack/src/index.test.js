/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'

import path from 'path'

import pjson from '../package.json'

const defaults = {
  cjsExt: '.js',
  esmExt: '.js',
}

let {main} = Object(pjson)
if (!main || typeof main !== 'string') throw new Error('package.json main not non-empty string')
main = path.resolve(main)
if (!path.extname(main)) main += defaults.cjsExt

let exportObject

it('Build successful', async () => {
  if (!await fs.pathExists(main)) throw new Error(`Cjs executable not found, has yarn build been run? '${main}'`)
  exportObject = require(main)
  expect(typeof exportObject).toBe('object')
  console.log(exportObject)
})
