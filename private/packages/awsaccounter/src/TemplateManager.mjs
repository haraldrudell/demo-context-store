/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {getNonEmptyString, Failure} from 'es2049lib'

import fs from 'fs-extra'

import path from 'path'
import util from 'util'

export default class TemplateManager {
  renderDir = '/home/data/salt/aws'
  renderExt = '.yaml'
  fileTemplate = 'NAME.yaml'
  fileTemplateRegexp = /NAME/g

  constructor(o) {
    const {name, debug} = o || false
    this.m = String(name || 'TemplateManager')
    debug && (this.debug = true) && this.constructor === TemplateManager && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  async renderTemplate(o) {
    const {filename, stackName, patches} = o || false
    let s
    if ((s = getNonEmptyString(filename) instanceof Failure)) throw new Error(`${this.m}.renderTemplate: filename: ${s.text}`)
    if (!await fs.pathExists(filename)) throw new Error(`${this.m} template file does not exist: ${filename}`)
    let yamlText = await fs.readFile(filename, 'utf8')
    if (Array.isArray(patches)) for (let i = 0; i < patches.length; i += 2) {
      const regExp = patches[i]
      const value = patches[i + 1]
      yamlText = yamlText.replace(regExp, value)
    }

    const {renderDir, fileTemplate, fileTemplateRegexp} = this
    await fs.ensureDir(renderDir)
    const outfile = path.join(renderDir, fileTemplate.replace(fileTemplateRegexp, stackName))
    if (await fs.pathExists(outfile)) throw new Error(`${this.m} file already exists: ${outfile}`)
    return fs.writeFile(outfile, yamlText)
  }

  async getRenderedTemplates() { // /home/data/salt/aws/*.yaml-> [c1, c2, …]
    const templates = []
    const {renderDir, renderExt} = this
    if (await fs.pathExists(renderDir)) {
      for (let file of await fs.readdir(renderDir)) {
        const ext = path.extname(file)
        if (ext === renderExt) {
          templates.push({
            name: file.slice(0, -ext.length),
            fspath: path.join(renderDir, file),
          })
        }
      }
    }
    return templates
  }

  async getTemplateBody(stackName) {
    const {renderDir, renderExt} = this
    const absolute = path.join(renderDir, stackName + renderExt)
    if (!await fs.pathExists(absolute)) throw new Error(`${this.m}: template has not been rendered: ${absolute}`)
    return fs.readFile(absolute, 'utf8')
  }
}
