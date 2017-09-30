/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import PortClient from './PortClient'
import PortServer from './PortServer'
import Listener from './Listener'

import os from 'os'

//import classRunner from 'classrunner'

//classRunner({construct: PortServer})
run().catch(errorHandler)

async function run() {
  process.on('unhandledRejection', unhandled)
  let instance
  let options = {
    listener: new Listener(null, eventLogger),
    errorHandler: new Listener(null, errorHandler),
  }
  const hostname = os.hostname()
  if (hostname === 'c3') {
    // c3: iptables --insert ETH0_IN --protocol tcp --destination-port 5001 --jump ACCEPT
    Object.assign(options, {listen: {
      host: '10.240.0.3',
      port: 5001,
    }})
    instance = new PortServer(options)
  } else if (hostname === 'c89') {
    instance = new PortServer(options)
  } else if (hostname === 'c5') {
    // c5: iptables --insert ENX000EC6FA6161_OUT --protocol tcp --destination-port 5001 --destination 108.59.87.251 --jump ACCEPT
    Object.assign(options, {
      host: '108.59.87.251',
      port: 5001,
    })
    instance = new PortClient(options)
  }
  await instance.promise
  console.log('PortServer completed successfully')
}

function eventLogger(...args) {
  console.log('\nindex-eventLogger:')
  console.log(...args)
}

function unhandled(e) {
  console.error('\nindex-unhandled:')
  console.error(e)
  console.error(new Error('index-unhandled'))
  process.exit(1)
}

function errorHandler(e) {
  console.error('\nindex-errorHandler:')
  console.error(e)
  console.error(new Error('index-errorHandler'))
  process.exit(1)
}

