/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {setMDebug, classLogger, listDir, loadYaml, writeYaml} from 'es2049lib'

import path from 'path'

import fs from 'fs-extra'
import {spawnCapture} from 'allspawn'

export default class GitScanner {
  /*
  git branch --verbose --verbose
  * master 123a9cdf [origin/master: ahead 9] remove workspace directory
  */
  static gitBv = ['git', 'branch', '--verbose', '--verbose']
  static gitBvRegExp = /^[^ ]* ([^ ]*)[^[]*\[([^:\]]*).*$/
  /*
  git remote --verbose
  colors  https://github.com/haraldrudell/colors.git (fetch)
  */
  static gitRemote = ['git', 'remote', '--verbose']
  static gitRemoteRegExp = /^([^ \t]*)( |\t)*([^ ]*).*$/

  constructor(o) {
    const {dir = path.resolve(), yaml} = setMDebug(o, this, 'GitScanner')
    Object.assign(this, {dir, yaml})
    classLogger(this, GitScanner)
  }

  async scan() {
    await this.getYaml()
    await new Promise((resolve, reject) => this.traverse(reject).then(resolve).catch(reject))
    return this.writeYaml()
  }

  async traverse(reject) {
    const {dir, debug} = this
    const include = /\/[.]git$/
    const exclude = /(^|\/)node_modules$/
    const ps = []
    for await (let d of listDir({dir, include, exclude, debug})) ps.push(this.processRepo(path.dirname(d)).catch(reject))
    return Promise.all(ps)
  }

  async processRepo(dir) {
    const [remotes, branch] = await Promise.all([
      this.getRemotes(dir),
      this.getBranch(dir),
    ])
    if (remotes.length || branch) {
      const result = {}
      remotes.length && Object.assign(result, {remotes})
      branch && Object.assign(result, {branch})
      const {yamlData} = this
      const repos = yamlData.repos || (yamlData.repos = {})
      repos[dir] = result
    }
  }

  async getRemotes(cwd) {
    const {gitRemote, gitRemoteRegExp} = GitScanner
    const branchMap = {}
    return (await this.doGit(gitRemote, cwd, gitRemoteRegExp))
      .map(line => {
        const match = line.match(gitRemoteRegExp)
        if (!match) throw new Error(`${this.m} git output parse failed: cmd: '${gitRemote.join('\x20')}' line: '${line}' dir: '${cwd}'`)
        const [, name, , url] = match
        return {name, url}
      }).filter(({name}) => branchMap[name] ? false : (branchMap[name] = true))
  }

  async getBranch(cwd) {
    const {gitBv, gitBvRegExp} = GitScanner
    const lineList = (await this.doGit(gitBv, cwd, gitBvRegExp))
      .filter(line => line.startsWith('*'))
    const match = lineList[0].match(gitBvRegExp)
    if (!match) return
    const [, branch, remote] = match
    return {branch, remote}
  }

  async doGit(args, cwd) {
    const {stdout} = await spawnCapture({args, options: {cwd}})
    return stdout
      ? stdout.split('\n')
      : []
  }

  async getYaml() {
    const {yaml} = this
    const yamlData0 = await fs.pathExists(yaml)
      ? await loadYaml(yaml)
      : undefined
    const yamlData = this.cloneObject(yamlData0)
    Object.assign(this, {yamlData0, yamlData})
  }

  async writeYaml() {
    const {yaml, yamlData0, yamlData} = this
    if (!this.deepEqual(yamlData0, yamlData)) {
      console.log(`Writing: ${yaml}`)
      return writeYaml(yaml, yamlData)
    }
  }

  cloneObject(o) {
    o = {...o}
    for (let [key, value] of Object.entries(o))
      if (typeof value === 'object')
        o[key] = this.cloneObject(value)
    return o
  }

  deepEqual(a, b) {
    return equal(a, b)

    function equal(o1, o2, aList, bList) {
      // either not an object or key-count differs
      if (typeof o1 !== 'object') return o1 === o2
      if (typeof o2 !== 'object' || Object.keys(o1).length !== Object.keys(o2).length) return false
      aList && aList.push(o1) && bList.push(o2) || ((aList = [o1]) && (bList = [o2]))

      // examine properties
      for (let [key, value] of Object.entries(o1)) {
        const v2 = o2[key]

        // either not an object
        if (typeof value !== 'object' || typeof v2 !== 'object')
          if (value === v2) continue
          else return false

        // prevent recursion
        if (aList.includes(value) || bList.includes(v2)) throw new Error(`deepEqual: recursive object reference`)
        if (!equal(value, v2, aList, bList)) return false
      }
      return true
    }
  }
}
