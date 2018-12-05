"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spawnAsync = spawnAsync;
exports.spawnCapture = spawnCapture;
exports.getError = getError;

var _child_process = _interopRequireDefault(require("child_process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
const spawn = _child_process.default.spawn;

async function spawnAsync(cmd, args, options, cpReceiver) {
  if (!cpReceiver) cpReceiver = {};
  return new Promise((resolve, reject) => cpReceiver.cp = spawn(cmd, args, {
    stdio: ['ignore', 'inherit', 'inherit'],
    ...options
  }).once('close', (status, signal) => status === 0 && !signal && resolve(status) || reject(getError(cmd, args, status, signal))).on('error', e => reject(Object.assign(e, {
    cmd,
    args
  }))));
}

async function spawnCapture(cmd, args, options) {
  options = { ...options,
    stdio: ['ignore', 'pipe', 'pipe']
  };
  const {
    doPipe,
    stderrFails
  } = options;
  delete options.doPipe;
  delete options.stderrFails;
  const cpReceiver = {};
  const p = spawnAsync(cmd, args, options, cpReceiver);
  const texts = ['', ''];
  const listeners = texts.map((text, ix) => t => texts[ix] += t);
  const {
    stdout: cpStdout,
    stderr: cpStderr
  } = cpReceiver.cp;
  const cpStreams = [cpStdout, cpStderr];

  for (let [ix, cpStream] of cpStreams.entries()) cpStream.on('data', listeners[ix]).setEncoding('utf8');

  if (doPipe) {
    const {
      stdout,
      stderr
    } = process;

    for (let [ix, processStream] of [stdout, stderr].entries()) cpStreams[ix].pipe(processStream);
  }

  let e;
  await p.catch(er => e = er);

  for (let [ix, cpStream] of cpStreams.entries()) cpStream.removeListener('data', listeners[ix]);

  if (e) throw e;
  const [stdout, stderr] = texts;
  if (stderrFails && stderr) throw Object.assign(new Error(`Output on standard error: ${cmd} ${args.join(' ')}: '${stderr}'`), {
    cmd,
    args,
    stdout,
    stderr
  });
  return {
    stdout,
    stderr
  };
}

function getError(cmd, args, status, signal) {
  let msg = `status code: ${status}`;
  if (signal) msg += ` signal: ${signal}`;
  msg += ` '${cmd} ${args.join(' ')}'`;
  return Object.assign(new Error(msg), {
    cmd,
    args,
    status,
    signal
  });
}
