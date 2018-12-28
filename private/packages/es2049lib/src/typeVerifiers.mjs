/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
const m = 'typeVerifiers'

import util from 'util'

/*
instance is the class instance being instantiated
instance.debug initialized to true if debug requested
instace.m initialized to name from argument object or the provided default name
return value: the argument ensured to be an object
*/
export function setMDebug(o, instance, name) {
  o = Object(o)
  const ti = typeof instance
  if (ti !== 'object') throw new Error(`${m} setMDebug: instance not object: type: ${ti}`)
  name = o.name || name
  const tn = typeof name
  if (!name || tn !== 'string') throw new Error(`${m} setMDebug: name not non-empty string: type: ${tn}`)

  instance.m = name
  o.debug && (instance.debug = true)

  return o
}

export function getNonEmptyString(firstArgument, defaultValue) {
  const {name, value = defaultValue, s} = getSNameValue(firstArgument)
  const vt = typeof value
  if (!value && vt !== 'string') return s.text = `not non-empty string: type: ${vt}`
  s.properties[name] = value
}

export function getNonEmptyStringOrUndefined(firstArgument, defaultValue) {
  const {name, value = defaultValue, s} = getSNameValue(firstArgument)
  if (value === undefined) return
  const vt = typeof value
  if (!value && vt !== 'string') return s.text = `not non-empty string or undefined: type: ${vt}`
  s.properties[name] = value
}

export function getStringOrFunctionOrUndefined(firstArgument, defaultValue) {
  const {name, value = defaultValue, s} = getSNameValue(firstArgument)
  if (value === undefined) return
  const vt = typeof value
  if (vt !== 'string' && vt !== 'function') return s.text = `not non-empty string or function or undefined: type: ${vt}`
  s.properties[name] = value
}

export function getNonEmptyStringOrArrayOfAsArray(firstArgument, defaultValue) {
  const {name, value = defaultValue, s} = getSNameValue(firstArgument)
  if (!Array.isArray(value)) {
    const vt = typeof value
    if (!value && vt !== 'string') s.text = `not non-empty string or list of non-empty string: type: ${vt}`
    s.properties[name] = [value]
  } else {
    for (let [index, aValue] of value.entries()) {
      const vt = typeof aValue
      if (!aValue || vt !== 'string') return s.text = `index #${index}: not non-empty string: type: ${vt}`
    }
    s.properties[name] = value
  }
}

export function getNonEmptyStringRegExpUndefinedAsArray(firstArgument, defaultValue) {
  const {name, value: value0 = defaultValue, s} = getSNameValue(firstArgument)
  if (value0 === undefined) return
  const value = Array.isArray(value0) ? value0 : [value0]
  for (let [index, aValue] of value.entries()) {
    if (aValue instanceof RegExp) continue
    const vt = typeof aValue
    if (!aValue || vt !== 'string') return s.text = `index #${index}: not non-empty string or RegExp: type: ${vt}`
  }
  s.properties[name] = value
}

export function getArrayOfNonEmptyString(firstArgument, defaultValue) {
  const {name, value = defaultValue, s} = getSNameValue(firstArgument)
  if (!Array.isArray(value)) return s.text = `not array`
  for (let [index, aValue] of value.entries()) {
    const vt = typeof aValue
    if (!aValue || vt !== 'string') s.text = `index #${index}: not non-empty string: type: ${vt}`
  }
  s.properties[name] = value
}

export function getRegExp(firstArgument, defaultValue) {
  const {name, value = defaultValue, s} = getSNameValue(firstArgument)
  if (!(value instanceof RegExp)) return s.text = 'not regular expression'
  s.properties[name] = value
}

export function getArrayOfString(firstArgument, defaultValue) {
  const {name, value = defaultValue, s} = getSNameValue(firstArgument)
  if (!Array.isArray(value)) return s.text = 'not array'
  for (let [index, aValue] of value.entries()) {
    const vt = typeof aValue
    if (vt !== 'string') return s.text = `index#${index} not string: type: ${vt}`
  }
  s.properties[name] = value
}

export function getPortNumber(firstArgument, defaultValue) {
  const {name, value = defaultValue, s} = getSNameValue(firstArgument)
  const port = +value
  if (!(port > 0) || !(port <= 65535)) return s.text = `not number 1 -  65535`
  s.properties[name] = port
}

export function getTimeval(firstArgument, defaultValue) {
  const {name, value = defaultValue, s} = getSNameValue(firstArgument)
  const timeval = +value
  if (!(timeval > 0)) return s.text = `bad timeval: type: ${typeof timeval}`
  s.properties[name] = timeval
}

export function getFn(firstArgument, defaultValue) {
  const {name, value = defaultValue, s} = getSNameValue(firstArgument)
  const ft = typeof value
  if (ft !== 'function') return s.text = `not function: type: ${ft}`
  s.properties[name] = value
}

function getSNameValue(firstArgument) {
  if (!firstArgument) throw new Error(`${m}: first argument not object`)
  const {s} = firstArgument
  if (!s) throw new Error(`${m}: first argument s property null`)
  const properties = Object.keys(Object(firstArgument)).filter(property => property !== 's')
  if (properties.length !== 1) throw new Error(`${m} first argument has more than 1 property other than s`)
  const name = properties[0]
  const value = firstArgument[name]
  if (!s.properties) s.properties = {}
  return {name, value, s}
}

/*
if debug is true, and thisValue is instantiated by const (ie. the class is not being extended),
then does log of inspection of dataValue or thisValue
*/
export function classLogger(thisValue, constr, dataValue) {
  const {debug, constructor, m: thisM} = thisValue
  dataValue === undefined && (dataValue = thisValue)
  debug && constructor === constr && console.log(`${thisM} constructor: ${util.inspect(dataValue, {colors: true, depth: null})}`)
}

