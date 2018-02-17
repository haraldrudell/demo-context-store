/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EC2Template from './EC2Template'
import Deployer from './Deployer'
import {Stacks} from 'es2049lib'

//import {/*AwsSdk, */StackManager} from 'es2049lib'
//const sdk = new AwsSdk()

//import path from 'path'

export default class Accounter {
  canonicalEc2Owner = '099720109477'

  constructor(o) {
    !o && (o = false)
    this.m = String(o.name || 'Accounter')
    for (let p of Object.keys({deploy: 1, list: 1, render: 1, listdeployable: 1, debug: 1}))
      if (o.hasOwnProperty(p)) this[p] = o[p]
    this.debug && console.log(`${this.m} constructor:`, this, o)
  }

  async run() {
    const {render, listdeployable, deploy, list} = this
    if (render) {
      const id = 'ami-70873908'
      console.log(`Fake id: ${id}`)
      /*
      console.log('Finding image id (7 s)…')
      const {canonicalEc2Owner: owner} = this
      const {id, desc} = await this.getDeployer().getImageId({owner})
      if (!id) throw new Error(`${this.m} failed to find an image`)
      console.log(`image id: ${id} ${desc}`)
      */
     await this.getRenderer().renderTemplate({name: render, imageId: id})
    }
    if (listdeployable) {
      const templates = await this.getRenderer().getRenderedTemplates()
      if (templates.length) for (let {name, fspath} of templates) console.log(`${name} ${fspath}`)
      else console.log('no templates has been rendered. Render using -render option')
    }
    if (deploy) {
      await this.getDeployer().deployStack()
    }
    if (list) {
      const stackNames = await this.getStacks().getStackNames()
      console.log(stackNames.length
        ? stackNames.join(' ')
        : 'No stacks have been deployed. Deploy using -deploy')
    }
    //const s3 = sdk.getService('S3')
    //const buckets = await s3.listBuckets().promise()
    //console.log('Accounter buckets:', buckets)
  }

  getDeployer() {
    return this.deployer || (this.deployer = new Deployer())
  }

  getStacks() {
    return this.stacks || (this.stacks = new Stacks())
  }

  getRenderer() {
    return this.renderer || (this.renderer = new EC2Template())
  }
}
