/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import moment from 'moment-timezone'

import fs from 'fs-extra'
import crypto from 'crypto'

const CAtz = 'America/Los_Angeles'

export function toUTCDate({year, month, day, hour, minute, second, tz}) {
  if (!tz) tz = CAtz
  if (
    typeof year !== 'string' || year.length != 4 ||
    typeof month !== 'string' || month.length != 2 ||
    typeof day !== 'string' || day.length != 2 ||
    typeof hour !== 'string' || hour.length != 2 ||
    typeof minute !== 'string' || minute.length != 2 ||
    typeof second !== 'string' || second.length != 2 ||
    !moment.tz.zone(tz)
  ) return
  return moment
    .tz(`${year}-${month}-${day} ${hour}:${minute}:${second}`, tz || CAtz)
    .utc()
    .toDate()
}

export function checksumFile(algorithm, path) {
  return new Promise((resolve, reject) => {
    console.log('checksumFile', path)
    const f = fs.createReadStream(path)
    const em = f.emit.bind(f)
    f.emit = (...args) => {
      console.log('fs', args[0])
      em(...args)
    }
    const c = crypto.createHash(algorithm)
    const e2 = c.emit.bind(f)
    c.emit = (...args) => {
      console.log('crypto', args[0])
      e2(...args)
    }
    console.log(f.pipe.toString())
    return f
      .once('close', () => console.log('FSCLOSE'))
      .on('readable', function() {
        console.log('RESUME', this.listenerCount('data'))
        this.resume()
      })
      .on('error', reject)
      .pipe(c/*crypto.createHash(algorithm)*/ // Error: Digest method not supported
        .setEncoding('hex'))
      .once('finish', function () {
        resolve(this.read())
      })
    })
}
