/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export function writeBs(s) {
  process.stdout.write(`\x20\x20${s}${'\b'.repeat(String(s).length + 2)}`)
}
