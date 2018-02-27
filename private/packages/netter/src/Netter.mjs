/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Settler from './Settler'
import DnsChecker from './DnsChecker'
import NetworkChecker from './NetworkChecker'
import InternetChecker from './InternetChecker'
import OvpnChecker from './OvpnChecker'
import Result from './Result'
import RemoteChecker from './RemoteChecker'
import VpnChecker from './VpnChecker'
import PublicIpChecker from './PublicIpChecker'

import {setMDebug, classLogger} from 'es2049lib'

import util from 'util'

export default class Netter {
  static statusCheckFail = 3
  static optionProfiles = {
    check: [
      NetworkChecker,
      {InternetChecker, depends: 'NetworkChecker'},
      {OvpnChecker, depends: 'InternetChecker'},
      {DnsChecker, depends: 'InternetChecker'},
    ],
  }
  static mapTypeToConstructor = {
    NetworkChecker, InternetChecker, OvpnChecker, DnsChecker, // basic-check entries
    RemoteChecker,
    VpnChecker,
    PublicIpChecker,
  }

  constructor(options) {
    const {optionsFileProfile, optionsFileProfiles} = (options = setMDebug(options, this, 'Netter'))
    const receiver = this.receiveResult.bind(this)
    this.settlers = optionsFileProfiles == null ? this._getOptionsSettlers(options, receiver) : this._getYamlSettlers(optionsFileProfile, optionsFileProfiles, receiver)
    classLogger(this, Netter)
  }

  async run() {
    const {settlers, debug} = this
    debug && console.log(`${this.m} executing items: ${settlers && settlers.length}`)
    if (settlers) {
      this.settlers = null
      await Promise.all(settlers.map(settler => settler.run()))
    }
    return this.status
  }

  async receiveResult(result) {
    const {statusCheckFail} = Netter
    if (typeof result === 'string') console.log(result) // progress message
    else if (!(result instanceof Result)) throw new Error(`${this.m} receiver: value not Result`)
    else {
      const {isFailure, message, quiet} = result
      if (!isFailure) {
        !quiet && console.log(message)
      } else {
        this.status = statusCheckFail
        console.log(`${this.m} result: ${util.inspect(result, {colors: true, depth: null})}`)
      }
    }
  }

  _getOptionsSettlers(options, emitter) {
    const {optionProfiles} = Netter
    const {debug} = this
    const settlers = []
    for (let optionName of Object.keys(options)) {
      const profile = optionProfiles[optionName]
      if (profile === undefined) continue
      settlers.push(new Settler({name: optionName, emitter, runners: this._getRunnerDescriptions(profile, `${this.m} option ${optionName}`), debug}))
    }
    return settlers
  }

  /*
  yaml:
  profileName:
  - checkName
    type: ClassName, default checkName
    options: any
    depends: [checkName…]
  */
  _getYamlSettlers(profileNames, profiles, emitter) {
    const {debug} = this
    const settlers = []
    if (profiles == null) throw new Error(`${this.m} profile data not present`)
    if (!Array.isArray(profileNames)) profileNames = [profileNames]
    for (let [index, name] of profileNames.entries()) {
      const tp = typeof name
      if (!name || tp !== 'string') throw new Error(`${this.m} profile name #${index}: not non-empty string: type: ${tp}`)
      settlers.push(new Settler({name, emitter, runners: this._getRunnerDescriptions(profiles[name], `${this.m} profile ${name}`), debug}))
    }
    return settlers
  }

  /*
  values elements:
  checkNamne:string: constructorKey:string
  {checkName:string: {type: constructorKey:string, [options: any, depends: list-of-nestring]}}
  {checkName:function, [options: any, depends: list-of-nestring]}
  checkConstructor:function
  */
  _getRunnerDescriptions(values, mm) {
    const descs = []
    if (!Array.isArray(values)) values = [values]
    for (let [index, value] of values.entries()) {
      const m = `${mm} index#${index}`
      const vt = typeof value
      if (vt === 'string') {

        // checkNamne:string: constructorKey:string
        descs.push({name: value, type: this._mapType(value, m)})
      } else if (vt === 'function') {

        // checkConstructor:function
        const name = value.name || 'function'
        descs.push({name, type: value})
      } else if (vt === 'object') {
        const valueProperties = Object.keys(value)
        const firstProperty = valueProperties[0]
        const firstValue = value[firstProperty]

        // {checkName:string: {type: constructorKey:string, [options: any, depends: list-of-nestring]}}
        if (valueProperties.length === 1 && firstValue) {
          const {type: type0, depends, options} = firstValue
          const type = typeof type0 === 'function' ? type0 : this._mapType(type0 !== undefined ? type0 : firstProperty, m)
          const tt = typeof type
          if (tt !== 'function') throw new Error(`${m} type property missing or not function: type: ${tt}`)
          const desc = {name: String(firstProperty), type, options}
          if (this._getDepends(desc, depends)) throw new Error(`${m} depends:  ${desc.depends}`)
          descs.push(desc)
        } else {

          // {checkName:function, [options: any, depends: list-of-nestring]}
          const {options, depends} = value
          const desc = {options}
          if (this._getDepends(desc, depends)) throw new Error(`${m} depends: ${desc.depends}`)
          for (let property of Object.keys(value).filter(p => p !== 'options' && p !== 'depends')) {
            const type = value[property]
            if (typeof type === 'function') {
              desc.name = property
              desc.type = type
            }
          }
          if (!desc.type) throw new Error(`${m} property with function value missing`)
          descs.push(desc)
        }
      }
    }
    return descs
  }

  _mapType(value, m) {
    const {mapTypeToConstructor} = Netter
    const type = mapTypeToConstructor[value]
    if (!type) throw new Error(`${m} function name not implemented: ${value}`)
    return type
  }

  _getDepends(o, depends) {
    if (depends === undefined) return
    let message
    if (!Array.isArray(depends)) {
      message = this._badNeString(depends)
      depends = [depends]
    } else for (let [index, value] of depends.entries()) {
      if (message = this._badNeString(value)) {
        message = `#${index}: ${message}`
        break
      }
    }
    if (message) return o ? (o.depends = message) : message
    o && depends && (o.depends = depends)
  }

  _badNeString(s) {
    if (s === undefined) return `value: undefined`
    const ts = typeof s
    if (ts !== 'string') return `type: ${ts}`
  }
}
