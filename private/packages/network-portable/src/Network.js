/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Linux from './Linux'
//import MacOS from './MacOS'
//import Windows from './Windows'

export default class Network {
  constructor(...args) {
    const p = process.platform
    switch (p) {
      case 'linux': return new Linux(...args)
      //case 'darwin': return new MacOS(...args)
      //case 'win32': return new Windows(...args)
    }
    throw new Error(`network-portable has no implementation for platform: ${p}`)
  }
}
