/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
if (typeof window === undefined || typeof Object(window).require !== 'function') throw new Error('React does not have window.require from Electron')
const { ipcRenderer } = window.require('electron')

export function getSessions() {
  return ipcRenderer.sendSync('sessions')
}

export function setListener(e, fn) {
  if (typeof fn !== 'function') throw new Error('ipc.setListener listener not function')
  ipcRenderer.on(e, (ev, arg) => console.log(`React receive ${e}`, arg) + fn(arg))
}

let reactId = 0
export function send(e, o) {
  if (!e || typeof e !== 'string') throw new Error('send: bad event')
  if (o !== undefined && typeof o !== 'object') throw new Error('send: bad data object')
  const data = {...o, reactId}
  reactId++
  console.log(`React send ${e}`, data)
  ipcRenderer.send(e, data)
}
//const fs = electron.remote.require('fs')
