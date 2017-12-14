/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import path from 'path'

const inputDirectory = 'configes'
const outputDirectory = 'config'
const files = ['webpack.config.js', 'styleguide.config.js']



export default files.map((filename, index) => ({
    input: path.join(inputDirectory, filename),
    output: {
      file: path.join(outputDirectory, filename),
      format: 'cjs',
    },
    external: [
      'autoprefixer',
      'case-sensitive-paths-webpack-plugin',
      'html-webpack-plugin',
      'react-dev-utils/eslintFormatter',
      'react-dev-utils/InterpolateHtmlPlugin',
      'react-dev-utils/ModuleScopePlugin',
      'react-dev-utils/WatchMissingNodeModulesPlugin',
      'webpack',

      // Node.js
      'path',
    ]//.concat(index !== 1 ? [] : ['./webpack.config.js'])
  }))
