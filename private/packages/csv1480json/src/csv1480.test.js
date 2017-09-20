/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {spawn} from 'child_process'

test('csv1480json should convert 1 to json', async () => {
  const expected = '{1: "1"}\n'
  const actual = await  new Promise((resolve, reject) => {
    let stderr = ''
    let stdout = ''
    const cp = spawn('bin/csv1480json', {stdio: 'pipe'})
      .once('close', (status, signal) => {
        if (status === 0 && !signal) {
          if (!stderr) resolve(stdout)
          else reject(new Error(`csv1480json echo to stderr: '${stderr}' stdout: '${stdout}'`))
        } else reject(new Error(`status: ${status} signal: ${signal}`))
      }).on('error', reject)
    cp.stdout.on('data', s => stdout += s).on('error', reject).setEncoding('utf8')
    cp.stderr.on('data', s => stderr += s).on('error', reject).setEncoding('utf8')
    cp.stdin.end('1\n')
  })
  expect(actual).toEqual(expected)
})
