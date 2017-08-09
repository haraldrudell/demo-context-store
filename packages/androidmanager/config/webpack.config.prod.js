import paths from './paths'
import getClientEnvironment from './env'

import path from 'path'
import webpack from 'webpack'
import eslintFormatter from 'react-dev-utils/eslintFormatter'
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin'

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
//          plugins: [
//            'transform-remove-strict-mode',
//          ],
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(env.stringified),
  ],
}
