// TODO 180225 hr future work: captive portal flow
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
class X {
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
