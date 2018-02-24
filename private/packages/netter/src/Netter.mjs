/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Settler from './Settler'
import DnsChecker from './DnsChecker'
import NetworkChecker from './NetworkChecker'
import InternetChecker from './InternetChecker'
import OvpnChecker from './OvpnChecker'

import {setMDebug} from 'es2049lib'

import util from 'util'

export default class Netter {
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
  }

  constructor(options) {
    const {optionsFileProfile, optionsFileProfiles, debug} = (options = setMDebug(options, this, 'Netter'))
    const receiver = this.receiver.bind(this)
    this.settlers = optionsFileProfiles == null ? this._getOptionsSettlers(options, receiver) : this._getYamlSettlers(optionsFileProfile, optionsFileProfiles, receiver)
    debug && this.constructor === Netter && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  async run() {
    const {settlers, debug} = this
    debug && console.log(`${this.m} executing items: ${settlers && settlers.length}`)
    if (settlers) {
      this.settlers = null
      return Promise.all(settlers.map(settler => settler.run()))
    }
  }

  async receiver(result) {
    const {isFailure, message, quiet} = result
    if (!isFailure) {
      !quiet && console.log(message)
    } else console.log(`${this.m} result: ${util.inspect(result, {colors: true, depth: null})}`)
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
        if (valueProperties.length === 1 && typeof firstValue === 'object') {
          const {type0, depends, options} = firstValue
          const type = type0 || this._mapType(firstProperty, m)
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

  /*
    const {netChecker, optionsFileProfile, options} = this
    if (netChecker) return netChecker.check()
    const fileprofiles = Array.isArray
    const profiles = [options, ]
    const ps = []
    if (this.netChecker) ps.push(this.)
    if (this.checkdefault) ps.push(this.checkDefault())
    if (this.checkdefaultif) ps.push(this.checkDefaultIf())
    if (this.checkdns) ps.push(this.checkDns())
    if (this.dns) ps.push(this.restartDns())
    if (this.startcaptive) ps.push(this.startCaptive())
    if (this.stopcaptive) ps.push(this.stopCaptive())
    if (this.vpnroute) ps.push(this.insertDirectVpnRoute())

  --vpnroute
  insert vpn direct route
  ip r add 104.156.228.82 via 10.1.0.1
  systemd-resolve --status

  --startcaptive
  sudo --group=foxyboycaptive firefox
  - allow vpn outbound
  iptables --table mangle --list-rules | grep --regexp="-N WLP3S0_FWRIN"
  iptables --wait 5 --table mangle --new-chain WLP3S0_FWRIN
  DROP all incoming that is not RELATED,ESTABLISHED
  DROP all outgoing that is not group foxyboycaptive
  like foxyboycode
  - shutdown vpn
  launch browser with group foxyboycaptive

  --stopcaptive
  verify Internet
  start vpn
  systemctl start openvpn@piac89
  - remove DROP routes

  --dns
  restart dnscrypt
  systemctl restart dnscrypt-proxy

  --checkdefaultif
  # if not root, it silently fails
  nping --interface wlp3s0 --tcp-connect --count 1 --dest-port 443 8.8.8.8
  --checkdefault
  nping --tcp-connect --count 1 --dest-port 443 8.8.8.8
  --checkdns
  */

  /*
  yaml format:
  profiles:
    profile1:
    - PingName:
      type: string: PingConstructor, default name
      depends: [string: names…]
      options: …

  code domain:
  this.profiles is a list of Settler objects
  Each settler has a list of instantiated objects corresponding to the names in the yaml profile
  The settler has assembled a dependency tree so that each run function is fed the Result objects of its dependencies
  profile object: {name: nestring, type: fn, options: any, depends: [nestring]}
  */

  startCaptive() {
    console.log(`${this.m} `)
  }

  stopCaptive() {
    console.log(`${this.m} `)

  }

  async checkDefault() {
    console.log(`${this.m} checkDefault NIMP`)
  }

  async checkDefaultIf() {
    console.log(`${this.m} checkDefaultIf NIMP`)
  }

  async checkDns() {
    //const domain = `d${Date.now()}.`
    // TODO Node.js resolver
    console.log(`${this.m} checkDns NIMP`)
  }

  async restartDns() {
    console.log(`${this.m} restartDns NIMP`)
  }

  async insertDirectVpnRoute() {
    console.log(`${this.m} checkDns NIMP`)
  }
}
