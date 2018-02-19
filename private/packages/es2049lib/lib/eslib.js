'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

/*
args: array of string like ['node', '--version']
regExpValue: RegExp and value pairs like [/IP/g, '1.2.3.4']

return value: array of string: patched command
*/
function patchCommand(args, ...regExpValue) {
  if (!Array.isArray(args)) throw new Error(`patchCommand: args not array`);
  return args.map((arg, index) => {
    const at = typeof arg;
    if (at !== 'string') throw new Error(`patchCommand: args index #${index} not string: ${at} args: ${args.join(' ')}`);
    for (let i = 0; i < regExpValue.length; i += 2) {
      const regExp = regExpValue[i];
      const value = regExpValue[i + 1];
      arg = arg.replace(regExp, value);
    }
    return arg;
  });
}

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
function getNonEmptyString(value, defaultValue) {
  if (value === undefined) value = defaultValue;
  const vt = typeof value;
  if (value && vt === 'string') return value;
  return new Failure(`not non-empty string: type: ${vt}`);
}

function getNonEmptyStringOrUndefined(value, defaultValue) {
  if (value === undefined) if ((value = defaultValue) === undefined) return value;
  const vt = typeof value;
  if (value && vt === 'string') return value;
  return new Failure(`not non-empty string or undefined: type: ${vt}`);
}

function getNonEmptyStringOrFunctionOrUndefined(value, defaultValue) {
  if (value === undefined) if ((value = defaultValue) === undefined) return value;
  const vt = typeof value;
  if (!value || vt !== 'string' && vt !== 'function') return new Failure(`not non-empty string or function or undefined: type: ${vt}`);
  return value;
}

function getNonEmptyStringOrArrayOfAsArray(value, defaultValue) {
  if (value === undefined) value = defaultValue;
  if (!Array.isArray(value)) {
    const vt = typeof value;
    if (value && vt === 'string') return [value];
    return new Failure(`not non-empty string or list of non-empty string: type: ${vt}`);
  } else for (let [index, aValue] of value.entries()) {
    const vt = typeof aValue;
    if (!value || vt !== 'string') return new Failure(`index #${index}: not non-empty string: type: ${vt}`);
  }
  return value;
}

function getObject(value, errorFn, defaultValue, undefinedOk) {
  return checkType({ value, errorFn, defaultValue, undefinedOk, type: 'object', m: 'object' });
}

function checkType({ value, errorFn, defaultValue, undefinedOk, type, m }) {
  getFunction(errorFn);
  if (value === undefined) value = defaultValue;
  if (!(value === undefined && undefinedOk)) {
    const vt = typeof value;
    if (!value || vt !== type) throw new Error(errorFn(`not ${m}: type: ${vt}`));
  }
  return value;
}

function getFunction(fn, m) {
  const ft = typeof fn;
  if (ft !== 'function') throw new Error(`${m} not function: ${ft}`);
  return ft;
}

function ensureListOfNonEmptyString(ssh, m) {
  if (!Array.isArray(ssh)) throw new Error(`${m}: not array`);
  for (let [index, value] of ssh.entries()) {
    const vt = typeof value;
    if (!value || vt !== 'string') throw new Error(`${m}: element at index ${index} not non-empty string: type: ${vt}`);
  }
  return ssh;
}

function ensureListOfString(ssh, m) {
  if (!Array.isArray(ssh)) throw new Error(`${m}: not array`);
  for (let [index, value] of ssh.entries()) {
    const vt = typeof value;
    if (vt !== 'string') throw new Error(`${m}: element at index ${index} not string: type: ${vt}`);
  }
  return ssh;
}

function ensurePortNumber(port, m) {
  const value = +port;
  if (!(value > 0) || !(value <= 65535)) throw new Error(`${m} not >0 <= 65535`);
  return value;
}

function checkTimeval(timeval, msg, defaultValue) {
  const number = +(timeval !== undefined ? timeval : defaultValue);
  if (!(number > 0)) throw new Error(`${msg} bad timeval: type: ${typeof timeval}`);
  return number;
}

function getFn(fn, defaultValue) {
  if (fn === undefined) fn = defaultValue;
  const ft = typeof fn;
  return ft === 'function' ? fn : new Failure(`not function: type: ${ft}`);
}

class Failure {
  constructor(o) {
    if (!o) o = false;else if (typeof o === 'string') o = { text: o };
    o.text = String(o.text || 'Undefined Type Failure');
    Object.assign(this, o);
  }
}

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
function throwWithMethod(e, method) {
  console.error(`${method}:`);
  throw Object.assign(e, { method });
}

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

exports.patchCommand = patchCommand;
exports.getNonEmptyString = getNonEmptyString;
exports.getNonEmptyStringOrUndefined = getNonEmptyStringOrUndefined;
exports.getNonEmptyStringOrFunctionOrUndefined = getNonEmptyStringOrFunctionOrUndefined;
exports.getNonEmptyStringOrArrayOfAsArray = getNonEmptyStringOrArrayOfAsArray;
exports.getObject = getObject;
exports.ensureListOfNonEmptyString = ensureListOfNonEmptyString;
exports.ensureListOfString = ensureListOfString;
exports.ensurePortNumber = ensurePortNumber;
exports.checkTimeval = checkTimeval;
exports.getFn = getFn;
exports.Failure = Failure;
exports.throwWithMethod = throwWithMethod;
