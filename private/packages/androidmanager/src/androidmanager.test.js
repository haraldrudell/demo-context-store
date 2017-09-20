/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {spawn} from 'child_process'

test('run executable', async () => {
  await  new Promise((resolve, reject) => spawn('bin/androidmanager', ['--help'], {stdio: ['ignore', 'inherit', 'inherit']})
    .once('close', (status, signal) => status === 0 && !signal && resolve() || reject(new Error(`status: ${status} signal: ${signal}`)))
  )
})
