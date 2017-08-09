import instantiate from './util/Process'
import paths from './paths'
import fs from 'fs-extra'

export default class Clean {
  async run() {
    await fs.remove(paths.appBuild)
  }
}

instantiate({
  construct: Clean,
  async: 'run',
  require: typeof require !== 'undefined' && require,
  module: typeof module !== 'undefined' && module,
})
