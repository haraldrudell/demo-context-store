/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Db from './Db'
import FakeDb from './FakeDb'
import { loadYaml, tildeExpand, arrayOfString } from './yamler'

const appName = 'movy'

let db = new FakeDb()

export async function initDb() {
  return doInit().catch(e => {
    db.setStatus(e)
    throw e
  })
}

const expandProps = Object.keys({dir: 1, db: 1, dirsBase: 1})

async function doInit() {
  const {config} = await loadYaml(appName)
  for (let p of expandProps) tildeExpand(config, p)
  arrayOfString(config.dirs, 'dirs')

  db = new Db(config)
  await db.init()
  db.setStatus('init complete')
}

export function getDb() {
  return db
}

export async function getFiles() {
  return ['a.txt']
}
