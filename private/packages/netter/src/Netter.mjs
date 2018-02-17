/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import NetChecker from './NetChecker'

export default class Netter {
  static optionsList = Object.keys({checkdefault: 1, checkdefaultif: 1, checkdns: 1, dns: 1, startcaptive: 1, stopcaptive: 1, vpnroute: 1, debug: 1})

  constructor(o) {
    !o && (o = false)
    this.m = `${o.name ? `${o.name}.` : ''}Netter`
    for (let option of Netter.optionsList) o[option] && (this[option] = true)
    const {debug} = this
    debug && console.log(`${this.m} constructor:`, this)

    const {check, netChecker} = o
    check && (this.netChecker = new NetChecker({debug, ...netChecker}))
  }

  async run() {
    const ps = []
    if (this.netChecker) ps.push(this.netChecker.check())
    if (this.checkdefault) ps.push(this.checkDefault())
    if (this.checkdefaultif) ps.push(this.checkDefaultIf())
    if (this.checkdns) ps.push(this.checkDns())
    if (this.dns) ps.push(this.restartDns())
    if (this.startcaptive) ps.push(this.startCaptive())
    if (this.stopcaptive) ps.push(this.stopCaptive())
    if (this.vpnroute) ps.push(this.insertDirectVpnRoute())

    /*
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
   return Promise.all(ps)
  }

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
