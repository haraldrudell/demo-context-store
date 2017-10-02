/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import babel from 'rollup-plugin-babel'

export default {
  input: '0-helloworld/helloworld.js',
  output: [{file: `0-helloworld/helloworld-cjs.js`, format: 'cjs'}],
  //external
  plugins: [
    babel({
      babelrc: false,
    }),
  ]
}
