/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import SshTunnel from './SshTunnel'
import SMTPVerifier from './SMTPVerifier';

import parser from 'email-addresses'
import dns from 'dns'
import Queue from './Queue.mjs'

export default class EmailVerifier {
  timeout = 3e3 // 3 s
  retryTime = 1e2 // 100 ms
  verifyRejected = this.verifyRejected.bind(this)

  constructor(o) {
    const {debug, ssh, name, port} = o || false
    this.m = String(name || 'EmailVerifier')
    this.ensureListOfNonEmptyString(ssh)
    Object.assign(this, {debug, ssh, port})
    this.queue = new Queue()
  }

  async verify(mailboxes) {
    const {debug} = this
    if (!Array.isArray(mailboxes)) mailboxes = [mailboxes]
    const emails = mailboxes.map((email, ix) => this.parseMailbox(email, ix))
    debug && console.log(`${this.m} verify`, emails)
    await Promise.all(emails.map(email => this.addMx(email)))
    debug && console.log(`${this.m} verify submitting:`, emails)
    const results = await this.queue.submit(() => this.verifyAll(emails))
    debug && console.log(`${this.m} verify results:`, results)
    console.log(`\nnumber of results: ${results.length}`)
    this.printResults(results, true)
    return results
  }

  async verifyAll(emails) {
    const {debug} = this
    debug && console.log(`${this.m} verifyAll`, emails)
    const results = []
    Object.assign(this, {emails, emailIndex: 0, results})
    await this.verifyNext().catch(this.verifyNextOnRejected)
    return results
  }

  async verifyNextOnRejected(e) {
    const {sshTunnel} = this
    let e1
    sshTunnel && await sshTunnel.disconnect().catch(ee => (e1 = ee))
    console.error(`${this.m} ssh disconnect error:`, e1)
    throw e
  }

  async verifyNext() {
    const {debug, ssh, emails, emailIndex, sshDomain, sshTunnel, results, port: nearSshPort, timeout, retryTime} = this
    const email = emails[emailIndex]
    if (email) {
      const {domain, mxDnsName, address, ip} = email
      const host = ssh ? '127.0.0.1' : domain
      const port = ssh ? nearSshPort : 25
      if (ssh) {
        const changeTunnel = ssh && domain !== sshDomain
        if (changeTunnel) {
          sshTunnel && await sshTunnel.disconnect()

          debug && console.log(`setting up ssh tunnel from localhost to intermediate server…`)
          const tunnel = new SshTunnel({cmd: this.patchSsh(ip), debug})

          // now we have an ssh object
          if (!sshTunnel && await tunnel.isPortOpen({host, port, timeout})) throw new Error(`${this.m} port busy: ${port}`) // we did not have one before

          Object.assign(this, {sshDomain: domain, sshTunnel: tunnel})
          return Promise.all([
            tunnel.setupSsh(),
            this.verifyNext(),
          ])
        }

        debug && console.log(`Waiting for ssh tunnel: ${mxDnsName} ${ip}…`)
        await sshTunnel.ready({host, port, timeout, retryTime})
      }

      results.push.apply(results, await this.connect({host, port, mxDnsName, address}))
      this.emailIndex++
      return this.verifyNext()
    }
    return sshTunnel && (this.sshDomain = null) + sshTunnel.disconnect()
  }

  async connect({host, port, mxDnsName, address}) {
    const {debug} = this
    debug && console.log(`Connecting to mail server: ${mxDnsName}…`)
    const result = await new SMTPVerifier({smtp: {host, port}, mxDnsName, debug}).verify(address)
    debug && console.log('SMTPVerifier:', result)
    if (!Array.isArray(result)) throw new Error(`{this.m} Email verification failed: ${result}`)
    this.printResults(result)
    return result // [{email, response}…]
  }

  printResults(results, abbreviate) {
    for (let {email, response} of results) {
      const newLine = !abbreviate ? -1 : response.indexOf('\n')
      const r = !~newLine ? response : response.substring(0, newLine) + '…'
      console.log(`Mailbox: ${email} Response: ${r}`)
    }
  }

  async addMx(email) {
    const {debug} = this
    const {domain} = email
    debug && console.log(`Resolving dns: ${domain}…`)
    const {ip, mxDnsName} = await this.getMxIp(domain)
    debug && console.log(`Mailbox domain: ${domain} MX host: ${mxDnsName} MX ip: ${ip}`)
    Object.assign(email, {ip, mxDnsName})
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

  parseMailbox(email, ix) {
    if (!email || typeof email !== 'string') throw new Error(`${this.m} mailbox argument #${ix + 1} not non-empty string`)
    const {addresses} = parser(email) //{ast, addresses[{parts, type, name, address, local, domain}]}
    const [first] = addresses
    if (addresses.length !== 1 || first.type !== 'mailbox') throw new Error(`${this.m} mailbox argument #${ix + 1} failed parse`)
    const {address, domain} = first
    return {address, domain} // 'president@whitehouse.gov', 'whitehouse.gov'
  }

  ensureListOfNonEmptyString(ssh) {
    if (!Array.isArray(ssh)) throw new Error(`${this.m} ssh argument not array`)
    for (let [index, value] of ssh.entries()) {
      const vt = typeof value
      if (!value || vt !== 'string') throw new Error(`${this.m} ssh element at index ${index} not nonempty string: type: ${vt}`)
    }
  }

  patchSsh(ip) {
    return this.ssh.map(str => str.replace(/DOMAIN/g, ip))
  }
}
