/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'
import Sequelize from 'sequelize'

import path from 'path'

import FakeDb from './FakeDb'
import * as models from '../models'
import { getShortHostname } from '../util'

export default class Db extends FakeDb { // TODO 181202: Node.js v11.3: no class properties
  constructor(config) {
    super()
    const {dir, db, dirsBase, dirs, sql} = Object(config)
    this.opts = {dir, db, dirsBase, dirs, sql}
    this.setStatus('up since')
  }

  async init() {
    const {dir, sql, db, dirs} = this.opts
    await fs.ensureDir(dir)

    console.log('Connecting to database…')
    const sequelize = this.sql = new Sequelize(
      sql.database,
      sql.username,
      sql.password,
      {
        dialect: 'sqlite',
        operatorsAliases: Sequelize.Op, // 181202 https://github.com/sequelize/sequelize/issues/8417
        storage: path.join(dir, db),
    })
    await sequelize.authenticate()

    console.log(`Defining models: ${Object.keys(Object(models)).join('\x20')}…`)
    const modelMap = {}
    for (let [name, model] of Object.entries(Object(models))) {
      modelMap[name] = model.init(sequelize, Sequelize)
    }
    for (let model of Object.values(modelMap)) if (model.associate) model.associate(modelMap)
    await sequelize.sync()
    const qi = sequelize.getQueryInterface()
    const r = await qi.addIndex('Files', {
      fields: ['basename', 'dir', 'BaseDirId'],
      unique: true,
    }).catch(e => e)
    console.log('R', r)
    if (r instanceof Error && !r.toString().includes('already exists')) throw r

    console.log('Updating BaseDirs…')
    const host = getShortHostname()
    const {BaseDir} = modelMap
    for (let [name, dir] of Object.entries(dirs)) {
      const [baseDir, didCreate] = await BaseDir.findOrCreate({
        where: {name, host},
        defaults: {name, host, dir},
      })
    }

    return modelMap
  }
}
