export default {
  bail: true,
  devtool: 'source-map',
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
        exclude: /node_modules/,
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
}