/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// TODO 180216 hr refactor to be a parameter file
import TemplateManager from './TemplateManager'

import path from 'path'
import util from 'util'

export default class EC2Template extends TemplateManager {
  static templateFile = path.resolve('config', 'EC2Template.yaml')
  static rImageId = /IMAGEID/g
  static rAvailabilityZone = /us-west-2a #AVZO/g

  constructor(o) {
    super({name: 'EC2Template', ...o})
    this.debug && this.constructor === EC2Template && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  async renderTemplate({stackName, imageId, availabilityZone}) {
    const {templateFile: filename, rImageId, rAvailabilityZone} = EC2Template
    const patches = [rImageId, imageId]
    availabilityZone && patches.push(rAvailabilityZone, availabilityZone)
    return super.renderTemplate({filename, stackName, patches})
  }
}
