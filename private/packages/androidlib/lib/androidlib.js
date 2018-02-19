'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var adbkit = _interopDefault(require('adbkit/lib/adb'));
var fs = _interopDefault(require('fs'));
var crypto = _interopDefault(require('crypto'));

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
class AdbPrimitives {

  static getClient(useShared) {
    // cannot be async
    let result = useShared && AdbPrimitives.sharedAdbClient;
    if (!result) {
      try {
        const timer = setTimeout(() => {
          throw new Error(`${AdbPrimitives.m} adb.createClient slower than 1 s`);
        }, 1e3);
        result = adbkit.createClient();
        clearTimeout(timer);
        if (useShared) AdbPrimitives.sharedAdbClient = result;
      } catch (e) {
        console.error(`${AdbPrimitives.m}.getClient`);
        throw e;
      }
    }
    return result;
  }

  static async getSerials(client) {
    if (!client) client = AdbPrimitives.getClient(true);
    const result = [];
    const timer = setTimeout(() => {
      throw new Error(`${AdbPrimitives.m} adb.listDevices slower than 1 s`);
    }, 1e3);
    const objectList = await client.listDevices().catch(e => {
      console.error(`${AdbPrimitives.m}.getSerials`);
      throw e;
    });
    clearTimeout(timer);
    for (let o of objectList) result.push(o.id);
    return result;
  }

  constructor(o) {
    const { client0, serial, name: m0 } = o || false;
    this.m = String(m0 || AdbPrimitives.m);
    const client = client0 || AdbPrimitives.getClient(AdbPrimitives.useSharedClient);
    const name = serial;
    Object.assign(this, { client, serial, name });
  }

  async adbShell(cmd) {
    const { client, serial, name, m } = this;
    return client.shell(serial, cmd).catch(onRejected);

    function onRejected(e) {
      console.error(`${m}.pull failed: ${name} ${cmd}`);
      throw e;
    }
  }

