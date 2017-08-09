class Process {
  static instantiate = args => (async () => {
    const options = args || false

    if (options.hasOwnProperty('require') &&
      (!options.require ||
        options.require.main !== options.module)) return

    const construct = typeof options === 'function' ? options : options.construct
    if (typeof construct !== 'function') throw new Error('No constructor: options or options.construct not function')
    const instance = new construct(options.options)

    const method = String(options.method || '')
    if (method) {
      if (typeof instance[method] !== 'function') throw new Error(`method ${method} is not function`)
      instance[method](options.methodArg)
    }

    const asyncMethod = String(options.async || '')
    if (asyncMethod) {
      if (typeof instance[asyncMethod] !== 'function') throw new Error(`method ${asyncMethod} is not function`)
      await instance[asyncMethod](options.asyncArg)
    }
  })().catch(Process.errorHandler)

  static async exit() {
    process.exit()
  }

  static errorHandler(e) {
    console.error('Process.errorHandler')
    if (!(e instanceof Error)) e = new Error(util.format('Error was value: ', e))
    console.error(e)
    console.error(new Error('Process.errorHandler invokation').stack)
    process.exit(1)
  }
}

export default Process.instantiate
