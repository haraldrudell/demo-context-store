/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { PureComponent } from 'react'
import { Store, connect } from 'allstore'
import { BrowserStore } from './store'
import { send } from './ipc'
import { listenToElectron, getChildList } from './ipcrx'

const store = new BrowserStore().setSessions(getChildList())
listenToElectron()

export default () =>
  <Store store={store}>
    <BookMarks />
    <URLInput />
    <SessionSelector />
  </Store>

class URLInput extends PureComponent {
  state = {url: 'https://google.com'}
  keyAction = e => this.setState({url: e.target.value})
  goAction = e => sendUrl(this.state.url)
  openAction = e => send('open', {url: this.state.url})
  render() {
    return <Store store={store}>
      <SessionSelector />
      <input onChange={this.keyAction} value={this.state.url} />
      <button onClick={this.goAction}>GO</button>
      <button onClick={this.openAction}>Open</button>
      </Store>
  }
}

const sendUrl = url => {
  const id = store.getActive()
  if (!id) return
  send('url', {id, url})
}

const urls = ['https://hire.surge.sh', 'https://google.com']
  .map(url => ({url, fn: e => sendUrl(url)}))
const BookMarks = () => <>{urls.map(({url, fn}, i) => <button key={i} onClick={fn}>{url}</button>)}</>

const selectAction = e => console.log('selectAction', e.target.value) + store.setActive(e.target.value).notify()
const SessionSelector = connect(store.sessionsSelector)(({ids, active}) =>
  <>{ids.size}:&emsp;
  <select value={active} onSelect={selectAction}>{ids.map(id =>
    <option key={id} value={id}>{id}</option>)}
  </select></>)
