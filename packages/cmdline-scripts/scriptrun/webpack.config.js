/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'
import webpack from 'webpack'
import eslintFormatter from 'react-dev-utils/eslintFormatter'
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin'

const matchResult = String(process.version).match(/^v([0-9]+)/)
const num = Number(matchResult && matchResult[1])
const nodeMajorVersion = num > 0 ? num : 0 // 8, default 0

console.log(__filename)

export default (paths) => ({
  bail: true,
  target: 'node',
  entry: paths.entry,
  output: {path: paths.appBuild},
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      paths.nodePath.split(path.delimiter).filter(Boolean)),
    extensions: ['.js'],
    plugins: [new ModuleScopePlugin(paths.appSrc)],
  },
  module: {
    strictExportPresence: true,
    rules: [{
      test: /\.js$/,
      enforce: 'pre',
      use: [{
        loader: require.resolve('eslint-loader'),
        options: {formatter: eslintFormatter},
      }],
      include: paths.appSrc,
    },{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: false,
        compact: false,
        presets: [].concat(
          nodeMajorVersion >= 8
            ? 'node8' // more efficient than env somehow
            : [['env', {targets: {node: 'current'}}]],
        ),
        plugins: [
          'transform-object-rest-spread',
          'transform-runtime',
        ].concat(nodeMajorVersion < 8 ? 'transform-class-properties' : [])
      },
    }],
  },
})
