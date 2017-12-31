/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import SMTPConnection from 'smtp-connection'

import tls from 'tls'

export default class SMTPVerifier {
  checkServerIdentity = this.checkServerIdentity.bind(this)

  constructor(o) {
    const {debug, mxDnsName} = o || false
    const {checkServerIdentity} = this
    const smtp = Object.assign({
      // ignoreTLS: true,
      requireTLS: true,
      logger: debug,
      debug: debug,
      name: '[8.8.8.8]',
      tls: {
        checkServerIdentity,
        rejectUnauthorized: false,
      },
    }, Object(o).smtp)
    Object.assign(this, {smtp, mxDnsName, debug})
  }

  async verify(address) {
    const {smtp} = this
    let smtpExtended
    const results = await Promise.all([
      new Promise((resolve, reject) => smtpExtended = new SMTPExtended(smtp)
        .on('error', reject)
        .once('end', resolve)),
      this.connect(address, smtpExtended),
    ])
    return results[1]
  }

  async connect(address, smtpExtended) {
    const {debug} = this
    await new Promise((resolve, reject) => smtpExtended.connect(resolve))
    const tlsSocket = smtpExtended._socket
    console.log('Certificate trusted:', tlsSocket.authorized)

    debug && console.log(`Sending mailbox: ${address}`)
    const result = smtpExtended.result = []
    const envelope = {from: 'a@a.aa', to: address}
    const message = 'x' // cannot be false
    // before DATA, QUIT is sent, so callback returns undefined
    await new Promise((resolve, reject) => smtpExtended.once('end', resolve) // we send quit, so this will terminate
      .send(
        envelope,
        message,
        (e, ...args) => !e ? resolve(...args) : reject(e)))
    return result
  }

  checkServerIdentity(host, cert) {
    const {mxDnsName, debug} = this
    console.log('Certificate for dns name:', mxDnsName)
    console.log('Canonical name:', cert.subject.CN)
    console.log('Valid from:', cert.valid_from)
    console.log('Valid to:', cert.valid_to)
    console.log('Issuer Canonical:', cert.issuer.CN)
    console.log('Serial number:', cert.serialNumber)
    console.log('Fingerprint:', cert.fingerprint)
    console.log('Alt names:', cert.subjectaltname)
    debug && console.log(`providing TLS server Identity: ${mxDnsName}`)
    return tls.checkServerIdentity(mxDnsName, cert)
  }
}

class SMTPExtended extends SMTPConnection {
  _actionRCPT(str, callback) {
    let message,
        err
    let curRecipient = this._recipientQueue.shift();

    // Modification: store the result for curRecipient
    this.result.push({email: curRecipient, response: str})

      if (Number(str.charAt(0)) !== 2) {
        // this is a soft error
        if (this._usingSmtpUtf8 && /^553 /.test(str) && /[\x80-\uFFFF]/.test(curRecipient)) {
            message = 'Internationalized mailbox name not allowed';
        } else {
            message = 'Recipient command failed';
        }
        this._envelope.rejected.push(curRecipient);
        // store error for the failed recipient
        err = this._formatError(message, 'EENVELOPE', str, 'RCPT TO');
        err.recipient = curRecipient;
        this._envelope.rejectedErrors.push(err);
    } else {
        this._envelope.accepted.push(curRecipient);
    }

    if (!this._envelope.rcptQueue.length && !this._recipientQueue.length) {
        if (this._envelope.rejected.length < this._envelope.to.length) {

            // Modification: sent QUIT instead of DATA
            this._responseActions.push(this.close)
            this._sendCommand('QUIT');

          } else {
            err = this._formatError('Can\'t send mail - all recipients were rejected', 'EENVELOPE', str, 'RCPT TO');
            err.rejected = this._envelope.rejected;
            err.rejectedErrors = this._envelope.rejectedErrors;
            return callback(err);
        }
    } else if (this._envelope.rcptQueue.length) {
        curRecipient = this._envelope.rcptQueue.shift();
        this._recipientQueue.push(curRecipient);
        this._responseActions.push(str2 => {
            this._actionRCPT(str2, callback);
        });
        this._sendCommand('RCPT TO:<' + curRecipient + '>' + this._getDsnRcptToArgs());
    }
  }
}
