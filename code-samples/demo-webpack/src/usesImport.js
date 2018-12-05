/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import path from 'path'

console.log('src/usesImport.js exporting…')

export default function display() {
  console.log('src/usesImport.js typeof imported path:', typeof path)
}
