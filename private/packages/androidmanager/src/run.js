import AndroidManager from './AndroidManager'
import instantiate from './Process'

instantiate({
  construct: AndroidManager,
  async: 'run',
})
