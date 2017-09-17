/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Network from './Network'
import Task from './LoggingTask'
import EventMonitor from './EventMonitor'

export default class AvailabilityManager {
  allowedEntries = {defaultRoute: this, gateway: this}

  async run(o, errorHandler) {
    if (!o) o = false
    if (o.file) console.log(`Read: ${o.file}`)

    if (o.ifs) await this.listInterfaces() // debug: list all interfaces

    const profile = this.profile = String(o.profile || '')
    const profileData = o && o.profiles && o.profiles[profile]
    if (!profileData) throw new Error(`Profile not defined: ${profile}`)

    const {list, monitor} = profileData
    const ok = !list || await this.executeList(list)

    let result
    const {cmdName} = o
    if (monitor) result = new EventMonitor({monitor, profile, cmdName, errorHandler})

    if (ok && !monitor) console.log('Completed successfully')
    return result
  }

  async executeList(list) {
    const {profile} = this
    console.log(`${profile}: task count: ${list.length}`)
    const promiseList = await this._launchList(list)
    console.log(`${profile}: task launch complete`)
    const results = await Promise.all(promiseList)
    const counts = results.reduce((r, v) => {
      if (v.isFailure) r.fail++
      else if (v.isSkip) r.skip++
      else r.ok++
      return r
    }, {ok: 0, fail: 0, skip: 0})
    console.log(`${profile}: succeeded: ${counts.ok} skipped: ${counts.skip} failed: ${counts.fail}`)
    return !(counts.fail + counts.skip)
  }

  async _launchList(list) {
    const {profile} = this
    if (!Array.isArray(list)) throw new Error(`${profile}: list key not list: ${typeof list}`)

      // create task objects capable of launching promises
    const tasks = []
    const dependencyResolver = {}
    const network = new Network()
    const {allowedEntries} = network
    for (let [index, entry] of list.entries()) {
      const task = new Task({entry, index, allowedEntries, profile})
      const {printable} = task
      if (dependencyResolver[printable]) throw new Error(`Profile: ${profile} list ${index} duplicate entry: '${printable}'`)
      dependencyResolver[printable] = task
      tasks.push(task)
    }

    // resolve dependencies
    for (let task of tasks) task.resolve(dependencyResolver)

    // launch all
    const promises = []
    for (let task of tasks) promises.push(task.run())
    return promises
  }

  async listInterfaces() {
    const network = new Network()
    const {error, list} = await network.listInterfaces()
    if (error) console.log('listInterfaces.error', error)
    console.log('listInterfaces.list', list)
  }

  errorLogger = e => console.error(e)
}
