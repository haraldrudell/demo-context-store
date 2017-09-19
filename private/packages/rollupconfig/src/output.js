/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default function getRollupOutput({main, module}) {
  const output = []
  if (main) output.push({file: main, format: 'cjs'})
  if (module) output.push({file: module, format: 'es'})
  return output
}
