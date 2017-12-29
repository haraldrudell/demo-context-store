/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import SshTunnel from './SshTunnel'
import SMTPVerifier from './SMTPVerifier';

import parser from 'email-addresses'
import dns from 'dns'

export default class EmailVerifier {
  timeout = 1e3
  retryTime = 1e2

  constructor(o) {
    const {debug, ssh, name: m = 'EmailVerifier', port} = o || false
    Object.assign(this, {debug, m, ssh, port})
  }

  async verify(mailboxes) { // can only be invoked one at a time
    if (!Array.isArray(mailboxes)) mailboxes = Array.from(mailboxes)
    this.emails = mailboxes.map((email, ix) => this.parse(email, ix))
    await this._verifyNext().catch(e => this.ensureShutdown(e))
    this.debug && console.log('EmailVerifier.verify completed successfully.')
  }

  async _verifyNext() {
    const {emails, debug} = this
    let {sshTunnel} = this
    const email = emails.shift()
    if (email) {
      const {ssh, domain0} = this
      const {address, domain} = email
      debug && console.log('Resolving dns…')
      const {ip, mxDnsName} = await this.getMxIp(domain)
      debug && console.log(`Mailbox domain: ${domain} MX host: ${mxDnsName} MX ip: ${ip}`)
      const changeTunnel = ssh && domain !== domain0
      if (changeTunnel) {
        sshTunnel && await sshTunnel.disconnect()
        this.domain0 = domain
        debug && console.log(`setting up ssh tunnel from locahost to intermediate server…`)
        sshTunnel = this.sshTunnel = new SshTunnel(ssh.replace(/DOMAIN/g, ip))
      }
      const sshPromise = changeTunnel && sshTunnel.setupSsh(true)

      return Promise.all([
        sshPromise,
        this._verify({address, domain, mxDnsName, ip}),
      ])
    } else if (sshTunnel) {
      debug && console.log(`terminating ssh forwarding`)
      sshTunnel.disconnect()
    }
  }

  async _verify({address, domain, mxDnsName, ip}) {
    const {sshTunnel, timeout, retryTime, debug, port: nearSshPort} = this
    const port = sshTunnel ? nearSshPort : 25
    const host = sshTunnel ? '127.0.0.1' : domain
    if (sshTunnel) {
      debug && console.log('Waiting for ssh tunnel…')
      await sshTunnel.ready({host, port, timeout, retryTime})
    }
    debug && console.log('Connecting to mail server…')
    const result = await new SMTPVerifier({smtp: {host, port}, mxDnsName, debug}).verify(address)
    if (!Array.isArray(result)) throw new Error(`{this.m} Email verification failed: ${result}`)
    for (let {email, response} of result) console.log(`Mailbox: ${email} Response: ${response}`)
    return this._verifyNext()
  }

  async ensureShutdown(e) {
    const {sshTunnel} = this
    if (sshTunnel) await sshTunnel.disconnect().catch(e1 => console.error(e1))
    throw e
  }

  async getMxIp(domain) {
    const records = await new Promise((resolve, reject) => dns.resolveMx(domain,
      (err, recs) => !err ? resolve(recs) : reject(err)))
      let {exchange} = records.reduce((a, v) => a.priority < v.priority ? a : v)
    if (!exchange) throw new Error(`${this.m}: No mail exchanger found for domain: ${domain}`)
    const ads = await new Promise((resolve, reject) => dns.resolve4(exchange,
      (err, addrs) => !err ? resolve(addrs) : reject(err)))
    const ip = ads[0]
    return {ip, mxDnsName: exchange}
  }

  parse(email, ix) {
    if (!email || typeof email !== 'string') throw new Error(`${this.m} mailbox argument #${ix + 1} not non-empty string`)
    const {addresses} = parser(email) //{ast, addresses[{parts, type, name, address, local, domain}]}
    const [first] = addresses
    if (addresses.length !== 1 || first.type !== 'mailbox') throw new Error(`${this.m} mailbox argument #${ix + 1} failed parse`)
    const {address, domain} = first
    return {address, domain} // 'president@whitehouse.gov', 'whitehouse.gov'
  }
}
