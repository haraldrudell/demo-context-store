/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import babel from 'rollup-plugin-babel'

export default {
  input: '1-es2017/es2017.js',
  output: [{file: `1-es2017/es2017-cjs.js`, format: 'cjs'}],
  external: ['dgram', 'events', 'net', 'os', 'util'],
  plugins: [
    babel({
      babelrc: false,
      plugins: [
        'babel-plugin-transform-object-rest-spread',
      ],
    }),
  ],
}
