/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {EventEmitter} from 'events'
import {spawn} from 'child_process'

/* an emitted error is propely handled as an error
test('Emit Error', async () => {
  new EventEmitter().emit('error', new Error('x'))
})
*/

test('run executable', async () => { // ./bin/csv1480json, ['--help']
  await  new Promise((resolve, reject) => spawn('bin/csv1480json', {stdio: ['ignore', 'inherit', 'inherit']})
    .once('close', (status, signal) => status === 0 && !signal && resolve() || reject(new Error(`status: ${status} signal: ${signal}`)))
  )
})
