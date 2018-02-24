/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EC2Template from './EC2Template'
import {StackManager, ImageManager} from 'awslib'
import {setMDebug} from 'es2049lib'

import util from 'util'

export default class Accounter {
  static codename0 = 'artful'
  static imageId0 = 'ami-70873908'
  static searchS = 7
  static opts = Object.keys({deploy: 1, list: 1, render: 1, listdeployable: 1, debug: 1, cachedid: 1, codename: 1, id: 1, del: 1, up: 1})

  constructor(o) {
    const {debug} = setMDebug(o, this, 'Accounter')
    const {opts} = Accounter
    for (let p of opts) if (o.hasOwnProperty(p)) this[p] = o[p]
    debug && this.constructor === Accounter && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
    }

  async run() {
    const {codename0, imageId0, searchS} = Accounter
    const {render, listdeployable, deploy, list, codename = codename0, cachedid, debug, del, id, up} = this

    if (render) {
      const stackName = render
      let o
      if (cachedid) o = {imageId: imageId0}
      else {
        console.log(`Finding image id (${searchS} s)…`)
        o = await new ImageManager({debug}).getUbuntuImageId({codename})
      }
      const {imageId, desc} = o
      if (imageId) console.log(`image id: ${imageId}${desc ? ` ${desc}` : ''}`)
      else throw new Error(`${this.m} failed to find an image`)
      await new EC2Template({debug}).renderTemplate({stackName, imageId})
    }

    if (listdeployable) {
      const templates = await new EC2Template({debug}).getRenderedTemplates()
      if (templates.length) for (let {name, fspath} of templates) console.log(`${name} ${fspath}`)
      else console.log('no templates has been rendered. Render using -render option')
    }

    if (deploy != null) {
      const stackName = deploy
      const stackId = id
      const templateBody = await new EC2Template({debug}).getTemplateBody(stackName)
      await new StackManager({stackName, stackId, debug}).create({templateBody})
    }

    if (up != null) {
      const stackName = up
      const stackId = id
      const templateBody = await new EC2Template({debug}).getTemplateBody(stackName)
      await new StackManager({stackName, stackId, debug}).update({templateBody})
    }

    if (list) {
      const stacks = await new StackManager({debug}).getStackNames()
      console.log(stacks.length
        ? stacks.map(({stackName, stackId, stackStatus}) => `${stackName} ${stackId} ${stackStatus}`).join('\n')
        : 'No stacks have been deployed. Deploy using -deploy')
    }

    if (del != null) {
      const stackName = del
      const stackId = id
      await new StackManager({stackName, stackId, debug}).delete()
    }
  }
}
