/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import * as url from 'url' // 180430 v9.10.1 named exports do not work. Only named exports
const {URL, parse} = url

export function getUrlObject({address, port}) {
  Object.assign(new URL(), {port, hostname: address})
}

export function parseUrl(textUrl) {
  const urlObject = parse(textUrl)
  const hasProtocol = urlObject.protocol && !String(urlObject.protocol).slice(0, -1).replace(/[a-z0-9]/, '')
  if (hasProtocol) return {hasProtocol, urlObject}
  const url1 = parse(`http://${textUrl}`)
  url1.protocol = null
  url1.slashes = false
  return {hasProtocol, urlObject: url1}
}

export function isAnyPort(p) {
  p = +p
  return !isNaN(p) && p === 0
}

export function isValidPort(p) {
  p = +p
  return p >= 1 && p <= 65535 && Number.isInteger(p) && p || false
}

export function getSocketAddress(urlObject) {
  const {hostname: address, port} = urlObject
  return composeAddressPort({address, port})
}

export function composeAddressPort({address, port}) {
  return `${address}:${port}`
}
