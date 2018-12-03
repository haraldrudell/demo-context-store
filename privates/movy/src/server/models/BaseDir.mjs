/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
//import { Model } from 'sequelize'
import Sequelize from 'sequelize'
const { Model } = Sequelize

import { getShortHostname } from '../util'

export default class BaseDir extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING, // 'mobile_media'
      },
      host: DataTypes.STRING, // 'c87'
      dir: DataTypes.STRING, // '/x/tostorage/mobile_media'
    }, {
      indexes: [{
        unique: true,
        fields: ['name', 'host'],
      }], sequelize})
  }

  static async getHostDirs() {
    const host = getShortHostname()
    return BaseDir.findAll({where: {host}})
  }

  toString() {
    return `BaseDir:${this.host}:${this.name}`
  }
}
