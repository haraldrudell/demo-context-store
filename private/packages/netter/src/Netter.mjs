/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Settler from './Settler'
import DnsChecker from './DnsChecker'
import NetworkChecker from './NetworkChecker'
import InternetChecker from './InternetChecker'
import OvpnChecker from './OvpnChecker'

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
    NetworkChecker,
  }

  constructor(options) {
    const {name, debug, optionsFileProfile, optionsFileProfiles} = (options = Object(options))
    this.m = String(name || 'Netter')
    debug && (this.debug = true)
    const receiver = this.receiver.bind(this)
    this.settlers = this._getOptionsSettlers(options, receiver).concat(this._getYamlSettlers(optionsFileProfiles, optionsFileProfile, receiver))
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
    if (profileNames === undefined) return settlers
    if (!Array.isArray(profileNames)) profileNames = [profileNames]
    if (profiles == null) throw new Error(`${this.m} profile data not present`)
    for (let [index, name] of profileNames.entries()) {
      const tp = typeof name
      if (!name || tp !== 'string') throw new Error(`${this.m} profile name #${index}: not non-empty string: type: ${tp}`)
      settlers.push({name, emitter, runners: this._getRunnerDescriptions(profiles[name], `${this.m} profile ${name}`), debug})
    }
    return settlers
  }

  /*
  string: constructor-key
  {name: {type: string constructor-key-default-name, options: any, depends: list of nestring}}
  {some-string: function-value, options: any, depends: list of string}
  function: constructor
  */
  _getRunnerDescriptions(values, m) {
    const {mapTypeToConstructor} = Netter
    const descs = []
    if (!Array.isArray(values)) values = [values]
    for (let value of values) {
      const vt = typeof value
      if (vt === 'string') {
        const type = mapTypeToConstructor[value]
        if (!type) throw new Error(`${m} function name not implemented: ${value}`)
        descs.push({name: value, type})
      } else if (vt === 'function') {
        const name = value.name || 'function'
        descs.push({name, type: value})
      } else if (vt === 'object') {
        const props = Object.keys(value)
        const props1 = props[0]
        const val1 = value[props1]
        if (props.length === 1 && typeof val1 === 'object') descs.push({name: String(props1), type: val1})
        else {
          const desc = {}
          for (let [prop, val] of Object.entries(value)) {
            if (prop === 'options') desc.options = val
            else if (prop === 'depends') desc.depends = Array.isArray(val) ? val : [val]
            else if (typeof val === 'function') {
              desc.name = prop
              desc.type = val
            }
          }
          descs.push(desc)
        }
      }
    }
    return descs
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
