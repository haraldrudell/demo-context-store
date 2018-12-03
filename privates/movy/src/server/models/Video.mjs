/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
//import { Model } from 'sequelize'
import Sequelize from 'sequelize'
const { Model } = Sequelize

export default class Video extends Model {
 static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      description: DataTypes.STRING, // 'bad guy'
      start: {
        type: DataTypes.DATE, // begin recording
        allowNull: false,
      },
      dur: {
        type: DataTypes.INTEGER, // duration in s.
      },
    }, {
      indexes: [{
        fields: ['start'],
      }], sequelize})
  }

  toString() {
    return `Video:${this.start}:${this.id}`
  }
}
