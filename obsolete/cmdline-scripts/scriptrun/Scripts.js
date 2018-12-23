import Build from '../scripts/Build'
import Clean from '../scripts/Clean'

export default class Scripts {
  async run(args) {
    if (!Array.isArray(args)) throw new Error('Scripts arg not array')
    const script = args[0]
    const construct =
      script === 'Build' && Build ||
      script === 'Clean' && Clean
    if (typeof construct !== 'function') throw new Error(`Scripts unknown script command: ${args.join(' ')}`)
    return new construct().run(args.slice(1))
  }
}
