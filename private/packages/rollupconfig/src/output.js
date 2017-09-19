/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export function getRollupOutput({main, module}) {
  const output = []
  if (main) output.push({file: main, format: 'cjs'})
  if (module) output.push({file: module, format: 'es'})
  return output.length ? output : undefined
}

export function deleteUndefined(config) {
  if (config) for (let property of Object.keys(config))
    if (config[property] === undefined) delete config[property]
}
