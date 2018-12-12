/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {app, BrowserWindow, ipcMain } from 'electron'

const layout = {
  url: 'http://localhost:3000',
  box: {x: 0, y: 100, width: 800, height: 500},
  viewUrl: 'https://hire.surge.sh',
}

const createWindow = () => Window.ensureWindow(layout)
app.on('ready', createWindow)
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
app.on('activate', createWindow)

class Window {
  constructor(layout) {
    const {size, url, box, viewUrl} = Object(layout)
    Object.assign(this, {size, url, box, viewUrl})
    ipcMain.on('url', (event, url) => this.navigate(url))
  }

  load() {
    const {size, url, box, viewUrl} = this

    const parent = this.window = new BrowserWindow()
      .once('closed', () => this.window = null)
    parent.loadURL(url) // ReactJS

    // view at bottom
    const child = new BrowserWindow({ parent })
    console.log('loadURL', child.loadURL('https://hire.surge.sh'))
  }

  navigate(url) {
    return this.view && this.view.webContents.loadURL(url)
  }

  static ensureWindow = layout => !Window.w && (Window.w = new Window(layout)).load()
}
