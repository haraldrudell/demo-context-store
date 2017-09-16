/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import packageJson from '../package.json'

import fs from 'fs'
import os from 'os'
import path from 'path'

const dotenv = path.resolve(fs.realpathSync(process.cwd()), '.env')

const NODE_ENV = process.env.NODE_ENV
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  )
}

var dotenvFiles = [
  `${dotenv}.${NODE_ENV}.local`,
  `${dotenv}.${NODE_ENV}`,
  NODE_ENV !== 'test' && `${dotenv}.local`,
  dotenv,
].filter(Boolean)

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv').config({
      path: dotenvFile,
    })
  }
})

const appDirectory = fs.realpathSync(process.cwd())
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

const REACT_APP = /^REACT_APP_/i;

export default function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PUBLIC_URL: publicUrl,
        THE_VERSION: packageJson.version,
        THE_BUILD: new Date().toISOString() + ' ' + os.hostname().replace(/\..*$/, ''),
        THE_NAME: packageJson.singleFile && packageJson.singleFile.name ||
          packageJson.name,
      }
    )
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  }

  return { raw, stringified }
}
