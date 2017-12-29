/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EmailVerifier from './EmailVerifier'
import pjson from '../package.json'

test('Email parse should work', () => {
  const input = 'president@whitehouse.gov'
  const expected = {address: 'president@whitehouse.gov', domain: 'whitehouse.gov'}
  const actual = new EmailVerifier().parse(input)
  expect(actual).toEqual(expected)
})
