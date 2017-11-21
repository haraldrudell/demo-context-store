/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: [{file: 'build/ple.js', format: 'cjs'}],
  plugins: [babel({
    babelrc: false, // unlike babel-node, rollup fails if an es2015 module transformer is included
    presets: [['env', {modules: false, targets: {node: '8'}}]],
    plugins: [
      'transform-async-generator-functions',
      'transform-class-properties',
      'transform-function-bind',
    ],
    include: '**/*.js',
    exclude: 'node_modules/**',
  })],
}
