/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'
import webpack from 'webpack'
import eslintFormatter from 'react-dev-utils/eslintFormatter'
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin'
import fs from 'fs'
import getClientEnvironment from './env'

const env = getClientEnvironment('')
const matchResult = String(process.version).match(/^v([0-9]+)/)
const num = Number(matchResult && matchResult[1])
const nodeMajorVersion = num > 0 ? num : 0 // 8, default 0

export default (paths) => ({
  bail: true,
  devtool: 'source-map',
  target: 'node',
  entry: paths.entry,
  output: {path: paths.appBuild},
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      paths.nodePath.split(path.delimiter).filter(Boolean)
    ),
    extensions: ['.js'],
    plugins: [
      new ModuleScopePlugin(paths.appSrc),
    ],
  },
  module: {
    strictExportPresence: true,
    nonsense: console.log('config, __filename'),
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          compact: false,
          presets: [99].concat(nodeMajorVersion >= 8
              ? require.resolve('babel-preset-node8') // more efficient than env somehow
              : [[require.resolve('babel-preset-env'), {targets: {node: 'current'}}],
                require.resolve('babel-plugin-transform-class-properties'),])
            .push(
              require.resolve('babel-plugin-transform-object-rest-spread'),
            ),
          plugins: [
            'transform-runtime',
          ],
          },
      },
    ],
  },
  plugins: [
    function() {
      this.plugin('done', () => {
        try {
          fs.mkdirSync(paths.appBin)
        } catch (e) {}
        const s = fs.createWriteStream(paths.appBinExecutable)
        s.write('#!/usr/bin/env node\n', e => {
          fs.createReadStream(paths.appBuildJs).pipe(s)
            .on('finish', () => {
              fs.chmodSync(paths.appBinExecutable, '755')
              console.log(path.relative(paths.appDirectory, paths.appBinExecutable))
            })
        })
      })
    },
    new webpack.DefinePlugin(env.stringified),
  ],
})
