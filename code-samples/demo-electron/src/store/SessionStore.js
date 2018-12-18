/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { PlainStore } from 'allstore'
import { OrderedMap, Map } from 'immutable'

export default class SessionStore extends PlainStore {
  makeId = id => String(id)

  setActive = id => (this.state.active = this.makeId(id)) & 0 || this
  getActive = () => this.state.sessions.get(this.state.active) && this.state.active
  activeSelector = ({active}) => ({active})
  getActiveSession = () => this.getSession(this.state.active)

  setSessions(list) {
    let sessions
    if (list !== undefined) {
      if (!Array.isArray(list)) throw new Error('SessionStore.setSessions: list not array')
      sessions = OrderedMap(list.map((child, i) => {
        const id = this.makeId((child = Object(child)).id)
        if (!id) throw new Error(`setSessions bad id at index#${i}`)
        return [id, Map(child)]
      }))
    } else sessions = OrderedMap()
    this.state.sessions = sessions
    return this
  }
  addSession(s) {
    const state = this.getState()
    const {active, sessions: s0} = state
    const id = this.makeId((s = Object(s)).id)
    if (!id) throw new Error('store.addSession: bad id')
    const session = Map(s)
    console.log('store.addSession id:', id, 'session:', session.toJS(), state.sessions.toJS())
    const sessions = state.sessions = s0.set(id, session)
    if (active === undefined || !sessions.get(active)) state.active = id
    console.log('after active:', state.active, 'sessions:', state.sessions.toJS())
    return this
  }
  delSession = s => this.state.sessions = this.state.sessions.delete(Object(s).id) && this
  getSession = id => (this.state.sessions || Map()).get(id)
  sessionsSelector = ({sessions, active}) => ({ids: sessions.keySeq(), active})
}
