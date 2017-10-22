/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import RestartDetector from './RestartDetector'

export default class AddressRenewer {
  async run() {
    const ipReady = new RestartDetector().run()
    console.log('AddressRenewer.run')
    // restart the service
    // wait for ip
    // restart all dns
  }
}
