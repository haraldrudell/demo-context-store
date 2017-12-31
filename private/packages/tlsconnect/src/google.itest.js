/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import TlsConnector from './TlsConnector'
test('Connect to https://google.com', async () => {
  await new TlsConnector({debug: true}).verify('https://google.com')
})
