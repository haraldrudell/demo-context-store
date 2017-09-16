/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
class Process {
  static processData = {}

  static instantiate = args => (async () => {

    // flags to ignore if import and not a command-line invocation
    const options = args || {}
    if (options.hasOwnProperty('require') &&
      (!options.require || options.require.main !== options.module))
      return

    // global error handlers
    const pd = Process.processData
    if (!options.allowUncaught && !pd.uncaughtHandler)
      process.on('uncaughtException', (pd.uncaughtHandler = Process.uncaughtException))
    if (!options.allowReject && !pd.rejectHandler)
      process.on('unhandledRejection', (pd.rejectHandler = Process.unhandledRejection))
    pd.errorHandler = Process.errorHandler

    // hooks prior to object construction
    if (typeof options.fn === 'function') options.fn(options, pd)
    if (typeof options.asyncFn === 'function') await options.asyncFn(options, pd)

    // construct
    const construct = typeof options === 'function' ? options : options.construct
    if (typeof construct !== 'function') throw new Error('No constructor: options or options.construct not function')
    const instance = new construct(options.options, pd)

    // invoke methods
    const method = String(options.method || '')
    if (method) {
      if (typeof instance[method] !== 'function') throw new Error(`method ${method} is not function`)
      instance[method](options.methodArg, pd)
    }
    const asyncMethod = String(options.async || '')
    if (asyncMethod) {
      if (typeof instance[asyncMethod] !== 'function') throw new Error(`method ${asyncMethod} is not function`)
      await instance[asyncMethod](options.asyncArg, pd)
    }
  })().catch(Process.errorHandler)

  static uncaughtException = e => Process.exit(e, 'uncaughtException')
  static errorHandler = e => Process.exit(e, 'errorHandler')
  static unhandledRejection = e => Process.exit(e, 'unhandledRejection')

  static exit(e, message) {
    console.error(`${message}:`)
    console.error(e)
    console.error(new Error('Process.errorHandler invocation'))
    process.exit(1)
  }
}

export default Process.instantiate
