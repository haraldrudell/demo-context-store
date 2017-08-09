import instantiate from './util/Process'
import config from './webpack.config.prod'
import Clean from './Clean'

import webpack from 'webpack'

export default class Build {
  async run() {
    await new Clean().run()
    await this.compile()
  }

  async compile() {
    const stats = await new Promise((resolve, reject) => webpack(config, (err, stats) => !err ? resolve(stats) : reject(err)))
    console.log(stats.toString({colors: true}))
    if (stats.hasErrors()) throw new Error('Webpack errors')
    if (stats.hasWarnings())  throw new Error('Webpack warnings')
  }
}

instantiate({
  construct: Build,
  async: 'run',
  require: typeof require !== 'undefined' && require,
  module: typeof module !== 'undefined' && module,
})
