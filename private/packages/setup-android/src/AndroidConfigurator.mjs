/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class AndroidConfigurator {
  constructor(o) {
    const {debug, addcertificate, defaultcertificate, androidSerial} = o || false
    Object.assign(this, {debug, addcertificate, defaultcertificate, androidSerial})
  }

  async configure(serials) {
    console.log('AndroidConfigurator.configure NIMP', serials)
  }
}
