/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export function getDomElement(id, reason = 'manipulation') {
  const domElement = document.getElementById(String(id))
  if (domElement == null) throw new Error(`Failed to find html element with id '${id}' for ${reason}`)
  return domElement
}
