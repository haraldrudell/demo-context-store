/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import SshRecycler from './SshRecycler'
import SMTPVerifier from './SMTPVerifier'
import Queue from './Queue'

import parser from 'email-addresses'
import dns from 'dns'

export default class EmailVerifier {
  shutdown = this.shutdown.bind(this)
  shutdownSafe = this.shutdownSafe.bind(this)

  constructor(o) {
    const {debug, ssh, name, port} = o || false
    this.m = String(name || 'EmailVerifier')
    Object.assign(this, {debug, port})
    if (ssh) this.sshRecycler = new SshRecycler({cmd: ssh, nearPort: port, debug})
    this.queue = new Queue()
  }

  async start() {
    const {sshRecycler} = this
    return sshRecycler && sshRecycler.promise
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

  async shutdown(e) {
    const {sshRecycler, debug} = this
    debug && console.log(`${this.m} shutdown e:`, e, 'sshRecycler:', sshRecycler && SshRecycler.cmd)
    if (sshRecycler) {
      this.sshRecycler = null
      await sshRecycler.shutdown()
    }
    if (e instanceof Error) throw e
    return e
  }

  async verifyAll(emails) {
    const {debug} = this
    debug && console.log(`${this.m} verifyAll`, emails)
    const results = []
    Object.assign(this, {emails, emailIndex: 0, results})

    await this.verifyNext().catch(this.verifyNextOnRejected)
    return results
  }

  shutdownSafe(e) {
    this.shutdown().catch(console.error)
    if (e) throw e
  }

  async verifyNext() {
    const {print, emails, emailIndex, sshDomain, sshRecycler, results, port: nearSshPort} = this
    const email = emails[emailIndex]
    if (!email) return
    const {domain, mxDnsName, address, ip} = email
    const host = sshRecycler ? '127.0.0.1' : ip
    const port = sshRecycler ? nearSshPort : 25
    if (sshRecycler) {
      if (domain !== sshDomain) {
        if (!sshDomain) {
          if (await sshRecycler.isPortOpen({host, port})) throw new Error(`${this.m} port busy: ${port}`) // we did not have one before
        } else await sshRecycler.disconnect()
        this.sshDomain = domain

        print && console.log(`setting up ssh tunnel from localhost to intermediate server…`)
        await sshRecycler.connect({host: ip})

        print && console.log(`Waiting for ssh tunnel: ${mxDnsName} ${ip}…`)
        await sshRecycler.waitOnSocket()
      }
    }

    results.push.apply(results, await this.connect({host, port, mxDnsName, address}))
    this.emailIndex++
    return this.verifyNext()
  }

  async connect({host, port, mxDnsName, address}) {
    const {debug, print} = this
    print && console.log(`Connecting to mail server: ${mxDnsName}…`)
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
    Object.assign(email, {ip, mxDnsName}) // {ip: '1.2.3.4', mxDnsName: 'mail.gov'}
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
}
