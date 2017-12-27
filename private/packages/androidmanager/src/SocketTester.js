/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import AdbShim from './AdbShim'
import { clearTimeout } from 'timers';

const m = 'SocketTester'

run().catch(errorHandler)

async function run() {
  await Promise.resolve() // wait for the class to be parsed
  return new SocketTester().run()
}

/*
Nexus 5X: setup of socket count:
1: 1 ms
100: 9 ms
300: 24 ms
400: 56 ms
500: 64 ms, ECONNRESET, device offline: replug usb cable
1000: 131 ms, ECONNRESET, device offline: replug usb cable
- socket setup speed is not a problem
- max 400 sockets

300 shells is about 320 MiB of memory
Stay below 512 MiB on a 2GiB RAM deviec
- max 500 shells

su is trouble
400 su shells: crashes
no higher rate than 5/s
*/

export default class SocketTester {
  static serial = '0256f8cef3a02463'

  constructor(o) {
    const {serial = SocketTester.serial} = o || false
    this.adb = new AdbShim({serial}) // process-wide shared adb client
  }

  async run() {
    const {adb} = this
    await adb.getDeviceName(true)
    //return this.sleepOne(400, 'sleep 10') // works
    //return this.sleepOne(1, 'sleep 1') // setup 1 ms, 1.026 s
    //return this.sleepOne(100, 'sleep 1') // setup 13 ms, 1.534 s
    //return this.sleepOne(1, 'su 0 sleep 1') // setup 2 ms, 1.084 s (su is 60 ms)
    //return this.sleepOne(10, 'su 0 sleep 1') // setup 3 ms, 1.173 s
    // return this.sleepOne(100, 'su 0 sleep 1') // setup 11 ms, 6.914 s - clear problem
    //return this.sleepOne(100, 'su 0 sleep 1', 100) // setup 9.961 s, 11.389 s
    //return this.sleepOne(100, 'su 0 sleep 1', 50) // setup 5.016 s, 7.389 s
    //return this.sleepOne(100, 'su 0 sleep 1', 10) // setup 1.057 s, 6.005 s - too fast
    //return this.sleepOne(100, 'su 0 sleep 1', 30) // setup 3.035 s, 6.749 s - too fast
    return this.sleepOne(400, 'su 0 sleep 240', 200) // setup: 80.399 s
    //return this.sleepOne(400, 'su 0 sleep 240', 300) // setup: 120.184 s
    //return this.sleepOne(400, 'su 0 sleep 240', 500) // setup: 200.009 s
    //return this.sleepOne(400, 'su 0 sleep 60', 100) // crashes
    //return this.sleepOne(400, 'su 0 sleep 1', 30) // setup 12.388 s crashes
    //return this.sleepOne(400, 'su 0 sleep 10') // crashes
  }

  async sleepOne(sockets, cmd, minTime) {
    const {adb} = this
    const tout = 1e3
    const toutP = tout.toFixed(1)
    sockets = Number(sockets)
    if (!(sockets >= 0) || !(sockets <= Number.MAX_SAFE_INTEGER)) throw new Error(`${m} sockets number not integer: ${sockets}`)

    const p = []
    let n = 0
    console.log(`Connecting sockets: ${sockets}`)
    const t0 = Date.now()
    let t1
    while (n < sockets) {
      const timer = setTimeout(() => new Error(`${m}: Socket setup slower than ${toutP} s at ${n}`), tout)
      if (minTime > 0) {
        const elapsed = Date.now() - t1
        const left = minTime - elapsed
        if (left > 0) {
          console.log(n, left)
          await new Promise(r => setTimeout(r, left))
        }
      }
      t1 = Date.now()
      p.push(adb.shell(cmd))
      clearTimeout(timer)
      n++
    }
    const eConnect = (Date.now() - t0) / 1e3
    console.log(`${m} setup of ${sockets} sockets in ${eConnect/*.toFixed(1)*/} s`)
    await Promise.all(p)
    const eComplete = (Date.now() - t0) / 1e3
    console.log(`${m} completed in ${eComplete.toFixed(3)} s`)
  }
}

function errorHandler(e) {
  console.error(`${m}.errorHandler`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`)
  console.error(e)
  console.error(new Error('errorHandler invocation').stack)
  process.exit(1)
}
