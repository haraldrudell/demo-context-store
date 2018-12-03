/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import path from 'path'
import os from 'os'
import Db from './Db'

const config = {
  dir: path.join(os.homedir(), '.local', 'share', 'movy'),
  db: 'movy.db',
  dirsBase: path.join('/', 'x', 'tostorage'),
  dirs: [
    'mobile_media',
    'mobile_media-0',
  ],
}

let db

export async function initDb() {
  db = new Db(config)
  return db.init()
}

export function getDb() {
  return db
}

export async function getFiles() {
  return ['a.txt']
}
