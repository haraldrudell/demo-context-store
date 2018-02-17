/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {getNonEmptyString} from 'es2049lib'

import fs from 'fs-extra'

import path from 'path'

export default class TemplateManager {
  renderDir = '/home/data/salt/'
  renderExt = '.yaml'

  constructor(o) {
    !o && (o = false)
    this.m = String(o.name || 'TemplateRenderer')
    const {debug} = o
    Object.assign(this, {debug})
  }

  async renderTemplate(filename, ...regExpValue) {
    getNonEmptyString(filename, m => `${this.m}.renderTemplate: filename`)
    if (!await fs.pathExists(filename)) throw new Error(`${this.m} template file does not exist: ${filename}`)

    // load yaml

    for (let i = 0; i < regExpValue.length; i += 2) {
      const regExp = regExpValue[i]
      const value = regExpValue[i + 1]
      arg = arg.replace(regExp, value)
    }

    const {renderDir, fileTemplate, fileTemplateRegexp} = this
    await fstat.ensureDir(renderDir)
    // write yaml
    const outfile = path.join(renderDir, fileTemplate.replace(fileTemplateRegexp, render))
    if (await fs.pathExists(outfile)) throw new Error(`${m} file already exists: ${outfile}`)
  }

  async getRenderedTemplates() {
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

  async getTemplate(stackName) {
    const {renderDir, renderExt} = this
    const absolute = path.join(renderDir, stackName + renderExt)
    if (!await fs.pathExists(absolute)) throw new Error(`${m} template does not exist: ${absolute}`)
    return // read yaml
  }
}
