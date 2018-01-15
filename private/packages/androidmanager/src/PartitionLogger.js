/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Logger from './Logger'

export default class PartitionLogger extends Logger {
  static partitionDir = '/dev/block'
  static skip = [
    /^dm-\d+$/, // disk mapper
    'mmcblk0', // root ssd on Nexus 5X
    'zram0', //  some ram disk on Nexus 5X
    'userdata', // the data partition on Nexus 5X
  ]
  writePromise = Promise.resolve()
  pending = {}

  constructor(o) {
    super(Object.assign({stateFile: 'partitions.yaml', name: 'PartitionLogger'}, o))
  }

  async next() {
    await (this.initPromise || (this.initPromise = this.init())) // one at a time
    const {pIndex, partitions} = this
    if (pIndex >= partitions.length) return PartitionLogger.done
    const p = partitions[this.pIndex++]
    return {value: () => this.processPartition(p)}
  }

  async init() {
    // gather partition alias and partitions
    const hasRoot = this.hasRoot = await this.hasSu()
    const [{aliasList, aliases}, {map, partitions, names}, partitionState] = await Promise.all([
      this.getPartitionAliases(),
      this.getPartitions(),
      this.getState(),
    ])
    this.partitionState = partitionState

    this.saveToList('partitionNames', names.join(' '))
    this.saveToList('partitionAlias', aliasList.join(' '), aliases)

    for (let alias of aliases) {
      const {name, file} = alias
      const baseName = file.substring(file.lastIndexOf('/') + 1)
      const partition = map[baseName]
      if (!partition) throw new Error(`${this.m} alias for unknown partition: ${name} file ${file}`)
      partition.use = name // 'boot'
      partition.file = file // '/dev/block/sda17'
      delete map[baseName]
    }
    this.saveToList('noAliasPartitions', Object.keys(map).join(' '))
    for (let partition of Object.values(map)) { // patch up full paths
      partition.file = `${PartitionLogger.partitionDir}/${partition.name}`
    }

    if (this.doWrite) await this.writeState(partitionState)
    this.partitions = hasRoot ? partitions : []
    this.pIndex = 0
  }

  async processPartition({use, file, name}) { // {use: 'boot', file: '/…', name: 'sda17'}
    const {adb, pending} = this
    const printable = use || name

    const {skip} = PartitionLogger
    for (let skipName of skip) {
      if (skipName instanceof RegExp
        ? printable.match(skipName)
        : printable === skipName) return
    }

    pending[printable] = true
    await this.getRoot() // will prompt
    const md5 = await adb.md5sumFar(file, true)
    const md5x = this.getMd5(name)
    if (md5 === md5x) {
      delete pending[printable]
      return
    }

    console.log(`\nUpdated partition: ${this.deviceName} ${use || name} [${Object.keys(pending).join(' ')}].\n`)
    const sha1 = await adb.sha1sumFar(file, true)
    delete pending[printable]

    const data = {name, md5, sha1, seenOn: this.now}
    if (use) data.use = use
    console.log('\n', data, '\n')
    return this.writeChange(data)
  }

  writeChange = async data => this.writePromise.then(() => this.writeChange2(data))

  async writeChange2(data) {
    console.log('\nwc2', data, '\n')
    const {partitionState} = this
    let {PartitionChanges} = partitionState
    if (!Array.isArray(PartitionChanges)) PartitionChanges = partitionState.PartitionChanges = []
    PartitionChanges.unshift(data)
    await this.writeState(partitionState).catch(e => {
      console.log('\nwc2', JSON.stringify(partitionState), '\n')
      throw e
    })
  }

  getMd5(name) {
    const {PartitionChanges} = this.partitionState
    if (!Array.isArray(PartitionChanges)) return
    for (let change of PartitionChanges) {
      if (change.name === name) return change.md5
    }
  }

  saveToList(listName, value, data) {
    const {partitionState, now} = this
    const v0 = partitionState[listName]
    const values = Array.isArray(v0) ? v0 : (partitionState[listName] = [])
    if (value !== Object(values[0]).value) {
      const o = {value, seenOn: now}
      if (data) o.data = data
      values.unshift(o)
      this.doWrite = true
    }
  }

  /*
  aliasList: ['boot', …]
  aliases: [{name: 'boot', file: '/dev/block/sda17'}]
  */
  async getPartitionAliases() {
    const {adb} = this
    const cmd = 'ls -l /dev/block/platform/*/*/by-name'
    let text = await adb.shell(cmd)
    if (text.endsWith('Permission denied')) {
      if (!this.hasRoot) return {aliasList: [], aliases: []}
      await this.getRoot()
      text = await adb.shell(`su 0 ${cmd}`)
    }
    const symlinks = adb.getLines(text)
    const line = symlinks.shift()
    if (!line.startsWith('total')) throw new Error(`${this.m}: bad response from Android: command: '${cmd}' response: '${text}'`)
    const aliasList = []
    for (let [ix, s] of symlinks.entries()) {
      const match = s.match(/ ([^ ]+) -> ([^ ]+)/)
      const name = match && match[1]
      let file = match && match[2]
      if (!name && !file) throw new Error(`${this.m}: failed to parse symlink: #${ix} '${s}'`)
      symlinks[ix] = {name, file}
      aliasList.push(name)
    }
    return {aliasList, aliases: symlinks}
  }

  /*
  map: key: 'ram0' value: object in partitions
  partitions: [{name: 'ram0'}, …]
  names: ['ram0', ...]
  */
  async getPartitions() {
    const {adb} = this
    const cmd = 'cat /proc/partitions'
    const text = await adb.shell(cmd)
    const partitions = text.split('\n')
    let firstLine = partitions.shift()
    let secondLine = partitions.shift()
    if (!firstLine.startsWith('major') || secondLine) throw new Error(`${this.m}: bad response from Android: command: '${cmd}' response: '${text}'`)
    const map = {}
    const names = []
    for (let [ix, s] of partitions.entries()) {
      const name = s.substring(s.lastIndexOf(' ') + 1)
      const o = {name}
      partitions[ix] = map[name] = o
      names.push(name)
    }
    return {map, partitions, names}
  }
}
