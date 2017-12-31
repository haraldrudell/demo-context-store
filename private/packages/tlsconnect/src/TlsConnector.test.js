/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import TlsConnector from './TlsConnector'

describe('TlsConnector.parse', () => {
  test('Plain host', () => {
    const t = new TlsConnector()
    const expected = {host: 'x:443', hostname: 'x', port: '443'}
    const actual = t.parse(expected.hostname)
    expect(actual).toEqual(expected)
  })
  test('Plain with port', () => {
    const t = new TlsConnector()
    const expected = {host: 'x:443', hostname: 'x', port: '443'}
    const actual = t.parse(expected.host)
    expect(actual).toEqual(expected)
  })
  test('Full', () => {
    const t = new TlsConnector()
    const expected = {host: 'x:443', hostname: 'x', port: '443'}
    const actual = t.parse('https://' + expected.host)
    expect(actual).toEqual(expected)
  })
})
