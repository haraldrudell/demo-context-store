/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export function throwWithMethod(e, method) {
  console.error(`${method}:`)
  throw Object.assign(e, {method})
}
