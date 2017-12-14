'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var autoprefixer = _interopDefault(require('autoprefixer'));
var CaseSensitivePathsPlugin = _interopDefault(require('case-sensitive-paths-webpack-plugin'));
var eslintFormatter = _interopDefault(require('react-dev-utils/eslintFormatter'));
var HtmlWebpackPlugin = _interopDefault(require('html-webpack-plugin'));
var InterpolateHtmlPlugin = _interopDefault(require('react-dev-utils/InterpolateHtmlPlugin'));
var ModuleScopePlugin = _interopDefault(require('react-dev-utils/ModuleScopePlugin'));
var WatchMissingNodeModulesPlugin = _interopDefault(require('react-dev-utils/WatchMissingNodeModulesPlugin'));
var webpack = _interopDefault(require('webpack'));
var path = _interopDefault(require('path'));

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
const outputFilename = 'build/harness.js';

const paths = {
  appSrc: path.resolve('src'),
};
Object.assign(paths, {
  appHtml: path.resolve(path.join('public', 'index.html')),
  appIndexJs: path.resolve(paths.appSrc, 'client.js'),
  appNodeModules: path.resolve('node_modules'),
  appPackageJson: path.resolve('package.json'),
});

/* sample raw value from CreateReact App:
{"raw":{"NODE_ENV":"development","PUBLIC_URL":""},"stringified":{"process.env":{│
  "NODE_ENV":"\"development\"","PUBLIC_URL":"\"\""}}}
*/
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PUBLIC_URL: publicUrl,
      }
    );
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env
    }, {}),
  };

  return { raw, stringified }
}
const env = getClientEnvironment();

const environment = env.raw.NODE_ENV; // certain to be set
if (!process.env.BABEL_ENV) process.env.BABEL_ENV = environment;
if (!process.env.NODE_ENV) process.env.NODE_ENV = environment;

var webpack_config = { // from react-scripts@1.0.17
  devtool: 'cheap-module-source-map',
  entry: [
    paths.appIndexJs,
  ],
  output: {
    pathinfo: true,
    filename: outputFilename,
    devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('module_override'),
      'node_modules',
      paths.appNodeModules,
    ],
    extensions: ['.js', '.json', '.css'],
    plugins: [
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
            },
          },
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-import'),
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
            ],
          },
          {
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: {
    hints: false,
  },
};

module.exports = webpack_config;
