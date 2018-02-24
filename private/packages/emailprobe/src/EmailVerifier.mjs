/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import SshRecycler from './SshRecycler'
import SMTPVerifier from './SMTPVerifier'

import {Queue, setMDebug} from 'es2049lib'

import parser from 'email-addresses'
import dns from 'dns'

export default class EmailVerifier {
  shutdown = this.shutdown.bind(this)
  shutdownSafe = this.shutdownSafe.bind(this)

  constructor(o) {
    const {print, ssh: args} = o = setMDebug(o, this, 'EmailVerifier')
    print && (this.print = true)
    args && (this.sshRecycler = new SshRecycler({...o, args}))
    this.queue = new Queue()
  }

  async start() {
    const {sshRecycler} = this
    return sshRecycler && sshRecycler.promise
  }

  async verify(mailboxes) {
    const {debug} = this
    if (!Array.isArray(mailboxes)) mailboxes = [mailboxes]

    // parse: 'a@b.com' -> {address: 'a@b.com', domain: 'b.com'}
    const emails = mailboxes.map((email, ix) => this.parseMailbox(email, ix)) //

    // dns resolve: {address, domain, ip: '1.2.3.4', mxDnsName: 'mail.gov'}
    debug && console.log(`${this.m} verify`, emails)
    await Promise.all(emails.map(email => this.addMx(email))) // uses network dns

    // serialize using queue so that ssh tunnel can be used
    debug && console.log(`${this.m} verify submitting:`, emails)
    const results = await Promise.all(emails.map(o => this.queue.submit(() => this.verifyMailbox(o))))
console.log('RESRERS', results)
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

  shutdownSafe(e) { // does not reject
    this.shutdown().catch(console.error)
    if (e) throw e
  }

  async verifyMailbox(email) {
    const {print, sshDomain, sshRecycler} = this
    const {domain, mxDnsName, address, ip} = email
    const {host, port} = sshRecycler ? sshRecycler.getHostPort() : {host: ip, port: 25}
    if (sshRecycler) {
      if (domain !== sshDomain) {
        if (!sshDomain) {
          print && console.log(`checking that ports are available…`)
          if (!await sshRecycler.arePortsAvailable()) throw new Error(`${this.m} ports busy`) // we did not have one before
        } else await sshRecycler.disconnect()
        this.sshDomain = domain

        print && console.log(`setting up ssh tunnel from localhost to intermediate server…`)
        await sshRecycler.connect({host: ip})

        print && console.log(`Waiting for ssh tunnel: ${mxDnsName} ${ip}…`)
        await sshRecycler.waitOnCheckPort()
      }
    }

    return this.connect({host, port, mxDnsName, address})
  }

  async connect({host, port, mxDnsName, address}) {
    const {debug, print} = this
    print && console.log(`Connecting to mail server: ${mxDnsName}…`)
    const result = await new SMTPVerifier({smtp: {host, port}, mxDnsName, debug: debug || print}).verify(address)
    debug && console.log('SMTPVerifier:', result)
    if (!Array.isArray(result)) throw new Error(`{this.m} Email verification failed: ${result}`)
    this.printResults(result)
    return result[0] // [{email, response}…] => {email, respomse}
  }

  printResults(results, abbreviate) {
    for (let {email, response} of results) {
      const newLine = !abbreviate ? -1 : response.indexOf('\n')
      const r = !~newLine ? response : `${response.substring(0, newLine)}…`
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
