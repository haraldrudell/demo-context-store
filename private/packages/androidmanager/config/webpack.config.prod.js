/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import paths from './paths'
import getClientEnvironment from './env'

import path from 'path'
import webpack from 'webpack'
import eslintFormatter from 'react-dev-utils/eslintFormatter'
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin'
import fs from 'fs'

const env = getClientEnvironment('')

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

const contexts = {
  [path.join(require.resolve('adbkit'), '..')]: './src/',
  [path.join(require.resolve('adbkit-monkey'), '..')]: './src',
  [path.join(require.resolve('adbkit-logcat'), '..')]: './src',
}

export default {
  bail: true,
  devtool: 'source-map',
  entry: {[paths.entryName]: paths.appIndexJs},
  output: {
    path: paths.appBuild,
  },
  target: 'node',
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: ['.js'],
    plugins: [
      new ModuleScopePlugin(paths.appSrc),
    ],
  },
  externals: [(context, request, callback) => {
    const requestStart = contexts[context]
    if (requestStart && request.startsWith(requestStart))
      callback(null, request, 'commonjs')
    else callback()
  }],
  module: {
    strictExportPresence: true,
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
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          compact: false,
          presets: [
            'node8',
          ],
        },
      },
    ],
  },
  plugins: [
    function() {
      this.plugin('done', () => {
        try {
          fs.mkdirSync('./bin')
        } catch (e) {}
        const s = fs.createWriteStream('bin/androidmanager')
        s.write('#!/usr/bin/env node\n', e => {
          fs.createReadStream('build/androidmanager.js').pipe(s)
            .on('finish', () => fs.chmodSync('bin/androidmanager', '755'))
        })
      })
    },
    new webpack.DefinePlugin(env.stringified),
  ],
}
