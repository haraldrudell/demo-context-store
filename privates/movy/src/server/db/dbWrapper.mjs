/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Db from './Db'
import FakeDb from './FakeDb'
import { loadYaml } from '../util'
import { parseConfig } from './parseConfig'
import DbLoader from '../dbloader'

const appName = 'movy'

let db = new FakeDb()

export async function initDb() {
  return doInit().catch(e => {
    db.setStatus(e)
    throw e
  })
}

async function doInit() {
  const {config} = await loadYaml(appName)
  const c = parseConfig(config)

  db = new Db(c)
  const models = await db.init()
  db.setStatus('init complete')
  /*
  const {ssh} = c
  return new DbLoader({models, ssh}).load()
    .catch(e => console.error(e) || db.setStatus(`DbLoader error: ${e}`))
    */
}

export function getDb() {
  return db
}

export async function getFiles() {
  return ['a.txt']
}
