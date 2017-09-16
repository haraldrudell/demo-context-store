/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Class from './Class'
import run from './classRunner'

run({construct: Class, args: process.argv.slice(2)})
