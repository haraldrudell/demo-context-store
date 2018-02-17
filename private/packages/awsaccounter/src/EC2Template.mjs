/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// TODO 180216 hr refactor to be a parameter file
import TemplateManager from './TemplateManager'

import path from 'path'

export default class EC2Template extends TemplateManager {
  templateFile = path.resolve('config', 'EC2Template.yaml')
  yamlRegExp = /IMAGEID/g

  constructor(o) {
    super({name: 'EC2Template'})
  }

  async render({hostname}) {
    const {templateFile, yamlRegExp} = this
    return this.getRenderedTemplate(templateFile, yamlRegExp, hostname)
  }
}