  async adbPull(from, to) {
    const { client, serial, name, m } = this;
    const pullTransfer = await client.pull(serial, from).catch(onRejected);
    return new Promise((resolve, reject) => pullTransfer.on('error', reject).pipe(fs.createWriteStream(to)).on('error', reject).once('finish', resolve)).catch(onRejected);

    function onRejected(e) {
      console.error(`${m}.pull failed: ${name} ${from}`);
      throw e;
    }
  }
}
AdbPrimitives.m = 'AdbPrimitives';
AdbPrimitives.useSharedClient = true;

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
class AdbShim extends AdbPrimitives {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.marker = 'yes', _temp;
  }

  getLines(text) {
    /*
    The final return and newline have been removed
    internal return newline remain
    if text is empty string, an empty array should be returned
    */
    const lines = text ? String(text).split('\n') : [];
    for (let [ix, line] of lines.entries()) if (line.endsWith('\r')) lines[ix] = line.slice(0, -1);
    return lines;
  }

  async findMd5sum() {
    let success;
    let cmd;
    let message;
    for (let aCmd of AdbShim.md5cmds) {
      const shellCmd = `${aCmd}  </dev/null`;
      const md5 = await this.shell(shellCmd); // is md5sum or error message
      if (success = md5.startsWith(AdbShim.md5empty)) {
        cmd = aCmd;
        break;
      }
      if (!cmd) {
        cmd = aCmd;
        message = md5;
      }
    }
    if (!success) throw new Error(`AdbShim.findMd5sum ${this.name} failed: ${cmd} output: ${message}`);
    return this.md5sumCmd = cmd;
  }

  getLsCmd(aPath, root) {
    const { marker } = this;
    const ls = this.prependRoot(`ls -1 \\"${aPath}\\"`, root);
    return 'A="$(' + ls + ')" && echo "' + marker + '$A"';
  }

  getLsResult(text, cmd) {
    const { marker } = this;
    if (!text.startsWith(marker)) throw new Error(`${this.m}: ls failed: command: ${cmd} output: '${text}'`);
    return this.getLines(text.substring(marker.length));
  }

  prependRoot(cmd, root) {
    return root ? 'su 0 ' + cmd : cmd;
  }

  getStatCmds(aPath, root) {
    return [this.prependRoot(`stat "${aPath}"`, root), this.prependRoot(`stat -c %X,%Y,%Z "${aPath}"`, root)];
  }

  getStatResult(texts, ms, falseIfMissing) {
    const { perms, user, group, nsList } = this.stat1Parser(texts[0], falseIfMissing, ms[0]);
    const [access, modify, change] = this.stat2Parser(texts[1], nsList, ms[1]);
    return { perms, user, group, access, modify, change };
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
    if (!text) throw new Error(`${msg} Are you root?`);
    if (text.endsWith('No such file or directory')) {
      if (falseIfMissing) return false;
      throw new Error(`${msg}: stat nonexistent path`);
    }
    const lines = this.getLines(text);
    /*
    Access: (771/drwxrwx--x)\tUid: (1000/  system)\tGid: (1000/  system)
    [^/]+\/: skip up to and including first slash
    ([^)]*): 'drwxrwx--x' - [1]
    [^/]+\/ *: skip up to the next slash and following white space
    ([^)]+): 'system' - [2]
    [^/]+\/ *([^)]+): skip up to the next slash and following white space
    ([^)]+): 'system' - [3]
    */
    const m1 = /[^/]+\/([^)]*)[^/]+\/ *([^)]+)[^/]+\/ *([^)]+)/;
    const match = String(lines[3]).match(m1);
    const perms = Object(match)[1];
    const user = Object(match)[2];
    const group = Object(match)[3];
    if (!perms || !user || !group) throw new Error(`${msg} parse failed: '${text}'`);
    const nsList = lines.slice(4, 7).map(line => this._getNs(line, msg)); // access modify change
    return { perms, user, group, nsList };
  }

  stat2Parser(text, nsList, msg) {
    // '1489960267,1502496127,1502496127'
    const match = text.match(/([^,]+),([^,]+),(.*)/);
    const epochs = match ? match.slice(1, 4) : [];
    nsList = Object(nsList);
    return epochs.map((epoch, ix) => this._getTime(epoch, nsList[ix], msg));
  }

  _getTime(text, ns, msg) {
    const epoch = Number(text) * 1e3; // convert to timeval
    const d = new Date(epoch);
    if (!(epoch >= 0) || !isFinite(d)) throw new Error(`${msg}: bad epoch: '${text}'`);
    // string 24: 1970-01-01T00:00:00.000Z
    const dText = d.toISOString(); // our date is good, will not throw
    return `${dText.substring(0, 20)}${ns}Z`;
  }

  _getNs(text, msg) {
    const ns = String(text).slice(-9);
    if (!ns.match(/^\d{9}$/)) throw new Error(`${msg}: Failed to parse ns time: '${text}'`);
    return ns;
  }
}
AdbShim.md5empty = 'd41d8cd98f00b204e9800998ecf8427e';
AdbShim.md5cmds = ['md5sum', '/data/hq/bin/md5sum'];

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
class AndroidLib extends AdbShim {

  constructor(o) {
    super(Object.assign({ name: 'AndroidLib' }, o));
    this.shellSocket = this.adbShell;
  }

  async shell(cmd) {
    const socket = await this.adbShell(cmd);
    return new Promise((resolve, reject) => {
      let output = '';
      socket.on('data', s => output += s) // line terminators are \n
      .once('end', () => {
        // remove final /r/n or /n or /r
        if (output.endsWith('\n')) output = output.slice(0, -1);
        if (output.endsWith('\r')) output = output.slice(0, -1);
        resolve(output);
      }).on('error', reject).setEncoding('utf8');
    }).catch(e => {
      console.error(`AdbShim.shell ${this.name} streaming '${cmd}'`);
      throw e;
    });
  }

  async shellOneLine(cmd) {
    const output = await this.shell(cmd);
    if (output.includes('\n')) throw new Error(`${this.m}.shellOneLine ${this.name} Expected one-line result: ${cmd} '${output}`);
    return output;
  }

