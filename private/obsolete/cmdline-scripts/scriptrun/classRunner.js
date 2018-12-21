/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
let stackTrace = true

// get classRunner name into stack traces while arguments in-scope for async
export default function classRunner({construct, cArgs, args, stack}) {
  return (async () => {
    if (stack !== undefined) stackTrace = !!stack
    return new construct(cArgs, errorHandler).run(args)
  })().catch(errorHandler)
}

export function errorHandler(e) {
  console.error(e instanceof Error && !stackTrace ? e.message : e)
  process.exit(1)
}
