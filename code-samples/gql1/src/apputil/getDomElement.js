/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export function getDomElement(id, reason = 'manipulation') {
  const domElement = document.getElementById(String(id))
  if (domElement == null) throw new Error(`Failed to find html element with id '${id}' for ${reason}`)
  return domElement
}
