/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/

/*
classRunner(classOptions)
- if classOptions is a function, it is invoked with await and is expected to return classOptions
classOptions: {
  construct: the constructor used for instantiation: new (options, errorHandler)
  options: argument to the constructor, second argument is errorHandler
  debug === false: errorhandler should not print stack traces
  errorHandler: optional function(e)
  run: string function that should be executed with await on the instance, falsey for no function
  - by default await instance.run(runOptions, errorHandler) is invoked
  runOptions: use this argument instead of options for instance.run()
}
*/
export default classOptions => classRunner(classOptions).catch(errorHandler)

const m = 'classRunner'
let printStackTraces

async function classRunner(classOptions, eh) {
  // ensure we have options
  if (typeof classOptions === 'function' && !eh) classOptions = await classOptions()
  if (!classOptions) classOptions = false

  // process .errorhandler into eh
  if (!eh) {
    if (typeof (eh = classOptions.errorhandler) === 'function') return classRunner(classOptions, eh).catch(eh)
    eh = errorHandler
  }

  // extract classOptions
  const {construct, options, debug, run} = classOptions
  const {runOptions = options} = classOptions
  printStackTraces = debug !== false

  // instantiate
  const ct = typeof construct
  if (ct !== 'function') throw new Error(`${m}: construct argument not function: ${ct}`)
  const instance = new construct(options, eh)

  // invoke
  const nameToUse = run !== undefined ? run : 'run'
  if (nameToUse) { // we should invoke instance.nameToUse()
    const t = typeof instance[nameToUse]
    if (t !== 'function') throw new Error(`${m}: instance.${nameToUse} not function: ${t}`)
  }

  return nameToUse
    ? instance[nameToUse](runOptions, eh)
    : instance
}

export function errorHandler(e) {
  if (printStackTraces) console.error(`${m}.errorHandler:`)
  if (!(e instanceof Error)) e = new Error(`Error value: ${typeof e} ${e}`)
  console.error(printStackTraces ? e : e.message)
  process.exit(1)
}
