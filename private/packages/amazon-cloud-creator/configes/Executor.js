/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import getPaths, {getProjectId} from './paths'
import Builder from './Builder'
import S3Deployer from './S3Deployer'
import StackDeleter from './StackDeleter'
import StackCreator from './StackCreator'

import fs from 'fs-extra'

export default class Executor {
  async run(o) {
    if (!o) o = false
    const parms = await this.getProjectParameters()

    let promises = []
    if (o.build) promises.push(new Builder().build(parms))
    if (o.createBucket) promises.push(new StackCreator(parms.s3Stack).run())

    if (o.deploy && await Promise.all(promises)) promises = [new S3Deployer().deploy(parms)]
    await Promise.all(promises)

    if (o.createStack) await new StackCreator(parms.stack).run()
    if (o.deleteStack) await new StackDeleter(parms.stack).run()
    if (o.deleteBucket) await new StackDeleter(parms.s3Stack).run()
  }

  async getProjectParameters() {
    const paths = await getPaths(await getProjectId(false)) // ensure there is a project id
    const templateFile = paths.stack.templateFile
    if (!await fs.pathExists(templateFile)) {
      const {templateFile: t, templateMarker} = paths.stackTemplate
      const yaml = await fs.readFile(t, 'utf8')
      const regExp = new RegExp(templateMarker, 'g')
      const {functionName} = paths
      await fs.writeFile(templateFile, yaml.replace(regExp, functionName))
    }

    return paths
  }
}
