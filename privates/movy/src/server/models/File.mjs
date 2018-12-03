/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
//import { Model } from 'sequelize'
import Sequelize from 'sequelize'
const { Model } = Sequelize

export default class File extends Model {
 static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      basename: {
        type: DataTypes.STRING, // 'VID_20181124_094358.mp4'
        allowNull: false,
      },
      dir: {
        type: DataTypes.STRING, // '2018-10'
        allowNull: false,
      },
      bytes: {
        type: DataTypes.BIGINT, // 185, file size, beyond 32-bit (4 GiB)
        allowNull: false,
      },
      modified: {
        type: DataTypes.DATE, // date ISO: 24
        allowNull: false,
      },
      birth: DataTypes.DATE,
      md5: DataTypes.STRING, // md5: 32 hexadecimal characters
      sha256: DataTypes.STRING, // sha256: 64 hexadecimal characters
    }, {
      indexes: [{
        fields: ['md5'],
      }, {
        fields: ['sha256'],
      }], sequelize})
    }

  static associate(models) {
    this.videoLink = this.belongsTo(models.Video) // a video has many files
    this.baseDirLink = this.belongsTo(models.BaseDir)
  }

  toString() {
    return `File:${this.basename}:${this.id}`
  }
}
