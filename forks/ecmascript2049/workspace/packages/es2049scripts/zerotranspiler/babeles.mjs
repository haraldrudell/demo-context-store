/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import o from './babel85'
o.presets[0][1].modules = false // @babel/preset-env: transpile kee;piung ECMAScript modules
export default o
