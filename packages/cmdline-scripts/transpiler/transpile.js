import wpConfig from './webpack.config.js'

import webpack from 'webpack'

export default class Transpiler {
  async run(from, to) {
    const wpNow = {...wpConfig}
    return new Promise((resolve, reject) => webpack(wpNow)
    )
  }
}

