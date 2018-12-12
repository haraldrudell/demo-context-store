/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { PureComponent } from 'react'

//const req = Object(window).require
const electron = window.require('electron')
//if (typeof req !== 'function') throw new Error('Electron window.require not present')

//const electron = req('electron')
const fs = electron.remote.require('fs')
const ipcRenderer = electron.ipcRenderer
console.log('electron', electron, 'fs', fs, 'ipcRenderer', ipcRenderer)

const urls = ['https://hire.surge.sh', 'https://google.com']
  .map(url => ({url, fn: e => console.log('url', typeof url, url) + ipcRenderer.send('url', url)}))

export default () =>
  <div>
    {urls.map(({url, fn}) => <button onClick={fn}>{url}</button>)}
    <Input />
  </div>

class Input extends PureComponent {
  state = {url: 'https://google.com'}
  keyAction = e => this.setState({url: e.target.value})
  goAction = e => ipcRenderer.send('url', this.state.url)
  render() {
    return <>
      <input onChange={this.keyAction} value={this.state.url} />
      <button onClick={this.goAction}>GO</button>
    </>
  }
}
