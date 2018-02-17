/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import AdbPrimitives from './AdbPrimitives'

export default class AdbShim extends AdbPrimitives {
  static md5empty = 'd41d8cd98f00b204e9800998ecf8427e'
  static md5cmds = ['md5sum', '/data/hq/bin/md5sum']
  marker = 'yes'

  getLines(text) {
    /*
    The final return and newline have been removed
    internal return newline remain
    if text is empty string, an empty array should be returned
    */
    const lines = text ? String(text).split('\n') : []
    for (let [ix, line] of lines.entries()) if (line.endsWith('\r')) lines[ix] = line.slice(0, -1)
    return lines
  }

  async findMd5sum() {
    let success
    let cmd
    let message
    for (let aCmd of AdbShim.md5cmds) {
      const shellCmd = `${aCmd}  </dev/null`
      const md5 = await this.shell(shellCmd) // is md5sum or error message
      if ((success = md5.startsWith(AdbShim.md5empty))) {
        cmd = aCmd
        break
      }
      if (!cmd) {
        cmd = aCmd
        message = md5
      }
    }
    if (!success) throw new Error(`AdbShim.findMd5sum ${this.name} failed: ${cmd} output: ${message}`)
    return (this.md5sumCmd = cmd)
  }

  getLsCmd(aPath, root) {
    const {marker} = this
    const ls = this.prependRoot(`ls -1 \\"${aPath}\\"`, root)
    return 'A="$(' + ls + ')" && echo "' + marker + '$A"'
  }

  getLsResult(text, cmd) {
    const {marker} = this
    if (!text.startsWith(marker)) throw new Error(`${this.m}: ls failed: command: ${cmd} output: '${text}'`)
    return this.getLines(text.substring(marker.length))
  }

  prependRoot(cmd, root) {
    return root
      ? 'su 0 ' + cmd
      : cmd
  }

  getStatCmds(aPath, root) {
    return [
      this.prependRoot(`stat "${aPath}"`, root),
      this.prependRoot(`stat -c %X,%Y,%Z "${aPath}"`, root),
    ]
  }

  getStatResult(texts, ms, falseIfMissing) {
    const {perms, user, group, nsList} = this.stat1Parser(texts[0], falseIfMissing, ms[0])
    const [access, modify, change] = this.stat2Parser(texts[1], nsList, ms[1])
    return {perms, user, group, access, modify, change}
  }

  stat1Parser(text, falseIfMissing, msg) {
    /*
      File: `/'
      Size: 1400     Blocks: 0       IO Blocks: 4096        directory
      Device: 2h/2d    Inode: 2        Links: 25
      Access: (1777/drwxrwxrwt)       Uid: (0/    root)       Gid: (0/    root)
      Access: 1969-12-31 16:00:00.000000000
      Modify: 2017-06-18 16:40:23.049999999
      Change: 2017-06-18 16:40:23.049999999
      - times are in local time zone
    */
    if (!text) throw new Error(`${msg} Are you root?`)
    if (text.endsWith('No such file or directory')) {
      if (falseIfMissing) return false
      throw new Error(`${msg}: stat nonexistent path`)
    }
    const lines = this.getLines(text)
    /*
    Access: (771/drwxrwx--x)\tUid: (1000/  system)\tGid: (1000/  system)
    [^/]+\/: skip up to and including first slash
    ([^)]*): 'drwxrwx--x' - [1]
    [^/]+\/ *: skip up to the next slash and following white space
    ([^)]+): 'system' - [2]
    [^/]+\/ *([^)]+): skip up to the next slash and following white space
    ([^)]+): 'system' - [3]
    */
    const m1 = /[^/]+\/([^)]*)[^/]+\/ *([^)]+)[^/]+\/ *([^)]+)/
    const match = String(lines[3]).match(m1)
    const perms = Object(match)[1]
    const user = Object(match)[2]
    const group = Object(match)[3]
    if (!perms || !user || !group) throw new Error(`${msg} parse failed: '${text}'`)
    const nsList = lines.slice(4, 7).map(line => this._getNs(line, msg)) // access modify change
    return {perms, user, group, nsList}
  }

  stat2Parser(text, nsList, msg) {
    // '1489960267,1502496127,1502496127'
    const match = text.match(/([^,]+),([^,]+),(.*)/)
    const epochs = match ? match.slice(1, 4) : []
    nsList = Object(nsList)
    return epochs.map((epoch, ix) => this._getTime(epoch, nsList[ix], msg))
  }

  _getTime(text, ns, msg) {
    const epoch = Number(text) * 1e3 // convert to timeval
    const d = new Date(epoch)
    if (!(epoch >= 0) || !isFinite(d)) throw new Error(`${msg}: bad epoch: '${text}'`)
    // string 24: 1970-01-01T00:00:00.000Z
    const dText = d.toISOString() // our date is good, will not throw
    return `${dText.substring(0, 20)}${ns}Z`
  }

  _getNs(text, msg) {
    const ns = String(text).slice(-9)
    if (!ns.match(/^\d{9}$/)) throw new Error(`${msg}: Failed to parse ns time: '${text}'`)
    return ns
  }
}