  async getDeviceName(save) {
    const marker = 'hostname.';
    const pattern = `/sdcard/Safe/${marker}*`;
    const errorMarker = 'ERROR';
    const cmd = `ls ${pattern} || echo ${errorMarker}`;

    const timer = setTimeout(() => {
      throw new Error(`${this.m} device ${this.name} adb.shell ls slower than 1 s`);
    }, 1e3);
    const output = await this.shell(cmd).catch(e => {
      console.error(`AdbShim.getDeviceName ${this.name}`);
      throw e;
    });
    clearTimeout(timer);
    const i = output.indexOf(marker);
    if (output.endsWith(errorMarker) || output.includes('\n') || !~i) throw new Error(`AdbShim.getDeviceName device ${this.name} has not been named in ${pattern}`);

    const deviceName = output.substring(i + 9);
    if (!deviceName) throw new Error(`AdbShim.getDeviceName No device name for serial ${this.name}`);
    if (save) this.name = this.deviceName = deviceName;

    return deviceName;
  }

  async pull(from, to) {
    const results = await Promise.all([this.md5sumFar(from), this.adbPull(from, to)]);
    const md5far = results[0];
    const md5near = await this.hash(to, 'md5');
    if (md5far !== md5near) throw new Error(`AdbShim.pull md5 mismatch:\n${md5far} android: ${from}\n${md5near} ${to}`);
  }

  async getPackageVersion(packageName) {
    const output = await this.shell(`dumpsys package ${packageName} | grep -e '^ *versionName='`).catch(e => {
      console.error(`AdbShim.getPackageVersion ${this.name} package: '${packageName}'`);
      throw e;
    });

    const version = output.split('\n').reduce((accumulate, line) => {
      if (!accumulate) {
        const i = line.indexOf('=');
        return line.substring(i + 1).trim().replace(/[^\x20-\x7E]+/g, '');
      } else return accumulate;
    }, '');
    if (!version) throw new Error(`AdbShim.getPackageVersion bad response ${this.name} package ${packageName}: '${output}'`);

    return version;
  }

  async ls(aPath, root) {
    const cmd = this.getLsCmd(aPath, root);
    const text = await this.shell(cmd);
    return this.getLsResult(text, cmd);
  }

  async stat(aPath, root, falseIfMissing) {
    const cmds = this.getStatCmds(aPath, root);
    const ms = cmds.map(cmd => `${this.m}: stat failed: '${cmd}'`);
    const texts = await Promise.all(cmds.map(c => this.shell(c)));
    return this.getStatResult(texts, ms, falseIfMissing);
  }

  async md5sumFar(remoteFile, root) {
    const md5cmd = this.md5sumCmd || (await (this.md5sumPromise || (this.md5sumPromise = this.findMd5sum())));
    const cmd = this.prependRoot(`${md5cmd} ${remoteFile}`, root);
    const s = await this.shell(cmd);
    const md5 = s.substring(0, s.indexOf(' '));
    if (md5.length !== 32 || md5.replace(/[0-9a-f]/g, '').length) throw new Error(`AdbShim.md5sumFar failed: ${this.name} command: '${cmd}' output: '${s}' parsed md5: '${md5}'`);
    return md5;
  }

  async sha1sumFar(remoteFile, root) {
    const cmd = this.prependRoot(`sha1sum -b ${remoteFile}`, root);
    const s = await this.shell(cmd);
    const sha1 = s.substring(0, 40);
    if (sha1.length !== 40 || sha1.replace(/[0-9a-f]/g, '').length) throw new Error(`AdbShim.sha1sumFar failed: ${this.name} command: '${cmd}' output: '${s}' parsed sha1: '${sha1}'`);
    return sha1;
  }

  async hash(file, algorithm) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash(algorithm || 'sha256');
      fs.createReadStream(file).on('data', d => hash.update(d)).on('error', reject).once('end', () => resolve(hash.digest('hex')));
    }).catch(e => {
      console.error(`AdbShim.hash ${file}`);
      throw e;
    });
  }
}

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

exports.AndroidLib = AndroidLib;