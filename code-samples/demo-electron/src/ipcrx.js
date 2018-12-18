/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { getStore } from 'allstore'
import { setListener, getSessions } from './ipc'

export function listenToElectron() {
  setListener('new', addSession)
  setListener('remove', delSession)
}

export function getChildList() {
  const children = Object(getSessions())
  return Object.keys(children).sort().map(id => children[id])
}

function addSession({id}) {
  getStore().addSession({id}).notify()
}

function delSession({id}) {
  getStore().delSession(id).notify()
}
